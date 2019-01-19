/**
 * Create Recruiter Transaction. Create new participants and assets automtically.
 * @param {io.onemillionyearsbc.hubtutorial.CreateHubUserRecruiter} userData
 * @transaction
 */

// async function CreateHubUserRecruiter(userData) {
//     var factory = getFactory();
//     var NS = 'io.onemillionyearsbc.hubtutorial';

//     // 1. create the HubRecruiter
//     // var recruiter = factory.newResource(NS, 'HubRecruiter', 'johndoe@ibm.com');
//     // recruiter.password = 'ChangeMe';
//     // recruiter.company = 'IBM';
  
//    // 1. create the HubRecruiter
//     var recruiter = factory.newResource(NS, 'HubRecruiter', userData.email);
//     recruiter.company = userData.company;
//     recruiter.name = userData.name;
//     recruiter.hubTokenBalance = userData.hubTokenBalance;


//     // usually it will be ...get registry, add new object
//     // 2. Add the new participant resource to the registry
//     const participantRegistry = await getParticipantRegistry(NS + '.HubRecruiter');

//     await participantRegistry.addAll([recruiter]);
// };

/**
 * Create Recruiter Transaction. Create new participants and assets automtically.
 * @param {io.onemillionyearsbc.hubtutorial.CreateHubUserJobSeeker} userData
 * @transaction
 */

// async function CreateHubUserJobSeeker(userData) {
//     var factory = getFactory();
//     var NS = 'io.onemillionyearsbc.hubtutorial';

  
//    // 1. create the HubJobSeeker
//     var seeker = factory.newResource(NS, 'HubJobSeeker', userData.email);

//     var seekerParams = factory.newConcept(NS, 'HubJobSeekerParameters');
//     seekerParams.title = userData.seekerParams.title;
//     seekerParams.firstName = userData.seekerParams.firstName;
//     seekerParams.lastName = userData.seekerParams.lastName;

//     seeker.hubTokenBalance = userData.hubTokenBalance;


//     // usually it will be ...get registry, add new object
//     // 2. Add the new participant resource to the registry
//     const participantRegistry = await getParticipantRegistry(NS + '.HubJobSeeker');

//     await participantRegistry.addAll([seeker]);
// };


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
    var NSJOBS = 'io.onemillionyearsbc.hubtutorial.jobs';

   // Create a JobAds object to attach the the (HubRecruiter) user object
    var jobAds = factory.newResource(NSJOBS, 'JobAds',accountData.email);
  
    // Create an array of JobPosting objects
    //var jobPostings = factory.newResource(NSJOBS, 'JobAds', "123456");

  //let idsArray = new Array(); // alternative, or use implicit below.
   // var jpArray = [] ;
//   let shareAssetRelationship = factory.newRelationship(NS, 'Share', share.getIdentifier());
//   idsArray.push(shareAssetRelationship); // only one element anyway

//   sharedAcc.shares = idsArray;

    // Create the HubRecruiter
    var recruiter = factory.newResource(NS, 'HubRecruiter', accountData.email);
    recruiter.company = accountData.company;
    recruiter.name = accountData.name;
  	recruiter.hubTokenBalance = accountData.hubTokenBalance;
    recruiter.jobAds = factory.newRelationship(NSJOBS, 'JobAds', accountData.email);
    //recruiter.jobPostings = factory.newRelationship(NSJOBS, 'JobPostings', accountData.id);
  
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

    const jobAdsRegistry = await getAssetRegistry(NSJOBS + '.JobAds');

    await jobAdsRegistry.addAll([jobAds]);

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
            credentials.loggedIn = true;
          	await SetLoggedIn(credentials);
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
        "email": credentials.email,
        "password": credentials.password,
    });
   
    if (results.length == 1) {
        account = results[0];
        let user = await query('selectHubJobSeekerByEmail', {
            "email": credentials.email,
        });
        if (user.length == 1) {
            credentials.loggedIn = true;
            await SetLoggedIn(credentials);
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
 * @param {io.onemillionyearsbc.hubtutorial.SetLoggedIn} credentials
 * @transaction
 */
async function SetLoggedIn(credentials) {
    await loggedInHelper(credentials.email, credentials.loggedIn);
}

/**
 * buy job credits transaction processor function.
 * @param {io.onemillionyearsbc.hubtutorial.jobs.BuyJobCredits} credentials
 * @transaction
 */
async function BuyJobCredits(credentials) {
    var assetRegistry = await getAssetRegistry('io.onemillionyearsbc.hubtutorial.jobs.JobAds');

    var user = await assetRegistry.get(credentials.email);

    user.remaining += credentials.credits;

    // Update the asset in the asset registry.
    await assetRegistry.update(user);
}

/**
 * Return JobAds record according to email 
 * @param {io.onemillionyearsbc.hubtutorial.jobs.GetJobAds} credentials
 * @returns {io.onemillionyearsbc.hubtutorial.jobs.JobAds} The JobAds record for this user
 * @transaction
 */
async function GetJobAds(credentials) {
    let results = await query('selectJobAds', {
        "email": credentials.email
    });
   
    if (results.length == 1) {
        return results[0];
    }
      
    return undefined;
}

/**
 * Return HubUser according to email and password
 * @param {io.onemillionyearsbc.hubtutorial.jobs.CreateJobPosting} credentials
 * @transaction
 */
async function CreateJobPosting(credentials) {
    var NS = 'io.onemillionyearsbc.hubtutorial';
    var NSJOBS = 'io.onemillionyearsbc.hubtutorial.jobs';
    var factory = getFactory();

    var posting = factory.newResource(NSJOBS, 'JobPosting', credentials.jobReference);
    posting.email = credentials.email;
   
    const assetRegistry = await getAssetRegistry(NSJOBS + '.JobPosting');

    await assetRegistry.addAll([posting]);
  
    const participantRegistry = await getParticipantRegistry(NS + '.HubRecruiter');

    var recruiter = await participantRegistry.get(credentials.email);

    if (recruiter.jobPostings == undefined) {
        recruiter.jobPostings = new Array();
        recruiter.jobPostings[0] = posting;
    } else {
        recruiter.jobPostings.push(posting);
    }

    participantRegistry.update(recruiter)
}