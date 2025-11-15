import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js';

import { db} from './firebase.js';

const auth = getAuth();

const loginUser = async (email, password) => {
    // Función para iniciar sesión
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('Usuario autenticado:', userCredential.user.email);
        return userCredential;
        
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        throw error;
    }
};

// Función para crear un nuevo usuario
const signup = async (email, password) => {
    try {
        const user = await createUserWithEmailAndPassword(auth, email, password);
        console.log('Usuario registrado:', user.user.email);
        return user;
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        throw error;
    }
};

// Función para cerrar sesión
const signOutUser = async () => {
    try {
        await signOut(auth);
        console.log('Usuario cerró sesión');
        return true;
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        throw error;
    }
};

export { loginUser, signup, signOutUser };