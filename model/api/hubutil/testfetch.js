const fetch = require('node-fetch');

function distance(lat1, lon1, lat2, lon2, unit) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    }
    else {
        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var theta = lon1 - lon2;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit == "K") { dist = dist * 1.609344 }
        if (unit == "N") { dist = dist * 0.8684 }
        return dist;
    }
}

async function getGithubData() {
    let data = await fetch('https://www.distance24.org/route.json?stops=Swindon');
    let main = await data.json();

    let long1 = main.stops[0].longitude;
    let lat1 = main.stops[0].latitude;
    console.log(long1, lat1);

    data = await fetch(`https://www.distance24.org/route.json?stops=Chippenham`);
    main = await data.json();

    let long2 = main.stops[0].longitude;
    let lat2 = main.stops[0].latitude;

    console.log(long1, lat1, long2, lat2);
    console.log("The distance between these two points is: " + distance(long1, lat1, long2, lat2) + " miles");
}

getGithubData();
