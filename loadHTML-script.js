function loadHTML(file, elementId) {
    fetch(file)
        .then(response => response.text())
        .then(data => {
            document.getElementById(elementId).innerHTML += data;
        })
    .catch(error => console.error('Erro ao carregar o arquivo:', error));
}

loadHTML('section1.html', 'content');
loadHTML('section2.html', 'content');
loadHTML('section3.html', 'content');