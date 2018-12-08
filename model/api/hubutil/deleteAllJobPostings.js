/**
 * Composer 0.19.0
 * 
 * Utility method for cleaning up the flights
 */
const bnUtil = require('../bn-connection-util');
const participantNamespace = 'io.onemillionyearsbc.hub.participant';
const employerResourceName = 'Employer';
const developerResourceName = 'Developer';

bnUtil.cardName='admin@hub';
if(process.argv.length < 3){
    console.log("Usage: node deleteAllEmployersAndDevelopers   <card-name> ")
    console.log("Amending Network using a card: ",bnUtil.cardName);
} else {
    bnUtil.cardName = process.argv[2];
    console.log("Amandong Network using a card: ",bnUtil.cardName);
}
bnUtil.connect(removeEmployers);



function removeEmployers(){
    var registry = {}

    /*
    return bnUtil.connection.getAllParticipantRegistries().then((participantRegistry)=>{
        
        console.log('Received Registry: ', participantRegistry);

        bnUtil.disconnect();
    }).catch((error)=>{

        console.log(error);
        bnUtil.disconnect();
    });
    */
    
    return bnUtil.connection.getParticipantRegistry(participantNamespace+'.'+employerResourceName).then((reg)=>{
        registry = reg;

        console.log('Received Registry: ', registry.id);

        return registry.getAll();
    }).then((employers)=>{
        console.log('Retrieved employers : ', employers.length);
        // Utility method for removing the employers
        return registry.removeAll(employers)

    }).then(()=>{
        console.log("Removed all employers !!");
        return bnUtil.connection.getParticipantRegistry(participantNamespace+'.'+developerResourceName).then((reg)=>{
            registry = reg;
    
            console.log('Received Registry: ', registry.id);
    
            return registry.getAll();
        }).then((developers)=>{
            console.log('Retrieved developers : ', developers.length);
            // Utility method for removing the developers
            return registry.removeAll(developers)
    
        }).then(()=>{
    
            console.log("Removed all developers !!");
            
        }).catch((error)=>{

            console.log(error);
            bnUtil.disconnect();
        });
    }).then(() =>{
        console.log("really done!");
        return bnUtil.disconnect();
    }).catch((error)=>{

        console.log(error);
        bnUtil.disconnect();
    });
    
}