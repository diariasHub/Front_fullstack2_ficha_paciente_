# Configuración de Firebase - Colección de Cuentas

## Reglas de Firestore

Para que funcione correctamente el sistema de cuentas, debes actualizar las reglas de Firestore en Firebase Console:

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona tu proyecto: **sigep-53410**
3. En el menú lateral, ve a **Firestore Database**
4. Haz clic en la pestaña **Reglas**
5. Reemplaza las reglas con el siguiente código:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir acceso a consultas
    match /consultas/{document=**} {
      allow read, write: if true;
    }
    
    // Permitir acceso a insumos
    match /insumos/{document=**} {
      allow read, write: if true;
    }
    
    // Permitir acceso a cuentas
    match /cuentas/{document=**} {
      allow read, write: if true;
    }
  }
}
```

6. Haz clic en **Publicar** para guardar los cambios

## Colección: cuentas

### Estructura de documentos

Cada documento en la colección `cuentas` tiene la siguiente estructura:

```javascript
{
  usuario: "string",      // Nombre de usuario único
  password: "string",     // Contraseña en texto plano (para desarrollo)
  rut: "string",          // RUT del usuario
  cargo: "string",        // Cargo o rol (ej: "Administrador", "Enfermero", etc.)
  fecha: "string"         // Fecha de creación en formato locale
}
```

### Cuenta Administrador por Defecto

El sistema creará automáticamente una cuenta de administrador si no existe ninguna cuenta:

```javascript
{
  usuario: "admin",
  password: "admin",
  rut: "11111111-1",
  cargo: "Administrador",
  fecha: "[fecha actual]"
}
```

## Funcionalidades Implementadas

### 1. Login con Firebase
- **Archivo**: `pages/login.js`
- Valida credenciales contra la colección `cuentas` en Firebase
- Guarda información de sesión en localStorage
- Muestra spinner durante la validación
- Maneja errores de conexión

### 2. Gestión de Cuentas
- **Archivo**: `pages/cuentas.js`
- **Servicio**: `services/cuentaService.js`

**Operaciones disponibles:**
- ✅ Crear nueva cuenta
- ✅ Editar cuenta existente
- ✅ Eliminar cuenta (excepto admin)
- ✅ Listar todas las cuentas

### 3. Persistencia de Datos
- Todas las cuentas se guardan en Firebase Firestore
- Sincronización automática al crear, editar o eliminar
- Fallback a localStorage si Firebase no está disponible
- Carga inicial con spinner

## Seguridad

⚠️ **IMPORTANTE**: Las contraseñas actualmente se guardan en texto plano para propósitos de desarrollo. 

Para producción, se recomienda:
1. Usar Firebase Authentication en lugar de Firestore para cuentas
2. Hash de contraseñas con bcrypt o similar
3. Implementar reglas de seguridad más estrictas
4. Agregar validación de roles y permisos

## Uso del Sistema

### Crear una cuenta:
1. Inicia sesión como admin
2. Ve a "Gestión de Cuentas"
3. Completa el formulario con: Usuario, Contraseña, RUT, Cargo
4. Haz clic en "Crear Cuenta"
5. La cuenta se guarda en Firebase y aparece en la lista

### Iniciar sesión con nueva cuenta:
1. Cierra sesión (botón "Salir")
2. En el login, ingresa el usuario y contraseña creados
3. El sistema valida contra Firebase
4. Si las credenciales son correctas, accedes al dashboard

### Editar cuenta:
1. En la lista de cuentas, haz clic en "Editar"
2. Los campos se vuelven editables
3. Modifica los datos necesarios
4. Haz clic en "Guardar"
5. Los cambios se guardan en Firebase

### Eliminar cuenta:
1. Haz clic en "Borrar" (no disponible para admin)
2. Confirma la acción en el diálogo
3. La cuenta se elimina de Firebase
4. **Nota**: No se puede eliminar la cuenta "admin"

## Verificación

Para verificar que las cuentas se están guardando correctamente:

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona tu proyecto
3. Ve a **Firestore Database**
4. Busca la colección **cuentas**
5. Deberías ver todos los documentos de cuentas creadas

## Solución de Problemas

### Las cuentas no se guardan
- Verifica que las reglas de Firestore incluyan la colección `cuentas`
- Revisa la consola del navegador para errores de Firebase
- Asegúrate de que `.env.local` tenga `NEXT_PUBLIC_USE_FIREBASE=true`
- Desactiva extensiones de bloqueo (uBlock Origin, AdBlock)

### Error "Credenciales inválidas"
- Verifica que la cuenta existe en Firebase Console
- Asegúrate de escribir usuario y contraseña exactamente como fueron creados
- Revisa que Firebase esté funcionando correctamente

### La cuenta desaparece al cerrar sesión
- Si Firebase está funcionando, esto NO debería ocurrir
- Verifica la conexión a internet
- Revisa que las credenciales de Firebase en `.env.local` sean correctas
- Comprueba que no haya errores en la consola del navegador

## Compatibilidad

El sistema funciona en dos modos:

1. **Modo Firebase** (producción):
   - Requiere: `NEXT_PUBLIC_USE_FIREBASE=true`
   - Guarda en Firestore
   - Persistencia permanente

2. **Modo localStorage** (fallback):
   - Se activa si Firebase no está disponible
   - Solo para desarrollo local
   - Los datos se pierden al limpiar el navegador
