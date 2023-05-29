const { SlashCommandBuilder } = require("@discordjs/builders");
const { Interaction, MessageEmbed } = require("discord.js");
const pools = require("../poolIds.json");

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiRkVMQ1MiLCJhdmF0YXJVcmwiOiJodHRwczovL2Nkbi5kaXNjb3JkYXBwLmNvbS9hdmF0YXJzLzQyNzE5Mzc4NzA5NDQwMTA0NS83NTIwZmExODJlMzMzMDkxY2U2NTZiODlkNWFjZGJjMC53ZWJwP3NpemU9MjA0OCIsInN1YiI6ImNsYXFzazc4YTAwMDB0Z3MwdXM4cm43dTQiLCJpYXQiOjE2NjkwMzU5NTksImV4cCI6ODY0MDAxNjY4OTQ5NTU5fQ.mvzINen8HIYDxBz9Lb3D33fLf797GNFVlxFrumQchQM";
const baseUrl = "http://localhost:3333/pools";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("apostas")
    .setDescription("Listagem das minhas apostas")
    .addUserOption((option) =>
      option
        .setName("membro")
        .setDescription("selecione o membro pra ver o rank")
    ),
  async run(context) {
    const interaction = context.interaction;
    const member = interaction.options.getUser("membro");

    const idToSearch = member ? member.id : interaction.user.id;

    const response = await fetch(
      `${baseUrl}/${pools[interaction.guildId]}/winners/${idToSearch}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${token}`,
        },
      }
    );

    const json = await response.json();

    const { username, hits } = json.info;
    const embed = new MessageEmbed()
      .setColor("GOLD")
      .setTitle(`Apostas de ${username}`);
    let strApostas = `Total de acertos: ${hits}\n\n`;

    json.guesses.map((guess) => {
      strApostas += `${guess.match} : ${new Date(guess.date).toLocaleString(
        "pt-BR"
      )}\nAposta: **${guess.aposta}** >>  Resultado: **${guess.result}**\n\n`;
    });
    embed.setDescription(strApostas);

    interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  },
};
