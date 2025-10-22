import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  listarConsultas,
  guardarConsulta,
  filtrarConsultas,
  fetchConsultas
} from '@services/consultaService';

// Mock de los servicios dependientes
vi.mock('@services/localStorageService', () => ({
  getJSON: vi.fn(),
  setJSON: vi.fn()
}));

vi.mock('@services/apiClient', () => ({
  useApi: vi.fn(),
  apiGet: vi.fn(),
  apiPost: vi.fn()
}));

import { getJSON, setJSON } from '@services/localStorageService';
import { useApi, apiGet, apiPost } from '@services/apiClient';

describe('consultaService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock Date.now para tener IDs predecibles
    vi.spyOn(Date, 'now').mockReturnValue(1234567890);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('listarConsultas', () => {
    it('debe retornar lista de consultas desde localStorage', () => {
      const mockConsultas = [
        { id: 1, rut: '12345678-9', fecha: '2023-01-01', carrera: 'Medicina', motivo: 'Control' },
        { id: 2, rut: '87654321-0', fecha: '2023-01-02', carrera: 'Enfermería', motivo: 'Consulta' }
      ];

      getJSON.mockReturnValue(mockConsultas);

      const result = listarConsultas();

      expect(getJSON).toHaveBeenCalledWith('consultas_v1', []);
      expect(result).toEqual(mockConsultas);
    });

    it('debe retornar array vacío si no hay consultas guardadas', () => {
      getJSON.mockReturnValue([]);

      const result = listarConsultas();

      expect(result).toEqual([]);
    });
  });

  describe('guardarConsulta', () => {
    const nuevaConsulta = {
      rut: '12345678-9',
      fecha: '2023-01-15',
      carrera: 'Medicina',
      motivo: 'Control mensual'
    };

    it('debe guardar consulta usando API cuando useApi() es true', async () => {
      useApi.mockReturnValue(true);
      const consultaGuardada = { id: 100, ...nuevaConsulta };
      apiPost.mockResolvedValue(consultaGuardada);

      const result = await guardarConsulta(nuevaConsulta);

      expect(apiPost).toHaveBeenCalledWith('/api/consultas', nuevaConsulta);
      expect(result).toEqual(consultaGuardada);
    });

    it('debe guardar consulta en localStorage cuando useApi() es false', () => {
      useApi.mockReturnValue(false);
      const consultasExistentes = [
        { id: 1, rut: '87654321-0', fecha: '2023-01-01' }
      ];
      getJSON.mockReturnValue(consultasExistentes);

      const result = guardarConsulta(nuevaConsulta);

      const consultaEsperada = { id: 1234567890, ...nuevaConsulta };
      const listaEsperada = [consultaEsperada, ...consultasExistentes];

      expect(setJSON).toHaveBeenCalledWith('consultas_v1', listaEsperada);
      expect(result).toEqual(consultaEsperada);
    });

    it('debe asignar ID único basado en timestamp', () => {
      useApi.mockReturnValue(false);
      getJSON.mockReturnValue([]);

      const result = guardarConsulta(nuevaConsulta);

      expect(result.id).toBe(1234567890);
      expect(result).toMatchObject(nuevaConsulta);
    });

    it('debe agregar la nueva consulta al principio de la lista', () => {
      useApi.mockReturnValue(false);
      const consultasExistentes = [
        { id: 1, rut: '11111111-1' },
        { id: 2, rut: '22222222-2' }
      ];
      getJSON.mockReturnValue(consultasExistentes);

      guardarConsulta(nuevaConsulta);

      const [llamada] = setJSON.mock.calls;
      const [, listaGuardada] = llamada;

      expect(listaGuardada[0]).toMatchObject({ id: 1234567890, ...nuevaConsulta });
      expect(listaGuardada[1]).toEqual(consultasExistentes[0]);
      expect(listaGuardada[2]).toEqual(consultasExistentes[1]);
    });
  });

  describe('filtrarConsultas', () => {
    const consultasMock = [
      {
        id: 1,
        rut: '12345678-9',
        fecha: '2023-01-15',
        carrera: 'Medicina',
        motivo: 'Control mensual'
      },
      {
        id: 2,
        rut: '87654321-0',
        fecha: '2023-02-20',
        carrera: 'Enfermería',
        motivo: 'Consulta general'
      },
      {
        id: 3,
        rut: '11111111-1',
        fecha: '2023-01-10',
        carrera: 'Medicina',
        motivo: 'Emergencia'
      }
    ];

    beforeEach(() => {
      getJSON.mockReturnValue(consultasMock);
    });

    it('debe filtrar por RUT (case insensitive)', () => {
      const result = filtrarConsultas({ rut: '1234' });

      expect(result).toHaveLength(1);
      expect(result[0].rut).toBe('12345678-9');
    });

    it('debe filtrar por fecha exacta', () => {
      const result = filtrarConsultas({ fecha: '2023-01' });

      expect(result).toHaveLength(2);
      expect(result.every(c => c.fecha.includes('2023-01'))).toBe(true);
    });

    it('debe filtrar por carrera (case insensitive)', () => {
      const result = filtrarConsultas({ carrera: 'medicina' });

      expect(result).toHaveLength(2);
      expect(result.every(c => c.carrera.toLowerCase().includes('medicina'))).toBe(true);
    });

    it('debe filtrar por motivo (case insensitive)', () => {
      const result = filtrarConsultas({ motivo: 'CONTROL' });

      expect(result).toHaveLength(1);
      expect(result[0].motivo).toBe('Control mensual');
    });

    it('debe aplicar múltiples filtros simultáneamente', () => {
      const result = filtrarConsultas({
        carrera: 'Medicina',
        fecha: '2023-01'
      });

      expect(result).toHaveLength(2);
      expect(result.every(c => 
        c.carrera === 'Medicina' && c.fecha.includes('2023-01')
      )).toBe(true);
    });

    it('debe retornar todas las consultas cuando no hay filtros', () => {
      const result = filtrarConsultas({});

      expect(result).toEqual(consultasMock);
    });

    it('debe retornar array vacío cuando ninguna consulta coincide', () => {
      const result = filtrarConsultas({ rut: 'inexistente' });

      expect(result).toEqual([]);
    });

    it('debe manejar filtros con valores undefined/null/empty', () => {
      const result = filtrarConsultas({
        rut: '',
        fecha: null,
        carrera: undefined,
        motivo: ''
      });

      expect(result).toEqual(consultasMock);
    });

    it('debe manejar consultas con campos faltantes gracefully', () => {
      const consultasIncompletas = [
        { id: 1, rut: '12345678-9' }, // sin fecha, carrera, motivo
        { id: 2, fecha: '2023-01-01', carrera: 'Medicina' } // sin rut, motivo
      ];
      getJSON.mockReturnValue(consultasIncompletas);

      const result = filtrarConsultas({ carrera: 'Medicina' });

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(2);
    });
  });

  describe('fetchConsultas', () => {
    it('debe usar localStorage cuando useApi() es false', async () => {
      useApi.mockReturnValue(false);
      const consultasLocal = [{ id: 1, rut: '12345678-9' }];
      getJSON.mockReturnValue(consultasLocal);

      const result = await fetchConsultas();

      expect(result).toEqual(consultasLocal);
      expect(apiGet).not.toHaveBeenCalled();
    });

    it('debe usar API y cachear resultado cuando useApi() es true', async () => {
      useApi.mockReturnValue(true);
      const consultasAPI = [
        { id: 1, rut: '12345678-9' },
        { id: 2, rut: '87654321-0' }
      ];
      apiGet.mockResolvedValue(consultasAPI);

      const result = await fetchConsultas();

      expect(apiGet).toHaveBeenCalledWith('/api/consultas');
      expect(setJSON).toHaveBeenCalledWith('consultas_v1', consultasAPI);
      expect(result).toEqual(consultasAPI);
    });

    it('debe manejar errores de la API gracefully', async () => {
      useApi.mockReturnValue(true);
      apiGet.mockRejectedValue(new Error('API Error'));

      await expect(fetchConsultas()).rejects.toThrow('API Error');
    });
  });

  describe('Integración entre funciones', () => {
    it('debe mantener consistencia entre guardar y listar consultas', () => {
      useApi.mockReturnValue(false);
      
      // Estado inicial vacío
      getJSON.mockReturnValue([]);
      
      // Guardar primera consulta
      const consulta1 = { rut: '12345678-9', fecha: '2023-01-01', carrera: 'Medicina', motivo: 'Control' };
      guardarConsulta(consulta1);
      
      // Simular que localStorage ahora tiene la consulta guardada
      const consultaGuardada1 = { id: 1234567890, ...consulta1 };
      getJSON.mockReturnValue([consultaGuardada1]);
      
      // Verificar que se puede listar
      const consultas = listarConsultas();
      expect(consultas).toContain(consultaGuardada1);
      
      // Verificar que se puede filtrar
      const filtradas = filtrarConsultas({ carrera: 'Medicina' });
      expect(filtradas).toContain(consultaGuardada1);
    });
  });
});