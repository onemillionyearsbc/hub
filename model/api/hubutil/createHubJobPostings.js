/**
 * Populates the Hub JobPosting Registry with data
 * 
 * Composer 0.21.0
 */

const mysql = require('mysql');
const crypto = require('crypto');
const fs = require('fs');
const bnUtil = require('../bn-connection-util');
const axios = require('axios');
const fetch = require('node-fetch');

let ukdata = false; // true = generates jobs in Swindon, Wiltshire area of UK


async function getGithubData(location) {
    let data = await fetch(`https://www.distance24.org/route.json?stops=${location}`);
    let main = await data.json();

    let long1 = main.stops[0].longitude;
    let lat1 = main.stops[0].latitude;
    console.log("Longitude & Latitude for " + location + " => " + long1, lat1);
    return {longitude: long1, latitude: lat1};
}

console.log("createHubJobPostings [numpostings] [recruiteremail]");
const participantNamespace = 'io.onemillionyearsbc.hubtutorial';
const recruiterResourceName = 'HubRecruiter';

const namespace = 'io.onemillionyearsbc.hubtutorial.jobs';

const transactionType = "CreateJobPosting";

var refCount = [0, 0, 0, 0, 0];

bnUtil.cardName = 'admin@hubtutorial';

// bnUtil.connect(removeRecruitersAndJobSeekers);
let NUMPOSTINGS = 30;

if (process.argv.length === 3) {
    NUMPOSTINGS = process.argv[2];
}

if (process.argv.length == 4) {
    console.log("using email: " + process.argv[3]);
    email = process.argv[3];
}

try {
    bnUtil.connect(main);
} catch (error) { }

//----------------------------------------------------------------

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "hubdb"
});


con.connect();

// Callback function passed to the BN Connection utility
// Error has value if there was an error in connect()
async function main() {

    var email = "";
    var randEmail = true;
   
    // start();
    const bnDef = bnUtil.connection.getBusinessNetwork();
    const factory = bnDef.getFactory();


    var registry = await bnUtil.connection.getParticipantRegistry(participantNamespace + '.'
        + recruiterResourceName)

    console.log('Received Registry: ', registry.id);
    var recruiters = await registry.getAll();
    if (email != "") {
        console.log("trying to find " + email);
        for (var i = 0; i < recruiters.length; i++) {
            if (recruiters[i].email === email) {
                company = recruiters[i].company;
                randEmail = false;
                console.log("---> Found!");
                break;
            }
        }
    }
    console.log('Retrieved Hub recruiters : ', recruiters.length);


    const assetNamespace = 'io.onemillionyearsbc.hubtutorial.jobs';
    const jobAdsResourceName = 'JobAds';

    var reg2 = await bnUtil.connection.getAssetRegistry(assetNamespace + '.'
        + jobAdsResourceName)

    console.log('Received Registry 2: ', reg2.id);
    var jobAds = await reg2.getAll();

    console.log('Retrieved JobAds : ', jobAds.length);

    for (var i = 0; i < jobAds.length; i++) {
        jobAds[i].remaining = 100;
    }

    // Update the asset in the asset registry.
    await reg2.updateAll(jobAds);

    console.log('all jobAds updated!');

    // create an array of recruiter instances

    // let recruiters = createRecruiterInstances();

    let options = {
        generate: false,
        includeOptionalFields: false
    }
    
    console.log("Creating " + NUMPOSTINGS + " new job postings");

    for (var i = 0; i < NUMPOSTINGS; i++) {

        let accountIndex = getRandomIndex(0, recruiters.length - 1);
        if (randEmail === true) {
            email = recruiters[accountIndex].email;
            company = recruiters[accountIndex].company;
        }

        var jobReference = new Date().getTime().toString().substr(-8);

        //Get random values for all fields

        var remote = getRandomArrayElement(trueFalseArray);
        var jobType = getRandomArrayElement(jobTypeArray);
        var jobTitle = getRandomArrayElement(jobTitlesArray);
        var blockchain = getRandomArrayElement(blockchainArray);
        var description = getRandomArrayElement(descriptionArray);

        var index = getRandomIndex(0, 4);
        var contact = contactArray[index];
        var internalRef = internalRefArray[index] + "0" + ++refCount[index];
        var employer = getRandomArrayElement(trueFalseArray);

        var salary;

        if (jobType === "CONTRACT") {
            salary = getRandomArrayElement(salaryContractorArray);
        } else {
            salary = getRandomArrayElement(salaryFullTimeArray);
        }
        var location = "";
        var city = "";
      
        if (ukdata) {
            if (remote === false) {
                location = "United Kingdom";
                city = getRandomArrayElement(towns_near_swindon);
            }
        } else {
            if (remote === false) {
                let j = getRandomIndex(0, 1);
                let uk = false;
                if (j == 0) {
                    location = getRandomArrayElement(countriesArray);
                } else {
                    location = "United Kingdom";
                    uk = true;
                }
                while (city_states[location] === undefined) {
                    console.log("UNDEFINED COUNTRY: " + location);
                    let j = getRandomIndex(0, 1);
                    if (j == 0) {
                        location = getRandomArrayElement(countriesArray);
                    } else {
                        location = "United Kingdom";
                    }
                }
                let cities = city_states[location].split("|");
                if (uk) {
                    let k = getRandomIndex(0, 2);
                    if (k === 0) {
                        city = "London";
                    } else {
    
                        city = getRandomArrayElement(cities);
                    }
                } else {
                    city = getRandomArrayElement(cities);
                }
    
            }    
        }
       
        var numSkills = Math.floor(Math.random() * (5)) + 2;
        var skills = [];
        skills = getUniqueRandomArrayElements(skillsArray, numSkills);
        // var logohash = "6c631acfc202d6fbc37b5bf7e7c06a1f853bf3a0c9f5ff61416e97f2d7e069b6"; // stool
        let coords = {};
        if (remote === false) {
            console.log("Getting coords for " + city);
            coords = await getGithubData(city);
        }
      

        console.log(">>> generating job posting for email: " + email);
        console.log("   => jobRef =  " + jobReference);
        console.log("   => remote =  " + remote);
        console.log("   => city =  " + city);
        console.log("   => location =  " + location);
        console.log("   => longitude =  " + coords.longitude);
        console.log("   => latitude =  " + coords.latitude);


        let transaction = factory.newTransaction(namespace, transactionType, "", options);

        var params = factory.newConcept(namespace, 'JobPostingParameters');
        params.email = email;
        params.jobReference = jobReference;
        params.company = company;
        params.remote = remote;
        params.jobType = jobType;
        params.jobTitle = jobTitle;
        params.blockchainName = blockchain;
        params.description = description;
        params.contact = contact;
        params.internalRef = internalRef;
        params.employer = employer;
        params.salary = salary;
        params.location = location;
        params.city = city;
        if (remote === false) {
            params.longitude = coords.longitude;
            params.latitude = coords.latitude;
        }
        params.skills = skills;

        params.testData = false; // true to generate jobs in the past, false generates all jobs for today

        var img = getRandomArrayElement(imageArray);
        var imageAsBase64 = fs.readFileSync(`./img/${img}`, 'UTF-8');

        const myHash = crypto.createHash('sha256') // enables digest
            .update(imageAsBase64) // create the hash
            .digest('hex'); // convert to string

        console.log("   => hash =  " + myHash);
        params.logohash = myHash;

        transaction.setPropertyValue('params', params);

        try {
            await bnUtil.connection.submitTransaction(transaction);
            console.log("Transaction processed: Job Posting created for email " + email);
            var sql = `INSERT INTO company_logo (email, id, hash, image) VALUES ("${email}", ${jobReference}, "${params.logohash}", "${imageAsBase64}")`;
            await con.query(sql, function (err, rows, fields) {
                if (!err)
                    console.log('dbwrite succeeded');
                else
                    console.log('Error while performing Query: ' + err);
            });

        } catch (error) {
            console.log('Job Posting creation failed: ' + error);
        }
    }

    console.log("All done.");
    bnUtil.disconnect();
    con.end();
}

function getRandomIndex(min, max) {
    //Get a random integer between the min and max value.
    var randIndex = Math.round(Math.random() * (max - min)) + min;
    //Return random value.
    return randIndex;
}

function getNameIndex() {
    var min = 0;
    //Get the maximum value my getting the size of the
    //array and subtracting by 1.
    var max = 4;
    //Get a random integer between the min and max value.
    var randIndex = Math.floor(Math.random() * (max - min)) + min;
    //Return random value.
    return randIndex;
}

function getUniqueRandomArrayElements(arr, num) {

    var elements = [];
    var ids = arr.slice();

    for (var i = 0; i < num; i++) {

        //Minimum value is set to 0 because array indexes start at 0.
        var min = 0;
        //Get the maximum value my getting the size of the
        //array and subtracting by 1.
        var max = (ids.length - 1);
        //Get a random integer between the min and max value.
        var randIndex = Math.floor(Math.random() * (max - min)) + min;

        elements.push(ids.splice(randIndex, 1)[0]);
    }

    return elements;
}
function getRandomArrayElement(arr) {
    //Minimum value is set to 0 because array indexes start at 0.
    var min = 0;
    //Get the maximum value my getting the size of the
    //array and subtracting by 1.
    var max = (arr.length - 1);
    //Get a random integer between the min and max value.
    var randIndex = Math.round(Math.random() * (max - min)) + min;
    //Return random value.
    return arr[randIndex];
}

//Example JavaScript array containing various types of stuff.

// for proper solution we should fetch all Hub Accounts and pick a random account
var imageArray = [
    'ibm.txt',
    'hp.txt',
    'ur.txt',
    'adidas.txt',
    'am.txt'
]

var trueFalseArray = new Array(
    true,
    false
);

var jobTypeArray = new Array(
    "FULLTIME",
    "CONTRACT",
    "PARTTIME",
    "INTERNSHIP",
    "OTHER"
);

var blockchainArray = [
    "ETHEREUM",
    "HYPERLEDGER",
    "NEO",
    "CORDA",
    "QUOROM",
    "RIPPLE",
    "OTHER"
];

var contactArray = [
    "Mike",
    "Jo",
    "Andy",
    "Carmen",
    "Richard"
];

var internalRefArray = [
    "MJR",
    "GT",
    "AJR",
    "CW",
    "RW"
]

var salaryFullTimeArray = [
    "From £60,000 to £100,000 per annum",
    "From £40,000 to £60,000 per annum",
    "From £20,000 to £35,000 per annum",
    "From £40,000 to £80,000 per annum",
    "N/A",
]

