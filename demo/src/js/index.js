const css = require('../sass/main.scss');
require('./scripts/fontawesome-all');
const Swal = require('sweetalert2');

import SignInOrOut from './models/SignInOrOut';
import * as registerView from './views/registerView';
import * as registerJobSeekerView from './views/registerJobSeekerView';
import * as loginView from './views/loginView';
import { getFormFor, elements, elementConsts, inputType, renderLoader, clearLoader, navBarSetLoggedIn, setLoggedIn, strings } from './views/base';
import { setCompanyName, setContactName } from './views/recruiterDashboardView';
import { setJobAdsNumber, setTotalJobPrice } from './views/jobCreditsView';

const state = {};
var loggedIn = sessionStorage.getItem('loggedIn');
state.loggedIn = loggedIn === "true" ? true : false;

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
        state.login = new SignInOrOut(formData, url);
        // console.log("%%%%%%%%%%%%%%%%%%%%%%%%%  DATA START  %%%%%%%%%%%%%%%%%%%%%%%");


        // var propValue;
        // for (var propName in state.login) {
        //     propValue = state.login[propName]

        //     console.log(propName + "->" + propValue);
        // }
        // console.log("email = " + state.login.getEmail());
        // console.log("%%%%%%%%%%%%%%%%%%%%%%%%%  DATA END  %%%%%%%%%%%%%%%%%%%%%%%")


        // TODO make sure we use the correct tabbedPane
        renderLoader(state.tabbedPane);

        try {
            view.clearServerErrorMessage();
            //register a new account
            var resp = await state.login.userSignInOut();

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
                console.log("err = " + err);
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

const signOutHandler = async (e) => {
    console.log("state.loggedIn= " + state.loggedIn);


    if (state.loggedIn === true) {
        if (state.page === elementConsts.MAINPAGE) {
            renderLoader(elements.mainWindow);
        } else if (state.page === elementConsts.DASHBOARDPAGE) {
            renderLoader(elements.dashboard);
        } if (state.page === elementConsts.REGISTERPAGE) {
            renderLoader(state.tabbedPane);
        }

        var email = sessionStorage.getItem('email');
        const data = loginView.getSignOutData(email);
        state.login = new SignInOrOut(data, strings.setLoggedInUrl);
        var resp = await state.login.userSignInOut();
        var err = null;
        if (resp.error !== undefined) {
            err = resp.err;
        }
        clearLoader();
        if (err == null) {
            setLoggedIn(loginView, false);

            // display POP UP
            await Swal({
                title: 'Success!',
                text: 'You have signed out',
                type: 'success',
                confirmButtonText: 'OK',
                confirmButtonColor: '#cc6d14',
            });
            state.loggedIn = false;
            sessionStorage.setItem('loggedIn', false);
            window.location = "register.html";
        } else {
            console.log("logout, err = " + err);
            Swal({
                title: 'Server Error!',
                text: 'SignOut failed',
                type: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#cc6d14',
            });
            // if (err.message === strings.fetchFail) {
            //     loginView.displayServerErrorMessage(err.message);
            // } 
        }
    }
}

const tabClickHandler = async (e) => {
    state.tabIndex = parseInt(e.target.id.substr(-1));
    state.tabbedPane = state.tabIndex == 1 ? elements.tabbedPane1 : elements.tabbedPane2;
    sessionStorage.setItem('tabbedPane', state.tabbedPane.id);
}

state.page = elementConsts.MAINPAGE; //default


if (document.URL.includes("jobcredits")) {
    var input = elements.slider;
    setTotalJobPrice(1);
    document.querySelector('input[type=range]').value = 1;
    setJobAdsNumber(1);
    input.onchange = function () {
        setJobAdsNumber(input.value);
        setTotalJobPrice(input.value);
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

}

function adjustSlider(delta) {
    var input = elements.slider;
    var oldValue = parseInt(input.value);
    var newValue;
    if (delta === -1) {
        newValue = oldValue == 1 ? 1 : oldValue - 1;
    } else {
        newValue = oldValue == elementConsts.MAXJOBS ? elementConsts.MAXJOBS : oldValue + 1;
    }
    document.querySelector('input[type=range]').value = newValue;
    setJobAdsNumber(input.value);
    setTotalJobPrice(input.value);
}

if (document.URL.includes("recruiter-dashboard")) {
    state.page = elementConsts.DASHBOARDPAGE;
    setCompanyName(sessionStorage.getItem('company'));
    setContactName(sessionStorage.getItem('name'))
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
    navBarSetLoggedIn(state.loggedIn);
}
async function getImage() {
    var xhr = new XMLHttpRequest();
    var imageURL = 'http://localhost:8080/img/bubbles.jpg';
    var response = await fetch(imageURL);
    console.log(">>>>>>>>>>>>>>>>>>>>>>>BEGIN>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    console.log(response)
    console.log(">>>>>>>>>>>>>>>>>>>>>>>END>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

    var blob = await response.blob();
    console.log(blob);
    console.log(">>>>>>>>>>>>>>>>>>>>>>>END 2 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    var reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
        console.log(reader.result);
        console.log(">>>>>>>>>>>>>>>>>>>>>>>END 3 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        console.log("STRING LEN = " + reader.result.length);
    };

}

console.log("++++ SIGN OUT TEST...")
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
}
// getImage();