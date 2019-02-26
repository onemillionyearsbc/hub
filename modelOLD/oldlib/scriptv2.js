/**
 * Create Recruiter Account Transaction. Create new participants and assets automtically.
 * @param {io.onemillionyearsbc.hubtutorial.CreateRecruiterAccount} accountData
 * @transaction
 */

function CreateRecruiterAccount(accountData) {
    var factory = getFactory();
    var NS = 'io.onemillionyearsbc.hubtutorial';

    // 1. create the HubRecruiter
    var recruiter = factory.newResource(NS, 'HubRecruiter', 'mike@apple.com');
    recruiter.password = 'ChangeMeSoon';
    recruiter.company = 'Apple';


    // usually it will be ...get registry, add new object
    // 2. Get the HubUser participant
    return getParticipantRegistry(NS + '.HubRecruiter')
        .then(function(participantRegistry){
            return participantRegistry.addAll([recruiter])
        });
};


/**
 * Create JobSeeker Account Transaction. Create new participants and assets automtically.
 * @param {io.onemillionyearsbc.hubtutorial.CreateJobSeekerAccount} accountData
 * @transaction
 */

function CreateJobSeekerAccount(accountData) {
    var factory = getFactory();
    var NS = 'io.onemillionyearsbc.hubtutorial';

    // 1. create the HubJobSeeker
    var seeker = factory.newResource(NS, 'HubJobSeeker', 'andy@hub.com');
    seeker.password = 'ChangeMe';

    // create address concept
    var seekerAddress = factory.newConcept(NS, 'Address');
    seekerAddress.street = "15 Hamworthy Road";
    seekerAddress.city = "Swindon";
    seekerAddress.postCode = "SN3 4JP";
    seekerAddress.country = "UK";

    seeker.address = seekerAddress;
   

    // create name concept
    var seekerName = factory.newConcept(NS, 'Name');
    seekerName.title = "MR";
    seekerName.firstName = "Andrew";
    seekerName.lastName = "Richardson";

    seeker.name = seekerName;


    // usually it will be ...get registry, add new object
    // 2. Get the HubUser participant
    return getParticipantRegistry(NS + '.HubJobSeeker')
        .then(function(participantRegistry){
            return participantRegistry.addAll([seeker])
        });
};

