import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Cart() {
  const [carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0);
  const [holdTimeout, setHoldTimeout] = useState(null);
  const [holdProgress, setHoldProgress] = useState(0);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("carrito")) || [];
    setCarrito(storedCart);
  }, []);

  useEffect(() => {
    const nuevoTotal = carrito.reduce(
      (acc, producto) => acc + producto.precio * producto.cantidad,
      0
    );
    setTotal(nuevoTotal);
  }, [carrito]);

  const incrementarCantidad = (index) => {
    const nuevoCarrito = [...carrito];
    nuevoCarrito[index].cantidad++;
    setCarrito(nuevoCarrito);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
  };

  const decrementarCantidad = (index) => {
    const nuevoCarrito = [...carrito];
    if (nuevoCarrito[index].cantidad > 1) {
      nuevoCarrito[index].cantidad--;
      setCarrito(nuevoCarrito);
      localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
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
        window.location.href = "/checkout";
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
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Carrito</h2>
      {carrito.map((producto, index) => (
        <div key={index} className="mb-4 p-4 border rounded shadow-md">
          <h3 className="text-lg font-semibold">{producto.nombre}</h3>
          <p>Precio: ${producto.precio}</p>
          <p>Cantidad: {producto.cantidad}</p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => decrementarCantidad(index)}
              className="px-2 py-1 bg-red-500 text-white rounded"
            >
              -
            </button>
            <button
              onClick={() => incrementarCantidad(index)}
              className="px-2 py-1 bg-green-500 text-white rounded"
            >
              +
            </button>
          </div>
        </div>
      ))}
      <h3 className="text-xl font-bold mt-4">Total: ${total}</h3>
      <div className="mt-4 relative">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
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
      <div className="mt-4">
        <Link to="/" className="text-blue-500 underline">
          Volver a la tienda
        </Link>
      </div>
    </div>
  );
}

export default Cart;
