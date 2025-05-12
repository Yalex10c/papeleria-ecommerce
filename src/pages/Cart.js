import React from 'react';

const Cart = ({ carrito }) => {
  // Asegúrate de que el carrito no sea undefined o null
  if (!carrito) return <p>No hay productos en el carrito.</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Carrito de Compras</h1>
      {carrito.length === 0 ? (
        <p>El carrito está vacío.</p>
      ) : (
        <div>
          <ul>
            {carrito.map((producto, index) => (
              <li key={index} className="my-2">
                {producto.nombre} - ${producto.precio}
              </li>
            ))}
          </ul>
          <button className="bg-green-500 text-white py-2 px-4 mt-4">Realizar Compra</button>
        </div>
      )}
    </div>
  );
};

export default Cart;
