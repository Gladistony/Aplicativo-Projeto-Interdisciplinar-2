import { getAuth, sendPasswordResetEmail } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';

document.getElementById('formularioUnico').addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;

    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
    window.location.href = '../index.html';

});