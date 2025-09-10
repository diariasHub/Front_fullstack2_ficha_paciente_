import Link from 'next/link';
import PacienteForm from './pacientes';

export default function Dashboard() {
  return (
    <div className="container mt-5">
      <div className="bg-white rounded shadow p-4">
        <h2 className="mb-4 text-primary">Dashboard</h2>
        <div className="row g-3">
          <div className="col-md-3">
            <a href="/pacientes" className="btn btn-outline-primary w-100 py-3 fw-bold">Nuevo Paciente</a>
          </div>
          <div className="col-md-3">
            <a href="/consultas" className="btn btn-outline-success w-100 py-3 fw-bold">Consultas</a>
          </div>
          <div className="col-md-3">
            <a href="/stock" className="btn btn-outline-warning w-100 py-3 fw-bold">Stock Insumos</a>
          </div>
          <div className="col-md-3">
            <a href="/graficos" className="btn btn-outline-info w-100 py-3 fw-bold">Gráficos</a>
          </div>
        </div>
        <p className="mt-4 text-secondary">Bienvenido, admin.</p>
        <PacienteForm />
      </div>
    </div>
  );
}