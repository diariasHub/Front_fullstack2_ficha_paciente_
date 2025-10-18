import Link from 'next/link';
import PacienteForm from './pacientes';

export default function Dashboard() {
  return (
    <div className="container mt-5">
      <div className="bg-white rounded shadow p-4">
        <h2 className="mb-4 text-primary">Dashboard</h2>
        
        <p className="mt-4 text-secondary">Bienvenido, admin.</p>
        <PacienteForm />
      </div>
    </div>
  );
}