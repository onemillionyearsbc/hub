
/**
 * Create Recruiter Account Transaction. Create new participants and assets automtically.
 * @param {io.onemillionyearsbc.hubtutorial.CreateRecruiterAccount} accountData
 * @transaction
 */
async function CreateRecruiterAccount(accountData) {

    var factory = getFactory();
    var NS = 'io.onemillionyearsbc.hubtutorial';
    var NSJOBS = 'io.onemillionyearsbc.hubtutorial.jobs';
    var NSTOK = 'io.onemillionyearsbc.hubtutorial.tokens';

    // Create a JobAds object to attach the the (HubRecruiter) user object
    var jobAds = factory.newResource(NSJOBS, 'JobAds', accountData.email);
    var token = factory.newResource(NSTOK, 'ERC20Token', accountData.email);

    // Create the HubRecruiter
    var recruiter = factory.newResource(NS, 'HubRecruiter', accountData.email);
    recruiter.company = accountData.company;
    recruiter.name = accountData.name;
    recruiter.jobAds = factory.newRelationship(NSJOBS, 'JobAds', accountData.email);
    recruiter.hubToken = factory.newRelationship(NSTOK, 'ERC20Token', accountData.email);

    // Create a Hub Account for the recruiter
    var recruiterAccount = factory.newResource(NS, 'HubAccount', accountData.email);
    recruiterAccount.owner = factory.newRelationship(NS, 'HubUser', accountData.email);
    recruiterAccount.accountType = "RECRUITER";
    recruiterAccount.dateCreated = new Date();
    recruiterAccount.password = accountData.password;

    // Set ERC20 Token initial attributes
    if (accountData.balance > accountData.allowance) {
        throw Error("balance cannot be greater than allowance");
    }

    token.balance = accountData.balance;
    token.allowance = accountData.allowance;

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

    const erc20Registry = await getAssetRegistry(NSTOK + '.ERC20Token');

    await erc20Registry.addAll([token]);

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

    seeker.params = seekerParams;

    // 2 copy params
    seeker.params.city = accountData.params.city;
    seeker.params.phone = accountData.params.phone;
    seeker.params.country = accountData.params.country;

    seeker.params.cvhash = accountData.params.cvhash;
    seeker.params.cvfiledate = accountData.params.cvfiledate;
    seeker.params.weblink = accountData.params.weblink;
    seeker.params.itexperience = accountData.params.itexperience;

    seeker.params.skills = accountData.params.skills;
    seeker.params.blockchainUsed = accountData.params.blockchainUsed;
    seeker.params.blockexperience = accountData.params.blockexperience;
    seeker.params.newjobsummary = accountData.params.newjobsummary;
    seeker.params.newjobtitle = accountData.params.newjobtitle;
    seeker.params.newjobremote = accountData.params.newjobremote;
    seeker.params.newjobtype = accountData.params.newjobtype;
    seeker.params.visibility = accountData.params.visibility;

    // 3 create name concept
    var seekerName = factory.newConcept(NS, 'Name');
    seekerName.title = accountData.params.name.title;
    seekerName.firstName = accountData.params.name.firstName;
    seekerName.lastName = accountData.params.name.lastName;

    seeker.params.name = seekerName;

    // 4 Create a HubAccount for the job seeker

    var seekerAccount = factory.newResource(NS, 'HubAccount', accountData.email);
    seekerAccount.owner = factory.newRelationship(NS, 'HubUser', email);
    seekerAccount.accountType = "JOBSEEKER";
    seekerAccount.dateCreated = new Date();
    seekerAccount.password = accountData.password;

    // 5 Wire in the HubUser participant and HubAccount asset

    const participantRegistry = await getParticipantRegistry(NS + '.HubJobSeeker');

    await participantRegistry.addAll([seeker]);

    const accountRegistry = await getAssetRegistry(NS + '.HubAccount');

    await accountRegistry.addAll([seekerAccount]);
};


/**
 * Remove HubUser according to email and password (does not remove account)
 * @param {io.onemillionyearsbc.hubtutorial.RemoveHubUser} credentials
 * @transaction
 */
async function RemoveHubUser(credentials) {
    var NS = 'io.onemillionyearsbc.hubtutorial';

    var accountType = '.HubRecruiter';

    if (credentials.accountType === 'JOBSEEKER') {
        accountType = '.HubJobSeeker';
    }
    // 1 get the registry
    const participantRegistry = await getParticipantRegistry(NS + accountType);

    // 2 remove user from registry
    await participantRegistry.remove(credentials.email);
}
/* TODO RemoveAccountAndHubTokensAndUser */
/* For full implementation we would need to return the user's tokens to the supply 
    then remove the user then remove the account */
 
