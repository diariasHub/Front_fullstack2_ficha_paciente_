import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import Navbar from '../components/Navbar';
import { __routerMock } from './mocks/nextRouterMock';

describe('Navbar', () => {
  beforeEach(() => {
    // Ensure localStorage exists
    const store = {};
    if (!window.localStorage) {
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: (k) => store[k] || null,
          setItem: (k, v) => { store[k] = v; },
          removeItem: (k) => { delete store[k]; },
        },
        configurable: true,
      });
    }
  });

  it('renders brand and menu buttons', () => {
    render(<Navbar />);
    expect(screen.getByText('Fichas Atencion')).toBeTruthy();
    expect(screen.getByText('Nuevo Paciente')).toBeTruthy();
    expect(screen.getByText('Consultas')).toBeTruthy();
    expect(screen.getByText('Stock Insumos')).toBeTruthy();
    expect(screen.getByText('Gráficos')).toBeTruthy();
    expect(screen.getByText('Salir')).toBeTruthy();
  });

  it('does not show Cuentas for non-admin on initial render', () => {
    localStorage.removeItem('usuario');
    render(<Navbar />);
    expect(screen.queryByText('Cuentas')).toBeNull();
  });

  it('shows Cuentas for admin on initial render', () => {
    localStorage.setItem('usuario', 'admin');
    render(<Navbar />);
    expect(screen.getByText('Cuentas')).toBeTruthy();
  });

  it('updates to show Cuentas when usuario cambia a admin y dispara storage', () => {
    localStorage.removeItem('usuario');
    render(<Navbar />);
    expect(screen.queryByText('Cuentas')).toBeNull();
    act(() => {
      localStorage.setItem('usuario', 'admin');
      window.dispatchEvent(new StorageEvent('storage', { key: 'usuario', newValue: 'admin' }));
    });
    return waitFor(() => {
      expect(screen.getByText('Cuentas')).toBeTruthy();
    });
  });

  it('logout clears auth and navigates to /login', () => {
    localStorage.setItem('isAuth', 'true');
    localStorage.setItem('usuario', 'admin');
    const pushSpy = jasmine.createSpy('push');
    __routerMock.push = pushSpy;

    render(<Navbar />);
    fireEvent.click(screen.getByRole('button', { name: /salir/i }));

    expect(localStorage.getItem('isAuth')).toBeNull();
    expect(localStorage.getItem('usuario')).toBeNull();
    expect(pushSpy).toHaveBeenCalledWith('/login');
  });

  it('navbar toggler exists and links are accessible', () => {
    render(<Navbar />);
    const buttons = screen.getAllByRole('button');
    const toggler = buttons.find(btn => btn.getAttribute('data-bs-toggle') === 'collapse');
    expect(toggler).toBeTruthy();
    expect(toggler.getAttribute('data-bs-toggle')).toBe('collapse');

    // We can simulate a click; Bootstrap JS isn't active in tests, but the button exists
    fireEvent.click(toggler);
    // Since collapse JS no corre aquí, sólo validamos presencia del destino
  const menu = document.getElementById('navbarNav');
    expect(menu).toBeTruthy();

    // Links have correct hrefs
    expect(screen.getByRole('link', { name: 'Fichas Atencion' }).getAttribute('href')).toBe('/dashboard');
    expect(screen.getByRole('link', { name: 'Nuevo Paciente' }).getAttribute('href')).toBe('/pacientes');
    expect(screen.getByRole('link', { name: 'Consultas' }).getAttribute('href')).toBe('/consultas');
    expect(screen.getByRole('link', { name: 'Stock Insumos' }).getAttribute('href')).toBe('/stock');
    expect(screen.getByRole('link', { name: 'Gráficos' }).getAttribute('href')).toBe('/graficos');
  });
});
