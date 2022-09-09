<?php
require "config.php";

header("Content-Type: application/json");

function informaStatusCode($statusCode, $msg)
{
    http_response_code($statusCode);
    $retorno = array('mensagem' => $msg);
    echo json_encode($retorno);
}

function validaCep($cep)
{
    $caracteres = array("-", " ", "_", "*");
    $cepSomenteNumeros = str_replace($caracteres, "", $cep);
    $regex = "/^[0-9]{8}$/";
    if (preg_match($regex, $cepSomenteNumeros)) {
        return true;
    } else {
        return false;
    }
}

$jsonConvertido = json_decode(file_get_contents('php://input'), true);

if (
    isset($jsonConvertido['cep'])
    && isset($jsonConvertido['logradouro'])
    && isset($jsonConvertido['numero'])
    && isset($jsonConvertido['bairro'])
    && isset($jsonConvertido['cidade'])
    && isset($jsonConvertido['uf'])
    && isset($jsonConvertido['pais'])
) {
    $cep = mysqli_real_escape_string($mysql, $jsonConvertido['cep']);
    $logradouro = mysqli_real_escape_string($mysql, $jsonConvertido['logradouro']);
    $numero = mysqli_real_escape_string($mysql, $jsonConvertido['numero']);
    $complemento = mysqli_real_escape_string($mysql, $jsonConvertido['complemento']);
    $bairro = mysqli_real_escape_string($mysql, $jsonConvertido['bairro']);
    $cidade = mysqli_real_escape_string($mysql, $jsonConvertido['cidade']);
    $uf = mysqli_real_escape_string($mysql, $jsonConvertido['uf']);
    $pais = mysqli_real_escape_string($mysql, $jsonConvertido['pais']);

    if (
        validaCep($cep)
        && strlen($logradouro) <= 100
        && strlen($numero) <= 10
        && strlen($complemento) <= 40
        && strlen($bairro) <= 40
        && strlen($cidade) <= 40 && ctype_alpha($cidade)
        && strlen($uf) == 2 && ctype_alpha($uf)
        && strlen($pais) <= 50 && ctype_alpha($pais)
    ) {
        // $verificaToken = Token
        $gravaEndereco = mysqli_query($mysql, "INSERT INTO endereco (cep, logradouro, numero, complemento, bairro, cidade, uf, pais, dt_atualizacao) VALUES ('$cep', '$logradouro', '$numero', '$complemento', '$bairro', '$cidade', '$uf', '$pais', CURRENT_TIMESTAMP())");

        informaStatusCode(201, 'Cadastro realizado com sucesso');
    } else {
        informaStatusCode(400, 'É preciso preencher todos os campos corretamente');
    }
} else {
    InformaStatusCode(400, 'É necessário preencher todos os campos');
}
