# Pruebas unitarias con Karma + Jasmine

Este proyecto incluye configuración para ejecutar pruebas unitarias con Jasmine usando Karma y Webpack.

## Cómo ejecutar

1. Instalar dependencias (si no lo hiciste):
```powershell
Set-Location -Path "c:\Users\Usuario\Desktop\fichas_paciente_prog\Front_fullstack2_ficha_paciente_"
cmd /c npm install
```

2. Ejecutar las pruebas:
```powershell
cmd /c npx karma start --single-run
```

Para TDD en caliente:
```powershell
cmd /c npx karma start
```

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
