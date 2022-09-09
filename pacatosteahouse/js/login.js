const email = document.querySelector('#email');
const labelEmail = document.querySelector('#label-email');

const senha = document.querySelector('#senha');
const labelSenha = document.querySelector('#label-senha');

const formularioLogin = document.querySelector('.formulario-login');

const mostraSenha = document.querySelector('.mostra-senha');
const escondeSenha = document.querySelector('.esconde-senha');

const msgErro = document.querySelector('#msg-erro');
const msgSucesso = document.querySelector('#msg-sucesso');

let listaInput = document.querySelectorAll('input');
let listaLabel = document.querySelectorAll('label');

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

    email.blur();
    senha.blur();

    pintaLabel(labelEmail, '#cc0000');
    pintaInput(email, '#cc0000');

    pintaLabel(labelSenha, '#cc0000');
    pintaInput(senha, '#cc0000');
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

formularioLogin.addEventListener('submit', (event) => {
    let verificaLogado = false;

    let formData = new FormData(formularioLogin);
    let objetoFormData = {};
    formData.forEach((valor, chave) => {
        objetoFormData[chave] = valor;
    });

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "../php/autentica.php", true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
            let regexStatusCodeFamilia400 = /^4[0-9]{2}/;
            let regexStatusCodeFamilia500 = /^5[0-9]{2}/;

            if (this.status == 200) {
                let resultado = JSON.parse(this.response);

                if (resultado.logado == true) {
                    verificaLogado = true;

                    sessionStorage.setItem('nome', resultado.nome);
                    sessionStorage.setItem('token', resultado.token);
                    sessionStorage.setItem('dataExpiracao', resultado.dataExpiracao);

                    msgSucesso.setAttribute('style', 'display: inline-block');
                    msgSucesso.innerHTML = '<strong>Logando...</strong>';

                    msgErro.setAttribute('style', 'display: none');
                    msgErro.innerHTML = '';

                    event.preventDefault();

                    setTimeout(() => { window.location.href = './principal.html'; }, 1000);
                }
            } else if (regexStatusCodeFamilia400.test(this.status)) {
                informaErro("E-mail ou Senha Incorreto");

                event.preventDefault();
            } else if (regexStatusCodeFamilia500.test(this.status)) {
                informaErro("Erro Interno");

                event.preventDefault();
            }
        }
    }
    // let encrypted = CryptoJS.AES.encrypt(JSON.stringify(formData), "EncryptionKey");
    xhr.send(JSON.stringify(objetoFormData));
    event.preventDefault();
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
