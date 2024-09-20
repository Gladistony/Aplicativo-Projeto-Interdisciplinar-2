import { collection, query, where, getDocs, orderBy, limit, doc } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { db } from '../firebase-config.js';
import { getFirstTwoNames } from '../utilidades.js';


//Modelo de item de pontuação
//<li class="list-item">
//    <div class="list-item-header">
//        <span class="list-item-header-badge">1º</span>
//        <img src="../Recursos/Imagens/user.png" alt="foto" class="list-item-icon">
//    </div>
//    <div class="list-item-body">
//        <span class="list-item-title">Nome</span>
//        <div class="list-item-level">
//            <span class="level">Nível: 20</span>
//        </div>
//        <span class="list-item-subtitle">Pontos 80/100</span>
//        <div class="list-item-progress-bar">
//            <span class="progress" style="width: 80%;"></span>
//        </div>
//   </div>
//</li>


async function carregamentoPontuacao() {
    //Pegar os meus pontos
    const pontos = window.sessionData.userInfo.pontuacao || 0;
    const nivelcalculado = Math.floor(pontos / 100);
    const pontosrestantes = pontos % 100;
    const meunome = window.sessionData.userInfo.nome;
    const meufoto = window.sessionData.userInfo.fotoPerfil;
    var minhaposicao = "?";

    //Preencher os elementos
    const camponome = document.getElementById("pontos-meu-nome");
    const camponivel = document.getElementById("pontos-meu-nivel");
    const campopontos = document.getElementById("pontos-meus-pontos");
    const camposbar = document.getElementById("pontos-progress-bar");
    const campoposicao = document.getElementById("pontos-minha-posicao");
    const campofoto = document.getElementById("pontos-minha-foto");

    camponome.innerText = meunome;
    camponivel.innerText = "Nível: " + nivelcalculado;
    campopontos.innerText = pontos;
    camposbar.style.width = `${pontosrestantes}%`;
    campoposicao.innerText = `${minhaposicao}°`;
    campofoto.src = meufoto;

    //Pegar os 3 primeiros no rank de pontos
    const campolistajogador = document.getElementById("lista-posicoes-jogadores");

    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const inforConta = collection(db, 'InforConta');
            const q = query(
                inforConta,
                orderBy("pontuacao", "desc"), limit(3))
            const querySnapshot = await getDocs(q);
            const dados = [];
            await querySnapshot.forEach((doc) => {
                dados.push(doc.data());
            });
            for (let i = 0; i < dados.length; i++) {
                const jogador = dados[i];
                if (jogador.email == user.email) {
                    minhaposicao = i + 1;
                    campoposicao.innerText = `${minhaposicao}°`;
                }
                //Coletar dados do jogador
                const nome = getFirstTwoNames(jogador.nome);
                const foto = jogador.fotoPerfil;
                const pontos = jogador.pontuacao;
                const nivel = Math.floor(pontos / 100);
                const pontosrestantes = pontos % 100;
                const posicao = i + 1;

                //Criar elementos
                const item = document.createElement("li");
                item.classList.add("list-item");
                const header = document.createElement("div");
                header.classList.add("list-item-header");
                const badge = document.createElement("span");
                badge.classList.add("list-item-header-badge");
                badge.innerText = posicao + "º";
                const icon = document.createElement("img");
                icon.src = foto;
                icon.alt = "foto";
                icon.classList.add("list-item-icon");
                const body = document.createElement("div");
                body.classList.add("list-item-body");
                const title = document.createElement("span");
                title.classList.add("list-item-title");
                title.innerText = nome;
                const level = document.createElement("div");
                level.classList.add("list-item-level");
                const levelspan = document.createElement("span");
                levelspan.classList.add("level");
                levelspan.innerText = "Nível: " + nivel;
                const subtitle = document.createElement("span");
                subtitle.classList.add("list-item-subtitle");
                subtitle.innerText = "Pontos: " + pontos;
                const progressbar = document.createElement("div");
                progressbar.classList.add("list-item-progress-bar");
                const progress = document.createElement("span");
                progress.classList.add("progress");
                progress.style.width = `${pontosrestantes}%`;

                //Adicionar elementos
                level.appendChild(levelspan);
                body.appendChild(title);
                body.appendChild(level);
                body.appendChild(subtitle);
                progressbar.appendChild(progress);
                body.appendChild(progressbar);
                header.appendChild(badge);
                header.appendChild(icon);
                item.appendChild(header);
                item.appendChild(body);
                campolistajogador.appendChild(item);
            }
        }
    });
}

export { carregamentoPontuacao };