function loadHTML(file, cssFile, elementId, callback) {
    fetch(file)
        .then(response => response.text())
        .then(data => {
            document.getElementById(elementId).innerHTML += data;
            loadCSS(cssFile);
            if (callback) callback();
        })
        .catch(error => console.error('Erro ao carregar o arquivo:', error));
}

function loadCSS(file) {
    if (file === 'nenhum') {
        return; // Não carrega nada se o nome do arquivo for "nenhum"
    }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = file;
    document.head.appendChild(link);
}

//Ler parametros da URL
function getURLParameter(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
}

export { loadHTML, loadCSS, getURLParameter };