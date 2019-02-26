

class ImageLoader {

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
   
}

module.exports = ImageLoader;