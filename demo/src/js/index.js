const css = require('../sass/main.scss');
require('./scripts/fontawesome-all');

import SignIn from './models/SignInOrOut';
import * as registerView from './views/registerView';
import * as loginView from './views/loginView';
import { getFormFor, elements, elementConsts, inputType, renderLoader, clearLoader, strings } from './views/base';

const state = {};
var loggedIn = sessionStorage.getItem('loggedIn');
state.loggedIn = loggedIn === "true" ? true : false;
console.log("logged in = " + state.loggedIn);


// SIGNIN CONTROLLER
const signInHandler = async (e, view, url) => {
    var btn = e.target;
    const form = getFormFor(btn);
    state.form = form;

    if (form) {
        const data = view.getFormData(form);

        const error = view.validateData(data);

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


        // 3) start spinner(rename this
        // TODO make sure we use the correct tabbedPane
        renderLoader(elements.tabbedPane2);

        try {
            view.clearServerErrorMessage();
            //         // 4) register a new account
            var err = await state.login.userSignInOut();
            clearLoader();
            console.log("BARK: userSignIn, err = " + err);
            if (err != null) {
                console.log(">>>> err message = " + err.message);
                console.log(">>>> err code = " + err.statusCode);

                if (err.message === strings.fetchFail) {
                    view.displayServerErrorMessage(err.message);
                } else {
                    if (err.message.includes(strings.alreadyExists)) {
                        view.displayServerErrorMessage(null);
                    } else {
                        view.displayErrorFromServerMessage(err.message);
                    }
                }
            } else {
                console.log("Setting logged in to true");
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
        console.log("Logging out: email " + sessionStorage.getItem('email'));
        var btn = e.target;
        const data = view.getSignOutData(state.login.getEmail());    
        state.login = new SignInOrOut(data, elements.strings.setLoggedInTransaction);
        var err = await state.login.userSignInOut();
        setLoggedIn(false);
    }
}

const tabClickHandler = async (e) => {
    state.tabIndex = e.target.id.substr(-1);
}

console.log("document url = " + document.URL);
if (document.URL.includes("register")) {
    var recRegBtn = elements.registerRecruiterButton;

    recRegBtn.addEventListener('click', e => {
        e.preventDefault();
        loginView.clearValidationErrorMessages();
        state.inputType = inputType.REGISTER;
        signInHandler(e, registerView, strings.registerRecruiterUrl);
    });


    var recLoginBtn = elements.loginRecruiterButton;

    recLoginBtn.addEventListener('click', e => {
        e.preventDefault();
        registerView.clearValidationErrorMessages();
        state.inputType = inputType.LOGIN;
        signInHandler(e, loginView, strings.loginUrl);
    });

    var fields = elements.inputFields;
    var i;
    for (i = 0; i < fields.length; i++) {
        fields[i].addEventListener("blur", (e) => {
            if (state.inputType == inputType.REGISTER) {
                registerView.validateField(e.target);
            } else {
                loginView.validateField(e.target);
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
    // else {
    //     window.location = "register.html";
    // }

    window.onload = () => {
        registerView.setLoggedIn(state.loggedIn);
    }
}
function setLoggedIn(view, loggedIn) {
    state.loggedIn = loggedIn;
    sessionStorage.setItem('loggedIn', loggedIn === true ? "true" : "false");
    console.log("1. >>SETTING login email to " + state.login.getEmail());
    console.log("loggedIn =" + loggedIn);
    if (loggedIn === true) {
        console.log("2. >>SETTING login email to " + state.login.getEmail());
        sessionStorage.setItem('email', state.login.getEmail());
    }
    view.setLoggedIn(loggedIn);
}