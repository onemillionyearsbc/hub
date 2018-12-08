/**
 * Composer 0.20.1
 * 
 * Utility method for cleaning up the hub accounts
 */
const bnUtil = require('../bn-connection-util');
const assetNamespace = 'io.onemillionyearsbc.hubtutorial';
const accountResourceName = 'HubAccount';


bnUtil.cardName='admin@hubtutorial';
if(process.argv.length < 3){
    console.log("Usage: node deleteAllHubAccounts   <card-name> ")
    console.log("Amending Network using a card: ",bnUtil.cardName);
} else {
    bnUtil.cardName = process.argv[2];
    console.log("Amending Network using a card: ",bnUtil.cardName);
}
// bnUtil.connect(removeRecruitersAndJobSeekers);
bnUtil.connect(removeAllAccounts);



function removeAllAccounts(){
    var registry = {}
    
    return bnUtil.connection.getAssetRegistry(assetNamespace+'.'+ accountResourceName).then((reg)=>{
        registry = reg;

        console.log('Received Registry: ', registry.id);

        return registry.getAll();
    }).then((accounts)=>{
        console.log('Retrieved Hub accounts : ', accounts.length);
        // Utility method for removing the accounts
        return registry.removeAll(accounts)
    }).then(() =>{
        console.log("removed all accounts!");
        return bnUtil.disconnect();
    }).catch((error)=>{
        console.log(error);
        bnUtil.disconnect();
    });
    
}