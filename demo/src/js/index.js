const css = require('../sass/main.scss');
require('./scripts/fontawesome-all');
const Swal = require('sweetalert2');

import SignInOrOut from './models/SignInOrOut';
import * as registerView from './views/registerView';
import * as registerJobSeekerView from './views/registerJobSeekerView';
import * as loginView from './views/loginView';
import { getFormFor, elements, elementConsts, inputType, renderLoader, clearLoader, navBarSetLoggedIn, strings } from './views/base';

const state = {};
var loggedIn = sessionStorage.getItem('loggedIn');
state.loggedIn = loggedIn === "true" ? true : false;

// SIGNIN CONTROLLER
const signInHandler = async (e, view, url, transaction) => {
    var btn = e.target;
    const form = getFormFor(btn);
    state.form = form;

    if (form) {
        const data = view.getFormData(form, transaction);
        const error = view.validateData(data, state.tabIndex);

        if (error) {
            return error;
        }
        state.login = new SignInOrOut(data, url);
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
            var err = await state.login.userSignInOut();
            clearLoader();
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
                    } else
                    {
                        
                        view.displayErrorFromServerMessage(err.message);
                    }
                }
            } else {
                setLoggedIn(view, true);
                if (state.tabIndex == elementConsts.JOBSEEKER) {
                    window.location = "jobseeker-dashboard.html";
                } else {
                    window.location = "recruiter-dashboard.html";
                }
            }
        } catch (error) {
            return error;
        }
    }
}

const signOutHandler = async (e) => {
    if (state.loggedIn === true) {
        renderLoader(state.tabbedPane);
        var email = sessionStorage.getItem('email');
        const data = loginView.getSignOutData(email);   
        state.login = new SignInOrOut(data, strings.setLoggedInUrl);
        var err = await state.login.userSignInOut();
        clearLoader();
        if (err==null) {
            setLoggedIn(loginView, false);
            Swal({
                title: 'Success!',
                text: 'You have signed out',
                type: 'success',
                confirmButtonText: 'OK',
                confirmButtonColor: '#cc6d14',
              });
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

if (document.URL.includes("register")) {
    
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

    var signins = elements.signins;
    if (state.loggedIn === true) {
        for (i = 0; i < signins.length; i++) {
            signins[i].addEventListener("click", (e) => {
                e.preventDefault();
                signOutHandler(e);
            });
        }
    }
  

    window.onload = () => {
        navBarSetLoggedIn(state.loggedIn);
    }
}
function setLoggedIn(view, loggedIn) {
    state.loggedIn = loggedIn;
    sessionStorage.setItem('loggedIn', loggedIn === true ? "true" : "false");
    if (loggedIn === true) {
        sessionStorage.setItem('email', state.login.getEmail());
    }
    navBarSetLoggedIn(loggedIn);
}
