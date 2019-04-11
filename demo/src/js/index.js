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
import * as profileView from './views/profileView';

import { getFormFor, clearError, elements, dbelements, elementConsts, inputType, renderLoader, renderLoaderEnd, renderLoaderEndByNumber, renderLoaderByPixelsFromTop, clearLoader, navBarSetLoggedIn, setLoggedIn, strings, enableCreateJobButton, autocomplete, jobTitles, setButtonHandlers, displayErrorPopup, displaySuccessPopup, updateFavouritesTotal, addFavouritesLinkListener, countriesArray } from './views/base';
import { setCompanyName, setContactName, getJobAdsData, setJobAdsData, setJobCreditsRemaining } from './views/recruiterDashboardView';
import { setJobAdsNumber, setTotalJobPrice, restyle, adjustSlider, getBuyJobCreditsData } from './views/jobCreditsView';
import DatabaseProcessor from './models/DatabaseProcessor';
import ImageLoader from './models/ImageLoader';
import { populateFilterTable, populatePostedBy, setJobStats } from './views/manageJobAdsView';
import { setJobFields, setJobLogo, getExpireJobData, isExpired } from './views/displayJobView';
import { renderResults, setTotalJobsBucket, handleNext, handlePrev, applyFilter, filterByWhere, filterByWhat } from './views/searchView';
import { renderFavouriteResults } from './views/favouritesView';
import { setPrices } from './views/advertView';
import { setJobSeekerEmail, setProfileFields } from './views/profileView';


loadObjectStore();


// clear object store
// window.indexedDB.databases().then((r) => {
//     for (var i = 0; i < r.length; i++) window.indexedDB.deleteDatabase(r[i].name);
// }).then(() => {
//     alert('All data cleared.');
// });

const state = {};
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
                    setLoggedIn(state, true, resp.params.name.firstName);
                    console.log("getting favourites...");
                    sessionStorage.setItem("user", elementConsts.JOBSEEKER);
                    sessionStorage.setItem("userdata", JSON.stringify(resp));
                    getFavourites();
                    window.location = "jobseeker-account.html";
                } else {
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
    renderLoader(elements.searchjob);
    getFavourites();

    // let cachedData = sessionStorage.getItem("jobs");
    // let cachedData = getFromObjectStore("jobs");
    if (cachedData != null && cachedData != undefined) {
        cachedData = JSON.parse(cachedData);
        renderResults(cachedData);
        setTotalJobsBucket(cachedData);
    } else {
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
            displayErrorPopup('Search failed: ' + err);
        } else {
            let id;
            try {
                let results = await imageLoader.getAllImagesFromDatabase();

                console.log("NUMBER OF ROWS RETURNED = " + results.length);

                for (var i = 0; i < rows.length; i++) {

                    // console.log("BLOCKCHAIN HASH FOR ROW " + i + " = " + rows[i].logohash);
                    id = rows[i].jobReference;

                    let rowfound = Array.from(results).find(row => row.id === id);

                    // console.log("CHECKING HASH FOR IMAGE " + id + "; image = " + rowfound.image);
                    // console.log("DB HASH " + i + " = " + rowfound.hash);

                    //     // TODO I would say move this into a crypto class (CryptoProcessor)
                    await imageLoader.checkHash(id, rowfound.image, rowfound.hash, rows[i].logohash);
                    // console.log("id: " + id + " => HASHES EQUAL!");
                    rows[i].logo = rowfound.image;

                }
                state.label = undefined;
                console.log("RENDERING ROWS...LEN = " + rows.length);
                renderResults(rows);

                let cdata = JSON.stringify(rows);

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
                clearLoader();

            } catch (error) {
                await Swal({
                    title: 'ERROR PROCESSING JOBS!',
                    text: error + " jobreference = " + id,
                    type: 'error',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#cc6d14',
                });
            }

        }
    }

    let what = sessionStorage.getItem("what");
    if (what != null && what != "") {
        console.log("WHAT = " + what);
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
    clearLoader();
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
    console.log("SUSHI !!! ");
    if (err != null) {
        displayErrorPopup('Failed to get favourites: ' + err.message);
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

const expireJobHandler = async () => {
    renderLoaderEndByNumber(elements.lower, 120);
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
            displayErrorPopup('Failed to expire Job: ' + jobid + " already expired");
        } else {
            displayErrorPopup('Failed to expire Job: ' + err.message);
        }

        clearLoader();
    } else {
        clearLoader();
        await displaySuccessPopup('Job Ad Successfully Expired!');
        window.location = "recruiter-dashboard.html";
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
        enableCreateJobButton(resp.remaining);
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
        displayErrorPopup('Database put failed: ' + error);
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
        displayErrorPopup('Failed to add Job: ' + err.message);
        clearLoader();
    } else {
        // TODO Commit Database transaction: update committed column to "true"

        window.location = "recruiter-dashboard.html";

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
                displayErrorPopup('cache job failed: ' + err.message);
                clearLoader();
                return;
            } else {
                // add the new job to the cache then stringify it ready to add back into the indexedDB
                let data = JSON.parse(cachedData);
                state.rows[0].logo = blob;
                data.push(state.rows[0])
                let cdata = JSON.stringify(data);
                await addIndexedData(cdata);
            }
        }
        clearLoader();
        await displaySuccessPopup('Job Ad Successfully Posted!');
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
    renderLoaderByPixelsFromTop(elements.adForm, 160);

    // add the hash to the formData here

    // 1. Get the blob

    // only need to calculate the hash if there is a cv file
    if (formData.params.cvfile != undefined) {
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
            displayErrorPopup('Database put failed: ' + error);
            return;
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
        displayErrorPopup('Failed to Update Profile: ' + err.message);
    } else {
        // TODO Commit Database transaction: update committed column to "true"

        displaySuccessPopup('Profile Successfully Updated!');
        setLoggedIn(state, true, resp.params.name.firstName);
        console.log("logged in as..." + formData.params.name.firstName);
        sessionStorage.setItem("userdata", JSON.stringify(formData));
        setProfileFields(formData);
    }
}

