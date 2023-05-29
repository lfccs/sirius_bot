const { SlashCommandBuilder } = require("@discordjs/builders");
const deployCommands = require("../deploy-commands");
const event = require("../event-emmiter");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("deploy")
    .setDescription("deploy new commands"),
  async run(context) {
    deployCommands.run(context);
  },
};
