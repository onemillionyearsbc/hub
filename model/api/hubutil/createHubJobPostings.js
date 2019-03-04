/**
 * Populates the Hub JobPosting Registry with data
 * 
 * Composer 0.21.0
 */

const mysql = require('mysql');
const crypto = require('crypto');
const fs = require('fs');
const bnUtil = require('../bn-connection-util');

const participantNamespace = 'io.onemillionyearsbc.hubtutorial';
const recruiterResourceName = 'HubRecruiter';

const namespace = 'io.onemillionyearsbc.hubtutorial.jobs';

const transactionType = "CreateJobPosting";

var refCount = [0, 0, 0, 0, 0];

bnUtil.cardName = 'admin@hubtutorial';

// bnUtil.connect(removeRecruitersAndJobSeekers);
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
    if (process.argv.length == 3) {
        console.log("using email: " + process.argv[2]);
        email = process.argv[2];
    }
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

    for (var i = 0; i < 500; i++) {

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
        if (remote === false) {
            location = getRandomArrayElement(countriesArray);
        }

        var numSkills = Math.floor(Math.random() * (5)) + 2;
        var skills = [];
        skills = getUniqueRandomArrayElements(skillsArray, numSkills);
        // var logohash = "6c631acfc202d6fbc37b5bf7e7c06a1f853bf3a0c9f5ff61416e97f2d7e069b6"; // stool


        console.log(">>> generating job posting for email: " + email);
        console.log("   => jobRef =  " + jobReference);

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
        params.skills = skills;

        params.testData = true; // true to generate jobs in the past, false generates all jobs for today

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
    var randIndex = Math.floor(Math.random() * (max - min)) + min;
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

var countriesArray = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Anguilla", "Antigua & Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia & Herzegovina", "Botswana", "Brazil", "British Virgin Islands", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central Arfrican Republic", "Chad", "Chile", "China", "Colombia", "Congo", "Cook Islands", "Costa Rica", "Cote D Ivoire", "Croatia", "Cuba", "Curacao", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands", "Faroe Islands", "Fiji", "Finland", "France", "French Polynesia", "French West Indies", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauro", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russia", "Rwanda", "Saint Pierre & Miquelon", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "St Kitts & Nevis", "St Lucia", "St Vincent", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor L'Este", "Togo", "Tonga", "Trinidad & Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks & Caicos", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Virgin Islands (US)", "Yemen", "Zambia", "Zimbabwe"];

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

