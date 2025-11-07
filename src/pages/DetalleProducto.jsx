import { useEffect } from 'react'
import '../css/globales.css'
import '../css/pagina-productos.css'

export default function DetalleProducto() {
  useEffect(() => {
    document.body.classList.add('pagina-productos')
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
      await loadOnce('https://cdn.jsdelivr.net/npm/sweetalert2@11')
      await loadOnce('/js/validaciones.js')
      if (!window._legacyAppLoaded) {
        await loadOnce('/js/app.js')
        window._legacyAppLoaded = true
      }
      if (document.readyState !== 'loading') {
        document.dispatchEvent(new Event('DOMContentLoaded'))
      }
    })()
    return () => {
      document.body.classList.remove('pagina-productos')
    }
  }, [])

  return (
    <>
      <div className="acciones-container" style={{ display: 'none' }}></div>

      <div className="sidebar-admin" id="sidebar-admin" style={{ display: 'none' }}>
        <a href="/admin">Admin</a>
      </div>

      <main className="container py-4">
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb bg-transparent">
            <li className="breadcrumb-item"><a href="/" className="text-electric">Inicio</a></li>
            <li className="breadcrumb-item"><a href="/Productos" className="text-electric">Productos</a></li>
            <li className="breadcrumb-item active text-light" id="breadcrumb-producto">Detalle</li>
          </ol>
        </nav>

        <div className="row g-4" id="detalle-producto"></div>

        <div className="modal fade" id="imagenModal" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content bg-darker">
              <div className="modal-header border-0">
                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body text-center"></div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
