import { useState } from 'react';

function getFecha() {
  const now = new Date();
  return now.toLocaleDateString('es-CL') + ' ' + now.toLocaleTimeString('es-CL');
}

export default function CuentasPage() {
  const [cuentas, setCuentas] = useState([
    { id: 1, usuario: 'admin', rut: '11111111-1', cargo: 'Administrador', fecha: getFecha() }
  ]);
  const [form, setForm] = useState({ usuario: '', password: '', rut: '', cargo: '' });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ usuario: '', password: '', rut: '', cargo: '' });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleEditChange = e => {
    const { name, value } = e.target;
    setEditForm(f => ({ ...f, [name]: value }));
  };

  const handleAdd = e => {
    e.preventDefault();
    if (form.usuario && form.password && form.rut && form.cargo) {
      setCuentas([...cuentas, { id: Date.now(), ...form, fecha: getFecha() }]);
      setForm({ usuario: '', password: '', rut: '', cargo: '' });
    }
  };

  const handleEdit = cuenta => {
    setEditId(cuenta.id);
    setEditForm({ usuario: cuenta.usuario, password: cuenta.password || '', rut: cuenta.rut, cargo: cuenta.cargo });
  };

  const handleEditSave = e => {
    e.preventDefault();
    setCuentas(cuentas.map(c => c.id === editId ? { ...c, ...editForm } : c));
    setEditId(null);
    setEditForm({ usuario: '', password: '', rut: '', cargo: '' });
  };

  const handleDelete = id => {
    setCuentas(cuentas.filter(c => c.id !== id));
  };

  return (
    <div className="container mt-5">
      <div className="bg-white rounded shadow p-4">
        <h2 className="mb-4 text-warning">Gestión de Cuentas</h2>
        <form className="row g-2 mb-3" onSubmit={handleAdd}>
          <div className="col-md-2">
            <input type="text" name="usuario" className="form-control" placeholder="Usuario" value={form.usuario} onChange={handleChange} />
          </div>
          <div className="col-md-2">
            <input type="password" name="password" className="form-control" placeholder="Contraseña" value={form.password} onChange={handleChange} />
          </div>
          <div className="col-md-3">
            <input type="text" name="rut" className="form-control" placeholder="RUT" value={form.rut} onChange={handleChange} />
          </div>
          <div className="col-md-3">
            <input type="text" name="cargo" className="form-control" placeholder="Cargo" value={form.cargo} onChange={handleChange} />
          </div>
          <div className="col-md-2">
            <button className="btn btn-primary w-100" type="submit">Crear Cuenta</button>
          </div>
        </form>
        <table className="table table-hover">
          <thead className="table-light">
            <tr>
              <th>Usuario</th>
              <th>RUT</th>
              <th>Cargo</th>
              <th>Fecha Creación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cuentas.map(c => (
              <tr key={c.id}>
                <td>{editId === c.id ? <input type="text" name="usuario" className="form-control" value={editForm.usuario} onChange={handleEditChange} /> : c.usuario}</td>
                <td>{editId === c.id ? <input type="text" name="rut" className="form-control" value={editForm.rut} onChange={handleEditChange} /> : c.rut}</td>
                <td>{editId === c.id ? <input type="text" name="cargo" className="form-control" value={editForm.cargo} onChange={handleEditChange} /> : c.cargo}</td>
                <td>{c.fecha}</td>
                <td>
                  {editId === c.id ? (
                    <button className="btn btn-success btn-sm me-2" onClick={handleEditSave}>Guardar</button>
                  ) : (
                    <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(c)}>Editar</button>
                  )}
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id)}>Borrar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
