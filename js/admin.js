
// Importar funciones de integrantes.js
import { crearMiembro, escucharMiembrosEnTiempoReal, obtenerMiembroPorId, actualizarMiembro, eliminarMiembro } from './integrantes.js';
// Importar funciones de discografia.js
import { crearDisco, escucharDiscosEnTiempoReal, obtenerDiscoPorId, actualizarDisco, eliminarDisco } from './discografia.js';
// Importar funciones de presentaciones.js
import { crearPresentacion, escucharPresentacionesEnTiempoReal, obtenerPresentacionPorId, actualizarPresentacion, eliminarPresentacion } from './presentaciones.js';
// Importar funciones de noticias.js
import { crearNoticia, escucharNoticiasEnTiempoReal, obtenerNoticiaPorId, actualizarNoticia, eliminarNoticia } from './service/noticias.js';


// Importar validaciones
import { Validation } from './service/validator.js';
// Importar funciones de autenticacion
import { loginUser, signup, signOutUser } from './service/auth.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js';



// leer valores del formulario de integrante
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
window.addIntegrante = addIntegrante;
window.editarIntegrante = editarIntegrante;
window.deleteIntegrante = deleteIntegrante;

// renderizar tabla de integrantes
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

// Cargar y escuchar integrantes en tiempo real
async function loadIntegrantes() {
    try {
        escucharMiembrosEnTiempoReal(renderIntegrantes);
    } catch (error) {
        console.error('❌ Error cargando integrantes:', error);
    }
}


// Editar un integrante
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


// Eliminar un integrante
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



 //Leer valores del formulario de presentación
function leerFormularioPresentacion() {
  return {
    lugar: (document.getElementById('lugar') || {}).value || '',
    fecha: (document.getElementById('fechaPresentacion') || {}).value || '',
    hora: (document.getElementById('horaPresentacion') || {}).value || '',
    precio: (document.getElementById('precio') || {}).value || ''
  };
}

// Añadir o actualizar presentación según el estado del formulario
async function addPresentacion() {
  const form = document.getElementById('formPresentacion');
  if (!form) return;

  const { lugar, fecha, hora, precio } = leerFormularioPresentacion();

  // Validar usando validator.js
  const validation = Validation.validatePresentation({ lugar, fecha, hora, precio });
  if (!validation.ok) {
    showNotification(validation.errors.join(' '), 'error');
    return;
  }

  const editingId = form.dataset.editingId;

  try {
    // Asegurar que la hora sea una cadena en formato HH:MM o vacía
    let horaFormato = '';
    if (hora && /^\d{2}:\d{2}$/.test(hora)) {
      horaFormato = hora;
    }

    const presentacionData = {
      lugar: lugar.trim(),
      fecha: fecha,  
      hora: horaFormato, 
      precio: precio ? parseFloat(precio) : 0
    };

    if (editingId) {
      await actualizarPresentacion(editingId, presentacionData);
      showNotification('Presentación actualizada exitosamente', 'success');
      delete form.dataset.editingId;
    } else {
      await crearPresentacion(presentacionData);
      showNotification('Presentación agregada exitosamente', 'success');
    }

    resetForm('formPresentacion');
  } catch (error) {
    console.error('❌ Error al guardar presentación:', error);
    showNotification(`Error: ${error.message}`, 'error');
  }
}

// Renderizar tabla de presentaciones
function renderPresentaciones(presentaciones) {
  const tabla = document.getElementById('tablaPresentaciones');
  if (!tabla) return;

  if (!presentaciones || presentaciones.length === 0) {
    tabla.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#999;">No hay presentaciones aún</td></tr>';
    return;
  }

  tabla.innerHTML = presentaciones.map(p => {
    let fechaFormato = '';
    if (p.fecha) {
      const f = String(p.fecha);
      if (/^\d{4}-\d{2}-\d{2}/.test(f)) {
        // Si es string YYYY-MM-DD, parsear y formatear
        const fechaObj = new Date(f + 'T00:00:00');
        fechaFormato = fechaObj.toLocaleDateString('es-ES');
      } else if (p.fecha instanceof Date) {
        // Si es Date, formatear directamente
        fechaFormato = p.fecha.toLocaleDateString('es-ES');
      } else {
        // Intenta parsear como sea
        try {
          const fechaObj = new Date(p.fecha);
          if (!isNaN(fechaObj.getTime())) {
            fechaFormato = fechaObj.toLocaleDateString('es-ES');
          } else {
            fechaFormato = f;
          }
        } catch (e) {
          fechaFormato = f;
        }
      }
    }
    
    return `
      <tr>
        <td>${p.lugar}</td>
        <td>${fechaFormato}</td>
        <td>${p.hora || '-'}</td>
        <td>${p.precio ? '$' + p.precio : '-'}</td>
        <td>
          <button data-id="${p.id}" class="btn-action btn-edit">✏️ Editar</button>
          <button data-id="${p.id}" class="btn-action delete btn-delete">🗑️ Eliminar</button>
        </td>
      </tr>`;
  }).join('');

  // Añadir listeners a botones
  tabla.querySelectorAll('.btn-edit').forEach(b => b.addEventListener('click', (e) => editarPresentacion(e.currentTarget.dataset.id)));
  tabla.querySelectorAll('.btn-delete').forEach(b => b.addEventListener('click', (e) => deletePresentacion(e.currentTarget.dataset.id)));
}

