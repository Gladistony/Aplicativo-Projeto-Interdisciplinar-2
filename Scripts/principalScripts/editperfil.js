import { getAuth, onAuthStateChanged, updatePassword, signOut } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
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
    //Edição de senha
    window.originalValues = {};
}

function toggleEditModePerfil() {
    const auth = getAuth();

    const isEditing = document.getElementById('editarPerfilBtn').innerText === 'Salvar';
    const nomeContainer = document.getElementById('nomeContainer');
    const nomeElement = document.getElementById('nome');
    const periodo = document.getElementById('periodo');
    const nascimento = document.getElementById('nascimento');
    const descricao = document.getElementById('descricao');
    const senha = document.getElementById('senha');
    const senhaconfirm = document.getElementById('senhaconfirm');
    const senhaAviso = document.getElementById('senhaAviso');
    const editarPerfilBtn = document.getElementById('editarPerfilBtn');

    if (isEditing) {
        // Carregar o texto salvo em nome, periodo, nascimento, descrição e senha
        let nomeValue = nomeElement.value.trim();
        const periodoValue = periodo.value;
        let nascimentoValue = nascimento.value;
        const descricaoValue = descricao.value;
        const senhaValue = senha.value;
        const senhaconfirmValue = senhaconfirm.value;

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

        if (senhaValue !== senhaconfirmValue) {
            alert('As senhas não coincidem.');
            return;
        }

        if (!hasChanges()) {
            // Voltar para o modo de visualização sem exibir alerta
            nomeContainer.innerHTML = `<span id="nome" class="input-nome-fonte">${originalValues.nome}</span>`;
            periodo.disabled = true;
            nascimento.readOnly = true;
            descricao.readOnly = true;
            senha.style.display = 'none';
            senhaconfirm.style.display = 'none';
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
                        }, 2000); // Atraso de 1 segundo para permitir que a mensagem seja exibida
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
        senhaconfirm.style.display = 'none';
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
        senhaconfirm.style.display = 'block';
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

export { carregamentoPerfil, toggleEditModePerfil };