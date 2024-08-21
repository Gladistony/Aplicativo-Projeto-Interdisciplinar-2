import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { getFirestore, doc, setDoc, getDoc } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import { app, db } from './firebase-config.js';

document.getElementById('registerForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const name = document.getElementById('nome').value;
    const course = document.getElementById('cursoDoUsuario').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('senha').value;
    const confirmPassword = document.getElementById('senhaValidada').value;
    const loginurl = document.getElementById('linkLogin').value;

    // Verificar se o email termina com @ufrpe.br
    if (!email.endsWith('@ufrpe.br')) {
        alert('Por favor, use um e-mail institucional @ufrpe.br.');
        return;
    }

    // Verificar se as senhas são iguais
    if (password !== confirmPassword) {
        alert('As senhas não são iguais.');
        return;
    }

    const auth = getAuth();
    const loadingSpinner = document.getElementById('loading');
    const registerButton = document.getElementById('registerButton');
    loadingSpinner.style.display = 'block';
    registerButton.style.display = 'none';
    loginurl.style.display = 'none';

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await sendEmailVerification(user);

        // Salvar informações adicionais no Firestore
        await setDoc(doc(db, "InforConta", user.uid), {
            nome: name,
            curso: course,
            email: email
        });

        // Realizar login automaticamente após o cadastro
        await signInWithEmailAndPassword(auth, email, password);

        // Buscar informações da conta no Firestore
        const docRef = doc(db, "InforConta", user.uid);
        const docSnap = await getDoc(docRef);

        let userInfo = {
            curso: "Indisponível",
            nome: "Indisponível",
            endereco: "Indisponível",
            dataCriacao: "Indisponível",
            dataNascimento: "Indisponível",
            periodoIngresso: "Indisponível"
        };

        if (docSnap.exists()) {
            userInfo = docSnap.data();
        }

        // Enviar informações ao servidor PHP
        await fetch('set-session.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, userInfo: userInfo, verificado: false })
        });

        window.location.href = 'main-logado.php';
    } catch (error) {
        alert('Erro: ' + error.message);
        registerButton.style.display = 'block';
        loginurl.style.display = 'block';
    } finally {
        loadingSpinner.style.display = 'none';
    }
});
