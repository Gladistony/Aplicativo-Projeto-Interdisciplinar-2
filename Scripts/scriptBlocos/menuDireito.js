import { db } from '../firebase-config.js';
import { collection, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';

function loadMenuDireito() {
    ajustarmonitoresLogados();
    ajustarAmigosLogados();
    //document.getElementById('link-amigos').addEventListener('click', function () {
    //    unloadHTML('conteudo_principal');
    //    loadHTML("../Paginas/telaDeAmigos.php", "../Styles/estilo_tela-de-amigos.css", "conteudo_principal");
    // });
}

async function ajustarmonitoresLogados() {
    //console.log(window.sessionData);

    const auth = getAuth();
    const agora = new Date().getTime();
    const cincoMinutos = 1 * 60 * 1000;
    const umMinutoAtras = agora - 3 * 60000;
    const dadosSalvos = JSON.parse(localStorage.getItem('usuariosMonitores'));
    const tempoSalvo = localStorage.getItem('tempoSalvo');
    if (dadosSalvos && tempoSalvo && (agora - tempoSalvo < cincoMinutos)) {
        ajusteMonito(dadosSalvos);
        console.log('Dados carregados do localStorage');
    } else {
        const inforConta = collection(db, 'InforConta');
        const q = query(
            inforConta,
            where('tipoConta', '==', 'Monitor')
        );
        const usuarios = [];
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.dataacesso && data.dataacesso > umMinutoAtras) {
                usuarios.push(doc.data());
            }
        });

        // Salvar os dados no localStorage
        localStorage.setItem('usuariosMonitores', JSON.stringify(usuarios));
        localStorage.setItem('tempoSalvo', agora);
        ajusteMonito(usuarios);
        console.log('Dados carregados do Firestore');
    }
}

function ajusteMonito(dadosSalvos) {
    const usuariosLogados = document.getElementById('listagemdeMonitores');
    usuariosLogados.innerHTML = '';

    if (dadosSalvos.length === 0) {
        const aviso = document.createElement('div');
        aviso.classList.add('aviso');
        aviso.innerHTML = '<p>Não há monitores online no momento.</p>';
        usuariosLogados.appendChild(aviso);
    } else {
        dadosSalvos.forEach((usuario) => {
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
}



async function ajustarAmigosLogados() {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        console.error("Usuário não está logado.");
        return;
    }

    const userId = user.uid;
    try {
        const userDoc = await getDoc(doc(db, "InforConta", userId));
        const userData = userDoc.data();

        if (userData && userData.listaAmigos && userData.listaAmigos.length > 0) {
            const amigosContainer = document.getElementById('diferente');
            amigosContainer.innerHTML = '';

            for (const amigoId of userData.listaAmigos) {
                const amigoDoc = await getDoc(doc(db, "InforConta", amigoId));
                if (amigoDoc.exists()) {
                    const amigoData = amigoDoc.data();
                    renderizarAmigo(amigoData, amigosContainer);
                } else {
                    console.warn(`Amigo com ID ${amigoId} não encontrado.`);
                }
            }
        } else {
            const amigosContainer = document.getElementById('diferente');
            amigosContainer.innerHTML = '<p>Você ainda não adicionou nenhum amigo.</p>';
        }
    } catch (error) {
        console.error("Erro ao buscar dados dos amigos: ", error);
    }
}

function renderizarAmigo(amigoData, container) {
    const amigoItem = document.createElement('div');
    amigoItem.classList.add('amigoItem');
    amigoItem.innerHTML = `
        <a id="tudo-amigo"><img id="foto-amigo" src="${amigoData.fotoPerfil || '../Recursos/Imagens/perfil-teste.avif'}" alt="Foto de perfil">
        <div id="infor-amigo">
            <h2 id="nome-amigo">${amigoData.nome}</h2>
            <p id="msg-amigo">Ainda sem mensagens recentes</p>
        </div></a>
    `;
    container.appendChild(amigoItem);
}

export { loadMenuDireito };