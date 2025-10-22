# 🧪 Documentación del Entorno de Pruebas - Fichas Paciente

## 🎉 **ESTADO FINAL: COMPLETADO CON ÉXITO**

### **Resultado Final: 100% ÉXITO**

```
✅ Test Files: 7/7 pasando (100%)
✅ Tests: 122/122 pasando (100%)
✅ Duration: 7.62s
```

### **Desglose por Categorías:**

#### **Services (72 tests)**
- ✅ apiClient.test.js: 17/17 
- ✅ consultaService.test.js: 19/19
- ✅ insumoService.test.js: 25/25  
- ✅ localStorageService.test.js: 11/11

#### **Components (32 tests)**
- ✅ Navbar.test.js: 14/14
- ✅ Sidebar.test.js: 18/18

#### **Pages (18 tests)**
- ✅ login.test.js: 18/18

---

## 📋 Índice

1. [Introducción](#introducción)
2. [Configuración del Entorno](#configuración-del-entorno)
3. [Estructura de Carpetas](#estructura-de-carpetas)
4. [Herramientas Utilizadas](#herramientas-utilizadas)
5. [Configuración de Vitest](#configuración-de-vitest)
6. [Tipos de Pruebas](#tipos-de-pruebas)
7. [Ejecución de Pruebas](#ejecución-de-pruebas)
8. [Cobertura de Código](#cobertura-de-código)
9. [Buenas Prácticas](#buenas-prácticas)
10. [Resolución de Problemas](#resolución-de-problemas)

---

## 🎯 Introducción

Este documento describe la implementación completa del entorno de pruebas unitarias para la aplicación **Fichas Paciente**, desarrollada con Next.js y React. El sistema de pruebas utiliza **Vitest** como framework principal, complementado con **Testing Library** para pruebas de componentes React.

### Objetivos del Sistema de Pruebas

- ✅ **Calidad del Código**: Garantizar la funcionalidad correcta de todos los componentes
- ✅ **Detección Temprana de Errores**: Identificar problemas antes de la producción
- ✅ **Refactoring Seguro**: Permitir cambios de código con confianza
- ✅ **Documentación Viva**: Las pruebas sirven como documentación de comportamiento
- ✅ **Integración Continua**: Base para CI/CD automatizado

---

## ⚙️ Configuración del Entorno

### Dependencias Instaladas

```json
{
  "devDependencies": {
    "vitest": "^4.0.1",
    "@testing-library/react": "^16.3.0",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/user-event": "^14.6.1",
    "@vitejs/plugin-react": "^5.0.4",
    "jsdom": "^27.0.1",
    "happy-dom": "^20.0.8"
  }
}
```

### Scripts de NPM

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:coverage:watch": "vitest --coverage",
    "test:services": "vitest run test/services",
    "test:components": "vitest run test/components",
    "test:pages": "vitest run test/pages"
  }
}
```

---

## 📁 Estructura de Carpetas

```
test/
├── setup.js                    # Configuración global de pruebas
├── components/                 # Pruebas de componentes React
│   ├── Navbar.test.js
│   └── Sidebar.test.js
├── services/                   # Pruebas de servicios de negocio
│   ├── apiClient.test.js
│   ├── consultaService.test.js
│   ├── insumoService.test.js
│   └── localStorageService.test.js
├── pages/                      # Pruebas de páginas Next.js
│   └── login.test.js
├── mocks/                      # Mocks reutilizables
│   ├── nextLinkMock.js
│   └── nextRouterMock.js
├── utils/                      # Utilidades para pruebas
└── coverage/                   # Reportes de cobertura (generado)
```

### Descripción de Directorios

- **`test/components/`**: Pruebas de componentes React que verifican renderizado, interacciones y estado
- **`test/services/`**: Pruebas de lógica de negocio, manejo de datos y comunicación con APIs
- **`test/pages/`**: Pruebas de páginas completas incluyendo formularios y navegación
- **`test/mocks/`**: Mocks compartidos para Next.js, APIs externas y servicios
- **`test/utils/`**: Funciones auxiliares y helpers para las pruebas

---

## 🛠️ Herramientas Utilizadas

### Vitest
- **Framework de pruebas** moderno y rápido
- Compatible con ES modules
- Hot Module Replacement (HMR) para pruebas
- Integración nativa con Vite

### Testing Library
- **@testing-library/react**: Para pruebas de componentes React
- **@testing-library/jest-dom**: Matchers adicionales para DOM
- **@testing-library/user-event**: Simulación de eventos de usuario

### JSDOM
- Simulación del entorno DOM en Node.js
- Permite probar componentes React sin navegador

---

## ⚡ Configuración de Vitest

### Archivo `vitest.config.js`

```javascript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.js'],
    include: [
      'test/**/*.test.{js,ts,jsx,tsx}',
      'test/**/*.spec.{js,ts,jsx,tsx}'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      reportsDirectory: './test/coverage'
    },
    globals: true,
    testTimeout: 10000
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@components': path.resolve(__dirname, './components'),
      '@services': path.resolve(__dirname, './services'),
      '@pages': path.resolve(__dirname, './pages'),
      '@test': path.resolve(__dirname, './test')
    }
  }
});
```

### Archivo `test/setup.js`

Configuración global que incluye:
- Mocks de Next.js (Router, Link, Image)
- Mocks de Web APIs (localStorage, sessionStorage)
- Configuración de Testing Library
- Limpieza automática de mocks

---

## 🔬 Tipos de Pruebas

### 1. Pruebas de Servicios

**Ubicación**: `test/services/`

**Qué se prueba**:
- Funciones de manejo de datos
- Comunicación con APIs
- Manejo de localStorage
- Lógica de negocio

**Ejemplo**:
```javascript
describe('consultaService', () => {
  it('debe guardar consulta correctamente', () => {
    const consulta = { rut: '12345678-9', fecha: '2023-01-01' };
    const resultado = guardarConsulta(consulta);
    
    expect(resultado).toHaveProperty('id');
    expect(resultado.rut).toBe('12345678-9');
  });
});
```

### 2. Pruebas de Componentes

**Ubicación**: `test/components/`

**Qué se prueba**:
- Renderizado correcto
- Interacciones del usuario
- Estados del componente
- Props y eventos

**Ejemplo**:
```javascript
describe('Navbar', () => {
  it('debe mostrar enlace de admin solo para usuarios admin', () => {
    localStorage.setItem('usuario', 'admin');
    render(<Navbar />);
    
    expect(screen.getByText('Cuentas')).toBeInTheDocument();
  });
});
```

### 3. Pruebas de Páginas

**Ubicación**: `test/pages/`

**Qué se prueba**:
- Formularios completos
- Navegación
- Autenticación
- Integración de componentes

**Ejemplo**:
```javascript
describe('LoginPage', () => {
  it('debe autenticar usuario correctamente', async () => {
    render(<LoginPage />);
    
    await userEvent.type(screen.getByPlaceholderText('Usuario'), 'admin');
    await userEvent.type(screen.getByPlaceholderText('Contraseña'), 'admin');
    await userEvent.click(screen.getByText('Ingresar'));
    
    expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
  });
});
```

---

## 🚀 Ejecución de Pruebas

### Comandos Principales

```bash
# Ejecutar todas las pruebas una vez
npm test

# Ejecutar pruebas en modo watch (reejecuta al cambiar archivos)
npm run test:watch

# Ejecutar pruebas con interfaz gráfica
npm run test:ui

# Ejecutar solo pruebas de servicios
npm run test:services

# Ejecutar solo pruebas de componentes
npm run test:components

# Ejecutar solo pruebas de páginas
npm run test:pages
```

### Opciones de Ejecución

```bash
# Ejecutar pruebas específicas
npx vitest run test/services/apiClient.test.js

# Ejecutar pruebas que coincidan con un patrón
npx vitest run --reporter=verbose

# Ejecutar con diferentes niveles de verbosidad
npx vitest run --reporter=dot
npx vitest run --reporter=verbose
npx vitest run --reporter=basic
```

---

## 📊 Cobertura de Código

### Generar Reportes de Cobertura

```bash
# Generar reporte de cobertura una vez
npm run test:coverage

# Generar reporte en modo watch
npm run test:coverage:watch
```

### Ubicación de Reportes

- **HTML**: `test/coverage/index.html` - Reporte visual navegable
- **JSON**: `test/coverage/coverage-final.json` - Datos en formato JSON
- **Texto**: Mostrado en consola

### Métricas de Cobertura

- **Statements**: Líneas de código ejecutadas
- **Branches**: Ramas de código ejecutadas (if/else)
- **Functions**: Funciones ejecutadas
- **Lines**: Porcentaje de líneas cubiertas

### Objetivos de Cobertura

| Componente | Objetivo Mínimo | Objetivo Ideal |
|------------|----------------|----------------|
| Servicios  | 90%            | 95%            |
| Componentes| 85%            | 90%            |
| Páginas    | 80%            | 85%            |
| Global     | 85%            | 90%            |

---

## ✅ Buenas Prácticas

### 1. Estructura de Pruebas

```javascript
describe('NombreDelComponente', () => {
  describe('Funcionalidad específica', () => {
    it('debe hacer algo específico', () => {
      // Arrange (Preparar)
      const props = { prop1: 'value1' };
      
      // Act (Actuar)
      render(<Component {...props} />);
      
      // Assert (Verificar)
      expect(screen.getByText('Expected text')).toBeInTheDocument();
    });
  });
});
```

### 2. Nombres Descriptivos

❌ **Malo**:
```javascript
it('test login', () => {});
```

✅ **Bueno**:
```javascript
it('debe mostrar error cuando las credenciales son incorrectas', () => {});
```

### 3. Limpieza de Mocks

```javascript
beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});
```

### 4. Pruebas Independientes

Cada prueba debe:
- Ser independiente de otras pruebas
- Tener su propio setup y cleanup
- No depender del orden de ejecución

### 5. Uso de Selectores

✅ **Preferir**:
```javascript
// Por rol
screen.getByRole('button', { name: /submit/i });

// Por texto
screen.getByText('Expected text');

// Por label
screen.getByLabelText('Email');
```

❌ **Evitar**:
```javascript
// Por clase CSS
container.querySelector('.btn-primary');

// Por ID
container.querySelector('#submit-btn');
```

---

## 🔧 Resolución de Problemas

### Problemas Comunes

#### 1. Error: "window is not defined"

**Causa**: Intento de usar APIs del navegador en entorno Node.js

**Solución**:
```javascript
// En setup.js o en la prueba
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});
```

#### 2. Error: "useRouter must be used within Router"

**Causa**: Componente usa useRouter fuera del contexto de Next.js

**Solución**:
```javascript
vi.mock('next/router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    pathname: '/current-path'
  })
}));
```

#### 3. Error: "Cannot read property of undefined"

**Causa**: Mock no configurado correctamente

**Solución**:
```javascript
// Verificar que todos los métodos necesarios estén mockeados
const mockService = {
  method1: vi.fn().mockReturnValue('value'),
  method2: vi.fn().mockResolvedValue('async value')
};
```

### Debugging de Pruebas

```javascript
// Imprimir el estado actual del DOM
screen.debug();

