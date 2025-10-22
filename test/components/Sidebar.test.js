import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Sidebar from '@components/Sidebar';

describe('Sidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Renderizado básico', () => {
    it('debe renderizar la sidebar con todos los enlaces', () => {
      render(<Sidebar />);

      // Verificar que todos los enlaces están presentes
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Paciente')).toBeInTheDocument();
      expect(screen.getByText('Consultas')).toBeInTheDocument();
      expect(screen.getByText('Stock')).toBeInTheDocument();
      expect(screen.getByText('Gráficos')).toBeInTheDocument();
      expect(screen.getByText('Cuentas')).toBeInTheDocument();
      expect(screen.getByText('Salir')).toBeInTheDocument();
    });

    it('debe tener la estructura HTML correcta', () => {
      const { container } = render(<Sidebar />);
      
      const sidebar = container.firstChild;
      expect(sidebar).toHaveClass(
        'd-flex',
        'flex-column',
        'p-3',
        'position-sticky'
      );
    });

    it('debe tener los estilos CSS correctos', () => {
      const { container } = render(<Sidebar />);
      
      const sidebar = container.firstChild;
      expect(sidebar).toHaveStyle({
        background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
        minWidth: '80px',
        top: '0',
        height: '100%'
      });
    });
  });

  describe('Enlaces de navegación', () => {
    it('debe tener todos los enlaces con hrefs correctos', () => {
      render(<Sidebar />);

      // Verificar que los enlaces apuntan a las rutas correctas
      expect(screen.getByText('Dashboard').closest('a')).toHaveAttribute('href', '/dashboard');
      expect(screen.getByText('Paciente').closest('a')).toHaveAttribute('href', '/pacientes');
      expect(screen.getByText('Consultas').closest('a')).toHaveAttribute('href', '/consultas');
      expect(screen.getByText('Stock').closest('a')).toHaveAttribute('href', '/stock');
      expect(screen.getByText('Gráficos').closest('a')).toHaveAttribute('href', '/graficos');
      expect(screen.getByText('Cuentas').closest('a')).toHaveAttribute('href', '/cuentas');
      expect(screen.getByText('Salir').closest('a')).toHaveAttribute('href', '/login');
    });

    it('debe tener las clases CSS correctas en los enlaces', () => {
      render(<Sidebar />);

      const links = screen.getAllByRole('link');
      
      links.forEach(link => {
        expect(link).toHaveClass(
          'mb-4',
          'text-white',
          'text-decoration-none',
          'text-center'
        );
      });
    });
  });

  describe('Iconos Bootstrap', () => {
    it('debe mostrar todos los iconos correctos', () => {
      const { container } = render(<Sidebar />);

      // Verificar que los iconos están presentes con las clases correctas
      expect(container.querySelector('.bi-house-door-fill')).toBeInTheDocument();
      expect(container.querySelector('.bi-person-plus-fill')).toBeInTheDocument();
      expect(container.querySelector('.bi-journal-medical')).toBeInTheDocument();
      expect(container.querySelector('.bi-box-seam')).toBeInTheDocument();
      expect(container.querySelector('.bi-bar-chart-fill')).toBeInTheDocument();
      expect(container.querySelector('.bi-person-fill')).toBeInTheDocument();
      expect(container.querySelector('.bi-box-arrow-right')).toBeInTheDocument();
    });

    it('debe tener iconos con el tamaño correcto', () => {
      const { container } = render(<Sidebar />);

      const icons = container.querySelectorAll('i');
      
      icons.forEach(icon => {
        expect(icon).toHaveClass('fs-2');
      });
    });
  });

  describe('Estructura de elementos', () => {
    it('debe tener el texto en elementos div con clase small', () => {
      const { container } = render(<Sidebar />);

      const textElements = container.querySelectorAll('.small');
      const expectedTexts = ['Dashboard', 'Paciente', 'Consultas', 'Stock', 'Gráficos', 'Cuentas', 'Salir'];
      
      expect(textElements).toHaveLength(expectedTexts.length);
      
      textElements.forEach((element, index) => {
        expect(element).toHaveTextContent(expectedTexts[index]);
      });
    });

    it('debe tener cada enlace con icono y texto', () => {
      const { container } = render(<Sidebar />);

      const links = container.querySelectorAll('a');
      
      links.forEach(link => {
        // Cada enlace debe tener un icono y un div con texto
        const icon = link.querySelector('i');
        const textDiv = link.querySelector('.small');
        
        expect(icon).toBeInTheDocument();
        expect(textDiv).toBeInTheDocument();
      });
    });
  });

  describe('Accesibilidad', () => {
    it('debe tener enlaces accesibles', () => {
      render(<Sidebar />);

      const links = screen.getAllByRole('link');
      
      // Verificar que todos los enlaces son accesibles
      expect(links).toHaveLength(7);
      
      links.forEach(link => {
        // Cada enlace debe tener texto visible
        expect(link).toHaveTextContent(/Dashboard|Paciente|Consultas|Stock|Gráficos|Cuentas|Salir/);
      });
    });

    it('debe permitir navegación por teclado', () => {
      render(<Sidebar />);

      const links = screen.getAllByRole('link');
      
      links.forEach(link => {
        // Los enlaces deben ser focusables
        expect(link).toHaveAttribute('href');
      });
    });
  });

  describe('Responsividad', () => {
    it('debe mantener ancho mínimo consistente', () => {
      const { container } = render(<Sidebar />);
      
      const sidebar = container.firstChild;
      expect(sidebar).toHaveStyle({ minWidth: '80px' });
    });

    it('debe tener posición sticky para mantener visibilidad', () => {
      const { container } = render(<Sidebar />);
      
      const sidebar = container.firstChild;
      expect(sidebar).toHaveClass('position-sticky');
      expect(sidebar).toHaveStyle({ top: '0' });
    });
  });

  describe('Funcionalidad visual', () => {
    it('debe mostrar elementos centrados', () => {
      const { container } = render(<Sidebar />);

      const links = container.querySelectorAll('a');
      
      links.forEach(link => {
        expect(link).toHaveClass('text-center');
      });
    });

    it('debe tener espaciado consistente entre elementos', () => {
      const { container } = render(<Sidebar />);

      const links = container.querySelectorAll('a');
      
      links.forEach(link => {
        expect(link).toHaveClass('mb-4');
      });
    });

    it('debe tener colores de texto correctos', () => {
      const { container } = render(<Sidebar />);

      const links = container.querySelectorAll('a');
      
      links.forEach(link => {
        expect(link).toHaveClass('text-white');
      });
    });
  });

  describe('Integración con sistema de navegación', () => {
    it('debe ser compatible con Next.js Link', () => {
      render(<Sidebar />);

      // Verificar que los enlaces usan el componente Link de Next.js correctamente
      const dashboardLink = screen.getByText('Dashboard').closest('a');
      expect(dashboardLink).toHaveAttribute('href', '/dashboard');
      
      const pacienteLink = screen.getByText('Paciente').closest('a');
      expect(pacienteLink).toHaveAttribute('href', '/pacientes');
    });

    it('debe proporcionar navegación completa del sistema', () => {
      render(<Sidebar />);

      // Verificar que cubre todas las secciones principales del sistema
      const expectedRoutes = [
        '/dashboard',
        '/pacientes', 
        '/consultas',
        '/stock',
        '/graficos',
        '/cuentas',
        '/login'
      ];

      const links = screen.getAllByRole('link');
      const actualRoutes = links.map(link => link.getAttribute('href'));
      
      expectedRoutes.forEach(route => {
        expect(actualRoutes).toContain(route);
      });
    });
  });
});