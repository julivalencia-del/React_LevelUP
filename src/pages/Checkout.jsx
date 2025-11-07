import '../css/globales.css'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function getLS(key, fb) {
  try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fb } catch { return fb }
}

export default function Checkout() {
  const navigate = useNavigate()
  const [carrito, setCarrito] = useState(() => getLS('carrito', []))
  const [usuario, setUsuario] = useState(() => getLS('usuarioActual', null))

  const total = useMemo(() => carrito.reduce((s, it) => s + (it.precio || 0) * (it.qty || 1), 0), [carrito])
  const carritoVacio = carrito.length === 0

  useEffect(() => {
    document.body.classList.add('pagina-checkout')
    return () => document.body.classList.remove('pagina-checkout')
  }, [])

  useEffect(() => {
    // Suscribir a cambios del storage (por si otra vista modifica el carrito)
    const onStorage = (e) => {
      if (e.key === 'carrito') setCarrito(getLS('carrito', []))
      if (e.key === 'usuarioActual') setUsuario(getLS('usuarioActual', null))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const pagarAhora = () => {
    // Tomar datos del formulario (uncontrolled inputs por id)
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

    // Guardar orden simulada
    const orden = {
      id: 'ORDER' + Date.now(),
      usuario: u,
      items: carrito,
      total,
      fecha: new Date().toISOString(),
    }
    const historial = getLS('ordenes', [])
    historial.push(orden)
    localStorage.setItem('ordenes', JSON.stringify(historial))
    localStorage.setItem('ultimaOrden', JSON.stringify(orden))
    localStorage.setItem('carrito', JSON.stringify([]))
    navigate('/CompraExitosa')
  }

  const simularError = () => {
    const orden = {
      id: 'ORDER' + Date.now(), usuario, items: carrito, total, fecha: new Date().toISOString(), estado: 'error'
    }
    localStorage.setItem('ultimaOrden', JSON.stringify(orden))
    navigate('/CompraError')
  }

  return (
    <main className="contenedor-checkout">
      <div className="container">
        <header className="hero-checkout d-flex justify-content-between align-items-center mb-3">
          <h1 className="titulo-hero-checkout m-0">Carrito de compra</h1>
          <span className="badge bg-primary" id="total-a-pagar">Total a pagar: ${total.toLocaleString('es-CL')}</span>
        </header>

        <section className="resumen-carrito mb-4">
          <div className="table-responsive">
            <table className="table table-dark table-striped align-middle">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody id="tbody-resumen-carrito">
                {carritoVacio && (
                  <tr><td colSpan={5} className="text-center">Tu carrito está vacío</td></tr>
                )}
                {carrito.map((it) => (
                  <tr key={it.id}>
                    <td><img src={it.imagen || 'img/logo-level-Up.png'} alt={it.nombre} style={{width:60,height:46,objectFit:'cover'}} onError={(e)=>{e.currentTarget.src='img/logo-level-Up.png'}}/></td>
                    <td>{it.nombre}</td>
                    <td>${(it.precio||0).toLocaleString('es-CL')}</td>
                    <td>{it.qty||1}</td>
                    <td>${(((it.precio||0)*(it.qty||1))||0).toLocaleString('es-CL')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="datos-cliente">
          <h2 className="h5">Información del cliente</h2>
          <form className="row g-3" id="form-checkout" onSubmit={(e)=>{e.preventDefault(); pagarAhora()}}>
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
              <textarea className="form-control" id="dir-indicaciones" rows="2" defaultValue={usuario?.indicaciones||''}></textarea>
            </div>

            <div className="col-12 d-flex justify-content-end mt-3 gap-2">
              <button type="button" onClick={simularError} className="btn btn-outline-secondary" disabled={carritoVacio}>Simular error</button>
              <button type="submit" className="btn btn-success" disabled={carritoVacio}>Pagar ahora ${total.toLocaleString('es-CL')}</button>
            </div>
          </form>
        </section>
      </div>
    </main>
  )
}