/* Alternatively just have separate functions and call them one at a time from the client */

/**
 * Remove HubAccount according to email 
 * @param {io.onemillionyearsbc.hubtutorial.RemoveHubAccount} credentials
 * @transaction
 */
async function RemoveHubAccount(credentials) {
    var NS = 'io.onemillionyearsbc.hubtutorial';

    // 1 get the registry
    const assetRegistry = await getAssetRegistry(NS + '.HubAccount');

    // 2 remove account from registry
    await assetRegistry.remove(credentials.email);
}

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
 * Return JobPosting array of records according to email and filter critereia 
 * @param {io.onemillionyearsbc.hubtutorial.jobs.GetJobPostings} filterCriteria
 * @returns {io.onemillionyearsbc.hubtutorial.jobs.JobPosting[]} The JobPosting records for these user and criteria
 * @transaction
 */
async function GetJobPostings(filterCriteria) {
    let results = await query('filterJobAdsForRecruiter', {
        "email": filterCriteria.email,
        "filterBy": filterCriteria.filterBy
    });

    return results;
}

function addDays(date, days) {
    return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}
/**
 * Return JobPosting array of records according to email and filter critereia 
 * @param {io.onemillionyearsbc.hubtutorial.jobs.GetJobPostingsDynamic} filterCriteria
 * @returns {io.onemillionyearsbc.hubtutorial.jobs.JobPosting[]} The JobPosting records for these user and criteria
 * @transaction
 */
async function GetJobPostingsDynamic(filterCriteria) {


    var and = "";
    var filter = {};
    filter.email = filterCriteria.email;

    if (filterCriteria.filterBy != "") {
        and += " AND (internalRef == _$filterBy OR jobTitle == _$filterBy OR jobReference == _$filterBy)";
        filter.filterBy = filterCriteria.filterBy;
    }
    if (filterCriteria.dateFrom != "") {
        and += " AND (datePosted > _$dateFrom)";
        filter.dateFrom = filterCriteria.dateFrom;
    }
    if (filterCriteria.dateTo != "") {
        and += " AND (datePosted < _$dateTo)";
        filter.dateTo = filterCriteria.dateTo;
    }
    if (filterCriteria.user != "") {
        and += " AND (contact == _$user)";
        filter.user = filterCriteria.user;
    }
    if (filterCriteria.filterType != "" && filterCriteria.filterType != "ALL") {
        const today = new Date();
        // 1. if LIVE get all jobs where expiryDate > now
        if (filterCriteria.filterType === "LIVE") {
            and += " AND (expiryDate > _$today)";
            filter.today = today;
        }
        // 2. if EXPIRING get all jobs where expiryDate > now and expiryDate < now + 5 days
        else if (filterCriteria.filterType === "EXPIRING") {
            const liveDate = addDays(today, filterCriteria.expiringDays);
            and += " AND (expiryDate > _$today) AND (expiryDate < _$liveDate)";
            filter.today = today;
            filter.liveDate = liveDate;
        }
        // 3. if EXPIRED get all jobs where expiryDate < now
        else if (filterCriteria.filterType === "EXPIRED") {
            and += " AND (expiryDate < _$today)";
            filter.today = today;
        }
    }

    var statement = `SELECT io.onemillionyearsbc.hubtutorial.jobs.JobPosting WHERE (email == _$email${and})`;


    // Build a query.
    let qry = buildQuery(statement);
    // Execute the query

    let results = await query(qry, filter);

    return results;

}

/**
 * Return JobPosting array of records according filter critereia 
 * @param {io.onemillionyearsbc.hubtutorial.jobs.FilterJobPostingsDynamic} filterCriteria
 * @returns {io.onemillionyearsbc.hubtutorial.jobs.JobPosting[]} The JobPosting records for these criteria
 * @transaction
 */
