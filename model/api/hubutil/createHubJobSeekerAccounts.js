/**
 * Populates the jobseeker Registries with data
 * 
 */

const bnUtil = require('../bn-connection-util');

const participantNamespace = 'io.onemillionyearsbc.hubtutorial';
const seekerResourceName = 'HubJobSeeker';

// const bnUtil = require('../bn-connection-util');
const namespace = 'io.onemillionyearsbc.hubtutorial';
const accountResourceName = 'HubAccount';
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
	var obj = { a: 1, b: 2 };
	for (var key in jsonArray) {
		if (jsonArray.hasOwnProperty(key)) {
			var val = jsonArray[key];
			
            let transaction = factory.newTransaction(namespace,transactionType,"",options);

            // Set up the properties of the transaction 
            
            var params = factory.newConcept(namespace, 'HubJobSeekerParameters');

            var name = factory.newConcept(namespace, 'Name');
            name.title = "MR";
            name.firstName = `${val.first_name}`;
            name.lastName = `${val.last_name}`;
            params.name = name;

            var address = factory.newConcept(namespace, 'Address');
            address.country = `${val.nationality}`;
            address.street = `${val.address_street}`;
            address.city = `${val.address_city}`;
            address.postCode = `${val.address_postal_code}`;
            params.address = address;

    
            transaction.setPropertyValue('params',params);

            transaction.setPropertyValue('email',`${val.email}`);
            transaction.setPropertyValue('password', `${val.password}`);
        
            // Submit the transaction
         
            try {
                await bnUtil.connection.submitTransaction(transaction);
                console.log("Transaction processed: Account created for email " + val.email)
        
            } catch (error) {
                console.log('Account creation failed: ' + error);
                break;
            }        
		}
    }

    console.log("All done.")
    bnUtil.disconnect();

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
