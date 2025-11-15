import { db } from './service/firebase.js';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy, onSnapshot, getDoc } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js';

// CRUD PRESENTACIONES - Funciones simples y consistentes

/**
 * Crear una presentación. Devuelve el id del documento.
 */
export async function crearPresentacion(presentacion) {
  if (!presentacion || !presentacion.lugar) throw new Error('Falta lugar de la presentación');
  if (!presentacion.fecha) throw new Error('Falta fecha de la presentación');
  
  // Asegurar que fecha y hora sean strings, NO Date objects
  let fechaStr = '';
  let horaStr = '';
  
  if (presentacion.fecha) {
    const f = presentacion.fecha;
    if (typeof f === 'string') {
      fechaStr = f;
    } else if (f instanceof Date) {
      fechaStr = f.toISOString().split('T')[0];
    } else {
      fechaStr = String(f).substring(0, 10);
    }
  }
  
  if (presentacion.hora) {
    horaStr = String(presentacion.hora).trim();
  }
  
  const data = { 
    ...presentacion, 
    fecha: fechaStr,      // String: "YYYY-MM-DD"
    hora: horaStr,        // String: "HH:MM" o vacío
    createdAt: new Date(), 
    updatedAt: new Date() 
  };
  const col = collection(db, 'presentaciones');
  const ref = await addDoc(col, data);
  return ref.id;
}

/**
 * Obtener todas las presentaciones ordenadas por fecha (ascendente).
 */
export async function obtenerTodasPresentaciones() {
  const col = collection(db, 'presentaciones');
  const q = query(col, orderBy('fecha', 'asc'));
  const snap = await getDocs(q);
  const res = [];
  snap.forEach(d => res.push({ id: d.id, ...d.data() }));
  return res;
}

/**
 * Escucha en tiempo real: recibe callback(presentacionesArray).
 */
export function escucharPresentacionesEnTiempoReal(callback) {
  const col = collection(db, 'presentaciones');
  const q = query(col, orderBy('fecha', 'asc'));
  return onSnapshot(q, (snap) => {
    const res = [];
    snap.forEach(d => res.push({ id: d.id, ...d.data() }));
    callback(res);
  });
}

/**
 * Obtener presentación por id.
 */
export async function obtenerPresentacionPorId(id) {
  const ref = doc(db, 'presentaciones', id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

/**
 * Actualizar presentación (parcial). Devuelve id.
 */
export async function actualizarPresentacion(id, datos) {
  const ref = doc(db, 'presentaciones', id);
  
  // Asegurar que fecha y hora sean strings, NO Date objects
  let datosActualizados = { ...datos, updatedAt: new Date() };
  
  if (datos.fecha) {
    const f = datos.fecha;
    if (typeof f === 'string') {
      datosActualizados.fecha = f;
    } else if (f instanceof Date) {
      datosActualizados.fecha = f.toISOString().split('T')[0];
    } else {
      datosActualizados.fecha = String(f).substring(0, 10);
    }
  }
  
  if (datos.hora) {
    datosActualizados.hora = String(datos.hora).trim();
  }
  
  await updateDoc(ref, datosActualizados);
  return id;
}

/**
 * Eliminar presentación. Devuelve id.
 */
export async function eliminarPresentacion(id) {
  const ref = doc(db, 'presentaciones', id);
  await deleteDoc(ref);
  return id;
}
