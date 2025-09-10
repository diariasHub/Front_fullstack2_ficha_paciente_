import { useState } from 'react';
import { getInsumos, agregarInsumo, editarInsumo, borrarInsumo } from '../services/insumoService';

const insumosIniciales = [
  { id: 1, nombre: 'Guantes', cantidad: 20 },
  { id: 2, nombre: 'Jeringas', cantidad: 15 },
  { id: 3, nombre: 'Alcohol', cantidad: 10 },
];

function exportToXLS(insumos) {
  const header = ['Nombre', 'Cantidad'];
  const rows = insumos.map(i => [i.nombre, i.cantidad]);
  let csv = header.join(',') + '\n' + rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'insumos.csv';
  a.click();
  window.URL.revokeObjectURL(url);
}

export default function StockPage() {
  const [insumos, setInsumos] = useState(getInsumos());
  const [nuevo, setNuevo] = useState({ nombre: '', cantidad: '' });
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ nombre: '', cantidad: '' });
  const [busqueda, setBusqueda] = useState('');

  const handleAdd = e => {
    e.preventDefault();
    if (nuevo.nombre && nuevo.cantidad > 0) {
      agregarInsumo(nuevo.nombre, Number(nuevo.cantidad));
      setInsumos(getInsumos());
      setNuevo({ nombre: '', cantidad: '' });
    }
  };

  const handleEdit = id => {
    const ins = insumos.find(i => i.id === id);
    setEditId(id);
    setEditData({ nombre: ins.nombre, cantidad: ins.cantidad });
  };

  const handleEditSave = e => {
    e.preventDefault();
    editarInsumo(editId, editData.nombre, Number(editData.cantidad));
    setInsumos(getInsumos());
    setEditId(null);
    setEditData({ nombre: '', cantidad: '' });
  };

  const handleDelete = id => {
    borrarInsumo(id);
    setInsumos(getInsumos());
  };

  // Filtro de búsqueda
  const insumosFiltrados = insumos.filter(i => i.nombre.toLowerCase().includes(busqueda.toLowerCase()));

  // Alerta de insumos bajos
  const alertas = insumosFiltrados.filter((ins, idx) => {
    const inicial = insumosIniciales.find(i => i.id === ins.id)?.cantidad || 0;
    return inicial > 0 && ins.cantidad < inicial * 0.2;
  });

  return (
    <div className="container mt-5">
      <div className="bg-white rounded shadow p-4">
        <h2 className="mb-4 text-warning">Stock de Insumos Médicos</h2>
        <form className="row g-2 mb-3" onSubmit={handleAdd}>
          <div className="col-md-6">
            <input type="text" className="form-control" placeholder="Nombre insumo" value={nuevo.nombre} onChange={e => setNuevo({ ...nuevo, nombre: e.target.value })} />
          </div>
          <div className="col-md-4">
            <input type="number" className="form-control" placeholder="Cantidad" value={nuevo.cantidad} onChange={e => setNuevo({ ...nuevo, cantidad: e.target.value })} />
          </div>
          <div className="col-md-2">
            <button className="btn btn-primary w-100" type="submit">Agregar</button>
          </div>
        </form>
        <div className="row mb-3">
          <div className="col-md-6">
            <input type="text" className="form-control" placeholder="Buscar insumo..." value={busqueda} onChange={e => setBusqueda(e.target.value)} />
          </div>
          <div className="col-md-6 text-end">
            <button className="btn btn-success" onClick={() => exportToXLS(insumosFiltrados)}>Descargar Inventario XLS</button>
          </div>
        </div>
        {alertas.length > 0 && (
          <div className="alert alert-danger">¡Atención! Los siguientes insumos tienen menos del 20% de stock inicial: {alertas.map(a => a.nombre).join(', ')}</div>
        )}
        <table className="table table-hover">
          <thead className="table-light">
            <tr>
              <th>Nombre</th>
              <th>Cantidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {insumosFiltrados.map(ins => (
              <tr key={ins.id}>
                <td>
                  {editId === ins.id ? (
                    <input type="text" className="form-control" value={editData.nombre} onChange={e => setEditData({ ...editData, nombre: e.target.value })} />
                  ) : (
                    ins.nombre
                  )}
                </td>
                <td>
                  {editId === ins.id ? (
                    <input type="number" className="form-control" value={editData.cantidad} onChange={e => setEditData({ ...editData, cantidad: e.target.value })} />
                  ) : (
                    ins.cantidad
                  )}
                </td>
                <td>
                  {editId === ins.id ? (
                    <button className="btn btn-success btn-sm me-2" onClick={handleEditSave}>Guardar</button>
                  ) : (
                    <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(ins.id)}>Editar</button>
                  )}
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(ins.id)}>Borrar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}