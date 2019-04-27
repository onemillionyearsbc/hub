/**
 * Return CVSearchResults record according to CV search critereia 
 * @param {io.onemillionyearsbc.hubtutorial.jobs.CVSearch} credentials
 * @returns {io.onemillionyearsbc.hubtutorial.CVSearchResults} search results object 
 * @transaction
 */
async function CVSearch(credentials) {
    var filter = {};

    var predicate = ` WHERE ((params.visibility == true) AND (params.newjobremote == _$remote)`;

    filter.remote = credentials.searchCriteria.remote;

    // if (credentials.searchCriteria.skills != undefined && credentials.searchCriteria.skills.length > 0) {
    //     predicate += ` AND (params.skills CONTAINS _$skills)`;
    //     filter.skills = credentials.searchCriteria.skills;
    // }


    if (credentials.searchCriteria.languages != undefined && credentials.searchCriteria.languages.length > 0) {
        predicate += ` AND (params.languages CONTAINS _$languages)`;
        filter.languages = credentials.searchCriteria.languages;
    }

    if (credentials.searchCriteria.city != "") {
        predicate += ` AND (params.city == _$city)`;
        filter.city = credentials.searchCriteria.city;
    }

    if (credentials.searchCriteria.country != "") {
        predicate += ` AND (params.country == _$country)`;
        filter.country = credentials.searchCriteria.country;
    }

    if (credentials.searchCriteria.blockchainName != "" && credentials.searchCriteria.blockchainName != "NONE") {
        predicate += ` AND (params.blockchainUsed == _$blockchainName)`;
        filter.blockchainName = credentials.searchCriteria.blockchainName;
    }

    if (credentials.searchCriteria.jobType != "" && credentials.searchCriteria.jobType != "ANY") {
        predicate += ` AND (params.newjobtype == _$jobType)`;
        filter.jobType = credentials.searchCriteria.jobType;
    }

    if (credentials.searchCriteria.jobTitle != "") {
        predicate += ` AND (params.newjobTitle == _$jobTitle)`;
        filter.jobTitle = credentials.searchCriteria.jobTitle;
    }

    predicate += ')';
    var statement = `SELECT io.onemillionyearsbc.hubtutorial.HubJobSeeker ${predicate}`;

    // Build a query.
    let qry = buildQuery(statement);

    // Execute the query
    let results = await query(qry, filter);

    results = results.filter(e => containsAll(e.params.skills, credentials.searchCriteria.skills) === true);

    let searchResults = buildSearchResults(results, credentials.email);
    var NSJOBS = 'io.onemillionyearsbc.hubtutorial.jobs';
    const searchResultsRegistry = await getAssetRegistry(NSJOBS + '.CVSearchResults');
    await searchResultsRegistry.addAll([searchResults]);

    return searchResults;
}

function buildSearchResults(candidates, email) {
    var NSJOBS = 'io.onemillionyearsbc.hubtutorial.jobs';
    var factory = getFactory();

    let resultId = new Date().getTime().toString().substr(-8);

    var searchResults = factory.newResource(NSJOBS, 'CVSearchResults', resultId);

    let candidatesArray = new Array();
    let count = 10; // max num search results allowed 
    if (candidates.length < 10) {
        count = candidates.length;
    }
    for (let i = 0; i < count; i++) {
        var candidate = factory.newConcept(NSJOBS, 'CandidateResult');
        candidate.email = candidates[i].email;
        candidate.name = candidates[i].params.name.firstName + " " + candidates[i].params.name.lastName;
        let comma = "";
        if (candidates[i].params.city != "") {
            comma = ", ";
        }
        candidate.location = candidates[i].params.city + comma + candidates[i].params.country;
        candidate.skills = candidates[i].params.skills;
        candidatesArray.push(candidate);
    }
    searchResults.results = candidatesArray;
    searchResults.numResults = count;
    searchResults.email = email;
    return searchResults;
}

function containsAll(str, substrings) {
    if (substrings.length === 0) {
        return true;
    }
    let count = 0;
    for (var i = 0; i != substrings.length; i++) {
        var substring = substrings[i];
        if (str.indexOf(substring) != - 1) {
            count++;
            if (count === substrings.length) {
                return true;
            }
        }
    }
    return false;
}
