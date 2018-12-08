/**
 * Composer 0.20.1
 * 
 * Utility method for cleaning up the flights
 */
const bnUtil = require('../bn-connection-util');
const participantNamespace = 'io.onemillionyearsbc.hubtutorial';
const recruiterResourceName = 'HubRecruiter';
const seekerResourceName = 'HubJobSeeker';

bnUtil.cardName='admin@hubtutorial';
if(process.argv.length < 3){
    console.log("Usage: node deleteAllHubUsers   <card-name> ")
    console.log("Amending Network using a card: ",bnUtil.cardName);
} else {
    bnUtil.cardName = process.argv[2];
    console.log("Amending Network using a card: ",bnUtil.cardName);
}
bnUtil.connect(removeRecruitersAndJobSeekers);



function removeRecruitersAndJobSeekers(){
    var registry = {}

    return bnUtil.connection.getParticipantRegistry(participantNamespace+'.'+recruiterResourceName).then((reg)=>{
        registry = reg;

        console.log('Received Registry: ', registry.id);

        return registry.getAll();
    }).then((recruiters)=>{
        console.log('Retrieved recruiters : ', recruiters.length);
        // Utility method for removing the recruiters
        return registry.removeAll(recruiters)

    }).then(()=>{
        console.log("Removed all recruiters !!");
        return bnUtil.connection.getParticipantRegistry(participantNamespace+'.'+ seekerResourceName).then((reg)=>{
            registry = reg;
    
            console.log('Received Registry: ', registry.id);
    
            return registry.getAll();
        }).then((seekers)=>{
            console.log('Retrieved jobSeekers : ', seekers.length);
            // Utility method for removing the seekers
            return registry.removeAll(seekers)
    
        }).then(()=>{
    
            console.log("Removed all jobSeekers !!");
            
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