import { useState } from 'react';
import { useRouter } from 'next/router';
import { validarCredenciales } from '../services/cuentaService';

export default function LoginPage() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const cuenta = await validarCredenciales(user, pass);
      if (cuenta) {
        localStorage.setItem('isAuth', 'true');
        localStorage.setItem('usuario', user);
        localStorage.setItem('cargo', cuenta.cargo);
        router.push('/dashboard');
      } else {
        setError('Usuario o contraseña incorrectos');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError('Error al validar credenciales. Verifica tu conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)' }}>
      <div className="card shadow-lg p-4" style={{ minWidth: 350 }}>
        <h2 className="mb-3 text-center text-primary">Bienvenido</h2>
        <p className="text-center text-secondary">Por favor, inicia sesión para continuar</p>
        <form onSubmit={handleLogin}>
          <input type="text" className="form-control mb-2" placeholder="Usuario" value={user} onChange={e => setUser(e.target.value)} required disabled={loading} />
          <div className="position-relative mb-2">
            <input 
              type={showPassword ? "text" : "password"} 
              className="form-control" 
              placeholder="Contraseña" 
              value={pass} 
              onChange={e => setPass(e.target.value)} 
              required 
              disabled={loading}
              style={{ paddingRight: '40px' }}
            />
            <button
              type="button"
              className="btn btn-link position-absolute"
              style={{ right: '5px', top: '50%', transform: 'translateY(-50%)', padding: '0.25rem 0.5rem' }}
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
                  <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
                  <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                  <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                </svg>
              )}
            </button>
          </div>
          <button className="btn btn-primary w-100" type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Validando...
              </>
            ) : 'Ingresar'}
          </button>
          {error && <div className="alert alert-danger mt-2 mb-0">{error}</div>}
        </form>
      </div>
    </div>
  );
}
