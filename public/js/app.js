  function actualizarDashboardAdmin() {
    const elProd = document.getElementById('total-productos');
    const elUsers = document.getElementById('total-usuarios');
    if (elProd) {
      try { elProd.textContent = PRODUCTOS.length; } catch { elProd.textContent = (obtenerLS('productos', []) || []).length; }
    }
    if (elUsers) {
      try { elUsers.textContent = (obtenerLS('usuarios', []) || []).length; } catch {}
    }
  }

  

// Actualiza los totales del dashboard cuando estamos en /admin (sin tablas)
function actualizarDashboardAdmin() {
  try {
    const productos = obtenerLS('productos', []);
    const usuarios = obtenerLS('usuarios', []);
    const tp = document.getElementById('total-productos');
    const tu = document.getElementById('total-usuarios');
    if (tp) tp.textContent = productos.length;
    if (tu) tu.textContent = usuarios.length;
  } catch (e) {
    console.warn('No se pudieron actualizar totales del dashboard', e);
  }
}



console.log('app.js cargado correctamente'); 

function $(sel, root = document) { return root.querySelector(sel); }
function $all(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }
function formatearCLP(n) { return n.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }); }
function guardarLS(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function obtenerLS(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } }
// Normaliza rutas de imagen relativas a absolutas bajo /
function toAbs(url) {
  if (!url) return '/img/logo-level-Up.png';
  if (/^https?:\/\//i.test(url)) return url;
  if (/^data:/i.test(url)) return url;
  if (url.startsWith('/')) return url;
  // quitar prefijos public/
  if (url.startsWith('public/')) url = url.replace(/^public\//, '');
  if (url.startsWith('/public/')) url = url.replace(/^\/public\//, '/');
  if (url.startsWith('img/')) return `/${url}`;
  // Normalizar barras invertidas y espacios
  let path = `/${url}`.replace(/\\/g, '/');
  try { return encodeURI(path); } catch { return path; }
}

// Corrige atributos legacy "className" en HTML inyectado para que apliquen estilos Bootstrap
function fixLegacyClassNameAttributes(root = document) {
  if (!root || !root.querySelectorAll) return;
  root.querySelectorAll('[className]').forEach(el => {
    const val = el.getAttribute('className');
    if (val) el.setAttribute('class', val);
    el.removeAttribute('className');
  });
  // Actualizar contador si existe en dashboard
  const elProd = document.getElementById('total-productos');
  if (elProd) elProd.textContent = PRODUCTOS.length;
}

function normalizarPasswordsEnLS() {
  const usuarios = obtenerLS('usuarios', []);
  let cambiado = false;
  function esBase64(str) {
    try {
      if (!str || typeof str !== 'string') return false;
      const dec = atob(str);
      return btoa(dec) === str;
    } catch { return false; }
  }

  // Blog: manejar 'Leer más' con layout profesional (imagen + texto)
  if (document.querySelectorAll('.btn-leer-mas').length) {
    const contenidos = {
      a1: {
        titulo: 'Los juegos más esperados del 2024',
        img: 'img/2024-games.webp',
        texto: `
          <p>Un análisis curado de los lanzamientos con mayor tracción en la industria, considerando impacto comercial, innovación en diseño y respaldo de la crítica especializada.</p>
          <p>Para cada título revisamos su propuesta de valor, público objetivo, plataformas y estado de desarrollo, incorporando impresiones de previews y betas cerradas.</p>
          <h6 className="mt-2">Puntos Clave</h6>
          <ul>
            <li>Calendario de lanzamiento y riesgos de postergación.</li>
            <li>Tecnologías involucradas (ray tracing, DLSS/FSR, trazado de path, VRR).</li>
            <li>Estrategia de monetización y modelo de soporte post-lanzamiento.</li>
          </ul>
          <p className="mb-0 text-muted">Conclusión: el 2024 consolida tendencias híbridas entre campañas cinematográficas y live service, con una fuerte apuesta por optimización en PC y current-gen.</p>
        `
      },
      a2: {
        titulo: 'Guía para armar tu PC gamer',
        img: 'img/armadopc.webp',
        texto: `
          <p>Framework metodológico para dimensionar una máquina balanceada: priorización de GPU vs CPU según género, presupuesto escalable y proyección de upgrades.</p>
          <p>Abordamos compatibilidad de chipsets, perfiles XMP/EXPO, estándares PCIe 4.0/5.0, disipación térmica y acústica, además de gestión de cables y flujo de aire.</p>
          <h6 className="mt-2">Checklist técnico</h6>
          <ol>
            <li>Plataforma y chipset: criterios de selección y hoja de ruta del fabricante.</li>
            <li>GPU por rango de precio con métricas de FPS 1080p/1440p/4K.</li>
            <li>Almacenamiento NVMe: DRAM cache, TBW y thermal throttling.</li>
            <li>PSU: certificación 80 Plus, margen de potencia y cables nativos.</li>
          </ol>
          <p className="mb-0 text-muted">Sugerimos configuraciones de referencia y prácticas para extender la vida útil sin comprometer rendimiento.</p>
        `
      },
      a3: {
        titulo: 'Reseña del juego del año',
        img: 'img/juego-del-año.webp',
        texto: `
          <p>Evaluación integral bajo criterios de diseño sistémico, curva de dificultad y calidad de vida. Se consideran iteraciones de parches y estado de servidores.</p>
          <p>La dirección artística destaca por su cohesión con la narrativa y un apartado sonoro que refuerza el tono emocional de cada secuencia.</p>
          <h6 className="mt-2">Análisis</h6>
          <ul>
            <li>Rendimiento en PC y consolas: escalabilidad gráfica y estabilidad.</li>
            <li>Multijugador y matchmaking: latencia, netcode y progresión.</li>
            <li>Accesibilidad: opciones de control, UI y modos de asistencia.</li>
          </ul>
          <p className="mb-0"><strong>Veredicto:</strong> redondea una experiencia sobresaliente que eleva el estándar del género y justifica su reconocimiento.</p>
        `
      }
    };
    document.querySelectorAll('.btn-leer-mas').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-articulo');
        const data = contenidos[key];
        if (!data) return;
        const t = document.getElementById('modalBlogTitulo');
        const c = document.getElementById('modalBlogContenido');
        if (t) t.textContent = data.titulo;
        if (c) {
          c.innerHTML = `
            <div className="row g-3 align-items-start">
              <div className="col-md-5">
                <img src="${data.img}" alt="${data.titulo}" className="img-fluid rounded border border-secondary">
              </div>
              <div className="col-md-7">
                ${data.texto}
              </div>
            </div>
          `;
        }
      });
    });
  }
  const normalizados = usuarios.map(u => {
    const obj = { ...u };
    if (obj.contrasena && !obj.password) {
      obj.password = obj.contrasena;
      delete obj.contrasena;
      cambiado = true;
    }
    if (obj.password && esBase64(obj.password)) {
      try { obj.password = atob(obj.password); cambiado = true; } catch {}
    }
    return obj;
  });
  if (cambiado) guardarLS('usuarios', normalizados);
}

let carrito = obtenerLS('carrito', []);
let usuarioActual = obtenerLS('usuarioActual', null);
let productosFiltrados = [];

