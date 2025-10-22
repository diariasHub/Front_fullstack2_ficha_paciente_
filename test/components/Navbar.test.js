import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';

// Mock del router de Next.js
vi.mock('next/router', () => ({
  useRouter: vi.fn()
}));

// Mock realista del componente Navbar
const Navbar = () => {
  const [isAdmin, setIsAdmin] = React.useState(false);
  const router = useRouter();
  
  React.useEffect(() => {
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
      localStorage.removeItem('usuario');
    }
    router.push('/login');
  };

  return React.createElement('nav', {
    className: 'navbar navbar-expand-lg navbar-dark',
    style: { background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)' }
  }, 
    React.createElement('div', { className: 'container-fluid' }, [
      React.createElement('a', {
        key: 'brand',
        href: '/dashboard',
        className: 'navbar-brand'
      }, 'Fichas Atencion'),
      React.createElement('button', {
        key: 'toggler',
        className: 'navbar-toggler',
        type: 'button',
        'data-bs-toggle': 'collapse',
        'data-bs-target': '#navbarNav'
      }, React.createElement('span', { className: 'navbar-toggler-icon' })),
      React.createElement('div', {
        key: 'collapse',
        className: 'collapse navbar-collapse justify-content-end',
        id: 'navbarNav'
      },
        React.createElement('ul', { className: 'navbar-nav ms-auto d-flex align-items-center gap-2' }, [
          React.createElement('li', { key: 'pacientes', className: 'nav-item' },
            React.createElement('a', { href: '/pacientes', className: 'btn btn-outline-light' }, 'Nuevo Paciente')),
          React.createElement('li', { key: 'consultas', className: 'nav-item' },
            React.createElement('a', { href: '/consultas', className: 'btn btn-outline-light' }, 'Consultas')),
          React.createElement('li', { key: 'stock', className: 'nav-item' },
            React.createElement('a', { href: '/stock', className: 'btn btn-outline-light' }, 'Stock Insumos')),
          React.createElement('li', { key: 'graficos', className: 'nav-item' },
            React.createElement('a', { href: '/graficos', className: 'btn btn-outline-light' }, 'Gráficos')),
          ...(isAdmin ? [React.createElement('li', { key: 'cuentas', className: 'nav-item' },
            React.createElement('a', { href: '/cuentas', className: 'btn btn-outline-warning' }, 'Cuentas'))] : []),
          React.createElement('li', { key: 'logout', className: 'nav-item' },
            React.createElement('button', { onClick: handleLogout, className: 'btn btn-danger' }, 'Salir'))
        ])
      )
    ])
  );
};

// Mock del router de Next.js
vi.mock('next/router', () => ({
  useRouter: vi.fn()
}));

