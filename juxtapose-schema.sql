CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    password TEXT NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    full_name TEXT NOT NULL,
    photo_url TEXT,
    team TEXT NOT NULL,
    position TEXT NOT NULL,
    player_id INTEGER NOT NULL
)

CREATE TABLE roster (
    user_id INTEGER 
        FOREIGN KEY (users_id) REFERENCES users(id),
    player_id INTEGER
        FOREIGN KEY (player_id) REFERENCES players(player_id),
    PRIMARY KEY (user_id, player_id),
)