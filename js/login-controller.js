import { loginUser, signup } from './service/auth.js';

// Elementos del DOM
const loginTab = document.getElementById('loginTab');
const signupTab = document.getElementById('signupTab');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const mainTitle = document.getElementById('mainTitle');
const messageBox = document.getElementById('messageBox');
const successBox = document.getElementById('successBox');

// Elementos de Login
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const loginBtn = document.getElementById('loginBtn');
const loginBtnText = document.getElementById('loginBtnText');
const loginLoading = document.getElementById('loginLoading');

// Elementos de Signup
const signupEmail = document.getElementById('signupEmail');
const signupPassword = document.getElementById('signupPassword');
const confirmPassword = document.getElementById('confirmPassword');
const signupBtn = document.getElementById('signupBtn');
const signupBtnText = document.getElementById('signupBtnText');
const signupLoading = document.getElementById('signupLoading');

// Función para limpiar mensajes
const clearMessages = () => {
    messageBox.textContent = '';
    messageBox.classList.remove('show');
    successBox.textContent = '';
    successBox.classList.remove('show');
};

// Función para mostrar error
const showError = (message) => {
    clearMessages();
    messageBox.textContent = message;
    messageBox.classList.add('show');
};

// Función para mostrar éxito
const showSuccess = (message) => {
    clearMessages();
    successBox.textContent = message;
    successBox.classList.add('show');
};

// Cambiar entre tabs de Login y Signup
loginTab.addEventListener('click', () => {
    loginTab.classList.add('active');
    signupTab.classList.remove('active');
    loginForm.classList.add('active');
    signupForm.classList.remove('active');
    mainTitle.textContent = 'Iniciar sesión';
    clearMessages();
});

signupTab.addEventListener('click', () => {
    signupTab.classList.add('active');
    loginTab.classList.remove('active');
    signupForm.classList.add('active');
    loginForm.classList.remove('active');
    mainTitle.textContent = 'Registrarse';
    clearMessages();
});

// Manejar el envío del formulario de Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearMessages();

    const email = loginEmail.value.trim();
    const password = loginPassword.value.trim();

    // Validaciones básicas
    if (!email || !password) {
        showError('Por favor completa todos los campos');
        return;
    }

    if (!email.includes('@')) {
        showError('Por favor ingresa un email válido');
        return;
    }

    if (password.length < 6) {
        showError('La contraseña debe tener al menos 6 caracteres');
        return;
    }

    try {
        // Mostrar estado de carga
        loginBtnText.style.display = 'none';
        loginLoading.classList.add('show');
        loginBtn.disabled = true;

        await loginUser(email, password);

        showSuccess('¡Inicio de sesión exitoso! Redirigiendo...');
        
        // Limpiar formulario
        loginForm.reset();
        
        // Redirigir después de 2 segundos
        setTimeout(() => {
            window.location.href = './admin.html';
        }, 2000);

    } catch (error) {
        console.error('Error de login:', error);
        
        // Mensajes de error específicos de Firebase
        if (error.code === 'auth/user-not-found') {
            showError('El usuario no existe. Por favor, regístrate primero.');
        } else if (error.code === 'auth/wrong-password') {
            showError('Contraseña incorrecta.');
        } else if (error.code === 'auth/invalid-email') {
            showError('El email no es válido.');
        } else if (error.code === 'auth/user-disabled') {
            showError('La cuenta ha sido deshabilitada.');
        } else if (error.code === 'auth/too-many-requests') {
            showError('Demasiados intentos fallidos. Intenta más tarde.');
        } else {
            showError('Error al iniciar sesión: ' + (error.message || 'Intenta de nuevo'));
        }
    } finally {
        // Restaurar estado del botón
        loginBtnText.style.display = 'inline';
        loginLoading.classList.remove('show');
        loginBtn.disabled = false;
    }
});

// Manejar el envío del formulario de Signup
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearMessages();

    const email = signupEmail.value.trim();
    const password = signupPassword.value.trim();
    const confirmPass = confirmPassword.value.trim();

    // Validaciones básicas
    if (!email || !password || !confirmPass) {
        showError('Por favor completa todos los campos');
        return;
    }

    if (!email.includes('@')) {
        showError('Por favor ingresa un email válido');
        return;
    }

    if (password.length < 6) {
        showError('La contraseña debe tener al menos 6 caracteres');
        return;
    }

    if (password !== confirmPass) {
        showError('Las contraseñas no coinciden');
        return;
    }

    try {
        // Mostrar estado de carga
        signupBtnText.style.display = 'none';
        signupLoading.classList.add('show');
        signupBtn.disabled = true;

        await signup(email, password);

        showSuccess('¡Registro exitoso! Por favor inicia sesión.');
        
        // Limpiar formulario
        signupForm.reset();

        // Cambiar a tab de login después de 2 segundos
        setTimeout(() => {
            loginTab.click();
        }, 2000);

    } catch (error) {
        console.error('Error de signup:', error);
        
        // Mensajes de error específicos de Firebase
        if (error.code === 'auth/email-already-in-use') {
            showError('Este email ya está registrado. Por favor, inicia sesión o usa otro email.');
        } else if (error.code === 'auth/weak-password') {
            showError('La contraseña es muy débil. Usa al menos 6 caracteres.');
        } else if (error.code === 'auth/invalid-email') {
            showError('El email no es válido.');
        } else if (error.code === 'auth/operation-not-allowed') {
            showError('El registro de usuarios está deshabilitado.');
        } else if (error.code === 'auth/too-many-requests') {
            showError('Demasiados intentos. Intenta más tarde.');
        } else {
            showError('Error al registrarse: ' + (error.message || 'Intenta de nuevo'));
        }
    } finally {
        // Restaurar estado del botón
        signupBtnText.style.display = 'inline';
        signupLoading.classList.remove('show');
        signupBtn.disabled = false;
    }
});
