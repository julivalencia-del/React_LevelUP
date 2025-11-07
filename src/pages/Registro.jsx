import { useEffect } from 'react'
import '../css/globales.css'
import '../css/pagina-formularios.css'

export default function Registro() {
  useEffect(() => {
    document.body.classList.add('pagina-formularios')
    const loadOnce = (src) => new Promise((resolve) => {
      const exist = document.querySelector(`script[src='${src}']`)
      if (exist) return resolve('exists')
      const sc = document.createElement('script')
      sc.src = src
      sc.async = true
      sc.onload = () => resolve('loaded')
      document.body.appendChild(sc)
    })
    ;(async () => {
      await loadOnce('/js/validaciones.js')
      if (!window._legacyAppLoaded) {
        await loadOnce('/js/app.js')
        window._legacyAppLoaded = true
      }
      if (document.readyState !== 'loading') {
        document.dispatchEvent(new Event('DOMContentLoaded'))
      }
    })()
    return () => document.body.classList.remove('pagina-formularios')
  }, [])

  return (
    <>
      <div className="acciones-container" style={{ display: 'none' }}></div>
      <div className="sidebar-admin" id="sidebar-admin" style={{ display: 'none' }}>
        <a href="/admin">Admin</a>
      </div>
      <main className="contenedor-formulario-registro">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
              <div className="formulario-registro">
                <div className="encabezado-formulario-registro">
                  <div className="circulo-logo">
                    <img src="/img/logo-level-Up.png" alt="Level-Up Gamer" />
                  </div>
                  <h2 className="titulo-formulario-registro">CREAR CUENTA</h2>
                </div>

                <form id="form-registro" className="formulario-registro" noValidate>
                  <div className="grupo-formulario-registro">
                    <label htmlFor="nombre" className="etiqueta-formulario-registro">Nombre Completo</label>
                    <input type="text" className="control-formulario-registro" id="nombre" name="nombre" placeholder="Tu nombre completo" maxLength={100} required />
                    <div className="retroalimentacion-invalida" id="error-nombre"></div>
                  </div>

                  <div className="grupo-formulario-registro">
                    <label htmlFor="email" className="etiqueta-formulario-registro">Correo Electrónico</label>
                    <input type="email" className="control-formulario-registro" id="email" name="email" placeholder="usuario@duoc.cl" maxLength={100} required />
                    <div className="texto-ayuda-formulario-registro">Solo se permiten: @duoc.cl, @profesor.duoc.cl, @gmail.com</div>
                    <div className="retroalimentacion-invalida" id="error-email"></div>
                  </div>

                  <div className="grupo-formulario-registro">
                    <label htmlFor="password" className="etiqueta-formulario-registro">Contraseña</label>
                    <input type="password" className="control-formulario-registro" id="password" name="password" minLength={6} maxLength={20} required />
                    <div className="retroalimentacion-invalida" id="error-password"></div>
                  </div>

                  <div className="grupo-formulario-registro">
                    <label htmlFor="confirmar_password" className="etiqueta-formulario-registro">Confirmar Contraseña</label>
                    <input type="password" className="control-formulario-registro" id="confirmar_password" name="confirmar_password" required />
                    <div className="retroalimentacion-invalida" id="error-confirmar"></div>
                  </div>

                  <div className="grupo-formulario-registro">
                    <div className="check-formulario-registro">
                      <input className="input-check-formulario-registro" type="checkbox" id="terminos" required />
                      <label className="etiqueta-check-formulario-registro" htmlFor="terminos">
                        Acepto los términos y condiciones y confirmo que soy mayor de 18 años
                      </label>
                      <div className="retroalimentacion-invalida">Debes aceptar los términos y condiciones</div>
                    </div>
                  </div>

                  <div className="acciones-formulario-registro">
                    <button type="submit" className="btn-registro-formulario" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Crear Cuenta</button>
                    <a href="/login" className="btn-login-formulario" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>¿Ya tienes cuenta? Inicia Sesión</a>
                  </div>
                </form>

                <div className="ayuda-formulario-registro">
                  <small className="texto-ayuda-registro">
                    Crea tu cuenta para acceder a ofertas exclusivas y descuentos especiales.
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
