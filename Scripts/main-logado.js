function loadHTML(file, cssFile, elementId) {
    fetch(file)
        .then(response => response.text())
        .then(data => {
            document.getElementById(elementId).innerHTML += data;
            loadCSS(cssFile);
        })
        .catch(error => console.error('Erro ao carregar o arquivo:', error));
}

function loadCSS(file) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = file;
    document.head.appendChild(link);
}

loadHTML('../Paginas/top-menu.html', '../Styles/estilo_menu-topo.css', 'menu_do_topo');
loadHTML('../Paginas/menu-lateral.html', '../Styles/estilo_menu-lateral.css', 'menu_do_lado');
loadHTML("../Paginas/menu-conversas.html", "../Styles/estilo_menu-conversas.css", "barra_lado_chat");
loadHTML("../Paginas/menu-perfil.php", "../Styles/estilo_menu-perfil.css", "conteudo_principal");