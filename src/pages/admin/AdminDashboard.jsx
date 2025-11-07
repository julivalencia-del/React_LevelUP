import { useEffect, useState } from 'react';
// Asegúrate de tener react-icons y chart.js instalados
// Ejecuta: npm install react-icons react-chartjs-2 chart.js
import { FaBox, FaClipboardList, FaUsers, FaDollarSign, FaArrowUp, FaShoppingCart, FaExclamationTriangle } from 'react-icons/fa';


const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalVentas: { value: 0, change: 0 },
    totalOrdenes: { value: 0, change: 0 },
    totalProductos: { value: 0, change: 0 },
    totalUsuarios: { value: 0, change: 0 },
    ordenesHoy: 0,
    ingresosHoy: 0,
    productosBajosStock: 0,
    ordenesPendientes: 0
  });
  
  const [ordenesRecientes, setOrdenesRecientes] = useState([]);
  const [productosBajoListado, setProductosBajoListado] = useState([]);

  // Función para formatear moneda
  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(valor);
  };

  // Cargar datos del dashboard
  useEffect(() => {
    const cargarDatos = () => {
      try {
        // Obtener datos de productos
        // En una app real, esto vendría de una API, no de localStorage
        // Normalizar productos: asegurar stock y precio numéricos y stock > 0 por defecto
        const productosRaw = JSON.parse(localStorage.getItem('productos')) || [];
        const productos = (Array.isArray(productosRaw) ? productosRaw : []).map(p => {
          const sNum = parseInt(p?.stock);
          const stock = Number.isFinite(sNum) && sNum > 0 ? sNum : 10;
          const precioNum = parseInt(p?.precio);
          const precio = Number.isFinite(precioNum) && precioNum >= 0 ? precioNum : 0;
          const catRaw = (p?.categoria || '').toString();
          const categoria = /mouse/i.test(catRaw) ? 'Accesorios' : catRaw;
          return { ...p, stock, precio, categoria };
        });
        // Persistir normalización si difiere del almacenamiento actual
        try { localStorage.setItem('productos', JSON.stringify(productos)); } catch {}
        const ordenesRaw = JSON.parse(localStorage.getItem('ordenes')) || [];
        // Normalizar órdenes: estado por defecto 'completada'
        const ordenes = (Array.isArray(ordenesRaw) ? ordenesRaw : []).map(o => ({
          ...o,
          estado: (o.estado || 'completada')
        }));
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        
        // Calcular estadísticas
        const hoy = new Date().toISOString().split('T')[0];
        const ordenesHoy = ordenes.filter(orden => orden.fecha && orden.fecha.split('T')[0] === hoy);
        const ingresosHoy = ordenesHoy.reduce((total, orden) => total + (orden.total || 0), 0);
        const bajo = productos.filter(p => (p.stock ?? 0) < 5);
        const productosBajosStock = bajo.length;
        const ordenesPendientes = ordenes.filter(o => o.estado === 'pendiente').length;
        
        // Calcular total de ventas (suma de todas las órdenes completadas)
        const ventasTotales = ordenes
          .filter(o => String(o.estado || '').toLowerCase() === 'completada')
          .reduce((total, orden) => total + (orden.total || 0), 0);

        // Calcular cambio porcentual (ejemplo simplificado)
        const cambioVentas = 12.5; // En una aplicación real, esto vendría de una comparación con el período anterior
        
        // Actualizar estado
        setStats({
          totalVentas: { 
            value: ventasTotales, 
            change: cambioVentas 
          },
          totalOrdenes: { 
            value: ordenes.length, 
            change: 5.2 
          },
          totalProductos: { 
            value: productos.length, 
            change: 3.1 
          },
          totalUsuarios: { 
            value: usuarios.length, 
            change: 8.7 
          },
          ordenesHoy: ordenesHoy.length,
          ingresosHoy,
          productosBajosStock,
          ordenesPendientes
        });

        // Ordenes recientes (últimas 5)
        setOrdenesRecientes([...ordenes].reverse().slice(0, 5));
        // Listado de productos con bajo stock (top 3 por stock asc)
        setProductosBajoListado([...bajo].sort((a,b)=> (a.stock??0) - (b.stock??0)).slice(0,3));

        setLoading(false);
      } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
        setLoading(false);
      }
    };

    cargarDatos();
    // Reaccionar a nuevas compras mientras el dashboard está abierto
    const onStorage = (e) => { if (e.key === 'ordenes') cargarDatos(); };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // (Se eliminaron gráficos de ventas y productos destacados)

  // Datos para las tarjetas de estadísticas
  const statsCards = [
    { 
      title: 'Ventas Totales', 
      value: formatearMoneda(stats.totalVentas.value), 
      change: stats.totalVentas.change, 
      icon: <FaDollarSign size={24} />, 
      color: 'primary' 
    },
    { 
      title: 'Órdenes', 
      value: stats.totalOrdenes.value.toLocaleString(), 
      change: stats.totalOrdenes.change, 
      icon: <FaClipboardList size={24} />, 
      color: 'success' 
    },
    { 
      title: 'Productos', 
      value: stats.totalProductos.value.toLocaleString(), 
      change: stats.totalProductos.change, 
      icon: <FaBox size={24} />, 
      color: 'info' 
    },
    { 
      title: 'Usuarios', 
      value: stats.totalUsuarios.value.toLocaleString(), 
      change: stats.totalUsuarios.change, 
      icon: <FaUsers size={24} />, 
      color: 'warning' 
    }
  ];

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Panel de Control</h2>
        <div className="text-muted small">
          Actualizado: {new Date().toLocaleString()}
        </div>
      </div>
      
      {/* Tarjetas de estadísticas */}
      <div className="row g-4 mb-4">
        {statsCards.map((stat, index) => (
          <div key={index} className="col-12 col-sm-6 col-xl-3">
            <div className={`card h-100 border-0 shadow-sm bg-${stat.color}-subtle`}>
              <div className="card-body">
                {stat.title === 'Ventas Totales' ? (
                  <div className="d-flex flex-column align-items-center text-center">
                    <div className={`card-icon text-${stat.color} mb-2`}>
                      {stat.icon}
                    </div>
                    <h6 className="card-title text-muted mb-1">{stat.title}</h6>
                    <h3 className="card-value mb-0 text-center" style={{ wordBreak: 'break-word', maxWidth: '100%' }}>
                      {stat.value}
                    </h3>
                    <span className={`badge text-bg-${stat.change >= 0 ? 'success' : 'danger'} mt-2`}>
                      {stat.change >= 0 ? '+' : ''}{stat.change}% <FaArrowUp className="ms-1" />
                    </span>
                  </div>
                ) : (
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="card-title text-muted mb-1">{stat.title}</h6>
                      <h3 className="card-value mb-0">{stat.value}</h3>
                      <span className={`badge text-bg-${stat.change >= 0 ? 'success' : 'danger'} mt-2`}>
                        {stat.change >= 0 ? '+' : ''}{stat.change}% <FaArrowUp className="ms-1" />
                      </span>
                    </div>
                    <div className={`card-icon text-${stat.color}`}>
                      {stat.icon}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Se eliminaron: Resumen de Ventas y Productos Destacados */}
      
      {/* Sección de actividad reciente y productos bajos en stock */}
      <div className="row mt-4">
      
        {/*
         * --- CORRECCIÓN ---
         * "Actividad Reciente" ahora es col-lg-12 (ancho completo en pantallas grandes)
         * para que sea más ancha.
        */}
        <div className="col-12 col-lg-12 mb-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Actividad Reciente</h5>
              <a href="/admin/ordenes" className="btn btn-sm btn-outline-primary">Ver todas</a>
            </div>
            <div className="card-body p-0">
              {ordenesRecientes.length > 0 ? (
                <div className="list-group list-group-flush">
                  {ordenesRecientes.map((orden, index) => (
                    <div key={index} className="list-group-item border-0 py-3 px-4">
                      <div className="d-flex align-items-center">
                        <div className="bg-primary-subtle p-2 rounded me-3">
                          <FaShoppingCart className="text-primary" />
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mb-0">Orden #{orden.id || orden._id || 'N/A'}</h6>
                          <p className="text-muted small mb-0">
                            {(
                              orden.usuario
                                ? `${(orden.usuario.nombre || '').trim()} ${(orden.usuario.apellidos || '').trim()}`.trim()
                                : (orden.cliente?.nombre || orden.cliente || 'Cliente anónimo')
                            )} • {formatearMoneda(orden.total || 0)}
                          </p>
                        </div>
                        <span className={`badge text-bg-${orden.estado === 'completada' ? 'success' : 'warning'}`}>
                          {orden.estado || 'pendiente'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5">
                  <FaClipboardList size={32} className="text-muted mb-3" />
                  <p className="text-muted">No hay órdenes recientes</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/*
         * --- CORRECCIÓN ---
         * "Inventario Bajo" ahora es col-lg-12 (ancho completo en pantallas grandes)
         * y se mostrará *debajo* de "Actividad Reciente".
        */}
        <div className="col-12 col-lg-12">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Inventario Bajo</h5>
              <a href="/admin/productos" className="btn btn-sm btn-outline-primary">Ver todo</a>
            </div>
            <div className="card-body">
              {stats.productosBajosStock > 0 ? (
                <>
                  <div className="alert alert-warning">
                    <div className="d-flex align-items-center">
                      <FaExclamationTriangle className="me-2" />
                      <div>
                        <strong>{stats.productosBajosStock} productos</strong> con bajo stock
                      </div>
                    </div>
                  </div>
                  <ul className="list-group list-group-flush">
                    {productosBajoListado.map((p, i) => (
                      <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
                        <span className="text-truncate" style={{maxWidth:'60%'}}>{p.nombre}</span>
                        <span className="badge text-bg-warning">Stock: {p.stock ?? 0}</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <div className="text-center py-4">
                  <FaBox size={32} className="text-success mb-3" />
                  <p className="text-muted">Todo el inventario está en orden</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;