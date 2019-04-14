
import { elements, elementConsts,  getValueOfRadio, getSelectedOption, } from './base';

export const getFormData = (myemail) => {
    var el = form.querySelectorAll('input');
    var myData = {};

    for (var x = 0; x < el.length; x++) {
        var id = el[x].id;
        var value = el[x].value;
        myData[id] = value;
    };

    var data = {
        $class: strings.createAlertTransaction,
        email: myemail,
        alertCriteria: {
            $class: "io.onemillionyearsbc.hubtutorial.jobs.AlertCriteria",
            remote: getValueOfRadio("remote"),
            fulltime: getValueOfRadio("jobtype"),
            skills: getSkills(myData["skills"]),
            city: myData["city"],
            country: getSelectedOption(elements.personCountry),
            blockchainName: getSelectedOption(elements.blockchain)
        }
    };

    return data;
}