// Datos del catálogo completo
const PRODUCTOS = [
  { id: 1, codigo: 'JM001', nombre: 'Catan', precio: 29990, categoria: 'Juegos de Mesa', imagen: 'img/Catan.jpg', descripcion: 'Un clásico juego de estrategia donde los jugadores compiten por colonizar y expandirse en la isla de Catan. Ideal para 3-4 jugadores y perfecto para noches de juego en familia o con amigos.' },
  { id: 2, codigo: 'JM002', nombre: 'Carcassonne', precio: 24990, categoria: 'Juegos de Mesa', imagen: 'img/Carcassonne.jpg', descripcion: 'Un juego de colocación de fichas donde los jugadores construyen el paisaje alrededor de la fortaleza medieval de Carcassonne. Ideal para 2-5 jugadores y fácil de aprender.' },
  { id: 3, codigo: 'AC001', nombre: 'Controlador Inalámbrico Xbox Series X', precio: 59990, categoria: 'Accesorios', imagen: 'img/Controlador_inalambrico_xbox_series_x.webp', descripcion: 'Ofrece una experiencia de juego cómoda con botones mapeables y una respuesta táctil mejorada. Compatible con consolas Xbox y PC.' },
  { id: 4, codigo: 'AC002', nombre: 'Auriculares Gamer HyperX Cloud II', precio: 79990, categoria: 'Accesorios', imagen: 'img/Auriculares HyperX Cloud II.jpg', descripcion: 'Proporcionan un sonido envolvente de calidad con un micrófono desmontable y almohadillas de espuma viscoelástica para mayor comodidad durante largas sesiones de juego.' },
  { id: 5, codigo: 'CO001', nombre: 'PlayStation 5', precio: 549990, categoria: 'Consolas', imagen: 'img/playstation-5.webp', descripcion: 'La consola de última generación de Sony, que ofrece gráficos impresionantes y tiempos de carga ultrarrápidos para una experiencia de juego inmersiva.' },
  { id: 6, codigo: 'CG001', nombre: 'PC Gamer ASUS ROG Strix', precio: 1299990, categoria: 'Computadores Gamers', imagen: 'img/PC Gamer ASUS ROG Strix.webp', descripcion: 'Un potente equipo diseñado para los gamers más exigentes, equipado con los últimos componentes para ofrecer un rendimiento excepcional en cualquier juego.' },
  { id: 7, codigo: 'SG001', nombre: 'Silla Gamer Secretlab Titan', precio: 349990, categoria: 'Sillas Gamers', imagen: 'img/Silla Gamer SecretLab Titan.jpg', descripcion: 'Diseñada para el máximo confort, esta silla ofrece un soporte ergonómico y personalización ajustable para sesiones de juego prolongadas.' },
  { id: 8, codigo: 'MS001', nombre: 'Mouse Gamer Logitech G502 HERO', precio: 49990, categoria: 'Mouse', imagen: 'img/Mouse Logitech G502 HERO.webp', descripcion: 'Con sensor de alta precisión y botones personalizables, este mouse es ideal para gamers que buscan un control preciso y personalización.' },
  { id: 9, codigo: 'MP001', nombre: 'Mousepad Razer Goliathus Extended Chroma', precio: 29990, categoria: 'Mousepad', imagen: 'img/Teclado Razer BlackWidow.avif', descripcion: 'Ofrece un área de juego amplia con iluminación RGB personalizable, asegurando una superficie suave y uniforme para el movimiento del mouse.' },
  { id: 10, codigo: 'PP001', nombre: 'Polera Gamer Personalizada \'Level-Up\'', precio: 14990, categoria: 'Poleras Personalizadas', imagen: 'img/camisa_Level_Up.png', descripcion: 'Una camiseta cómoda y estilizada, con la posibilidad de personalizarla con tu gamer tag o diseño favorito.' }
];

// Snapshot de productos por defecto para poder mezclar con guardados
const DEFAULT_PRODUCTOS = JSON.parse(JSON.stringify(PRODUCTOS));

function sanitizeProducto(p) {
  const q = { ...p };
  // Normalizar codigo
  if (q.codigo) q.codigo = String(q.codigo).trim();
  // Asegurar ID numérico (evitar cosas como 'PP001')
  if (typeof q.id !== 'number' || Number.isNaN(q.id)) {
    // Intentar mapear por DEFAULT_PRODUCTOS según codigo
    const base = (q.codigo && Array.isArray(DEFAULT_PRODUCTOS)) ? DEFAULT_PRODUCTOS.find(d => String(d.codigo).trim().toLowerCase() === String(q.codigo).trim().toLowerCase()) : null;
    q.id = base && typeof base.id === 'number' ? base.id : Date.now();
  }
  if (!q.imagen || typeof q.imagen !== 'string' || !q.imagen.trim()) {
    q.imagen = 'img/logo-level-Up.png';
  }
  return q;
}

function normalizarProductosEnLS() {
  const guardados = obtenerLS('productos', []);
  if (!Array.isArray(guardados)) return;
  const byCodigo = new Map();
  const keyOf = (c) => String((c || '').trim().toLowerCase());
  guardados.forEach(p => {
    const s = sanitizeProducto(p);
    const k = keyOf(s.codigo);
    if (k) byCodigo.set(k, s); 
  });
  const dedup = Array.from(byCodigo.values());
  guardarLS('productos', dedup);
}

// Funciones de validación (incluidas aquí para simplicidad, pero ya están en validaciones.js)
function validarCorreo(correo) { return /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|duoc\.cl|profesor\.duoc\.cl)$/.test(correo); }
function validarPassword(pass) { return pass.length >= 6 && pass.length <= 20; }

// Notificaciones y avisos
function aviso(msg) {
  // Opción B: Toast en esquina superior derecha usando SweetAlert2
  if (window.Swal) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1800,
      timerProgressBar: true,
      iconColor: '#fff',
      background: '#28a745',
      color: '#fff'
    });
    Toast.fire({
      icon: 'success',
      title: '¡Agregado!',
      html: `<div style="margin-top:2px">${msg}</div>`
    });
  } else {
    // Fallback toast negro si no está disponible Swal
    let el = document.getElementById('mini-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'mini-toast';
      Object.assign(el.style, { position: 'fixed', right: '20px', bottom: '90px', background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '8px 12px', borderRadius: '6px', zIndex: 99999, fontSize: '0.95rem' });
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.display = 'block';
    setTimeout(() => { el.style.display = 'none'; }, 1200);
  }
}

// Carrito
function actualizarInsigniaCarrito() {
  const totalItems = carrito.reduce((s, it) => s + (it.qty || 1), 0);
  const badges = $all('#cart-badge');
  badges.forEach(b => {
    b.textContent = totalItems;
    b.style.display = totalItems > 0 ? 'inline' : 'none';
    b.style.position = 'absolute'; 
    b.style.top = '0';
    b.style.right = '0';
    b.style.backgroundColor = '#dc3545'; 
    b.style.color = 'white';
    b.style.borderRadius = '50%';
    b.style.padding = '2px 6px';
    b.style.fontSize = '0.8rem';
  });
}

function guardarCarrito() { guardarLS('carrito', carrito); actualizarInsigniaCarrito(); }

function agregarAlCarritoPorId(id, cantidad = 1) {
  const prod = PRODUCTOS.find(p => String(p.id) === String(id));
  if (!prod) return false;
  const idx = carrito.findIndex(it => String(it.id) === String(id));
  // Calcular precio final con descuento si existe.
  const simulatedIds = new Set([1, 3, 5, 7, 9]);
  const d = typeof prod.descuento === 'number' ? prod.descuento : (simulatedIds.has(Number(prod.id)) ? 0.2 : 0);
  const precioFinal = Math.round((prod.precio || 0) * (1 - d));
  if (idx >= 0) carrito[idx].qty = (carrito[idx].qty || 1) + cantidad;
  else carrito.push({ id: prod.id, nombre: prod.nombre, precio: precioFinal, imagen: prod.imagen, qty: cantidad, categoria: prod.categoria, codigo: prod.codigo });
  guardarCarrito();
  aviso(`${prod.nombre} agregado al carrito`);
  return true;
}

