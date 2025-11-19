# 🚀 GUÍA RÁPIDA: Configurar Sistema Seguro

## ✅ Checklist de Configuración

### Paso 1: Habilitar Authentication
- [ ] Ir a Firebase Console: https://console.firebase.google.com
- [ ] Seleccionar proyecto: **sigep-53410**
- [ ] Click en **Authentication** (menú izquierdo)
- [ ] Click en **Get Started** o **Comenzar**
- [ ] Pestaña **Sign-in method**
- [ ] Click en **Email/Password**
- [ ] Activar el switch **Enable**
- [ ] Click en **Save** o **Guardar**

### Paso 2: Crear Usuario Admin
- [ ] En Authentication, click en **Users**
- [ ] Click en **Add user**
- [ ] Ingresar:
  ```
  Email: admin@sigep.cl
  Password: admin123
  ```
- [ ] Click en **Add user**
- [ ] **IMPORTANTE**: Copiar el **User UID** que aparece (ej: `a8xF2mN9...`)

### Paso 3: Crear Documento Admin en Firestore
- [ ] Click en **Firestore Database** (menú izquierdo)
- [ ] Si aparece "Crear base de datos", click y seleccionar modo producción
- [ ] Click en **Start collection** o buscar colección **cuentas**
- [ ] Si no existe colección `cuentas`, crearla:
  - Collection ID: `cuentas`
  - Click **Next**
- [ ] Click en **Add document**
- [ ] Agregar campos (uno por uno):
  ```
  Campo: usuario      | Tipo: string | Valor: admin
  Campo: email        | Tipo: string | Valor: admin@sigep.cl
  Campo: rut          | Tipo: string | Valor: 11111111-1
  Campo: cargo        | Tipo: string | Valor: Administrador
  Campo: uid          | Tipo: string | Valor: [PEGAR UID COPIADO]
  Campo: fecha        | Tipo: string | Valor: 19/11/2025, 10:00:00
  ```
- [ ] Click en **Save**

### Paso 4: Actualizar Reglas de Firestore
- [ ] En Firestore Database, click en pestaña **Rules**
- [ ] **Borrar todo** el contenido actual
- [ ] Copiar y pegar estas reglas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /consultas/{document=**} {
      allow read, write: if request.auth != null;
    }
    match /insumos/{document=**} {
      allow read, write: if request.auth != null;
    }
    match /cuentas/{cuentaId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null;
    }
  }
}
```

- [ ] Click en **Publish**
- [ ] Confirmar

### Paso 5: Probar el Sistema
- [ ] Abrir tu aplicación
- [ ] En el login, ingresar:
  ```
  Email: admin@sigep.cl
  Password: admin123
  ```
- [ ] Verificar que inicia sesión correctamente
- [ ] Ir a "Gestión de Cuentas"
- [ ] Crear una cuenta de prueba:
  ```
  Usuario: enfermero
  Email: enfermero@sigep.cl
  Password: enfermero123
  RUT: 12345678-9
  Cargo: Enfermero
  ```
- [ ] Click en **Crear Cuenta**
- [ ] Cerrar sesión
- [ ] Iniciar sesión con la nueva cuenta:
  ```
  Email: enfermero@sigep.cl
  Password: enfermero123
  ```

---

## ✅ Si Todo Funciona

Deberías poder:
- ✅ Iniciar sesión con cualquier cuenta creada
- ✅ Ver todas las cuentas en la lista
- ✅ Crear nuevas cuentas
- ✅ Editar cuentas existentes
- ✅ Las cuentas persisten después de cerrar sesión
- ✅ No aparece error de "reglas públicas"

---

## ❌ Errores Comunes

### "Missing or insufficient permissions"
**Causa**: Reglas no actualizadas o usuario no autenticado
**Solución**: 
1. Verifica que copiaste las reglas correctamente
2. Haz click en **Publish** en las reglas
3. Cierra sesión y vuelve a iniciar

### "Email already in use"
**Causa**: Ya existe un usuario con ese email
**Solución**: 
1. Usa otro email diferente
2. O elimina el usuario en Authentication > Users

### "Invalid email"
**Causa**: Email mal formado
**Solución**: Usa formato correcto (ej: `usuario@sigep.cl`)

### "Weak password"
**Causa**: Contraseña muy corta
**Solución**: Usa mínimo 6 caracteres

### No puedo iniciar sesión con admin
**Causa**: Cuenta no creada correctamente
**Solución**: 
1. Verifica en Authentication > Users que existe `admin@sigep.cl`
2. Verifica en Firestore > cuentas que existe documento con ese email
3. Verifica que el UID en Firestore coincide con el de Authentication

---

## 📞 Soporte

Si después de seguir todos los pasos aún tienes problemas:

1. Abre la consola del navegador (F12)
2. Busca errores en rojo
3. Copia el mensaje de error completo
4. Verifica en Firebase Console > Authentication si el usuario existe
5. Verifica en Firebase Console > Firestore si el documento existe

---

## 🎉 ¡Felicitaciones!

Una vez completados todos los pasos, tu sistema estará:
- 🔒 Protegido con autenticación
- 🔐 Contraseñas cifradas
- 👥 Solo usuarios registrados pueden acceder
- 📊 Datos privados y seguros
