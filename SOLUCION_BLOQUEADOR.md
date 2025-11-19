# 🚨 Solución: ERR_BLOCKED_BY_CLIENT

## Problema
El error `ERR_BLOCKED_BY_CLIENT` ocurre cuando una extensión del navegador (bloqueador de anuncios, anti-tracking, etc.) bloquea las peticiones a Firebase.

## ✅ Soluciones Rápidas

### Opción 1: Desactivar Extensiones (Recomendado para desarrollo)

#### Chrome/Edge:
1. Haz clic en el ícono de extensiones (puzzle 🧩) en la barra superior
2. Desactiva temporalmente:
   - **uBlock Origin**
   - **AdBlock / AdBlock Plus**
   - **Privacy Badger**
   - **Ghostery**
   - Cualquier extensión anti-tracking

#### Firefox:
1. Menú (☰) → Complementos y temas
2. Desactiva las extensiones mencionadas arriba

---

### Opción 2: Agregar Excepción en uBlock Origin

Si usas **uBlock Origin**:

1. Haz clic en el ícono de **uBlock Origin** (escudo rojo)
2. Haz clic en el **botón de poder azul grande** (desactivar para este sitio)
3. Verás que se pone gris
4. Recarga la página con `Ctrl + Shift + R`

---

### Opción 3: Usar Modo Incógnito

Las extensiones están desactivadas por defecto en modo incógnito:

**Windows:**
```
Chrome: Ctrl + Shift + N
Edge: Ctrl + Shift + N
Firefox: Ctrl + Shift + P
```

Luego abre: `http://localhost:3000`

---

### Opción 4: Agregar Dominios Permitidos

En **uBlock Origin**:

1. Clic en el ícono → Abrir el tablero
2. Pestaña "Mis filtros"
3. Agrega estas líneas:

```
@@||firestore.googleapis.com^$domain=localhost
@@||firebase.googleapis.com^$domain=localhost
@@||firebaseapp.com^$domain=localhost
```

4. Aplica los cambios
5. Recarga tu aplicación

---

## 🔍 Verificar que Funcionó

1. Abre la consola del navegador (`F12`)
2. Ve a la pestaña **Console**
3. Recarga la página (`Ctrl + R`)
4. **NO** deberías ver errores `ERR_BLOCKED_BY_CLIENT`

---

## 📱 Para Producción

Cuando despliegues tu aplicación:
- Los usuarios finales necesitarán agregar tu dominio a las excepciones
- O puedes usar Firebase Hosting que tiene mejor compatibilidad
- Considera usar un proxy/API intermedio si muchos usuarios tienen bloqueadores

---

## 🆘 Si Nada Funciona

1. **Cierra completamente el navegador** y ábrelo de nuevo
2. **Limpia caché y cookies**: `Ctrl + Shift + Delete`
3. **Prueba con otro navegador** (Chrome, Edge, Firefox, Brave)
4. **Verifica tu firewall/antivirus** que no esté bloqueando conexiones

---

## ✅ Mejor Práctica para Desarrollo

Durante el desarrollo, usa un **perfil de navegador dedicado** sin extensiones:

**Chrome:**
```powershell
# Crear perfil de desarrollo limpio
chrome.exe --user-data-dir="C:\ChromeDev" http://localhost:3000
```

**Edge:**
```powershell
msedge.exe --user-data-dir="C:\EdgeDev" http://localhost:3000
```

Este perfil no tendrá extensiones y te evitará estos problemas.
