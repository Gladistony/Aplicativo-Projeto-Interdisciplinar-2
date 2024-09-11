import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { getStorage, ref, listAll, getDownloadURL, getMetadata, uploadBytes, deleteObject } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js';

const icones = {
    'pdf': '../Recursos/Imagens/ficheiro-pdf.png',
    'img': '../Recursos/Imagens/imagem.png',
    'png': '../Recursos/Imagens/imagem.png',
    'jpg': '../Recursos/Imagens/imagem.png',
    'jpeg': '../Recursos/Imagens/imagem.png',
    'download': '../Recursos/Imagens/botao-de-download.png',
    'lixo': '../Recursos/Imagens/lata-de-lixo.png'
};

function getIcone(extensao) {
    return icones[extensao] || '../Recursos/Imagens/arquivo.png';
}

async function listarArquivos() {
    const auth = getAuth();
    const loadingElement = document.getElementById('loading-download');
    const listagemDeArquivos = document.getElementById('listagemDeArquivos');
    const mensagemVazio = document.createElement('p');
    mensagemVazio.id = 'mensagem-vazio';
    mensagemVazio.textContent = 'Vazio...';
    mensagemVazio.style.display = 'none';
    listagemDeArquivos.appendChild(mensagemVazio);
    
    loadingElement.style.display = 'block'; // Mostrar o spinner de loading
    
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userId = user.uid;
            const storage = getStorage();
            const storageRef = ref(storage, `profileDocuments/${userId}`);
            const res = await listAll(storageRef);

            loadingElement.style.display = 'none'; // Esconder o spinner de loading após a conclusão

            if (res.items.length === 0) {
                mensagemVazio.style.display = 'block';
            } else {
                mensagemVazio.style.display = 'none';
                res.items.forEach(async (itemRef) => {
                    const downloadURL = await getDownloadURL(itemRef);
                    const metadata = await getMetadata(itemRef);
                    const extensao = itemRef.name.split('.').pop();
                    const icone = getIcone(extensao);
                    const itemArquivo = document.createElement('div');
                    const tamanhoArquivoMB = (metadata.size / (1024 * 1024)).toFixed(2);
                    itemArquivo.className = 'arquivo-item';
                    itemArquivo.innerHTML = `
                        <div class="arquivo-item-header">
                            <div class="nome-arquivo">
                                <img src="${icone}" alt="${extensao} icon" class="icone-arquivo"> 
                                <span>${itemRef.name}</span>
                            </div>
                            <img src="${icones['download']}" alt="download icon" class="icone-download" onclick="downloadArquivo('${downloadURL}')">
                            <img src="${icones['lixo']}" alt="lixo icon" class="icone-lixo" onclick="deleteArquivo('${itemRef.name}')">
                        </div>
                        <div class="tamanho-arquivo">${tamanhoArquivoMB} MB</div>
                    `;
                    listagemDeArquivos.appendChild(itemArquivo);
                });
            }
        } else {
            alert('Nenhum usuário está logado.');
            loadingElement.style.display = 'none'; // Esconder o spinner de loading em caso de erro
        }
    });
}

function downloadArquivo(url) {
    window.open(url, '_blank');
}

async function deleteArquivo(nomeArquivo) {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userId = user.uid;
            const storage = getStorage();
            const storageRef = ref(storage, `profileDocuments/${userId}/${nomeArquivo}`);
            await deleteObject(storageRef);
            console.log('Arquivo deletado:', nomeArquivo);
            document.location.reload();
        } else {
            alert('Nenhum usuário está logado.');
        }
    });
}

window.downloadArquivo = downloadArquivo;
window.deleteArquivo = deleteArquivo;

document.getElementById('salvarArquivoBtn').onclick = uploadArquivo;

async function uploadArquivo() {
    const input = document.getElementById('uploadArquivo');
    const file = input.files[0];
    const loadingElement = document.getElementById('loading-upload');
    const mensagemVazio = document.getElementById('mensagem-vazio');
    if (file && file.size <= 25 * 1024 * 1024) {
        loadingElement.style.display = 'block';
        const extensao = file.name.split('.').pop();
        const icone = getIcone(extensao);
        const listagemDeArquivos = document.getElementById('listagemDeArquivos');
        const itemArquivo = document.createElement('div');
        itemArquivo.className = 'arquivo-item';
        const tamanhoArquivoMB = (file.size / (1024 * 1024)).toFixed(2);
        const auth = getAuth();
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userId = user.uid;
                const storage = getStorage();
                const storageRef = ref(storage, `profileDocuments/${userId}/${file.name}`);
                await uploadBytes(storageRef, file);
                const downloadURL = await getDownloadURL(storageRef);
                itemArquivo.innerHTML = `
                    <div class="arquivo-item-header">
                        <div class="nome-arquivo">
                            <img src="${icone}" alt="${extensao} icon" class="icone-arquivo"> 
                            <span>${file.name}</span>
                        </div>
                        <img src="${icones['download']}" alt="download icon" class="icone-download" onclick="downloadArquivo('${downloadURL}')">
                        <img src="${icones['lixo']}" alt="lixo icon" class="icone-lixo" onclick="deleteArquivo('${file.name}')">
                    </div>
                    <div class="tamanho-arquivo">${tamanhoArquivoMB} MB</div>
                `;
                if (mensagemVazio) {
                    mensagemVazio.style.display = 'none';
                }
                listagemDeArquivos.appendChild(itemArquivo);
                console.log('Arquivo enviado:', file.name);
            } else {
                alert('Nenhum usuário está logado.');
            }
            loadingElement.style.display = 'none';
        });
    } else {
        alert('Arquivo muito grande ou não selecionado.');
    }
}

listarArquivos();

export { uploadArquivo, downloadArquivo };