import { useEffect, useState, useCallback } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaBox, FaChartBar, FaClipboardList, FaTags, 
  FaUsers, FaUserCog, FaStore, FaSignOutAlt, 
  FaBars, FaShoppingCart, FaDollarSign, FaArrowUp
} from 'react-icons/fa';
import '../css/globales.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/pagina-admin.css';

export default function Admin() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Datos de ejemplo para el dashboard
  const stats = [
    { title: 'Ventas Totales', value: '$1,234,567', change: '+12.5%', icon: <FaDollarSign />, color: 'primary' },
    { title: 'Órdenes', value: '1,234', change: '+5.2%', icon: <FaClipboardList />, color: 'success' },
    { title: 'Productos', value: '856', change: '+3.1%', icon: <FaBox />, color: 'info' },
    { title: 'Usuarios', value: '2,345', change: '+8.7%', icon: <FaUsers />, color: 'warning' }
  ];

  const menuItems = [
    { path: '/admin', icon: <FaChartBar />, label: 'Dashboard' },
    { path: '/admin/productos', icon: <FaBox />, label: 'Productos' },
    { path: '/admin/ordenes', icon: <FaClipboardList />, label: 'Órdenes' },
    { path: '/admin/categorias', icon: <FaTags />, label: 'Categorías' },
    { path: '/admin/usuarios', icon: <FaUsers />, label: 'Usuarios' },
    { path: '/admin/reportes', icon: <FaChartBar />, label: 'Reportes' },
    { path: '/admin/perfil', icon: <FaUserCog />, label: 'Perfil' },
  ];

  const isActive = useCallback((path) => {
    return location.pathname === path ? 'active' : '';
  }, [location.pathname]);

  const handleLogout = useCallback(() => {
    // Lógica para cerrar sesión
    localStorage.removeItem('adminToken');
    navigate('/login');
  }, [navigate]);

  // Cargar scripts necesarios
  const loadScript = useCallback((src) => new Promise((resolve) => {
    const exist = document.querySelector(`script[src='${src}']`);
    if (exist) return resolve('exists');
    const sc = document.createElement('script');
    sc.src = src;
    sc.async = true;
    sc.onload = () => resolve('loaded');
    document.body.appendChild(sc);
  }), []);

  const loadCss = useCallback((href) => {
    const exist = document.querySelector(`link[href='${href}']`);
    if (exist) return 'exists';
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
    return 'loaded';
  }, []);

  useEffect(() => {
    document.body.classList.add('pagina-admin');
    
    // Cargar recursos necesarios
    const loadResources = async () => {
      try {
        loadCss('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
        await loadScript('https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js');
        await loadScript('/js/validaciones.js');
        
        if (!window._legacyAppLoaded) {
          await loadScript('/js/app.js');
          window._legacyAppLoaded = true;
        }
        
        if (document.readyState !== 'loading') {
          document.dispatchEvent(new Event('DOMContentLoaded'));
        }
      } catch (error) {
        console.error('Error al cargar recursos:', error);
      }
    };

    loadResources();

    return () => {
      document.body.classList.remove('pagina-admin');
    };
  }, [loadCss, loadScript]);

  // Renderizar el dashboard si estamos en la ruta raíz del admin
  const renderDashboard = useCallback(() => {
    if (location.pathname !== '/admin') return null;
    
    return (
      <div className="container-fluid py-4">
        <h2 className="mb-4">Panel de Control</h2>
        
        {/* Tarjetas de estadísticas */}
        <div className="row g-4 mb-4">
          {stats.map((stat, index) => (
            <div key={index} className="col-12 col-sm-6 col-xl-3">
              <div className={`stat-card ${stat.color}`}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="card-title mb-1">{stat.title}</h6>
                      <h3 className="card-value mb-0">{stat.value}</h3>
                      <span className="badge bg-opacity-10 mt-2">
                        {stat.change} <FaArrowUp className="ms-1" />
                      </span>
                    </div>
                    <div className="card-icon">
                      {stat.icon}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Sección de resumen */}
        <div className="row">
          <div className="col-12 col-lg-8 mb-4">
            <div className="card h-100">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Resumen de Ventas</h5>
                <div className="dropdown">
                  <button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    Este Mes
                  </button>
                  <ul className="dropdown-menu">
                    <li><a className="dropdown-item" href="#">Hoy</a></li>
                    <li><a className="dropdown-item" href="#">Esta Semana</a></li>
                    <li><a className="dropdown-item" href="#">Este Mes</a></li>
                    <li><a className="dropdown-item" href="#">Este Año</a></li>
                  </ul>
                </div>
              </div>
              <div className="card-body">
                <div className="text-center py-5">
                  <FaChartBar size={48} className="text-muted mb-3" />
                  <p className="text-muted">Gráfico de ventas se mostrará aquí</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-12 col-lg-4">
            <div className="card h-100">
              <div className="card-header">
                <h5 className="mb-0">Actividad Reciente</h5>
              </div>
              <div className="card-body p-0">
                <div className="list-group list-group-flush">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="list-group-item list-group-item-action border-0 py-3 px-4">
                      <div className="d-flex align-items-center">
                        <div className="bg-primary bg-opacity-10 p-2 rounded me-3">
                          <FaShoppingCart className="text-primary" />
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mb-0">Nueva orden #{1000 + item}</h6>
                          <p className="text-muted small mb-0">Hace {item} hora{item !== 1 ? 's' : ''}</p>
                        </div>
                        <span className="badge bg-success bg-opacity-10 text-success">Completada</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }, [location.pathname, stats]);

  return (
    <div className="d-flex">
      {/* Botón para móviles */}
      <button 
        className="sidebar-toggle d-lg-none" 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle navigation"
      >
        <FaBars />
      </button>
      
      {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarOpen ? 'show' : ''}`}>
        <div className="text-center mb-4 pt-3">
          <h4 className="fw-bold text-levelup-primary">LEVEL UP</h4>
          <small className="text-muted">Panel de Administración</small>
        </div>
        
        <nav className="mt-4">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`sidebar-link ${isActive(item.path)}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="me-2">{item.icon}</span>
              {item.label}
            </Link>
          ))}
          
          <div className="mt-4 pt-3 border-top border-levelup-border mx-3">
            <a 
              href="/" 
              className="sidebar-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="me-2"><FaStore /></span>
              Ver Tienda
            </a>
            
            <button 
              className="sidebar-link text-start w-100"
              onClick={handleLogout}
              type="button"
            >
              <span className="me-2"><FaSignOutAlt /></span>
              Cerrar Sesión
            </button>
          </div>
        </nav>
      </div>
      
      {/* Contenido principal */}
      <div className="admin-content">
        {renderDashboard()}
        <Outlet />
      </div>
    </div>
  );
}
