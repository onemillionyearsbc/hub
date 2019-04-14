/*
 * Transaction Processor code for stuff related to job alerts:
 * Create, Update and Remove Job Alert
 * Fire Alert Search
 */

/**
 * Create a new JobAlert and attach to its owning (JobSeeker) participant
 * @param {io.onemillionyearsbc.hubtutorial.jobs.CreateJobAlert} credentials
 * @transaction
 */
async function CreateJobAlert(credentials) {
    var NS = 'io.onemillionyearsbc.hubtutorial';
    var NSJOBS = 'io.onemillionyearsbc.hubtutorial.jobs';
    var factory = getFactory();

    const participantRegistry = await getParticipantRegistry(NS + '.HubJobSeeker');

    var seeker = await participantRegistry.get(credentials.email);

    if (seeker.alerts != undefined && seeker.alerts.length === 3) {
        throw new Error("Alert not created: maximum 3 alerts per user.");
    }

    if (credentials.alertCriteria.remote === true && (credentials.alertCriteria.country != "" || credentials.alertCriteria.city != "")) {
        throw new Error("country and city must be blank for remote jobs");
    }

    var assetRegistry = await getAssetRegistry(NSJOBS + '.JobAlert');

    var alert = createAlert(NSJOBS, factory, credentials);

    // check this user has remaining job alerts (max 3) 
    if (seeker.alerts == undefined) {
        seeker.alerts = new Array();
        seeker.alerts[0] = alert;
    } else {
        seeker.alerts.push(alert);
    }
    await assetRegistry.addAll([alert]);

    await participantRegistry.update(seeker);

    // add a new parameter: fireImmediate
    // if fireImmediate == true emit an event for the alert server 
    var factory = getFactory();
    let alertEvent = factory.newEvent(NSJOBS, 'AlertEvent');
    alertEvent.message="Alert created";
    alertEvent.id = alert.alertId;
    emit(alertEvent);
}

/**
 * Remove JobAlert for email - id
 * @param {io.onemillionyearsbc.hubtutorial.jobs.RemoveJobAlert} credentials
 * @transaction
 */
async function RemoveJobAlert(credentials) {
    const NS = 'io.onemillionyearsbc.hubtutorial';
    const NSJOBS = 'io.onemillionyearsbc.hubtutorial.jobs';

    const participantRegistry = await getParticipantRegistry(NS + '.HubJobSeeker');

    var email = credentials.alertId.split("-")[0];

    // 1. remove the alert from the alert asset registry
    var assetRegistry = await getAssetRegistry(NSJOBS + '.JobAlert');
    
    await assetRegistry.remove(credentials.alertId);

    // 2. remove the alert from the participant's alert list and update the JobSeeker participant registry
    var seeker = await participantRegistry.get(email);

    seeker.alerts = seeker.alerts.filter(e => e.getIdentifier() != credentials.alertId);
  
    await participantRegistry.update(seeker);
}

/**
 * Update a JobAlert for owning (JobSeeker) participant
 * @param {io.onemillionyearsbc.hubtutorial.jobs.UpdateJobAlert} credentials
 * @transaction
 */
async function UpdateJobAlert(credentials) {
    var NSJOBS = 'io.onemillionyearsbc.hubtutorial.jobs';

    if (credentials.alertCriteria.remote === true && (credentials.alertCriteria.country != "" || credentials.alertCriteria.city != "")) {
        throw new Error("country and city must be blank for remote jobs");
    }

    var assetRegistry = await getAssetRegistry(NSJOBS + '.JobAlert');

    var alert = await assetRegistry.get(credentials.alertId);
    
    alert = fillAlertFields(alert, credentials);

    await assetRegistry.update(alert);
}

function createAlert(NSJOBS, factory, credentials) {

    let id = new Date().getTime().toString().substr(-8); 
    let alertId = credentials.email + "-" + id;

    var alert = factory.newResource(NSJOBS, 'JobAlert', alertId);

    var criteria = factory.newConcept(NSJOBS, 'AlertCriteria');
    alert.alertCriteria = criteria;

    alert = fillAlertFields(alert, credentials);

    return alert;
}

function fillAlertFields(alert, credentials) {
    alert.alertCriteria.remote = credentials.alertCriteria.remote;
    alert.alertCriteria.fulltime = credentials.alertCriteria.fulltime;
    alert.alertCriteria.skills = credentials.alertCriteria.skills;
    alert.alertCriteria.city = credentials.alertCriteria.city;
    alert.alertCriteria.country = credentials.alertCriteria.country;
    alert.alertCriteria.blockchainName = credentials.alertCriteria.blockchainName;
    
    // The calculated stuff...
    var d = new Date();
    alert.datePosted = d;
    return alert;
}
/**
 * Return JobPosting array of records according to alert search critereia 
 * @param {io.onemillionyearsbc.hubtutorial.jobs.FireAlertSearch} credentials
 * @returns {io.onemillionyearsbc.hubtutorial.jobs.JobPosting[]} The JobPosting records for these criteria
 * @transaction
 */
async function FireAlertSearch(credentials) {
    var filter = {};
    var predicate = `WHERE ((remote == _$remote) AND (fulltime == _$fulltime) 
              AND (skills CONTAINS _$skills)`;

    filter.remote = credentials.remote;
    filter.fulltime = credentials.fulltime;
    filter.skills = credentials.skills;

    if (credentials.city != "") {
        predicate += ` AND (city == _$city)`;
        filter.city = credentials.city;
    }

    if (credentials.country != "") {
        predicate += ` AND (country == _$country)`;
        filter.country = credentials.country;
    }
    if (credentials.blockchainName != "" && credentials.blockchainName != "NONE") {
        predicate += ` AND (blockchainName == _$blockchainName)`;
        filter.blockchainName = credentials.blockchainName;
    }
    
    const today = new Date();
    const oneDayAgo = subtractDays(today,1);
    predicate += " AND (datePosted > _$oneDayAgo)";
    filter.oneDayAgo = oneDayAgo;
  
    predicate += ')';
    var statement = `SELECT io.onemillionyearsbc.hubtutorial.jobs.JobPosting ${predicate}`;

    // Build a query.
    let qry = buildQuery(statement);

    // Execute the query
    let results = await query(qry, filter);

    return results;
}

function subtractDays(date, days) {
    return new Date(date.getTime() - days * 24 * 60 * 60 * 1000);
}

/*
{
    "$class": "io.onemillionyearsbc.hubtutorial.jobs.CreateJobAlert",
    "email": "heinz.guderian@wehrmacht.de",
    "alertCriteria": {
      "$class": "io.onemillionyearsbc.hubtutorial.jobs.AlertCriteria",
      "remote": false,
      "fulltime": true,
      "skills": ["Java"],
      "city": "London",
      "country": "United Kingdom",
      "blockchainName": "NONE"
    }
  }
  {
  "$class": "io.onemillionyearsbc.hubtutorial.jobs.UpdateJobAlert",
  "alertId": "heinz.guderian@wehrmacht.de-50710471",
  "alertCriteria": {
    "$class": "io.onemillionyearsbc.hubtutorial.jobs.AlertCriteria",
    "remote": true,
    "fulltime": false,
    "skills": ["Golang"],
    "blockchainName": "HYPERLEDGER",
    "city": "",
    "country": ""
  }
}
  */