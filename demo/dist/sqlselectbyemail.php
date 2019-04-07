<?php
    include("sql.php");

    xdebug_disable();
    error_reporting(0);
   
    $contentType = isset($_SERVER["CONTENT_TYPE"]) ? trim($_SERVER["CONTENT_TYPE"]) : '';

    // echo "Hey there";

    $contentType = "application/json";

    if ($contentType === "application/json") {
        //Receive the RAW post data.
        $content = trim(file_get_contents("php://input"));

        $decoded = json_decode($content, true);

    
        //If json_decode failed, the JSON is invalid.
        if(! is_array($decoded)) {
            $arr = array('code' => 'ERROR: JSON decode failed');
            echo json_encode($arr);
        } else {
           
            $conn = connectToMySQL($decoded["database"]);
            if (!$conn) {
	           json_error('Could not connect to MySQL: ' . mysqli_connect_error());
            }
            
            $table = $decoded["table"];
            $email = $decoded["email"];

            if ($email != "") {
                $sqlstatement = "select image, hash from ".$table." where email = '".$email."'";
            }
           
            doSelectStatement($conn, $sqlstatement, $email);
        }
    } else {
        $arr = array('code' => 'ERROR oops');
        echo json_encode($arr);
    }
?>