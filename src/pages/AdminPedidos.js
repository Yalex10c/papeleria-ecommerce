import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/pedidos/admin', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPedidos(res.data);
      } catch (error) {
        console.error('Error al obtener pedidos:', error);
      }
    };

    fetchPedidos();
  }, []);

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
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Usuario</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Estado</th>
                <th className="px-4 py-2">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.id_pedido} className="text-center border-b">
                  <td className="px-4 py-2">{pedido.id_pedido}</td>
                  <td className="px-4 py-2">{pedido.id_usuario}</td>
                  <td className="px-4 py-2">${pedido.total.toFixed(2)}</td>
                  <td className="px-4 py-2 capitalize">{pedido.estado}</td>
                  <td className="px-4 py-2">{new Date(pedido.fecha_pedido).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default AdminPedidos;
