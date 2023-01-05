"use strict";

//STILL NEED TO ADD ROSTER CONNECTIONS

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

// Related functions for users


class User {
    //authenticate user with username, password

    //Returns {username, first_name, last_name, is_admin}

    //Throws unauthorized error if user not found or wrong password

    static async authenticate(username, password){
        //try to find user first
        const result = await db.query(
            `SELECT username,
                    password,
                    first_name AS "firstName",
                    last_name AS "lastName",
                    email,
                    is_admin AS "isAdmin"
            FROM users
            WHERE username = $1`,
            [username],
        );

        const user = result.rows[0];

        if (user) {
            //compare hashed password to a new hash from password
            const isValid = await bcrypt.compare(password, user.password);
            if(isValid === true){
                delete user.password;
                return user;
            }
        }

        throw new UnauthorizedError("Invalid username/password");
    }
        //Register user with data

        //Returns { username, firstName, lastName, isAdmin }

        //Throws BadRequestError on duplicates

        static async register(
            { username, password, firstName, lastName, isAdmin }) {
            const duplicateCheck = await db.query(
                `SELECT username
                FROM users
                WHERE username = $1`,
                [username],
            );

            if (duplicateCheck.rows[0]) {
                throw new BadRequestError(`Duplicate username: ${username}`);
            }

            const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

            const result = await db.query(
                `INSERT INTO users
                (username,
                    password,
                    first_name,
                    last_name,
                    is_admin)
                    VALUES ($1, $2, $3, $4, $5)
                    RETURNING username, first_name AS "firstName", last_name AS "lastName, is_admin AS "isAdmin`,
                    [
                        username,
                        hashedPassword,
                        firstName,
                        lastName,
                        isAdmin
                    ],
            );

            const user = result.rows[0];

            return user;
        }

            //Find all users
            //Returns [{username, first_name, last_name, is_admin}]
        static async findAll(){
            const result = await db.query(
                `SELECT username,
                    first_name AS "firstName",
                    last_name AS lastName,
                    is_admin AS "isAdmin
                FROM users
                ORDER BY username`,
            );

            return result.rows;
        }

        static async get(username){
            const userRes = await db.query(
                `SELECT username,
                        first_name AS "firstName",
                        last_name AS "lastName",
                        is_admin AS "isAdmin"
                FROM users
                WHERE username = $1`,
                [username]
            );

            const user = userRes.rows[0];

            if (!user) throw new NotFoundError(`No user: ${username}`);

            // ====>>> MIGHT BE SPOT FOR GETTING USERS ROSTER
        }

        /** Update user data with `data`.
         *
         * This is a "partial update" --- it's fine if data doesn't contain
         * all the fields; this only changes provided ones.
         *
         * Data can include:
         *   { firstName, lastName, password, email, isAdmin }
         *
         * Returns { username, firstName, lastName, email, isAdmin }
         *
         * Throws NotFoundError if not found.
         *
         * WARNING: this function can set a new password or make a user an admin.
         * Callers of this function must be certain they have validated inputs to this
         * or a serious security risks are opened.
         */

        static async update(username, data){
            if(data.password){
                data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
            }

            const { setCols, values } = sqlForPartialUpdate(
                data,
                {
                    firstName: "first_name",
                    lastName: "last_name",
                    isAdmin: "is_admin",
                });
            const usernameVarIdx = "$" + (values.length + 1);

            const querySql = `UPDATE users
                                SET ${setCols}
                                WHERE username = ${usernameVarIdx}
                                RETURNING username,
                                            first_name AS "firstName",
                                            last_name AS "lastName",
                                            is_admin AS "isAdmin"`;
            const result = await db.query(querySql, [...values, username]);
            const user = result.rows[0];

            if (!user) throw new NotFoundError(`No user: ${username}`);

            delete user.password;
            return user;
        }

        //Delete given user from database; returns undefined

        static async remove(username){
            let result = await db.query(
                `DELETE
                FROM users
                WHERE username = $1
                RETURNING username`,
                [username],
            );
            const user = result.rows[0];

            if (!user) throw new NotFoundError(`No user: ${username}`);
        }

        //ADD PLAYER TO USERS ROSTER??
        static async getRoster(user_id){
            let result = await db.query(
                `SELECT * FROM players
                WHERE user_id = $1
                RETURNING full_name AS "fullName",
                            photo_url AS "photoUrl",
                            team, position`,
                            [user_id]
            );
            const roster = result.rows;

            if (!roster) throw new NotFoundError("No roster saved");
        }

        static async addPlayerToRoster(user_id, player_id){
            let result = await db.query(
                `INSERT INTO players
                    (full_name,
                    player_id,
                    photo_url,
                    team,
                    position,
                    user_id)
                    VALUES ($1, $2, $3, $4, $5, $6)
                    WHERE user_id = user.id
                    RETURNING full_name AS "fullName",
                    player_id AS "playerId",
                    photo_url AS "photoUrl",
                    team, position, user_id as userId`,
                    [full_name,
                    player_id,
                    photo_url,
                    team,
                    position,
                    user_id]
            );
            const player = result.rows[0];
            
            if (!player) throw new NotFoundError(`${full_name} NOT successfully added`)
            return player;
        }

        static async viewPlayer(full_name){
            const playerRes = await db.query(
                `SELECT full_name as "fullName",
                        photo_url as "photoUrl",
                        team, position
                FROM players
                WHERE full_name = $1`,
                [full_name]
            );

            const player = playerRes.rows[0];

            if (!player) throw new NotFoundError(`No player: ${full_name}`);

            return player;
            // ====>>> MIGHT BE SPOT FOR GETTING USERS ROSTER
        }

        static async removePlayerFromRoster(full_name){
            const result = await db.query(
                `DELETE FROM players
                WHERE full_name = $1
                RETURNING full_name`,
                [full_name]
            )
            const playerRemoved = result.rows[0];

            if (!playerRemoved) throw new NotFoundError(`${full_name} not found or removed from roster`);
        }

}

module.exports = User;