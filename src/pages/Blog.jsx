import '../css/pagina-blogs.css'
import '../css/globales.css'
import { useEffect } from 'react'

function Blog() {
    useEffect(() => {
        // Opcional: clase de página de blogs si el CSS la usa
        document.body.classList.add('pagina-blogs')
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
        return () => document.body.classList.remove('pagina-blogs')
    }, [])

    return (
        <>
            <div className="acciones-container" style={{ display: 'none' }}></div>

            <div className="sidebar-admin" id="sidebar-admin" style={{ display: 'none' }}>
                <a href="/admin">Admin</a>
            </div>

            <main className="contenedor-blogs">
                <div className="container">
                    <header className="hero-blogs">
                        <h1 className="titulo-hero-blogs">BLOG GAMER</h1>
                        <p className="subtitulo-hero-blogs">Noticias y artículos sobre videojuegos</p>
                    </header>


                    <div className="grid-articulos-blogs">
                        
                        <div className="tarjeta-articulo-blogs">
                            
                            <img src="img/2024-games.webp" className="imagen-articulo-blogs" alt="Juegos 2024" />
                            <div className="contenido-articulo-blogs">
                                <h5 className="titulo-articulo-blogs">Los juegos más esperados del 2024</h5>
                                <p className="descripcion-articulo-blogs">Descubre los lanzamientos más esperados del próximo año en el mundo de los videojuegos.</p>
                                <button type="button" className="btn btn-outline-light btn-sm btn-leer-mas" data-articulo="a1" data-bs-toggle="modal" data-bs-target="#modalBlog">Leer más</button>
                            </div>
                        </div>

                        <div className="tarjeta-articulo-blogs">
                            <img src="img/armadopc.webp" className="imagen-articulo-blogs" alt="PC Gamer" />
                            <div className="contenido-articulo-blogs">
                                <h5 className="titulo-articulo-blogs">Guía para armar tu PC gamer</h5>
                                <p className="descripcion-articulo-blogs">Aprende a armar tu propia PC gamer con esta guía paso a paso para principiantes.</p>
                                <button type="button" className="btn btn-outline-light btn-sm btn-leer-mas" data-articulo="a2" data-bs-toggle="modal" data-bs-target="#modalBlog">Leer más</button>
                            </div>
                        </div>

                        <div className="tarjeta-articulo-blogs">
                            <img src="img/juego-del-año.webp" className="imagen-articulo-blogs" alt="Juego del año" />
                            <div className="contenido-articulo-blogs">
                                <h5 className="titulo-articulo-blogs">Reseña del juego del año</h5>
                                <p className="descripcion-articulo-blogs">Analizamos el último lanzamiento que tiene a todos los jugadores hablando.</p>
                                <button type="button" className="btn btn-outline-light btn-sm btn-leer-mas" data-articulo="a3" data-bs-toggle="modal" data-bs-target="#modalBlog">Leer más</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Modal Blog para 'Leer más' */}
            <div className="modal fade" id="modalBlog" tabIndex="-1" aria-hidden="true">
              <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content bg-dark text-light">
                  <div className="modal-header">
                    <h5 className="modal-title" id="modalBlogTitulo">Artículo</h5>
                    <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    <div id="modalBlogContenido"></div>
                  </div>
                </div>
              </div>
            </div>
        </>
    )
}
export default Blog;