var salaryContractorArray = [
    "£500 per day",
    "£600 per day",
    "£750 per day",
    "£350 per day",
    "N/A",
]
var descriptionArray = ["<p><strong>Senior Blockchain Developer</strong></p><p><br></p><p><strong>Introduction&nbsp;</strong></p><p><br></p><p>My client is one of the leading lights in the Blockchain world having built a robust trading platform for Cryptocurrency's. Due to recent significant investment my client is looking to drastically increase the headcount among various teams including their Blockchain Development team.</p><p><br></p><p><strong>About you</strong></p><ul><li class=\"ql-indent-1\">5+ years Software development experience</li><li class=\"ql-indent-1\">Must have: Java, Blockchain (in particular Etherium, Nxt), SmartContracts (in particular Solidity) JavaScript, RESTful Web Services, API integrations</li><li class=\"ql-indent-1\">Web Development experience (HTML/CSS, JavaScript, popular Web Development technologies, such as Node.js, PHP, and React)</li><li class=\"ql-indent-1\">Mobile solutions experience (iOS, Android, cross platform using Xamarin, React, Cordova, etc.)</li><li class=\"ql-indent-1\">Comfortable working in a fast-paced environment with an expanding technology team</li><li class=\"ql-indent-1\">Experience with Go language</li></ul><p><br></p><p><strong style=\"color: rgb(69, 69, 69);\">Remuneration</strong></p><ul><li class=\"ql-indent-1\">Base salaries up to £100,000 (DOE)</li><li class=\"ql-indent-1\">Company Equity</li><li class=\"ql-indent-1\">Private healthcare</li><li class=\"ql-indent-1\">Annual bonus</li><li class=\"ql-indent-1\">Training budget</li><li class=\"ql-indent-1\">Conference budget</li></ul><p><br></p>",
    "<p><strong>E-commerce Project Manager</strong></p><p><br></p><ul><li class=\"ql-indent-1\">Role: E-commerce Project Manager</li><li class=\"ql-indent-1\">Location: North West</li><li class=\"ql-indent-1\">Length: 6 Months+</li><li class=\"ql-indent-1\">Rate: Competitive</li></ul><p>A big multi-brand online retailer with an impressive heritage, great people and huge plans for the future. We are looking for an experienced E-commerce Project Manager to join their team at a time of considerable growth and exciting new digital Projects and Programmes</p><p>Responsibilities&nbsp;</p><p><br></p><p>• To deliver digital projejets in both Agile and Waterfall methodologies</p><p>• Evaluate information gathered from multiple sources</p><p>• Communicate and collaborate with internal stakeholders&nbsp;</p><p>• You will be running concurrent projects within an Agile Programme</p><p>Experience</p><p>• Agile (Sprint Planning, retrospectives, demos, user stories)&nbsp;</p><p>• Must be able to demonstrate recent experience of running cocurrent projects in an Agile Programme</p><p>• Ideally experience of working in an e-commerce environment</p><p>• Delivered projects in both Agile and Waterfall</p><p>Person</p><p>• Analytical</p><p>• Strong verbal and written communication&nbsp;</p><p>• Excellent attention to detail</p><p><br></p><p>This role is specifically for an experienced E-commerce Project Manager with specific experience shaping Agile teams, sprint planning, retrospectives, demos and user stories.</p>",

    "<p><strong>Internet Economy Senior Mobile Software Engineer - Native Apps, Android Apps, iOS Apps</strong></p><p><br></p><p>Do you get a buzz out of working in fast changing sector of Internet Economy from a mobile perspective?</p><p><br></p><p>Do you want autonomy and ownership of ground up mobile design, the ability to run small experiments and if the metrics / data proves it works (which you run) you get to scale it up (x10, x50, across full company etc.)?</p><p><br></p><p>You will be working in an Internet Economy or have a passion to work in an Internet Economy with an understanding of scalability.</p><p><strong>What Is In It For You?</strong></p><ul><li>Your small team is empowered to make the decisions</li><li>You are encouraged to experiment, take risks, OK to learn from mistakes and when it works you can see your solutions scale</li><li>It is a Culture of Continuous Learning, you select &amp; work with the best tech to solve the problem</li><li>Customer Driven Design, but cool thing is when your design is rolled out your fiends &amp; family will use</li><li>Own what you build</li><li>Good package, excellent bonus structure</li></ul><p><strong style=\"color: rgb(69, 69, 69);\">You will:</strong></p><ul><li>Be working in an Internet Economy or have a passion to work in an Internet Economy with an understanding of scalability</li><li>Be a mobile developer developing, releasing and maintaining from ground up mobile apps / native apps</li><li>Believe in Customer Driven Design for mobile with an appreciation of the UX and design elements</li><li>Be strong in all or one of iOS, Android, ReactNative</li><li>Understand / Work on server side / hybrid rendering strategies</li><li>Have a strong customer focus and appreciation of what makes good product, UX and design</li><li>Deployment and CI / CD experience</li><li>Preferably have experience with data analysis, systems design, release services or some knowledge of with a strong desire to have ownership of the products you design and have a much fuller mobile experience</li></ul><p><br></p><p><strong style=\"color: rgb(69, 69, 69);\">Nice To Have Some Of (but not all):</strong></p><p><br></p><ul><li class=\"ql-indent-1\">Objective-C, Java, Swift, Fastlane, Gradle, Microservices, Docker, Drone, AWS, SQL, Python, Elasticsearch, TDD</li></ul><p><br></p><p><span style=\"color: rgb(69, 69, 69);\">If you have that passion for Internet Economy companies then there is no doubt to me you will be excited to work in the environment my client offer and of the code you will ship.</span></p><p><br></p><p><span style=\"color: rgb(69, 69, 69);\">Apply to hear more!</span></p><p><br></p><h2><strong style=\"color: rgb(69, 69, 69);\">Search is an equal opportunities recruiter and we welcome applications from all suitably skilled or qualified applicants, regardless of their race, sex, disability, religion/beliefs, sexual orientation or age.</strong></h2>",
    "<h2><span style=\"color: rgb(69, 69, 69);\">CTO - Lloyd's of London Syndicate - Rare opportunity!</span></h2><p><br></p><p><span style=\"color: rgb(69, 69, 69);\">An emerging Lloyd's of London syndicate with incredible financial backing and a hugely experienced leadership team are looking for a CTO to join their team. The business is essentially still in start up mode, with 4 years under their belt, and have no real restrictions on technology budget. This is a very exciting opportunity role for an experienced individual, open to rolling their sleeves up as they build out the capability in their role as CTO.</span></p><p><br></p><p><span style=\"color: rgb(69, 69, 69);\">This is a forward-thinking syndicate, expanding through a strong performance, and if successful you will play a pivotal role in the strategic roadmap with technology. The nature of the role and the business mean that although it will create strong opportunity for you it will come with initial challenges. For example, in the short term they require someone who is happy to roll their sleeves up and carrying out operational IT work, setting up users, installing software etc, ideally building MI reports and managing third party IT vendors.</span></p><p><br></p><p><span style=\"color: rgb(69, 69, 69);\">The syndicate is already completely in the cloud (Azure), utilising the full Microsoft stack, and then uses a bespoke statically modelling tool for risk related assessments/models etc. They also use several different report tools, such as Business Objects / Qlilkview, through a SQL Server Database.</span></p><p><br></p><p><span style=\"color: rgb(69, 69, 69);\">Requirements:</span></p><p><br></p><p><span style=\"color: rgb(69, 69, 69);\">- Experience running an IT team, managing developers and ideally third-party vendors.</span></p><p><br></p><p><span style=\"color: rgb(69, 69, 69);\">- Knowledge of the insurance or reinsurance market, ideally from a Lloyds of London environment.</span></p><p><br></p><p><span style=\"color: rgb(69, 69, 69);\">- Experience working with lots of data and ideally able to build MI reports in Business Objects or Qlikview or using SQL.</span></p><p><br></p><p><span style=\"color: rgb(69, 69, 69);\">- Ideally you will have a broad understanding of technology systems; infrastructure and applications, as well as how the technology is used in insurance; e.g. statistical modelling, aggregates etc.</span></p><p><br></p><p><span style=\"color: rgb(69, 69, 69);\">- Strong stakeholder management experience.</span></p><p><br></p><p><span style=\"color: rgb(69, 69, 69);\">- The perfect applicant (not a show stopper) will also have knowledge of programming (C#) or R and/or knowledge of working with Azure / Office 365 (currently run as a pay-as-you-go model).</span></p><p><br></p><p><br></p><p><br></p><p><span style=\"color: rgb(69, 69, 69);\">If this sounds interesting or you'd like to find out more then please call Jamie Wilkins on 0203 327 3071 or apply here for a confidential conversation.&nbsp;</span></p><p><br></p><p><span style=\"color: rgb(69, 69, 69);\">Lawrence Harvey is acting as an employment agency in regards to this position. Visit our website www.lawrenceharvey.com and follow us on Twitter for all live vacancies @lawharveyjobs</span></p>",
    "<p><strong>Associate Director - IT &amp; Digital Transformation - London - £120,000 upwards + lucrative package</strong></p><p><br></p><p>My client is a<strong><em><u> top tier consulting firm</u></em></strong> who are called upon for prestigious and mission critical projects. They specialize in creating value across the business life cycle and helping firms restore performance.</p><p><br></p><p>We are now looking for high calibre senior profiles with strong experience across Digital, IT, Strategy or Transformation. The environment is world class and senior led with strong ties to c-suite, business owners and industry.</p><p><br></p><p>The IT transformation team work within the broader Digital function and provide expertise to improve business performance by driving value from technology.</p><p><br></p><p>The depth of experience they possess allow them to exert rapid impact across areas including: Digital strategy, operating models, IT Cost reduction, IT Due diligence, Carve-out, project turnaround, IT platform/infrastructure review and many more.</p><p><br></p><p>The associate director should be comfortable with the following responsibilities:</p><ul><li>Lead or co-lead projects of varying sizes, from strategy through to completion</li><li>Play a lead role in ensuring quality delivery on the client engagements in critical situations requiring rapid improvement</li><li>Play a lead role or form part of a small team participating in proposals for new business</li><li>Deliver technical and consulting expertise in at least 2 of the following: Digital and Technology strategy, Product strategy and innovation, IT operating model, organization &amp; governance, IT cost reduction, IT strategic sourcing, turnaround of large scale \"troubled\" projects, operational due diligence, company separation (Carve-out) or integration (Merger) projects, IT complexity reduction, platforms/infrastructure consolidation</li></ul><p><br></p><p><br></p><p><span style=\"color: rgb(69, 69, 69);\">Qualifications:</span></p><ul><li class=\"ql-indent-1\">A minimum of 10 years of professional IT consulting experience</li><li class=\"ql-indent-1\">A preference for industry experience in Retail/Consumer products, TMT or automotive</li><li class=\"ql-indent-1\">Experience working on small projects as well as larger work streams</li><li class=\"ql-indent-1\">Excellent presentation and communication ability with knowledge of related IT tools, frameworks and methodologies</li><li class=\"ql-indent-1\">Able (UK or EU passport) and willing to travel across EMEA.</li></ul><p><br></p><p><br></p><p><span style=\"color: rgb(69, 69, 69);\">Applicants must have all the competencies below:</span></p><ul><li class=\"ql-indent-1\">A passion for driving IT effectiveness and helping clients achieve objectives</li><li class=\"ql-indent-1\">A thought leader with the ability to add value at industry conferences and events.</li><li class=\"ql-indent-1\">Able to work in a fast-paced entrepreneurial environment.</li><li class=\"ql-indent-1\">A focus on winning and achieving success as a team and individually.</li><li class=\"ql-indent-1\">The ability to deliver expertise in critical and urgent situations, requiring rapid improvement</li><li class=\"ql-indent-1\">Highly focused on collaboration with the gravitas to develop buy in from a wide range of C-Suite executives.</li></ul><p><br></p><p><br></p><p><span style=\"color: rgb(69, 69, 69);\">If this role is of interest and you tick all of the relevant requirements, please apply or email me directly @&nbsp;</span></p><p><br></p><p><span style=\"color: rgb(69, 69, 69);\">Key words - transformation, digital, IT, software delivery, infrastructure, solution architecture, governance, cost reduction, compliance, due diligence, carve out, merger integration, outsourcing, Retail, Consumer, TMT, Automotive</span></p><p><br></p><p><span style=\"color: rgb(69, 69, 69);\">This job ad was posted by Salt. To find out more about Salt's Privacy Policy and how your application is processed, please visit our website https://www.welovesalt.com/privacy-policy/.</span></p>",
    "<h2>Ethereum Architect</h2><p><br></p><p><strong>Ethereum specialist</strong>&nbsp;required for a Professional Services organisation based in Central London where you will be responsible for making my clients IT Service the envy of other businesses in a way that it enables my client to provide the highest levels of client insight and service.</p><p><br></p><p>Main Duties and Responsibilities,</p><ul><li>Own the creation of my client's IT Strategy</li><li>Define and deliver the IT change agenda within my client</li><li>Assure delivery of a business as usual IT Service delivery to the whole of the organisation</li><li>Act as an ambassador for the IT Department across the business</li><li>Lead, motivate and develop the IT Department's resources</li><li>Create and deliver an annual budget that balances the delivery of day to day services with the investment in new technologies/solutions</li><li>Be an active participate in the business support leadership team to ensure a high-quality service is providers to all users</li></ul><p><br></p><p><br></p><p><span style=\"color: rgb(69, 69, 69);\">Key Experience required,</span></p><ul><li>Proven experience as a Head of IT or IT Director with responsibility for budget creation/management, leadership and staff development</li><li>Leadership and participation in analysis, evaluation, configuration and implementation of complex IT systems. Ideally experience of Practice Management Solutions</li><li>Management of multiple IT Disciplines (software development, technical support, system architecture, data management and MI and hardware/software strategy)</li><li>Supplier identification, selection and management</li><li>Cloud migration and management</li></ul><p><br></p><p><br></p><p><strong style=\"color: rgb(69, 69, 69);\">Professional Services or Legal Sector experience is essential!!!</strong></p><p><br></p><p><span style=\"color: rgb(69, 69, 69);\">My client is offering a salary of between £95,000 and £105,000 plus benefits depending on experience</span></p><p><br></p><p><span style=\"color: rgb(69, 69, 69);\">Interested!?! Send your up to date CV to Chris Butler at Crimson for immediate review</span></p><p><br></p><p><span style=\"color: rgb(69, 69, 69);\">Crimson are acting as an employment agency in regards to this vacancy</span></p>"];

// var countriesArray = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua & Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Chad", "Chile", "China", "Colombia", "Costa Rica", "Cote D Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Greenland", "Grenada", "Guatemala", "Guinea", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Macau", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Mauritania", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montserrat", "Morocco", "Mozambique", "Namibia", "Nepal", "Netherlands", "Netherlands Antilles", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico", "Qatar", "Romania", "Rwanda", "Samoa", "San Marino", "Saudi Arabia", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Somalia", "South Africa", "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Tunisia", "Turkey", "Turkmenistan", "Turks & Caicos", "Tuvalu", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uzbekistan", "Vatican City", "Venezuela", "Yemen", "Zambia", "Zimbabwe"];

var countriesArray = ["Belgium", "Canada", "France", "Germany", "Greece","Hungary", "Italy", "Netherlands", "Portugal", "Ireland","Romania", "Spain", "Sweden", "Switzerland", "United Arab Emirates", "United Kingdom", "United States"];

var skillsArray = ["JavaScript", "NodeJS", "Web", "C++", "Typescript", "Java", "Python", "Rust", "PHP", "Go",
    "UNIX", "Oracle", "MySQL", "NOSQL", "C#", "CSS/HTML5"]

var jobTitlesArray = ["Application Support Analyst",
    "Automation Tester",
    "Architect",
    "Application Support Engineer",
    "Account Manager",
    "AWS Engineer",
    "Administrator",
    "Application Engineer",
    "Blockchain Developer",
    "Blockchain Analyst",
    "Blockchain Engineer",
    "Blockchain Architect",
    "Blockchain Administrator",
    "Blockchain Analyst",
    "Blockchain Consultant",
    "Blockchain Manager",
    "Blcockchain Tester",
    "Business Analayst",
    "Business Data Analyst",
    "Business Domain Architect",
    "Business Systems Analyst",
    "Computer Architect",
    "Consultant",
    "Corda Developer",
    "Corda Blockchain Administrator",
    "Corda Blockchain Architect",
    "Corda Blockchain Consultant",
    "Corda Blockchain Developer",
    "Corda Blockchain Manager",
    "DevOps Engineer",
    "Developer Golang",
    "Developer Node.js",
    "Developer C++",
    "Developer RUST",
    "Developer Java",
    "Developer Solidity",
    "Developer JavaScript",
    "Developer .Net",
    "Data Analyst",
    "Data Engineer",
    "Developer",
    "Engineer",
    "Enterprise Architect",
    "Ethereum Developer",
    "Ethereum Blockchain Administrator",
    "Ethereum Blockchain Architect",
    "Ethereum Blockchain Consultant",
    "Ethereum Blockchain Developer",
    "Ethereum Blockchain Manager",
    "Field Support Engineer",
    "Front End Developer",
    "Full Stack Developer",
    "Full Stack .Net Developer",
    "Full Stack Web Developer",
    "Full Stack PHP Developer",
    "Full Stack Blockchain Developer",
    "Full Stack Java Developer",
    "Functional Consultant",
    "Gradute",
    "Graduete Developer",
    "Graduate Junior Developer",
    "Graduate Recruitment Consultant",
    "Graduate Analyst",
    "Graduate Blockchain Developer",
    "Graduate Engineer",
    "Graduate Software Constultant",
    "Graduate Software Developer",
    "Graduate Consultant",
    "Graduate Business Analyst",
    "Graduate IT",
    "Graduate IT Supoport",
    "Head of Blockchain Development",
    "Head",
    "Head of Engineering",
    "Head of Technology",
    "Hardware Engineer",
    "Head of Architecture",
    "Help Desk Engineer",
    "Head of Services",
    "Hyperledger Specialist",
    "Hyperledger Fabric Developer",
    "Hyperledger Fabric Administrator",
    "Hyperledger Fabric Analyst",
    "Hyperledger Fabric Tester",
    "Hyperledger Sawtooth Specialist",
    "Hyperledger Sawtooth Developer",
    "Hyperledger Sawtooth Administrator",
    "Hyperledger Sawtooth Analyst",
    "Hyperledger Sawtooth Tester",
    "Hyperledger Project Manager",
    "Hyperledger Tester",
    "IBM Blockchain Administrator",
    "IBM Blockchain Architect",
    "IBM Blockchain Developer",
    "IBM Blockchain Manager",
    "Infrastructure Engineer",
    "IT Support Engineer",
    "IT Manager",
    "IT Project Manager",
    "Information Security Analyst",
    "Informatica Architect",
    "IoS Developer",
    "IT Business Analyst",
    "Infrastructure Architect",
    "Infrasturcture Manager",
    "Integration Developer",
    "IT Field Engineer",
    "Java Developer",
    "JavaScript Developer",
    "Junior PHP Developer",
    "Junior Developer",
    "Junior Developer C#",
    "Junior Java Developer",
    "Junior .Net Developer",
    "Junior JavaScript Developer",
    "Junior Front End Developer",
    "Junior Web Developer",
    "Junior Business Analyst",
    "Key Account Manager",
    "Key Account Executive",
    "Knowledge Manager",
    "Lead Engineer",
    "Lead Developer",
    "Lead",
    "Lead Software Engineer",
    "Lead Java Developer",
    "Linux Systems Administrator",
    "Lead Software Developer",
    "Linux Engingeer",
    "Lead Business Analyst",
    "Lead Consultant",
    "Lead DevOps Engineer",
    "Lead .Net Developer",
    "Lead UX Designer",
    "Lead Manager",
    "Manager Contract",
    "Manager",
    "Mobile Developer",
    "Marketing Executive",
    "Mobile App Developer",
    "Management Information Analyst",
    "Manager Blockchain",
    "Neo Developer",
    "Neo Blockchain Administrator",
    "Neo Blockchain Architect",
    "Neo Blockchain Consultant",
    "Neo Blockchain Developer",
    "Neo Blockchain Manager",
    "Network Engineer",
    "Network Architect",
    "Node.JS Developer",
    "Network Manager",
    "Network Consultant",
    "Network Security Consultant",
    "Node.JS Software Engineer",
    "Network Security Analyst",
    "New Business Executive",
    "On-Site Engineer",
    "Operations Manager",
    "Oracle Developer",
    "Oracle Blockchain Administrator",
    "Oracle Blockchain Architect",
    "Oracle Blockchain Consultant",
    "Oracle Blockchain Developer",
    "Oracle Blockchain Manager",
    "Office Manager",
    "Operations Analyst",
    "PHP Developer",
    "Project Manager",
    "Python Developer",
    "Product Manager",
    "Programme Manager",
    "Platform Engineer",
    "Project Manager Business",
    "Project Manager Software",
    "Partner",
    "Pre-Sales Consultant",
    "Product Analyst",
    "QA Engineer",
    "QA Manager",
    "QA Analyst",
    "QA Automation Tester",
    "QA Automation Engineer",
    "QA Test Analyst",
    "QA Tester",
    "QA Test Engineer",
    "QA Developer",
    "QA Lead",
    "Quality Inspector",
    "QA Assistant",
    "Quorum Developer",
    "Quorum Blockchain Administrator",
    "Quorum Blockchain Architect",
    "Quorum Blockchain Consultant",
    "Quorum Blockchain Developer",
    "Quorum Blockchain Manager",
    "React Developer",
    "Remote Developer",
    "Researcher",
    "Release Engineer",
    "Release Manager",
    "Release Analyst",
    "Resource Manager",
    "Resourcer",
    "Ripple Developer",
    "Ripple Blockchain Administrator",
    "Ripple Blockchain Architect",
    "Ripple Blockchain Consultant",
    "Ripple Blockchain Developer",
    "Ripple Blockchain Manager",
    "Software Developer",
    "Senior Blockchain Developer",
    "Senior Java Developer",
    "Senior Go Developer",
    "Senior Software Engineer",
    "Solution Architect",
    "Security Architect",
    "Service Desk Analyst",
    "Scrum Master",
    "Solidity Developer",
    "Software Engineer Blockchain",
    "Softwaer Engineer C++",
    "SQL Developer",
    "Systems Administrator",
    "Systems Architect",
    "Systems Engineer",
    "Team Lead",
    "Technical Architect",
    "Technical Project Manager",
    "Technical Specialist",
    "Technical Support Analyst",
    "Test Analyst",
    "Technical Consultant",
    "Technical Lead",
    "Test Manager",
    "Test Engineer",
    "Test Automation Engineer",
    "UX Designer",
    "UX Researcher",
    "User Researcher",
    "UI/UX Designer",
    "UX Developer",
    "UX Manager",
    "UX Architect",
    "VBA Developer",
    "Validation Engineer",
    "Visual Designer",
    "Validation Tester",
    "Web Analyst",
    "Web Developer",
    "Web Developer Blockchain",
    "Web Developer PHP",
    "Web Designer",
    "Web Operator",
    "Web Engineer",
    "Web Tester",
    "XML Developer"];


