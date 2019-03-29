/**
 * Populates the jobseeker Registries with data
 * 
 */

const bnUtil = require('../bn-connection-util');
const arrays = require('./arrays');

const participantNamespace = 'io.onemillionyearsbc.hubtutorial';
const seekerResourceName = 'HubJobSeeker';

// const bnUtil = require('../bn-connection-util');
const namespace = 'io.onemillionyearsbc.hubtutorial';
const transactionType = "CreateJobSeekerAccount";

bnUtil.cardName='admin@hubtutorial';
if(process.argv.length < 3){
    console.log("Usage: node createJobSeekerHubAccount   <card-name> ")
    console.log("Amending Network using a card: ",bnUtil.cardName);
} else {
    bnUtil.cardName = process.argv[2];
    console.log("Amending Network using a card: ",bnUtil.cardName);
}
// bnUtil.connect(removeRecruitersAndJobSeekers);
bnUtil.connect(main);

//----------------------------------------------------------------
const csvFilePath = './seekers.csv';
const csv = require('csvtojson')

csv()
	.fromFile(csvFilePath)
	.then((jsonObj) => {
		
	})


// Callback function passed to the BN Connection utility
// Error has value if there was an error in connect()
async function main(){

    console.log("Creating Accounts...");
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
   
    const jsonArray = await csv().fromFile(csvFilePath);
    let count = 0;
	for (var key in jsonArray) {
		if (jsonArray.hasOwnProperty(key)) {
			var val = jsonArray[key];
			
            let transaction = factory.newTransaction(namespace,transactionType,"",options);

            // Set up the properties of the transaction 
            
            var params = factory.newConcept(namespace, 'HubJobSeekerParameters');

            var name = factory.newConcept(namespace, 'Name');
            name.title = getRandomArrayElement(titleArray);
            name.firstName = `${val.first_name}`;
            name.lastName = `${val.last_name}`;
            params.name = name;

            // var address = factory.newConcept(namespace, 'Address');
            params.country = getCountryName(`${val.nationality}`);
            params.city = `${val.address_city}`;
            params.phone = `${val.telephone_number}`;
            
           
            let skills = "";
            chosen = [];
            
            var i = getRandomIndex(2, 5);
            let skill;
            for (let j = 0; j < i; j++) { 
                do {
                    skill = getRandomArrayElement(skillsArray);
                } while (chosen.includes(skill) != false);              
                skills = skills + skill;
                if (j < i-1) {
                    skills = skills + ", ";
                }
                chosen.push(skill)
            }
            params.skills = skills;

            // concept HubJobSeekerParameters {
            //   
            //     o String cvhash optional
            //     o String weblink optional
            //     o Integer itexperience optional
            //     o String skills optional
            //     o BlockchainType  blockchainUsed optional
            //     o Integer blockexperience optional
            //     o String newjobsummary optional
            //     o String newjobtitle optional
            //     o Boolean newjobremote default=false
            //     o JobType newjobtype default = "FULLTIME"
            //     o Boolean visibility default=false
            //   }

            var email = `${val.email}`;
            transaction.setPropertyValue('params',params);

            transaction.setPropertyValue('email',email);
            transaction.setPropertyValue('password', `${val.password}`);

            var id = email.substring(0, email.lastIndexOf("@"));

            id = id.replace(/\./g,'-')
            var weblink = 'https://www.linkedin.com/in/' + id;

            itexp =  getRandomArrayElement(itexpArray);

            let newjobsummary = "I would like to work with " +  getRandomArrayElement(blockchainArray);
            params.weblink = weblink;
            params.itexperience = itexp;
            params.blockchainUsed = getRandomArrayElement(blockchainArray);
            params.blockexperience = getRandomIndex(0, 2);
            params.newjobtitle = getRandomArrayElement(arrays.jobTitlesArray);
            
            params.newjobremote = getRandomArrayElement(arrays.trueFalseArray);
            params.visibility = getRandomArrayElement(arrays.trueFalseArray);
            params.newjobtype = getRandomArrayElement(arrays.jobTypeArray);
            params.newjobsummary = newjobsummary;

            // Submit the transaction
         
            console.log(">>> generating job seeker with id: " + email);
            console.log("   => title =  " + params.name.title);
            console.log("   => first name =  " + params.name.firstName);
            console.log("   => last name  =  " + params.name.lastName);
            console.log("   => country =  " + params.country);
            console.log("   => location =  " + params.city);
            console.log("   => phone =  " + params.phone);
            console.log("   => weblink =  " + params.weblink);
            console.log("   => years experience =  " + params.itexperience);
            console.log("   => skills =  " + params.skills);
            console.log("   => yrs. blockchain experience =  " + params.blockexperience);
            console.log("   => main blockchain used =  " + params.blockchainUsed);
            console.log("   => preferred job title =  " + params.newjobtitle);
            console.log("   => preferred job type =  " + params.newjobtype)
            console.log("   => preferred job description =  " + params.newjobsummary);;
            console.log("   => new job remote =  " + params.newjobremote);
            console.log("   => cv visible =  " + params.visibility);
           

            try {
                await bnUtil.connection.submitTransaction(transaction);
                console.log("Transaction processed: Account created!");
                count++;
        
            } catch (error) {
                console.log('Account creation failed: ' + error);
            }        
		}
    }

    console.log("All done. " + count + " jobseeker accounts created.");
    bnUtil.disconnect();

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

function getRandomIndex(min, max) {
    //Get a random integer between the min and max value.
    var randIndex = Math.round(Math.random() * (max - min)) + min;
    //Return random value.
    return randIndex;
}



var skillsArray = new Array(
    "Java/J2EE",
    "HTML/CSS", 
    "AngularJS",
    "SQL",
    "Agile methodologies",
    "Java/J2EE, Servlets, JSP, EJB & Struts",
    "Hadoop big data ecosystems (MapReduce, HDFS, HBase, Zookeeper, Hive, Pig, Sqoop, Cassandra, Oozie, Talend),  Java, C/C++, Python, Bash,Data modeling, analysis, and mining,Machine learning",
    "C#,.Net",
    "Python, HTML, CSS, Javascript",
    "HTML, CSS, Javascript",
    "Hyperledger, Go",
    "Ethereum, Solidity, Java",
    "C++",
    "RUST",
    "Oracle",
    "Linux",
    "Blockchain",
    "Corda",
    "Matlab",
    "R",
    "Linux"
)
var itexpArray = new Array(
    0,
    1,
    2,
    3,
    5,
    10,
    20
);
var titleArray = new Array(
    'DR',
    'MR',
    'MRS',
    'MISS',
    'MS',
    'PROF'
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

var isoCountries = {
    'AF' : 'Afghanistan',
    'AX' : 'Aland Islands',
    'AL' : 'Albania',
    'DZ' : 'Algeria',
    'AS' : 'American Samoa',
    'AD' : 'Andorra',
    'AO' : 'Angola',
    'AI' : 'Anguilla',
    'AQ' : 'Antarctica',
    'AG' : 'Antigua And Barbuda',
    'AR' : 'Argentina',
    'AM' : 'Armenia',
    'AW' : 'Aruba',
    'AU' : 'Australia',
    'AT' : 'Austria',
    'AZ' : 'Azerbaijan',
    'BS' : 'Bahamas',
    'BH' : 'Bahrain',
    'BD' : 'Bangladesh',
    'BB' : 'Barbados',
    'BY' : 'Belarus',
    'BE' : 'Belgium',
    'BZ' : 'Belize',
    'BJ' : 'Benin',
    'BM' : 'Bermuda',
    'BT' : 'Bhutan',
    'BO' : 'Bolivia',
    'BA' : 'Bosnia And Herzegovina',
    'BW' : 'Botswana',
    'BV' : 'Bouvet Island',
    'BR' : 'Brazil',
    'IO' : 'British Indian Ocean Territory',
    'BN' : 'Brunei Darussalam',
    'BG' : 'Bulgaria',
    'BF' : 'Burkina Faso',
    'BI' : 'Burundi',
    'KH' : 'Cambodia',
    'CM' : 'Cameroon',
    'CA' : 'Canada',
    'CV' : 'Cape Verde',
    'KY' : 'Cayman Islands',
    'CF' : 'Central African Republic',
    'TD' : 'Chad',
    'CL' : 'Chile',
    'CN' : 'China',
    'CX' : 'Christmas Island',
    'CC' : 'Cocos (Keeling) Islands',
    'CO' : 'Colombia',
    'KM' : 'Comoros',
    'CG' : 'Congo',
    'CD' : 'Congo, Democratic Republic',
    'CK' : 'Cook Islands',
    'CR' : 'Costa Rica',
    'CI' : 'Cote D\'Ivoire',
    'HR' : 'Croatia',
    'CU' : 'Cuba',
    'CY' : 'Cyprus',
    'CZ' : 'Czech Republic',
    'DK' : 'Denmark',
    'DJ' : 'Djibouti',
    'DM' : 'Dominica',
    'DO' : 'Dominican Republic',
    'EC' : 'Ecuador',
    'EG' : 'Egypt',
    'SV' : 'El Salvador',
    'GQ' : 'Equatorial Guinea',
    'ER' : 'Eritrea',
    'EE' : 'Estonia',
    'ET' : 'Ethiopia',
    'FK' : 'Falkland Islands (Malvinas)',
    'FO' : 'Faroe Islands',
    'FJ' : 'Fiji',
    'FI' : 'Finland',
    'FR' : 'France',
    'GF' : 'French Guiana',
    'PF' : 'French Polynesia',
    'TF' : 'French Southern Territories',
    'GA' : 'Gabon',
    'GM' : 'Gambia',
    'GE' : 'Georgia',
    'DE' : 'Germany',
    'GH' : 'Ghana',
    'GI' : 'Gibraltar',
    'GR' : 'Greece',
    'GL' : 'Greenland',
    'GD' : 'Grenada',
    'GP' : 'Guadeloupe',
    'GU' : 'Guam',
    'GT' : 'Guatemala',
    'GG' : 'Guernsey',
    'GN' : 'Guinea',
    'GW' : 'Guinea-Bissau',
    'GY' : 'Guyana',
    'HT' : 'Haiti',
    'HM' : 'Heard Island & Mcdonald Islands',
    'VA' : 'Holy See (Vatican City State)',
    'HN' : 'Honduras',
    'HK' : 'Hong Kong',
    'HU' : 'Hungary',
    'IS' : 'Iceland',
    'IN' : 'India',
    'ID' : 'Indonesia',
    'IR' : 'Iran, Islamic Republic Of',
    'IQ' : 'Iraq',
    'IE' : 'Ireland',
    'IM' : 'Isle Of Man',
    'IL' : 'Israel',
    'IT' : 'Italy',
    'JM' : 'Jamaica',
    'JP' : 'Japan',
    'JE' : 'Jersey',
    'JO' : 'Jordan',
    'KZ' : 'Kazakhstan',
    'KE' : 'Kenya',
    'KI' : 'Kiribati',
    'KR' : 'Korea',
    'KW' : 'Kuwait',
    'KG' : 'Kyrgyzstan',
    'LA' : 'Lao People\'s Democratic Republic',
    'LV' : 'Latvia',
    'LB' : 'Lebanon',
    'LS' : 'Lesotho',
    'LR' : 'Liberia',
    'LY' : 'Libyan Arab Jamahiriya',
    'LI' : 'Liechtenstein',
    'LT' : 'Lithuania',
    'LU' : 'Luxembourg',
    'MO' : 'Macao',
    'MK' : 'Macedonia',
    'MG' : 'Madagascar',
    'MW' : 'Malawi',
    'MY' : 'Malaysia',
    'MV' : 'Maldives',
    'ML' : 'Mali',
    'MT' : 'Malta',
    'MH' : 'Marshall Islands',
    'MQ' : 'Martinique',
    'MR' : 'Mauritania',
    'MU' : 'Mauritius',
    'YT' : 'Mayotte',
    'MX' : 'Mexico',
    'FM' : 'Micronesia, Federated States Of',
    'MD' : 'Moldova',
    'MC' : 'Monaco',
    'MN' : 'Mongolia',
    'ME' : 'Montenegro',
    'MS' : 'Montserrat',
    'MA' : 'Morocco',
    'MZ' : 'Mozambique',
    'MM' : 'Myanmar',
    'NA' : 'Namibia',
    'NR' : 'Nauru',
    'NP' : 'Nepal',
    'NL' : 'Netherlands',
    'AN' : 'Netherlands Antilles',
    'NC' : 'New Caledonia',
    'NZ' : 'New Zealand',
    'NI' : 'Nicaragua',
    'NE' : 'Niger',
    'NG' : 'Nigeria',
    'NU' : 'Niue',
    'NF' : 'Norfolk Island',
    'MP' : 'Northern Mariana Islands',
    'NO' : 'Norway',
    'OM' : 'Oman',
    'PK' : 'Pakistan',
    'PW' : 'Palau',
    'PS' : 'Palestinian Territory, Occupied',
    'PA' : 'Panama',
    'PG' : 'Papua New Guinea',
    'PY' : 'Paraguay',
    'PE' : 'Peru',
    'PH' : 'Philippines',
    'PN' : 'Pitcairn',
    'PL' : 'Poland',
    'PT' : 'Portugal',
    'PR' : 'Puerto Rico',
    'QA' : 'Qatar',
    'RE' : 'Reunion',
    'RO' : 'Romania',
    'RU' : 'Russian Federation',
    'RW' : 'Rwanda',
    'BL' : 'Saint Barthelemy',
    'SH' : 'Saint Helena',
    'KN' : 'Saint Kitts And Nevis',
    'LC' : 'Saint Lucia',
    'MF' : 'Saint Martin',
    'PM' : 'Saint Pierre And Miquelon',
    'VC' : 'Saint Vincent And Grenadines',
    'WS' : 'Samoa',
    'SM' : 'San Marino',
    'ST' : 'Sao Tome And Principe',
    'SA' : 'Saudi Arabia',
    'SN' : 'Senegal',
    'RS' : 'Serbia',
    'SC' : 'Seychelles',
    'SL' : 'Sierra Leone',
    'SG' : 'Singapore',
    'SK' : 'Slovakia',
    'SI' : 'Slovenia',
    'SB' : 'Solomon Islands',
    'SO' : 'Somalia',
    'ZA' : 'South Africa',
    'GS' : 'South Georgia And Sandwich Isl.',
    'ES' : 'Spain',
    'LK' : 'Sri Lanka',
    'SD' : 'Sudan',
    'SR' : 'Suriname',
    'SJ' : 'Svalbard And Jan Mayen',
    'SZ' : 'Swaziland',
    'SE' : 'Sweden',
    'CH' : 'Switzerland',
    'SY' : 'Syrian Arab Republic',
    'TW' : 'Taiwan',
    'TJ' : 'Tajikistan',
    'TZ' : 'Tanzania',
    'TH' : 'Thailand',
    'TL' : 'Timor-Leste',
    'TG' : 'Togo',
    'TK' : 'Tokelau',
    'TO' : 'Tonga',
    'TT' : 'Trinidad And Tobago',
    'TN' : 'Tunisia',
    'TR' : 'Turkey',
    'TM' : 'Turkmenistan',
    'TC' : 'Turks And Caicos Islands',
    'TV' : 'Tuvalu',
    'UG' : 'Uganda',
    'UA' : 'Ukraine',
    'AE' : 'United Arab Emirates',
    'GB' : 'United Kingdom',
    'US' : 'United States',
    'UM' : 'United States Outlying Islands',
    'UY' : 'Uruguay',
    'UZ' : 'Uzbekistan',
    'VU' : 'Vanuatu',
    'VE' : 'Venezuela',
    'VN' : 'Viet Nam',
    'VG' : 'Virgin Islands, British',
    'VI' : 'Virgin Islands, U.S.',
    'WF' : 'Wallis And Futuna',
    'EH' : 'Western Sahara',
    'YE' : 'Yemen',
    'ZM' : 'Zambia',
    'ZW' : 'Zimbabwe'
};

function getCountryName (countryCode) {
    if (isoCountries.hasOwnProperty(countryCode)) {
        return isoCountries[countryCode];
    } else {
        return countryCode;
    }
}
// JSON to call transaction using REST API

// {
//     "$class": "io.onemillionyearsbc.hubtutorial.CreateJobSeekerAccount",
//     "params": {
//       "$class": "io.onemillionyearsbc.hubtutorial.HubJobSeekerParameters",
//       "name": {
//         "$class": "io.onemillionyearsbc.hubtutorial.Name",
//         "title": "string",
//         "firstName": "string",
//         "lastName": "string"
     
//       },
//       "address": {
//         "$class": "io.onemillionyearsbc.hubtutorial.Address",
//         "street": "string",
//         "city": "string",
//         "postCode": "string",
//         "country": "string"
//       }
//      },
//     "accountType": "JOBSEEKER",
//     "email": "string",
//     "password": "string",
//     "hubTokenBalance": 0
//   }