function cambiarCantidad(id, delta) {
  const idx = carrito.findIndex(it => String(it.id) === String(id));
  if (idx === -1) return;
  carrito[idx].qty = (carrito[idx].qty || 1) + delta;
  if (carrito[idx].qty <= 0) carrito.splice(idx, 1);
  guardarCarrito();
  if (location.pathname.includes('/carrito')) renderizarCarrito(); // Re-render si en carrito (SPA)
}

function procesarPedido() {
  console.log('procesarPedido: Iniciando... Usuario actual:', usuarioActual ? usuarioActual.nombre : 'Ninguno');
  if (!carrito.length) {
    Swal.fire('Carrito vacío', 'Agrega productos antes de proceder.', 'warning');
    return;
  }
  if (!usuarioActual) {
    console.log('Usuario no logueado, redirigiendo a login');
    Swal.fire('Inicia sesión', 'Debes estar registrado para proceder al pago.', 'info').then(() => {
      location.href = '/login';
    });
    return;
  }
  console.log('Usuario logueado, procesando compra');
  const subtotal = carrito.reduce((s, it) => s + it.precio * it.qty, 0);
  const descuento = 0.1;
  const total = subtotal * (1 - descuento);

  Swal.fire({
    title: '¡Compra confirmada!',
    html: `
      <p><strong>Subtotal:</strong> ${formatearCLP(subtotal)}</p>
      <p style="color: #ffc107;"><strong>Descuento (10%):</strong> -${formatearCLP(subtotal * descuento)}</p>
      <p style="color: #28a745; font-size: 1.2rem;"><strong>Total a pagar:</strong> ${formatearCLP(total)}</p>
      <p>¡Gracias por tu compra, ${usuarioActual.nombre}!</p>
    `,
    icon: 'success',
    confirmButtonText: 'Aceptar',
    background: '#333',
    color: '#fff',
    confirmButtonColor: '#28a745'
  }).then(() => {
    carrito = [];
    guardarLS('carrito', carrito);
    renderizarCarrito();
  });
}

function vaciarCarrito() {
  if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
    carrito = [];
    guardarLS('carrito', carrito);
    renderizarCarrito();
    alert('Carrito vaciado.');
  }
}

// Header y autenticación
function actualizarHeader() {
  console.log('actualizarHeader ejecutado, usuarioActual:', usuarioActual ? usuarioActual.nombre : 'Ninguno');
  const acciones = $('.acciones-container');
  const sidebar = $('#sidebar-admin');
  const role = (usuarioActual && usuarioActual.rol ? String(usuarioActual.rol).toLowerCase() : '');
  const nameHasAdmin = (usuarioActual && usuarioActual.nombre ? String(usuarioActual.nombre).toLowerCase().includes('admin') : false);
  if (usuarioActual) {
    if (acciones) {
      acciones.style.display = 'block';
      acciones.innerHTML = `<div className="acciones-usuario"><span>Hola ${usuarioActual.nombre}</span> | <a href="#" id="logout-link">Cerrar sesión</a></div>`;
      const logout = $('#logout-link');
      if (logout) logout.addEventListener('click', (e) => { e.preventDefault(); cerrarSesion(); });
    }
    if (sidebar && (role === 'admin' || role === 'administrador' || nameHasAdmin)) sidebar.style.display = 'block';
    console.log('Usuario logueado, mostrando elementos');
  } else {
    if (acciones) acciones.style.display = 'none';
    if (sidebar) sidebar.style.display = 'none';
    console.log('Usuario no logueado');
  }
}

function cerrarSesion() { localStorage.removeItem('usuarioActual'); usuarioActual = null; actualizarHeader(); }

// Rendering de catálogo con filtros y búsqueda
function aplicarFiltros() {
  const categoria = $('#filtro-categoria').value;
  const precio = $('#filtro-precio').value;
  const busqueda = ($('#busqueda').value || '').toLowerCase();

  productosFiltrados = PRODUCTOS.filter(p => {
    if (categoria && p.categoria !== categoria) return false;
    if (precio) {
      const pr = p.precio;
      if (precio === '0-50000' && pr > 50000) return false;
      if (precio === '50000-200000' && (pr < 50000 || pr > 200000)) return false;
      if (precio === '200000-500000' && (pr < 200000 || pr > 500000)) return false;
      if (precio === '500000+' && pr < 500000) return false;
    }
    if (busqueda && !p.nombre.toLowerCase().includes(busqueda)) return false;
    return true;
  });

  renderizarProductosFiltrados();
}

function renderizarProductosFiltrados() {
  const lista = $('#lista-productos');
  if (!lista) return;
  lista.innerHTML = '';
  productosFiltrados.forEach(p => {
    const div = document.createElement('div');
    div.className = 'tarjeta-producto-productos';
    const simulatedIds = new Set([1,3,5,7,9]);
    const d = typeof p.descuento === 'number' ? p.descuento : (simulatedIds.has(Number(p.id)) ? 0.2 : 0);
    const precioOferta = Math.round((p.precio || 0) * (1 - d));
    const badge = d > 0 ? `<span class="insignia-producto-productos">${Math.round(d*100)}% OFF</span>` : '';
    const bloquePrecio = d > 0
      ? `<div style="display:flex;flex-direction:column;align-items:center;gap:4px">
           <span style="text-decoration:line-through;opacity:.7">${formatearCLP(p.precio)}</span>
           <span class="precio-producto-productos">${formatearCLP(precioOferta)}</span>
         </div>`
      : `<span class="precio-producto-productos">${formatearCLP(p.precio)}</span>`;
    div.innerHTML = `
      <div class="contenedor-imagen-productos">
        ${badge}
        <img class="imagen-producto-productos" src="${toAbs(p.imagen || 'img/logo-level-Up.png')}" alt="${p.nombre}" loading="lazy" onerror="this.src='/img/logo-level-Up.png'">
      </div>
      <div class="info-producto-productos">
        <h5 class="nombre-producto-productos">${p.nombre}</h5>
        <div class="categoria-producto-productos">${p.categoria}</div>
        <div class="pie-producto-productos">
          ${bloquePrecio}
          <div class="botones-producto-productos">
            <button class="btn-agregar-productos btn-agregar" data-id="${p.id}">Agregar</button>
            <button class="btn-detalle-productos btn-ver-detalle" data-id="${p.id}">Ver Detalle</button>
          </div>
        </div>
      </div>`;
    lista.appendChild(div);
  });
  fixLegacyClassNameAttributes(lista);
}

