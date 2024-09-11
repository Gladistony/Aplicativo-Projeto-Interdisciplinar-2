function loadMenulado() {
    document.getElementById('lateral-inicio').addEventListener('click', function () {
        window.location.href = '../Paginas/main-logado.php?pagina=home';
    });
    document.getElementById('lateral-forum').addEventListener('click', function () {
        //unloadHTML('conteudo_principal');
        //loadHTML("../Paginas/menu-forum.php", "../Styles/estilo_menu-forum.css", "conteudo_principal", carregamentoForum);
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
}

export { loadMenulado };