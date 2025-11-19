# 🔑 CREDENCIALES DE ACCESO

## Cuenta Administrador

Para iniciar sesión en el sistema, necesitas crear la cuenta admin en Firebase Authentication.

### Opción 1: Crear Manualmente (RECOMENDADO)

1. Ve a Firebase Console: https://console.firebase.google.com
2. Selecciona proyecto: **sigep-53410**
3. Click en **Authentication** → **Users**
4. Click en **Add user**
5. Ingresa:
   ```
   Email: admin@sigep.cl
   Password: Admin123
   ```
6. Click en **Add user**
7. **IMPORTANTE**: Copia el UID generado (lo necesitas para el siguiente paso)

8. Ve a **Firestore Database**
9. Click en la colección **cuentas** (o créala)
10. Click en **Add document**
11. Ingresa estos campos:
    ```
    usuario: admin
    email: admin@sigep.cl
    rut: 11111111-1
    cargo: Administrador
    uid: [PEGA EL UID QUE COPIASTE]
    fecha: 19/11/2025, 10:00:00
    ```
12. Click en **Save**

### Opción 2: Desde la Aplicación

Si ya creaste el usuario en Authentication (paso 1-7 arriba), puedes:

1. Reinicia el servidor: `Ctrl+C` y luego `npm run dev`
2. En el login, usa:
   - **Usuario**: `admin` o `admin@sigep.cl`
   - **Contraseña**: `Admin123`

El sistema intentará autenticar directamente con Firebase Auth.

---

## 📝 Credenciales para Login

Una vez creada la cuenta, usa cualquiera de estas opciones:

### Login con usuario:
```
Usuario: admin
Contraseña: Admin123
```

### Login con email:
```
Email: admin@sigep.cl
Contraseña: Admin123
```

---

## ✅ Verificación

Después de crear la cuenta:

1. Reinicia el servidor (importante para que tome los cambios)
2. Abre http://localhost:3000
3. Ingresa las credenciales de admin
4. Deberías entrar al dashboard sin errores
5. Ve a "Gestión de Cuentas" para crear más usuarios

---

## 🆕 Crear Nuevas Cuentas

Una vez dentro como admin:

1. Ve a **Gestión de Cuentas**
2. Completa el formulario:
   ```
   Usuario: enfermero
   Email: enfermero@sigep.cl
   Contraseña: Enfermero123
   RUT: 12345678-9
   Cargo: Enfermero
   ```
3. Click en **Crear Cuenta**
4. El sistema creará automáticamente:
   - Usuario en Firebase Authentication
   - Documento en Firestore con metadata

---

## 🔐 Política de Contraseñas

Firebase requiere:
- ✅ Mínimo 6 caracteres
- ✅ Recomendado: Incluir mayúsculas y números
- ✅ Ejemplos válidos: `Admin123`, `Enfermero123`, `Doctor456`

---

## 🐛 Solución de Problemas

### Error "Email already in use"
La cuenta ya existe. Opciones:
- Usa otro email
- O elimina el usuario en Authentication → Users

### Error "Weak password"
La contraseña es muy corta. Usa mínimo 6 caracteres.

### Error "Invalid email"
El formato de email es incorrecto. Usa: `usuario@dominio.cl`

### No puedo iniciar sesión
1. Verifica que el usuario existe en Authentication → Users
2. Reinicia el servidor (`Ctrl+C` y `npm run dev`)
3. Desactiva extensiones de bloqueo (uBlock Origin)
4. Abre consola del navegador (F12) para ver errores

### Error "Missing permissions"
Las reglas de Firestore no están actualizadas. Verifica que copiaste las reglas correctamente y publicaste los cambios.

---

## 📋 Resumen Rápido

**Para empezar a trabajar AHORA:**

1. Firebase Console → Authentication → Add user
   - Email: `admin@sigep.cl`
   - Password: `Admin123`

2. Reinicia el servidor local

3. Login en tu app:
   - Usuario: `admin`
   - Contraseña: `Admin123`

¡Listo! Ya puedes trabajar y crear más cuentas desde la interfaz.
