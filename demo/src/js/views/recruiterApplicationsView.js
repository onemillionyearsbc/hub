import { elements } from './base';

export const displayRecruiterApplications = (applications) => {
   
    let id = sessionStorage.getItem("jobReference");
    let title = sessionStorage.getItem("jobTitle");
    elements.ref.innerHTML="Applications for " + title + " (Job Ref. " + id + ")";

    console.log("Number of applications = " + applications.length);

    for (let i = 0; i < applications.length; i++) {
        renderJobApplication(applications[i]);
    }
}

function renderJobApplication(application) {
    let current_datetime = new Date(application.dateApplied);

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
    let formatted_date = current_datetime.getFullYear() + "-" + month + "-" + days + " " + hours + ":" + minutes;
    console.log("EMAIL = " + application.email);
    let markup = `
            <li>
                <div class="item-job">
                    <div class="mainbody recapplications">
                        <div id="jobtitle" class="titley">
                            <p>${application.name}</p>
                            <button class="downloadcvbutton btn" data-email=${application.email}>Download CV</button>
                        </div>
                        <div class="top">
                            <div class="left">
                                <div class="left__item">
                                    <div class="loggy">
                                        <i class="loggy__icon fas fa-map-marker-alt fa-fw"></i>
                                        <p id="joblocation" class="loggy__label">${application.location}</p>
                                    </div>
                                </div>
                                <div class="left__item">
                                    <div class="loggy">
                                        <i class="loggy__icon fas fa-table fa-fw"></i>
                                        <p id="jobcompany" class="loggy__label applieddate">Applied ${formatted_date}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
    
    `
    elements.searchResList.insertAdjacentHTML("beforeend", markup);
}