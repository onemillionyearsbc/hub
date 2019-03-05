import { elements, strings, getJobTypeFor, getJobTimeFor, getDaySincePosted } from './base';
import FilterProcessor from '../models/FilterProcessor';

let state = {};
state.filters = [];
state.filteredjobs = [];

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
                    <p class="ptitle" data-index=${count}>${jobItem.jobTitle}</p>
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
                                <a id="jobcompany" class="loggy__label companylabel"
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

// may not need this
export const setTotalJobsBucket = (jobs) => {
    state.jobs = jobs;
}

export const renderResults = (jobs, page = 1, resPerPage = 10) => {

    console.log(">>>>>>>>>> QUACK 22 rendering " + jobs.length + " jobs");
    state.filteredjobs = jobs;
    state.page = page;

    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    const pageOfJobs = jobs.slice(start, end);

    for (var i = 0; i < pageOfJobs.length; i++) {
        renderJobItem(pageOfJobs[i], i);
    }

    let jobtitles = document.getElementsByClassName("ptitle");
    for (let p of jobtitles) {
        p.addEventListener("click", (e) => {
            let data = pageOfJobs[p.dataset.index];
            var propValue;
            for (var propName in data) {
                propValue = data[propName];
                sessionStorage.setItem(propName, propValue);
            }
            window.location = "displayjob.html";
        });
    }

    elements.jobTotal.innerHTML = `${jobs.length} blockchain jobs`;

    const alertb = document.getElementById("alertbtn");
    const nojobs = document.getElementById("nojobs");
    const pagebtns = document.getElementById("pagebuttons");

    if (jobs.length > 0) {
        alertb.style.display = "block";
    } else {
        nojobs.style.display = "block";
        pagebtns.style.display = "none";
    }
    if (jobs.length > resPerPage) {
        pagebtns.style.display = "flex";
        renderButtons(page, jobs.length, resPerPage);
    } else {
        pagebtns.style.display = "none";
    }

    renderCounts(jobs);
    window.scrollTo(0, 0);
}




function renderBlockchainTotals(name, total) {
    let bcName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    let markup = `<li id="${name}">${bcName}<span class="numjobs">(${total})</span></li>`;
    elements.blockchainTotals.insertAdjacentHTML("beforeend", markup);
}

function renderDateTotals(dates) {
    let filterclass = '';
    let crossicon = '';
    let selectedfilterclass = 'class="blob"';
    let selectedcrossicon = '<i class="far fa-times-circle"></i>'
    let idToGrey;
    for (var i = 0; i < state.filters.length; i++) {
        if (state.filters[i].filter === strings.dateFilter) {
            idToGrey=state.filters[i].item;
        }
    }
    console.log("PUCKINGTON>>>> = " + idToGrey);
    elements.dateTotals.innerHTML = "";

    let markup1 = `<li id="1" ${filterclass}>Last 24 hours<span class="numjobs">(${dates['ONEDAY']})</span>${crossicon}</li>`;
    if (idToGrey === "1") {
        markup1 = `<li id="1" ${selectedfilterclass}>Last 24 hours<span class="numjobs">(${dates['ONEDAY']})</span>${selectedcrossicon}</li>`;
    }    
    elements.dateTotals.insertAdjacentHTML("beforeend", markup1);

    let markup3 = `<li id="3" ${filterclass}>Last 3 days<span class="numjobs">(${dates['THREEDAY']})</span>${crossicon}</li>`;
    if (idToGrey === "3") {
        markup3 = `<li id="3" ${selectedfilterclass}>Last 3 days<span class="numjobs">(${dates['THREEDAY']})</span>${selectedcrossicon}</li>`;
    }    
    elements.dateTotals.insertAdjacentHTML("beforeend", markup3);

    let markup7 = `<li id="7" ${filterclass}>Last 7 days<span class="numjobs">(${dates['SEVENDAY']})</span>${crossicon}</li>`;
    if (idToGrey === "7") {
        markup7 = `<li id="7" ${selectedfilterclass}>Last 7 days<span class="numjobs">(${dates['SEVENDAY']})</span>${selectedcrossicon}</li>`;
    }    
    elements.dateTotals.insertAdjacentHTML("beforeend", markup7);

    let markup14 = `<li id="14" ${filterclass}>Last 14 days<span class="numjobs">(${dates['FOURTEENDAY']})</span>${crossicon}</li>`;
    if (idToGrey === "14") {
        markup14 = `<li id="14" ${selectedfilterclass}>Last 14 days<span class="numjobs">(${dates['FOURTEENDAY']})</span>${selectedcrossicon}</li>`;
    } 
    elements.dateTotals.insertAdjacentHTML("beforeend", markup14);
}

function renderJobTypeTotals(types) {
    elements.jobTypeTotals.innerHTML = "";
    let markupperm = `<li id="FULLTIME">Permanent<span class="numjobs">(${types['FULLTIME']})</span></li>`;
    elements.jobTypeTotals.insertAdjacentHTML("beforeend", markupperm);

    let markupcontract = `<li id="CONTRACT">Contract<span class="numjobs">(${types['CONTRACT']})</span></li>`;
    elements.jobTypeTotals.insertAdjacentHTML("beforeend", markupcontract);
}


function renderEmployerTypeTotals(types) {
    elements.employerTotals.innerHTML = "";
    let markupagency = `<li id="AGENCY">Agency<span class="numjobs">(${types['AGENCY']})</span></li>`;
    elements.employerTotals.insertAdjacentHTML("beforeend", markupagency);

    let markupemployer = `<li id="EMPLOYER">Direct Employer<span class="numjobs">(${types['EMPLOYER']})</span></li>`;
    elements.employerTotals.insertAdjacentHTML("beforeend", markupemployer);
}

