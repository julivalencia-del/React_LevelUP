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

export default function Ofertas() {
  const [productos, setProductos] = useState(getProductos())

  useEffect(() => {
    document.body.classList.add('pagina-ofertas')
    document.body.classList.add('pagina-productos')
    return () => {
      document.body.classList.remove('pagina-ofertas')
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
    const onStorage = (e) => { if (e.key === 'productos') setProductos(getProductos()) }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const ofertas = useMemo(() => {
    // Si hay campo descuento en producto (0-1), usarlo. Sino, simular 20% en algunos ids.
    const simulatedIds = new Set([1,3,5,7,9])
    return productos
      .map(p => {
        const d = typeof p.descuento === 'number' ? p.descuento : (simulatedIds.has(Number(p.id)) ? 0.2 : 0)
        const precioOferta = Math.round((p.precio || 0) * (1 - d))
        return { ...p, descuento: d, precioOferta }
      })
      .filter(p => p.descuento > 0)
  }, [productos])

  return (
    <>
      <div className="acciones-container" style={{display: 'none'}}></div>
      <div className="sidebar-admin" id="sidebar-admin" style={{display: 'none'}}>
        <a href="/admin">Admin</a>
      </div>
      <main className="contenedor-ofertas">
      <div className="container">
        <header className="hero-ofertas text-center mb-4">
          <h1 className="titulo-hero-ofertas">OFERTAS</h1>
          <p className="subtitulo-hero-ofertas">Productos con descuento</p>
        </header>
        <div className="row g-3">
          {ofertas.map(p => (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={p.id}>
              <div className="tarjeta-producto-productos h-100">
                <div className="contenedor-imagen-productos" style={{position:'relative'}}>
                  <img className="imagen-producto-productos" src={p.imagen || 'img/logo-level-Up.png'} alt={p.nombre} onError={(e)=>{e.currentTarget.src='img/logo-level-Up.png'}}/>
                  <span className="insignia-producto-productos" style={{position:'absolute',top:'10px',left:'10px'}}>{Math.round(p.descuento*100)}% OFF</span>
                </div>
                <div className="info-producto-productos">
                  <h5 className="nombre-producto-productos">{p.nombre}</h5>
                  <div className="categoria-producto-productos">{p.categoria}</div>
                  <div className="pie-producto-productos">
                    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'4px'}}>
                      <span style={{textDecoration:'line-through',opacity:0.7}}>${(p.precio||0).toLocaleString('es-CL')}</span>
                      <span className="precio-producto-productos">${p.precioOferta.toLocaleString('es-CL')}</span>
                    </div>
                    <div className="botones-producto-productos">
                      <button className="btn-agregar-productos btn-agregar" onClick={() => {
                        const id = p.id
                        if (window.agregarAlCarritoPorId) {
                          window.agregarAlCarritoPorId(id, 1)
                        } else {
                          const ls = getLS('carrito', [])
                          const idx = ls.findIndex(it => String(it.id) === String(id))
                          if (idx >= 0) ls[idx].qty = (ls[idx].qty || 1) + 1
                          else ls.push({ id: p.id, nombre: p.nombre, precio: p.precioOferta, imagen: p.imagen, qty: 1, categoria: p.categoria, codigo: p.codigo })
                          localStorage.setItem('carrito', JSON.stringify(ls))
                        }
                        if (window.actualizarInsigniaCarrito) window.actualizarInsigniaCarrito()
                      }}>Agregar</button>
                      <a className="btn-detalle-productos btn-ver-detalle" href={`/detalle?id=${p.id}`}>Ver Detalle</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {ofertas.length===0 && <div className="text-center text-muted">No hay ofertas disponibles</div>}
        </div>
      </div>
    </main>
    </>
  )
}
