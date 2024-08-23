import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { getFirestore, doc, setDoc, getDoc } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import { app, db } from './firebase-config.js';

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

                userInfo.ultimoLogin = dataFormatada;

                // Atualizar informações no Firestore
                await setDoc(docRef, userInfo);


                // Enviar informações ao servidor PHP
                await fetch('./Scripts/set-session.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: email, userInfo: userInfo, verificado: verificado })
                });

                window.location.href = './Paginas/main-logado.php';
            } else {
                console.log('Usuário não está logado');
            }
        });
    } catch (error) {
        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-login-credentials') {
            erromsg.style.display = 'block';
            erromsg.innerHTML = 'Email ou senha inválidos';
        }
        loginButton.style.display = 'block';
        cadastrourl.style.display = 'block';
        esqueceuurl.style.display = 'block';
    } finally {
        loadingSpinner.style.display = 'none';
    }
});
