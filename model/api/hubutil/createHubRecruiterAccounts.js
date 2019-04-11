/**
 * Populates the Hub Recruiters Registries with data
 * 
 * Composer 0.19.0
 */

const bnUtil = require('../bn-connection-util');

const participantNamespace = 'io.onemillionyearsbc.hubtutorial';
const recruiterResourceName = 'HubRecruiter';

// TODO create tokens for new account

// This creates the business network connection object
// // and calls connect() on it. Calls the callback method 
// // 'main' with error
// bnUtil.cardName='admin@hubtutorial';
// // if(process.argv.length < 3){
// //     console.log("Usage: node populateEmployers   <card-name> ")
// //     console.log("Populating Network using a card: ",bnUtil.cardName);
// // } else {
// //     bnUtil.cardName = process.argv[2];
// //     console.log("Populating Network using a card: ",bnUtil.cardName);
// // }
// bnUtil.connect(main);

// const bnUtil = require('../bn-connection-util');
const namespace = 'io.onemillionyearsbc.hubtutorial';
const transactionType = "CreateRecruiterAccount";

bnUtil.cardName='admin@hubtutorial';
if(process.argv.length < 3){
    console.log("Usage: node createHubAccounts   <card-name> ")
    console.log("Amending Network using a card: ",bnUtil.cardName);
} else {
    bnUtil.cardName = process.argv[2];
    console.log("Amending Network using a card: ",bnUtil.cardName);
}
// bnUtil.connect(removeRecruitersAndJobSeekers);
bnUtil.connect(main);

//----------------------------------------------------------------
const csvFilePath = './recruiters.csv';
const csv = require('csvtojson')

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
    // var obj = { a: 1, b: 2 };
    let count = 0;
	for (var key in jsonArray) {
		if (jsonArray.hasOwnProperty(key)) {
			var val = jsonArray[key];
            
            
            let transaction = factory.newTransaction(namespace,transactionType,"",options);

            // Set up the properties of the transaction object
            transaction.setPropertyValue('email',`${val.email}`);
            transaction.setPropertyValue('password', `${val.password}`);
            transaction.setPropertyValue('company', `${val.company_name}`);
            transaction.setPropertyValue('name', `${val.first_name} ${val.last_name}`);
        
            // Submit the transaction
            console.log("email = " + val.email);
            console.log("password = " + val.password);
            console.log("company = " + val.company_name);
            console.log("first name = " + val.first_name);
            console.log("last name = " + val.last_name);
            try {
                await bnUtil.connection.submitTransaction(transaction);
                console.log("Transaction processed: Account created for email " + val.email);
                count++;
        
            } catch (error) {
                console.log('Account creation failed: ' + error);
                break;
            }        
		}
    }
    console.log("All done. "+ count + " accounts created!");
    bnUtil.disconnect();

}
