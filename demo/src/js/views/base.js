const Swal = require('sweetalert2');

import TransactionProcessor from '../models/TransactionProcessor';

let state = {};

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
    languages: document.getElementById("languages"),
    salary: document.getElementById("salary"),
    location: document.getElementById("location"),
    jobCity: document.getElementById("city"),
    dashboard: document.getElementById("dash"),
    createBtn: document.getElementById("createBtn"),
    cvSearchBtn: document.getElementById("cvsearchBtn"),
    mainWindow: document.getElementById("main"),
    jobadsnum: document.getElementById("jobadsnum"),
    slider: document.getElementById('rangeinput'),
    leftsliderbutton: document.getElementById('leftsliderbutton'),
    rightsliderbutton: document.getElementById('rightsliderbutton'),
    savingLabel: document.getElementById('saving'),
    jobPrice: document.getElementById('jobprice'),
    buyjobadsbtn: document.getElementById('buyjobadsbtn'),
    jobadsWindow: document.getElementById("jobadspage"),
    livecounter: document.getElementById("livecounter"),
    postedcounter: document.getElementById("postedcounter"),
    remainingcounter: document.getElementById("remainingcounter"),
    searchcounter: document.getElementById("searchcounter"),
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
    jobcity: document.getElementById("jobcity"),
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
    alertList: document.querySelector(".alert_list"),
    alertBtn: document.getElementById("alertbtn"),
    jobTotal: document.getElementById("jobtotal"),
    searchBtn: document.getElementById("mainsearchbutton"),
    searchjob: document.getElementById("searchjob"),
    display: document.getElementById("display"),
    blockchainTotals: document.querySelector(".blockchaintotals"),
    locationTotals: document.querySelector(".locationtotals"),
    dateTotals: document.querySelector(".datetotals"),
    employerTotals: document.querySelector(".employertotals"),
    jobTypeTotals: document.querySelector(".jobtypetotals"),
    onsiteTotals: document.querySelector(".onsitetotals"),
    companyTotals: document.querySelector(".companytotals"),
    filterButtons: document.querySelector(".filters"),
    listItems: document.getElementsByTagName("li"),
    categoryList: document.querySelector(".category"),
    companyLabelList: document.querySelector(".companylabel"),
    filterContent: document.getElementById("filterbuttons"),
    filterTitle: document.querySelector(".filters"),
    whatBtn: document.querySelector(".what-btn"),
    whereBtn: document.querySelector(".where-btn"),
    saveBtn: document.getElementById("saveBtn"),
    numBanner: document.querySelector(".numbanner"),
    buttonPanel: document.getElementById("bp"),
    advertBtn: document.getElementById("advertbutton"),
    removeAllBtn: document.getElementById("removeallbutton"),
    savedJobs: document.getElementById("savedjobs"),
    jobApplications: document.getElementById("jobapplications"),
    abtn: document.getElementById("abtn"),
    bbtn: document.getElementById("bbtn"),
    price1: document.getElementById("p1"),
    price2: document.getElementById("p2"),
    jobadviews: document.getElementById("jobadviews"),
    jobviews: document.getElementById("jobviews"),
    profilePage: document.getElementById("profilepage"),
    createprofilebutton: document.getElementById("createprofilebutton"),
    firstName: document.getElementById("first"),
    lastName: document.getElementById("last"),
    title: document.getElementById("title"),
    phone: document.getElementById("phone"),
    city: document.getElementById("city"),
    country: document.getElementById("country"),
    link1: document.getElementById("link1"),
    experience: document.getElementById("experience"),
    keySkills: document.getElementById("keyskills"),
    blockchainUsed: document.getElementById("blockchainused"),
    yearsBlock: document.getElementById("yearsblock"),
    pSummary: document.getElementById("psummary"),
    desiredJobTitle: document.getElementById("desiredjobtitle"),
    desiredJobType: document.getElementById("desiredjobtype"),
    personTitle: document.getElementById("title"),
    personCountry: document.getElementById("country"),
    itexperience: document.getElementById("experience"),
    personSkills: document.getElementById("keyskills"),
    personSummary: document.getElementById("psummary"),
    personJobType: document.getElementById("desiredjobtype"),
    cvDaysAgo: document.getElementById("cvimg"),
    accBanner: document.getElementById("instr"),
    changeEmail: document.getElementById("changeemail"),
    changePref: document.getElementById("changepref"),
    manageTok: document.getElementById("managetok"),
    closeAcc: document.getElementById("closeacc"),
    backLink: document.getElementById("backtoaccount"),
    createAlertBtn: document.getElementById("createalertbtn"),
    submitAlert: document.getElementById("submitalertbtn"),
    alertPage: document.getElementById("alertpage"),
    downloadcv: document.getElementById("downloadcv"),
    uploadcv: document.getElementById("uploadcv"),
    viewjobappsBtn: document.getElementById("viewjobappsbtn"),
    applyjobBtn: document.getElementById("applyjobbutton"),
    ref: document.getElementById("jobreftitle"),
    cvpanel:  document.getElementById("cv"),
    cvsearchesBtn:  document.getElementById("cvsearchbtn")
};

