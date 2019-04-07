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

            // put logo into company_logo
            if ($table == "company_logo") {
                $email = $decoded["email"];
                $id = $decoded["id"];
                $hash = $decoded["hash"];
                $image = $decoded["image"];
                $insert = $decoded["insert"];

                $sqlstatement = "insert into ".$table." 
                    values('".$email."','".$id."','".$hash."','".$image."')";
                    
                if ($insert == FALSE) {
                    $sqlstatement = "update ".$table." set hash='".$hash."',image='".$image."'  
                    where id = ".$id;
                }
            
                doInsertStatement($conn, $sqlstatement);
            } else {
                // put cv into profile_cv
                $email = $decoded["email"];
                $hash = $decoded["hash"];
                $image = $decoded["image"];
                $insert = $decoded["insert"];

                $sqlstatement = "insert into ".$table." 
                    values('".$email."','".$hash."','".$image."')";
                    
                if ($insert == FALSE) {
                    $sqlstatement = "update ".$table." set hash='".$hash."',image='".$image."'  
                    where email = '".$email."'";
                }
            
                doInsertStatement($conn, $sqlstatement);
            }
        }
    }
?>