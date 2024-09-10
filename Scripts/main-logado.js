import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { collection, query, where, doc, getDoc, getDocs, addDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js';
import { app, db } from './firebase-config.js';

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

function unloadCSS(file) {
    if (file === 'nenhum') {
        return; // Não carrega nada se o nome do arquivo for "nenhum"
    }
    const links = document.querySelectorAll('link[rel="stylesheet"]');
    links.forEach(link => {
        if (link.href.includes(file)) {
            link.parentNode.removeChild(link);
        }
    });
}
function unloadHTML(elementId) {
    // Limpa o conteúdo HTML do elemento
    document.getElementById(elementId).innerHTML = '';
    unloadCSS("estilo_menu-perfil.css");
    unloadCSS("estilo_menu-forum.css");
    unloadCSS("estilo_tela-de-amigos.css");
    unloadCSS("estilo_arquivos.css");
    unloadCSS("estilo_menu-forum.css")
    unloadCSS("estilo_tela-de-turma.css");
    unloadCSS("estilo_tela-de-subtopico.css");
}

loadHTML('../Paginas/top-menu.php', '../Styles/estilo_menu-topo.css', 'menu_do_topo');
loadHTML('../Paginas/menu-lateral.php', '../Styles/estilo_menu-lateral.css', 'menu_do_lado', carregamentoLateral);
loadHTML("../Paginas/menu-conversas.php", "../Styles/estilo_menu-conversas.css", "barra_lado_chat", carregamentoConversas);
loadHTML("../Paginas/menu-home.php", "nenhum", "conteudo_principal", carregamentoMain);
//loadHTML("../Paginas/menu-perfil.php", "../Styles/estilo_menu-perfil.css", "conteudo_principal", carregamentoPerfil);


const auth = getAuth();
const storage = getStorage();

window.botaoTopico = async function (topicoId, titulo) {
    //alert('Clicou no tópico ' + titulo + ' com ID ' + topicoId);
    unloadHTML('conteudo_principal');
    loadHTML("../Paginas/forum-topico.php?id=" + topicoId, "../Styles/forum-topico.css", "conteudo_principal");
    const topicoDoc = await getDoc(doc(db, 'topicos-alunos', topicoId));
    const topicoData = topicoDoc.data();
    //Pegar dados do autor
    const docRef = doc(db, "InforConta", topicoData.autor);
    const autorSnapshot = await getDoc(docRef);
    const autorData = autorSnapshot.data();

    document.getElementById('titulo-topico-forum').innerText = topicoData.titulo;
    document.getElementById('conteudo-topico-forum').innerText = topicoData.conteudo;
    document.getElementById('autor-topico-forum').innerText = autorData.nome;
    document.getElementById('data-topico-forum').innerText = topicoData.data;

    const comentariosCol = collection(db, 'comentarios-forum');
    const q = query(comentariosCol, where('topicoID', '==', topicoId));
    const comentariosSnapshot = await getDocs(q);
    const comentariosList = comentariosSnapshot.docs.map(doc => doc.data());
    const comentariosContainer = document.getElementById('comentarios-forum');
    comentariosList.forEach(async comentario => {
        const comentarioElement = document.createElement('li');
        //Pegar foto e nome do autor
        const docRef = doc(db, "InforConta", comentario.autor);
        const autorSnapshot = await getDoc(docRef);
        const autorData = autorSnapshot.data();
        const autorFoto = autorData.fotoPerfil;
        const autor = autorData.nome
        comentarioElement.innerHTML = `
            <div class="comentario
            -box">
                <img src="${autorFoto}" alt="Foto do Autor" class="autor-foto">
                <h3>${autor}</h3>
                <p>${comentario.conteudo}</p>
                <p>${comentario.data}</p>
            </div>
        `;
        comentariosContainer.appendChild(comentarioElement);
    });

}

window.comentar_topico = async function (id) {
    const texto = document.getElementById('conteudoComentario').value;
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const idautor = user.uid;
            if (texto) {
                try {
                    await addDoc(collection(db, "comentarios-forum"), {
                        autor: idautor,
                        topicoID: id,
                        conteudo: texto,
                        data: new Date().toLocaleString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                        })
                    });
                    alert('Comentário enviado com sucesso!');
                    botaoTopico(id, "");
                } catch (error) {
                    console.error('Erro ao comentar no tópico:', error);
                    alert('Erro ao comentar no tópico.');
                }
            }
        }
    });
    //alert('Comentou no tópico ' + id + ' com o texto: ' + texto);
}

