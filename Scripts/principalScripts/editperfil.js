import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { doc, getDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js';
import { db } from '../firebase-config.js';

function carregamentoPerfil() {
    const storage = getStorage();
    const auth = getAuth();
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
                        document.getElementById('profileImage').src = downloadURL;
                        console.log('Foto de perfil atualizada com sucesso:', downloadURL);
                        // Atualizar a imagem no perfil
                        const datasesao = window.sessionData;
                        //mudar a foto de perfil
                        datasesao.userInfo.fotoPerfil = downloadURL;
                        //salvar a seção
                        window.sessionData = datasesao;
                        await fetch('../Scripts/set-session.php', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(datasesao)
                        });

                        //atualizar pagina
                        localStorage.removeItem('usuariosMonitores');
                        localStorage.removeItem('tempoSalvo');
                        window.location.reload();

                        //document.getElementById('profileImage').src = downloadURL;
                        // Atualizar a imagem no $session
                        //window.sessionData.fotoPerfil = downloadURL;
                        //console.log('Foto de perfil atualizada com sucesso:', downloadURL);
                        //load.style.display = 'none';
                        //botao.style.display = 'block';
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
        editarPerfilBtn.addEventListener('click', toggleEditModePerfil);
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

function toggleEditModePerfil() {
    const auth = getAuth();
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

export { carregamentoPerfil, toggleEditModePerfil };