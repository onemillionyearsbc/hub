import { elements, getJobTypeFor } from './base';

export const displayApplications = (cachedData, applications) => {

    let markup = `
    <div id="mainpanel" class="main">
        <p class="main__title1">
            My Blockchain Hub++ Applications
        </p>
        <p class="main__title2">
            Here are the jobs you have applied for within the last three months:
        </p>
        <div class="items animated slideInUp delay-2s">
            <div class="items__title">
            
            </div>
            <ul style="list-style: none;" class="results_list">
                
            </ul>
        </div>
    </div>
  
    `;
    let ele = document.getElementById("jobapplications");
    ele.insertAdjacentHTML("beforeend", markup);

    for (let i = 0; i < applications.length; i++) {
        // get the jobposting data from cache
        let jobPostings = cachedData.filter(e => e.jobReference === applications[i].jobReference);

        // render this job 

        // display if applied date is within last 3 months
        let jobApplication = applications[i];
        let now = new Date();
        let current_datetime = new Date(jobApplication.dateApplied);
        let mdiff = monthDiff(current_datetime, now);
        if (mdiff < 3) {
            renderJobApplication(jobPostings[0], jobApplication);
        }
    }
    let jobtitles = document.getElementsByClassName("ptitle");
    for (let p of jobtitles) {
        p.addEventListener("click", (e) => {

            // job ref of clicked job
            let jobReference = p.dataset.ref;

            // get that job posting
            let data = cachedData.filter(e => e.jobReference === jobReference)[0];


            // set properties for the job display page
            var propValue;
            for (var propName in data) {
                propValue = data[propName];
                sessionStorage.setItem(propName, propValue);
            }
            window.location = "displayjob.html";
        });
    }
}

function monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
}

function renderJobApplication(job, jobApp) {
    let cityloc = "";
    if (job.remote === true) {
        cityloc = "REMOTE";
    } else {
        if (job.city != undefined && job.city != "") {
            cityloc = job.city + ", ";
        }
        if (job.location != undefined && job.location != "") {
            cityloc += job.location;
        }
    }
    let current_datetime = new Date(jobApp.dateApplied);

    let month = current_datetime.getMonth() + 1;
    if (month < 10) {
        month = "0" + month;
    }
    let days = current_datetime.getDate();
    if (days < 10) {
        days = "0" + days;
    }
    let hours = current_datetime.getHours();
    if (hours < 10) {
        hours = "0" + hours;
    }
    let minutes = current_datetime.getMinutes();
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    let formatted_date = "Applied: " + current_datetime.getFullYear() + "-" + month + "-" + days + " " + hours + ":" + minutes;
    let markup = ` <li>
        <div class="item-job">
            <div class="mainbody">
                <div id="jobtitle"  class="title">
                    <p class="ptitle" data-ref=${job.jobReference} >${job.jobTitle}</p>
                </div>
                <div class="top">
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
                                <p id="jobsalary" class="loggy__label">${job.salary}
                                </p>
                            </div>
                        </div>
                        <div class="left__item">
                            <div class="loggy">
                                <i class="loggy__icon fas fa-table fa-fw"></i>
                                <p id="jobcompany" class="loggy__label applieddate">${formatted_date}</p>
                            </div>
                        </div>
                        <div class="left__item">
                            <div class="loggy">
                                <i class="loggy__icon fas fa-user-alt fa-fw"></i>
                                <p id="jobtype" class="loggy__label">${getJobTypeFor(job.jobType)}</a>
                            </div>
                        </div>
                        <div class="left__item">
                            <div class="loggy">
                                <i class="loggy__icon far fa-clock fa-fw"></i>
                                <p id="jobtime" class="loggy__label">Posted 2 days ago</p>
                            </div>
                        </div>
                    </div>
                
                </div>
            </div>
        </div>
    </li>`

    let ele = document.querySelector(".results_list");
    ele.insertAdjacentHTML("beforeend", markup);
}