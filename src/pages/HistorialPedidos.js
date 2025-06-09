import { useEffect, useState } from 'react';
import axios from 'axios';

const HistorialPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [orden, setOrden] = useState('recientes'); // recientes o antiguos
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/pedidos/historial", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPedidos(response.data);
      } catch (err) {
        console.error("Error al obtener historial:", err);
      }
    };

    fetchHistorial();
  }, [token]);

  const agruparPorPedido = () => {
    const agrupado = {};
    pedidos.forEach(item => {
      if (!agrupado[item.id_pedido]) {
        agrupado[item.id_pedido] = {
          fecha: item.fecha_pedido,
          estado: item.estado,
          total: Number(item.total || 0),
          productos: []
        };
      }
      agrupado[item.id_pedido].productos.push(item);
    });

    let resultado = Object.entries(agrupado);
    resultado.sort((a, b) => {
      const fechaA = new Date(a[1].fecha);
      const fechaB = new Date(b[1].fecha);
      return orden === 'recientes' ? fechaB - fechaA : fechaA - fechaB;
    });

    return resultado;
  };

  const historialOrdenado = agruparPorPedido();

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Historial de Compras</h1>

      {pedidos.length === 0 ? (
        <p className="text-center text-gray-600 mt-10">
          Aún no cuentas con compras dentro de nuestra página,<br />
          pero siempre estará la opción de comprar algún buen producto. <br />
          <strong>¡Te esperamos!</strong> 🙂
        </p>
      ) : (
        <>
          <div className="mb-4">
            <label className="text-sm font-semibold mr-2">Ordenar por fecha:</label>
            <select
              value={orden}
              onChange={e => setOrden(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="recientes">Más recientes primero</option>
              <option value="antiguos">Más antiguos primero</option>
            </select>
          </div>

          {historialOrdenado.map(([id, pedido], index) => {
            const numeroPedido = orden === 'recientes'
              ? historialOrdenado.length - index
              : index + 1;

            return (
              <div key={id} className="border rounded shadow p-4 mb-6 bg-white">
                <div className="mb-2 text-sm text-gray-600">
                  <strong>Pedido #{numeroPedido}</strong> - {new Date(pedido.fecha).toLocaleDateString()} - <em>{pedido.estado}</em>
                </div>
                <div className="space-y-2">
                  {pedido.productos.map((producto, idx) => (
                    <div key={idx} className="flex gap-4 items-center border-b pb-2">
                      <img src={producto.imagen_url} alt={producto.nombre} className="w-16 h-16 object-contain" />
                      <div className="flex-1">
                        <h3 className="font-semibold">{producto.nombre}</h3>
                        <p>Cantidad: {producto.cantidad}</p>
                        <p>Precio unitario: ${Number(producto.precio_unitario || 0).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 font-bold text-right">
                  Total: ${Number(pedido.total || 0).toFixed(2)}
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default HistorialPedidos;
