/**
 * Populates the jobseeker Registries with new token data
 * set the allowance to arg2 and the balance to arg3 
 * 
 */

const bnUtil = require('../bn-connection-util');

// const bnUtil = require('../bn-connection-util');
const namespace = 'io.onemillionyearsbc.hubtutorial';
const NSTOK = 'io.onemillionyearsbc.hubtutorial.tokens';

const transactionType = "CreateERC20Transaction";

bnUtil.cardName = 'admin@hubtutorial';
if (process.argv.length < 4) {
    console.log("Usage: node addTokensToJobSeekers   <balance> <allowance> ")
    process.exit(-1);
}
console.log("Amending Network using a card: ", bnUtil.cardName);

bnUtil.connect(main);

// Callback function passed to the BN Connection utility
// Error has value if there was an error in connect()
async function main() {
    let balance = process.argv[2];
    let allowance = process.argv[3]

    console.log("Updating Accounts...");

    // start();
    const bnDef = bnUtil.connection.getBusinessNetwork();
    const factory = bnDef.getFactory();

    var registry = await bnUtil.connection.getParticipantRegistry(namespace + '.HubJobSeeker');

    let options = {
        generate: false,
        includeOptionalFields: false
    }

    // Get the seeker for the given email
    console.log('Received Registry: ', registry.id);
    var seekers = await registry.getAll();

    console.log("GOT NUMBER OF SEEKERS: " + seekers.length);

    for (var i = 0; i < seekers.length; i++) {
        // for (var i = 0; i < 1; i++) {
        // create an ERC20Token with balance and allowance set
        // create an initial transaction in the transaction history
        let email = seekers[i].email;
        if (seekers[i].hubToken === undefined) {
            var token = factory.newResource(NSTOK, 'ERC20Token', email);
            token.balance = parseFloat(balance);
            token.allowance = parseFloat(allowance);

            seekers[i].hubToken = token;
            console.log("   -> new ERC20Token created for " + email + " with balance " + balance + " and allowance " + allowance);
        }
        if (seekers[i].history === undefined) {

            try {
                let transaction = factory.newTransaction(NSTOK, transactionType, "", options);
                balance = parseFloat(balance);

                transaction.setPropertyValue('newBalance', 0);
                transaction.setPropertyValue('email', email);
                transaction.setPropertyValue('type', "INITIAL");
                transaction.setPropertyValue('amount', balance);
                await bnUtil.connection.submitTransaction(transaction);
                seekers[i].history = new Array();
                seekers[i].history.push(transaction);
                console.log("   -> transaction history added for " + email);
            } catch (error) {
                console.log('Account update failed: ' + error);
            }

        }

        await registry.update(seekers[i]);
        console.log('Account ' + email + " update ok!");
    }
    console.log("All done. jobseeker accounts updated.");
    bnUtil.disconnect();
}






