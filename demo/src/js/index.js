const css = require('../sass/main.scss');
require('./scripts/fontawesome-all');
require('./scripts/sorttable');
const crypto = require('crypto');
const Swal = require('sweetalert2');


import TransactionProcessor from './models/TransactionProcessor';
import * as registerView from './views/registerView';
import * as registerJobSeekerView from './views/registerJobSeekerView';
import * as loginView from './views/loginView';
import * as createJobAdView from './views/createJobAdView';
import * as manageJobAdsView from './views/manageJobAdsView';
import * as blockchainView from './views/blockchaintoolsView';
import * as settingsView from './views/accountSettingsView';
import * as profileView from './views/profileView';
import * as alertView from './views/alertView';
import * as accountView from './views/accountView';
import * as cvSearchView from './views/cvSearchView';
import * as searchView from './views/searchView';

import { getFormFor, clearError, elements, dbelements, elementConsts, inputType, renderLoader, renderLoaderEnd, renderLoaderEndByNumber, renderLoaderByREMFromTop, renderLoaderFromBottom, clearLoader, navBarSetLoggedIn, setLoggedIn, strings, enableCreateJobButton, autocomplete, jobTitles, setButtonHandlers, displayErrorPopup, displaySuccessPopup, updateFavouritesTotal, addFavouritesLinkListener, countriesArray, addToFavouritesHandler } from './views/base';
import { setCompanyName, setContactName, getJobAdsData, setJobAdsData, setCVSearchData, setJobCreditsRemaining } from './views/recruiterDashboardView';
import { setJobAdsNumber, setTotalJobPrice, restyle, adjustSlider, getBuyJobCreditsData } from './views/jobCreditsView';
import { setCVSearchNumber, setTotalCVSearchPrice, restyleCV, adjustSliderCV, getBuyCVSearchData, getTokensToMint } from './views/cvCreditsView';
import DatabaseProcessor from './models/DatabaseProcessor';
import ImageLoader from './models/ImageLoader';
import { populateFilterTable, populatePostedBy, setJobStats } from './views/manageJobAdsView';
import { setJobFields, setApplications, setJobLogo, getExpireJobData, isExpired } from './views/displayJobView';
import { renderResults, setTotalJobsBucket, handleNext, handlePrev, applyFilter, filterByWhere, filterByWhat } from './views/searchView';
import { renderFavouriteResults } from './views/favouritesView';
import { setPrices } from './views/advertView';
import { setJobSeekerEmail, setProfileFields } from './views/profileView';
import { displayApplications } from './views/applicationsView'; // list of jobs seeker has applied for
import { displayRecruiterApplications } from './views/recruiterApplicationsView'; // list of applicants for recruiter to view
import { renderCVSearchResults } from './views/cvSearchResultsView';


loadObjectStore();


// clear object store
// window.indexedDB.databases().then((r) => {
//     for (var i = 0; i < r.length; i++) window.indexedDB.deleteDatabase(r[i].name);
// }).then(() => {
//     alert('All data cleared.');
// });

const state = {};
state.newCV === false;
var quill;
var loggedIn = sessionStorage.getItem('loggedIn');
state.loggedIn = loggedIn === "true" ? true : false;
var imageLoader = new ImageLoader();
state.newImage = false;

// SIGNIN CONTROLLER
const signInHandler = async (e, view, url, transaction) => {
    var btn = e.target;
    const form = getFormFor(btn);
    state.form = form;

    if (form) {
        let formData = view.getFormData(form, transaction);
        const error = view.validateData(formData, state.tabIndex);

        if (error) {
            return error;
        }
        state.login = new TransactionProcessor(formData, url);

        renderLoader(state.tabbedPane);

        try {
            view.clearServerErrorMessage();
            //register a new account
            var resp = await state.login.transaction();

            var err = null;
            if (resp.error !== undefined) {
                err = resp.error;
            }
            if (err != null) {
                console.log(">>>> err message = " + err.message);
                console.log(">>>> err code = " + err.statusCode);

                if (err.message === strings.fetchFail) {
                    view.displayServerErrorMessage(err.message, state.tabIndex);
                } else {
                    if (err.message.includes(strings.alreadyExists)) {
                        view.displayServerErrorMessage(null);
                    } else if (err.message.includes(strings.signInFail)) {
                        view.displayServerErrorMessage(null, state.tabIndex);
                    } else {
                        view.displayErrorFromServerMessage(err.message);
                    }
                }
            } else {
                if (state.tabIndex == elementConsts.JOBSEEKER) {
                    clearCache();
                    setLoggedIn(state, true, resp.params.name.firstName);
                    console.log("getting favourites...");
                    sessionStorage.setItem("user", elementConsts.JOBSEEKER);
                    sessionStorage.setItem("userdata", JSON.stringify(resp));
                    getFavourites();
                    await getAlerts();
                    window.location = "jobseeker-account.html";
                } else {
                    clearCache();
                    setLoggedIn(state, true);
                    console.log("getting favourites...");
                    sessionStorage.setItem("user", elementConsts.RECRUITER);
                    sessionStorage.setItem('mycompany', resp.company);
                    sessionStorage.setItem('name', resp.name);
                    getFavourites();
                    window.location = "recruiter-dashboard.html";
                }
            }
            clearLoader();
        } catch (error) {
            clearLoader();
            return error;
        }
    }
}

function clearCache() {
    // clear object store
    window.indexedDB.databases().then((db) => {
        for (var i = 0; i < db.length; i++) {
            window.indexedDB.deleteDatabase(db[i].name);
        }

    }).then(() => {
        console.log("All Data Cleared!");
    });
}

// SIGNOUT CONTROLLER
const signOutHandler = async () => {
    console.log("state.loggedIn= " + state.loggedIn);
    console.log("state.page= " + state.page);
    if (state.loggedIn === true) {
        if (state.page === elementConsts.MAINPAGE) {
            renderLoader(elements.mainWindow);
        } else if (state.page === elementConsts.DASHBOARDPAGE) {
            renderLoader(elements.dashboard);
        } if (state.page === elementConsts.REGISTERPAGE) {
            renderLoader(state.tabbedPane);
        } else if (state.page === elementConsts.BUYCREDITSPAGE) {
            renderLoader(elements.jobadsWindow);
        } else if (state.page === elementConsts.CREATEJOBADPAGE) {
            renderLoader(elements.adForm);
        } else if (state.page === elementConsts.MANAGEJOBSPAGE) {
            renderLoader(elements.madForm);
        } else if (state.page === elementConsts.DISPLAYJOBPAGE) {
            renderLoader(elements.viewJob);
        } else if (state.page === elementConsts.PROFILEPAGE) {
            renderLoaderEndByNumber(elements.profilePage, 5);
        } else if (state.page === elementConsts.ACCOUNTPAGE) {
            renderLoaderEndByNumber(elements.profilePage, 5);
        } else if (state.page === elementConsts.ALERTPAGE) {
            renderLoader(elements.viewJob);
        } else if (state.page === elementConsts.APPLICATIONPAGE) {
            renderLoader(elements.jobApplications);
        } else if (state.page === elementConsts.SEARCHRESULTSPAGE) {
            renderLoader(elements.searchjob);
        } else if (state.page === elementConsts.CVSEARCHPAGE) {
            renderLoader(elements.cvpanel);
        } else if (state.page === elementConsts.FAVOURITESPAGE) {
            renderLoader(elements.savedJobs);
        }
    }

    var email = sessionStorage.getItem('myemail');
    const data = loginView.getSignOutData(email);
    state.login = new TransactionProcessor(data, strings.setLoggedInUrl);
    var resp = await state.login.transaction();
    var err = null;
    if (resp.error !== undefined) {
        err = resp.err;
    }
    clearLoader();
    if (err == null) {
        setLoggedIn(loginView, false);
        await displaySuccessPopup('You have signed out');
        state.loggedIn = false;
        sessionStorage.clear();
        sessionStorage.setItem('loggedIn', false);
        window.location = "register.html";
    } else {
        console.log("logout, err = " + err);
        await displayErrorPopup('SignOut failed');
    }
}

const CVSearchHandler = async () => {
    renderLoader(elements.cvpanel);

    var email = sessionStorage.getItem('myemail');
    let data = cvSearchView.getFormData(email);

    let tp = new TransactionProcessor(data, strings.cvSearchUrl);

    var candidates = await tp.transaction();

    var err = null;
    if (candidates.error !== undefined) {
        err = candidates.error;
    }
    clearLoader();
    if (err != null) {
        if (err.message.includes("type CVSearchResults was expected")) {
            await displayErrorPopup('No Results Found! Try repeating your search');
        } else {
            await displayErrorPopup('Failed to search CVs: ' + err.message);
        }

    } else {
        sessionStorage.setItem("candidates", JSON.stringify(candidates));
        window.location = "cvsearchresults.html";
    }

}

const buyCVSearchCreditsHandler = async () => {
    renderLoader(elements.jobadsWindow);
    var email = sessionStorage.getItem('myemail');
    var data = getBuyCVSearchData(email);
    state.login = new TransactionProcessor(data, strings.buyJobAdsUrl);
    var resp = await state.login.transaction();
    var err = null;
    if (resp.error !== undefined) {
        err = resp.error;

    }
    if (err != null) {
        await displayErrorPopup('Failed to buy search credits: ' + err);
    } else {
        // TODO Mint new ERC20 tokens based on how many searches purchased by recruiter
        window.location = "recruiter-dashboard.html";
    }
    clearLoader();
}

// JOB ADS CONTROLLER
const buyJobCreditsHandler = async () => {
    renderLoader(elements.jobadsWindow);
    var email = sessionStorage.getItem('myemail');
    var data = getBuyJobCreditsData(email);
    state.login = new TransactionProcessor(data, strings.buyJobAdsUrl);
    var resp = await state.login.transaction();
    var err = null;
    if (resp.error !== undefined) {
        err = resp.error;
    }
    if (err != null) {

    }
    window.location = "recruiter-dashboard.html";
    clearLoader();
}

