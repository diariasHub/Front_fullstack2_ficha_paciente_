import { useState, useRef } from 'react';
import { getInsumos, descontarInsumos } from '../services/insumoService';

function validarRut(rut) {
  // Validación simple de RUT chileno
  return /^\d{7,8}-[\dkK]$/.test(rut);
}

export default function PacienteForm() {
  const [form, setForm] = useState({
    nombre: '', edad: '', rut: '', carrera: '', telefono: '', motivo: '', tratamiento: '',
    presion: '', fc: '', fr: '', temp: '', glicemia: '', dolor: '', glasgow: '', imagen: null
  });
  const [error, setError] = useState('');
  const [insumos, setInsumos] = useState(getInsumos());
  const [usados, setUsados] = useState([]);
  const [nuevoInsumo, setNuevoInsumo] = useState({ id: '', cantidad: '' });
  const [vitales, setVitales] = useState([]);
  const [nuevoVital, setNuevoVital] = useState({ presion: '', fc: '', fr: '', temp: '', glicemia: '', dolor: '', glasgow: '' });
  const modalRef = useRef();
  const [showModal, setShowModal] = useState(false);

  const handleChange = e => {
    const { name, value, files } = e.target;
    setForm(f => ({ ...f, [name]: files ? files[0] : value }));
  };

  const handleInsumoChange = (id, value) => {
    setUsados(usados => {
      const otros = usados.filter(i => i.id !== id);
      return value > 0 ? [...otros, { id, cantidad: Number(value) }] : otros;
    });
  };

  const handleAddInsumo = e => {
    e.preventDefault();
    if (nuevoInsumo.id && nuevoInsumo.cantidad > 0) {
      const ins = insumos.find(i => i.id === Number(nuevoInsumo.id));
      if (ins && nuevoInsumo.cantidad <= ins.cantidad) {
        setUsados([...usados, { id: ins.id, nombre: ins.nombre, cantidad: Number(nuevoInsumo.cantidad) }]);
        setNuevoInsumo({ id: '', cantidad: '' });
      }
    }
  };

  const handleRemoveInsumo = id => {
    setUsados(usados.filter(i => i.id !== id));
  };

  const handleClear = () => {
    setForm({ nombre: '', edad: '', rut: '', carrera: '', telefono: '', motivo: '', tratamiento: '', presion: '', fc: '', fr: '', temp: '', glicemia: '', dolor: '', glasgow: '', imagen: null });
    setUsados([]);
    setNuevoInsumo({ id: '', cantidad: '' });
    setVitales([]);
    setNuevoVital({ presion: '', fc: '', fr: '', temp: '', glicemia: '', dolor: '', glasgow: '' });
    setError('');
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const fecha = now.toLocaleDateString('es-CL');
    const hora = now.toLocaleTimeString('es-CL');
    return { fecha, hora };
  };

  const getUsuario = () => {
    return typeof window !== 'undefined' ? localStorage.getItem('usuario') || 'admin' : 'admin';
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (form.rut && !validarRut(form.rut)) {
      setError('RUT inválido');
      return;
    }
    if (form.edad && (isNaN(form.edad) || form.edad < 0)) {
      setError('Edad inválida');
      return;
    }
    if (form.telefono && !/^\d{8,12}$/.test(form.telefono)) {
      setError('Teléfono inválido');
      return;
    }
    descontarInsumos(usados.map(u => ({ id: u.id, cantidad: u.cantidad })));
    setInsumos(getInsumos());
    setError('');
    const { fecha, hora } = getCurrentDateTime();
    const usuario = getUsuario();
    // guardarConsulta({ ...form, insumos: usados, vitales, fecha, hora, usuario });
    setShowModal(true);
    // ...guardar datos...
  };

  const handleCloseModal = () => {
    setShowModal(false);
    handleClear();
  };

  const handleVitalChange = e => {
    const { name, value } = e.target;
    setNuevoVital(v => ({ ...v, [name]: value }));
  };

  const handleAddVital = e => {
    e.preventDefault();
    if (nuevoVital.presion || nuevoVital.fc || nuevoVital.fr || nuevoVital.temp || nuevoVital.glicemia || nuevoVital.dolor || nuevoVital.glasgow) {
      setVitales([...vitales, nuevoVital]);
      setNuevoVital({ presion: '', fc: '', fr: '', temp: '', glicemia: '', dolor: '', glasgow: '' });
    }
  };

  return (
    <div className="container mt-5">
      <div className="bg-white rounded shadow p-4">
        <h2 className="mb-4 text-success">Nuevo Paciente</h2>
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-6">
            <input name="nombre" type="text" className="form-control" placeholder="Nombre" value={form.nombre} onChange={handleChange} />
            <small className="text-muted">Ejemplo: Juan Pérez</small>
          </div>
          <div className="col-md-3">
            <input name="edad" type="number" className="form-control" placeholder="Edad" value={form.edad} onChange={handleChange} />
            <small className="text-muted">Ejemplo: 25</small>
          </div>
          <div className="col-md-3">
            <input name="rut" type="text" className="form-control" placeholder="RUT" value={form.rut} onChange={handleChange} />
            <small className="text-muted">Ejemplo: 17560742-0</small>
          </div>
          <div className="col-md-6">
            <input name="carrera" type="text" className="form-control" placeholder="Carrera" value={form.carrera} onChange={handleChange} />
            <small className="text-muted">Ejemplo: Medicina</small>
          </div>
          <div className="col-md-6">
            <input name="telefono" type="text" className="form-control" placeholder="Teléfono" value={form.telefono} onChange={handleChange} />
            <small className="text-muted">Ejemplo: 912345678</small>
          </div>
          <div className="col-md-12">
            <input name="motivo" type="text" className="form-control" placeholder="Motivo Consulta" value={form.motivo} onChange={handleChange} />
            <small className="text-muted">Ejemplo: Dolor de cabeza</small>
          </div>
          <div className="col-md-12">
            <input name="tratamiento" type="text" className="form-control" placeholder="Tratamiento" value={form.tratamiento} onChange={handleChange} />
            <small className="text-muted">Ejemplo: Paracetamol 500mg</small>
          </div>
          <h5 className="mt-4 text-primary">Signos Vitales</h5>
          <div className="row g-2 mb-2">
            <div className="col-md-2">
              <input name="presion" type="text" className="form-control" placeholder="Presión Arterial" value={nuevoVital.presion} onChange={handleVitalChange} />
              <small className="text-muted">Ejemplo: 120/80 mmHg</small>
            </div>
            <div className="col-md-2">
              <input name="fc" type="text" className="form-control" placeholder="Frecuencia Cardiaca" value={nuevoVital.fc} onChange={handleVitalChange} />
              <small className="text-muted">Ejemplo: 72 lpm</small>
            </div>
            <div className="col-md-2">
              <input name="fr" type="text" className="form-control" placeholder="Frecuencia Respiratoria" value={nuevoVital.fr} onChange={handleVitalChange} />
              <small className="text-muted">Ejemplo: 16 rpm</small>
            </div>
            <div className="col-md-2">
              <input name="temp" type="text" className="form-control" placeholder="Temperatura" value={nuevoVital.temp} onChange={handleVitalChange} />
              <small className="text-muted">Ejemplo: 36.5 °C</small>
            </div>
            <div className="col-md-1">
              <input name="glicemia" type="text" className="form-control" placeholder="Glicemia" value={nuevoVital.glicemia} onChange={handleVitalChange} />
              <small className="text-muted">Ejemplo: 90 mg/dL</small>
            </div>
            <div className="col-md-1">
              <input name="dolor" type="text" className="form-control" placeholder="Dolor EVA" value={nuevoVital.dolor} onChange={handleVitalChange} />
              <small className="text-muted">Ejemplo: 5/10</small>
            </div>
            <div className="col-md-2">
              <input name="glasgow" type="text" className="form-control" placeholder="Coma Glasgow" value={nuevoVital.glasgow} onChange={handleVitalChange} />
              <small className="text-muted">Ejemplo: 15</small>
            </div>
            <div className="col-md-12 mt-2">
              <button className="btn btn-info" type="button" onClick={handleAddVital}>Agregar toma de signos vitales</button>
            </div>
          </div>
          <div className="col-md-12">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Presión</th>
                  <th>FC</th>
                  <th>FR</th>
                  <th>Temp</th>
                  <th>Glicemia</th>
                  <th>Dolor EVA</th>
                  <th>Glasgow</th>
                </tr>
              </thead>
              <tbody>
                {vitales.map((v, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{v.presion}</td>
                    <td>{v.fc}</td>
                    <td>{v.fr}</td>
                    <td>{v.temp}</td>
                    <td>{v.glicemia}</td>
                    <td>{v.dolor}</td>
                    <td>{v.glasgow}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="col-md-12 mb-2 d-flex align-items-end gap-2">
            <div className="col-md-6">
              <select className="form-select" value={nuevoInsumo.id} onChange={e => setNuevoInsumo({ ...nuevoInsumo, id: e.target.value })}>
                <option value="">Selecciona insumo...</option>
                {insumos.map(ins => (
                  <option key={ins.id} value={ins.id}>{ins.nombre} (Stock: {ins.cantidad})</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <input type="number" className="form-control" placeholder="Cantidad" value={nuevoInsumo.cantidad} onChange={e => setNuevoInsumo({ ...nuevoInsumo, cantidad: e.target.value })} />
            </div>
            <div className="col-md-2">
              <button className="btn btn-primary w-100" type="button" onClick={handleAddInsumo}>Agregar insumo</button>
            </div>
          </div>
          <div className="col-md-12">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Insumo</th>
                  <th>Cantidad</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {usados.map(u => (
                  <tr key={u.id}>
                    <td>{u.nombre}</td>
                    <td>{u.cantidad}</td>
                    <td><button type="button" className="btn btn-danger btn-sm" onClick={() => handleRemoveInsumo(u.id)}>Quitar</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="col-md-12 d-flex gap-2">
            <button className="btn btn-success w-100 mt-3" type="submit">Guardar Consulta</button>
            <button className="btn btn-secondary w-100 mt-3" type="button" onClick={handleClear}>Limpiar</button>
          </div>
          {error && <div className="alert alert-danger mt-2">{error}</div>}
        </form>
        {showModal && (
          <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Consulta guardada</h5>
                </div>
                <div className="modal-body">
                  <p>La consulta se ha guardado satisfactoriamente.</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-primary" onClick={handleCloseModal}>Aceptar</button>
                </div>
              </div>
            </div>
            <div className="modal-backdrop fade show"></div>
          </div>
        )}
      </div>
    </div>
  );
}