// Detalle de producto
function renderizarDetalle() {
  console.log('renderizarDetalle: Iniciando...');
  const cont = $('#detalle-producto');
  if (!cont) {
    console.log('ERROR: No se encontró #detalle-producto');
    return;
  }
  const params = new URLSearchParams(location.search);
  let id = params.get('id');
  // Soporte SPA: si no viene ?id=, intentar leer desde la ruta /producto/:id
  if (!id) {
    const m = location.pathname.match(/\/producto\/(\d+)/i);
    if (m && m[1]) id = m[1];
  }
  console.log('ID del producto:', id);
  if (!id) {
    console.log('ERROR: No se encontró ID en URL');
    return;
  }
  // Priorizar productos guardados en LS (Admin) y luego fallback al catálogo embebido
  const guardados = obtenerLS('productos', []);
  const p = (Array.isArray(guardados) ? guardados.find(x => String(x.id) === String(id)) : null) 
          || PRODUCTOS.find(x => String(x.id) === String(id));
  if (!p) {
    console.log('ERROR: Producto no encontrado para ID:', id);
    return;
  }
  console.log('Producto encontrado:', p.nombre);

  $('#breadcrumb-producto') && ($('#breadcrumb-producto').textContent = p.nombre);

  const simulatedIds = new Set([1,3,5,7,9]);
  const d = typeof p.descuento === 'number' ? p.descuento : (simulatedIds.has(Number(p.id)) ? 0.2 : 0);
  const precioOferta = Math.round((p.precio || 0) * (1 - d));
  const priceBlock = d > 0
    ? `<div>
         <div style="color:#aaa;font-size:.9rem;">Precio original: <span style="text-decoration:line-through;opacity:.8">${formatearCLP(p.precio)}</span></div>
         <div className="product-price" id="detalle-precio" style="font-size: 2.5rem; font-weight: bold; color: #ffc107; margin-bottom: 20px;">${formatearCLP(precioOferta)}</div>
       </div>`
    : `<div className="product-price" id="detalle-precio" style="font-size: 2.5rem; font-weight: bold; color: #ffc107; margin-bottom: 20px;">${formatearCLP(p.precio)}</div>`;

  cont.innerHTML = `
    <div class="col-md-6">
      <div className="product-gallery">
        <div style="position:relative">
          ${d>0 ? `<span class="insignia-producto-productos" style="left:10px;top:10px;position:absolute">${Math.round(d*100)}% OFF</span>` : ''}
          <img src="${toAbs(p.imagen)}" alt="${p.nombre}" class="main-image" id="detalle-img" onerror="this.src='/img/logo-level-Up.png'" style="width: 100%; height: auto; max-height: 90vh; object-fit: contain; border-radius: 10px; background-color: #f0f0f0; cursor: zoom-in;" data-bs-toggle="modal" data-bs-target="#imagenModal">
        </div>
      </div>
    </div>
    <div class="col-md-6">
      <div class="product-info" style="background-color: #333; padding: 30px; border-radius: 10px; color: white;">
        <h2 class="product-title" id="detalle-nombre" style="color: #28a745; font-size: 2rem; margin-bottom: 15px;">${p.nombre}</h2>
        <p class="product-categoria" style="color: #ccc; font-size: 1.1rem; margin-bottom: 10px;">Categoría: ${p.categoria}</p>
        <p class="product-codigo" style="color: #aaa; font-size: 0.9rem; margin-bottom: 15px;">Código: ${p.codigo}</p>
        ${priceBlock}
        <p className="product-description" id="detalle-descripcion" style="line-height: 1.6; margin-bottom: 25px; color: #ddd;">${p.descripcion || 'Descripción no disponible.'}</p>
        <div className="d-flex align-items-center gap-3" style="margin-bottom: 20px;">
          <label for="cantidad-producto" style="color: #fff;">Cantidad:</label>
          <input type="number" id="cantidad-producto" className="form-control" value="1" min="1" style="max-width: 100px; background-color: #444; color: white; border: 1px solid #555;">
          <button className="btn btn-success btn-lg" id="btn-agregar-detalle" data-id="${p.id}" style="background-color: #28a745; border: none; padding: 12px 24px; font-size: 1.1rem; border-radius: 6px;">Agregar al Carrito</button>
        </div>
        <div className="product-meta" style="border-top: 1px solid #555; padding-top: 15px;">
          <p style="color: #ccc;"><strong>Disponibilidad:</strong> En stock</p>
          <p style="color: #ccc;"><strong>Envío:</strong> Gratis a todo Chile</p>
        </div>
      </div>
    </div>`;
  fixLegacyClassNameAttributes(cont);

  // Preparar modal de imagen a tamaño completo
  const modal = document.getElementById('imagenModal');
  const img = document.getElementById('detalle-img');
  if (modal && img) {
    modal.addEventListener('show.bs.modal', () => {
      const body = modal.querySelector('.modal-body');
      if (body) body.innerHTML = `<img src="${toAbs(img.getAttribute('src'))}" alt="${p.nombre}" style="max-width:95vw;max-height:90vh;height:auto;display:block;margin:0 auto;border-radius:8px;object-fit:contain;">`;
    });
  }

  const btn = $('#btn-agregar-detalle');
  if (btn) btn.addEventListener('click', () => {
    const qtyEl = $('#cantidad-producto');
    const qty = qtyEl ? Math.max(1, parseInt(qtyEl.value, 10) || 1) : 1;
    agregarAlCarritoPorId(p.id, qty);
    // Renderizar carrito si estamos en la página de carrito
    if ($('#carrito-items')) renderizarCarrito();
  });
  console.log('Detalle renderizado correctamente para:', p.nombre);
}

