import { elements, strings, getJobTypeFor, getJobTimeFor, getDaySincePosted, renderLoader, clearLoader, setButtonHandlers, setGlobalCached } from './base';
import FilterProcessor from '../models/FilterProcessor';
import { timingSafeEqual } from 'crypto';
import { inflate } from 'zlib';


let state = {};
state.filters = [];
state.filteredjobs = [];
let className = "blob"
let selectedfilterclass = `class=${className}`;
let filterclass = '';
let crossicon = '';
let selectedcrossicon = '<i class="far fa-times-circle"></i>';

const renderJobItem = (jobItem, count) => {

    let loc = "See all blockchain jobs in " + jobItem.location;
    let cityloc = "";


    if (jobItem.remote === true) {
        loc = "See all remote blockchain jobs";
        cityloc = "REMOTE";
    } else {
        if (jobItem.city != undefined && jobItem.city != "") {
            cityloc = jobItem.city + ", ";
        }
        if (jobItem.location != undefined && jobItem.location != "") {
            cityloc += jobItem.location;
        }
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

    let bdisp = "block";
    let pdisp = "none";

    if (isInFavourites(jobItem.jobReference)) {
        bdisp = "none";
        pdisp = "block";
    }

    let savedItemB = `<button style="display: ${bdisp};" id="savefavouritesbutton" data-id=${jobItem.jobReference} class="saveBtn"><i class="far fa-star"></i>Save</button>`;
    let savedItemP = `<p id="p-${jobItem.jobReference}" style="display: ${pdisp};" class="savedlabel">Saved</>`;

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
                                <p id="joblocation" class="loggy__label">${cityloc}</p>
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
              
                <div id="${jobItem.jobReference}" class="linksave">
                  
                    <p class="locationbutton" data-index=${count} id="${jobItem.location}">${loc}</p>
                    <p>See All ${blockName} jobs</p>
                    ${savedItemB} ${savedItemP}
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


function isInFavourites(ref) {
    if (state.favourites != undefined && state.favourites.filter(e => e.jobReference === ref).length > 0) {
        return true;
    }
    return false;
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
    state.cachedData = jobs;
    setGlobalCached(jobs);
    state.filteredjobs = jobs;
    state.jobs = jobs;
}

export const renderResults = (jobs, page = 1, resPerPage = 10) => {
    state.filteredjobs = jobs;
    state.page = page;

    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    const pageOfJobs = jobs.slice(start, end);

    let favs = sessionStorage.getItem("favourites");
    if (favs != null) {
        favs = JSON.parse(favs);
        state.favourites = favs;
    }

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
                console.log("*********" + propName);
                if (propName === "applications") {
                    if (data.applications != undefined) {
                        sessionStorage.setItem("applications", data.applications.length);
                    } else {
                        sessionStorage.setItem("applications", 0);
                    }
                } else {
                    sessionStorage.setItem(propName, propValue);
                }

            }
            window.location = "displayjob.html";
        });
    }

    let locationlinks = document.getElementsByClassName("locationbutton");
    for (let p of locationlinks) {
        p.addEventListener("click", (e) => {
            let location = pageOfJobs[p.dataset.index].location;
            // resetPage();
            if (location === "REMOTE") {
                let filterItem = { filter: strings.locationFilter, name: "", item: "REMOTE" };
                state.filters = [];
                state.filters.push(filterItem);
                console.log("QUACK 2");
                applyFilter(strings.locationFilter, "", "REMOTE");
            } else {
                console.log("+++++++++++++ LOCATION job search, location = " + location);
            }
        });

    }

    elements.jobTotal.innerHTML = `${jobs.length} live blockchain jobs`;

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
    setButtonHandlers();
    renderCounts(jobs);
    window.scrollTo(0, 0);
}

function renderBlockchainTotals(name, total) {
    let bcName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    let markup = `<li id="${name}"><span class="namespan">${bcName}</span><span class="numjobs">(${total})</span></li>`;
    elements.blockchainTotals.insertAdjacentHTML("beforeend", markup);
}

