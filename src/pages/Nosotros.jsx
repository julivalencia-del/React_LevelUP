import '../css/globales.css'
import '../css/pagina-nosotros.css'
import { useEffect } from 'react'

function Nosotros() {
    useEffect(() => {
        document.body.classList.add('pagina-nosotros')
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
        return () => document.body.classList.remove('pagina-nosotros')
    }, [])
    return (
        <> 
            <div className="acciones-container" style={{ display: 'none' }}></div>

            <div className="sidebar-admin" id="sidebar-admin" style={{ display: 'none' }}>
                <a href="/admin">Admin</a>
            </div>

            <main className="contenedor-nosotros pagina-nosotros">
                <div className="container">
                    <section className="hero-nosotros">
                        <h1 className="titulo-hero-nosotros">SOBRE NOSOTROS</h1>
                        <p className="subtitulo-hero-nosotros">Tu tienda gamer de confianza en Chile</p>
                    </section>

                    <section className="seccion-quienes-somos">
                        <div className="row align-items-center">
                            <div className="col-lg-6">
                                <h2 className="titulo-quienes-somos">¿Quiénes Somos?</h2>
                                <div className="contenido-quienes-somos">
                                    <p className="parrafo-quienes-somos">En Level-Up Gamer nos apasionan los videojuegos y todo lo relacionado con el entretenimiento digital. Somos un equipo de entusiastas que busca ofrecerte los mejores productos para tu experiencia de juego.</p>
                                    <p className="parrafo-quienes-somos">Nuestra misión es simple: proporcionar productos de calidad a precios justos, con un servicio al cliente excepcional y envíos rápidos a todo Chile.</p>
                                </div>
                                <div className="estadisticas-nosotros">
                                    <div className="estadistica-nosotros">
                                        <h3 className="numero-estadistica">+5.000</h3>
                                        <p className="texto-estadistica">Clientes satisfechos</p>
                                    </div>
                                    <div className="estadistica-nosotros">
                                        <h3 className="numero-estadistica">+500</h3>
                                        <p className="texto-estadistica">Productos en stock</p>
                                    </div>
                                    <div className="estadistica-nosotros">
                                        <h3 className="numero-estadistica">100%</h3>
                                        <p className="texto-estadistica">Garantía</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="imagen-nosotros">
                                    <img src="/img/logo-level-Up.png" alt="Nuestra tienda Level-Up Gamer" />
                                    <div className="overlay-imagen-nosotros">
                                        <h4 className="titulo-overlay">Bienvenidos a Level-Up Gamer</h4>
                                        <p className="subtitulo-overlay">Tu destino definitivo para el gaming en Chile</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="servicios-nosotros">
                        <h2 className="titulo-servicios-nosotros">NUESTROS SERVICIOS</h2>
                        <div className="grid-servicios-nosotros">
                            <div className="servicio-nosotros">
                                <h4 className="titulo-servicio-nosotros">Venta de Productos</h4>
                                <p className="descripcion-servicio-nosotros">Ofrecemos consolas, juegos, accesorios y componentes para PC al mejor precio del mercado.</p>
                            </div>
                            <div className="servicio-nosotros">
                                <h4 className="titulo-servicio-nosotros">Soporte Técnico</h4>
                                <p className="descripcion-servicio-nosotros">Servicio técnico especializado en consolas y equipos de gaming.</p>
                            </div>
                            <div className="servicio-nosotros">
                                <h4 className="titulo-servicio-nosotros">Asesoría Personalizada</h4>
                                <p className="descripcion-servicio-nosotros">Te ayudamos a elegir el equipo perfecto según tus necesidades.</p>
                            </div>
                        </div>
                    </section>

                    <section className="ubicacion-nosotros">
                        <h2 className="titulo-ubicacion-nosotros">ENCUÉNTRANOS</h2>
                        <p className="subtitulo-ubicacion-nosotros">Visita nuestra sede DUOC UC - Padre Alonso de Ovalle, Santiago Centro</p>
                        <div className="mapa-nosotros">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.117039981882!2d-70.6521513847926!3d-33.44639398077531!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662c5a6b0c7d4a1%3A0x8e8a3a2b7b5f5e2d!2sDuoc%20UC%3A%20Sede%20Padre%20Alonso%20de%20Ovalle!5e0!3m2!1ses-419!2scl!4v1678886400000!5m2!1ses-419!2scl" 
                                width="100%"
                                height="450"
                                
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                            <div className="info-mapa-nosotros">
                                <div className="row">
                                    <div className="col-md-6">
                                        <h5 className="titulo-info-nosotros">Horario de Atención</h5>
                                        <p className="info-nosotros">Lunes a Viernes: 10:00 - 20:00 hrs</p>
                                        <p className="info-nosotros">Sábado: 11:00 - 19:00 hrs</p>
                                    </div>
                                    <div className="col-md-6 text-md-end">
                                        <h5 className="titulo-info-nosotros">Dirección</h5>
                                        <p className="info-nosotros">Padre Alonso de Ovalle 1586, Santiago Centro<br />Región Metropolitana, Chile</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}
export default Nosotros;