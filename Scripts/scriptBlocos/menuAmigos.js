import { getAuth } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import { getFirestore, doc, updateDoc, arrayUnion, collection, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { db } from '../firebase-config.js';


const auth = getAuth();

async function buscarAmigosPorEmail(email) {
    const q = query(collection(db, "InforConta"), where("email", "==", email));
    const querySnapshot = await getDocs(q);

    document.getElementById("lista-amigos").innerHTML = "";
    querySnapshot.forEach((doc) => {
        const userData = doc.data();
        renderizarAmigo(userData, doc.id);
    });
}

function renderizarAmigo(userData, userId) {
    const amigosSection = document.getElementById("lista-amigos");

    const amigoHTML = `
        <section class="amigo">
            <img src="${userData.fotoPerfil || '../Recursos/Imagens/perfil-teste.avif'}" alt="Foto de perfil" class="img-perfil">
            <section class="informacao">
                <p id="nome">${userData.nome}</p>
            </section>
            <a href="#"><button type="button" class="adicionar" data-uid="${userId}">Adicionar</button></a>
        </section>
    `;

    amigosSection.innerHTML += amigoHTML;

    document.querySelectorAll('.adicionar').forEach(button => {
        button.addEventListener('click', async (e) => {
            const amigoId = e.target.getAttribute('data-uid');
            const userId = auth.currentUser.uid;
            if (amigoId) {
                await adicionarAmigo(userId, amigoId);
            } else {
                alert("Erro ao adicionar amigo.");
            }
        });
    });
}

async function adicionarAmigo(userId, amigoId) {
    const userDoc = doc(db, "InforConta", userId);
    await updateDoc(userDoc, {
        listaAmigos: arrayUnion(amigoId)
    });
}


//End loading

document.getElementById('botao-pesquisa').addEventListener('click', function () {
    const email = document.getElementById('barra-pesquisa').value;
    if (email) {
        buscarAmigosPorEmail(email);
    } else {
        alert("Por favor, insira um email.");
    }
});
