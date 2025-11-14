/* ======================== FIREBASE ADMIN CRUD ======================== */
// Este archivo maneja todas las operaciones de CRUD en el admin panel
// Conectado a Firebase Realtime Database o Firestore

// TODO: Inicializar Firebase en el HTML

// CRUD INTEGRANTES
// ==================

/**
 * Agregar un nuevo integrante
 * @param {string} nombre - Nombre del integrante
 * @param {string} rol - Rol (vocalista, guitarra, etc.)
 * @param {string} fotoUrl - URL de la foto (opcional)
 */
function addIntegrante(nombre, rol, fotoUrl = '') {
    // PLACEHOLDER: Lógica real con Firebase
    // db.collection('integrantes').add({
    //     nombre: nombre,
    //     rol: rol,
    //     foto: fotoUrl,
    //     createdAt: new Date()
    // })
    // .then(docRef => {
    //     console.log('Integrante agregado con ID:', docRef.id);
    //     loadIntegrantes(); // Recargar tabla
    //     resetForm('formIntegrante');
    // })
    // .catch(error => console.error('Error:', error));

    console.log('addIntegrante() listo para Firebase:', { nombre, rol, fotoUrl });
}

/**
 * Obtener todos los integrantes
 */
function loadIntegrantes() {
    // PLACEHOLDER: Lógica real con Firebase
    // db.collection('integrantes')
    //     .orderBy('createdAt', 'desc')
    //     .onSnapshot(snapshot => {
    //         const tablaIntegrantes = document.getElementById('tablaIntegrantes');
    //         tablaIntegrantes.innerHTML = '';
    //         
    //         snapshot.forEach(doc => {
    //             const integrante = doc.data();
    //             const row = `
    //                 <tr>
    //                     <td>${integrante.nombre}</td>
    //                     <td>${integrante.rol}</td>
    //                     <td>
    //                         <button onclick="editIntegrante('${doc.id}')" class="btn-action">Editar</button>
    //                         <button onclick="deleteIntegrante('${doc.id}')" class="btn-action delete">Eliminar</button>
    //                     </td>
    //                 </tr>
    //             `;
    //             tablaIntegrantes.innerHTML += row;
    //         });
    //     });

    console.log('loadIntegrantes() listo para Firebase');
}

/**
 * Editar un integrante
 * @param {string} integranteId - ID del integrante
 */
function editIntegrante(integranteId) {
    // PLACEHOLDER: Lógica real con Firebase
    // db.collection('integrantes').doc(integranteId).update({...})
    
    console.log('editIntegrante() listo para Firebase:', integranteId);
}

/**
 * Eliminar un integrante
 * @param {string} integranteId - ID del integrante
 */
function deleteIntegrante(integranteId) {
    if (confirm('¿Estás seguro de que quieres eliminar este integrante?')) {
        // PLACEHOLDER: Lógica real con Firebase
        // db.collection('integrantes').doc(integranteId).delete()
        //     .then(() => {
        //         console.log('Integrante eliminado');
        //         loadIntegrantes(); // Recargar tabla
        //     })
        //     .catch(error => console.error('Error:', error));

        console.log('deleteIntegrante() listo para Firebase:', integranteId);
    }
}

// CRUD PRESENTACIONES
// ====================

/**
 * Agregar una nueva presentación
 * @param {string} fecha - Fecha de la presentación (YYYY-MM-DD)
 * @param {string} lugar - Lugar del evento
 * @param {string} ciudad - Ciudad
 */
function addPresentacion(fecha, lugar, ciudad) {
    // PLACEHOLDER: Lógica real con Firebase
    // db.collection('presentaciones').add({
    //     fecha: firebase.firestore.Timestamp.fromDate(new Date(fecha)),
    //     lugar: lugar,
    //     ciudad: ciudad,
    //     createdAt: new Date()
    // })
    // .then(docRef => {
    //     console.log('Presentación agregada con ID:', docRef.id);
    //     loadPresentaciones();
    //     resetForm('formPresentacion');
    // })
    // .catch(error => console.error('Error:', error));

    console.log('addPresentacion() listo para Firebase:', { fecha, lugar, ciudad });
}