// JSON to call transaction using REST API
/*
{
    "$class": "io.onemillionyearsbc.hubtutorial.jobs.CreateJobPosting",
    "jobReference": "123456",
    "email": "a.hitler@nazis.com",
    "company": "Nazi Party",
    "jobType": "FULLTIME",
    "remote": false,
    "jobTitle": "Dictator",
    "blockchainName": "ETHEREUM",
    "description": "mad idiot needed for Berlin politics job",
    "contact": "M.Bormann",
    "internalRef": "MB01",
    "employer": false,
    "skills": ["ranting", "tank design"],
    "logohash": "baef234efd45689a4"
  }
  */




var countries = Object();

countries['Africa'] = 'Algeria|Angola|Benin|Botswana|Burkina Faso|Burundi|Cameroon|Cape Verde|Central African Republic|Chad|Comoros|Congo, Dem.|Congo, Rep.|Djibouti|Egypt|Equatorial Guinea|Eritrea|Ethiopia|Gabon|Gambia|Ghana|Guinea|Guinea-Bissau|Kenya|Lesotho|Liberia|Libya|Madagascar|Malawi|Mali|Mauritania|Mauritius|Morocco|Mozambique|Namibia|Niger|Nigeria|Rwanda|Sao Tome/Principe|Senegal|Seychelles|Sierra Leone|Somalia|South Africa|Sudan|Swaziland|Tanzania|Togo|Tunisia|Uganda|Zambia|Zimbabwe';
countries['Antarctica'] = 'Amundsen-Scott';
countries['Asia'] = 'Bangladesh|Bhutan|Brunei|Burma (Myanmar)|Cambodia|China|East Timor|India|Indonesia|Japan|Kazakhstan|Korea (north)|Korea (south)|Laos|Malaysia|Maldives|Mongolia|Nepal|Philippines|Russian Federation|Singapore|Sri Lanka|Taiwan|Thailand|Vietnam';
countries['Australia/Oceania'] = 'Australia|Fiji|Kiribati|Micronesia|Nauru|New Zealand|Palau|Papua New Guinea|Samoa|Tonga|Tuvalu|Vanuatu';
countries['Caribbean'] = 'Anguilla|Antigua/Barbuda|Aruba|Bahamas|Barbados|Cozumel|Cuba|Dominica|Dominican Republic|Grenada|Guadeloupe|Haiti|Jamaica|Martinique|Montserrat|Netherlands Antilles|Puerto Rico|St. Barts|St. Kitts/Nevis|St. Lucia|St. Martin/Sint Maarten|St Vincent/Grenadines|San Andres|Trinidad/Tobago|Turks/Caicos';
countries['Central America'] = 'Belize|Costa Rica|El Salvador|Guatemala|Honduras|Nicaragua|Panama';
countries['Europe'] = 'Albania|Andorra|Austria|Belarus|Belgium|Bosnia-Herzegovina|Bulgaria|Croatia|Czech Republic|Denmark|Estonia|Finland|France|Georgia|Germany|Greece|Hungary|Iceland|Ireland|Italy|Latvia|Liechtenstein|Lithuania|Luxembourg|Macedonia|Malta|Moldova|Monaco|Netherlands|Norway|Poland|Portugal|Romania|San Marino|Serbia/Montenegro (Yugoslavia)|Slovakia|Slovenia|Spain|Sweden|Switzerland|Ukraine|United Kingdom|Vatican City';
countries['Islands'] = 'Arctic Ocean|Atlantic Ocean (North)|Atlantic Ocean (South)|Assorted|Caribbean Sea|Greek Isles|Indian Ocean|Mediterranean Sea|Oceania|Pacific Ocean (North)|Pacific Ocean (South)';
countries['Middle East'] = 'Afghanistan|Armenia|Azerbaijan|Bahrain|Cyprus|Iran|Iraq|Israel|Jordan|Kuwait|Kyrgyzstan|Lebanon|Oman|Pakistan|Qatar|Saudi Arabia|Syria|Tajikistan|Turkey|Turkmenistan|United Arab Emirates|Uzbekistan|Yemen';
countries['North America'] = 'Bermuda|Canada|Greenland|Mexico|United States';
countries['South America'] = 'Argentina|Bolivia|Brazil|Chile|Colombia|Ecuador|Guyana|Paraguay|Peru|Suriname|Uruguay|Venezuela';

////////////////////////////////////////////////////////////////////////////
// function
//////////////////////////////////////////////////////////////////////
let towns_near_swindon = ['Melksham', 'Cirencester', 'Faringdon', 'Malmesbury', 'Chippenham', 'Purton', 'Highworth', 'Devizes', 'Swindon', 'Bristol', 'Reading', 'London'];

let city_states = [];
//Africa
city_states['Algeria'] = 'Algiers|Adrar|Ain Defla|Ain Temouchent|Alger|Annaba|Batna|Bechar|Bejaia|Biskra|Blida|Bordj Bou Arreridj|Bouira|Boumerdes|Chlef|Constantine|Djelfa|El Bayadh|El Oued|El Tarf|Ghardaia|Guelma|Illizi|Jijel|Khenchela|Laghouat|Mascara|Medea|Mila|Mostaganem';
city_states['Angola'] = 'Luanda|Bengo|Benguela|Bie|Cabinda|Cuando Cubango|Cuanza Norte|Cuanza Sul|Cunene|Huambo|Huila|Lunda Norte|Lunda Sul|Malanje|Moxico|Namibe|Uige|Zaire';
city_states['Benin'] = 'Porto-Novo|Alibori|Atakora|Atlantique|Borgou|Collines|Couffo|Donga|Littoral|Mono|Oueme|Plateau|Zou';
city_states['Botswana'] = 'Gaborone|Central|Chobe|Francistown|Ghanzi|Kgalagadi|Kgatleng|Kweneng|Lobatse|Ngamiland|North-East|Selebi-Pikwe|South-East|Southern';
city_states['Burkina Faso'] = 'Ouagadougou|Bale|Bam|Banwa|Bazega|Bougouriba|Boulgou|Boulkiemde|Comoe|Ganzourgou|Gnagna|Gourma|Houet|Ioba|Kadiogo|Kenedougou|Komandjari|Kompienga|Kossi|Koupelogo|Kouritenga|Kourweogo|Leraba|Loroum|Mouhoun|Nahouri|Namentenga|Nayala|Naumbiel|Oubritenga|Oudalan|Passore|Poni|Samentenga|Sanguie|Seno|Sissili|Soum|Sourou|Tapoa|Tuy|Yagha|Yatenga|Ziro|Zondomo|Zoundweogo';
city_states['Burundi'] = 'Bujumbura|Bubanza|Bujumbura|Bururi|Cankuzo|Cibitoke|Gitega|Karuzi|Kayanza|Kirundo|Makamba|Muramvya|Muyinga|Mwaro|Ngozi|Rutana|Ruyigi';
city_states['Cameroon'] = 'Yaounde|Adamaoua|Centre|Est|Extreme-Nord|Littoral|Nord|Nord-Ouest|Ouest|Sud|Sud-Ouest';
city_states['Cape Verde'] = 'Praia|Boa Vista|Brava|Calheta|Maio|Mosteiros|Paul|Porto Novo|Ribeira Grande|Sal|Santa Catarina|Santa Cruz|Sao Domingos|Sao Nicolau|Sao Filipe|Sao Vicente|Tarrafal';
city_states['Central African Republic'] = 'Bangui|Bamingui-Bangoran|Basse-Kotto|Gribingui|Haute-Kotto|Haute-Sangha|Haut-Mbomou|Kemo-Gribingui|Lobaye|Mbomou|Nana-Mambere|Ombella-Mpoko|Ouaka|Ouham|Ouham-Pende|Sangha|Vakaga';
city_states['Chad'] = 'Djamena|Assongha|Baguirmi|Bahr El Gazal|Bahr Koh|Batha Oriental|Batha Occidental|Biltine|Borkou|Dababa|Ennedi|Guera|Hadjer Lamis|Kabia|Kanem|Lac|Lac Iro|Logone Occidental|Logone Oriental|Mandoul|Mayo-Boneye|Mayo-Dallah|Monts de Lam|Ouaddai|Salamat|Sila|Tandjile Oriental|Tandjile Occidental|Tibesti';
city_states['Congo, Dem.'] = 'Kinshasa|Bandundu|Bas-Congo|Equateur|Kasai-Occidental|Kasai-Oriental|Katanga|Maniema|Nord-Kivu|Orientale|Sud-Kivu';
city_states['Congo, Rep.'] = 'Brazzaville|Bouenza|Cuvette|Kouilou|Lekoumou|Likouala|Niari|Plateaux|Pool|Sangha';
city_states['Djibouti'] = 'Djibouti|Ali Sabih|Dikhil|Obock|Tadjoura';
city_states['Egypt'] = 'Cairo|Ad Daqahliyah|Al Bahr al Ahmar|Al Buhayrah|Al Fayyum|Al Gharbiyah|Al Iskandariyah|Al Ismailiyah|Al Jizah|Al Minufiyah|Al Minya|Al Qahirah|Al Qalyubiyah|Al Wadi al Jadid|Ash Sharqiyah|As Suways|Aswan|Asyut|Bani Suwayf|Bur Said|Dumyat|Janub Sina|Kafr ash Shaykh|Matruh|Qina|Shamal Sina|Suhaj';
city_states['Equatorial Guinea'] = 'Malabo|Annobon|Bioko Norte|Bioko Sur|Centro Sur|Kie-Ntem|Litoral|Wele-Nzas';
city_states['Eritrea'] = 'Asmara|Central|Anelba|Southern Red Sea|Northern Red Sea|Southern|Gash-Barka';
city_states['Ethiopia'] = 'Addis Ababa|Adis Abeba (Addis Ababa)|Afar|Amara|Binshangul Gumuz|Dire Dawa|Gambela Hizboch|Hareri Hizb|Oromiya|Sumale (Somali)|Tigray|YeDebub Biheroch Bihereseboch...';
city_states['Gabon'] = 'Libreville';
city_states['Gambia'] = 'Estuaire|Haut-Ogooue|Moyen-Ogooue|Ngounie|Nyanga|Ogooue-Ivindo|Ogooue-Lolo|Ogooue-Maritime|Woleu-Ntem';
city_states['Ghana'] = 'Accra|Ashanti|Brong-Ahafo|Central|Eastern|Northern|Upper East|Upper West|Volta|Western';
city_states['Guinea'] = 'Conakry|Beyla|Boffa|Boke|Coyah|Dabola|Dalaba|Dinguiraye|Dubreka|Faranah|Forecariah|Fria|Gaoual|Gueckedou|Kankan|Kerouane|Kindia|Kissidougou|Koubia|Koundara|Kouroussa|Labe|Lelouma|Lola|Macenta|Mali|Mamou|Mandiana|Nzerekore|Pita|Siguiri|Telimele|Tougue|Yomou';
city_states['Guinea-Bissau'] = 'Bissau|Bafata|Biombo|Bolama/Bijagos|Cacheu|Gabu|Oio|Quinara|Tombali';
city_states['Kenya'] = 'Nairobi|Central|Coast|Eastern|Nairobi Area|North Eastern|Nyanza|Rift Valley|Western';
city_states['Lesotho'] = 'Maseru|Berea|Butha-Buthe|Leribe|Mafeteng|Mohales Hoek|Mokhotlong|Qachas Nek|Quthing|Thaba-Tseka';
city_states['Liberia'] = 'Monrovia|Bomi|Bong|Gparbolu|Grand Bassa|Grand Cape Mount|Grand Gedeh|Grand Kru|Lofa|Margibi|Maryland|Montserrado|Nimba|River Cess|River Gee|Sinoe';
city_states['Libya'] = 'Tripoli|Ajdabiya|Al Aziziyah|Al Fatih|Al Jabal al Akhdar|Al Jufrah|Al Khums|Al Kufrah|An Nuqat al Khams|Ash Shati|Awbari|Az Zawiyah|Banghazi|Darnah|Ghadamis|Gharyan|Misratah|Murzuq|Sabha|Sawfajjin|Surt|Tarabulus|Tarhunah|Tubruq|Yafran|Zlitan';
city_states['Madagascar'] = 'Antananarivo|Antsiranana|Fianarantsoa|Mahajanga|Toamasina|Toliara';
city_states['Malawi'] = 'Lilongwe|Balaka|Blantyre|Chikwawa|Chiradzulu|Chitipa|Dedza|Dowa|Karonga|Kasungu|Likoma|Machinga (Kasupe)|Mangochi|Mchinji|Mulanje|Mwanza|Mzimba|Ntcheu|Nkhata Bay|Nkhotakota|Nsanje|Ntchisi|Phalombe|Rumphi|Salima|Thyolo|Zomba';
city_states['Mali'] = 'Bamako|Gao|Kayes|Kidal|Koulikoro|Mopti|Segou|Sikasso|Tombouctou';
city_states['Mauritania'] = 'Nouakchott|Adrar|Assaba|Brakna|Dakhlet Nouadhibou|Gorgol|Guidimaka|Hodh Ech Chargui|Hodh El Gharbi|Inchiri|Tagant|Tiris Zemmour|Trarza';
city_states['Mauritius'] = 'Port Louis|Agalega Islands|Black River|Cargados Carajos Shoals|Flacq|Grand Port|Moka|Pamplemousses|Plaines Wilhems|Riviere du Rempart|Rodrigues|Savanne';
city_states['Morocco'] = 'Rabat|Ad Dakhla (Oued Eddahab)|Agadir|Al Hoceima|Azilal|Beni Mellal|Ben Slimane|Boujdour|Boulemane|Casablanca|Chaouen|El Jadida|El Kelaa des Sraghna|Er Rachidia|Essaouira|Es Smara|Fes|Figuig|Guelmim|Ifrane|Kenitra|Khemisset|Khenifra|Khouribga|Laayoune|Larache|Marrakech|Meknes|Nador|Ouarzazate|Oujda|Safi|Settat|Sidi Kacem|Tanger|Tan-Tan|Taounate|Taroudannt|Tata|Taza|Tetouan|Tiznit';
city_states['Mozambique'] = 'Maputo|Cabo Delgado|Gaza|Inhambane|Manica|Maputo|Nampula|Niassa|Sofala|Tete|Zambezia';
city_states['Namibia'] = 'Windhoek|Caprivi|Erongo|Hardap|Karas|Khomas|Kunene|Ohangwena|Okavango|Omaheke|Omusati|Oshana|Oshikoto|Otjozondjupa';
city_states['Niger'] = 'Niamey|Agadez|Diffa|Dosso|Maradi|Tahoua|Tillaberi|Zinder';
city_states['Nigeria'] = 'Abuja|Abia|Adamawa|Akwa Ibom|Anambra|Bauchi|Bayelsa|Benue|Borno|Cross River|Delta|Ebonyi|Edo|Ekiti|Enugu|Gombe|Imo|Jigawa|Kaduna|Kano|Katsina|Kebbi|Kogi|Kwara|Lagos|Nassarawa|Niger|Ogun|Ondo|Osun|Oyo|Plateau|Rivers|Sokoto|Taraba|Yobe|Zamfara';
city_states['Rwanda'] = 'Kigali|Butare|Byumba|Cyangugu|Gikongoro|Gisenyi|Gitarama|Kibungo|Kibuye|Ruhengeri|Umutara';
city_states['Sao Tome/Principe'] = 'Sao Tome|Principe';
city_states['Senegal'] = 'Dakar|Diourbel|Fatick|Kaolack|Kolda|Louga|Matam|Saint-Louis|Tambacounda|Thies|Ziguinchor';
city_states['Seychelles'] = 'Victoria|Anse aux Pins|Anse Boileau|Anse Etoile|Anse Louis|Anse Royale|Baie Lazare|Baie Sainte Anne|Beau Vallon|Bel Air|Bel Ombre|Cascade|Glacis|Grand Anse (on Mahe)|Grand Anse (on Praslin)|La Digue|La Riviere Anglaise|Mont Buxton|Mont Fleuri|Plaisance|Pointe La Rue|Port Glaud|Saint Louis|Takamaka';
city_states['Sierra Leone'] = 'Freetown|Eastern|Northern|Southern|Western';
city_states['Somalia'] = 'Mogadishu|Awdal|Bakool|Banaadir|Bari|Bay|Galguduud|Gedo|Hiiraan|Jubbada Dhexe|Jubbada Hoose|Mudug|Nugaal|Sanaag|Shabeellaha Dhexe|Shabeellaha Hoose|Sool|Togdheer|Woqooyi Galbeed';
city_states['South Africa'] = 'Pretoria|Eastern Cape|Free State|Gauteng|KwaZulu-Natal|Mpumalanga|North-West|Northern Cape|Northern Province/Limpopo|Western Cape';
city_states['Sudan'] = 'Khartoum|Aali an Nil|Al Bahr al Ahmar|Al Buhayrat|Al Jazirah|Al Khartum|Al Qadarif|Al Wahdah|An Nil al Abyad|An Nil al Azraq|Ash Shamaliyah|Bahr al Jabal|Gharb al Istiwaiyah|Gharb Bahr al Ghazal|Gharb Darfur|Gharb Kurdufan|Janub Darfur|Janub Kurdufan|Junqali|Kassala|Nahr an Nil|Shamal Bahr al Ghazal|Shamal Darfur|Shamal Kurdufan|Sharq al Istiwaiyah|Sinnar|Warab';
city_states['Swaziland'] = 'Lobamba/Mbabane|Hhohho|Lubombo|Manzini|Shiselweni';
city_states['Tanzania'] = 'Dodoma|Arusha|Dar es Salaam|Iringa|Kagera|Kigoma|Kilimanjaro|Lindi|Mara|Mbeya|Morogoro|Mtwara|Mwanza|Pemba North|Pemba South|Pwani|Rukwa|Ruvuma|Shinyanga|Singida|Tabora|Tanga|Zanzibar Central/South|Zanzibar North|Zanzibar Urban/West';
city_states['Togo'] = 'Lome|De La Kara|Des Plateaux|Des Savanes|Centrale|Maritime';
city_states['Tunisia'] = 'Tunis|Ariana|Beja|Ben Arous|Bizerte|El Kef|Gabes|Gafsa|Jendouba|Kairouan|Kasserine|Kebili|Mahdia|Medenine|Monastir|Nabeul|Sfax|Sidi Bou Zid|Siliana|Sousse|Tataouine|Tozeur|Zaghouan';
city_states['Uganda'] = 'Kampala|Adjumani|Apac|Arua|Bugiri|Bundibugyo|Bushenyi|Busia|Gulu|Hoima|Iganga|Jinja|Kabale|Kabarole|Kaberamaido|Kalangala|Kamuli|Kamwenge|Kanungu|Kapchorwa|Kasese|Katakwi|Kayunga|Kibale|Kiboga|Kisoro|Kitgum|Kotido|Kumi|Kyenjojo|Lira|Luwero|Masaka|Masindi|Mayngc|Mbale|Mbarara|Moroto|Moyo|Mpigi|Mubende|Mukono|Nakapiripiti|Nakasongola|Nebbi|Ntungamo|Pader|Pallisa|Rakai|Rukungiri|Sembabule|Sironko|Soroti|Tororo|Wakiso|Yumbe';
city_states['Zambia'] = 'Lusaka|Central|Copperbelt|Eastern|Luapula|Lusaka|Northern|North-Western|Southern|Western';
city_states['Zimbabwe'] = 'Harare|Bulawayo|Manicaland|Mashonaland Central|Mashonaland East|Mashonaland West|Masvingo|Matabeleland North|Matabeleland South|Midlands';