// Renderizar carrito
function renderizarCarrito() {
  console.log('renderizarCarrito: Iniciando...');
  const container = $('#carrito-items');
  if (!container) {
    console.log('ERROR: No se encontró #carrito-items');
    return;
  }
  console.log('Contenedor encontrado, renderizando carrito con', carrito.length, 'items');
  container.innerHTML = '';

  if (!carrito.length) {
    container.innerHTML = '<p style="color: #fff; text-align: center; padding: 50px; font-size: 1.2rem;">Tu carrito está vacío. <a href="/Productos" style="color: #28a745; text-decoration: none;">Agrega productos</a>.</p>';
    const contador = $('#contador-items');
    if (contador) {
      contador.textContent = '0 items';
      contador.style.color = '#fff';
      contador.style.fontSize = '1.1rem';
      contador.style.fontWeight = 'bold';
      contador.style.textAlign = 'center'; 
      contador.style.display = 'block'; 
      contador.style.margin = '0 auto'; 
    }
    return;
  }

  const contador = $('#contador-items');
  if (contador) {
    contador.textContent = `${carrito.length} items`;
    contador.style.color = '#fff';
    contador.style.fontSize = '1.1rem';
    contador.style.fontWeight = 'bold';
    contador.style.textAlign = 'center'; 
    contador.style.display = 'block'; 
    contador.style.margin = '0 auto'; 
  }

  carrito.forEach((item, index) => {
    const div = document.createElement('div');
    div.classNameName = 'item-carrito';
    div.style.display = 'flex'; 
    div.style.alignItems = 'center';
    div.style.padding = '15px';
    div.style.marginBottom = '10px';
    div.style.backgroundColor = '#333';
    div.style.borderRadius = '8px';
    div.style.color = 'white';
    div.innerHTML = `
      <img src="${toAbs(item.imagen || 'img/logo-level-Up.png')}" alt="${item.nombre}" onerror="this.src='/img/logo-level-Up.png'" style="width: 80px; height: 80px; object-fit: cover; border-radius: 6px; margin-right: 15px;">
      <div className="info-item" style="flex: 1;">
        <h4 style="margin: 0 0 5px 0; color: #28a745;">${item.nombre}</h4>
        <p style="margin: 0; color: #ccc;">Código: ${item.codigo || item.id} | Precio: ${formatearCLP(item.precio)}</p>
        <p style="margin: 0; color: #aaa; font-size: 0.9rem;">${PRODUCTOS.find(p => String(p.id) === String(item.id))?.descripcion.substring(0, 60) || 'Descripción no disponible.'}...</p>
        <div className="controles-cantidad" style="display: flex; align-items: center; gap: 10px; margin-top: 10px;">
          <button className="btn-qty" onclick="cambiarCantidad(${item.id}, -1)" style="background-color: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">-</button>
          <span style="font-size: 1.1rem;">${item.qty}</span>
          <button className="btn-qty" onclick="cambiarCantidad(${item.id}, 1)" style="background-color: #28a745; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">+</button>
        </div>
      </div>
      <div style="text-align: right;">
        <p style="margin: 0; color: #ffc107; font-weight: bold;">Subtotal: ${formatearCLP(item.precio * item.qty)}</p>
        <button className="btn-remove" onclick="cambiarCantidad(${item.id}, -${item.qty})" style="background-color: #dc3545; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; margin-top: 10px;">Eliminar</button>
      </div>`;
    container.appendChild(div);
  });

  // Calcular total con descuento para clientes registrados
  const subtotal = carrito.reduce((s, it) => s + it.precio * it.qty, 0);
  const descuento = usuarioActual ? 0.1 : 0; // 10% descuento para usuarios registrados
  const total = subtotal * (1 - descuento);

  const resumen = $('.resumen-pedido');
  if (resumen) {
    if (!usuarioActual) {
      resumen.innerHTML = `
        <div className="mensaje-login-carrito" style="background-color: #f8d7da; color: #721c24; padding: 15px; border-radius: 8px; text-align: center;">
          <p style="margin: 0; font-weight: bold;">Para proceder al pago, debes <a href="/login" style="color: #28a745;">iniciar sesión</a> o <a href="/registro" style="color: #28a745;">registrarte</a>.</p>
          <p style="margin: 10px 0 0 0; font-size: 0.9rem;">¡Regístrate y obtén 10% de descuento en tu compra!</p>
        </div>`;
    } else {
      const subtotal = carrito.reduce((s, it) => s + it.precio * it.qty, 0);
      const descuento = 0.1;
      const total = subtotal * (1 - descuento);
      resumen.innerHTML = `
        <div className="total-carrito" style="background-color: #333; padding: 20px; border-radius: 8px; color: white; box-shadow: 0 4px 8px rgba(0,0,0,0.5);">
          <h3 style="color: #28a745; margin-bottom: 15px; text-align: center;">Resumen del Pedido</h3>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span>Subtotal:</span>
            <span>${formatearCLP(subtotal)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px; color: #ffc107;">
            <span>Descuento (10%):</span>
            <span>-${formatearCLP(subtotal * descuento)}</span>
          </div>
          <hr style="border-color: #555; margin: 15px 0;">
          <div style="display: flex; justify-content: space-between; font-size: 1.2rem; font-weight: bold; color: #28a745;">
            <span>Total:</span>
            <span>${formatearCLP(total)}</span>
          </div>
        </div>`;
    }
  }
  console.log('Carrito renderizado correctamente');
}

// Recomendaciones (para index.html u otros)
function renderizarRecomendaciones(selector = '.recomendaciones', cantidad = 8) {
  const contenedor = $(selector);
  if (!contenedor) {
    console.log('No se encontró contenedor para recomendaciones:', selector);
    return;
  }
  console.log('Renderizando recomendaciones en', selector, 'cantidad:', cantidad);
  contenedor.innerHTML = '';
  const productos = [...PRODUCTOS].sort(() => 0.5 - Math.random()).slice(0, cantidad);
  productos.forEach(p => {
    const div = document.createElement('div');
    div.className = 'tarjeta-producto-inicio';
    const simulatedIds = new Set([1,3,5,7,9]);
    const d = typeof p.descuento === 'number' ? p.descuento : (simulatedIds.has(Number(p.id)) ? 0.2 : 0);
    const precioOferta = Math.round((p.precio || 0) * (1 - d));
    const badge = d > 0 ? `<span class="insignia-producto-productos" style="position:absolute;top:10px;left:10px">${Math.round(d*100)}% OFF</span>` : '';
    const bloquePrecio = d > 0
      ? `<div style="display:flex;flex-direction:column;align-items:flex-start;gap:4px">
           <span style="text-decoration:line-through;opacity:.7">${formatearCLP(p.precio)}</span>
           <p class="precio-producto-inicio" style="margin:0">${formatearCLP(precioOferta)}</p>
         </div>`
      : `<p class="precio-producto-inicio">${formatearCLP(p.precio)}</p>`;
    div.innerHTML = `
      <div style="position:relative">
        ${badge}
        <img class="imagen-producto-inicio" src="${toAbs(p.imagen)}" alt="${p.nombre}" loading="lazy" onerror="this.src='/img/logo-level-Up.png'">
      </div>
      <div class="info-producto-inicio">
        <h5 class="nombre-producto-inicio">${p.nombre}</h5>
        <p>${p.categoria}</p>
        ${bloquePrecio}
        <div class="botones-producto-inicio">
          <button class="btn-producto-inicio btn-agregar" data-id="${p.id}">Agregar</button>
          <button class="btn-detalle-inicio btn-ver-detalle" data-id="${p.id}">Ver Detalle</button>
        </div>
      </div>`;
    contenedor.appendChild(div);
  });
  fixLegacyClassNameAttributes(contenedor);
  console.log('Recomendaciones renderizadas:', productos.length);
}
function configurarRegistro() {
  const form = $('#form-registro');
  if (!form) {
    console.log('ERROR: No se encontró #form-registro en registro (SPA)');
    return;
  }
  console.log('configurarRegistro: Form encontrado, agregando evento');
  form.addEventListener('submit', (e) => {
    console.log('configurarRegistro: Submit ejecutado');
    e.preventDefault();
    const nombre = (form.querySelector('#nombre') || form.querySelector('input[name="nombre"]'))?.value?.trim() || '';
    const correo = (form.querySelector('#email') || form.querySelector('#correo') || form.querySelector('input[type="email"]'))?.value?.trim().toLowerCase() || '';
    const pass = (form.querySelector('#password') || form.querySelector('#contrasena') || form.querySelector('input[type="password"]'))?.value || '';
    const confirmar = (form.querySelector('#confirmar_password') || form.querySelector('#confirmar-contrasena') || form.querySelector('input[name*="confirmar"][type="password"]'))?.value || '';

    console.log('Datos ingresados - Nombre:', nombre, 'Correo:', correo, 'Pass length:', pass.length);

    const errores = [];
    if (!nombre) errores.push('Nombre es requerido.');
    if (!correo || !validarCorreo(correo)) errores.push('Correo inválido o no permitido.');
    if (!validarPassword(pass)) errores.push('La contraseña debe tener mínimo 6 caracteres.');
    if (pass !== confirmar) errores.push('Las contraseñas no coinciden.');

    const usuarios = obtenerLS('usuarios', []);
    if (usuarios.find(u => (u.correo || u.email || '').toLowerCase() === correo)) errores.push('Ya existe un usuario con ese correo.');

    if (errores.length) { alert('Errores:\n- ' + errores.join('\n- ')); return; }

    const nuevo = { id: Date.now(), nombre, correo, password: pass, rol: 'usuario', fechaRegistro: new Date().toISOString() };
    usuarios.push(nuevo);
    guardarLS('usuarios', usuarios);
    console.log('Usuario registrado:', nuevo);
    alert('Registro exitoso. Ahora inicia sesión.');
    setTimeout(()=> location.href = '/login', 600);
  });
}

