console.log("Loading bot...");

// Load required modules
const SteamUser = require("steam-user");
const SteamTotp = require("steam-totp");
const Gamedig = require('gamedig');
const cfg = require("./cfg.json");
const fs = require('fs');
var util = require('util');

const client = new SteamUser();

var consoleBlack = "\x1b[30m%s\x1b[0m";
var consoleRed = "\x1b[31m%s\x1b[0m";
var consoleGreen = "\x1b[32m%s\x1b[0m";
var consoleYellow = "\x1b[33m%s\x1b[0m";
var consoleBlue = "\x1b[34m%s\x1b[0m";
var consoleMagenta = "\x1b[35m%s\x1b[0m";
var consoleCyan = "\x1b[36m%s\x1b[0m";
var consoleWhite = "\x1b[37m%s\x1b[0m";
var lastUser;

var greetings = [
    "hi",
    "hello",
    "hey",
]
var commands = [
    "dump"
];

const logOnOptions = {
    accountName: cfg.username,
    password: cfg.password,
    twoFactorCode: SteamTotp.generateAuthCode(cfg.sharedSecret)
};

// Log the bot in
client.logOn(logOnOptions);

client.on("loggedOn", () => {

    console.log(consoleGreen, "\nBot logged in successfully!\n");

    client.setPersona(SteamUser.Steam.EPersonaState.Online);
    client.gamesPlayed(cfg.gameToPlay);

});

// Check how many friends are online
client.on("friendsList", function() {

    console.log(Object.keys(client.myFriends).length + " Friends online.");

}); 

// Check if we have any messages
client.on("offlineMessages", function(count, friends) {

    if (friends != null) {

        for (var i = 0; i < friends.length; i++) {

            var user = friends[i];

            client.getChatHistory([user], function(success, messages)  {

                console.log(consoleYellow, "\nUnread messages from " + user + ":\n")

                for (var j = 0; j < messages.length; j++) {

                    if (messages[j].unread) {
                        
                        console.log(user + " @ " + messages[j].timestamp.toLocaleString() + "\n" + messages[j].message + "\n");

                    }

                }
    
            });

        }

    }

});

// Handle messages from friends
client.on("friendMessage", function(steamID, message) {
    
    var msg = "";

    if (steamID == "76561198058950254") {
        console.log(message);
        (lastUser == null) ? console.log("No last user to message") : client.chatMessage(lastUser, "[GORE]: " + message);
    }
    else {
        client.getPersonas([steamID], function(personas) {
            var persona = personas[steamID];
            var name = persona ? persona.player_name : ("[" + steamID + "]");
            client.chatMessage(cfg.ownerSteamID, "[" + name + "]: " + message);
            console.log("[" + name + "]: " + message);
            lastUser = steamID;
        });
    }   

    switch(message) {
        case greetings[0]:
        case greetings[1]:
        case greetings[2]:
            client.chatMessage(steamID, "Hello");
            break;  

        case "helpppppppppppp":
            for (var i = 0; i < commands.length; i++) {
                client.chatMessage(steamID, "'" + commands[i] + "',\n");
            }  
            break;

        default: 
            break;
    }

}); 

// Handling friend requests
client.on('friendRelationship', function(sid, relationship) {

    console.log("Friend request from SteamID: " + sid);

    if (relationship == SteamUser.EFriendRelationship.RequestRecipient && cfg.autoAccept == "true") {

        client.addFriend(sid);
        console.log("Accepted friend request from SteamID: " + sid);
        client.chatMessage(cfg.ownerSteamID, "[" + sid + "] has sent a friend request to me");
        client.chatMessage(sid, "Hello, to see a list of commands type help")

    }

});
