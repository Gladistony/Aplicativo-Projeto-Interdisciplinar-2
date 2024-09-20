import { getAuth } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { doc, getDoc, collection, where, getDocs, addDoc, query } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import { db } from '../firebase-config.js';
import { getFirstTwoNames } from '../utilidades.js';

async function carregamentoConteudoForum() {
    const idTopico = window.topicoID;
    const topicoInfo = doc(db, "topicos-alunos", idTopico);
    const topicoSnapshot = await getDoc(topicoInfo);
    const topicoData = topicoSnapshot.data();

    const titulo = topicoData.titulo;
    const conteudo = topicoData.conteudo;
    //Pegar data no formado dd/mm/aaaa hh:mm
    const data = new Date(topicoData.data).toLocaleString('pt-BR');
    //Pegar nome do autor
    const autorRef = doc(db, "InforConta", topicoData.autor);
    const autorSnapshot = await getDoc(autorRef);
    const autorData = autorSnapshot.data();
    const autorNome = getFirstTwoNames(autorData.nome);
    const autorFoto = autorData.fotoPerfil || "../Recursos/Imagens/perfil-teste.avif";
    //Pegar os comentários
    const comentariosCol = collection(db, 'comentarios-forum');
    const q = query(comentariosCol, where('topicoID', '==', idTopico));
    const comentariosSnapshot = await getDocs(q);
    var comentariosList = comentariosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    comentariosList.sort((a, b) => new Date(a.data) - new Date(b.data));
    let comentarios = [];
    for (const comentario of comentariosList) {
        const autorRef = doc(db, "InforConta", comentario.autor);
        const autorSnapshot = await getDoc(autorRef);
        var aNome = "Usuário Excluído";
        var aFoto = "../Recursos/Imagens/perfil-teste.avif";
        var tipoConta = "Aluno";
        if (autorSnapshot.exists()) {
            const autorData = autorSnapshot.data();
            aNome = getFirstTwoNames(autorData.nome);
            aFoto = autorData.fotoPerfil || "../Recursos/Imagens/perfil-teste.avif";
            tipoConta = autorData.tipoConta;
        }
        const arraycurtir = comentario.curtida || []
        const totalcurtidas = arraycurtir.length
        const vccurtil = arraycurtir.includes(window.sessionData.id)

        let comentarioInfo = {
            conteudo: comentario.conteudo,
            autor: aNome,
            autorFoto: aFoto,
            autorTipo: tipoConta,
            data: new Date(comentario.data).toLocaleString('pt-BR'),
            curtidas: totalcurtidas,
            curtil: vccurtil,
            id: comentario.id,
            autorID: comentario.autor
        };
        comentarios.push(comentarioInfo);
    }

    document.getElementById('titulo').innerText = titulo;
    document.getElementById('conteudo').innerText = conteudo;
    document.getElementById('autor-foto').src = autorFoto;
    document.getElementById('autor-nome').innerText = autorNome;
    document.getElementById('data-postagem').innerText = data;

    const comentariosContainer = document.getElementById('comentarios');
    comentarios.forEach(comentario => {
        const comentarioDiv = document.createElement('div');
        comentarioDiv.classList.add('comentario');
        comentarioDiv.innerHTML = `
        <img src="${comentario.autorFoto}" alt="Foto do Autor">
        <strong>${comentario.autor}</strong> (${comentario.autorTipo}): ${comentario.conteudo}
        <p>${comentario.data}</p>
        <span class="curtir" onclick="curtirComentario('${comentario.id}')">${comentario.curtil ? 'Descurtir' : 'Curtir'} (${comentario.curtidas})</span>
    `;
        // Adicionar link para o perfil
        comentarioDiv.querySelector('img').addEventListener('click', () => {
            window.location.href = "../Paginas/main-logado.php?pagina=perfilpublico&id=" + comentario.autorID;
        });
        comentariosContainer.appendChild(comentarioDiv);
    });


    document.getElementById('spinner').style.display = 'none';
    document.getElementById('content').style.display = 'block';
    console.log(topicoData);
}


