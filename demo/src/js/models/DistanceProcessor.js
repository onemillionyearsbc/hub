
const proxy = 'https://cors-anywhere.herokuapp.com/';


// Passed to function:                                                    
//    lat1, lon1 = Latitude and Longitude of point 1 (in decimal degrees)  
//    lat2, lon2 = Latitude and Longitude of point 2 (in decimal degrees)  
//    unit = the unit                             
//           where: 'M' is statute miles (default)                         
//                  'K' is kilometers                                      
//                  'N' is nautical miles                                  
//                                                

function distance(lat1, lon1, lat2, lon2, unit) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return dist;
	}
}

async function getResults() {
    try {
        let res = await axios(`${proxy}https://www.distance24.org/route.json?stops=Swindon`);
    
        let long1 = parseFloat(res["data"].stops[0].longitude);
        let lat1 = parseFloat(res["data"].stops[0].latitude);
        res = await axios(`${proxy}https://www.distance24.org/route.json?stops=Chippenham`);

        let long2 = parseFloat(res["data"].stops[0].longitude);
        let lat2 = parseFloat(res["data"].stops[0].latitude);

        console.log(long1, lat1, long2, lat2);
        console.log("The distance between these two points is: " + distance(long1, lat1, long2, lat2) + " miles");
    } catch (error) {
        console.log(error);
    }
}

