import { realdb } from '../firebase-config.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
import {
    set,
    ref,
    push,
    onChildAdded, query, limitToLast
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

function carregamentoBoasvindas() {

    function atualizarRelogio() {
        var agora = new Date();
        var data = agora.toLocaleDateString('pt-BR');
        var hora = agora.toLocaleTimeString('pt-BR');
        document.getElementById('relogio').innerHTML = data + ' ' + hora;
    }

    setInterval(atualizarRelogio, 1000);

    // Elementos do DOM
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const messagesDiv = document.getElementById('messages');
    //Acionar click com enter
    // Evento para enviar mensagem ao pressionar Enter
    messageInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            document.getElementById('send-button').click();
        }
    });



    //Configurar evento de enviar mensagem
    sendButton.addEventListener('click', async () => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
            const userId = window.sessionData.id;
            const name = window.sessionData.userInfo.nome;
            const message = messageInput.value;
            const time = Date.now();
            const userRef = ref(realdb, 'globalChat/messages');
            const newMessage = push(userRef);
            await set(newMessage, {
                message: message,
                usuario: name,
                idusuario: userId,
                time: time,
                cargo: window.sessionData.userInfo.tipoConta,
                foto: window.sessionData.userInfo.fotoPerfil
            });
            messageInput.value = '';
        }
    });

    //Configurar evento de receber mensagem
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            messagesDiv.innerHTML = '';
            const userId = user.uid;
            const userRef = query(ref(realdb, 'globalChat/messages'), limitToLast(10));
            onChildAdded(userRef, (snapshot) => {
                const data = snapshot.val();

                const message = data.message || '';
                const usuario = data.usuario || 'Não identificado';
                const idusuario = data.idusuario || userId;
                const cargo = data.cargo || 'Aluno';
                const foto = data.foto || "../Recursos/Imagens/perfil-teste.avif";
                const date = new Date(data.time);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0'); // Os meses são indexados a partir de 0
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                const formattedTime = `${day}/${month} - ${hours}:${minutes}`;

                // Criação do elemento da mensagem
                const messageElement = document.createElement('div');
                messageElement.classList.add('message');

                // Criação do elemento da foto com link
                const photoElement = document.createElement('img');
                photoElement.src = foto;
                photoElement.alt = `${usuario} foto`;
                photoElement.classList.add('user-photo');
                photoElement.style.cursor = 'pointer';
                photoElement.addEventListener('click', () => {
                    window.location.href = `./main-logado.php?pagina=perfilpublico&id=${idusuario}`;
                });

                // Criação do elemento do texto da mensagem
                const textElement = document.createElement('div');
                textElement.classList.add('message-text');

                // Criação do elemento do nome com link
                const nameElement = document.createElement('span');
                nameElement.innerText = `${usuario} `;
                nameElement.style.cursor = 'pointer';
                nameElement.addEventListener('click', () => {
                    window.location.href = `./main-logado.php?pagina=perfilpublico&id=${idusuario}`;
                });


                // Criação do elemento do cargo com cor ajustada
                const cargoElement = document.createElement('span');
                cargoElement.innerText = `(${cargo})`;
                if (cargo === 'Admin') cargoElement.style.color = '#7fff00';
                else if (cargo === 'Monitor') cargoElement.style.color = '#f0394f';
                else if (cargo === 'Professor') cargoElement.style.color = '#5e109b';
                else cargoElement.style.color = '#496b7a';

                // Adiciona a data, o nome do usuário e o cargo ao texto da mensagem
                textElement.innerText = `${formattedTime} - `;
                textElement.appendChild(nameElement);
                textElement.appendChild(cargoElement);
                textElement.innerHTML += `: ${message}`;

                // Adiciona a foto e o texto ao elemento da mensagem
                messageElement.appendChild(photoElement);
                messageElement.appendChild(textElement);

                // Adiciona a mensagem ao container de mensagens
                messagesDiv.appendChild(messageElement);

                messagesDiv.scrollTop = messagesDiv.scrollHeight;
            });
        }
    });

}

export { carregamentoBoasvindas };