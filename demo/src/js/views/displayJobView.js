const crypto = require('crypto');
const Swal = require('sweetalert2');

import { elements, elementConsts, strings } from './base';

export const setJobFields = () => {
    let description = sessionStorage.getItem("description");
    elements.jobdescription.innerHTML = description;

    let location = sessionStorage.getItem("location");
    elements.joblocation.innerHTML = location;

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
    sessionStorage.setItem("logo", image);
    elements.joblogo.setAttribute('src', image);
}

export const checkHash = async (image, dbhash) => {
    // get hash from blockchain
    // hash the image again...
    // 1. compare with hash from db
    // 2. compare with hash from blockchain
    const myhash = crypto.createHash('sha256') // enables digest
        .update(image) // create the hash
        .digest('hex'); // convert to string

    const bchash = sessionStorage.getItem("logohash");
    if (myhash === bchash && dbhash === bchash) {
        console.log("HASHES EQUAL!");
        return true;
    }

    // TODO move swal stuff into separate file (and hash crypto code)
    if (myhash !== bchash) {
        console.log("HASH DISCREPANCY; hash from blockchain = " + bchash + "; hash of image from db = " + myhash);
        await Swal({
            title: 'HASH DISCREPANCY...DATA ALERT!',
            text: "hash from blockchain = " + bchash + "\n hash of image from db = " + myhash,
            type: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#cc6d14',
        });
        return false;
    }
    if (dbhash !== bchash) {
        console.log("HASH DISCREPANCY; hash from blockchain = " + bchash + "; hash from db = " + dbhash);
        await Swal({
            title: 'HASH DISCREPANCY...DATA ALERT!',
            text: "hash from blockchain = " + bchash + "\n hash from db = " + myhash,
            type: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#cc6d14',
        });
        return false;
    }
}





function getJobTimeFor(expiryDate, postedDate) {
    const ed = new Date(expiryDate);
    const pd = new Date(postedDate);
    const now = new Date();

    console.log("ed = " + ed + "; pd = " + pd);
    // if within 5 days of expiring put expires in x days
    let timeDiff = ed.getTime() - now.getTime();
    let dayDifference = Math.round(timeDiff / (1000 * 3600 * 24));

    if (dayDifference < 0) {
        return "EXPIRED";
    } else if (dayDifference == 0) {
        return "Expires today"
    } else if (dayDifference <= 5) {
        return "Expires in " + dayDifference + " days";
    }

    timeDiff = now.getTime() - pd.getTime();
    dayDifference = Math.round(timeDiff / (1000 * 3600 * 24));
    if (dayDifference == 0) {
        return "Posted today";
    }
    return ("Posted " + dayDifference + " days ago");
}

function getJobTypeFor(jobType) {
    var jt;
    switch (jobType) {
        case "FULLTIME":
            jt = "Full Time";
            break;
        case "CONTRACT":
            jt = "Contract";
            break;
        case "PARTTIME":
            jt = "Part Time";
            break;
        case "INTERNSHIP":
            jt = "Internship";
            break;
        case "OTHER":
            jt = "Other";
            break;
    }
    return jt;
}