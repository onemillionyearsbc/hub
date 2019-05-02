/**
 * Populates the ERC20Token Supply Registry with initial data
 * 
 * Composer 0.21.0
 */


const bnUtil = require('../bn-connection-util');

const NSTOK = 'io.onemillionyearsbc.hubtutorial.tokens';
const assetName = 'ERC20TokenSupply';
bnUtil.cardName = 'admin@hubtutorial';

try {
    bnUtil.connect(main);
} catch (error) { }


// Callback function passed to the BN Connection utility
// Error has value if there was an error in connect()
async function main() {

    // start();
    const bnDef = bnUtil.connection.getBusinessNetwork();
    const factory = bnDef.getFactory();


    var registry = await bnUtil.connection.getAssetRegistry(NSTOK + '.'
        + assetName)

    console.log('Received Registry: ', registry.id);

    try {
        let newAsset = factory.newResource(NSTOK, assetName, "hub");
        newAsset.supply = 0;
        newAsset.totalMinted = 0;
        await registry.addAll([newAsset]);
        console.log("ERC20TokenSupply for token 'hub' created with initial amount 0");
    } catch (error) {
        console.log('ERC20TokenSupply creation failed: ' + error);
    }
    console.log("All done.");
    bnUtil.disconnect();
}