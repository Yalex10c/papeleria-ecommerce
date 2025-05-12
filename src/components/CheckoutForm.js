import React, { useState } from 'react';

const CheckoutForm = ({ carrito }) => {
  // Estado para el formulario
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [metodoPago, setMetodoPago] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  // Función para manejar la suma total de los productos
  const calcularTotal = () => {
    return carrito.reduce((total, producto) => total + producto.precio, 0).toFixed(2);
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nombre || !direccion || !metodoPago) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    // Aquí puedes enviar la información del pedido al backend (luego implementaremos esta parte).
    // Por ahora, solo mostramos un mensaje de éxito.
    setMensajeExito('¡Compra realizada con éxito!');

    // Limpiar el formulario (opcional)
    setNombre('');
    setDireccion('');
    setMetodoPago('');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Formulario de Compra</h1>

      {mensajeExito && <p className="text-green-500">{mensajeExito}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre completo</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded"
            required
          />
        </div>

        {/* Dirección */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Dirección de envío</label>
          <input
            type="text"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded"
            required
          />
        </div>

        {/* Método de pago */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Método de pago</label>
          <select
            value={metodoPago}
            onChange={(e) => setMetodoPago(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded"
            required
          >
            <option value="">Selecciona un método</option>
            <option value="tarjeta">Tarjeta de crédito</option>
            <option value="paypal">PayPal</option>
          </select>
        </div>

        {/* Resumen del carrito */}
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Resumen del Carrito</h2>
          <ul>
            {carrito.map((producto, index) => (
              <li key={index} className="my-2">
                {producto.nombre} - ${producto.precio}
              </li>
            ))}
          </ul>
          <p className="mt-2 font-bold">Total: ${calcularTotal()}</p>
        </div>

        <button type="submit" className="bg-blue-500 text-white py-2 px-4 mt-4 w-full hover:bg-blue-700">
          Realizar Compra
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;
