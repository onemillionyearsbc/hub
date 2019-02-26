'use strict';
/**
 * execute a named query to retrieve a Hub Account for the given user and password
 */
if(process.argv.length < 2){
    console.log("Usage: node getAllJobPostings" );
} else {   
    const bnUtil = require('../bn-connection-util');

    // #1 Connect to the airlinev8
    bnUtil.cardName='admin@hubtutorial';
    bnUtil.connect(main);

    async function main(error){
        
       
        let results = await bnUtil.connection.query('selectAllJobPostings', {
            
        });
    
        console.log("Number of results: " + results.length);
        console.log("----------------------");
        bnUtil.connection.disconnect();
    }
}