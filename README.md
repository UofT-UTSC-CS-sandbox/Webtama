WEBSITE: webtama.works

Please use this repository for project files.

- Do not publish your project code to a public repository.
- You must only write your project proposal in this `README.md`

This README.md is to be replaced by your project proposal:

- Project Ideas are ranked in order of team preference by vote

- Project title and team name

Project Title: Webtama

Team name: JJK

- Your focus (frontend focused or backend focused)

N/A

- Team members with student numbers

  - Jason Dai 1005231189

  - Jeffrey He 1007955438

  - Keia Rahmati 1005502252

- Description of the web application

This web application will allow users to play the game of onitama, on a 3d created board along with customizable imagery. This will utilize p2p connection to play online games and allow for matchmaking. It will include chatting features and allow for payment of cosmetics through the stripe API.

- What complexity points will this project contain

  - User Authentication

    - 2 cp - Auth0 or similar authentication

    - 2 cp - Email Delivery, API, marketing Servce | SendGrid

  - Web Audio, sounds for game and similar features

    - 1 cp - Web Audio API - Web APIs | MDN

    - 2 cp - Stripe payment for buying cosmetics

  - P2P connection, matchmaking, and chatting

    - 2 p - peerjs, peer2peer connection for rooms

    - 1/2 cp - Communication API, allow for chatting/controlling board through sending SMS etc. | Twilo (2 cp for >2 people chat)

    - 2cp - matchmaking API | Socket.io?

- (optional) What complexity points will be attempted as bonus for the challenge factor

  - Sharedb or similar database for handling global leaderboard or players online for matchmaking etc.

    - 2 cp share/sharedb

  - 2 cp - three.js for displaying a 3d game scene

  - 3 cp - One of the augmented reality APIs, allow for playing the game by projecting the game board through a camera

  - 1 cp - OpenAI API used for generating images which could be implemented in game cosmetically

  - 3 cp - Push API - Web APIs | MDN

- What you aim to complete for the alpha version, beta version, and final version

alpha:

- Develop front-end UI and connect to back-end
- Ensure User Authentication and Authorization are working
  - utilization of email/sms authentication and push notifications
- Make sure that informational databases are displayed and functioning (e.g. moves, pieces)
- Work on connecting users to a game room, user is able to connect to another user for a game through p2p connection

beta:

- Add or fix any functionality missing from alpha version
- Create a lobby system to create and join different synchronous game rooms
- Add player MMR
- Implement basic foundation of Sendgrid, Twilio for user communication
- Implement Web Audio API for sound effects on game moves
- pieces are moves in accordance with game, click/SMS/etc. used to connect and move pieces

final:

- Add or fix any functionality missing from beta version
- user is able to buy cosmetics through the stripe system and items are displayed on game
- work on optional features such as displaying board in 3d
- Ruleset is added to limit players to legal moves
- App is deployed
  -Online matchmaking should then be working
  -Players should be able to communicate using twillo
- work on optional features such as displaying board in 3d
