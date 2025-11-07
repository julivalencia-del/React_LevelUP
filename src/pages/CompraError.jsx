import '../css/globales.css'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function getLS(key, fb) { try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fb } catch { return fb } }

export default function CompraError(){
  const navigate = useNavigate()
  const [orden, setOrden] = useState(() => getLS('ultimaOrden', null))

  useEffect(() => {
    document.body.classList.add('pagina-compra-error')
    return () => document.body.classList.remove('pagina-compra-error')
  }, [])

  const total = useMemo(() => (orden?.items||[]).reduce((s,it)=> s + (it.precio||0)*(it.qty||1),0), [orden])

  return (
    <main className="contenedor-compra-error">
      <div className="container">
        <div className="alert alert-danger my-3">No se pudo realizar el pago. {orden?.id ? <>nro <strong>{orden.id}</strong></> : null}</div>
        {orden?.items?.length ? (
          <div className="table-responsive mb-3">
            <table className="table table-dark table-striped align-middle">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {orden.items.map(it => (
                  <tr key={it.id}>
                    <td>{it.nombre}</td>
                    <td>${(it.precio||0).toLocaleString('es-CL')}</td>
                    <td>{it.qty||1}</td>
                    <td>${(((it.precio||0)*(it.qty||1))||0).toLocaleString('es-CL')}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="4" className="text-end fw-bold">Total: ${total.toLocaleString('es-CL')}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : null}
        <div className="d-flex gap-2">
          <button className="btn btn-success" onClick={()=>navigate('/Checkout')}>Volver a realizar el pago</button>
          <button className="btn btn-outline-light" onClick={()=>navigate('/')}>Ir al inicio</button>
        </div>
      </div>
    </main>
  )
}