function renderCountryTotals(name, total) {
    let markup = `<li id="${name}"><span class="namespan">${name}</span><span class="numjobs">(${total})</span></li>`;
    elements.locationTotals.insertAdjacentHTML("beforeend", markup);
}

function renderDateTotals(dates) {

    let idToGrey;
    for (var i = 0; i < state.filters.length; i++) {
        if (state.filters[i].filter === strings.dateFilter) {
            idToGrey = state.filters[i].item;
        }
    }
    elements.dateTotals.innerHTML = "";

    let markup1 = `<li id="1" ${filterclass}><span class="namespan">Last 24 hours</span><span class="numjobs">(${dates['ONEDAY']})</span>${crossicon}</li>`;
    if (idToGrey === "1") {
        markup1 = `<li id="1" ${selectedfilterclass}><span class="namespan2">Last 24 hours</span><span class="numjobs">(${dates['ONEDAY']})</span>${selectedcrossicon}</li>`;
    }
    elements.dateTotals.insertAdjacentHTML("beforeend", markup1);

    let markup3 = `<li id="3" ${filterclass}><span class="namespan">Last 3 days</span><span class="numjobs">(${dates['THREEDAY']})</span>${crossicon}</li>`;
    if (idToGrey === "3") {
        markup3 = `<li id="3" ${selectedfilterclass}><span class="namespan2">Last 3 days</span><span class="numjobs">(${dates['THREEDAY']})</span>${selectedcrossicon}</li>`;
    }
    elements.dateTotals.insertAdjacentHTML("beforeend", markup3);

    let markup7 = `<li id="7" ${filterclass}><span class="namespan">Last 7 days</span><span class="numjobs">(${dates['SEVENDAY']})</span>${crossicon}</li>`;
    if (idToGrey === "7") {
        markup7 = `<li id="7" ${selectedfilterclass}><span class="namespan2">Last 7 days</span><span class="numjobs">(${dates['SEVENDAY']})</span>${selectedcrossicon}</li>`;
    }
    elements.dateTotals.insertAdjacentHTML("beforeend", markup7);

    let markup14 = `<li id="14" ${filterclass}><span class="namespan">Last 14 days</span><span class="numjobs">(${dates['FOURTEENDAY']})</span>${crossicon}</li>`;
    if (idToGrey === "14") {
        markup14 = `<li id="14" ${selectedfilterclass}><span class="namespan2">Last 14 days</span><span class="numjobs">(${dates['FOURTEENDAY']})</span>${selectedcrossicon}</li>`;
    }
    elements.dateTotals.insertAdjacentHTML("beforeend", markup14);
}

function renderJobTypeTotals(types) {
    elements.jobTypeTotals.innerHTML = "";
    let idToGrey;
    for (var i = 0; i < state.filters.length; i++) {
        if (state.filters[i].filter === strings.jobTypeFilter) {
            idToGrey = state.filters[i].item;
        }
    }
    let markupperm = `<li id="FULLTIME"><span class="namespan">Permanent</span><span class="numjobs">(${types['FULLTIME']})</span></li>`;
    if (idToGrey === "FULLTIME") {
        markupperm = `<li id="FULLTIME" ${selectedfilterclass}><span class="namespan2">Permanent</span><span class="numjobs">(${types['FULLTIME']})</span>${selectedcrossicon}</li>`;
    }
    elements.jobTypeTotals.insertAdjacentHTML("beforeend", markupperm);

    let markupcontract = `<li id="CONTRACT"><span class="namespan">Contract</span><span class="numjobs">(${types['CONTRACT']})</span></li>`;
    if (idToGrey === "CONTRACT") {
        markupcontract = `<li id="CONTRACT" ${selectedfilterclass}><span class="namespan2">Contract</span><span class="numjobs">(${types['CONTRACT']})</span>${selectedcrossicon}</li>`;
    }
    elements.jobTypeTotals.insertAdjacentHTML("beforeend", markupcontract);
}


function renderEmployerTypeTotals(types) {
    elements.employerTotals.innerHTML = "";
    let idToGrey;
    for (var i = 0; i < state.filters.length; i++) {
        if (state.filters[i].filter === strings.employerTypeFilter) {
            idToGrey = state.filters[i].item;
        }
    }
    let markupagency = `<li id="AGENCY"><span class="namespan">Agency</span><span class="numjobs">(${types['AGENCY']})</span></li>`;
    if (idToGrey === "AGENCY") {
        markupagency = `<li id="AGENCY" ${selectedfilterclass}><span class="namespan2">Agency</span><span class="numjobs">(${types['AGENCY']})</span>${selectedcrossicon}</li>`;
    }
    elements.employerTotals.insertAdjacentHTML("beforeend", markupagency);

    let markupemployer = `<li id="EMPLOYER"><span class="namespan">Direct Employer</span><span class="numjobs">(${types['EMPLOYER']})</span></li>`;
    if (idToGrey === "EMPLOYER") {
        markupemployer = `<li id="EMPLOYER" ${selectedfilterclass}><span class="namespan2">Direct Employer</span><span class="numjobs">(${types['EMPLOYER']})</span>${selectedcrossicon}</li>`;
    }
    elements.employerTotals.insertAdjacentHTML("beforeend", markupemployer);
}

function renderLocationTypeTotals(types) {
    elements.onsiteTotals.innerHTML = "";
    let idToGrey;
    for (var i = 0; i < state.filters.length; i++) {
        console.log("FILTER = " + state.filters[i].filter);
        if (state.filters[i].filter === strings.onSiteFilter) {
            idToGrey = state.filters[i].item;
        }
    }
    let markupremote = `<li id="true"><span class="namespan">Remote</span><span class="numjobs">(${types['REMOTE']})</span></li>`;
    if (idToGrey === "true") {
        markupremote = `<li id="true" ${selectedfilterclass}><span class="namespan2">Remote</span><span class="numjobs">(${types['REMOTE']})</span>${selectedcrossicon}</li>`;
    }
    elements.onsiteTotals.insertAdjacentHTML("beforeend", markupremote);

    let markupnonremote = `<li id="false"><span class="namespan">Non Remote</span><span class="numjobs">(${types['NONREMOTE']})</span></li>`;
    if (idToGrey === "false") {
        markupnonremote = `<li id="false" ${selectedfilterclass}><span class="namespan2">Non-Remote</span><span class="numjobs">(${types['NONREMOTE']})</span>${selectedcrossicon}</li>`;
    }
    elements.onsiteTotals.insertAdjacentHTML("beforeend", markupnonremote);
}

function renderPopularCompanyTotals(companies) {
    elements.companyTotals.innerHTML = "";
    for (var i = 0; i < companies.length; i++) {
        let company = companies[i]
        for (var prop in company) {
            let markup = `  <li><span class="namespan">${prop}</span><span class="numjobs">(${company[prop]})</span></li>`;
            elements.companyTotals.insertAdjacentHTML("beforeend", markup);
        }
    }
}

export const filterByWhat = (item) => {
    if (state.jobs != undefined) {
        state.filteredjobs = state.jobs;
    }
    applyFilter(strings.whatFilter, item, "");
}

export const filterByWhere = (location) => {
    if (state.jobs != undefined) {
        state.filteredjobs = state.jobs;
    }
    sessionStorage.setItem("where", location);
    let distance = document.querySelector('input[name="miles"]:checked').value;
    console.log("SEARCH FOR " + location + " PLUS " + distance + " MILES");
    applyFilter(strings.locationFilter, location, distance);
}

export const setJobsForSearch = (jobs) => {
    console.log("TOMATO: state.jobs length = " + state.jobs);
    state.jobs = jobs;
}

// filter = type (eg companytotals)
// item - item to search for
// name - label to print on the button
export const applyFilter = async (filter, item, name) => {
    renderLoader(elements.searchjob);

    // export async const applyFilter = (filter, item, name) => {
    console.log("++++++++++++++++ NOW WE ARE APPLYING A FILTER (TYPE " + filter + ")+ NAME: " + name + " ITEM: " + item);
    console.log("++++++++++++++++ NUM JOBS FOR FILTER PROCESSOR = " + state.filteredjobs.length);
    let fp = new FilterProcessor(state.filteredjobs);
    let bcname = "live blockchain";
    if (state.label === undefined) {
        state.label = "";
    }
    let plusdistance = "";
    let thisFilterName = "";
    if (filter === strings.locationFilter) {
        console.log("item = " + item);
        console.log("name = " + name);
        if (name === "REMOTE") {
            if (item === "false" || item === false) {
                state.filteredjobs = fp.filterByLocationType("false");
            } else {
                state.filteredjobs = fp.filterByLocationType("true");
            }
            state.label = "REMOTE";
        } else {
            if (name != "") {
                let distance = parseInt(name);
                state.filteredjobs = await fp.filterByLocationAndDistance(item, distance);
                console.log("distance = " + distance + ": num rows = " + state.filteredjobs);
                if (distance > 0) {
                    plusdistance = " + " + distance + " miles";
                }

            } else {
                state.filteredjobs = fp.filterByLocation(item);
            }

            state.loclabel = item;
            document.getElementById("where").value = item;
            state.location = true;
            displayFilterChain(item);
        }
    }

    if (filter === strings.whatFilter) {

        console.log("Filtering by WHAT item = " + item);
        state.filteredjobs = fp.filterByWhat(item);
        state.label = item;
        document.getElementById("what").value = item;

        state.location = false;
        displayFilterChain(item);
        if (document.getElementById("where").value != "") {
            state.location = true;
        }
    }
    if (filter === strings.blockchainFilter) {
        state.filteredjobs = fp.filterByBlockchain(item);
        bcname = item.charAt(0).toUpperCase() + item.slice(1).toLowerCase();
        if (document.getElementById("what").value.includes(bcname) === false) {
            document.getElementById("what").value += " " + bcname;
        }

        thisFilterName = bcname;
        state.label += " " + bcname;
        // display the "filter chain" in the top panel
        displayFilterChain(thisFilterName);
    } else if (filter == strings.companyFilter) {

        state.filteredjobs = fp.filterByCompany(name); // note we use name to search for

        thisFilterName = name;
        if (state.label != name) {
            state.label += " " + name;
            document.getElementById("what").value += " " + name;
        }
        state.location = false;

        displayFilterChain(thisFilterName);
    } else if (filter === strings.dateFilter) {
        state.filteredjobs = fp.filterByDate(item);

        if (state.label === '') {
            state.label = bcname;
        }
        elements.filterButtons.style.display = "block";
        renderFilterButton(filter, name);
    } else if (filter === strings.employerTypeFilter) {
        state.filteredjobs = fp.filterByEmployerType(item);
        if (state.label === '') {
            state.label = bcname;
        }

        if (state.filters.length > 0) {
            // display the filter label in the filter panel
            elements.filterButtons.style.display = "block";
            renderFilterButton(filter, name);
        }

    } else if (filter === strings.jobTypeFilter) {
        console.log(">>>>>>>>>> filter by job type item = " + item);
        console.log("state.filters = " + state.filters);
        state.filteredjobs = fp.filterByJobType(item);
        if (state.label === '') {
            state.label = bcname;
        }

        if (state.filters.length > 0) {
            // display the filter label in the filter panel
            elements.filterButtons.style.display = "block";
            console.log(">>>>>>> DOING REALLY BAD STUFF!");
            renderFilterButton(filter, name);
        }

    } else if (filter === strings.onSiteFilter) {
        state.filteredjobs = fp.filterByLocationType(item);
        if (state.label === '') {
            state.label = bcname;
        }
        // display the filter label in the filter panel - if this search is from a button not a link in the job item
        if (name != "") {
            elements.filterButtons.style.display = "block";
            renderFilterButton(filter, name);
        }
    }

    clearResults();

    // // display filtered job set
    renderResults(state.filteredjobs);
    let j = "jobs";
    if (state.filteredjobs.length === 1) {
        j = "job";
    }
    if (state.location === true) {
        elements.jobTotal.innerHTML = `${state.filteredjobs.length} ${state.label} ${j} in ${state.loclabel} ${plusdistance}`;
    } else {
        elements.jobTotal.innerHTML = `${state.filteredjobs.length} ${state.label} ${j}`;
    }
    clearLoader();
}


