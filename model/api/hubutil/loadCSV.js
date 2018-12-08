
const csvFilePath = './data.csv';
const csv = require('csvtojson')

csv()
	.fromFile(csvFilePath)
	.then((jsonObj) => {
		
	})

// Async / await usage
async function start() {
	const jsonArray = await csv().fromFile(csvFilePath);
	// var obj = { a: 1, b: 2 };
	for (var key in jsonArray) {
		if (jsonArray.hasOwnProperty(key)) {
			var val = jsonArray[key];
			// console.log(`username = ${val.username}`);
		}
	}
}

start();
console.log("done!");
