
var nodemailer = require('nodemailer');
var schedule = require('node-schedule');
const bnUtil = require('../bn-connection-util');

let options = {
    generate: false,
    includeOptionalFields: false
}
const { createLogger, format, transports } = require('winston');
const logger = createLogger({
    level: 'debug',
    format: format.combine(
        format.colorize(),
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [new transports.Console()]
});
const participantNamespace = 'io.onemillionyearsbc.hubtutorial';
const seekerResourceName = 'HubJobSeeker';
const jobnamespace = 'io.onemillionyearsbc.hubtutorial.jobs';
bnUtil.cardName = 'admin@hubtutorial';

const ALERT_EVENT = jobnamespace + '.AlertEvent';
const JOB_APPLICATION_EVENT = jobnamespace + '.JobApplicationEvent';

logger.info('EmailOracle Starting...');

var rule = new schedule.RecurrenceRule();
rule.hour = 07;
rule.minute = 00;

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

async function doDailySearches() {
    const bnDef = await bnUtil.connection.getBusinessNetwork();
    const factory = bnDef.getFactory();
    var registry = await bnUtil.connection.getParticipantRegistry(participantNamespace + '.'
        + seekerResourceName)

    logger.info('Received Registry: ', registry.id);
    var seekers = await registry.getAll();

    logger.info('Retrieved Hub JobSeekers : ' + seekers.length);

    // 1. loop through all jobseekers
    logger.info("Looking for any users with alerts set up...");

    for (var i = 0; i < seekers.length; i++) {
        // 2. get alerts for each job seeker
        let transaction = factory.newTransaction(jobnamespace, "GetAlertsForEmail", "", options);

        transaction.setPropertyValue('email', seekers[i].email);

        // 3. call FireAlertSearch with the transaction object
        try {
            let results = await bnUtil.connection.submitTransaction(transaction);

            // 4. if number of alerts set up > 0
            //   => run the alert search and get back a list of jobs  
            for (let j = 0; j < results.length; j++) {
                let alertId = seekers[i].alerts[j].getIdentifier();
                logger.debug("  => user " + seekers[i].email + "; alertId = " + alertId);
                logger.debug("  => name = " + seekers[i].params.name.firstName);
                await doSearch(alertId, seekers[i].params.name.firstName);
            }

        } catch (error) {
            logger.info('GetAlertsForEmail failed: ' + error);
            return;
        }

    }
}


async function doSearch(alertId, name) {
    const bnDef = await bnUtil.connection.getBusinessNetwork();
    const factory = bnDef.getFactory();

    const transactionType = "FireAlertSearch";

    // 1. Get the alert with the alert id received 
    var assetRegistry = await bnUtil.connection.getAssetRegistry(jobnamespace + '.JobAlert');

    var alert = await assetRegistry.get(alertId);

    if (alert.alertOn === false) {
        logger.info("alert " + alertId + " is OFF... no search fired!");
        return;
    }
    // 2. Create the json object for the search -> copy alert criteria into the data object
    let transaction = factory.newTransaction(jobnamespace, transactionType, "", options);
    logger.debug("Executing search with following parameters...");

    transaction.setPropertyValue('fulltime', alert.alertCriteria.fulltime);
    logger.debug("fulltime = " + alert.alertCriteria.fulltime);

    transaction.setPropertyValue('skills', alert.alertCriteria.skills);
    logger.debug("skills = " + alert.alertCriteria.skills);

    transaction.setPropertyValue('city', alert.alertCriteria.city);
    logger.debug("city = " + alert.alertCriteria.city);

    transaction.setPropertyValue('country', alert.alertCriteria.country);
    logger.debug("country = " + alert.alertCriteria.country);

    transaction.setPropertyValue('remote', alert.alertCriteria.remote);
    logger.debug("remote = " + alert.alertCriteria.remote);

    if (alert.alertCriteria.blockchainName != undefined) {
        transaction.setPropertyValue('blockchainName', alert.alertCriteria.blockchainName);
        logger.debug("blockchainName = " + alert.alertCriteria.blockchainName);
    } else {
        transaction.setPropertyValue('blockchainName', "NONE");
        logger.debug("blockchainName = " + "NONE");
    }

    // 3. call FireAlertSearch with the json object
    try {
        let results = await bnUtil.connection.submitTransaction(transaction);
        logger.info("Transaction processed: number results = " + results.length);
        var arr = alertId.split("-");
        let email = arr[0];
        let adverts = "";
        if (results.length === 0) {
            logger.info("No jobs found for alert id " + alertId);
            return;
        }
        for (let i = 0; i < results.length; i++) {
            logger.info("Job Ref = " + results[i].jobReference);

            let location = "remote";
            if (results[i].remote != true) {
                location = results[i].city + ", " + results[i].location;
            }
            adverts = addAdvertToMarkup(adverts, results[i].jobReference, results[i].jobTitle, location);
        }
        // 4. If any job postings received, poke the values into the markup
        let markup = createJobAlertMarkup(adverts, results.length, name, email);

        // 5. Send email to user
        sendEmailTo(email, markup);
    } catch (error) {
        logger.info('FireAlertSearch failed: ' + error);
        return;
    }
}

try {
    bnUtil.connect(main);
} catch (error) { }

logger.info("Waiting for the time...");


async function main() {
    logger.info("Subscribing to all Hub events...");

    let zero = "";
    if (rule.minute < 10) {
        zero = "0";
    }
    let zeroh = "";
    if (rule.hour < 10) {
        zeroh = "0";
    }
    logger.info("Will send out job results daily at " + zeroh + rule.hour + ":" + zero + rule.minute);

    schedule.scheduleJob(rule, function () {
        doDailySearches();
    });

    bnUtil.connection.on('event', (event) => {
        logger.info("Received hubutil event! event = " + event);
        var namespace = event.$namespace;
        var eventtype = event.$type;
        var fqn = namespace + '.' + eventtype;

        // Filter the events
        switch (fqn) {
            case ALERT_EVENT:
                // #3 Process the event
                logger.info("ALERT event; alertId = " + event.alertId);
                doSearch(event.alertId, event.name);
                break;
            case JOB_APPLICATION_EVENT:
                logger.info("JOB_APPLICATION_EVENT event; email = " + event.email);
                logger.info("JOB_APPLICATION_EVENT event; name = " + event.name);
                logger.info("JOB_APPLICATION_EVENT event; jobTitle = " + event.jobTitle);
                logger.info("JOB_APPLICATION_EVENT event; jobReference = " + event.jobReference);
                logger.info("JOB_APPLICATION_EVENT event; contact = " + event.contact);
                let markup = createJobApplicationMarkup(event.jobTitle, event.jobReference, event.name, event.contact, event.email);
                logger.info("Sending email to " + event.email);
                sendEmailTo(event.email, markup);
                break;
            default:
                logger.warn("Ignored event: ", fqn);
        }

    });
}

function sendEmailTo(email, markup) {
    let HelperOptions = {
        from: '"Blockchain Hub++" <1mybchub@gmail.com>',
        to: email,
        subject: 'Do Not Reply',
        attachments: [{
            filename: 'cheat.png',
            path: './img/cheat.png',
            cid: 'logo'
        }],
        html: markup
    };

    transporter.sendMail(HelperOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        logger.info("The message was sent!");
    });
}

