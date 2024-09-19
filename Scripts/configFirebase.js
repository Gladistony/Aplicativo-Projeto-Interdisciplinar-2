import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
  getDatabase,
  set,
  ref,
  push,
  onChildAdded,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBlWq7V4LQ5PJhYIp5ZI-tMnD81fnt7XTI",
  authDomain: "monitoria-projeto-2.firebaseapp.com",
  databaseURL: "https://monitoria-projeto-2-default-rtdb.firebaseio.com/",
  projectId: "monitoria-projeto-2",
  storageBucket: "monitoria-projeto-2.appspot.com",
  messagingSenderId: "681394637170",
  appId: "1:681394637170:web:747c7b6c7c32beef78b5eb",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

export {
  db,
  set,
  ref,
  push,
  onChildAdded,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  auth,
  signOut,
};