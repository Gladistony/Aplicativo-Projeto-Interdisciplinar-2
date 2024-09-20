import {
  db,
  set,
  ref,
  push,
  onChildAdded,
  signInWithEmailAndPassword,
} from "./configFirebase.js";

let userId = window.localStorage.getItem("userId");
let name = window.localStorage.getItem("name");
let email = window.localStorage.getItem("email");

let receptorId = window.localStorage.getItem("receptorId");  // ID do receptor específico
let receptorName = window.localStorage.getItem("receptorName");  // Nome do receptor

const refUser = ref(db, "user/");

if (email === "atendimento@gmail.com") {
  loadListClients();
} else {
  loadMessage();
  setUser(name, email);
}

function sendMessage(event) {
  event.preventDefault();
  const inputField = document.getElementById("user-input");
  const refMessage = ref(db, "globalChat/messages"); // Nó para o chat global
  const newMessage = push(refMessage);
  const time = getCurrentTime();

  set(newMessage, {
    name: name,
    email: email,
    message: inputField.value,
    time: time,
  });

  inputField.value = "";
}

function setUser(name, email) {
  const userLogged = document.getElementById("user-header");
  userLogged.innerHTML = "";
  const userNameElement = document.createElement("h2");
  const userEmailElement = document.createElement("span");
  userNameElement.innerText = receptorName || name;  // Mostra o nome do receptor no cabeçalho ou o nome do usuário logado
  userEmailElement.innerText = email;
  userLogged.appendChild(userNameElement);
  userLogged.appendChild(userEmailElement);
}

async function login(email, password) {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    window.localStorage.setItem("userId", res.user.uid);
    window.localStorage.setItem("email", res.user.email);
    window.localStorage.setItem("name", res.user.displayName);
    userId = res.user.uid;
    email = res.user.email;
    name = res.user.displayName;

    if (res.user.email === "atendimento@gmail.com") {
      loadListClients();
    } else {
      loadMessage();  // Carrega as mensagens globais ao fazer login
      setUser(name, email);
    }
  } catch (error) {
    alert("Houve um erro. Tente novamente!");
  }
}

function loadListClients() {
  const clientListElement = document.getElementById("client-list");
  const containerList = document.getElementById("text-client");
  clientListElement.innerHTML = "";
  containerList.innerHTML = "";

  const headerClients = document.createElement("h3");
  headerClients.innerHTML = "Lista de Clientes";
  containerList.appendChild(headerClients);

  onChildAdded(refUser, (snapshot) => {
    const listItem = document.createElement("button");
    listItem.innerText = snapshot.val().name;
    listItem.addEventListener("click", () => {
      receptorId = snapshot.val().uid;
      receptorName = snapshot.val().name;
      window.localStorage.setItem("receptorId", receptorId);
      window.localStorage.setItem("receptorName", receptorName);
      
      setUser(snapshot.val().name, snapshot.val().email);
      loadMessage(); // Carrega as mensagens do chat global
    });
    clientListElement.appendChild(listItem);
  });
}

function loadMessage() {
  const messageDiv = document.getElementById("messages");
  messageDiv.innerText = "";
  const refMessageLoad = ref(db, "globalChat/messages"); // Carregar mensagens globais

  onChildAdded(refMessageLoad, (snapshot) => {
    const message = snapshot.val();
    const messageDiv = document.createElement("div");

    const messageText = document.createElement("p");
    const messageTime = document.createElement("span");

    if (message.email === email) {
      messageDiv.classList.add("self"); // Mensagens do usuário
    } else {
      messageDiv.classList.add("other"); // Mensagens de outros usuários
    }

    messageText.innerText = `${message.message}`;
    messageTime.innerText = `${message.time}`;
    messageText.appendChild(messageTime);
    messageDiv.appendChild(messageText);

    const messagesContainer = document.getElementById("messages");
    const messageContainer2 = document.getElementById("messagesContainer");
    messagesContainer.appendChild(messageDiv);
    messageContainer2.scrollTop = messagesContainer.scrollHeight;
  });
}

function getCurrentTime() {
  return new Date().getTime();
}

window.sendMessage = sendMessage;
