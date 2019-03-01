import { elements, strings, getJobTypeFor, getJobTimeFor } from './base';

const renderJobItem = (jobItem, count) => {
    
    console.log("MOO remote = "+ jobItem.remote);
    if (jobItem.remote === true) {
        jobItem.location = "REMOTE";
    }
    const markup =`
        <li>
            <div class="item-job">
                <div id="jobtitle" class="title">
                    <p>${jobItem.jobTitle}</p>
                    <div id="newbox" class="corner"><span>New</span></div>
                </div>
                <div class="top">
                    <div class="left">
                        <div class="left__item">
                            <div class="loggy">
                                <i class="loggy__icon fas fa-map-marker-alt fa-fw"></i>
                                <p id="joblocation" class="loggy__label">${jobItem.location}</p>
                            </div>
                        </div>
                        <div class="left__item">
                            <div class="loggy">
                                <i class="loggy__icon fas fa-pound-sign fa-fw"></i>
                                <p id="jobsalary" class="loggy__label">${jobItem.salary}</p>
                            </div>
                        </div>
                        <div class="left__item">
                            <div class="loggy">
                                <i class="loggy__icon fas fa-table fa-fw"></i>
                                <a id="jobcompany" class="loggy__label"
                                    href="search.html">${jobItem.company}</a>
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
                                <p id="jobtime" class="loggy__label">${getJobTimeFor(jobItem.expiryDate, jobItem.datePosted)}</p>
                            </div>
                        </div>
                    </div>
                    <div class="right">
                        <img id="joblogo-${count}" src="${jobItem.logo}">
                    </div>

                </div>

                <div id="jobdescription" class="texty description">
                    ${jobItem.description}
                </div>

            </div>
        </li>`;
        elements.searchResList.insertAdjacentHTML("beforeend", markup);
        var imgElement = document.getElementById("joblogo-" + count);
        imgElement.setAttribute("src", jobItem.logo)
        truncate({
            className: "description",
            char: 400,
            // truncateBy : "<span style='color:red'> read more</span>",
            // numOfTruncateBy : 1
    
        });
}

function truncate(obj) {
    let trunc = {};
    trunc.className = obj.className;
    trunc.char = obj.char || 150;
    trunc.numOfTruncateBy = obj.numOfTruncateBy || 3;
    trunc.truncateBy = obj.truncateBy || ".";
    let paragraphTag = document.getElementsByClassName(trunc.className);
    for (let i = 0; i < paragraphTag.length; i++) {
        var paragraph = paragraphTag[i].innerHTML;
        if (paragraph.length > trunc.char) {
            var truncate = '';
            if (typeof (paragraph) === 'string') {
                for (let j = 0; j < trunc.char; j++) {
                    truncate = truncate + paragraph.charAt(j);
                }
                for (let k = 0; k < trunc.numOfTruncateBy; k++) {
                    truncate = truncate + trunc.truncateBy;
                }
            }
            paragraphTag[i].innerHTML = truncate;
        }
    }
}

export const renderResults = jobs => {
    jobs.forEach(renderJobItem, i);
}