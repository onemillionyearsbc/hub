/**
 * Create Recruiter Account Transaction. Create new participants and assets automtically.
 * @param {io.onemillionyearsbc.hubtutorial.CreateRecruiterAccount} accountData
 * @transaction
 */

function CreateRecruiterAccount(accountData) {
    var factory = getFactory();
    var NS = 'io.onemillionyearsbc.hubtutorial';

    // 1. create the HubRecruiter
    var recruiter = factory.newResource(NS, 'HubRecruiter', 'geo@worldbank.com');
    recruiter.password = 'ChangeMeSoon';
    recruiter.company = 'World Bank';


    // Create a Hub Account for the recruiter
  
    var recruiterAccount = factory.newResource(NS, 'HubAccount', 'ACC_001');
    recruiterAccount.owner = factory.newRelationship(NS, 'HubUser','geo@worldbank.com');
    recruiterAccount.accountType = "RECRUITER";
    recruiterAccount.dateCreated = new Date();

    // usually it will be ...get registry, add new object
    // 2. Get the HubUser participant

    return getParticipantRegistry(NS + '.HubRecruiter')
        .then(function(participantRegistry){
            return participantRegistry.addAll([recruiter])
        })
        .then(function(){
            return getAssetRegistry(NS + '.HubAccount');
        })
        .then(function(accountRegistry) {
            accountRegistry.addAll([recruiterAccount]);
        });
};


/**
 * Create JobSeeker Account Transaction. Create new participants and assets automtically.
 * @param {io.onemillionyearsbc.hubtutorial.CreateJobSeekerAccount} accountData
 * @transaction
 */

function CreateJobSeekerAccount(accountData) {
    var factory = getFactory();
    var NS = 'io.onemillionyearsbc.hubtutorial';

    // 1. create the HubJobSeeker
    console.log("Creating User Account with user name " + accountData.email)
    var seeker = factory.newResource(NS, 'HubJobSeeker', accountData.email);
    seeker.password = 'ChangeMePlease';

    // 2 create address concept
    var seekerAddress = factory.newConcept(NS, 'Address');
    seekerAddress.street = "4330 Long Street";
    seekerAddress.city = "Brasov";
    seekerAddress.postCode = "100456";
    seekerAddress.country = "Romania";

    seeker.address = seekerAddress;
   

    // 3 create name concept
    var seekerName = factory.newConcept(NS, 'Name');
    seekerName.title = "MR";
    seekerName.firstName = "Sabin";
    seekerName.lastName = "Chiricescu";

    seeker.name = seekerName;

    // 4 Create a HubAccount for the job seeker
  
    var seekerAccount = factory.newResource(NS, 'HubAccount', 'ACC_002');
    seekerAccount.owner = factory.newRelationship(NS, 'HubUser','sabin@hub.com');
    seekerAccount.accountType = "JOBSEEKER";
    seekerAccount.dateCreated = new Date();

    // usually it will be ...get registry, add new object
    // 5 Wire in the HubUser participant and HubAccount asset

    return getParticipantRegistry(NS + '.HubJobSeeker')
        .then(function(participantRegistry){
            return participantRegistry.addAll([seeker])
        })
        .then(function(){
            return getAssetRegistry(NS + '.HubAccount');
        })
        .then(function(accountRegistry) {
            accountRegistry.addAll([seekerAccount]);
        });
};

/**
 * Create JobSeeker User Data. Create new participants automtically.
 * @param {io.onemillionyearsbc.hubtutorial.CreateHubJobSeekerDemoData} accountData
 * @transaction
 */
function CreateHubJobSeekerDemoData(accountData) {
 	var factory = getFactory();
    var NS = 'io.onemillionyearsbc.hubtutorial';
  
    // 1. create the HubJobSeeker
    var andy = generateAndyUserData(factory, NS);
    var carmen = generateCarmenUserData(factory, NS);

    // usually it will be ...get registry, add new object
    // 2. Get the HubUser participant
    return getParticipantRegistry(NS + '.HubJobSeeker')
        .then(function(participantRegistry){
            return participantRegistry.addAll([andy, carmen])
        });
};

function generateAndyUserData(factory, NS) {
    
    // 1. create the HubJobSeeker
    var seeker = factory.newResource(NS, 'HubJobSeeker', 'andy@hub.com');
    seeker.password = 'ChangeMe';

    // create address concept
    var seekerAddress = factory.newConcept(NS, 'Address');
    seekerAddress.street = "15 Hamworthy Road";
    seekerAddress.city = "Swindon";
    seekerAddress.postCode = "SN3 4JP";
    seekerAddress.country = "UK";

    seeker.address = seekerAddress;
   

    // create name concept
    var seekerName = factory.newConcept(NS, 'Name');
    seekerName.title = "MR";
    seekerName.firstName = "Andrew";
    seekerName.lastName = "Richardson";

    seeker.name = seekerName;

    return seeker
}

function generateCarmenUserData(factory, NS) {
    // 1. create the HubJobSeeker
    var seeker = factory.newResource(NS, 'HubJobSeeker', 'carmen@hub.com');
    seeker.password = 'ChangeMeToo';

    // create address concept
    var seekerAddress = factory.newConcept(NS, 'Address');
    seekerAddress.street = "15 Silly Street";
    seekerAddress.city = "Bucharest";
    seekerAddress.postCode = "150789";
    seekerAddress.country = "Romania";

    seeker.address = seekerAddress;
   

    // create name concept
    var seekerName = factory.newConcept(NS, 'Name');
    seekerName.title = "MISS";
    seekerName.firstName = "Carmen";
    seekerName.lastName = "Bahrim";

    seeker.name = seekerName;

    return seeker
}