/**
 * Obtener todas las presentaciones
 */
function loadPresentaciones() {
    // PLACEHOLDER: Lógica real con Firebase
    // db.collection('presentaciones')
    //     .orderBy('fecha', 'asc')
    //     .onSnapshot(snapshot => {
    //         const tablaPresentaciones = document.getElementById('tablaPresentaciones');
    //         tablaPresentaciones.innerHTML = '';
    //         
    //         snapshot.forEach(doc => {
    //             const presentacion = doc.data();
    //             const fecha = presentacion.fecha.toDate().toLocaleDateString();
    //             const row = `
    //                 <tr>
    //                     <td>${fecha}</td>
    //                     <td>${presentacion.lugar}</td>
    //                     <td>${presentacion.ciudad}</td>
    //                     <td>
    //                         <button onclick="editPresentacion('${doc.id}')" class="btn-action">Editar</button>
    //                         <button onclick="deletePresentacion('${doc.id}')" class="btn-action delete">Eliminar</button>
    //                     </td>
    //                 </tr>
    //             `;
    //             tablaPresentaciones.innerHTML += row;
    //         });
    //     });

    console.log('loadPresentaciones() listo para Firebase');
}

/**
 * Editar una presentación
 * @param {string} presentacionId - ID de la presentación
 */
function editPresentacion(presentacionId) {
    // PLACEHOLDER: Lógica real con Firebase
    console.log('editPresentacion() listo para Firebase:', presentacionId);
}

/**
 * Eliminar una presentación
 * @param {string} presentacionId - ID de la presentación
 */
function deletePresentacion(presentacionId) {
    if (confirm('¿Estás seguro de que quieres eliminar esta presentación?')) {
        // PLACEHOLDER: Lógica real con Firebase
        // db.collection('presentaciones').doc(presentacionId).delete()

        console.log('deletePresentacion() listo para Firebase:', presentacionId);
    }
}

// CRUD DISCOGRAFÍA
// =================

/**
 * Agregar un nuevo disco
 * @param {string} titulo - Título del disco
 * @param {string} anio - Año de lanzamiento
 * @param {string} imagen - URL de la portada
 */
function addDisco(titulo, anio, imagen = '') {
    // PLACEHOLDER: Lógica real con Firebase
    // db.collection('discografia').add({
    //     titulo: titulo,
    //     anio: parseInt(anio),
    //     imagen: imagen,
    //     createdAt: new Date()
    // })
    // .then(docRef => {
    //     console.log('Disco agregado con ID:', docRef.id);
    //     loadDiscos();
    //     resetForm('formDisco');
    // })
    // .catch(error => console.error('Error:', error));

    console.log('addDisco() listo para Firebase:', { titulo, anio, imagen });
}

/**
 * Obtener todos los discos
 */
function loadDiscos() {
    // PLACEHOLDER: Lógica real con Firebase
    // db.collection('discografia')
    //     .orderBy('anio', 'desc')
    //     .onSnapshot(snapshot => {
    //         const tablaDiscos = document.getElementById('tablaDiscos');
    //         tablaDiscos.innerHTML = '';
    //         
    //         snapshot.forEach(doc => {
    //             const disco = doc.data();
    //             const row = `
    //                 <tr>
    //                     <td>${disco.titulo}</td>
    //                     <td>${disco.anio}</td>
    //                     <td>
    //                         <button onclick="editDisco('${doc.id}')" class="btn-action">Editar</button>
    //                         <button onclick="deleteDisco('${doc.id}')" class="btn-action delete">Eliminar</button>
    //                     </td>
    //                 </tr>
    //             `;
    //             tablaDiscos.innerHTML += row;
    //         });
    //     });

    console.log('loadDiscos() listo para Firebase');
}

