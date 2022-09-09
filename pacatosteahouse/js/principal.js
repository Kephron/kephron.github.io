const token = sessionStorage.getItem('token');

const nomeUsuario = sessionStorage.getItem('nome');

const logado = document.querySelector('#logado');

const botaoEditaEndereco = document.querySelector('#botao-edita-endereco');

const botaoSair = document.querySelector('#botao-sair');

if (token == null || token == undefined) {
    alert('Você precisa estar logado para acessar esta página.');
    window.location.href = './login.html';
} else {
    logado.innerHTML = `Seja bem vindo, ${nomeUsuario}!`;
}

botaoEditaEndereco.addEventListener('click', () => {
    window.location.href = './editaEndereco.html';
});

botaoSair.addEventListener('click', () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('nome');
    sessionStorage.removeItem('dataExpiracao');
    window.location.href = './login.html';
});
