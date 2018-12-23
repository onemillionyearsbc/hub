
import { strings } from '../views/base';

export default class SignIn {
    constructor(data, url) {
        this.email = data.email;
        this.data = JSON.stringify(data);
        this.url = url;
    }

    async userSignIn() {
        try {
            // TODO call correct Hub transaction for either recruiter or jobseeker
            // TODO move URL into constants file
        
            const myData = this.data;
            console.log("REGISTERING DATA:");
            console.log(myData);
            var response = await fetch(this.url,
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

    getEmail() {
        return this.email;
    }
}
