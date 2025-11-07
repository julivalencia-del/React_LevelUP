import { useState } from 'react'
import './App.css'
import Navbar from './pages/Navbar'
import Footer from './pages/Footer'
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet } from 'react-router-dom'
import Home from './pages/Home'
import Contacto from './pages/Contacto'
import Nosotros from './pages/Nosotros'
import Blog from './pages/Blog'
import Productos from './pages/Productos'
import Formulario from './pages/Formulario'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Carrito from './pages/Carrito'
import DetalleProducto from './pages/DetalleProducto'
import Categorias from './pages/Categorias'
import Ofertas from './pages/Ofertas'
import Checkout from './pages/Checkout'
import CompraExitosa from './pages/CompraExitosa'
import CompraError from './pages/CompraError'
import AdminLayout from './components/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProductos from './pages/AdminProductos'
import AdminUsuarios from './pages/AdminUsuarios'
import AdminOrdenes from './pages/AdminOrdenes'
import AdminCategorias from './pages/AdminCategorias'
import AdminReportes from './pages/AdminReportes'
import AdminPerfil from './pages/AdminPerfil'

function AppLayout() {
  const location = useLocation()
  const path = (location.pathname || '').toLowerCase()
  const isAdminRoute = path.startsWith('/admin')
  const hideChrome = isAdminRoute || path.startsWith('/carrito')
  
  return (
    <>
      {!hideChrome && <Navbar/>}
      <main>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/contacto" element={<Contacto/>} />
          <Route path="/Nosotros" element={<Nosotros/>} />
          <Route path="/Blog" element={<Blog/>} />
          <Route path="/Productos" element={<Productos/>}/>
          <Route path="/Categorias" element={<Categorias/>}/>
          <Route path="/Ofertas" element={<Ofertas/>}/>
          <Route path="/Checkout" element={<Checkout/>}/>
          <Route path="/CompraExitosa" element={<CompraExitosa/>}/>
          <Route path="/CompraError" element={<CompraError/>}/>
          <Route path="/Formulario" element={<Formulario/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/registro" element={<Registro/>}/>
          <Route path="/carrito" element={<Carrito/>}/>
          <Route path="/producto/:id" element={<DetalleProducto/>}/>
          
          {/* Rutas del panel de administración */}
          <Route path="/admin" element={<AdminLayout><Outlet/></AdminLayout>}>
            <Route index element={<AdminDashboard />} />
            <Route path="productos" element={<AdminProductos />} />
            <Route path="usuarios" element={<AdminUsuarios />} />
            <Route path="ordenes" element={<AdminOrdenes />} />
            <Route path="categorias" element={<AdminCategorias />} />
            <Route path="reportes" element={<AdminReportes />} />
            <Route path="perfil" element={<AdminPerfil />} />
          </Route>
        </Routes>
      </main>
      {!hideChrome && <Footer/>}
    </>
  )
}

export default function App(){
  return (
    <Router>
      <AppLayout/>
    </Router>
  )
}
