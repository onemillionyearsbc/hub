import { elements } from './base';

export const renderCVSearchResults = (candidates) => {
    console.log(">>> READY TO GO...result size = " + candidates.length);

    for (let i = 0; i < candidates.length; i++) {
        renderCVSearchResult(candidates[i]);
    }
    let title = document.getElementById("numres");
    title.innerHTML = `Here are the ${candidates.length} candidates matching your search:`;
    
}

function renderCVSearchResult(candidate) {
    
    // o String      email 
    // o String      name
    // o String      locationy
    // o String      skills
//     <div id="jobtitle" class="title">
//     <p>${candidate.name}</p>
//     <button class="downloadcvbutton btn">Download CV</button>
// </div>
    let markup = ` <li>
        <div class="item-job">
            <div class="mainbody">
                <div id="jobtitle" class="title">
                    <p class=candidatetitle>${candidate.name}</p>
                    <button class="downloadcvbutton btn" data-email=${candidate.email}>Download CV</button>
                </div>
                
                <div class="top">
                    <div class="left">
                        <div class="left__item">
                            <div class="loggy">
                                <i class="loggy__icon far fa-keyboard"></i>
                                <p id="jobtype" class="loggy__label">${candidate.skills}</a>
                            </div>
                        </div>
                        <div class="left__item">
                            <div class="loggy">
                                <i class="loggy__icon fas fa-map-marker-alt fa-fw"></i>
                                <p id="joblocation" class="loggy__label">${candidate.location}</p>
                            </div>
                        </div>
                        <div class="left__item">
                            <div class="loggy">
                                <i class="loggy__icon fas fa-envelope"></i>
                                <p id="jobtime" class="loggy__label">${candidate.email}</p>
                            </div>
                        </div>
                    </div>
                
                </div>
            </div>
        </div>
    </li>`

    elements.searchResList.insertAdjacentHTML("beforeend", markup);
}