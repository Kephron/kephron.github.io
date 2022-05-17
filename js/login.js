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

function informaErro(msg) {
    msgErro.setAttribute('style', 'transition: all .3s ease-out; display: inline-block; color: #ff0000; background-color: #ffaaaa;');
    msgErro.innerHTML = `<strong>${msg}</strong>`;

    msgSucesso.setAttribute('style', 'display: none');
    msgSucesso.innerHTML = '';

    email.setAttribute('style', 'transition: all 0.4s ease-out; box-shadow: 1px 1px 1.5px 1px #cc0000');
    labelEmail.setAttribute('style', 'transition: all 0.4s ease-out; color: #cc0000');

    senha.setAttribute('style', 'transition: all 0.4s ease-out; box-shadow: 1px 1px 1.5px 1px #cc0000');
    labelSenha.setAttribute('style', 'transition: all 0.4s ease-out; color: #cc0000');
}

for (let i = 0; i < listaInput.length; i++) {
    let itemInput = document.getElementById(listaInput[i].getAttribute('id'));
    let itemLabel = document.getElementById(listaLabel[i].getAttribute('id'));

    itemInput.addEventListener('focus', () => {
        itemInput.setAttribute('style', 'transition: all 0.3s ease-out; box-shadow: 1px 1px 1.5px 1px #000000');
        itemLabel.setAttribute('style', 'transition: all 0.3s ease-out; color: #000000');
    });

    itemInput.addEventListener('blur', () => {
        itemInput.setAttribute('style', 'transition: all 0.3s ease-out; box-shadow: 1px 1px 1.5px 1px #00000060');
    });
}

botaoEntrar.addEventListener('click', (event) => {
    let listaUsuario = [];
    let usuarioValido = {
        nome: '',
        sobrenome: '',
        email: '',
        senha: ''
    };

    listaUsuario = JSON.parse(localStorage.getItem('listaUsuario'));

    if (listaUsuario == null) {
        informaErro('E-mail ou Senha Incorreto');
        event.preventDefault();
    } else {
        listaUsuario.forEach((item) => {
            if (email.value == item.emailCadastrado
                && senha.value == item.senhaCadastrada) {
                usuarioValido = {
                    nome: item.nomeCadastrado,
                    sobrenome: item.sobrenomeCadastrado,
                    email: item.emailCadastrado,
                    senha: item.senhaCadastrada
                };
            }
        });

        if (email.value == usuarioValido.email
            && senha.value == usuarioValido.senha) {
            msgSucesso.setAttribute('style', 'display: inline-block');
            msgSucesso.innerHTML = '<strong>Logando...</strong>';

            msgErro.setAttribute('style', 'display: none');
            msgErro.innerHTML = '';

            const token = Math.random().toString(16).substring(2) + Math.random().toString(16).substring(2);
            localStorage.setItem('token', token);

            localStorage.setItem('usuarioLogado', JSON.stringify(usuarioValido));

            event.preventDefault();

            setTimeout(() => { window.location.href = '../html/principal.html'; }, 2000);
        } else {
            informaErro('E-mail ou Senha Incorreto');
            event.preventDefault();
        }
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
