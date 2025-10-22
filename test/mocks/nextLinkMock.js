import { vi } from 'vitest';

// Mock para Next.js Link
export const NextLinkMock = ({ children, href, ...props }) => {
  return <a href={href} {...props}>{children}</a>;
};

// Mock para useRouter de Next.js
export const createMockRouter = (overrides = {}) => ({
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn(),
  pathname: '/',
  route: '/',
  query: {},
  asPath: '/',
  basePath: '',
  isLocaleDomain: false,
  isReady: true,
  isPreview: false,
  isFallback: false,
  events: {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
  },
  ...overrides
});