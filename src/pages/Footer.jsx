import '../css/globales.css'
function Footer() {
  return (
    <footer className="pie-pagina-inicio">
      <div className="container-fluid px-0">
        <div className="row">
          <div className="col-md-4">
            <h5 className="texto-logo-admin">LEVEL-UP GAMER</h5>
            <p className="contenido-pie-inicio">Tu tienda gamer de confianza en Chile.</p>
          </div>
          <div className="col-md-4">
            <h6>Enlaces Rápidos</h6>
            <ul className="list-unstyled">
              <li><a href="/Productos" className="enlace-footer">Productos</a></li>
              <li><a href="/Nosotros" className="enlace-footer">Nosotros</a></li>
              <li><a href="/contacto" className="enlace-footer">Contacto</a></li>
            </ul>
          </div>
          <div className="col-md-4">
            <h6>Contacto</h6>
            <p>contacto@levelupgamer.cl<br />+56 9 1234 5678</p>
          </div>
        </div>
        <div className="text-center mt-3 pt-3 borde-footer">
          <small>© {new Date().getFullYear()} Level-Up Gamer. Todos los derechos reservados.</small>
        </div>
      </div>
    </footer>


  );
}
export default Footer;