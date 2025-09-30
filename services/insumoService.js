import { getJSON, setJSON } from './localStorageService';
import { useApi, apiGet, apiPost, apiPut, apiDelete } from './apiClient';

const KEY = 'insumos_medicos_v1';
const DEFAULTS = [
  { id: 1, nombre: 'Guantes', cantidad: 20 },
  { id: 2, nombre: 'Jeringas', cantidad: 15 },
  { id: 3, nombre: 'Alcohol', cantidad: 10 },
];

function read() {
  return getJSON(KEY, DEFAULTS);
}

function write(data) {
  setJSON(KEY, data);
}

export function getInsumos() {
  if (useApi()) {
    // synchronous fallback not possible; caller should fetch in effect for API mode
    // but keep a quick local value to avoid breakage
    return read();
  }
  return read();
}

export function setInsumos(next) {
  write(next);
}

export async function fetchInsumos() {
  if (!useApi()) return read();
  const data = await apiGet('/api/insumos');
  write(data);
  return data;
}

export function descontarInsumos(usados) {
  if (useApi()) {
    // fire-and-forget; UI should refresh list from API
    fetch('/api/insumos/descontar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(usados) }).catch(() => {});
    return;
  }
  const current = read();
  usados.forEach(({ id, cantidad }) => {
    const ins = current.find(i => i.id === id);
    if (ins) ins.cantidad = Math.max(0, (Number(ins.cantidad) || 0) - Number(cantidad));
  });
  write(current);
}

export function agregarInsumo(nombre, cantidad) {
  if (useApi()) {
    return apiPost('/api/insumos', { nombre, cantidad });
  }
  const current = read();
  const id = current.length ? Math.max(...current.map(i => i.id)) + 1 : 1;
  const item = { id, nombre, cantidad: Number(cantidad) || 0 };
  const next = [...current, item];
  write(next);
}

export function editarInsumo(id, nombre, cantidad) {
  if (useApi()) {
    return apiPut(`/api/insumos/${id}`, { nombre, cantidad });
  }
  const current = read();
  const next = current.map(i => (i.id === id ? { ...i, nombre, cantidad: Number(cantidad) || 0 } : i));
  write(next);
}

export function borrarInsumo(id) {
  if (useApi()) {
    return apiDelete(`/api/insumos/${id}`);
  }
  const current = read();
  const next = current.filter(i => i.id !== id);
  write(next);
}
