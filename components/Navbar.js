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
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)' }}>
      <div className="container-fluid">
        <Link href="/dashboard" className="navbar-brand">Fichas Atencion</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav ms-auto d-flex align-items-center gap-2">
            <li className="nav-item"><Link href="/pacientes" className="btn btn-outline-light">Nuevo Paciente</Link></li>
            <li className="nav-item"><Link href="/consultas" className="btn btn-outline-light">Consultas</Link></li>
            <li className="nav-item"><Link href="/stock" className="btn btn-outline-light">Stock Insumos</Link></li>
            <li className="nav-item"><Link href="/graficos" className="btn btn-outline-light">Gráficos</Link></li>
            {isAdmin && <li className="nav-item"><Link href="/cuentas" className="btn btn-outline-warning">Cuentas</Link></li>}
            <li className="nav-item"><button onClick={handleLogout} className="btn btn-danger">Salir</button></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
