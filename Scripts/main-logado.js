import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { collection, query, where, doc, getDoc, getDocs, updateDoc } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
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
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = file;
    document.head.appendChild(link);
}

loadHTML('../Paginas/top-menu.php', '../Styles/estilo_menu-topo.css', 'menu_do_topo');
loadHTML('../Paginas/menu-lateral.html', '../Styles/estilo_menu-lateral.css', 'menu_do_lado');
loadHTML("../Paginas/menu-conversas.php", "../Styles/estilo_menu-conversas.css", "barra_lado_chat");
loadHTML("../Paginas/menu-perfil.php", "../Styles/estilo_menu-perfil.css", "conteudo_principal", carregamentoInicialConcluido);


const auth = getAuth();
const storage = getStorage();

function carregamentoInicialConcluido() {
    ajustarusuariosLogados();
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
        document.getElementById('editarPerfilBtn').innerText = 'Editar perfil';

    } else {
        // Switch to edit mode
        periodo.disabled = false;
        nascimento.readOnly = false;
        descricao.readOnly = false;
        document.getElementById('editarPerfilBtn').innerText = 'Salvar';
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