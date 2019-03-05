

export const elements = {
    signins: document.getElementsByClassName('signin'),
    registerForms: document.getElementsByClassName('submitRegister'),
    loginForms: document.getElementsByClassName('submitLogin'),
    registerRecruiterButton: document.getElementById('submitRegisterRecruiter'),
    loginRecruiterButton: document.getElementById('submitLoginRecruiter'),
    registerJobSeekerButton: document.getElementById('submitRegisterJobSeeker'),
    loginJobSeekerButton: document.getElementById('submitLoginJobSeeker'),
    inputFields: document.getElementsByClassName('loginform__textfield'),
    tabs: document.getElementsByClassName('tabInput'),
    tabbedPane1: document.getElementById('tab-content1'),
    tabbedPane2: document.getElementById('tab-content2'),
    tabbedPane: document.getElementById('tabbedpane'),
    loginError: document.getElementById('login-error'),
    serverError: document.getElementById('server-error'),
    loginErrorJS: document.getElementById('login-error-js'),
    serverErrorJS: document.getElementById('server-error-js'),
    jobSeekerTabId: document.getElementById("tab1"),
    companyName: document.getElementById("companyName"),
    company: document.getElementById("company"),
    contact: document.getElementById("contact"),
    internalref: document.getElementById("internalref"),
    skills: document.getElementById("skills"),
    salary: document.getElementById("salary"),
    location: document.getElementById("location"),
    dashboard: document.getElementById("dash"),
    createBtn: document.getElementById("createBtn"),
    mainWindow: document.getElementById("main"),
    jobadsnum: document.getElementById("jobadsnum"),
    slider:document.getElementById('rangeinput'),
    leftsliderbutton:document.getElementById('leftsliderbutton'),
    rightsliderbutton:document.getElementById('rightsliderbutton'),
    savingLabel:document.getElementById('saving'),
    jobPrice: document.getElementById('jobprice'),
    buyjobadsbtn: document.getElementById('buyjobadsbtn'),
    jobadsWindow: document.getElementById("jobadspage"),
    livecounter: document.getElementById("livecounter"),
    postedcounter: document.getElementById("postedcounter"),
    remainingcounter: document.getElementById("remainingcounter"),
    createjobbutton: document.getElementById("createjobbutton"),
    createJobPage: document.getElementById("jobad"),
    adForm: document.getElementById("adform"),
    madForm: document.getElementById("madform"),
    remote: document.querySelector('input[name="remote"]:checked'),
    jobtype: document.getElementById("jobtype"),
    blockchain: document.getElementById("blockchain"),
    description: document.getElementById("description"),
    filterType: document.getElementById("jobDateType"),
    userselect: document.getElementById("userselect"),
    dateFrom: document.getElementById("datefrom"),
    dateTo: document.getElementById("dateto"),
    bulkType: document.getElementById("bulkType"),
    viewJob: document.getElementById("displayjob"),
    jobtitle: document.getElementById("jobtitle"),
    joblocation: document.getElementById("joblocation"),
    jobsalary: document.getElementById("jobsalary"),
    jobcompany: document.getElementById("jobcompany"),
    jobtime: document.getElementById("jobtime"),
    jobdescription: document.getElementById("jobdescription"),
    lower: document.getElementById("lower"),
    jobcontact: document.getElementById("jobcontact"),
    jobref: document.getElementById("jobref"),
    jobid: document.getElementById("jobid"),
    joblogo: document.getElementById("joblogo"),
    amendjobbutton: document.getElementById("amendjobbutton"),
    expirejobbutton: document.getElementById("expirejobbutton"),
    jobdescription: document.getElementById("jobdescription"),
    searchResList: document.querySelector(".results_list"),
    alertBtn:  document.getElementById("alertbtn"),
    jobTotal: document.getElementById("jobtotal"),
    searchBtn: document.getElementById("mainsearchbutton"),
    searchjob: document.getElementById("searchjob"),
    display: document.getElementById("display"),
    blockchainTotals: document.querySelector(".blockchaintotals"),
    dateTotals: document.querySelector(".datetotals"),
    employerTotals: document.querySelector(".employertotals"),
    jobTypeTotals: document.querySelector(".jobtypetotals"),
    onsiteTotals: document.querySelector(".onsitetotals"),
    companyTotals: document.querySelector(".companytotals"),
    filterButtons: document.querySelector(".filters"),
    listItems: document.getElementsByTagName("li"),
    categoryList: document.querySelector(".category"),
    companyLabelList:  document.querySelector(".companylabel"),
    filterContent: document.getElementById("filterbuttons"),
    filterTitle: document.querySelector(".filters"),
};

