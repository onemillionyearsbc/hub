import { elements, strings, checkStyle, clearError, getSelectedOption } from './base';

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

export const getFormData = (email, html) => {
    var form = elements.adForm;
    var el = form.querySelectorAll('input');
    var myData = {};

    for (var x = 0; x < el.length; x++) {
        var id = el[x].id;
        var value = el[x].value;
        myData[id] = value;
    };

    var formData = {
        $class: strings.createJobAdTransaction,
        jobReference: calculateJobReference(),
        email: email,
        company: myData["company"],
        jobTitle: myData["jobtitle"],
        remote: getRemote(),
        jobType: getSelectedOption(elements.jobtype),
        blockchainName: getSelectedOption(elements.blockchain),
        description: html,
        contact: myData["contact"],
        internalRef: myData["internalref"],
        employer: getEmployer(),
        salary: myData["salary"],
        location: myData["location"],
        skills: getSkills(myData["skills"])
    };
    return formData;
}

function getRemote() {
    return document.querySelector('input[name="remote"]:checked').value;
}

function getEmployer() {
    return document.querySelector('input[name="employer"]:checked').value;
}

function getSkills(skills) {
    if (skills === "") {
        return "";
    }
    let skillsArr = skills.match(/"[^"]*"|\S+/g);
   
    // remove double quotes around any multi word strings
    for (var i = 0; i < skillsArr.length; i++) {
        if (skillsArr[i].charAt(0) === '"' && skillsArr[i].charAt(skillsArr[i].length-1) === '"') {
            skillsArr[i] = skillsArr[i].substr(1, skillsArr[i].length-2);
        } else {
            console.log(i + " -> MOOO!");
        }
    }
    console.log("Skills list = " + skillsArr + "; length = " + skillsArr.length);
    return skillsArr;
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

    if (x == null) {
        return;
    }
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
    if (data.jobType.length === 0) {
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
    if (data.contact.length === 0) {
        error = true;
        var x = document.getElementById("contact-error");
        checkStyle(x);
    }
    if (data.internalRef.length === 0) {
        error = true;
        var x = document.getElementById("internalref-error");
        checkStyle(x);
    }
    if (data.location.length === 0 && data.remote === "false") {
        error = true;
        var x = document.getElementById("location-error");
        checkStyle(x);
    }
    for (var i = 0; i < data.skills.length; i++) {
        console.log(i + " -> " + data.skills[i]);
    }
    if (data.skills.length === 0) {
        error = true;
        var x = document.getElementById("skills-error");
        checkStyle(x);
    }
    return error;
}

export const setLogoFileAndImage = (fileName, image) => {
    var logoText = document.getElementById('logotext2');
    logoText.innerHTML = fileName;

    document.querySelector("#imgs").setAttribute('src', image);
    document.getElementById('pbox1').style.display = 'none';
    document.getElementById('pbox2').style.display = 'block';
}

