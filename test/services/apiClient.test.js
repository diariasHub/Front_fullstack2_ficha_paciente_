import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useApi, apiGet, apiPost, apiPut, apiDelete } from '@services/apiClient';

// Mock de fetch global
global.fetch = vi.fn();

describe('apiClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset process.env antes de cada test
    delete process.env.NEXT_PUBLIC_USE_API;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('useApi', () => {
    it('debe retornar true cuando NEXT_PUBLIC_USE_API es "true"', () => {
      process.env.NEXT_PUBLIC_USE_API = 'true';

      const result = useApi();

      expect(result).toBe(true);
    });

    it('debe retornar false cuando NEXT_PUBLIC_USE_API es "false"', () => {
      process.env.NEXT_PUBLIC_USE_API = 'false';

      const result = useApi();

      expect(result).toBe(false);
    });

    it('debe retornar false cuando NEXT_PUBLIC_USE_API no está definido', () => {
      delete process.env.NEXT_PUBLIC_USE_API;

      const result = useApi();

      expect(result).toBe(false);
    });

    it('debe retornar false cuando process no está definido', () => {
      const originalProcess = global.process;
      delete global.process;

      const result = useApi();

      expect(result).toBe(false);

      // Restaurar process
      global.process = originalProcess;
    });

    it('debe manejar errores gracefully', () => {
      // Simular un error al acceder a process.env
      const originalProcess = global.process;
      global.process = {
        get env() {
          throw new Error('Access denied');
        }
      };

      const result = useApi();

      expect(result).toBe(false);

      // Restaurar process
      global.process = originalProcess;
    });
  });

  describe('apiGet', () => {
    it('debe realizar una petición GET exitosa y retornar JSON', async () => {
      const mockData = { id: 1, name: 'Test Data' };
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockData)
      };

      fetch.mockResolvedValue(mockResponse);

      const result = await apiGet('/api/test');

      expect(fetch).toHaveBeenCalledWith('/api/test');
      expect(mockResponse.json).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });

    it('debe lanzar error cuando la respuesta no es ok', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found'
      };

      fetch.mockResolvedValue(mockResponse);

      await expect(apiGet('/api/notfound')).rejects.toThrow('GET /api/notfound failed');
      expect(fetch).toHaveBeenCalledWith('/api/notfound');
    });

    it('debe manejar errores de red', async () => {
      fetch.mockRejectedValue(new Error('Network error'));

      await expect(apiGet('/api/test')).rejects.toThrow('Network error');
    });
  });

  describe('apiPost', () => {
    it('debe realizar una petición POST exitosa con body', async () => {
      const requestBody = { name: 'New Item', type: 'test' };
      const responseData = { id: 1, ...requestBody };
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(responseData)
      };

      fetch.mockResolvedValue(mockResponse);

      const result = await apiPost('/api/items', requestBody);

      expect(fetch).toHaveBeenCalledWith('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      expect(result).toEqual(responseData);
    });

    it('debe lanzar error cuando la respuesta POST no es ok', async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        statusText: 'Bad Request'
      };

      fetch.mockResolvedValue(mockResponse);

      await expect(apiPost('/api/items', {})).rejects.toThrow('POST /api/items failed');
    });

    it('debe manejar body nulo o undefined', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({ success: true })
      };

      fetch.mockResolvedValue(mockResponse);

      await apiPost('/api/test', null);

      expect(fetch).toHaveBeenCalledWith('/api/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'null'
      });
    });
  });

  describe('apiPut', () => {
    it('debe realizar una petición PUT exitosa', async () => {
      const updateData = { id: 1, name: 'Updated Item' };
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(updateData)
      };

      fetch.mockResolvedValue(mockResponse);

      const result = await apiPut('/api/items/1', updateData);

      expect(fetch).toHaveBeenCalledWith('/api/items/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      expect(result).toEqual(updateData);
    });

    it('debe lanzar error cuando la respuesta PUT no es ok', async () => {
      const mockResponse = {
        ok: false,
        status: 422,
        statusText: 'Unprocessable Entity'
      };

      fetch.mockResolvedValue(mockResponse);

      await expect(apiPut('/api/items/1', {})).rejects.toThrow('PUT /api/items/1 failed');
    });
  });

  describe('apiDelete', () => {
    it('debe realizar una petición DELETE exitosa', async () => {
      const mockResponse = {
        ok: true
      };

      fetch.mockResolvedValue(mockResponse);

      const result = await apiDelete('/api/items/1');

      expect(fetch).toHaveBeenCalledWith('/api/items/1', {
        method: 'DELETE'
      });
      expect(result).toBe(true);
    });

    it('debe lanzar error cuando la respuesta DELETE no es ok', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found'
      };

      fetch.mockResolvedValue(mockResponse);

      await expect(apiDelete('/api/items/999')).rejects.toThrow('DELETE /api/items/999 failed');
    });

    it('debe retornar true independientemente del contenido de la respuesta', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({ message: 'Deleted successfully' })
      };

      fetch.mockResolvedValue(mockResponse);

      const result = await apiDelete('/api/items/1');

      expect(result).toBe(true);
      // No debe llamar .json() ya que DELETE retorna true directamente
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });

  describe('Integración de funciones API', () => {
    it('debe manejar flujo completo CRUD', async () => {
      // CREATE (POST)
      const createData = { name: 'Test Item', description: 'Test Description' };
      const createdItem = { id: 1, ...createData };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(createdItem)
      });

      const created = await apiPost('/api/items', createData);
      expect(created).toEqual(createdItem);

      // READ (GET)
      fetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(createdItem)
      });

      const read = await apiGet('/api/items/1');
      expect(read).toEqual(createdItem);

      // UPDATE (PUT)
      const updateData = { ...createdItem, name: 'Updated Item' };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(updateData)
      });

      const updated = await apiPut('/api/items/1', updateData);
      expect(updated).toEqual(updateData);

      // DELETE
      fetch.mockResolvedValueOnce({
        ok: true
      });

      const deleted = await apiDelete('/api/items/1');
      expect(deleted).toBe(true);
    });
  });
});