import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [productosPorPedido, setProductosPorPedido] = useState({});
  const [estadoEditando, setEstadoEditando] = useState({});
  const navigate = useNavigate();

  // Obtener pedidos al cargar
  const fetchPedidos = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/pedidos/admin', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPedidos(res.data);
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  // Guardar cambio de estado
  const cambiarEstado = async (id_pedido) => {
    try {
      const nuevoEstado = estadoEditando[id_pedido];
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/pedidos/admin/${id_pedido}/estado`,
        { estado: nuevoEstado },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchPedidos();
    } catch (err) {
      console.error('Error al cambiar estado:', err);
    }
  };

  // Ver productos por pedido
  const verProductos = async (id_pedido) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/pedidos/admin/${id_pedido}/detalle`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProductosPorPedido((prev) => ({
        ...prev,
        [id_pedido]: res.data,
      }));
    } catch (error) {
      console.error('Error al obtener detalle de productos:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Pedidos</h1>
        <button
          onClick={() => navigate('/admin')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Regresar al Panel
        </button>
      </header>

      <section className="bg-white p-6 rounded shadow">
        {pedidos.length === 0 ? (
          <p className="text-gray-500">No hay pedidos registrados.</p>
        ) : (
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-2 py-2">ID</th>
                <th className="px-2 py-2">Usuario</th>
                <th className="px-2 py-2">Destinatario</th>
                <th className="px-2 py-2">Total</th>
                <th className="px-2 py-2">Estado</th>
                <th className="px-2 py-2">Fecha</th>
                <th className="px-2 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <React.Fragment key={pedido.id_pedido}>
                  <tr className="text-center border-b">
                    <td className="px-2 py-2">{pedido.id_pedido}</td>
                    <td className="px-2 py-2">{pedido.nombre_usuario}</td>
                    <td className="px-2 py-2">{pedido.nombre_destinatario}</td>
                    <td className="px-2 py-2">${Number(pedido.total).toFixed(2)}</td>
                    <td className="px-2 py-2">
                      <select
                        value={estadoEditando[pedido.id_pedido] || pedido.estado}
                        onChange={(e) =>
                          setEstadoEditando({
                            ...estadoEditando,
                            [pedido.id_pedido]: e.target.value,
                          })
                        }
                        className="border px-1 py-1 rounded"
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="procesado">Procesado</option>
                        <option value="enviado">Enviado</option>
                        <option value="entregado">Entregado</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                      <button
                        onClick={() => cambiarEstado(pedido.id_pedido)}
                        className="ml-2 text-sm bg-green-500 text-white px-2 py-1 rounded"
                      >
                        Guardar
                      </button>
                    </td>
                    <td className="px-2 py-2">{new Date(pedido.fecha_pedido).toLocaleString()}</td>
                    <td className="px-2 py-2">
                      <button
                        onClick={() => verProductos(pedido.id_pedido)}
                        className="text-blue-600 hover:underline"
                      >
                        Ver productos
                      </button>
                    </td>
                  </tr>

                  {productosPorPedido[pedido.id_pedido] && (
                    <tr className="bg-gray-50">
                      <td colSpan="7" className="px-4 py-2">
                        <div className="space-y-2">
                          {productosPorPedido[pedido.id_pedido].map((producto, index) => (
                            <div key={index} className="flex items-center gap-4 border-b pb-2">
                              <img
                                src={producto.imagen_url}
                                alt={producto.nombre}
                                className="w-16 h-16 object-contain"
                              />
                              <div>
                                <p className="font-semibold">{producto.nombre}</p>
                                <p>Cantidad: {producto.cantidad}</p>
                                <p>Precio unitario: ${Number(producto.precio_unitario).toFixed(2)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default AdminPedidos;
