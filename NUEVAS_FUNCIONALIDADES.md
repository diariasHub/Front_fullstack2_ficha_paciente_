# Nuevas Funcionalidades Implementadas

## 📊 Gráfico de Stock de Insumos

### Ubicación
- **Archivo**: `pages/graficos.js`
- **Sección**: Nueva tarjeta en la página de gráficos

### Características
✅ **Visualización de Stock**: Muestra todos los insumos médicos disponibles en el inventario
✅ **Alertas de Stock Bajo**: Barras en color ROJO para insumos con ≤20% del stock inicial
✅ **Barras Normales**: Color púrpura (#667eea) para insumos con stock adecuado
✅ **Tooltip Detallado**: Al pasar el mouse sobre las barras, muestra:
   - Nombre del insumo
   - Cantidad actual
   - Porcentaje del stock inicial
   - Indicador visual de alerta (⚠️) si el stock es bajo

✅ **Lista de Insumos Críticos**: Debajo del gráfico aparece un panel de alerta roja con:
   - Listado de todos los insumos con stock crítico
   - Cantidad actual y porcentaje para cada uno

### Referencias de Stock Inicial
```javascript
const STOCK_INICIAL = {
  'Guantes': 20,
  'Jeringas': 15,
  'Alcohol': 10,
  'Gasas': 25,
  'Esparadrapo': 8,
  'Termómetro': 5
};
```

---

## 🔍 Filtro DIAE en Consultas

### Ubicación
- **Archivo**: `pages/consultas.js`
- **Sección**: Formulario de filtros y tabla de resultados

### Características
✅ **Checkbox de Filtro**: Nueva opción "Mostrar solo consultas con DIAE"
   - Ícono de escudo para fácil identificación
   - Filtra automáticamente la lista al activarse

✅ **Columna DIAE en Tabla**: Nueva columna que muestra:
   - Badge verde con ícono de escudo si aplica DIAE
   - Ícono de imagen adicional si tiene fotografía adjunta
   - Badge gris "-" si no aplica DIAE

✅ **Botones de Exportación**: Aparecen solo cuando el filtro DIAE está activo
   - **Descargar CSV**: 
     - Genera archivo con formato: `consultas_diae_YYYY-MM-DD.csv`
     - Incluye: Nombre, RUT, Edad, Carrera, Teléfono, Fecha, Hora, Motivo, Tratamiento
     - Muestra contador de registros incluidos
   - **Imprimir**: 
     - Abre diálogo de impresión del navegador
     - Perfecto para generar reportes físicos

### Uso
1. Marca el checkbox "Mostrar solo consultas con DIAE"
2. La tabla filtra automáticamente
3. Aparecen los botones de descarga e impresión
4. Haz clic en "Descargar CSV" para exportar datos
5. Haz clic en "Imprimir" para generar reporte físico

---

## 🎨 Mejoras Visuales

### Gráfico de Insumos
- Header con fondo amarillo de advertencia (bg-warning)
- Ícono de caja de suministros
- Alert amarillo explicativo en la parte superior
- Alert rojo para insumos críticos (solo visible si hay stock bajo)

### Filtro DIAE
- Checkbox con ícono de escudo verde
- Botón de descarga verde (btn-success)
- Botón de impresión outline azul
- Badges con colores semánticos (verde para DIAE activo, gris para sin DIAE)

---

## 🚀 Instrucciones de Uso

### Para visualizar el gráfico de insumos:
1. Navega a "Gráficos y Estadísticas" en el menú lateral
2. Desplázate hasta la sección "Stock de Insumos Médicos"
3. Observa las barras:
   - **Rojas**: Stock crítico (≤20%)
   - **Púrpuras**: Stock normal
4. Si hay alertas, revisa la lista de insumos críticos en el panel rojo

### Para filtrar y exportar consultas DIAE:
1. Ve a "Consultas Realizadas" en el menú
2. Marca "Mostrar solo consultas con DIAE"
3. Verifica la columna DIAE con badges verdes
4. Haz clic en "Descargar CSV" para obtener el archivo
5. O haz clic en "Imprimir" para generar un reporte físico

---

## 📝 Notas Técnicas

### Stock Inicial
- Los valores de `STOCK_INICIAL` se pueden ajustar en `pages/graficos.js`
- El cálculo del 20% se realiza automáticamente
- Si agregas nuevos insumos, actualiza también `STOCK_INICIAL`

### Exportación CSV
- Formato estándar con comillas dobles
- Codificación UTF-8
- Compatible con Excel, Google Sheets, etc.
- Nombre de archivo con fecha automática

### Columna DIAE
- Badge verde: Aplica DIAE
- Ícono de imagen: Tiene foto adjunta
- Badge gris: No aplica DIAE
- Tooltip muestra "Con imagen" o "Sin imagen" al pasar el mouse

---

## ✨ Estado del Proyecto

### ✅ Completado
- Gráfico de insumos con alertas de stock bajo
- Filtro DIAE en consultas
- Exportación CSV de registros DIAE
- Funcionalidad de impresión
- Columna visual DIAE en tabla
- Indicadores de imágenes adjuntas

### 🎯 Funciones Principales
- Visualización de stock en tiempo real
- Alertas automáticas de stock crítico
- Filtrado inteligente por DIAE
- Exportación de datos para reportes
- Impresión de registros
- Indicadores visuales claros

---

**Fecha de Implementación**: 2025
**Tecnologías**: React, Recharts, Bootstrap 5, Firebase
**Desarrollado para**: Sistema de Gestión de Pacientes (SIGEP)
