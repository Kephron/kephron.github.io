let listaInput = document.querySelectorAll('[data-input]');
let listaLabel = document.querySelectorAll('[data-label]');

const nome = document.querySelector('#nome');
const labelNome = document.querySelector('#label-nome');

const sobrenome = document.querySelector('#sobrenome');
const labelSobrenome = document.querySelector('#label-sobrenome');

const cpf = document.querySelector('#cpf');
const labelCpf = document.querySelector('#label-cpf');

const dataNascimento = document.querySelector('#data-nascimento');
const labelDataNascimento = document.querySelector('#label-data-nascimento');

const telefone = document.querySelector('#telefone');
const labelTelefone = document.querySelector('#label-telefone');

const email = document.querySelector('#email');
const labelEmail = document.querySelector('#label-email');

const senha = document.querySelector('#senha');
const labelSenha = document.querySelector('#label-senha');

const confirmaSenha = document.querySelector('#confirma-senha');
const labelConfirmaSenha = document.querySelector('#label-confirma-senha');

let formularioCadastroUsuario = document.querySelector('.formulario-cadastro-usuario');

const mostraSenha = document.querySelector('.mostra-senha');
const escondeSenha = document.querySelector('.esconde-senha');
const mostraConfirmaSenha = document.querySelector('.mostra-confirma-senha');
const escondeConfirmaSenha = document.querySelector('.esconde-confirma-senha');

const msgErro = document.querySelector('#msg-erro');
const msgSucesso = document.querySelector('#msg-sucesso');

function somenteNumero(tecla) {
    let charCode = tecla.charCode ? tecla.charCode : tecla.charCode;
    let elemento = tecla.srcElement;
    if (charCode != 8 && charCode != 9) {
        // charCode 48 equivale a 0   
        // charCode 57 equivale a 9
        if (charCode < 48 || charCode > 57) {
            return false;
        }
    }

    if (elemento.id == 'cpf') {
        if (cpf.value.length >= 11) {
            return false;
        }
    } else if (elemento.id == 'telefone') {
        if (telefone.value.length >= 11) {
            return false;
        }
    }
    // else if (elemento.id == 'data-nascimento') {
    //     if (dataNascimento.value.length >= 8) {
    //         return false;
    //     }
    // }
    return true;
}

// function formataCampo(mascara, valor) {
//     let s = '' + valor;
//     let r = '';
//     for (var im = 0, is = 0; im < mascara.length && is < s.length; im++) {
//         r += mascara.charAt(im) == 'X' ? s.charAt(is++) : mascara.charAt(im);
//     }
//     return r;
// }

function validaCpf(cpf) {
    let Soma = 0;
    let Resto;
    let strCPF = String(cpf).replace(/[^\d]/g, '');

    if (strCPF.length !== 11) {
        return false;
    }

    if ([
        '00000000000',
        '11111111111',
        '22222222222',
        '33333333333',
        '44444444444',
        '55555555555',
        '66666666666',
        '77777777777',
        '88888888888',
        '99999999999',
    ].indexOf(strCPF) !== -1) {
        return false;
    }

    for (let i = 1; i <= 9; i++) {
        Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
    }
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11)) {
        Resto = 0;
    }

    if (Resto != parseInt(strCPF.substring(9, 10))) {
        return false;
    }

    Soma = 0;

    for (let i = 1; i <= 10; i++) {
        Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
    }
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11)) {
        Resto = 0;
    }

    if (Resto != parseInt(strCPF.substring(10, 11))) {
        return false;
    }

    return true;
}

function validaDataNascimento(data) {
    let dataAtual = new Date();
    let dataNascimento = new Date(data);
    let timestampDiferencaData = (dataAtual - dataNascimento) / 1000;
    let timestamp150Anos = 4730400000;

    if (dataNascimento < dataAtual && timestampDiferencaData < timestamp150Anos) {
        return true;
    } else {
        return false;
    }
}

function validaTelefone(telefone) {
    let regex = /^[1-9]{2}((9[5-9]\d{7})$|([0-5]\d{7})$)/;

    if (telefone.length < 10 || regex.test(telefone) == false) {
        return false;
    }

    //verifica se não é nenhum numero digitado errado (propositalmente)
    for (var n = 0; n < 10; n++) {
        //um for de 0 a 9.
        //estou utilizando o metodo Array(q+1).join(n) onde "q" é a quantidade e n é o
        //caractere a ser repetido
        if (telefone == new Array(11).join(n)) {
            return false;
        }
    }
    return true;
}

function validaEmail(email) {
    let regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return regex.test(email);
}

function validaSenha(senha) {
    let regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,20}$/;
    return regex.test(senha);
}

function pintaInput(input, color) {
    input.setAttribute('style', `transition: all 0.3s ease-out; box-shadow: 1px 1px 1.5px 1px ${color}`);
}

function pintaLabel(label, color) {
    label.setAttribute('style', `transition: all 0.3s ease-out; color: ${color}`);
}

function informaErro(msg) {
    msgErro.setAttribute('style', 'transition: all .3s ease-out; display: inline-block; color: #ff0000; background-color: #ffaaaa;');
    msgErro.innerHTML = `<strong>${msg}</strong>`;

    msgSucesso.setAttribute('style', 'display: none');
    msgSucesso.innerHTML = '';
}


for (let i = 0; i < listaInput.length; i++) {
    let itemInput = document.getElementById(listaInput[i].getAttribute('id'));
    let itemLabel = document.getElementById(listaLabel[i].getAttribute('id'));

    itemInput.addEventListener('focus', () => {
        pintaInput(itemInput, '#000000');
        pintaLabel(itemLabel, '#000000');
    });

    itemInput.addEventListener('blur', () => {
        pintaInput(itemInput, '#00000060');
    });
}

