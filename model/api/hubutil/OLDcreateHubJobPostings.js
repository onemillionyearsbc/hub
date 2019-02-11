/**
 * Populates the jobseeker Registries with data
 * 
 */

const bnUtil = require('../bn-connection-util');
const loremIpsum = require('lorem-ipsum');

// const bnUtil = require('../bn-connection-util');
const namespace = 'io.onemillionyearsbc.hubtutorial.jobs';
const transactionType = "CreateJobPosting";

var refCount = [0,0,0,0,0];

bnUtil.cardName='admin@hubtutorial';
if(process.argv.length < 3){
    console.log("Usage: node createJobPosting   <card-name> ")
    console.log("Amending Network using a card: ",bnUtil.cardName);
} else {
    bnUtil.cardName = process.argv[2];
    console.log("Amending Network using a card: ",bnUtil.cardName);
}
console.log("Creating JobPostings...1");
bnUtil.connect(main);



// Callback function passed to the BN Connection utility
// Error has value if there was an error in connect()
async function main(){

    console.log("Creating JobPostings...2");
    // start();
    const  bnDef = bnUtil.connection.getBusinessNetwork();
    const  factory = bnDef.getFactory();
    // create an array of recruiter instances
    let registry = {};
    // let recruiters = createRecruiterInstances();
    let options = {
        generate: false,
        includeOptionalFields: false
    }
    console.log("Creating JobPostings...3");
   
    //Get a random company
    var company = getRandomArrayElement(companyArray);
    var remote = getRandomArrayElement(trueFalseArray);
    var jobType = getRandomArrayElement(jobTypeArray);
    var jobTitle = getRandomArrayElement(jobTitlesArray);
    var blockchain = getRandomArrayElement(blockchainArray);
    var description = loremIpsum({
        count: 10                    // Number of words, sentences, or paragraphs to generate.
      , units: 'sentences' 
    });
    var index = getNameIndex();
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
    var logohash = "6c631acfc202d6fbc37b5bf7e7c06a1f853bf3a0c9f5ff61416e97f2d7e069b6"; // stool

    console.log(company);
    console.log("remote: " + remote);
    console.log(jobType);
    console.log(jobTitle);
    console.log(blockchain);
    console.log(description);
    console.log(contact);
    console.log(internalRef);
    console.log("employer: " + employer);
    console.log(salary);
    console.log(location);
    console.log(skills);
    console.log(logohash);

			
    let transaction = factory.newTransaction(namespace,transactionType,"",options);
    transaction.setPropertyValue('email','emerysolutions@yahoo.co.uk');
    transaction.setPropertyValue('company',company);
    transaction.setPropertyValue('remote',remote);
    transaction.setPropertyValue('jobType',jobType);
    transaction.setPropertyValue('jobTitle',jobType);
    transaction.setPropertyValue('blockchainName',blockchain);
    transaction.setPropertyValue('description',description);
    transaction.setPropertyValue('contact',contact);
    transaction.setPropertyValue('internalRef',internalRef);
    transaction.setPropertyValue('salary',salary);
    transaction.setPropertyValue('location',location);
    transaction.setPropertyValue('skills',skills);
    transaction.setPropertyValue('logohash',logohash);

    try {
        bnUtil.connection.submitTransaction(transaction);
        console.log("Transaction processed: Job Posting created for email " + email)

    } catch (error) {
        console.log('Job Posting creation failed: ' + error);
        break;
    }        

    console.log("All done.")
    bnUtil.disconnect();

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

function getUniqueRandomArrayElements(arr, num){

    var elements=[];
    var ids = arr.slice();

    for (var i = 0; i < num; i++) {

        //Minimum value is set to 0 because array indexes start at 0.
        var min = 0;
        //Get the maximum value my getting the size of the
        //array and subtracting by 1.
        var max = (ids.length - 1);
        //Get a random integer between the min and max value.
        var randIndex = Math.floor(Math.random() * (max - min)) + min;
        
        elements.push(ids.splice(randIndex,1)[0]);
    }

    return elements;
}
function getRandomArrayElement(arr){
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
 
//Example JavaScript array containing various types of animals.
var companyArray = new Array(
    'IBM',
    'Nissan',
    'Honda',
    'BMW',
    'Amazon UK',
    'HSBC',
    'Morgan Stanley',
    'British Steel',
    'Rolls Royce',
    'Computer Futures',
    'AT Kearney'
);

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
    "QUORUM",
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

var countriesArray = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Anguilla", "Antigua & Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia & Herzegovina", "Botswana", "Brazil", "British Virgin Islands", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central Arfrican Republic", "Chad", "Chile", "China", "Colombia", "Congo", "Cook Islands", "Costa Rica", "Cote D Ivoire", "Croatia", "Cuba", "Curacao", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands", "Faroe Islands", "Fiji", "Finland", "France", "French Polynesia", "French West Indies", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauro", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russia", "Rwanda", "Saint Pierre & Miquelon", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "St Kitts & Nevis", "St Lucia", "St Vincent", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor L'Este", "Togo", "Tonga", "Trinidad & Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks & Caicos", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Virgin Islands (US)", "Yemen", "Zambia", "Zimbabwe"];
        
var skillsArray = ["JavaScript", "NodeJS","Web", "C++", "Typescript", "Java", "Python", "Rust", "PHP", "Go", 
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