export const dbelements = {
    databaseInsertUri: "http://localhost:8083/sqlinsert.php", // TODO change to ip of server (CONFIG)
    databaseSelectUri: "http://localhost:8083/sqlselectbyid.php", // TODO change to ip of server
    databaseTable: "company_logo",
    databaseName: "hubdb",
    databaseSelectCVUri: "http://localhost:8083/sqlselectbyemail.php", // TODO change to ip of server
    databaseCVTable: "profile_cv",
};

//------------------------------------------------------------------
// UK Sky Hub (Linux)
// var ipAddress = '90.200.134.28';

// Romania Hub (Linux)
// var ipAddress = '84.117.182.193';
// var ipAddress = '192.168.0.66';

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
var addToFavouritesTransaction = "io.onemillionyearsbc.hubtutorial.jobs.AddJobToFavourites";
var getAllFavouritesTransaction = "io.onemillionyearsbc.hubtutorial.jobs.GetFavourites";
var removeFromFavouritesTransaction = "io.onemillionyearsbc.hubtutorial.jobs.RemoveJobFromFavourites";
var removeAllFavouritesTransaction = "io.onemillionyearsbc.hubtutorial.jobs.RemoveAllFavourites";
var incrementViewsTransaction = "io.onemillionyearsbc.hubtutorial.jobs.IncrementViews";
var incrementApplicationsTransaction = "io.onemillionyearsbc.hubtutorial.jobs.IncrementApplications";
var updateProfileTransaction = "io.onemillionyearsbc.hubtutorial.UpdateJobSeeker";
var createAlertTransaction = "io.onemillionyearsbc.hubtutorial.jobs.CreateJobAlert";
var updateAlertTransaction = "io.onemillionyearsbc.hubtutorial.jobs.UpdateJobAlert";
var removeAlertTransaction = "io.onemillionyearsbc.hubtutorial.jobs.RemoveJobAlert";
var testAlertTransaction = "io.onemillionyearsbc.hubtutorial.jobs.TestJobAlert";
var getAlertsTransaction = "io.onemillionyearsbc.hubtutorial.jobs.GetAlertsForEmail";
var getJobByRefTransaction = "io.onemillionyearsbc.hubtutorial.jobs.SelectJobPostingByRef";
var applyForJobTransaction = "io.onemillionyearsbc.hubtutorial.jobs.ApplyForJob";
var getApplicationsForUserTransaction = "io.onemillionyearsbc.hubtutorial.jobs.GetJobApplicationsForEmail";
var getApplicationsForJobRefTransaction = "io.onemillionyearsbc.hubtutorial.jobs.GetJobApplicationsForJobReference";
var getJobSeekerAccountTransaction = 'io.onemillionyearsbc.hubtutorial.GetHubJobSeekerByEmail';
var cvSearchTransaction = 'io.onemillionyearsbc.hubtutorial.jobs.CVSearch';


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
    addToFavouritesTransaction: `${addToFavouritesTransaction}`,
    removeFromFavouritesTransaction: `${removeFromFavouritesTransaction}`,
    removeAllFavouritesTransaction: `${removeAllFavouritesTransaction}`,
    incrementApplicationsTransaction: `${incrementApplicationsTransaction}`,
    incrementViewsTransaction: `${incrementViewsTransaction}`,
    updateProfileTransaction: `${updateProfileTransaction}`,
    createAlertTransaction: `${createAlertTransaction}`,
    updateAlertTransaction: `${updateAlertTransaction}`,
    removeAlertTransaction: `${removeAlertTransaction}`,
    testAlertTransaction: `${testAlertTransaction}`,
    getAlertsTransaction: `${getAlertsTransaction}`,
    getJobByRefTransaction: `${getJobByRefTransaction}`,
    applyForJobTransaction: `${applyForJobTransaction}`,
    getApplicationsForUserTransaction: `${getApplicationsForUserTransaction}`,
    getApplicationsForJobRefTransaction: `${getApplicationsForJobRefTransaction}`,
    getJobSeekerAccountTransaction: `${getJobSeekerAccountTransaction}`,
    cvSearchTransaction: `${cvSearchTransaction}`,
    
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
    addToFavouritesUrl: `http://${ipAddress}:3000/api/${addToFavouritesTransaction}`,
    getFavouritesTransactionUrl: `http://${ipAddress}:3000/api/${getAllFavouritesTransaction}`,
    removeFromFavouritesUrl: `http://${ipAddress}:3000/api/${removeFromFavouritesTransaction}`,
    removeAllFavouritesUrl: `http://${ipAddress}:3000/api/${removeAllFavouritesTransaction}`,
    incrementViewsUrl: `http://${ipAddress}:3000/api/${incrementViewsTransaction}`,
    incrementApplicationsUrl: `http://${ipAddress}:3000/api/${incrementApplicationsTransaction}`,
    updateProfileUrl: `http://${ipAddress}:3000/api/${updateProfileTransaction}`,
    createAlertUrl: `http://${ipAddress}:3000/api/${createAlertTransaction}`,
    updateAlertUrl: `http://${ipAddress}:3000/api/${updateAlertTransaction}`,
    removeAlertUrl: `http://${ipAddress}:3000/api/${removeAlertTransaction}`,
    testAlertUrl: `http://${ipAddress}:3000/api/${testAlertTransaction}`,
    getAlertsUrl: `http://${ipAddress}:3000/api/${getAlertsTransaction}`,
    getJobByRefUrl: `http://${ipAddress}:3000/api/${getJobByRefTransaction}`,
    applyForJobUrl: `http://${ipAddress}:3000/api/${applyForJobTransaction}`,
    getApplicationsForUserUrl: `http://${ipAddress}:3000/api/${getApplicationsForUserTransaction}`,
    getApplicationsForJobRefUrl: `http://${ipAddress}:3000/api/${getApplicationsForJobRefTransaction}`,
    getJobSeekerAccountUrl: `http://${ipAddress}:3000/api/${getJobSeekerAccountTransaction}`,
    cvSearchUrl: `http://${ipAddress}:3000/api/${cvSearchTransaction}`,

    
    beginningOfTime: "1970-01-01T15:11:47.728Z",
    endOfTime: "3070-01-01T15:11:47.728Z",
    blockchainFilter: 'blockchaintotals',
    companyFilter: 'companytotals',
    dateFilter: 'datetotals',
    employerTypeFilter: 'employertotals',
    jobTypeFilter: 'jobtypetotals',
    onSiteFilter: 'onsitetotals',
    locationFilter: 'locationtotals',
    whatFilter: 'whatfilter'
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
    PROFILEPAGE: 8,
    ACCOUNTPAGE: 9,
    ALERTPAGE: 10,
    APPLICATIONPAGE: 11,
    SEARCHRESULTSPAGE: 12,
    RECRUITERAPPLICATIONPAGE: 13,
    BUYSEARCHESPAGE: 14,
    CVSEARCHPAGE: 15,
    JOBADPRICE: 99,
    CVSEARCHPRICE: 25,
    JOBDISCOUNT: 10,
    CVDISCOUNT: 5,
    TOKENEXCHANGERATE: 100,
    REWARDPERCENTAGE: .2, // percentage of tokens to award to jobseekers in search results
    JOBMINPRICE: 49,
    CVMINPRICE: 20,
    MAXJOBS: 10,
    STANDARDPRICE: 99,
    PREMIUMPRICE: 199
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