// Imprimir un elemento específico
screen.debug(screen.getByRole('button'));

// Consultar elementos que pueden no existir
screen.queryByText('Maybe not there');

// Esperar por elementos asincrónicos
await waitFor(() => {
  expect(screen.getByText('Async text')).toBeInTheDocument();
});
```

---

## 📈 Métricas y Monitoreo

### KPIs de Pruebas

1. **Cobertura de Código**: >= 85%
2. **Tiempo de Ejecución**: < 30 segundos
3. **Número de Pruebas**: ~150+ pruebas
4. **Tasa de Éxito**: 100%

### Reportes Automáticos

Las pruebas generan reportes automáticos en:
- Consola (durante desarrollo)
- Archivos HTML (para revisión visual)
- JSON (para integración con CI/CD)

---

## 🎯 Próximos Pasos

1. **Ampliar Cobertura**: Agregar pruebas para páginas restantes
2. **Pruebas E2E**: Implementar Playwright o Cypress
3. **CI/CD**: Integrar con GitHub Actions
4. **Performance**: Agregar pruebas de rendimiento
5. **Accesibilidad**: Incluir pruebas de a11y

---

## 📚 Recursos Adicionales

- [Documentación de Vitest](https://vitest.dev/)
- [Testing Library Docs](https://testing-library.com/)
- [Next.js Testing Guide](https://nextjs.org/docs/testing)
- [React Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**Última actualización**: Octubre 2025  
**Versión**: 1.0  
**Mantenido por**: Equipo de Desarrollo

También puedes usar los scripts de npm:
- Ejecutar una sola vez: `cmd /c npm run test`
- Modo watch: `cmd /c npm run test:watch`

## Estructura
- `karma.conf.js`: configuración de Karma (framework Jasmine, ChromeHeadless, webpack + babel-loader).
- `.babelrc`: presets de Babel para transpilar JS/JSX.
- `tests/**/*.spec.js`: archivos de prueba.

## Dónde están las pruebas de ejemplo
- `tests/localStorageService.spec.js`
- `tests/insumoService.spec.js`
- `tests/consultaService.spec.js`
- `tests/Navbar.spec.js` (componente)
- `tests/Sidebar.spec.js` (componente)

Estas cubren persistencia local (localStorage), lógica de negocio básica de insumos/consultas y pruebas de componentes base (Navbar y Sidebar).

## Pruebas de componentes (React Testing Library)
Para componentes React usamos React Testing Library (RTL), ya incluida en devDependencies. Además, se mockean módulos de Next para ambiente de pruebas:
- `tests/mocks/nextLinkMock.js` para `next/link`
- `tests/mocks/nextRouterMock.js` para `next/router`

Ejemplo mínimo de test de componente con RTL:
```js
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../components/Navbar';

