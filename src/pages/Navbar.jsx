import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import '../css/globales.css'
import '../css/pagina-inicio.css'

function Navbar() {
    return (
        <header className="border-bottom border-secondary">
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid px-0">
                    <a className="navbar-brand d-flex align-items-center" href="/">
                        <img src="img/logo-level-Up.png" alt="Level-Up Gamer" width="50" height="50" className="me-2"/>
                        <span className="orbitron-font fs-3 text-neon">LEVEL-UP GAMER</span>
                    </a>

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item"><a className="nav-link active" href="/">Inicio</a></li>
                            <li className="nav-item"><a className="nav-link" href="/Productos">Productos</a></li>
                            <li className="nav-item"><a className="nav-link" href="/Categorias">Categorías</a></li>
                            <li className="nav-item"><a className="nav-link" href="/Ofertas">Ofertas</a></li>
                            <li className="nav-item"><a className="nav-link" href="/Nosotros">Nosotros</a></li>
                            <li className="nav-item"><a className="nav-link" href="/Blog">Blog</a></li>
                            <li className="nav-item"><a className="nav-link" href="/Contacto">Contacto</a></li>
                            <li className="nav-item"><a className="nav-link" href="/login">Acceder</a></li>
                            <li className="nav-item"><a className="nav-link" href="/registro">Registrarse</a></li>
                            <li className="nav-item">
                                <a className="btn btn-outline-neon position-relative" href="/carrito">
                                    🛒 Carrito <span className="position-absolute top-0 start-100 translate-middle badge bg-electric" id="cart-badge">0</span>
                                </a>
                            </li>
                        </ul>

                    </div>
                </div>
            </nav>
        </header>
    )

}
export default Navbar;