import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBlWq7V4LQ5PJhYIp5ZI-tMnD81fnt7XTI",
    authDomain: "monitoria-projeto-2.firebaseapp.com",
    databaseURL: "https://monitoria-projeto-2-default-rtdb.firebaseio.com/",
    projectId: "monitoria-projeto-2",
    storageBucket: "monitoria-projeto-2.appspot.com",
    messagingSenderId: "681394637170",
    appId: "1:681394637170:web:747c7b6c7c32beef78b5eb",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const realdb = getDatabase(app);