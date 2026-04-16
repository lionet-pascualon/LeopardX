/* =============================================
   LeopardX — script.js
   ============================================= */

/* ═══════════════════════════════════════
   MODAL DE AUTENTICACIÓN (helpers UI)
   La lógica Firebase está en index.html
   como módulo ES para poder usar import
═══════════════════════════════════════ */
window.openAuth = function () {
  document.getElementById('authModal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
};

window.closeAuth = function () {
  document.getElementById('authModal').style.display = 'none';
  document.body.style.overflow = '';
  document.getElementById('authError').innerText    = '';
  document.getElementById('authEmail').value        = '';
  document.getElementById('authPassword').value     = '';
};

window.cerrarAuthFuera = function (e) {
  if (e.target === document.getElementById('authModal')) closeAuth();
};

window.togglePasswordVisibility = function () {
  const input = document.getElementById('authPassword');
  const icon  = document.getElementById('eyeIcon');
  if (input.type === 'password') {
    input.type = 'text';
    icon.innerHTML = '<path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>';
  } else {
    input.type = 'password';
    icon.innerHTML = '<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>';
  }
};

/* ─── Datos detallados por producto ─── */
const detallesProductos = {
  "Auriculares AKG": {
    desc: "Sonido de estudio profesional. Ideal para música, gaming y llamadas.",
    specs: ["Cable reforzado 1.2m", "Cancelación pasiva de ruido", "Bajos profundos y potentes", "Compatible con todos los dispositivos"]
  },
  "TWS M90 Pro": {
    desc: "Libertad total sin cables. Bluetooth 5.3 con latencia ultra baja.",
    specs: ["Bluetooth 5.3", "Estuche de carga con pantalla LED", "Autonomía 6h + 24h con estuche", "Resistente al sudor"]
  },
  "Smartwatch Inteligente": {
    desc: "Tu compañero de salud y estilo en la muñeca.",
    specs: ["Sensor cardíaco y SpO2", "Resistente al agua IP68", "Batería hasta 7 días", "Compatible Android e iOS"]
  },
  "Parlante Greatnice RGB": {
    desc: "Potencia sonora con show de luces LED incluido.",
    specs: ["Luces RGB multicolor", "Bluetooth 5.0", "Batería recargable", "Portátil y resistente"]
  },
  "Proyector Astronauta": {
    desc: "Transforma cualquier habitación en una galaxia.",
    specs: ["Nebulosa y estrellas giratorias", "Control remoto incluido", "Ideal para regalo", "360° de rotación"]
  }
};

let carrito = JSON.parse(localStorage.getItem('carritoLeopardX')) || [];
let productoActual = {};
document.addEventListener('DOMContentLoaded', () => {
    actualizarCarrito();
});

/* ═══════════════════════════════════════
   MODAL DE PRODUCTO
═══════════════════════════════════════ */
function abrirModal(titulo, precio, img) {
  productoActual = { titulo, precio, img };

  document.getElementById('modalTitle').innerText  = titulo;
  document.getElementById('modalPrice').innerText  = precio;
  document.getElementById('modalImg').src          = img;
  document.getElementById('modalImg').alt          = titulo;

  const info = detallesProductos[titulo] || {
    desc: "Producto de alta calidad LeopardX.",
    specs: ["Garantía incluida"]
  };
  document.getElementById('modalDesc').innerText    = info.desc;
  document.getElementById('modalSpecs').innerHTML   =
    info.specs.map(s => `<li>${s}</li>`).join('');

  const waText = encodeURIComponent(`Hola! Me interesa el producto: ${titulo} — Precio: ${precio}`);
  document.getElementById('modalWaBtn').href = `https://wa.me/3512366414?text=${waText}`;

  document.getElementById('productModal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function cerrarModal() {
  document.getElementById('productModal').style.display = 'none';
  document.body.style.overflow = '';
}

function cerrarModalFuera(e) {
  if (e.target === document.getElementById('productModal')) cerrarModal();
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    cerrarModal();
    cerrarWarning();
  }
});

