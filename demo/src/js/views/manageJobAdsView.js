import { elements, strings, getSelectedOption } from './base';

// TODO we need to populate the postedBy dropdown with all contact names for all postings for this email

export const getFormData = (email) => {
    var form = elements.madForm;
    var el = form.querySelectorAll('input');
    var myData = {};

    for (var x = 0; x < el.length; x++) {
        var id = el[x].id;
        var value = el[x].value;
        myData[id] = value;
    };

    var formData = {
        $class: strings.getJobPostingsTransaction,
        email: email,
        filterBy: myData["filterby"],
        filterType: getSelectedOption(elements.filterType),
        dateFrom: getDate(elements.dateFrom.value, strings.beginningOfTime, "00:00:00.000"),
        dateTo: getDate(elements.dateTo.value, strings.endOfTime, "23:59:59.999"),
        user: getSelectedOption(elements.userselect)
    };
    return formData;
}

function getDate(val, defaultDate, time) {
    if (val === "") {
        return defaultDate;
    } else {
        let dd = val.substr(8, 2);
        let mm = val.substr(5, 2);
        let yyyy = val.substr(0, 4);
        let date = `${yyyy}-${mm}-${dd}T${time}Z`;
        return date;
    }

}

export const setJobStats = (rows) => {
    let postedjobads, remotejobads=0, nonremotejobads=0, jobadviews=0, jobadapplications = 0;
    // let remotejobads=0;
    postedjobads = rows.length;
    for (var i = 0; i < rows.length; i++) {
        if (rows[i].remote === true) {
            console.log("QUACK non remote");
            remotejobads+=1;
        } else {
            console.log("QUACK remote");
            nonremotejobads+=1;
            console.log("QUACK nonremotejobads = " + nonremotejobads);
        }
        jobadviews = rows[i].views;
        jobadapplications = rows[i].views;
    }

    document.getElementById("postedjobads").innerHTML=postedjobads;
    document.getElementById("remotejobads").innerHTML=remotejobads;
    document.getElementById("nonremotejobads").innerHTML=nonremotejobads;
    document.getElementById("jobadviews").innerHTML=jobadviews;
    document.getElementById("jobadapplications").innerHTML=jobadapplications;
}

export const populatePostedBy = (rows) => {
    let users = [];
    for (var i = 0; i < rows.length; i++) {
        if (!users.includes(rows[i].contact)) {
            users.push(rows[i].contact);
        }
    }

    var select = document.getElementById("userselect");
    for (var i = 0; i < users.length; i++) {
        select.options[select.options.length] = new Option(users[i], users[i]);
    }
}

export const populateFilterTable = (rows) => {
    let table = document.getElementById("jobtable");
    let body = document.getElementById("tablebody");

    body.innerHTML = "";
    for (var i = 0; i < rows.length; i++) {
        const expiryDate = new Date(rows[i].expiryDate);
        const dd = expiryDate.getDate() <= 9 ? "0" + (expiryDate.getDate()) : (expiryDate.getDate());
        const mm = expiryDate.getMonth() <= 8 ? "0" + (expiryDate.getMonth() + 1) : (expiryDate.getMonth() + 1);

        var ed = dd + "/" + (mm) + "/" + expiryDate.getFullYear();

        const datePosted = new Date(rows[i].datePosted);
        const d2 = datePosted.getDate() <= 9 ? "0" + (datePosted.getDate()) : (datePosted.getDate());
        const m2 = datePosted.getMonth() <= 8 ? "0" + (datePosted.getMonth() + 1) : (datePosted.getMonth() + 1);
        var dp = d2 + "/" + (m2) + "/" + datePosted.getFullYear();

        let loc = rows[i].location;
        let style = "";
        if (loc === "") {
            loc = "REMOTE";
            style = 'style="color:red"';
        }

        body.innerHTML +=
            '<tr>' +
            `<td width="300px" ${style} >${loc}</td>` +
            `<td width="300px">${rows[i].jobReference}</td>` +
            `<td width="300px">${rows[i].internalRef}</td>` +
            `<td width="300px">${rows[i].contact}</td>` +
            `<td width="300px">${dp}</td>` +
            `<td width="300px">${ed}</td>` +
            `<td width="300px">${rows[i].views}</td>` +
            `<td width="300px">${rows[i].applications}</td>` +
            '</tr>';
    }
    var myTH = document.getElementsByTagName("th")[1];
    sorttable.innerSortFunction.apply(myTH, []);
    var trList = table.getElementsByTagName("tr");
    for (var index = 0; index < trList.length; index++) {
        trList[index].addEventListener("dblclick", function (event) {
            let row = "";
            for (let item of event.target.parentNode.cells) {
                row += item.innerHTML + " ";
            }
            alert("Row Clicked: " + row);
        });
    }
}