describe('Navbar', () => {
  it('muestra la marca y el botón Salir', () => {
    render(<Navbar />);
    expect(screen.getByText('Fichas')).toBeTruthy();
    expect(screen.getByRole('button', { name: /salir/i })).toBeTruthy();
  });

  it('dispara acción al hacer click en Salir', () => {
    render(<Navbar />);
    fireEvent.click(screen.getByRole('button', { name: /salir/i }));
    // Asserts adicionales según el comportamiento (p.ej. navegación o limpieza de storage)
  });
});
```

## Escribir nuevas pruebas
Crea un archivo `tests/<nombre>.spec.js` por módulo. Ejemplo mínimo:
```js
describe('miModulo', () => {
  it('hace algo', () => {
    expect(1 + 1).toBe(2);
  });
});
```

## Consejos
- Mockea `window.localStorage` y otras APIs del navegador que uses.
- Para servicios que llaman a la API, separa la lógica pura y usa mocks/stubs en tests.
- Si necesitas simular fetch, usa un mock simple o libraries como `whatwg-fetch`/`jest-fetch-mock` (adaptando configuración si fuera necesario).

## Integración continua
En pipelines, usa `npx karma start --single-run` en un entorno con ChromeHeadless disponible (o usa `karma-firefox-launcher`).

## Resultado actual
Al momento de escribir esto, el suite ejecuta 11 pruebas y todas pasan en ChromeHeadless.