let cachedData;

// SEARCH CONTROLLER
const searchJobsHandler = async () => {
    state.page = elementConsts.SEARCHRESULTSPAGE;
    renderLoader(elements.searchjob);
    getFavourites();

    // let cachedData = sessionStorage.getItem("jobs");
    // let cachedData = getFromObjectStore("jobs");
    if (cachedData != null && cachedData != undefined) {
        cachedData = JSON.parse(cachedData);
        renderResults(cachedData);
        console.log("SETTING TOTAL JOBS BUCKET...");
        setTotalJobsBucket(cachedData);
    } else {
        await loadCache(true);
    }
    console.log(">>>>>>>>>>>> SEARCH JOBS CONTROLLER >>>>> CHECKING WHAT AND WHERE...");
    console.log("WHERE = " + sessionStorage.getItem("where"));
    clearLoader();
    let what = sessionStorage.getItem("what");
    if (what != null && what != "") {
        let filterItem = { filter: strings.whatFilter, item: "", name: what };
        state.filters = [];
        state.filters.push(filterItem);

        applyFilter(strings.whatFilter, what, "");
    }
    let where = sessionStorage.getItem("where");
    if (where != null && where != "") {
        let filterItem = { filter: strings.locationFilter, item: "", name: where };
        state.filters = [];
        state.filters.push(filterItem);

        applyFilter(strings.locationFilter, where, "");
    }
    let remote = sessionStorage.getItem("filterremote");
    console.log("remote = " + remote);
    if (remote != null && remote != "all") {
        state.filters = [];
        applyFilter(strings.locationFilter, remote, "REMOTE");
    }
    let type = sessionStorage.getItem("filtertype");
    if (type != null && type != "all") {
        state.filters = [];
        applyFilter(strings.jobTypeFilter, type, "");
    }
    let employer = sessionStorage.getItem("filteremployer");
    if (employer != null && employer != "all") {
        state.filters = [];
        applyFilter(strings.employerTypeFilter, type, "");
    }

    clearLoader();
}

async function loadCache(render = false) {
    console.log("GOING TO THE BLOCKCHAIN TO GET LIVE JOBS...");
    var data = {
        $class: strings.getAllJobPostingsTransaction,
    };
    const tp = new TransactionProcessor(data, strings.getAllJobPostingsUrl);

    let rows = await tp.transaction();
    let cdata;
    var err = null;
    if (rows.error !== undefined) {
        err = rows.error;
    }
    if (err != null) {
        await displayErrorPopup('Search failed: ' + err);
    } else {
        let id;
        try {
            let results = await imageLoader.getAllImagesFromDatabase();

            console.log("NUMBER OF ROWS RETURNED = " + results.length);

            for (var i = 0; i < rows.length; i++) {

                console.log("BLOCKCHAIN HASH FOR ROW " + i + " = " + rows[i].logohash);

                // remove any leading zeroes
                id = Number(rows[i].jobReference).toString();
                let rowfound = Array.from(results).find(row => row.id === id);

                console.log("rowfound = " + rowfound);
                console.log("CHECKING HASH FOR IMAGE " + id);
                console.log("DB HASH " + i + " = " + rowfound.hash);

                //     // TODO I would say move this into a crypto class (CryptoProcessor)
                await imageLoader.checkHash(id, rowfound.image, rowfound.hash, rows[i].logohash);
                // console.log("id: " + id + " => HASHES EQUAL!");
                rows[i].logo = rowfound.image;

            }
            state.label = undefined;
            if (render === true) {
                console.log("RENDERING ROWS...LEN = " + rows.length);
                renderResults(rows);
            }


            cdata = JSON.stringify(rows);
            setTotalJobsBucket(rows);
            // TODO look at Max quota for session storage
            // sessionStorage.setItem("jobs", cdata);

            // save the cache date to indexed db instead of local storage
            // var store = transaction.objectStore("jobs");

            await addIndexedData(cdata);
            // request.onerror = function (e) {
            //     console.log("Error", e.target.error.name);
            //     //some type of error handler
            // }

            // request.onsuccess = function (e) {
            //     console.log("Woot! Did it, jobs saved");
            // }


        } catch (error) {
            clearLoader();
            await Swal({
                title: 'ERROR PROCESSING JOBS!',
                text: error + " jobreference = " + id,
                type: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#cc6d14',
            });
        }

    }

    return cdata;
}
const getFavourites = async () => {

    let theEmail = sessionStorage.getItem('myemail');
    if (theEmail === null) {
        return;
    }
    let user = sessionStorage.getItem("user");
    console.log("Getting favourites for " + theEmail);
    let favs = sessionStorage.getItem("favourites");
    if (favs != null && favs.length > 0) {
        favs = JSON.parse(favs);
        console.log("...got " + favs.length + " cached favourites");
        updateFavouritesTotal(favs.length);
        clearLoader();
        return;
    }
    let typeStr = "RECRUITER";
    let type = parseInt(user);
    if (type === elementConsts.JOBSEEKER) {
        typeStr = "JOBSEEKER";
    }
    var data = {
        $class: strings.getAllFavouritesTransaction,
        email: theEmail,
        accountType: typeStr
    };
    let tp = new TransactionProcessor(data, strings.getFavouritesTransactionUrl);

    var favourites = await tp.transaction();

    var err = null;
    if (favourites.error !== undefined) {
        err = favourites.error;
    }
    if (err != null) {
        await displayErrorPopup('Failed to get favourites: ' + err.message);
    } else {
        console.log("received favoruties = " + favourites);
        sessionStorage.setItem("favourites", JSON.stringify(favourites));
        if (favourites.length > 0) {
            updateFavouritesTotal(favourites.length);
        }
    }
    clearLoader();
    favs = sessionStorage.getItem("favourites");
}

const getAlerts = async () => {

    let theEmail = sessionStorage.getItem('myemail');
    if (theEmail === null) {
        return;
    }

    var data = {
        $class: strings.getAlertsTransaction,
        email: theEmail,
    };
    let tp = new TransactionProcessor(data, strings.getAlertsUrl);

    var alerts = await tp.transaction();

    var err = null;
    if (alerts.error !== undefined) {
        err = alerts.error;
    }

    if (err != null) {
        await displayErrorPopup('Failed to get alerts: ' + err.message);
    } else {
        sessionStorage.setItem("alerts", JSON.stringify(alerts));
        state.alerts = alerts;
        console.log("GOT ALERTS, length = " + alerts.length);
    }
    clearLoader();
}

const getApplicationsForJobSeeker = async () => {
    let theEmail = sessionStorage.getItem('myemail');
    if (theEmail === null) {
        return;
    }

    var data = {
        $class: strings.getApplicationsForUserTransaction,
        email: theEmail,
    };
    let tp = new TransactionProcessor(data, strings.getApplicationsForUserUrl);

    var applications = await tp.transaction();

    var err = null;
    if (applications.error !== undefined) {
        err = applications.error;
    }

    if (err != null) {
        await displayErrorPopup('Failed to get applications: ' + err.message);
    } else {
        sessionStorage.setItem("apps", JSON.stringify(applications));
        state.applications = applications;
    }
    clearLoader();
}

const expireJobHandler = async () => {
    var clientHeight = document.getElementById('jobdescription').clientHeight;
    renderLoaderByREMFromTop(elements.lower, (clientHeight / 10) + 30);
    const email = sessionStorage.getItem('myemail');
    const jobid = sessionStorage.getItem('jobReference');

    const data = getExpireJobData(email, jobid);
    const tp = new TransactionProcessor(data, strings.expireJobAdUrl);
    const resp = await tp.transaction();
    var err = null;
    if (resp.error !== undefined) {
        err = resp.error;
    }
    if (err != null) {
        if (err.message.includes("already expired")) {
            await displayErrorPopup('Failed to expire Job: ' + jobid + " already expired");
        } else {
            await displayErrorPopup('Failed to expire Job: ' + err.message);
        }

        clearLoader();
    } else {
        clearLoader();
        await displaySuccessPopup('Job Ad Successfully Expired!');
        window.location = "recruiter-dashboard.html";
    }
}

function enableCVSearchButton(searches) {
    if (searches > 0) {
        elements.cvSearchBtn.disabled = false;
    } else {
        elements.cvSearchBtn.disabled = true;
    }
}

const getJobAdsHandler = async () => {
    var email = sessionStorage.getItem('myemail');
    var data = getJobAdsData(email);
    state.login = new TransactionProcessor(data, strings.getJobAdsurl);

    var resp = await state.login.transaction();

    var err = null;
    if (resp.error !== undefined) {
        err = resp.error;
    }
    if (err != null) {

    } else {
        setJobAdsData(resp.remaining);
        setCVSearchData(resp.searches);
        enableCreateJobButton(resp.remaining);
        enableCVSearchButton(resp.searches);
        sessionStorage.setItem('remaining', resp.remaining);
    }

    data = {
        $class: strings.getJobPostingsTransaction,
        email: sessionStorage.getItem('myemail'),
        filterBy: "",
        filterType: "ALL",
        dateFrom: strings.beginningOfTime,
        dateTo: strings.endOfTime,
        user: ""
    };

    const tp = new TransactionProcessor(data, strings.getJobPostingsUrl);
    let rows = await tp.transaction();

    var err = null;
    if (rows.error !== undefined) {
        err = rows.error;
    }
    if (err != null) {
        console.log("++++++++++++++++++ ERRRORRRRRRR = " + err);
    } else {
        setJobCreditsRemaining(rows);
    }

}


