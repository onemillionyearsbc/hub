import { elements, strings, checkStyle, clearError } from './base';

export const setEmail = (email) => {
    var emailElement = document.getElementById("email");
    emailElement.value = email;
    emailElement.readOnly = true;
    emailElement.style.color = "#aaa";
}

export const setCompany = (company) => {
    var companyElement = document.getElementById("company");
    companyElement.value = company;
    companyElement.readOnly = true;
    companyElement.style.color = "#aaa";
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
        company: myData["company"],
        jobTitle: myData["jobtitle"],
        remote: getRemote(),
        jobType: getSelectedOption(elements.jobtype),
        blockchainName: getSelectedOption(elements.blockchain),
        description: getDescription()
    };
    return formData;
}

function getSelectedOption(sel) {
    if (sel.options[sel.selectedIndex].disabled === false) {
        return sel.value;
    }
    return "";
}


function getRemote() {
    return document.querySelector('input[name="remote"]:checked').value;
}

function getDescription() {
    return elements.description.value;
}

function getBlockchainType(type) {
    if (type === undefined) {
        return "";
    }
    return type.toUpperCase();
}

function calculateJobReference() {
    return new Date().getTime().toString().substr(-8);
}

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
    console.log(">>>>>>>>>>>>>>>>>> data.jobType = " + data.jobType);
    if (data.jobType.length === 0) {
        console.log(">>>>>>>>>>>>>>>>>> ERROR");
        error = true;
        var x = document.getElementById("jobtype-error");
        checkStyle(x);
    }
    if (data.blockchainName.length === 0) {
        error = true;
        var x = document.getElementById("blockchain-error");
        checkStyle(x);
    }
    if (data.description.length === 0) {
        error = true;
        var x = document.getElementById("description-error");
        checkStyle(x);
    }
    return error;
}

export const setLogoFile = (fileName) => {
    var logoText = document.getElementById('logotext2');
    logoText.innerHTML = fileName;
}