async function FilterJobPostingsDynamic(filterCriteria) {

    var predicate = "";
    var filter = {};
    var nextWord = "WHERE";

    if (filterCriteria.filterBy != "") {
        predicate += ` ${nextWord} ((company == _$filterBy OR internalRef == _$filterBy 
              OR jobTitle == _$filterBy OR jobReference== _$filterBy) OR (skills CONTAINS _$filterBySkills))`;

        filter.filterBy = filterCriteria.filterBy;
        filter.filterBySkills = filterCriteria.filterBySkills;
        nextWord = "AND";
    }

    if (nextWord == "WHERE") {
        predicate = "LIMIT 1000";
    }
    var statement = `SELECT io.onemillionyearsbc.hubtutorial.jobs.JobPosting ${predicate}`;

    // Build a query.
    let qry = buildQuery(statement);

    // Execute the query
    let results = await query(qry, filter);

    return results;

}




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


// TODO store jobpostings rather than strings
// ie we have a reference to a jobposting object


/* TODO REWORK THIS...FAVOURITES SHOULD BE STORED AS ARRAY OF JOB POSTINGS IN USER ACCOUNT
NOT ARRAY OF STRINGS */
/**
 * Return JobPosting array of records according to email and list of jobfavourites 
 * @param {io.onemillionyearsbc.hubtutorial.jobs.GetFavourites} credentials
 * @returns {io.onemillionyearsbc.hubtutorial.jobs.JobPosting[]} The favourites list of JobPosting records for this user
 * @transaction
 */
async function GetFavourites(credentials) {
    let results = await query('selectAllJobPostings', {
    });

    var accountType = '.HubRecruiter';

    if (credentials.accountType === 'JOBSEEKER') {
        accountType = '.HubJobSeeker';
    }

    var NS = 'io.onemillionyearsbc.hubtutorial';

    const participantRegistry = await getParticipantRegistry(NS + accountType);

    var user = await participantRegistry.get(credentials.email);

    if (user.favourites === undefined) {
        return [];
    }
    results = results.filter(e => user.favourites.includes(e.jobReference) === true);
    return results;
}



/**
 * Add the job reference to the list of favourites for the recruiter
 * @param {io.onemillionyearsbc.hubtutorial.jobs.AddJobToFavourites} credentials
 * @transaction
 */
async function AddJobToFavourites(credentials) {
    var NS = 'io.onemillionyearsbc.hubtutorial';
    var accountType = '.HubRecruiter';

    if (credentials.accountType === 'JOBSEEKER') {
        accountType = '.HubJobSeeker';
    }
    const participantRegistry = await getParticipantRegistry(NS + accountType);

    var user = await participantRegistry.get(credentials.email);

    let results = await query('selectJobPostingById', {
        "ref": credentials.jobReference
    });

    if (results.length === 0) {
        throw new Error("Job Reference " + credentials.jobReference + " not found in registry");
    }

    if (user.favourites == undefined) {
        user.favourites = new Array();
        user.favourites[0] = credentials.jobReference;
    } else {
        if (user.favourites.includes(credentials.jobReference) === true) {
            throw new Error("Job Reference " + credentials.jobReference + " already in registry for " + credentials.email);
        }
        user.favourites.push(credentials.jobReference);
    }
    participantRegistry.update(user);
}


/**
 * Remove all job reference favourites for the recruiter
 * @param {io.onemillionyearsbc.hubtutorial.jobs.RemoveAllFavourites} credentials
 * @transaction
 */
async function RemoveAllFavourites(credentials) {
    var NS = 'io.onemillionyearsbc.hubtutorial';

    const participantRegistry = await getParticipantRegistry(NS + '.HubRecruiter');

    var recruiter = await participantRegistry.get(credentials.email);

    recruiter.favourites = new Array();

    participantRegistry.update(recruiter);
}

/**
 * Incerement the number of views for a job reference 
 * @param {io.onemillionyearsbc.hubtutorial.jobs.IncrementViews} credentials
 * @transaction
 */
async function IncrementViews(credentials) {
    var NSJOBS = 'io.onemillionyearsbc.hubtutorial.jobs';

    const jobPostingRegistry = await getAssetRegistry(NSJOBS + '.JobPosting');

    var jobPosting = await jobPostingRegistry.get(credentials.jobReference);

    jobPosting.views++;

    await jobPostingRegistry.update(jobPosting);
}

/**
 * Incerement the number of applications for a job reference 
 * @param {io.onemillionyearsbc.hubtutorial.jobs.IncrementApplications} credentials
 * @transaction
 */
async function IncrementApplications(credentials) {
    var NSJOBS = 'io.onemillionyearsbc.hubtutorial.jobs';

    const jobPostingRegistry = await getAssetRegistry(NSJOBS + '.JobPosting');

    var jobPosting = await jobPostingRegistry.get(credentials.jobReference);

    jobPosting.applications++;

    await jobPostingRegistry.update(jobPosting);
}

