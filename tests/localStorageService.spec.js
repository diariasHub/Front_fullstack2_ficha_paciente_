import { getJSON, setJSON } from '../services/localStorageService';

describe('localStorageService', () => {
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
  });

  it('should return fallback when not set', () => {
    expect(getJSON('x', 123)).toBe(123);
  });

  it('should store and read JSON', () => {
    setJSON('obj', { a: 1 });
    expect(getJSON('obj', null)).toEqual({ a: 1 });
  });
});
