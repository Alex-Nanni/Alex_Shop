import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

// Configurações do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB1HPHgitsdKA-2lSy2inMMKpl1TVGIS0Y",
  authDomain: "alexshop-fb905.firebaseapp.com",
  databaseURL: "https://alexshop-fb905-default-rtdb.firebaseio.com",
  projectId: "alexshop-fb905",
  storageBucket: "alexshop-fb905.appspot.com",
  messagingSenderId: "935543168147",
  appId: "1:935543168147:web:1361273773d0ff5f3f8166"
};

// Inicializando o Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
