import { db } from './service/firebase.js';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy, onSnapshot, getDoc } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js';

// CRUD DISCOGRAFÍA - Funciones simples y consistentes

/**
 * Crear un disco. Devuelve el id del documento.
 */
export async function crearDisco(disco) {
  if (!disco || !disco.nombre) throw new Error('Falta nombre del disco');
  const data = { ...disco, createdAt: new Date(), updatedAt: new Date() };
  const col = collection(db, 'discografia');
  const ref = await addDoc(col, data);
  return ref.id;
}

/**
 * Obtener todos los discos ordenados por año (descendente).
 */
export async function obtenerTodosDiscos() {
  const col = collection(db, 'discografia');
  const q = query(col, orderBy('year', 'desc'));
  const snap = await getDocs(q);
  const res = [];
  snap.forEach(d => res.push({ id: d.id, ...d.data() }));
  return res;
}

/**
 * Escucha en tiempo real: recibe callback(discosArray).
 */
export function escucharDiscosEnTiempoReal(callback) {
  const col = collection(db, 'discografia');
  const q = query(col, orderBy('year', 'desc'));
  return onSnapshot(q, (snap) => {
    const res = [];
    snap.forEach(d => res.push({ id: d.id, ...d.data() }));
    callback(res);
  });
}

/**
 * Obtener disco por id.
 */
export async function obtenerDiscoPorId(id) {
  const ref = doc(db, 'discografia', id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

/**
 * Actualizar disco (parcial). Devuelve id.
 */
export async function actualizarDisco(id, datos) {
  const ref = doc(db, 'discografia', id);
  await updateDoc(ref, { ...datos, updatedAt: new Date() });
  return id;
}

/**
 * Eliminar disco. Devuelve id.
 */
export async function eliminarDisco(id) {
  const ref = doc(db, 'discografia', id);
  await deleteDoc(ref);
  return id;
}
