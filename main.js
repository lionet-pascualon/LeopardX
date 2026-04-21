import { cargarProductos } from "https://lionet-pascualon.github.io/LeopardX/catalogo.js";
import { iniciarEscuchaAuth, setupAuthForm } from "https://lionet-pascualon.github.io/LeopardX/auth.js";

document.addEventListener('DOMContentLoaded', () => {
  cargarProductos();
  iniciarEscuchaAuth();
  setupAuthForm();
});