async function carregamentoSubForum() {
    const idSubtopico = window.subtopicoid;
    const subtopicoinfo = doc(db, "subtopicos-forum", idSubtopico);
    const subtopicoSnapshot = await getDoc(subtopicoinfo);
    const subtopicoData = subtopicoSnapshot.data();
    const Titulo = subtopicoData.nome;
    //Baixar lista dos subtopicos
    const auth = getAuth();
    const subtopicosCol = collection(db, 'topicos-alunos');
    const q = query(subtopicosCol, where('subtopicoID', '==', idSubtopico));
    const topicosSnapshot = await getDocs(q);
    let topicosList = topicosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    topicosList.sort((a, b) => new Date(b.data) - new Date(a.data));
    let topicos = [];
    for (const topico of topicosList) {
        //console.log(topico);
        const docRef = doc(db, "InforConta", topico.autor);
        const autorSnapshot = await getDoc(docRef);
        const autorData = autorSnapshot.data();
        const autorNome = getFirstTwoNames(autorData.nome);
        const autorFoto = autorData.fotoPerfil || "../Recursos/Imagens/perfil-teste.avif";
        let topicoInfo = {
            titulo: topico.titulo,
            autor: autorNome,
            autorFoto: autorFoto,
            data: topico.data,
            id: topico.id,
        };
        topicos.push(topicoInfo);
    }
    document.getElementById('titulo').innerText = Titulo;
    const topicosContainer = document.getElementById('topicos');
    topicos.forEach(topico => {
        const topicoDiv = document.createElement('div');
        topicoDiv.classList.add('topico');
        topicoDiv.innerHTML = `
        <h2>${topico.titulo}</h2>
        <div class="info">
            <img src="${topico.autorFoto}" alt="Foto do Autor">
            <div class="autor-data">
                <p>Autor: ${topico.autor}</p>
                <p>Data: ${new Date(topico.data).toLocaleDateString()}</p>
            </div>
        </div>
    `;
        topicoDiv.addEventListener('click', () => {
            window.location.href = "../Paginas/main-logado.php?pagina=conteudoForum&id=" + topico.id;
        });
        topicosContainer.appendChild(topicoDiv);
    });

    var modal = document.getElementById("addTopicoModal");
    var btn = document.getElementById("addTopicoBtn");
    var span = document.getElementsByClassName("close")[0];

    btn.onclick = function () {
        modal.style.display = "block";
    }

    span.onclick = function () {
        modal.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    document.getElementById('addTopicoForm').onsubmit = async function (event) {
        event.preventDefault();

        const auth = getAuth();
        const idSubtopico = window.subtopicoid;
        const topico = await addDoc(collection(db, 'topicos-alunos'), {
            titulo: document.getElementById("tituloTopico").value,
            conteudo: document.getElementById("conteudoTopico").value,
            autor: auth.currentUser.uid,
            data: new Date().getTime(),
            subtopicoID: idSubtopico
        });

        // Recarregar a página
        location.reload();
    }

    document.getElementById('spinner').style.display = 'none';
    document.getElementById('content').style.display = 'block';
}

function carregamentoForum() {
    const tipoconta = window.sessionData.userInfo.tipoConta
    if (tipoconta != "Professor") {
        const botao = document.getElementById('addTurmaBotaoadd')
        botao.style.display = "none"
    }


    var modal = document.getElementById("addTurmaModal");
    var btn = document.getElementById("addTurmaBtn");
    var span = document.getElementsByClassName("close")[0];
    btn.onclick = function () {
        modal.style.display = "block";
    }
    span.onclick = function () {
        modal.style.display = "none";
    }
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    document.getElementById("addTurmaForm").onsubmit = async function (event) {
        event.preventDefault();
        modal.style.display = "none";
        // Aqui você pode adicionar o código para salvar a nova turma
        const auth = getAuth();
        const novaturma = await addDoc(collection(db, 'turmas-forum'), {
            nome: document.getElementById("nome").value,
            periodo: document.getElementById("periodo").value,
            professor: auth.currentUser.uid,
            icone: document.getElementById("icone").value
        });
        const idnovaturma = novaturma.id
        await addDoc(collection(db, 'subtopicos-forum'), {
            nome: "Bate papo",
            turmaId: idnovaturma
        });
        await addDoc(collection(db, 'subtopicos-forum'), {
            nome: "Principal",
            turmaId: idnovaturma
        });
        await addDoc(collection(db, 'subtopicos-forum'), {
            nome: "Duvidas",
            turmaId: idnovaturma
        });
        await addDoc(collection(db, 'subtopicos-forum'), {
            nome: "Atividades",
            turmaId: idnovaturma
        });

        //Regarregar a pagina
        await atualizarmainforum();
        location.reload();

    }
}

async function atualizarmainforum() {
    const auth = getAuth();
    const datasesao = window.sessionData;
    let forum = [];

    const turmasCol = collection(db, 'turmas-forum');
    const turmasSnapshot = await getDocs(turmasCol);
    const turmasList = turmasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const periodoAtual = datasesao.infoConfig.Periodo
    await Promise.all(turmasList.map(async turma => {
        if (turma.periodo == periodoAtual) {
            const iconeTurma = turma.icone;
            const nome = turma.nome;
            const idTurma = turma.id;
            var professor = turma.professor;
            const subtopicosCol = collection(db, 'subtopicos-forum');
            const q = query(subtopicosCol, where('turmaId', '==', idTurma));
            const subtopicosSnapshot = await getDocs(q);
            const subtopicosList = subtopicosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            let subtopicos = [];
            subtopicosList.forEach(subtopico => {
                let subtopicoInfo = {
                    nome: subtopico.nome,
                    id: subtopico.id,
                };
                subtopicos.push(subtopicoInfo);
            });
            //buscar nome do professor
            const docRefProf = doc(db, "InforConta", professor);
            const docSnapProf = await getDoc(docRefProf);
            const profData = docSnapProf.data();
            professor = getFirstTwoNames(profData.nome);
            const professorFoto = profData.fotoPerfil || "../Recursos/Imagens/perfil-teste.avif";

            let turmaInfo = {
                icone: iconeTurma,
                nome: nome,
                id: idTurma,
                professor: professor,
                professorFoto: professorFoto,
                subtopicos: subtopicos,
            };
            forum.push(turmaInfo);
        }
    }));
    datasesao.forum = forum;
    window.sessionData = datasesao;
    await fetch('../Scripts/set-session.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datasesao)
    });
}

export { carregamentoForum, carregamentoSubForum, carregamentoConteudoForum };