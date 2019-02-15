import { elements, strings } from './base';

export const setCompanyName = (name) => {
    var nameElement = elements.companyName;
    nameElement.innerHTML = `Company: <strong>${name}</strong>`;

    var companyElement = elements.company;
    companyElement.innerHTML = name;
}

export const setContactName = (name) => {
    var nameElement = elements.contact;
    nameElement.innerHTML = `Welcome <strong>${name}</strong>`;
}

export const setJobAdsData = (remaining) => {
    elements.remainingcounter.innerHTML = remaining;
}

export const setJobCreditsRemaining = (rows) => {
    let live=0;
    const now = new Date();
    for (var i = 0; i < rows.length; i++) {
        const expDate = new Date(rows[i].expiryDate);
        if (expDate.getTime() > now.getTime()) {
            live++;
        }
    }
    elements.livecounter.innerHTML = live;
    elements.postedcounter.innerHTML = rows.length;
}

export const getJobAdsData = (mail) => {
    var getJobAdsData = {
        $class: strings.getJobAdsTransaction,
        email: mail
    };
    return getJobAdsData;
}