//Asia
city_states['Bangladesh'] = 'Dhaka|Barisal|Chittagong|Khulna|Rajshahi|Sylhet';
city_states['Bhutan'] = 'Thimphu|Bumthang|Chhukha|Chirang|Dagana|Gasa|Geylegphug|Ha|Lhuntshi|Mongar|Paro|Pemagatsel|Punakha|Samchi|Samdrup Jongkhar|Shemgang|Tashigang|Tongsa|Wangdi Phodrang|Yangtse';
city_states['Brunei'] = 'Bandar Seri Begawan|Belait|Brunei/Muara|Temburong|Tutong';
city_states['Burma (Myanmar)'] = 'Rangoon|Ayeyarwady|Bago|Chin|Kachin|Kayin|Kayah|Magway|Mandalay|Mon|Rakhine|Sagaing|Shan|Tanintharyi|Yangon';
city_states['Cambodia'] = 'Phnom Penh|Banteay Mean Cheay|Batdambang|Kampong Cham|Kampong Chhnang|Kampong Spoe|Kampong Thum|Kampot|Kandal|Kaoh Kong|Keb|Kracheh|Mondol Kiri|Otdar Mean Cheay|Pailin|Pouthisat|Preah Seihanu (Sihanoukville)|Preah Vihear|Prey Veng|Rotanah Kiri|Siem Reab|Stoeng Treng|Svay Rieng|Takev';
city_states['China'] = 'Beijing|Anhui|Chongqing|Fujian|Gansu|Guangdong|Guangxi|Guizhou|Hainan|Hebei|Heilongjiang|Henan|Hubei|Hunan|Jiangsu|Jiangxi|Jilin|Liaoning|Nei Mongol|Ningxia|Qinghai|Shaanxi|Shandong|Shanghai|Shanxi|Sichuan|Tianjin|Xinjiang|Xizang (Tibet)|Yunnan|Zhejiang';
city_states['East Timor'] = 'Dili|Aileu|Ainaro|Baucau|Bobonaro (Maliana)|Cova-Lima (Suai)|Ermera|Lautem (Los Palos)|Liquica|Manatuto|Manufahi (Same)|Oecussi (Ambeno)|Viqueque';
city_states['India'] = 'New Delhi|Andaman/Nicobar Islands|Andhra Pradesh|Arunachal Pradesh|Assam|Bihar|Chandigarh|Chhattisgarh|Dadra/Nagar Haveli|Daman/Diu|Goa|Gujarat|Haryana|Himachal Pradesh|Jammu/Kashmir|Jharkhand|Karnataka|Kerala|Lakshadweep|Madhya Pradesh|Maharashtra|Manipur|Meghalaya|Mizoram|Nagaland|Orissa|Pondicherry|Punjab|Rajasthan|Sikkim|Tamil Nadu|Tripura|Uttaranchal|Uttar Pradesh|West Bengal';
city_states['Indonesia'] = 'Jakarta|Aceh|Bali|Banten|Bengkulu|Gorontalo|Jakarta Raya|Jambi|Jawa Barat|Jawa Tengah|Jawa Timur|Kalimantan Barat|Kalimantan Selatan|Kalimantan Tengah|Kalimantan Timur|Kepulauan Bangka Belitung|Lampung|Maluku|Maluku Utara|Nusa Tenggara Barat|Nusa Tenggara Timur|Papua|Riau|Sulawesi Selatan|Sulawesi Tengah|Sulawesi Tenggara|Sulawesi Utara|Sumatera Barat|Sumatera Selatan|Sumatera Utara|Yogyakarta';
city_states['Japan'] = 'Tokyo|Aichi|Akita|Aomori|Chiba|Ehime|Fukui|Fukuoka|Fukushima|Gifu|Gumma|Hiroshima|Hokkaido|Hyogo|Ibaraki|Ishikawa|Iwate|Kagawa|Kagoshima|Kanagawa|Kochi|Kumamoto|Kyoto|Mie|Miyagi|Miyazaki|Nagano|Nagasaki|Nara|Niigata|Oita|Okayama|Okinawa|Osaka|Saga|Saitama|Shiga|Shimane|Shizuoka|Tochigi|Tokushima|Tokyo|Tottori|Toyama|Wakayama|Yamagata|Yamaguchi|Yamanashi';
city_states['Kazakhstan'] = 'Astana|Almaty|Almaty|Aqmola|Aqtobe|Astana|Atyrau|Batys Qazaqstan|Bayqongyr|Mangghystau|Ongtustik Qazaqstan|Pavlodar|Qaraghandy|Qostanay|Qyzylorda|Shyghys Qazaqstan|Soltustik Qazaqstan|Zhambyl';
city_states['Korea (north)'] = 'Pyongyang|Chagang-do|Hamgyong-bukto|Hamgyong-namdo|Hwanghae-bukto|Hwanghae-namdo|Kaesong-si|Kangwon-do|Najin Sonbong-si|Nampo-si|Pyongan-bukto|Pyongan-namdo|Pyongyang-si|Yanggang-do';
city_states['Korea (south)'] = 'Seoul|Cheju-do|Cholla-bukto|Cholla-namdo|Chungchong-bukto|Chungchong-namdo|Inchon-gwangyoksi|Kangwon-do|Kwangju-gwangyoksi|Kyonggi-do|Kyongsang-bukto|Kyongsang-namdo|Pusan-gwangyoksi|Soul-tukpyolsi|Taegu-gwangyoksi|Taejon-gwangyoksi|Ulsan-gwangyoksi';
city_states['Laos'] = 'Vientiane|Attapu|Bokeo|Bolikhamxai|Champasak|Houaphan|Khammouan|Louangnamtha|Louangphabang|Oudomxai|Phongsali|Salavan|Savannakhet|Viangchan|Viangchan|Xaignabouli|Xaisomboun|Xekong|Xiangkhoang';
city_states['Malaysia'] = 'Kuala Lumpur|Johor|Kedah|Kelantan|Labuan|Melaka|Negeri Sembilan|Pahang|Perak|Perlis|Pulau Pinang|Putrajaya|Sabah|Sarawak|Selangor|Terengganu|Wilayah Persekutuan';
city_states['Maldives'] = 'Maale|Alifu|Baa|Dhaalu|Faafu|Gaafu Alifu|Gaafu Dhaalu|Gnaviyani|Haa Alifu|Haa Dhaalu|Kaafu|Laamu|Lhaviyani|Meemu|Noonu|Raa|Seenu|Shaviyani|Thaa|Vaavu';
city_states['Mongolia'] = 'Ulaanbaatar|Arhangay|Bayanhongor|Bayan-Olgiy|Bulgan|Darhan Uul|Dornod|Dornogovi|Dundgovi|Dzavhan|Govi-Altay|Govi-Sumber|Hentiy|Hovd|Hovsgol|Omnogovi|Orhon|Ovorhangay|Selenge|Suhbaatar|Tov|Uvs';
city_states['Nepal'] = 'Kathmandu|Bagmati|Bheri|Dhawalagiri|Gandaki|Janakpur|Karnali|Kosi|Lumbini|Mahakali|Mechi|Narayani|Rapti|Sagarmatha|Seti';
city_states['Philippines'] = 'Manila|Oriental|North Cotabato|Northern Samar|Nueva Ecija|Nueva Vizcaya|Olongapo|Ormoc|Oroquieta|Ozamis|Pagadian|Palawan|Palayan|Pampanga|Pangasinan|Pasay|Puerto Princesa|Quezon|Quezon City|Quirino|Rizal|Romblon|Roxas|Samar|San Carlos (Negros Occidental)|San Carlos (Pangasinan)|San Jose|San Pablo|Silay|Siquijor|Sorsogon|South Cotabato|Southern Leyte|Sultan Kudarat|Sulu|Surigao|Surigao del Norte|Surigao del Sur|Tacloban|Tagaytay|Tagbilaran|Tangub|Tarlac|Tawi-Tawi|Toledo|Trece Martires|Zambales|Zamboanga|Zamboanga del Norte|Zamboanga del Sur';
city_states['Russian Federation'] = 'Moskva (Moscow)|Adygeya (Maykop)|Aginskiy Buryatskiy (Aginskoye)|Altay (Gorno-Altaysk)|Altayskiy (Barnaul)|Amurskaya (Blagoveshchensk)|Arkhangelskaya|Astrakhanskaya|Bashkortostan (Ufa)|Belgorodskaya|Bryanskaya|Buryatiya (Ulan-Ude)|Chechnya (Groznyy)|Chelyabinskaya|Chitinskaya|Chukotskiy (Anadyr)|Chuvashiya (Cheboksary)|Dagestan (Makhachkala)|Evenkiyskiy (Tura)|Ingushetiya (Nazran)|Irkutskaya|Ivanovskaya|Kabardino-Balkariya (Nalchik)|Kaliningradskaya|Kalmykiya (Elista)|Kaluzhskaya|Kamchatskaya (Petropavlovsk-Kamchatskiy)|Karachayevo-Cherkesiya (Cherkessk)|Kareliya (Petrozavodsk)|Kemerovskaya|Khabarovskiy|Khakasiya (Abakan)|Khanty-Mansiyskiy (Khanty-Mansiysk)|Kirovskaya|Komi (Syktyvkar)|Koryakskiy (Palana)|Kostromskaya|Krasnodarskiy|Krasnoyarskiy|Kurganskaya|Kurskaya|Leningradskaya|Lipetskaya|Magadanskaya|Mariy-El (Yoshkar-Ola)|Mordoviya (Saransk)|Moskovskaya|Murmanskaya|Nenetskiy (Naryan-Mar)|Nizhegorodskaya|Novgorodskaya|Novosibirskaya|Omskaya|Orenburgskaya|Orlovskaya (Orel)|Penzenskaya|Permskaya|Komi-Permyatskiy (Kudymkar)|Primorskiy (Vladivostok)|Pskovskaya|Rostovskaya|Ryazanskaya|Sakha (Yakutiya)|Sakhalinskaya (Yuzhno-Sakhalinsk)|Samarskaya|Sankt-Peterburg (Saint Petersburg)|Saratovskaya|Severnaya Osetiya-Alaniya [North Ossetia] (Vladikavkaz)|Smolenskaya|Stavropolskiy|Sverdlovskaya (Yekaterinburg)|Tambovskaya|Tatarstan (Kazan)|Taymyrskiy (Dudinka)|Tomskaya|Tulskaya|Tverskaya|Tyumenskaya|Tyva (Kyzyl)|Udmurtiya (Izhevsk)|Ulyanovskaya|Ust-Ordynskiy Buryatskiy (Ust-Ordynskiy)|Vladimirskaya|Volgogradskaya|Vologodskaya|Voronezhskaya|Yamalo-Nenetskiy (Salekhard)|Yaroslavskaya|Yevreyskaya';
city_states['Singapore'] = '';
city_states['Sri Lanka'] = 'Colombo|Central|North Central|Northern|Eastern|North Western|Sabaragamuwa|Southern|Uva|Western';
city_states['Taiwan'] = 'Taipei|Chang-hua|Chia-i|Chi-lung|Chung-hsing-hsin-tsun|Hsin-chu|Hua-lien|I-lan|Kao-hsiung|Miao-li|Nan-tou|Peng-hu|Ping-tung|Tai-chung|Tai-nan|Tai-pei|Tai-tung|Tao-yuan/Yun-lin';
city_states['Thailand'] = 'Bangkok|Amnat Charoen|Ang Thong|Buriram|Chachoengsao|Chai Nat|Chaiyaphum|Chanthaburi|Chiang Mai|Chiang Rai|Chon Buri|Chumphon|Kalasin|Kamphaeng Phet|Kanchanaburi|Khon Kaen|Krabi|Lampang|Lamphun|Loei|Lop Buri|Mae Hong Son|Maha Sarakham|Mukdahan|Nakhon Nayok|Nakhon Pathom|Nakhon Phanom|Nakhon Ratchasima|Nakhon Sawan|Nakhon Si Thammarat|Nan|Narathiwat|Nong Bua Lamphu|Nong Khai|Nonthaburi|Pathum Thani|Pattani|Phangnga|Phatthalung|Phayao|Phetchabun|Phetchaburi|Phichit|Phitsanulok|Phra Nakhon Si Ayutthaya|Phrae|Phuket|Prachin Buri|Prachuap Khiri Khan|Ranong|Ratchaburi|Rayong|Roi Et|Sa Kaeo|Sakon Nakhon|Samut Prakan|Samut Sakhon|Samut Songkhram|Sara Buri|Satun|Sing';
city_states['Vietnam'] = 'Hanoi|An Giang|Bac Giang|Bac Kan|Bac Lieu|Bac Ninh|Ba Ria-Vung Tau|Ben Tre|Binh Dinh|Binh Duong|Binh Phuoc|Binh Thuan|Ca Mau|Can Tho|Cao Bang|Dac Lak|Da Nang|Dong Nai|Dong Thap|Gia Lai|Ha Giang|Hai Duong|Hai Phong|Ha Nam|Ha Noi|Ha Tay|Ha Tinh|Hoa Binh|Ho Chi Minh|Hung Yen|Khanh Hoa|Kien Giang|Kon Tum|Lai Chau|Lam Dong|Lang Son|Lao Cai|Long An|Nam Dinh|Nghe An|Ninh Binh|Ninh Thuan|Phu Tho|Phu Yen|Quang Binh|Quang Nam|Quang Ngai|Quang Ninh|Quang Tri|Soc Trang|Son La|Tay Ninh|Thai Binh|Thai Nguyen|Thanh Hoa|Thua Thien-Hue|Tien Giang|Tra Vinh|Tuyen Quang|Vinh Long|Vinh Phuc|Yen Bai';


