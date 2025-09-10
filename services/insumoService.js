let insumos = [
  { id: 1, nombre: 'Guantes', cantidad: 20 },
  { id: 2, nombre: 'Jeringas', cantidad: 15 },
  { id: 3, nombre: 'Alcohol', cantidad: 10 },
];

export function getInsumos() {
  return insumos;
}

export function descontarInsumos(usados) {
  usados.forEach(({ id, cantidad }) => {
    const ins = insumos.find(i => i.id === id);
    if (ins) ins.cantidad -= cantidad;
  });
}

export function agregarInsumo(nombre, cantidad) {
  const id = insumos.length ? Math.max(...insumos.map(i => i.id)) + 1 : 1;
  insumos.push({ id, nombre, cantidad });
}

export function editarInsumo(id, nombre, cantidad) {
  const ins = insumos.find(i => i.id === id);
  if (ins) {
    ins.nombre = nombre;
    ins.cantidad = cantidad;
  }
}

export function borrarInsumo(id) {
  insumos = insumos.filter(i => i.id !== id);
}
