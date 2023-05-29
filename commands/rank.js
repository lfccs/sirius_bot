const { SlashCommandBuilder } = require('@discordjs/builders');
const Rank = require('../connection/models/rank')
const fs = require('fs')
const { MessageEmbed } = require('discord.js');


module.exports = {
  data: new SlashCommandBuilder()
    .setName('rank')
    .setDescription('rank dos membros do server')
    .addUserOption(option =>
      option.setName('membro')
        .setDescription('selecione o membro pra ver o rank')
    )
    .addStringOption(option =>
      option.setName('alterar')
        .setDescription('gostaria de alterar o rank deste membro?')
        .addChoice('+', '+')
        .addChoice('-', '-')
        .addChoice('=', '=')
    )
    .addIntegerOption(option =>
      option.setName('pontos')
        .setDescription('quantos pontos?')
    )
    .addStringOption(option =>
      option.setName('motivo')
        .setDescription('qual motivo?')
    )
  ,
  async run(context) {

    const interaction = context.interaction;

    let str = '';
    const local = `../rankings.json`
    const locale = `./rankings.json`
    const data = require(local)

    await interaction.guild.members.fetch()

    const log = interaction.guild.channels.cache.get('962869002785423420')


    const member = interaction.options.getUser('membro')
    const escolha = interaction.options.getString('alterar')
    const motivo = interaction.options.getString('motivo')
    const pontos = interaction.options.getInteger('pontos')

    if (!member) {
      const leaderboard = Object.assign(
        {},
        ...Object.entries(data.ranks)
          .sort(([, a], [, b]) => b - a)
          .map(([p, a], i) => ({ [i + 1]: `${interaction.guild.members.cache.get(p)} - ${a} ⭐` }))

      )
      str = JSON.stringify(leaderboard).replace(/,/g, '\n').replace(/{|}|"/g, '').replace(/:/g, '° ')
      reply(str, "true");
    } else {

      let dataMembro = data.ranks[member.id];

      if (!dataMembro) {
        data.ranks[member.id] = 0;
        let d = JSON.stringify(data, null, 4)
        save(locale, d)
      }

      registrar()


      function registrar() {

        let logString = `${interaction.user}`

        if (!escolha) {
          str = `${member} - ${data.ranks[member.id]} ⭐`
          reply(str);
        }
        else {
          if (!interaction.guild.members.cache.get(interaction.user.id).roles.cache.find(r => r.id === data.cargo)) {
            str = `você nao tem permissão para alterar pontos`
            reply(str);
            return;
          }
          if (!['=', '+', '-'].includes(escolha)) {
            str = `informe uma opção valida`
            reply(str);
          }
          else {


            if (escolha && !pontos) {
              str = `informe quantos pontos deseja atribuir ao membro`
              reply(str);
              return;
            }
            else if (escolha === '+') {
              data.ranks[member.id] += pontos;
              logString += ` concedeu ${pontos}⭐ para ${member} `
            }
            else if (escolha === '-') {
              data.ranks[member.id] -= pontos;
              logString += ` removeu ${pontos}⭐ de ${member} `
            }
            else if (escolha === '=') {
              data.ranks[member.id] = pontos;
              logString += ` colocou como ${pontos} as ⭐ de ${member} `
            }
          }
          let e = JSON.stringify(data, null, 4)
          save(locale, e);
          if (motivo)
            logString += `pelo motivo ${motivo}`


          reply(`${member} esta com ${data.ranks[member.id]} pontos`, '', logString, member);
        }
      }
    }

    function reply(str, efem, logstr, member) {
      if (efem) {

        // inside a command, event listener, etc.
        const emb = new MessageEmbed()
          .setColor('#00ff00')
          .setTitle('Ranking')
          .setDescription(str)

        interaction.reply({
          embeds: [emb],
          ephemeral: false
        })
      } else {
        interaction.reply({
          content: `${str}`,
          ephemeral: true
        })


        const embLog = new MessageEmbed()
          .setColor('#00ff00')
          .setTitle(member.username)
          .setDescription(logstr)

        log.send({
          embeds: [embLog]
        })

      }
    }


    function save(local, data) {
      fs.writeFileSync(local,
        data, err => {
          if (err) {
            console.log(err)
          }
        }
      )
    }
  }
}  