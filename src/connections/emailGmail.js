const Imap = require('imap')
const mailparser = require('mailparser').simpleParser
const imap = new Imap({
    user: 'arnaldo@alternativamais.com',
    password: 'Netalt0909*',
    host: 'email-ssl.com.br',
    port: 993,
    tls: true
})

module.exports = function teste() {
    imap.once('ready', function () {
        imap.openBox('INBOX', true, function (err, box) {
            if (err) throw err
            imap.on('mail', function (numNewMsgs) {
                console.log(numNewMsgs + ' new message(s)')
                fetchEmails().then((result) => result)
            });
        });
    });
    
    imap.connect()
    
    imap.on('error', err => {
        console.log(err)
        imap.connect()
    })
    
    function fetchEmails() {
        return new Promise((resolve, reject) => {
            imap.search(['UNSEEN'], function (err, results) {
                if (err) throw err
                if (!results.length) {
                    console.log('No unread messages found!');
                    return
                }
                const checkEmail = imap.fetch(results, { bodies: '' })
                checkEmail.on('message', function (msg, seqno) {
                    msg.on('body', function (stream, info) {
                        mailparser(stream)
                            .then(email => {
                                const linkEmail = JSON.stringify(
                                    JSON.stringify(
                                        JSON.stringify(email.html)
                                            .split('"')
                                    )
                                        .split("\\")
                                )
                                    .split('"')
    
                                function filterItens(filterByHttps) {
                                    return linkEmail.filter(el => {
                                        return el.toLocaleLowerCase().indexOf(filterByHttps.toLocaleLowerCase()) > -1
                                    })
                                }

                                resolve = filterItens('https')[1]
                            })
                    })
                })
            })
        })
    }
}
