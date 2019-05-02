<?php
    include("sql.php");
   
    function getSQL()
    {
        $dbhub_all_sql = "
        DROP TABLE IF EXISTS company_logo;

        CREATE TABLE `company_logo` (
            `email` VARCHAR(100) NOT NULL,
            `id` INT(11) NOT NULL,
            `hash` CHAR(64) NOT NULL,
            `image` LONGTEXT NOT NULL,
            INDEX `key_email` (`email`),
            PRIMARY KEY (`id`)
        );

        DROP TABLE IF EXISTS `profile_cv`;

        CREATE TABLE `profile_cv` (
            `email` VARCHAR(100) NOT NULL,
            `hash` CHAR(64) NOT NULL,
            `image` LONGTEXT NOT NULL,
            INDEX `key_email` (`email`),
            PRIMARY KEY(`email`)
        )
        ";
        return $dbhub_all_sql;
    }

    $db = connectToMySQL('hubdb');

    //Load Hub database
    $dbhub_sql = getSQL();  //Retreive the entire SQL statement string

    $mySQLArray = explode(';', $dbhub_sql);  //Break up into individual SQL statements

    foreach ($mySQLArray as $element)
    {
        $sqlstatement = trim($element);

        if ($sqlstatement != '')
        {
            $status = doInsertStatement($db, $sqlstatement);

            if ($status == 'error')
            {
                json_error(mysqli_error($db)." sql = ".$a_sql_string);
                break;
            }
        }
    }
?>

    