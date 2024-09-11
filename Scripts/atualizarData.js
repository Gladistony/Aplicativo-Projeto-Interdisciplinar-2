import { loadMenuDireito } from "./scriptBlocos/menuDireito.js";
import { doc, setDoc, getDoc } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import { db } from './firebase-config.js';

async function atualizarConecaoFirebase() {
    //alert("Conexão com o Firebase atualizada");
    //Enviar para o servidor a informação que o usuario está atualmente logado
    try {
        const response = await fetch('../Scripts/get-session.php');
        if (response.ok) {
            window.sessionData = await response.json();
        } else {
            console.error('Erro ao carregar os dados da sessão:', response.statusText);
        }
    } catch (error) {
        console.error('Erro ao carregar os dados da sessão:', error);
    }
    setInterval(loopatualizacao, 60000);
}

async function loopatualizacao() {
    loadMenuDireito();
    //Baixar dados da conta e atualizar o ultimoLogin
    //pegar meu id de conta
    const idConta = window.sessionData.id;
    const docRef = doc(db, "InforConta", idConta);
    const docSnap = await getDoc(docRef);
    const dataAtual = new Date();
    const dataFormatada = dataAtual.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
    let userInfo = docSnap.data();
    userInfo.dataacesso = dataAtual.getTime();
    userInfo.ultimoLogin = dataFormatada;
    await setDoc(docRef, userInfo);
    //console.log('Último login atualizado');
}

export { atualizarConecaoFirebase };