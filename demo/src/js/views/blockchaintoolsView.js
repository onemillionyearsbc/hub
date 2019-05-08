import { elements, elementConsts, strings } from './base';

export const setJobStats = (stats) => {
    document.getElementById("tokensminted").innerHTML = stats.tokensminted;
    document.getElementById("tokensupply").innerHTML = stats.tokensupply;
    document.getElementById("gbp").innerHTML = stats.gbp;
    document.getElementById("unused").innerHTML = stats.unusedsearches;
    document.getElementById("jstokens").innerHTML = stats.jstokens;
}

export const clearHTML = () => {
    elements.blockchain.innerHTML="";
}

export const addFooter = (success) => {
    let markup = `<p class="success">Hash Check Passed!</p>`;
    if (success === false) {
        markup = `<p class="error">Hash Check Failed!</p>`;
    }
    elements.blockchain.insertAdjacentHTML("afterbegin", markup);
}
export const renderProofItem = (rowItems) => {
    let items = "";
   

    for (let i = 0; i < rowItems.length; i++) {
        let success ="";
        let icon = ` 
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 130.2 130.2">
                <circle class="path circle" fill="none" stroke="#73AF55"
                    stroke-width="6" stroke-miterlimit="10" cx="65.1" cy="65.1"
                    r="62.1" />
                <polyline class="path check" fill="none" stroke="#73AF55"
                    stroke-width="6" stroke-linecap="round" stroke-miterlimit="10"
                    points="100.2,40.2 51.5,88.8 29.8,67.5 " />
            </svg>`; // SUCCESS - TICK

        if (rowItems[i].success === false) {
            success = "fail";
            icon = ` 
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 130.2 130.2">
                <circle class="path circle" fill="none" stroke="#D06079"
                    stroke-width="6" stroke-miterlimit="10" cx="65.1" cy="65.1"
                    r="62.1" />
                <line class="path line" fill="none" stroke="#D06079" stroke-width="6"
                    stroke-linecap="round" stroke-miterlimit="10" x1="34.4" y1="37.9"
                    x2="95.8" y2="92.3" />
                <line class="path line" fill="none" stroke="#D06079" stroke-width="6"
                    stroke-linecap="round" stroke-miterlimit="10" x1="95.8" y1="38"
                    x2="34.4" y2="92.2" />
                </svg>
            `;
        } // FAIL - CROSS

        items += ` 
        <div class="placeholder ${success}">
            <div class="hashbox">
                <p>id <span class="id">${rowItems[i].id}</span></p>
                <p>bchash <span
                        class="hash">${rowItems[i].hashbc}</span>
                </p>
                <p>dbhash <span
                        class="hash">${rowItems[i].hashdb}</span>
                </p>
            </div>
            <div class="svgicon">
              ${icon}
            </div>
        </div>`;
    }

    let rowmarkup =
        `<div class="row">
        ${items}
    </div>`


    elements.blockchain.insertAdjacentHTML("beforeend", rowmarkup);


}
