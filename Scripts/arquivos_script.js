const icones = {
    'pdf': '../Imagens/ficheiro-pdf.png',
    'img': '../Imagens/imagem.png',
    'download': '../Imagens/botao-de-download.png' // Adicione o caminho do ícone de download
};

function getIcone(extensao) {
    if (extensao.match(/(jpg|jpeg|png|gif|bmp)$/i)) {
        return icones['img'];
    } else if (extensao.match(/pdf$/i)) {
        return icones['pdf'];
    }
    return '../Imagens/arquivo.png';
}

function uploadArquivo() {
    const input = document.getElementById('uploadArquivo');
    const file = input.files[0];
    if (file && file.size <= 25 * 1024 * 1024) { // substitua 25 pelo tamanho máximo em MB
        const extensao = file.name.split('.').pop();
        const icone = getIcone(extensao);
        const listagemDeArquivos = document.getElementById('listagemDeArquivos');
        const itemArquivo = document.createElement('div');
        itemArquivo.className = 'arquivo-item';
        const tamanhoArquivoMB = (file.size / (1024 * 1024)).toFixed(2); // Tamanho do arquivo em MB
        itemArquivo.innerHTML = `
            <div class="arquivo-item-header">
                <div class="nome-arquivo">
                    <img src="${icone}" alt="${extensao} icon" class="icone-arquivo"> 
                    <span>${file.name}</span>
                </div>
                <img src="${icones['download']}" alt="download icon" class="icone-download" onclick="downloadArquivo('${file.name}')">
            </div>
            <div class="tamanho-arquivo">${tamanhoArquivoMB} MB</div>
        `;
        listagemDeArquivos.appendChild(itemArquivo);
        console.log('Arquivo enviado:', file.name);
    } else {
        alert('Arquivo muito grande ou não selecionado.');
    }
}

function downloadArquivo(nomeArquivo) {
    // Lógica para baixar o arquivo
    console.log('Baixando arquivo:', nomeArquivo);
}