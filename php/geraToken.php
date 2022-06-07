<?php
class Token
{
    public $token;
    public $dataExpiracao;
}

function geraToken(int $id): Token
{
    ini_set('date.timezone', 'America/Sao_paulo');

    global $mysql;

    $verificaToken = mysqli_query($mysql, "SELECT * FROM access_token WHERE id_usuario = '$id'  AND data_expiracao >= current_timestamp() LIMIT 1");

    if ($verificaToken === FALSE) {
        http_response_code(500);
        $retorno = array('logado' => 0, 'mensagem' => 'Falha interna, contacte o administrador. Erro: ' . mysqli_error($mysql));
        echo json_encode($retorno);
        exit();
    }

    $resultado = mysqli_fetch_assoc($verificaToken);

    $objToken = new Token();

    if (isset($resultado)) {
        $objToken->token = $resultado["token"];
        $objToken->dataExpiracao = $resultado["data_expiracao"];

        return $objToken;
    } else {
        $timestampExpiracao = time() + 3600;

        $objToken->token = md5(uniqid(rand(), true));
        $objToken->dataExpiracao =
            date('d/m/Y H:i:s', $timestampExpiracao);

        mysqli_query($mysql, "INSERT INTO access_token (token, id_usuario, data_expiracao) VALUES ('$objToken->token', '$id', from_unixtime('$timestampExpiracao'))");

        return $objToken;
    }
}