function configurarLogin() {
  const form = $('#form-login') || $('#login-form');
  if (!form) {
    console.log('ERROR: No se encontró #form-login en login (SPA)');
    return;
  }
  console.log('configurarLogin: Form encontrado, agregando evento');
  form.addEventListener('submit', (e) => {
    console.log('configurarLogin: Submit ejecutado, previniendo comportamiento por defecto');
    console.log('Validaciones ejecutándose...');
    e.preventDefault(); 
    e.stopPropagation(); 
    const correo = (form.querySelector('#email') || form.querySelector('#correo') || form.querySelector('input[type="email"]'))?.value?.trim().toLowerCase() || '';
    const pass = (form.querySelector('#password') || form.querySelector('input[type="password"]'))?.value || '';

    console.log('Correo ingresado:', correo);
    console.log('Pass ingresado:', pass ? 'Con valor' : 'Vacío');

    const errores = [];
    if (!correo) errores.push('El correo es requerido.');
    if (!pass) errores.push('La contraseña es requerida.');
    else if (!validarPassword(pass)) errores.push('La contraseña debe tener entre 6 y 20 caracteres.');
    if (errores.length) {
      alert('Errores en el formulario:\n- ' + errores.join('\n- '));
      return;
    }

    const usuarios = obtenerLS('usuarios', []);
    console.log('Usuarios registrados:', usuarios.length);
    const passTrim = pass.trim();
    const user = usuarios.find(u => {
      const mail = (u.correo || u.email || '').trim().toLowerCase();
      const stored = (u.password || u.contrasena || '').trim();
      return mail === correo && (stored === passTrim || stored === btoa(passTrim));
    });
    if (!user) {
      alert('Correo o contraseña incorrectos');
      return;
    }

    guardarLS('usuarioActual', user);
    usuarioActual = user;
    console.log('Usuario guardado en LS:', user);
    console.log('usuarioActual global:', usuarioActual);
    alert('Bienvenido ' + user.nombre);
    setTimeout(()=> location.href = '/', 600);
  });
}

function configurarContacto() {
  const form = $('#form-contacto');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = (form.querySelector('#nombre') || form.querySelector('input[name="nombre"]'))?.value?.trim() || '';
    const correo = (form.querySelector('#email') || form.querySelector('#correo') || form.querySelector('input[type="email"]'))?.value?.trim().toLowerCase() || '';
    const asunto = (form.querySelector('#asunto') || form.querySelector('input[name="asunto"]'))?.value?.trim() || '';
    const mensaje = (form.querySelector('#mensaje') || form.querySelector('textarea'))?.value?.trim() || '';

    const errores = [];
    if (!nombre) errores.push('Nombre requerido.');
    if (!correo || !validarCorreo(correo)) errores.push('Correo inválido (dominios permitidos).');
    if (!asunto) errores.push('Asunto requerido.');
    if (!mensaje) errores.push('Mensaje requerido.');

    if (errores.length) { alert('Errores:\n- ' + errores.join('\n- ')); return; }

    alert('¡Mensaje enviado! Nos pondremos en contacto pronto.');
    form.reset();
  });
}

// Inicialización y eventos
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded ejecutado');
  carrito = obtenerLS('carrito', []);
  usuarioActual = obtenerLS('usuarioActual', null);
  console.log('Usuario actual cargado desde LS:', usuarioActual);
  console.log('Usuario actual nombre:', usuarioActual ? usuarioActual.nombre : 'Ninguno');
  console.log('Usuario actual rol:', usuarioActual ? usuarioActual.rol : 'Ninguno');

  // Normalizar y deduplicar productos guardados antes de construir catálogo
  normalizarProductosEnLS();
  // Catálogo final = defaults + guardados (los guardados sobrescriben por "codigo")
  const productosGuardados = obtenerLS('productos', []);
  const byCodigo = new Map();
  const keyOf = (c) => String((c || '').trim().toLowerCase());
  // Cargar defaults primero
  DEFAULT_PRODUCTOS.forEach(p => byCodigo.set(keyOf(p.codigo), sanitizeProducto(p)));
  // Superponer guardados
  if (Array.isArray(productosGuardados)) {
    productosGuardados.forEach(p => {
      const k = keyOf(p.codigo);
      const base = byCodigo.get(k) || {};
      byCodigo.set(k, sanitizeProducto({ ...base, ...p }));
    });
  }
  PRODUCTOS.length = 0;
  PRODUCTOS.push(...byCodigo.values());
  console.log('Catálogo listo (defaults + guardados):', PRODUCTOS.length, 'productos');
  // Override de imagenes actualizadas (forzar nueva ruta si cambió el asset)
  for (let i = 0; i < PRODUCTOS.length; i++) {
    const p = PRODUCTOS[i];
    if (String(p.codigo).trim().toUpperCase() === 'AC001') {
      PRODUCTOS[i] = { ...p, imagen: 'img/Controlador_inalambrico_xbox_series_x.webp' };
    }
  }
  // Persistir catálogo saneado y combinado para futuras cargas
  guardarLS('productos', PRODUCTOS);

  // Asegurar usuarios base siempre existan (demo + admin sistema)
  normalizarPasswordsEnLS();
  const usuarios = obtenerLS('usuarios', []);
  let usuariosCambiados = false;
  const ensureUser = (correo, nombre, password, rol, id) => {
    const idx = usuarios.findIndex(u => ((u.correo || u.email || '').trim().toLowerCase()) === correo);
    if (idx === -1) {
      usuarios.push({ id, nombre, correo, password, rol, fechaRegistro: new Date().toISOString() });
      usuariosCambiados = true;
    } else {
      const u = { ...usuarios[idx] };
      let changed = false;
      // Unificar campo correo
      const currentMail = (u.correo || u.email || '').trim().toLowerCase();
      if (currentMail !== correo) { u.correo = correo; changed = true; }
      // Unificar password y corregir si no coincide con esperado
      if (u.contrasena && !u.password) { u.password = u.contrasena; delete u.contrasena; changed = true; }
      const stored = (u.password || '').trim();
      if (!(stored === password || stored === btoa(password))) { u.password = password; changed = true; }
      // Rol y nombre esperados
      if ((u.rol || '').toString().toLowerCase() !== rol) { u.rol = rol; changed = true; }
      if (!u.nombre) { u.nombre = nombre; changed = true; }
      // Asegurar id estable si falta
      if (typeof u.id === 'undefined' || u.id === null) { u.id = id; changed = true; }
      if (changed) { usuarios[idx] = u; usuariosCambiados = true; }
    }
  };
  ensureUser('admin@duoc.cl', 'Admin', 'admin123', 'admin', 1);
  ensureUser('cliente@gmail.com', 'Cliente', 'cliente123', 'usuario', 2);
  ensureUser('admin@sistema.com', 'Administrador Sistema', 'admin123', 'admin', 0);
  if (usuariosCambiados) {
    guardarLS('usuarios', usuarios);
    console.log('Usuarios base asegurados/actualizados');
  }

  actualizarHeader();
  actualizarInsigniaCarrito();

  // Configurar formularios
  configurarLogin();
  configurarRegistro();
  configurarContacto();

  // Renderizar detalle si aplica
  if ($('#detalle-producto')) {
    console.log('Página de detalle detectada, renderizando producto');
    renderizarDetalle();
  }

  // Renderizar carrito si aplica
  if ($('#carrito-items')) {
    console.log('Página de carrito detectada, renderizando carrito');
    renderizarCarrito();
  }

  // Renderizar catálogo si aplica
  if ($('#lista-productos') || $('.catalogo')) {
    console.log('Renderizando catálogo');
    productosFiltrados = PRODUCTOS;
    // Preseleccionar categoría desde la URL si viene desde index
    try {
      const params = new URLSearchParams(location.search);
      const cat = (params.get('categoria') || '').toLowerCase();
      const map = {
        'consolas': 'Consolas',
        'computadores': 'Computadores Gamers',
        'accesorios': 'Accesorios',
        'sillas': 'Sillas Gamers',
        'juegos': 'Juegos de Mesa'
      };
      if (cat && map[cat] && $('#filtro-categoria')) {
        $('#filtro-categoria').value = map[cat];
      }
    } catch {}
    aplicarFiltros();
    $('#filtro-categoria') && $('#filtro-categoria').addEventListener('change', aplicarFiltros);
    $('#filtro-precio') && $('#filtro-precio').addEventListener('change', aplicarFiltros);
    $('#busqueda') && $('#busqueda').addEventListener('input', aplicarFiltros);
  }

  // Renderizar recomendaciones en index si aplica
  if ($('#productos-destacados')) {
    console.log('Renderizando recomendaciones en index');
    const destacados = $('#productos-destacados');
    // Asegurar clase de grid definida en pagina-inicio.css
    destacados.classList.add('grid-productos-inicio');
    // No sobrescribir estilos: dejar que el CSS maneje el grid
    destacados.removeAttribute('style');
    renderizarRecomendaciones('#productos-destacados', 3);
  }

  // Renderizar admin si aplica
  if (location.pathname.includes('/admin')) {
    console.log('Página de admin detectada');
    const role = (usuarioActual && usuarioActual.rol ? String(usuarioActual.rol).toLowerCase() : '');
    const nameHasAdmin = (usuarioActual && usuarioActual.nombre ? String(usuarioActual.nombre).toLowerCase().includes('admin') : false);
    if (usuarioActual && (role === 'admin' || role === 'administrador' || nameHasAdmin)) {
      console.log('Usuario admin logueado, permaneciendo en admin');
      // Renderizar listas según la página
      actualizarDashboardAdmin();
      if ($('#tabla-productos')) {
        console.log('Renderizando productos en admin');
        renderizarProductosAdmin();
        const formProd = document.getElementById('form-producto');
        if (formProd) {
          formProd.addEventListener('submit', guardarProductoAdmin);
        }
      }
      if ($('#tabla-usuarios')) {
        console.log('Renderizando usuarios en admin');
        renderizarUsuariosAdmin();
        const formUsr = document.getElementById('form-usuario');
        if (formUsr) {
          formUsr.addEventListener('submit', guardarUsuario);
        }
        // Al abrir en modo 'Nuevo Usuario', limpiar formulario y título
        document.addEventListener('click', (e) => {
          const openUsr = e.target.closest('[data-bs-target="#modalUsuario"]');
          if (openUsr) {
            const f = document.getElementById('form-usuario');
            if (f) {
              f.reset();
              f.elements['id'].value = '';
            }
            const t = document.getElementById('modalUsuarioTitulo');
            if (t) t.textContent = 'Nuevo Usuario';
          }
        });
      }
    } else {
      console.log('Usuario no admin, redirigiendo a login');
      location.href = '/login';
    }
  }

  // Eventos globales
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-agregar');
    if (btn && btn.dataset.id) {
      console.log('Agregando al carrito ID:', btn.dataset.id);
      agregarAlCarritoPorId(btn.dataset.id, 1);
    }
    const ver = e.target.closest('.btn-ver-detalle');
    if (ver && ver.dataset.id) {
      console.log('Ver detalle para ID:', ver.dataset.id);
      // Navegación SPA hacia la ruta React /producto/:id
      location.href = `/producto/${encodeURIComponent(ver.dataset.id)}`;
    }
  });
});

