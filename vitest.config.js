import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    // Configuración del entorno de pruebas
    environment: 'jsdom',
    
    // Archivos de setup que se ejecutan antes de cada test
    setupFiles: ['./test/setup.js'],
    
    // Patrones de archivos de prueba
    include: [
      'test/**/*.test.{js,ts,jsx,tsx}',
      'test/**/*.spec.{js,ts,jsx,tsx}'
    ],
    
    // Archivos a excluir
    exclude: [
      'node_modules',
      'dist',
      '.next'
    ],
    
    // Configuración de coverage (cobertura)
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      reportsDirectory: './test/coverage',
      exclude: [
        'node_modules/',
        'test/',
        '*.config.js',
        '.next/',
        'pages/_app.js',
        'pages/_document.js'
      ]
    },
    
    // Configuración de globals
    globals: true,
    
    // Timeout para las pruebas
    testTimeout: 10000,
    
    // Configuración de mocks
    mockReset: true,
    clearMocks: true,
    restoreMocks: true
  },
  
  resolve: {
    alias: {
      // Alias para importaciones más limpias
      '@': path.resolve(__dirname, './'),
      '@components': path.resolve(__dirname, './components'),
      '@pages': path.resolve(__dirname, './pages'),
      '@services': path.resolve(__dirname, './services'),
      '@lib': path.resolve(__dirname, './lib'),
      '@styles': path.resolve(__dirname, './styles'),
      '@test': path.resolve(__dirname, './test')
    }
  }
});