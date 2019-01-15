import { elements, elementConsts, strings } from './base';

export const getFormData = (form, transaction) => {
    var el = form.querySelectorAll('input');
    var myData = {};

    for (var x = 0; x < el.length; x++) {
        var id = el[x].id;
        var value = el[x].value;
        myData[id] = value;
    };

    // TODO get the right formData object for recruiter or jobseeker
    // TODO possibly this should be moved into the model
    var formData = {
        $class: transaction,
        email: myData["email"],
        password: myData["password"]
    };

    return formData;
}

export const getSignOutData = (mail) => {
    var signOutData = {
        $class: strings.setLoggedInTransaction,
        email: mail,
        loggedIn: false
    };
    return signOutData;
}

export const clearValidationErrorMessages = (tab) => {
    if (tab == elementConsts.RECRUITER) {
        var x = document.getElementById("email-error");
        clearError(x);
        x = document.getElementById("password-error");
        clearError(x);
        x = document.getElementById(`signin-error`);
        clearError(x);
        x = document.getElementById(`signin-server-error`);
        clearError(x);
    } else {
        var x = document.getElementById("email-error-js");
        clearError(x);
        var x = document.getElementById("password-error-js");
        clearError(x);
        x = document.getElementById(`signin-error-js`);
        clearError(x);
        x = document.getElementById(`signin-server-error-js`);
        clearError(x);
    }
}

function clearError(x) {
    if (x.style.display != "none") {
        x.style.display = "none";
    }
}

export const clearServerErrorMessage = () => {
    elements.loginError.style = "none";
    elements.serverError.style = "none";
}

export const displayErrorFromServerMessage = () => {

}

export const validateData = (data, tab) => {
    var error = false;

    if (data.email.length === 0) {
        error = true;
        var x;
        if (tab == elementConsts.RECRUITER) {
            x = document.getElementById("email-error");
        } else {
            x = document.getElementById("email-error-js");
        }
        checkStyle(x);
    }
    if (data.password.length < 6) {
        error = true;
        var x;
        if (tab == elementConsts.RECRUITER) {
            x = document.getElementById("password-error");
        } else {
            x = document.getElementById("password-error-js");
        }
        checkStyle(x);
    }
    return error;
}

export const displayServerErrorMessage = (error, tab) => {
    var x, y;
    if (tab == elementConsts.RECRUITER) {
        console.log("WARBLING ERRRRRRRRRRRRRRRRRRR RECRUITER");
        x = document.getElementById(`signin-error`);
        y = document.getElementById(`signin-server-error`);

        if (error != null) {
            x = document.getElementById(`signin-server-error`);
            y = document.getElementById(`signin-error`);
        }
    } else {
        console.log("WARBLING ERRRRRRRRRRRRRRRRRRR SEEKER");
        x = document.getElementById(`signin-error-js`);
        y = document.getElementById(`signin-server-error-js`);

        if (error != null) {
            x = document.getElementById(`signin-server-error-js`);
            y = document.getElementById(`signin-error-js`);
        }
    }

    x.style.display = "block";
    y.style.display = "none";
}

export const validateField = (element, tab) => {
    var x;
    if (tab == elementConsts.RECRUITER) {
        x = document.getElementById(`${element.id}-error`);
    } else {
        x = document.getElementById(`${element.id}-error-js`);
    }
    console.log("value for element = " + element.value);

    if (element.value.length === 0) {
        checkStyle(x);
        return;
    } else if (element.id === "password") {
        if (element.value.length < 6) {
            checkStyle(x);
            return;
        }
    }

    x.style.display = "none";
}

function checkStyle(x) {
    console.log("3. TRYING...x.id = " + x.id);
    if (x.style.display != "block") {
        x.style.display = "block";
    }
}

