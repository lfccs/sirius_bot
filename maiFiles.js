const mapFolder = require('map-folder');

const { Client, Intents, Collection } = require('discord.js');

// Create a new client instance
const client = new Client({
    intents:
        [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_INTEGRATIONS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_MEMBERS]
});

client.questoes = new Collection();

export const mapQuestoes = (client) => {

    const pastas = mapFolder('./olimpiadas');

    let olimpiadaProva, anoProva, faseProva, questaoProva

    Object.entries(pastas.entries).forEach(olimpiada => {
        //mapeia todas as olimpiadas
        olimpiadaProva = olimpiada[0]

        Object.entries(olimpiada[1].entries).forEach(ano => {
            //mapeia todos os anos de cada olimpiada
            anoProva = ano[0]

            Object.entries(ano[1].entries).forEach(questao => {
                //mapeia se cada questao de cada ano de cada olimpiada

                if (questao[1].isFile) {
                    //se o ano nao tem fase entra aqui e ja seta como questao
                    questaoProva = questao[1].base
                    client.questoes.set(`${olimpiadaProva}-${anoProva}-${questaoProva}`, questao[1])
                } else {
                    //se tem fases faz o mapeamento de cada fase
                    faseProva = questao[1].name
                    Object.entries(questao[1].entries).forEach(fase => {
                        //mapeia as questoes de cada fase e seta a questao
                        questaoProva = fase[1].base
                        client.questoes.set(`${olimpiadaProva}-${anoProva}-${faseProva}-${questaoProva}`, fase[1])
                    })
                }

            })
        })
    })

}




client.on('messageCreate', msg => {

    if (!msg.guild) return;
    if (!msg.content?.startsWith(prefix)) return;

    let questao;
    const args = msg.content.slice(prefix.length).split(' ');

    if (args[0] === 'aleatorio') {
        questao = client.questoes.random().path

        msg.reply({
            files: [questao]
        })
    } else {
        let olimpiada = args[0].toUpperCase()
        let ano = args[1]
        let questao = args[2]
        let fase = args[3]

        try {
            questao = client.questoes.get(`${olimpiada}-${ano}-${questao}`)
            msg.reply({
                files: [questao]
            })
        } catch (e) {
            try {
                questao = client.questoes.get(`${olimpiada}-${ano}-${fase}-${questao}`)
                msg.reply({
                    files: [questao]
                })
            } catch (e) {
                msg.reply({
                    content: 'can\`t find this question :('
                })
            }
        }

    }


})