function renderLocationTypeTotals(types) {
    elements.onsiteTotals.innerHTML = "";
    let markupremote = `<li id="true">Remote<span class="numjobs">(${types['REMOTE']})</span></li>`;
    elements.onsiteTotals.insertAdjacentHTML("beforeend", markupremote);

    let markupnonremote = `<li id="false">Non Remote<span class="numjobs">(${types['NONREMOTE']})</span></li>`;
    elements.onsiteTotals.insertAdjacentHTML("beforeend", markupnonremote);
}

function renderPopularCompanyTotals(companies) {
    elements.companyTotals.innerHTML = "";
    for (var i = 0; i < companies.length; i++) {
        let company = companies[i]
        for (var prop in company) {
            let markup = `  <li>${prop}<span class="numjobs">(${company[prop]})</span></li>`;
            elements.companyTotals.insertAdjacentHTML("beforeend", markup);
        }
    }
}

export const applyFilter = (filter, item, name) => {
    let filterItem = { filter: filter, item: item, name: name };
    state.filters.push(filterItem);

    let fp = new FilterProcessor(state.filteredjobs);

    let bcname = "blockchain";
    state.label = "";
    let thisFilterName = "";
    if (filter === strings.blockchainFilter) {
        state.filteredjobs = fp.filterByBlockchain(item);
        bcname = item.charAt(0).toUpperCase() + item.slice(1).toLowerCase();
        document.getElementById("what").value += bcname;
        thisFilterName = bcname;
        state.label += bcname;
        // display the "filter chain" in the top panel
        displayFilterChain(thisFilterName);
    } else if (filter == strings.companyFilter) {
        state.filteredjobs = fp.filterByCompany(item);
        document.getElementById("what").value += item;
        thisFilterName = item;
        state.label += item;
        // display the "filter chain" in the top panel
        displayFilterChain(thisFilterName);
    } else if (filter === strings.dateFilter) {
        state.filteredjobs = fp.filterByDate(item);
        state.label = bcname;
        // display the filter label in the filter panel
        elements.filterButtons.style.display = "block";
        renderFilterButtons(name);
    } else if (filter === strings.employerTypeFilter) {
        console.log("FILTER BY EMPLOYER TYPE");

    } else if (filter === strings.jobTypeFilter) {
        console.log("FILTER BY JOB TYPE");

    } else if (filter === strings.onSiteFilter) {
        console.log("FILTER BY REMOTENESS");

    }

    clearResults();

    // // display filtered job set
    renderResults(state.filteredjobs);

    elements.jobTotal.innerHTML = `${state.filteredjobs.length} ${state.label} jobs`;

    // change the list item to grey with a delete button etc

}

function renderFilterButtons(name) {
    let markup = `<button id="${name}" class="datefilter"><i class="far fa-times-circle"></i>${name}</button>`;
    elements.filterContent.insertAdjacentHTML("beforeend", markup);
    let btn = document.getElementById(name);

    btn.addEventListener("click", (e) => {3
        for (var i = state.filters.length - 1; i >= 0; --i) {
            if (state.filters[i].name == e.target.id) {
                state.filters.splice(i, 1);
            }
        }
        e.target.style.display = "none";
        if (state.filters.length == 0) {
            elements.filterTitle.style.display = "none";
            resetPage();
        } else {
            applyRemainingFilters();
        }
    });
}

function resetPage() {
    window.location = "search.html";
}

function applyRemainingFilters() {

}

function displayFilterChain(name) {
    document.getElementById("filterchain").style.display = "block";
    if (name != "") { }
    let markup = `<p>></p>
                <li class="all">${name}</li>`;
    elements.categoryList.insertAdjacentHTML("beforeend", markup);
}

function renderCounts(jobs) {
    let fp = new FilterProcessor(jobs);
    let bcTotals = fp.getBlockchainTotals();

    var propValue;
    if (state.filters.includes(elements.blockchainTotals)) {
        // TODO grey out the right one!
    } else {
        for (var propName in bcTotals) {
            propValue = bcTotals[propName]
            renderBlockchainTotals(propName, propValue);
        }
    }


    let dateTotals = fp.getDateTotals();
    renderDateTotals(dateTotals);

    let employerTypeTotals = fp.getEmployerTypeTotals();
    renderEmployerTypeTotals(employerTypeTotals);

    let jobTypeTotals = fp.getJobTypeTotals();
    renderJobTypeTotals(jobTypeTotals);

    let getLocationTypeTotals = fp.getLocationTypeTotals();
    renderLocationTypeTotals(getLocationTypeTotals);

    let companyTotals = fp.getCompanyTotals(5); // get top 5 companies
    renderPopularCompanyTotals(companyTotals);

    addEventHandlers();
}

const addEventHandlers = () => {
    let items = document.getElementsByTagName("li");
    for (let li of items) {
        li.addEventListener("click", (e) => {
            if (li.parentElement.className === "results_list" || li.parentElement.className === "category") {
                return; // hack. this list item is not part of the filtering
            }
            let name = li.innerText.substring(0, li.innerText.indexOf('('));

            // if there is already a filter from this group remove that one and replace with this one
            if (alreadyThere(li.parentElement.className)) {
                // replace old with new and reapply all filters
                replaceFilter(li.parentElement.className, li.id, name);
                applyAllFilters();
            } else {
                // otherwise just apply this filter
                applyFilter(li.parentElement.className, li.id, name);
            }
        });
    }
}

function alreadyThere(filterType) {
    return state.filters.filter(function (e) { return e.filter === filterType; }).length > 0;
}


export const handleNext = () => {
    clearResults();
    renderResults(state.filteredjobs, state.page + 1);
}
export const handlePrev = () => {
    clearResults();
    renderResults(state.filteredjobs, state.page - 1);
}