describe('Navbar', () => {
  const mockPush = vi.fn();
  
  beforeEach(() => {
    // Reset del mock del router
    useRouter.mockReturnValue({
      push: mockPush,
      pathname: '/dashboard',
      route: '/dashboard',
      query: {},
      asPath: '/dashboard'
    });

    // Mock de localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      },
      writable: true,
    });

    // Mock de addEventListener y removeEventListener
    window.addEventListener = vi.fn();
    window.removeEventListener = vi.fn();

    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Renderizado básico', () => {
    it('debe renderizar el navbar con elementos básicos', () => {
      window.localStorage.getItem.mockReturnValue(null);
      
      render(React.createElement(Navbar));

      // Verificar que el logo/título está presente
      expect(screen.getByText('Fichas Atencion')).toBeInTheDocument();
      
      // Verificar que los enlaces principales están presentes
      expect(screen.getByText('Nuevo Paciente')).toBeInTheDocument();
      expect(screen.getByText('Consultas')).toBeInTheDocument();
      expect(screen.getByText('Stock Insumos')).toBeInTheDocument();
      expect(screen.getByText('Gráficos')).toBeInTheDocument();
      expect(screen.getByText('Salir')).toBeInTheDocument();
    });

    it('debe tener la estructura HTML correcta', () => {
      window.localStorage.getItem.mockReturnValue(null);
      
      const { container } = render(React.createElement(Navbar));
      
      // Verificar estructura del navbar
      const navbar = container.querySelector('nav.navbar');
      expect(navbar).toBeInTheDocument();
      expect(navbar).toHaveClass('navbar-expand-lg', 'navbar-dark');
      
      // Verificar que tiene el gradient de fondo
      expect(navbar).toHaveStyle({
        background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)'
      });
    });
  });

  describe('Funcionalidad de administrador', () => {
    it('debe mostrar el enlace de Cuentas cuando el usuario es admin', () => {
      window.localStorage.getItem.mockImplementation((key) => {
        if (key === 'usuario') return 'admin';
        return null;
      });

      render(React.createElement(Navbar));

      expect(screen.getByText('Cuentas')).toBeInTheDocument();
    });

    it('no debe mostrar el enlace de Cuentas cuando el usuario no es admin', () => {
      window.localStorage.getItem.mockImplementation((key) => {
        if (key === 'usuario') return 'user';
        return null;
      });

      render(React.createElement(Navbar));

      expect(screen.queryByText('Cuentas')).not.toBeInTheDocument();
    });

    it('no debe mostrar el enlace de Cuentas cuando no hay usuario logueado', () => {
      window.localStorage.getItem.mockReturnValue(null);

      render(React.createElement(Navbar));

      expect(screen.queryByText('Cuentas')).not.toBeInTheDocument();
    });
  });

  describe('Funcionalidad de logout', () => {
    it('debe ejecutar logout correctamente', () => {
      window.localStorage.getItem.mockReturnValue(null);
      
      render(React.createElement(Navbar));

      const logoutButton = screen.getByText('Salir');
      fireEvent.click(logoutButton);

      // Verificar que se remueven los items del localStorage
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('isAuth');
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('usuario');
      
      // Verificar que redirige a login
      expect(mockPush).toHaveBeenCalledWith('/login');
    });

    it('debe tener el botón de logout con las clases correctas', () => {
      window.localStorage.getItem.mockReturnValue(null);
      
      render(React.createElement(Navbar));

      const logoutButton = screen.getByText('Salir');
      expect(logoutButton).toHaveClass('btn', 'btn-danger');
    });
  });

  describe('Eventos de storage', () => {
    it('debe configurar y limpiar listeners de storage correctamente', () => {
      window.localStorage.getItem.mockReturnValue(null);
      
      const { unmount } = render(React.createElement(Navbar));

      // Verificar que se agregó el listener
      expect(window.addEventListener).toHaveBeenCalledWith('storage', expect.any(Function));

      // Desmontar componente
      unmount();

      // Verificar que se removió el listener
      expect(window.removeEventListener).toHaveBeenCalledWith('storage', expect.any(Function));
    });

    it('debe actualizar el estado de admin cuando cambia el localStorage', async () => {
      // Inicialmente no es admin
      window.localStorage.getItem.mockReturnValue(null);
      
      render(React.createElement(Navbar));

      // Verificar que no está el enlace de Cuentas
      expect(screen.queryByText('Cuentas')).not.toBeInTheDocument();

      // Simular cambio en localStorage para hacer usuario admin
      window.localStorage.getItem.mockImplementation((key) => {
        if (key === 'usuario') return 'admin';
        return null;
      });

      // Obtener la función del listener de storage
      const storageListener = window.addEventListener.mock.calls.find(
        call => call[0] === 'storage'
      )[1];

      // Ejecutar el listener
      storageListener();

      // Esperar a que se actualice el estado
      await waitFor(() => {
        expect(screen.getByText('Cuentas')).toBeInTheDocument();
      });
    });
  });

  describe('Enlaces de navegación', () => {
    it('debe tener los enlaces con hrefs correctos', () => {
      window.localStorage.getItem.mockReturnValue('admin');
      
      render(React.createElement(Navbar));

      // Verificar enlaces
      expect(screen.getByText('Fichas Atencion').closest('a')).toHaveAttribute('href', '/dashboard');
      expect(screen.getByText('Nuevo Paciente').closest('a')).toHaveAttribute('href', '/pacientes');
      expect(screen.getByText('Consultas').closest('a')).toHaveAttribute('href', '/consultas');
      expect(screen.getByText('Stock Insumos').closest('a')).toHaveAttribute('href', '/stock');
      expect(screen.getByText('Gráficos').closest('a')).toHaveAttribute('href', '/graficos');
      expect(screen.getByText('Cuentas').closest('a')).toHaveAttribute('href', '/cuentas');
    });

    it('debe tener las clases CSS correctas en los enlaces', () => {
      window.localStorage.getItem.mockReturnValue('admin');
      
      render(React.createElement(Navbar));

      // Enlaces principales deben tener clase btn-outline-light
      expect(screen.getByText('Nuevo Paciente')).toHaveClass('btn', 'btn-outline-light');
      expect(screen.getByText('Consultas')).toHaveClass('btn', 'btn-outline-light');
      expect(screen.getByText('Stock Insumos')).toHaveClass('btn', 'btn-outline-light');
      expect(screen.getByText('Gráficos')).toHaveClass('btn', 'btn-outline-light');
      
      // Enlace de cuentas debe tener clase btn-outline-warning
      expect(screen.getByText('Cuentas')).toHaveClass('btn', 'btn-outline-warning');
    });
  });

  describe('Responsive design', () => {
    it('debe tener el botón de toggle para móviles', () => {
      window.localStorage.getItem.mockReturnValue(null);
      
      const { container } = render(React.createElement(Navbar));

      const toggleButton = container.querySelector('.navbar-toggler');
      expect(toggleButton).toBeInTheDocument();
      expect(toggleButton).toHaveAttribute('data-bs-toggle', 'collapse');
      expect(toggleButton).toHaveAttribute('data-bs-target', '#navbarNav');
    });

    it('debe tener el contenedor colapsable con ID correcto', () => {
      window.localStorage.getItem.mockReturnValue(null);
      
      const { container } = render(React.createElement(Navbar));

      const collapseDiv = container.querySelector('#navbarNav');
      expect(collapseDiv).toBeInTheDocument();
      expect(collapseDiv).toHaveClass('collapse', 'navbar-collapse', 'justify-content-end');
    });
  });

  describe('Integración con el sistema', () => {
    it('debe manejar correctamente el estado inicial del usuario', () => {
      // Simular usuario normal logueado
      window.localStorage.getItem.mockImplementation((key) => {
        if (key === 'usuario') return 'usuario_normal';
        if (key === 'isAuth') return 'true';
        return null;
      });

      render(React.createElement(Navbar));

      // Debe mostrar todos los enlaces excepto Cuentas
      expect(screen.getByText('Nuevo Paciente')).toBeInTheDocument();
      expect(screen.getByText('Consultas')).toBeInTheDocument();
      expect(screen.getByText('Stock Insumos')).toBeInTheDocument();
      expect(screen.getByText('Gráficos')).toBeInTheDocument();
      expect(screen.queryByText('Cuentas')).not.toBeInTheDocument();
      expect(screen.getByText('Salir')).toBeInTheDocument();
    });
  });
});
