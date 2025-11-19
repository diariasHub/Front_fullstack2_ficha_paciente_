import { db, auth, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '../lib/firebase';

const useFirebase = () => {
  return typeof window !== 'undefined' && process.env.NEXT_PUBLIC_USE_FIREBASE === 'true' && db !== null;
};

// Obtener todas las cuentas (solo metadata, no para autenticación)
export const fetchCuentas = async () => {
  if (!useFirebase()) {
    const stored = localStorage.getItem('cuentas');
    return stored ? JSON.parse(stored) : [
      { id: '1', usuario: 'admin', email: 'admin@sigep.cl', rut: '11111111-1', cargo: 'Administrador', fecha: new Date().toLocaleString('es-CL') }
    ];
  }

  try {
    const cuentasRef = collection(db, 'cuentas');
    const snapshot = await getDocs(cuentasRef);
    const cuentas = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return cuentas;
  } catch (error) {
    console.error('Error al obtener cuentas:', error);
    throw error;
  }
};

// Validar credenciales con Firebase Authentication
export const validarCredenciales = async (usuarioOrEmail, password) => {
  if (!useFirebase()) {
    const stored = localStorage.getItem('cuentas');
    const cuentas = stored ? JSON.parse(stored) : [
      { id: '1', usuario: 'admin', email: 'admin@sigep.cl', rut: '11111111-1', cargo: 'Administrador', password: 'admin' }
    ];
    // En localStorage, comparar password directamente
    const cuenta = cuentas.find(c => 
      (c.usuario === usuarioOrEmail || c.email === usuarioOrEmail) && c.password === password
    );
    return cuenta || null;
  }

  try {
    // Determinar si es email o usuario
    const isEmail = usuarioOrEmail.includes('@');
    let emailToUse = usuarioOrEmail;

    // Si no es email, intentar convertir usuario conocidos a email
    if (!isEmail) {
      const knownUsers = {
        'admin': 'admin@sigep.cl',
      };
      emailToUse = knownUsers[usuarioOrEmail] || usuarioOrEmail + '@sigep.cl';
    }

    // Intentar autenticar directamente con Firebase Auth
    try {
      const userCredential = await signInWithEmailAndPassword(auth, emailToUse, password);
      
      // Después de autenticar, buscar metadata en Firestore (ahora tenemos permisos)
      try {
        const cuentasRef = collection(db, 'cuentas');
        const q = query(cuentasRef, where('uid', '==', userCredential.user.uid));
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          const cuentaDoc = snapshot.docs[0];
          return { id: cuentaDoc.id, ...cuentaDoc.data() };
        }
        
        // Si no hay metadata, crear una básica
        return {
          id: userCredential.user.uid,
          usuario: usuarioOrEmail,
          email: userCredential.user.email,
          cargo: 'Usuario',
          uid: userCredential.user.uid
        };
      } catch (firestoreError) {
        console.error('Error al obtener metadata:', firestoreError);
        // Retornar info básica si no se puede acceder a Firestore
        return {
          id: userCredential.user.uid,
          usuario: usuarioOrEmail,
          email: userCredential.user.email,
          cargo: 'Usuario',
          uid: userCredential.user.uid
        };
      }
    } catch (authError) {
      console.error('Error de autenticación:', authError);
      return null;
    }
  } catch (error) {
    console.error('Error al validar credenciales:', error);
    return null;
  }
};

// Crear nueva cuenta con Firebase Authentication
export const crearCuenta = async (cuenta) => {
  if (!useFirebase()) {
    const stored = localStorage.getItem('cuentas');
    const cuentas = stored ? JSON.parse(stored) : [];
    const nuevaCuenta = { 
      id: Date.now().toString(), 
      ...cuenta, 
      fecha: new Date().toLocaleString('es-CL') 
    };
    cuentas.push(nuevaCuenta);
    localStorage.setItem('cuentas', JSON.stringify(cuentas));
    return nuevaCuenta;
  }

  try {
    // 1. Crear usuario en Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, cuenta.email, cuenta.password);
    
    // 2. Guardar metadata en Firestore (sin password)
    const cuentaData = {
      usuario: cuenta.usuario,
      email: cuenta.email,
      rut: cuenta.rut,
      cargo: cuenta.cargo,
      uid: userCredential.user.uid,
      fecha: new Date().toLocaleString('es-CL')
    };
    
    const docRef = await addDoc(collection(db, 'cuentas'), cuentaData);
    return { id: docRef.id, ...cuentaData };
  } catch (error) {
    console.error('Error al crear cuenta:', error);
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('El correo electrónico ya está en uso');
    } else if (error.code === 'auth/weak-password') {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('El correo electrónico no es válido');
    }
    throw error;
  }
};

// Actualizar cuenta
export const actualizarCuenta = async (id, datos) => {
  if (!useFirebase()) {
    const stored = localStorage.getItem('cuentas');
    const cuentas = stored ? JSON.parse(stored) : [];
    const index = cuentas.findIndex(c => String(c.id) === String(id));
    if (index !== -1) {
      cuentas[index] = { ...cuentas[index], ...datos };
      localStorage.setItem('cuentas', JSON.stringify(cuentas));
    }
    return;
  }

  try {
    const cuentaRef = doc(db, 'cuentas', id);
    // Solo actualizar campos permitidos (no uid ni email)
    const datosActualizables = {
      usuario: datos.usuario,
      rut: datos.rut,
      cargo: datos.cargo
    };
    await updateDoc(cuentaRef, datosActualizables);
  } catch (error) {
    console.error('Error al actualizar cuenta:', error);
    throw error;
  }
};

// Eliminar cuenta
export const eliminarCuenta = async (id) => {
  if (!useFirebase()) {
    const stored = localStorage.getItem('cuentas');
    const cuentas = stored ? JSON.parse(stored) : [];
    const filtered = cuentas.filter(c => String(c.id) !== String(id));
    localStorage.setItem('cuentas', JSON.stringify(filtered));
    return;
  }

  try {
    // Nota: Esto solo elimina el documento de Firestore
    // El usuario en Firebase Auth permanecerá activo
    // Para eliminarlo completamente, necesitas Cloud Functions
    await deleteDoc(doc(db, 'cuentas', id));
  } catch (error) {
    console.error('Error al eliminar cuenta:', error);
    throw error;
  }
};

// Cerrar sesión
export const cerrarSesion = async () => {
  if (!useFirebase()) {
    localStorage.removeItem('isAuth');
    localStorage.removeItem('usuario');
    localStorage.removeItem('cargo');
    return;
  }

  try {
    const { signOut } = await import('../lib/firebase');
    const { auth } = await import('../lib/firebase');
    await signOut(auth);
    localStorage.removeItem('isAuth');
    localStorage.removeItem('usuario');
    localStorage.removeItem('cargo');
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    throw error;
  }
};
