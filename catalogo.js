import { db } from "https://lionet-pascualon.github.io/LeopardX/firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

let todosLosProductos = [];

export async function cargarProductos() {
  const grid = document.getElementById('productGrid');
  if (!grid) return;

  grid.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:2rem">Cargando productos...</p>';

  try {
    const snapshot = await getDocs(collection(db, "productos"));
    todosLosProductos = [];
    snapshot.forEach((doc) => {
      todosLosProductos.push({ id: doc.id, ...doc.data() });
    });
    renderProductos(todosLosProductos);
    iniciarFiltros();
  } catch (error) {
    console.error("Error cargando productos:", error);
    grid.innerHTML = '<p style="color:#f87171;text-align:center;padding:2rem">Error al cargar productos.</p>';
  }
}

function renderProductos(lista) {
  const grid     = document.getElementById('productGrid');
  const noResult = document.getElementById('noResult');

  if (lista.length === 0) {
    grid.innerHTML = '';
    if (noResult) noResult.style.display = 'block';
    return;
  }

  if (noResult) noResult.style.display = 'none';
  grid.innerHTML = '';

  lista.forEach((p) => {
    const agotado = p.stock === 0;
    const card    = document.createElement('div');
    card.className         = `card ${agotado ? 'producto-agotado' : ''}`;
    card.dataset.categoria = p.categoria || '';

    card.innerHTML = `
      <div class="card-img">
        <img src="${p.img}" alt="${p.nombre}" loading="lazy">
      </div>
      <div class="card-body">
        <div class="card-title-row">
          <h3 class="card-title">${p.nombre}</h3>
          ${p.nuevo ? '<span class="card-badge badge-new">NUEVO</span>' : ''}
        </div>
        <div class="card-footer">
          <span class="card-price">$${Number(p.precio).toLocaleString('es-AR')}</span>
          <button class="card-btn" ${agotado ? 'disabled' : ''}>
            ${agotado ? 'Sin Stock' : 'Ver más'}
          </button>
        </div>
      </div>
    `;

    if (!agotado) {
      card.querySelector('.card-btn').addEventListener('click', () => {
        window.abrirModal(p.nombre, `$${Number(p.precio).toLocaleString('es-AR')}`, p.img, p.descripcion || '');
      });
    }

    grid.appendChild(card);
  });
}

function iniciarFiltros() {
  // FILTRO NAVBAR
  document.querySelectorAll('[data-filter]').forEach(link => {
    const nuevo = link.cloneNode(true);
    link.parentNode.replaceChild(nuevo, link);
    nuevo.addEventListener('click', function () {
      document.querySelectorAll('[data-filter]').forEach(l => l.classList.remove('active'));
      this.classList.add('active');
      document.getElementById('productGrid').style.display = 'grid';
      document.getElementById('othersGrid').style.display  = 'none';
      document.querySelectorAll('.tab-btn').forEach((btn, i) => btn.classList.toggle('active', i === 0));
      const filtro    = this.dataset.filter;
      const filtrados = filtro === 'all' ? todosLosProductos : todosLosProductos.filter(p => p.categoria === filtro);
      renderProductos(filtrados);
    });
  });

  // BUSCADOR
  const buscador = document.getElementById('buscador');
  if (buscador) {
    const nuevo = buscador.cloneNode(true);
    buscador.parentNode.replaceChild(nuevo, buscador);
    nuevo.addEventListener('input', function () {
      const texto     = this.value.toLowerCase().trim();
      const filtrados = texto === ''
        ? todosLosProductos
        : todosLosProductos.filter(p =>
            p.nombre.toLowerCase().includes(texto) ||
            (p.categoria || '').toLowerCase().includes(texto)
          );
      renderProductos(filtrados);
    });
  }
}
