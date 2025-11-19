import { useEffect, useMemo, useState } from 'react';
import { listarConsultas, fetchConsultas, eliminarConsulta, actualizarConsulta } from '../services/consultaService';

export default function ConsultasPage() {
  const [f, setF] = useState({ rut: '', fecha: '', carrera: '', motivo: '' });
  const [all, setAll] = useState([]);
  const [filtroDiae, setFiltroDiae] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [consultaSeleccionada, setConsultaSeleccionada] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetchConsultas().then(setAll).catch(() => {});
  }, []);
  const list = useMemo(() => {
    return all.filter(c => (
      (!f.rut || (c.rut || '').toLowerCase().includes(f.rut.toLowerCase())) &&
      (!f.fecha || (c.fecha || '').includes(f.fecha)) &&
      (!f.carrera || (c.carrera || '').toLowerCase().includes(f.carrera.toLowerCase())) &&
      (!f.motivo || (c.motivo || '').toLowerCase().includes(f.motivo.toLowerCase())) &&
      (!filtroDiae || c.aplicaDiae === true)
    ));
  }, [all, f, filtroDiae]);

  const handleChange = e => {
    const { name, value } = e.target;
    setF(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (consulta) => {
    setConsultaSeleccionada(consulta);
    setEditForm({
      nombre: consulta.nombre || '',
      edad: consulta.edad || '',
      rut: consulta.rut || '',
      carrera: consulta.carrera || '',
      telefono: consulta.telefono || '',
      motivo: consulta.motivo || '',
      tratamiento: consulta.tratamiento || ''
    });
    setShowEditModal(true);
  };

  const handleDelete = (consulta) => {
    setConsultaSeleccionada(consulta);
    setShowDeleteModal(true);
  };

  const handleEditChange = e => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const confirmEdit = async () => {
    setLoading(true);
    try {
      await actualizarConsulta(consultaSeleccionada.id, editForm);
      const updated = await fetchConsultas();
      setAll(updated);
      setShowEditModal(false);
      setConsultaSeleccionada(null);
    } catch (error) {
      console.error('Error al actualizar consulta:', error);
      alert('Error al actualizar la consulta');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      await eliminarConsulta(consultaSeleccionada.id);
      const updated = await fetchConsultas();
      setAll(updated);
      setShowDeleteModal(false);
      setConsultaSeleccionada(null);
    } catch (error) {
      console.error('Error al eliminar consulta:', error);
      alert('Error al eliminar la consulta');
    } finally {
      setLoading(false);
    }
  };

  const cancelModal = () => {
    setShowDeleteModal(false);
    setShowEditModal(false);
    setConsultaSeleccionada(null);
  };

  // No renderizar la tabla hasta que esté montado en el cliente
  if (!isMounted) {
    return (
      <div className="container mt-5">
        <div className="bg-white rounded shadow p-4">
          <h2 className="mb-4 text-info">Consultas Realizadas</h2>
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
        <h2 className="mb-4 text-info">Consultas Realizadas</h2>
        <form className="row g-3 mb-3" onSubmit={e => e.preventDefault()}>
          <div className="col-md-3">
            <input name="rut" type="text" className="form-control" placeholder="RUT" value={f.rut} onChange={handleChange} />
          </div>
          <div className="col-md-3">
            <input name="fecha" type="text" className="form-control" placeholder="Fecha (ej: 30-09-2025)" value={f.fecha} onChange={handleChange} />
          </div>
          <div className="col-md-3">
            <input name="carrera" type="text" className="form-control" placeholder="Carrera" value={f.carrera} onChange={handleChange} />
          </div>
          <div className="col-md-3">
            <input name="motivo" type="text" className="form-control" placeholder="Motivo Consulta" value={f.motivo} onChange={handleChange} />
          </div>
          <div className="col-md-12">
            <div className="form-check">
              <input 
                className="form-check-input" 
                type="checkbox" 
                id="filtroDiae" 
                checked={filtroDiae}
                onChange={(e) => setFiltroDiae(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="filtroDiae">
                <i className="bi bi-shield-fill-check me-1"></i>
                Mostrar solo consultas con DIAE
              </label>
            </div>
          </div>
        </form>
        
        {/* Botón de descarga para DIAE */}
        {filtroDiae && list.length > 0 && (
          <div className="mb-3 d-flex gap-2">
            <button 
              className="btn btn-success"
              onClick={() => {
                const csvContent = "data:text/csv;charset=utf-8," 
                  + "Nombre,RUT,Edad,Carrera,Teléfono,Fecha,Hora,Motivo,Tratamiento\n"
                  + list.map(c => 
                      `"${c.nombre}","${c.rut}","${c.edad}","${c.carrera}","${c.telefono}","${c.fecha}","${c.hora}","${c.motivo}","${c.tratamiento}"`
                    ).join("\n");
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", `consultas_diae_${new Date().toISOString().split('T')[0]}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              <i className="bi bi-download me-2"></i>
              Descargar CSV ({list.length} registros)
            </button>
            <button 
              className="btn btn-outline-primary"
              onClick={() => window.print()}
            >
              <i className="bi bi-printer me-2"></i>
              Imprimir
            </button>
          </div>
        )}

        <table className="table table-hover">
          <thead className="table-light">
            <tr>
              <th>Nombre</th>
              <th>RUT</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Carrera</th>
              <th>Motivo</th>
              <th className="text-center">DIAE</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 && (
              <tr><td colSpan={8} className="text-center text-muted">Sin resultados</td></tr>
            )}
            {list.map(c => (
              <tr key={c.id}>
                <td>{c.nombre}</td>
                <td>{c.rut}</td>
                <td>{c.fecha}</td>
                <td>{c.hora}</td>
                <td>{c.carrera}</td>
                <td>{c.motivo}</td>
                <td className="text-center">
                  {c.aplicaDiae ? (
                    <span className="badge bg-success" title={c.imagenDiae ? 'Con imagen' : 'Sin imagen'}>
                      <i className="bi bi-shield-fill-check"></i>
                      {c.imagenDiae && <i className="bi bi-image-fill ms-1"></i>}
                    </span>
                  ) : (
                    <span className="badge bg-secondary">-</span>
                  )}
                </td>
                <td className="text-center">
                  <button 
                    className="btn btn-sm btn-warning me-2" 
                    onClick={() => handleEdit(c)}
                    title="Editar consulta"
                  >
                    <i className="bi bi-pencil-square"></i>
                  </button>
                  <button 
                    className="btn btn-sm btn-danger" 
                    onClick={() => handleDelete(c)}
                    title="Eliminar consulta"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal de Edición */}
        {showEditModal && (
          <div 
            className="modal fade show" 
            style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }} 
            tabIndex="-1"
            onClick={cancelModal}
          >
            <div className="modal-dialog modal-lg modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content">
                <div className="modal-header bg-warning text-white">
                  <h5 className="modal-title">
                    <i className="bi bi-pencil-square me-2"></i>
                    Editar Consulta
                  </h5>
                  <button type="button" className="btn-close" onClick={cancelModal} aria-label="Cerrar" style={{ filter: 'invert(1)' }}>
                    <i className="bi bi-x-lg" style={{ color: 'white', fontSize: '20px' }}></i>
                  </button>
                </div>
                <div className="modal-body">
                  <form className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Nombre</label>
                      <input 
                        name="nombre" 
                        type="text" 
                        className="form-control" 
                        value={editForm.nombre} 
                        onChange={handleEditChange} 
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Edad</label>
                      <input 
                        name="edad" 
                        type="number" 
                        className="form-control" 
                        value={editForm.edad} 
                        onChange={handleEditChange} 
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">RUT</label>
                      <input 
                        name="rut" 
                        type="text" 
                        className="form-control" 
                        value={editForm.rut} 
                        onChange={handleEditChange} 
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Carrera</label>
                      <input 
                        name="carrera" 
                        type="text" 
                        className="form-control" 
                        value={editForm.carrera} 
                        onChange={handleEditChange} 
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Teléfono</label>
                      <input 
                        name="telefono" 
                        type="text" 
                        className="form-control" 
                        value={editForm.telefono} 
                        onChange={handleEditChange} 
                      />
                    </div>
                    <div className="col-md-12">
                      <label className="form-label">Motivo Consulta</label>
                      <input 
                        name="motivo" 
                        type="text" 
                        className="form-control" 
                        value={editForm.motivo} 
                        onChange={handleEditChange} 
                      />
                    </div>
                    <div className="col-md-12">
                      <label className="form-label">Tratamiento</label>
                      <textarea 
                        name="tratamiento" 
                        className="form-control" 
                        rows="3"
                        value={editForm.tratamiento} 
                        onChange={handleEditChange} 
                      />
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={cancelModal}>
                    Cancelar
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-warning" 
                    onClick={confirmEdit}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Guardar Cambios
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Confirmación de Eliminación */}
        {showDeleteModal && (
          <div 
            className="modal fade show" 
            style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }} 
            tabIndex="-1"
            onClick={cancelModal}
          >
            <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content">
                <div className="modal-header bg-danger text-white">
                  <h5 className="modal-title">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Confirmar Eliminación
                  </h5>
                  <button type="button" className="btn-close" onClick={cancelModal} aria-label="Cerrar" style={{ filter: 'invert(1)' }}>
                    <i className="bi bi-x-lg" style={{ color: 'white', fontSize: '20px' }}></i>
                  </button>
                </div>
                <div className="modal-body">
                  <p className="mb-3">¿Estás seguro de que deseas eliminar esta consulta?</p>
                  {consultaSeleccionada && (
                    <div className="alert alert-light">
                      <strong>Paciente:</strong> {consultaSeleccionada.nombre}<br/>
                      <strong>RUT:</strong> {consultaSeleccionada.rut}<br/>
                      <strong>Fecha:</strong> {consultaSeleccionada.fecha}<br/>
                      <strong>Motivo:</strong> {consultaSeleccionada.motivo}
                    </div>
                  )}
                  <p className="text-danger mb-0">
                    <i className="bi bi-exclamation-circle me-2"></i>
                    Esta acción no se puede deshacer.
                  </p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={cancelModal}>
                    Cancelar
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-danger" 
                    onClick={confirmDelete}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Eliminando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-trash me-2"></i>
                        Eliminar
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}