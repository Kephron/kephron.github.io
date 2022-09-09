let cep = document.querySelector('#cep');
let uf = document.querySelector('#uf');
let cidade = document.querySelector('#cidade');
let bairro = document.querySelector('#bairro');
let logradouro = document.querySelector('#logradouro');
let numero = document.querySelector('#numero');

function somenteNumero(tecla) {
    let charCode = tecla.charCode ? tecla.charCode : tecla.charCode;
    let elemento = tecla.srcElement;
    if (charCode != 8 && charCode != 9) {
        if (charCode < 48 || charCode > 57) {
            return false;
        }
    }

    if (elemento.id == 'cep') {
        if (cep.value.length >= 8) {
            return false;
        }
    } else if (elemento.id == 'numero') {
        if (numero.value.length >= 10) {
            return false;
        }
    }
    return true;
}

function limpaFormularioCep() {
    uf.value = ("");
    cidade.value = ("");
    bairro.value = ("");
    logradouro.value = ("");
}

function meuCallback(conteudo) {
    if (!("erro" in conteudo)) {
        let option;
        for (let i = 0; i < uf.options.length; i++) {
            option = uf.options[i];
            if (option.value == conteudo.uf) {
                uf.value = (conteudo.uf);
                option.setAttribute('selected', true);
                break;
            }
        }
        console.log(option);
        cidade.value = (conteudo.localidade);
        bairro.value = (conteudo.bairro);
        logradouro.value = (conteudo.logradouro);
    }
    else {
        limpaFormularioCep();
        alert("CEP não encontrado.");
    }
}

function pesquisaCep(valor) {
    var cep = valor.replace(/\D/g, '');

    if (cep != "") {
        var regex = /^[0-9]{8}$/;

        if (regex.test(cep)) {
            uf.value = "...";
            cidade.value = "...";
            bairro.value = "...";
            logradouro.value = "...";

            var script = document.createElement('script');

            script.src = 'https://viacep.com.br/ws/' + cep + '/json/?callback=meuCallback';

            document.body.appendChild(script);
        }
        else {
            limpaFormularioCep();
            alert("Formato de CEP inválido.");
        }
    }
    else {
        limpaFormularioCep();
    }
};