function addAdvertToMarkup(adverts, ref, title, location) {
    adverts += `
    <li style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:100px;padding-top:0;                 padding-bottom:20px;padding-right:0;padding-left:0;box-sizing:inherit;" >
        <a href="http://localhost:8083/displayjob.html?search=${ref}" style="margin-bottom:0;margin-right:0;padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;box-sizing:inherit;margin-top:0;margin-left:0;font-size:22px;list-style-type:none;color:rgb(204, 109, 20);font-weight:600;" >${title} - ${location}</a>
    </li>`;
    return adverts;
}
function createJobApplicationMarkup(title, ref, name, contact, email) {

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
                <p class="mailtext" style="margin-bottom:0;margin-right:0;padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;box-sizing:inherit;font-size:15px;font-weight:500;margin-top:5rem;margin-left:100px;" >
                    Hi ${contact},<br>
                    There has been an application for your job, ref. ${ref} (${title}) <br>
                    Please login to the Hub++ to check the application.
                </p>
                <p class="mailtext" style="margin-bottom:0;margin-right:0;padding-top:0;padding-bottom:50px;padding-right:0;padding-left:0;box-sizing:inherit;font-size:15px;font-weight:500;margin-top:5rem;margin-left:100px;" >
                   Applicant Name: ${name}
                </p>
            
                <p class="mailtext" style="margin-bottom:0;margin-right:0;padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;box-sizing:inherit;font-size:10px;font-weight:300;margin-top:5rem;margin-left:100px;" >
                This email was sent to ${email} to  inform you of a candidate application. Please do not share. Read our privacy policy here
        <br>
                (c) OneMillionYearsBC, Brasov, Romania
                </p>
            </div>

        </body>

        </html>
        `;
    return markup;
}

function createJobAlertMarkup(adverts, num, name, email) {
    let s = "s";
    if (num == 1) {
        s = "";
    }
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
                <p class="mailtext" style="margin-bottom:0;margin-right:0;padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;box-sizing:inherit;font-size:15px;font-weight:500;margin-top:5rem;margin-left:100px;" >
                    Hi ${name},<br>
                    Here are the latest jobs for you. Take a look, and see if you want to apply.
                </p>
                <p class="mailtext" style="margin-bottom:0;margin-right:0;padding-top:0;padding-bottom:50px;padding-right:0;padding-left:0;box-sizing:inherit;font-size:15px;font-weight:500;margin-top:5rem;margin-left:100px;" >
                    You have ${num} new job${s}:
                </p>
                <ul class="maillinks" style="list-style:none;margin-top:0;margin-bottom:0;margin-right:0;margin-left:100px;padding-top:0;padding-bottom:20px;padding-right:0;padding-left:0;box-sizing:inherit;" >

                  ${adverts}

                </ul>
                <p class="mailtext" style="margin-bottom:0;margin-right:0;padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;box-sizing:inherit;font-size:10px;font-weight:300;margin-top:5rem;margin-left:100px;" >
                This email was sent to ${email} as you agreed to receive relevant jobs from www.blockchainhub.co.uk. It is linked to your personal jobseeker account and meant specifically for you so please do not share. Read our privacy policy here
        <br>
                (c) OneMillionYearsBC, Brasov, Romania
                </p>
            </div>

        </body>

        </html>
        `;
    return markup;
}

