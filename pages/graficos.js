import { useState } from 'react';

// Simulación de datos
const consultas = [
  { nombre: 'Juan Pérez', carrera: 'Medicina', seguro: true },
  { nombre: 'Ana Soto', carrera: 'Enfermería', seguro: false },
  { nombre: 'Luis Díaz', carrera: 'Ingeniería', seguro: true },
  { nombre: 'María Ruiz', carrera: 'Medicina', seguro: false },
];

export default function GraficosPage() {
  const [filtro, setFiltro] = useState('');

  // Indicadores
  const totalPacientes = consultas.length;
  const totalSeguros = consultas.filter(c => c.seguro).length;
  const carreras = [...new Set(consultas.map(c => c.carrera))];

  return (
    <div className="container mt-5">
      <div className="bg-white rounded shadow p-4">
        <h2 className="mb-4 text-primary">Gráficos y Estadísticas</h2>
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card text-center border-primary mb-3">
              <div className="card-body">
                <h5 className="card-title">Pacientes atendidos</h5>
                <p className="display-6 text-primary fw-bold">{totalPacientes}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center border-success mb-3">
              <div className="card-body">
                <h5 className="card-title">Seguros escolares atendidos</h5>
                <p className="display-6 text-success fw-bold">{totalSeguros}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center border-info mb-3">
              <div className="card-body">
                <h5 className="card-title">Carreras atendidas</h5>
                <p className="display-6 text-info fw-bold">{carreras.length}</p>
                <small className="text-muted">{carreras.join(', ')}</small>
              </div>
            </div>
          </div>
        </div>
        <select className="form-select mb-3" value={filtro} onChange={e => setFiltro(e.target.value)}>
          <option value="">Filtrar por...</option>
          <option value="rut">RUT</option>
          <option value="fecha">Fecha</option>
          <option value="carrera">Carrera</option>
          <option value="motivo">Motivo Consulta</option>
        </select>
        {/* Aquí se mostrarán los gráficos filtrados */}
        <div className="border p-4 text-center bg-light rounded">Gráfico de ejemplo</div>
      </div>
    </div>
  );
}