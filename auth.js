
import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

let modoRegistro = false;

// Escucha cambios de sesión en tiempo real
export function iniciarEscuchaAuth() {
  onAuthStateChanged(auth, (user) => {
    const btnLogin  = document.getElementById('btnOpenAuth');
    const authUser  = document.getElementById('authUser');
    const avatar    = document.getElementById('authAvatar');

    if (user) {
      // Usuario logueado
      if (btnLogin) btnLogin.style.display = 'none';
      if (authUser) authUser.style.display = 'flex';
      if (avatar)   avatar.textContent = user.email[0].toUpperCase();
    } else {
      // Sin sesión
      if (btnLogin) btnLogin.style.display = '';
      if (authUser) authUser.style.display = 'none';
    }
  });
}

// Submit del formulario
export function setupAuthForm() {
  const form    = document.getElementById('authForm');
  const toggle  = document.getElementById('toggleAuthMode');
  const title   = document.getElementById('authModalTitle');
  const submitBtn = document.getElementById('authSubmitBtn');

  if (!form) return;

  // Cambiar entre login y registro
  toggle?.addEventListener('click', () => {
    modoRegistro = !modoRegistro;
    title.textContent     = modoRegistro ? 'Crear Cuenta' : 'Iniciar Sesión';
    submitBtn.textContent = modoRegistro ? 'Registrarme' : 'Entrar';
    toggle.textContent    = modoRegistro
      ? '¿Ya tenés cuenta? Iniciá sesión'
      : '¿No tenés cuenta? Registrate';
    document.getElementById('authError').innerText = '';
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email    = document.getElementById('authEmail').value.trim();
    const password = document.getElementById('authPassword').value;
    const errorEl  = document.getElementById('authError');
    errorEl.innerText = '';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Cargando...';

    try {
      if (modoRegistro) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      window.closeAuth();
    } catch (err) {
      errorEl.innerText = traducirError(err.code);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = modoRegistro ? 'Registrarme' : 'Entrar';
    }
  });

  // Logout
  document.getElementById('btnLogout')?.addEventListener('click', () => {
    signOut(auth);
  });
}

function traducirError(code) {
  const errores = {
    'auth/invalid-email':           'El email no es válido.',
    'auth/user-not-found':          'No existe una cuenta con ese email.',
    'auth/wrong-password':          'Contraseña incorrecta.',
    'auth/email-already-in-use':    'Ese email ya está registrado.',
    'auth/weak-password':           'La contraseña debe tener al menos 6 caracteres.',
    'auth/invalid-credential':      'Email o contraseña incorrectos.',
    'auth/too-many-requests':       'Demasiados intentos. Esperá un momento.',
  };
  return errores[code] || 'Ocurrió un error. Intentá de nuevo.';
