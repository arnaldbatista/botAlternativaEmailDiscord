const { EmbedBuilder, Client, Collection, Events, GatewayIntentBits } = require('discord.js')
const mailparser = require('mailparser').simpleParser
const Imap = require('imap')
const { email, password, host, port, tls, token } = require('../../config.json')

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`)
})

client.login(token)

client.commands = new Collection()

const imap = new Imap({
    user: email,
    password: password,
    host: host,
    port: port,
    tls: tls
})

imap.connect()

imap.on('error', err => {
    console.log(err)
    imap.connect()
})

module.exports = function conectEmail() {
    imap.once('ready', function () {
        imap.openBox('INBOX', true, (err) => {
            if (err) throw err
            imap.on('mail', numNewMsgs => {
                console.log(numNewMsgs + ' new message(s)')

                fetchEmails().then(result => {
                    const embed = new EmbedBuilder()
                        .setColor(0x0099FF)
                        .setTitle(result[0])
                        .setURL(result[2])
                        .setDescription(result[1])

                    client.channels.cache.get('1058449545488506982').send({ embeds: [embed] })
                })

                function fetchEmails() {
                    return new Promise((resolve, reject) => {
                        imap.search(['UNSEEN'], (err, results) => {
                            if (err) throw err

                            // filtro para achar links
                            const checkEmail = imap.fetch(results, { bodies: '' })
                            checkEmail.on('message', (msg) => {
                                msg.on('body', (stream) => {
                                    mailparser(stream).then(email => {
                                        const linkEmail = JSON.stringify(JSON.stringify(JSON.stringify(email.html).split('"')).split("\\")).split('"')
                                        const link = linkEmail.filter(el => el.toLocaleLowerCase().indexOf('https'.toLocaleLowerCase()) > -1)[4]

                                        const user = JSON.stringify(JSON.stringify(JSON.stringify(email.textAsHtml).split(' ')).split('!')).split(',')[2].split('"')[1]

                                        resolve(['.................................**????Existe um novo email????**.................................',
                                            `???? **Usu??rio:** ${'`'}${user}${'`'}
                                    ???? **Motivo:** ${'`'}${email.subject}${'`'}
                                    `,
                                            link])

                                        // mover os emails da pasta principal para outra
                                        imap.move(results, 'DRAFTS', err => {
                                            if (err) console.log(err)
                                        })
                                    })
                                })
                            })
                        })
                    })
                }
            })
        })
    })
}