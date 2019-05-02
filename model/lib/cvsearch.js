/**
 * Return CVSearchResults record according to CV search critereia 
 * @param {io.onemillionyearsbc.hubtutorial.jobs.CVSearch} credentials
 * @returns {io.onemillionyearsbc.hubtutorial.CVSearchResults} search results object 
 * @transaction
 */
async function CVSearch(credentials) {
    var assetRegistry = await getAssetRegistry('io.onemillionyearsbc.hubtutorial.jobs.JobAds');

    var user = await assetRegistry.get(credentials.email);

    // user.remaining += credentials.credits;
    if (user.searches === 0) {
        throw new Error("No CVSearch Credits for user: " + credentials.email)
    }

    var filter = {};

    var predicate = ` WHERE ((params.visibility == true) AND (params.newjobremote == _$remote)`;

    filter.remote = credentials.searchCriteria.remote;

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

    // distribute tokens to users based on total availability and number of results


    if (results.length > 0) {
        let resultsCount = Math.min(results.length, credentials.maxResults);
        let amountPerUser = credentials.totalTokensAvail / resultsCount;
        
        amountPerUser = Math.round(amountPerUser); // round to nearest integer

        let searchResults = await buildSearchResults(results, credentials.email, amountPerUser, credentials.totalTokensAvail, credentials.maxResults);

        
        var NSJOBS = 'io.onemillionyearsbc.hubtutorial.jobs';
        const searchResultsRegistry = await getAssetRegistry(NSJOBS + '.CVSearchResults');
        await searchResultsRegistry.addAll([searchResults]);

        user.searches -= 1;
        await assetRegistry.update(user);
        return searchResults;
    } else {
        return undefined;
    }
}

async function buildSearchResults(candidates, email, amountPerUser, totalAmount, maxResults) {
    var NSJOBS = 'io.onemillionyearsbc.hubtutorial.jobs';
    var factory = getFactory();

    let resultId = new Date().getTime().toString().substr(-8);

    var searchResults = factory.newResource(NSJOBS, 'CVSearchResults', resultId);

    let candidatesArray = new Array();
    let count = maxResults; // max num search results allowed 
    if (candidates.length < maxResults) {
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

        // update tokens for this user
        let cred = {};
        cred.email = candidate.email;
        cred.transactionType = "SEARCH";
        cred.amount = amountPerUser;
        cred.updateSupply = false;
        await UpdateTokensForUser(cred);
    }
    const NSTOK = 'io.onemillionyearsbc.hubtutorial.tokens';
    // reduce the overall supply by the total amount
    const erc20Registry = await getAssetRegistry(NSTOK + '.ERC20TokenSupply');

    let tokenSupply = await erc20Registry.get("hub");
    tokenSupply.supply -= totalAmount;
    await erc20Registry.update(tokenSupply);

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
