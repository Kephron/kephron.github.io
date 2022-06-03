<?php
require './config.php';

header("Content-Type: application/json");
//O campo usuário e senha preenchido entra no if para validar

if (isset($_POST['email']) && isset($_POST['senha'])) {
    $usuario = mysqli_real_escape_string($mysql, $_POST['email']);
    $senha = mysqli_real_escape_string($mysql, $_POST['senha']);
    password_hash($senha, PASSWORD_DEFAULT);

    // Buscar na tabela usuario o usuário que corresponde com os dados digitado no formulário
    $resultadoUsuario = mysqli_query($mysql, "SELECT TRUE logado, id, nome FROM usuario WHERE email = '$usuario' && senha = '$senha' LIMIT 1");
    $resultado = mysqli_fetch_assoc($resultadoUsuario);

    if (isset($resultado)) {
        echo json_encode($resultado);

        //Não foi encontrado um usuario na tabela usuário com os mesmos dados digitado no formulário
        //redireciona o usuario para a página de login
    } else {
        $retorno = array('logado' => 0, 'mensagem' => 'Usuário não encontrado');
        echo json_encode($retorno);
        // echo 'Email: ' . $usuario . '  ';
        // echo 'Senha: ' . $senha;
    }
} else {
    $retorno = array('logado' => 0, 'mensagem' => 'E-mail ou senha incorreto');
    echo json_encode($retorno);
    if (!isset($_POST['email'])) {
        echo 'Email: Nulo' . '  ';
    } else {
        echo $_POST['email'] . '  ';
    }
    if (!isset($_POST['senha'])) {
        echo 'Senha: Nulo';
    } else {
        echo 'Senha: ' . $_POST['senha'];
    }
}
