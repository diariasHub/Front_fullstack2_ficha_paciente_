import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Navbar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  useEffect(() => {
    function checkAdmin() {
      setIsAdmin(localStorage.getItem('usuario') === 'admin');
    }
    checkAdmin();
    window.addEventListener('storage', checkAdmin);
    return () => window.removeEventListener('storage', checkAdmin);
  }, []);
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isAuth');
      // keep usuario? remove it as well to avoid stale admin flag
      localStorage.removeItem('usuario');
    }
    router.push('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)' }}>
      <div className="container-fluid">
        <Link href="/dashboard" className="navbar-brand fw-bold">
          <i className="bi bi-heart-pulse-fill me-2"></i>
          Fichas Atención
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav ms-auto d-flex align-items-center gap-2">
            <li className="nav-item">
              <Link href="/pacientes" className="btn btn-outline-light">
                <i className="bi bi-person-plus me-1"></i>
                Nuevo Paciente
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/consultas" className="btn btn-outline-light">
                <i className="bi bi-journal-medical me-1"></i>
                Consultas
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/stock" className="btn btn-outline-light">
                <i className="bi bi-box-seam me-1"></i>
                Stock Insumos
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/graficos" className="btn btn-outline-light">
                <i className="bi bi-bar-chart-line me-1"></i>
                Gráficos
              </Link>
            </li>
            {isAdmin && (
              <li className="nav-item">
                <Link href="/cuentas" className="btn btn-outline-warning">
                  <i className="bi bi-shield-lock me-1"></i>
                  Cuentas
                </Link>
              </li>
            )}
            <li className="nav-item">
              <button onClick={handleLogout} className="btn btn-danger">
                <i className="bi bi-box-arrow-right me-1"></i>
                Salir
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
