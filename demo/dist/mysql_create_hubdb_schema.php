<?php
    include("sql.php");
   
    function getSQL()
    {
        $dbhub_all_sql = "
        DROP TABLE IF EXISTS company_logo;

        CREATE TABLE `company_logo` (
	       `id` INT NOT NULL,
	       `hash` CHAR(64) NOT NULL,
	       `image` MEDIUMTEXT   
        )";

        return $dbhub_all_sql;
    }

    $db = connectToMySQL('hubdb');

    //Load Hub database
    $dbhub_sql = getSQL();  //Retreive the entire SQL statement string

    $mySQLArray = explode(';', $dbhub_sql);  //Break up into individual SQL statements

    foreach ($mySQLArray as $element)
    {
        //print "<br>$element";
        $sqlstatement = trim($element);

        if ($sqlstatement != '')
        {
            $status = doSQLStatement($db, $sqlstatement);

            if ($status == 'error')
            {
                json_error(mysqli_error($db)." sql = ".$a_sql_string);
                break;
            }
        }
    }
?>

    