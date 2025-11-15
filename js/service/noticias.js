import { db } from './firebase.js';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy, onSnapshot, getDoc } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js';

// Versión simplificada: funciones CRUD mínimas y consistentes para noticias.

// Crear una noticia. Devuelve el id del documento.
export async function crearNoticia(noticia) {
  if (!noticia || !noticia.titulo) throw new Error('Falta título');
  
  // Asegurar que fecha sea string YYYY-MM-DD, NO Date object
  let fechaStr = '';
  if (noticia.fecha) {
    const f = noticia.fecha;
    if (typeof f === 'string') {
      fechaStr = f;
    } else if (f instanceof Date) {
      fechaStr = f.toISOString().split('T')[0];
    } else {
      fechaStr = String(f).substring(0, 10);
    }
  }
  
  const data = { 
    ...noticia, 
    fecha: fechaStr,  // String: "YYYY-MM-DD"
    createdAt: new Date(), 
    updatedAt: new Date() 
  };
  const col = collection(db, 'noticias');
  const ref = await addDoc(col, data);
  return ref.id;
}

// Obtener todas las noticias ordenadas por creación (desc).
export async function obtenerTodasNoticias() {
  const col = collection(db, 'noticias');
  const q = query(col, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  const res = [];
  snap.forEach(d => res.push({ id: d.id, ...d.data() }));
  return res;
}

// Escucha en tiempo real: recibe callback(noticiasArray).
export function escucharNoticiasEnTiempoReal(callback) {
  const col = collection(db, 'noticias');
  const q = query(col, orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    const res = [];
    snap.forEach(d => res.push({ id: d.id, ...d.data() }));
    callback(res);
  });
}

// Obtener noticia por id.
export async function obtenerNoticiaPorId(id) {
  const ref = doc(db, 'noticias', id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

// Actualizar noticia (parcial). Devuelve id.
export async function actualizarNoticia(id, datos) {
  const ref = doc(db, 'noticias', id);
  
  // Asegurar que fecha sea string en formato YYYY-MM-DD
  let datosActualizados = { ...datos, updatedAt: new Date() };
  
  if (datos.fecha) {
    const fecha = String(datos.fecha).trim();
    // Si tiene formato YYYY-MM-DD, usarlo directamente
    if (/^\d{4}-\d{2}-\d{2}/.test(fecha)) {
      datosActualizados.fecha = fecha.substring(0, 10);
    } else {
      // Si es un objeto Date, convertir a string
      const fechaObj = datos.fecha instanceof Date ? datos.fecha : new Date(datos.fecha);
      datosActualizados.fecha = fechaObj.toISOString().split('T')[0];
    }
  }
  
  await updateDoc(ref, datosActualizados);
  return id;
}

// Eliminar noticia. Devuelve id.
export async function eliminarNoticia(id) {
  const ref = doc(db, 'noticias', id);
  await deleteDoc(ref);
  return id;
}
