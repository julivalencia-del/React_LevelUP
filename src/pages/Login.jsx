import React, { useEffect } from 'react' 
import '../css/globales.css'
import '../css/pagina-formularios.css'

export default function Login() {
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
            ; (async () => {
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
                <a href="/Admin">Admin</a>
            </div>

            <main className="contenedor-formulario-login">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-6 col-lg-5">
                            <div className="formulario-login">
                                <div className="encabezado-formulario-login">
                                    <div className="">
                                        <div className="circulo-logo">

                                            <img src="img/logo-level-Up.png" alt="Level-Up Gamer" />
                                        </div>
                                    </div>
                                    <h2 className="titulo-formulario-login">INICIAR SESIÓN</h2>
                                    <p className="subtitulo-formulario-login">Ingresa tus credenciales para acceder</p>
                                </div>

                                <form id="form-login" noValidate method="post">
                                    <div className="grupo-formulario-login">
                                        <label htmlFor="email" className="etiqueta-formulario-login">Correo Electrónico</label>
                                        <input type="email" className="control-formulario-login"
                                            id="email" name="email" placeholder="usuario@duoc.cl" required />
                                        <div className="texto-ayuda-formulario-login">Solo se permiten: @duoc.cl, @profesor.duoc.cl, @gmail.com</div>
                                        <div className="retroalimentacion-invalida" id="error-email"></div>
                                    </div>

                                    <div className="grupo-formulario-login">
                                        <label htmlFor="password" className="etiqueta-formulario-login">Contraseña</label>
                                        <input type="password" className="control-formulario-login"
                                            id="password" name="password" required />
                                        <div className="retroalimentacion-invalida" id="error-password"></div>
                                    </div>

                                    <div className="accion-formulario-login">
                                        <button type="submit" className="btn-login-formulario" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Ingresar</button>
                                        <a href="registro.html" className="btn-registro-formulario" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>¿No tienes cuenta? Regístrate</a>
                                    </div>
                                    <div className="ayuda-formulario-login">
                                        <small className="texto-ayuda-login">
                                            Demo: admin@duoc.cl / admin123<br />
                                            Cliente: cliente@gmail.com / cliente123
                                        </small>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}