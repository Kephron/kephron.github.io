const email = document.querySelector('#email');
const labelEmail = document.querySelector('#label-email');

const senha = document.querySelector('#senha');
const labelSenha = document.querySelector('#label-senha');

const mostraSenha = document.querySelector('.mostra-senha');
const escondeSenha = document.querySelector('.esconde-senha');

const msgErro = document.querySelector('#msg-erro');
const msgSucesso = document.querySelector('#msg-sucesso');

const botaoEntrar = document.querySelector('#botao-entrar');

let listaInput = document.querySelectorAll('input');
let listaLabel = document.querySelectorAll('label');

function pintaInput(input, color) {
    input.setAttribute('style', `transition: all 0.3s ease-out; box-shadow: 1px 1px 1.5px 1px ${color}`);
}

function pintaLabel(label, color) {
    label.setAttribute('style', `transition: all 0.3s ease-out; color: ${color}`);
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

botaoEntrar.addEventListener('click', (event) => {
    let verificaLogado = false;

    let formData = new FormData();
    formData.append('email', email.value);
    formData.append('senha', senha.value);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "../php/autentica.php", true);
    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
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

                    pintaLabel(labelEmail, '#006600');
                    pintaInput(email, '#006600');

                    pintaLabel(labelSenha, '#006600');
                    pintaInput(senha, '#006600');

                    event.preventDefault();

                    setTimeout(() => { window.location.href = './principal.html'; }, 1000);
                }
            }

            if (verificaLogado == false) {
                msgErro.setAttribute('style', 'transition: all .3s ease-out; display: inline-block; color: #ff0000; background-color: #ffaaaa;');
                msgErro.innerHTML = `<strong>E-mail ou Senha Incorreto</strong>`;

                msgSucesso.setAttribute('style', 'display: none');
                msgSucesso.innerHTML = '';

                email.blur();
                senha.blur();

                pintaLabel(labelEmail, '#cc0000');
                pintaInput(email, '#cc0000');

                pintaLabel(labelSenha, '#cc0000');
                pintaInput(senha, '#cc0000');

                event.preventDefault();
            }
        }
    }
    xhr.send(formData);
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
