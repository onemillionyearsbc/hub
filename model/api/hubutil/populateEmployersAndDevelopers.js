/**
 * Populates the airline Registries with data
 * 
 * Composer 0.19.0
 */

const bnUtil = require('../bn-connection-util');

const participantNamespace = 'io.onemillionyearsbc.hub.participant';
const employerResourceName = 'Employer';
const developerResourceName = 'Developer';




// This creates the business network connection object
// and calls connect() on it. Calls the callback method 
// 'main' with error
bnUtil.cardName='admin@hub';
if(process.argv.length < 3){
    console.log("Usage: node populateEmployers   <card-name> ")
    console.log("Populating Network using a card: ",bnUtil.cardName);
} else {
    bnUtil.cardName = process.argv[2];
    console.log("Populating Network using a card: ",bnUtil.cardName);
}
bnUtil.connect(main);

// Callback function passed to the BN Connection utility
// Error has value if there was an error in connect()
function main(error){

    if(error){
        console.log(error);
        process.exit(1);
    }

    // create an array of employer instances
    let registry = {};
    let employers = createEmployerInstances();
    let developers = createDeveloperInstances();
    return bnUtil.connection.getParticipantRegistry(participantNamespace+'.'+employerResourceName).then((reg)=>{
        registry = reg;

        // Add employer 
        employers.forEach((current) =>{
            console.log(`Adding: ${current.companyName}`);
        });
        return registry.addAll(employers);

    }).then(()=>{
        console.log("Added all employers!!");
        return bnUtil.connection.getParticipantRegistry(participantNamespace+'.'+developerResourceName).then((reg)=>{
            registry = reg;
    
            // Add developers
            developers.forEach((current) =>{
                console.log(`Adding: ${current.firstName} ${current.lastName}`);
            });
            return registry.addAll(developers);
        }).then(()=>{
            console.log("Added all developers!!");
            //submitCreateFlightTransactions();
    
        }).catch((error)=>{
            console.log(error);
           // bnUtil.disconnect();
        });
    }).then(()=>{
        bnUtil.disconnect();
        console.log("We are done!!");
        //submitCreateFlightTransactions();

    }).catch((error)=>{
        console.log(error);
       // bnUtil.disconnect();
    });

}

/**
 * Create the flights
 */
function submitCreateFlightTransactions(){
    // Create the flight tra
    let flights = createFlightTransactions();

    flights.forEach((txn)=>{
        return bnUtil.connection.submitTransaction(txn).then(()=>{
            console.log("Added flight : ", txn.flightNumber, txn.origin, txn.destination, txn.schedule)
        });
    });
}

/**
 * Returns an array of employer instances
 */
function    createEmployerInstances(){
    // 3. This Array will hold the instances of employer resource
    let    employers = [];
    const  bnDef = bnUtil.connection.getBusinessNetwork();
    const  factory = bnDef.getFactory();

    // Instance#1
    let    employerResource = factory.newResource(participantNamespace,employerResourceName,'101');
    employerResource.setPropertyValue('companyName','Oracle');
    employerResource.setPropertyValue('email','john@oracle.com');
  
    // Push instance to  the aircrafts array
    employers.push(employerResource);

    // Instance#2
    employerResource = factory.newResource(participantNamespace,employerResourceName,'102');
    employerResource.setPropertyValue('companyName','IBM');
    employerResource.setPropertyValue('email','gavin@ibm.com');
   
    // Push instance to  the aircrafts array
    employers.push(employerResource);

    // Instance#3
    employerResource = factory.newResource(participantNamespace,employerResourceName,'103');
    employerResource.setPropertyValue('companyName','Microsoft');
    employerResource.setPropertyValue('email','billg@microsoft.com');
  
    // Push instance to  the aircrafts array
    employers.push(employerResource);

    employer(factory, employers, '104', 'Amazon', 'bigjohn@amazon.com');

    return employers;
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
    employerResource = factory.newResource(participantNamespace,employerResourceName,id);
    employerResource.setPropertyValue('companyName',name);
    employerResource.setPropertyValue('email',email);
  
    // Push instance to  the aircrafts array
    employers.push(employerResource);
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