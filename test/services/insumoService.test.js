import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getInsumos,
  setInsumos,
  fetchInsumos,
  descontarInsumos,
  agregarInsumo,
  editarInsumo,
  borrarInsumo
} from '@services/insumoService';

// Mock de los servicios dependientes
vi.mock('@services/localStorageService', () => ({
  getJSON: vi.fn(),
  setJSON: vi.fn()
}));

vi.mock('@services/apiClient', () => ({
  useApi: vi.fn(),
  apiGet: vi.fn(),
  apiPost: vi.fn(),
  apiPut: vi.fn(),
  apiDelete: vi.fn()
}));

import { getJSON, setJSON } from '@services/localStorageService';
import { useApi, apiGet, apiPost, apiPut, apiDelete } from '@services/apiClient';

// Mock de fetch global para descontarInsumos
global.fetch = vi.fn();

describe('insumoService', () => {
  const insumosDefault = [
    { id: 1, nombre: 'Guantes', cantidad: 20 },
    { id: 2, nombre: 'Jeringas', cantidad: 15 },
    { id: 3, nombre: 'Alcohol', cantidad: 10 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    // Resetear completamente los mocks para cada prueba
    getJSON.mockReset();
    setJSON.mockReset();
    useApi.mockReset();
    apiGet.mockReset();
    apiPost.mockReset();
    apiPut.mockReset();
    apiDelete.mockReset();
    fetch.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getInsumos', () => {
    it('debe retornar insumos desde localStorage cuando useApi es false', () => {
      useApi.mockReturnValue(false);
      getJSON.mockReturnValue(insumosDefault);

      const result = getInsumos();

      expect(getJSON).toHaveBeenCalledWith('insumos_medicos_v1', insumosDefault);
      expect(result).toEqual(insumosDefault);
    });

    it('debe retornar insumos locales cuando useApi es true (fallback sincrónico)', () => {
      useApi.mockReturnValue(true);
      getJSON.mockReturnValue(insumosDefault);

      const result = getInsumos();

      expect(getJSON).toHaveBeenCalledWith('insumos_medicos_v1', insumosDefault);
      expect(result).toEqual(insumosDefault);
    });

    it('debe retornar valores por defecto si no hay datos guardados', () => {
      useApi.mockReturnValue(false);
      getJSON.mockReturnValue(insumosDefault); // getJSON ya retorna los defaults

      const result = getInsumos();

      expect(result).toEqual(insumosDefault);
    });
  });

  describe('setInsumos', () => {
    it('debe guardar insumos en localStorage', () => {
      const nuevosInsumos = [
        { id: 1, nombre: 'Mascarillas', cantidad: 50 },
        { id: 2, nombre: 'Termómetros', cantidad: 5 }
      ];

      setInsumos(nuevosInsumos);

      expect(setJSON).toHaveBeenCalledWith('insumos_medicos_v1', nuevosInsumos);
    });
  });

  describe('fetchInsumos', () => {
    it('debe usar localStorage cuando useApi es false', async () => {
      useApi.mockReturnValue(false);
      getJSON.mockReturnValue(insumosDefault);

      const result = await fetchInsumos();

      expect(result).toEqual(insumosDefault);
      expect(apiGet).not.toHaveBeenCalled();
    });

    it('debe usar API y cachear resultado cuando useApi es true', async () => {
      useApi.mockReturnValue(true);
      const insumosAPI = [
        { id: 1, nombre: 'Guantes API', cantidad: 100 },
        { id: 2, nombre: 'Jeringas API', cantidad: 75 }
      ];
      apiGet.mockResolvedValue(insumosAPI);

      const result = await fetchInsumos();

      expect(apiGet).toHaveBeenCalledWith('/api/insumos');
      expect(setJSON).toHaveBeenCalledWith('insumos_medicos_v1', insumosAPI);
      expect(result).toEqual(insumosAPI);
    });

    it('debe manejar errores de la API', async () => {
      useApi.mockReturnValue(true);
      apiGet.mockRejectedValue(new Error('API Error'));

      await expect(fetchInsumos()).rejects.toThrow('API Error');
    });
  });

  describe('descontarInsumos', () => {
    it('debe descontar insumos en modo localStorage', () => {
      useApi.mockReturnValue(false);
      getJSON.mockReturnValue([...insumosDefault]); // copia para evitar mutación

      const usados = [
        { id: 1, cantidad: 5 }, // Guantes: 20 -> 15
        { id: 3, cantidad: 3 }  // Alcohol: 10 -> 7
      ];

      descontarInsumos(usados);

      const expectedResult = [
        { id: 1, nombre: 'Guantes', cantidad: 15 },
        { id: 2, nombre: 'Jeringas', cantidad: 15 },
        { id: 3, nombre: 'Alcohol', cantidad: 7 }
      ];

      expect(setJSON).toHaveBeenCalledWith('insumos_medicos_v1', expectedResult);
    });

    it('debe enviar petición a API en modo API', () => {
      useApi.mockReturnValue(true);
      const mockResponse = { ok: true };
      fetch.mockResolvedValue(mockResponse);

      const usados = [{ id: 1, cantidad: 5 }];

      descontarInsumos(usados);

      expect(fetch).toHaveBeenCalledWith('/api/insumos/descontar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usados)
      });
    });

    it('no debe permitir cantidades negativas', () => {
      useApi.mockReturnValue(false);
      getJSON.mockReturnValue([{ id: 1, nombre: 'Guantes', cantidad: 5 }]);

      const usados = [{ id: 1, cantidad: 10 }]; // Intenta descontar más de lo disponible

      descontarInsumos(usados);

      const expectedResult = [{ id: 1, nombre: 'Guantes', cantidad: 0 }];
      expect(setJSON).toHaveBeenCalledWith('insumos_medicos_v1', expectedResult);
    });

    it('debe manejar insumos inexistentes gracefully', () => {
      useApi.mockReturnValue(false);
      // Crear una copia fresca de los datos por defecto para esta prueba
      const datosIniciales = [
        { id: 1, nombre: 'Guantes', cantidad: 20 },
        { id: 2, nombre: 'Jeringas', cantidad: 15 },
        { id: 3, nombre: 'Alcohol', cantidad: 10 }
      ];
      getJSON.mockReturnValue(datosIniciales);

      const usados = [
        { id: 1, cantidad: 5 }, // Existe
        { id: 999, cantidad: 10 } // No existe
      ];

      descontarInsumos(usados);

      // Solo debe afectar el insumo que existe
      const expectedResult = [
        { id: 1, nombre: 'Guantes', cantidad: 15 },
        { id: 2, nombre: 'Jeringas', cantidad: 15 },
        { id: 3, nombre: 'Alcohol', cantidad: 10 }
      ];

      expect(setJSON).toHaveBeenCalledWith('insumos_medicos_v1', expectedResult);
    });

    it('debe manejar errores de fetch en modo API silenciosamente', () => {
      useApi.mockReturnValue(true);
      fetch.mockRejectedValue(new Error('Network error'));

      const usados = [{ id: 1, cantidad: 5 }];

      // No debe lanzar error
      expect(() => {
        descontarInsumos(usados);
      }).not.toThrow();
    });
  });

  describe('agregarInsumo', () => {
    it('debe agregar insumo usando API cuando useApi es true', async () => {
      useApi.mockReturnValue(true);
      const nuevoInsumo = { id: 4, nombre: 'Mascarillas', cantidad: 30 };
      apiPost.mockResolvedValue(nuevoInsumo);

      const result = await agregarInsumo('Mascarillas', 30);

      expect(apiPost).toHaveBeenCalledWith('/api/insumos', {
        nombre: 'Mascarillas',
        cantidad: 30
      });
      expect(result).toEqual(nuevoInsumo);
    });

    it('debe agregar insumo en localStorage cuando useApi es false', () => {
      useApi.mockReturnValue(false);
      getJSON.mockReturnValue([...insumosDefault]);

      agregarInsumo('Mascarillas', 30);

      const expectedResult = [
        ...insumosDefault,
        { id: 4, nombre: 'Mascarillas', cantidad: 30 }
      ];

      expect(setJSON).toHaveBeenCalledWith('insumos_medicos_v1', expectedResult);
    });

    it('debe asignar ID incremental correctamente', () => {
      useApi.mockReturnValue(false);
      const insumosConIDs = [
        { id: 5, nombre: 'Test1', cantidad: 10 },
        { id: 8, nombre: 'Test2', cantidad: 15 },
        { id: 3, nombre: 'Test3', cantidad: 20 }
      ];
      getJSON.mockReturnValue(insumosConIDs);

      agregarInsumo('NuevoInsumo', 25);

      const [, savedData] = setJSON.mock.calls[0];
      const nuevoItem = savedData[savedData.length - 1];

      expect(nuevoItem.id).toBe(9); // Max ID (8) + 1
    });

    it('debe asignar ID 1 cuando la lista está vacía', () => {
      useApi.mockReturnValue(false);
      getJSON.mockReturnValue([]);

      agregarInsumo('PrimerInsumo', 10);

      const [, savedData] = setJSON.mock.calls[0];
      expect(savedData[0].id).toBe(1);
    });

    it('debe convertir cantidad a número y manejar valores inválidos', () => {
      useApi.mockReturnValue(false);
      getJSON.mockReturnValue([]);

      agregarInsumo('Test', 'abc'); // string inválido

      const [, savedData] = setJSON.mock.calls[0];
      expect(savedData[0].cantidad).toBe(0);
    });
  });

  describe('editarInsumo', () => {
    it('debe editar insumo usando API cuando useApi es true', async () => {
      useApi.mockReturnValue(true);
      const insumoEditado = { id: 1, nombre: 'Guantes Nuevos', cantidad: 50 };
      apiPut.mockResolvedValue(insumoEditado);

      const result = await editarInsumo(1, 'Guantes Nuevos', 50);

      expect(apiPut).toHaveBeenCalledWith('/api/insumos/1', {
        nombre: 'Guantes Nuevos',
        cantidad: 50
      });
      expect(result).toEqual(insumoEditado);
    });

    it('debe editar insumo en localStorage cuando useApi es false', () => {
      useApi.mockReturnValue(false);
      // Crear una copia fresca de los datos por defecto para esta prueba
      const datosIniciales = [
        { id: 1, nombre: 'Guantes', cantidad: 20 },
        { id: 2, nombre: 'Jeringas', cantidad: 15 },
        { id: 3, nombre: 'Alcohol', cantidad: 10 }
      ];
      getJSON.mockReturnValue(datosIniciales);

      editarInsumo(2, 'Jeringas Especiales', 25);

      const expectedResult = [
        { id: 1, nombre: 'Guantes', cantidad: 20 },
        { id: 2, nombre: 'Jeringas Especiales', cantidad: 25 },
        { id: 3, nombre: 'Alcohol', cantidad: 10 }
      ];

      expect(setJSON).toHaveBeenCalledWith('insumos_medicos_v1', expectedResult);
    });

    it('no debe modificar insumos con ID inexistente', () => {
      useApi.mockReturnValue(false);
      getJSON.mockReturnValue([...insumosDefault]);

      editarInsumo(999, 'Inexistente', 100);

      // Los datos deben permanecer iguales
      expect(setJSON).toHaveBeenCalledWith('insumos_medicos_v1', insumosDefault);
    });

    it('debe convertir cantidad a número', () => {
      useApi.mockReturnValue(false);
      getJSON.mockReturnValue([{ id: 1, nombre: 'Test', cantidad: 10 }]);

      editarInsumo(1, 'Test', '25');

      const [, savedData] = setJSON.mock.calls[0];
      expect(savedData[0].cantidad).toBe(25);
    });
  });

  describe('borrarInsumo', () => {
    it('debe borrar insumo usando API cuando useApi es true', async () => {
      useApi.mockReturnValue(true);
      apiDelete.mockResolvedValue(true);

      const result = await borrarInsumo(1);

      expect(apiDelete).toHaveBeenCalledWith('/api/insumos/1');
      expect(result).toBe(true);
    });

    it('debe borrar insumo de localStorage cuando useApi es false', () => {
      useApi.mockReturnValue(false);
      // Crear una copia fresca de los datos por defecto para esta prueba
      const datosIniciales = [
        { id: 1, nombre: 'Guantes', cantidad: 20 },
        { id: 2, nombre: 'Jeringas', cantidad: 15 },
        { id: 3, nombre: 'Alcohol', cantidad: 10 }
      ];
      getJSON.mockReturnValue(datosIniciales);

      borrarInsumo(2);

      const expectedResult = [
        { id: 1, nombre: 'Guantes', cantidad: 20 },
        { id: 3, nombre: 'Alcohol', cantidad: 10 }
      ];

      expect(setJSON).toHaveBeenCalledWith('insumos_medicos_v1', expectedResult);
    });

    it('no debe afectar la lista si el ID no existe', () => {
      useApi.mockReturnValue(false);
      getJSON.mockReturnValue([...insumosDefault]);

      borrarInsumo(999);

      // La lista debe permanecer igual
      expect(setJSON).toHaveBeenCalledWith('insumos_medicos_v1', insumosDefault);
    });
  });

  describe('Integración entre funciones', () => {
    it('debe mantener consistencia en operaciones CRUD completas', () => {
      useApi.mockReturnValue(false);
      
      // Comenzar con datos por defecto
      getJSON.mockReturnValue([...insumosDefault]);

      // Agregar nuevo insumo
      agregarInsumo('Mascarillas', 50);
      
      // Simular que el insumo fue agregado
      const conNuevoInsumo = [
        ...insumosDefault,
        { id: 4, nombre: 'Mascarillas', cantidad: 50 }
      ];
      getJSON.mockReturnValue(conNuevoInsumo);

      // Editar el nuevo insumo
      editarInsumo(4, 'Mascarillas N95', 40);

      // Simular la edición
      const conInsumoEditado = [
        ...insumosDefault,
        { id: 4, nombre: 'Mascarillas N95', cantidad: 40 }
      ];
      getJSON.mockReturnValue(conInsumoEditado);

      // Descontar algunos insumos
      descontarInsumos([{ id: 4, cantidad: 10 }]);

      // Verificar que todas las operaciones llamaron setJSON
      expect(setJSON).toHaveBeenCalledTimes(3);
      
      // La última llamada debe reflejar el descuento
      const ultimaLlamada = setJSON.mock.calls[setJSON.mock.calls.length - 1];
      const resultadoFinal = ultimaLlamada[1];
      const mascarillas = resultadoFinal.find(i => i.id === 4);
      expect(mascarillas.cantidad).toBe(30);
    });
  });
});