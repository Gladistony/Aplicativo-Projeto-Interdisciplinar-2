import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { getFirestore, doc, getDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
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

loadHTML('../Paginas/top-menu.html', '../Styles/estilo_menu-topo.css', 'menu_do_topo');
loadHTML('../Paginas/menu-lateral.html', '../Styles/estilo_menu-lateral.css', 'menu_do_lado');
loadHTML("../Paginas/menu-conversas.html", "../Styles/estilo_menu-conversas.css", "barra_lado_chat");
loadHTML("../Paginas/menu-perfil.php", "../Styles/estilo_menu-perfil.css", "conteudo_principal", carregamentoInicialConcluido);


const auth = getAuth();
const storage = getStorage();

function carregamentoInicialConcluido() {
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
}