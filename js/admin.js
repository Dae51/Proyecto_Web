/* ======================== FIREBASE ADMIN CRUD ======================== */
// Este archivo maneja todas las operaciones de CRUD en el admin panel
// Importar funciones de integrantes.js
import { crearMiembro, obtenerTodosMiembros, escucharMiembrosEnTiempoReal, obtenerMiembroPorId, actualizarMiembro, eliminarMiembro } from './integrantes.js';
// Importar funciones de discografia.js
import { crearDisco, obtenerTodosDiscos, escucharDiscosEnTiempoReal, obtenerDiscoPorId, actualizarDisco, eliminarDisco } from './discografia.js';
// Importar validaciones
import { Validation } from './service/validator.js';

// Importar funciones de noticias.js
import { crearNoticia, obtenerTodasNoticias, escucharNoticiasEnTiempoReal, obtenerNoticiaPorId, actualizarNoticia, eliminarNoticia } from './service/noticias.js';

import { loginUser, signup  } from './service/auth.js';

// CRUD INTEGRANTES - Conectado a Firestore collection "miembros"
// ================================================================

/**
 * Agregar un nuevo integrante (Firestore)
 * @param {string} nombre - Nombre del integrante
 * @param {string} rol - Rol (vocalista, guitarra, etc.)
 * @param {string} fotoUrl - URL de la foto (opcional)
 */
// Leer valores del formulario de integrante
function leerFormularioIntegrante() {
    return {
        nombre: (document.getElementById('nombreIntegrante') || {}).value || '',
        rol: (document.getElementById('rolIntegrante') || {}).value || '',
        foto: (document.getElementById('fotoIntegrante') || {}).value || ''
    };
}

// Añadir o actualizar integrante según el estado del formulario
async function addIntegrante() {
    const form = document.getElementById('formIntegrante');
    if (!form) return;

    const { nombre, rol, foto } = leerFormularioIntegrante();

    if (!nombre.trim() || !rol.trim()) {
        showNotification('Por favor completa nombre y rol', 'error');
        return;
    }

    const editingId = form.dataset.editingId;

    try {
        if (editingId) {
            await actualizarMiembro(editingId, { nombre: nombre.trim(), rol: rol.trim(), foto: foto.trim() });
            showNotification('Integrante actualizado exitosamente', 'success');
        } else {
            await crearMiembro({ nombre: nombre.trim(), rol: rol.trim(), foto: foto.trim() });
            showNotification('Integrante agregado exitosamente', 'success');
        }

        resetForm('formIntegrante');
    } catch (error) {
        console.error('❌ Error al guardar integrante:', error);
        showNotification(`Error: ${error.message}`, 'error');
    }
}

// Exponer las funciones que se llaman desde el HTML inline
// Exponer funciones para compatibilidad con llamadas inline en el HTML
window.addIntegrante = addIntegrante;
window.editarIntegrante = editarIntegrante;
window.deleteIntegrante = deleteIntegrante;

/**
 * Obtener todos los integrantes en tiempo real (Firestore)
 */
function renderIntegrantes(miembros) {
    const tabla = document.getElementById('tablaIntegrantes');
    if (!tabla) return;

    if (!miembros || miembros.length === 0) {
        tabla.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#999;">No hay integrantes aún</td></tr>';
        return;
    }

    // Construir filas de forma simple
    tabla.innerHTML = miembros.map(m => {
        return `
            <tr>
                <td>${m.nombre}</td>
                <td>${m.rol}</td>
                <td><img src="${m.foto}" alt="${m.nombre}" style="width:50px;height:50px;object-fit:cover;border-radius:4px;"></td>
                <td>
                    <button data-id="${m.id}" class="btn-action btn-edit">✏️ Editar</button>
                    <button data-id="${m.id}" class="btn-action delete btn-delete">🗑️ Eliminar</button>
                </td>
            </tr>`;
    }).join('');

    // Añadir listeners a los botones (delegación ligera)
    tabla.querySelectorAll('.btn-edit').forEach(b => b.addEventListener('click', (e) => editarIntegrante(e.currentTarget.dataset.id)));
    tabla.querySelectorAll('.btn-delete').forEach(b => b.addEventListener('click', (e) => deleteIntegrante(e.currentTarget.dataset.id)));
}

