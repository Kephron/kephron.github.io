(() => {
    const abas = document.querySelectorAll('[data-aba]');

    esconderFormularios = () => {
        const formularios = document.querySelectorAll('[data-formulario]');
        formularios.forEach(formulario => formulario.classList.add('hide'));
    }

    inativarAbas = () => {
        abas.forEach(aba => aba.classList.remove('ativa'));
    }

    ativarFormulario = (valor) => {
        const formulario = document.querySelector(`[data-formulario="${valor}"]`);

        formulario.classList.remove('hide');
    }

    ativarAba = (aba) => {
        aba.classList.add('ativa');
    }
    abas.forEach(aba => aba.addEventListener('click', () => {
        const valor = aba.dataset.aba;

        esconderFormularios();
        inativarAbas();
        ativarFormulario(valor);
        ativarAba(aba);
    }))
})();