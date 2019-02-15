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
    let postedDate = sessionStorage.getItem("postedDate");

    let jtime = getJobTimeFor(expiryDate, postedDate);
    elements.jobtime.innerHTML = jtime;
}

function getJobTimeFor(expiryDate, postedDate) {
    const ed = new Date(expiryDate);
    const pd = new Date(postedDate);
    const now = new Date();

    // if within 5 days of expiring put expires in x days
    let timeDiff = Math.abs(now.getTime() - ed.getTime());
    let dayDifference = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (dayDifference < 0) {
        return "EXPIRED";
    } else if (dayDifference == 0) {
        return "Expires today"
    } else if (dayDifference <=5) {
        return "Expires in " + dayDifference + " days";
    }
    
    timeDiff = Math.abs(pd.getTime - now.getTime());
    dayDifference = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return ("Posted " + dayDifference + " days ago");



    // const dd = expiryDate.getDate() <= 9 ? "0" + (expiryDate.getDate()) : (expiryDate.getDate());
    // const mm = expiryDate.getMonth() <= 8 ? "0" + (expiryDate.getMonth() + 1) : (expiryDate.getMonth() + 1);

    // var ed = dd + "/" + (mm) + "/" + expiryDate.getFullYear();

    // const datePosted = new Date(rows[i].datePosted);
    // const d2 = datePosted.getDate() <= 9 ? "0" + (datePosted.getDate()) : (datePosted.getDate());
    // const m2 = datePosted.getMonth() <= 8 ? "0" + (datePosted.getMonth() + 1) : (datePosted.getMonth() + 1);
    // var dp = d2 + "/" + (m2) + "/" + datePosted.getFullYear();
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