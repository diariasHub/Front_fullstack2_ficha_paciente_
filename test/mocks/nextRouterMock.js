import { vi } from 'vitest';

// Mock completo para Next.js Router
export const mockRouter = {
  push: vi.fn(() => Promise.resolve()),
  replace: vi.fn(() => Promise.resolve()),
  prefetch: vi.fn(() => Promise.resolve()),
  back: vi.fn(),
  reload: vi.fn(),
  route: '/',
  pathname: '/',
  query: {},
  asPath: '/',
  basePath: '',
  isLocaleDomain: true,
  isReady: true,
  isPreview: false,
  isFallback: false,
  events: {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
  },
  beforePopState: vi.fn(),
};

// Factory para crear router personalizado
export const createMockRouter = (overrides = {}) => ({
  ...mockRouter,
  ...overrides
});

// Hook para usar en tests
export const useRouterMock = vi.fn(() => mockRouter);

// Para resetear mocks entre tests
export const resetRouterMocks = () => {
  Object.values(mockRouter).forEach(mock => {
    if (typeof mock === 'function' && mock.mockClear) {
      mock.mockClear();
    }
  });
  useRouterMock.mockClear();
};