//Australia-Oceania
city_states['Australia'] = 'Canberra|Australian Capital Territory|New South Wales|Northern Territory|Queensland|South Australia|Tasmania|Victoria|Western Australia';
city_states['Fiji'] = 'Suva|Central|Eastern|Northern|Rotuma|Western';
city_states['Kiribati'] = 'Tarawa|Abaiang|Abemama|Aranuka|Arorae|Banaba|Beru|Butaritari|Gilberts (Central)|Gilberts (Northern)|Gilberts (Southern)|Kanton|Kiritimati|Kuria|Line Islands|Maiana|Makin|Marakei|Nikunau|Nonouti|Onotoa|Phoenix Islands|Tabiteuea|Tabuaeran|Tamana|Teraina';
city_states['Micronesia'] = 'Palikir|Chuuk (Truk)|Kosrae|Pohnpei|Yap';
city_states['Nauru'] = 'Yaren|Aiwo|Anabar|Anetan|Anibare|Baiti|Boe|Buada|Denigomodu|Ewa|Ijuw|Meneng|Nibok|Uaboe';
city_states['New Zealand'] = 'Wellington|Akaroa|Amuri|Ashburton|Auckland|Banks Peninsula|Bay of Islands|Bay of Plenty|Bruce|Buller|Canterbury|Carterton|Chatham Islands|Cheviot|Christchurch|Clifton|Clutha|Cook|Dannevirke|Dunedin|Egmont|Eketahuna|Ellesmere|Eltham|Eyre|Far North|Featherston|Franklin|Gisborne|Golden Bay|Gore|Great Barrier Island|Grey|Hamilton|Hastings|Hauraki Plains|Hawera|Hawkes Bay|Heathcote|Hikurangi|Hobson|Hokianga|Horowhenua|Hurunui|Hutt|Inangahua|Inglewood|Invercargill|Kaikoura|Kaipara|Kairanga|Kapiti Coast|Kawerau|Kiwitea|Lake|Mackenzie|Malvern|Manaia|Manawatu|Mangonui|Maniototo|Manukau|Marlborough|Masterton|Matamata|Matamata Piako|Mount Herbert|Napier|Nelson|Nelson|New Plymouth|Northland|North Shore|Ohinemuri|Opotiki|Oroua|Otago|Otamatea|Otorohanga|Oxford|Palmerston North|Pahiatua|Papakura|Paparua|Patea|Piako|Pohangina|Porirua|Queenstown Lakes|Raglan|Rangiora|Rangitikei|Rodney|Rotorua|Ruapehu|Runanga|Saint Kilda|Selwyn|Silverpeaks|Southland|South Taranaki|South Waikato|South Wairarapa|Stewart Island|Stratford|Strathallan|Taranaki|Tararua|Tasman|Taumarunui|Taupo|Tauranga|Thames Coromandel|Timaru|Tuapeka|Upper Hutt|Vincent|Waiapu|Waiheke|Waihemo|Waikato|Waikohu|Waimairi|Waimarino|Waimate|Waimate West|Waimea|Waipa|Waipawa|Waipukurau|Wairarapa South|Wairewa|Wairoa|Waitakere|Waitaki|Waitomo|Waitotara|Wallace|Wanganui|Wanganui-Manawatu|Waverley|West Coast|Western Bay of Plenty|Westland|Whakatane|Whangarei|Whangaroa|Woodville';
city_states['Palau'] = 'Koror|Aimeliik|Airai|Angaur|Hatobohei|Kayangel|Melekeok|Ngaraard|Ngarchelong|Ngardmau|Ngatpang|Ngchesar|Ngeremlengui|Ngiwal|Peleliu|Sonsoral';
city_states['Papua New Guinea'] = 'Port Moresby|Bougainville|Central|Chimbu|Eastern Highlands|East New Britain|East Sepik|Enga|Gulf|Madang|Manus|Milne Bay|Morobe|National Capital|New Ireland|Northern|Sandaun|Southern Highlands|Western|Western Highlands|West New Britain';
city_states['Samoa'] = 'Apia|Aana|Aiga-i-le-Tai|Atua|Faasaleleaga|Gagaemauga|Gagaifomauga|Palauli|Satupaitea|Tuamasaga|Vaa-o-Fonoti|Vaisigano';
city_states['Tonga'] = 'Nukualofa|Haapai|Tongatapu|Vavau';
city_states['Tuvalu'] = 'Fongafale';
city_states['Vanuatu'] = 'Port-Vila|Malampa|Penama|Sanma|Shefa|Tafea|Torba';


//Caribbean
city_states['Anguilla'] = 'The Valley';
city_states['Antigua/Barbuda'] = 'Saint John|Barbuda|Redonda|Saint George|Saint Mary|Saint Paul|Saint Peter|Saint Philip';
city_states['Aruba'] = 'Oranjestad';
city_states['Bahamas'] = 'Nassau|Acklins/Crooked Islands|Bimini|Cat Island|Exuma|Freeport|Fresh Creek|Governors Harbour|Green Turtle Cay|Harbour Island|High Rock|Inagua|Kemps Bay|Long Island|Marsh Harbour|Mayaguana|New Providence|Nichollstown/Berry Islands|Ragged Island|Rock Sound|Sandy Point|San Salvador/Rum Cay';
city_states['Barbados'] = 'Bridgetown|Christ Church|Saint Andrew|Saint George|Saint James|Saint John|Saint Joseph|Saint Lucy|Saint Michael|Saint Peter|Saint Philip|Saint Thomas';
city_states['Cuba'] = 'Havana|Camaguey|Ciego de Avila|Cienfuegos|Ciudad de La Habana|Granma|Guantanamo|Holguin|Isla de la Juventud|La Habana|Las Tunas|Matanzas|Pinar del Rio|Sancti Spiritus|Santiago de Cuba|Villa Clara';
city_states['Dominica'] = 'Roseau|Saint Andrew|Saint David|Saint George|Saint John|Saint Joseph|Saint Luke|Saint Mark|Saint Patrick|Saint Paul|Saint Peter';
city_states['Dominican Republic'] = 'Santo Domingo|Azua|Baoruco|Barahona|Dajabon|Distrito Nacional|Duarte|Elias Pina|El Seibo|Espaillat|Hato Mayor|Independencia|La Altagracia|La Romana|La Vega|Maria Trinidad Sanchez|Monsenor Nouel|Monte Cristi|Monte Plata|Pedernales|Peravia|Puerto Plata|Salcedo|Samana|Sanchez Ramirez|San Cristobal|San Juan|San Pedro de Macoris|Santiago|Santiago Rodriguez|Valverde';
city_states['Grenada'] = 'Saint Georges|Carriacou/Petit Martinique|Saint Andrew|Saint David|Saint John|Saint Mark|Saint Patrick';
city_states['Guadeloupe'] = 'Basse-Terre';
city_states['Haiti'] = 'Port-au-Prince|Artibonite|Centre|Grand Anse|Nord|Nord-Est|Nord-Ouest|Ouest|Sud|Sud-Est';
city_states['Jamaica'] = 'Kingston|Clarendon|Hanover|Manchester|Portland|Saint Andrew|Saint Ann|Saint Catherine|Saint Elizabeth|Saint James|Saint Mary|Saint Thomas|Trelawny|Westmoreland';
city_states['Martinique'] = 'Fort-de-France';
city_states['Montserrat'] = 'Brades Estate|Plymouth|Saint Anthony|Saint Georges|Saint Peter';
city_states['Netherlands Antilles'] = 'Willemstad';
city_states['Puerto Rico'] = 'San Juan|Adjuntas|Aguada|Aguadilla|Aguas Buenas|Aibonito|Anasco|Arecibo|Arroyo|Barceloneta|Barranquitas|Bayamon|Cabo Rojo|Caguas|Camuy|Canovanas|Carolina|Catano|Cayey|Ceiba|Ciales|Cidra|Coamo|Comerio|Corozal|Culebra|Dorado|Fajardo|Florida|Guanica|Guayama|Guayanilla|Guaynabo|Gurabo|Hatillo|Hormigueros|Humacao|Isabela|Jayuya|Juana Diaz|Juncos|Lajas|Lares|Las Marias|Las Piedras|Loiza|Luquillo|Manati|Maricao|Maunabo|Mayaguez|Moca|Morovis|Naguabo|Naranjito|Orocovis|Patillas|Penuelas|Ponce|Quebradillas|Rincon|Rio Grande|Sabana Grande|Salinas|San German|San Lorenzo|San Sebastian|Santa Isabel|Toa Alta|Toa Baja|Trujillo Alto|Utuado|Vega Alta|Vega Baja|Vieques|Villalba|Yabucoa|Yauco';
city_states['St. Barts'] = '';
city_states['St. Kitts/Nevis'] = 'Basseterre|Christ Church Nichola Town|St. Anne Sandy Point|St. George Basseterre|St. George Gingerland|St. James Windward|St. John Capesterre|St. John Figtree|St. Mary Cayon|St. Paul Capesterre|St. Paul Charlestown|St. Peter Basseterre|St. Thomas Lowland|St. Thomas Middle Island|Trinity Palmetto Point';
city_states['St. Lucia'] = 'Castries|Anse-la-Raye|Castries|Choiseul|Dauphin|Dennery|Gros-Islet|Laborie|Micoud|Praslin|Soufriere|Vieux-Fort';
city_states['St. Martin/Sint Maarten'] = '';
city_states['St Vincent/Grenadines'] = 'Kingstown|Charlotte|Grenadines|Saint Andrew|Saint David|Saint George|Saint Patrick';
city_states['San Andres'] = '';
city_states['Trinidad/Tobago'] = 'Port-of-Spain|Arima|Caroni|Mayaro|Nariva|Saint Andrew|Saint David|Saint George|Saint Patrick|San Fernando|Tobago|Victoria';
city_states['Turks/Caicos'] = 'Grand Turk (Cockburn Town)';


//Central America
city_states['Belize'] = 'Belmopan|Belize|Cayo|Corozal|Orange Walk|Stann Creek|Toledo';
city_states['Costa Rica'] = 'San Jose|Alajuela|Cartago|Guanacaste|Heredia|Limon|Puntarenas';
city_states['El Salvador'] = 'San Salvador|Ahuachapan|Cabanas|Chalatenango|Cuscatlan|La Libertad|La Paz|La Union|Morazan|San Miguel|Santa Ana|San Vicente|Sonsonate|Usulutan';
city_states['Guatemala'] = 'Guatemala|Alta Verapaz|Baja Verapaz|Chimaltenango|Chiquimula|El Progreso|Escuintla|Guatemala|Huehuetenango|Izabal|Jalapa|Jutiapa|Peten|Quetzaltenango|Quiche|Retalhuleu|Sacatepequez|San Marcos|Santa Rosa|Solola|Suchitepequez|Totonicapan|Zacapa';
city_states['Honduras'] = 'Tegucigalpa|Atlantida|Choluteca|Colon|Comayagua|Copan|Cortes|El Paraiso|Francisco Morazan|Gracias a Dios|Intibuca|Islas de la Bahia|La Paz|Lempira|Ocotepeque|Olancho|Santa Barbara|Valle|Yoro';
city_states['Nicaragua'] = 'Managua|Boaco|Carazo|Chinandega|Chontales|Esteli|Granada|Jinotega|Leon|Madriz|Managua|Masaya|Matagalpa|Nueva Segovia|Rio San Juan|Rivas|Atlantico Norte|Atlantico Sur';
city_states['Panama'] = 'Panama|Bocas del Toro|Chiriqui|Cocle|Colon|Darien|Herrera|Los Santos|San Blas|Veraguas';


