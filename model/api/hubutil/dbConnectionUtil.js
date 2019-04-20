const mysql = require('mysql');

module.exports = {
    // Properties used for creating instance of the MySQL DB connection
  
    // Holds the Database Network Connection
    connection: {},

    // 1. This is the function that is called by the app
    connect : async function() {
        console.log("Connecting to SQL Database...");
            this.connection = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "hubdb"
        });
        this.connection.connect();
    },

    // 2. Disconnects the db connection
    disconnect : function() {
        this.connection.end();
    },
}