window.criarNovoTopico = async function (id) {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const idautor = user.uid;
            const idsubtopico = id;
            const titulo = prompt("Digite o nome do tópico:");
            const conteudo = prompt("Digite o conteúdo do tópico:");
            if (titulo) {
                try {
                    await addDoc(collection(db, "topicos-alunos"), {
                        autor: idautor,
                        subtopicoID: idsubtopico,
                        titulo: titulo,
                        conteudo: conteudo,
                        data: new Date().toLocaleString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                        })
                    });
                    alert('Tópico criado com sucesso!');
                    botaoSubtopico(idsubtopico, "");
                } catch (error) {
                    console.error('Erro ao criar o tópico:', error);
                    alert('Erro ao criar o tópico.');
                }
            }
        }
    });
}

window.botaoTurma = async function (turmaId) {
    unloadHTML('conteudo_principal');
    loadHTML("../Paginas/turma.html", "../Styles/estilo_tela-de-turma.css", "conteudo_principal");
    const subtopicosCol = collection(db, 'subtopicos-forum');
    const q = query(subtopicosCol, where('turmaId', '==', turmaId));
    const subtopicosSnapshot = await getDocs(q);
    const subtopicosList = subtopicosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const subtopicosContainer = document.getElementById('subtopicos');
    subtopicosList.forEach(subtopico => {
        const subtopicoElement = document.createElement('li');
        subtopicoElement.innerHTML = ` <button onclick="botaoSubtopico('${subtopico.id}', '${subtopico.nome}')">${subtopico.nome}</button>`;
        subtopicosContainer.appendChild(subtopicoElement);
    });
}

window.botaoSubtopico = async function (subtopicoId, nome) {
    unloadHTML('conteudo_principal');
    loadHTML("../Paginas/forum-subtopicos.php?id=" + subtopicoId + "&nome=" + encodeURIComponent(nome), "../Styles/estilo_tela-de-subtopico.css", "conteudo_principal");
    const subtopicosCol = collection(db, 'topicos-alunos');
    const q = query(subtopicosCol, where('subtopicoID', '==', subtopicoId));
    const topicosSnapshot = await getDocs(q);
    let topicosList = topicosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    topicosList.sort((a, b) => new Date(b.data) - new Date(a.data));

    const topicosContainer = document.getElementById('topicos');

    for (const topico of topicosList) {
        const docRef = doc(db, "InforConta", topico.autor);
        const autorSnapshot = await getDoc(docRef);
        const autorData = autorSnapshot.data();
        const topicoElement = document.createElement('li');
        topicoElement.innerHTML = `
                    <div class="topico-box">
                        <img src="${autorData.fotoPerfil}" alt="Foto do Autor">
                        <h3>${topico.titulo}</h3>
                        <p>${autorData.nome}</p>
                        <p>${topico.data}</p>
                        <button onclick="botaoTopico('${topico.id}', '${topico.titulo}')">Ver mais</button>
                    </div>
                `;
        topicosContainer.appendChild(topicoElement);
    }
}

async function loadTurmas() {
    const turmasCol = collection(db, 'turmas-forum');
    const turmasSnapshot = await getDocs(turmasCol);
    const turmasList = turmasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const periodoAtual = "2024.1";

    const turmasContainer = document.getElementById('turmas-forum');
    turmasList.forEach(turma => {
        if (turma.periodo === periodoAtual) {
            const turmaElement = document.createElement('div');
            turmaElement.classList.add('turma-box');
            turmaElement.innerHTML = `
                        <img src="${turma.icone}" alt="Imagem da Turma">
                        <h2>${turma.nome}</h2>
                        <p>Professor: ${turma.professor}</p>
                        <p>Período: ${turma.periodo}</p>
                        <button onclick="botaoTurma('${turma.id}')">Ver mais</button>
                    `;
            turmasContainer.appendChild(turmaElement);
        }
    });
}

