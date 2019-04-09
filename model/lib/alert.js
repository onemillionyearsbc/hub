/*
 * Transaction Processor code for stuff related to job alerts:
 * Create, Update and Remove Job Alert
 * Fire Alert Search
 */

// @commit(false)
// @returns(JobPosting[])
// transaction FireAlertSearch {
//   o AlertCriteria alertCriteria
// }

/**
 * Create a new JobPosting and attach to its owning (Recruiter) participant
 * @param {io.onemillionyearsbc.hubtutorial.jobs.CreateJobPosting} credentials
 * @transaction
 */
async function CreateJobAlert(credentials) { 
    var NS = 'io.onemillionyearsbc.hubtutorial';
    var NSJOBS = 'io.onemillionyearsbc.hubtutorial.jobs';
    var factory = getFactory();

    const participantRegistry = await getParticipantRegistry(NS + '.HubJobSeeker');
   
    var seeker = await participantRegistry.get(credentials.email);

    if (seeker.alerts.length === 3) {
        throw new Error("Alert not created: maximum 3 alerts per user.");
    }

    var alertRegistry = await getAssetRegistry(NSJOBS + '.JobAlert'); 

    if (credentials.remote === true && (credentials.country != "" || credentials.params.city != "")) {
        throw new Error("country and city must be blank for remote jobs");
    }
    var alert = fillAlert(NSJOBS, factory, credentials, seeker.alerts.length);

     // check this user has remaining job alerts (max 3) 
    if (seeker.alerts == undefined) {
        seeker.alerts = new Array();
        seeker.alerts[0] = alert;
    } else {
        seeker.alerts.push(alert);
    }
    await alertRegistry.addAll([alert]);
    
    await participantRegistry.update(seeker);
}

function fillAlert(NSJOBS, factory, credentials, index) {
    let id = credentials.email + "-" + index;

    var alert = factory.newResource(NSJOBS, 'JobAlert', id);
    
    alert.remote = credentials.alertCriteria.remote;
    alert.employer = credentials.alertCriteria.employer;
    alert.skills = credentials.alertCriteria.skills;
    alert.city = credentials.alertCriteria.city;
    alert.country = credentials.alertCriteria.country;

    // The calculated stuff...
    var d = new Date();

    if (credentials.testData === true) {
        var min = 1;

        var max = 60;
        // set date to random number of days in the past between 1 and 60
        var days = Math.round(Math.random() * (max - min)) + min;
        d = new Date(d.getTime() - days * 24 * 60 * 60 * 1000);
    }
    alert.datePosted = d;

    return alert;
}
