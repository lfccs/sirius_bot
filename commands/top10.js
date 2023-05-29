const { SlashCommandBuilder } = require("@discordjs/builders");
const { Interaction, MessageEmbed } = require("discord.js");
const pools = require("../poolIds.json");

const token = process.env.API_TOKEN;
const baseUrl = "http://localhost:3333/pools";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("top_10")
    .setDescription("Os 10 membros com mais acertos no bolão"),
  /*.addStringOption(option =>
    option.setName('input')
      .setDescription('The input to echo back')
      .setRequired(true));*/
  async run(context) {
    const interaction = context.interaction;

    const response = await fetch(
      `${baseUrl}/${pools[interaction.guildId]}/winners`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
      }
    );

    const json = await response.json();

    console.log(json);
    const top_10 = json.slice(0, 10);
    console.log(top_10);

    const embed = new MessageEmbed()
      .setColor("BLURPLE")
      .setTitle("TOP 10 APOSTADORES");

    let strTop = "";
    top_10.map((user, i) => {
      strTop += `${i + 1}º) ${user.username} >>>  ${user.hits} ACERTOS✨\n `;
    });

    embed.setDescription(strTop);

    interaction.reply({
      embeds: [embed],
      ephemeral: false,
    });
  },
};
