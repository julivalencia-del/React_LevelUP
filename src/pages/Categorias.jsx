import '../css/globales.css'
import '../css/pagina-productos.css'
import { useEffect, useMemo, useState } from 'react'

function getLS(key, fb) { try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fb } catch { return fb } }
function getProductos() {
  const ls = getLS('productos', [])
  if (Array.isArray(ls) && ls.length) return ls
  if (window && Array.isArray(window.PRODUCTOS)) return window.PRODUCTOS
  return []
}
function getCategoriasNombres(productos) {
  const set = new Set()
  productos.forEach(p => p?.categoria && set.add(p.categoria))
  return Array.from(set)
}
function getCategoriasFromLS(productos) {
  const ls = getLS('categorias', [])
  if (Array.isArray(ls) && ls.length) {
    // usar solo activas; si no hay activas, usar todas
    const activas = ls.filter(c => (c.estado || 'Activo') === 'Activo').map(c => c.nombre).filter(Boolean)
    return activas.length ? activas : ls.map(c => c?.nombre).filter(Boolean)
  }
  // fallback a derivadas desde productos
  return getCategoriasNombres(productos)
}

export default function Categorias() {
  const [productos, setProductos] = useState(getProductos())
  const [categorias, setCategorias] = useState(getCategoriasFromLS(getProductos()))
  const [seleccion, setSeleccion] = useState('')
  const [usuario, setUsuario] = useState(() => {
    try {
      const id = parseInt(localStorage.getItem('currentUserId'), 10)
      if (!id) return null
      const usuarios = getLS('usuarios', [])
      return Array.isArray(usuarios) ? usuarios.find(u => u.id === id) || null : null
    } catch { return null }
  })

  useEffect(() => {
    document.body.classList.add('pagina-categorias')
    document.body.classList.add('pagina-productos')
    return () => {
      document.body.classList.remove('pagina-categorias')
      document.body.classList.remove('pagina-productos')
    }
  }, [])

  // Cargar scripts legacy una vez (validaciones y app.js)
  useEffect(() => {
    const loadOnce = (src) => new Promise((resolve) => {
      const exist = document.querySelector(`script[src='${src}']`)
      if (exist) return resolve('exists')
      const sc = document.createElement('script')
      sc.src = src
      sc.async = true
      sc.onload = () => resolve('loaded')
      document.body.appendChild(sc)
    })
    ;(async () => {
      await loadOnce('/js/validaciones.js')
      if (!window._legacyAppLoaded) {
        await loadOnce('/js/app.js')
        window._legacyAppLoaded = true
      }
      if (document.readyState !== 'loading') {
        document.dispatchEvent(new Event('DOMContentLoaded'))
      }
    })()
  }, [])

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'productos') {
        const prods = getProductos()
        setProductos(prods)
        // si no hay categorías en LS, refrescar derivadas
        const lsCats = getLS('categorias', [])
        if (!Array.isArray(lsCats) || lsCats.length === 0) {
          setCategorias(getCategoriasNombres(prods))
        }
      }
      if (e.key === 'categorias') {
        setCategorias(getCategoriasFromLS(productos))
      }
      if (e.key === 'currentUserId' || e.key === 'usuarios') {
        try {
          const id = parseInt(localStorage.getItem('currentUserId'), 10)
          const usuarios = getLS('usuarios', [])
          setUsuario(Array.isArray(usuarios) ? usuarios.find(u => u.id === id) || null : null)
        } catch { /* noop */ }
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  // Sincronizar categorías locales al montar y cuando cambian productos
  useEffect(() => {
    setCategorias(getCategoriasFromLS(productos))
  }, [productos])

  const filtrados = useMemo(() => {
    const cat = seleccion || categorias[0]
    return productos.filter(p => (cat ? p.categoria === cat : true) && ((p.stock ?? 0) > 0))
  }, [productos, seleccion, categorias])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('currentUserId')
    window.location.href = '/login'
  }

  return (
    <>
      <div className="acciones-container" style={{display: 'none'}}></div>
      <div className="sidebar-admin" id="sidebar-admin" style={{display: 'none'}}>
        <a href="/admin">Admin</a>
      </div>
      <main className="contenedor-categorias">
      <div className="container">
        <header className="hero-categorias text-center mb-4">
          <h1 className="titulo-hero-categorias">CATEGORÍAS</h1>
          <p className="subtitulo-hero-categorias">Explora productos por categoría</p>
        </header>

        <section className="listado-categorias mb-3">
          <div className="d-flex flex-wrap gap-2 justify-content-center">
            {categorias.length === 0 && <span className="text-muted">Sin categorías</span>}
            {categorias.map(cat => (
              <button key={cat} className={`btn btn-sm ${cat=== (seleccion||categorias[0]) ? 'btn-success' : 'btn-outline-light'}`} onClick={()=>setSeleccion(cat)}>
                {cat}
              </button>
            ))}
          </div>
        </section>

        <section className="productos-por-categoria mt-4">
          <h2 className="titulo-seccion h5 mb-3">Productos</h2>
          <div className="row g-3">
            {filtrados.map(p => (
              <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={p.id}>
                <div className="tarjeta-producto-productos h-100">
                  <div className="contenedor-imagen-productos">
                    <img className="imagen-producto-productos" src={p.imagen || 'img/logo-level-Up.png'} alt={p.nombre} onError={(e)=>{e.currentTarget.src='img/logo-level-Up.png'}}/>
                  </div>
                  <div className="info-producto-productos">
                    <h5 className="nombre-producto-productos">{p.nombre}</h5>
                    <div className="categoria-producto-productos">{p.categoria}</div>
                    <div className="pie-producto-productos">
                      <span className="precio-producto-productos">{(p.precio||0).toLocaleString('es-CL',{style:'currency',currency:'CLP',maximumFractionDigits:0})}</span>
                      <div className="botones-producto-productos">
                        <button className="btn-agregar-productos btn-agregar" onClick={() => {
                          const id = p.id
                          if (window.agregarAlCarritoPorId) {
                            window.agregarAlCarritoPorId(id, 1)
                          } else {
                            const ls = getLS('carrito', [])
                            const idx = ls.findIndex(it => String(it.id) === String(id))
                            const simulatedIds = new Set([1,3,5,7,9])
                            const d = typeof p.descuento === 'number' ? p.descuento : (simulatedIds.has(Number(p.id)) ? 0.2 : 0)
                            const precioFinal = Math.round((p.precio || 0) * (1 - d))
                            if (idx >= 0) ls[idx].qty = (ls[idx].qty || 1) + 1
                            else ls.push({ id: p.id, nombre: p.nombre, precio: precioFinal, imagen: p.imagen, qty: 1, categoria: p.categoria, codigo: p.codigo })
                            localStorage.setItem('carrito', JSON.stringify(ls))
                          }
                          // Refrescar insignia si existe
                          if (window.actualizarInsigniaCarrito) window.actualizarInsigniaCarrito()
                        }}>Agregar</button>
                        <a className="btn-detalle-productos btn-ver-detalle" href={`/detalle?id=${p.id}`}>Ver Detalle</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {filtrados.length===0 && <div className="text-center text-muted">No hay productos para esta categoría</div>}
          </div>
        </section>
      </div>
    </main>
    </>
  )
}
