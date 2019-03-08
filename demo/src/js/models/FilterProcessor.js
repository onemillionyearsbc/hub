import { strings } from '../views/base';

export default class FilterProcessor {

    constructor(jobs) {
        this.jobs = jobs;
        this.DAY = 24 * 60 * 60 * 1000;
    }

    getBlockchainTotals() {
        const bcTotals = this.jobs.reduce((total, bc) => {
            total[bc.blockchainName] = total[bc.blockchainName] || 0;
            total[bc.blockchainName] += 1;
            return total;
        }, {});
        return bcTotals;
    }

    getCityTotals(location) {
        let jobs = this.jobs.filter(posting => posting.location === location && posting.city != undefined);
        const cityTotals = jobs.reduce((total, bc) => {
            
            total[bc.city] = total[bc.city] || 0;

            if (bc.city != "") {
                total[bc.city] += 1;
            }
    
            return total;
        }, {});
        return cityTotals;
    }

    getLocationTotals() {
        const locationTotals = this.jobs.reduce((total, bc) => {
            total[bc.location] = total[bc.location] || 0;

            if (bc.location != "") {
                total[bc.location] += 1;
            }
    
            return total;
        }, {});
        return locationTotals;
    }

    // return sorted list of size num -> this is the top [num] companies by volume of jobs posted
    getCompanyTotals(num) {
        const bcTotals = this.jobs.reduce((total, bc) => {
            total[bc.company] = total[bc.company] || 0;
            total[bc.company] += 1;
            return total;
        }, {});

        // let keys = this.sortedKeys(bcTotals);
        // let sortedTotals = [];
        // let numToReturn = Math.min(num, keys.length);

        // for (var i = 0; i < numToReturn; i++) {
        //     let obj = {};
        //     let key = keys[i];
        //     let val = bcTotals[keys[i]];
        //     obj[key] = val;
        //     sortedTotals.push(obj);
        // }
        // return sortedTotals;
        return this.sort(bcTotals, num);
    }

    sort(arrayToSort, num=0) {
        if (num === 0) {
            num = arrayToSort.length;
        }
        let keys = this.sortedKeys(arrayToSort);
        let sortedTotals = [];
        let numToReturn = Math.min(num, keys.length);

        for (var i = 0; i < numToReturn; i++) {
            let obj = {};
            let key = keys[i];
            let val = arrayToSort[keys[i]];
            obj[key] = val;
            sortedTotals.push(obj);
        }
        return sortedTotals;
    }

    sortedKeys(aao, comp = "", intVal = false, desc = false) {
        let keys = Object.keys(aao);
        if (comp != "") {
            if (intVal) {
                if (desc) return keys.sort(function (a, b) { return aao[b][comp] - aao[a][comp] });
                else return keys.sort(function (a, b) { return aao[a][comp] - aao[a][comp] });
            } else {
                if (desc) return keys.sort(function (a, b) { return aao[b][comp] < aao[a][comp] ? 1 : aao[b][comp] > aao[a][comp] ? -1 : 0 });
                else return keys.sort(function (a, b) { return aao[a][comp] < aao[b][comp] ? 1 : aao[a][comp] > aao[b][comp] ? -1 : 0 });
            }
        } else {
            if (intVal) {
                if (desc) return keys.sort(function (a, b) { return aao[b] - aao[a] });
                else return keys.sort(function (a, b) { return aao[a] - aao[b] });
            } else {
                if (desc) return keys.sort(function (a, b) { return aao[b] < aao[a] ? 1 : aao[b] > aao[a] ? -1 : 0 });
                else return keys.sort(function (a, b) { return aao[a] < aao[b] ? 1 : aao[a] > aao[b] ? -1 : 0 });
            }
        }
    }

