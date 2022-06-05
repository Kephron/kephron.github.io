<?php
$hostName = 'localhost';
$userName = 'app_pacatos';
$userPassword = 'p@th1506';
$databaseName = 'pacatosteahouse';
$mysql = new mysqli($hostName, $userName, $userPassword, $databaseName);

/* check connection */
if ($mysql->connect_errno) {
    //printf("Connect failed: %s\n", $mysql->connect_error);
    header("Content-Type: application/json");

    http_response_code(500);
    $retorno = array('logado' => 0, 'mensagem' => 'Falha interna, contacte o administrador. Erro: ' . $mysql->connect_error);

    echo json_encode($retorno);
    exit();
}

$mysql->set_charset('utf8');
