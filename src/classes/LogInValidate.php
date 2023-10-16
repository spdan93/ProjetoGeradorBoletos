<?php

function getInSite() {
    $parameters = $_POST["data"];

    $hostname="127.0.0.1";
	$username="root";
	$password="rootAdmin";
	$dbname="databases";
    $port=3306;
	$usertable="usuarios";
    $socket="/var/run/mysqld/mysqld.sock";
	
	$con = mysqli_connect($hostname,$username, $password, $dbname, $port);

    if (mysqli_connect_errno())
    {
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
        exit();
    }

    $user = $parameters["user"];
    $pass = $parameters["pass"];
	
	$query = "SELECT * FROM `$usertable` where `user` = '$user' and `pass` = '$pass'";
	
	$result = mysqli_query($con, $query);

    echo $result;
	
	if($result) {
        $obj = [
            "status"=> "success",
            "value" => true,
            "token" => generateRandomString()
        ];
        echo json_encode($obj);
    } else {
        $obj = [
            "status"=> "error",
            "value" => false
        ];
        echo json_encode($obj);
    }
}

function generateRandomString($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[random_int(0, $charactersLength - 1)];
    }
    return $randomString;
}

getInSite();