export const renderLoaderByREMFromTop = (parent, dist) => {
    const loader = `
        <div style="top:${dist}rem "class="${strings.loader}"></div>
    `;
    parent.insertAdjacentHTML('beforeend', loader); // beforeend means insert before the end of the parent element
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

export const navBarSetLoggedIn = (loggedIn, name) => {

//     <li class="signin" style="display: none;"><a href="register.html" class="link-icon"><i class="icon far fa-user"></i>Sign
//     In</a>
//      </li>
//      <li id="recruiterlogout" class="signin"><a href="#" class="link-icon">Log Out</a>
//      </li>

    var signins = elements.signins;

    let user = sessionStorage.getItem("user");
    let type = parseInt(user);

    let dropdown = document.getElementById("accountmenu");
    for (var i = 0; i < signins.length; i++) {
        console.log("*** loggedIn = " + loggedIn);
        if (loggedIn) {
            if (type === elementConsts.JOBSEEKER) {
               
                let markup = `${name}'s account
                    <i class="left-icon icon far fa-user"></i>
                    <i class="right-icon fa fa-caret-down"></i>`
                signins[i].style.display = "none";
                let button = document.getElementById("accountmenubtn");
                button.innerHTML = markup;
                dropdown.style.display = "block";
            } else {
                let ele = document.getElementById("recruiterlogout");
                let ele2 = document.getElementById("allsignin");
                if (ele != null) {
                    ele.style.display = "block";
                }
                if (ele2 != null) {
                    ele2.style.display = "none";
                }
            }
        } else {
            signins[i].style.display = "block";
            if (dropdown != null) {
                dropdown.style.display = "none";
            }
            let ele = document.getElementById("recruiterlogout");
            if (ele != null) {
                ele.style.display = "none";
            }
        }
    }

}

export const setLoggedIn = (state, loggedIn, name) => {
    state.loggedIn = loggedIn;
    sessionStorage.setItem('loggedIn', loggedIn === true ? "true" : "false");
    if (loggedIn === true) {
        sessionStorage.setItem('myemail', state.login.getEmail());
    }
    navBarSetLoggedIn(loggedIn, name);
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
    if (sel.options[sel.selectedIndex] === undefined) {
        return undefined;
    }
    if (sel.options[sel.selectedIndex].disabled === false) {
        return sel.value;
    }
    return undefined;
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

export function getDaysAgo(date) {
    const d = new Date(date);
    const now = new Date();

    let timeDiff = now.getTime() - d.getTime();
    let dayDifference = Math.round(timeDiff / (1000 * 3600 * 24));
    if (dayDifference == 0) {
        return "today";
    }
    else if (dayDifference == 1) {
        return ("yesterday");
    }
    return (dayDifference + " days ago");
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


export function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        a.style.zIndex = "2";
        for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.style.zIndex = "2";
                b.addEventListener("click", function (e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    inp.style.zIndex = "2";
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        x.style.zIndex = "2";
        if (x) {
            x = x.getElementsByTagName("div");
        }
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }

    });
    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
        var toDisplay = Math.round(400 / 70)
        console.log("x scroll = " + x[currentFocus].parentNode.scrollTop);
        console.log("x height = " + x[currentFocus].offsetHeight);
        console.log("currentFocus = " + currentFocus);

        if (currentFocus <= toDisplay) {
            x[currentFocus].parentNode.scrollTop = 0;
        } else {
            x[currentFocus].parentNode.scrollTop = currentFocus * x[currentFocus].offsetHeight;
            // x[currentFocus].scrollTop = 100;
        }
    }
    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

export const addToFavouritesHandler = async (button, jobRef) => {
    // let ele = document.getElementById(jobRef);
    // renderLoaderEndByNumber(ele, 50);

    var data = {
        $class: strings.addToFavouritesTransaction,
        email: sessionStorage.getItem('myemail'),
        jobReference: jobRef
    };
    let tp = new TransactionProcessor(data, strings.addToFavouritesUrl);

    var resp = tp.transaction(); //note no await...let it run in background

    var err = null;
    if (resp.error !== undefined) {
        err = resp.error;
    }
    // clearLoader();

    if (err != null) {
        displayErrorPopup('Failed to add Job to favourites: ' + err.message);
    } else {
        // remove the "save" button and replace with the "saved" label
        button.style.display = "none";
        let label = document.getElementById("p-" + jobRef);
        label.style.display = "block";

        // await displaySuccessPopup('Job Added To Favourites!');
        let favs = sessionStorage.getItem("favourites");
        if (favs === null) {
            favs = new Array();
        } else {
            favs = JSON.parse(favs);
        }
        let job = getJobPostingByRef(jobRef);

        if (job.length === 0) {
            // error ... we got a problem here
            return;
        }


        favs.push(job[0]);
        sessionStorage.setItem("favourites", JSON.stringify(favs));
        if (favs.length > 0) {
            console.log("favs length = " + favs.length);
            updateFavouritesTotal(favs.length);
        }

        // --- DEBUG
        favs = sessionStorage.getItem("favourites");
        if (favs != null) {
            favs = JSON.parse(favs);
        }

        for (let j = 0; j < favs.length; j++) {
            console.log("CACHED FAV -> " + favs[j].jobReference);
        }

    }

}


export const getDate = (val, defaultDate, time) => {
    if (val === "") {
        return defaultDate;
    } else {
        let dd = val.substr(8, 2);
        let mm = val.substr(5, 2);
        let yyyy = val.substr(0, 4);
        let date = `${yyyy}-${mm}-${dd}T${time}Z`;
        return date;
    }

}
export const updateFavouritesTotal = (num) => {
    let offset = "single";

    if (num > 9) {
        offset = "double"
    }
    let markup = `
        <li class="saved">
            <span class="fa-stack fa-lg">
                <i class="mystar fa fa-star fa-stack-2x"></i>
                <span class="fa-stack fa-3x">
                    <div class="circle-stack">
                        <i class="fa fa-circle"></i>
                        <p class="fav"><span class="number-in-circle ${offset}">${num}</span></p>
                    </div>
                </span>
            </span>
            <span class="textspan">
                <a href="#" class="link-icon">Saved Jobs</a>
            </span>
        </li>`;
    if (num === 0) {
        markup = `
        <li id="saved">
            <a href="favourites.html" class="link-icon"><i class="starwithnocircle fa fa-star"></i>Saved Jobs</a>
        </li>
        `
    }
    let favNavBar = document.getElementById("saved");
    favNavBar.innerHTML = markup;
}

export const addFavouritesLinkListener = () => {
    let favNavBar = document.getElementById("saved");
    favNavBar.addEventListener("click", (e) => {
        e.preventDefault();
        window.location = "favourites.html";
    });
}

export const setGlobalCached = (data) => {
    state.cachedData = data;
    console.log("GLOBAL CACHED LENGTH = " + state.cachedData.length);
}

export const setButtonHandlers = () => {
    let buttons = document.getElementsByClassName("saveBtn");
    for (let btn of buttons) {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            let jobRef = e.currentTarget.dataset.id;

            addToFavouritesHandler(e.currentTarget, jobRef);
        });
    }
}

