console.log("Loading bot...");

const SteamUser = require("steam-user");
const SteamTotp = require("steam-totp");
const Gamedig = require('gamedig');
const cfg = require("./cfg.json");
const fs = require('fs');
var util = require('util');

const client = new SteamUser();

var lastUser = "";

var dbServers = [
    {ip: "79.137.78.241:27015", name: "Akod [Advanced]", players: ""},
    {ip: "137.74.170.69:27015", name: "Pandemic [Advanced]", players: ""},
    {ip: "176.57.142.80:27015", name: "Panda #19", players: ""},
    {ip: "193.192.59.191:27045", name: "Panda #04", players: ""},
    {ip: "85.10.231.142:27015", name: "STD", players: ""},
];

var commands = [
    "hi",
    "dump"
]

const logOnOptions = {
    accountName: cfg.username,
    password: cfg.password,
    twoFactorCode: SteamTotp.generateAuthCode(cfg.sharedSecret)
};

client.logOn(logOnOptions);

client.on("loggedOn", () => {
    console.log("Bot logged in.\n");
    client.setPersona(SteamUser.Steam.EPersonaState.Online);
    client.gamesPlayed("");
});

client.on("friendsList", function() {

    console.log(Object.keys(client.myFriends).length + " Friends online.");

}); 

client.on("friendMessage", function(steamID, message) {
    
    var msg = "";

    /*if (steamID == "76561198058950254") {
        client.chatMessage(lastUser, "[GORE]: " + message)
    }
    else {
        client.getPersonas([steamID], function(personas) {
            var persona = personas[steamID];
            var name = persona ? persona.player_name : ("[" + steamID + "]");
            client.chatMessage("76561198058950254", "[" + name + "]: " + message);
            console.log("[" + name + "]: " + message);
            lastUser = steamID;
        });
    }*/

    switch(message) {
        case commands[0]:
            client.chatMessage(steamID, "Hello");
            break;
        case commands[1]:   
            for (var i = 0; i < dbServers.length; i++) {
                msg = msg + "Server #" + i + ": " + dbServers[i].name + "\n";
            } 
            client.chatMessage(steamID, msg + "\n");
            break;
        case "helpppppppppppp":
            for (var i = 0; i < commands.length; i++) {
                client.chatMessage(steamID, "'" + commands[i] + "',\n");
            }  
            break;
        default: 
            //client.chatMessage(steamID, "Message logged.");
            break;
    }

});

client.on('friendRelationship', function(sid, relationship) {
    if (relationship == SteamUser.EFriendRelationship.RequestRecipient) {
        client.addFriend(sid);
        client.chatMessage("76561198058950254", "[" + sid + "] has sent a friend request to me");
        client.chatMessage(sid, "Hello")
    }
	console.log("Friend request from " + sid);
});



    /*
        // Gamedig Query
        Gamedig.query({
            type: 'tf2',
            host: '79.137.78.241',
            port: '27015'
        },
        function(e,state) {
            if(e) {
                console.log("Server is offline");
            }
            else {
                console.log(state);
                fs.writeFile("pastebin.txt", util.inspect(state), function(err) {

                    if(err) {
                        return console.log(err);
                    }
                
                    console.log("The file was saved!");
                }); 
            }
        });

        var filterConditions = {
    app_id: 440,  
    region_code: 0x03,
    max_servers: 1,
    filter_text: "\name_match\akod"
}

        // Pastebin post
        var PastebinAPI = require('pastebin-js'),
            pastebin = new PastebinAPI({
            'api_dev_key' : 'dce8221c3a448506a68544b451bd836a',
            'api_user_name' : 'gore_bot',
            'api_user_password' : 'epicdudeman64'
        });
 
        pastebin 
            .createPasteFromFile("pastebin.txt", "Raw Dump | " + toQuery + " | " + currentTime, null, 1, "N")
            .then(function (data) {
                // we have succesfully pasted it. Data contains the id
                console.log(data);
                client.chatMessage(steamID, data);
            })
            .fail(function (err) {
                console.log(err);
            });

    }*/