<?php
require './config.php';
require './geraToken.php';

header("Content-Type: application/json");

class Login
{
    public $logado;
    public $id;
    public $nome;
    public $token;
    public $dataExpiracao;
}

if (isset($_POST['email']) && isset($_POST['senha'])) {
    $usuario = mysqli_real_escape_string($mysql, $_POST['email']);
    $senha = mysqli_real_escape_string($mysql, $_POST['senha']);
    password_hash($senha, PASSWORD_DEFAULT);

    $resultadoUsuario = mysqli_query($mysql, "SELECT id, nome FROM usuario WHERE email = '$usuario' && senha = '$senha' LIMIT 1");

    if ($resultadoUsuario === FALSE) {
        http_response_code(500);
        $retorno = array('logado' => 0, 'mensagem' => 'Falha interna, contacte o administrador. Erro: ' . mysqli_error($mysql));
        echo json_encode($retorno);
        exit();
    }

    $resultado = mysqli_fetch_assoc($resultadoUsuario);

    if (isset($resultado)) {
        $objToken = geraToken($resultado["id"]);

        $usuarioLogado = new Login();
        $usuarioLogado->logado = 1;
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
