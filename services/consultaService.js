import { getJSON, setJSON } from './localStorageService';
import { useApi, apiGet, apiPost, apiPut, apiDelete } from './apiClient';
import { db, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, orderBy } from '../lib/firebase';

const KEY = 'consultas_v1';
const COLLECTION_NAME = 'consultas';

function useFirebase() {
  try {
    return typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_USE_FIREBASE === 'true';
  } catch {
    return false;
  }
}

export function listarConsultas() {
  // For Firebase/API mode, callers should fetch asynchronously via fetchConsultas()
  return getJSON(KEY, []);
}

export async function guardarConsulta(cons) {
  if (useFirebase()) {
    // Guardar en Firebase Firestore
    try {
      const consultasRef = collection(db, COLLECTION_NAME);
      const timestamp = new Date().toISOString();
      const consulta = {
        ...cons,
        createdAt: timestamp,
        updatedAt: timestamp
      };
      const docRef = await addDoc(consultasRef, consulta);
      return { id: docRef.id, ...consulta };
    } catch (error) {
      console.error('Error guardando consulta en Firebase:', error);
      throw error;
    }
  }
  
  if (useApi()) {
    return apiPost('/api/consultas', cons);
  }
  
  const list = listarConsultas();
  const withId = { id: Date.now(), ...cons };
  const next = [withId, ...list];
  setJSON(KEY, next);
  return withId;
}

export function filtrarConsultas({ rut, fecha, carrera, motivo }) {
  const list = listarConsultas();
  return list.filter(c => (
    (!rut || (c.rut || '').toLowerCase().includes(rut.toLowerCase())) &&
    (!fecha || (c.fecha || '').includes(fecha)) &&
    (!carrera || (c.carrera || '').toLowerCase().includes(carrera.toLowerCase())) &&
    (!motivo || (c.motivo || '').toLowerCase().includes(motivo.toLowerCase()))
  ));
}

// Async helpers for Firebase/API mode
export async function fetchConsultas() {
  if (useFirebase()) {
    try {
      const consultasRef = collection(db, COLLECTION_NAME);
      const q = query(consultasRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const consultas = [];
      querySnapshot.forEach((doc) => {
        consultas.push({ id: doc.id, ...doc.data() });
      });
      setJSON(KEY, consultas); // cache locally for quick reads
      return consultas;
    } catch (error) {
      console.error('Error obteniendo consultas de Firebase:', error);
      return listarConsultas(); // fallback to localStorage
    }
  }
  
  if (!useApi()) return listarConsultas();
  const data = await apiGet('/api/consultas');
  setJSON(KEY, data); // cache locally for quick reads
  return data;
}

export async function filtrarConsultasAsync({ rut, fecha, carrera, motivo }) {
  if (useFirebase()) {
    try {
      const consultasRef = collection(db, COLLECTION_NAME);
      let q = query(consultasRef, orderBy('createdAt', 'desc'));
      
      // Firebase no permite filtros complejos sin índices, 
      // así que obtenemos todo y filtramos en el cliente
      const querySnapshot = await getDocs(q);
      const consultas = [];
      querySnapshot.forEach((doc) => {
        const c = { id: doc.id, ...doc.data() };
        const matches = (
          (!rut || (c.rut || '').toLowerCase().includes(rut.toLowerCase())) &&
          (!fecha || (c.fecha || '').includes(fecha)) &&
          (!carrera || (c.carrera || '').toLowerCase().includes(carrera.toLowerCase())) &&
          (!motivo || (c.motivo || '').toLowerCase().includes(motivo.toLowerCase()))
        );
        if (matches) consultas.push(c);
      });
      return consultas;
    } catch (error) {
      console.error('Error filtrando consultas en Firebase:', error);
      return filtrarConsultas({ rut, fecha, carrera, motivo });
    }
  }
  
  return filtrarConsultas({ rut, fecha, carrera, motivo });
}

// Actualizar consulta
export async function actualizarConsulta(id, datos) {
  if (useFirebase()) {
    try {
      const consultaRef = doc(db, COLLECTION_NAME, id);
      const datosActualizados = {
        ...datos,
        updatedAt: new Date().toISOString()
      };
      await updateDoc(consultaRef, datosActualizados);
      return { id, ...datosActualizados };
    } catch (error) {
      console.error('Error actualizando consulta en Firebase:', error);
      throw error;
    }
  }

  if (useApi()) {
    return apiPut(`/api/consultas/${id}`, datos);
  }

  const list = listarConsultas();
  const next = list.map(c => (c.id === id ? { ...c, ...datos } : c));
  setJSON(KEY, next);
  return { id, ...datos };
}

// Eliminar consulta
export async function eliminarConsulta(id) {
  if (useFirebase()) {
    try {
      const consultaRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(consultaRef);
      return true;
    } catch (error) {
      console.error('Error eliminando consulta en Firebase:', error);
      throw error;
    }
  }

  if (useApi()) {
    return apiDelete(`/api/consultas/${id}`);
  }

  const list = listarConsultas();
  const next = list.filter(c => c.id !== id);
  setJSON(KEY, next);
  return true;
}


