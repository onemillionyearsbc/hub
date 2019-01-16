import { elements } from './base';

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