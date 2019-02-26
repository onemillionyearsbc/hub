'use strict';
/**
 * execute a named query to retrieve a Hub Account for the given user and password
 */
if(process.argv.length < 3){
    console.log("Usage: node getHubUser  <user>")
} else {   
    const bnUtil = require('../bn-connection-util');
    const namespace = 'io.onemillionyearsbc.hubtutorial';
    const transactionType = "GetHubUser";

    // #1 Connect to the airlinev8
    bnUtil.cardName='admin@hubtutorial';
    bnUtil.connect(main);

    async function main(error){
        const  bnDef = bnUtil.connection.getBusinessNetwork();
        const  factory = bnDef.getFactory();
        
        let options = {
            generate: false,
            includeOptionalFields: false
        }
       
        let transaction = factory.newTransaction(namespace,transactionType,"",options);
    
        // Set up the properties of the transaction object
        transaction.setPropertyValue('email',`${process.argv[2]}`);
        // transaction.setPropertyValue('password', `${process.argv[3]}`);
  
        // Submit the transaction
        return bnUtil.connection.submitTransaction(transaction).then(()=>{
            console.log("Transaction processed: User Exists!")
    
            bnUtil.disconnect();
    
        }).catch((error)=>{
            // console.log(`No User found with credentials user: ${process.argv[2]}, password: ${process.argv[3]}`);
            console.log(`No User found with credentials user: ${process.argv[2]}`);
            bnUtil.disconnect();
        });
    }
}