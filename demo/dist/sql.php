 <?php
    function connectToMySQL($db) {
        $mysqli = new mysqli('127.0.0.1', 'root', '', $db);

        if ($mysqli->connect_error) {
            json_error("SQL Connect Error: ".$mysqli->connect_errno." ".$mysqli->connect_error);
        }
        return $mysqli;
    }

    function json_error($msg) {
        header('HTTP/1.1 500 ' . $msg);
        die(json_encode(array('error' => $msg)));
    }

    function doInsertStatement($conn, $a_sql_string)
    {
        $result = mysqli_query($conn, $a_sql_string);

        if ($result) {
            $arr = array('code' => 'ok');
            echo json_encode($arr);
        } else {
            json_error(mysqli_error($conn)." sql = ".$a_sql_string);
        }
    }

    function doSelectStatement($conn, $a_sql_string, $id)
    {
        $sql =  $a_sql_string;
        $result = $conn->query($sql);

        
        $arr = array();
        if ($result->num_rows > 0) {
            // output data of each row
            while($row = $result->fetch_assoc()) {
                $arr[] = $row;
            }
            echo json_encode($arr);
        } else {
            json_error("No image found for id ".$id);
        }
    }


?>