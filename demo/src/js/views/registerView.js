import { elements, strings, checkStyle, clearError } from './base';

export const getFormFor = (btn) => {

    const form = btn.parentElement.parentElement.parentElement;
    var onTop = form.getAttribute("top");

    // don't fire the submit form data stuff unless the screen is on top
    // otherwise it fires when we bring the screen to the front as well
    if (onTop == "false") {
        return null;
    }
    return form;
}

export const getFormData = (form) => {
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
        $class: strings.recruiterRegisterTransaction,
        name: myData["name"],
        company: myData["company"],
        accountType: "RECRUITER",
        email: myData["email"],
        password: myData["password"]
    };

    return formData;
}


export const clearValidationErrorMessages = () => {
    var x = document.getElementById("name-error-r");
    clearError(x);
    var x = document.getElementById("email-error-r");
    clearError(x);
    var x = document.getElementById("password-error-r");
    clearError(x);
    var x = document.getElementById("company-error-r");
    clearError(x);
}

export const validateData = (data) => {
    var error = false;

    if (data.name.length === 0) {
        error = true;
        var x = document.getElementById("name-error-r");
        checkStyle(x);
    }
    if (data.email.length === 0) {
        error = true;
        var x = document.getElementById("email-error-r");
        checkStyle(x);
    }
    if (data.password.length < 6) {
        error = true;
        var x = document.getElementById("password-error-r");
        checkStyle(x);
    } if (data.company.length === 0) {
        error = true;
        var x = document.getElementById("company-error-r");
        checkStyle(x);
    }
    return error;
}

export const clearServerErrorMessage = () => {
    elements.loginError.style = "none";
    elements.serverError.style = "none";
}


export const displayErrorFromServerMessage = (error) => {

    console.log("++++++++++++++++++++++++++++ ERROR: " + error);
    // var x = document.getElementById(`server-error`);

    const errStr = "returned with failure: ";
    var len = errStr.length;
    var start = error.indexOf(errStr);

    const strToDisplay = error.substring(start + len, error.length);

    console.log("to display: " + strToDisplay);
    if (error != null) {
        // x = document.getElementById(`server-error`);
        elements.serverError.innerHTML = ` <p><i class="icon fas fa-exclamation-triangle"></i>
        ${strToDisplay}
    </p>`;
    }

    elements.serverError.style.display = "block";
}
export const displayServerErrorMessage = (error) => {
    if (error != null) {
        elements.serverError.style.display = "block";
        elements.loginError.style.display = "none";
    } else {
        elements.serverError.style.display = "none";
        elements.loginError.style.display = "block";
    }
}

export const validateField = (element) => {

    var x = document.getElementById(`${element.id}-error-r`);
    console.log("VALIDATING: value for element = " + element.value);

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


