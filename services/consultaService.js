import { getJSON, setJSON } from './localStorageService';
import { useApi, apiGet, apiPost } from './apiClient';

const KEY = 'consultas_v1';

export function listarConsultas() {
  // For API mode, callers should fetch asynchronously via fetchConsultas()
  return getJSON(KEY, []);
}

export function guardarConsulta(cons) {
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

// Async helpers for API mode
export async function fetchConsultas() {
  if (!useApi()) return listarConsultas();
  const data = await apiGet('/api/consultas');
  setJSON(KEY, data); // cache locally for quick reads
  return data;
}
