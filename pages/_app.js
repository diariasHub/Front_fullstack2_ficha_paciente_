import { useEffect } from 'react';
import { useRouter } from 'next/router';
import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const protectedRoutes = ['/dashboard', '/pacientes', '/consultas', '/stock', '/graficos'];
const noNavbarRoutes = ['/login'];
const sidebarRoutes = ['/dashboard', '/pacientes', '/consultas', '/stock', '/graficos', '/cuentas'];

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
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
        <div className="d-flex">
          <Sidebar />
          <div className="flex-grow-1">
            <Component {...pageProps} />
          </div>
        </div>
      ) : (
        <Component {...pageProps} />
      )}
    </>
  );
}

export default MyApp;