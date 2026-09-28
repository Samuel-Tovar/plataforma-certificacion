import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

// IMPORTANTE:
// Reemplaza estos datos por TU configuración real de Firebase.
// Si ya tienes firebaseConfig en otro archivo, reutiliza esos valores.
const firebaseConfig = {
  apiKey: "AIzaSyDyR_TfE_uuUzKVQoyCQwCYJ4kTtzHU6X8",
  authDomain: "aseutp-plataforma.firebaseapp.com",
  projectId: "aseutp-plataforma",
  storageBucket: "aseutp-plataforma.firebasestorage.app",
  messagingSenderId: "557035426845",
  appId: "1:557035426845:web:66b4f1237bc3f623f262f4",
  measurementId: "G-T81NGCB556"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };