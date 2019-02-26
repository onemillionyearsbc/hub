'use strict';
/*
 * Interrogate the flight registry
 * 
 */

// Need the card store instance
const FileSystemCardStore = require('composer-common').FileSystemCardStore;
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
// Used as the card for all calls
var cardName = "admin@airlinev8";
const   registryId = "org.acme.airline.flight.Flight";

// 1. Create instance of file system card store
const cardStore = new FileSystemCardStore();
// 2. Connection object for the fabric
const cardStoreObj = { cardStore: cardStore };
const bnConnection = new BusinessNetworkConnection(cardStoreObj);

// 3. Initiate a connection
return bnConnection.connect(cardName).then(function(){
    console.log("Connected Successfully!!!");
    // 4. Display the name and version of the network app
    getBusinessNetwork();

    
    // Get all assets in flight registry
    getFlightRegistryAssets();

}).catch((error)=>{
    console.log(error);
});


// Extracts information about the network
function getBusinessNetwork(){
    // Returns an object of type BusinessNetworkDefinition
    let businessNetworkDefinition = bnConnection.getBusinessNetwork();
    // Dump package.json to the console
    console.log("Connected to: ",businessNetworkDefinition.metadata.packageJson.name,
                "  version ",businessNetworkDefinition.metadata.packageJson.version);
}

// Get all the Asset from a registry Registry
// 1. Get an instance of the AssetRegistry
// 2. Get all he objects in the asset registry
function getFlightRegistryAssets(){
    
    return bnConnection.getAssetRegistry(registryId).then(function(registry){
        console.log("Received the Registry Instance: ", registryId)

        // This would get a collection of assets
        return registry.getAll().then(function(resourceCollection){
            console.log("Received count=",resourceCollection.length)
        });

    }).catch(function(error){
        console.log(error);
    });
}

// function update