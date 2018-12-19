/**
 * Populates the jobseeker Registries with data
 * 
 */

const bnUtil = require('../bn-connection-util');

const participantNamespace = 'io.onemillionyearsbc.hubtutorial';
const recruiterResourceName = 'HubRecruiter';

// const bnUtil = require('../bn-connection-util');
const namespace = 'io.onemillionyearsbc.hubtutorial';
const accountResourceName = 'HubAccount';
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
	// var obj = { a: 1, b: 2 };
	for (var key in jsonArray) {
		if (jsonArray.hasOwnProperty(key)) {
			var val = jsonArray[key];
			
            let transaction = factory.newTransaction(namespace,transactionType,"",options);

            // Set up the properties of the transaction object
            transaction.setPropertyValue('email',`${val.email}`);
            transaction.setPropertyValue('password', `${val.password}`);
            transaction.setPropertyValue('company', `${val.company_name}`);
        
            // Submit the transaction
         
            try {
                bnUtil.connection.submitTransaction(transaction);
                console.log("Transaction processed: Account created for email " + val.email)
        
            } catch (error) {
                console.log('Account creation failed: ' + error);
            }        
		}
    }
    console.log("All done.")
    bnUtil.disconnect();

}


