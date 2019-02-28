
var fs = require('fs');
const crypto = require('crypto');
var toBlob = require('stream-to-blob')


function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}
// var base64str = base64_encode('./img/logo1.png');

 
toBlob(fs.createReadStream('./img/logo1.png'), function (err, blob) {
    if (err) return console.error(err.message)
        console.log(blob)
})
// console.log(blob);
// const myhash = crypto.createHash('sha256') // enables digest
//             .update(base64str) // create the hash
//             .digest('hex'); // convert to string

// console.log(myhash);
