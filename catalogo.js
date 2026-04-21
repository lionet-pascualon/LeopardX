import { db } from "https://lionet-pascualon.github.io/LeopardX/firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

export async function cargarProductos() {
  const grid = document.getElementById('productGrid');
  if (!grid) return;

  grid.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:2rem">Cargando productos...</p>';

  try {
    const snapshot = await getDocs(collection(db, "productos"));
    grid.innerHTML = "";

    if (snapshot.empty) {
      grid.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:2rem">No hay productos disponibles.</p>';
      return;
    }

    snapshot.forEach((doc) => {
      const p = doc.data();
      const agotado = p.stock === 0;

      const card = document.createElement('div');
      card.className = `card ${agotado ? 'producto-agotado' : ''}`;
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
            <button
              class="card-btn"
              ${agotado ? 'disabled' : ''}
              data-nombre="${p.nombre}"
              data-precio="${p.precio}"
              data-img="${p.img}">
              ${agotado ? 'Sin Stock' : 'Ver más'}
            </button>
          </div>
        </div>
      `;

      if (!agotado) {
        card.querySelector('.card-btn').addEventListener('click', () => {
          window.abrirModal(p.nombre, `$${Number(p.precio).toLocaleString('es-AR')}`, p.img);
        });
      }

      grid.appendChild(card);
    });

  } catch (error) {
    console.error("Error cargando productos:", error);
    grid.innerHTML = '<p style="color:#f87171;text-align:center;padding:2rem">Error al cargar productos. Revisá la consola.</p>';
  }
}