// Funciones de admin
function renderizarProductosAdmin() {
  const tbody = $('#tabla-productos');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  PRODUCTOS.forEach(p => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="text-center">${p.id}</td>
      <td><strong>${p.nombre}</strong></td>
      <td class="d-none d-md-table-cell">${p.descripcion.substring(0, 40)}...</td>
      <td><span class="badge bg-secondary">${p.categoria}</span></td>
      <td class="text-end">${formatearCLP(p.precio)}</td>
      <td class="text-center">
        <button class="btn btn-sm btn-outline-warning me-1" onclick="editarProducto(${p.id})">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick="eliminarProducto(${p.id})">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// CRUD de productos (admin)
function guardarProductoAdmin(e) {
  e.preventDefault();
  const form = e.target;
  const id = parseInt(form.elements['id'].value) || Date.now();
  const codigo = (form.elements['codigo']?.value || '').trim();
  const categoria = (form.elements['categoria']?.value || '').trim();
  const nombre = (form.elements['nombre']?.value || '').trim();
  const precio = parseInt(form.elements['precio']?.value || '0', 10);
  const stock = parseInt(form.elements['stock']?.value || '0', 10);
  const imagen = (form.elements['imagen']?.value || '').trim();
  const descripcion = (form.elements['descripcion']?.value || '').trim();

  const errores = [];
  if (!codigo) errores.push('Código requerido');
  if (!categoria) errores.push('Categoría requerida');
  if (!nombre) errores.push('Nombre requerido');
  if (!(precio >= 0)) errores.push('Precio inválido');
  if (!(stock >= 0)) errores.push('Stock inválido');
  if (!imagen) errores.push('Imagen requerida (ej: img/otro_fondo.jpg)');
  if (errores.length) { Swal.fire('Errores', errores.join('\n'), 'error'); return; }

  // Buscar si existe
  const idx = PRODUCTOS.findIndex(p => p.id === id);
  const key = codigo.toLowerCase();
  const idxCodigo = PRODUCTOS.findIndex(p => String(p.codigo || '').trim().toLowerCase() === key);
  const producto = { id, codigo, nombre, precio, categoria, imagen, descripcion, stock };

  const swalOk = (texto) => {
    if (window.Swal) {
      Swal.fire({
        title: '¡Agregado!',
        text: texto,
        icon: 'success',
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
        background: '#28a745',
        color: '#fff',
        confirmButtonColor: '#1e1e1e'
      });
    } else {
      // Fallback minimal (negro) si no carga Swal, mismo que legacy
      try { aviso(texto); } catch {}
    }
  };

  if (idx >= 0) {
    PRODUCTOS[idx] = producto;
    swalOk('Producto actualizado correctamente');
  } else {
    if (idxCodigo >= 0) {
      // Reemplazar el que tiene el mismo código
      PRODUCTOS[idxCodigo] = producto;
      swalOk('Producto actualizado (mismo código)');
    } else {
      PRODUCTOS.push(producto);
      swalOk('Producto creado correctamente');
    }
  }

  // Deduplicar por código antes de persistir (el último prevalece)
  const mapByCodigo = new Map();
  PRODUCTOS.forEach(p => {
    const k = String((p.codigo || '').trim().toLowerCase());
    if (k) mapByCodigo.set(k, p);
  });
  const dedup = Array.from(mapByCodigo.values());
  guardarLS('productos', dedup);

  // Reset y cerrar modal
  const modalEl = document.getElementById('modalProducto');
  const instance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
  instance.hide();
  form.reset();
  form.elements['id'].value = '';
  const titulo = document.getElementById('modalProductoTitulo');
  if (titulo) titulo.textContent = 'Nuevo Producto';
  // Limpieza defensiva de backdrop por si queda activo
  setTimeout(() => {
    document.body.classList.remove('modal-open');
    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
  }, 200);

  // Refrescar tabla
  renderizarProductosAdmin();
  // Actualizar dashboard
  try { document.getElementById('total-productos').textContent = PRODUCTOS.length; } catch {}
}

function editarProducto(id) {
  const p = PRODUCTOS.find(x => x.id === id);
  if (!p) return;
  const form = document.getElementById('form-producto');
  if (!form) return;
  form.elements['id'].value = p.id;
  form.elements['codigo'].value = p.codigo || '';
  form.elements['categoria'].value = p.categoria || '';
  form.elements['nombre'].value = p.nombre || '';
  form.elements['precio'].value = p.precio || 0;
  form.elements['stock'].value = p.stock ?? 0;
  form.elements['imagen'].value = p.imagen || '';
  form.elements['descripcion'].value = p.descripcion || '';
  const titulo = document.getElementById('modalProductoTitulo');
  if (titulo) titulo.textContent = 'Editar Producto';
  const modalEl = document.getElementById('modalProducto');
  const instance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
  instance.show();
}

function eliminarProducto(id) {
  Swal.fire({
    title: '¿Eliminar producto?',
    text: 'Esta acción no se puede deshacer',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d33'
  }).then(res => {
    if (!res.isConfirmed) return;
    const idx = PRODUCTOS.findIndex(p => p.id === id);
    if (idx >= 0) {
      PRODUCTOS.splice(idx, 1);
      guardarLS('productos', PRODUCTOS);
      renderizarProductosAdmin();
      try { document.getElementById('total-productos').textContent = PRODUCTOS.length; } catch {}
      Swal.fire('Eliminado', 'Producto eliminado', 'success');
    }
  });
}

function renderizarUsuariosAdmin() {
  const tbody = $('#tabla-usuarios');
  if (!tbody) return;
  
  const usuarios = obtenerLS('usuarios', []);
  tbody.innerHTML = '';
  usuarios.forEach(u => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="text-center">${u.id}</td>
      <td><strong>${u.nombre}</strong></td>
      <td class="d-none d-md-table-cell">${u.correo || u.email}</td>
      <td class="text-center"><span class="badge bg-${u.rol === 'admin' ? 'danger' : u.rol === 'vendedor' ? 'warning' : 'primary'}">${u.rol}</span></td>
      <td class="d-none d-lg-table-cell">${u.fechaRegistro ? new Date(u.fechaRegistro).toLocaleDateString() : 'N/A'}</td>
      <td class="text-center">
        <button class="btn btn-sm btn-outline-warning me-1" onclick="editarUsuario(${u.id})">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick="eliminarUsuario(${u.id})">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// Funciones reales para gestión de usuarios
function editarUsuario(id) {
  const usuarios = obtenerLS('usuarios', []);
  const usuario = usuarios.find(u => u.id === id);
  
  if (usuario) {
    // Llenar modal con datos del usuario
    $('#form-usuario').elements['id'].value = usuario.id;
    $('#form-usuario').elements['nombre'].value = usuario.nombre;
    $('#form-usuario').elements['email'].value = usuario.correo || usuario.email;
    $('#form-usuario').elements['password'].value = ''; 
    $('#form-usuario').elements['rol'].value = usuario.rol;
    
    // Cambiar título del modal
    $('#modalUsuarioTitulo').textContent = 'Editar Usuario';
    
    // Mostrar modal
    const modal = new bootstrap.Modal($('#modalUsuario'));
    modal.show();
  }
}

function eliminarUsuario(id) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción no se puede deshacer',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      const usuarios = obtenerLS('usuarios', []);
      const usuariosFiltrados = usuarios.filter(u => u.id !== id);
      guardarLS('usuarios', usuariosFiltrados);
      
      // Recargar tabla
      renderizarUsuariosAdmin();
      
      // Actualizar dashboard si está abierto
      if (document.getElementById('total-usuarios')) {
        document.getElementById('total-usuarios').textContent = usuariosFiltrados.length;
      }
      
      Swal.fire('Eliminado', 'El usuario ha sido eliminado correctamente', 'success');
    }
  });
}

