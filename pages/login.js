import { useState } from 'react';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    if (user === 'admin' && pass === 'admin') {
      localStorage.setItem('isAuth', 'true');
      localStorage.setItem('usuario', user);
      router.push('/dashboard');
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)' }}>
      <div className="card shadow-lg p-4" style={{ minWidth: 350 }}>
        <h2 className="mb-3 text-center text-primary">Bienvenido</h2>
        <p className="text-center text-secondary">Por favor, inicia sesión para continuar</p>
        <form onSubmit={handleLogin}>
          <input type="text" className="form-control mb-2" placeholder="Usuario" value={user} onChange={e => setUser(e.target.value)} required />
          <input type="password" className="form-control mb-2" placeholder="Contraseña" value={pass} onChange={e => setPass(e.target.value)} required />
          <button className="btn btn-primary w-100" type="submit">Ingresar</button>
          {error && <div className="alert alert-danger mt-2">{error}</div>}
        </form>
      </div>
    </div>
  );
}
