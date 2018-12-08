

/**
 * Create Recruiter Account Transaction. Create new participants and assets automtically.
 * @param {io.onemillionyearsbc.hubtutorial.CreateHubUser} userData
 * @transaction
 */

function CreateHubUser(userData) {
    var factory = getFactory();
    var NS = 'io.onemillionyearsbc.hubtutorial';

    // 1. create the HubRecruiter
    var recruiter = factory.newResource(NS, 'HubRecruiter', 'johndoe@ibm.com');
    recruiter.password = 'ChangeMe';
    recruiter.company = 'IBM';


    // usually it will be ...get registry, add new object
    // 2. Get the HubUser participant
    return getParticipantRegistry(NS + 'HubUser')
        .then(function(participantRegistry){
            return participantRegistry.addAll([recruiter])
        });
};
