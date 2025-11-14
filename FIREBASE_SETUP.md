# 🔥 Instrucciones para Conectar Firebase

## Archivos preparados

✅ `login.html` - Página de autenticación  
✅ `admin.html` - Panel administrativo  
✅ `js/auth.js` - Lógica de autenticación (funciones vacías, listas para Firebase)  
✅ `js/admin.js` - CRUD de integrantes, presentaciones y discografía  
✅ `css/admin.css` - Estilos completos para login y admin

---

## Paso 1: Crear proyecto en Firebase

1. Ir a [Firebase Console](https://console.firebase.google.com/)
2. Crear un nuevo proyecto
3. Seleccionar "Realtime Database" o "Firestore"
4. Copiar la configuración de Firebase

---

## Paso 2: Agregar Firebase SDK a los HTML

### En `login.html`:

Reemplazar el comentario con tu configuración real:

```html
<!-- Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js"></script>
<script>
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "your-app.firebaseapp.com",
        projectId: "your-project-id",
        storageBucket: "your-project-id.appspot.com",
        messagingSenderId: "your-sender-id",
        appId: "your-app-id"
    };
    firebase.initializeApp(firebaseConfig);
</script>
```

### En `admin.html`:

Reemplazar el comentario con tu configuración real (agregar también Firestore si lo usas):

```html
<!-- Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js"></script>
<script>
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "your-app.firebaseapp.com",
        projectId: "your-project-id",
        storageBucket: "your-project-id.appspot.com",
        messagingSenderId: "your-sender-id",
        appId: "your-app-id"
    };
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
</script>
```

---

## Paso 3: Habilitar Autenticación en Firebase

1. En Firebase Console → Autenticación → Métodos de acceso
2. Habilitar "Email/Contraseña"
3. Crear usuarios de prueba

---

## Paso 4: Descomentar y completar funciones en `auth.js`

En `js/auth.js`, descomentar y actualizar las funciones:

### `loginUser()`
```javascript
function loginUser(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            console.log('Usuario autenticado:', userCredential.user.email);
            window.location.href = './admin.html';
        })
        .catch(error => {
            console.error('Error de login:', error);
            showLoginError(error.message);
        });
}
```

### `logoutUser()`
```javascript
function logoutUser() {
    firebase.auth().signOut()
        .then(() => {
            console.log('Usuario desconectado');
            window.location.href = './login.html';
        })
        .catch(error => console.error('Error:', error));
}
```

### `checkAuthStatus()`
```javascript
function checkAuthStatus() {
    firebase.auth().onAuthStateChanged(user => {
        if (!user) {
            window.location.href = './login.html';
        } else {
            console.log('Usuario autenticado:', user.email);
            initializeAdminPanel(user);
        }
    });
}
```

---

## Paso 5: Completar funciones CRUD en `admin.js`

En `js/admin.js`, descomentar y actualizar las funciones:

### `addIntegrante()`
```javascript
function addIntegrante(nombre, rol, fotoUrl = '') {
    db.collection('integrantes').add({
        nombre: nombre,
        rol: rol,
        foto: fotoUrl,
        createdAt: new Date()
    })
    .then(docRef => {
        console.log('Integrante agregado:', docRef.id);
        loadIntegrantes();
        resetForm('formIntegrante');
        showNotification('Integrante agregado exitosamente', 'success');
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('Error al agregar integrante', 'error');
    });
}
```

### `loadIntegrantes()`
```javascript
function loadIntegrantes() {
    db.collection('integrantes')
        .orderBy('createdAt', 'desc')
        .onSnapshot(snapshot => {
            const tablaIntegrantes = document.getElementById('tablaIntegrantes').querySelector('tbody');
            if (!tablaIntegrantes) return;
            
            tablaIntegrantes.innerHTML = '';
            snapshot.forEach(doc => {
                const integrante = doc.data();
                const row = `
                    <tr>
                        <td>${integrante.nombre}</td>
                        <td>${integrante.rol}</td>
                        <td>
                            <button onclick="editIntegrante('${doc.id}')" class="btn-action">Editar</button>
                            <button onclick="deleteIntegrante('${doc.id}')" class="btn-action delete">Eliminar</button>
                        </td>
                    </tr>
                `;
                tablaIntegrantes.innerHTML += row;
            });
        });
}
```

Sigue el mismo patrón para las demás funciones de CRUD.

---

## Paso 6: Activar protección en `admin.html`

Descomenta en el script inline del admin.html:

```javascript
// Descomentar cuando Firebase esté listo:
checkAuthStatus();  // Verifica autenticación
```

---

## Estructura de datos en Firebase (Firestore)

### Colección: `integrantes`
```json
{
    "nombre": "Freddie Mercury",
    "rol": "Vocalista",
    "foto": "url_imagen",
    "createdAt": "timestamp"
}
```

### Colección: `presentaciones`
```json
{
    "fecha": "2024-06-15",
    "lugar": "Estadio Nacional",
    "ciudad": "Madrid",
    "createdAt": "timestamp"
}
```

### Colección: `discografia`
```json
{
    "titulo": "A Night at the Opera",
    "anio": 1975,
    "imagen": "url_imagen",
    "createdAt": "timestamp"
}
```

---

## ✅ Checklist

- [ ] Proyecto creado en Firebase
- [ ] SDK agregado a login.html
- [ ] SDK agregado a admin.html
- [ ] Autenticación habilitada en Firebase
- [ ] Funciones en auth.js descomentadas y completadas
- [ ] Funciones CRUD en admin.js descomentadas y completadas
- [ ] Estructura de datos creada en Firestore/Realtime Database
- [ ] Reglas de seguridad configuradas en Firebase
- [ ] Pruebas realizadas (login → admin → CRUD)

---

## 🔐 Reglas de Seguridad Recomendadas (Firestore)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Solo usuarios autenticados pueden acceder
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 📝 Notas

- `auth.js` maneja autenticación y sesiones
- `admin.js` maneja CRUD de datos
- Ambos archivos tienen comentarios `TODO` marcando dónde descomentar código
- Los estilos en `admin.css` ya están 100% completos
- Las funciones tienen nombres y parámetros documentados

¡Listo para conectar Firebase! 🚀