/* ═══════════════════════════════════════
   CARRITO
═══════════════════════════════════════ */
function agregarAlCarrito() {
  if (!productoActual.titulo) return;

  const btn = document.querySelector('.btn-carrito');
  const textoOriginal = btn.innerHTML;
  btn.innerHTML = '✓ ¡Agregado!';
  btn.style.background = '#2a7a3b';
  setTimeout(() => {
    btn.innerHTML = textoOriginal;
    btn.style.background = '';
  }, 1200);

  carrito.push({ ...productoActual });
  actualizarCarrito();

  setTimeout(() => {
    cerrarModal();
    abrirCarrito();
  }, 900);
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  actualizarCarrito();
}

function actualizarCarrito() {
  const cartCount = document.getElementById('cartCount');
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  const cartWaBtn = document.getElementById('cartWaBtn');

  cartCount.innerText = carrito.length;
  cartCount.classList.remove('bump');
  void cartCount.offsetWidth;
  cartCount.classList.add('bump');

  if (carrito.length === 0) {
    cartItems.innerHTML = '<p class="cart-empty">Tu carrito está vacío</p>';
    cartTotal.innerText = '$0';
    cartWaBtn.href = '#';
    cartWaBtn.classList.add('disabled');
    return;
  }

  cartWaBtn.classList.remove('disabled');

  let total = 0;
  cartItems.innerHTML = carrito.map((item, i) => {
    const valor = parseInt(item.precio.replace(/\D/g, ''));
    total += valor;
    return `
      <div class="cart-item">
        <img class="cart-item-img" src="${item.img}" alt="${item.titulo}"/>
        <div class="cart-item-info">
          <span class="cart-item-name">${item.titulo}</span>
          <span class="cart-item-price">${item.precio}</span>
        </div>
        <button class="cart-item-remove" onclick="eliminarDelCarrito(${i})" aria-label="Eliminar">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>`;
  }).join('');

  cartTotal.innerText = `$${total.toLocaleString('es-AR')}`;

  // Mensaje WhatsApp con lista completa
  const fecha    = new Date().toLocaleDateString('es-AR');
  const lineas   = carrito.map((item, i) => `${i + 1}. ${item.titulo} — ${item.precio}`).join('%0A');
  const totalStr = `$${total.toLocaleString('es-AR')}`;
  const mensaje  =
    `Hola! Quiero consultar por los siguientes productos:%0A%0A` +
    `${lineas}%0A%0A` +
    `💰 Total estimado: *${totalStr}*%0A` +
    `📅 Fecha: ${fecha}`;
  cartWaBtn.href = `https://wa.me/3512366414?text=${mensaje}`;
}

function abrirCarrito() {
  document.getElementById('cartPanel').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function cerrarCarrito() {
  document.getElementById('cartPanel').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
  document.body.style.overflow = '';

localStorage.setItem('carritoLeopardX', JSON.stringify(carrito));
}

function toggleCart() {
  const panel = document.getElementById('cartPanel');
  panel.classList.contains('open') ? cerrarCarrito() : abrirCarrito();
localStorage.setItem('carritoLeopardX', JSON.stringify(carrito));
}


/* ═══════════════════════════════════════
   PESTAÑAS — NUESTROS / OTROS VENDEDORES
═══════════════════════════════════════ */
function filterProducts(tipo, event) {
  // Actualizar botones activos
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  event.currentTarget.classList.add('active');

  const gridOficial = document.getElementById('productGrid');
  const gridOtros   = document.getElementById('othersGrid');
  const titulo      = document.getElementById('sectionTitle');
  const sub         = document.getElementById('sectionSub');
  const noResult    = document.getElementById('noResult');

  if (tipo === 'others') {
    // Mostrar aviso y luego cambiar grid
    abrirWarning();
    gridOficial.style.display = 'none';
    gridOtros.style.display   = 'grid';
    noResult.style.display    = 'none';
    titulo.innerText = 'Otros Vendedores';
    sub.innerText    = 'Productos de vendedores independientes de la comunidad LeopardX';
  } else {
    gridOficial.style.display = 'grid';
    gridOtros.style.display   = 'none';
    titulo.innerText = 'Nuestros Productos';
    sub.innerText    = 'Tocá un producto para ver más detalles';
  }
}

/* ═══════════════════════════════════════
   MODAL AVISO — OTROS VENDEDORES
═══════════════════════════════════════ */
function abrirWarning() {
  document.getElementById('warningModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function cerrarWarning() {
  document.getElementById('warningModal').classList.remove('open');
  document.body.style.overflow = '';
}

function cerrarWarningFuera(e) {
  if (e.target === document.getElementById('warningModal')) cerrarWarning();
}

/* ═══════════════════════════════════════
   FILTROS DEL NAVBAR (por categoría)
═══════════════════════════════════════ */
const navLinks = document.querySelectorAll('[data-filter]');
const cards    = document.querySelectorAll('.card');
const noResult = document.getElementById('noResult');

navLinks.forEach(link => {
  link.addEventListener('click', function () {
    const filter = this.dataset.filter;
    navLinks.forEach(l => l.classList.remove('active'));
    this.classList.add('active');

    // Asegurarse de que se vea el grid oficial al filtrar por categoría
    document.getElementById('productGrid').style.display = 'grid';
    document.getElementById('othersGrid').style.display  = 'none';
    document.querySelectorAll('.tab-btn').forEach((btn, i) => {
      btn.classList.toggle('active', i === 0);
    });

    let visible = 0;
    cards.forEach(card => {
      if (filter === 'all' || card.dataset.categoria === filter) {
        card.style.display = '';
        card.classList.add('card-show');
        visible++;
      } else {
        card.style.display = 'none';
        card.classList.remove('card-show');
      }
    });
    noResult.style.display = visible === 0 ? 'block' : 'none';
  });
});

/* ═══════════════════════════════════════
   BUSCADOR
═══════════════════════════════════════ */
document.addEventListener('keyup', e => {
  if (e.target.matches('#buscador')) {
    const texto = e.target.value.toLowerCase();
    let visible = 0;
    cards.forEach(card => {
      const contenido = card.textContent.toLowerCase();
      if (contenido.includes(texto)) {
        card.style.display = '';
        card.classList.remove('filtro');
        visible++;
      } else {
        card.style.display = 'none';
        card.classList.add('filtro');
      }
    });
    noResult.style.display = visible === 0 ? 'block' : 'none';
  }
});

/* ═══════════════════════════════════════
   HAMBURGER
═══════════════════════════════════════ */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open');
});

