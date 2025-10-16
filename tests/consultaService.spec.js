import { listarConsultas, guardarConsulta, filtrarConsultas } from '../services/consultaService';
import { setJSON } from '../services/localStorageService';

describe('consultaService (local mode)', () => {
  beforeEach(() => {
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
    setJSON('consultas_v1', []);
  });

  it('guardarConsulta persists and listarConsultas returns it', () => {
    const now = guardarConsulta({ nombre: 'Juan', rut: '11111111-1', carrera: 'Medicina', motivo: 'Dolor' });
    const list = listarConsultas();
    expect(list.length).toBe(1);
    expect(list[0].nombre).toBe('Juan');
    expect(list[0].id).toBeDefined();
  });

  it('filtrarConsultas filters by campo', () => {
    guardarConsulta({ nombre: 'Ana', rut: '22222222-2', carrera: 'Enfermería', motivo: 'Fiebre' });
    guardarConsulta({ nombre: 'Luis', rut: '33333333-3', carrera: 'Medicina', motivo: 'Trauma' });
    const med = filtrarConsultas({ carrera: 'Medicina' });
    expect(med.length).toBe(1);
    expect(med[0].nombre).toBe('Luis');
  });
});
