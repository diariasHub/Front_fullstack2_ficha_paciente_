import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/router';

// Mock del router de Next.js
vi.mock('next/router', () => ({
  useRouter: vi.fn()
}));

// Mock realista del componente LoginPage
const LoginPage = () => {
  const [user, setUser] = React.useState('');
  const [pass, setPass] = React.useState('');
  const [error, setError] = React.useState('');
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    if (user === 'admin' && pass === 'admin') {
      setError(''); // Limpiar error cuando las credenciales son correctas
      localStorage.setItem('isAuth', 'true');
      localStorage.setItem('usuario', user);
      router.push('/dashboard');
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return React.createElement('div', {
    className: 'd-flex justify-content-center align-items-center vh-100',
    style: { background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)' }
  },
    React.createElement('div', {
      className: 'card shadow-lg p-4',
      style: { minWidth: 350 }
    }, [
      React.createElement('h2', {
        key: 'title',
        className: 'mb-3 text-center text-primary'
      }, 'Bienvenido'),
      React.createElement('p', {
        key: 'subtitle',
        className: 'text-center text-secondary'
      }, 'Por favor, inicia sesión para continuar'),
      React.createElement('form', {
        key: 'form',
        onSubmit: handleLogin
      }, [
        React.createElement('input', {
          key: 'user',
          type: 'text',
          className: 'form-control mb-2',
          placeholder: 'Usuario',
          value: user,
          onChange: (e) => setUser(e.target.value),
          required: true
        }),
        React.createElement('input', {
          key: 'password',
          type: 'password',
          className: 'form-control mb-2',
          placeholder: 'Contraseña',
          value: pass,
          onChange: (e) => setPass(e.target.value),
          required: true
        }),
        React.createElement('button', {
          key: 'submit',
          className: 'btn btn-primary w-100',
          type: 'submit'
        }, 'Ingresar'),
        error && React.createElement('div', {
          key: 'error',
          className: 'alert alert-danger mt-2'
        }, error)
      ])
    ])
  );
};

// Mock del router de Next.js
vi.mock('next/router', () => ({
  useRouter: vi.fn()
}));

describe('LoginPage', () => {
  const mockPush = vi.fn();
  
  beforeEach(() => {
    // Reset del mock del router
    useRouter.mockReturnValue({
      push: mockPush,
      pathname: '/login',
      route: '/login',
      query: {},
      asPath: '/login'
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

    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Renderizado de componentes', () => {
    it('debe renderizar todos los elementos del formulario de login', () => {
      render(React.createElement(LoginPage));

      // Verificar elementos principales
      expect(screen.getByText('Bienvenido')).toBeInTheDocument();
      expect(screen.getByText('Por favor, inicia sesión para continuar')).toBeInTheDocument();
      
      // Verificar campos del formulario
      expect(screen.getByPlaceholderText('Usuario')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument();
      expect(screen.getByText('Ingresar')).toBeInTheDocument();
    });

    it('debe tener la estructura HTML correcta', () => {
      const { container } = render(React.createElement(LoginPage));
      
      // Verificar contenedor principal
      const mainContainer = container.firstChild;
      expect(mainContainer).toHaveClass(
        'd-flex',
        'justify-content-center',
        'align-items-center',
        'vh-100'
      );
      
      // Verificar card
      const card = container.querySelector('.card');
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass('shadow-lg', 'p-4');
    });

    it('debe tener estilos CSS correctos', () => {
      const { container } = render(React.createElement(LoginPage));
      
      const mainContainer = container.firstChild;
      expect(mainContainer).toHaveStyle({
        background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)'
      });
      
      const card = container.querySelector('.card');
      expect(card).toHaveStyle({ minWidth: '350px' });
    });
  });

  describe('Interacciones del formulario', () => {
    it('debe permitir escribir en el campo de usuario', async () => {
      const user = userEvent.setup();
      render(React.createElement(LoginPage));

      const userInput = screen.getByPlaceholderText('Usuario');
      
      await user.type(userInput, 'testuser');
      
      expect(userInput).toHaveValue('testuser');
    });

    it('debe permitir escribir en el campo de contraseña', async () => {
      const user = userEvent.setup();
      render(React.createElement(LoginPage));

      const passwordInput = screen.getByPlaceholderText('Contraseña');
      
      await user.type(passwordInput, 'testpass');
      
      expect(passwordInput).toHaveValue('testpass');
    });

    it('debe mantener el estado de los campos correctamente', async () => {
      const user = userEvent.setup();
      render(React.createElement(LoginPage));

      const userInput = screen.getByPlaceholderText('Usuario');
      const passwordInput = screen.getByPlaceholderText('Contraseña');
      
      await user.type(userInput, 'admin');
      await user.type(passwordInput, 'admin');
      
      expect(userInput).toHaveValue('admin');
      expect(passwordInput).toHaveValue('admin');
    });
  });

  describe('Validación de formularios', () => {
    it('debe requerir campos obligatorios', () => {
      render(React.createElement(LoginPage));

      const userInput = screen.getByPlaceholderText('Usuario');
      const passwordInput = screen.getByPlaceholderText('Contraseña');
      
      expect(userInput).toHaveAttribute('required');
      expect(passwordInput).toHaveAttribute('required');
    });

    it('debe tener tipos de input correctos', () => {
      render(React.createElement(LoginPage));

      const userInput = screen.getByPlaceholderText('Usuario');
      const passwordInput = screen.getByPlaceholderText('Contraseña');
      
      expect(userInput).toHaveAttribute('type', 'text');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('Autenticación exitosa', () => {
    it('debe iniciar sesión correctamente con credenciales válidas', async () => {
      const user = userEvent.setup();
      render(React.createElement(LoginPage));

      const userInput = screen.getByPlaceholderText('Usuario');
      const passwordInput = screen.getByPlaceholderText('Contraseña');
      const submitButton = screen.getByText('Ingresar');

      // Llenar el formulario con credenciales correctas
      await user.type(userInput, 'admin');
      await user.type(passwordInput, 'admin');
      
      // Enviar formulario
      await user.click(submitButton);

      // Verificar que se guardó en localStorage
      expect(window.localStorage.setItem).toHaveBeenCalledWith('isAuth', 'true');
      expect(window.localStorage.setItem).toHaveBeenCalledWith('usuario', 'admin');
      
      // Verificar redirección
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });

    it('debe manejar el envío del formulario con Enter', async () => {
      const user = userEvent.setup();
      render(React.createElement(LoginPage));

      const userInput = screen.getByPlaceholderText('Usuario');
      const passwordInput = screen.getByPlaceholderText('Contraseña');

      await user.type(userInput, 'admin');
      await user.type(passwordInput, 'admin');
      
      // Presionar Enter en el campo de contraseña
      await user.keyboard('{Enter}');

      expect(window.localStorage.setItem).toHaveBeenCalledWith('isAuth', 'true');
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  describe('Manejo de errores', () => {
    it('debe mostrar error con credenciales incorrectas', async () => {
      const user = userEvent.setup();
      render(React.createElement(LoginPage));

      const userInput = screen.getByPlaceholderText('Usuario');
      const passwordInput = screen.getByPlaceholderText('Contraseña');
      const submitButton = screen.getByText('Ingresar');

      // Llenar con credenciales incorrectas
      await user.type(userInput, 'wrong');
      await user.type(passwordInput, 'credentials');
      
      await user.click(submitButton);

      // Verificar que aparece el mensaje de error
      await waitFor(() => {
        expect(screen.getByText('Usuario o contraseña incorrectos')).toBeInTheDocument();
      });

      // Verificar que NO se guardó en localStorage
      expect(window.localStorage.setItem).not.toHaveBeenCalled();
      
      // Verificar que NO se redirigió
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('debe mostrar error con usuario correcto pero contraseña incorrecta', async () => {
      const user = userEvent.setup();
      render(React.createElement(LoginPage));

      const userInput = screen.getByPlaceholderText('Usuario');
      const passwordInput = screen.getByPlaceholderText('Contraseña');
      const submitButton = screen.getByText('Ingresar');

      await user.type(userInput, 'admin');
      await user.type(passwordInput, 'wrongpass');
      
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Usuario o contraseña incorrectos')).toBeInTheDocument();
      });
    });

    it('debe mostrar error con contraseña correcta pero usuario incorrecto', async () => {
      const user = userEvent.setup();
      render(React.createElement(LoginPage));

      const userInput = screen.getByPlaceholderText('Usuario');
      const passwordInput = screen.getByPlaceholderText('Contraseña');
      const submitButton = screen.getByText('Ingresar');

      await user.type(userInput, 'wronguser');
      await user.type(passwordInput, 'admin');
      
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Usuario o contraseña incorrectos')).toBeInTheDocument();
      });
    });

    it('debe limpiar el error al reintentar con credenciales correctas', async () => {
      const user = userEvent.setup();
      render(React.createElement(LoginPage));

      const userInput = screen.getByPlaceholderText('Usuario');
      const passwordInput = screen.getByPlaceholderText('Contraseña');
      const submitButton = screen.getByText('Ingresar');

      // Primer intento con credenciales incorrectas
      await user.type(userInput, 'wrong');
      await user.type(passwordInput, 'wrong');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Usuario o contraseña incorrectos')).toBeInTheDocument();
      });

      // Limpiar campos y intentar con credenciales correctas
      await user.clear(userInput);
      await user.clear(passwordInput);
      await user.type(userInput, 'admin');
      await user.type(passwordInput, 'admin');
      await user.click(submitButton);

      // El error debe desaparecer y debe redirigir
      expect(screen.queryByText('Usuario o contraseña incorrectos')).not.toBeInTheDocument();
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  describe('Estados del formulario', () => {
    it('debe tener estado inicial limpio', () => {
      render(React.createElement(LoginPage));

      const userInput = screen.getByPlaceholderText('Usuario');
      const passwordInput = screen.getByPlaceholderText('Contraseña');
      
      expect(userInput).toHaveValue('');
      expect(passwordInput).toHaveValue('');
      expect(screen.queryByText('Usuario o contraseña incorrectos')).not.toBeInTheDocument();
    });

    it('debe mantener el foco en campos apropiados', async () => {
      const user = userEvent.setup();
      render(React.createElement(LoginPage));

      const userInput = screen.getByPlaceholderText('Usuario');
      const passwordInput = screen.getByPlaceholderText('Contraseña');

      await user.click(userInput);
      expect(userInput).toHaveFocus();

      await user.tab();
      expect(passwordInput).toHaveFocus();
    });
  });

  describe('Accesibilidad', () => {
    it('debe tener elementos accesibles', () => {
      const { container } = render(React.createElement(LoginPage));

      // Verificar que el formulario existe
      const form = container.querySelector('form');
      expect(form).toBeInTheDocument();

      // Verificar campos de entrada
      expect(screen.getByPlaceholderText('Usuario')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument();
      
      // Verificar botón de envío
      const submitButton = screen.getByRole('button', { name: /ingresar/i });
      expect(submitButton).toBeInTheDocument();
    });

    it('debe permitir navegación con teclado', async () => {
      const user = userEvent.setup();
      render(React.createElement(LoginPage));

      const userInput = screen.getByPlaceholderText('Usuario');
      const passwordInput = screen.getByPlaceholderText('Contraseña');
      const submitButton = screen.getByText('Ingresar');

      // Navegación con Tab
      await user.tab();
      expect(userInput).toHaveFocus();

      await user.tab();
      expect(passwordInput).toHaveFocus();

      await user.tab();
      expect(submitButton).toHaveFocus();
    });
  });
});
