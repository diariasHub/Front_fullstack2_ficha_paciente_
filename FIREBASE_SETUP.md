# 🔥 Guía de Configuración de Firebase

Esta guía te ayudará a configurar Firebase en tu proyecto de ficha de pacientes.

## 📋 Requisitos Previos

- Node.js instalado
- Cuenta de Google
- Acceso a [Firebase Console](https://console.firebase.google.com/)

## 🚀 Pasos de Configuración

### 1. Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Agregar proyecto" o "Add project"
3. Ingresa el nombre del proyecto (ej: "ficha-pacientes")
4. Acepta los términos y crea el proyecto
5. Espera a que Firebase configure tu proyecto

### 2. Habilitar Firestore Database

1. En el panel lateral, ve a **Build** → **Firestore Database**
2. Haz clic en "Crear base de datos" o "Create database"
3. Selecciona el modo:
   - **Modo de prueba** (para desarrollo): Permite lectura/escritura sin autenticación
   - **Modo de producción**: Requiere configurar reglas de seguridad
4. Elige la ubicación más cercana (ej: `southamerica-east1` para Chile)
5. Haz clic en "Habilitar"

### 3. Configurar Reglas de Firestore (Opcional)

Para desarrollo, puedes usar estas reglas temporales:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // ⚠️ Solo para desarrollo
    }
  }
}
```

Para producción, restringe el acceso:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /consultas/{consultaId} {
      allow read, write: if request.auth != null;
    }
    match /insumos/{insumoId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 4. Obtener Credenciales de Firebase

1. En Firebase Console, haz clic en el ícono de **engranaje** ⚙️ → **Configuración del proyecto**
2. En la pestaña **General**, desplázate hasta **Tus apps**
3. Si no tienes una app web, haz clic en el ícono **</>** (Web)
4. Registra tu app con un nombre (ej: "Ficha Pacientes Web")
5. **NO** necesitas configurar Firebase Hosting por ahora
6. Copia los valores de `firebaseConfig`

Verás algo como esto:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

### 5. Crear Archivo `.env.local`

1. En la raíz del proyecto, crea un archivo llamado `.env.local`
2. Copia las credenciales de Firebase:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890

# Habilitar Firebase
NEXT_PUBLIC_USE_FIREBASE=true
```

⚠️ **IMPORTANTE**: 
- Reemplaza los valores con tus credenciales reales de Firebase
- **NUNCA** subas este archivo a GitHub (ya está en `.gitignore`)

### 6. Instalar Dependencias

Si aún no lo has hecho:

```bash
npm install firebase
```

### 7. Reiniciar el Servidor de Desarrollo

```bash
npm run dev
```

## 📊 Estructura de Firestore

El proyecto creará automáticamente estas colecciones:

### Colección `consultas`
Almacena las consultas de pacientes:

```javascript
{
  id: "auto-generated-id",
  nombre: "Juan Pérez",
  edad: 25,
  rut: "12345678-9",
  carrera: "Medicina",
  telefono: "912345678",
  motivo: "Dolor de cabeza",
  tratamiento: "Paracetamol 500mg",
  insumos: [{id: "...", nombre: "Guantes", cantidad: 2}],
  vitales: [{presion: "120/80", fc: "72", ...}],
  fecha: "19/11/2025",
  hora: "14:30:00",
  usuario: "admin",
  createdAt: "2025-11-19T14:30:00.000Z",
  updatedAt: "2025-11-19T14:30:00.000Z"
}
```

### Colección `insumos`
Gestiona el inventario de insumos médicos:

```javascript
{
  id: "auto-generated-id",
  nombre: "Guantes",
  cantidad: 20,
  createdAt: "2025-11-19T14:30:00.000Z",
  updatedAt: "2025-11-19T14:30:00.000Z"
}
```

## 🔄 Modo Híbrido

El proyecto funciona en modo híbrido:

- **Firebase habilitado** (`NEXT_PUBLIC_USE_FIREBASE=true`): Usa Firestore
- **Firebase deshabilitado** (`NEXT_PUBLIC_USE_FIREBASE=false`): Usa localStorage

Puedes alternar entre modos cambiando la variable en `.env.local`

## ✅ Verificar que Funciona

1. Inicia el servidor: `npm run dev`
2. Ve a la página de **Stock**
3. Agrega un insumo
4. Ve a Firebase Console → Firestore Database
5. Deberías ver la colección `insumos` con el dato agregado

## 🐛 Solución de Problemas

### Error: "Firebase config is missing"
- Verifica que `.env.local` existe
- Reinicia el servidor de desarrollo
- Asegúrate de que todas las variables empiezan con `NEXT_PUBLIC_`

### Error: "Missing or insufficient permissions"
- Revisa las reglas de Firestore
- Para desarrollo, usa reglas permisivas (ver paso 3)

### Los datos no se guardan
- Verifica que `NEXT_PUBLIC_USE_FIREBASE=true` en `.env.local`
- Abre la consola del navegador para ver errores
- Verifica tu conexión a Internet

### Error de hidratación de Next.js
- Este error ya fue solucionado en el código
- Si persiste, limpia el caché: `rm -rf .next` y `npm run dev`

## 📚 Recursos Adicionales

- [Documentación de Firebase](https://firebase.google.com/docs)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
- [Next.js con Firebase](https://firebase.google.com/docs/web/setup)

## 🔐 Seguridad en Producción

Antes de desplegar a producción:

1. ✅ Habilita autenticación de Firebase
2. ✅ Configura reglas de seguridad estrictas en Firestore
3. ✅ Usa variables de entorno en tu hosting
4. ✅ Habilita App Check para proteger tu backend
5. ✅ Revisa los logs de uso en Firebase Console

---

¿Necesitas ayuda? Revisa la documentación o contacta al equipo de desarrollo.
