
var nodemailer = require('nodemailer');
var schedule = require('node-schedule');

console.log("Waiting for the time...");

 
var rule = new schedule.RecurrenceRule();
rule.hour=13;
rule.minute=24;

var j = schedule.scheduleJob(rule, function () {
    transporter.sendMail(HelperOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log("The message was sent!");
        console.log(info);
    });
});

let transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    port: 465,
    auth: {
        user: '1mybchub@gmail.com',
        pass: 'Cazenove01'
    },
    debug: false,
    logger: true 
});

date = new Date();    
let message = date + ': Sent out at the right time matey!';

let HelperOptions = {
    from: '"Blockchain Hub++" <1mybchub@gmail.com>',
    to: 'emerysolutions@yahoo.co.uk',
    subject: 'Do Not Reply',
    text: message
};