/**
 * Remove the job reference from the list of favourites for the recruiter
 * @param {io.onemillionyearsbc.hubtutorial.jobs.RemoveJobFromFavourites} credentials
 * @transaction
 */
async function RemoveJobFromFavourites(credentials) {
    var NS = 'io.onemillionyearsbc.hubtutorial';

    const participantRegistry = await getParticipantRegistry(NS + '.HubRecruiter');

    var recruiter = await participantRegistry.get(credentials.email);

    if (recruiter.favourites.includes(credentials.jobReference) === false) {
        throw new Error("Job Reference " + credentials.jobReference + " not found in registry for " + credentials.email);
    }
    recruiter.favourites = recruiter.favourites.filter(e => e !== credentials.jobReference);

    participantRegistry.update(recruiter);
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
    var jobAdsRegistry = await getAssetRegistry(NSJOBS + '.JobAds');

    var user = await jobAdsRegistry.get(credentials.params.email);

    // check this user has remaining job credits 
    if (user.remaining == 0) {
        throw new Error("No job credits remaining");
    }

    if (credentials.params.remote === true && (credentials.params.location != "" || credentials.params.city != "")) {
        throw new Error("location and city must be blank for remote jobs");
    }

    var posting = fillPosting(NSJOBS, factory, credentials.params);

    // TODO set JobAds data

    const assetRegistry = await getAssetRegistry(NSJOBS + '.JobPosting');

    await assetRegistry.addAll([posting]);

    const participantRegistry = await getParticipantRegistry(NS + '.HubRecruiter');

    var recruiter = await participantRegistry.get(credentials.params.email);

    if (recruiter.jobPostings == undefined) {
        recruiter.jobPostings = new Array();
        recruiter.jobPostings[0] = posting;
    } else {
        recruiter.jobPostings.push(posting);
    }
    participantRegistry.update(recruiter);

    // Update JobAds stats object
    if (credentials.params.testData === true) {
        // if datePosted > today -1 month
        user.live += 1;
    } else {
        user.live += 1;
    }
    user.posted += 1;
    user.remaining -= 1;

    // Update the asset in the asset registry.
    await jobAdsRegistry.update(user);
}

/**
 * Expire JobPosting
 * @param {io.onemillionyearsbc.hubtutorial.jobs.ExpireJobPosting} credentials
 * @transaction
 */
async function ExpireJobPosting(credentials) {
    var NSJOBS = 'io.onemillionyearsbc.hubtutorial.jobs';

    var jobAdsRegistry = await getAssetRegistry(NSJOBS + '.JobAds');

    var user = await jobAdsRegistry.get(credentials.email);

    const jobPostingRegistry = await getAssetRegistry(NSJOBS + '.JobPosting');

    var jobPosting = await jobPostingRegistry.get(credentials.jobReference);

    // check the expiryDate...if already expired throw error
    const now = new Date();
    if (jobPosting.expiryDate < now) {
        throw new Error("Job " + jobPosting.jobReference + " already expired");
    }
    // set the expiry date to be in the past and update the jobposting registry
    jobPosting.expiryDate = now;
    await jobPostingRegistry.update(jobPosting);

    // Update JobAds stats object
    user.live -= 1;

    // Update the asset in the asset registry.
    await jobAdsRegistry.update(user);
}
/**
 * Update JobPosting
 * @param {io.onemillionyearsbc.hubtutorial.jobs.UpdateJobPosting} credentials
 * @transaction
 */
async function UpdateJobPosting(credentials) {
    var NSJOBS = 'io.onemillionyearsbc.hubtutorial.jobs';
    var factory = getFactory();

    const jobPostingRegistry = await getAssetRegistry(NSJOBS + '.JobPosting');

    var existingPosting = await jobPostingRegistry.get(credentials.params.jobReference);

    var posting = fillJobAdParams(existingPosting, credentials.params);

    await jobPostingRegistry.update(posting);
}

