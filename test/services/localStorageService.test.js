import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getJSON, setJSON } from '@services/localStorageService';

describe('localStorageService', () => {
  let mockLocalStorage;

  beforeEach(() => {
    // Crear un mock para localStorage
    mockLocalStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };

    // Reemplazar localStorage en window
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getJSON', () => {
    it('debe retornar el valor parseado del localStorage', () => {
      const testData = { id: 1, name: 'Test' };
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(testData));

      const result = getJSON('test-key', null);

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('test-key');
      expect(result).toEqual(testData);
    });

    it('debe retornar el fallback cuando no existe la key', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      const fallback = { default: true };

      const result = getJSON('inexistent-key', fallback);

      expect(result).toEqual(fallback);
    });

    it('debe retornar el fallback cuando hay error al parsear JSON', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid-json');
      const fallback = { error: true };

      const result = getJSON('invalid-key', fallback);

      expect(result).toEqual(fallback);
    });

    it('debe retornar el fallback en entorno SSR (window no definido)', () => {
      // Simular entorno SSR
      const originalWindow = global.window;
      delete global.window;

      const fallback = { ssr: true };
      const result = getJSON('ssr-key', fallback);

      expect(result).toEqual(fallback);

      // Restaurar window
      global.window = originalWindow;
    });

    it('debe manejar excepciones del localStorage gracefully', () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('LocalStorage error');
      });

      const fallback = { error_handled: true };
      const result = getJSON('error-key', fallback);

      expect(result).toEqual(fallback);
    });
  });

  describe('setJSON', () => {
    it('debe guardar el valor serializado en localStorage', () => {
      const testData = { id: 1, name: 'Test User' };

      setJSON('test-key', testData);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'test-key',
        JSON.stringify(testData)
      );
    });

    it('debe manejar objetos complejos correctamente', () => {
      const complexData = {
        users: [
          { id: 1, name: 'User 1', active: true },
          { id: 2, name: 'User 2', active: false }
        ],
        metadata: {
          count: 2,
          lastUpdate: '2023-01-01'
        }
      };

      setJSON('complex-key', complexData);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'complex-key',
        JSON.stringify(complexData)
      );
    });

    it('no debe hacer nada en entorno SSR (window no definido)', () => {
      // Simular entorno SSR
      const originalWindow = global.window;
      delete global.window;

      setJSON('ssr-key', { data: 'test' });

      // No debe intentar acceder a localStorage
      expect(mockLocalStorage.setItem).not.toHaveBeenCalled();

      // Restaurar window
      global.window = originalWindow;
    });

    it('debe manejar excepciones del localStorage gracefully', () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });

      // No debe lanzar error, debe manejarlo silenciosamente
      expect(() => {
        setJSON('error-key', { large: 'data' });
      }).not.toThrow();

      expect(mockLocalStorage.setItem).toHaveBeenCalled();
    });

    it('debe serializar valores primitivos correctamente', () => {
      setJSON('string-key', 'hello');
      setJSON('number-key', 42);
      setJSON('boolean-key', true);
      setJSON('null-key', null);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('string-key', '"hello"');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('number-key', '42');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('boolean-key', 'true');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('null-key', 'null');
    });
  });

  describe('Integración getJSON y setJSON', () => {
    it('debe poder guardar y recuperar datos correctamente', () => {
      const testData = {
        consultas: [
          { id: 1, rut: '12345678-9', fecha: '2023-01-01' },
          { id: 2, rut: '87654321-0', fecha: '2023-01-02' }
        ]
      };

      // Simular el comportamiento real de localStorage
      const storage = {};
      mockLocalStorage.getItem.mockImplementation((key) => storage[key] || null);
      mockLocalStorage.setItem.mockImplementation((key, value) => {
        storage[key] = value;
      });

      // Guardar datos
      setJSON('consultas_test', testData);

      // Recuperar datos
      const retrieved = getJSON('consultas_test', []);

      expect(retrieved).toEqual(testData);
    });
  });
});