<?php

class Token
{
    public $token;
    public $dataExpiracao;

    function __construct(int $id)
    {
        ini_set('date.timezone', 'America/Sao_paulo');

        global $mysql;

        $procuraToken = mysqli_query($mysql, "SELECT * FROM access_token WHERE id_usuario = '$id'  AND data_expiracao >= current_timestamp() LIMIT 1");

        $resultado = mysqli_fetch_assoc($procuraToken);

        if (isset($resultado)) {
            $this->token = $resultado["token"];
            $dataExpiracao = new DateTime($resultado["data_expiracao"]);
            $this->dataExpiracao = $dataExpiracao->format('Y/m/d H:i:s');
        } else {
            $this->geraNovoToken($id);
        }
    }

    private function geraNovoToken(int $id): void
    {
        ini_set('date.timezone', 'America/Sao_paulo');

        global $mysql;

        $dataCriacao = new DateTime();
        $dataExpiracao = $dataCriacao->add(new DateInterval('PT3600S'));

        $this->token = md5(uniqid(rand(), true));
        $this->dataExpiracao = $dataExpiracao->format('Y/m/d H:i:s');

        mysqli_query($mysql, "INSERT INTO access_token (token, data_expiracao, id_usuario) VALUES ('$this->token', '$this->dataExpiracao', '$id')");
    }
}
