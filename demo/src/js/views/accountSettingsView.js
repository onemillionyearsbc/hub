import { elements, elementConsts, strings } from './base';

export const setWalletStats = (tokens, rankpts) => {
    let gbp = (tokens / elementConsts.TOKENEXCHANGERATE).toFixed(2);
    document.getElementById("gbp").innerHTML = gbp + " GBP";
    document.getElementById("hubtokens").innerHTML = tokens.toFixed(2) + " HubTokens";

    elements.rankPtsLabel.innerHTML = "Ranking Points: " + rankpts;
}

export const populateFilterTable = (rows) => {
    let body = document.getElementById("tablebody");

    body.innerHTML = "";

    let action = "";
   

    for (var i = 0; i < rows.length; i++) {
        let amount = rows[i].amount;
        let type = rows[i].type;
        if (type==="LOADUP") {
            type = "ADD FUNDS";
        }
        if (i < rows.length-1 && rows[i+1].balance > rows[i].balance) {
            action = "DEBIT";
        } else {
            action = "CREDIT";
        }
        if (i === rows.length -1) {
            action = "-"; // initial creation of account
        }
        const transactionDate = new Date(rows[i].date);
        const dd = transactionDate.getDate() <= 9 ? "0" + (transactionDate.getDate()) : (transactionDate.getDate());
        const mm = transactionDate.getMonth() <= 8 ? "0" + (transactionDate.getMonth() + 1) : (transactionDate.getMonth() + 1);
        const hr = transactionDate.getHours() <= 9 ? "0" + (transactionDate.getHours()) : (transactionDate.getHours());
        const min = transactionDate.getMinutes() <= 9 ? "0" + (transactionDate.getMinutes()) : (transactionDate.getMinutes());
        const sec = transactionDate.getSeconds() <= 9 ? "0" + (transactionDate.getSeconds()) : (transactionDate.getSeconds());

        var td = dd + "/" + (mm) + "/" + transactionDate.getFullYear() + " " + hr + ":" +min + ":" + sec;
   
        // YYYYMMDDHHMMSS 
        // eg sorttable_customkey="20190502161424"
        let customDateFormat = `sorttable_customkey="${transactionDate.getFullYear()}${mm}${dd}${hr}${min}${sec}"`;
        console.log(">> customDateFormat= " + customDateFormat);

        body.innerHTML +=
            `<tr>` +
            `<td width="25rem">${type}</td>` +
            `<td width="25rem">${amount}</td>` +
            `<td ${customDateFormat} width="25rem">${td}</td>` +
            `<td width="25rem">${action}</td>` + // todo use sign of amount to get CREDIT or DEBIT
            `<td width="25rem">${rows[i].balance}</td>` +
            '</tr>';
    }

}