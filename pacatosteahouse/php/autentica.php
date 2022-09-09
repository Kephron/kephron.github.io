<?php
require './config.php';
require '../src/Token.php';
require '../src/Login.php';
require '../src/SenhaSegura.php';

header("Content-Type: application/json");

$jsonConvertido = json_decode(file_get_contents('php://input'), true);

if (isset($jsonConvertido['email']) && isset($jsonConvertido['senha'])) {
    $email = mysqli_real_escape_string($mysql, $jsonConvertido['email']);
    $senha = mysqli_real_escape_string($mysql, $jsonConvertido['senha']);

    $usuario = mysqli_query($mysql, "SELECT id_usuario, ativo, senha FROM usuario WHERE email = '$email' LIMIT 1");
    $resultadoUsuario = mysqli_fetch_assoc($usuario);

    $senhaSegura = new SenhaSegura();
    $senhaVerificada = $senhaSegura->verificaSenha($senha, $resultadoUsuario['senha']);

    if (
        isset($resultadoUsuario['id_usuario'])
        && $resultadoUsuario['ativo'] == 1
        && $senhaVerificada
    ) {
        $idUsuario = $resultadoUsuario['id_usuario'];

        $cliente = mysqli_query($mysql, "SELECT nome FROM cliente WHERE id_usuario = '$idUsuario' LIMIT 1");
        $resultadoCliente = mysqli_fetch_assoc($cliente);
        $nomeCliente = $resultadoCliente['nome'];

        $objToken = new Token($idUsuario);

        $usuarioLogado = new Login();
        $usuarioLogado->logado = true;
        $usuarioLogado->id_usuario = $idUsuario;
        $usuarioLogado->nome = $nomeCliente;
        $usuarioLogado->token = $objToken->token;
        $usuarioLogado->dataExpiracao = $objToken->dataExpiracao;

        echo json_encode($usuarioLogado);
    } else if ((isset($resultadoUsuario['id_usuario']) && $resultadoUsuario['ativo'] != 1)) {
        http_response_code(403);
        $retorno = array('logado' => 0, 'mensagem' => 'Usuário bloqueado');
        echo json_encode($retorno);
    } else {
        http_response_code(401);
        $retorno = array('logado' => 0, 'mensagem' => 'E-mail ou senha incorreto');
        echo json_encode($retorno);
    }
} else {
    http_response_code(401);
    $retorno = array('logado' => 0, 'mensagem' => 'E-mail ou senha incorreto');
    echo json_encode($retorno);
}

$mysql->close();
