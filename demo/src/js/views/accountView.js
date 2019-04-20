import { elements, strings, getSelectedOption, getDaysAgo } from './base';

export const setAlertData = (data) => {
    for (let i = 0; i < data.length; i++) {
        renderAlert(data[i], i + 1);
    }
}

function renderAlert(data, index) {
    console.log(data);
    let daysAgo = getDaysAgo(data.datePosted);

    let criteria = getCriteria(data);

    let markup = `
    <div class="jobalert">
        <div class="top">
            <p>Job Alert ${index}</p>
            <p>Set up ${daysAgo}</p>
        </div>
        <div class="middle">
            <div class="togglefield">
                <div class="toggle">
                    <input type="radio" name="status-${index}" value="true" id="onstatus-${index}"
                        checked="checked" />
                    <label for="onstatus-${index}">Alert On</label>
                    <input type="radio" name="status-${index}" value="false" id="offstatus-${index}" />
                    <label for="offstatus-${index}">Alert Off</label>
                </div>
            </div>
            <div class="criteriafield">
                <span>Criteria:</span>
                <p>${criteria}</p>
            </div>
            <div class="links">
                <ul class="alertlist">
                    <li class="editcriteria" data-alertid=${data.alertId}>edit criteria
                    </li>
                    <li class="testcriteria" data-alertid=${data.alertId}>test alert
                    </li>
                    <li class="deletealert" data-alertid=${data.alertId}>delete alert
                    </li>
                </ul>
            </div>
        </div>
    </div>
    `;
    elements.alertList.insertAdjacentHTML("beforeend", markup);

    // set alerton radio button to on or off
    let onEle = document.getElementById(`onstatus-${index}`);
    let offEle = document.getElementById(`offstatus-${index}`);
    console.log("data.alertOn = " + data.alertOn);
    if (data.alertOn === true) {
        onEle.checked = true;
        offEle.checked = false;
    } else {
        onEle.checked = false;
        offEle.checked = true;
    }
}

function getCriteria(data) {
    let criteria = "";
    let start = "";

    for (let i = 0; i < data.alertCriteria.skills.length; i++) {
        criteria += data.alertCriteria.skills[i]
        if (i < data.alertCriteria.skills.length - 1) {
            criteria += ", ";
        }
        start = ", ";
    }
    if (data.alertCriteria.blockchainName != "NONE" && data.alertCriteria.blockchainName != undefined) {
        let bc = data.alertCriteria.blockchainName;
        bc = bc.charAt(0).toUpperCase() + bc.slice(1).toLowerCase();
        criteria += start + bc;
        start = ", ";
    }
    if (data.alertCriteria.city != "" && data.alertCriteria.city != undefined) {
        criteria += start + data.alertCriteria.city;
        start = ", ";
    }
    if (data.alertCriteria.country != "" && data.alertCriteria.country != undefined) {
        criteria += start + data.alertCriteria.country;
    }
    if (data.alertCriteria.remote === true) {
        criteria += ", remote";
    }
    if (data.alertCriteria.fulltime === false) {
        criteria += ", contract";
    }
    return criteria;
}