
import { elements, elementConsts, getJobTypeFor, getJobTimeFor, strings } from './base';

export const setJobFields = () => {
    let description = sessionStorage.getItem("description");
    elements.jobdescription.innerHTML = description;

    
    let location = sessionStorage.getItem("location");
 
    if (sessionStorage.getItem("remote") === "true") {
        elements.joblocation.innerHTML = "REMOTE";
        elements.joblocation.style.color = "red";
    } else {
        let loc = "";
        let city = sessionStorage.getItem("city");
        if (location.length != 0) {
            loc = `<p id="joblocation" class="loggy__label"><span>${location}</span></p>`
            if (city != null && city.length != 0) {
                loc = `<p id="joblocation" class="loggy__label"><span>${city}</span>, <span>${location}</span></p>`;
            }
            elements.joblocation.innerHTML = loc;
        } else if (city.length != 0) {
            elements.joblocation.innerHTML = city;
        }  
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

    let jobviews = sessionStorage.getItem("views");
    elements.jobviews.innerHTML = "<span>Views: </span>" + jobviews;
}

export const setApplications = (usertype) => {
    if (usertype === elementConsts.JOBSEEKER) {
        elements.jobApplications.innerHTML = "";
    } else {
        let numApplications = sessionStorage.getItem("applications");
        console.log("WOOF: applications = " + numApplications);
        elements.jobApplications.innerHTML = "<span>Applications: </span>" + numApplications;
    }
}

export const setJobLogo = (image) => {
    sessionStorage.setItem("logo", image);
    elements.joblogo.setAttribute('src', image);
}

export const isExpired = () => {
    let expiryDate = sessionStorage.getItem("expiryDate");
    let postedDate = sessionStorage.getItem("datePosted");
    let jtime = getJobTimeFor(expiryDate, postedDate);
    return (jtime === "EXPIRED");
}

export const getExpireJobData = (mail, ref) => {
    var expireJobData = {
        $class: strings.expireJobAdTransaction,
        email: mail,
        jobReference: ref
    };
    return expireJobData;
 }



