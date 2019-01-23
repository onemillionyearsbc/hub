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

export const setJobAdsData = (live, posted, remaining) => {
    elements.livecounter.innerHTML = live;
    elements.postedcounter.innerHTML = posted;
    elements.remainingcounter.innerHTML = remaining;
}

export const getJobAdsData = (mail) => {
    var getJobAdsData = {
        $class: strings.getJobAdsTransaction,
        email: mail
    };
    return getJobAdsData;
}