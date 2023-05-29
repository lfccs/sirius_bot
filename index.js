// Require the necessary discord.js classes
require("dotenv").config();
//require("./connection/database");
const fs = require("fs");
const files = require(`./dataManager.js`);
const dep = require("./deploy-commands");
const event = require("./event-emmiter");
const { Client, Intents, Collection } = require("discord.js");

// Create a new client instance
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_INTEGRATIONS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
  ],
});
client.database = new Collection();
client.commands = new Collection();
client.events = new Collection();

//handlers
let context = new Object();
context = {
  client: client,
};

//handlers
dep.dataHandler(client);
dep.run(context);
event.run(client);
files.fileManager();

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);
