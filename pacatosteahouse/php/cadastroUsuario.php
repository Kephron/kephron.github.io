<?php
require 'config.php';
require '../src/SenhaSegura.php';

header("Content-Type: application/json");

function informaStatusCode($statusCode, $msg)
{
    http_response_code($statusCode);
    $retorno = array('mensagem' => $msg);
    echo json_encode($retorno);
}

function validaCpf($cpf)
{
    $cpf = preg_replace('/[^0-9]/is', '', $cpf);

    if (strlen($cpf) != 11) {
        return false;
    }

    if (preg_match('/(\d)\1{10}/', $cpf)) {
        return false;
    }

    for ($t = 9; $t < 11; $t++) {
        for ($d = 0, $c = 0; $c < $t; $c++) {
            $d += $cpf[$c] * (($t + 1) - $c);
        }
        $d = ((10 * $d) % 11) % 10;
        if ($cpf[$c] != $d) {
            return false;
        }
    }
    return true;
}

function validaDataNascimento($data)
{
    $dataAtual = new DateTime();
    $dataNascimento = new DateTime($data);
    $diferencaTimestampData = $dataAtual->getTimestamp() - $dataNascimento->getTimestamp();
    $timestamp150Anos = 4730400000;

    if ($dataNascimento < $dataAtual && $diferencaTimestampData < $timestamp150Anos) {
        $dataFormatada = DateTime::createFromFormat('Y-m-d', $data);
        if ($dataFormatada && $dataFormatada->format('Y-m-d') === $data) {
            return true;
        }
    } else {
        return false;
    }
}

function validaTelefone($telefone)
{
    $codigoDDDValido = false;
    $codigoDDD = [
        11, 12, 13, 14, 15, 16, 17, 18, 19,
        21, 22, 24, 27, 28, 31, 32, 33, 34,
        35, 37, 38, 41, 42, 43, 44, 45, 46,
        47, 48, 49, 51, 53, 54, 55, 61, 62,
        64, 63, 65, 66, 67, 68, 69, 71, 73,
        74, 75, 77, 79, 81, 82, 83, 84, 85,
        86, 87, 88, 89, 91, 92, 93, 94, 95,
        96, 97, 98, 99
    ];
    $codigoDDDInserido = substr($telefone, 0, 2);

    for ($i = 0; $i < count($codigoDDD); $i++) {
        if ($codigoDDDInserido == $codigoDDD[$i]) {
            $codigoDDDValido = true;
            break;
        } else {
            $codigoDDDValido = false;
        }
    }
    $regex = "/^[1-9]{2}((9[5-9]\d{7})$|([0-5]\d{7})$)/";

    if ($codigoDDDValido && preg_match($regex, $telefone)) {
        return true;
    } else {
        return false;
    }
}

function validaEmail($email)
{
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return false;
    } else {
        return true;
    }
}

function validaSenha($senha)
{
    if (!preg_match('/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,20}$/', $senha)) {
        return false;
    } else {
        return true;
    }
}

$jsonConvertido = json_decode(file_get_contents('php://input'), true);

if (
    isset($jsonConvertido['nome'])
    && isset($jsonConvertido['sobrenome'])
    && isset($jsonConvertido['cpf'])
    && isset($jsonConvertido['data-nascimento'])
    && isset($jsonConvertido['genero'])
    && isset($jsonConvertido['telefone'])
    && isset($jsonConvertido['email'])
    && isset($jsonConvertido['senha'])
) {
    $nome = mysqli_real_escape_string($mysql, $jsonConvertido['nome']);
    $sobrenome = mysqli_real_escape_string($mysql, $jsonConvertido['sobrenome']);
    $cpf = mysqli_real_escape_string($mysql, $jsonConvertido['cpf']);
    $dataNascimento = mysqli_real_escape_string($mysql, $jsonConvertido['data-nascimento']);
    $genero = mysqli_real_escape_string($mysql, $jsonConvertido['genero']);
    $telefone = mysqli_real_escape_string($mysql, $jsonConvertido['telefone']);
    $email = mysqli_real_escape_string($mysql, $jsonConvertido['email']);
    $senha = mysqli_real_escape_string($mysql, $jsonConvertido['senha']);

    if (
        strlen($nome) >= 3
        && strlen($sobrenome) >= 3
        && validaCpf($cpf)
        && validaDataNascimento($dataNascimento)
        && validaTelefone($telefone)
        && validaEmail($email)
        && validaSenha($senha)
    ) {
        $senhaSegura = new SenhaSegura();
        $senhaEncriptada = $senhaSegura->encriptaSenha($senha);

        $clienteCpf = mysqli_query($mysql, "SELECT id_usuario FROM cliente WHERE cpf = '$cpf' LIMIT 1");
        $resultadoClienteCpf = mysqli_fetch_assoc($clienteCpf);

        if (isset($resultadoClienteCpf)) {
            informaStatusCode(409, 'CPF já cadastrado');
        } else {
            $clienteTelefone = mysqli_query($mysql, "SELECT id_usuario FROM cliente WHERE telefone = '$telefone' LIMIT 1");
            $resultadoClienteTelefone = mysqli_fetch_assoc($clienteTelefone);

            if (isset($resultadoClienteTelefone)) {
                informaStatusCode(409, 'Telefone já cadastrado');
            } else {
                $usuario = mysqli_query($mysql, "SELECT id_usuario, ativo FROM usuario WHERE email = '$email' LIMIT 1");
                $resultadoUsuario = mysqli_fetch_assoc($usuario);

                if (isset($resultadoUsuario) && $resultadoUsuario['ativo'] == 1) {
                    informaStatusCode(409, 'E-mail já cadastrado');
                } else if (isset($resultadoUsuario) && $resultadoUsuario['ativo'] != 1) {
                    informaStatusCode(409, 'E-mail já cadastrado e está bloqueado');
                } else {
                    $insereUsuario = mysqli_query($mysql, "INSERT INTO usuario (email, senha, dt_atualizacao) VALUES ('$email', '$senhaEncriptada', CURRENT_TIMESTAMP())");

                    $selecionaNovoIdUsuario = mysqli_query($mysql, "SELECT id_usuario FROM usuario WHERE email = '$email' && senha = '$senhaEncriptada'");
                    $resultadoNovoIdUsuario = mysqli_fetch_assoc($selecionaNovoIdUsuario);
                    $novoIdUsuario = $resultadoNovoIdUsuario['id_usuario'];

                    $insereCliente = mysqli_query($mysql, "INSERT INTO cliente (nome, sobrenome, cpf, dt_nascimento, genero, telefone, dt_atualizacao, id_usuario) VALUES ('$nome', '$sobrenome', '$cpf', '$dataNascimento', '$genero', '$telefone', CURRENT_TIMESTAMP(), '$novoIdUsuario')");

                    informaStatusCode(201, 'Cadastro realizado com sucesso');
                }
            }
        }
    } else {
        informaStatusCode(400, 'É preciso preencher todos os campos corretamente');
    }
} else {
    informaStatusCode(400, 'É necessário preencher todos os campos');
}