async function loadIntegrantes() {
    try {
        escucharMiembrosEnTiempoReal(renderIntegrantes);
    } catch (error) {
        console.error('❌ Error cargando integrantes:', error);
    }
}

/**
 * Editar un integrante - Modal/Formulario
 * @param {string} integranteId - ID del integrante
 */
async function editarIntegrante(integranteId) {
    try {
        const integrante = await obtenerMiembroPorId(integranteId);
        document.getElementById('nombreIntegrante').value = integrante.nombre || '';
        document.getElementById('rolIntegrante').value = integrante.rol || '';
        document.getElementById('fotoIntegrante').value = integrante.foto || '';

        const form = document.getElementById('formIntegrante');
        form.dataset.editingId = integranteId;
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.textContent = 'Actualizar';

        const cancelBtn = document.getElementById('btnCancelar');
        if (cancelBtn) cancelBtn.style.display = 'block';

        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        showNotification('Formulario listo para editar', 'info');
    } catch (error) {
        console.error('❌ Error:', error);
        showNotification(`Error al cargar integrante: ${error.message}`, 'error');
    }
}

/**
 * Eliminar un integrante
 * @param {string} integranteId - ID del integrante
 */
async function deleteIntegrante(integranteId) {
    if (!confirm('¿Estás seguro de que quieres eliminar este integrante?')) {
        return;
    }
    
    try {
        await eliminarMiembro(integranteId);
        showNotification('Integrante eliminado', 'success');
    } catch (error) {
        console.error('❌ Error:', error);
        showNotification(`Error al eliminar integrante: ${error.message}`, 'error');
    }
}

// CRUD PRESENTACIONES
// ====================

/**
 * Agregar una nueva presentación
 * @param {string} fecha - Fecha de la presentación (YYYY-MM-DD)
 * @param {string} lugar - Lugar del evento
 * @param {string} hora - Hora del evento
 * @param {string} precio - Precio de entrada
 */
