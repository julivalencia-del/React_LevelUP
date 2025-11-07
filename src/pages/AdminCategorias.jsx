import { useEffect, useMemo, useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import '../css/globales.css';
import Swal from 'sweetalert2';

const AdminCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    descripcion: '',
    estado: 'Activo',
    productos: 0
  });
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    try {
      const guardadas = localStorage.getItem('categorias');
      if (guardadas) {
        setCategorias(JSON.parse(guardadas));
      } else {
        const ejemplo = [
          { id: 1, nombre: 'Videojuegos', descripcion: 'Juegos para todas las plataformas', estado: 'Activo', productos: 125 },
          { id: 2, nombre: 'Consolas', descripcion: 'Últimas consolas del mercado', estado: 'Activo', productos: 42 },
          { id: 3, nombre: 'Accesorios', descripcion: 'Mandos, auriculares y más', estado: 'Activo', productos: 89 },
          { id: 4, nombre: 'Merchandising', descripcion: 'Productos de colección', estado: 'Inactivo', productos: 37 },
        ];
        setCategorias(ejemplo);
        localStorage.setItem('categorias', JSON.stringify(ejemplo));
      }
    } catch (e) {
      console.error('Error al cargar categorías:', e);
      Swal.fire('Error', 'No se pudieron cargar las categorías', 'error');
    } finally {
      setCargando(false);
    }
  }, []);

  // Cargar productos para conteo por categoría y escuchar cambios
  useEffect(() => {
    const cargarProductos = () => {
      try {
        const ls = JSON.parse(localStorage.getItem('productos')) || [];
        setProductos(Array.isArray(ls) ? ls : []);
      } catch {
        setProductos([]);
      }
    };
    cargarProductos();
    const onStorage = (e) => { if (e.key === 'productos') cargarProductos(); };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Catálogo y normalización de nombres
  const catalogOrder = ['Consolas','Computadores Gamers','Accesorios','Sillas Gamers','Juegos de Mesa'];
  const normalizeCategory = (name) => {
    if (!name) return '';
    const strip = (s) => s.toString().normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase().trim().replace(/\s+/g,' ');
    const s = strip(name);
    const map = new Map([
      ['consola','Consolas'], ['consolas','Consolas'],
      ['pc gamer','Computadores Gamers'], ['pcs gamer','Computadores Gamers'],
      ['computador gamer','Computadores Gamers'], ['computadores gamer','Computadores Gamers'], ['computadores gamers','Computadores Gamers'],
      ['accesorios','Accesorios'],
      ['silla gamer','Sillas Gamers'], ['sillas gamer','Sillas Gamers'], ['sillas gamers','Sillas Gamers'],
      ['juegos de mesa','Juegos de Mesa']
    ]);
    if (map.has(s)) return map.get(s);
    for (const cat of catalogOrder) { if (strip(cat) === s) return cat; }
    return s.split(' ').map(w => w.charAt(0).toUpperCase()+w.slice(1)).join(' ');
  };

  const contarProductosActivos = useMemo(() => {
    const map = new Map();
    productos.forEach(p => {
      const cat = normalizeCategory(p?.categoria);
      const stock = p?.stock ?? 0;
      if (!cat) return;
      if (stock <= 0) return;
      map.set(cat, (map.get(cat) || 0) + 1);
    });
    return map;
  }, [productos]);

  // Sincronizar lista de categorías con las categorías que existen en productos
  useEffect(() => {
    if (!Array.isArray(productos)) return;
    const productCatsRaw = Array.from(new Set(productos.map(p => normalizeCategory(p?.categoria)).filter(Boolean)));
    // Restringir solo a las categorías del catálogo oficial (mismas que Productos.jsx)
    const productCats = productCatsRaw.filter(c => catalogOrder.includes(c));
    // Si no hay categorías válidas en productos, la lista debe quedar vacía
    if (productCats.length === 0) {
      if (categorias.length !== 0) {
        setCategorias([]);
        try { localStorage.setItem('categorias', JSON.stringify([])); } catch {}
      }
      return;
    }

    // Mapear existentes por nombre
    const existMap = new Map((categorias || []).map(c => [c.nombre, c]));
    // Orden catálogo primero, resto alfabético
    const rank = (n) => { const i = catalogOrder.indexOf(n); return i === -1 ? 999 : i; };
    const ordenadas = [...productCats].sort((a,b)=> { const ra=rank(a), rb=rank(b); if (ra!==rb) return ra-rb; return a.localeCompare(b); });
    const nextIdBase = categorias.length > 0 ? Math.max(...categorias.map(c => c.id)) + 1 : 1;
    let nextId = nextIdBase;
    const syncList = ordenadas.map(nombre => {
      const ex = existMap.get(nombre);
      if (ex) return { ...ex };
      return { id: nextId++, nombre, descripcion: '', estado: 'Activo', productos: 0 };
    });

    // Solo actualizar si hay diferencias reales
    const differentLength = syncList.length !== categorias.length;
    const differentContent = differentLength || syncList.some((c, i) => {
      const ex = categorias[i];
      return !ex || ex.nombre !== c.nombre || ex.estado !== c.estado || ex.descripcion !== c.descripcion;
    });
    if (differentContent) {
      setCategorias(syncList);
      try { localStorage.setItem('categorias', JSON.stringify(syncList)); } catch {}
    }
  }, [productos, categorias]);
  
  const categoriasFiltradas = categorias.filter(cat => 
    cat.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    cat.descripcion.toLowerCase().includes(filtro.toLowerCase())
  );
  
  const handleEliminar = (id) => {
    Swal.fire({
      title: '¿Eliminar categoría?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(res => {
      if (res.isConfirmed) {
        const lista = categorias.filter(cat => cat.id !== id);
        setCategorias(lista);
        localStorage.setItem('categorias', JSON.stringify(lista));
        Swal.fire('Eliminada', 'Categoría eliminada', 'success');
      }
    });
  };
  
  const handleEditar = (categoria) => {
    setFormData({
      id: categoria.id,
      nombre: categoria.nombre,
      descripcion: categoria.descripcion,
      estado: categoria.estado,
      productos: categoria.productos ?? 0
    });
    setMostrarModal(true);
  };
  
  const abrirModalNuevo = () => {
    setFormData({ id: '', nombre: '', descripcion: '', estado: 'Activo', productos: 0 });
    setMostrarModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGuardar = (e) => {
    e.preventDefault();
    if (!formData.nombre || !formData.descripcion) {
      Swal.fire('Atención', 'Nombre y Descripción son obligatorios', 'warning');
      return;
    }
    let lista = [...categorias];
    if (formData.id) {
      const idx = lista.findIndex(c => c.id === formData.id);
      if (idx !== -1) {
        lista[idx] = { ...lista[idx], ...formData, id: formData.id };
      }
    } else {
      const nuevoId = categorias.length > 0 ? Math.max(...categorias.map(c => c.id)) + 1 : 1;
      lista.push({ ...formData, id: nuevoId, productos: formData.productos ?? 0 });
    }
    setCategorias(lista);
    localStorage.setItem('categorias', JSON.stringify(lista));
    setMostrarModal(false);
    Swal.fire('Éxito', 'Categoría guardada correctamente', 'success');
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Gestión de Categorías</h2>
        <button 
          className="btn btn-primary"
          onClick={abrirModalNuevo}
        >
          <FaPlus className="me-2" /> Nueva Categoría
        </button>
      </div>
      
      <div className="card">
        <div className="card-body">
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text"><FaSearch /></span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar categorías..."
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6 text-md-end mt-2 mt-md-0">
              <span className="text-muted">
                Mostrando {categoriasFiltradas.length} de {categorias.length} categorías
              </span>
            </div>
          </div>
          
          <div className="table-responsive">
            <table className="table table-hover table-sm align-middle categories-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th className="text-center">Productos</th>
                  <th>Estado</th>
                  <th className="text-center" style={{ width: '96px' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categoriasFiltradas.map((categoria) => (
                  <tr key={categoria.id}>
                    <td>
                      <div className="fw-bold">{categoria.nombre}</div>
                    </td>
                    <td>
                      <div className="text-muted small">{categoria.descripcion}</div>
                    </td>
                    <td className="text-center">
                      <span className="badge bg-primary bg-opacity-10 text-primary">
                        {(contarProductosActivos.get(categoria.nombre) || 0)} productos
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${categoria.estado === 'Activo' ? 'bg-success' : 'bg-secondary'}`}>
                        {categoria.estado}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="action-buttons">
                        <button 
                          className="btn btn-outline-primary btn-icon"
                          title="Editar categoría"
                          onClick={() => handleEditar(categoria)}
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="btn btn-outline-danger btn-icon"
                          title="Eliminar categoría"
                          onClick={() => handleEliminar(categoria.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {categoriasFiltradas.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">
                      No se encontraron categorías que coincidan con la búsqueda
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Modal para editar/crear categoría */}
      {mostrarModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{formData.id ? 'Editar Categoría' : 'Nueva Categoría'}</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => {
                    setMostrarModal(false);
                  }}
                ></button>
              </div>
              <form onSubmit={handleGuardar}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Nombre de la categoría</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea 
                      className="form-control" 
                      rows="3"
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Estado</label>
                    <select 
                      className="form-select"
                      name="estado"
                      value={formData.estado}
                      onChange={handleChange}
                    >
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => {
                      setMostrarModal(false);
                    }}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategorias;