const createJobAdHandler = async (transaction, ins) => {
    var myemail = sessionStorage.getItem('myemail');
    let formData = createJobAdView.getFormData(myemail, quill.root.innerHTML, transaction);

    const error = createJobAdView.validateData(formData.params);

    if (error) {
        return error;
    }
    //---------------------------------------------------
    renderLoaderEnd(elements.adForm);

    // add the hash to the formData here

    // 1. Get the blob

    // only need to calculate the hash if a new logo image has been loaded
    var blob;
    if (state.newImage === true) {
        blob = await imageLoader.getBlob();

        // 2. calculate the hash of the blob
        const myhash = crypto.createHash('sha256') // enables digest
            .update(blob) // create the hash
            .digest('hex'); // convert to string

        formData.params.logohash = myhash;
    } else {
        formData.params.logohash = sessionStorage.getItem("logohash");
        blob = sessionStorage.getItem("logo");
    }

    let jobRef = formData.params.jobReference;
    // 3. write the job id and hash to the database with the image

    // This should go in a createJobModel class really
    var body = JSON.stringify({
        database: dbelements.databaseName,
        table: dbelements.databaseTable,
        email: myemail,
        id: jobRef,
        hash: formData.params.logohash,
        image: blob,
        insert: ins
    });
    const dp = new DatabaseProcessor(dbelements.databaseInsertUri);

    try {
        await dp.transactionPut(body);
    } catch (error) {
        clearLoader();
        await displayErrorPopup('Database put failed: ' + error);
        return;
    }

    // if database succeeds...add to the blockchain
    state.login = new TransactionProcessor(formData, strings.createJobAdUrl);

    var resp = await state.login.transaction();

    var err = null;
    if (resp.error !== undefined) {
        err = resp.error;
    }
    if (err != null) {
        // TODO rollback database transaction: delete row
        await displayErrorPopup('Failed to add Job: ' + err.message);
        clearLoader();
    } else {
        // TODO Commit Database transaction: update committed column to "true"

        // UPDATE THE CACHED JOBS DATA
        if (cachedData != null && cachedData != undefined) {

            // Get the job posting just added so we can add to the cache (i could create this myself but
            // it seemed easier to get it from the blockchain)
            formData = {
                $class: strings.getJobPostingsTransaction,
                email: myemail,
                filterBy: jobRef,
                filterType: "ALL",
                dateFrom: strings.beginningOfTime,
                dateTo: strings.endOfTime,
                user: ""
            };

            const tp = new TransactionProcessor(formData, strings.getJobPostingsUrl);

            state.rows = await tp.transaction();
            if (state.rows.error !== undefined) {
                let err = state.rows.error;
                await displayErrorPopup('cache job failed: ' + err.message);
                clearLoader();
                return;
            } else {
                // add the new job to the cache then stringify it ready to add back into the indexedDB
                console.log("GOT THE NEW JOB; ref = " + state.rows[0].jobReference);
                let data = JSON.parse(cachedData);
                console.log("OLD CACHE SIZE = " + data.length);
                state.rows[0].logo = blob;

                // if this is an update, remove the previous version of the job posting
                // from the cache
                if (sessionStorage.getItem("amend") === "true") {
                    data = data.filter(e => e.jobReference != state.rows[0].jobReference);
                }

                data.push(state.rows[0])
                let cdata = JSON.stringify(data);
                await addIndexedData(cdata);
                console.log("Added new job to cache");

            }
        }
        clearLoader();
        await displaySuccessPopup('Job Ad Successfully Posted!');
        window.location = "recruiter-dashboard.html";
    }
}
const updateProfileHandler = async (transaction, ins) => {
    var myemail = sessionStorage.getItem('myemail');
    let formData = profileView.getProfileFormData(myemail, transaction);

    // const error = profileView.validateData(formData.params);

    // if (error) {
    //     return error;
    // }
    //---------------------------------------------------

    // NEXT UP...BUILD THE BLOCKCHAIN AND DATABASE TRANSACTIONS
    renderLoaderByREMFromTop(elements.adForm, 160);

    // add the hash to the formData here

    // 1. Get the blob

    // only need to calculate the hash if there is a cv file
    if (formData.params.cvfile != undefined && state.newCV === true) {
        var blob;
        // if (state.newCV === true) {
        blob = await imageLoader.getBlob();

        // 2. calculate the hash of the blob
        const myhash = crypto.createHash('sha256') // enables digest
            .update(blob) // create the hash
            .digest('hex'); // convert to string

        formData.params.cvhash = myhash;

        // } 

        // 3. write the job id and hash to the database with the image

        var body = JSON.stringify({
            database: dbelements.databaseName,
            table: dbelements.databaseCVTable,
            email: myemail,
            hash: formData.params.cvhash,
            image: blob,
            insert: ins
        });
        const dp = new DatabaseProcessor(dbelements.databaseInsertUri);

        try {
            await dp.transactionPut(body);
        } catch (error) {
            clearLoader();
            await displayErrorPopup('Database put failed: ' + error);
            return;
        }
    } else {
        if (sessionStorage.getItem("cvhash") != undefined) {
            formData.params.cvhash = sessionStorage.getItem("cvhash");
        } else {
            console.log("sorry mate!");
        }

    }


    // if database succeeds...add to the blockchain
    state.login = new TransactionProcessor(formData, strings.updateProfileUrl);

    var resp = await state.login.transaction();

    var err = null;
    if (resp.error !== undefined) {
        err = resp.error;
    }
    clearLoader();
    if (err != null) {
        // TODO rollback database transaction: delete row
        await displayErrorPopup('Failed to Update Profile: ' + err.message);
    } else {
        // TODO Commit Database transaction: update committed column to "true"

        displaySuccessPopup('Profile Successfully Updated!');
        setLoggedIn(state, true, resp.params.name.firstName);
        sessionStorage.setItem("userdata", JSON.stringify(formData));
        setProfileFields(formData);
        state.newCV === false;
    }
}

const queryAndDisplayJobHandler = async (jobRef) => {
    state.page = elementConsts.DISPLAYJOBPAGE;
    var myemail = sessionStorage.getItem('myemail');

    let formData = {
        $class: strings.getJobByRefTransaction,
        ref: jobRef,
    };

    const tp = new TransactionProcessor(formData, strings.getJobByRefUrl);

    let resp = await tp.transaction();
    if (resp.error !== undefined) {
        console.log("Not found: " + jobRef + "; error = " + resp.error)
        return;
    } else {
        //set the storage items and display
        var propValue;
        for (var propName in resp) {
            propValue = resp[propName];
            sessionStorage.setItem(propName, propValue);
        }
        displayJobHandler();
        elements.buttonPanel.style = "none";

        applyButtons();
    }
}

// test if a job already applied for by user {email}
async function alreadyAppliedFor(jobReference) {
    if (state.loggedIn === false) {
        return false;
    }
    let ref = jobReference;
    if (ref === undefined) {
        ref = sessionStorage.getItem("jobReference");
    }

    let aData = sessionStorage.getItem("apps");

    let applicationData;
    console.log("checking if job " + jobReference + " already applied for");
    console.log("loggedIn = " + state.loggedIn);
    if (aData === null || aData === undefined) {
        await getApplicationsForJobSeeker();
        applicationData = state.applications;
    } else {
        applicationData = JSON.parse(aData);
    }

    let appliedArray = applicationData.filter(e => e.jobReference === ref);
    return (appliedArray.length > 0);
}

async function applyButtons() {
    let already = await alreadyAppliedFor();
    if (isExpired() === true || already === true) {
        elements.buttonPanel.innerHTML = `<button id="applyjobbutton" class="btn btn--disabled" disabled>Already Applied
        </button>`;
    } else {
        elements.buttonPanel.innerHTML = `<button id="applyjobbutton" class="btn btn--orangeandgrey">Apply</button>`;
        document.getElementById("applyjobbutton").addEventListener('click', e => {
            e.preventDefault();
            applyForJobHandler();
        });
    }
}

const displayJobHandler = async () => {
    state.page = elementConsts.DISPLAYJOBPAGE;

    const views = sessionStorage.getItem("views");
    let ref = sessionStorage.getItem("jobReference");
    let v = parseInt(views);

    v = v + 1;

    sessionStorage.setItem("views", v);

    setJobFields();

    incrementViews(ref);

    // don't display application info for jobseekers
    let user = sessionStorage.getItem("user");
    let type = parseInt(user);
    setApplications(type);

    try {
        const image = await imageLoader.getImageFromDatabase(ref, sessionStorage.getItem("logohash"));
        setJobLogo(image);
    }
    catch (error) {
        await Swal({
            title: 'ERROR RETRIEVING IMAGE!',
            text: error,
            type: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#cc6d14',
        });
        return;
    }

    document.getElementById("jobapplications").addEventListener('click', e => {
        e.preventDefault();
        window.location = "recruiter-applications.html";
    });

}

const incrementViews = async (ref) => {

    var data = {
        $class: strings.incrementViewsTransaction,
        jobReference: ref
    };
    let tp = new TransactionProcessor(data, strings.incrementViewsUrl);

    tp.transaction();
}

const manageJobAdHandler = async (displayData) => {
    getFavourites();
    let remaining = sessionStorage.getItem('remaining');
    console.log("REMAINING = " + remaining);
    if (remaining > 0) {
        enableCreateJobButton(remaining);
    }

    var email = sessionStorage.getItem('myemail');
    const data = manageJobAdsView.getFormData(email);

    // const data = { "$class": "io.onemillionyearsbc.hubtutorial.jobs.GetJobAds", "email": sessionStorage.getItem('myemail') };
    const tp = new TransactionProcessor(data, strings.getJobPostingsUrl);
    if (displayData) {
        renderLoader(elements.madForm);
        state.rows = await tp.transaction();

        var err = null;
        if (state.rows.error !== undefined) {
            err = state.rows.error;
        }
        if (err != null) {
            await displayErrorPopup('JobPostings filter failed: ' + err.message);
        } else {

            setJobStats(state.rows);
            populateFilterTable(state.rows, "");
        }
        clearLoader();
    } else {
        state.rows = await tp.transaction();
        if (state.rows.error !== undefined) {
            err = rows.error;
        }
        if (err == null) {
            populatePostedBy(state.rows);
        }
    }
    // renderLoader(elements.madForm);

}