//Europe
city_states['Albania'] = 'Tirana|Berat|Bulqize|Delvine|Devoll|Diber|Durres|Elbasan|Fier|Gjirokaster|Gramsh|Has|Kavaje|Kolonje|Korce|Kruje|Kucove|Kukes|Kurbin|Lezhe|Librazhd|Lushnje|Malesi e Madhe|Mallakaster|Mat|Mirdite|Peqin|Permet|Pogradec|Puke|Sarande|Shkoder|Skrapar|Tepelene|Tirane|Tropoje|Vlore';
city_states['Andorra'] = 'Andorra la Vella|Canillo|Encamp|La Massana|Escaldes-Engordany|Ordino|Sant Julia de Loria';
city_states['Austria'] = 'Vienna|Burgenland|Kaernten|Niederoesterreich|Oberoesterreich|Salzburg|Steiermark|Tirol|Vorarlberg|Wien';
city_states['Belarus'] = 'Minsk|Brest|Homyel|Horad Minsk|Hrodna|Mahilyow|Vitsyebsk';
city_states['Belgium'] = 'Brussels|Antwerpen|Brabant Wallon|Brussels (Bruxelles)|Hainaut|Liege|Limburg|Luxembourg|Namur|Oost-Vlaanderen|Vlaams-Brabant|West-Vlaanderen';
city_states['Bosnia/Herzegovina'] = 'Sarajevo';
city_states['Bulgaria'] = 'Sofiya|Blagoevgrad|Burgas|Dobrich|Gabrovo|Khaskovo|Kurdzhali|Kyustendil|Lovech|Montana|Pazardzhik|Pernik|Pleven|Plovdiv|Razgrad|Ruse|Shumen|Silistra|Sliven|Smolyan|Sofiya-Grad|Stara Zagora|Turgovishte|Varna|Veliko Turnovo|Vidin|Vratsa|Yambol';
city_states['Croatia'] = 'Zagreb|Bjelovarsko-Bilogorska|Brodsko-Posavska|Dubrovacko-Neretvanska|Istarska|Karlovacka|Koprivnicko-Krizevacka|Krapinsko-Zagorska|Licko-Senjska|Medimurska|Osjecko-Baranjska|Pozesko-Slavonska|Primorsko-Goranska|Sibensko-Kninska|Sisacko-Moslavacka|Splitsko-Dalmatinska|Varazdinska|Viroviticko-Podravska|Vukovarsko-Srijemska|Zadarska|Zagrebacka';
city_states['Czech Republic'] = 'Prague (Praha)|Jihocesky|Jihomoravsky|Karlovarsky|Kralovehradecky|Liberecky|Moravskoslezsky|Olomoucky|Pardubicky|Plzensky|Stredocesky|Ustecky|Vysocina|Zlinsky';
city_states['Denmark'] = 'Copenhagen (Kobenhavn)|Arhus|Bornholm|Fredericksberg|Frederiksborg|Fyn|Kobenhavns|Nordjylland|Ribe|Ringkobing|Roskilde|Sonderjylland|Storstrom|Vejle|Vestsjalland|Viborg';
city_states['Estonia'] = 'Harjumaa (Tallinn)|Hiiumaa (Kardla)|Ida-Virumaa (Johvi)|Jarvamaa (Paide)|Jogevamaa (Jogeva)|Laanemaa (Haapsalu)|Laane-Virumaa (Rakvere)|Parnumaa (Parnu)|Polvamaa (Polva)|Raplamaa (Rapla)|Saaremaa (Kuressaare)|Tartumaa (Tartu)|Valgamaa (Valga)|Viljandimaa (Viljandi)|Vorumaa (Voru)';
city_states['Finland'] = 'Helsinki|Aland|Etela-Suomen Laani|Ita-Suomen Laani|Lansi-Suomen Laani|Lappi|Oulun Laani';
city_states['France'] = 'Paris|Alsace|Aquitaine|Auvergne|Basse-Normandie|Bourgogne|Bretagne|Centre|Champagne-Ardenne|Corse|Franche-Comte|Haute-Normandie|Ile-de-France|Languedoc-Roussillon|Limousin|Lorraine|Midi-Pyrenees|Nord-Pas-de-Calais|Pays de la Loire|Picardie|Poitou-Charentes|Provence-Alpes-Cote dAzur|Rhone-Alpes';
city_states['Georgia'] = 'Tbilisi|Batumi|Chiatura|Gori|Guria|Imereti|Kakheti|Kutaisi|Kvemo Kartli|Mtskheta-Mtianeti|Poti|Racha-Lechkhumi/Kvemo Svaneti|Rustavi|Samegrelo/Zemo Svaneti|Samtskhe-Javakheti|Shida Kartli|Sokhumi|Tqibuli|Tsqaltubo|Zugdidi';
city_states['Germany'] = 'Berlin|Baden-Wuerttemberg|Bayern|Berlin|Brandenburg|Bremen|Hamburg|Hessen|Mecklenburg-Vorpommern|Niedersachsen|Nordrhein-Westfalen|Rheinland-Pfalz|Saarland|Sachsen|Sachsen-Anhalt|Schleswig-Holstein|Thueringen';
city_states['Greece'] = 'Athens|Agion Oros (Mt. Athos)|Achaia|Aitolia kai Akarmania|Argolis|Arkadia|Arta|Attiki|Chalkidiki|Chanion|Chios|Dodekanisos|Drama|Evros|Evrytania|Evvoia|Florina|Fokidos|Fthiotis|Grevena|Ileia|Imathia|Ioannina|Irakleion|Karditsa|Kastoria|Kavala|Kefallinia|Kerkyra|Kilkis|Korinthia|Kozani|Kyklades|Lakonia|Larisa|Lasithi|Lefkas|Lesvos|Magnisia|Messinia|Pella|Pieria|Preveza|Rethynnis|Rodopi|Samos|Serrai|Thesprotia|Thessaloniki|Trikala|Voiotia|Xanthi|Zakynthos';
city_states['Hungary'] = 'Budapest|Bacs-Kiskun|Baranya|Bekes|Bekescsaba|Borsod-Abauj-Zemplen|Csongrad|Debrecen|Dunaujvaros|Eger|Fejer|Gyor|Gyor-Moson-Sopron|Hajdu-Bihar|Heves|Hodmezovasarhely|Jasz-Nagykun-Szolnok|Kaposvar|Kecskemet|Komarom-Esztergom|Miskolc|Nagykanizsa|Nograd|Nyiregyhaza|Pecs|Pest|Somogy|Sopron|Szabolcs-Szatmar-Bereg|Szeged|Szekesfehervar|Szolnok|Szombathely|Tatabanya|Tolna|Vas|Veszprem|Veszprem|Zala|Zalaegerszeg';
city_states['Iceland'] = 'Reykjavik|Akranes|Akureyri|Arnessysla|Austur-Bardhastrandarsysla|Austur-Hunavatnssysla|Austur-Skaftafellssysla|Borgarfjardharsysla|Dalasysla|Eyjafjardharsysla|Gullbringusysla|Hafnarfjordhur|Husavik|Isafjordhur|Keflavik|Kjosarsysla|Kopavogur|Myrasysla|Neskaupstadhur|Nordhur-Isafjardharsysla|Nordhur-Mulasys-la|Nordhur-Thingeyjarsysla|Olafsfjordhur|Rangarvallasysla|Saudharkrokur|Seydhisfjordhur|Siglufjordhur|Skagafjardharsysla|Snaefellsnes-og Hnappadalssysla|Strandasysla|Sudhur-Mulasysla|Sudhur-Thingeyjarsysla|Vesttmannaeyjar|Vestur-Bardhastrandarsysla|Vestur-Hunavatnssysla|Vestur-Isafjardharsysla|Vestur-Skaftafellssysla';
city_states['Ireland'] = 'Dublin|Carlow|Cavan|Clare|Cork|Donegal|Galway|Kerry|Kildare|Kilkenny|Laois|Leitrim|Limerick|Longford|Louth|Mayo|Meath|Monaghan|Offaly|Roscommon|Sligo|Tipperary|Waterford|Westmeath|Wexford|Wicklow';
city_states['Italy'] = 'Rome|Abruzzi|Basilicata|Calabria|Campania|Emilia-Romagna|Friuli-Venezia Giulia|Lazio|Liguria|Lombardia|Marche|Molise|Piemonte|Puglia|Sardegna|Sicilia|Toscana|Trentino-Alto Adige|Umbria|Valle dAosta|Veneto';
city_states['Latvia'] = 'Riga|Aizkraukles|Aluksnes|Balvu|Bauskas|Cesu|Daugavpils|Daugavpils|Dobeles|Gulbenes|Jekabpils|Jelgava|Jelgavas|Jurmala|Kraslavas|Kuldigas|Liepaja|Liepajas|Limbazu|Ludzas|Madonas|Ogres|Preilu|Rezekne|Rezeknes|Riga|Rigas|Saldus|Talsu|Tukuma|Valkas|Valmieras|Ventspils|Ventspils';
city_states['Liechtenstein'] = 'Vaduz|Balzers|Eschen|Gamprin|Mauren|Planken|Ruggell|Schaan|Schellenberg|Triesen|Triesenberg';
city_states['Lithuania'] = 'Vilnius|Alytaus|Kauno|Klaipedos|Marijampoles|Panevezio|Siauliu|Taurages|Telsiu|Utenos';
city_states['Luxembourg'] = 'Luxembourg|Diekirch|Grevenmacher';
city_states['Macedonia'] = 'Skopje|Aracinovo|Bac|Belcista|Berovo|Bistrica|Bitola|Blatec|Bogdanci|Bogomila|Bogovinje|Bosilovo|Brvenica|Cair|Capari|Caska|Cegrane|Centar|Centar Zupa|Cesinovo|Cucer-Sandevo|Debar|Delcevo|Delogozdi|Demir Hisar|Demir Kapija|Dobrusevo|Dolna Banjica|Dolneni|Dorce Petrov|Drugovo|Dzepciste|Gazi Baba|Gevgelija|Gostivar|Gradsko|Ilinden|Izvor|Jegunovce|Kamenjane|Karbinci|Karpos|Kavadarci|Kicevo|Kisela Voda|Klecevce|Kocani|Konce|Kondovo|Konopiste|Kosel|Kratovo|Kriva Palanka|Krivogastani|Krusevo|Kuklis|Kukurecani|Kumanovo|Labunista|Lipkovo|Lozovo|Lukovo|Makedonska Kamenica|Makedonski Brod|Mavrovi Anovi|Meseista|Miravci|Mogila|Murtino|Negotino|Negotino-Polosko|Novaci|Novo Selo|Oblesevo|Ohrid|Orasac|Orizari|Oslomej|Pehcevo|Petrovec|Plasnica|Podares|Prilep|Probistip|Radovis|Rankovce|Resen|Rosoman|Rostusa|Samokov|Saraj|Sipkovica|Sopiste|Sopotnica|Srbinovo|Star Dojran|Staravina|Staro Nagoricane|Stip|Struga|Strumica|Studenicani|Suto Orizari|Sveti Nikole|Tearce|Tetovo|Topolcani|Valandovo|Vasilevo|Velesta|Veles|Vevcani|Vinica|Vitoliste|Vranestica|Vrapciste|Vratnica|Vrutok|Zajas|Zelenikovo|Zeleno|Zitose|Zletovo|Zrnovci';
city_states['Malta'] = 'Valletta';
city_states['Moldova'] = 'Chisinau|Balti|Cahul|Chisinau|Chisinau|Edinet|Gagauzia|Lapusna|Orhei|Soroca|Stinga Nistrului|Tighina|Ungheni';
city_states['Monaco'] = 'Monaco|Fontvieille|La Condamine|Monaco-Ville|Monte-Carlo';
city_states['Netherlands'] = 'Amsterdam|The Hague|Drenthe|Flevoland|Friesland|Gelderland|Groningen|Limburg|Noord-Brabant|Noord-Holland|Overijssel|Utrecht|Zeeland|Zuid-Holland';
city_states['Norway'] = 'Oslo|Akershus|Aust-Agder|Buskerud|Finnmark|Hedmark|Hordaland|More og Romsdal|Nordland|Nord-Trondelag|Oppland|Ostfold|Rogaland|Sogn og Fjordane|Sor-Trondelag|Telemark|Troms|Vest-Agder|Vestfold';
city_states['Poland'] = 'Warsaw|Dolnoslaskie|Kujawsko-Pomorskie|Lodzkie|Lubelskie|Lubuskie|Malopolskie|Mazowieckie|Opolskie|Podkarpackie|Podlaskie|Pomorskie|Slaskie|Swietokrzyskie|Warminsko-Mazurskie|Wielkopolskie|Zachodniopomorskie';
city_states['Portugal'] = 'Lisbon|Aveiro|Acores (Azores)|Beja|Braga|Braganca|Castelo Branco|Coimbra|Evora|Faro|Guarda|Leiria|Lisboa|Madeira|Portalegre|Porto|Santarem|Setubal|Viana do Castelo|Vila Real|Viseu';
city_states['Romania'] = 'Bucharest (Bucuresti)|Alba|Arad|Arges|Bacau|Bihor|Bistrita-Nasaud|Botosani|Braila|Brasov|Buzau|Calarasi|Caras-Severin|Cluj|Constanta|Covasna|Dimbovita|Dolj|Galati|Gorj|Giurgiu|Harghita|Hunedoara|Ialomita|Iasi|Ilfov|Maramures|Mehedinti|Mures|Neamt|Olt|Prahova|Salaj|Satu Mare|Sibiu|Suceava|Teleorman|Timis|Tulcea|Vaslui|Vilcea|Vrancea';
city_states['San Marino'] = 'San Marino|Acquaviva|Borgo Maggiore|Chiesanuova|Domagnano|Faetano|Fiorentino|Monte Giardino|Serravalle';
city_states['Serbia'] = 'Belgrade|Kosovo|Montenegro|Serbia|Vojvodina';
city_states['Slovakia'] = 'Bratislava|Banskobystricky|Kosicky|Nitriansky|Presovsky|Trenciansky|Trnavsky|Zilinsky';
city_states['Slovenia'] = 'Ljubljana|Ajdovscina|Beltinci|Bled|Bohinj|Borovnica|Bovec|Brda|Brezice|Brezovica|Cankova-Tisina|Celje|Cerklje na Gorenjskem|Cerknica|Cerkno|Crensovci|Crna na Koroskem|Crnomelj|Destrnik-Trnovska Vas|Divaca|Dobrepolje|Dobrova-Horjul-Polhov Gradec|Dol pri Ljubljani|Domzale|Dornava|Dravograd|Duplek|Gorenja Vas-Poljane|Gorisnica|Gornja Radgona|Gornji Grad|Gornji Petrovci|Grosuplje|Hodos Salovci|Hrastnik|Hrpelje-Kozina|Idrija|Ig|Ilirska Bistrica|Ivancna Gorica|Izola|Jesenice|Jursinci|Kamnik|Kanal|Kidricevo|Kobarid|Kobilje|Kocevje|Komen|Koper|Kozje|Kranj|Kranjska Gora|Krsko|Kungota|Kuzma|Lasko|Lenart|Lendava|Litija|Ljubno|Ljutomer|Logatec|Loska Dolina|Loski Potok|Luce|Lukovica|Majsperk|Maribor|Medvode|Menges|Metlika|Mezica|Miren-Kostanjevica|Mislinja|Moravce|Moravske Toplice|Mozirje|Murska Sobota|Muta|Naklo|Nazarje|Nova Gorica|Novo Mesto|Odranci|Ormoz|Osilnica|Pesnica|Piran|Pivka|Podcetrtek|Podvelka-Ribnica|Postojna|Preddvor|Ptuj|Puconci|Race-Fram|Radece|Radenci|Radlje ob Dravi|Radovljica|Ravne-Prevalje|Ribnica|Rogasevci|Rogaska Slatina|Rogatec|Ruse|Semic|Sencur|Sentilj|Sentjernej|Sentjur pri Celju|Sevnica|Sezana|Skocjan|Skofja Loka|Skofljica|Slovenj Gradec|Slovenska Bistrica|Slovenske Konjice|Smarje pri Jelsah|Smartno ob Paki|Sostanj|Starse|Store|Sveti Jurij|Tolmin|Trbovlje|Trebnje|Trzic|Turnisce|Velenje|Velike Lasce|Videm|Vipava|Vitanje|Vodice|Vojnik|Vrhnika|Vuzenica|Zagorje ob Savi|Zalec|Zavrc|Zelezniki|Ziri|Zrece';
city_states['Spain'] = 'Madrid|Andalucia|Aragon|Asturias|Baleares (Balearic Islands)|Ceuta|Canarias (Canary Islands)|Cantabria|Castilla-La Mancha|Castilla y Leon|Cataluna|Communidad Valencian|Extremadura|Galicia|La Rioja|Melilla|Murcia|Navarra|Pais Vasco (Basque Country)';
city_states['Sweden'] = 'Stockholm|Blekinge|Dalarnas|Gavleborgs|Gotlands|Hallands|Jamtlands|Jonkopings|Kalmar|Kronobergs|Norrbottens|Orebro|Ostergotlands|Skane|Sodermanlands|Uppsala|Varmlands|Vasterbottens|Vasternorrlands|Vastmanlands|Vastra Gotalands';
city_states['Switzerland'] = 'Bern|Aargau|Appenzell Ausser-Rhoden|Appenzell Inner-Rhoden|Basel-Landschaft|Basel-Stadt|Fribourg|Geneve|Glarus|Graubunden|Jura|Luzern|Neuchatel|Nidwalden|Obwalden|Sankt Gallen|Schaffhausen|Schwyz|Solothurn|Thurgau|Ticino|Uri|Valais|Vaud|Zug|Zurich';
city_states['Ukraine'] = 'Kiev (Kyyiv)|Cherkaska (Cherkasy)|Chernihivska (Chernihiv)|Chernivetska (Chernivtsi)|Dnipropetrovska (Dnipropetrovsk)|Donetska (Donetsk)|Ivano-Frankivska (Ivano-Frankivsk)|Izmail (Izmayl)|Kharkivska (Kharkiv)|Khersonska (Kherson)|Khmelnytska (Khmelnytskyy)|Kirovohradska (Kirovohrad)|Luhanska (Luhansk)|Lvivska (Lviv)|Mykolayivska (Mykolayiv)|Odeska (Odesa)|Poltavska (Poltava)|Avtonomna Respublika Krym|Rivnenska (Rivne)|Sevastopol|Sumska (Sumy)|Ternopilska (Ternopil)|Vinnytska (Vinnytsya)|Volynska (Lutsk)|Zakarpatska (Uzhhorod)|Zaporizka (Zaporizhzhya)|Zhytomyrska (Zhytomyr)';
city_states['United Kingdom'] = 'Barking/Dagenham|Barnet|Barnsley|Bath/North East Somerset|Bedfordshire|Bexley|Birmingham|Blackburn with Darwen|Blackpool|Bolton|Bournemouth|Bracknell Forest|Bradford|Brent|Brighton/Hove|City of Bristol|Bromley|Buckinghamshire|Bury|Calderdale|Cambridgeshire|Camden|Cheshire|Cornwall|Coventry|Croydon|Cumbria|Darlington|Derby|Derbyshire|Devon|Doncaster|Dorset|Dudley|Durham|Ealing|East Riding of Yorkshire|East Sussex|Enfield|Essex|Gateshead|Gloucestershire|Greenwich|Hackney|Halton|Hammersmith/Fulham|Hampshire|Haringey|Harrow|Hartlepool|Havering|Herefordshire|Hertfordshire|Hillingdon|Hounslow|Isle of Wight|Islington|Kensington/Chelsea|Kent|City of Kingston upon Hull|Kingston upon Thames|Kirklees|Knowsley|Lambeth|Lancashire|Leeds|Leicester|Leicestershire|Lewisham|Lincolnshire|Liverpool|City of London|Luton|Manchester|Medway|Merton|Middlesbrough|Milton Keynes|Newcastle upon Tyne|Newham|Norfolk|Northamptonshire|North East Lincolnshire|North Lincolnshire|North Somerset|North Tyneside|Northumberl/|North Yorkshire|Nottingham|Nottinghamshire|Oldham|Oxfordshire|Peterborough|Plymouth|Poole|Portsmouth|Reading|Redbridge|Redcar/Clevel/|Richmond upon Thames|Rochdale|Rotherham|Salford|Shropshire|Sefton|Sheffield|Slough|Solihull|Somerset|Southampton|Southend-on-Sea|South Gloucestershire|South Tyneside|Southwark|Staffordshire|St. Helens|Stockport|Stockton-on-Tees|Stoke-on-Trent|Suffolk|Sunderland|Surrey|Sutton|Swindon|Tameside|Telford/Wrekin|Thurrock|Torbay|Tower Hamlets|Trafford|Wakefield|Walsall|Waltham Forest|W/sworth|Warrington|Warwickshire|West Berkshire|Westminster|West Sussex|Wigan|Wiltshire|Windsor/Maidenhead|Wirral|Wokingham|Wolverhampton|Worcestershire|York|Antrim|County Antrim|Ards|Armagh|County Armagh|Ballymena|Ballymoney|Banbridge|Belfast|Carrickfergus|Castlereagh|Coleraine|Cookstown|Craigavon|Down|County Down|Dungannon|Fermanagh|County Fermanagh|Larne|Limavady|Lisburn|County Londonderry|Derry|Magherafelt|Moyle|Newry/Mourne|Newtownabbey|North Down|Omagh|Strabane|County Tyrone|Aberdeen City|Aberdeenshire|Angus|Argyll/Bute|The Scottish Borders|Clackmannanshire|Dumfries/Galloway|Dundee City|East Ayrshire|East Dunbartonshire|East Lothian|East Renfrewshire|City of Edinburgh|Falkirk|Fife|Glasgow City|Highland|Inverclyde|Midlothian|Moray|North Ayrshire|North Lanarkshire|Orkney Islands|Perth/Kinross|Renfrewshire|Shetland Islands|South Ayrshire|South Lanarkshire|Stirling|West Dunbartonshire|Eilean Siar (Western Isles)|West Lothian|Isle of Anglesey|Blaenau Gwent|Bridgend|Caerphilly|Cardiff|Ceredigion|Carmarthenshire|Conwy|Denbighshire|Flintshire|Gwynedd|Merthyr Tydfil|Monmouthshire|Neath Port Talbot|Newport|Pembrokeshire|Powys|Rhondda Cynon Taff|Swansea|Torfaen|The Vale of Glamorgan|Wrexham';
city_states['Vatican City'] = '';


