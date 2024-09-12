import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { collection, query, where, doc, setDoc, getDoc, getDocs } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import { db } from './firebase-config.js';
import { getFirstTwoNames } from './utilidades.js';

document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('senha').value;

    const auth = getAuth();
    const loadingSpinner = document.getElementById('loading');
    const loginButton = document.getElementById('loginButton');
    const cadastrourl = document.getElementById('linkcadastro');
    const erromsg = document.getElementById('mensagem-erroLogin');
    const esqueceuurl = document.getElementById('esqueciMinhaSenha');

    loadingSpinner.style.display = 'block';
    loginButton.style.display = 'none';
    cadastrourl.style.display = 'none';
    erromsg.style.display = 'none';
    esqueceuurl.style.display = 'none';

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const verificado = user.emailVerified;

                // Buscar informações da conta no Firestore
                const docRef = doc(db, "InforConta", user.uid);
                const docSnap = await getDoc(docRef);
                const IDUsuario = user.uid;

                let userInfo = {
                    curso: "Indisponível",
                    nome: "Indisponível",
                    endereco: "Indisponível",
                    dataCriacao: "Indisponível",
                    dataNascimento: "Indisponível",
                    periodoIngresso: "Indisponível",
                    fotoPerfil: "Indisponível",
                    tipoConta: "Aluno",
                    ultimoLogin: "Indisponível",
                    listaAmigos: [],
                };

                if (docSnap.exists()) {
                    userInfo = docSnap.data();
                }
                //Gravar hora do ultimo login
                const dataAtual = new Date();
                const dataFormatada = dataAtual.toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                });
                userInfo.dataacesso = dataAtual.getTime();
                userInfo.ultimoLogin = dataFormatada;

                //Baixar as informações gerais de configuracao
                const docRefConfig = doc(db, "DefinicoesGerais", "data");
                const docSnapConfig = await getDoc(docRefConfig);
                let infoConfig = docSnapConfig.data();

                const periodoAtual = infoConfig.Periodo;

                //Baixar informações basicas do forum
                let forum = [];

                const turmasCol = collection(db, 'turmas-forum');
                const turmasSnapshot = await getDocs(turmasCol);
                const turmasList = turmasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
                        const professorFoto = profData.fotoPerfil;

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
                var pontuacao = 0;
                //começar a busca pelos comentarios do usuario
                const comentariosCol = collection(db, 'comentarios-forum');
                const q = query(comentariosCol, where('autor', '==', IDUsuario));
                const comentariosSnapshot = await getDocs(q);
                const comentariosList = comentariosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                let listaultimoscomentarios = {};
                const promessas = comentariosList.map(async comentario => {
                    const totalcurtidas = comentario.curtida.length;
                    pontuacao += totalcurtidas * 5 + 1;
                    //buscar topico do comentario
                    const topicoID = comentario.topicoID;
                    const topicoRef = doc(db, 'topicos-alunos', topicoID);
                    const topicoSnap = await getDoc(topicoRef);
                    const topicoData = topicoSnap.data();
                    if (listaultimoscomentarios[comentario.topicoID] == undefined) {
                        listaultimoscomentarios[comentario.topicoID] = [topicoData, comentario.data];
                    }
                });
                await Promise.all(promessas);
                //Pegar apenas os ultimos 3 topicos que vc comentou
                let ultimosComentarios = [];
                for (let key in listaultimoscomentarios) {
                    ultimosComentarios.push({ topicoID: key, dado: listaultimoscomentarios[key][0], data: listaultimoscomentarios[key][1] });
                }
                ultimosComentarios.sort((a, b) => {
                    return b.data - a.data;
                });
                ultimosComentarios = ultimosComentarios.slice(0, 3);

                let datacustom = {
                    pontuacao: pontuacao,
                    ultimosComentarios: ultimosComentarios,
                };

                userInfo.pontuacao = pontuacao;
                // Atualizar informações no Firestore
                await setDoc(docRef, userInfo);
                // Enviar informações ao servidor PHP
                await fetch('./Scripts/set-session.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: email, userInfo: userInfo, verificado: verificado, id: IDUsuario, infoConfig: infoConfig, forum: forum, datacustom: datacustom })
                });
                localStorage.removeItem('usuariosMonitores');
                localStorage.removeItem('tempoSalvo');
                //alert('teste');
                window.location.href = './Paginas/main-logado.php';
            } else {
                console.log('Usuário não está logado');
            }
        });
    } catch (error) {
        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-login-credentials') {
            erromsg.style.display = 'block';
            erromsg.innerHTML = 'Email ou senha inválidos';
            loadingSpinner.style.display = 'none';
        }
        loginButton.style.display = 'block';
        cadastrourl.style.display = 'block';
        esqueceuurl.style.display = 'block';
        loadingSpinner.style.display = 'none';
    } finally {
        //loadingSpinner.style.display = 'none';
    }
});