const tabClickHandler = async (e) => {
    state.tabIndex = parseInt(e.target.id.substr(-1));
    state.tabbedPane = state.tabIndex == 1 ? elements.tabbedPane1 : elements.tabbedPane2;
    sessionStorage.setItem('tabbedPane', state.tabbedPane.id);
}

state.page = elementConsts.MAINPAGE; //default

// JOBADMANAGER 
if (document.URL.includes("managejobads")) {
    state.page = elementConsts.MANAGEJOBSPAGE;
    manageJobAdHandler(false);
    const filterByBtn = document.getElementById("filterBtn");
    filterByBtn.addEventListener('click', e => {
        e.preventDefault();
        manageJobAdHandler(true);
    });
    var createButton = elements.createBtn;
    createButton.addEventListener("click", (e) => {
        sessionStorage.setItem("amend", "false");
        window.location = "createjobad.html";
    });
    addFavouritesLinkListener();
}


// VIEW JOB
if (document.URL.includes("displayjob")) {
   
    getFavourites();

    // if the user has clicked here from an email
    // location.search will have a value (the job ref)
    var x = location.search;

    if (x.length > 0 && x.includes("=")) {
        let jobRef = x.split("=");
        console.log("job ref = " + jobRef[1]);
        queryAndDisplayJobHandler(jobRef[1]);

    } else {
        displayJobHandler();
        let email = sessionStorage.getItem("email");
        let myemail = sessionStorage.getItem("myemail");

        // only allow amend/expire if the job belongs to this user
        if (email === myemail) {
            elements.buttonPanel.style = "block";
            if (isExpired() === true) {
                console.log("YAY!!!!")
                elements.expirejobbutton.disabled = true;
            } else {
                elements.expirejobbutton.addEventListener('click', e => {
                    e.preventDefault();
                    expireJobHandler();
                });
            }
            elements.amendjobbutton.addEventListener('click', e => {
                e.preventDefault();
                sessionStorage.setItem("amend", "true");
                window.location = "createjobad.html";
            });
           

        } else {
            elements.buttonPanel.style = "none";
            applyButtons();
        }

    }
    elements.jobcompany.addEventListener('click', e => {
        e.preventDefault();
        sessionStorage.setItem("searchtype", "companytotals");
        sessionStorage.setItem("where", "");
        setTargetAndMoveOn("what", e.target.text);
    });
    elements.joblocation.addEventListener('click', e => {
        e.preventDefault();
        sessionStorage.setItem("searchtype", strings.locationFilter);
        sessionStorage.setItem("what", "");
        setTargetAndMoveOn("where", e.target.innerHTML);
    });
}

function setTargetAndMoveOn(property, value) {
    sessionStorage.setItem(property, value);
    window.location = "search.html";
}
async function doApplyJobTransaction(ref, mail) {
    console.log("Applying For Job: " + ref);

    var data = {
        $class: strings.applyForJobTransaction,
        jobReference: ref,
        email: mail
    };
    let tp = new TransactionProcessor(data, strings.applyForJobUrl);

    var resp = await tp.transaction();

    var err = null;
    if (resp.error !== undefined) {
        err = resp.error;
    }

    if (err != null) {   
        await displayErrorPopup('Failed to Apply for Job: ' + err.message);
        return false;
    } else {
        clearLoader();
        await displaySuccessPopup('Job Application Submitted!');
        await getApplicationsForJobSeeker();  // force cache update
        return true;
    }
}

async function applyForJobHandlerFromFavourites(id, ref) {
    
    let ele = document.getElementById("loadpanel-" + ref);
  
    renderLoaderEndByNumber(ele, 10);
    let mail = sessionStorage.getItem('myemail');
    let result = await doApplyJobTransaction(ref, mail);
    if (result) {
        let favs = sessionStorage.getItem("favourites");
        if (favs != null) {
            favs = JSON.parse(favs);
            console.log("...got " + favs.length + " cached favourites");
        }
        await display(favs);
        sessionStorage.setItem("favourites", JSON.stringify(favs));
        addButtonListeners();
        clearLoader();
    }
}

async function applyForJobHandler() {
    if (state.loggedIn === false) {
        window.location= "register.html";
    }
    
    var clientHeight = document.getElementById('jobdescription').clientHeight;
    renderLoaderByREMFromTop(elements.lower, (clientHeight / 10) + 30);

    let ref = sessionStorage.getItem("jobReference");
    let mail = sessionStorage.getItem('myemail');
    let result = await doApplyJobTransaction(ref, mail);
    if (result) {
        elements.buttonPanel.innerHTML = `<button id="applyjobbutton" class="btn btn--disabled" disabled>Apply</button>`;
    }
}

// CV SEARCH RESULTS CONTROLLER
if (document.URL.includes("cvsearchresults.html")) {
    let candidates = sessionStorage.getItem("candidates");

    if (candidates != null) {
        candidates = JSON.parse(candidates);

        console.log("CANDIDATES SIZE = " + candidates.results.length);

        if (candidates.results.length > 0) {
            renderCVSearchResults(candidates.results);
        } else {
            console.log("....doing NOTHING");
        }
    }
    let downloadCVButtons = document.querySelectorAll(".downloadcvbutton");
    for (let i = 0; i < downloadCVButtons.length; i++) {
        downloadCVButtons[i].addEventListener('click', e => {
            e.preventDefault();

            let ele = document.getElementById(e.target.id);
            renderLoaderEndByNumber(ele, -5);
            getSeekerAndDownloadCV(e.target.dataset.email);
        });
    }

    addShowCandidateProfileHandler();
}

function addShowCandidateProfileHandler() {
    let candidateLinks = document.querySelectorAll(".candidatetitle");
    for (let i = 0; i < candidateLinks.length; i++) {
        candidateLinks[i].addEventListener('click', e => {
            e.preventDefault();
            console.log("Clicked: " + e.target.id + "; email = " + e.target.dataset.email);

            let ele = document.getElementById(e.target.id);
            renderLoaderEndByNumber(ele, -5);
            getSeekerAndShowProfile(e.target.dataset.email);
        });
    }
}
const getAppliedForJobs = async (favourites) => {
    let appliedForJobs = [];
    for (let i = 0; i < favourites.length; i++) {
        let apf = await alreadyAppliedFor(favourites[i].jobReference);
        console.log("....apf = " + apf);
        if (apf) {
            appliedForJobs.push(favourites[i].jobReference);
        }
    }
    return appliedForJobs;
}

async function display(favourites) {
    let user = sessionStorage.getItem("user");
    let type = parseInt(user);
    if (type === elementConsts.JOBSEEKER) {
        let appliedForJobs = await getAppliedForJobs(favourites);
        console.log("appliedForJobs = " + appliedForJobs);
        renderFavouriteResults(favourites, appliedForJobs, false);
    } else {
        renderFavouriteResults(favourites, [], true);
    }
}

const favouritesHandler = async () => {
    state.page = elementConsts.FAVOURITESPAGE;

    let favourites = sessionStorage.getItem("favourites");

    if (favourites != null) {
        favourites = JSON.parse(favourites);
    } else {
        console.log("+++ NO FAVOURITES FOUND +++");
    }
    await display(favourites);
    addButtonListeners();
    elements.removeAllBtn.addEventListener("click", (e) => {
        removeAllFavourites();
    });
}

// FAVOURITES CONTROLLER
if (document.URL.includes("favourites")) {
    favouritesHandler();
}


function addButtonListeners() {
    console.log("ADDING LISTENERS...")
    let removeButtons = document.getElementsByClassName("xxxxx");
    console.log("FOUND NUM BUTTONS = " + removeButtons.length);
    for (let b of removeButtons) {

        console.log("add...button...")
        b.addEventListener("click", (e) => {

            var ref1 = b.dataset.id;
            removeJobFromFavourites(ref1);
        });
    }
    let applyButtons = document.getElementsByClassName("applybtn");
    for (let b of applyButtons) {
        b.addEventListener("click", (e) => {
            var ref2 = b.dataset.id;
            applyForJobHandlerFromFavourites(e.target.id, ref2);
        });
    }
}

const removeAllFavourites = async () => {
    console.log("REMOVE ALL FAVOURITES...");
    let theEmail = sessionStorage.getItem('myemail');
    if (theEmail === null) {
        return;
    }
    // renderLoaderEndByNumber(elements.savedJobs, 50);
    let user = sessionStorage.getItem("user");
    let type = parseInt(user);
    let accType = "RECRUITER";
    if (type === elementConsts.JOBSEEKER) {
        accType = "JOBSEEKER";
    }
    var data = {
        $class: strings.removeAllFavouritesTransaction,
        email: theEmail,
        accountType: accType
    };
    let tp = new TransactionProcessor(data, strings.removeAllFavouritesUrl);

    var resp = tp.transaction();

    var err = null;
    if (resp.error !== undefined) {
        err = resp.error;
    }


    if (err != null) {
        // clearLoader();
        // displayErrorPopup('Failed to remove favourites: ' + err.message);
    } else {
        // remove ALL jobs from cached data
        let favs = sessionStorage.getItem("favourites");
        if (favs != null) {
            favs = []
        }
        renderFavouriteResults(favs);
        console.log("new length of favourites = " + favs.length);
        sessionStorage.setItem("favourites", JSON.stringify(favs));
        addButtonListeners();
        // clearLoader();
        // await displaySuccessPopup('all favourites removed');
    }

}

const removeJobFromFavourites = async (ref) => {
    console.log("REMOVE FAVOURITE JOB REF = " + ref);
    let theEmail = sessionStorage.getItem('myemail');
    if (theEmail === null) {
        return;
    }
    // let ele = document.getElementById(ref);
    // renderLoaderEndByNumber(ele, 50);
    let user = sessionStorage.getItem("user");
    let type = parseInt(user);
    let accType = "RECRUITER";
    if (type === elementConsts.JOBSEEKER) {
        accType = "JOBSEEKER";
    }
    var data = {
        $class: strings.removeFromFavouritesTransaction,
        email: theEmail,
        jobReference: ref,
        accountType: accType
    };
    let tp = await new TransactionProcessor(data, strings.removeFromFavouritesUrl);

    var resp = tp.transaction();

    var err = null;
    if (resp.error !== undefined) {
        err = resp.error;
    }


    if (err != null) {
        // clearLoader();
        // displayErrorPopup('Failed to remove favourite: ' + err.message);
    } else {
        // remove the ref from cached data
        let favs = sessionStorage.getItem("favourites");
        if (favs != null) {
            favs = JSON.parse(favs);
            console.log("...got " + favs.length + " cached favourites");
            favs = removeRef(favs, ref);
        }
        await display(favs);
        sessionStorage.setItem("favourites", JSON.stringify(favs));
        addButtonListeners();
        clearLoader();
    }

}

