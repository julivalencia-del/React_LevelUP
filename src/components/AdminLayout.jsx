import { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  FaChartLine, 
  FaGamepad, 
  FaUsers, 
  FaClipboardList, 
  FaBoxes, 
  FaUserCog,
  FaSignOutAlt,
  FaCog
} from 'react-icons/fa';
import '../css/globales.css';
import '../css/pagina-admin.css';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Cerrar el menú en móviles al cambiar de ruta
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  const handleLogout = () => {
    window.location.href = '/';
  };

  return (
    <div className="d-flex admin-container" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarOpen ? 'show' : ''}`}>
        <div className="sidebar-content">
          <div className="sidebar-logo">
            <img 
              src="/img/logo-level-Up.png" 
              alt="Level Up Gamer" 
              className="img-fluid"
            />
            <span className="brand-name">Level Up Gamer</span>
          </div>
          
          <nav className="sidebar-menu">
            <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>
              <FaChartLine /> <span>Dashboard</span>
            </Link>
            <Link to="/admin/usuarios" className={location.pathname.startsWith('/admin/usuarios') ? 'active' : ''}>
              <FaUsers /> <span>Usuarios</span>
            </Link>
            <Link to="/admin/ordenes" className={location.pathname.startsWith('/admin/ordenes') ? 'active' : ''}>
              <FaClipboardList /> <span>Órdenes</span>
            </Link>
            <Link to="/admin/productos" className={location.pathname.startsWith('/admin/productos') ? 'active' : ''}>
              <FaGamepad /> <span>Productos</span>
            </Link>
            <Link to="/admin/categorias" className={location.pathname.startsWith('/admin/categorias') ? 'active' : ''}>
              <FaBoxes /> <span>Categorías</span>
            </Link>
            <Link to="/admin/reportes" className={location.pathname.startsWith('/admin/reportes') ? 'active' : ''}>
              <FaChartLine /> <span>Reportes</span>
            </Link>
            <Link to="/admin/perfil" className={location.pathname.startsWith('/admin/perfil') ? 'active' : ''}>
              <FaUserCog /> <span>Mi Perfil</span>
            </Link>
            <button onClick={handleLogout} className="logout-btn">
              <FaSignOutAlt /> <span>Volver a la tienda</span>
            </button>
          </nav>
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="main-content">
        <div className="mobile-header d-lg-none">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="menu-toggle">
            <FaCog className="me-2" /> Menú
          </button>
        </div>
        
        <div className={`content-wrapper ${(
          location.pathname.startsWith('/admin/usuarios') ||
          location.pathname.startsWith('/admin/productos') ||
          location.pathname.startsWith('/admin/perfil')
        ) ? 'full-bleed' : ''}`}>
          <Outlet />
        </div>
      </div>
      
      {/* Overlay para móviles */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default AdminLayout;
