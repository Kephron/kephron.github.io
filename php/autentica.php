<?php
require './config.php';
require '../src/Token.php';
require '../src/Login.php';

header("Content-Type: application/json");

if (isset($_POST['email']) && isset($_POST['senha'])) {
    $usuario = mysqli_real_escape_string($mysql, $_POST['email']);
    $senha = mysqli_real_escape_string($mysql, $_POST['senha']);
    password_hash($senha, PASSWORD_DEFAULT);

    $resultadoUsuario = mysqli_query($mysql, "SELECT id, nome FROM usuario WHERE email = '$usuario' && senha = '$senha' LIMIT 1");

    $resultado = mysqli_fetch_assoc($resultadoUsuario);

    if (isset($resultado)) {
        $objToken = new Token($resultado["id"]);

        $usuarioLogado = new Login();
        $usuarioLogado->logado = true;
        $usuarioLogado->id = $resultado["id"];
        $usuarioLogado->nome = $resultado["nome"];
        $usuarioLogado->token = $objToken->token;
        $usuarioLogado->dataExpiracao = $objToken->dataExpiracao;

        echo json_encode($usuarioLogado);
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
