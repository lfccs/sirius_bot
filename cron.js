const { MessageEmbed } = require("discord.js");
const cron = require("node-cron");
const schedules = [];

module.exports.createCron = (interaction, match, poolId) => {
  const matchDateTime = new Date(match.date).toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
  });
  const [date, time] = matchDateTime.split(" ");
  const [day, month, year] = date.split("/");
  const [hour, minute, second] = time.split(":");

  //                  sec min hour day month dayofweek
  const cronString = `0 15 ${Number(hour) + 2} ${day} ${month} *`;

  console.log("schedule seted as: ", cronString);

  // cron.schedule(
  //   cronString,
  //   async () => {
  //     try {
  //       const embed = new MessageEmbed().setColor("AQUA");

  //       const { status, json } = await api(poolId, match.id);

  //       if (status !== 200) {
  //         interaction.channel.send({
  //           content: "ocorreu um erro",
  //         });
  //         return;
  //       }
  //       embed
  //         .setTitle(`Jogo: ${json.match}`)
  //         .setDescription(`Resultado: ${json.result}\n\n GANHADORES:\n`);

  //       const chunkSize = 20;
  //       for (let i = 0; i < json.winners.length; i += chunkSize) {
  //         const chunk = json.winners.slice(i, i + chunkSize);
  //         const strWinners = chunk.join("\n");
  //         embed.addField("----------------", strWinners, true);
  //       }

  //       interaction.channel.send({
  //         embeds: [embed],
  //       });
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   },
  //   {
  //     timezone: "America/Sao_Paulo",
  //   }
  // );
};

module.exports.api = async (poolId, gameId) => {
  const token = process.env.API_TOKEN;
  const baseUrl = "http://localhost:3333/pools";

  const url = `${baseUrl}/${poolId}/games/${gameId}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });

  const json = await response.json();

  return {
    status: response.status,
    json,
  };
};
