'use strict';
/**
 * execute a named query to retrieve a Hub Account for the given user and password
 */
if(process.argv.length < 4){
    console.log("Usage: node getHubAccount  <user> <password> ")
} else {   
    const bnUtil = require('../bn-connection-util');

    // #1 Connect to the airlinev8
    bnUtil.cardName='admin@hubtutorial';
    bnUtil.connect(main);

    async function main(error){
        console.log(`selectHubAccountByUserAndPassword(${process.argv[2]},${process.argv[3]})-`);
        let results = await bnUtil.connection.query('selectHubAccountByUserAndPassword', {
                "email": `${process.argv[2]}`,
                "password": `${process.argv[3]}`,
            });
        
        console.log("Number of results: " + results.length);
        console.log("--------------------------");
        if (results.length == 1) {
            console.log(results[0]);
        }
        
        bnUtil.connection.disconnect();
    }
}