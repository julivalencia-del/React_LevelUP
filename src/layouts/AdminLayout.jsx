import { useState, useCallback } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaBox, FaChartBar, FaClipboardList, FaTags, 
  FaUsers, FaUserCog, FaStore, FaSignOutAlt, 
  FaBars, FaShoppingCart, FaDollarSign, FaArrowUp, FaHome
} from 'react-icons/fa';
import '../css/globales.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/pagina-admin.css';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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
    localStorage.removeItem('adminToken');
    navigate('/login');
  }, [navigate]);

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
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
