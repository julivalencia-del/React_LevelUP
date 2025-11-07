import { useEffect, useState } from 'react'
import '../css/globales.css'
import '../css/pagina-admin.css'
import Swal from 'sweetalert2'
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa'

function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    email: '',
    password: '',
    rol: 'usuario',
    fechaRegistro: ''
  })

  const resetForm = () => {
    setFormData({ id: '', nombre: '', email: '', password: '', rol: 'usuario', fechaRegistro: '' })
  }

  const cargarUsuarios = () => {
    try {
      const guardados = localStorage.getItem('usuarios')
      if (guardados) {
        setUsuarios(JSON.parse(guardados))
      } else {
        const ejemplo = [
          { id: 1, nombre: 'Juan Pérez', email: 'juan@example.com', rol: 'admin', fechaRegistro: '2024-01-10' },
          { id: 2, nombre: 'María López', email: 'maria@example.com', rol: 'usuario', fechaRegistro: '2024-02-05' },
          { id: 3, nombre: 'Carlos Díaz', email: 'carlos@example.com', rol: 'vendedor', fechaRegistro: '2024-03-18' }
        ]
        setUsuarios(ejemplo)
        localStorage.setItem('usuarios', JSON.stringify(ejemplo))
      }
    } catch (e) {
      console.error('Error al cargar usuarios:', e)
      Swal.fire('Error', 'No se pudieron cargar los usuarios', 'error')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarUsuarios()
  }, [])

  const abrirModalNuevo = () => {
    resetForm()
    setModalAbierto(true)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const guardarUsuario = (e) => {
    e.preventDefault()
    try {
      if (!formData.nombre || !formData.email) {
        Swal.fire('Atención', 'Nombre y Email son obligatorios', 'warning')
        return
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        Swal.fire('Atención', 'Email no es válido', 'warning')
        return
      }
      let lista = [...usuarios]
      if (formData.id) {
        const idx = lista.findIndex(u => u.id === formData.id)
        if (idx !== -1) {
          const { password, ...rest } = formData
          lista[idx] = { ...lista[idx], ...rest }
          if (password && password.length >= 6) {
            lista[idx].password = password
          }
        }
      } else {
        const nuevoId = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1
        const fecha = new Date().toISOString().split('T')[0]
        const { password, ...rest } = formData
        lista.push({ ...rest, id: nuevoId, fechaRegistro: fecha })
      }
      setUsuarios(lista)
      localStorage.setItem('usuarios', JSON.stringify(lista))
      setModalAbierto(false)
      resetForm()
      Swal.fire('Éxito', 'Usuario guardado correctamente', 'success')
    } catch (error) {
      console.error('Error al guardar usuario:', error)
      Swal.fire('Error', 'No se pudo guardar el usuario', 'error')
    }
  }

  const editarUsuario = (id) => {
    const u = usuarios.find(x => x.id === id)
    if (u) {
      setFormData({ ...u, password: '' })
      setModalAbierto(true)
    }
  }

  const eliminarUsuario = (id) => {
    Swal.fire({
      title: '¿Eliminar usuario?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(res => {
      if (res.isConfirmed) {
        const lista = usuarios.filter(u => u.id !== id)
        setUsuarios(lista)
        localStorage.setItem('usuarios', JSON.stringify(lista))
        Swal.fire('Eliminado', 'Usuario eliminado', 'success')
      }
    })
  }

  return (
    <>
      <div className="container-fluid py-4 users-container">
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center py-2">
            <h2 className="h4 mb-0">Gestión de Usuarios</h2>
            <button className="btn btn-success btn-sm" onClick={abrirModalNuevo}>
              <FaPlus className="me-1"/> Nuevo Usuario
            </button>
          </div>
          <div className="card-body p-2">
            {cargando ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-2 text-muted">Cargando usuarios...</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover table-sm align-middle mb-0 users-table">
                  <thead className="table-dark">
                    <tr>
                      <th className="text-center">#</th>
                      <th>Usuario</th>
                      <th className="d-none d-md-table-cell" style={{width: '30%'}}>Email</th>
                      <th className="text-center">Rol</th>
                      <th className="d-none d-lg-table-cell" style={{width: '160px'}}>Registro</th>
                      <th className="text-center" style={{width: '90px'}}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.length > 0 ? (
                      usuarios.map(u => (
                        <tr key={u.id}>
                          <td className="text-center">{u.id}</td>
                          <td className="fw-semibold">{u.nombre}</td>
                          <td className="d-none d-md-table-cell">{u.email}</td>
                          <td className="text-center"><span className="badge bg-secondary px-2 py-1 text-uppercase">{u.rol}</span></td>
                          <td className="d-none d-lg-table-cell">{u.fechaRegistro || '-'}</td>
                          <td className="text-center">
                            <div className="action-buttons">
                              <button className="btn btn-outline-primary btn-icon" title="Editar" onClick={() => editarUsuario(u.id)}>
                                <FaEdit />
                              </button>
                              <button className="btn btn-outline-danger btn-icon" title="Eliminar" onClick={() => eliminarUsuario(u.id)}>
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-4 text-muted">No hay usuarios registrados</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal controlado */}
      {modalAbierto && <div className="modal-backdrop fade show"></div>}
      <div className={`modal fade ${modalAbierto ? 'show' : ''}`} style={{ display: modalAbierto ? 'block' : 'none' }}>
        <div className="modal-dialog">
          <div className="modal-content bg-dark text-light">
            <div className="modal-header border-secondary">
              <h5 className="modal-title">{formData.id ? 'Editar Usuario' : 'Nuevo Usuario'}</h5>
              <button type="button" className="btn-close btn-close-white" onClick={() => setModalAbierto(false)}></button>
            </div>
            <form onSubmit={guardarUsuario}>
              <div className="modal-body">
                <input type="hidden" name="id" value={formData.id || ''} />
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Nombre completo</label>
                      <input type="text" className="form-control bg-dark text-light border-secondary" name="nombre" value={formData.nombre} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input type="email" className="form-control bg-dark text-light border-secondary" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Contraseña</label>
                      <input type="password" className="form-control bg-dark text-light border-secondary" name="password" value={formData.password} onChange={handleChange} placeholder="Dejar en blanco para no cambiar" />
                      <small className="text-muted">Mínimo 6 caracteres</small>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Rol</label>
                      <select className="form-select bg-dark text-light border-secondary" name="rol" value={formData.rol} onChange={handleChange} required>
                        <option value="usuario">Usuario</option>
                        <option value="vendedor">Vendedor</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-secondary">
                <button type="button" className="btn btn-secondary" onClick={() => setModalAbierto(false)}>Cancelar</button>
                <button type="submit" className="btn btn-success">{formData.id ? 'Actualizar Usuario' : 'Guardar Usuario'}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
export default AdminUsuarios;
