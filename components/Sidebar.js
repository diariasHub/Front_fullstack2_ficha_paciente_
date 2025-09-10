import Link from 'next/link';

export default function Sidebar() {
  return (
    <div className="d-flex flex-column vh-100 p-3" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)', minWidth: 80 }}>
      <Link href="/dashboard" className="mb-4 text-white text-decoration-none text-center">
        <i className="bi bi-house-door-fill fs-2"></i>
        <div className="small">Dashboard</div>
      </Link>
      <Link href="/pacientes" className="mb-4 text-white text-decoration-none text-center">
        <i className="bi bi-person-plus-fill fs-2"></i>
        <div className="small">Paciente</div>
      </Link>
      <Link href="/consultas" className="mb-4 text-white text-decoration-none text-center">
        <i className="bi bi-journal-medical fs-2"></i>
        <div className="small">Consultas</div>
      </Link>
      <Link href="/stock" className="mb-4 text-white text-decoration-none text-center">
        <i className="bi bi-box-seam fs-2"></i>
        <div className="small">Stock</div>
      </Link>
      <Link href="/graficos" className="mb-4 text-white text-decoration-none text-center">
        <i className="bi bi-bar-chart-fill fs-2"></i>
        <div className="small">Gráficos</div>
      </Link>
      <Link href="/cuentas" className="mb-4 text-white text-decoration-none text-center">
        <i className="bi bi-person-fill fs-2"></i>
        <div className="small">Cuentas</div>
      </Link>
      <Link href="/login" className="mb-4 text-white text-decoration-none text-center">
        <i className="bi bi-box-arrow-right fs-2"></i>
        <div className="small">Salir</div>
      </Link>
    </div>
  );
}
