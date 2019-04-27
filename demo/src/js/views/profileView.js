
import { elements, getValueOfRadio, checkStyle, clearError, getSelectedOption, getDaysAgo, getSkills } from './base';
import { SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION } from 'constants';


export const setJobSeekerEmail = (email) => {
    var emailElement = document.getElementById("email");
    emailElement.value = email;
    emailElement.readOnly = true;
    emailElement.style.color = "#aaa";
}

function setPersonTitle(data) {
    if (data.params.name.title != undefined) {
        var title = elements.title;
        title.value = data.params.name.title;
        var placeholder = document.getElementById("bollocks1");
        placeholder.style.display = "block";
        title.style.color = 'black';
    }
}

function setPhone(data) {
    if (data.params.phone != undefined) {
        var phone = elements.phone;
        phone.value = data.params.phone;
    }
}

function setCity(data) {
    if (data.params.city != undefined) {
        var city = elements.city;
        city.value = data.params.city;
    }
}

function setCountry(data) {
    var country = elements.country;
    country.value = data.params.country;
    let placeholder = document.getElementById("dd5");
    placeholder.style.display = "block";
    country.style.color = 'black';
}

function setWebLink(data) {
    if (data.params.weblink != undefined) {
        var link1 = elements.link1;
        link1.value = data.params.weblink;
    }
}

function setLanguages(data) {
    if (data.params.languages != undefined) {
        var newStr = data.params.languages.join(" ");
        elements.languages.value = newStr;
    }
}
function setITExperience(data) {
    if (data.params.itexperience != undefined) {
        let val = "0";
        if (data.params.blockexperience === 1 || data.params.blockexperience === 2) {
            val = "1";
        }
        if (data.params.blockexperience >= 3 && data.params.blockexperience <= 5) {
            val = "3";
        }
        if (data.params.blockexperience >= 6 || data.params.blockexperience <= 10) {
            val = "6";
        }
        if (data.params.blockexperience >= 11 || data.params.blockexperience <= 20) {
            val = "11";
        }
        if (data.params.blockexperience > 20) {
            val = "20";
        }

        var experience = elements.experience;
        experience.value = val;
        var placeholder = document.getElementById("dd1");
        placeholder.style.display = "block";
        experience.style.color = 'black';
    }
}

function setBlockExperience(data) {
    if (data.params.blockexperience != undefined) {
        let val = "3+";
        if (data.params.blockexperience != 3) {
            val = parseInt(data.params.blockexperience);
        }

        var yb = elements.yearsBlock;
        yb.value = val;
        var placeholder = document.getElementById("dd3");
        placeholder.style.display = "block";
        yb.style.color = 'black';
    }
}

function setSkills(data) {
    if (data.params.skills != undefined) {
        var skills = elements.keySkills;
        skills.value = data.params.skills;
    }
}
function setBlockchainUsed(data) {
    if (data.params.blockchainUsed != undefined) {
        var blockchainUsed = elements.blockchainUsed;
        blockchainUsed.value = data.params.blockchainUsed;
        var placeholder = document.getElementById("dd2");
        placeholder.style.display = "block";
        blockchainUsed.style.color = 'black';
    }
}

function setDesiredJobType(data) {
    if (data.params.newjobtype != undefined) {
        var placeholder = document.getElementById("dd4");
        placeholder.style.display = "block";
        var jobType = elements.personJobType;
        jobType.value = data.params.newjobtype;
        elements.personJobType.style.color = 'black';
    }
}

function setDesiredJobTitle(data) {
    console.log("desired job title = " + data.params.newjobtitle);
    if (data.params.newjobtitle != undefined) {
        var newjobtitle = elements.desiredJobTitle;
        console.log("newjobtitle = " + newjobtitle);
        newjobtitle.value = data.params.newjobtitle;
    }
}

function setDesiredJobSummary(data) {
    if (data.params.newjobsummary != undefined) {
        var psummary = elements.personSummary;
        psummary.value = data.params.newjobsummary;
    }
}

