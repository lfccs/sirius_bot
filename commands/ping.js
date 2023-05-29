const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('ping test')
  /*.addStringOption(option =>
    option.setName('input')
      .setDescription('The input to echo back')
      .setRequired(true));*/
  ,
  async run(context) {
    const interaction = context.interaction

    interaction.reply({
      content: 'pong!',
      ephemeral: true
    })
  }
}  