async function addPresentacion(fecha, lugar, hora = '', precio = '') {
    if (!fecha || !lugar) {
        showNotification('Por favor completa fecha y lugar', 'error');
        return;
    }

    try {
        const { getFirestore, collection, addDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js');
        const db = getFirestore();
        
        await addDoc(collection(db, 'presentaciones'), {
            fecha: new Date(fecha),
            lugar: lugar.trim(),
            hora: hora.trim() || '',
            precio: precio ? parseFloat(precio) : 0,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        
        console.log('✅ Presentación agregada exitosamente');
        showNotification('Presentación agregada exitosamente', 'success');
        loadPresentaciones();
        resetForm('formPresentacion');
    } catch (error) {
        console.error('❌ Error al agregar presentación:', error);
        showNotification(`Error al agregar presentación: ${error.message}`, 'error');
    }
}

/**
 * Obtener todas las presentaciones en tiempo real
 */
async function loadPresentaciones() {
    try {
        const { getFirestore, collection, onSnapshot, query, orderBy } = await import('https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js');
        const db = getFirestore();
        const tablaPresentaciones = document.getElementById('tablaPresentaciones');
        
        if (!tablaPresentaciones) {
            console.warn('Tabla de presentaciones no encontrada');
            return;
        }
        
        const q = query(collection(db, 'presentaciones'), orderBy('fecha', 'asc'));
        
        onSnapshot(q, (snapshot) => {
            tablaPresentaciones.innerHTML = '';
            
            if (snapshot.empty) {
                tablaPresentaciones.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#999;">No hay presentaciones aún</td></tr>';
                return;
            }
            
            snapshot.forEach(doc => {
                const presentacion = doc.data();
                const id = doc.id;
                const fechaObj = presentacion.fecha instanceof Date ? presentacion.fecha : new Date(presentacion.fecha);
                const fecha = fechaObj.toLocaleDateString();
                
                const row = `
                    <tr>
                        <td>${fecha}</td>
                        <td>${presentacion.hora || '-'}</td>
                        <td>${presentacion.lugar}</td>
                        <td>${presentacion.precio ? '$' + presentacion.precio : '-'}</td>
                        <td>
                            <button onclick="editarPresentacion('${id}')" class="btn-action">✏️ Editar</button>
                            <button onclick="deletePresentacion('${id}')" class="btn-action delete">🗑️ Eliminar</button>
                        </td>
                    </tr>
                `;
                
                tablaPresentaciones.innerHTML += row;
            });
        });
    } catch (error) {
        console.error('❌ Error cargando presentaciones:', error);
    }
}

/**
 * Editar una presentación
 * @param {string} presentacionId - ID de la presentación
 */
async function editarPresentacion(presentacionId) {
    try {
        const { getFirestore, collection, doc, getDoc } = await import('https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js');
        const db = getFirestore();
        
        const docRef = doc(db, 'presentaciones', presentacionId);
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) {
            showNotification('Presentación no encontrada', 'error');
            return;
        }
        
        const presentacion = docSnap.data();
        const fechaObj = presentacion.fecha instanceof Date ? presentacion.fecha : new Date(presentacion.fecha);
        const fechaStr = fechaObj.toISOString().split('T')[0];
        
        document.getElementById('fechaPresentacion').value = fechaStr;
        document.getElementById('lugar').value = presentacion.lugar || '';
        document.getElementById('horaPresentacion').value = presentacion.hora || '';
        document.getElementById('precio').value = presentacion.precio || '';
        
        const form = document.getElementById('formPresentacion');
        form.dataset.editingId = presentacionId;
        form.querySelector('button[type="submit"]').textContent = 'Actualizar';
        
        const cancelBtn = document.getElementById('btnCancelarPres');
        if (cancelBtn) cancelBtn.style.display = 'block';
        
        form.scrollIntoView({ behavior: 'smooth' });
        showNotification('Formulario cargado para editar', 'info');
    } catch (error) {
        console.error('❌ Error:', error);
        showNotification(`Error al cargar presentación: ${error.message}`, 'error');
    }
}

/**
 * Eliminar una presentación
 * @param {string} presentacionId - ID de la presentación
 */
async function deletePresentacion(presentacionId) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta presentación?')) {
        return;
    }
    
    try {
        const { getFirestore, doc, deleteDoc } = await import('https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js');
        const db = getFirestore();
        
        await deleteDoc(doc(db, 'presentaciones', presentacionId));
        
        console.log('✅ Presentación eliminada');
        showNotification('Presentación eliminada exitosamente', 'success');
        loadPresentaciones();
    } catch (error) {
        console.error('❌ Error:', error);
        showNotification(`Error al eliminar presentación: ${error.message}`, 'error');
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
/**
 * Leer valores del formulario de disco
 */
function leerFormularioDisco() {
  return {
    nombre: (document.getElementById('nombreDisco') || {}).value || '',
    year: (document.getElementById('yearDisco') || {}).value || '',
    formato: (document.getElementById('formatoDisco') || {}).value || '',
    cover: (document.getElementById('coverDisco') || {}).value || ''
  };
}

/**
 * Agregar o actualizar disco
 */
async function addDisco() {
  const form = document.getElementById('formDisco');
  if (!form) return;

  const { nombre, year, formato, cover } = leerFormularioDisco();

  // Validar usando validator.js
  const validation = Validation.validateAlbum({ nombre, year, formato });
  if (!validation.ok) {
    showNotification(validation.errors.join(' '), 'error');
    return;
  }

  const editingId = form.dataset.editingId;

  try {
    const discoData = {
      nombre: nombre.trim(),
      year: parseInt(year),
      formato: formato.trim() || '',
      cover: cover.trim() || ''
    };

    if (editingId) {
      await actualizarDisco(editingId, discoData);
      showNotification('Disco actualizado exitosamente', 'success');
    } else {
      await crearDisco(discoData);
      showNotification('Disco agregado exitosamente', 'success');
    }

    resetForm('formDisco');
  } catch (error) {
    console.error('❌ Error al guardar disco:', error);
    showNotification(`Error: ${error.message}`, 'error');
  }
}

/**
 * Renderizar tabla de discos
 */
function renderDiscos(discos) {
  const tabla = document.getElementById('tablaDiscos');
  if (!tabla) return;

  if (!discos || discos.length === 0) {
    tabla.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#999;">No hay discos aún</td></tr>';
    return;
  }

  tabla.innerHTML = discos.map(d => {
    return `
      <tr>
        <td>${d.nombre}</td>
        <td>${d.year}</td>
        <td>${d.formato || '-'}</td>
        <td><img src="${d.cover}" alt="${d.nombre}" style="width:50px;height:50px;object-fit:cover;border-radius:4px;"></img></td>
        <td>
          <button data-id="${d.id}" class="btn-action btn-edit">✏️ Editar</button>
          <button data-id="${d.id}" class="btn-action delete btn-delete">🗑️ Eliminar</button>
        </td>
      </tr>`;
  }).join('');

  // Añadir listeners a botones
  tabla.querySelectorAll('.btn-edit').forEach(b => b.addEventListener('click', (e) => editarDisco(e.currentTarget.dataset.id)));
  tabla.querySelectorAll('.btn-delete').forEach(b => b.addEventListener('click', (e) => deleteDisco(e.currentTarget.dataset.id)));
}

/**
 * Cargar y escuchar discos en tiempo real
 */
function loadDiscos() {
  try {
    escucharDiscosEnTiempoReal(renderDiscos);
  } catch (error) {
    console.error('❌ Error cargando discos:', error);
  }
}

/**
 * Editar un disco
 */
async function editarDisco(discoId) {
  try {
    const disco = await obtenerDiscoPorId(discoId);
    if (!disco) {
      showNotification('Disco no encontrado', 'error');
      return;
    }

    document.getElementById('nombreDisco').value = disco.nombre || '';
    document.getElementById('yearDisco').value = disco.year || '';
    document.getElementById('formatoDisco').value = disco.formato || '';
    document.getElementById('coverDisco').value = disco.cover || '';

    const form = document.getElementById('formDisco');
    form.dataset.editingId = discoId;
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.textContent = 'Actualizar';

    const cancelBtn = document.getElementById('btnCancelarDisco');
    if (cancelBtn) cancelBtn.style.display = 'block';

    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    showNotification('Formulario listo para editar', 'info');
  } catch (error) {
    console.error('❌ Error:', error);
    showNotification(`Error al cargar disco: ${error.message}`, 'error');
  }
}

/**
 * Eliminar un disco
 */
async function deleteDisco(discoId) {
  if (!confirm('¿Estás seguro de que quieres eliminar este disco?')) {
    return;
  }

  try {
    await eliminarDisco(discoId);
    showNotification('Disco eliminado', 'success');
  } catch (error) {
    console.error('❌ Error:', error);
    showNotification(`Error al eliminar disco: ${error.message}`, 'error');
  }
}

// Exponer funciones para compatibilidad con llamadas inline en el HTML
window.addDisco = addDisco;
window.editarDisco = editarDisco;
window.deleteDisco = deleteDisco;

// UTILIDADES
// ===========

/**
 * Actualizar un integrante existente
 * @param {string} integranteId - ID del integrante
 * @param {string} nombre - Nuevo nombre
 * @param {string} rol - Nuevo rol
 * @param {string} foto - Nueva foto URL
 */
async function actualizarIntegranteForm(integranteId, nombre, rol, foto) {
    try {
        await actualizarMiembro(integranteId, { nombre: nombre.trim(), rol: rol.trim(), foto: foto.trim() });
        showNotification('Integrante actualizado exitosamente', 'success');
        resetForm('formIntegrante');
    } catch (error) {
        console.error('❌ Error:', error);
        showNotification(`Error al actualizar integrante: ${error.message}`, 'error');
    }
}

/**
 * Resetear un formulario
 * @param {string} formId - ID del formulario
 */
function resetForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
        delete form.dataset.editingId;
        if (formId === 'formIntegrante') {
            const btn = form.querySelector('button[type="submit"]');
            if (btn) btn.textContent = 'Agregar';
            
            // Ocultar botón cancelar
            const cancelBtn = document.getElementById('btnCancelar');
            if (cancelBtn) {
                cancelBtn.style.display = 'none';
            }
        }
        if (formId === 'formDisco') {
            const btn = form.querySelector('button[type="submit"]');
            if (btn) btn.textContent = 'Agregar disco';
            
            const cancelBtn = document.getElementById('btnCancelarDisco');
            if (cancelBtn) {
                cancelBtn.style.display = 'none';
            }
        }
    }
}

