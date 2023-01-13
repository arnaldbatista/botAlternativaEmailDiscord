const Imap = require('imap')
const mailparser = require('mailparser').simpleParser
const { email, password, host, port, tls } = require('../../config.json');
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


function emailOutlook() {
    return new Promise((resolve, reject) => {
        imap.once('ready', function () {
            imap.openBox('INBOX', true, (err, box) => {
                if (err) throw err
                imap.on('mail', (numNewMsgs) => {
                    console.log(numNewMsgs + ' new message(s)')
                    fetchEmails().then((result) => {
                        resolve(result)
                    });
                })
            })
        });


        function fetchEmails() {
            return new Promise((resolve, reject) => {
                imap.search(['UNSEEN'], (err, results) => {
                    if (err) throw err
                    if (!results.length) {
                        return
                    }

                    const checkEmail = imap.fetch(results, { bodies: '' })
                    checkEmail.on('message', (msg, seqno) => {
                        msg.on('body', (stream, info) => {
                            mailparser(stream)
                                .then(email => {
                                    const linkEmail = JSON.stringify(
                                        JSON.stringify(
                                            JSON.stringify(email.html).split('"')
                                        ).split("\\")
                                    ).split('"')

                                    function filterItens(filterByHttps) {
                                        return linkEmail.filter(el => {
                                            return el.toLocaleLowerCase().indexOf(filterByHttps.toLocaleLowerCase()) > -1
                                        })
                                    }
                                                                        
                                    resolve(filterItens('https')[2])
                                })
                        })
                    })
                })
            })
        }
    })
}

module.exports = emailOutlook
