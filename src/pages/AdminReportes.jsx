import { useState } from 'react';
import { FaDownload, FaCalendarAlt, FaChartBar, FaFileExcel, FaFilePdf } from 'react-icons/fa';

const AdminReportes = () => {
  const [reporteSeleccionado, setReporteSeleccionado] = useState('ventas');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [formato, setFormato] = useState('pdf');
  
  // Datos de ejemplo para los reportes
  const datosReporte = {
    ventas: [
      { mes: 'Enero', ventas: 1250000, ordenes: 45, promedio: 27778 },
      { mes: 'Febrero', ventas: 980000, ordenes: 38, promedio: 25789 },
      { mes: 'Marzo', ventas: 1450000, ordenes: 52, promedio: 27885 },
      { mes: 'Abril', ventas: 1100000, ordenes: 42, promedio: 26190 },
      { mes: 'Mayo', ventas: 1650000, ordenes: 58, promedio: 28448 },
      { mes: 'Junio', ventas: 1320000, ordenes: 47, promedio: 28085 },
    ],
    productos: [
      { producto: 'Consola PS5', cantidad: 28, ingresos: 13999920, categoria: 'Consolas' },
      { producto: 'Mando Xbox Series X', cantidad: 45, ingresos: 3599550, categoria: 'Accesorios' },
      { producto: 'Nintendo Switch OLED', cantidad: 22, ingresos: 6599980, categoria: 'Consolas' },
      { producto: 'Juego FIFA 23', cantidad: 37, ingresos: 2219963, categoria: 'Videojuegos' },
      { producto: 'Auriculares Gamer', cantidad: 31, ingresos: 1859969, categoria: 'Accesorios' },
    ],
    clientes: [
      { cliente: 'Juan Pérez', compras: 8, total: 1250000, ultimaCompra: '2023-05-15' },
      { cliente: 'María González', compras: 5, total: 987500, ultimaCompra: '2023-05-20' },
      { cliente: 'Carlos Rojas', compras: 12, total: 1850000, ultimaCompra: '2023-05-18' },
      { cliente: 'Ana Muñoz', compras: 3, total: 450000, ultimaCompra: '2023-04-30' },
      { cliente: 'Pedro Sánchez', compras: 7, total: 1100000, ultimaCompra: '2023-05-10' },
    ]
  };
  
  // Formatear moneda
  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(valor);
  };
  
  // Generar reporte
  const generarReporte = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para generar el reporte
    alert(`Generando reporte de ${reporteSeleccionado} en formato ${formato.toUpperCase()} para el período ${fechaInicio} al ${fechaFin}`);
  };
  
  // Obtener totales
  const obtenerTotales = (tipo) => {
    if (tipo === 'ventas') {
      const totalVentas = datosReporte.ventas.reduce((sum, item) => sum + item.ventas, 0);
      const totalOrdenes = datosReporte.ventas.reduce((sum, item) => sum + item.ordenes, 0);
      const promedio = totalVentas / totalOrdenes;
      return {
        totalVentas: formatearMoneda(totalVentas),
        totalOrdenes,
        promedio: formatearMoneda(promedio)
      };
    } else if (tipo === 'productos') {
      const totalIngresos = datosReporte.productos.reduce((sum, item) => sum + item.ingresos, 0);
      const totalProductos = datosReporte.productos.reduce((sum, item) => sum + item.cantidad, 0);
      return {
        totalIngresos: formatearMoneda(totalIngresos),
        totalProductos
      };
    } else {
      const totalCompras = datosReporte.clientes.reduce((sum, item) => sum + item.total, 0);
      const totalClientes = datosReporte.clientes.length;
      return {
        totalCompras: formatearMoneda(totalCompras),
        totalClientes
      };
    }
  };
  
  const totales = obtenerTotales(reporteSeleccionado);

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Reportes</h2>
      </div>

      <div className="row">

        <div className="col-12 mb-4">
          <div className="card h-100">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                {reporteSeleccionado === 'ventas' && 'Ventas por Período'}
                {reporteSeleccionado === 'productos' && 'Productos Más Vendidos'}
                {reporteSeleccionado === 'clientes' && 'Clientes Frecuentes'}
              </h5>
              <div className="dropdown">
                <button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                  Exportar
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><button className="dropdown-item" type="button"><FaFilePdf className="text-danger me-2" /> Exportar a PDF</button></li>
                  <li><button className="dropdown-item" type="button"><FaFileExcel className="text-success me-2" /> Exportar a Excel</button></li>
                </ul>
              </div>
            </div>
            <div className="card-body">
              {reporteSeleccionado === 'ventas' && (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Mes</th>
                        <th className="text-end">Ventas Totales</th>
                        <th className="text-center">Órdenes</th>
                        <th className="text-end">Ticket Promedio</th>
                      </tr>
                    </thead>
                    <tbody>
                      {datosReporte.ventas.map((item, index) => (
                        <tr key={index}>
                          <td className="fw-bold">{item.mes}</td>
                          <td className="text-end">{formatearMoneda(item.ventas)}</td>
                          <td className="text-center">{item.ordenes}</td>
                          <td className="text-end">{formatearMoneda(item.promedio)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {reporteSeleccionado === 'productos' && (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th className="text-center">Categoría</th>
                        <th className="text-center">Cantidad Vendida</th>
                        <th className="text-end">Ingresos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {datosReporte.productos.map((item, index) => (
                        <tr key={index}>
                          <td className="fw-bold">{item.producto}</td>
                          <td className="text-center">
                            <span className="badge bg-primary bg-opacity-10 text-primary">
                              {item.categoria}
                            </span>
                          </td>
                          <td className="text-center">{item.cantidad} unidades</td>
                          <td className="text-end">{formatearMoneda(item.ingresos)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {reporteSeleccionado === 'clientes' && (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Cliente</th>
                        <th className="text-center">Compras</th>
                        <th className="text-end">Total Gastado</th>
                        <th className="text-center">Última Compra</th>
                      </tr>
                    </thead>
                    <tbody>
                      {datosReporte.clientes.map((item, index) => (
                        <tr key={index}>
                          <td className="fw-bold">{item.cliente}</td>
                          <td className="text-center">{item.compras}</td>
                          <td className="text-end">{formatearMoneda(item.total)}</td>
                          <td className="text-center">
                            {new Date(item.ultimaCompra).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              

            </div>
          </div>
        </div>
        
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Resumen</h5>
            </div>
            <div className="card-body">
              {reporteSeleccionado === 'ventas' && (
                <div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="fw-semibold text-light">Total Ventas:</span>
                    <span className="fw-bold text-info fs-5">{totales.totalVentas}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="fw-semibold text-light">Total Órdenes:</span>
                    <span className="fw-bold text-info fs-5">{totales.totalOrdenes}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="fw-semibold text-light">Ticket Promedio:</span>
                    <span className="fw-bold text-info fs-5">{totales.promedio}</span>
                  </div>
                </div>
              )}
              
              {reporteSeleccionado === 'productos' && (
                <div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Total Ingresos:</span>
                    <span className="fw-bold">{totales.totalIngresos}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Total Productos:</span>
                    <span className="fw-bold">{totales.totalProductos}</span>
                  </div>
                </div>
              )}
              
              {reporteSeleccionado === 'clientes' && (
                <div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Total Compras:</span>
                    <span className="fw-bold">{totales.totalCompras}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Total Clientes:</span>
                    <span className="fw-bold">{totales.totalClientes}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminReportes;