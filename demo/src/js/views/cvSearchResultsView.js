import { elements } from './base';

export const renderCVSearchResults = (candidates) => {
    for (let i = 0; i < candidates.length; i++) {
        renderCVSearchResult(candidates[i], i);
    }
    let title = document.getElementById("numres");
    title.innerHTML = `Here are the ${candidates.length} candidates matching your search:`;
    
}

function renderCVSearchResult(candidate, index) {

    let buttonText = 'Download CV';
    let disabledStr = "";
    if (candidate.hasCV === false) {
        buttonText = "No CV Found";
        disabledStr = "disabled";
    }

    let markup = ` <li>
        <div class="item-job">
            <div class="mainbody">
                <div id="jobtitle" class="title">
                    <p id="cantitle-${index}" class="candidatetitle"  data-email=${candidate.email}>${candidate.name}</p>
                    <button id="cvbtn-${index}" class="downloadcvbutton btn" ${disabledStr} data-email=${candidate.email}>${buttonText}</button>
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