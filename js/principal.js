// const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

const logado = document.querySelector('#logado');

const botaoSair = document.querySelector('#botao-sair');

// if (usuarioLogado == null
//     || localStorage.getItem('token') == null
//     || localStorage.getItem('token') == undefined) {
//     alert('Você precisa estar logado para acessar esta página.');
//     window.location.href = '../html/login.php';
// } else {
// logado.innerHTML = `Seja bem vindo, ${usuarioLogado.nome}!`;
// }

botaoSair.addEventListener('click', () => {
    // localStorage.removeItem('token');
    // localStorage.removeItem('usuarioLogado');
    window.location.href = '../html/login.html';
});
