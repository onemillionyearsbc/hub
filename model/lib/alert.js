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

    var alertRegistry = await getAssetRegistry(NSJOBS + '.JobAlert');

    if (credentials.remote === true && (credentials.country != "" || credentials.params.city != "")) {
        throw new Error("country and city must be blank for remote jobs");
    }
    let index = 0;
    if (seeker.alerts != undefined) {
        index = seeker.alerts.length;
    }
    var alert = fillAlert(NSJOBS, factory, credentials, index);

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

    var criteria = factory.newConcept(NSJOBS, 'AlertCriteria');
    alert.alertCriteria = criteria;

    alert.alertCriteria.remote = credentials.alertCriteria.remote;
    alert.alertCriteria.employer = credentials.alertCriteria.employer;
    alert.alertCriteria.skills = credentials.alertCriteria.skills;
    alert.alertCriteria.city = credentials.alertCriteria.city;
    alert.alertCriteria.country = credentials.alertCriteria.country;

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
    var predicate = `WHERE ((remote == _$remote) AND (employer == _$employer) 
              AND (skills CONTAINS _$skills)`;

    filter.remote = credentials.remote;
    filter.employer = credentials.employer;
    filter.skills = credentials.skills;

    if (credentials.city != "") {
        predicate += ` AND (city == _$city)`;
        filter.city = credentials.city;
    }

    if (credentials.country != "") {
        predicate += ` AND (country == _$country)`;
        filter.country = credentials.country;
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

    // TEST EVENTS
    var factory = getFactory();
    let basicEvent = factory.newEvent('io.onemillionyearsbc.hubtutorial.jobs', 'AlertEvent');
    basicEvent.message="Search conducted!";
    emit(basicEvent);
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
      "employer": true,
      "skills": ["Java"],
      "city": "London",
      "country": ""
    }
  }
  */