const queryAndDisplayJobHandler = async (jobRef) => {
    state.page = elementConsts.DISPLAYJOBPAGE;
    var myemail = sessionStorage.getItem('myemail');

    letformData = {
        $class: strings.getJobPostingsTransaction,
        email: myemail,
        filterBy: jobRef,
        filterType: "ALL",
        dateFrom: strings.beginningOfTime,
        dateTo: strings.endOfTime,
        user: ""
    };

    const tp = new TransactionProcessor(formData, strings.getJobPostingsUrl);

    let resp = await tp.transaction();
    if (resp.error !== undefined) {
        console.log("Not found: " + jobRef + "; error = " + resp.error)
        return;
    } else {
        //set the storage items and display
        console.log("got a job!");
        var propValue;
        for (var propName in resp) {
            propValue = data[propName];
            sessionStorage.setItem(propName, propValue);
        }
        displayJobHandler();
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


    try {
        const image = await imageLoader.getImageFromDatabase(ref, sessionStorage.getItem("logohash"));
        setJobLogo(image);
        return;
    }
    catch (error) {
        await Swal({
            title: 'ERROR RETRIEVING IMAGE!',
            text: error,
            type: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#cc6d14',
        });
    }


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
            displayErrorPopup('JobPostings filter failed: ' + err.message);
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

    var x = location.search;
    console.log("x = " + x);
    if (x.length > 0 && x.includes("=")) {
        let jobRef = x.split("=");
        console.log("job ref = " + jobRef[1]);
        queryAndDisplayJobHandler(jobRef);
    } else {
        displayJobHandler();
        let email = sessionStorage.getItem("email");
        let myemail = sessionStorage.getItem("myemail");

        // only allow amend/expire if the job belongs to this user
        if (email === myemail) {
            elements.buttonPanel.style = "block";
            elements.amendjobbutton.addEventListener('click', e => {
                e.preventDefault();
                sessionStorage.setItem("amend", "true");
                window.location = "createjobad.html";
            });
            elements.expirejobbutton.addEventListener('click', e => {
                e.preventDefault();
                expireJobHandler();
            });
            elements.jobcompany.addEventListener('click', e => {
                e.preventDefault();
                sessionStorage.setItem("searchtype", "companytotals");
                sessionStorage.setItem("what", e.target.text);
                window.location = "search.html";
            });
        } else {
            elements.buttonPanel.style = "none";
            if (isExpired() === true) {
                elements.buttonPanel.innerHTML = `<button id="applyjobbutton" class="btn btn--disabled" disabled>Apply</button>`;
            } else {
                elements.buttonPanel.innerHTML = `<button id="applyjobbutton" class="btn btn--orange">Apply</button>`;
            }

        }
    }


}

// FAVOURITES CONTROLLER
if (document.URL.includes("favourites")) {

    let favourites = sessionStorage.getItem("favourites");

    if (favourites != null) {
        favourites = JSON.parse(favourites);
        renderFavouriteResults(favourites);
        addButtonListeners();
    } else {
        console.log("+++ NO FAVOURITES FOUND +++");
    }
    elements.removeAllBtn.addEventListener("click", (e) => {
        removeAllFavourites();
    });
}



function addButtonListeners() {
    let removeButtons = document.getElementsByClassName("abtn");
    for (let b of removeButtons) {
        b.addEventListener("click", (e) => {
            let ref = b.dataset.id;
            removeJobFromFavourites(ref);
        });
    }
}

const removeAllFavourites = async () => {
    let theEmail = sessionStorage.getItem('myemail');
    if (theEmail === null) {
        return;
    }
    // renderLoaderEndByNumber(elements.savedJobs, 50);

    var data = {
        $class: strings.removeAllFavouritesTransaction,
        email: theEmail
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
    let theEmail = sessionStorage.getItem('myemail');
    if (theEmail === null) {
        return;
    }
    let ele = document.getElementById(ref);
    // renderLoaderEndByNumber(ele, 50);

    var data = {
        $class: strings.removeFromFavouritesTransaction,
        email: theEmail,
        jobReference: ref
    };
    let tp = new TransactionProcessor(data, strings.removeFromFavouritesUrl);

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
        renderFavouriteResults(favs);
        console.log("new length of favourites = " + favs.length);
        sessionStorage.setItem("favourites", JSON.stringify(favs));
        addButtonListeners();
        clearLoader();
        // await displaySuccessPopup('favourite removed');
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
    nextb.addEventListener('click', setButtonHandlers);
    let prevb = document.getElementById("previous");
    prevb.addEventListener('click', handlePrev);
    prevb.addEventListener('click', setButtonHandlers);



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
        createJobAdView.setAmendFields();
    }
    submitJobBtn.addEventListener('click', e => {
        e.preventDefault();
        let transaction = strings.createJobAdTransaction;
        let insert = true;
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

// JOBSEEKER ACCOUNT CONTROLLER 
if (document.URL.includes("jobseeker-account.html")) {
    state.page = elementConsts.ACCOUNTPAGE;
    let userData = sessionStorage.getItem("userdata");
    let data = JSON.parse(userData);
    let banner = "Welcome " + data.params.name.firstName + " " + data.params.name.lastName;
    elements.accBanner.innerHTML = banner;

    elements.changeEmail.addEventListener('click', e => {
        e.preventDefault();
        window.location = "account-settings.html";
    });
    // <li id="changeemail">Change email address</li>
    // <li id="changepref">Change email preferences and subscriptions</li>
    // <li id="managetok">Manage Tokens</li>
    // <li id="closeacc">Close My Account</li>


}




// JOBSEEKER ACCOUNT SETTINGS CONTROLLER 
if (document.URL.includes("account-settings.html")) {
    elements.backLink.addEventListener('click', e => {
        e.preventDefault();
        window.location = "jobseeker-account.html";
    });
}

// JOBSEEKER PROFILE CONTROLLER 
if (document.URL.includes("jobseeker-dashboard.html")) {
    state.page = elementConsts.PROFILEPAGE;
    autocomplete(document.getElementById("desiredjobtitle"), jobTitles);
    var email = sessionStorage.getItem('myemail');
    var submitProfileBtn = elements.createprofilebutton;
    let userData = sessionStorage.getItem("userdata");
    let data = JSON.parse(userData);

    var select = document.getElementById("country");

    // Populate list with options:
    for (var i = 0; i < countriesArray.length; i++) {
        var opt = countriesArray[i];
        select.innerHTML += "<option value=\"" + opt + "\" style=\"color:black\">" + opt + "</option>";
    }

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

        // set the file name in the view text field
        var path = this.value;
        path = path.substring(path.lastIndexOf('\\') + 1);
        try {
            imageLoader.loadImage(this.files[0]);
            profileView.setCVFile(path, data);
            state.newCV = true;
        } catch (error) {
            console.log("Error loading image: " + error);
            // TODO display popup? 
        }
    });
}

async function checkCrytpoHashes(myemail) {
    try {
        // do the cryptographic check of cv 
        let hashFromBlockchain = sessionStorage.getItem("cvhash");
        await imageLoader.getCVFromDatabase(myemail, hashFromBlockchain);
    }
    catch (error) {
        await Swal({
            title: 'ERROR RETRIEVING IMAGE!',
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

}

// BUY CREDITS PAGE
if (document.URL.includes("jobcredits")) {
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

if (document.URL.includes("recruiter-dashboard")) {
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
        window.location = "search.html";
    });
    const advertBtn = elements.advertBtn;
    advertBtn.addEventListener("click", (e) => {
        e.preventDefault();
        window.location = "advert.html";
    });
    getFavourites();

    addFavouritesLinkListener();
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
let user = sessionStorage.getItem("user");
let type = parseInt(user);
if (type === elementConsts.RECRUITER) {
    el = document.getElementById('recruiterlogout');
}
if (el != null) {
    el.onclick = function () {
        console.log("SIGN OUT CLICKED...!!");
        signOutHandler();
    };
}

// getImage();


// async function getImage() {
//     // var xhr = new XMLHttpRequest();
//     var imageURL = 'http://localhost:8083/img/bubbles.jpg';
//     var response = await fetch(imageURL);
//     console.log(">>>>>>>>>>>>>>>>>>>>>>>BEGIN>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
//     console.log(response);
//     console.log(">>>>>>>>>>>>>>>>>>>>>>>END>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

//     var blob = await response.blob();
//     console.log(blob);
//     console.log(">>>>>>>>>>>>>>>>>>>>>>>END 2 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
//     var reader = new FileReader();
//     reader.readAsDataURL(blob);
//     reader.onloadend = function () {
//         console.log(reader.result);
//         console.log(">>>>>>>>>>>>>>>>>>>>>>>END 3 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
//         console.log("STRING LEN = " + reader.result.length);
//     };

// }
// getImage();
var idbSupported = false;
var db;
var indexdbtransaction;
var store;

async function loadObjectStore() {
    console.log("STARTING...");
    document.addEventListener("DOMContentLoaded", async function () {

        if ("indexedDB" in window) {
            idbSupported = true;
        }

        if (idbSupported) {
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
                    }

                    if (document.URL.includes("search.htm")) {
                        searchScreenController();
                    } else if (document.URL.includes("createjobad")) {
                        createJobController();
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
        console.log("SUCCESS!!!! WOOOHOOOO");
    };
}


let A = state.loggedIn === false;
let B = document.URL.includes("index") === false;
let C = document.URL.includes("register") === false;
let D = document.URL.includes("display") === false;
let E = document.URL.includes("advert") === false;
if (A && B && C && E) {
    window.location = "register.html";
} 