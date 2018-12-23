const css = require('../sass/main.scss');
require('./scripts/fontawesome-all');

import Register from './models/Register';
import SignIn from './models/SignIn';
import * as registerView from './views/registerView';
import * as loginView from './views/loginView';
import { getFormFor, elements, elementConsts, renderLoader, clearLoader, strings } from './views/base';

console.log("ooohhh nooooo");
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
        state.login = new SignIn(data, url);
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
            //         // 4) register a new account
            var err = await state.login.userSignIn();
            clearLoader();
            if (err != null) {
                console.log(">>>> err message = " + err.message);
                console.log(">>>> err code = " + err.statusCode);
                if (err.message == strings.fetchFail) {
                    view.displayServerErrorMessage(err.message);
                } else {
                    if (err.message.includes("transaction returned with failure")) {
                        view.displayServerErrorMessage(err.message);

                    } else {
                        view.displayServerErrorMessage(null);
                    }
                                    }
            } else {
                setLoggedIn(true);
                if (state.tabIndex == elementConsts.JOBSEEKER) {
                    window.location = "jobseeker-dashboard.html";
                } else {
                    window.location = "recruiter-dashboard.html";
                }

            }

        } catch (error) {
            // alert('Something wrong with the register...' + err);
            // TODO display error on view (popup?
            return error;
        }

    }
}

const signOutHandler = async (e) => {
    if (state.loggedIn === true) {
        console.log("Logging out: email " + sessionStorage.getItem('email'));
    }
}

const tabClickHandler = async (e) => {
    state.tabIndex = e.target.id.substr(-1);
}

var forms = elements.registerForms;
var i;
for (i = 0; i < forms.length; i++) {
    forms[i].addEventListener('click', e => {
        e.preventDefault();
        signInHandler(e, registerView, strings.registerRecruiterUrl);
    });
};

forms = elements.loginForms;
var i;
for (i = 0; i < forms.length; i++) {
    forms[i].addEventListener('click', e => {
        e.preventDefault();
        signInHandler(e, loginView, strings.loginUrl);
    });
};

var fields = elements.inputFields;
for (i = 0; i < fields.length; i++) {
    fields[i].addEventListener("blur", (e) => {
        registerView.validateField(e.target);
    });
}

var tabs = elements.tabs;
for (i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener("click", (e) => {
        tabClickHandler(e);
    });
}

var signins = elements.signins;
// if (state.loggedIn === true) {
//     for (i = 0; i < signins.length; i++) {
//             signins[i].addEventListener("click", (e) => {
//                 e.preventDefault();
//                 signOutHandler(e);
//             });
//         } 
//     }
// else {
//     window.location = "register.html";
// }

window.onload = () => {
    registerView.setLoggedIn(state.loggedIn);
}
function setLoggedIn(loggedIn) {
    state.loggedIn = loggedIn;
    sessionStorage.setItem('loggedIn', loggedIn === true ? "true" : "false");
    if (loggedIn===true) {
        console.log(">>SETTING login email to " + state.login.getEmail());
        sessionStorage.setItem('email', state.login.getEmail());
    } 
    registerView.setLoggedIn(loggedIn);
}

