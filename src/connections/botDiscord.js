// const { Client, Collection, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js')
// const mailparser = require('mailparser').simpleParser
// const Imap = require('imap')
// const fs = require('node:fs')
// const path = require('node:path')

// const { email, password, host, port, tls, token } = require('../../config.json')

// const client = new Client({ intents: [GatewayIntentBits.Guilds] })
// const imap = new Imap({
//     user: email,
//     password: password,
//     host: host,
//     port: port,
//     tls: tls
// })

// module.exports = function botDiscord() {
//     client.once(Events.ClientReady, c => {
//         console.log(`Ready! Logged in as ${c.user.tag}`)
//     })

//     client.login(token)

//     imap.connect()

//     imap.on('error', err => {
//         console.log(err)
//         imap.connect()
//     })

//     client.commands = new Collection()

//     const commandsPath = path.join(__dirname, '..', 'commands')
//     const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))

//     for (const file of commandFiles) {
//         const filePath = path.join(commandsPath, file)
//         const command = require(filePath)
//         if ('data' in command && 'execute' in command) {
//             client.commands.set(command.data.name, command)
//         } else {
//             console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`)
//         }
//     }

//     client.on(Events.InteractionCreate, async interaction => {
//         if (!interaction.isChatInputCommand()) return

//         const command = interaction.client.commands.get(interaction.commandName)

//         if (!command) {
//             console.error(`No command matching ${interaction.commandName} was found.`)
//             return
//         }

//         try {
//             await command.execute(interaction)
//         } catch (error) {
//             console.error(error)
//             await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
//         }
//     })

//     imap.once('ready', function () {
//         imap.openBox('INBOX', true, (err, box) => {
//             if (err) throw err
//             imap.on('mail', numNewMsgs => {
//                 console.log(numNewMsgs + ' new message(s)')

//                 fetchEmails().then(result => {
//                         const embed = new EmbedBuilder()
//                         .setColor(0x0099FF)
//                         .setTitle(result[0])
//                         .setURL(result[2])
//                         .setDescription(result[1])

//                         client.channels.cache.get('1058449545488506982').send({embeds: [embed]})
//                 })

//                 function fetchEmails() {
//                     return new Promise((resolve, reject) => {
//                         imap.search(['UNSEEN'], (err, results) => {
//                             if (err) throw err

//                             // filtro para achar links
//                             const checkEmail = imap.fetch(results, { bodies: '' })
//                             checkEmail.on('message', (msg, seqno) => {
//                                 msg.on('body', (stream, info) => {
//                                     mailparser(stream).then(email => {
//                                         const linkEmail = JSON.stringify(JSON.stringify(JSON.stringify(email.html).split('"')).split("\\")).split('"')
//                                         const link = linkEmail.filter(el => el.toLocaleLowerCase().indexOf('https'.toLocaleLowerCase()) > -1)[4]

//                                         const user = JSON.stringify(JSON.stringify(JSON.stringify(email.textAsHtml).split(' ')).split('!')).split(',')[2].split('"')[1]

//                                         resolve(['.................................**🚨Existe um novo email🚨**.................................',
//                                         `👤 **Usuário:** ${'`'}${user}${'`'}
//                                         🚧 **Motivo:** ${'`'}${email.subject}${'`'}
//                                         `, 
//                                         link])

//                                         // mover os emails da pasta principal para outra
//                                         imap.move(results, 'DRAFTS', err => {
//                                             if (err) console.log(err)
//                                         })
//                                     })
//                                 })
//                             })
//                         })
//                     })
//                 }
//             })
//         })
//     })
// }