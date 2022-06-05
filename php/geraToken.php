<?php
ini_set('date.timezone', 'America/Sao_paulo');

$token = md5(uniqid(rand(), true));
echo "Token: " . $token;

$timestampCriacao = time();
echo "\n\nData de criação: " . $timestampCriacao;
$dataCriacao = date('d/m/Y H:i:s', $timestampCriacao);
echo "\nData de criação: " . $dataCriacao;

$tempoValidade = 3600;

$timestampExpiracao = $timestampCriacao + $tempoValidade;
echo "\n\nData de expiração: " . $timestampExpiracao;
$dataExpiracao = date('d/m/Y H:i:s', $timestampExpiracao);
echo "\nData de expiração: " . $dataExpiracao;
