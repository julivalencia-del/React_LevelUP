import { useEffect } from "react";
import '../css/globales.css'
import '../css/pagina-inicio.css'
const Home=() => {
    useEffect(() => {
        // Aplicar estilos de página de inicio
        document.body.classList.add('pagina-inicio');
        const loadOnce = (src) => new Promise((resolve) => {
            const exist = document.querySelector(`script[src='${src}']`);
            if (exist) return resolve('exists');
            const sc = document.createElement('script');
            sc.src = src;
            sc.async = true;
            sc.onload = () => resolve('loaded');
            document.body.appendChild(sc);
        });

        (async () => {
            await loadOnce('https://cdn.jsdelivr.net/npm/sweetalert2@11');
            // 1) validaciones primero (si existe)
            await loadOnce('/js/validaciones.js');

            // 2) app.js solo una vez por sesión SPA
            if (!window._legacyAppLoaded) {
                const res = await loadOnce('/js/app.js');
                console.log(res === 'loaded' ? 'Script Cargado' : 'Script No Cargado');
                window._legacyAppLoaded = true;
            } else {
                console.log('Script No Cargado');
            }

            // 3) Forzar inicialización si el DOM ya cargó
            if (document.readyState !== 'loading') {
                document.dispatchEvent(new Event('DOMContentLoaded'));
            }
        })();
        return () => {
            document.body.classList.remove('pagina-inicio');
        };
    }, []);
    return (
        <div>

            <div className="acciones-container" style={{ display: 'none' }}></div>


            <div className="sidebar-admin" id="sidebar-admin" style={{ display: 'none' }}>
                <a href="/admin">Admin</a>
            </div>


            <section className="seccion-hero-inicio">
                <div className="container-fluid px-0">
                    <div className="row align-items-center gx-0">
                        <div className="col-lg-6">
                            <h1 className="titulo-hero-inicio">LEVEL-UP GAMER</h1>
                            <p className="subtitulo-hero-inicio">Tu destino definitivo para todo lo gaming en Chile. Desde consolas de última generación hasta periféricos de alto rendimiento.</p>
                            <p className="subtitulo-hero-inicio">Conectamos a la comunidad gamer con los mejores productos y experiencias.</p>
                            <div className="botones-hero">
                                <a href="/Productos" className="btn-catalogo-inicio">Ver Catálogo</a>
                                <a href="/Nosotros" className="btn-nosotros-inicio">Conócenos</a>
                            </div>
                        </div>
                        <div className="col-lg-6">

                            <div className="imagen-hero-inicio">
                                <img src="/img/logo-level-Up.png" alt="Level-Up Gamer"/>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <section className="seccion-categorias-inicio">
                <div className="container-fluid px-0">
                    <h2 className="titulo-categorias-inicio">CATEGORÍAS DESTACADAS</h2>

                    <div className="grid-categorias-inicio">

                        <div className="tarjeta-categoria-inicio">
                            <h3 className="titulo-categoria-inicio">CONSOLAS</h3>
                            <p className="descripcion-categoria-inicio">PlayStation, Xbox, Nintendo Switch y más. Las últimas consolas de nueva generación para una experiencia gaming incomparable.</p>
                            <a href="/Productos?categoria=consolas" className="btn btn-outline-light">Ver Consolas</a>
                        </div>


                        <div className="tarjeta-categoria-inicio">
                            <h3 className="titulo-categoria-inicio">PC GAMER</h3>
                            <p className="descripcion-categoria-inicio">Equipos de alto rendimiento, componentes y accesorios para armar tu setup definitivo.</p>
                            <a href="/Productos?categoria=computadores" className="btn btn-outline-light">Ver PCs</a>
                        </div>


                        <div className="tarjeta-categoria-inicio">
                            <h3 className="titulo-categoria-inicio">ACCESORIOS</h3>
                            <p className="descripcion-categoria-inicio">Headsets, teclados, mouse, mousepads y más. Mejora tu experiencia con los mejores periféricos.</p>
                            <a href="/Productos?categoria=accesorios" className="btn btn-outline-light">Ver Accesorios</a>
                        </div>
                    </div>
                </div>
            </section>


            <section className="productos-destacados-inicio">
                <div className="container-fluid px-0">
                    <h2 className="titulo-seccion">PRODUCTOS DESTACADOS</h2>

                    <div className="grid-productos-inicio" id="productos-destacados">

                    </div>

                    <div className="text-center mt-4">
                        <a href="/Productos" className="btn btn-outline-light">Ver Todos los Productos</a>
                    </div>
                </div>
            </section>

        </div>
    );
}
export default Home;