export const dbelements = {
    databaseInsertUri: "http://localhost:8083/sqlinsert.php", // TODO change to ip of server (CONFIG)
    databaseSelectUri: "http://localhost:8083/sqlselectbyid.php", // TODO change to ip of server
    databaseTable: "company_logo",
    databaseName: "hubdb"
};

//------------------------------------------------------------------
// UK Sky Hub (Linux)
// var ipAddress = '90.200.134.28';

// Romania Hub (Linux)
// var ipAddress = '84.117.182.193';

// localhost (Windows)
var ipAddress = "localhost";
//-------------------------------------------------------------------

var recruiterLoginTransaction = 'io.onemillionyearsbc.hubtutorial.GetHubRecruiter';
var jobSeekerLoginTransaction = 'io.onemillionyearsbc.hubtutorial.GetHubJobSeeker';
var recruiterRegisterTransaction = 'io.onemillionyearsbc.hubtutorial.CreateRecruiterAccount';
var jobSeekerRegisterTransaction = 'io.onemillionyearsbc.hubtutorial.CreateJobSeekerAccount';
var setLoggedInTransaction = "io.onemillionyearsbc.hubtutorial.SetLoggedIn";
var buyJobAdsTransaction = "io.onemillionyearsbc.hubtutorial.jobs.BuyJobCredits";
var getJobAdsTransaction = "io.onemillionyearsbc.hubtutorial.jobs.GetJobAds";
var createJobAdTransaction = "io.onemillionyearsbc.hubtutorial.jobs.CreateJobPosting";
var updateJobAdTransaction = "io.onemillionyearsbc.hubtutorial.jobs.UpdateJobPosting";
var getJobPostingsTransaction = "io.onemillionyearsbc.hubtutorial.jobs.GetJobPostingsDynamic";
var getAllJobPostingsTransaction = "io.onemillionyearsbc.hubtutorial.jobs.GetAllLiveJobPostings";
var expireJobAdTransaction = "io.onemillionyearsbc.hubtutorial.jobs.ExpireJobPosting";


export const strings = {
    loader: 'loader',
    fetchFail: 'Failed to fetch',
    alreadyExists: 'object already exists',
    signInFail: 'nothing was returned',
    recruiterLoginTransaction: `${recruiterLoginTransaction}`,
    jobSeekerLoginTransaction: `${jobSeekerLoginTransaction}`,
    recruiterRegisterTransaction: `${recruiterRegisterTransaction}`,
    jobSeekerRegisterTransaction: `${jobSeekerRegisterTransaction}`,
    setLoggedInTransaction: `${setLoggedInTransaction}`,
    buyJobAdsTransaction: `${buyJobAdsTransaction}`,
    getJobAdsTransaction: `${getJobAdsTransaction}`,
    createJobAdTransaction: `${createJobAdTransaction}`,
    updateJobAdTransaction: `${updateJobAdTransaction}`,
    expireJobAdTransaction: `${expireJobAdTransaction}`,
    getJobPostingsTransaction: `${getJobPostingsTransaction}`,
    getAllJobPostingsTransaction: `${getAllJobPostingsTransaction}`,
    loginRecruiterUrl: `http://${ipAddress}:3000/api/${recruiterLoginTransaction}`,
    loginJobSeekerUrl: `http://${ipAddress}:3000/api/${jobSeekerLoginTransaction}`,
    registerRecruiterUrl: `http://${ipAddress}:3000/api/${recruiterRegisterTransaction}`,
    registerJobSeekerUrl: `http://${ipAddress}:3000/api/${jobSeekerRegisterTransaction}`,
    setLoggedInUrl: `http://${ipAddress}:3000/api/${setLoggedInTransaction}`,
    buyJobAdsUrl: `http://${ipAddress}:3000/api/${buyJobAdsTransaction}`,
    getJobAdsurl: `http://${ipAddress}:3000/api/${getJobAdsTransaction}`,
    createJobAdUrl: `http://${ipAddress}:3000/api/${createJobAdTransaction}`,
    updateJobAdUrl: `http://${ipAddress}:3000/api/${updateJobAdTransaction}`,
    expireJobAdUrl: `http://${ipAddress}:3000/api/${expireJobAdTransaction}`,
    getJobPostingsUrl: `http://${ipAddress}:3000/api/${getJobPostingsTransaction}`,
    getAllJobPostingsUrl: `http://${ipAddress}:3000/api/${getAllJobPostingsTransaction}`,
    beginningOfTime: "1970-01-01T15:11:47.728Z",
    endOfTime: "3070-01-01T15:11:47.728Z",
    blockchainFilter: 'blockchaintotals',
    companyFilter: 'companytotals',
    dateFilter: 'datetotals',
    employerTypeFilter: 'employertotals',
    jobTypeFilter: 'jobtypetotals',
    onSiteFilter: 'onsiteTotals'
};

