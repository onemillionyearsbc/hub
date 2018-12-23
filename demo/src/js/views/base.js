
export const elements = {
    signins: document.getElementsByClassName('signin'),
    registerForms: document.getElementsByClassName('submitRegister'),
    loginForms: document.getElementsByClassName('submitLogin'),
    inputFields: document.getElementsByClassName('loginform__textfield'),
    tabs: document.getElementsByClassName('tabInput'),
    tabbedPane1: document.getElementById('tab-content1'),
    tabbedPane2: document.getElementById('tab-content2'),
};

export const strings = {
    loader: 'loader',
    fetchFail: 'Failed to fetch',
    loginUrl: 'http://84.117.182.193:3000/api/io.onemillionyearsbc.hubtutorial.GetHubRecruiter',
    registerRecruiterUrl: 'http://84.117.182.193:3000/api/io.onemillionyearsbc.hubtutorial.CreateRecruiterAccount'
};

export const elementConsts = {
    JOBSEEKER: 1,
    RECRUITER: 2
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

    console.log("form top = " + onTop);
    // don't fire the submit form data stuff unless the screen is on top
    // otherwise it fires when we bring the screen to the front as well
    if (onTop == "false") {
        return null;
    }
    return form;
}

