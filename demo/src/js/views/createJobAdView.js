import { elements, strings, checkStyle, clearError } from './base';

export const setEmail = (email) => {
    var emailElement = document.getElementById("email");
    emailElement.value = email;
    emailElement.readOnly = true;
    emailElement.style.color = "#aaa";
}

export const getFormData = (email) => {
    var form = elements.adForm;
    var el = form.querySelectorAll('input');
    var myData = {};

    for (var x = 0; x < el.length; x++) {
        var id = el[x].id;
        var value = el[x].value;
        myData[id] = value;
    };

    var jobRef = calculateJobReference();
    var formData = {
        $class: strings.createJobAdTransaction,
        jobReference: jobRef,
        email: email,
        jobTitle: myData["jobtitle"],
    };
    return formData;
}


function calculateJobReference() {
    return new Date().getTime().toString().substr(-8);
}

// export const getJobPostingData = (mail) => {
//     var buyCreditsData = {
//         $class: strings.buyJobAdsTransaction,
//         email: mail
//     };
//     return buyCreditsData;
// }

export const clearValidationErrorMessages = () => {
    var x = document.getElementById("email-error");
    clearError(x);
    var x = document.getElementById("jobtitle-error");
    clearError(x);
}

export const validateField = (element) => {
    var x;

    x = document.getElementById(`${element.id}-error`);

    console.log("value for element = " + element.value);

    if (element.value.length === 0) {
        checkStyle(x);
        return;
    } 
    x.style.display = "none";
}

export const validateData = (data) => {
    var error = false;

    if (data.email.length === 0) {
        error = true;
        var x = document.getElementById("email-error");
        checkStyle(x);
    }
    if (data.jobTitle.length === 0) {
        error = true;
        var x = document.getElementById("jobtitle-error");
        checkStyle(x);
    }
  
    return error;
}