function removeFilterButton(filterName) {
    let btn = document.getElementById(filterName);
    btn.parentNode.removeChild(btn);
}

function renderFilterButton(filter, name) {
    let ele = document.getElementById("filterbuttons");;
    let btns = ele.getElementsByTagName("button");
    for (let i = 0; i < btns.length; i++) {
        console.log("btns text = " + btns[i].innerText);
        if (btns[i].innerText === name) {
            return;
        }
    }

    let markup = `<button id="${filter}" class="filterbtn"><i class="far fa-times-circle"></i>${name}</button>`;

    elements.filterContent.insertAdjacentHTML("beforeend", markup);
    let btn = document.getElementById(filter);

    btn.addEventListener("click", (e) => {

        // 1. remove the filter button
        removeFilterButton(e.target.id);

        //  2. check if that was the last button, if so remove the panel
        let ele = document.getElementById("filterbuttons");
        let btns = ele.getElementsByTagName("button");

        if (btns.length === 0) {
            elements.filterButtons.style.display = "none";
        }

        // 3. remove the filter from the filter list
        removeFilter(e.target.id);

        // 4. reapply remaining filters
        reapplyRemainingFilters();
    });
}

function resetPage() {
    window.location = "search.html";
}

function displayFilterChain(name) {
    document.getElementById("filterchain").style.display = "block";
    let ele = document.getElementById("catlist");
    let listitems = ele.getElementsByClassName(name); // make sure we don'put the same element twice into the list
    if (listitems.length > 0) {
        return;
    }
    let markup = `<p>></p>
                <li class="${name}">${name}</li>`;
    elements.categoryList.insertAdjacentHTML("beforeend", markup);
}

