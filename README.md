# sdo
SDO - Social Deception Online
This is a self contained environment for creating, playing, and admining social deception games online, such as Werewolf and Blood on the Clocktower
To install:
Pre-requisites:
  NPM Latest
  Nodejs Latest
  Webserver
  Open relevant ports
1) Clone the repository
2) cd sdo
3) npm install
4) Copy env_sample file to .env and set configuration options
5) Run npm start
6) site will be available at "serverIPaddress:port" (ex: localhost:3000)

This project is currently in development hell with lots TODO. Most of the back end functionality exists including:
  Login/Logout with persistent cookie
  Feed with comments
  Chat rooms
  Multi-game selection
  The main site components use the HTTP/S protocol. However, the feed and chats use WebSockets.
There is sample data contined in test.db, which is an SQLITE database. Ultimately, the idea is to use MariaDB as the backend.
MVP TODO
  Vanilla werewolf game (2 wolves, 1 seer, and some villagers)
  Manual addition of user accounts with junk passwords
  Admin interface
    Create new game
      Create players with roles
    Count votes
    Add/Remove players from chats
  Player interface
    Chat
      Read/send
    Feed/Day post
      Read/comment
 
