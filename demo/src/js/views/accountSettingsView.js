import { elements, elementConsts, strings } from './base';

export const setWalletStats = (tokens) => {
    let gbp = (tokens / elementConsts.TOKENEXCHANGERATE).toFixed(2);
    document.getElementById("gbp").innerHTML = gbp + " GBP";
    document.getElementById("hubtokens").innerHTML = tokens.toFixed(2) + " HubTokens";
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

        var td = dd + "/" + (mm) + "/" + transactionDate.getFullYear();
   
        body.innerHTML +=
            `<tr>` +
            `<td width="25rem">${type}</td>` +
            `<td width="25rem">${amount}</td>` +
            `<td width="25rem">${td}</td>` +
            `<td width="25rem">${action}</td>` + // todo use sign of amount to get CREDIT or DEBIT
            `<td width="25rem">${rows[i].balance}</td>` +
            '</tr>';
    }

}