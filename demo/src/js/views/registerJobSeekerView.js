import { elements, checkStyle, clearError } from './base';

export const getFormFor = (btn) => {

    const form = btn.parentElement.parentElement.parentElement;
    var onTop = form.getAttribute("top");

    console.log("form id = " + form.id + "; on top = " + onTop);
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

    var nameFields = myData["name"].split(' ');
    var len = nameFields.length;
    myData["firstName"] = nameFields[0];
    myData["lastName"] = nameFields[len-1];
  
    // TODO move hardwired composer object names into base.js
    var formData = {
        $class: "io.onemillionyearsbc.hubtutorial.CreateJobSeekerAccount",
        params: {
            $class: "io.onemillionyearsbc.hubtutorial.HubJobSeekerParameters",
            name: {
                $class: "io.onemillionyearsbc.hubtutorial.Name",
                firstName: myData["firstName"],
                lastName: myData["lastName"]
            },
            address:{
                $class: "io.onemillionyearsbc.hubtutorial.Address",
                country: myData["location"]
            }
        },
        accountType: "RECRUITER",
        email: myData["email"],
        password: myData["password"]
    };


    return formData;
}


export const clearValidationErrorMessages = () => {
    var x = document.getElementById("name-error-r-js");
    clearError(x);
    var x = document.getElementById("email-error-r-js");
    clearError(x);
    var x = document.getElementById("password-error-r-js");
    clearError(x);
    var x = document.getElementById("location-error-r-js");
    clearError(x);
}

export const validateData = (data) => {
    var error = false;

    if (data.params.name.firstName.length === 0 || data.params.name.lastName.length === 0) {
        error = true;
        var x = document.getElementById("name-error-r-js");
        checkStyle(x);
    }
    if (data.email.length === 0) {
        error = true;
        var x = document.getElementById("email-error-r-js");
        checkStyle(x);
    }
    if (data.password.length < 6) {
        error = true;
        var x = document.getElementById("password-error-r-js");
        checkStyle(x);
    } if (data.params.address.country.length === 0) {
        error = true;
        var x = document.getElementById("location-error-r-js");
        checkStyle(x);
    }
    return error;
}

export const clearServerErrorMessage = () => {
    elements.loginErrorJS.style = "none";
    elements.serverErrorJS.style = "none";
}


export const displayErrorFromServerMessage = (error) => {
    const errStr = "returned with failure: ";
    var len = errStr.length;
    var start = error.indexOf(errStr);

    const strToDisplay = error.substring(start + len, error.length);

    console.log("to display: " + strToDisplay);
    if (error != null) {
        elements.serverErrorJS.innerHTML = ` <p><i class="icon fas fa-exclamation-triangle"></i>
        ${strToDisplay}
    </p>`;
    }

    elements.serverError.style.display = "block";
}
export const displayServerErrorMessage = (error) => {
    if (error != null) {
        elements.serverErrorJS.style.display = "block";
        elements.loginErrorJS.style.display = "none";
    } else {
        elements.serverErrorJS.style.display = "none";
        elements.loginErrorJS.style.display = "block";
    }
}

export const validateField = (element) => {

    var x = document.getElementById(`${element.id}-error-r-js`);
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


