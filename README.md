Please use this repository for project files.

- Do not publish your project code to a public repository.
- You must only write your project proposal in this `README.md`

This README.md is to be replaced by your project proposal:
- Project Ideas are ranked in order of team preference by vote

# Project Idea #1

- Project title and team name

Project Title: Non Profit Patreon

Team name: JJK

- Your focus (frontend focused or backend focused)

N/A

- Team members with student numbers

  - Jason Dai 1005231189

  - Jeffrey He 1007955438

  - Keia Rahmati 1005502252

- Description of the web application

A patreon like collection of charity orgs that can be browsed by tags and donated/subbed to:

- What complexity points will this project contain

  - Stripe - 2

  - Auth0 - 1

  - SendGrid (email )- 1

  - Web Audio- 1

  - Facebook/twitter api’s For login and sharing

  - Google translate api

  - YouTube api -embedded videos

  - Google analytics

  - Google Ads

- (optional) What complexity points will be attempted as bonus for the challenge factor

  - Push Web API - 3


- What you aim to complete for the alpha version, beta version, and final version

alpha:
  - Develop front-end UI and connect to back-end
  - Ensure User Authentication and Authorization are working
  - Make sure that informational databases are displayed and functioning
  
beta:
  - Add or fix any functionality missing from alpha version
  - add google translation for french of pages
  - embedding of youtube vides for charities
  - displayal of google ads/analytics
  
final:
  - Add or fix any functionality missing from beta version
  - work on optional features 

# Project Idea #2

- Project title and team name

Project Title: Arcadium

Team name: JJK  (TBD)

- Your focus (frontend focused or backend focused)

N/A

- Team members with student numbers

  - Jason Dai 1005231189

  - Jeffrey He 1007955438

  - Keia Rahmati 1005502252

- Description of the web application

This web application will allow users to keep track of games they have played and plan on playing, as well as being able to view game titles and see other users reviews or discussion forums about the game. Accounts would be connected through email which would allow emails to be sent regarding new games, recommendations, etc. The games would be handled by a global database that kept track of global review score and details about each game, and each user would have a collection of games that would have additional attributes such as personal score, status (plan to play, playing, complete) and potentially others.

- What complexity points will this project contain

  * User Authentication

    * 2 cp - Auth0 or similar authentication

  * For notifications and/or verification, e.g. new games released, friend has finished a game, friend sent a message, new reply on discussion forum, etc.

    * 1 cp - Email Delivery, API, marketing Servce | SendGrid

    * 2 cp - SMS for verification or notifications | Twilo 

    * 3 cp - Push API - Web APIs | MDN

  * Web Audio, notification sounds, potentially sound effects from video games?

    * 1 cp - Web Audio API - Web APIs | MDN

  * Managing Personal/Global Database for games list

    * 2 cp share/sharedb

- (optional) What complexity points will be attempted as bonus for the challenge factor

  + 2 cp - Stripe payment for buying video games?

  + 2 cp - three.js not sure on this one, but 3d scenes seem interesting, especially in a game context

  + 3 cp - One of the augmented reality APIs, seems interesting for some of our other ideas more so than this one, 

- What you aim to complete for the alpha version, beta version, and final version

alpha:
  - Develop front-end UI and connect to back-end
  - Ensure User Authentication and Authorization are working
    - utilization of email/sms authentication and push notifications
  - Make sure that informational databases are displayed and functioning
  
beta:
  - Add or fix any functionality missing from alpha version
  - Enable user interaction with the site by adding games to own collection
  - user is able to mark their game collection with status, review score, and post discussion forums/text reviews
  - user can have a friend list of other users
    - chat functionality and notifications based on friend activity
  - notifications if game or similar games have been released, on sale, etc.
  
final:
  - Add or fix any functionality missing from beta version
  - work on optional features such as stripe payment
  
# Project Idea #3

- Project title and team name

Project Title: Onitama Plus

Team name: JJK  (TBD)

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
    
    - 1 cp - Email Delivery, API, marketing Servce | SendGrid

  - Web Audio, sounds for game and similar features

    - 1 cp - Web Audio API - Web APIs | MDN
    
    - 2 cp - Stripe payment for buying cosmetics
  
  - P2P connection, matchmaking, and chatting
  
    - 1 cp - peerjs, peer2peer connection
    
    - 2 cp - Communication API, includes voice and video | Twilo 
    
    - matchmaking API | ???

  - Sharedb or similar database for handling global leaderboard or players online for matchmaking etc.

    - 2 cp share/sharedb

- (optional) What complexity points will be attempted as bonus for the challenge factor

  - 2 cp - three.js for displaying a 3d game scene
  
  - 3 cp - One of the augmented reality APIs, allow for playing the game by projecting the game board through a camera

  - 2 cp - OpenAI API used for generating images which could be implemented in game cosmetically

  - 3 cp - Push API - Web APIs | MDN

- What you aim to complete for the alpha version, beta version, and final version

alpha:
  - Develop front-end UI and connect to back-end
  - Ensure User Authentication and Authorization are working
    - utilization of email/sms authentication and push notifications
  - Make sure that informational databases are displayed and functioning
  
beta:
  - Add or fix any functionality missing from alpha version
  - Enable user interaction with the site by starting a game and interacting with the board
  - user is able to connect to another user for a game through p2p connection
  - user is able to buy cosmetics through the stripe system and items are displayed on game
  - user is able to communicate with other user in the game
  - move cards for the game are served to user and handled properly
  
final:
  - Add or fix any functionality missing from beta version
  - work on optional features such as displaying board in 3d

