import { useEffect, useMemo, useState } from 'react';
import { listarConsultas, fetchConsultas } from '../services/consultaService';

export default function ConsultasPage() {
  const [f, setF] = useState({ rut: '', fecha: '', carrera: '', motivo: '' });
  const [all, setAll] = useState(listarConsultas());
  useEffect(() => {
    fetchConsultas().then(setAll).catch(() => {});
  }, []);
  const list = useMemo(() => {
    return all.filter(c => (
      (!f.rut || (c.rut || '').toLowerCase().includes(f.rut.toLowerCase())) &&
      (!f.fecha || (c.fecha || '').includes(f.fecha)) &&
      (!f.carrera || (c.carrera || '').toLowerCase().includes(f.carrera.toLowerCase())) &&
      (!f.motivo || (c.motivo || '').toLowerCase().includes(f.motivo.toLowerCase()))
    ));
  }, [all, f]);

  const handleChange = e => {
    const { name, value } = e.target;
    setF(prev => ({ ...prev, [name]: value }));
  };

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
        </form>
        <table className="table table-hover">
          <thead className="table-light">
            <tr>
              <th>Nombre</th>
              <th>RUT</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Carrera</th>
              <th>Motivo</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 && (
              <tr><td colSpan={6} className="text-center text-muted">Sin resultados</td></tr>
            )}
            {list.map(c => (
              <tr key={c.id}>
                <td>{c.nombre}</td>
                <td>{c.rut}</td>
                <td>{c.fecha}</td>
                <td>{c.hora}</td>
                <td>{c.carrera}</td>
                <td>{c.motivo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}