//Islands
city_states['Arctic Ocean'] = 'Franz Josef Land|Svalbard';
city_states['Atlantic Ocean (North)'] = 'Alderney|Azores|Baixo|Belle-Ile|Bermuda|Bioko|Block|Boa Vista|Borduy|Bugio|Canary Islands|Cape Breton|Cape Verde Islands|Channel Islands|Corvo|Deer Isle|Eysturoy|Faeroe Islands|Fago|Faial|Flores|Fuerteventura|Fugloy|Gomera|Graciosa|Gran Canaria|Grand Manan|Grande|Greenland|Guernsey|Hebrides|Herm|Hestur|Hierro|Iceland|Iles De La Madeleine|Ile de Noirmoutier|Ile de Re|Ile d Ol‚ron|Ile d Yeu|Ilhas Desertas|Ireland|Isle au Haut|Isle of Lewis|Isle of Mull|Isle of Skye|Jersey|Kalsoy|Koltur|Kunoy|Lanzarote|La Palma|Litla Dimun|Long Island|Jan Mayen|Madeira Islands|Maio|Marthas Vineyard|Matinicus|Monhegan|Mount Desert|Mykines|Nantucket Island|Newfoundland|Nolsoy|Orkney Islands|Pico|Porto Santo|Prince Edward Island|St. Peter/St. Paul Rocks|St.-Pierre/Miquelon|Praia|Sable Island|Sal|Sandoy|Santo Antao|Santa Maria|Sao Jorge|Sao Miguel|Sao Nicolau|Sao Tiago|Sao Tome/Principe|Sao Vicente|Sark|Scilly Isles|Shetland Islands|Skuvoy|Stora Dimun|Streymoy|Sumba|Svinoy|Swans|Tenerife|Terceira|Uist Islands|Vagar|Viday|Vinalhaven';
city_states['Atlantic Ocean (South)'] = 'Amsterdam|Andaman Islands|Annobon|Ascension|Bouvet|Falkland Islands|Gough|Martin Vas Islands|Nightingale|St. Helena|Shag/Black Rocks|South Georgia|South Orkney Islands|South Sandwich Islands|Traversay|Trindade|Tristan da Cunha';
city_states['Assorted'] = 'Akimiski|Aland|Alcatraz|Apostle Islands|Baffin|Banka|Banks|Beaver|Belcher Islands|Belitung|Borneo|Bornholm|Brac|Coats|Cres|Devon|East Frisian Islands|Ellesmere|Fyn|Galveston|Gotland|Groote Eylandt|Hiiumaa|Hong Kong Island|Ile d Anticosti|Ile d Orleans|Isla de Ometepe|Isla Del Ray|Isle of Man|Isle of Wight|Isle Royale|Jutland|Key Largo|Key West|King William|Krek|Langeland|Lantau|Lolland|Lundy|Mackinac|Madeleine Islands|Manhattan Island|Manitoulin|Marsh|Matagorda|Melville|North Hero|Oland|Paracel Islands|Pelee|Prince Charles|Prince of Wales|Queen Elizabeth Islands|Saaremaa|Sjaelland|Somerset|Southhampton|South Hero|Spratley Islands|Sulawesi|Victoria|Washington|Wellesley Islands';
city_states['Caribbean Sea'] = 'Abaco (great)|Abaco (little)|Acklins|Andros|Anegada|Anguilla|Antigua|Aruba|Bahamas|Barbados|Barbuda|Bimini Islands|Bonaire|Caicos Islands|Cat|Cayman Brac|Cayman Islands|Cozumel|Crooked|Cuba|Curacao|Dominica|Exuma|Grand Bahama|Grand Cayman|Grand Turk|Greater Antilles|Great Inagua|Grenada|Guadeloupe|Hispaniola (Haiti/DOR)|Isla de Margarita|Isla Mujeres|Isla La Tortuga|Isle of Youth|Jamaica|Lesser Antilles|Little Cayman|Little Inagua|Long|Marie-Galante|Martinique|Mayaguana|Montserrat|Navassa|Nevis|New Providence|Providencia|Puerto Rico|Roatan|Rum Cay|St. Barts|St. Croix|St. Eustatius|St. John|St. Kitts|St. Lucia|St. Martin/Sint Maartan|St. Thomas|St Vincent and the Grenadines|Saba|San Blas Islands|San Salvador|San Andres|Santa Catilina (St. Catherine)|Tobago|Tortola|Trinidad|Virgin Gorda|West Indies';
city_states['Greek Isles'] = 'Aegina|Alonissos|Amorgos|Andros|Angistri|Astipalea|Carpathos|Cephalonia|Chios (Hios)|Corfu|Cos (Kos)|Crete (Kriti)|Cyclades Islands|Dodecanese Islands|Dokos|Eubaea (Evia)|Evia|Hydra|Ikaria|Ionian Islands|Ios|Ithaca|Kea|Kefalonia|Kefalos|Kalimnos|Kassos|Kithnos|Kos|Kythnos|Kythria|Lefkada|Lemnos|Leros|Lesvos|Leucas|Limnos|Lipsi|Los|Melos|Mykonos|Naxos|Nisyros|Paros|Patmos|Poros|Pothia|Rhodes (Rodos)|Salamina|Samos|Samothrace|Santorini|Serifos|Seriphos|Sifnos|Sikinos|Skiros|Skiathos|Skopelos|Skyros|Spetses|Sporades Islands|Syros|Tenos (Tinos)|Thassos|Tzia|Zakinthos|Zante';
city_states['Indian Ocean'] = 'Addu Atoll|Agalega Islands|Amsterdam|Andaman Islands|Anjouan (Nzwani)|Ari Atoll|Ashmore/Cartier Islands|Bali|Barrow|Bathurst|Bompoka|Cape Barren|Car Nicobar|Chagos Archipelago|Christmas|Comoros|Crozet Islands|Danger|Diego Garcia|Eagle Islands|Egmont Islands|Faadhippolhu Atoll|Felidhoo Atoll|Flinders|Goidhoo Atoll|Grand Comore (Njazidja)|Great Nicobar|Hadhdhunmathee|Heard|Huvadhoo Atoll|Ihavandhippolhu Atoll|Java|Kangaroo|Katchall|Keeling Islands (Cocos)|King|Kolhumadulu Atoll|Lakshadweep Islands|Little Andaman|Little Nicobar|Lower Andaman|Maalhosmadulu Atoll|Maamakunudhoo Atoll|Madagascar|Mahe|Maldives|Male Atoll|Mauritius|Mayotte|McDonald Islands|Melville|Middle Andaman|Miladhunmafulu Atoll|Moheli (Mwali)|Molaku Atoll|Nancowry|Nelsons Island|Nias|Nicobar Islands|Nilandhoo Atoll|North Andaman|Peros Banhos|Phuket|Prince Edward Islands|Reunion|Rodrigues|St. Paul|Salomon Islands|Seychelles|Shag|Siberut|Simeulue|Sipura|Socotra|Sumatra|Sri Lanka|Tarasa Dwip|Tasmania|Thiladhunmathee Atoll|Three Brothers|Timor|Tromelin|Zanzibar';
city_states['Mediterranean Sea'] = 'Aeolian Islands|Alboran|Balearic Islands|Cabrera|Capraia|Capri|Corse (Corsica)|Cyprus|Elba|Formentera|Gozo|Ibiza (Ivisa)|Iles d Hyeres|Jalitah|Lampedusa|Lipari Islands|Mallorca (Majorca)|Malta|Maltese Islands|Menorca (Minorca)|Pantelleria|Ponziane|Salina|Sant Antioca|San Pietro|Sardinia (Sardegna)|Sicily (Sicilia)|Stromboli|Vulcano|Zembra';
city_states['Oceania'] = 'Abaiang|Admiralty Islands|Aitutaki|Alofi|Ambrym|American Samoa|Antipodes|Atafu Atoll|Atiu|Auckland Islands|Aunuu|Austral Islands|Banaba|Bega|Bora Bora|Bougainville|Bounty Islands|Campbell|Chatham Islands|Choiseul|Cook Islands|Coral Sea Islands|Efate|Elao|Erromango|Espiritu Santo| Eua|Faioa|Fakaofo Atoll|Fatu Hiva|Fiji|French Polynesia|Funafuti Atoll|Futuna|Gambier Islands|Gau|Gilbert Islands|Gizo|Grand Terre|Great Barrier Reef|Guadacanal|Haapai Island Group|Hatutu|Hiva Oa|Horne Islands|Huahine|Isle of Pines|Kadavu|Karkar|Kioa|Kiribati|Kiritamati|Koro|Lakeba|Lau Group|Lifou|Line Islands|Loyalty Islands|Malaita|Malekula|Malolo|Mangaia|Manihiki|Manua Group|Manuae|Mare|Marquises Islands|Mata Utu|Matuku|Mauke|Maupiti|Melanesia|Mitiaro|Moala|Mohotani|Moorea|Nairai|Nanumea Atoll|Nassau|Nauru|Naviti|Nepean|New Britain|New Caledonia|New Georgia Islands|New Guinea|New Ireland|Niuafoou|Niuas Islands|Niuatoputapu|Niue|Niulakita Atoll|Nomuka Island Group|Norfolk Islands|Nukuaeta|Nukufetau Atoll|Nuku Hiva|Nukulaelae Atoll|Nukunono Atoll|Ofu|Olasega|Ono|Ouvea|Ovalau|Palmerston|Pangai|Penrhyn|Philip|Phoenix Islands|Pitcairn|Pitt Island|Polynesia|Pukapuka|Rabi|Raiatea|Rakahanga|Rangiroa|Rarotonga|Rotuma|Samao|San Cristobal|Santa Cruz Islands|Santa Isabel|Savai i|Society Islands|Solomon Islands|Stewart|Suwarrow|Tabuaeran|Tahaa|Tahiti|Tahuata|Taiohae|Tanna|Tarawa|Tasmania|Tau|Taveuni|Tetiaroa|Tokelau|Tonga|Tongatapu|Totoya|Tuamotu Islands|Tubuai|Tupai|Tutuila|Tuvalu|Ua Huka|Ua Pou|Hiva Oa|Upolu| Uta Vavau|Uvea|Vaiaku|Vanua Balavu|Vanua Levu|Vanuatu|Vatulele|Vavau Island Group|Vita Levu|Wallis Islands|Wallis and Futuna|Waya|Yasawa|Yasawa Group';
city_states['Pacific Ocean (North)'] = 'Aleutian Islands|Alexander Islands|Andreanof Islands|Babelthuap|Baker|Bikini|Bohol|Bonin Islands|Cabras|Caroline Islands|Cebu|Channel Islands (US)|Cheju Do|Chuuk|Diomede Islands|Guam|Hainan|Hawaii (big island)|Hawaiian Islands|Hokkaido|Honshu|Howland|Jaluit Atoll|Japan|Johnston Atoll|Kahoolawe|Kauai|Kodiak|Kosrae|Kwajalein Atoll|Kyushu|Lanai|Lifou|Loyalty Islands|Luzon|Maloelap Atoll|Majuro Atoll|Mare|Marshall Islands|Maui|Micronesia|Midway Islands|Mili Atoll|Mindanao|Mindoro|Molakai|Niihau|Near Islands|Negros|Northern Marianas|Nunivak|Oahu|Okinawa|Ostrov Sakhalin|Pagan|Palau|Palawan|Palmyra Atoll|Panay|Philippines|Pohnpei|Queen Charlotte Islands|Rat|Rongelap Atoll|St. Lawrence|St. Matthew|St. Paul|Saipan|Samar|San Clemente|San Miguel|San Nicolas|Santa Catalina|Santa Cruz|Santa Rosa|Shikoku|Taiwan|Tinian|Vancouver|Volcano Islands|Wake Island|Yap';
city_states['Pacific Ocean (South)'] = 'Easter|Galapogos Islands|Juan Fernandez Islands|Isla Espanola|Isla Fernandina|Isla Genovesa|Isla Isabella|Isla Marchena|Isla Pinta|Isla Puna|Isla San Cristobal|Isla San Salvador|Isla Santa Cruz|Isla Santa Maria|Robinson Crusoe|San Felix|Santa Clara';


