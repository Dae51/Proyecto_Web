import { db } from './service/firebase.js';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy, onSnapshot, getDoc } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js';

// Versión simplificada: funciones CRUD mínimas y consistentes.

// Crear un miembro. Devuelve el id del documento.
export async function crearMiembro(miembro) {
  if (!miembro || !miembro.nombre) throw new Error('Falta nombre');
  const data = { ...miembro, createdAt: new Date(), updatedAt: new Date() };
  const col = collection(db, 'miembros');
  const ref = await addDoc(col, data);
  return ref.id;
}

// Obtener todos los miembros ordenados por creación (desc).
export async function obtenerTodosMiembros() {
  const col = collection(db, 'miembros');
  const q = query(col, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  const res = [];
  snap.forEach(d => res.push({ id: d.id, ...d.data() }));
  return res;
}

// Escucha en tiempo real: recibe callback(miembrosArray).
export function escucharMiembrosEnTiempoReal(callback) {
  const col = collection(db, 'miembros');
  const q = query(col, orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    const res = [];
    snap.forEach(d => res.push({ id: d.id, ...d.data() }));
    callback(res);
  });
}

// Obtener miembro por id.
export async function obtenerMiembroPorId(id) {
  const ref = doc(db, 'miembros', id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

// Actualizar miembro (parcial). Devuelve id.
export async function actualizarMiembro(id, datos) {
  const ref = doc(db, 'miembros', id);
  await updateDoc(ref, { ...datos, updatedAt: new Date() });
  return id;
}

// Eliminar miembro. Devuelve id.
export async function eliminarMiembro(id) {
  const ref = doc(db, 'miembros', id);
  await deleteDoc(ref);
  return id;
}
