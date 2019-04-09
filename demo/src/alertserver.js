
var nodemailer = require('nodemailer');
var schedule = require('node-schedule');
// var EmailTemplate = require('email-templates').EmailTemplate;
// var path = require('path');
// var Promise = require('bluebird');

console.log("Waiting for the time...");
 
var rule = new schedule.RecurrenceRule();
rule.hour=09;
rule.minute=18;

var j = schedule.scheduleJob(rule, function () {
    transporter.sendMail(HelperOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log("The message was sent!");
        console.log(info);
    });
});

function loadTemplate (templateName, contexts) {

}

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

// 1. loop through all jobseekers
// 2. if number of alerts set up > 0
// 3. for each alert, run the alert search and get back a list of jobs
// 4. get the name, email and for each job: job title and location -> poke into markup
// 5. poke the job ref into the markup <a link> element

let markup = `<!DOCTYPE html>
<html lang="en" style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;box-sizing:border-box;font-size:62.5%;" >

<head 
</head>

<body style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;box-sizing:inherit;font-family:'Nunito', sans-serif;color:#44444b;font-weight:300;line-height:1.6;" >
    <div id="main" class="container" style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;box-sizing:inherit;background-color:rgba(255, 255, 255, 0.9);background-image:url(./img/eggs.jpg);background-repeat:no-repeat;background-position:50% 0%;background-attachment:fixed;background-size:cover;width:99vw;height:50vh;" >
        <header class="header" style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;box-sizing:inherit;" >
            <div class="header__topbar" style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;padding-bottom:0;padding-right:0;padding-left:0;box-sizing:inherit;display:flex;flex:0 0 auto;flex-wrap:wrap;padding-top:10px;background-color:#dbd7d5;font-size:20px;align-items:center;" >
                <div class="topleft" style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;padding-top:0;padding-bottom:0;padding-right:0;box-sizing:inherit;padding-left:200px;" >
                    <div class="logo" style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;box-sizing:inherit;display:flex;" >
                        <img src="cid:logo" alt="1MYBC" style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;box-sizing:inherit;" >
                    </div>
                </div>
            </div>
        </header>
        <p class="mailtext" style="margin-bottom:0;margin-right:0;padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;box-sizing:inherit;font-size:15px;font-weight:900;margin-top:5rem;margin-left:100px;" >
            Hi Mike,<br>
            Here are the latest jobs for you. Take a look, and see if you want to apply.
        </p>
        <p class="mailtext" style="margin-bottom:0;margin-right:0;padding-top:0;padding-bottom:50px;padding-right:0;padding-left:0;box-sizing:inherit;font-size:15px;font-weight:900;margin-top:5rem;margin-left:100px;" >
            You have 3 new jobs:
        </p>
        <ul class="maillinks" style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:100px;padding-top:0;padding-bottom:20px;padding-right:0;padding-left:0;box-sizing:inherit;" >
        <li style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:100px;padding-top:0;padding-bottom:20px;padding-right:0;padding-left:0;box-sizing:inherit;" >
        <a href="http://localhost:8083/displayjob.html?search=234567" style="margin-bottom:0;margin-right:0;padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;box-sizing:inherit;margin-top:0;margin-left:0;font-size:22px;list-style-type:none;color:rgb(204, 109, 20);font-weight:600;" >Hyperledger Specialist - London</a>
    </li>
    <li style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:100px;padding-top:0;padding-bottom:20px;padding-right:0;padding-left:0;box-sizing:inherit;" >
    <a href="http://localhost:8083/displayjob.html?search=234567" style="margin-bottom:0;margin-right:0;padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;box-sizing:inherit;margin-top:0;margin-left:0;font-size:22px;list-style-type:none;color:rgb(204, 109, 20);font-weight:600;" >Blockchain Architect - REMOTE</a>
</li>
            <li style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:100px;padding-top:0;padding-bottom:20px;padding-right:0;padding-left:0;box-sizing:inherit;" >
                <a href="http://localhost:8083/displayjob.html?search=234567" style="margin-bottom:0;margin-right:0;padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;box-sizing:inherit;margin-top:0;margin-left:0;font-size:22px;list-style-type:none;color:rgb(204, 109, 20);font-weight:600;" >Ethereum Business Analyst - Swindon</a>
            </li>
        </ul>
        <p class="mailtext" style="margin-bottom:0;margin-right:0;padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;box-sizing:inherit;font-size:10px;font-weight:300;margin-top:5rem;margin-left:100px;" >
        This email was sent to emerysolutions@yahoo.co.uk as you agreed to receive relevant jobs from www.blockchainhub.co.uk. It is linked to your personal jobseeker account and meant specifically for you so please do not share. Read our privacy policy here
<br>
        (c) OneMillionYearsBC, Brasov, Romania
        </p>
    </div>

</body>

</html>
`

let HelperOptions = {
    from: '"Blockchain Hub++" <1mybchub@gmail.com>',
    to: 'emerysolutions@yahoo.co.uk',
    subject: 'Do Not Reply',
    attachments: [{
      filename: 'cheat.png',
      path: './img/cheat.png',
      cid: 'logo'
  }],
    html: markup
};