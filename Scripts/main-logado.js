import { getAuth, onAuthStateChanged, sendEmailVerification } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { collection, query, where, doc, arrayUnion, getDoc, getDocs, addDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
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
import { carregamentoPontuacao } from './principalScripts/sistemapontuacao.js';


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
    loadHTML("../Paginas/telaDeAmigos.html", "../Styles/estilo_tela-de-amigos.css", "conteudo_principal", carregamentoAmigos);
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
} else if (paginaName === 'pontuacao') {
    loadHTML("../Paginas/telaDeScoreDePontos.html", "../Styles/estilo_telaDeScoreDePontos.css", "conteudo_principal", carregamentoPontuacao);
} else if (paginaName === 'perfilpublico') {
    const id = getURLParameter('id') || '0000';
    window.perfilID = id;
    loadHTML("../Paginas/menu-perfil-publico.html", "../Styles/estilo_menu-perfil-publico.css", "conteudo_principal", carregamentoperfilpublico);
}


//loadHTML("../Paginas/menu-home.php", "../Styles/estilo_menu-home,css", "conteudo_principal", carregamentoMain);
//loadHTML("../Paginas/menu-perfil.php", "../Styles/estilo_menu-perfil.css", "conteudo_principal", carregamentoPerfil);
//Modelo de conquista
//foreach($arrayConquistas as $conquista) {
//            echo '<div class="conquista-container">';
//            echo '<img class="conquista-img" src="'.htmlspecialchars($conquista[0]). '" />';
//            echo '<div class="conquista-texto">';
//            echo '<p class="titulo-conquista">'.htmlspecialchars($conquista[1]). '</p>';
//            echo '<p class="descricao-conquista">'.htmlspecialchars($conquista[2]). '</p>';
//            echo '</div>';
//            echo '</div>';
//}

function carregamentoperfilpublico() {
    //Carregar elementos da pagina
    const nome = document.getElementById("usuario-publico");
    const email = document.getElementById("email-publico");
    const pontos = document.getElementById("botaoPontuacao"); //button
    const tipoconta = document.getElementById("tipo-conta-publico");
    const curso = document.getElementById("curso-publico");
    const periodo = document.getElementById("periodo-publico");
    const datacriacao = document.getElementById("datacriacao-publico");
    const descricao = document.getElementById("descricao");
    const conquistas = document.getElementById("conquistas-publico");
    const foto = document.getElementById("profileImage");
    const addamigo = document.getElementById("botaoAmizade");
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const docRef = doc(db, "InforConta", window.perfilID);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                nome.innerHTML = data.nome;
                email.innerHTML = data.email;
                pontos.innerHTML = "Pontuação: " + data.pontuacao;
                //tipoconta.innerHTML = data.tipoConta;
                tipoconta.innerHTML = data.tipoConta || 'Aluno';
                if (data.tipoConta === 'Aluno') {
                    tipoconta.style.color = '#10648C'; // Azul para aluno
                } else if (data.tipoConta === 'Monitor') {
                    tipoconta.style.color = '#F0394F'; // Vermelho para monitor
                } else if (data.tipoConta === 'Professor') {
                    tipoconta.style.color = '#5E109B'; // Roxo para professor
                } else {
                    tipoconta.style.color = '#000000'; // Preto para outros
                }
                curso.innerHTML = data.curso;
                periodo.innerHTML = data.periodoIngresso || "Não informado";
                datacriacao.innerHTML = data.dataCriacao;
                descricao.innerHTML = data.descricao;
                //conquistas.innerHTML = data.conquistas;
                foto.src = data.fotoPerfil || '../Recursos/Imagens/perfil-teste.avif';
                var minhalistaamigos = window.sessionData.userInfo.listaAmigos || [];
                minhalistaamigos.push(window.sessionData.id);
                if (minhalistaamigos.includes(window.perfilID)) {
                    addamigo.style.display = 'none';
                }
                const conquistasArray = data.conquistas || [];
                for (let i = 0; i < conquistasArray.length; i++) {
                    const documento = doc(db, "conquistas", conquistasArray[i]);
                    const docSnap = await getDoc(documento);
                    if (!docSnap.exists()) {
                        continue;
                    }
                    const conquista = docSnap.data();
                    //const conquista = conquistasArray[i];
                    const conquistaDiv = document.createElement('div');
                    conquistaDiv.className = 'conquista-container';
                    const conquistaImg = document.createElement('img');
                    conquistaImg.className = 'conquista-img';
                    conquistaImg.src = conquista.imgURL;
                    const conquistaTexto = document.createElement('div');
                    conquistaTexto.className = 'conquista-texto';
                    const tituloConquista = document.createElement('p');
                    tituloConquista.className = 'titulo-conquista';
                    tituloConquista.innerHTML = conquista.nome;
                    const descricaoConquista = document.createElement('p');
                    descricaoConquista.className = 'descricao-conquista';
                    descricaoConquista.innerHTML = conquista.descricao;
                    conquistaTexto.appendChild(tituloConquista);
                    conquistaTexto.appendChild(descricaoConquista);
                    conquistaDiv.appendChild(conquistaImg);
                    conquistaDiv.appendChild(conquistaTexto);
                    conquistas.appendChild(conquistaDiv);
                }
                if (conquistasArray.length === 0) {
                    const conquistaDiv = document.createElement('div');
                    conquistaDiv.className = 'conquista-container';
                    const conquistaTexto = document.createElement('div');
                    conquistaTexto.className = 'conquista-texto';
                    const descricaoConquista = document.createElement('p');
                    descricaoConquista.className = 'descricao-conquista';
                    descricaoConquista.innerHTML = 'Este usuário ainda não possui conquistas.';
                    conquistaTexto.appendChild(descricaoConquista);
                    conquistaDiv.appendChild(conquistaTexto);
                    conquistas.appendChild(conquistaDiv);
                }
            }
        }
    });
}

function carregamentoArquivos() {
    var script = document.createElement('script');
    script.src = '../Scripts/arquivos_script.js';
    script.type = 'module';
    document.head.appendChild(script);
}

function carregamentoAmigos() {
    var script = document.createElement('script');
    script.src = '../Scripts/scriptBlocos/menuAmigos.js';
    script.type = 'module';
    document.head.appendChild(script);

    document.getElementById("barra-pesquisa").addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Evita o comportamento padrão do Enter
            document.getElementById("botao-pesquisa").click(); // Aciona o clique do botão
        }
    });
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

window.addamigopublico = async function () {
    console.log("Adicionar amigo");
    const userDoc = doc(db, "InforConta", window.sessionData.id);
    await updateDoc(userDoc, {
        listaAmigos: arrayUnion(window.perfilID)
    });
    location.reload();
}

window.reenviaremail = async function () {
    const bottaoid = document.getElementById('reenviarEmailBtn');
    bottaoid.innerHTML = 'Enviando...';
    bottaoid.disabled = true;
    const user = auth.currentUser;
    sendEmailVerification(user).then(() => {
        bottaoid.innerHTML = 'E-mail enviado!';
    }).catch((error) => {
        bottaoid.innerHTML = 'Erro ao enviar e-mail';
    });
}