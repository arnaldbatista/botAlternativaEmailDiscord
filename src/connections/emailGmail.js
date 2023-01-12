const Imap = require('imap')
const mailparser = require('mailparser').simpleParser
const imap = new Imap({
    user: 'arnaldo@alternativamais.com',
    password: 'Netalt0909*',
    host: 'email-ssl.com.br',
    port: 993,
    tls: true
})

imap.once('ready', function () {
    imap.openBox('INBOX', true, function (err, box) {
        if (err) throw err
        imap.on('mail', function (numNewMsgs) {
            console.log(numNewMsgs + ' new message(s)')
            fetchEmails()
        });
    });
});

imap.connect()

function fetchEmails() {
    imap.search(['UNSEEN'], function (err, results) {
        if (err) throw err
        if (!results.length) {
            console.log('No unread messages found!');
            return
        }
        var f = imap.fetch(results, { bodies: '' })
        f.on('message', function (msg, seqno) {
            msg.on('body', function (stream, info) {
                mailparser(stream)
                    .then(email => {
                        // let emailBody = JSON.stringify(email.html)
                        // const linksArray = emailBody.split('"')
                        // const linkTxt = JSON.stringify(linksArray)
                        // const nome = linkTxt.split("\\")
                        // const nome1 = JSON.stringify(nome)
                        // const nome2 = nome1.split('"')

                        const teste22 = JSON.stringify(JSON.stringify(JSON.stringify(email.html).split('"')).split("\\")).split('"')


                        function filterItens(query) {
                            return teste22.filter(function(el) {
                                return el.toLocaleLowerCase().indexOf(query.toLocaleLowerCase()) > -1
                            })
                        }

                        console.log(filterItens('https')[5])
                    })
            })
        })
    })
}
