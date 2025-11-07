import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../css/globales.css'
import '../css/pagina-carrito.css'

function getLS(key, fb) { try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fb } catch { return fb } }

export default function Carrito() {
  const navigate = useNavigate()
  const [carrito, setCarrito] = useState(() => getLS('carrito', []))
  const [usuario, setUsuario] = useState(() => getLS('usuarioActual', null))
  const [mostrarBoleta, setMostrarBoleta] = useState(false)
  const [ordenActual, setOrdenActual] = useState(null)
  const [estadoBoleta, setEstadoBoleta] = useState('success') // 'success' | 'error'

  const total = useMemo(() => carrito.reduce((s, it) => s + (it.precio || 0) * (it.qty || 1), 0), [carrito])
  const carritoVacio = carrito.length === 0

  useEffect(() => {
    document.body.classList.add('pagina-carrito')
    return () => document.body.classList.remove('pagina-carrito')
  }, [])

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'carrito') setCarrito(getLS('carrito', []))
      if (e.key === 'usuarioActual') setUsuario(getLS('usuarioActual', null))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const resetearEstadoBoleta = () => {
    setOrdenActual(null)
    setEstadoBoleta('success')
    setMostrarBoleta(false)
  }

  const simularError = async () => {
    const form = document.getElementById('form-datos-compra')
    if (form && !form.reportValidity()) return
    const u = {
      nombre: document.getElementById('cli-nombre')?.value?.trim() || usuario?.nombre || '',
      apellidos: document.getElementById('cli-apellidos')?.value?.trim() || usuario?.apellidos || '',
      correo: document.getElementById('cli-email')?.value?.trim() || usuario?.correo || usuario?.email || '',
      calle: document.getElementById('dir-calle')?.value?.trim() || usuario?.calle || '',
      region: document.getElementById('dir-region')?.value?.trim() || usuario?.region || 'Región Metropolitana de Santiago',
      comuna: document.getElementById('dir-comuna')?.value?.trim() || usuario?.comuna || 'Cerrillos',
      departamento: document.getElementById('dir-departamento')?.value?.trim() || usuario?.departamento || '',
      indicaciones: document.getElementById('dir-indicaciones')?.value?.trim() || usuario?.indicaciones || '',
    }
    const orden = { id: 'ORDER' + Date.now(), usuario: u, items: carrito, total, fecha: new Date().toISOString() }
    localStorage.setItem('ultimaOrden', JSON.stringify(orden))
    setOrdenActual(orden)
    setEstadoBoleta('error')
    
    await ensureSwal()
    try {
      await window.Swal.fire({
        title: 'Hubo un problema',
        text: 'No se pudo realizar el pago. Revisa tus datos o intenta nuevamente.',
        icon: 'error',
        confirmButtonText: 'Ver detalle',
        background: '#0a0a0a',
        color: '#fff',
        confirmButtonColor: '#ff6b35',
      })
    } catch {}
    setMostrarBoleta(true)
  }

  const ensureSwal = () => new Promise((resolve) => {
    if (window.Swal) return resolve('ok')
    const exist = document.querySelector("script[src='https://cdn.jsdelivr.net/npm/sweetalert2@11']")
    if (exist) { exist.onload = () => resolve('ok'); return }
    const sc = document.createElement('script')
    sc.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11'
    sc.async = true
    sc.onload = () => resolve('ok')
    document.body.appendChild(sc)
  })

  const pagarAhora = async () => {
    const form = document.getElementById('form-datos-compra')
    if (form && !form.reportValidity()) return
    const u = {
      nombre: document.getElementById('cli-nombre')?.value?.trim() || usuario?.nombre || '',
      apellidos: document.getElementById('cli-apellidos')?.value?.trim() || usuario?.apellidos || '',
      correo: document.getElementById('cli-email')?.value?.trim() || usuario?.correo || usuario?.email || '',
      calle: document.getElementById('dir-calle')?.value?.trim() || usuario?.calle || '',
      region: document.getElementById('dir-region')?.value?.trim() || usuario?.region || 'Región Metropolitana de Santiago',
      comuna: document.getElementById('dir-comuna')?.value?.trim() || usuario?.comuna || 'Cerrillos',
      departamento: document.getElementById('dir-departamento')?.value?.trim() || usuario?.departamento || '',
      indicaciones: document.getElementById('dir-indicaciones')?.value?.trim() || usuario?.indicaciones || '',
    }
    const orden = { id: 'ORDER' + Date.now(), usuario: u, items: carrito, total, fecha: new Date().toISOString() }
    const historial = getLS('ordenes', [])
    historial.push(orden)
    localStorage.setItem('ordenes', JSON.stringify(historial))
    localStorage.setItem('ultimaOrden', JSON.stringify(orden))
    localStorage.setItem('carrito', JSON.stringify([]))
    setOrdenActual(orden)
    setCarrito([])
    if (window.actualizarInsigniaCarrito) window.actualizarInsigniaCarrito()
    await ensureSwal()
    try {
      await window.Swal.fire({
        title: 'Pago exitoso',
        text: 'Tu compra se ha realizado correctamente.',
        icon: 'success',
        confirmButtonText: 'Ver boleta',
        background: '#0a0a0a',
        color: '#fff',
        confirmButtonColor: '#00c853',
      })
    } catch {}
    setMostrarBoleta(true)
  }

  const vaciarCarrito = () => {
    localStorage.setItem('carrito', JSON.stringify([]))
    setCarrito([])
    if (window.actualizarInsigniaCarrito) window.actualizarInsigniaCarrito()
  }

  const actualizarLSyEstado = (nuevo) => {
    localStorage.setItem('carrito', JSON.stringify(nuevo))
    setCarrito(nuevo)
    if (window.actualizarInsigniaCarrito) window.actualizarInsigniaCarrito()
  }

  const cambiarCantidad = (id, delta) => {
    const copia = carrito.map(it => ({...it}))
    const idx = copia.findIndex(it => String(it.id) === String(id))
    if (idx === -1) return
    copia[idx].qty = (copia[idx].qty || 1) + delta
    if (copia[idx].qty <= 0) copia.splice(idx, 1)
    actualizarLSyEstado(copia)
  }

  const eliminarItem = (id) => {
    const copia = carrito.filter(it => String(it.id) !== String(id))
    actualizarLSyEstado(copia)
  }

  // Ordenar items por nombre ascendente para tabla
  const itemsOrdenados = useMemo(() => {
    return [...carrito].sort((a,b)=> (a.nombre||'').localeCompare(b.nombre||''))
  }, [carrito])

  return (
    <>
    <main className="carrito-contenido">
      <h1 className="titulo-carrito">MI CARRITO DE COMPRAS</h1>
      <div className="layout-carrito">
        {/* Columna izquierda: resumen de items + formularios */}
        <div className="items-carrito">
          <section>
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
              <h2 className="h5 m-0">Carrito de compra</h2>
              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-primary" id="total-a-pagar">Total a pagar: ${total.toLocaleString('es-CL')}</span>
                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={simularError} disabled={carritoVacio}>Simular error de boleta</button>
              </div>
            </div>
            <div className="table-responsive">
              <table className="table table-dark table-striped align-middle tabla-carrito">
                <thead>
                  <tr>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {itemsOrdenados.length === 0 && (
                    <tr><td colSpan={5} className="text-center">Tu carrito está vacío</td></tr>
                  )}
                  {itemsOrdenados.map((it) => (
                    <tr key={it.id}>
                      <td><img src={it.imagen || 'img/logo-level-Up.png'} alt={it.nombre} style={{width:60,height:46,objectFit:'cover'}} onError={(e)=>{e.currentTarget.src='img/logo-level-Up.png'}}/></td>
                      <td>{it.nombre}</td>
                      <td>${(it.precio||0).toLocaleString('es-CL')}</td>
                      <td className="celda-cantidad-carrito">
                        <div className="cantidad-item-carrito">
                          <button type="button" className="btn-cantidad-carrito" onClick={()=>cambiarCantidad(it.id, -1)}>-</button>
                          <span className="pantalla-cantidad-carrito">{it.qty||1}</span>
                          <button type="button" className="btn-cantidad-carrito" onClick={()=>cambiarCantidad(it.id, +1)}>+</button>
                        </div>
                        <button type="button" className="btn-eliminar-carrito mt-2" onClick={()=>eliminarItem(it.id)}>Eliminar</button>
                      </td>
                      <td>${(((it.precio||0)*(it.qty||1))||0).toLocaleString('es-CL')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="h5">Información del cliente</h2>
            <form id="form-datos-compra" className="row g-3" onSubmit={(e)=>{e.preventDefault(); pagarAhora()}}>
              <div className="col-md-6">
                <label className="form-label">Nombre*</label>
                <input className="form-control" id="cli-nombre" defaultValue={usuario?.nombre||''} required/>
              </div>
              <div className="col-md-6">
                <label className="form-label">Apellidos*</label>
                <input className="form-control" id="cli-apellidos" defaultValue={usuario?.apellidos||''} required/>
              </div>
              <div className="col-md-6">
                <label className="form-label">Correo*</label>
                <input type="email" className="form-control" id="cli-email" defaultValue={usuario?.correo||usuario?.email||''} required/>
              </div>

              <h2 className="h5 mt-4">Dirección de entrega</h2>
              <div className="col-md-8">
                <label className="form-label">Calle*</label>
                <input className="form-control" id="dir-calle" defaultValue={usuario?.calle||''} required/>
              </div>
              <div className="col-md-4">
                <label className="form-label">Departamento</label>
                <input className="form-control" id="dir-departamento" placeholder="Ej: 603" defaultValue={usuario?.departamento||''}/>
              </div>
              <div className="col-md-8">
                <label className="form-label">Región*</label>
                <input className="form-control" id="dir-region" defaultValue={usuario?.region||'Región Metropolitana de Santiago'} required/>
              </div>
              <div className="col-md-4">
                <label className="form-label">Comuna*</label>
                <input className="form-control" id="dir-comuna" defaultValue={usuario?.comuna||'Cerrillos'} required/>
              </div>
              <div className="col-12">
                <label className="form-label">Indicaciones (opcional)</label>
                <textarea className="form-control" id="dir-indicaciones" rows="2" placeholder="Ej: Entre calles, color del edificio, no tiene timbre."></textarea>
              </div>

              {/* Acciones de pago se mueven al panel lateral */}
            </form>
          </section>
        </div>

        {/* Columna derecha: resumen lateral estilizado */}
        <aside className="resumen-carrito">
          <div className="titulo-resumen-carrito">Resumen del pedido</div>
          <div className="linea-resumen-carrito">
            <span>Items</span>
            <span>{carrito.reduce((s,it)=> s + (it.qty||1), 0)}</span>
          </div>
          <div className="linea-resumen-carrito">
            <span>Subtotal</span>
            <span>${total.toLocaleString('es-CL')}</span>
          </div>
          <div className="linea-resumen-carrito">
            <span>Envío</span>
            <span>Gratis</span>
          </div>
          <div className="linea-resumen-carrito total">
            <span>Total a pagar</span>
            <span>${total.toLocaleString('es-CL')}</span>
          </div>
          <button className="btn-finalizar-carrito" onClick={pagarAhora} disabled={carritoVacio}>Procesar compra</button>
          <button className="btn-vaciar-carrito" onClick={vaciarCarrito} disabled={carritoVacio}>Vaciar carrito</button>
          <div className="mt-3 text-center">
            <a href="/Productos" className="btn btn-outline-light btn-sm">Seguir comprando</a>
          </div>
        </aside>
      </div>
    </main>

    {mostrarBoleta && ordenActual && (
      <div className="overlay-boleta" role="dialog" aria-modal="true">
        <div className="modal-boleta">
          <div className="modal-boleta-header d-flex justify-content-between align-items-center">
            <h2 className="h5 m-0">{estadoBoleta==='error' ? 'Pago no realizado' : 'Compra exitosa'}</h2>
            <span><small className="text-light fw-bold">Código orden:</small> <span className={`badge ${estadoBoleta==='error' ? 'badge-orden-error' : 'badge-orden-level'}`}>{ordenActual.id}</span></span>
          </div>

          {estadoBoleta==='error' && (
            <div className="alert alert-danger py-2">
              No se pudo completar el pago para la orden <strong>{ordenActual.id}</strong>. Intenta nuevamente o usa otro medio de pago.
            </div>
          )}

          <section className="mb-2">
            <h3 className="h6">Información del cliente</h3>
            <div className="row g-2">
              <div className="col-md-4"><strong>Nombre:</strong> {ordenActual?.usuario?.nombre || '-'}</div>
              <div className="col-md-4"><strong>Apellidos:</strong> {ordenActual?.usuario?.apellidos || '-'}</div>
              <div className="col-md-4"><strong>Correo:</strong> {ordenActual?.usuario?.correo || '-'}</div>
            </div>
          </section>

          <section className="mb-2">
            <h3 className="h6">Dirección de entrega</h3>
            <div className="row g-2">
              <div className="col-md-6"><strong>Calle:</strong> {ordenActual?.usuario?.calle || '-'}</div>
              <div className="col-md-6"><strong>Departamento:</strong> {ordenActual?.usuario?.departamento || '-'}</div>
              <div className="col-md-6"><strong>Región:</strong> {ordenActual?.usuario?.region || '-'}</div>
              <div className="col-md-6"><strong>Comuna:</strong> {ordenActual?.usuario?.comuna || '-'}</div>
              <div className="col-12"><strong>Indicaciones:</strong> {ordenActual?.usuario?.indicaciones || '-'}</div>
            </div>
          </section>

          <section className="resumen-orden mb-2">
            <h3 className="h6">Resumen de la compra</h3>
            <div className="table-responsive">
              <table className="table table-dark table-striped align-middle tabla-carrito">
                <thead>
                  <tr>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {(ordenActual.items||[]).map((it) => (
                    <tr key={it.id}>
                      <td><img src={it.imagen || 'img/logo-level-Up.png'} alt={it.nombre} style={{width:60,height:46,objectFit:'cover'}} onError={(e)=>{e.currentTarget.src='img/logo-level-Up.png'}}/></td>
                      <td>{it.nombre}</td>
                      <td>${(it.precio||0).toLocaleString('es-CL')}</td>
                      <td>{it.qty||1}</td>
                      <td>${(((it.precio||0)*(it.qty||1))||0).toLocaleString('es-CL')}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="5" className="text-end fw-bold">Total pagado: ${ordenActual.total.toLocaleString('es-CL')}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>

          <div className="d-flex gap-2 justify-content-end mt-2">
            {estadoBoleta === 'error' ? (
              <button className="btn btn-success btn-sm" onClick={resetearEstadoBoleta}>Volver a realizar pago</button>
            ) : (
              <button className="btn btn-danger btn-sm" onClick={() => window.print()}>Imprimir boleta en PDF</button>
            )}
            <button className="btn btn-outline-light btn-sm" onClick={resetearEstadoBoleta}>Cerrar</button>
          </div>
        </div>
      </div>
    )}
    </>
  )
}
