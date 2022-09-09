<?php
/**
 * API de envio de mensagem de contato por e-mail
 * 
 * 
 * Abaixo segue exemplo envio da requisição:
 * 
 * 
 *"
 * curl --location --request POST 'http://localhost/pacatosteahouse/php/contato.php' \
 *--header 'Content-Type: application/json' \
 *--data-raw '{
 *    "nomeSobrenome" : "Nome",
 *    "telefone" : "(11) 9999999",
 *    "email" : "email@gmail.com",
 *    "mensagem": "teste",
 *    "contatoPreferencia": "email",
 *    "permiteEmailNovidades" : "Sim" }'
 *    
 *
 * 
 */

use LDAP\Result;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

//Create an instance; passing `true` enables exceptions
$mail = new PHPMailer(true);

header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    //Caso não enviar usando o método POST retorna erro 405-Method Not Allowed
    http_response_code(405);
    exit;
}

// Takes raw data from the request
$json = file_get_contents('php://input');

// Converts it into a PHP object
$contato = json_decode($json);


class LogSmtp
{
    public $dataHora;
    public $debugLevel;
    public $mensagem;
}

class Retorno
{
    public $sucesso = false;
    public $message;
    public $logSmtp = array();
}


$retorno = new Retorno();

if (!isset($contato)) {
    http_response_code(400);
    $retorno->message = "Os campos obrigatórios não foram informados!";
    echo json_encode($retorno);
    exit;
}

if (!isset($contato->nomeSobrenome) || trim($contato->nomeSobrenome)==="") {
    http_response_code(400);
    $retorno->message = "O nome e sobrenome não foram informados!";
    echo json_encode($retorno);
    exit;
}

if (!isset($contato->telefone) || trim($contato->telefone)==="") {
    http_response_code(400);
    $retorno->message = "O telefone não foi informado!";
    echo json_encode($retorno);
    exit;
}

if (!isset($contato->email) || trim($contato->email)==="") {
    http_response_code(400);
    $retorno->message = "O email não foi informado!";
    echo json_encode($retorno);
    exit;
}

if (!isset($contato->mensagem) || trim($contato->mensagem)==="") {
    http_response_code(400);
    $retorno->message = "A mensagem de contato não foi preenchida!";
    echo json_encode($retorno);
    exit;
}

if (!isset($contato->contatoPreferencia)) {
    http_response_code(400);
    $retorno->message = "A prereência de contato não foi preenchida!";
    echo json_encode($retorno);
    exit;
}

if (!isset($contato->permiteEmailNovidades)) {
    http_response_code(400);
    $retorno->message = "O campo permite receber e-mails com novidades não foi preenchido!";
    echo json_encode($retorno);
    exit;
}


function validaEmail($mail){
	if(preg_match("/^([[:alnum:]_.-]){3,}@([[:lower:][:digit:]_.-]{3,})(.[[:lower:]]{2,3})(.[[:lower:]]{2})?$/", $mail)) {
		return true;
	}else{
		return false;
	}
}

if (!validaEmail($contato->email)) {
    http_response_code(400);
    $retorno->message = "O email informado não é válido!".$contato->email;
    echo json_encode($retorno);
    exit;
}

$logSmtp = array();

try {
    //Server settings
    $mail->SMTPDebug = SMTP::DEBUG_SERVER;                      //Enable verbose debug output
    $mail->Debugoutput = function ($str, $level) {
        global $logSmtp;
        $log = new LogSmtp();
        $log->dataHora = gmdate('d-m-Y H:i:s');
        $log->debugLevel = $level;
        $log->mensagem = $str;
        ///$retorno = array('datahora' => gmdate('Y-m-d H:i:s'),'debugLevel' => $level, 'mensagem' => $str);
        array_push($logSmtp, $log);
    };

    $mail->isSMTP();                                            //Send using SMTP
    $mail->Host = 'smtp.gmail.com';                             //Set the SMTP server to send through
    $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
    $mail->Username   = 'pacatosteahouse@gmail.com';                     //SMTP username

    //Abaixo a senha de app gerado no site do google para envio de email
    $mail->Password   = 'hvinwflycyrbqlod';                               //SMTP password


    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;            //Enable implicit TLS encryption
    $mail->Port       = 465;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`

    //Recipients
    $mail->setFrom($contato->email, $contato->nomeSobrenome);
    $mail->addAddress('pacatosteahouse@gmail.com', 'Pacatos Tea House');     //Add a recipient
    $mail->addAddress('regifelix@gmail.com');               //Name is optional
    //$mail->addReplyTo('info@example.com', 'Information');
    //$mail->addCC('cc@example.com');
    //$mail->addBCC('bcc@example.com');

    //Attachments
    //$mail->addAttachment('/var/tmp/file.tar.gz');         //Add attachments
    //$mail->addAttachment('/tmp/image.jpg', 'new.jpg');    //Optional name

    //Content
    $mail->isHTML(true);                                  //Set email format to HTML
    $mail->Subject = 'Contato Pacatos Tea House - '.$contato->nomeSobrenome;
    
    //Abaixo segue o corpo do email em HTML
    $mail->Body    = '<b>Mensagem recebida da pagina de contatos</b> <br ><br >'
                     .' <b>Nome:</b>'.$contato->nomeSobrenome.'<br >'
                     .' <b>Telefone:</b> '.$contato->telefone.'<br >'
                     .' <b>E-mail:</b> '.$contato->email.'<br >'
                     .' <b>Mensagem:</b> '.$contato->mensagem.'<br ><br >'
                     .' <b>Como prefere o nosso contato:</b> '.$contato->contatoPreferencia.'<br >'
                     .' <b>Gostaria de receber nossas novidades? </b>'.$contato->permiteEmailNovidades.'<br>';

    //Abaixo segue o corpo do email em TEXTO para servidores de email que não aceitam html
    $mail->AltBody = 'Mensagem recebida da pagina de contatos \r\n \r\n'
    . ' Nome:' . $contato->nomeSobrenome . '\r\n'
    . ' Telefone: ' . $contato->telefone . '\r\n'
    . ' E-mail: ' . $contato->email . '\r\n'
    . ' Mensagem: ' . $contato->mensagem . '\r\n \r\n'
    . ' Como prefere o nosso contato:' . $contato->contatoPreferencia . '\r\n'
    . ' Gostaria de receber nossas novidades? ' . $contato->permiteEmailNovidades . '\r\n';

    $mail->send();
    $retorno->logSmtp = $logSmtp;
    $retorno->sucesso = true;
    $retorno->message = "Mensagem enviada com sucesso!";
    echo json_encode($retorno);

} catch (Exception $e) {
    http_response_code(500);
    $log = new LogSmtp();
    $log->dataHora = gmdate('d-m-Y H:i:s');
    $log->debugLevel = 0;
    $log->mensagem = "A mensagem não pode ser enviada. Erro ocorrido: " . $mail->ErrorInfo;
    global $logSmtp;
    array_push($logSmtp, $log);

    $retorno->logSmtp = $logSmtp;
    $retorno->sucesso = false;
    $retorno->message = "Falha no envio da mensagem!";
    echo json_encode($retorno);

}
