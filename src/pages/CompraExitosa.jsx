import '../css/globales.css'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function getLS(key, fb) { try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fb } catch { return fb } }

export default function CompraExitosa(){
  const navigate = useNavigate()
  const [orden, setOrden] = useState(() => getLS('ultimaOrden', null))

  useEffect(() => {
    document.body.classList.add('pagina-compra-exitosa')
    return () => document.body.classList.remove('pagina-compra-exitosa')
  }, [])

  const total = useMemo(() => (orden?.items||[]).reduce((s,it)=> s + (it.precio||0)*(it.qty||1),0), [orden])

  if (!orden || !orden.items || orden.items.length===0) {
    return (
      <main className="contenedor-compra-exitosa">
        <div className="container py-4">
          <div className="alert alert-warning">No hay una orden reciente para mostrar.</div>
          <button className="btn btn-success" onClick={()=>navigate('/Productos')}>Ir a productos</button>
        </div>
      </main>
    )
  }

  return (
    <main className="contenedor-compra-exitosa">
      <div className="container">
        <div className="alert alert-success my-3 d-flex justify-content-between align-items-center">
          <span>Se ha realizado la compra. nro <strong>{orden.id}</strong></span>
          <span className="text-end"><small className="text-dark fw-bold">Código orden:</small> <span className="badge bg-warning text-dark">{orden.id}</span></span>
        </div>

        <section className="mb-3">
          <h2 className="h5">Información del cliente</h2>
          <div className="row g-2">
            <div className="col-md-4"><strong>Nombre:</strong> {orden?.usuario?.nombre || '-'}</div>
            <div className="col-md-4"><strong>Apellidos:</strong> {orden?.usuario?.apellidos || '-'}</div>
            <div className="col-md-4"><strong>Correo:</strong> {orden?.usuario?.correo || '-'}</div>
          </div>
        </section>

        <section className="mb-3">
          <h2 className="h5">Dirección de entrega</h2>
          <div className="row g-2">
            <div className="col-md-6"><strong>Calle:</strong> {orden?.usuario?.calle || '-'}</div>
            <div className="col-md-6"><strong>Departamento:</strong> {orden?.usuario?.departamento || '-'}</div>
            <div className="col-md-6"><strong>Región:</strong> {orden?.usuario?.region || '-'}</div>
            <div className="col-md-6"><strong>Comuna:</strong> {orden?.usuario?.comuna || '-'}</div>
            <div className="col-12"><strong>Indicaciones:</strong> {orden?.usuario?.indicaciones || '-'}</div>
          </div>
        </section>

        <section className="resumen-orden">
          <h1 className="h4">Resumen de la compra</h1>
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
              <tbody id="tbody-resumen-orden">
                {orden.items.map(it => (
                  <tr key={it.id}>
                    <td><img src={it.imagen||'img/logo-level-Up.png'} alt={it.nombre} style={{width:60,height:46,objectFit:'cover'}} onError={(e)=>{e.currentTarget.src='img/logo-level-Up.png'}}/></td>
                    <td>{it.nombre}</td>
                    <td>${(it.precio||0).toLocaleString('es-CL')}</td>
                    <td>{it.qty||1}</td>
                    <td>${(((it.precio||0)*(it.qty||1))||0).toLocaleString('es-CL')}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="5" className="text-end fw-bold">Total pagado: ${total.toLocaleString('es-CL')}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="d-flex gap-2 mt-3">
            <button className="btn btn-danger btn-sm" onClick={()=>window.print()}>Imprimir boleta en PDF</button>
            <button className="btn btn-success btn-sm" onClick={()=>alert('Boleta enviada (simulado)')}>Enviar boleta por email</button>
          </div>
        </section>
      </div>
    </main>
  )
}
