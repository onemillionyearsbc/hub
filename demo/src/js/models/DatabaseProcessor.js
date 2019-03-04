
import { strings } from '../views/base';

export default class DatabaseProcessor {
    constructor(url) {
        this.url = url;
    }

    async transactionPut(data) {
        try {

            console.log("FIRING DATABASE TRANSACTION (PUT)...with following data");
            console.log(data);
            console.log("URL for database call = " + this.url);
            var resp = await fetch(this.url, {
                method: "POST",
                mode: "same-origin",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json"
                },
                body: data
            });
            
            var text = await resp.text();

            var obj = JSON.parse(text);

            var resp = obj.error;
            if (resp != undefined) {
                console.log(">>>>> error text = " + resp);
                throw resp;
            } else {
                // everything ok: print out the JSON properties received
                // for (var property in obj) {
                //     console.log(property + ": " + obj[property]);
                // }
            }
            return obj; // no error


        } catch (error) {
            console.log("+++++ PUT ERROR, err = " + error);
            throw error;
        }
    }

    async transactionGet() {
        try {

            console.log("FIRING DATABASE TRANSACTION (GET)...with following data");

            // fetch('http://localhost:8083/api.php', {
            //     method: 'get',
            //     // may be some code of fetching comes here
            // }).then(function(response) {
            //         if (response.status >= 200 && response.status < 300) {
            //             console.log("FUCK1");
            //             return response.text()
            //         }
            //         throw new Error(response.statusText)
            //     })
            //     .then(function(response) {
            //         console.log("FUCK2");
            //         console.log(response);
            //     })

            // var response = await fetch('http://localhost:8083/api.php', {
            //     method: 'get'
            // });
            // may be some code of fetching comes here

            var resp = await fetch('http://localhost:8083/api.php', { method: "get", })
            var text = await resp.text();
            console.log("FUCKETY WUCKETY DOODAH response = " + text);
            return resp;

        } catch (error) {
            var response = {};
            response.error = error;
            console.log("^^^^^^^^^^^CAUGHT ERROR, err = " + JSON.stringify(error));
            return response;
        }
    }

}



