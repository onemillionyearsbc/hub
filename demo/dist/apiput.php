<?php
    include("sql.php");

    xdebug_disable();
    error_reporting(0);

    $contentType = isset($_SERVER["CONTENT_TYPE"]) ? trim($_SERVER["CONTENT_TYPE"]) : '';

    if ($contentType === "application/json") {
        //Receive the RAW post data.
        $content = trim(file_get_contents("php://input"));

        $decoded = json_decode($content, true);
       
        //If json_decode failed, the JSON is invalid.
        if(! is_array($decoded)) {
            echo "ERROR: JSON decode failed";
        } else {
            $conn = connectToMySQL($decoded["database"]);
            if (!$conn) {
	           json_error('Could not connect to MySQL: ' . mysqli_connect_error());
            }
            
            $table = $decoded["table"];
            $id = $decoded["id"];
            $hash = $decoded["hash"];
            $image = $decoded["image"];

            $sqlstatement = "insert into ".$table." 
                values('".$id."','".$hash."','".$image."')";
            
            doSQLStatement($conn, $sqlstatement);
        }
    }
?>