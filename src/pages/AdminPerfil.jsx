import { useState, useEffect } from 'react';
import { 
  FaUserCog, 
  FaEnvelope, 
  FaLock, 
  FaUser, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaSave, 
  FaTimes, 
  FaCamera 
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

// Usamos las rutas de CSS originales de tu proyecto
import '../css/globales.css';
import '../css/pagina-admin.css';


const AdminPerfil = () => {
  // Usuarios y selección actual
  const [usuarios, setUsuarios] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Datos del perfil derivados del usuario seleccionado
  const [perfil, setPerfil] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    rol: '',
    fechaRegistro: '',
    ultimoAcceso: ''
  });

  const [editarPerfil, setEditarPerfil] = useState(false);
  const [formData, setFormData] = useState({ ...perfil });
  const [cambiarContrasena, setCambiarContrasena] = useState(false);
  const [contrasena, setContrasena] = useState({
    actual: '',
    nueva: '',
    confirmar: ''
  });

  // Cargar usuarios y usuario actual desde localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('usuarios');
      if (stored) {
        const list = JSON.parse(stored);
        setUsuarios(list);
        const storedId = localStorage.getItem('currentUserId');
        if (storedId) {
          setCurrentUserId(parseInt(storedId, 10));
        } else if (list.length > 0) {
          // Preferir un admin si existe, si no el primero
          const admin = list.find(u => (u.rol || '').toLowerCase() === 'admin');
          const id = (admin ? admin.id : list[0].id);
          setCurrentUserId(id);
          localStorage.setItem('currentUserId', String(id));
        }
      }
    } catch (e) {
      console.error('Error cargando usuarios:', e);
    }
  }, []);

  // Cuando cambia el usuario seleccionado o la lista, reconstruir el perfil
  useEffect(() => {
    if (!currentUserId || usuarios.length === 0) return;
    const u = usuarios.find(x => x.id === currentUserId);
    if (!u) return;

    const perfilesRaw = localStorage.getItem('perfiles');
    const perfiles = perfilesRaw ? JSON.parse(perfilesRaw) : {};
    const ext = perfiles[currentUserId] || {};

    const nombreParts = (u.nombre || '').trim().split(' ');
    const nombre = nombreParts[0] || '';
    const apellido = nombreParts.slice(1).join(' ');

    setPerfil({
      nombre,
      apellido,
      email: u.email || '',
      telefono: ext.telefono || '',
      direccion: ext.direccion || '',
      rol: u.rol || '',
      fechaRegistro: u.fechaRegistro || '',
      ultimoAcceso: ext.ultimoAcceso || ''
    });
  }, [currentUserId, usuarios]);

  // Sincronizar formData cuando perfil cambie
  useEffect(() => {
    setFormData({ ...perfil });
  }, [perfil]);

  // Alternar edición de perfil
  const toggleEditarPerfil = () => {
    if (editarPerfil) {
      setFormData({ ...perfil });
    }
    setEditarPerfil(!editarPerfil);
  };

  // Cancelar edición
  const cancelarEdicion = () => {
    setFormData({ ...perfil });
    setEditarPerfil(false);
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Alias para mantener compatibilidad
  const handleInputChange = handleChange;

  // Manejar cambios en el formulario de contraseña
  const handleContrasenaChange = (e) => {
    const { name, value } = e.target;
    setContrasena({
      ...contrasena,
      [name]: value
    });
  };

  // Guardar cambios del perfil (actualiza usuarios y perfiles en localStorage)
  const guardarPerfil = (e) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.email) {
      Swal.fire({
        icon: 'error',
        title: 'Campos incompletos',
        text: 'Por favor complete los campos requeridos (Nombre y Email).'
      });
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Swal.fire({
        icon: 'error',
        title: 'Email inválido',
        text: 'Por favor ingrese un correo electrónico válido.'
      });
      return;
    }
    
    // Actualizar la lista de usuarios (nombre y email)
    try {
      const list = [...usuarios];
      const idx = list.findIndex(u => u.id === currentUserId);
      if (idx !== -1) {
        const nombreCompleto = [formData.nombre, formData.apellido].filter(Boolean).join(' ').trim();
        list[idx] = {
          ...list[idx],
          nombre: nombreCompleto || formData.nombre || list[idx].nombre,
          email: formData.email || list[idx].email
        };
        setUsuarios(list);
        localStorage.setItem('usuarios', JSON.stringify(list));
      }

      // Guardar campos extendidos en 'perfiles'
      const perfilesRaw = localStorage.getItem('perfiles');
      const perfiles = perfilesRaw ? JSON.parse(perfilesRaw) : {};
      perfiles[currentUserId] = {
        ...(perfiles[currentUserId] || {}),
        telefono: formData.telefono || '',
        direccion: formData.direccion || '',
        ultimoAcceso: formData.ultimoAcceso || perfiles[currentUserId]?.ultimoAcceso || ''
      };
      localStorage.setItem('perfiles', JSON.stringify(perfiles));

      setPerfil({ ...formData });
      setEditarPerfil(false);
    } catch (error) {
      console.error('Error guardando perfil:', error);
    }
    Swal.fire({
      icon: 'success',
      title: '¡Actualizado!',
      text: 'Perfil actualizado correctamente.',
      timer: 1500,
      showConfirmButton: false
    });
  };

  // Guardar nueva contraseña
  const guardarContrasena = (e) => {
    e.preventDefault();
    
    if (contrasena.nueva !== contrasena.confirmar) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden.'
      });
      return;
    }
    
    if (contrasena.nueva.length < 6) {
      Swal.fire({
        icon: 'error',
        title: 'Contraseña débil',
        text: 'La contraseña debe tener al menos 6 caracteres.'
      });
      return;
    }
    
    console.log('Cambiando contraseña:', contrasena);
    
    setContrasena({ actual: '', nueva: '', confirmar: '' });
    setCambiarContrasena(false);
    Swal.fire({
      icon: 'success',
      title: '¡Actualizada!',
      text: 'Contraseña actualizada correctamente.',
      timer: 1500,
      showConfirmButton: false
    });
  };

  // // Funciones de preferencias eliminadas (ya no se usan)
  // const toggleNotificaciones = () => { ... };
  // const toggleModoOscuro = () => { ... };
  // const toggleDosFactores = () => { ... };

  return (
    <div className="container-fluid p-4">
      
      <div className="acciones-container" style={{ display: 'none' }}></div>
      
      <div className="card">
        <div className="card-header d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div>
            <h2 className="h4 mb-0">Mi Perfil</h2>
            <p className="text-light mb-0">Administra tu cuenta y preferencias</p>
          </div>
          <div className="d-flex align-items-center" style={{ minWidth: 240 }}>
            <label className="me-2 mb-0 small text-light">Usuario:</label>
            <select
              className="form-select form-select-sm"
              value={currentUserId || ''}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setCurrentUserId(val);
                localStorage.setItem('currentUserId', String(val));
                setEditarPerfil(false);
              }}
            >
              <option value="" disabled>Seleccionar</option>
              {usuarios.map(u => (
                <option key={u.id} value={u.id}>{u.nombre} ({u.rol})</option>
              ))}
            </select>
          </div>
        </div>
        <div className="card-body">
        
        <div className="row">
          
          {/* --- INICIO COLUMNA IZQUIERDA (PEQUEÑA) --- */}
          {/* Aquí va el avatar y el cambio de contraseña */}
          <div className="col-lg-4">
            <div className="card mb-4">
              <div className="card-body text-center">
                <div className="position-relative d-inline-block mb-3">
                  <img 
                    src="https://ui-avatars.com/api/?name=Admin+Sistema&background=0D6EFD&color=fff&size=150" 
                    alt="Foto de perfil" 
                    className="rounded-circle img-thumbnail"
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                  />
                  {editarPerfil && (
                    <button className="btn btn-primary btn-sm rounded-circle position-absolute" style={{ bottom: '10px', right: '10px' }}>
                      <FaCamera />
                    </button>
                  )}
                </div>
                <h5 className="my-2 text-light">{perfil.nombre} {perfil.apellido}</h5>
                <p className="text-light mb-1">{perfil.rol}</p>
                <p className="text-light small mb-0">Miembro desde {perfil.fechaRegistro}</p>
                <p className="text-light small">Último acceso: {perfil.ultimoAcceso || '-'}</p>
                
                {!editarPerfil && (
                  <button 
                    className="btn btn-outline-primary btn-sm mt-2"
                    onClick={() => setCambiarContrasena(!cambiarContrasena)}
                  >
                    <FaLock className="me-1" /> 
                    {cambiarContrasena ? 'Cancelar' : 'Cambiar Contraseña'}
                  </button>
                )}
              </div>
            </div>
            
            {cambiarContrasena && !editarPerfil && (
              <div className="card mb-4">
                <div className="card-header">
                  <h5 className="mb-0">Cambiar Contraseña</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={guardarContrasena}>
                    <div className="mb-3">
                      <label className="form-label small">Contraseña Actual</label>
                      <div className="input-group">
                        <span className="input-group-text"><FaLock /></span>
                        <input 
                          type="password" 
                          className="form-control" 
                          name="actual"
                          value={contrasena.actual}
                          onChange={handleContrasenaChange}
                          required 
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label small">Nueva Contraseña</label>
                      <div className="input-group">
                        <span className="input-group-text"><FaLock /></span>
                        <input 
                          type="password" 
                          className="form-control" 
                          name="nueva"
                          value={contrasena.nueva}
                          onChange={handleContrasenaChange}
                          required 
                          minLength="6"
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label small">Confirmar Nueva Contraseña</label>
                      <div className="input-group">
                        <span className="input-group-text"><FaLock /></span>
                        <input 
                          type="password" 
                          className="form-control" 
                          name="confirmar"
                          value={contrasena.confirmar}
                          onChange={handleContrasenaChange}
                          required 
                          minLength="6"
                        />
                      </div>
                    </div>
                    <div className="d-grid gap-2">
                      <button type="submit" className="btn btn-primary">
                        <FaSave className="me-1" /> Guardar Cambios
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary"
                        onClick={() => setCambiarContrasena(false)}
                      >
                        <FaTimes className="me-1" /> Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div> 
          {/* --- FIN COLUMNA IZQUIERDA (col-lg-4) --- */}


          {/* --- INICIO COLUMNA DERECHA (GRANDE) --- */}
          {/* Aquí va la Información y la Actividad Reciente */}
          <div className="col-lg-8">
            <div className="card mb-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Información del Perfil</h5>
                {!editarPerfil ? (
                  <button 
                    className="btn btn-sm btn-outline-primary"
                    onClick={toggleEditarPerfil}
                  >
                    <FaUserCog className="me-1" /> Editar Perfil
                  </button>
                ) : (
                  <button 
                    className="btn btn-sm btn-outline-secondary"
                    onClick={cancelarEdicion}
                  >
                    <FaTimes className="me-1" /> Cancelar Edición
                  </button>
                )}
              </div>
              <div className="card-body">
                <form onSubmit={guardarPerfil}>
                  <div className="row mb-3">
                    <div className="col-md-6 mb-3 mb-md-0">
                      <label className="form-label">Nombre</label>
                      {editarPerfil ? (
                        <div className="input-group">
                          <span className="input-group-text"><FaUser /></span>
                          <input 
                            type="text" 
                            className="form-control" 
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      ) : (
                        <p className="form-control-plaintext text-light">{perfil.nombre}</p>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Apellido</label>
                      {editarPerfil ? (
                        <div className="input-group">
                          <span className="input-group-text"><FaUser /></span>
                          <input 
                            type="text" 
                            className="form-control" 
                            name="apellido"
                            value={formData.apellido}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      ) : (
                        <p className="form-control-plaintext text-light">{perfil.apellido}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Correo Electrónico</label>
                    {editarPerfil ? (
                      <div className="input-group">
                        <span className="input-group-text"><FaEnvelope /></span>
                        <input 
                          type="email" 
                          className="form-control" 
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    ) : (
                      <p className="form-control-plaintext text-light">{perfil.email}</p>
                    )}
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3 mb-md-0">
                      <label className="form-label">Teléfono</label>
                      {editarPerfil ? (
                        <div className="input-group">
                          <span className="input-group-text"><FaPhone /></span>
                          <input 
                            type="tel" 
                            className="form-control" 
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleInputChange}
                          />
                        </div>
                      ) : (
                        <p className="form-control-plaintext text-light">{perfil.telefono || 'No especificado'}</p>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Rol</label>
                      <p className="form-control-plaintext text-light">{perfil.rol}</p>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Dirección</label>
                    {editarPerfil ? (
                      <div className="input-group">
                        <span className="input-group-text"><FaMapMarkerAlt /></span>
                        <input 
                          type="text" 
                          className="form-control" 
                          name="direccion"
                          value={formData.direccion}
                          onChange={handleInputChange}
                        />
                      </div>
                    ) : (
                      <p className="form-control-plaintext text-light">{perfil.direccion || 'No especificada'}</p>
                    )}
                  </div>
                  
                  {editarPerfil && (
                    <div className="d-flex justify-content-end mt-4">
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary me-2"
                        onClick={cancelarEdicion}
                      >
                        <FaTimes className="me-1" /> Cancelar
                      </button>
                      <button type="submit" className="btn btn-primary">
                        <FaSave className="me-1" /> Guardar Cambios
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
            
            {/*
             * --- CORRECCIÓN FINAL ---
             * 1. Se eliminó la tarjeta "Preferencias" que estaba aquí.
             * 2. Se movió la tarjeta "Actividad Reciente" a esta columna (col-lg-8).
             * 3. Se añadió 'mt-4' para darle espacio.
             */}
            <div className="card mt-4">
              <div className="card-header">
                <h5 className="mb-0">Actividad Reciente</h5>
              </div>
              <div className="card-body">
                <div className="timeline">
                  <div className="timeline-item">
                    <div className="timeline-badge bg-primary"></div>
                    <div className="timeline-content">
                      <h6>Inicio de sesión exitoso</h6>
                      <p className="text-light small mb-0">Hoy, 14:30</p>
                      <p className="mb-0 small text-light">Se ha iniciado sesión desde una nueva ubicación</p>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-badge bg-success"></div>
                    <div className="timeline-content">
                      <h6>Actualización de perfil</h6>
                      <p className="text-light small mb-0">Ayer, 09:15</p>
                      <p className="mb-0 small text-light">Se actualizó la información de contacto</p>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-badge bg-info"></div>
                    <div className="timeline-content">
                      <h6>Nuevo producto agregado</h6>
                      <p className="text-light small mb-0">01/11/2023</p>
                      <p className="mb-0 small text-light">Se agregó un nuevo producto al catálogo</p>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-3">
                  <Link to="/admin/actividad" className="btn btn-sm btn-outline-primary">Ver toda la actividad</Link>
                </div>
              </div>
            </div>
            {/* --- FIN BLOQUE MOVIDO --- */}
            
          </div> 
          {/* --- FIN COLUMNA DERECHA (col-lg-8) --- */}

        </div> {/* <-- Cierre del <div className="row"> */ }

        </div> {/* Fin card-body */}
      </div> {/* Fin card */}
    </div> /* Fin container-fluid */
  );
};

export default AdminPerfil;