//Middle East
city_states['Afghanistan'] = 'Kabul|Badakhshan|Badghis|Baghlan|Balkh|Bamian|Farah|Faryab|Ghazni|Ghowr|Helmand|Herat|Jowzjan|Kabol|Kandahar|Kapisa|Khowst|Konar|Kondoz|Laghman|Lowgar|Nangarhar|Nimruz|Nurestan|Oruzgan|Paktia|Paktika|Parvan|Samangan|Sar-e Pol|Takhar|Vardak|Zabol';
city_states['Armenia'] = 'Yerevan|Aragatsotn|Ararat|Armavir|Gegharkunik|Kotayk|Lorri|Shirak|Syunik|Tavush|Vayots Dzor';
city_states['Azerbaijan'] = 'Baku (Baki)|Abseron|Agcabadi|Agdam|Agdas|Agstafa|Agsu|Ali Bayramli|Astara|Balakan|Barda|Beylaqan|Bilasuvar|Cabrayil|Calilabad|Daskasan|Davaci|Fuzuli|Gadabay|Ganca|Goranboy|Goycay|Haciqabul|Imisli|Ismayilli|Kalbacar|Kurdamir|Lacin|Lankaran|Lankaran|Lerik|Masalli|Mingacevir|Naftalan|Naxcivan|Neftcala|Oguz|Qabala|Qax|Qazax|Qobustan|Quba|Qubadli|Qusar|Saatli|Sabirabad|Saki|Saki|Salyan|Samaxi|Samkir|Samux|Siyazan|Sumqayit|Susa|Susa|Tartar|Tovuz|Ucar|Xacmaz|Xankandi|Xanlar|Xizi|Xocali|Xocavand|Yardimli|Yevlax|Yevlax|Zangilan|Zaqatala|Zardab';
city_states['Bahrain'] = 'Manama|Al Hadd|Al Manamah|Al Mintaqah al Gharbiyah|Al Mintaqah al Wusta|Al Mintaqah ash Shamaliyah|Al Muharraq|Ar Rifa wa al Mintaqah al Janubiyah|Jidd Hafs|Madinat Hamad|Madinat Isa|Juzur Hawar|Sitrah';
city_states['Cyprus'] = 'Nicosia|Famagusta|Kyrenia|Larnaca|Limassol|Paphos';
city_states['Iran'] = 'Tehran|Ardabil|Azarbayjan-e Gharbi|Azarbayjan-e Sharqi|Bushehr|Chahar Mahall va Bakhtiari|Esfahan|Fars|Gilan|Golestan|Hamadan|Hormozgan|Ilam|Kerman|Kermanshah|Khorasan|Khuzestan|Kohkiluyeh va Buyer Ahmad|Kordestan|Lorestan|Markazi|Mazandaran|Qazvin|Qom|Semnan|Sistan va Baluchestan|Yazd|Zanjan';
city_states['Iraq'] = 'Baghdad|Al Anbar|Al Basrah|Al Muthanna|Al Qadisiyah|An Najaf|Arbil|As Sulaymaniyah|At Tamim|Babil|Dahuk|Dhi Qar|Diyala|Karbala|Maysan|Ninawa|Salah ad Din|Wasit';
city_states['Israel'] = 'Jerusalem|Central|Haifa|Northern|Southern|Tel Aviv';
city_states['Jordan'] = 'Amman|Ajlun|Al Aqabah|Al Balqa|Al Karak|Al Mafraq|At Tafilah|Az Zarqa|Irbid|Jarash|Maan|Madaba';
city_states['Kuwait'] = 'Kuwait|Al Ahmadi|Al Farwaniyah|Al Asimah|Al Jahra|Hawalli';
city_states['Kyrgyzstan'] = 'Bishkek Shaary|Batken Oblasty|Chuy Oblasty (Bishkek)|Jalal-Abad Oblasty|Naryn Oblasty|Osh Oblasty|Talas Oblasty|Ysyk-Kol Oblasty (Karakol)';
city_states['Lebanon'] = 'Beirut|Beyrouth|Beqaa|Liban-Nord|Liban-Sud|Mont-Liban|Nabatiye';
city_states['Oman'] = 'Muscat|Ad Dakhiliyah|Al Batinah|Al Wusta|Ash Sharqiyah|Az Zahirah|Musandam|Zufar';
city_states['Pakistan'] = 'Islamabad|Balochistan|Federally Administered Tribal Areas|North-West Frontier Province|Punjab|Sindh';
city_states['Qatar'] = 'Doha|Ad Dawhah|Al Ghuwayriyah|Al Jumayliyah|Al Khawr|Al Wakrah|Ar Rayyan|Jarayan al Batinah|Madinat ash Shamal|Umm Salal';
city_states['Saudi Arabia'] = 'Riyadh|Al Bahah|Al Hudud ash Shamaliyah|Al Jawf|Al Madinah|Al Qasim|Ar Riyad|Ash Sharqiyah (Eastern Province)|Asir|Hail|Jizan|Makkah|Najran|Tabuk';
city_states['Syria'] = 'Damascus|Al Hasakah|Al Ladhiqiyah|Al Qunaytirah|Ar Raqqah|As Suwayda|Dara|Dayr az Zawr|Dimashq|Halab|Hamah|Hims|Idlib|Rif Dimashq|Tartus';
city_states['Tajikistan'] = 'Dushanbe|Viloyati Mukhtori Kuhistoni Badakhshon|Viloyati Khatlon|Viloyati Sughd';
city_states['Turkey'] = 'Ankara|Adana|Adiyaman|Afyon|Agri|Aksaray|Amasya|Antalya|Ardahan|Artvin|Aydin|Balikesir|Bartin|Batman|Bayburt|Bilecik|Bingol|Bitlis|Bolu|Burdur|Bursa|Canakkale|Cankiri|Corum|Denizli|Diyarbakir|Duzce|Edirne|Elazig|Erzincan|Erzurum|Eskisehir|Gaziantep|Giresun|Gumushane|Hakkari|Hatay|Icel|Igdir|Isparta|Istanbul|Izmir|Kahramanmaras|Karabuk|Karaman|Kars|Kastamonu|Kayseri|Kilis|Kirikkale|Kirklareli|Kirsehir|Kocaeli|Konya|Kutahya|Malatya|Manisa|Mardin|Mugla|Mus|Nevsehir|Nigde|Ordu|Osmaniye|Rize|Sakarya|Samsun|Sanliurfa|Siirt|Sinop|Sirnak|Sivas|Tekirdag|Tokat|Trabzon|Tunceli|Usak|Van|Yalova|Yozgat|Zonguldak  Buri|Sisaket|Songkhla|Sukhothai|Suphan Buri|Surat Thani|Surin|Tak|Trang|Trat|Ubon Ratchathani|Udon Thani|Uthai Thani|Uttaradit|Yala|Yasothon';
city_states['Turkmenistan'] = 'Ashgabat|Ahal Welayaty|Balkan Welayaty|Dasoguz Welayaty|Labap Welayaty|Mary Welayaty';
city_states['United Arab Emirates'] = 'Abu Dhabi|Abu Zaby (Abu Dhabi)|Ajman|Al Fujayrah|Ash Shariqah (Sharjah)|Dubayy (Dubai)|Ras al Khaymah|Umm al Qaywayn';
city_states['Uzbekistan'] = 'Tashkent (Toshkent)|Andijon Viloyati|Buxoro Viloyati|Fargona Viloyati|Jizzax Viloyati|Namangan Viloyati|Navoiy Viloyati|Qashqadaryo Viloyati (Qarshi)|Qaraqalpogiston Respublikasi|Samarqand Viloyati|Sirdaryo Viloyati (Guliston)|Surxondaryo Viloyati (Termiz)|Toshkent Shahri|Toshkent Viloyati|Xorazm Viloyati (Urganch)';
city_states['Yemen'] = 'Sanaa|Abyan|Adan|Al Bayda|Al Hudaydah|Al Jawf|Al Mahrah|Al Mahwit|Dhamar|Hadramawt|Hajjah|Ibb|Lahij|Marib|Sadah|Sana|Shabwah|Taizz';


//North America
city_states['Bermuda'] = 'Hamilton|Devonshire|Hamilton|Hamilton|Paget|Pembroke|Saint George|Saint Georges|Sandys|Smiths|Southampton|Warwick';
city_states['Canada'] = 'Ottawa|Alberta|British Columbia|Manitoba|New Brunswick|Newfoundland and Labrador|Northwest Territories|Nova Scotia|Nunavut|Ontario|Prince Edward Island|Quebec|Saskatchewan|Yukon Territory';
city_states['Caribbean'] = '';
city_states['Greenland'] = 'Nuuk (Godthab)|Avannaa (Nordgronland)|Tunu (Ostgronland)|Kitaa (Vestgronland)';
city_states['Mexico'] = 'Mexico (Distrito Federal)|Aguascalientes|Baja California|Baja California Sur|Campeche|Chiapas|Chihuahua|Coahuila de Zaragoza|Colima|Durango|Guanajuato|Guerrero|Hidalgo|Jalisco|Michoacan de Ocampo|Morelos|Nayarit|Nuevo Leon|Oaxaca|Puebla|Queretaro de Arteaga|Quintana Roo|San Luis Potosi|Sinaloa|Sonora|Tabasco|Tamaulipas|Tlaxcala|Veracruz-Llave|Yucatan|Zacatecas';
city_states['United States'] = 'Washington DC|Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|Georgia|Kentucky|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusets|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming';


//South America
city_states['Argentina'] = 'Buenos Aires|Catamarca|Chaco|Chubut|Cordoba|Corrientes|Entre Rios|Formosa|Jujuy|La Pampa|La Rioja|Mendoza|Misiones|Neuquen|Rio Negro|Salta|San Juan|San Luis|Santa Cruz|Santa Fe|Santiago del Estero|Tucuman';
city_states['Bolivia'] = 'La Paz|Sucre|Chuquisaca|Cochabamba|Beni|Oruro|Pando|Potosi|Santa Cruz|Tarija';
city_states['Brazil'] = 'Brasilia|Acre|Alagoas|Amapa|Amazonas|Bahia|Ceara|Distrito Federal|Espirito Santo|Goias|Maranhao|Mato Grosso|Mato Grosso do Sul|Minas Gerais|Para|Paraiba|Parana|Pernambuco|Piaui|Rio de Janeiro|Rio Grande do Norte|Rio Grande do Sul|Rondonia|Roraima|Santa Catarina|Sao Paulo|Sergipe|Tocantins';
city_states['Chile'] = 'Santiago|Antofagasta|Araucania|Atacama|Bio-Bio|Coquimbo|Los Lagos|Maule|Tarapaca|Valparaiso';
city_states['Colombia'] = 'Bogota|Amazonas|Antioquia|Arauca|Atlantico|Bolivar|Boyaca|Caldas|Caqueta|Casanare|Cauca|Cesar|Choco|Cordoba|Cundinamarca|Guainia|Guaviare|Huila|La Guajira|Magdalena|Meta|Narino|Norte de Santander|Putumayo|Quindio|Risaralda|San Andres/Providencia|Santander|Sucre|Tolima|Valle del Cauca|Vaupes|Vichada';
city_states['Ecuador'] = 'Quito|Azuay|Bolivar|Canar|Carchi|Chimborazo|Cotopaxi|El Oro|Esmeraldas|Galapagos|Guayas|Imbabura|Loja|Los Rios|Manabi|Morona-Santiago|Napo|Orellana|Pastaza|Pichincha|Sucumbios|Tungurahua|Zamora-Chinchipe';
city_states['Guyana'] = 'Georgetown|Barima-Waini|Cuyuni-Mazaruni|Demerara-Mahaica|East Berbice-Corentyne|Essequibo Islands-West Demerara|Mahaica-Berbice|Pomeroon-Supenaam|Potaro-Siparuni|Upper Demerara-Berbice|Upper Takutu-Upper Essequibo';
city_states['Paraguay'] = 'Asuncion|Alto Paraguay|Alto Parana|Amambay|Boqueron|Caaguazu|Caazapa|Canindeyu|Central|Concepcion|Cordillera|Guaira|Itapua|Misiones|Neembucu|Paraguari|Presidente Hayes|San Pedro';
city_states['Peru'] = 'Lima|Amazonas|Ancash|Apurimac|Arequipa|Ayacucho|Cajamarca|Callao|Cusco|Huancavelica|Huanuco|Ica|Junin|La Libertad|Lambayeque|Loreto|Madre de Dios|Moquegua|Pasco|Piura|Puno|San Martin|Tacna|Tumbes|Ucayali';
city_states['Suriname'] = 'Paramaribo|Brokopondo|Commewijne|Coronie|Marowijne|Nickerie|Para|Saramacca|Sipaliwini|Wanica';
city_states['Uruguay'] = 'Montevideo|Artigas|Canelones|Cerro Largo|Colonia|Durazno|Flores|Florida|Lavalleja|Maldonado|Paysandu|Rio Negro|Rivera|Rocha|Salto|San Jose|Soriano|Tacuarembo|Treinta y Tres';
city_states['Venezuela'] = 'Caracas|Amazonas|Anzoategui|Apure|Aragua|Barinas|Bolivar|Carabobo|Cojedes|Delta Amacuro|Dependencias Federales|Distrito Federal|Falcon|Guarico|Lara|Merida|Miranda|Monagas|Nueva Esparta|Portuguesa|Sucre|Tachira|Trujillo|Vargas|Yaracuy|Zulia';
