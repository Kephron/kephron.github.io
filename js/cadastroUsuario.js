let listaInput = document.querySelectorAll('[data-input]');
let listaLabel = document.querySelectorAll('[data-label]');

const nome = document.querySelector('#nome');
const labelNome = document.querySelector('#label-nome');
let nomeValido = false;

const sobrenome = document.querySelector('#sobrenome');
const labelSobrenome = document.querySelector('#label-sobrenome');
let sobrenomeValido = false;

const email = document.querySelector('#email');
const labelEmail = document.querySelector('#label-email');
let emailValido = false;

const senha = document.querySelector('#senha');
const labelSenha = document.querySelector('#label-senha');
let senhaValida = false;

const confirmaSenha = document.querySelector('#confirma-senha');
const labelConfirmaSenha = document.querySelector('#label-confirma-senha');
let confirmaSenhaValida = false;

const mostraSenha = document.querySelector('.mostra-senha');
const escondeSenha = document.querySelector('.esconde-senha');
const mostraConfirmaSenha = document.querySelector('.mostra-confirma-senha');
const escondeConfirmaSenha = document.querySelector('.esconde-confirma-senha');

const botaoCadastrar = document.querySelector('#botao-cadastrar');

const msgErro = document.querySelector('#msg-erro');
const msgSucesso = document.querySelector('#msg-sucesso');

function validaEmail(email) {
    let regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return regex.test(email);
}

function validaSenha(senha) {
    let regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/;
    return regex.test(senha);
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

botaoCadastrar.addEventListener('click', (event) => {
    if (nome.value.length < 3) {
        nome.setAttribute('style', 'transition: all 0.4s ease-out; box-shadow: 1px 1px 1.5px 1px #cc0000');
        labelNome.setAttribute('style', 'transition: all 0.4s ease-out; color: #cc0000');
        nomeValido = false;
    } else {
        nome.setAttribute('style', 'transition: all 0.8s ease-out; box-shadow: 1px 1px 1.5px 1px #000000');
        labelNome.setAttribute('style', 'transition: all 0.8s ease-out; color: #000000');
        nomeValido = true;
    }

    if (sobrenome.value.length < 3) {
        sobrenome.setAttribute('style', 'transition: all 0.4s ease-out; box-shadow: 1px 1px 1.5px 1px #cc0000');
        labelSobrenome.setAttribute('style', 'transition: all 0.4s ease-out; color: #cc0000');
        sobrenomeValido = false;
    } else {
        sobrenome.setAttribute('style', 'transition: all 0.8s ease-out; box-shadow: 1px 1px 1.5px 1px #000000');
        labelSobrenome.setAttribute('style', 'transition: all 0.8s ease-out; color: #000000');
        sobrenomeValido = true;
    }

    if (validaEmail(email.value) == false) {
        email.setAttribute('style', 'transition: all 0.4s ease-out; box-shadow: 1px 1px 1.5px 1px #cc0000');
        labelEmail.setAttribute('style', 'transition: all 0.4s ease-out; color: #cc0000');
        emailValido = false;
    } else {
        email.setAttribute('style', 'transition: all 0.8s ease-out; box-shadow: 1px 1px 1.5px 1px #000000');
        labelEmail.setAttribute('style', 'transition: all 0.8s ease-out; color: #000000');
        emailValido = true;
    }

    if (validaSenha(senha.value) == false) {
        senha.setAttribute('style', 'transition: all 0.4s ease-out; box-shadow: 1px 1px 1.5px 1px #cc0000');
        labelSenha.setAttribute('style', 'transition: all 0.4s ease-out; color: #cc0000');
        senhaValida = false;
    } else {
        senha.setAttribute('style', 'transition: all 0.8s ease-out; box-shadow: 1px 1px 1.5px 1px #000000');
        labelSenha.setAttribute('style', 'transition: all 0.8s ease-out; color: #000000');
        senhaValida = true;
    }

    if (confirmaSenha.value != senha.value || senhaValida == false) {
        confirmaSenha.setAttribute('style', 'transition: all 0.4s ease-out; box-shadow: 1px 1px 1.5px 1px #cc0000');
        labelConfirmaSenha.setAttribute('style', 'transition: all 0.4s ease-out; color: #cc0000');
        confirmaSenhaValida = false;
    } else if (confirmaSenha.value == senha.value && senhaValida) {
        confirmaSenha.setAttribute('style', 'transition: all 0.8s ease-out; box-shadow: 1px 1px 1.5px 1px #000000');
        labelConfirmaSenha.setAttribute('style', 'transition: all 0.8s ease-out; color: #000000');
        confirmaSenhaValida = true;
    }

    if (nomeValido && sobrenomeValido && emailValido && senhaValida && confirmaSenhaValida) {
        let listaUsuario = JSON.parse(localStorage.getItem('listaUsuario') || '[]');

        listaUsuario.push({
            nomeCadastrado: nome.value,
            sobrenomeCadastrado: sobrenome.value,
            emailCadastrado: email.value,
            senhaCadastrada: senha.value
        });

        localStorage.setItem('listaUsuario', JSON.stringify(listaUsuario));

        msgSucesso.setAttribute('style', 'display: inline-block');
        msgSucesso.innerHTML = '<strong>Cadastrando usuário...</strong>';
        msgErro.setAttribute('style', 'display: none');
        msgErro.innerHTML = '';

        event.preventDefault();

        setTimeout(() => { window.location.href = './login.html' }, 3000);
    } else {
        msgErro.setAttribute('style', 'transition: all .3s ease-out; display: inline-block; color: #ff0000; background-color: #ffaaaa;');
        msgErro.innerHTML = '<strong>Preencha todos os campos corretamente</strong>';
        msgSucesso.setAttribute('style', 'display: none');
        msgSucesso.innerHTML = '';

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
