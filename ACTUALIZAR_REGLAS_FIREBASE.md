# IMPORTANTE: Actualizar Reglas de Firestore

## 🔥 Acción Requerida

Para que el sistema de cuentas funcione correctamente, DEBES actualizar las reglas de Firestore:

### Paso 1: Ir a Firebase Console
1. Abre: https://console.firebase.google.com
2. Selecciona el proyecto: **sigep-53410**

### Paso 2: Navegar a Firestore
1. En el menú lateral, haz clic en **Firestore Database**
2. Haz clic en la pestaña **Reglas** (Rules)

### Paso 3: Actualizar las Reglas
Reemplaza todo el contenido con estas reglas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Colección de consultas médicas
    match /consultas/{document=**} {
      allow read, write: if true;
    }
    
    // Colección de insumos médicos
    match /insumos/{document=**} {
      allow read, write: if true;
    }
    
    // Colección de cuentas de usuario (NUEVA)
    match /cuentas/{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Paso 4: Publicar
1. Haz clic en el botón **Publicar** (Publish)
2. Confirma los cambios

## ✅ Verificación

Después de actualizar las reglas:

1. Intenta crear una cuenta nueva desde la página de Cuentas
2. Cierra sesión
3. Inicia sesión con la nueva cuenta
4. Verifica que la cuenta persiste después de cerrar sesión

## 📝 Nota de Seguridad

⚠️ Estas reglas permiten acceso completo (lectura/escritura) a todos los usuarios. Son apropiadas para desarrollo pero NO para producción.

Para producción, considera:
- Implementar Firebase Authentication
- Agregar reglas basadas en autenticación
- Validar roles y permisos
- Hash de contraseñas

## 🐛 Si hay problemas

Si después de actualizar las reglas aún hay problemas:

1. Verifica que `.env.local` tenga:
   ```
   NEXT_PUBLIC_USE_FIREBASE=true
   ```

2. Desactiva extensiones bloqueadoras (uBlock Origin, AdBlock)

3. Revisa la consola del navegador (F12) para errores de Firebase

4. Verifica que todas las credenciales de Firebase en `.env.local` sean correctas
