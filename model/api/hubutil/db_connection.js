const mysql = require('mysql');
const crypto = require('crypto');
const fs = require('fs');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "hubdb"
});
con.connect();


var imageAsBase64 = fs.readFileSync('./img/ibm.txt', 'UTF-8');
// const blob = 
// console.log(imageAsBase64);

const myhash = crypto.createHash('sha256') // enables digest
    .update(imageAsBase64) // create the hash
    .digest('hex'); // convert to string


console.log("hash = " + myhash);

// var sql = `INSERT INTO company_logo (email, id, hash, image) VALUES ('idiot@nonsense.com', 12345679, '362e20d31352308c3d418150f436b74c298014b9e3690bf36438145edc107a97', 'this is a test')`;
// con.query(sql, function(err, rows, fields) {
//     if (!err)
//       console.log('dbwrite succeeded');
//     else
//       console.log('Error while performing Query.');
//   });

con.end();

