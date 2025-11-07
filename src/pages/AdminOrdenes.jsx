import { useEffect, useMemo, useState } from 'react';
import { FaSearch, FaEye, FaPrint, FaCheckCircle, FaTimesCircle, FaTruck, FaBoxOpen } from 'react-icons/fa';
import '../css/globales.css';
import '../css/pagina-carrito.css';

const AdminOrdenes = () => {
  const [filtro, setFiltro] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
  const [ordenes, setOrdenes] = useState([]);

  const getLS = (key, fb) => {
    try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fb } catch { return fb }
  };

  // Cargar órdenes reales desde localStorage (llenadas por Carrito.pagarAhora)
  useEffect(() => {
    const desdeLS = getLS('ordenes', []);
    // Mapear para exponer campos mostrados en tabla (cliente, productos)
    const normalizadas = (desdeLS || []).map((o) => ({
      ...o,
      fecha: o.fecha || new Date().toISOString(),
      cliente: o.usuario ? `${o.usuario.nombre || ''} ${o.usuario.apellidos || ''}`.trim() : o.cliente || '—',
      productos: Array.isArray(o.items) ? o.items.reduce((s, it) => s + (it.qty || 1), 0) : (o.productos || 0),
      estado: o.estado || 'Completada',
    }));
    setOrdenes(normalizadas);
  }, []);

  // Escuchar cambios externos en LS (otra pestaña o flujo)
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'ordenes') {
        const desdeLS = getLS('ordenes', []);
        const normalizadas = (desdeLS || []).map((o) => ({
          ...o,
          fecha: o.fecha || new Date().toISOString(),
          cliente: o.usuario ? `${o.usuario.nombre || ''} ${o.usuario.apellidos || ''}`.trim() : o.cliente || '—',
          productos: Array.isArray(o.items) ? o.items.reduce((s, it) => s + (it.qty || 1), 0) : (o.productos || 0),
          estado: o.estado || 'Completada',
        }));
        setOrdenes(normalizadas);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);
  
  // Filtrar órdenes según búsqueda y estado
  const ordenesFiltradas = useMemo(() => {
    const f = (ordenes || []).filter(orden => 
      ((orden.id || '').toLowerCase().includes(filtro.toLowerCase()) ||
       (orden.cliente || '').toLowerCase().includes(filtro.toLowerCase())) &&
      (filtroEstado === 'todos' || orden.estado === filtroEstado)
    );
    return f;
  }, [ordenes, filtro, filtroEstado]);
  
  // Persistir estados en LS
  const persistirOrdenes = (lista) => {
    setOrdenes(lista);
    try {
      // Mantener estructura original de cada orden al guardar
      const crudas = getLS('ordenes', []);
      const mapeo = new Map(lista.map(o => [String(o.id), o]));
      const actualizadas = (crudas || []).map((o) => {
        const n = mapeo.get(String(o.id));
        return n ? { ...o, estado: n.estado } : o;
      });
      localStorage.setItem('ordenes', JSON.stringify(actualizadas));
    } catch {}
  };

  // Cambiar estado de una orden (y guardar)
  const cambiarEstado = (id, nuevoEstado) => {
    const nueva = ordenes.map(orden => 
      String(orden.id) === String(id) ? { ...orden, estado: nuevoEstado } : orden
    );
    persistirOrdenes(nueva);
  };

  // Abrir visor de detalles/boleta
  const verDetalles = (orden) => {
    setOrdenSeleccionada(orden);
    setMostrarDetalle(true);
  };
  
  // Obtener clase CSS según el estado
  const getEstadoClass = (estado) => {
    switch(estado) {
      case 'Completada':
        return 'bg-success bg-opacity-10 text-success';
      case 'En proceso':
        return 'bg-warning bg-opacity-10 text-warning';
      case 'Pendiente':
        return 'bg-info bg-opacity-10 text-info';
      case 'Enviada':
        return 'bg-primary bg-opacity-10 text-primary';
      default:
        return 'bg-secondary bg-opacity-10 text-secondary';
    }
  };
  
  // Formatear moneda
  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(valor);
  };

  return (
    <div className="container-fluid py-4 products-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Gestión de Órdenes</h2>
        <div className="d-flex">
          <select 
            className="form-select me-2" 
            style={{ width: 'auto' }}
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="todos">Todas las órdenes</option>
            <option value="Pendiente">Pendientes</option>
            <option value="En proceso">En proceso</option>
            <option value="Enviada">Enviadas</option>
            <option value="Completada">Completadas</option>
          </select>
          <div className="input-group" style={{ width: '250px' }}>
            <span className="input-group-text"><FaSearch /></span>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar órdenes..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-sm align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>ID Orden</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Productos</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th className="text-center" style={{width:'96px'}}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ordenesFiltradas.map((orden) => (
                  <tr key={orden.id}>
                    <td className="fw-bold">{orden.id}</td>
                    <td>{new Date(orden.fecha).toLocaleDateString()}</td>
                    <td>{orden.cliente}</td>
                    <td>{orden.productos} {orden.productos === 1 ? 'producto' : 'productos'}</td>
                    <td className="fw-bold">{formatearMoneda(orden.total)}</td>
                    <td>
                      <span className={`badge ${getEstadoClass(orden.estado)}`}>
                        {orden.estado}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="action-buttons">
                        <button 
                          className="btn btn-outline-primary btn-icon"
                          title="Ver Detalles"
                          onClick={() => verDetalles(orden)}
                        >
                          <FaEye />
                        </button>
                        <button 
                          className="btn btn-outline-secondary btn-icon"
                          title="Imprimir Boleta"
                          onClick={() => { setOrdenSeleccionada(orden); setMostrarDetalle(true); setTimeout(()=>window.print(), 50) }}
                        >
                          <FaPrint />
                        </button>
                      </div>
                      <div className="dropdown mt-1">
                        <button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Estado</button>
                        <ul className="dropdown-menu dropdown-menu-end">
                          <li><button className={`dropdown-item ${orden.estado === 'Pendiente' ? 'active' : ''}`} onClick={() => cambiarEstado(orden.id, 'Pendiente')}><FaBoxOpen className="me-2" /> Pendiente</button></li>
                          <li><button className={`dropdown-item ${orden.estado === 'En proceso' ? 'active' : ''}`} onClick={() => cambiarEstado(orden.id, 'En proceso')}><FaCheckCircle className="me-2" /> En Proceso</button></li>
                          <li><button className={`dropdown-item ${orden.estado === 'Enviada' ? 'active' : ''}`} onClick={() => cambiarEstado(orden.id, 'Enviada')}><FaTruck className="me-2" /> Enviada</button></li>
                          <li><button className={`dropdown-item ${orden.estado === 'Completada' ? 'active' : ''}`} onClick={() => cambiarEstado(orden.id, 'Completada')}><FaCheckCircle className="me-2" /> Completada</button></li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))}
                {ordenesFiltradas.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-5">
                      <div className="text-muted">
                        <FaBoxOpen size={48} className="mb-3" />
                        <p className="h5">No se encontraron órdenes</p>
                        <p className="mb-0">No hay órdenes que coincidan con los filtros seleccionados</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Resumen de órdenes */}
      <div className="row mt-4">
        <div className="col-md-3 mb-3 mb-md-0">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="display-6 mb-1 text-primary fw-bold" style={{fontSize:'2rem'}}>{ordenes.length}</div>
              <div className="fw-semibold" style={{color:'#e9ecef'}}>Total de Órdenes</div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3 mb-md-0">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="display-6 mb-1 text-warning fw-bold" style={{fontSize:'2rem'}}>
                {ordenes.filter(o => o.estado === 'Pendiente').length}
              </div>
              <div className="fw-semibold" style={{color:'#e9ecef'}}>Pendientes</div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3 mb-md-0">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="display-6 mb-1 text-info fw-bold" style={{fontSize:'2rem'}}>
                {ordenes.filter(o => o.estado === 'En proceso').length}
              </div>
              <div className="fw-semibold" style={{color:'#e9ecef'}}>En Proceso</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="display-6 mb-1 text-success fw-bold" style={{fontSize:'2rem'}}>
                {ordenes.filter(o => o.estado === 'Completada').length}
              </div>
              <div className="fw-semibold" style={{color:'#e9ecef'}}>Completadas</div>
            </div>
          </div>
        </div>
      </div>
      {mostrarDetalle && ordenSeleccionada && (
        <div className="overlay-boleta" role="dialog" aria-modal="true">
          <div className="modal-boleta">
            <div className="modal-boleta-header d-flex justify-content-between align-items-center">
              <h2 className="h5 m-0">Detalle de Orden</h2>
              <span><small className="text-light fw-bold">Código orden:</small> <span className="badge badge-orden-level">{ordenSeleccionada.id}</span></span>
            </div>

            <section className="mb-2">
              <h3 className="h6">Información del cliente</h3>
              <div className="row g-2">
                <div className="col-md-4"><strong>Nombre:</strong> {ordenSeleccionada?.usuario?.nombre || '-'}</div>
                <div className="col-md-4"><strong>Apellidos:</strong> {ordenSeleccionada?.usuario?.apellidos || '-'}</div>
                <div className="col-md-4"><strong>Correo:</strong> {ordenSeleccionada?.usuario?.correo || '-'}</div>
              </div>
            </section>

            <section className="mb-2">
              <h3 className="h6">Dirección de entrega</h3>
              <div className="row g-2">
                <div className="col-md-6"><strong>Calle:</strong> {ordenSeleccionada?.usuario?.calle || '-'}</div>
                <div className="col-md-6"><strong>Departamento:</strong> {ordenSeleccionada?.usuario?.departamento || '-'}</div>
                <div className="col-md-6"><strong>Región:</strong> {ordenSeleccionada?.usuario?.region || '-'}</div>
                <div className="col-md-6"><strong>Comuna:</strong> {ordenSeleccionada?.usuario?.comuna || '-'}</div>
                <div className="col-12"><strong>Indicaciones:</strong> {ordenSeleccionada?.usuario?.indicaciones || '-'}</div>
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
                    {(ordenSeleccionada.items||[]).map((it) => (
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
                      <td colSpan="5" className="text-end fw-bold">Total: {formatearMoneda(ordenSeleccionada.total)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </section>

            <div className="d-flex gap-2 justify-content-end mt-2">
              <button className="btn btn-danger btn-sm" onClick={() => window.print()}><FaPrint className="me-1"/> Imprimir</button>
              <button className="btn btn-outline-light btn-sm" onClick={() => { setMostrarDetalle(false); setOrdenSeleccionada(null); }}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdenes;