/**
 * Editar un disco
 * @param {string} discoId - ID del disco
 */
function editDisco(discoId) {
    // PLACEHOLDER: Lógica real con Firebase
    console.log('editDisco() listo para Firebase:', discoId);
}

/**
 * Eliminar un disco
 * @param {string} discoId - ID del disco
 */
function deleteDisco(discoId) {
    if (confirm('¿Estás seguro de que quieres eliminar este disco?')) {
        // PLACEHOLDER: Lógica real con Firebase
        // db.collection('discografia').doc(discoId).delete()

        console.log('deleteDisco() listo para Firebase:', discoId);
    }
}

// UTILIDADES
// ===========

/**
 * Resetear un formulario
 * @param {string} formId - ID del formulario
 */
function resetForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
    }
}

/**
 * Mostrar notificación
 * @param {string} mensaje - Mensaje a mostrar
 * @param {string} tipo - Tipo: 'success', 'error', 'info'
 */
function showNotification(mensaje, tipo = 'info') {
    // PLACEHOLDER: Implementar notificaciones visuales
    console.log(`[${tipo.toUpperCase()}] ${mensaje}`);
}

// INICIALIZACIÓN
// ===============

/**
 * Inicializar el panel de admin
 * Se ejecuta cuando el usuario está autenticado
 */
function initializeAdminPanel(user) {
    console.log('Inicializando panel de admin para usuario:', user.email);
    
    // Actualizar nombre de usuario en sidebar
    const userEmailDisplay = document.querySelector('.admin-sidebar p');
    if (userEmailDisplay) {
        userEmailDisplay.textContent = `Usuario: ${user.email}`;
    }
    
    // Cargar datos iniciales
    loadIntegrantes();
    loadPresentaciones();
    loadDiscos();
    
    // Event listeners para formularios
    setupFormListeners();
}

/**
 * Configurar event listeners para los formularios
 */
function setupFormListeners() {
    // Formulario Integrante
    const formIntegrante = document.getElementById('formIntegrante');
    if (formIntegrante) {
        formIntegrante.addEventListener('submit', (e) => {
            e.preventDefault();
            const nombre = document.getElementById('nombreIntegrante').value;
            const rol = document.getElementById('rolIntegrante').value;
            const foto = document.getElementById('fotoIntegrante').value;
            
            if (nombre && rol) {
                addIntegrante(nombre, rol, foto);
            }
        });
    }
    
    // Formulario Presentación
    const formPresentacion = document.getElementById('formPresentacion');
    if (formPresentacion) {
        formPresentacion.addEventListener('submit', (e) => {
            e.preventDefault();
            const fecha = document.getElementById('fechaPresentacion').value;
            const lugar = document.getElementById('lugarPresentacion').value;
            const ciudad = document.getElementById('ciudadPresentacion').value;
            
            if (fecha && lugar && ciudad) {
                addPresentacion(fecha, lugar, ciudad);
            }
        });
    }
    
    // Formulario Disco
    const formDisco = document.getElementById('formDisco');
    if (formDisco) {
        formDisco.addEventListener('submit', (e) => {
            e.preventDefault();
            const titulo = document.getElementById('tituloDisco').value;
            const anio = document.getElementById('anioDisco').value;
            const imagen = document.getElementById('imagenDisco').value;
            
            if (titulo && anio) {
                addDisco(titulo, anio, imagen);
            }
        });
    }
    
    // Botón Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logoutUser);
    }
}

// Al cargar admin.html
document.addEventListener('DOMContentLoaded', () => {
    // PLACEHOLDER: Verificar autenticación y inicializar
    // checkAuthStatus() debería ser llamado desde auth.js
    // Si el usuario no está autenticado, será redirigido a login.html
    
    console.log('admin.js cargado. Esperando Firebase Auth...');
});
