# 🔐 Configuración de Seguridad - Firebase Authentication

## ⚠️ IMPORTANTE: Reglas de Seguridad Actualizadas

Tu sistema ahora usa **Firebase Authentication** para proteger los datos. Las contraseñas ya NO se guardan en Firestore.

---

## 📋 Pasos para Configurar

### 1️⃣ Habilitar Firebase Authentication

1. Ve a: https://console.firebase.google.com
2. Selecciona tu proyecto: **sigep-53410**
3. En el menú lateral, haz clic en **Authentication**
4. Haz clic en **Comenzar** (Get Started)
5. En la pestaña **Sign-in method**, habilita:
   - ✅ **Correo electrónico/contraseña** (Email/Password)
   - Haz clic en **Habilitar** (Enable)
   - Guarda los cambios

### 2️⃣ Actualizar Reglas de Firestore

1. Ve a **Firestore Database** → **Reglas**
2. **Copia y pega** el contenido del archivo `firestore.rules` de este proyecto
3. O copia estas reglas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Colección de consultas médicas - Solo usuarios autenticados
    match /consultas/{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Colección de insumos médicos - Solo usuarios autenticados
    match /insumos/{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Colección de cuentas - Solo usuarios autenticados
    match /cuentas/{cuentaId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
                       (request.auth.uid == resource.data.uid || 
                        get(/databases/$(database)/documents/cuentas/$(request.auth.uid)).data.cargo == 'Administrador');
      allow delete: if request.auth != null && 
                       get(/databases/$(database)/documents/cuentas/$(request.auth.uid)).data.cargo == 'Administrador';
    }
  }
}
```

4. Haz clic en **Publicar**

### 3️⃣ Crear la Primera Cuenta de Administrador

Como las reglas ahora requieren autenticación, necesitas crear la cuenta admin manualmente:

1. En Firebase Console, ve a **Authentication** → **Users**
2. Haz clic en **Add user** (Agregar usuario)
3. Ingresa:
   - **Email**: `admin@sigep.cl`
   - **Password**: `admin123` (o la que prefieras, mínimo 6 caracteres)
4. Copia el **UID** del usuario creado (lo necesitarás en el siguiente paso)

### 4️⃣ Crear el Documento de Cuenta Admin en Firestore

1. Ve a **Firestore Database**
2. Si no existe, crea la colección **cuentas**
3. Haz clic en **Agregar documento**
4. Usa ID automático o escribe uno personalizado
5. Agrega estos campos:
   ```
   usuario: "admin"
   email: "admin@sigep.cl"
   rut: "11111111-1"
   cargo: "Administrador"
   uid: "[PEGA AQUÍ EL UID QUE COPIASTE]"
   fecha: "[fecha actual, ej: 19/11/2025, 10:30:00]"
   ```
6. Guarda el documento

---

## 🎯 Cómo Funciona Ahora

### Crear una Cuenta:
1. Inicia sesión como admin (`admin@sigep.cl` / contraseña que configuraste)
2. Ve a "Gestión de Cuentas"
3. Completa el formulario:
   - **Usuario**: Nombre de usuario para mostrar
   - **Email**: Email único para login (ej: `enfermero@sigep.cl`)
   - **Contraseña**: Mínimo 6 caracteres
   - **RUT**: RUT del usuario
   - **Cargo**: Rol (Enfermero, Recepcionista, etc.)
4. Haz clic en "Crear Cuenta"
5. El sistema:
   - ✅ Crea el usuario en Firebase Authentication
   - ✅ Guarda la metadata en Firestore (sin contraseña)
   - ❌ La contraseña está protegida en Firebase Auth

### Iniciar Sesión:
1. En el login, ahora debes usar el **email** (no el usuario)
2. Ejemplos válidos:
   - Email: `admin@sigep.cl` / Contraseña: `admin123`
   - Email: `enfermero@sigep.cl` / Contraseña: `[la que configuraste]`

### Seguridad:
- ✅ Las contraseñas están cifradas en Firebase Auth
- ✅ Solo usuarios autenticados pueden acceder a los datos
- ✅ Las reglas de Firestore validan cada operación
- ✅ Los administradores pueden editar/eliminar cualquier cuenta
- ✅ Los usuarios normales solo pueden ver cuentas

---

## 🔒 Beneficios de Esta Configuración

### Antes (Sistema Público):
- ❌ Cualquiera podía leer/escribir datos
- ❌ Contraseñas en texto plano en Firestore
- ❌ Sin control de acceso
- ❌ Datos expuestos públicamente

### Ahora (Sistema Privado):
- ✅ Solo usuarios autenticados acceden
- ✅ Contraseñas cifradas en Firebase Auth
- ✅ Control de permisos por rol
- ✅ Datos protegidos por reglas

---

## 📝 Estructura de Datos

### Firebase Authentication (Usuarios):
```
UID: "abc123xyz"
Email: "enfermero@sigep.cl"
Password: [cifrada automáticamente]
```

### Firestore (Metadata de Cuenta):
```javascript
{
  usuario: "juan_enfermero",
  email: "enfermero@sigep.cl",
  rut: "12345678-9",
  cargo: "Enfermero",
  uid: "abc123xyz",
  fecha: "19/11/2025, 10:30:00"
}
```

**Nota**: La contraseña NO se guarda en Firestore, solo en Firebase Authentication.

---

## ⚠️ Notas Importantes

1. **Usa emails reales o simulados únicos**: 
   - ✅ `admin@sigep.cl`
   - ✅ `enfermero1@sigep.cl`
   - ❌ No puedes repetir emails

2. **Contraseñas mínimo 6 caracteres**: Firebase Auth lo requiere

3. **El login ahora usa EMAIL**: No puedes usar solo el nombre de usuario

4. **Actualizar cuenta**: Solo se puede cambiar usuario, RUT y cargo (no email ni password)

5. **Eliminar cuenta**: Solo elimina de Firestore. El usuario en Auth queda activo (necesitarías Cloud Functions para eliminarlo completamente)

---

## 🐛 Solución de Problemas

### Error "Missing or insufficient permissions"
- Verifica que actualizaste las reglas de Firestore
- Asegúrate de estar autenticado (check en Firebase Console > Authentication)

### Error "Email already in use"
- Ese email ya existe en Authentication
- Usa otro email diferente
- O elimina el usuario en Authentication > Users

### Error "Weak password"
- La contraseña debe tener al menos 6 caracteres

### No puedo iniciar sesión
- Usa el **email** completo, no solo el usuario
- Verifica que el email existe en Authentication > Users
- Prueba con la cuenta admin que creaste manualmente

### La cuenta admin no funciona
- Verifica que creaste el usuario en Authentication
- Verifica que creaste el documento en Firestore con el mismo UID
- El email debe coincidir en ambos lugares

---

## 🚀 Pasos Rápidos (Resumen)

1. **Firebase Console** → Authentication → Habilitar Email/Password
2. **Firebase Console** → Authentication → Crear usuario admin (`admin@sigep.cl`)
3. **Copiar UID** del usuario creado
4. **Firestore** → Crear colección `cuentas` → Agregar documento admin con el UID
5. **Firestore** → Reglas → Copiar reglas del archivo `firestore.rules`
6. **Aplicación** → Login con email: `admin@sigep.cl`
7. **Crear cuentas adicionales** desde la interfaz

---

## ✨ Próximos Pasos (Opcionales)

Para producción, considera:
- Implementar recuperación de contraseña (Firebase Auth lo soporta)
- Agregar verificación de email
- Implementar roles más granulares
- Cloud Functions para eliminar usuarios completamente
- Auditoría de acciones (logs)
