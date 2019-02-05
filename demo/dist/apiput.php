<?php
    include("sql.php");

    xdebug_disable();
    error_reporting(0);

    $contentType = isset($_SERVER["CONTENT_TYPE"]) ? trim($_SERVER["CONTENT_TYPE"]) : '';

    function returnJSON($dec) {
        $arr = array('table' => $dec["table"], 'ssn' => $dec["ssn"], 'c' => $dec["state"], 'd' => $dec["zip"], 'e' => 5);
        echo json_encode($arr);
    }


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
//            returnJSON($decoded);
//            $sqlstatement = "insert into author
//            values('999-88-6002', 'Tosser', 'Lice',
//            '666 888-4444', '98 Dung Street', 'Swindon', 'CA', '88888')";
//            
//            doInsertSQLStatement($conn, $sqlstatement);
//            
            
//            $table = $decoded["table"];
//            $ssn = $decoded["ssn"];
//            $state = $decoded["state"];
//            $zip = $decoded["zip"];
//            $sqlstatement = "insert into ".$table." 
//            values('".$ssn."', 'Tosser2', 'Javier',
//            '666 888-4444', '98 Dung Street', 'Plymouth', '".$state."', '".$zip."')";
//            doSQLStatement($conn, $sqlstatement);
            
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