const { SlashCommandBuilder } = require('@discordjs/builders');
const { Interaction } = require('discord.js');



module.exports = {
  data: new SlashCommandBuilder()
    .setName('')
    .setDescription('')
  /*.addStringOption(option =>
    option.setName('input')
      .setDescription('The input to echo back')
      .setRequired(true));*/
  ,
  async run(context) {
    const interaction = context.interaction

    interaction.reply({
      content: '',
      ephemeral: true
    })
  }
}  