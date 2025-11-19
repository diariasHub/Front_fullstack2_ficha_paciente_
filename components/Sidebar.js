import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Sidebar() {
  const router = useRouter();
  
  const isActive = (path) => router.pathname === path;
  
  const linkStyle = (path) => ({
    transition: 'all 0.3s ease',
    borderRadius: '12px',
    padding: '12px 8px',
    backgroundColor: isActive(path) ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
    transform: isActive(path) ? 'scale(1.05)' : 'scale(1)',
  });

  return (
    <div
      className="d-flex flex-column p-3 position-sticky"
      style={{
        background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
        minWidth: 90,
        top: 0,
        height: '100%',
        boxShadow: '4px 0 15px rgba(102, 126, 234, 0.3)'
      }}
    >
      <Link 
        href="/dashboard" 
        className="mb-4 text-white text-decoration-none text-center"
        style={linkStyle('/dashboard')}
      >
        <i className="bi bi-house-door-fill fs-2"></i>
        <div className="small mt-1">Dashboard</div>
      </Link>
      <Link 
        href="/pacientes" 
        className="mb-4 text-white text-decoration-none text-center"
        style={linkStyle('/pacientes')}
      >
        <i className="bi bi-person-plus-fill fs-2"></i>
        <div className="small mt-1">Paciente</div>
      </Link>
      <Link 
        href="/consultas" 
        className="mb-4 text-white text-decoration-none text-center"
        style={linkStyle('/consultas')}
      >
        <i className="bi bi-journal-medical fs-2"></i>
        <div className="small mt-1">Consultas</div>
      </Link>
      <Link 
        href="/stock" 
        className="mb-4 text-white text-decoration-none text-center"
        style={linkStyle('/stock')}
      >
        <i className="bi bi-box-seam fs-2"></i>
        <div className="small mt-1">Stock</div>
      </Link>
      <Link 
        href="/graficos" 
        className="mb-4 text-white text-decoration-none text-center"
        style={linkStyle('/graficos')}
      >
        <i className="bi bi-bar-chart-fill fs-2"></i>
        <div className="small mt-1">Gráficos</div>
      </Link>
      <Link 
        href="/cuentas" 
        className="mb-4 text-white text-decoration-none text-center"
        style={linkStyle('/cuentas')}
      >
        <i className="bi bi-shield-lock-fill fs-2"></i>
        <div className="small mt-1">Cuentas</div>
      </Link>
      
      <div className="mt-auto">
        <Link 
          href="/login" 
          className="text-white text-decoration-none text-center d-block"
          style={{
            transition: 'all 0.3s ease',
            borderRadius: '12px',
            padding: '12px 8px',
            backgroundColor: 'rgba(220, 38, 38, 0.2)',
          }}
        >
          <i className="bi bi-box-arrow-right fs-2"></i>
          <div className="small mt-1">Salir</div>
        </Link>
      </div>
    </div>
  );
}
