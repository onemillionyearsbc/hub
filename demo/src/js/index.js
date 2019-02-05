const css = require('../sass/main.scss');
require('./scripts/fontawesome-all');
const crypto = require('crypto');
const Swal = require('sweetalert2');

import TransactionProcessor from './models/TransactionProcessor';
import * as registerView from './views/registerView';
import * as registerJobSeekerView from './views/registerJobSeekerView';
import * as loginView from './views/loginView';
import * as jobCreditsView from './views/jobCreditsView';
import * as createJobAdView from './views/createJobAdView';


import { getFormFor, clearError, elements, dbelements, elementConsts, inputType, renderLoader, renderLoaderEnd, clearLoader, navBarSetLoggedIn, setLoggedIn, strings } from './views/base';
import { setCompanyName, setContactName, getJobAdsData, setJobAdsData } from './views/recruiterDashboardView';
import { setJobAdsNumber, setTotalJobPrice, restyle, adjustSlider, getBuyJobCreditsData } from './views/jobCreditsView';
import DatabaseProcessor from './models/DatabaseProcessor';
import ImageLoader from './models/ImageLoader';

const state = {};
var loggedIn = sessionStorage.getItem('loggedIn');
state.loggedIn = loggedIn === "true" ? true : false;
var imageLoader = new ImageLoader();

// SIGNIN CONTROLLER
const signInHandler = async (e, view, url, transaction) => {
    var btn = e.target;
    const form = getFormFor(btn);
    state.form = form;

    if (form) {
        const formData = view.getFormData(form, transaction);
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

            clearLoader();
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
                setLoggedIn(state, true);
                if (state.tabIndex == elementConsts.JOBSEEKER) {
                    window.location = "jobseeker-dashboard.html";
                } else {
                    sessionStorage.setItem('company', resp.company);
                    sessionStorage.setItem('name', resp.name);
                    window.location = "recruiter-dashboard.html";
                }
            }
        } catch (error) {
            return error;
        }
    }
}
// SIGNOUT CONTROLLER
const signOutHandler = async (e) => {
    console.log("state.loggedIn= " + state.loggedIn);


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
        }

        var email = sessionStorage.getItem('email');
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
            sessionStorage.setItem('loggedIn', false);
            window.location = "register.html";
        } else {
            console.log("logout, err = " + err);
            await displayErrorPopup();
        }
    }
}

