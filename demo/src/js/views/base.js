
export const elements = {
    signins: document.getElementsByClassName('signin'),
    registerForms: document.getElementsByClassName('submitRegister'),
    loginForms: document.getElementsByClassName('submitLogin'),
    registerRecruiterButton: document.getElementById('submitRegisterRecruiter'),
    loginRecruiterButton: document.getElementById('submitLoginRecruiter'),
    inputFields: document.getElementsByClassName('loginform__textfield'),
    tabs: document.getElementsByClassName('tabInput'),
    tabbedPane1: document.getElementById('tab-content1'),
    tabbedPane2: document.getElementById('tab-content2'),
    loginError: document.getElementById('login-error'),
    serverError: document.getElementById('server-error')
};

// UK Sky Hub
var ipAddress = '90.200.134.28';

// Romania Hub
// var ipAddress = '84.117.182.193';
var recruiterLoginTransaction = 'io.onemillionyearsbc.hubtutorial.GetHubRecruiter';
var recruiterRegisterTransaction = 'io.onemillionyearsbc.hubtutorial.CreateRecruiterAccount';
var setLoggedInTransaction = "io.onemillionyearsbc.hubtutorial.SetLoggedIn";

export const strings = {
    loader: 'loader',
    fetchFail: 'Failed to fetch',
    alreadyExists: 'object already exists',
    recruiterLoginTransaction: `${recruiterLoginTransaction}`,
    recruiterRegisterTransaction: `${recruiterRegisterTransaction}`,
    setLoggedInTransaction: `${setLoggedInTransaction}`,

    loginUrl: `http://${ipAddress}:3000/api/${recruiterLoginTransaction}`,
    registerRecruiterUrl: `http://${ipAddress}:3000/api/${recruiterRegisterTransaction}`,
    setLoggedInUrl: `http://${ipAddress}:3000/api/${setLoggedInTransaction}`
};

export const elementConsts = {
    JOBSEEKER: 1,
    RECRUITER: 2
}

export const inputType = {
    LOGIN: 1,
    REGISTER: 2
}

export const renderLoader = parent => {
    const loader = `
        <div class="${strings.loader}"></div>
    `;
    parent.insertAdjacentHTML('afterbegin', loader); // afterbegin means insert after the beginning of the parent element
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