function fillPosting(NSJOBS, factory, credentials) {
    var posting = factory.newResource(NSJOBS, 'JobPosting', credentials.jobReference);

    fillJobAdParams(posting, credentials);

    // The calculated stuff...
    var d = new Date();

    if (credentials.testData === true) {
        var min = 1;

        var max = 60;
        // set date to random number of days in the past between 1 and 60
        var days = Math.round(Math.random() * (max - min)) + min;
        d = new Date(d.getTime() - days * 24 * 60 * 60 * 1000);
    }
    posting.datePosted = d;

    var dplus1Month = new Date(d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
    posting.expiryDate = dplus1Month;

    posting.views = 0;
    posting.applications = 0;

    return posting;
}

function fillJobAdParams(posting, credentials) {
    posting.email = credentials.email;
    posting.jobReference = credentials.jobReference;
    posting.company = credentials.company;
    posting.jobType = credentials.jobType;
    posting.remote = credentials.remote;
    posting.jobTitle = credentials.jobTitle;
    posting.blockchainName = credentials.blockchainName;
    posting.description = credentials.description;

    posting.contact = credentials.contact;
    posting.internalRef = credentials.internalRef;
    posting.employer = credentials.employer;
    posting.salary = credentials.salary,
        posting.location = credentials.location;
    posting.city = credentials.city;
    posting.longitude = credentials.longitude;
    posting.latitude = credentials.latitude;

    posting.skills = new Array();
    var i;
    for (i = 0; i < credentials.skills.length; i++) {
        posting.skills.push(credentials.skills[i]);
    }

    posting.logohash = credentials.logohash;
    return posting;
}

/**
 * Return all JobPosting objects
 * @param {io.onemillionyearsbc.hubtutorial.jobs.GetAllLiveJobPostings} credentials
 * @returns {io.onemillionyearsbc.hubtutorial.jobs.JobPosting[]} 
 * @transaction
 */
async function GetAllLiveJobPostings(credentials) {
    let results = await query('selectAllJobPostings', {

    });
    const today = new Date();

    const liveJobs = results.filter(posting => posting.expiryDate > today);

    return liveJobs;
}

/*
{
    "$class": "io.onemillionyearsbc.hubtutorial.jobs.UpdateJobPosting",
    "params": {
      "$class": "io.onemillionyearsbc.hubtutorial.jobs.JobPostingParameters",
      "jobReference": "1100",
    "email": "a.hitler@nazis.com",
    "company": "Nazi Party",
    "jobType": "FULLTIME",
    "remote": false,
    "jobTitle": "Clever Statesman",
    "blockchainName": "ETHEREUM",
    "description": "clever gent needed for Berlin politics job",
    "contact": "A.Speer",
    "internalRef": "AS01",
    "employer": true,
    "skills": [
      "Economics",
      "Architecture"
    ],
    "logohash": "baef234efd45689a4",
      "testData": false
    }
  }

  {
    "$class": "io.onemillionyearsbc.hubtutorial.jobs.CreateJobPosting",
    "params": {
        "$class": "io.onemillionyearsbc.hubtutorial.jobs.JobPostingParameters",
        "jobReference": "990",
        "email": "a.hitler@nazis.com",
        "company": "Nazi Party",
        "jobType": "FULLTIME",
        "remote": false,
        "jobTitle": "Dictator",
        "blockchainName": "ETHEREUM",
        "description": "Austrian zealot required to start wars",
        "contact": "Heinrich Himmler",
        "internalRef": "HH01",
        "location": "Germany",
        "city": "Berlin",
        "longitude": -1.7797176,
        "latitude": 51.55577390000001,
        "employer": false,
        "skills": ["tanks", "politics"],
        "logohash": "0987654321",
        "testData": false
        }
  }

  {
  "$class": "io.onemillionyearsbc.hubtutorial.CreateJobSeekerAccount",
  "params": {
    "$class": "io.onemillionyearsbc.hubtutorial.HubJobSeekerParameters",
    "name": {
      "$class": "io.onemillionyearsbc.hubtutorial.Name",
      "title": "MR",
      "firstName": "Heinz",
      "lastName": "Guderian"
    },
    "phone": "+32494639815",
    "country": "Germany",
    "city": "Frankfurt",
    "cvhash": "ddffeffefefe",
    "weblink": "http://tanks.de",
    "itexperience": 1,
    "skills": "Tanks Are MEEEEEE",
    "blockchainUsed": "CORDA",
    "blockexperience": 1,
    "newjobsummary": "BIG TANKS AND ARTILLERY",
    "newjobtitle": "Inspector",
    "newjobremote": false,
    "newjobtype": "FULLTIME",
    "visibility": false
  },
  "accountType": "JOBSEEKER",
  "email": "h.guderian@wehrmacht.de",
  "password": "fluffy",
  "balance": 10,
  "allowance": 10
}
  */