// JOB ADS CONTROLLER
const buyJobCreditsHandler = async (e, view, url) => {
    renderLoader(elements.jobadsWindow);
    var email = sessionStorage.getItem('email');
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

const getJobAdsHandler = async () => {
    var email = sessionStorage.getItem('email');
    var data = getJobAdsData(email);
    state.login = new TransactionProcessor(data, strings.getJobAdsurl);

    var resp = await state.login.transaction();

    var err = null;
    if (resp.error !== undefined) {
        err = resp.error;
    }
    if (err != null) {

    } else {
        setJobAdsData(resp.live, resp.posted, resp.remaining);
        if (resp.remaining > 0) {
            elements.createBtn.disabled = false;
        } else {
            elements.createBtn.disabled = true;
        }
    }
}

const createJobAdHandler = async () => {
    var email = sessionStorage.getItem('email');
    const formData = createJobAdView.getFormData(email);
    const error = createJobAdView.validateData(formData);

    if (error) {
        return error;
    }
    //---------------------------------------------------
    renderLoaderEnd(elements.adForm);

    // add the hash to the formData here

    // 1. Get the blob
    var blob = await imageLoader.getBlob();

    // 2. calculate the hash of the blob

    // TODO this needs to go into the blockchain as well
    const myhash = crypto.createHash('sha256') // enables digest
        .update(blob) // create the hash
        .digest('hex'); // convert to string

    formData.logohash = myhash;

    // 3. store formdata on blockchain including hash of the blob
    state.login = new TransactionProcessor(formData, strings.createJobAdUrl);

    var resp = await state.login.transaction();

    var err = null;
    if (resp.error !== undefined) {
        err = resp.error;
    }
    if (err != null) {
        clearLoader();
    } else {
        // The job ad was written to the blockchain

        // Q: if the database write fails how do we rollback the blockchain write transaction?

        // 4. write the job id, hash and blob to the database with the image
        var body = JSON.stringify({
            database: dbelements.databaseName,
            table: dbelements.databaseTable,
            id: formData.jobReference,
            hash: myhash,
            image: blob
        });
        const dp = new DatabaseProcessor(dbelements.databaseUri);

        dp.transactionPut(body);

        // TODO error checking here

        clearLoader();
        await displaySuccessPopup('Job Ad Successfully Posted!');
        window.location = "recruiter-dashboard.html";
    }

}

const tabClickHandler = async (e) => {
    state.tabIndex = parseInt(e.target.id.substr(-1));
    state.tabbedPane = state.tabIndex == 1 ? elements.tabbedPane1 : elements.tabbedPane2;
    sessionStorage.setItem('tabbedPane', state.tabbedPane.id);
}

state.page = elementConsts.MAINPAGE; //default

// CREATEJOBADPAGE
if (document.URL.includes("createjobad")) {
    state.page = elementConsts.CREATEJOBADPAGE;
    var submitJobBtn = elements.createjobbutton;
    createJobAdView.setEmail(sessionStorage.getItem('email'));
    createJobAdView.setCompany(sessionStorage.getItem('company'));
    submitJobBtn.addEventListener('click', e => {
        e.preventDefault();
        createJobAdHandler();
    });

    var fields = elements.inputFields;
    var i;
    for (i = 0; i < fields.length; i++) {
        fields[i].addEventListener("blur", (e) => {
            createJobAdView.validateField(e.target);
        });
    }
    elements.description.addEventListener("blur", (e) => {
        createJobAdView.validateField(e.target);
    });

    var jobType = elements.jobtype;
    jobType.addEventListener("change", (e) => {
        clearError(document.getElementById("jobtype-error"));
    });
    var bchain = elements.blockchain;
    bchain.addEventListener("change", (e) => {
        clearError(document.getElementById("blockchain-error"));
    });
    var description = elements.description;
    description.addEventListener("change", (e) => {
        clearError(document.getElementById("description-error"));
    });

    document.querySelector("#file-1").addEventListener('change', function () {

        // set the file name in the view text field
        var path = this.value;
        path = path.substring(path.lastIndexOf('\\') + 1);

        try {
            var img = imageLoader.loadImage(this.files[0]);

            createJobAdView.setLogoFileAndImage(path, img);
        } catch (error) {
            console.log("Error loading image: " + error);
            // TODO display popup? 
        }
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
        buyJobCreditsHandler(e, jobCreditsView, strings.buyJobAdsUrl);
    });
}

if (document.URL.includes("recruiter-dashboard")) {
    state.page = elementConsts.DASHBOARDPAGE;
    setCompanyName(sessionStorage.getItem('company'));
    setContactName(sessionStorage.getItem('name'));
    getJobAdsHandler();
    var createButton = elements.createBtn;
    createButton.addEventListener("click", (e) => {
        window.location = "createjobad.html";
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
        signInHandler(e, registerJobSeekerView, strings.jobSeekerRegisterTransaction);
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
    navBarSetLoggedIn(state.loggedIn);
}


var signins = elements.signins;
if (state.loggedIn === true) {
    console.log("GOSH...SIGN OUT!!!")
    for (i = 0; i < signins.length; i++) {
        signins[i].addEventListener("click", (e) => {
            console.log("OOOOOOOOOOOOOOPS!!!!!!!!!!!");
            e.preventDefault();
            signOutHandler(e);
        });
    }
};
// getImage();
const displaySuccessPopup = async (theText) => {
    await Swal({
        title: 'Success!',
        text: theText,
        type: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#cc6d14',
    });
}

const displayErrorPopup = async () => {
    await Swal({
        title: 'Server Error!',
        text: 'SignOut failed',
        type: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#cc6d14',
    });
};

// getElementById("wankbutton").addEventListener('click', e => {
// console.log("begin>>>>>>>>>>>>");
// // e.preventDefault();
// var dp = new DatabaseProcessor("");
// var resp = dp.transactionPut();
// console.log("end>>>>>>>>>>>> resp = " + resp);
// });