// Función para guardar usuario (nuevo o editar) - COMPLETAMENTE CORREGIDA
async function guardarUsuario(event) {
  event.preventDefault();

  const form = event.target;
  const id = parseInt(form.elements['id'].value) || Date.now();
  const nombre = form.elements['nombre'].value.trim();
  const email = form.elements['email'].value.trim();
  const password = form.elements['password'].value;
  const rol = form.elements['rol'].value;

  // Validaciones básicas
  if (!nombre || nombre.length < 2) {
    Swal.fire('Error', 'El nombre debe tener al menos 2 caracteres', 'error');
    return;
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    Swal.fire('Error', 'Ingresa un email válido', 'error');
    return;
  }

  if (password && password.length < 6) {
    Swal.fire('Error', 'La contraseña debe tener al menos 6 caracteres', 'error');
    return;
  }

  // Obtener usuarios actuales
  const usuarios = obtenerLS('usuarios', []);
  const emailExiste = usuarios.some(u => u.correo === email || u.email === email);
  const usuarioEditando = usuarios.find(u => u.id === id);

  if (emailExiste && (!usuarioEditando || usuarioEditando.correo !== email && usuarioEditando.email !== email)) {
    Swal.fire('Error', 'Este email ya está registrado', 'error');
    return;
  }

  // Crear objeto usuario
  const usuario = {
    id,
    nombre,
    correo: email,
    email, // Para compatibilidad
    rol,
    fechaRegistro: usuarioEditando ? usuarioEditando.fechaRegistro : new Date().toISOString()
  };

  // Manejar contraseña correctamente
  if (password) {
    usuario.password = password; // Guardar contraseña directamente
  } else if (usuarioEditando) {
    usuario.password = usuarioEditando.password; // Mantener contraseña existente
  } else {
    Swal.fire('Error', 'La contraseña es requerida para nuevos usuarios', 'error');
    return;
  }

  // Guardar usuario
  let alertTitle = '', alertText = '', alertIcon = 'success';
  if (usuarioEditando) {
    // Editar usuario existente
    const index = usuarios.findIndex(u => u.id === id);
    usuarios[index] = usuario;
    alertTitle = 'Actualizado';
    alertText = 'El usuario ha sido actualizado correctamente';
  } else {
    // Nuevo usuario
    usuarios.push(usuario);
    alertTitle = 'Creado';
    alertText = 'El usuario ha sido creado correctamente';
  }

  guardarLS('usuarios', usuarios);

  // Mostrar confirmación y luego cerrar modal y recargar tabla
  if (typeof Swal !== 'undefined') {
    await Swal.fire(alertTitle, alertText, alertIcon);
  }
  const modalElUsr = $('#modalUsuario');
  const modalUsr = bootstrap.Modal.getInstance(modalElUsr) || new bootstrap.Modal(modalElUsr);
  modalUsr.hide();
  // Limpieza defensiva de backdrop por si queda activo
  setTimeout(() => {
    document.body.classList.remove('modal-open');
    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
  }, 200);

  renderizarUsuariosAdmin();

  // Actualizar dashboard si está abierto
  if (document.getElementById('total-usuarios')) {
    document.getElementById('total-usuarios').textContent = usuarios.length;
  }

  // Limpiar formulario
  form.reset();
  form.elements['id'].value = '';
}

// Limpieza adicional cuando el modal de usuario se oculta completamente
document.addEventListener('DOMContentLoaded', () => {
  const modalUsuarioEl = document.getElementById('modalUsuario');
  if (modalUsuarioEl) {
    modalUsuarioEl.addEventListener('hidden.bs.modal', () => {
      document.body.classList.remove('modal-open');
      document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
    });
  }
});

