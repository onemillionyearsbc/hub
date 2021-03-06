import { elements, getJobTypeFor, getJobTimeFor, } from './base';

const renderJobItem = (jobItem, count , appliedFor, isRecruiter) => {
    let cityloc = "";

    if (jobItem.remote === true) {
        cityloc = "REMOTE";
    } else {
        if (jobItem.city != undefined && jobItem.city != "") {
            cityloc = jobItem.city + ", ";
        }
        if (jobItem.location != undefined && jobItem.location != "") {
            cityloc += jobItem.location;
        }
    }

    let exp = getJobTimeFor(jobItem.expiryDate, jobItem.datePosted);
    let applybtnmarkup = "";

    // do not display apply buttons for recruiters
    if (!isRecruiter) {
        applybtnmarkup = `<button data-id="${jobItem.jobReference}" id="applyBtn" class="abtn applybtn btn btn--orange">Apply</button>`;
        if (exp === "EXPIRED") {
            applybtnmarkup = `<p class="expiredlabel">EXPIRED</p>`;
        } 
        if (appliedFor) {
            applybtnmarkup = `<button data-id="apply-${jobItem.jobReference}" id="applyBtn" disabled class="abtn btn btn--orange">Applied</button>`;
        } 
    }
   
    const markup = `
        <li>
            <div id="${jobItem.jobReference}" class="item-job">
                <div class="mainbody">
                    <div id="jobtitle" class="title">
                        <p class="savedtitle" data-index=${count}>${jobItem.jobTitle}</p>
                    </div>
                    <div id="loadpanel-${jobItem.jobReference}" class="top" >
                        <div class="left">
                            <div class="left__item">
                                <div class="loggy">
                                    <i class="loggy__icon fas fa-map-marker-alt fa-fw"></i>
                                    <p id="joblocation" class="loggy__label">${cityloc}</p>
                                </div>
                            </div>
                            <div class="left__item">
                                <div class="loggy">
                                    <i class="loggy__icon fas fa-pound-sign fa-fw"></i>
                                    <p id="jobsalary" class="loggy__label">${jobItem.salary}
                                    </p>
                                </div>
                            </div>
                            <div class="left__item">
                                <div class="loggy">
                                    <i class="loggy__icon fas fa-table fa-fw"></i>
                                    <p id="jobcompany" class="loggy__label companylabel">${jobItem.company}</p>
                                </div>
                            </div>
                            <div class="left__item">
                                <div class="loggy">
                                    <i class="loggy__icon fas fa-user-alt fa-fw"></i>
                                    <p id="jobtype" class="loggy__label">${getJobTypeFor(jobItem.jobType)}</a>
                                </div>
                            </div>
                            <div class="left__item">
                                <div class="loggy">
                                    <i class="loggy__icon far fa-clock fa-fw"></i>
                                    <p id="jobtime" class="loggy__label">${exp}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bpanel" id="panel-${jobItem.jobReference}">
                    <div>
                        ${applybtnmarkup}
                    </div>
                    <div>
                        <button data-id=${jobItem.jobReference} class="abtn removeybutton xxxxx btn btn--orange">Remove</button>
                    </div>
                </div>
            </div>

        </li>
        `;
        elements.searchResList.insertAdjacentHTML("beforeend", markup);

}

function clearResults() {
    elements.searchResList.innerHTML="";
}

export const renderFavouriteResults = (jobs, appliedForJobs, isRecruiter) => {
    if (appliedForJobs === undefined) {
        appliedForJobs = [];
    }
    let s = "";
    if (jobs.length != 1) {
        s = "s";
    }

    clearResults();
    elements.numBanner.innerHTML = `You have ${jobs.length} saved job${s}`
    for (var i = 0; i < jobs.length; i++) {
        let appliedFor = appliedForJobs.includes(jobs[i].jobReference);
        renderJobItem(jobs[i], i, appliedFor, isRecruiter);
    }

    let jobtitles = document.getElementsByClassName("savedtitle");

    for (let p of jobtitles) {
        p.addEventListener("click", (e) => {
            let data = jobs[p.dataset.index];
            var propValue;
            for (var propName in data) {
                propValue = data[propName];
                sessionStorage.setItem(propName, propValue);
                if (data.applications === undefined) {
                    console.log("setting applicaton to 0");
                    sessionStorage.setItem("applications", 0);
                } else {
                    console.log(">>>>>>>>>>>>>>>>>> QUACKETY setting applicatons to " + data.applications.length); 
                    sessionStorage.setItem("applications", data.applications.length);
                }
            }
            window.location = "displayjob.html";
        });
    }

}