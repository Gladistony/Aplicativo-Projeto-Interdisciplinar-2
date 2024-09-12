function loadMenulado() {
    document.getElementById('lateral-inicio').addEventListener('click', function () {
        window.location.href = '../Paginas/main-logado.php?pagina=home';
    });
    document.getElementById('lateral-forum').addEventListener('click', function () {
        //unloadHTML('conteudo_principal');
        //loadHTML("../Paginas/menu-forum.php", "../Styles/estilo_menu-forum.css", "conteudo_principal", carregamentoForum);
        window.location.href = '../Paginas/main-logado.php?pagina=forum';
    });
    document.getElementById('lateral-arquivos').addEventListener('click', function () {
        //unloadHTML('conteudo_principal');
        //loadHTML("../Paginas/arquivos.html", "../Styles/estilo_arquivos.css", "conteudo_principal", carregamentoArquivos);
        window.location.href = '../Paginas/main-logado.php?pagina=arquivos';
    });
    document.getElementById('lateral-configuracoes').addEventListener('click', function () {
        //unloadHTML('conteudo_principal');
        //loadHTML("../Paginas/menu-perfil.php", "../Styles/estilo_menu-perfil.css", "conteudo_principal", carregamentoPerfil);
        window.location.href = '../Paginas/main-logado.php?pagina=perfil';
    });
    document.getElementById('lateral-amigos').addEventListener('click', function () {
        window.location.href = '../Paginas/main-logado.php?pagina=amigos';
    });

    const botao = document.getElementById('botao-admin')
    botao.style.display = 'none';
    if (window.sessionData) {
        if (window.sessionData.userInfo.tipoConta === 'Admin') {
            botao.style.display = 'block';
        }
    }

    const logocor = document.getElementById('logo-lateral-span');
    const tipoconta = window.sessionData.userInfo.tipoConta;
    if (tipoconta === 'Admin') logocor.style.color = '#7fff00'; // Preto
    else if (tipoconta === 'Monitor') logocor.style.color = '#f0394f';
    else if (tipoconta === 'Professor') logocor.style.color = '#5e109b';
    else logocor.style.color = '#496b7a';
}

export { loadMenulado };