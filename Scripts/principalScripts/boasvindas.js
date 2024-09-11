function carregamentoBoasvindas() {

    function atualizarRelogio() {
        var agora = new Date();
        var data = agora.toLocaleDateString('pt-BR');
        var hora = agora.toLocaleTimeString('pt-BR');
        document.getElementById('relogio').innerHTML = data + ' ' + hora;
    }

    setInterval(atualizarRelogio, 1000);
}

export { carregamentoBoasvindas };