function renderCounts(jobs) {
    let fp = new FilterProcessor(jobs);
    let bcTotals = fp.getBlockchainTotals();

    var propValue;

    elements.blockchainTotals.innerHTML = "";
    if (state.filters.includes(elements.blockchainTotals)) {
        // TODO grey out the right one!
        // not sure we need to do this as it removes all the others anyway
    } else {
        for (var propName in bcTotals) {
            propValue = bcTotals[propName]
            renderBlockchainTotals(propName, propValue);
        }
    }

    let countryTotals = fp.getLocationTotals();


    let sortedCountries = fp.sort(countryTotals, 11);
    sortedCountries = sortedCountries.filter(posting => posting.location != "REMOTE");

    elements.locationTotals.innerHTML = "";

    for (var i = 0; i < sortedCountries.length; i++) {

        let country = sortedCountries[i]
        for (var prop in country) {
            if (prop != "REMOTE" && countryTotals[prop] > 0) {
                renderCountryTotals(prop, countryTotals[prop]);
            }

        }
    }
    // for (var propName in sortedCountries) {
    //     propValue = sortedCountries[propName]

    //     console.log(propName, propValue);

    //     let total = parseInt(propValue);
    //     if (total > 1) {
    //         let cityTotals = fp.getCityTotals(propName);
    //         for (var cityProp in cityTotals) {
    //             let cityValue = cityTotals[cityProp]
    //             // renderCountryTotals(propName, propValue);
    //             console.log("   => " + cityProp, cityValue);
    //         }

    //         if(propName != "REMOTE" && propName != "United Kingdom") {
    //             renderCountryTotals(propName, propValue);
    //         }

    //     }

    // }


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
            if (li.parentElement.className === "navbar__right") {
                window.location = "favourites.html";
            }
            if (e.target.parentElement.id === "links" || li.parentElement.className === "results_list" || li.parentElement.className === "category" || li.parentElement.className === "navbar__right") {
                return; // hack. this list item is not part of the filtering
            }

            let name = li.innerText.substring(0, li.innerText.lastIndexOf('('));
            let filterName = li.parentElement.className;
            console.log("filterName = " + filterName);
            console.log("className = " + className);
            console.log("e.target.classList = " + e.target.classList);

            if (e.target.parentElement.classList.contains(className)) {
                // 1. remove the filter button
                removeFilterButton(filterName);

                // check if that was the last button, if so remove the panel
                let ele = document.getElementById("filterbuttons");
                let btns = ele.getElementsByTagName("button");

                if (btns.length === 0) {
                    elements.filterButtons.style.display = "none";
                }

                // 2. remove the filter from the filter list
                removeFilter(filterName);

                // 3. reapply remaining filters
                reapplyRemainingFilters();

                return;
            }


            // if there is already a filter from this group remove that one and replace with this one
            if (alreadyThere(li.parentElement.className)) {

                if (li.parentElement.className === strings.blockchainFilter || li.parentElement.className === strings.companyFilter) {
                    // no need to replace company or blockchain filters as these don't have buttons
                    return;
                }
                // replace old with new and reapply all filters
                console.log("REPLACING " + li.parentElement.className + "," + li.id + ", " + name);
                replaceFilter(li.parentElement.className, li.id, name);

                state.filteredjobs = state.jobs
                for (var i = 0; i < state.filters.length; i++) {
                    console.log("filter.filter = " + state.filters[i].filter + "; filter.item = " + state.filters[i].item + "; filter.name = " + state.filters[i].name);
                    console.log("QUACK 54");
                    applyFilter(state.filters[i].filter, state.filters[i].item, state.filters[i].name);
                }
            } else {
                // otherwise just add this filter to the list and apply it
                let filterItem = { filter: li.parentElement.className, item: li.id, name: name };
                state.filters.push(filterItem);
                console.log("QUACKY 665 name = " + name);
                applyFilter(li.parentElement.className, li.id, name);

            }
        });
    }
}

function reapplyRemainingFilters() {
    if (state.jobs != undefined) {
        state.filteredjobs = state.jobs;
    }

    if (state.filters.length === 0) {
        // clear out the filters from the front screen
        sessionStorage.setItem("filterremote", "all");
        sessionStorage.setItem("filtertype", "all");
        sessionStorage.setItem("filteremployer", "all");
        resetPage();
        return;
    }
    state.label = undefined;
    for (var i = 0; i < state.filters.length; i++) {
        console.log("QUACK 1");
        applyFilter(state.filters[i].filter, state.filters[i].item, state.filters[i].name);
    }
}
function removeFilter(filterType) {
    for (let i = 0; i < state.filters.length; i++) {
        console.log("FILTER " + i + " = " + state.filters[i].filter);
    }
    state.filters = state.filters.filter(function (e) { return e.filter != filterType; });
    for (let i = 0; i < state.filters.length; i++) {
        console.log("FILTER " + i + " = " + state.filters[i].filter);
    }
}

function replaceFilter(filterType, item, name) {
    removeFilterButton(filterType);

    removeFilter(filterType);

    let filterItem = { filter: filterType, item: item, name: name };

    state.filters.push(filterItem);
}

function alreadyThere(filterType) {
    return state.filters.filter(function (e) { return e.filter === filterType; }).length > 0;
}


export const handleNext = () => {
    clearResults();
    console.log("state.page = " + state.page);
    renderResults(state.filteredjobs, state.page + 1);
}
export const handlePrev = () => {
    clearResults();
    renderResults(state.filteredjobs, state.page - 1);
}