// Cargar y escuchar presentaciones en tiempo real
function loadPresentaciones() {
  try {
    escucharPresentacionesEnTiempoReal(renderPresentaciones);
  } catch (error) {
    console.error('❌ Error cargando presentaciones:', error);
  }
}

// Editar una presentación
async function editarPresentacion(presentacionId) {
  try {
    const presentacion = await obtenerPresentacionPorId(presentacionId);
    if (!presentacion) {
      showNotification('Presentación no encontrada', 'error');
      return;
    }

    document.getElementById('lugar').value = presentacion.lugar || '';
    
    let fechaStr = '';
    if (presentacion.fecha) {
      const f = String(presentacion.fecha);
      if (/^\d{4}-\d{2}-\d{2}/.test(f)) {
        fechaStr = f.substring(0, 10);
      } else if (presentacion.fecha instanceof Date) {
        fechaStr = presentacion.fecha.toISOString().split('T')[0];
      }
    }
    document.getElementById('fechaPresentacion').value = fechaStr;
    
    // Leer hora como string y validar formato
    let horaValue = '';
    if (presentacion.hora) {
      const hora = String(presentacion.hora).trim();
      // Validar que sea formato HH:MM
      if (/^\d{2}:\d{2}/.test(hora)) {
        // Extraer solo HH:MM si tiene más caracteres
        horaValue = hora.substring(0, 5);
      }
    }
    document.getElementById('horaPresentacion').value = horaValue;
    document.getElementById('precio').value = presentacion.precio || '';

    const form = document.getElementById('formPresentacion');
    form.dataset.editingId = presentacionId;
    const submitBtn = form.querySelector('button[type="button"]');
    if (submitBtn) submitBtn.textContent = 'Actualizar presentación';

    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    showNotification('Formulario listo para editar', 'info');
  } catch (error) {
    console.error('❌ Error:', error);
    showNotification(`Error al cargar presentación: ${error.message}`, 'error');
  }
}

// Eliminar una presentación
async function deletePresentacion(presentacionId) {
  if (!confirm('¿Estás seguro de que quieres eliminar esta presentación?')) {
    return;
  }

  try {
    await eliminarPresentacion(presentacionId);
    showNotification('Presentación eliminada exitosamente', 'success');
  } catch (error) {
    console.error('❌ Error:', error);
    showNotification(`Error al eliminar presentación: ${error.message}`, 'error');
  }
}

// Exponer funciones para compatibilidad con llamadas inline en el HTML
window.addPresentacion = addPresentacion;
window.editarPresentacion = editarPresentacion;
window.deletePresentacion = deletePresentacion;

// leer valores del formulario de disco
function leerFormularioDisco() {
  return {
    nombre: (document.getElementById('nombreDisco') || {}).value || '',
    year: (document.getElementById('yearDisco') || {}).value || '',
    formato: (document.getElementById('formatoDisco') || {}).value || '',
    cover: (document.getElementById('coverDisco') || {}).value || ''
  };
}

// Añadir o actualizar disco según el estado del formulario
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

/// Renderizar tabla de discos
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

// Cargar y escuchar discos en tiempo real
function loadDiscos() {
  try {
    escucharDiscosEnTiempoReal(renderDiscos);
  } catch (error) {
    console.error('❌ Error cargando discos:', error);
  }
}

// Editar un disco
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

// Eliminar un disco
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


// Resetear formulario
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
        if (formId === 'formPresentacion') {
            const btn = form.querySelector('button[type="button"]');
            if (btn) btn.textContent = 'Agregar presentación';
        }
        if (formId === 'formDisco') {
            const btn = form.querySelector('button[type="submit"]');
            if (btn) btn.textContent = 'Agregar disco';
            
            const cancelBtn = document.getElementById('btnCancelarDisco');
            if (cancelBtn) {
                cancelBtn.style.display = 'none';
            }
        }
        if (formId === 'formNoticias') {
            const btn = form.querySelector('button[type="submit"]');
            if (btn) btn.textContent = 'Agregar Noticia';
            
            const cancelBtn = document.getElementById('btnCancelarNoticia');
            if (cancelBtn) {
                cancelBtn.style.display = 'none';
            }
        }
    }
}


