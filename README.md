# Epic Game of Awesomeness--Client Side
The Epic Game of Awesomeness is a text based, choose your own adventure style game with turn-based Dungeons and Dragons style combat.  The client-side portion of the game was built using React and the server-side was built using C#.NET, and SQLite.  To get started playing the game, follow the installation instructions for both the client-side and server-side repos.

### Playing the Game:
1. Create an account or log into an existing account.
2. Select an adventure to play, at launch the only adventure is "A Strange Request" but more will be available in v2.0!
3. Create a new character or select an existing character!  
*** When creating a new character, ensure that you provide a character name, select a class, and then select one of the two available profiel images! ***
4. Now you can play through the story! 
5. Combat-- When in a combat scenario, select an ability you want to attempt.  This will inistialize a combat phase.  Each phase consists of two dice rolls, the enemies, and your own.  If your roll is equal or greater than your enemies your attack is successful!  Immediately after your combat turn, the enemy has their own and the same rules apply.  
*** A Note on Healing: You cannot be healed above your maximum health (100).***

### Installing the Game:
1. Clone my repo on your machine.
2. From your terminal type ```npm install```
3. Make sure you have cloned and installed the Game API from: https://github.com/tgbowman/EpicGameOfAwesomenessAPI
4. Start running the API by typing ```dotnet run``` from the API's directory.
5. Then enter ```npm start``` from the clien-side directory.
6. Now you are ready to start playing the game!

