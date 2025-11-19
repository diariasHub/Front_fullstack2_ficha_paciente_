import { getJSON, setJSON } from './localStorageService';
import { useApi, apiGet, apiPost, apiPut, apiDelete } from './apiClient';
import { db, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from '../lib/firebase';

const KEY = 'insumos_medicos_v1';
const COLLECTION_NAME = 'insumos';
const DEFAULTS = [
  { id: 1, nombre: 'Guantes', cantidad: 20 },
  { id: 2, nombre: 'Jeringas', cantidad: 15 },
  { id: 3, nombre: 'Alcohol', cantidad: 10 },
];

function useFirebase() {
  try {
    return typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_USE_FIREBASE === 'true';
  } catch {
    return false;
  }
}

function read() {
  return getJSON(KEY, DEFAULTS);
}

function write(data) {
  setJSON(KEY, data);
}

export function getInsumos() {
  if (useApi() || useFirebase()) {
    // synchronous fallback not possible; caller should fetch in effect for API/Firebase mode
    // but keep a quick local value to avoid breakage
    return read();
  }
  return read();
}

export function setInsumos(next) {
  write(next);
}

export async function fetchInsumos() {
  if (useFirebase()) {
    try {
      const insumosRef = collection(db, COLLECTION_NAME);
      const q = query(insumosRef, orderBy('nombre', 'asc'));
      const querySnapshot = await getDocs(q);
      const insumos = [];
      querySnapshot.forEach((doc) => {
        insumos.push({ id: doc.id, ...doc.data() });
      });
      
      // Si no hay insumos en Firebase, inicializar con valores por defecto
      if (insumos.length === 0) {
        for (const insumo of DEFAULTS) {
          const docRef = await addDoc(insumosRef, {
            nombre: insumo.nombre,
            cantidad: insumo.cantidad,
            createdAt: new Date().toISOString()
          });
          insumos.push({ id: docRef.id, nombre: insumo.nombre, cantidad: insumo.cantidad });
        }
      }
      
      write(insumos);
      return insumos;
    } catch (error) {
      console.error('Error obteniendo insumos de Firebase:', error);
      return read();
    }
  }
  
  if (!useApi()) return read();
  const data = await apiGet('/api/insumos');
  write(data);
  return data;
}

export async function descontarInsumos(usados) {
  if (useFirebase()) {
    try {
      // Descontar insumos en Firebase
      for (const { id, cantidad } of usados) {
        const insumoRef = doc(db, COLLECTION_NAME, id);
        const insumos = await fetchInsumos();
        const insumo = insumos.find(i => i.id === id);
        if (insumo) {
          const nuevaCantidad = Math.max(0, (Number(insumo.cantidad) || 0) - Number(cantidad));
          await updateDoc(insumoRef, { 
            cantidad: nuevaCantidad,
            updatedAt: new Date().toISOString()
          });
        }
      }
      return;
    } catch (error) {
      console.error('Error descontando insumos en Firebase:', error);
      throw error;
    }
  }
  
  if (useApi()) {
    // fire-and-forget; UI should refresh list from API
    fetch('/api/insumos/descontar', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(usados) 
    }).catch(() => {});
    return;
  }
  
  const current = read();
  usados.forEach(({ id, cantidad }) => {
    const ins = current.find(i => i.id === id);
    if (ins) ins.cantidad = Math.max(0, (Number(ins.cantidad) || 0) - Number(cantidad));
  });
  write(current);
}

export async function agregarInsumo(nombre, cantidad) {
  if (useFirebase()) {
    try {
      const insumosRef = collection(db, COLLECTION_NAME);
      const timestamp = new Date().toISOString();
      const docRef = await addDoc(insumosRef, {
        nombre,
        cantidad: Number(cantidad) || 0,
        createdAt: timestamp,
        updatedAt: timestamp
      });
      return { id: docRef.id, nombre, cantidad: Number(cantidad) || 0 };
    } catch (error) {
      console.error('Error agregando insumo en Firebase:', error);
      throw error;
    }
  }
  
  if (useApi()) {
    return apiPost('/api/insumos', { nombre, cantidad });
  }
  
  const current = read();
  const id = current.length ? Math.max(...current.map(i => i.id)) + 1 : 1;
  const item = { id, nombre, cantidad: Number(cantidad) || 0 };
  const next = [...current, item];
  write(next);
}

export async function editarInsumo(id, nombre, cantidad) {
  if (useFirebase()) {
    try {
      const insumoRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(insumoRef, {
        nombre,
        cantidad: Number(cantidad) || 0,
        updatedAt: new Date().toISOString()
      });
      return { id, nombre, cantidad: Number(cantidad) || 0 };
    } catch (error) {
      console.error('Error editando insumo en Firebase:', error);
      throw error;
    }
  }
  
  if (useApi()) {
    return apiPut(`/api/insumos/${id}`, { nombre, cantidad });
  }
  
  const current = read();
  const next = current.map(i => (i.id === id ? { ...i, nombre, cantidad: Number(cantidad) || 0 } : i));
  write(next);
}

export async function borrarInsumo(id) {
  if (useFirebase()) {
    try {
      const insumoRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(insumoRef);
      return true;
    } catch (error) {
      console.error('Error borrando insumo en Firebase:', error);
      throw error;
    }
  }
  
  if (useApi()) {
    return apiDelete(`/api/insumos/${id}`);
  }
  
  const current = read();
  const next = current.filter(i => i.id !== id);
  write(next);
}

