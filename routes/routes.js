const nodemailer = require('nodemailer')
const smtp_data = require('../../smtp_api.json')
const api = require('../../apikey.json')

const transporter = nodemailer.createTransport({
    host: smtp_data.host,
    port: smtp_data.port,
    secure: smtp_data.secure,
    auth: {
        user: smtp_data.auth.user,
        pass: smtp_data.auth.pass
    }
})

var appRouter = function(app) {
    app.use(function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
        res.setHeader('Access-Control-Allow-Methods', 'POST');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        next();
    });
    app.post('/mail', function(req, res) {
        if (!req.query.apikey) {
            return res.send({'status': 'error', 'message': 'Missing key.'});
        } else if (req.query.apikey !== api.apikey) {
            console.log(req.query.apikey)
            return res.send({'status': 'error', 'message': 'Wrong key.'});
        } else if (!req.query.from || !req.query.to || !req.query.subject || !req.query.text) {
            return res.send({'status': 'error', 'message': 'Missing field.'});
        }
        var mailOptions = {
            from: req.query.from,
            to: req.query.to,
            subject: req.query.subject,
            html: req.query.text
        }
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.send({'status': 'error', 'message': error});
            }
            return res.send({'status': 'success', 'message': ('Message %s sent: %s', info.messageId, info.response)});
        })
    });
}
 
module.exports = appRouter;