export const elementConsts = {
    JOBSEEKER: 1,
    RECRUITER: 2,
    MAINPAGE: 1,
    REGISTERPAGE: 2,
    DASHBOARDPAGE: 3,
    BUYCREDITSPAGE: 4,
    CREATEJOBADPAGE: 5,
    MANAGEJOBSPAGE: 6,
    DISPLAYJOBPAGE: 7,
    JOBADPRICE: 99,
    JOBDISCOUNT: 10,
    JOBMINPRICE: 49,
    MAXJOBS: 10
}

export const jobTypeConsts = {
    FULLTIME: 1,
    CONTRACT: 2,
    PARTTIME: 3,
    INTERNSHIP: 4,
    OTHER: 5
}

export const blockchainTypeConsts = {
    ETHEREUM: 1,
    HYPERLEDGER: 2,
    NEO: 3,
    QUOROM: 4,
    RIPPLE: 5,
    OTHER: 6
}

export const inputType = {
    LOGIN: 1,
    REGISTER: 2
}

export const renderLoader = parent => {
    const loader = `
        <div style="top:25%" class="${strings.loader}"></div>
    `;
    parent.insertAdjacentHTML('afterbegin', loader); // afterbegin means insert after the beginning of the parent element
};

export const renderLoaderEnd = parent => {
    const loader = `
        <div style="top:65%"class="${strings.loader}"></div>
    `;
    parent.insertAdjacentHTML('beforeend', loader); // beforeend means insert before the end of the parent element
};

export const renderLoaderFromBottom = (parent, percent) => {
    const loader = `
        <div style="bottom:${percent}%"class="${strings.loader}"></div>
    `;
    parent.insertAdjacentHTML('beforeend', loader); // beforeend means insert before the end of the parent element
};

export const renderLoaderEndByNumber = (parent, percent) => {
    const loader = `
        <div style="top:${percent}%"class="${strings.loader}"></div>
    `;
    parent.insertAdjacentHTML('beforeend', loader); // beforeend means insert before the end of the parent element
};

export const clearLoader = () => {
    const loader = document.querySelector(`.${strings.loader}`);
    if (loader) loader.parentElement.removeChild(loader);
};

export const getFormFor = (btn) => {

    const form = btn.parentElement.parentElement.parentElement;
    var onTop = form.getAttribute("top");

    // don't fire the submit form data stuff unless the screen is on top
    // otherwise it fires when we bring the screen to the front as well
    if (onTop == "false") {
        return null;
    }
    return form;
}

export const navBarSetLoggedIn = (loggedIn) => {
    var signins = elements.signins;
    for (var i = 0; i < signins.length; i++) {
        if (loggedIn) {
            signins[i].innerHTML = `<a href="#" class="link-icon"><i class="icon far fa-user"></i>Log Out</a>`;
        } else {
            signins[i].innerHTML = `<a href="register.html" class="link-icon"><i class="icon far fa-user"></i>Sign In</a>`;
        }   
    }
}

export const setLoggedIn = (state, loggedIn) => {
    state.loggedIn = loggedIn;
    sessionStorage.setItem('loggedIn', loggedIn === true ? "true" : "false");
    if (loggedIn === true) {
        sessionStorage.setItem('email', state.login.getEmail());
    }
    navBarSetLoggedIn(loggedIn);
}


export function checkStyle(x) {
    if (x.style.display != "block") {
        x.style.display = "block";
    }
}

export function clearError(x) {
    if (x.style.display != "none") {
        x.style.display = "none";
    }
}

export function enableCreateJobButton(remaining) {
    if (remaining > 0) {
        elements.createBtn.disabled = false;
    } else {
        elements.createBtn.disabled = true;
    }
}

export function getSelectedOption(sel) {
    if (sel.options[sel.selectedIndex].disabled === false) {
        return sel.value;
    }
    return "";
}
export function getJobTimeFor(expiryDate, postedDate) {
    const ed = new Date(expiryDate);
    const pd = new Date(postedDate);
    const now = new Date();

    // if within 5 days of expiring put expires in x days
    let timeDiff = ed.getTime() - now.getTime();
    let dayDifference = Math.round(timeDiff / (1000 * 3600 * 24));

    if (ed < now) {
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
    else if (dayDifference == 1) {
        return ("Posted yesterday");
    }
    return ("Posted " + dayDifference + " days ago");
}


export function getDaySincePosted(postedDate) {
    const pd = new Date(postedDate);
    const now = new Date();

    let timeDiff = now.getTime() - pd.getTime();
    let dayDifference = Math.round(timeDiff / (1000 * 3600 * 24));
    return dayDifference;
}


export function getJobTypeFor(jobType) {
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


