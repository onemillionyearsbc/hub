const crypto = require('crypto');
const Swal = require('sweetalert2');

import { elements, strings, getJobTypeFor, getJobTimeFor } from './base';

export const setJobFields = () => {
    let description = sessionStorage.getItem("description");
    elements.jobdescription.innerHTML = description;

    
    let location = sessionStorage.getItem("location");
   
    if (sessionStorage.getItem("remote") === "true") {
        elements.joblocation.innerHTML = "REMOTE";
        elements.joblocation.style.color = "red";
    } else {
        elements.joblocation.innerHTML = location;
    }
   
    let title = sessionStorage.getItem("jobTitle");
    elements.jobtitle.innerHTML = title;

    let company = sessionStorage.getItem("company");
    elements.jobcompany.innerHTML = company;

    let salary = sessionStorage.getItem("salary");
    if (salary == null) {
        salary = "No salary given for this position";
    }
    elements.jobsalary.innerHTML = salary;

    let jobType = sessionStorage.getItem("jobType");
    let jt = getJobTypeFor(jobType);
    elements.jobtype.innerHTML = jt;

    let expiryDate = sessionStorage.getItem("expiryDate");
    let postedDate = sessionStorage.getItem("datePosted");

    let jtime = getJobTimeFor(expiryDate, postedDate);
    elements.jobtime.innerHTML = jtime;

    let contact = sessionStorage.getItem("contact");
    elements.jobcontact.innerHTML = "<span>Contact:</span>" + contact;

    let ref = sessionStorage.getItem("internalRef");
    elements.jobref.innerHTML = "<span>Reference:</span>" + ref;

    let id = sessionStorage.getItem("jobReference");
    elements.jobid.innerHTML = "<span>Job Id:</span>" + id;

}
export const setJobLogo = (image) => {
    console.log("IMAGE ->>>>" + image);
    sessionStorage.setItem("logo", image);
    elements.joblogo.setAttribute('src', image);
}


export const getExpireJobData = (mail, ref) => {
    var expireJobData = {
        $class: strings.expireJobAdTransaction,
        email: mail,
        jobReference: ref
    };
    return expireJobData;
 }



