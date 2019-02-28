
import { strings } from '../views/base';

export default class TransactionProcessor {
    constructor(data, url) {
        this.email = data.email;
        this.data = JSON.stringify(data);
        console.log(data);
        this.url = url;
    }

    async transaction() {
        try {
            const myData = this.data;
            console.log("FIRING TRANSACTION...with following data");
            console.log(myData);
            console.log("BARKINGTON: URL = " + this.url);
            var response = await fetch(this.url,
                {
                    method: 'post',
                    headers: { 'Content-type': 'application/json' },
                    body: myData
                });
            console.log("response = " + response);
            var resp = await response.json();

            return resp;

        } catch (error) {
            var response = {};
            response.error = error;
            console.log("^^^^^^^^^^^CAUGHT ERROR, err = " + response.error);
            return response;
        }
    }

    getEmail() {
        return this.email;
    }
}