/**
 * Cancelar edición
 */
function cancelarEdicion() {
    resetForm('formIntegrante');
    showNotification('Edición cancelada', 'info');
}

/**
 * Mostrar notificación
 * @param {string} mensaje - Mensaje a mostrar
 * @param {string} tipo - Tipo: 'success', 'error', 'info'
 */
function showNotification(mensaje, tipo = 'info') {
    // PLACEHOLDER: Implementar notificaciones visuales
    alert(`[${tipo.toUpperCase()}] ${mensaje}`);
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
    loadNoticias();
    
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
        formIntegrante.addEventListener('submit', async (e) => {
            e.preventDefault();
            await addIntegrante();
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
            addDisco();
        });
    }
    
    // Botón Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logoutUser);
    }

    // Formulario Noticias
const formNoticias = document.getElementById("formNoticias");
if (formNoticias) {
    formNoticias.addEventListener("submit", (e) => {
        e.preventDefault();
        addNoticia();
    });
}
}

// CRUD NOTICIAS
// ==============

/**
 * Leer valores del formulario de noticia
 */
function leerFormularioNoticia() {
    return {
        titulo: (document.getElementById('tituloNoticia') || {}).value || '',
        descripcion: (document.getElementById('descripcionNoticia') || {}).value || '',
        autor: (document.getElementById('escritosNoticia') || {}).value || '',
        fecha: (document.getElementById('fechaNoticia') || {}).value || ''
    };
}

