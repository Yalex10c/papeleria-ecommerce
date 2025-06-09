import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Cart() {
  const [carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0);
  const [holdTimeout, setHoldTimeout] = useState(null);
  const [holdProgress, setHoldProgress] = useState(0);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCarrito = async () => {
      try {
        if (!token) return;
        const response = await axios.get("http://localhost:5000/api/carrito", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const productos = response.data.map(p => ({
          ...p,
          cantidad: p.cantidad || 1,
        }));
        setCarrito(productos);
      } catch (error) {
        console.error("Error al obtener el carrito:", error);
      }
    };

    fetchCarrito();
  }, [token]);

  useEffect(() => {
    const nuevoTotal = carrito.reduce(
      (acc, p) => acc + Number(p.precio) * p.cantidad,
      0
    );
    setTotal(nuevoTotal);
  }, [carrito]);

  const actualizarCantidad = async (id_producto, nuevaCantidad) => {
    try {
      await axios.put(`http://localhost:5000/api/carrito/${id_producto}`, {
        cantidad: nuevaCantidad,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const response = await axios.get("http://localhost:5000/api/carrito", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCarrito(response.data);
    } catch (error) {
      console.error('Error al actualizar cantidad:', error);
    }
  };

  const incrementarCantidad = (index) => {
    const producto = carrito[index];
    actualizarCantidad(producto.id_producto, producto.cantidad + 1);
  };

  const decrementarCantidad = (index) => {
    const producto = carrito[index];
    if (producto.cantidad > 1) {
      actualizarCantidad(producto.id_producto, producto.cantidad - 1);
    }
  };


  const startHold = () => {
    let progress = 0;
    setHoldProgress(0);
    const interval = setInterval(() => {
      progress += 10;
      setHoldProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setHoldTimeout(null);
        setHoldProgress(0);
        navigate("/checkout");
      }
    }, 100);
    setHoldTimeout(interval);
  };

  const endHold = () => {
    if (holdTimeout) {
      clearInterval(holdTimeout);
      setHoldTimeout(null);
      setHoldProgress(0);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Resumen del Carrito</h2>

      {carrito.length === 0 ? (
        <p className="text-gray-600">Tu carrito está vacío.</p>
      ) : (
        <div className="space-y-4">
          {carrito.map((producto, index) => (
            <div
              key={producto.id_producto || index}
              className="flex flex-col md:flex-row items-center justify-between border rounded-lg shadow p-4 bg-white gap-4"
            >
              <img
                src={producto.imagen_url}
                alt={producto.nombre}
                className="w-32 h-32 object-contain rounded"
              />
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-lg font-semibold">{producto.nombre}</h3>
                <p className="text-gray-600">${Number(producto.precio).toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => decrementarCantidad(index)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  -
                </button>
                <span>{producto.cantidad}</span>
                <button
                  onClick={() => incrementarCantidad(index)}
                  className="px-3 py-1 bg-green-500 text-white rounded"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {carrito.length > 0 && (
        <>
          <h3 className="text-xl font-bold mt-6">
            Total: ${Number(total).toFixed(2)}
          </h3>
          <div className="mt-4 relative">
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              onMouseDown={startHold}
              onMouseUp={endHold}
              onMouseLeave={endHold}
            >
              Mantén pulsado para pagar
            </button>
            {holdProgress > 0 && (
              <div className="absolute left-0 top-full mt-1 h-1 bg-blue-300 w-full rounded">
                <div
                  className="h-full bg-blue-700 rounded transition-all duration-100"
                  style={{ width: `${holdProgress}%` }}
                ></div>
              </div>
            )}
          </div>
        </>
      )}

      <div className="mt-6">
        <Link to="/" className="text-blue-500 underline">
          ← Volver a la tienda
        </Link>
      </div>
    </div>
  );
}

export default Cart;
