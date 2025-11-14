/* ======================== FIREBASE AUTH ======================== */
// Importar Firebase será realizado en el HTML con CDN
// Este archivo maneja toda la lógica de autenticación

// TODO: Inicializar Firebase con credenciales en tu HTML
// const firebaseConfig = { ... };
// const app = firebase.initializeApp(firebaseConfig);
// const auth = firebase.auth();

/* ======================== LOGIN ======================== */

/**
 * Maneja el login del usuario
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 */
function loginUser(email, password) {
    // PLACEHOLDER: Aquí va la lógica real de Firebase
    // firebase.auth().signInWithEmailAndPassword(email, password)
    //     .then(userCredential => {
    //         const user = userCredential.user;
    //         console.log('Usuario autenticado:', user.email);
    //         // Redirigir a admin.html
    //         window.location.href = './admin.html';
    //     })
    //     .catch(error => {
    //         console.error('Error de login:', error);
    //         showLoginError(error.message);
    //     });

    console.log('Función loginUser() lista para Firebase. Email:', email);
}

/* ======================== LOGOUT ======================== */

/**
 * Cierra la sesión del usuario
 */
function logoutUser() {
    // PLACEHOLDER: Aquí va la lógica real de Firebase
    // firebase.auth().signOut()
    //     .then(() => {
    //         console.log('Usuario desconectado');
    //         // Redirigir a login
    //         window.location.href = './login.html';
    //     })
    //     .catch(error => {
    //         console.error('Error al cerrar sesión:', error);
    //     });

    console.log('Función logoutUser() lista para Firebase');
}

/* ======================== VERIFICAR SESIÓN ======================== */

/**
 * Verifica si el usuario está autenticado
 * Si no, redirige a login
 */
function checkAuthStatus() {
    // PLACEHOLDER: Aquí va la lógica real de Firebase
    // firebase.auth().onAuthStateChanged(user => {
    //     if (!user) {
    //         // No autenticado, redirigir a login
    //         window.location.href = './login.html';
    //     } else {
    //         // Autenticado, permitir acceso
    //         console.log('Usuario autenticado:', user.email);
    //         initializeAdminPanel(user);
    //     }
    // });

    console.log('Función checkAuthStatus() lista para Firebase');
}

/* ======================== MOSTRAR ERRORES ======================== */

/**
 * Muestra errores de login en la UI
 * @param {string} errorMsg - Mensaje de error
 */
function showLoginError(errorMsg) {
    const errorElement = document.getElementById('loginError');
    if (errorElement) {
        errorElement.textContent = errorMsg;
        errorElement.style.display = 'block';
        // Ocultar error después de 5 segundos
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000);
    }
}

/* ======================== EVENT LISTENERS ======================== */

// Al cargar login.html
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if (email && password) {
                loginUser(email, password);
            } else {
                showLoginError('Por favor completa todos los campos');
            }
        });
    }
});
