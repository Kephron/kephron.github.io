<?php

class Token
{
    public $token;
    public $dataExpiracao;

    function __construct(int $idUsuario)
    {
        ini_set('date.timezone', 'America/Sao_paulo');

        global $mysql;

        $procuraToken = mysqli_query($mysql, "SELECT * FROM token_acesso WHERE id_usuario = '$idUsuario'  AND dt_expiracao >= current_timestamp() LIMIT 1");

        $resultado = mysqli_fetch_assoc($procuraToken);

        if (isset($resultado)) {
            $this->token = $resultado["token"];
            $dataExpiracao = new DateTime($resultado["dt_expiracao"]);
            $this->dataExpiracao = $dataExpiracao->format('Y/m/d H:i:s');
        } else {
            $this->geraNovoToken($idUsuario);
        }
    }

    private function geraNovoToken(int $idUsuario): void
    {
        ini_set('date.timezone', 'America/Sao_paulo');

        global $mysql;

        $dataCriacao = new DateTime();
        $dataExpiracao = $dataCriacao->add(new DateInterval('PT3600S'));

        $this->token = md5(uniqid(rand(), true));
        $this->dataExpiracao = $dataExpiracao->format('Y/m/d H:i:s');

        mysqli_query($mysql, "INSERT INTO token_acesso (token, dt_expiracao, id_usuario) VALUES ('$this->token', '$this->dataExpiracao', '$idUsuario')");
    }
}