/**
 * Añadir o actualizar noticia según el estado del formulario
 */
async function addNoticia() {
    const form = document.getElementById('formNoticias');
    if (!form) return;

    const { titulo, descripcion, autor, fecha } = leerFormularioNoticia();

    if (!titulo.trim() || !descripcion.trim() || !autor.trim() || !fecha) {
        showNotification('Por favor completa todos los campos', 'error');
        return;
    }

    const editingId = form.dataset.editingId;

    try {
        if (editingId) {
            await actualizarNoticia(editingId, { 
                titulo: titulo.trim(), 
                descripcion: descripcion.trim(), 
                autor: autor.trim(), 
                fecha: new Date(fecha) 
            });
            showNotification('Noticia actualizada exitosamente', 'success');
        } else {
            await crearNoticia({ 
                titulo: titulo.trim(), 
                descripcion: descripcion.trim(), 
                autor: autor.trim(), 
                fecha: new Date(fecha) 
            });
            showNotification('Noticia agregada exitosamente', 'success');
        }

        resetForm('formNoticias');
    } catch (error) {
        console.error('❌ Error al guardar noticia:', error);
        showNotification(`Error: ${error.message}`, 'error');
    }
}

// Exponer funciones para compatibilidad con llamadas inline en el HTML
window.addNoticia = addNoticia;
window.editarNoticia = editarNoticia;
window.deleteNoticia = deleteNoticia;

