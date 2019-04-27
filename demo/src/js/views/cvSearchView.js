
import { elements, strings, getSkills, getValueOfRadio, getSelectedOption, } from './base';

export const getFormData = (myemail) => {
    var form = elements.adForm;
    var el = form.querySelectorAll('input');
    var myData = {};

    for (var x = 0; x < el.length; x++) {
        var id = el[x].id;
        var value = el[x].value;
        console.log("setting myData[" + id + "] to " + value);
        myData[id] = value;
    };

    let transaction = strings.cvSearchTransaction;
    var data = {
        $class: transaction,
        email : myemail,
        searchCriteria: {
            $class: "io.onemillionyearsbc.hubtutorial.jobs.CVSearchCriteria",
            remote: getValueOfRadio("remote"),
            jobType: getJobType(myData["jobtype"]),
            jobTitle: myData["desiredjobtitle"],
            skills: getSkills(myData["skills"]),
            languages: getSkills(myData["languages"]),
            city: getVal(myData["city"]),
            country: getVal(getSelectedOption(elements.country)),
            blockchainName: getSelectedOption(elements.blockchain)
        }
    };
   
    return data;
}

function getVal(field) {
    if (field == undefined) {
        return "";
    }
    return field;
}
function getJobType(jt) {
    if (jt === undefined) {
        return "ANY";
    }
    return getSelectedOption("jobtype");
}
function setSkills(data) {
    if (data.alertCriteria.skills.length > 0) {
        var skills = elements.skills;
        skills.value = data.alertCriteria.skills;
    }
}

function setRemote(data) {
    if (data.alertCriteria.remote === true) {
        document.getElementById("yesremote").checked = true;
    } else {
        document.getElementById("noremote").checked = true;
    }
}

function setFullTime(data) {
    if (data.alertCriteria.fulltime === true) {
        document.getElementById("fulltime").checked = true;
    } else {
        document.getElementById("contract").checked = true;
    }
}
function setCountry(data) {
    if (data.alertCriteria.country != "" && data.alertCriteria.country != undefined) {
        var country = elements.country;
        country.value = data.alertCriteria.country;
        let placeholder = document.getElementById("dd5");
        placeholder.style.display = "block";
        country.style.color = 'black';
    }
}

function setCity(data) {
    if (data.alertCriteria.city != "" && data.alertCriteria.city != undefined) {
        var city = elements.city;
        city.value = data.alertCriteria.city;
    }
}

function setBlockchain(data) {
    if (data.alertCriteria.blockchainName != undefined) {
        var blockchainName = elements.blockchain;
        blockchainName.value = data.alertCriteria.blockchainName;
        var placeholder = document.getElementById("dd2");
        placeholder.style.display = "block";
        blockchainName.style.color = 'black';
    }
}
export const setFormData = (data) => {
    setSkills(data);

    setRemote(data);

    setFullTime(data);

    setCountry(data);

    setCity(data);

    setBlockchain(data);
}


