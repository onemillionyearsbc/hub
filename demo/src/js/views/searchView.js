import { elements, clearLoader, getJobTypeFor, getJobTimeFor, getDaySincePosted } from './base';
import FilterProcessor from '../models/FilterProcessor';

let state = {};

const renderJobItem = (jobItem, count) => {

    let loc = "See all blockchain jobs in " + jobItem.location;
    if (jobItem.remote === true) {
        loc = "See all remote blockchain jobs";
        jobItem.location = "REMOTE";
    }
    // display the corner "NEW" element if posted in last 5 days
    let newbox = "none";
    if (getDaySincePosted(jobItem.datePosted) < 5) {
        newbox = "block";
    }
    let blockName;
    if (blockName != "OTHER") {
        blockName = jobItem.blockchainName.charAt(0).toUpperCase() + jobItem.blockchainName.slice(1).toLowerCase();
    } else {
        blockName = "blockchain";
    }

    const markup = `
        <li>
            <div class="item-job">
                <div id="jobtitle" class="title">
                    <p>${jobItem.jobTitle}</p>
                    <div style="display: ${newbox};" id="newbox" class="corner"><span>New</span></div>
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

                <div style='font-size: 1.5rem' id="jobdescription" class="texty description">
                    ${jobItem.description}
                </div>
                <div class="linksave">
                    <p>${loc}</p>
                    <p>See All ${blockName} jobs</p>
                    <button class="saveBtn"><i class="far fa-star"></i>Save</button>
                </div>
            </div>
        </li>`;
    elements.searchResList.insertAdjacentHTML("beforeend", markup);
    var imgElement = document.getElementById("joblogo-" + count);
    imgElement.setAttribute("src", jobItem.logo)
    truncate({
        className: "description",
        char: 250,
    });
}

const clearResults = () => {
    elements.searchResList.innerHTML = '';
};


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


const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);

    const nextb = document.getElementById("next");
    const prevb = document.getElementById("previous");
    const pageno = document.getElementById("pageno");
    if (page == 1 && pages > 1) {
        // Only Button to go to next page
        nextb.style.display = "block";
        prevb.style.display = "none";
        pageno.style.display = "none";
    } else if (page < pages) {
        // Both buttons
        nextb.style.display = "block";
        prevb.style.display = "block";
        pageno.style.display = "block";
    }
    else if (page === pages && pages > 1) {
        // Only Button to go to prev page
        nextb.style.display = "none";
        prevb.style.display = "block";
        pageno.style.display = "none";
    }
    pageno.innerHTML = `Page ${page}`;
}

export const renderResults = (jobs, page = 1, resPerPage = 10) => {

    state.jobs = jobs;
    state.page = page;
    console.log("QUACKINGTON rows length = " + jobs.length);
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    // jobs.slice(start, end).forEach(renderJobItem, i);
    const pageOfJobs = jobs.slice(start, end);

    for (var i = 0; i < pageOfJobs.length; i++) {
        renderJobItem(pageOfJobs[i], i);
    }

    // TODO change title based on what filter(s) being used
    elements.jobTotal.innerHTML = `${jobs.length} blockchain jobs`;

    const alertb = document.getElementById("alertbtn");
    const nojobs = document.getElementById("nojobs");
    const pagebtns = document.getElementById("pagebuttons");


    if (jobs.length > 0) {
        alertb.style.display = "block";
    } else {
        nojobs.style.display = "block";
    }
    if (jobs.length > resPerPage) {
        pagebtns.style.display = "flex";
        renderButtons(page, jobs.length, resPerPage);
    }

    getCounts(jobs);
}

function renderBlockchainTotal(name, total) {
    let bcName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    let markup = `<li>${bcName}<span class="numjobs">(${total})</span></li>`;
    elements.blockchainTotals.insertAdjacentHTML("beforeend", markup);
}

function getCounts(jobs) {
    console.log("QUACK -----> BEGIN");
    let fp = new FilterProcessor(jobs);
    let bcTotals = fp.getBlockchainTotals();
    var propValue;
    for (var propName in bcTotals) {
        propValue = bcTotals[propName]
        renderBlockchainTotal(propName, propValue);
    }
}

export const handleNext = () => {
    clearResults();
    renderResults(state.jobs, state.page + 1);
}
export const handlePrev = () => {
    clearResults();
    renderResults(state.jobs, state.page - 1);
}
