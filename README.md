## Juxtapose
---
Juxtapose is a decision aid for fantasy football players. Users are able to enter a player, specifically Wide Receiver, Running Back or Tight End they might be deciding on playing in an upcoming game. Using [FantasyData](https://www.fantasydata.com) we populate the following:
1. The WR/RB/TE you are deciding on, including their current stats.
2. The submitted players Quarterback, with stats that may impact your decision on who you play for the week.
3. The players opposing teams defense and their current stats.

## Project Goals 
--- 
Juxtapose is meant to be supplemental in Fantasy Football decision making. Stats are widely available for NFL players/teams but it's time consuming to gather comparisons or analysis for upcoming games with out surveying numerous sites. Our primary goal is to create a one click comparison to create a snapshot of upcoming games to support a confident decision. 

## User Demographic
--- 
Juxtapose is primarily targeted for Fantasy Football Players. You do not need to create, upload or connect a current league. This app is provided for a quick snapshot for users to help make a decision that can be played in other fantasy football apps like ESPN, Yahoo Fantasy, etc.

## Data
--- 
All stats are pulled from FantasyData's SportsDataAPI using Axios
- WR/RB/TE individual stats
- QB stats
- Defensive stats of the opposing team

## Tech Stack
--- 
- ### Front-end: 
    - React/React Router/Reactstrap
- ### Back-end: 
    - Node/Express

## Database Schema
--- 
DB is SQL using Postgres. There are two tables, Users and Players. User passwords are encrypted using BCrypt. Users will have a one-to-many relationship with Players as they can add/delete players from their roster.

![DB-Schema](https://user-images.githubusercontent.com/91156228/209449620-8726ef2d-3fc5-46f2-bec4-67ff751c3b78.png)


## User Flow
--- 
Juxtapose is a Single Page Application using React. Users will need to create an account which will enable them to not only submit players to aid in decision making, but also recreate their roster from their existing League for quick updates and comparisons.

![User Flow](https://user-images.githubusercontent.com/91156228/209449636-d9b215a1-83ac-40ac-80f9-54f8bfc7e40d.png)

