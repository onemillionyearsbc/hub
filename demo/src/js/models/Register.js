import { strings } from '../views/base';

export default class Register {
    constructor(data) {
        this.data = JSON.stringify(data);
    }

    async registerNewAccount() {
        try {
            // TODO call correct Hub transaction for either recruiter or jobseeker
            // TODO move URL into constants file
            const url = strings.registerRecruiterUrl;
            const myData = this.data;
            console.log("REGISTERING DATA:");
            console.log(myData);
            var response = await fetch(url,
                {
                    method: 'post',
                    headers: { 'Content-type': 'application/json' },
                    body: myData
                });

            var resp = await response.json();
            var payload = resp.error;

            if (resp.error !== undefined) {
                return payload;
            }
            else {
                return null;
            }


        } catch (error) {
            return error;
        }
    }
}