function setFirstAndLastName(data) {
    var firstElement = elements.firstName;
    firstElement.value = data.params.name.firstName;

    var lastElement = elements.lastName;
    lastElement.value = data.params.name.lastName;
}
function setRemote(data) {
    if (data.params.newjobremote === true) {
        document.getElementById("yesremote").checked = true;
    } else {
        document.getElementById("noremote").checked = true;
    }
}

function setVisibility(data) {
    if (data.params.visibility === true) {
        document.getElementById("yesshare").checked = true;
    } else {
        document.getElementById("noshare").checked = true;
    }
}

function setCV(data) {
    if (data.params.cvfile != undefined) {
        setCVFile(data.params.cvfile, data);
        sessionStorage.setItem("amend", "true");
    } else {
        sessionStorage.setItem("amend", "false");
    }
}

function setCVDaysAgo(data) {
    let daysAgoElement = elements.cvDaysAgo;
    if (data.params.cvdate != undefined) {
        let daysAgo = getDaysAgo(data.params.cvdate);
        daysAgoElement.innerHTML = "Uploaded " + daysAgo;
    } else {
        daysAgoElement.innerHTML = "Uploaded today";
    }
}

export const setProfileFields = (data) => {
    setFirstAndLastName(data);

    setPersonTitle(data);

    setPhone(data);

    setCity(data);

    setCountry(data);

    setWebLink(data);

    setLanguages(data);

    setITExperience(data);

    setSkills(data);

    setBlockchainUsed(data);

    setBlockExperience(data);

    setRemote(data);

    setVisibility(data);

    setDesiredJobType(data);

    setDesiredJobTitle(data);

    setDesiredJobSummary(data);

    setCV(data);

    setCVDaysAgo(data);

    if (data.params.cvhash != undefined) {
        sessionStorage.setItem("cvhash", data.params.cvhash);
    }
}

function getExperience(element) {
    let val = getSelectedOption(element);
    let years = parseInt(val);
    return years;
}

function getSkillText() {
    let s = elements.personSkills;
    return s.value;
}

function getSummary() {
    let s = elements.personSummary;
    return s.value;
}

export const getProfileFormData = (email, transaction) => {
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
        email: email,
        params: {
            $class: "io.onemillionyearsbc.hubtutorial.HubJobSeekerParameters",
            name: {
                $class: "io.onemillionyearsbc.hubtutorial.Name",
                title: getSelectedOption(elements.personTitle),
                firstName: myData["first"],
                lastName: myData["last"]
            },
            phone: myData["phone"],
            country: getSelectedOption(elements.personCountry),
            city: myData["city"],
            weblink: myData["link1"],
            itexperience: getExperience(elements.itexperience),
            skills: getSkillText(),
            languages: getSkills(myData["languages"]),  // use the getSkills method to chop a string into an array
            blockchainUsed: getSelectedOption(elements.blockchainUsed),
            blockexperience: getExperience(elements.yearsBlock),
            newjobsummary: getSummary(),
            newjobtitle: myData["desiredjobtitle"],
            newjobremote: getValueOfRadio("remote"),
            newjobtype: getSelectedOption(elements.personJobType),
            visibility: getValueOfRadio("share")
        },
    };
    let cv = getCVFile();
    if (cv != "" && cv != undefined) {
        formData.params.cvfile = cv;
    }
    return formData;
}


function getCVFile() {
    let dateElement = document.getElementById("cvtext2");
    console.log("dateElement = " + dateElement);
    if (dateElement != null) {
        return dateElement.innerHTML;
    }
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
        if (element.value.length === 0 && getValueOfRadio("remote") === "false") {
            var x = document.getElementById("location-error");
            checkStyle(x);
        } else {
            clearError(x);
        }
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

export const setCVFile = (fileName, data) => {
    var cvdate = document.getElementById('cvtext2');
    cvdate.innerHTML = fileName;

    document.getElementById('pbox1').style.display = 'none';
    document.getElementById('pbox2').style.display = 'block';

    setCVDaysAgo(data);

}