function carregamentoForum() {
    loadTurmas();
}

function carregamentoConversas() {
    ajustarusuariosLogados();
    document.getElementById('link-amigos').addEventListener('click', function () {
        unloadHTML('conteudo_principal');
        loadHTML("../Paginas/telaDeAmigos.php", "../Styles/estilo_tela-de-amigos.css", "conteudo_principal");
    });
    //<link rel="stylesheet" href="../Styles/estilo_tela-de-amigos.css"></link>
}

function carregamentoArquivos() {
    var script = document.createElement('script');
    script.src = '../Scripts/arquivos_script.js';
    document.head.appendChild(script);
}

function carregamentoLateral() {
    document.getElementById('lateral-inicio').addEventListener('click', function () {
        unloadHTML('conteudo_principal');
        loadHTML("../Paginas/menu-home.php", "nenhum", "conteudo_principal", carregamentoMain);
    });
    document.getElementById('lateral-forum').addEventListener('click', function () {
        unloadHTML('conteudo_principal');
        loadHTML("../Paginas/menu-forum.php", "../Styles/estilo_menu-forum.css", "conteudo_principal", carregamentoForum);
    });
    document.getElementById('lateral-arquivos').addEventListener('click', function () {
        unloadHTML('conteudo_principal');
        loadHTML("../Paginas/arquivos.html", "../Styles/estilo_arquivos.css", "conteudo_principal", carregamentoArquivos);
    });
    document.getElementById('lateral-configuracoes').addEventListener('click', function () {
        unloadHTML('conteudo_principal');
        loadHTML("../Paginas/menu-perfil.php", "../Styles/estilo_menu-perfil.css", "conteudo_principal", carregamentoPerfil);
    });
}

function carregamentoMain() {
    const botaodrop = document.getElementById('botao-drop-sair');
    if (botaodrop) {
        botaodrop.addEventListener('click', function () {
            location.href = 'logout.php'
        });
    }
    const botaodropdw = document.getElementById('botao-drop-down');
    if (botaodropdw) {
        botaodropdw.addEventListener('click', toggleDropdown);
    }
}

function carregamentoPerfil() {
    carregamentoMain();
    const profilePictureInput = document.getElementById("profilePictureInput");
    if (profilePictureInput) {
        profilePictureInput.addEventListener('change', async function (event) {
            const file = event.target.files[0];
            if (file) {
                onAuthStateChanged(auth, async (user) => {
                    if (user) {
                        const userId = user.uid;
                        const botao = document.getElementById('botaoloadfoto');
                        const load = document.getElementById('loading-fotoperfil');
                        load.style.display = 'block';
                        botao.style.display = 'none';
                        const storageRef = ref(storage, `profilePictures/${userId}`);
                        await uploadBytes(storageRef, file);
                        const downloadURL = await getDownloadURL(storageRef);

                        // Atualizar a foto de perfil no Firestore
                        const userRef = doc(db, "InforConta", userId);
                        await updateDoc(userRef, {
                            fotoPerfil: downloadURL
                        });

                        // Atualizar a imagem no perfil
                        document.getElementById('profileImage').src = downloadURL;
                        console.log('Foto de perfil atualizada com sucesso:', downloadURL);
                        load.style.display = 'none';
                        botao.style.display = 'block';
                    } else {
                        console.log('Nenhum usuário está logado.');
                    }
                });
            }
        });
    } else {
        console.error('Elemento profilePictureInput não encontrado.');
    }
    const editarPerfilBtn = document.getElementById('editarPerfilBtn');
    if (editarPerfilBtn) {
        editarPerfilBtn.addEventListener('click', toggleEditMode);
    } else {
        console.error('Elemento editarPerfilBtn não encontrado.');
    }
    document.getElementById('periodo').addEventListener('focus', function () {
        if (this.value === 'Não informado') {
            this.value = '';
        }
    });
    document.getElementById('periodo').addEventListener('blur', function () {
        if (this.value === '') {
            this.value = 'Não informado';
        }
    });
}


