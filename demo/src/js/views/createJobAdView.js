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

    var formData = {
        $class: strings.createJobAdTransaction,
        jobReference: calculateJobReference(),
        email: email,
        company: myData["company"],
        jobTitle: myData["jobtitle"],
        remote: getRemote(),
        jobType: getSelectedOption(elements.jobtype),
        blockchainName: getSelectedOption(elements.blockchain),
        description: getDescription(),
        contact: myData["contact"],
        internalRef: myData["internalref"],
        employer: getEmployer(),
        salary: myData["salary"],
        location: myData["location"],
        skills: getSkills(myData["skills"])
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

function getEmployer() {
    return document.querySelector('input[name="employer"]:checked').value;
}

function getSkills(skills) {
    if (skills === "") {
        return "";
    }
    console.log("+++++++++++ skills length = |" + skills.split("' AND '|,|\s") + "|");
    return skills.split(/[ ,]+/);
}

function getDescription() {
    return elements.description.value;
}
/*
{"$class":"io.onemillionyearsbc.hubtutorial.jobs.CreateJobPosting",
"jobReference":"62030886",
"email":"geominat@gmail.com",
"company":"AT Kearney Middle East",
"jobTitle":"Hyperledger Fabric Analyst",
"remote":"true",
"jobType":"CONTRACT",
"blockchainName":"HYPERLEDGER",
"description":"Dictator needed for work in bunker",
"contact":"Mike",
"internalRef":"Mike001","employer":"true",
"salary":"",
"location":"",
"skills":["C++","Java"]}
*/

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
    console.log("kills length = "+ data.skills.length);
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

    /*
{
  "$class": "io.onemillionyearsbc.hubtutorial.jobs.CreateJobPosting",
  "jobReference": "22334",
  "email": "a.hitler@nazis.com",
  "company": "NAZI PARTY",
  "jobType": "FULLTIME",
  "remote": false,
  "jobTitle": "Lunatic",
  "blockchainName": "ETHEREUM",
  "description": "Dictator required to start wars",
  "contact": "Goebbels",
  "internalRef": "Goebbels01",
  "employer": false,
  "salary": "100dm",
  "location": "Berlin",
  "skills": ["Java","Python"]
}
    */
export const setLogoFile = (fileName) => {
    var logoText = document.getElementById('logotext2');
    logoText.innerHTML = fileName;
}

