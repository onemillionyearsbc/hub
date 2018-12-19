/**
 * Populates the Hub Recruiters Registries with data
 * 
 * Composer 0.19.0
 */

const bnUtil = require('../bn-connection-util');

const participantNamespace = 'io.onemillionyearsbc.hubtutorial';
const recruiterResourceName = 'HubRecruiter';


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


/**
 * Returns an array of employer instances
 */
function    createRecruiterInstances(){
    // This Array will hold the instances of employer resource
    let    recruiters = [];
    const  bnDef = bnUtil.connection.getBusinessNetwork();
    const  factory = bnDef.getFactory();

    // Instance#1
    let    recruiterResource = factory.newResource(participantNamespace,recruiterResourceName,'andy@hub.com');
    recruiterResource.setPropertyValue('company','Hub');
    recruiterResource.setPropertyValue('password','bollocks');
  
    // Push instance to  the aircrafts array
    recruiters.push(recruiterResource);

    // Instance#2
    // recruiterResource = factory.newResource(participantNamespace,recruiterResourceName,'102');
    // recruiterResource.setPropertyValue('companyName','IBM');
    // recruiterResource.setPropertyValue('email','gavin@ibm.com');
   
    // // Push instance to  the aircrafts array
    // employers.push(recruiterResource);

    // // Instance#3
    // recruiterResource = factory.newResource(participantNamespace,recruiterResourceName,'103');
    // recruiterResource.setPropertyValue('companyName','Microsoft');
    // recruiterResource.setPropertyValue('email','billg@microsoft.com');
  
    // // Push instance to  the aircrafts array
    // employers.push(recruiterResource);

    // employer(factory, employers, '104', 'Amazon', 'bigjohn@amazon.com');

    return recruiters;
}
function    createDeveloperInstances(){
    // 3. This Array will hold the instances of employer resource
    let    developers = [];
    const  bnDef = bnUtil.connection.getBusinessNetwork();
    const  factory = bnDef.getFactory();

    developer(factory, developers,'001','Mike','Richardson','emerysolutions@yahoo.co.uk');
    developer(factory, developers,'002','Geomina','Turlea', 'geominat@gmail.com');
    developer(factory, developers,'003','Sabin','Chiricescu', 'sabin.chiricescu@dispp.ro');
    developer(factory, developers,'004','Carmen','Bahrim', 'carmen.bahrim@gmail.com');
    developer(factory, developers,'005','Andy','Richardson', 'andy_richardson1@yahoo.co.uk');
    developer(factory, developers,'006','Richard','West', 'richardgwest@hotmail.com');
    developer(factory, developers,'007','Marcel','Collard', 'marcelc@neverseeme.com');
    developer(factory, developers,'008','Mistress','Ploppy', 'ploppy@ploppy.com');
    // Instance#1
  /*
{
    "$class": "io.onemillionyearsbc.hub.participant.Developer",
      "developerId": "001",
      "firstName": "Mike",
      "lastName": "Richardson",
      "email": "emerysolutions@yahoo.co.uk"
    }
    
    {
      "$class": "io.onemillionyearsbc.hub.participant.Developer",
      "developerId": "002",
      "firstName": "Geomina",
      "lastName": "Turlea",
      "email": "geominat@gmail.com"
    }
  */  

    
    return developers;
}

function employer(factory, employers, id, name, email) {
    recruiterResource = factory.newResource(participantNamespace,recruiterResourceName,id);
    recruiterResource.setPropertyValue('companyName',name);
    recruiterResource.setPropertyValue('email',email);
  
    // Push instance to  the aircrafts array
    employers.push(recruiterResource);
}

function developer(factory, developers, id, firstName, lastName, email) {
    developerResource = factory.newResource(participantNamespace,developerResourceName,id);
    developerResource.setPropertyValue('firstName',firstName);
    developerResource.setPropertyValue('lastName',lastName);
    developerResource.setPropertyValue('email',email);
  
    // Push instance to  the aircrafts array
    developers.push(developerResource);
}
function createFlightTransactions(){
    let    flights = [];
    const  bnDef = bnUtil.connection.getBusinessNetwork();
    const  factory = bnDef.getFactory();

    const transactionType = 'CreateFlight';

    // Transaction instance#1
    let transaction = factory.newTransaction(flightNamespace,transactionType);
    transaction.setPropertyValue('flightNumber','AE101');
    transaction.setPropertyValue('origin', 'EWR');
    transaction.setPropertyValue('destination' , 'SEA');
    transaction.setPropertyValue('schedule' , new Date('2018-10-15T21:44Z'));
    flights.push(transaction);

    // Transaction instance#2
    transaction = factory.newTransaction(flightNamespace,transactionType);
    transaction.setPropertyValue('flightNumber','AE102');
    transaction.setPropertyValue('origin', 'ATL');
    transaction.setPropertyValue('destination' , 'EWR');
    transaction.setPropertyValue('schedule' , new Date('2018-11-16T21:44Z'));
    flights.push(transaction)

    // Transaction instance#2
    transaction = factory.newTransaction(flightNamespace,transactionType);
    transaction.setPropertyValue('flightNumber','AE103');
    transaction.setPropertyValue('origin', 'SEA');
    transaction.setPropertyValue('destination' , 'JFK');
    transaction.setPropertyValue('schedule' , new Date('2018-12-17T21:44Z'));
    flights.push(transaction)

    return flights;
}