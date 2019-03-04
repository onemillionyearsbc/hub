const crypto = require('crypto');

import { dbelements } from '../views/base';
import DatabaseProcessor from './DatabaseProcessor';


export default class ImageLoader {

    constructor() {
        this.blob = undefined;
        this._PREVIEW_URL = undefined;
    }


    loadImage(afile) {
        // load the image and get the blob

        // allowed MIME types
        var mime_types = ['image/jpeg', 'image/png'];

        // validate MIME
        if (mime_types.indexOf(afile.type) == -1) {
            throw Error('Error : Incorrect file type');
        }

        // validate file size
        if (afile.size > 2 * 1024 * 1024) {
            throw Error('Error : Exceeded size 2MB');
        }

        // validation is successful
        this._PREVIEW_URL = URL.createObjectURL(afile);

        console.log("_PREVIEW_URL = " + this._PREVIEW_URL);

        return this._PREVIEW_URL;
    }

    async getBlob() {
        var ablob = await this.createBlob(this._PREVIEW_URL);
    
        var reader = new FileReader();

        await reader.readAsDataURL(ablob);

        const result = await new Promise((resolve, reject) => {
            reader.onloadend = function() {
                resolve(reader.result)
            }
          })
        
        return result;
    }

    async createBlob(url) {
        // CREATE BLOB FROM LOGO url
        var response = await fetch(url);
        var myblob = await response.blob();
        return myblob;
    }
   
    async getAllImagesFromDatabase ()  {
        var body = JSON.stringify({
            database: dbelements.databaseName,
            table: dbelements.databaseTable,
            id: ""
        });
    
        const dp = new DatabaseProcessor(dbelements.databaseSelectUri);
    
        var result;
        try {
            result = await dp.transactionPut(body);
        } catch (error) {
           throw error;
        }
    
        if (result.length == 0) {
            throw error("No logos found! ");
        }
        // if (result.length > 1) {
        //     throw error('Database select image failed: number rows = ' + result.length);
        // }
        // const row0 = result[0];
        // try {
        //     // await this.checkHash(row0["image"], row0["hash"], logohash);
        //     // console.log("id: " + jobReference + " => HASHES EQUAL!");
        //     console.log("OINKINGTON ROWS = " + result.length);
        // }
        // catch (error) {
        //     console.log("BUGGER error = " + error);
        //     throw error;
        // }
        // return row0["image"];
        return result;
    }
    async getImageFromDatabase (jobReference, logohash)  {
        var body = JSON.stringify({
            database: dbelements.databaseName,
            table: dbelements.databaseTable,
            id: jobReference
        });
    
        const dp = new DatabaseProcessor(dbelements.databaseSelectUri);
    
        var result;
        try {
            result = await dp.transactionPut(body);
        } catch (error) {
           throw error;
        }
    
        if (result.length == 0) {
            console.log("WARNING: No logo found for id " + jobReference);
            return;
        }
        if (result.length > 1) {
            throw error('Database select image failed: number rows = ' + result.length);
        }
        const row0 = result[0];
        try {
            await this.checkHash(row0["image"], row0["hash"], logohash);3
        }
        catch (error) {
            throw error;
        }
        return row0["image"];
    }

    async checkHash (image, dbhash, logohash) {
        // get hash from blockchain
        // hash the image again...
        // 1. compare with hash from db
        // 2. compare with hash from blockchain
        const myhash = crypto.createHash('sha256') // enables digest
            .update(image) // create the hash
            .digest('hex'); // convert to string
    
        const bchash = logohash;
       
    
        // TODO move swal stuff into separate file (and hash crypto code)
        if (myhash !== bchash) {
            throw error("HASH DISCREPANCY; hash from blockchain = " + bchash + "; hash of image from db = " + myhash);
        }
        if (dbhash !== bchash) {
            throw error("HASH DISCREPANCY; hash from blockchain = " + bchash + "; hash from db = " + dbhash);
        }
    }
}

