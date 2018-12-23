/**
 * Create Recruiter Transaction. Create new participants and assets automtically.
 * @param {io.onemillionyearsbc.hubtutorial.CreateHubUserRecruiter} userData
 * @transaction
 */

async function CreateHubUserRecruiter(userData) {
    var factory = getFactory();
    var NS = 'io.onemillionyearsbc.hubtutorial';

    // 1. create the HubRecruiter
    // var recruiter = factory.newResource(NS, 'HubRecruiter', 'johndoe@ibm.com');
    // recruiter.password = 'ChangeMe';
    // recruiter.company = 'IBM';
  
   // 1. create the HubRecruiter
    var recruiter = factory.newResource(NS, 'HubRecruiter', userData.email);
    recruiter.company = userData.company;
    recruiter.name = userData.name;
    recruiter.hubTokenBalance = userData.hubTokenBalance;


    // usually it will be ...get registry, add new object
    // 2. Add the new participant resource to the registry
    const participantRegistry = await getParticipantRegistry(NS + '.HubRecruiter');

    await participantRegistry.addAll([recruiter]);
};

/**
 * Create Recruiter Transaction. Create new participants and assets automtically.
 * @param {io.onemillionyearsbc.hubtutorial.CreateHubUserJobSeeker} userData
 * @transaction
 */

async function CreateHubUserJobSeeker(userData) {
    var factory = getFactory();
    var NS = 'io.onemillionyearsbc.hubtutorial';

  
   // 1. create the HubJobSeeker
    var seeker = factory.newResource(NS, 'HubJobSeeker', userData.email);

    var seekerParams = factory.newConcept(NS, 'HubJobSeekerParameters');
    seekerParams.title = userData.seekerParams.title;
    seekerParams.firstName = userData.seekerParams.firstName;
    seekerParams.lastName = userData.seekerParams.lastName;

    seeker.hubTokenBalance = userData.hubTokenBalance;


    // usually it will be ...get registry, add new object
    // 2. Add the new participant resource to the registry
    const participantRegistry = await getParticipantRegistry(NS + '.HubJobSeeker');

    await participantRegistry.addAll([seeker]);
};
/**
 * Create Recruiter Account Transaction. Create new participants and assets automtically.
 * @param {io.onemillionyearsbc.hubtutorial.CreateRecruiterAccount} accountData
 * @transaction
 */

 
async function CreateRecruiterAccount(accountData) {
    var tokens = accountData.email.split(".");
    var suffix = tokens[tokens.length - 1];
    if (suffix == "de") {
        throw "no germans allowed";
    }

    var factory = getFactory();
    var NS = 'io.onemillionyearsbc.hubtutorial';


    // 1. create the HubRecruiter
    var recruiter = factory.newResource(NS, 'HubRecruiter', accountData.email);
    recruiter.company = accountData.company;
    recruiter.name = accountData.name;
  	recruiter.hubTokenBalance = accountData.hubTokenBalance;
   

    // Create a Hub Account for the recruiter
  
    var recruiterAccount = factory.newResource(NS, 'HubAccount', accountData.email);
    recruiterAccount.owner = factory.newRelationship(NS, 'HubUser', accountData.email);
    recruiterAccount.accountType = "RECRUITER";
    recruiterAccount.dateCreated = new Date();
    recruiterAccount.password = accountData.password;

    // usually it will be ...get registry, add new object
    // 2. Get the HubUser participant

    // THIS IS NOT ATOMIC
    // return getParticipantRegistry(NS + '.HubRecruiter')
    //     .then(function(participantRegistry){
    //         return participantRegistry.addAll([recruiter])
    //     })
    //     .then(function(){
    //         return getAssetRegistry(NS + '.HubAccount');
    //     })
    //     .then(function(accountRegistry) {
    //         accountRegistry.addAll([recruiterAccount]);
    //     });

    const participantRegistry = await getParticipantRegistry(NS + '.HubRecruiter');

    await participantRegistry.addAll([recruiter]);

    const accountRegistry = await getAssetRegistry(NS + '.HubAccount');

    await accountRegistry.addAll([recruiterAccount]);
};


/**
 * Create JobSeeker Account Transaction. Create new participants and assets automtically.
 * -> Creates a HubUser (HubJobSeeker) participant
 * -> then creates a HubAccount and wires the two together
 * @param {io.onemillionyearsbc.hubtutorial.CreateJobSeekerAccount} accountData
 * @transaction
 */