/* ═══════════════════════════════════════
   NEWSLETTER — FORMSPREE
═══════════════════════════════════════ */
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const btn   = this.querySelector('button');
    const datos = new FormData(this);
    btn.textContent = 'Enviando...';
    btn.disabled = true;
    try {
      const res = await fetch(this.action, {
        method: 'POST', body: datos,
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        this.style.display = 'none';
        document.getElementById('newsletterOk').style.display = 'block';
      } else {
        btn.textContent = 'Error, intentá de nuevo';
        btn.disabled = false;
      }
    } catch {
      btn.textContent = 'Sin conexión, intentá de nuevo';
      btn.disabled = false;
    }
  });
}

async function cargarProductosDesdeFirebase() {
    const querySnapshot = await getDocs(collection(db, "productos"));
    const contenedor = document.getElementById('contenedor-productos'); // El ID de tu div de productos
    contenedor.innerHTML = ""; // Vaciamos lo que haya

    querySnapshot.forEach((doc) => {
        const producto = doc.data();
        
        // Lógica de Stock: si es 0, aplicamos clase 'agotado'
        const estaAgotado = producto.stock === 0;
        const claseGris = estaAgotado ? 'producto-agotado' : '';
        const textoBoton = estaAgotado ? 'Sin Stock' : 'Ver Detalle';
        const atributoBoton = estaAgotado ? 'disabled' : '';

        // Dibujamos el producto en el HTML
        contenedor.innerHTML += `
            <div class="card-producto ${claseGris}">
                <img src="${producto.img}" alt="${producto.nombre}">
                <h3>${producto.nombre}</h3>
                <p class="precio">$${producto.precio.toLocaleString('es-AR')}</p>
                <button onclick="abrirModal('${producto.nombre}', '${producto.precio}', '${producto.img}')" ${atributoBoton}>
                    ${textoBoton}
                </button>
            </div>
        `;
    });
}


/* ═══════════════════════════════════════
   ANIMACIÓN CARDS AL SCROLL
═══════════════════════════════════════ */
const cardObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('card-visible');
  });
}, { threshold: 0.1 });

cards.forEach(card => cardObserver.observe(card));

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.card').forEach(card => card.classList.add('card-show'));

});

document.addEventListener('DOMContentLoaded', () => {
    actualizarCarrito();
    cargarProductosDesdeFirebase(); // Esto trae tus productos de la nube
});
