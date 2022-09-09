<?php

class SenhaSegura
{
    private $opcoesArgon2id = ['memory_cost' => 1024, 'time_cost' => 5, 'threads' => 2];

    public function encriptaSenha(string $senha)
    {
        $senhaCodificada = password_hash($senha, PASSWORD_ARGON2ID, $this->opcoesArgon2id);
        $separaString = explode('$', $senhaCodificada, 5);
        $somenteHashSenha = $separaString[4];
        return $somenteHashSenha;
    }

    public function verificaSenha(string $senha, string $hash)
    {
        $concatenaHash = '$argon2id$v=19$m=' . $this->opcoesArgon2id['memory_cost'] . ',t=' . $this->opcoesArgon2id['time_cost'] . ',p=' . $this->opcoesArgon2id['threads'] . '$' . $hash;
        $senhaVerificada = password_verify($senha, $concatenaHash);
        return $senhaVerificada;
    }
}
