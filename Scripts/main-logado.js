import { getAuth, onAuthStateChanged, updatePassword, signOut } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { collection, query, where, doc, getDoc, getDocs, updateDoc, addDoc } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
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

let originalValues = {};


function showCustomAlert(message) {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '1000';

    const alertDiv = document.createElement('div');
    alertDiv.style.padding = '20px';
    alertDiv.style.backgroundColor = 'white';
    alertDiv.style.border = '1px solid black';
    alertDiv.style.borderRadius = '10px';
    alertDiv.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    alertDiv.innerText = message;

    overlay.appendChild(alertDiv);
    document.body.appendChild(overlay);

    setTimeout(() => {
        document.body.removeChild(overlay);
    }, 1000); // Exibir a mensagem por 1 segundo
}

function hasChanges() {
    const nomeValue = document.getElementById('nome').value.trim();
    const periodoValue = document.getElementById('periodo').value;
    const nascimentoValue = document.getElementById('nascimento').value;
    const descricaoValue = document.getElementById('descricao').value;
    const senhaValue = document.getElementById('senha').value;

    return (
        nomeValue !== originalValues.nome ||
        periodoValue !== originalValues.periodo ||
        nascimentoValue !== originalValues.nascimento ||
        descricaoValue !== originalValues.descricao ||
        senhaValue !== ''
    );
}

function toggleEditMode() {
    const isEditing = document.getElementById('editarPerfilBtn').innerText === 'Salvar';
    const nomeContainer = document.getElementById('nomeContainer');
    const nomeElement = document.getElementById('nome');
    const periodo = document.getElementById('periodo');
    const nascimento = document.getElementById('nascimento');
    const descricao = document.getElementById('descricao');
    const senha = document.getElementById('senha');
    const senhaAviso = document.getElementById('senhaAviso');
    const editarPerfilBtn = document.getElementById('editarPerfilBtn');

    if (isEditing) {
        // Carregar o texto salvo em nome, periodo, nascimento, descrição e senha
        let nomeValue = nomeElement.value.trim();
        const periodoValue = periodo.value;
        let nascimentoValue = nascimento.value;
        const descricaoValue = descricao.value;
        const senhaValue = senha.value;

        // Verificar se o nome contém apenas uma palavra e remover espaços no início ou no final
        if (!nomeValue.includes(' ')) {
            nomeValue = nomeValue.trim();
        }

        if (nascimentoValue === '') {
            nascimentoValue = 'Não informado';
        }

        // Verificar se a senha tem pelo menos 8 caracteres
        if (senhaValue && senhaValue.length < 8) {
            senhaAviso.style.display = 'block';
            alert('A senha deve conter pelo menos 8 caracteres.');
            return;
        } else {
            senhaAviso.style.display = 'none';
        }

        if (!hasChanges()) {
            // Voltar para o modo de visualização sem exibir alerta
            nomeContainer.innerHTML = `<span id="nome" class="input-nome-fonte">${originalValues.nome}</span>`;
            periodo.disabled = true;
            nascimento.readOnly = true;
            descricao.readOnly = true;
            senha.style.display = 'none';
            senhaAviso.style.display = 'none';
            editarPerfilBtn.innerHTML = '<img class="icone" src="../Recursos/Imagens/user.png" alt="icone-user">Editar perfil';
            return;
        }

        onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    // Atualizar a senha do usuário, se fornecida
                    if (senhaValue) {
                        await updatePassword(user, senhaValue);
                        console.log('Senha atualizada com sucesso.');
                    }

                    // Buscar informações da conta no Firestore
                    const docRef = doc(db, "InforConta", user.uid);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        // Atualizar informações no Firestore
                        await updateDoc(docRef, {
                            nome: nomeValue,
                            periodoIngresso: periodoValue,
                            dataNascimento: nascimentoValue,
                            descricao: descricaoValue
                        });

                        console.log('Informações atualizadas com sucesso.');

                        // Exibir mensagem customizada e fazer logout
                        showCustomAlert('Informações do perfil alteradas, saindo para validar alterações.');
                        setTimeout(async () => {
                            await signOut(auth);
                            console.log('Logout realizado com sucesso.');
                            location.href = 'logout.php'; // Redirecionar para a página de logout
                        }, 1000); // Atraso de 1 segundo para permitir que a mensagem seja exibida
                    } else {
                        console.error('Documento não encontrado.');
                    }
                } catch (error) {
                    console.error('Erro ao atualizar informações:', error);
                    alert('Erro ao atualizar informações. Por favor, tente novamente.');
                }
            }
        });

        // Voltar para o modo de visualização
        nomeContainer.innerHTML = `<span id="nome" class="input-nome-fonte">${nomeValue}</span>`;
        periodo.disabled = true;
        nascimento.readOnly = true;
        descricao.readOnly = true;
        senha.style.display = 'none';
        senhaAviso.style.display = 'none';
        editarPerfilBtn.innerHTML = '<img class="icone" src="../Recursos/Imagens/user.png" alt="icone-user">Editar perfil';

        // Remover o elemento <h3> se existir
        const alterarSenhaHeader = document.getElementById('alterarSenhaHeader');
        if (alterarSenhaHeader) {
            alterarSenhaHeader.remove();
        }

    } else {
        // Switch to edit mode
        const nomeValue = nomeElement.innerText;
        originalValues = {
            nome: nomeValue,
            periodo: periodo.value,
            nascimento: nascimento.value,
            descricao: descricao.value
        };
        nomeContainer.innerHTML = `<input type="text" id="nome" class="input-nome-fonte input-nome-fonte-edit" value="${nomeValue}">`;
        periodo.disabled = false;
        nascimento.readOnly = false;
        descricao.readOnly = false;
        senha.style.display = 'block';
        senhaAviso.style.display = 'block';
        editarPerfilBtn.innerHTML = '<img class="icone" src="../Recursos/Imagens/save.png" alt="icone-salvar">Salvar';

        // Adicionar o elemento <h3> acima do campo de senha
        if (!document.getElementById('alterarSenhaHeader')) {
            const alterarSenhaHeader = document.createElement('h3');
            alterarSenhaHeader.id = 'alterarSenhaHeader';
            alterarSenhaHeader.innerText = 'Alterar senha';
            senha.parentNode.insertBefore(alterarSenhaHeader, senha);
        }
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