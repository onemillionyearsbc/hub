const crypto = require('crypto');

import { dbelements, elementConsts } from '../views/base';
import DatabaseProcessor from './DatabaseProcessor';

export default class ImageLoader {

    constructor() {
        this.blob = undefined;
        this._PREVIEW_URL = undefined;
    }


    loadImage(afile) {
        // load the image and get the blob

        // allowed MIME types
        var mime_types = ['image/jpeg', 'image/png', 'application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/pdf'];

        console.log("file type = " + afile.type);

        // validate MIME
        if (mime_types.indexOf(afile.type) == -1) {
            throw Error('Error : Incorrect file type');
        }

        // validate file size
        if (afile.size > elementConsts.MAXIMAGESIZE) {
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
        return result;
    }

    async getCVFromDatabase (email, cvhash)  {
        var body = JSON.stringify({
            database: dbelements.databaseName,
            table: dbelements.databaseCVTable,
            email: email
        });
    
        const dp = new DatabaseProcessor(dbelements.databaseSelectCVUri);
    
        var result;
        try {
            result = await dp.transactionPut(body);
        } catch (error) {
           throw error;
        }
    
        if (result.length == 0) {
            console.log("WARNING: No cv found for email " + email);
            return;
        }
        if (result.length > 1) {
            throw ('Database select cv failed: number rows = ' + result.length);
        }
        const row0 = result[0];
        try {
            await this.checkHash(email, row0["image"], row0["hash"], cvhash);
        }
        catch (error) {
            throw error;
        }
        return row0["image"];
    }

    async getImageFromDatabase (jobReference, logohash)  {
        jobReference = Number(jobReference).toString();
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
            throw ('Database select image failed: number rows = ' + result.length);
        }
        const row0 = result[0];
        try {
            await this.checkHash(jobReference, row0["image"], row0["hash"], logohash);3
        }
        catch (error) {
            throw error;
        }
        return row0["image"];
    }

    async checkHash (id, image, dbhash, logohash) {
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
            throw ("HASH DISCREPANCY (id=" + id +"); hash from blockchain = " + bchash + "; hash of image from db = " + myhash);
        }
        if (dbhash !== bchash) {
            throw ("HASH DISCREPANCY (id=" + id +"); hash from blockchain = " + bchash + "; hash from db = " + dbhash);
        }
    }
}

