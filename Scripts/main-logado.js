import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { collection, query, where, doc, getDoc, getDocs, addDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js';
import { db } from './firebase-config.js';
import { loadHTML, getURLParameter } from './CarregamentoHtml.js';
import { loadMenuDireito } from './scriptBlocos/menuDireito.js';
import { loadMenulado } from './scriptBlocos/menuLado.js';
import { loadMenutopo } from './scriptBlocos/menuTopo.js';
import { carregamentoBoasvindas } from './principalScripts/boasvindas.js';
import { carregamentoPerfil, toggleEditModePerfil } from './principalScripts/editperfil.js';
import { atualizarConecaoFirebase } from './atualizarData.js';
import { carregamentoForum, carregamentoSubForum, carregamentoConteudoForum } from './principalScripts/forum.js';


const paginaName = getURLParameter('pagina') || 'home';
const auth = getAuth();
//const storage = getStorage();

//Atualizar dados e iniciar loop de atualização
await atualizarConecaoFirebase();

loadHTML('../Paginas/top-menu.php', '../Styles/estilo_menu-topo.css', 'menu_do_topo', loadMenutopo);
loadHTML('../Paginas/menu-lateral.php', '../Styles/estilo_menu-lateral.css', 'menu_do_lado', loadMenulado); //carregamentoLateral
loadHTML("../Paginas/menu-conversas.php", "../Styles/estilo_menu-conversas.css", "barra_lado_chat", loadMenuDireito); //carregamentoConversas
if (paginaName === 'home') {
    loadHTML("../Paginas/menu-home.php", "../Styles/estilo_menu-home.css", "conteudo_principal", carregamentoBoasvindas);
} else if (paginaName === 'perfil') {
    loadHTML("../Paginas/menu-perfil.php", "../Styles/estilo_menu-perfil.css", "conteudo_principal", carregamentoPerfil);
} else if (paginaName === 'amigos') {
    loadHTML("../Paginas/telaDeAmigos.html", "../Styles/estilo_tela-de-amigos.css", "conteudo_principal");
} else if (paginaName === 'arquivos') {
    loadHTML("../Paginas/arquivos.html", "../Styles/estilo_arquivos.css", "conteudo_principal", carregamentoArquivos);
} else if (paginaName === 'forum') {
    loadHTML("../Paginas/forum/forum-inicio.php", "../Styles/estilo_menu-forum.css", "conteudo_principal", carregamentoForum);
} else if (paginaName === 'subforum') {
    const subtopico = getURLParameter('id') || '0000';
    window.subtopicoid = subtopico;
    //console.log(subtopico);
    loadHTML("../Paginas/forum/forum-subtopico.php", "../Styles/estilo_tela-de-subtopico.css", "conteudo_principal", carregamentoSubForum);
} else if (paginaName === 'conteudoForum') {
    const ide = getURLParameter('id') || '0000';
    window.topicoID = ide;
    loadHTML("../Paginas/forum/forum-conteudo.php?id=" + ide, "../Styles/forum-topico.css", "conteudo_principal", carregamentoConteudoForum);
}


//loadHTML("../Paginas/menu-home.php", "../Styles/estilo_menu-home,css", "conteudo_principal", carregamentoMain);
//loadHTML("../Paginas/menu-perfil.php", "../Styles/estilo_menu-perfil.css", "conteudo_principal", carregamentoPerfil);

function carregamentoArquivos() {
    var script = document.createElement('script');
    script.src = '../Scripts/arquivos_script.js';
    script.type = 'module';
    document.head.appendChild(script);
}

window.onclick = function (event) {
    if (!event.target.closest('.user-profile')) {
        var dropdown = document.getElementById('dropdown');
        if (dropdown.style.display === 'block') {
            dropdown.style.display = 'none';
        }
    }
}

window.postarComentario = async function () {
    const text = document.getElementById('novo-comentario').value;
    if (text === '') {
        return;
    }
    await addDoc(collection(db, "comentarios-forum"), {
        conteudo: text,
        topicoID: window.topicoID,
        data: new Date().getTime(),
        autor: window.sessionData.id,
        curtida: [],
    });
    // Atualizar a página
    window.location.reload();
}

window.curtirComentario = async function (id) {
    //console.log("id comentario", id);
    //CArregar dados do comentário
    const docRef = doc(db, "comentarios-forum", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.curtida.includes(window.sessionData.id)) {
            data.curtida = data.curtida.filter(e => e !== window.sessionData.id);
        } else {
            data.curtida.push(window.sessionData.id);
        }
        await updateDoc(docRef, {
            curtida: data.curtida,
        });
        // Atualizar a página
        window.location.reload();
    }
}