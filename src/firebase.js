// Primero, importamos las funciones necesarias desde Firebase.
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";  // Funciones de autenticación
import { getDatabase } from "firebase/database";  // Si también usas la base de datos

// Tu configuración de Firebase (con las credenciales que copiaste desde la consola de Firebase)
const firebaseConfig = {
    apiKey: "AIzaSyANbReflKk9QuLaWsPuAhP1j0mXa9FyUr8",
    authDomain: "pasajeros-f1d45.firebaseapp.com",
    databaseURL: "https://pasajeros-f1d45-default-rtdb.firebaseio.com",
    projectId: "pasajeros-f1d45",
    storageBucket: "pasajeros-f1d45.firebasestorage.app",
    messagingSenderId: "583180931315",
    appId: "1:583180931315:web:ad6ecfe999d2b52e29e786",
    measurementId: "G-J8GWBBS43P"
};

// Inicializamos Firebase con la configuración
const app = initializeApp(firebaseConfig);

// Creamos una instancia de Firebase Authentication
const auth = getAuth(app);  // Esto se usa para gestionar la autenticación

// Si usas la base de datos en tiempo real, también inicializas Firebase Realtime Database
const db = getDatabase(app);

export { db, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut }; // Exportamos las funciones para usarlas en otros archivos
