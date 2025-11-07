import '../css/globales.css'
import '../css/pagina-formularios.css'
import { useEffect } from 'react'

function Contacto() {
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
        return () => {
            document.body.classList.remove('pagina-formularios')
        }
    }, [])
    return (
        <div className="contenedor-contacto">

            <div className="acciones-container" style={{ display: 'none' }}></div>


            <div className="sidebar-admin" id="sidebar-admin" style={{ display: 'none' }}>
                <a href="/admin">Admin</a>
            </div>

            <div className="container-fluid px-0">

                <section className="seccion-hero-contacto">
                    <h1 className="titulo-hero-contacto">CONTÁCTANOS</h1>
                    <p className="subtitulo-hero-contacto">¿Tienes alguna pregunta? Estamos aquí para ayudarte</p>
                </section>

                <div className="row justify-content-center gx-0">

                    <div className="col-lg-6 px-3 px-lg-4">
                        <div className="formulario-contacto">
                            <div className="encabezado-formulario-contacto">
                                <h2 className="titulo-formulario-contacto">Escríbenos</h2>
                            </div>
                            <form id="form-contacto" className="needs-validation" noValidate>
                                <div className="grupo-formulario-contacto">
                                    <label htmlFor="nombre" className="etiqueta-formulario-contacto">Nombre completo</label>
                                    <input type="text" className="control-formulario-contacto" id="nombre" required />
                                    <div className="retroalimentacion-invalida">

                                    </div>
                                </div>
                                <div className="grupo-formulario-contacto">
                                    <label htmlFor="email" className="etiqueta-formulario-contacto">Correo electrónico</label>
                                    <input type="email" className="control-formulario-contacto" id="email" required />
                                    <div className="retroalimentacion-invalida">

                                    </div>
                                </div>
                                <div className="grupo-formulario-contacto">
                                    <label htmlFor="asunto" className="etiqueta-formulario-contacto">Asunto</label>
                                    <input type="text" className="control-formulario-contacto" id="asunto" required />
                                </div>
                                <div className="grupo-formulario-contacto">
                                    <label htmlFor="mensaje" className="etiqueta-formulario-contacto">Mensaje</label>
                                    <textarea className="control-formulario-contacto" id="mensaje" rows="4" required></textarea>
                                    <div className="retroalimentacion-invalida">

                                    </div>
                                </div>
                                <button type="submit" className="btn-enviar-contacto">Enviar Mensaje</button>
                            </form>

                        </div>
                    </div>
                </div>

                <div className="mapa-contacto">
                    <div className="encabezado-mapa-contacto">
                        <h2 className="titulo-mapa-contacto">Visítanos en Duoc UC Sede Padre Alonso de Ovalle</h2>
                    </div>
                    <div className="contenedor-mapa-contacto container-fluid px-0">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.1234567890123!2d-70.64878728480063!3d-33.45678901234567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662c5a3f2b4b3c1%3A0x1c1c6e1b5e1b5e1b5!2sDuoc%20UC%20Sede%20Padre%20Alonso%20de%20Ovalle!5e0!3m2!1ses!2scl!4v1234567890123!5m2!1ses!2scl"
                            width="100%"
                            height="400"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            className="mapa-contacto">
                        </iframe>

                    </div>
                    <div className="pie-mapa-contacto">
                        <div className="row">
                            <div className="col-md-6">
                                <h5 className="titulo-info-contacto">Dirección</h5>
                                <p className="info-contacto">Padre Alonso de Ovalle 1586, Santiago</p>
                                <p className="info-contacto">Región Metropolitana, Chile</p>
                            </div>
                            <div className="col-md-6 text-md-end">
                                <h5 className="titulo-info-contacto">Horario de Atención</h5>
                                <p className="info-contacto">Lunes a Viernes: 10:00 - 20:00 hrs</p>
                                <p className="info-contacto">Sábado: 11:00 - 19:00 hrs</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Contacto;