async function CreateJobSeekerAccount(accountData) {
    var factory = getFactory();
    var NS = 'io.onemillionyearsbc.hubtutorial';

    var email = accountData.email;
	var seekerParams = factory.newConcept(NS, 'HubJobSeekerParameters');
  
    // 1. create the HubJobSeeker
    console.log("Creating User Account with user name " + email);
    var seeker = factory.newResource(NS, 'HubJobSeeker', email);
   

    // 2 create address concept
    var seekerAddress = factory.newConcept(NS, 'Address');
    seekerAddress.street = accountData.params.address.street;
    seekerAddress.city =  accountData.params.address.city;
    seekerAddress.postCode =  accountData.params.address.postCode;
    seekerAddress.country =  accountData.params.address.country;

  	seeker.params = seekerParams;
    seeker.params.address = seekerAddress;
   

    // 3 create name concept
    var seekerName = factory.newConcept(NS, 'Name');
    seekerName.title =  accountData.params.name.title;
    seekerName.firstName = accountData.params.name.firstName;
    seekerName.lastName = accountData.params.name.lastName;

    seeker.params.name = seekerName;

    // 4 Create a HubAccount for the job seeker
  
    var seekerAccount = factory.newResource(NS, 'HubAccount', accountData.email);
    seekerAccount.owner = factory.newRelationship(NS, 'HubUser',email);
    seekerAccount.accountType = "JOBSEEKER";
    seekerAccount.dateCreated = new Date();
    seekerAccount.password = accountData.password;

    // usually it will be ...get registry, add new object
    // 5 Wire in the HubUser participant and HubAccount asset

    // return getParticipantRegistry(NS + '.HubJobSeeker')
    //     .then(function(participantRegistry){
    //         return participantRegistry.addAll([seeker])
    //     })
    //     .then(function(){
    //         return getAssetRegistry(NS + '.HubAccount');
    //     })
    //     .then(function(accountRegistry) {
    //         accountRegistry.addAll([seekerAccount]);
    //     });

    const participantRegistry = await getParticipantRegistry(NS + '.HubJobSeeker');

    await participantRegistry.addAll([seeker]);

    const accountRegistry = await getAssetRegistry(NS + '.HubAccount');

    await accountRegistry.addAll([seekerAccount]);
};



/**
 * Return HubAccount according to email and password
 * @param {io.onemillionyearsbc.hubtutorial.GetHubAccount} credentials
 * @returns {io.onemillionyearsbc.hubtutorial.HubAccount} The account
 * @transaction
 */
async function GetHubAccount(credentials) {
     let results = await query('selectHubAccountByUserAndPassword', {
     	"email": `${credentials.email}`,
     	"password": `${credentials.password}`,
     });
    
    if (results.length == 1) {
        return results[0];
    } 
  	return null;
}

// TODO GetHubUser: this should call GetHubAccount and, if successful, should then use the email id to get 
// the HubUser record.

/**
 * Return HubUser according to email and password
 * @param {io.onemillionyearsbc.hubtutorial.GetHubRecruiter} credentials
 * @returns {io.onemillionyearsbc.hubtutorial.HubRecruiter} The user
 * @transaction
 */
async function GetHubRecruiter(credentials) {
    var NS = 'io.onemillionyearsbc.hubtutorial';

    let results = await query('selectHubAccountByUserAndPassword', {
        "email": credentials.email,
        "password": credentials.password
    });
   
    if (results.length == 1) {
        account = results[0];
        let user = await query('selectHubRecruiterByEmail', {
            "email": credentials.email,
        });
        if (user.length == 1) {
            return user[0];
        }
    };
    
    return undefined;
}


/**
 * Return HubUser according to email and password
 * @param {io.onemillionyearsbc.hubtutorial.GetHubJobSeeker} credentials
 * @returns {io.onemillionyearsbc.hubtutorial.HubJobSeeker} The user
 * @transaction
 */
async function GetHubJobSeeker(credentials) {
    let results = await query('selectHubAccountByUserAndPassword', {
        "email": `${credentials.email}`,
        "password": `${credentials.password}`,
    });
   
    if (results.length == 1) {
        account = results[0];
        let user = await query('selectHubJobSeekerByEmail', {
            "email": `${credentials.email}`,
        });
        if (user.length == 1) {
            return user[0];
        }
    };
      
    return undefined;
}

async function loggedInHelper(email, loggedIn) {
    // Get the asset registry for the asset.
    var assetRegistry = await getAssetRegistry('io.onemillionyearsbc.hubtutorial.HubAccount');

    var user = await assetRegistry.get(email);

    user.loggedIn = loggedIn;

    // Update the asset in the asset registry.
    await assetRegistry.update(user);
}

/**
 * login transaction processor function.
 * @param {io.onemillionyearsbc.hubtutorial.SetLoggedIn} credentials id of the account, and true/false for logged in
 * @transaction
 */
async function SetLoggedIn(credentials) {
    await loggedInHelper(credentials.email, credentials.loggedIn);
}







