/**
 * BusinessNetworkDefinition
 * https://hyperledger.github.io/composer/latest/api/common-businessnetworkdefinition
 * 
 * Shows how to create an archive from a Directory
 * 
 */
const BusinessNetworkDefinition = require('composer-common').BusinessNetworkDefinition;
const fs = require('fs');

var bnaDirectory = "./temp/test-bna";

BusinessNetworkDefinition.fromDirectory(bnaDirectory).then(function(definition){
    console.log(definition);
    return definition.toArchive();
}).then((buffer)=>{
    console.log("Received zip buffer")
    fs.writeFile("./temp/test.zip",buffer,(err)=>{
        console.log(err)
    })
});