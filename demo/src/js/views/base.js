
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
    remote: document.querySelector('input[name="remote"]:checked'),
    jobtype: document.getElementById("jobtype"),
    blockchain: document.getElementById("blockchain"),
    description: document.getElementById("description")
};

export const dbelements = {
    databaseUri: "http://localhost:8083/apiput.php",
    databaseTable: "company_logo",
    databaseName: "hubdb"
};

//------------------------------------------------------------------
// UK Sky Hub
var ipAddress = '90.200.134.28';

// Romania Hub
// var ipAddress = '84.117.182.193';
//-------------------------------------------------------------------

var recruiterLoginTransaction = 'io.onemillionyearsbc.hubtutorial.GetHubRecruiter';
var jobSeekerLoginTransaction = 'io.onemillionyearsbc.hubtutorial.GetHubJobSeeker';
var recruiterRegisterTransaction = 'io.onemillionyearsbc.hubtutorial.CreateRecruiterAccount';
var jobSeekerRegisterTransaction = 'io.onemillionyearsbc.hubtutorial.CreateJobSeekerAccount';
var setLoggedInTransaction = "io.onemillionyearsbc.hubtutorial.SetLoggedIn";
var buyJobAdsTransaction = "io.onemillionyearsbc.hubtutorial.jobs.BuyJobCredits";
var getJobAdsTransaction = "io.onemillionyearsbc.hubtutorial.jobs.GetJobAds";
var createJobAdTransaction = "io.onemillionyearsbc.hubtutorial.jobs.CreateJobPosting";

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
    loginRecruiterUrl: `http://${ipAddress}:3000/api/${recruiterLoginTransaction}`,
    loginJobSeekerUrl: `http://${ipAddress}:3000/api/${jobSeekerLoginTransaction}`,
    registerRecruiterUrl: `http://${ipAddress}:3000/api/${recruiterRegisterTransaction}`,
    registerJobSeekerUrl: `http://${ipAddress}:3000/api/${jobSeekerRegisterTransaction}`,
    setLoggedInUrl: `http://${ipAddress}:3000/api/${setLoggedInTransaction}`,
    buyJobAdsUrl: `http://${ipAddress}:3000/api/${buyJobAdsTransaction}`,
    getJobAdsurl: `http://${ipAddress}:3000/api/${getJobAdsTransaction}`,
    createJobAdUrl: `http://${ipAddress}:3000/api/${createJobAdTransaction}`
};

export const elementConsts = {
    JOBSEEKER: 1,
    RECRUITER: 2,
    MAINPAGE: 1,
    REGISTERPAGE: 2,
    DASHBOARDPAGE: 3,
    BUYCREDITSPAGE: 4,
    CREATEJOBADPAGE: 5,
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