    getJobTypeTotals() {
        const bcTotals = this.jobs.reduce((total, bc) => {
            total["FULLTIME"] = total["FULLTIME"] || 0;
            total["CONTRACT"] = total["CONTRACT"] || 0;

            total[bc.jobType] = total[bc.jobType] || 0;
            total[bc.jobType] += 1;
            return total;
        }, {});

        return bcTotals;
    }

    getEmployerTypeTotals() {
        const bcTotals = this.jobs.reduce((total, bc) => {
            total["EMPLOYER"] = total["EMPLOYER"] || 0;
            total["AGENCY"] = total["AGENCY"] || 0;

            if (bc.employer === true) {
                total["EMPLOYER"] += 1;
            } else {
                total["AGENCY"] += 1;
            }
            return total;
        }, {});

        return bcTotals;
    }

    getLocationTypeTotals() {
        const bcTotals = this.jobs.reduce((total, bc) => {
            total["REMOTE"] = total["REMOTE"] || 0;
            total["NONREMOTE"] = total["NONREMOTE"] || 0;

            if (bc.remote === true) {
                total["REMOTE"] += 1;
            } else {
                total["NONREMOTE"] += 1;
            }
            return total;
        }, {});
        return bcTotals;
    }

    getDateTotals() {
        // for now hard wire three periods...last 24 hours, last 3 days, last 7 days, last 14 days.
        // I would like this to be user-determined

        const nowTime = new Date().getTime();
        const dateTotals = this.jobs.reduce((total, bc) => {
            const pd = new Date(bc.datePosted);
            total["ONEDAY"] = total["ONEDAY"] || 0;
            total["THREEDAY"] = total["THREEDAY"] || 0;
            total["SEVENDAY"] = total["SEVENDAY"] || 0;
            total["FOURTEENDAY"] = total["FOURTEENDAY"] || 0;

            let timeDiff = nowTime - pd.getTime();
            let dayDifference = Math.round(timeDiff / this.DAY);

            if (dayDifference == 0) {
                total["ONEDAY"] += 1;
            } else if (dayDifference <= 3) {
                total["THREEDAY"] += 1;
            } else if (dayDifference <= 7) {
                total["SEVENDAY"] += 1;
            } else if (dayDifference <= 14) {
                total["FOURTEENDAY"] += 1;
            }
            return total;
        }, {});
        return dateTotals;
    }

    printObjectProperties(obj) {
        var propValue;
        for (var propName in obj) {
            propValue = obj[propName]

            console.log(propName, propValue);
        }
    }

    filterByBlockchain(item) {
        return (this.jobs.filter(posting => posting.blockchainName === item));
    }

    filterByCompany(item) {
        console.log("looking for company " + item);
        return (this.jobs.filter(posting => posting.company === item));
    }

    filterByDate(item) {
        const nowTime = new Date().getTime();
        let days = parseInt(item);

        if (days == 1) {
            days = 0;
        }
        console.log("days = " + days);
        return (this.jobs.filter(posting => {
            const pd = new Date(posting.datePosted);
            let timeDiff = nowTime - pd.getTime();
            timeDiff = Math.round(timeDiff / this.DAY);
            return timeDiff <= days;
        }));
    }

    filterByEmployerType(item) {
        if (item === "EMPLOYER") {
            return (this.jobs.filter(posting => posting.employer === true));
        } else {
            return (this.jobs.filter(posting => posting.employer === false));
        }
    }

    filterByJobType(item) {
        console.log("item type = " + typeof item);
        return (this.jobs.filter(posting => posting.jobType === item));
    }

    filterByLocationType(item) {
        let var1 = false;
        if (item === "true") {
            var1 = true;
        }
        return (this.jobs.filter(posting => posting.remote === var1));
    }

    filterByLocation(item) {
        return (this.jobs.filter(posting => posting.location === item || posting.city === item));
    }

    filterByWhat(item) {
        return (this.jobs.filter(posting => posting.blockchainName.toUpperCase().includes(item.toUpperCase()) || posting.skills.includes(item) || posting.jobTitle.includes(item) || posting.company.includes(item)));
    }
}






