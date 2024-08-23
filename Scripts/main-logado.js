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