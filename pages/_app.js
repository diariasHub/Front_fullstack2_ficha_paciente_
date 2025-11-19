import { useEffect } from 'react';
import { useRouter } from 'next/router';
import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import FloatingPharmacyButton from '../components/FloatingPharmacyButton';

const protectedRoutes = ['/dashboard', '/pacientes', '/consultas', '/stock', '/graficos'];
const noNavbarRoutes = ['/login'];
const sidebarRoutes = ['/dashboard', '/pacientes', '/consultas', '/stock', '/graficos', '/cuentas'];

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Load Bootstrap's JS only on the client
    import('bootstrap/dist/js/bootstrap.bundle.min.js');

    if (protectedRoutes.includes(router.pathname)) {
      if (typeof window !== 'undefined' && !localStorage.getItem('isAuth')) {
        router.replace('/login');
      }
    }
  }, [router.pathname]);

  return (
    <>
      {!noNavbarRoutes.includes(router.pathname) && <Navbar />}
      {sidebarRoutes.includes(router.pathname) ? (
        <div
          className="d-flex"
          style={{ height: noNavbarRoutes.includes(router.pathname) ? '100vh' : 'calc(100vh - 56px)' }}
        >
          <Sidebar />
          <div className="flex-grow-1 overflow-auto" style={{ height: '100%' }}>
            <Component {...pageProps} />
          </div>
        </div>
      ) : (
        <Component {...pageProps} />
      )}
      
      {/* Botón flotante de farmacias - visible en todas las vistas */}
      <FloatingPharmacyButton />
    </>
  );
}

export default MyApp;