// Cancelar edición de integrante
function cancelarEdicion() {
    resetForm('formIntegrante');
    showNotification('Edición cancelada', 'info');
}

// Cancelar edición de disco
function showNotification(mensaje, tipo = 'info') {
    // PLACEHOLDER: Implementar notificaciones visuales
    alert(`[${tipo.toUpperCase()}] ${mensaje}`);
}

// Cerrar sesión del usuario
async function logoutUser() {
    try {
        await signOutUser();
        showNotification('Sesión cerrada correctamente', 'success');
        // Redirigir al login
        setTimeout(() => {
            window.location.href = './login.html';
        }, 600);
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        showNotification('Error cerrando sesión: ' + (error.message || ''), 'error');
    }
}

// Inicializar panel de administración
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


// Configurar listeners para formularios y botones
function setupFormListeners() {
    // Formulario Integrante
    const formIntegrante = document.getElementById('formIntegrante');
    if (formIntegrante) {
        formIntegrante.addEventListener('submit', async (e) => {
            e.preventDefault();
            await addIntegrante();
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
}


// leer valores del formulario de noticia
function leerFormularioNoticia() {
    return {
        titulo: (document.getElementById('tituloNoticia') || {}).value || '',
        descripcion: (document.getElementById('descripcionNoticia') || {}).value || '',
        autor: (document.getElementById('escritosNoticia') || {}).value || '',
        fecha: (document.getElementById('fechaNoticia') || {}).value || ''
    };
}

// Añadir o actualizar noticia según el estado del formulario
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
        const noticiaData = {
            titulo: titulo.trim(), 
            descripcion: descripcion.trim(), 
            autor: autor.trim(), 
            fecha: fecha // Pasar como string YYYY-MM-DD, será procesado en noticias.js
        };

        if (editingId) {
            await actualizarNoticia(editingId, noticiaData);
            showNotification('Noticia actualizada exitosamente', 'success');
            delete form.dataset.editingId;
        } else {
            await crearNoticia(noticiaData);
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

// renderizar tabla de noticias
function renderNoticias(noticias) {
    const tabla = document.getElementById('tablaNoticias');
    if (!tabla) return;

    if (!noticias || noticias.length === 0) {
        tabla.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#999;">No hay noticias aún</td></tr>';
        return;
    }

    // Construir filas de forma simple
    tabla.innerHTML = noticias.map(n => {
        let fechaFormato = '';
        if (n.fecha) {
          const f = String(n.fecha);
          if (/^\d{4}-\d{2}-\d{2}/.test(f)) {
            // Si es string YYYY-MM-DD, parsear y formatear
            const fechaObj = new Date(f + 'T00:00:00');
            fechaFormato = fechaObj.toLocaleDateString('es-ES');
          } else if (n.fecha instanceof Date) {
            fechaFormato = n.fecha.toLocaleDateString('es-ES');
          } else {
            try {
              const fechaObj = new Date(n.fecha);
              if (!isNaN(fechaObj.getTime())) {
                fechaFormato = fechaObj.toLocaleDateString('es-ES');
              } else {
                fechaFormato = f;
              }
            } catch (e) {
              fechaFormato = f;
            }
          }
        }
        
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

// Editar una noticia
async function editarNoticia(noticiaId) {
    try {
        const noticia = await obtenerNoticiaPorId(noticiaId);
        document.getElementById('tituloNoticia').value = noticia.titulo || '';
        document.getElementById('descripcionNoticia').value = noticia.descripcion || '';
        document.getElementById('escritosNoticia').value = noticia.autor || '';
        
        // Leer fecha como string y validar formato
        let fechaValue = '';
        if (noticia.fecha) {
          const fecha = String(noticia.fecha).trim();
          // Validar que sea formato YYYY-MM-DD
          if (/^\d{4}-\d{2}-\d{2}/.test(fecha)) {
            // Extraer solo YYYY-MM-DD si tiene más caracteres
            fechaValue = fecha.substring(0, 10);
          } else {
            // Intentar convertir desde Date
            try {
              const fechaObj = noticia.fecha instanceof Date ? noticia.fecha : new Date(noticia.fecha);
              if (!isNaN(fechaObj.getTime())) {
                fechaValue = fechaObj.toISOString().split('T')[0];
              }
            } catch (e) {
              // Si falla, dejar vacío
              fechaValue = '';
            }
          }
        }
        document.getElementById('fechaNoticia').value = fechaValue;

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

// Eliminar una noticia
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
    // Inicializar observer de estado de autenticación de Firebase
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // Usuario autenticado: inicializar panel con el objeto user
            initializeAdminPanel(user);
        } else {
            // No autenticado: redirigir al login
            console.log('Usuario no autenticado. Redirigiendo a login.');
            window.location.href = './login.html';
        }
    });

    console.log('admin.js cargado. Observando estado de autenticación...');
});