function getJobPostingByRef(ref) {
    console.log("BARF! cachedData = " + state.cachedData);
    if (state.jobs === null || state.jobs === undefined) {
        state.jobs = state.cachedData;
    }
    return state.jobs.filter(job => job.jobReference === ref);
}

export const displaySuccessPopup = async (theText) => {
    await Swal({
        title: 'Success!',
        text: theText,
        type: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#cc6d14',
    });
}

export const displayErrorPopup = async (theText) => {
    await Swal({
        title: 'Blockchain Error!',
        text: theText,
        type: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#cc6d14',
    });
};

export const getValueOfRadio = (name) => {
    return document.querySelector(`input[name=${name}]:checked`).value;
}

export const getSkills = (skills) => {
    if (skills === "") {
        return [];
    }
    let skillsArr = skills.match(/"[^"]*"|\S+/g);

    // remove double quotes around any multi word strings
    for (var i = 0; i < skillsArr.length; i++) {
        if (skillsArr[i].charAt(0) === '"' && skillsArr[i].charAt(skillsArr[i].length - 1) === '"') {
            skillsArr[i] = skillsArr[i].substr(1, skillsArr[i].length - 2);
        } 
    }
    return skillsArr;
}

export const jobTitles = ["Application Support Analyst",
    "Automation Tester",
    "Architect",
    "Application Support Engineer",
    "Account Manager",
    "AWS Engineer",
    "Administrator",
    "Application Engineer",
    "Blockchain Developer",
    "Blockchain Analyst",
    "Blockchain Engineer",
    "Blockchain Architect",
    "Blockchain Administrator",
    "Blockchain Analyst",
    "Blockchain Consultant",
    "Blockchain Manager",
    "Blcockchain Tester",
    "Business Analayst",
    "Business Data Analyst",
    "Business Domain Architect",
    "Business Systems Analyst",
    "Computer Architect",
    "Consultant",
    "Corda Developer",
    "Corda Blockchain Administrator",
    "Corda Blockchain Architect",
    "Corda Blockchain Consultant",
    "Corda Blockchain Developer",
    "Corda Blockchain Manager",
    "DevOps Engineer",
    "Developer Golang",
    "Developer Node.js",
    "Developer C++",
    "Developer RUST",
    "Developer Java",
    "Developer Solidity",
    "Developer JavaScript",
    "Developer .Net",
    "Data Analyst",
    "Data Engineer",
    "Developer",
    "Engineer",
    "Enterprise Architect",
    "Ethereum Developer",
    "Ethereum Blockchain Administrator",
    "Ethereum Blockchain Architect",
    "Ethereum Blockchain Consultant",
    "Ethereum Blockchain Developer",
    "Ethereum Blockchain Manager",
    "Field Support Engineer",
    "Front End Developer",
    "Full Stack Developer",
    "Full Stack .Net Developer",
    "Full Stack Web Developer",
    "Full Stack PHP Developer",
    "Full Stack Blockchain Developer",
    "Full Stack Java Developer",
    "Functional Consultant",
    "Gradute",
    "Graduete Developer",
    "Graduate Junior Developer",
    "Graduate Recruitment Consultant",
    "Graduate Analyst",
    "Graduate Blockchain Developer",
    "Graduate Engineer",
    "Graduate Software Constultant",
    "Graduate Software Developer",
    "Graduate Consultant",
    "Graduate Business Analyst",
    "Graduate IT",
    "Graduate IT Supoport",
    "Head of Blockchain Development",
    "Head",
    "Head of Engineering",
    "Head of Technology",
    "Hardware Engineer",
    "Head of Architecture",
    "Help Desk Engineer",
    "Head of Services",
    "Hyperledger Specialist",
    "Hyperledger Fabric Developer",
    "Hyperledger Fabric Administrator",
    "Hyperledger Fabric Analyst",
    "Hyperledger Fabric Tester",
    "Hyperledger Sawtooth Specialist",
    "Hyperledger Sawtooth Developer",
    "Hyperledger Sawtooth Administrator",
    "Hyperledger Sawtooth Analyst",
    "Hyperledger Sawtooth Tester",
    "Hyperledger Project Manager",
    "Hyperledger Tester",
    "IBM Blockchain Administrator",
    "IBM Blockchain Architect",
    "IBM Blockchain Developer",
    "IBM Blockchain Manager",
    "Infrastructure Engineer",
    "IT Support Engineer",
    "IT Manager",
    "IT Project Manager",
    "Information Security Analyst",
    "Informatica Architect",
    "IoS Developer",
    "IT Business Analyst",
    "Infrastructure Architect",
    "Infrasturcture Manager",
    "Integration Developer",
    "IT Field Engineer",
    "Java Developer",
    "JavaScript Developer",
    "Junior PHP Developer",
    "Junior Developer",
    "Junior Developer C#",
    "Junior Java Developer",
    "Junior .Net Developer",
    "Junior JavaScript Developer",
    "Junior Front End Developer",
    "Junior Web Developer",
    "Junior Business Analyst",
    "Key Account Manager",
    "Key Account Executive",
    "Knowledge Manager",
    "Lead Engineer",
    "Lead Developer",
    "Lead",
    "Lead Software Engineer",
    "Lead Java Developer",
    "Linux Systems Administrator",
    "Lead Software Developer",
    "Linux Engingeer",
    "Lead Business Analyst",
    "Lead Consultant",
    "Lead DevOps Engineer",
    "Lead .Net Developer",
    "Lead UX Designer",
    "Lead Manager",
    "Manager Contract",
    "Manager",
    "Mobile Developer",
    "Marketing Executive",
    "Mobile App Developer",
    "Management Information Analyst",
    "Manager Blockchain",
    "Neo Developer",
    "Neo Blockchain Administrator",
    "Neo Blockchain Architect",
    "Neo Blockchain Consultant",
    "Neo Blockchain Developer",
    "Neo Blockchain Manager",
    "Network Engineer",
    "Network Architect",
    "Node.JS Developer",
    "Network Manager",
    "Network Consultant",
    "Network Security Consultant",
    "Node.JS Software Engineer",
    "Network Security Analyst",
    "New Business Executive",
    "On-Site Engineer",
    "Operations Manager",
    "Oracle Developer",
    "Oracle Blockchain Administrator",
    "Oracle Blockchain Architect",
    "Oracle Blockchain Consultant",
    "Oracle Blockchain Developer",
    "Oracle Blockchain Manager",
    "Office Manager",
    "Operations Analyst",
    "PHP Developer",
    "Project Manager",
    "Python Developer",
    "Product Manager",
    "Programme Manager",
    "Platform Engineer",
    "Project Manager Business",
    "Project Manager Software",
    "Partner",
    "Pre-Sales Consultant",
    "Product Analyst",
    "QA Engineer",
    "QA Manager",
    "QA Analyst",
    "QA Automation Tester",
    "QA Automation Engineer",
    "QA Test Analyst",
    "QA Tester",
    "QA Test Engineer",
    "QA Developer",
    "QA Lead",
    "Quality Inspector",
    "QA Assistant",
    "Quorum Developer",
    "Quorum Blockchain Administrator",
    "Quorum Blockchain Architect",
    "Quorum Blockchain Consultant",
    "Quorum Blockchain Developer",
    "Quorum Blockchain Manager",
    "React Developer",
    "Remote Developer",
    "Researcher",
    "Release Engineer",
    "Release Manager",
    "Release Analyst",
    "Resource Manager",
    "Resourcer",
    "Ripple Developer",
    "Ripple Blockchain Administrator",
    "Ripple Blockchain Architect",
    "Ripple Blockchain Consultant",
    "Ripple Blockchain Developer",
    "Ripple Blockchain Manager",
    "Software Developer",
    "Senior Blockchain Developer",
    "Senior Java Developer",
    "Senior Go Developer",
    "Senior Software Engineer",
    "Solution Architect",
    "Security Architect",
    "Service Desk Analyst",
    "Scrum Master",
    "Solidity Developer",
    "Software Engineer Blockchain",
    "Softwaer Engineer C++",
    "SQL Developer",
    "Systems Administrator",
    "Systems Architect",
    "Systems Engineer",
    "Team Lead",
    "Technical Architect",
    "Technical Project Manager",
    "Technical Specialist",
    "Technical Support Analyst",
    "Test Analyst",
    "Technical Consultant",
    "Technical Lead",
    "Test Manager",
    "Test Engineer",
    "Test Automation Engineer",
    "UX Designer",
    "UX Researcher",
    "User Researcher",
    "UI/UX Designer",
    "UX Developer",
    "UX Manager",
    "UX Architect",
    "VBA Developer",
    "Validation Engineer",
    "Visual Designer",
    "Validation Tester",
    "Web Analyst",
    "Web Developer",
    "Web Developer Blockchain",
    "Web Developer PHP",
    "Web Designer",
    "Web Operator",
    "Web Engineer",
    "Web Tester",
    "XML Developer"];

export const countriesArray = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua & Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Chad", "Chile", "China", "Colombia", "Costa Rica", "Cote D Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Greenland", "Grenada", "Guatemala", "Guinea", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Macau", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Mauritania", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montserrat", "Morocco", "Mozambique", "Namibia", "Nepal", "Netherlands", "Netherlands Antilles", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico", "Qatar", "Romania", "Rwanda", "Samoa", "San Marino", "Saudi Arabia", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Somalia", "South Africa", "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Tunisia", "Turkey", "Turkmenistan", "Turks & Caicos", "Tuvalu", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uzbekistan", "Vatican City", "Venezuela", "Yemen", "Zambia", "Zimbabwe"];