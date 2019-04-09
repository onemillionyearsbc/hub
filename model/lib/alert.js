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

// /**
//  * Return JobPosting array of records according to alert search critereia 
//  * @param {io.onemillionyearsbc.hubtutorial.jobs.FireAlertSearch} credentials
//  * @returns {io.onemillionyearsbc.hubtutorial.jobs.JobPosting[]} The JobPosting records for these criteria
//  * @transaction
//  */
// async function FireAlertSearch(credentials) {

//     var predicate = "";
//     var filter = {};
 
//     predicate += `WHERE (remote == _$remote AND employer == _$employer 
//               AND (skills CONTAINS _$skills)`;

//     filter.remote = credentials.alertCriteria.remote;
//     filter.employer = credentials.alertCriteria.employer;
//     filter.skills = credentials.alertCriteria.skills;

//     if (credentials.alertCriteria.city != "") {
//         predicate += ` AND city == _$city`;
//     }

//     if (credentials.alertCriteria.country != "") {
//         predicate += ` AND country == _$country`
//     }
//     predicate += ')';

//     var statement = `SELECT io.onemillionyearsbc.hubtutorial.jobs.JobPosting ${predicate}`;

//     // Build a query.
//     let qry = buildQuery(statement);

//     // Execute the query
//     let results = await query(qry, filter);

//     // TODO filter out all jobs posted within last 24 hours
//     return results;

// }

/**
 * Return JobPosting array of records according to email and filter critereia 
 * @param {io.onemillionyearsbc.hubtutorial.jobs.FireAlertSearch} filterCriteria
 * @returns {io.onemillionyearsbc.hubtutorial.jobs.JobPosting[]} The JobPosting records for these user and criteria
 * @transaction
 */
async function FireAlertSearch(filterCriteria) {

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