formularioCadastroUsuario.addEventListener('submit', (event) => {

    let nomeValido = false;
    let sobrenomeValido = false;
    let cpfValido = false;
    let dataNascimentoValido = false;
    let telefoneValido = false;
    let emailValido = false;
    let senhaValida = false;
    let confirmaSenhaValida = false;

    if (nome.value.length < 3) {
        pintaInput(nome, '#cc0000');
        pintaLabel(labelNome, '#cc0000');
        nomeValido = false;
    } else {
        pintaInput(nome, '#000000');
        pintaLabel(labelNome, '#000000');
        nomeValido = true;
    }

    if (sobrenome.value.length < 3) {
        pintaInput(sobrenome, '#cc0000');
        pintaLabel(labelSobrenome, '#cc0000');
        sobrenomeValido = false;
    } else {
        pintaInput(sobrenome, '#000000');
        pintaLabel(labelSobrenome, '#000000');
        sobrenomeValido = true;
    }

    if (validaCpf(cpf.value) == false) {
        pintaInput(cpf, '#cc0000');
        pintaLabel(labelCpf, '#cc0000');
        cpfValido = false;
    } else {
        pintaInput(cpf, '#000000');
        pintaLabel(labelCpf, '#000000');
        cpfValido = true;
    }

    if (validaDataNascimento(dataNascimento.value) == false) {
        pintaInput(dataNascimento, '#cc0000');
        pintaLabel(labelDataNascimento, '#cc0000');
        dataNascimentoValido = false;
    } else {
        pintaInput(dataNascimento, '#000000');
        pintaLabel(labelDataNascimento, '#000000');
        dataNascimentoValido = true;
    }

    if (validaTelefone(telefone.value) == false) {
        pintaInput(telefone, '#cc0000');
        pintaLabel(labelTelefone, '#cc0000');
        telefoneValido = false;
    } else {
        pintaInput(telefone, '#000000');
        pintaLabel(labelTelefone, '#000000');
        telefoneValido = true;
    }

    if (validaEmail(email.value) == false) {
        pintaInput(email, '#cc0000');
        pintaLabel(labelEmail, '#cc0000');
        emailValido = false;
    } else {
        pintaInput(email, '#000000');
        pintaLabel(labelEmail, '#000000');
        emailValido = true;
    }

    if (validaSenha(senha.value) == false) {
        pintaInput(senha, '#cc0000');
        pintaLabel(labelSenha, '#cc0000');
        senhaValida = false;
    } else {
        pintaInput(senha, '#000000');
        pintaLabel(labelSenha, '#000000');
        senhaValida = true;
    }

    if (confirmaSenha.value != senha.value || senhaValida == false) {
        pintaInput(confirmaSenha, '#cc0000');
        pintaLabel(labelConfirmaSenha, '#cc0000');
        confirmaSenhaValida = false;
    } else if (confirmaSenha.value == senha.value && senhaValida) {
        pintaInput(confirmaSenha, '#000000');
        pintaLabel(labelConfirmaSenha, '#000000');
        confirmaSenhaValida = true;
    }

    if (nomeValido
        && sobrenomeValido
        && cpfValido
        && dataNascimentoValido
        && telefoneValido
        && emailValido
        && senhaValida
        && confirmaSenhaValida) {
        let formData = new FormData(formularioCadastroUsuario);
        let objetoFormData = {};
        formData.forEach((chave, valor) => {
            objetoFormData[chave] = valor;
        });

        let xhr = new XMLHttpRequest();
        xhr.open('POST', '../php/cadastroUsuario.php');
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                let regexStatusCodeFamilia400 = /^4[0-9]{2}/;
                let regexStatusCodeFamilia500 = /^5[0-9]{2}/;

                if (this.status == 200) {
                    msgSucesso.setAttribute('style', 'display: inline-block');
                    msgSucesso.innerHTML = '<strong>Cadastrando usuário...</strong>';
                    msgErro.setAttribute('style', 'display: none');
                    msgErro.innerHTML = '';

                    event.preventDefault();

                    setTimeout(() => { window.location.href = '../html/login.html' }, 1000);
                } else if (regexStatusCodeFamilia400.test(this.status)) {
                    informaErro(this.mensagem);

                    event.preventDefault();
                } else if (regexStatusCodeFamilia500.test(this.status)) {
                    informaErro(this.mensagem);

                    event.preventDefault();
                }
            }
        }
        xhr.send(JSON.stringify(objetoFormData));
        event.preventDefault();

    } else {
        informaErro("Preencha todos os campos corretamente");

        event.preventDefault();
    }
});

mostraSenha.addEventListener('click', () => {
    senha.setAttribute('type', 'text');
    mostraSenha.setAttribute('style', 'display: none');
    escondeSenha.setAttribute('style', 'display: inline-block');
});

escondeSenha.addEventListener('click', () => {
    senha.setAttribute('type', 'password');
    escondeSenha.setAttribute('style', 'display: none');
    mostraSenha.setAttribute('style', 'display: inline-block');
});

mostraConfirmaSenha.addEventListener('click', () => {
    confirmaSenha.setAttribute('type', 'text');
    mostraConfirmaSenha.setAttribute('style', 'display: none');
    escondeConfirmaSenha.setAttribute('style', 'display: inline-block');
});

escondeConfirmaSenha.addEventListener('click', () => {
    confirmaSenha.setAttribute('type', 'password');
    escondeConfirmaSenha.setAttribute('style', 'display: none');
    mostraConfirmaSenha.setAttribute('style', 'display: inline-block');
});
