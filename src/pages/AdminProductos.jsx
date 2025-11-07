import { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaPlus, FaBox } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'sweetalert2/dist/sweetalert2.min.css';
import Swal from 'sweetalert2';

function AdminProductos() {
  const PLACEHOLDER_IMG = 'https://placehold.co/36x36/888/FFF?text=?';
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    codigo: '',
    nombre: '',
    descripcion: '',
    categoria: '',
    precio: '',
    stock: 0,
    imagen: ''
  });

  const resetForm = () => {
    setFormData({
      id: '',
      codigo: '',
      nombre: '',
      descripcion: '',
      categoria: '',
      precio: '',
      stock: 0,
      imagen: ''
    });
  };

  const getImageSrc = (url) => {
    if (!url) return PLACEHOLDER_IMG;
    if (/^https?:\/\//i.test(url)) return url; 
    if (/^data:/i.test(url)) return url; 
    if (url.startsWith('public/')) url = url.replace(/^public\//, '');
    if (url.startsWith('/public/')) url = url.replace(/^\/public\//, '/');
    if (url.startsWith('/')) return url; 
    if (url.startsWith('img/')) return `/${url}`; 
    if (!url.includes('/')) return `/img/${url}`; 
    return `/${url}`; 
  };

  // Cargar productos desde localStorage o datos de ejemplo
  const cargarProductos = () => {
    setCargando(true);
    try {
      // Intentar cargar desde localStorage
      const productosGuardados = localStorage.getItem('productos');
      
      if (productosGuardados) {
        // Si hay productos guardados, normalizar campos clave y completar stock faltante
        const parsed = JSON.parse(productosGuardados);
        const normalizados = (Array.isArray(parsed) ? parsed : []).map(p => {
          const sNum = parseInt(p?.stock);
          const stock = Number.isFinite(sNum) && sNum > 0 ? sNum : 10; // backfill a 10 si no hay stock válido
          const precioNum = parseInt(p?.precio);
          const precio = Number.isFinite(precioNum) && precioNum >= 0 ? precioNum : 0;
          const catRaw = (p?.categoria || '').toString();
          const categoria = /mouse/i.test(catRaw) ? 'Accesorios' : catRaw;
          return { ...p, stock, precio, categoria };
        });
        setProductos(normalizados);
        localStorage.setItem('productos', JSON.stringify(normalizados));
      } else {
        // Si no hay productos, usar datos de ejemplo
        const productosEjemplo = [
          {
            id: 1,
            codigo: 'CON001',
            nombre: 'PlayStation 5',
            descripcion: 'Consola de última generación con gráficos 4K',
            categoria: 'Consolas',
            precio: 599990,
            stock: 10,
            imagen: 'img/playtation-5.webp'
          },
          {
            id: 2,
            codigo: 'PCG001',
            nombre: 'PC Gamer Pro',
            descripcion: 'Computadora gamer con RTX 3080 y Ryzen 9',
            categoria: 'Computadores Gamers',
            precio: 1899990,
            stock: 5,
            imagen: 'img/PC_Gamer_ASUS_ROG_Strix.webp'
          },
          {
            id: 3,
            codigo: 'ACC001',
            nombre: 'Teclado Mecánico RGB',
            descripcion: 'Teclado mecánico con retroiluminación RGB personalizable',
            categoria: 'Accesorios',
            precio: 59990,
            stock: 25,
            imagen: 'img/Teclado_Razer_BlackWindow.avif'
          }
        ];
        
        // Guardar los productos de ejemplo en localStorage
        localStorage.setItem('productos', JSON.stringify(productosEjemplo));
        // Actualizar el estado con los productos de ejemplo
        setProductos(productosEjemplo);
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
      Swal.fire('Error', 'No se pudieron cargar los productos', 'error');
    } finally {
      // Siempre asegurarse de desactivar el estado de carga
      setCargando(false);
    }
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Guardar producto
  const guardarProducto = (e) => {
    e.preventDefault();
    try {
      let productosActualizados = [...productos];
      
      if (formData.id) {
        // Editar producto existente
        const index = productosActualizados.findIndex(p => p.id === formData.id);
        if (index !== -1) {
          productosActualizados[index] = { 
            ...formData,
            stock: parseInt(formData.stock) || 0,
            precio: parseInt(formData.precio) || 0
          };
        }
      } else {
        // Agregar nuevo producto
        const nuevoId = productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1;
        productosActualizados.push({
          ...formData,
          id: nuevoId,
          stock: parseInt(formData.stock) || 0,
          precio: parseInt(formData.precio) || 0
        });
      }

      localStorage.setItem('productos', JSON.stringify(productosActualizados));
      setProductos(productosActualizados);
      setModalAbierto(false);
      resetForm();
      
      Swal.fire('¡Éxito!', 'Producto guardado correctamente', 'success');
    } catch (error) {
      console.error('Error al guardar el producto:', error);
      Swal.fire('Error', 'No se pudo guardar el producto', 'error');
    }
  };

  // Editar producto
  const editarProducto = (id) => {
    const producto = productos.find(p => p.id === id);
    if (producto) {
      setFormData({
        id: producto.id,
        codigo: producto.codigo || '',
        nombre: producto.nombre || '',
        descripcion: producto.descripcion || '',
        categoria: producto.categoria || '',
        precio: producto.precio || '',
        stock: producto.stock || 0,
        imagen: producto.imagen || ''
      });
      setModalAbierto(true);
    }
  };

  // Eliminar producto
  const eliminarProducto = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          const productosActualizados = productos.filter(p => p.id !== id);
          localStorage.setItem('productos', JSON.stringify(productosActualizados));
          setProductos(productosActualizados);
          Swal.fire('¡Eliminado!', 'El producto ha sido eliminado.', 'success');
        } catch (error) {
          console.error('Error al eliminar el producto:', error);
          Swal.fire('Error', 'No se pudo eliminar el producto', 'error');
        }
      }
    });
  };

  // Abrir modal para nuevo producto
  const abrirModalNuevo = () => {
    resetForm();
    setModalAbierto(true);
  };


  // Inicializar la aplicación
  useEffect(() => {
    // Cargar productos al montar el componente
    cargarProductos();
    
    // Configurar tooltips de Bootstrap
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(function (tooltipTriggerEl) {
      if (!window.bootstrap.Tooltip.getInstance(tooltipTriggerEl)) {
        new window.bootstrap.Tooltip(tooltipTriggerEl);
      }
    });
    
    // Limpiar tooltips al desmontar
    return () => {
      tooltipTriggerList.forEach(tooltipTriggerEl => {
        const tooltip = window.bootstrap.Tooltip.getInstance(tooltipTriggerEl);
        if (tooltip) {
          tooltip.dispose();
        }
      });
    };
  }, []);

  return (
    <>
      <div className="container-fluid py-4 products-container">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center py-2">
              <h2 className="h4 mb-0">Gestión de Productos</h2>
              <button 
                className="btn btn-success btn-sm" 
                onClick={abrirModalNuevo}
              >
                <FaPlus className="me-1" /> Nuevo Producto
              </button>
            </div>

            <div className="card-body p-2">
              {cargando ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                  <p className="mt-2">Cargando productos...</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover table-sm align-middle products-table">
                    <thead className="table-dark">
                      <tr>
                        <th className="text-center">#</th>
                        <th>Producto</th>
                        <th className="d-none d-md-table-cell">Descripción</th>
                        <th className="text-center">Categoría</th>
                        <th className="text-end" style={{width: '110px'}}>Precio</th>
                        <th className="text-center" style={{width: '90px'}}>Stock</th>
                        <th className="text-center" style={{width: '90px'}}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody id="tabla-productos">
                      {productos.length > 0 ? (
                        productos.map((producto) => (
                          <tr key={producto.id}>
                            <td className="text-center">{producto.id}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <img 
                                  src={getImageSrc(producto.imagen)} 
                                  alt={producto.nombre} 
                                  className="rounded me-2" 
                                  style={{width: '36px', height: '36px', objectFit: 'cover'}} 
                                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = PLACEHOLDER_IMG; }}
                                />
                                <div>
                                  <div 
                                    className="fw-semibold product-name"
                                    title={producto.nombre}
                                  >
                                    {producto.nombre}
                                  </div>
                                  <small className="text-muted">{producto.codigo}</small>
                                </div>
                              </div>
                            </td>
                            <td className="d-none d-md-table-cell">
                              <div 
                                className="product-desc text-truncate"
                                data-bs-toggle="tooltip"
                                title={producto.descripcion || 'Sin descripción'}
                              >
                                {producto.descripcion || 'Sin descripción'}
                              </div>
                            </td>
                            <td className="text-center">
                              <span className="badge bg-primary px-2 py-1">
                                {producto.categoria || 'Sin categoría'}
                              </span>
                            </td>
                            <td className="text-end fw-bold">
                              ${producto.precio?.toLocaleString('es-CL') || '0'}
                            </td>
                            <td className="text-center">
                              {(() => {
                                const s = parseInt(producto.stock) || 0;
                                const badge = s === 0 ? 'danger' : (s < 5 ? 'warning' : 'success');
                                return <span className={`badge text-bg-${badge}`}>{s}</span>;
                              })()}
                            </td>
                            <td className="text-center">
                              <div className="action-buttons">
                                <button 
                                  className="btn btn-outline-primary btn-icon" 
                                  data-bs-toggle="tooltip" 
                                  title="Editar producto"
                                  onClick={() => editarProducto(producto.id)}
                                >
                                  <FaEdit />
                                </button>
                                <button 
                                  className="btn btn-outline-danger btn-icon" 
                                  data-bs-toggle="tooltip" 
                                  title="Eliminar producto"
                                  onClick={() => eliminarProducto(producto.id)}
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="text-center py-4">
                            <div className="py-4">
                              <div className="mb-3">
                                <FaBox size={48} className="text-muted" />
                              </div>
                              <h5>No hay productos registrados</h5>
                              <p className="text-muted">Comienza agregando tu primer producto</p>
                              <button 
                                className="btn btn-primary"
                                onClick={abrirModalNuevo}
                              >
                                <FaPlus className="me-2" /> Agregar Producto
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
      </div>

      {/* Modal de Producto */}
        {modalAbierto && <div className="modal-backdrop fade show"></div>}

        <div 
          className={`modal fade ${modalAbierto ? 'show' : ''}`} 
          style={{ display: modalAbierto ? 'block' : 'none' }} 
          id="modalProducto"
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content bg-dark text-light">
              <div className="modal-header border-secondary">
                <h5 className="modal-title">
                  {formData.id ? 'Editar Producto' : 'Nuevo Producto'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setModalAbierto(false)}
                  aria-label="Close"
                ></button>
              </div>
              <form onSubmit={guardarProducto}>
                <div className="modal-body">
                  <input type="hidden" name="id" value={formData.id} />
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Código</label>
                        <input 
                          type="text" 
                          className="form-control bg-dark text-light border-secondary" 
                          name="codigo" 
                          value={formData.codigo}
                          onChange={handleChange}
                          required 
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Categoría</label>
                        <select 
                          className="form-select bg-dark text-light border-secondary" 
                          name="categoria" 
                          value={formData.categoria}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Seleccionar categoría</option>
                          <option value="Consolas">Consolas</option>
                          <option value="Computadores Gamers">Computadores Gamers</option>
                          <option value="Accesorios">Accesorios</option>
                          <option value="Sillas Gamers">Sillas Gamers</option>
                          <option value="Juegos de Mesa">Juegos de Mesa</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Nombre</label>
                        <input 
                          type="text" 
                          className="form-control bg-dark text-light border-secondary" 
                          name="nombre" 
                          value={formData.nombre}
                          onChange={handleChange}
                          required 
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Precio</label>
                        <div className="input-group">
                          <span className="input-group-text">$</span>
                          <input 
                            type="number" 
                            className="form-control bg-dark text-light border-secondary" 
                            name="precio" 
                            min="0" 
                            step="100" 
                            value={formData.precio}
                            onChange={handleChange}
                            required 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Stock</label>
                        <input 
                          type="number" 
                          className="form-control bg-dark text-light border-secondary" 
                          name="stock" 
                          min="0" 
                          value={formData.stock}
                          onChange={handleChange}
                          required 
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Imagen (URL)</label>
                        <input 
                          type="text" 
                          className="form-control bg-dark text-light border-secondary" 
                          name="imagen" 
                          value={formData.imagen}
                          onChange={handleChange}
                          placeholder="https://..." 
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea 
                      className="form-control bg-dark text-light border-secondary" 
                      name="descripcion" 
                      rows={3}
                      value={formData.descripcion}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer border-secondary">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setModalAbierto(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {formData.id ? 'Actualizar' : 'Guardar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
    </>
  );
}

export default AdminProductos;