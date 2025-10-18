import React from 'react';
import { render, screen } from '@testing-library/react';
import Sidebar from '../components/Sidebar';

describe('Sidebar', () => {
  it('renders navigation links', () => {
    render(<Sidebar />);
    expect(screen.getByText('Dashboard')).toBeTruthy();
    expect(screen.getByText('Paciente')).toBeTruthy();
    expect(screen.getByText('Consultas')).toBeTruthy();
    expect(screen.getByText('Stock')).toBeTruthy();
    expect(screen.getByText('Gráficos')).toBeTruthy();
    expect(screen.getByText('Cuentas')).toBeTruthy();
    expect(screen.getByText('Salir')).toBeTruthy();
  });
});
