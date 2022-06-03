<?php
$hostName = 'localhost';
$userName = 'app_pacatos';
$userPassword = 'pth1506';
$databaseName = 'pacatosteahouse';
$mysql = new mysqli($hostName, $userName, $userPassword, $databaseName);
$mysql->set_charset('utf8');

if ($mysql == false) {
    die('Falha na conexão: ' . mysqli_connect_error());
}