function toggleEditMode() {
    const isEditing = document.getElementById('editarPerfilBtn').innerText === 'Salvar';
    const periodo = document.getElementById('periodo');
    const nascimento = document.getElementById('nascimento');
    const descricao = document.getElementById('descricao');

    if (isEditing) {
        // Carregar o texto salvo em periodo e a data em nascimento, além da descrição 
        const periodoValue = periodo.value;
        var nascimentoValue = nascimento.value;
        const descricaoValue = descricao.value;
        if (nascimentoValue === '') {
            nascimentoValue = 'Não informado';
        }

        onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Buscar informações da conta no Firestore
                const docRef = doc(db, "InforConta", user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    // Atualizar informações no Firestore
                    await updateDoc(docRef, {
                        periodoIngresso: periodoValue,
                        dataNascimento: nascimentoValue,
                        descricao: descricaoValue
                    });

                    console.log('Informações atualizadas com sucesso.');
                } else {
                    console.error('Documento não encontrado.');
                }
            }
        }
        );
        periodo.disabled = true;
        nascimento.readOnly = true;
        descricao.readOnly = true;
        editarPerfilBtn.innerHTML = '<img class="icone" src="../Recursos/Imagens/user.png" alt="icone-user">Editar perfil';

    } else {
        // Switch to edit mode
        periodo.disabled = false;
        nascimento.readOnly = false;
        descricao.readOnly = false;
        editarPerfilBtn.innerHTML = '<img class="icone" src="../Recursos/Imagens/save.png" alt="icone-salvar">Salvar';
    }
}


async function ajustarusuariosLogados() {
    const inforConta = collection(db, 'InforConta');
    const q = query(inforConta, where('tipoConta', '==', 'Monitor'));
    const usuarios = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        usuarios.push(doc.data());
    });
    const usuariosLogados = document.getElementById('listagemdeMonitores');
    usuariosLogados.innerHTML = '';
    usuarios.forEach((usuario) => {
        const usuarioLogado = document.createElement('div');
        usuarioLogado.classList.add('usuarioLogado');
        usuarioLogado.innerHTML = `
            <img src="${usuario.fotoPerfil || '../Recursos/Imagens/perfil-teste.avif'}" alt="Foto de perfil">
            <div>
                <h3>${usuario.nome}</h3>
                <p>${usuario.email}</p>
            </div>
        `;
        usuariosLogados.appendChild(usuarioLogado);
    });
}
/*
async function ajustarAmigoLogados() {
    const inforConta = collection(db, 'InforConta');
    const q = query(inforConta, where('tipoConta', '==', 'Monitor'));
    const usuarios = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        usuarios.push(doc.data());
    });
    const usuariosLogados = document.getElementById('diferente');
    usuariosLogados.innerHTML = '';
    usuarios.forEach((usuario) => {
        const amigoItem = document.createElement('div');
        amigoItem.classList.add('amigoItem');
        amigoItem.innerHTML = `
            <img src="${usuario.fotoPerfil || '../Recursos/Imagens/perfil-teste.avif'}" alt="Foto de perfil">
            <div>
                <h2>${usuario.nome}</h2>
                <p>${amigo.mensagemRecente || 'Nenhuma mensagem recente'}</p>
            </div>
        `;
        usuariosLogados.appendChild(amigoItem);
    });
}  
    */

function toggleDropdown() {
    var dropdown = document.getElementById('dropdown');
    if (dropdown.style.display === 'none' || dropdown.style.display === '') {
        dropdown.style.display = 'block';
    } else {
        dropdown.style.display = 'none';
    }
}

window.onclick = function (event) {
    if (!event.target.closest('.user-profile')) {
        var dropdown = document.getElementById('dropdown');
        if (dropdown.style.display === 'block') {
            dropdown.style.display = 'none';
        }
    }
}