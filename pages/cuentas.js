import { useState, useEffect } from 'react';
import { fetchCuentas, crearCuenta, actualizarCuenta, eliminarCuenta } from '../services/cuentaService';

function getFecha() {
  const now = new Date();
  return now.toLocaleDateString('es-CL') + ' ' + now.toLocaleTimeString('es-CL');
}

export default function CuentasPage() {
  const [cuentas, setCuentas] = useState([]);
  const [form, setForm] = useState({ usuario: '', email: '', password: '', rut: '', cargo: '' });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ usuario: '', rut: '', cargo: '' });
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetchCuentas().then(setCuentas).catch(console.error);
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleEditChange = e => {
    const { name, value } = e.target;
    setEditForm(f => ({ ...f, [name]: value }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (form.usuario && form.email && form.password && form.rut && form.cargo) {
      setLoading(true);
      try {
        await crearCuenta(form);
        const updated = await fetchCuentas();
        setCuentas(updated);
        setForm({ usuario: '', email: '', password: '', rut: '', cargo: '' });
        alert('Cuenta creada exitosamente');
      } catch (error) {
        console.error('Error al crear cuenta:', error);
        alert(error.message || 'Error al crear la cuenta');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = cuenta => {
    setEditId(cuenta.id);
    setEditForm({ usuario: cuenta.usuario, rut: cuenta.rut, cargo: cuenta.cargo });
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await actualizarCuenta(editId, editForm);
      const updated = await fetchCuentas();
      setCuentas(updated);
      setEditId(null);
      setEditForm({ usuario: '', rut: '', cargo: '' });
      alert('Cuenta actualizada exitosamente');
    } catch (error) {
      console.error('Error al actualizar cuenta:', error);
      alert('Error al actualizar la cuenta');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta cuenta?')) return;
    
    setLoading(true);
    try {
      await eliminarCuenta(id);
      const updated = await fetchCuentas();
      setCuentas(updated);
      alert('Cuenta eliminada exitosamente');
    } catch (error) {
      console.error('Error al eliminar cuenta:', error);
      alert('Error al eliminar la cuenta');
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) {
    return (
      <div className="container mt-5">
        <div className="bg-white rounded shadow p-4">
          <h2 className="mb-4 text-warning">Gestión de Cuentas</h2>
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="bg-white rounded shadow p-4">
        <h2 className="mb-4 text-warning">
          <i className="bi bi-people-fill me-2"></i>
          Gestión de Cuentas
        </h2>
        <form className="row g-2 mb-3" onSubmit={handleAdd}>
          <div className="col-md-2">
            <input type="text" name="usuario" className="form-control" placeholder="Usuario" value={form.usuario} onChange={handleChange} required />
          </div>
          <div className="col-md-3">
            <input type="email" name="email" className="form-control" placeholder="Email (para login)" value={form.email} onChange={handleChange} required />
          </div>
          <div className="col-md-2">
            <input type="password" name="password" className="form-control" placeholder="Contraseña (min 6)" value={form.password} onChange={handleChange} required minLength="6" />
          </div>
          <div className="col-md-2">
            <input type="text" name="rut" className="form-control" placeholder="RUT" value={form.rut} onChange={handleChange} required />
          </div>
          <div className="col-md-2">
            <input type="text" name="cargo" className="form-control" placeholder="Cargo" value={form.cargo} onChange={handleChange} required />
          </div>
          <div className="col-md-1">
            <button className="btn btn-primary w-100" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-1"></span>
                  Guardando...
                </>
              ) : (
                <>
                  <i className="bi bi-person-plus-fill me-1"></i>
                  Crear Cuenta
                </>
              )}
            </button>
          </div>
        </form>
        <table className="table table-hover">
          <thead className="table-light">
            <tr>
              <th>Usuario</th>
              <th>Email</th>
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
                <td>{c.email || '-'}</td>
                <td>{editId === c.id ? <input type="text" name="rut" className="form-control" value={editForm.rut} onChange={handleEditChange} /> : c.rut}</td>
                <td>{editId === c.id ? <input type="text" name="cargo" className="form-control" value={editForm.cargo} onChange={handleEditChange} /> : c.cargo}</td>
                <td>{c.fecha}</td>
                <td>
                  {editId === c.id ? (
                    <button className="btn btn-success btn-sm me-2" onClick={handleEditSave} disabled={loading}>
                      <i className="bi bi-check-lg me-1"></i>
                      Guardar
                    </button>
                  ) : (
                    <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(c)} disabled={loading}>
                      <i className="bi bi-pencil-fill me-1"></i>
                      Editar
                    </button>
                  )}
                  <button 
                    className="btn btn-danger btn-sm" 
                    onClick={() => handleDelete(c.id)} 
                    disabled={loading || c.usuario === 'admin'}
                    title={c.usuario === 'admin' ? 'No se puede eliminar el administrador' : 'Eliminar cuenta'}
                  >
                    <i className="bi bi-trash-fill me-1"></i>
                    Borrar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
