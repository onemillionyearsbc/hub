
import { elements, strings, checkStyle, clearError, getSelectedOption } from './base';


export const setJobSeekerEmail = (email) => {
    var emailElement = document.getElementById("email");
    emailElement.value = email;
    emailElement.readOnly = true;
    emailElement.style.color = "#aaa";
}

export const setJobSeekerAmendFields = () => {

    // title
    let paj = document.getElementById("postajob");
    paj.innerHTML = "Update Job: " + sessionStorage.getItem("jobReference");

    // job type
    let jobType = sessionStorage.getItem("jobType");
    elements.jobtype.value = jobType;
    elements.jobtype.style.color = 'black';

    // job title
    var jt = sessionStorage.getItem("jobTitle");
    elements.jobtitle.value = jt;
    var placeholder = document.getElementById("bollocks1");
    placeholder.style.display = "block";

    // logo
    var image = sessionStorage.getItem("logo");
    setLogoFileAndImage("", image);

    // remote
    var remote = sessionStorage.getItem("remote");
    if (remote === "true") {
        document.getElementById("yesremote").checked = true;
    } else {
        document.getElementById("noremote").checked = true;
    }

    // blockchain name
    var bt = sessionStorage.getItem("blockchainName");
    elements.blockchain.value = bt;
    placeholder = document.getElementById("bollocks2");
    placeholder.style.display = "block";
    elements.blockchain.style.color = 'black';

    // contact
    var contact = sessionStorage.getItem("contact");
    elements.contact.value = contact;

    // internal ref
    var iref = sessionStorage.getItem("internalRef");
    elements.internalref.value = iref;

    // skills
    let skills = sessionStorage.getItem("skills");
    elements.skills.value = skills;

    // employer/agency
    var employer = sessionStorage.getItem("employer");
    if (employer === true) {
        document.getElementById("employer").checked = true;
    } else {
        document.getElementById("agency").checked = true;
    }

    // salary
    let salary = sessionStorage.getItem("salary");
    elements.salary.value = salary;

    // location
    let location = sessionStorage.getItem("location");
    elements.location.value = location;

    // city
    let city = sessionStorage.getItem("city");
    if (city != null && city != undefined && city.length > 0) {
        console.log("City = " + city)
        elements.city.value = city;
    }
  

    // description
    let htmlToInsert = sessionStorage.getItem("description");
    var editor = document.getElementsByClassName('ql-editor')
    editor[0].innerHTML = htmlToInsert;
}

export const getProfileFormData = (email, html, transaction) => {
    var form = elements.adForm;
    var el = form.querySelectorAll('input');
    var myData = {};

    for (var x = 0; x < el.length; x++) {
        var id = el[x].id;
        var value = el[x].value;
        myData[id] = value;
    };

    var formData = {
        $class: transaction,
        params: {
            $class: "io.onemillionyearsbc.hubtutorial.jobs.JobPostingParameters",
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
            city: myData["city"],
            skills: getSkills(myData["skills"])
        }
    };

    if (document.querySelector("#imgs").getAttribute('src') === "") {
        sessionStorage.setItem("logohash", "");
    }
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
        if (skillsArr[i].charAt(0) === '"' && skillsArr[i].charAt(skillsArr[i].length - 1) === '"') {
            skillsArr[i] = skillsArr[i].substr(1, skillsArr[i].length - 2);
        } 
    }
    return skillsArr;
}


export const clearValidationErrorMessages = () => {
    var x = document.getElementById("email-error");
    clearError(x);
    var x = document.getElementById("jobtitle-error");
    clearError(x);
}


export const validateField = (element) => {

    console.log("VALIDATING: " + element.id);
    var x;
    x = document.getElementById(`${element.id}-error`);

    if (x == null) {
        return;
    }
    if (element.id === "location") {
        console.log("PARP 2 ! data.remote = " + getRemote());
        if (element.value.length === 0 && getRemote() === "false") {
            var x = document.getElementById("location-error");
            checkStyle(x);
        } else {
            clearError(x);        }
        return;
    }
    if (element.value.length === 0) {
        checkStyle(x);
        return;
    }
    x.style.display = "none";
}
export const validateProfileData = (data) => {
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
    if (data.location.length === 0 && data.city.length && data.remote === "false") {
        error = true;
        var x = document.getElementById("location-error");
        checkStyle(x);
        var x = document.getElementById("city-error");
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

export const setCVFile = (fileName, image) => {
    // var logoText = document.getElementById('logotext2');
    // logoText.innerHTML = fileName;

    // document.querySelector("#imgs").setAttribute('src', image);
    // document.getElementById('pbox1').style.display = 'none';
    // document.getElementById('pbox2').style.display = 'block';
}

