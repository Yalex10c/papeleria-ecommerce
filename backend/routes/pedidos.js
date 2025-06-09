import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [detalles, setDetalles] = useState({});
  const navigate = useNavigate();

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

  const cambiarEstado = async (id_pedido, nuevoEstado) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/pedidos/admin/${id_pedido}/estado`,
        { estado: nuevoEstado },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchPedidos(); // recarga el listado
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  const toggleDetalle = async (id_pedido) => {
    if (detalles[id_pedido]) {
      setDetalles((prev) => ({ ...prev, [id_pedido]: null }));
    } else {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/pedidos/admin/${id_pedido}/detalle`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDetalles((prev) => ({ ...prev, [id_pedido]: res.data }));
      } catch (error) {
        console.error('Error al obtener detalle del pedido:', error);
      }
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
          <table className="min-w-full table-auto mb-8">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Usuario</th>
                <th className="px-4 py-2">Destinatario</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Estado</th>
                <th className="px-4 py-2">Fecha</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <React.Fragment key={pedido.id_pedido}>
                  <tr className="text-center border-b">
                    <td className="px-4 py-2">{pedido.id_pedido}</td>
                    <td className="px-4 py-2">{pedido.nombre_usuario}</td>
                    <td className="px-4 py-2">{pedido.nombre_destinatario}</td>
                    <td className="px-4 py-2">
                      ${Number(pedido.total || 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-2">
                      <select
                        value={pedido.estado}
                        onChange={(e) => cambiarEstado(pedido.id_pedido, e.target.value)}
                        className="border rounded p-1 text-sm"
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="enviado">Enviado</option>
                        <option value="entregado">Entregado</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                    </td>
                    <td className="px-4 py-2">{new Date(pedido.fecha_pedido).toLocaleString()}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => toggleDetalle(pedido.id_pedido)}
                        className="bg-gray-300 hover:bg-gray-400 px-2 py-1 text-sm rounded"
                      >
                        {detalles[pedido.id_pedido] ? 'Ocultar' : 'Ver productos'}
                      </button>
                    </td>
                  </tr>

                  {detalles[pedido.id_pedido] && (
                    <tr>
                      <td colSpan="7" className="px-4 py-2 bg-gray-50">
                        <div className="space-y-2">
                          {detalles[pedido.id_pedido].map((producto, index) => (
                            <div key={index} className="flex items-center gap-4 border-b py-2">
                              <img
                                src={producto.imagen_url}
                                alt={producto.nombre}
                                className="w-12 h-12 object-contain"
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
