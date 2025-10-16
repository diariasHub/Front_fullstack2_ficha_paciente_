import * as ls from '../services/localStorageService';
import { getInsumos, setInsumos, agregarInsumo, editarInsumo, borrarInsumo, descontarInsumos } from '../services/insumoService';

describe('insumoService (local mode)', () => {
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
    setInsumos([
      { id: 1, nombre: 'Guantes', cantidad: 10 },
      { id: 2, nombre: 'Jeringas', cantidad: 5 },
    ]);
  });

  it('getInsumos returns list', () => {
    const list = getInsumos();
    expect(Array.isArray(list)).toBeTrue();
    expect(list.length).toBe(2);
  });

  it('agregarInsumo adds item with incremented id', () => {
    agregarInsumo('Alcohol', 3);
    const list = getInsumos();
    expect(list.some(i => i.nombre === 'Alcohol' && i.cantidad === 3)).toBeTrue();
  });

  it('editarInsumo updates existing', () => {
    editarInsumo(1, 'Guantes Nitrilo', 8);
    const list = getInsumos();
    const item = list.find(i => i.id === 1);
    expect(item.nombre).toBe('Guantes Nitrilo');
    expect(item.cantidad).toBe(8);
  });

  it('borrarInsumo removes by id', () => {
    borrarInsumo(2);
    const list = getInsumos();
    expect(list.find(i => i.id === 2)).toBeUndefined();
  });

  it('descontarInsumos decrements but not below zero', () => {
    descontarInsumos([{ id: 1, cantidad: 20 }]);
    const list = getInsumos();
    const item = list.find(i => i.id === 1);
    expect(item.cantidad).toBe(0);
  });
});
