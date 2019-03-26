/**
 * Populates the jobseeker Registries with data
 * 
 */

const bnUtil = require('../bn-connection-util');

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
            params.country = `${val.nationality}`;
            params.city = `${val.address_city}`;
            params.phone = `${val.telephone_number}`;
            // params.address = address;

            // concept HubJobSeekerParameters {
            //     o Name name
            //     o String phone optional
            //     o String country 
            //     o String city optional
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
        
            // Submit the transaction
         
            console.log(">>> generating job seeker with id: " + email);
            console.log("   => title =  " + params.name.title);
            console.log("   => first name =  " + params.name.firstName);
            console.log("   => last name  =  " + params.name.lastName);
            console.log("   => location =  " + params.city);
            console.log("   => phone =  " + params.phone);

            try {
                await bnUtil.connection.submitTransaction(transaction);
                console.log("Transaction processed: Account created!");
        
            } catch (error) {
                console.log('Account creation failed: ' + error);
                break;
            }        
		}
    }

    console.log("All done.")
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

var titleArray = new Array(
    'DR',
    'MR',
    'MRS',
    'MISS',
    'MS',
    'PROF'
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
