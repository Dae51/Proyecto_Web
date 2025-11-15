import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js';

import { db} from './firebase.js';

const auth = getAuth();

const loginUser = async (email, password) => {
    // Función para iniciar sesión
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('Usuario autenticado:', userCredential.data.email);
        
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        throw error;
    }
};

// Función para crear un nuevo usuario
const signup = async (email, password) => {
    try {
        const user = await createUserWithEmailAndPassword(auth, email, password);
        console.log('Usuario registrado:', user);
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        throw error;
    }
};

export { loginUser, signup };