const removeRef = (favorites, ref) => {
    console.log("REMOVE " + ref + " from filters");
    return (favorites.filter(job => job.jobReference != ref));
}

// SEARCH JOBS

function searchScreenController() {
    searchJobsHandler();

    let nextb = document.getElementById("next");
    nextb.addEventListener('click', handleNext);
    let prevb = document.getElementById("previous");
    prevb.addEventListener('click', handlePrev);



    // this is for when we click on one of the filters in the "filterchain" at the top
    let chainItems = document.getElementsByClassName("filteritem");
    for (let ci of chainItems) {
        ci.addEventListener("click", (e) => {
            sessionStorage.setItem("what", "");
            sessionStorage.setItem("where", "");
            window.location = "search.html";
            // apply each filter in chain up to and including selected item
        });
    }


    // let jc = elements.companyLabelList;
    // console.log("OINKINGTON company element = " + jc);

    let companyItems = document.getElementsByClassName("companylabel");
    for (let ci of companyItems) {
        ci.addEventListener("click", (e) => {
            e.preventDefault();
            // search on the basis of company name
            sessionStorage.setItem("searchtype", "companytotals");
            sessionStorage.setItem("what", e.target.text);
            window.location = "search.html";
        });
    }

    let wherebtn = document.getElementById("where-btn");
    wherebtn.addEventListener("click", (e) => {
        e.preventDefault();
        let where = document.getElementById("where").value;
        sessionStorage.setItem("where", where);
        doWhereSearch();
    });

    let whatbtn = document.getElementById("what-btn");
    whatbtn.addEventListener("click", (e) => {
        e.preventDefault();
        let what = document.getElementById("what").value;
        sessionStorage.setItem("what", what);
        doWhatSearch();
    });
}
function doWhatSearch() {
    filterByWhat(sessionStorage.getItem("what"));
}

function doWhereSearch() {
    filterByWhere(sessionStorage.getItem("where"));
}

function createJobController() {
    quill = new Quill('#editor-container', {
        modules: {
            toolbar: [
                ['bold', 'italic'],
                [{ 'header': 1 }, { 'header': 2 }],
                [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
                [{ list: 'ordered' }, { list: 'bullet' }],
                [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                [{ 'font': [] }],
                [{ 'align': [] }],
            ]
        },
        placeholder: 'Detail the job description and requirements. Do not add contact information or the job will not be approved.',
        theme: 'snow'

    });
    state.page = elementConsts.CREATEJOBADPAGE;
    var submitJobBtn = elements.createjobbutton;
    createJobAdView.setEmail(sessionStorage.getItem('myemail'));
    createJobAdView.setCompany(sessionStorage.getItem('mycompany'));

    if (sessionStorage.getItem("amend") === "true") {
        console.log("AMEND JOB...Setting amend fields");
        createJobAdView.setAmendFields();
    }
    submitJobBtn.addEventListener('click', e => {
        e.preventDefault();
        let transaction = strings.createJobAdTransaction;
        let insert = true;
        console.log("AMENDING JOB...");
        if (sessionStorage.getItem("amend") === "true") {
            transaction = strings.updateJobAdTransaction;
            insert = false;
        }
        createJobAdHandler(transaction, insert);
    });

    var fields = elements.inputFields;
    var i;
    for (i = 0; i < fields.length; i++) {
        fields[i].addEventListener("blur", (e) => {
            createJobAdView.validateField(e.target);
        });
    }

    var jobType = elements.jobtype;
    jobType.addEventListener("change", (e) => {
        clearError(document.getElementById("jobtype-error"));
    });
    var bchain = elements.blockchain;
    bchain.addEventListener("change", (e) => {
        clearError(document.getElementById("blockchain-error"));
    });
    // var description = elements.description;
    // description.addEventListener("change", (e) => {
    //     clearError(document.getElementById("description-error"));
    // });

    document.querySelector("#file-1").addEventListener('change', function () {

        // set the file name in the view text field
        var path = this.value;
        path = path.substring(path.lastIndexOf('\\') + 1);

        try {
            var img = imageLoader.loadImage(this.files[0]);
            createJobAdView.setLogoFileAndImage(path, img);
            state.newImage = true;
        } catch (error) {
            console.log("Error loading image: " + error);
            // TODO display popup? 
        }
    });

    autocomplete(document.getElementById("jobtitle"), jobTitles);
}

// BLOCKCHAIN TOOLS CONTROLLER
if (document.URL.includes("blockchaintools.html")) {
    state.page = elementConsts.BLOCKCHAINPAGE;
    blockchainToolsHandler();

    elements.proofBtn.addEventListener('click', e => {
        console.log(">>> BLOCK BTN CLICKED!");
        e.preventDefault();

        // document.getElementById("bc").style.display = "block";
        doProofHandler();
    });
}

async function doProofHandler() {
    // 1. read in all jobs from blockchain

    let success = true;

    renderLoader(elements.blockchain);
    // 2. for each job 
    //     read in job from database
    //     check hashes
    //     pass id, hashes and result to blockchain tools view to render
    console.log("GOING TO THE BLOCKCHAIN TO GET LIVE JOBS...");
    var data = {
        $class: strings.getAllJobPostingsTransaction,
    };
    const tp = new TransactionProcessor(data, strings.getAllJobPostingsUrl);

    let rows = await tp.transaction();
    var err = null;
    if (rows.error !== undefined) {
        err = rows.error;
    }
    if (err != null) {
        await displayErrorPopup('Search failed: ' + err);
    } else {
        let id;

        let results = await imageLoader.getAllImagesFromDatabase();

        console.log("NUMBER OF ROWS RETURNED = " + results.length);
        let rowItems = [];
        blockchainView.clearHTML();
        let success = true;
        for (var i = 0; i < rows.length; i++) {

            // remove any leading zeroes
            id = Number(rows[i].jobReference).toString();
            let rowfound = Array.from(results).find(row => row.id === id);

            let hashdb = rowfound.hash;
            let hashbc = rows[i].logohash;

            let item = {};
            item.id = id;
            item.hashdb = hashdb;
            item.hashbc = hashbc;
            item.success = true;

            try {
                console.log("CHECKING HASH FOR IMAGE " + id + "; image = " + rowfound.image);
                console.log("BC HASH FOR ROW " + i + " = " + rows[i].logohash);
                console.log("DB HASH FOR ROW " + i + " = " + rowfound.hash);
                await imageLoader.checkHash(id, rowfound.image, hashdb, hashbc); db
                rows[i].logo = rowfound.image;
            } catch (error) {
                console.log("Error loading image: " + error);
                item.success = false;
                success = false;
            }
            rowItems.push(item);
            if (i % 3 == 2) {
                blockchainView.renderProofItem(rowItems);
                rowItems = [];
            }
        }
        if (rowItems.length > 0) {
            blockchainView.renderProofItem(rowItems);
        }
        blockchainView.addFooter(success);
    }
    clearLoader();
}




const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

async function blockchainToolsHandler() {
    renderLoader(elements.block);
    let stats = {};
    var data = {
        $class: strings.getTokenSupplyTransaction,
        tokenName: "hub",
    };
    let tp = new TransactionProcessor(data, strings.getTokenSupplyUrl);

    let resp = await tp.transaction();


    var err = null;
    if (resp.error !== undefined) {
        err = resp.error;
    }
    if (err != null) {
        await displayErrorPopup('Failed to get Token Supply: ' + err.message);
        clearLoader();
        return;
    }
    console.log("** TOKEN SUPPLY: resp = " + resp + " len resp = " + resp.length);
    // TODO find out why we get this result
    if (resp.length > 10) {
        resp = 0.0;
    }
    stats.tokensupply = resp;

    data = {
        $class: strings.getTokensMintedTransaction,
        tokenName: "hub",
    };
    tp = new TransactionProcessor(data, strings.getTokensMintedUrl);

    resp = await tp.transaction();

    err = null;
    if (resp.error !== undefined) {
        err = resp.error;
    }
    if (err != null) {
        await displayErrorPopup('Failed to get Minted Tokens: ' + err.message);
        clearLoader();
        return;
    }

    stats.tokensminted = resp;
    stats.gbp = parseFloat(stats.tokensminted / elementConsts.TOKENEXCHANGERATE).toFixed(2);

    // GET UNUSED SEARCHES
    data = {
        $class: strings.getUnusedSearchesTransaction,
    };
    tp = new TransactionProcessor(data, strings.getUnusedSearchesUrl);

    resp = await tp.transaction();

    err = null;
    if (resp.error !== undefined) {
        err = resp.error;
    }
    if (err != null) {
        await displayErrorPopup('Failed to get Minted Tokens: ' + err.message);
        clearLoader();
        return;
    }

    // TODO find out why we get this result
    if (resp.length > 10) {
        resp = 0;
    }
    stats.unusedsearches = resp;

    // GET UNUSED JOB SEEKER TOTAL
    data = {
        $class: strings.getERC20TotalTransaction,
    };
    tp = new TransactionProcessor(data, strings.getERC20TotalUrl);

    resp = await tp.transaction();

    err = null;
    if (resp.error !== undefined) {
        err = resp.error;
    }
    if (err != null) {
        await displayErrorPopup('Failed to get ERC20 Total Unused Tokens: ' + err.message);
        clearLoader();
        return;
    }

    stats.jstokens = resp;
    blockchainView.setJobStats(stats);
    clearLoader();
}

// RECRUITER APPLICATION CONTROLLER 
// DISPLAYS ALL APPLICANTS FOR A GIVEN JOB
async function recruiterJobApplicationsController() {
    getFavourites();
    state.page = elementConsts.RECRUITERAPPLICATIONPAGE;

    // get the applications for this job
    let theEmail = sessionStorage.getItem('myemail');
    if (theEmail === null) {
        return;
    }

    var data = {
        $class: strings.getApplicationsForJobRefTransaction,
        jobReference: sessionStorage.getItem("jobReference"),
    };
    let tp = new TransactionProcessor(data, strings.getApplicationsForJobRefUrl);

    let resp = await tp.transaction();

    var err = null;
    if (resp.error !== undefined) {
        err = resp.error;
    }
    if (err != null) {
        await displayErrorPopup('Failed to get Applications: ' + err.message);
    } else {
        displayRecruiterApplications(resp);
    }

    let downloadCVButtons = document.querySelectorAll(".downloadcvbutton");
    for (let i = 0; i < downloadCVButtons.length; i++) {
        downloadCVButtons[i].addEventListener('click', e => {
            e.preventDefault();
            let ele = document.getElementById(e.target.id);
            console.log("ele = " + ele + "; e.target.id " + e.target.id);
            renderLoaderEndByNumber(ele, -5);
            getSeekerAndDownloadCV(e.target.dataset.email);
        });
    }
    addShowCandidateProfileHandler();
}


async function getSeekerAndShowProfile(seekerEmail) {
    console.log("Looking for jobseeker " + seekerEmail);
    var data = {
        $class: elements.getJobSeekerAccountTransaction,
        email: seekerEmail
    };
    let tp = new TransactionProcessor(data, strings.getJobSeekerAccountUrl);

    let resp = await tp.transaction();

    var err = null;
    if (resp.error !== undefined) {
        err = resp.error;
    }
    clearLoader();
    if (err != null) {
        await displayErrorPopup('Failed to get JobSeeker: ' + err.message);
    } else {
        sessionStorage.setItem("readonly", true); // ensures that the profile is read only
        sessionStorage.setItem("userdata", JSON.stringify(resp));
        window.location = "jobseeker-dashboard.html";
    }
}

async function getSeekerAndDownloadCV(seekerEmail) {
    console.log("Looking for jobseeker " + seekerEmail);
    var data = {
        $class: elements.getJobSeekerAccountTransaction,
        email: seekerEmail
    };
    let tp = new TransactionProcessor(data, strings.getJobSeekerAccountUrl);

    let resp = await tp.transaction();

    var err = null;
    if (resp.error !== undefined) {
        err = resp.error;
    }
    clearLoader();
    if (err != null) {
        await displayErrorPopup('Failed to get JobSeeker: ' + err.message);
    } else {
        downloadCVHandler(resp);
    }
}
// JOBSEEKER APPLICATION CONTROLLER 
async function seekerJobApplicationsController() {
    getFavourites();
    state.page = elementConsts.APPLICATIONPAGE;
    let aData = sessionStorage.getItem("apps");
    let applicationData = JSON.parse(aData);

    if (cachedData != null && cachedData != undefined) {
        cachedData = JSON.parse(cachedData);
    } else {
        let cdata = await loadCache(false);
        cachedData = JSON.parse(cdata);
    }
    if (applicationData === null) {
        renderLoader(elements.jobApplications);
        await getApplicationsForJobSeeker();
        applicationData = state.applications;
        clearLoader();
    }
    displayApplications(cachedData, applicationData);
}


// JOBSEEKER ALERT CONTROLLER 
if (document.URL.includes("createalert.html")) {
    state.page = elementConsts.ALERTPAGE;
    var select = document.getElementById("country");

    // Populate list with options:
    for (var i = 0; i < countriesArray.length; i++) {
        var opt = countriesArray[i];
        select.innerHTML += "<option value=\"" + opt + "\" style=\"color:black\">" + opt + "</option>";
    }

    elements.submitAlert.addEventListener('click', e => {
        e.preventDefault();
        createAlertHandler();
    });

    let amend = sessionStorage.getItem("amend");
    if (amend === "true") {
        let aData = sessionStorage.getItem("alerts");
        let alertData = JSON.parse(aData);
        let alertId = sessionStorage.getItem("alertId");
        let alert = alertData.filter(e => e.alertId === alertId);
        alertView.setFormData(alert[0]);
    }

    const checkbox = document.getElementById('noremote')

    checkbox.addEventListener('change', (event) => {
        if (event.target.checked) {
            elements.city.disabled = false;
            elements.country.disabled = false;
        }
    })
    const checkbox2 = document.getElementById('yesremote')

    checkbox2.addEventListener('change', (event) => {
        if (event.target.checked) {
            elements.city.disabled = true;
            elements.country.disabled = true;
        }
    })
}

// JOBSEEKER ACCOUNT CONTROLLER 
if (document.URL.includes("jobseeker-account.html")) {
    getFavourites();
    state.page = elementConsts.ACCOUNTPAGE;
    let userData = sessionStorage.getItem("userdata");
    let aData = sessionStorage.getItem("alerts");
    let data = JSON.parse(userData);
    let alertData = JSON.parse(aData);

    let banner = "Welcome " + data.params.name.firstName + " " + data.params.name.lastName;
    elements.accBanner.innerHTML = banner;

    elements.changeEmail.addEventListener('click', e => {
        e.preventDefault();
        window.location = "account-settings.html";
    });
    elements.manageTok.addEventListener('click', e => {
        e.preventDefault();
        window.location = "account-settings.html";
    });
    elements.createAlertBtn.addEventListener('click', e => {
        e.preventDefault();
        sessionStorage.setItem("amend", false);
        window.location = "createalert.html";
    });
    accountView.setAlertData(alertData);

    if (alertData.length === 3) {
        elements.createAlertBtn.disabled = true;
    }

    let editCriteriaButtons = document.querySelectorAll(".editcriteria");
    for (let i = 0; i < editCriteriaButtons.length; i++) {
        editCriteriaButtons[i].addEventListener('click', e => {
            e.preventDefault();
            sessionStorage.setItem("amend", true);
            sessionStorage.setItem("alertId", e.target.dataset.alertid)
            window.location = "createalert.html";
        });
    }
    let testCriteriaButtons = document.querySelectorAll(".testcriteria");
    for (let i = 0; i < testCriteriaButtons.length; i++) {
        testCriteriaButtons[i].addEventListener('click', e => {
            e.preventDefault();
            console.log("TEST CRITERIA alert id = " + e.target.dataset.alertid);
            testAlertHandler(e.target.dataset.alertid);
        });
    }
    let deleteAlertButtons = document.querySelectorAll(".deletealert");
    for (let i = 0; i < deleteAlertButtons.length; i++) {
        deleteAlertButtons[i].addEventListener('click', e => {
            e.preventDefault();
            deleteAlertHandler(e.target.dataset.alertid);
        });
    }

    elements.downloadcv.addEventListener('click', e => {
        e.preventDefault();
        downloadCVHandler(data);
    });


    elements.viewjobappsBtn.addEventListener('click', e => {
        e.preventDefault();
        showApplicationsPage();
    });
}


async function showApplicationsPage() {
    await getApplicationsForJobSeeker();
    window.location = "jobseeker-applications.html";
}
// JOBSEEKER ACCOUNT SETTINGS CONTROLLER 
if (document.URL.includes("account-settings.html")) {
    getFavourites();
    elements.backLink.addEventListener('click', e => {
        e.preventDefault();
        window.location = "jobseeker-account.html";
    });
    walletHandler();

    elements.addFundsBtn.addEventListener('click', e => {
        e.preventDefault();
        buyTokensHandler(elements.addfunds, elements.addfunds.value);
        e.target.value = "";
    });

    elements.cashoutBtn.addEventListener('click', e => {
        e.preventDefault();
        cashoutHandler(elements.cashout, elements.cashout.value);
        e.target.value = "";
    });

    elements.buyrankBtn.addEventListener('click', e => {
        e.preventDefault();
        buyRankPtsHandler(elements.buyrank, elements.buyrank.value);
    });

}

async function buyTokensHandler(element, tokens) {
    renderLoader(elements.modalname);
    var myemail = sessionStorage.getItem('myemail');
    var data = {
        $class: elements.buyTokensTransaction,
        email: myemail,
        amount: tokens
    };
    let tp = new TransactionProcessor(data, strings.buyTokensUrl);

    let resp = await tp.transaction();

    var err = null;
    if (resp.error !== undefined) {
        err = resp.error;
    }
    if (err != null) {
        clearLoader();
        await displayErrorPopup('Failed to buy tokens: ' + err.message);
    } else {
        console.log("tokens bought!");
        // read the user hub values to poke into the wallet
        await walletHandler();
        clearLoader();
    }
    element.value = "";
}

async function buyRankPtsHandler(element, tokens) {
    renderLoader(elements.modalname);
    var myemail = sessionStorage.getItem('myemail');
    var data = {
        $class: elements.buyRankPtsTransaction,
        email: myemail,
        amount: tokens
    };
    let tp = new TransactionProcessor(data, strings.buyRankPtsUrl);

    let resp = await tp.transaction();

    var err = null;
    if (resp.error !== undefined) {
        err = resp.error;
    }
    if (err != null) {
        clearLoader();
        await displayErrorPopup('Failed to buy ranking points: ' + err.message);
    } else {
        // read the user hub values to poke into the wallet
        let userData = sessionStorage.getItem("userdata");
        let data = JSON.parse(userData);

        // update cache with new value for user ranking points
        data.params.rankingpoints = data.params.rankingpoints + parseFloat(tokens);
        sessionStorage.setItem("userdata", JSON.stringify(data));
        await walletHandler();
        clearLoader();
    }
    element.value = "";
}


async function cashoutHandler(element, tokens) {
    renderLoader(elements.modalname);
    var myemail = sessionStorage.getItem('myemail');
    var data = {
        $class: elements.cashoutTransaction,
        email: myemail,
        amount: tokens
    };
    let tp = new TransactionProcessor(data, strings.cashoutUrl);

    let resp = await tp.transaction();

    var err = null;
    if (resp.error !== undefined) {
        err = resp.error;
    }
    if (err != null) {
        clearLoader();
        await displayErrorPopup('Failed to cash out tokens: ' + err.message);
    } else {
        console.log("tokens cashed out!");
        // read the user hub values to poke into the wallet
        await walletHandler();
        clearLoader();
    }
    element.value = "";
}

async function walletHandler() {
    var myemail = sessionStorage.getItem('myemail');
    var data = {
        $class: elements.getHistoryTransaction,
        email: myemail
    };
    let tp = new TransactionProcessor(data, strings.getHistoryUrl);

    let resp = await tp.transaction();

    var err = null;
    if (resp.error !== undefined) {
        err = resp.error;
    }
    if (err != null) {
        await displayErrorPopup('Failed to get transaction history: ' + err.message);
    } else {
        console.log("Got transaction history: num rows = " + resp.length);
        // read the user hub values to poke into the wallet
        const latestRow = resp[0];

        let userData = sessionStorage.getItem("userdata");
        let data = JSON.parse(userData);
        let rankpts = 0.0;
        if (data.params.rankingpoints != undefined) {
            rankpts = data.params.rankingpoints;
        }
        settingsView.setWalletStats(latestRow.balance, rankpts);
        settingsView.populateFilterTable(resp);
    }
}

function displayProfileForRecruiter() {
    let userData = sessionStorage.getItem("userdata");
    let data = JSON.parse(userData);
    setJobSeekerEmail(data.email);
    data.readonly = true;
    setProfileFields(data);
}

// JOBSEEKER PROFILE CONTROLLER 
if (document.URL.includes("jobseeker-dashboard.html")) {
    getFavourites();
    let readonly = sessionStorage.getItem("readonly");

    // Populate country list with options:
    var select = document.getElementById("country");
    for (var i = 0; i < countriesArray.length; i++) {
        var opt = countriesArray[i];
        select.innerHTML += "<option value=\"" + opt + "\" style=\"color:black\">" + opt + "</option>";
    }
    if (readonly === "true") {
        displayProfileForRecruiter();
    } else {
        state.page = elementConsts.PROFILEPAGE;
        autocomplete(document.getElementById("desiredjobtitle"), jobTitles);
        var email = sessionStorage.getItem('myemail');
        var submitProfileBtn = elements.createprofilebutton;
        let userData = sessionStorage.getItem("userdata");
        let data = JSON.parse(userData);

        if (email != null && email != undefined) {
            setJobSeekerEmail(email);
            setProfileFields(data);
            // save hash for later use in the crypto check
            sessionStorage.setItem("cvhash", data.params.cvhash);
        }

        if (data.params.cvhash != undefined) {
            // no need to do this if the user cv field is empty
            checkCrytpoHashes(email);
            console.log("CV CRYPTO CHECK OK!");
        }

        submitProfileBtn.addEventListener('click', e => {
            e.preventDefault();
            let transaction = strings.updateProfileTransaction;
            let insert = true;
            if (sessionStorage.getItem("amend") === "true") {
                insert = false;
            }
            updateProfileHandler(transaction, insert);
        });

        document.querySelector("#file-1").addEventListener('change', function () {
            logoHandler(this.files[0], data, this.value);
        });
    }
}

async function logoHandler(file, data, path) {
    // set the file name in the view text field

    path = path.substring(path.lastIndexOf('\\') + 1);
    try {
        if (file.size > elementConsts.MAXIMAGESIZE) {
            await displayErrorPopup('CV File is bigger than 2MB. Please use a different file' + err.message);
            return;
        }
        imageLoader.loadImage(file);
        profileView.setCVFile(path, data);
        state.newCV = true;
    } catch (error) {
        console.log("Error loading image: " + error);
    }
}

async function testAlertHandler(id) {
    renderLoaderByREMFromTop(elements.adForm, 100);
    let userData = sessionStorage.getItem("userdata");
    let udata = JSON.parse(userData);
    var data = {
        $class: elements.testAlertTransaction,
        alertId: id,
        name: udata.params.name.firstName
    };

    let tp = new TransactionProcessor(data, strings.testAlertUrl);

    let resp = await tp.transaction();

    clearLoader();
    var err = null;
    if (resp.error !== undefined) {
        err = resp.error;
    }
    if (err != null) {
        await displayErrorPopup('Failed to test alert: ' + err.message);
    } else {
        await displaySuccessPopup('Job alert search successful. Please check your email!');
    }
}


async function downloadCVHandler(data) {
    console.log("CV DOWNLOAD Begin...");
    if (data.params.cvhash != undefined) {

        // no need to do this if the user cv field is empty
        sessionStorage.setItem("cvhash", data.params.cvhash);
        let linkSource = await checkCrytpoHashes(data.email);
        console.log("CV CRYPTO CHECK OK! file name = " + data.params.cvfile);
        // console.log(cv);

        // const linkSource = `data:application/pdf;base64,${pdf}`;
        const downloadLink = document.createElement("a");
        const fileName = data.params.cvfile;

        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
    } else {
        console.log("DOING NOTHING!");
    }
}

async function deleteAlertHandler(id) {
    renderLoaderByREMFromTop(elements.adForm, 100);

    var data = {
        $class: elements.removeAlertTransaction,
        alertId: id,
    };

    let tp = new TransactionProcessor(data, strings.removeAlertUrl);

    let resp = await tp.transaction();

    var err = null;
    if (resp.error !== undefined) {
        err = resp.error;
    }
    if (err != null) {
        clearLoader();
        await displayErrorPopup('Failed to remove alert: ' + err.message);
    } else {
        await getAlerts(); // this will force a cache update
        clearLoader();
        await displaySuccessPopup('Job Alert Successfully Removed!');
        window.location = "jobseeker-account.html";
    }
}


async function createAlertHandler() {
    renderLoader(elements.alertPage);
    var myemail = sessionStorage.getItem('myemail');
    var data = alertView.getFormData(myemail);

    let tp = new TransactionProcessor(data, strings.createAlertUrl);
    let action = "Created!";
    if (sessionStorage.getItem("amend") === "true") {
        tp = new TransactionProcessor(data, strings.updateAlertUrl);
        action = "Updated!"
    }

    let resp = await tp.transaction();

    var err = null;
    if (resp.error !== undefined) {
        err = resp.error;
    }
    if (err != null) {
        clearLoader();
        if (err.message.includes("maximum")) {
            await displayErrorPopup('Failed to submit alert: Maximum 3 alerts per user');
        } else {
            await displayErrorPopup('Failed to submit alert: ' + err.message);
        }
    } else {
        await getAlerts(); // this will force a cache update
        clearLoader();
        await displaySuccessPopup('Job Alert Successfully ' + action);
        window.location = "jobseeker-account.html";
    }
}



async function checkCrytpoHashes(myemail) {
    try {
        // do the cryptographic check of cv 
        let hashFromBlockchain = sessionStorage.getItem("cvhash");
        let cv = await imageLoader.getCVFromDatabase(myemail, hashFromBlockchain);
        return cv;
    }
    catch (error) {
        await Swal({
            title: 'ERROR RETRIEVING CV!',
            text: error,
            type: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#cc6d14',
        });
    }

}
// ADVERTS CONTROLLER
if (document.URL.includes("advert.html")) {
    setPrices();
    abtn.addEventListener('click', e => {
        e.preventDefault();
        sessionStorage.setItem("price", elementConsts.STANDARDPRICE);
        window.location = "jobcredits.html";
    });

    bbtn.addEventListener('click', e => {
        e.preventDefault();
        sessionStorage.setItem("price", elementConsts.PREMIUMPRICE);
        window.location = "jobcredits.html";
    });
    cvbtn.addEventListener('click', e => {
        e.preventDefault();
        window.location = "cvsearchcredits.html";
    });
}

// BUY CREDITS PAGE
if (document.URL.includes("jobcredits")) {
    getFavourites();
    state.page = elementConsts.BUYCREDITSPAGE;
    var input = elements.slider;
    setTotalJobPrice(1);
    document.querySelector('input[type=range]').value = 1;
    setJobAdsNumber(1);
    input.oninput = function () {
        setJobAdsNumber(input.value);
        setTotalJobPrice(input.value);
        restyle(input.value);
    };
    var leftSlider = elements.leftsliderbutton;
    leftSlider.addEventListener('click', e => {
        e.preventDefault();
        adjustSlider(-1);
    });
    var rightSlider = elements.rightsliderbutton;
    rightSlider.addEventListener('click', e => {
        e.preventDefault();
        adjustSlider(1);
    });

    var buyButton = elements.buyjobadsbtn;
    buyButton.addEventListener("click", (e) => {
        e.preventDefault();
        buyJobCreditsHandler();
    });
}
// CV SEARCH CONTROLLER
if (document.URL.includes("cvsearches.html")) {
    state.page = elementConsts.CVSEARCHPAGE;
    var select = document.getElementById("country");
    // Populate list with options:
    for (var i = 0; i < countriesArray.length; i++) {
        var opt = countriesArray[i];
        select.innerHTML += "<option value=\"" + opt + "\" style=\"color:black\">" + opt + "</option>";
    }

    elements.cvsearchesBtn.addEventListener("click", (e) => {
        e.preventDefault();
        CVSearchHandler();
    });
}

// BUY CV SEARCHES PAGE
if (document.URL.includes("cvsearchcredits")) {
    getFavourites();
    state.page = elementConsts.BUYSEARCHESPAGE;
    var input = elements.slider;
    setTotalCVSearchPrice(1);
    document.querySelector('input[type=range]').value = 1;
    setCVSearchNumber(1);
    input.oninput = function () {
        setCVSearchNumber(input.value);
        setTotalCVSearchPrice(input.value);
        restyleCV(input.value);
    };
    var leftSlider = elements.leftsliderbutton;
    console.log("leftSlider = " + leftSlider);
    leftSlider.addEventListener('click', e => {
        console.log("LEFT");
        e.preventDefault();
        adjustSliderCV(-1);
    });
    var rightSlider = elements.rightsliderbutton;
    console.log("rightSlider = " + rightSlider);
    rightSlider.addEventListener('click', e => {
        console.log("RIGHT");
        e.preventDefault();
        adjustSliderCV(1);
    });

    var buyButton = elements.buyjobadsbtn;
    buyButton.addEventListener("click", (e) => {
        e.preventDefault();
        buyCVSearchCreditsHandler();
    });
}

if (document.URL.includes("recruiter-dashboard")) {
    getFavourites();
    state.page = elementConsts.DASHBOARDPAGE;

    setCompanyName(sessionStorage.getItem('mycompany'));
    setContactName(sessionStorage.getItem('name'));
    getJobAdsHandler();
    var createButton = elements.createBtn;
    createButton.addEventListener("click", (e) => {
        sessionStorage.setItem("amend", "false");
        window.location = "createjobad.html";
    });
}


if (document.URL.includes("index")) {
    const searchBtn = elements.searchBtn;

    searchBtn.addEventListener("click", (e) => {
        e.preventDefault();
        let what = document.getElementById("job");
        let where = document.getElementById("location");
        sessionStorage.setItem("what", what.value);
        sessionStorage.setItem("where", where.value);
        sessionStorage.setItem("filterremote", state.remote);
        sessionStorage.setItem("filtertype", state.type);
        sessionStorage.setItem("filteremployer", state.employer);

        window.location = "search.html";
    });
    const advertBtn = elements.advertBtn;
    advertBtn.addEventListener("click", (e) => {
        e.preventDefault();
        window.location = "advert.html";
    });
    getFavourites();

    addFavouritesLinkListener();

    state.remote = "all";
    state.type = "all";
    state.employer = "all";

    // this is a hack to ensure the selected radio buttons are colored correctly
    // as far as I can see the zero height panel seems to be causing a problem
    var btn = document.getElementById("btn2");
    btn.addEventListener('click', e => {
        let display = e.target.getAttribute("display");
        var rad = document.getElementById("allremote");
        rad.checked = true;
        var rad = document.getElementById("alltypes");
        rad.checked = true;
        var rad = document.getElementById("all");
        rad.checked = true;
        if (display === "off") {
            console.log("Resetting buttons...");
            var rad = document.getElementById("yesremote");
            rad.checked = true;
            var rad = document.getElementById("contract");
            rad.checked = true;
            var rad = document.getElementById("employer");
            rad.checked = true;
        }

    });
    btn.setAttribute("display", "on");



    var remoteradios = document.querySelectorAll('input[type=radio][name="remote"]');
    var typeradios = document.querySelectorAll('input[type=radio][name="type"]');
    var employerradios = document.querySelectorAll('input[type=radio][name="employer"]');
    function changeHandlerRemote(event) {
        state.remote = this.value;
    }
    Array.prototype.forEach.call(remoteradios, function (radio) {
        radio.addEventListener('change', changeHandlerRemote);
    });
    function changeHandlerType(event) {
        state.type = this.value;
    }
    Array.prototype.forEach.call(typeradios, function (type) {
        type.addEventListener('change', changeHandlerType);
    });
    function changeHandlerEmployer(event) {
        state.employer = this.value;
    }
    Array.prototype.forEach.call(employerradios, function (employer) {
        employer.addEventListener('change', changeHandlerEmployer);
    });
}

if (document.URL.includes("register")) {
    state.page = elementConsts.REGISTERPAGE;
    var radiobtn = elements.jobSeekerTabId;
    radiobtn.checked = true;
    state.tabbedPane = elements.tabbedPane1;
    state.tabIndex = elementConsts.JOBSEEKER;;

    // REGISTER RECRUITER
    var recRegBtn = elements.registerRecruiterButton;

    recRegBtn.addEventListener('click', e => {
        e.preventDefault();
        loginView.clearValidationErrorMessages(state.tabIndex);
        state.inputType = inputType.REGISTER;
        signInHandler(e, registerView, strings.registerRecruiterUrl);
    });

    // REGISTER JOBSEEKER
    var seekRegBtn = elements.registerJobSeekerButton;

    seekRegBtn.addEventListener('click', e => {
        e.preventDefault();
        loginView.clearValidationErrorMessages(state.tabIndex); // clear the one not selected ie login 
        state.inputType = inputType.REGISTER;
        signInHandler(e, registerJobSeekerView, strings.registerJobSeekerUrl);
    });

    // LOGIN RECRUITER
    var recLoginBtn = elements.loginRecruiterButton;

    recLoginBtn.addEventListener('click', e => {
        e.preventDefault();
        registerView.clearValidationErrorMessages(state.tabIndex);
        state.inputType = inputType.LOGIN;
        signInHandler(e, loginView, strings.loginRecruiterUrl, strings.recruiterLoginTransaction);
    });

    // LOGIN JOBSEEKER
    var seekLoginBtn = elements.loginJobSeekerButton;

    seekLoginBtn.addEventListener('click', e => {
        e.preventDefault();
        registerJobSeekerView.clearValidationErrorMessages(state.tabIndex); // clear the one not selected ie login 
        state.inputType = inputType.LOGIN;
        signInHandler(e, loginView, strings.loginJobSeekerUrl, strings.jobSeekerLoginTransaction);
    });

    var fields = elements.inputFields;
    var i;
    for (i = 0; i < fields.length; i++) {
        fields[i].addEventListener("blur", (e) => {
            if (state.inputType == inputType.REGISTER) {
                if (state.tabIndex == elementConsts.JOBSEEKER) {
                    registerJobSeekerView.validateField(e.target, state.tabIndex);
                } else {
                    registerView.validateField(e.target, state.tabIndex);
                }
            } else {
                loginView.validateField(e.target, state.tabIndex);
            }
        });
    }

    var tabs = elements.tabs;
    for (i = 0; i < tabs.length; i++) {
        tabs[i].addEventListener("click", (e) => {
            tabClickHandler(e);
        });
    }
}
window.onload = () => {
    let user = sessionStorage.getItem("user");
    let type = parseInt(user);
    if (type === elementConsts.JOBSEEKER) {
        let userData = sessionStorage.getItem("userdata");
        let data = JSON.parse(userData);
        navBarSetLoggedIn(state.loggedIn, data.params.name.firstName);
    } else {
        navBarSetLoggedIn(state.loggedIn, "Bob");
    }
}

var el = document.getElementById('signoutlink');

if (el != null) {
    el.onclick = function () {
        console.log("SIGN OUT CLICKED...!!");
        signOutHandler();
    };
}

var idbSupported = false;
var db;
var indexdbtransaction;
var store;

async function loadObjectStore() {
    console.log("STARTING CACHE STUFF...");
    document.addEventListener("DOMContentLoaded", async function () {

        console.log("Doing indexedDB stuff...");
        if ("indexedDB" in window) {
            idbSupported = true;
        }

        if (idbSupported) {
            console.log("Reading datastore...");
            var openRequest = await indexedDB.open("datastore", 1);

            openRequest.onupgradeneeded = function (e) {
                console.log("running onupgradeneeded");
                var thisDB = e.target.result;

                if (!thisDB.objectStoreNames.contains("jobs")) {
                    console.log("Creating objectstore jobs")
                    thisDB.createObjectStore("jobs");
                }
            }

            openRequest.onsuccess = async function (e) {
                console.log("ObjectStore: Success!");
                db = e.target.result;
                indexdbtransaction = await db.transaction(["jobs"], "readwrite");

                store = await indexdbtransaction.objectStore("jobs");
                let request = await store.get(1);

                request.onsuccess = function (e) {
                    cachedData = e.target.result;
                    if (cachedData != undefined) {
                        let rows = JSON.parse(cachedData);
                        if (rows.length > 0) {
                            console.log("************** num rows in cache = " + rows.length);
                        }
                    } else {
                        console.log("NO CACHED DATA FOUND!");
                    }
                    console.log("IMPORTANT: cache initiated, controllers ready!");
                    if (document.URL.includes("search.htm")) {
                        searchScreenController();
                    } else if (document.URL.includes("createjobad")) {
                        console.log("create job controller....")
                        createJobController();
                    } else if (document.URL.includes("jobseeker-applications")) {
                        console.log("create jobseeker applications controller....")
                        seekerJobApplicationsController();
                    }
                    else if (document.URL.includes("recruiter-applications")) {
                        console.log("create recruiter applications controller....")
                        recruiterJobApplicationsController();
                    }
                }

                request.onerror = function (e) {
                    console.log("Error");
                    console.dir(e);
                }
            }

            openRequest.onerror = function (e) {
                console.log("Error");
                console.dir(e);
            }

        }

    }, false);
}
// This overwrites the cache with a new cache (supplied as data)
async function addIndexedData(data) {
    // Open up a transaction as usual
    var objectStore = db.transaction(['jobs'], "readwrite").objectStore('jobs');

    // Create another request that inserts the item back into the database
    var updateTitleRequest = objectStore.put(data, 1);

    // Log the transaction that originated this request
    console.log("The transaction that originated this request is " + updateTitleRequest.transaction);

    // When this new request succeeds, run the displayData() function again to update the display
    updateTitleRequest.onsuccess = function () {
        console.log("SUCCESS! data added to cache");
    };
}

let savedLink = document.getElementById("saved");
if (savedLink != null) {
    savedLink.addEventListener('click', e => {
        console.log("CLICKED!");
        window.location = "favourites.html";
    });
}

let A = state.loggedIn === false;
let B = document.URL.includes("index") === false;
let C = document.URL.includes("register") === false;
let D = document.URL.includes("display") === false;
let E = document.URL.includes("advert") === false;
let F = document.URL.includes("search") === false;
if (A && B && C && D && E && F) {
    window.location = "register.html";
} 