/**
 * Obtener todas las noticias en tiempo real (Firestore)
 */
function renderNoticias(noticias) {
    const tabla = document.getElementById('tablaNoticias');
    if (!tabla) return;

    if (!noticias || noticias.length === 0) {
        tabla.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#999;">No hay noticias aún</td></tr>';
        return;
    }

    // Construir filas de forma simple
    tabla.innerHTML = noticias.map(n => {
        const fechaFormato = n.fecha instanceof Date ? n.fecha.toLocaleDateString() : new Date(n.fecha).toLocaleDateString();
        return `
            <tr>
                <td>${n.titulo}</td>
                <td>${n.descripcion}</td>
                <td>${n.autor}</td>
                <td>${fechaFormato}</td>
                <td>
                    <button data-id="${n.id}" class="btn-action btn-edit">✏️ Editar</button>
                    <button data-id="${n.id}" class="btn-action delete btn-delete">🗑️ Eliminar</button>
                </td>
            </tr>`;
    }).join('');

    // Añadir listeners a los botones (delegación ligera)
    tabla.querySelectorAll('.btn-edit').forEach(b => b.addEventListener('click', (e) => editarNoticia(e.currentTarget.dataset.id)));
    tabla.querySelectorAll('.btn-delete').forEach(b => b.addEventListener('click', (e) => deleteNoticia(e.currentTarget.dataset.id)));
}

async function loadNoticias() {
    try {
        escucharNoticiasEnTiempoReal(renderNoticias);
    } catch (error) {
        console.error('❌ Error cargando noticias:', error);
    }
}

/**
 * Editar una noticia
 * @param {string} noticiaId - ID de la noticia
 */
async function editarNoticia(noticiaId) {
    try {
        const noticia = await obtenerNoticiaPorId(noticiaId);
        document.getElementById('tituloNoticia').value = noticia.titulo || '';
        document.getElementById('descripcionNoticia').value = noticia.descripcion || '';
        document.getElementById('escritosNoticia').value = noticia.autor || '';
        
        const fechaObj = noticia.fecha instanceof Date ? noticia.fecha : new Date(noticia.fecha);
        document.getElementById('fechaNoticia').value = fechaObj.toISOString().split('T')[0];

        const form = document.getElementById('formNoticias');
        form.dataset.editingId = noticiaId;
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.textContent = 'Actualizar';

        const cancelBtn = document.getElementById('btnCancelarNoticia');
        if (cancelBtn) cancelBtn.style.display = 'block';

        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        showNotification('Formulario listo para editar', 'info');
    } catch (error) {
        console.error('❌ Error:', error);
        showNotification(`Error al cargar noticia: ${error.message}`, 'error');
    }
}

/**
 * Eliminar una noticia
 * @param {string} noticiaId - ID de la noticia
 */
async function deleteNoticia(noticiaId) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta noticia?')) {
        return;
    }
    
    try {
        await eliminarNoticia(noticiaId);
        showNotification('Noticia eliminada', 'success');
    } catch (error) {
        console.error('❌ Error:', error);
        showNotification(`Error al eliminar noticia: ${error.message}`, 'error');
    }
}

// Al cargar admin.html
document.addEventListener('DOMContentLoaded', () => {
    initializeAdminPanel();
    // PLACEHOLDER: Verificar autenticación y inicializar
    // checkAuthStatus() debería ser llamado desde auth.js
    // Si el usuario no está autenticado, será redirigido a login.html
    
    console.log('admin.js cargado. Esperando Firebase Auth...');
});

