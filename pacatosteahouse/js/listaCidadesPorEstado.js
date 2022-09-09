import { default as jsonCidades } from '../src/jsonCidadesPorEstado.js';

let uf = document.querySelector('#uf');

uf.addEventListener('change', () => {
    document.querySelector("#cidade").innerHTML = '';
    let selectCidade = document.querySelector("#cidade");

    let numeroDeEstados = jsonCidades.estados.length;
    let jsonIndex = -1;

    for (let x = 0; x < numeroDeEstados; x++) {
        if (jsonCidades.estados[x].sigla == uf.value) {
            jsonIndex = x;
        }
    }

    if (jsonIndex != -1) {
        jsonCidades.estados[jsonIndex].cidades.forEach(function (cidade) {
            let opcoesDeCidades = document.createElement('option');
            opcoesDeCidades.setAttribute('value', cidade)
            opcoesDeCidades.innerHTML = cidade;
            selectCidade.appendChild(opcoesDeCidades);
        });
    } else {
        document.querySelector("#cidade").innerHTML = '';
    }
});