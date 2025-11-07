import { useEffect } from "react"
import '../css/globales.css'
import '../css/pagina-productos.css'
const Productos=() => {
    useEffect(() => {
        document.body.classList.add('pagina-productos');
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
            await loadOnce('https://cdn.jsdelivr.net/npm/sweetalert2@11')
            await loadOnce('/js/validaciones.js');
            if (!window._legacyAppLoaded) {
                await loadOnce('/js/app.js');
                window._legacyAppLoaded = true;
            }
            if (document.readyState !== 'loading') {
                document.dispatchEvent(new Event('DOMContentLoaded'));
            }
        })();
        return () => {
            document.body.classList.remove('pagina-productos');
        };
    }, []);
    return (
        <>
            <div className="acciones-container" style={{display: 'none'}}></div>


            <div className="sidebar-admin" id="sidebar-admin" style={{display: 'none'}}>
                <a href="/admin">Admin</a>
            </div>

            <main className="container-fluid px-0 py-4">
                <h1 className="titulo-hero-productos">CATÁLOGO DE PRODUCTOS</h1>


                <div className="contenedor-filtros-productos">
                    <div className="fila-filtros-productos">
                        <div className="grupo-filtro-productos">
                            <label htmlFor="filtro-categoria" className="etiqueta-filtro-productos">Filtrar por categoría:</label>
                            <select className="select-filtro-productos" id="filtro-categoria">
                                <option value="">Todas las categorías</option>
                                <option value="Consolas">Consolas</option>
                                <option value="Computadores Gamers">Computadores Gamers</option>
                                <option value="Accesorios">Accesorios</option>
                                <option value="Sillas Gamers">Sillas Gamers</option>
                                <option value="Juegos de Mesa">Juegos de Mesa</option>
                            </select>
                        </div>
                        <div className="grupo-filtro-productos">
                            <label htmlFor="filtro-precio" className="etiqueta-filtro-productos">Filtrar por precio:</label>
                            <select className="select-filtro-productos" id="filtro-precio">
                                <option value="">Todos los precios</option>
                                <option value="0-50000">Hasta $50.000</option>
                                <option value="50000-200000">$50.000 - $200.000</option>
                                <option value="200000-500000">$200.000 - $500.000</option>
                                <option value="500000+">Más de $500.000</option>
                            </select>
                        </div>
                        <div className="grupo-filtro-productos">
                            <label htmlFor="busqueda" className="etiqueta-filtro-productos">Buscar producto:</label>
                            <input type="text" className="input-filtro-productos" id="busqueda" placeholder="Nombre del producto..." />
                        </div>
                    </div>
                </div>


                <div className="grid-productos-productos" id="lista-productos">

                </div>
            </main>
        </>
    )
}
export default Productos;