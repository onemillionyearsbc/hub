import { elements, elementConsts, strings } from './base';

export const setJobStats = (stats) => {
    document.getElementById("tokensminted").innerHTML = stats.tokensminted;
    document.getElementById("tokensupply").innerHTML = stats.tokensupply;
    document.getElementById("gbp").innerHTML = stats.gbp;
    document.getElementById("unused").innerHTML = stats.unusedsearches;
}