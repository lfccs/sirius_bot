module.exports = {
  name: "interactionCreate",
  async run(client, interaction) {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    let context = new Object();
    context = {
      client: client,
      interaction: interaction,
    };

    try {
      await command.run(context);
    } catch (err) {
      interaction.reply({
        content: "error",
        ephemeral: true,
      });
    }
  },
};
