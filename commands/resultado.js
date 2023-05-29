const { SlashCommandBuilder } = require("@discordjs/builders");
const { Interaction, MessageEmbed } = require("discord.js");
const { api } = require("../cron");
const pools = require("../poolIds.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("resultados")
    .setDescription("mostra os resultados do jogo")
    .addStringOption((option) =>
      option.setName("match_id").setDescription("id do jogo").setRequired(true)
    ),
  async run(context) {
    const interaction = context.interaction;

    if (interaction.user.id !== "427193787094401045") {
      interaction.reply({
        content: "somente FELCS pode dar esse comando",
        ephemeral: true,
      });
      return;
    }

    try {
      const match = interaction.options.getString("match_id");

      interaction.reply({
        content: "aguarde",
        ephemeral: true,
      });

      const embed = new MessageEmbed().setColor("AQUA");

      const { status, json } = await api(
        pools[`${interaction.guildId}`],
        match
      );

      console.log(status, json);

      if (status !== 200) {
        interaction.editReply({
          content: "ocorreu um erro",
        });
        return;
      }

      embed
        .setTitle(`Jogo: ${json.match}`)
        .setDescription(`Resultado: ${json.result}\n\n GANHADORES:\n`);

      const chunkSize = 15;
      for (let i = 0; i < json.winners.length; i += chunkSize) {
        const chunk = json.winners.slice(i, i + chunkSize);
        const strWinners = chunk.join("\n");
        embed.addField("----------------", strWinners, true);
      }

      interaction.channel.send({
        embeds: [embed],
      });

      interaction.editReply({ content: "resultados", ephemeral: true });
    } catch (error) {
      console.log(error);
    }
  },
};
