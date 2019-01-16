
import { strings } from '../views/base';

export default class SignInOrOut {
    constructor(data, url) {
        this.email = data.email;
        this.data = JSON.stringify(data);
        this.url = url;
    }

    async userSignInOut() {
        try {
            const myData = this.data;
            console.log("LOGGING IN OR OUT...with following data");
            console.log(myData);
            var response = await fetch(this.url,
                {
                    method: 'post',
                    headers: { 'Content-type': 'application/json' },
                    body: myData
                });
            console.log("response = " + response);
            var resp = await response.json();
            var payload = resp.error;

            if (resp.error !== undefined) {
                console.log(resp.error);
            }
            else {
                // return null;
            }
            return resp;

        } catch (error) {
            var response = {};
            response.error = error;
            console.log(">>>>>>>> err = " + response.error);
            return response;
        }
    }

    getEmail() {
        return this.email;
    }
}
