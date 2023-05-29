const fs = require("node:fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

module.exports.dataHandler = (client) => {
  const save = require("./save");
  client.database.set("save", save);
  console.log(`data success`);
};

module.exports.run = (context) => {
  const client = context.client;
  const interaction = context.interaction;
  const commands = [];
  const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_TOKEN);
  const commandFiles = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js"));

  if (interaction) {
    rest
      .get(
        Routes.applicationGuildCommands(
          process.env.CLIENT_ID_SIRIUS,
          process.env.GUILD_ID
        )
      )
      .then((data) => {
        const promises = [];
        for (const command of data) {
          const deleteUrl = `${Routes.applicationGuildCommands(
            process.env.CLIENT_ID_SIRIUS,
            process.env.GUILD_ID
          )}/${command.id}`;
          promises.push(rest.delete(deleteUrl));
        }
        return Promise.all(promises);
      })
      .catch((err, status, req) => {
        console.log(err, status);
      });

    client.commands.clear();
  }

  for (const file of commandFiles) {
    delete require.cache[require.resolve(`./commands/${file}`)];
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
  }

  if (process.env.ENV === "prd") {
    rest
      .put(Routes.applicationCommands(process.env.CLIENT_ID_SIRIUS), {
        body: commands,
      })
      .then(() => {
        if (interaction) {
          interaction.reply({
            content: "commands updated to production",
            ephemeral: true,
          });
        }
        console.log("Successfully registered application commands.");
      })
      .catch((err) => {
        if (interaction) {
          interaction.reply({
            content: "commands not updated",
            ephemeral: true,
          });
        }
        console.error(err);
      });
  } else {
    rest
      .put(
        Routes.applicationGuildCommands(
          process.env.CLIENT_ID_SIRIUS,
          process.env.GUILD_ID
        ),
        { body: commands }
      )
      .then(() => {
        if (interaction) {
          interaction.reply({
            content: "commands updated to homologate",
            ephemeral: true,
          });
        }
        console.log("Successfully registered application commands.");
      })
      .catch((err) => {
        if (interaction) {
          interaction.reply({
            content: "commands not updated",
            ephemeral: true,
          });
        }
        console.error(err);
      });
  }
};
