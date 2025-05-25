import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState(JSON.parse(localStorage.getItem('carrito')) || []);

  useEffect(() => {
    axios.get('http://localhost:5000/api/productos')
      .then(response => setProductos(response.data))
      .catch(error => console.error(error));
  }, []);

  const agregarAlCarrito = (producto) => {
    const nuevoCarrito = [...carrito, producto];
    setCarrito(nuevoCarrito);
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
  };

  const eliminarDelCarrito = (index) => {
    const nuevoCarrito = [...carrito];
    nuevoCarrito.splice(index, 1); // Elimina el producto en esa posición
    setCarrito(nuevoCarrito);
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
  };

  return (
    <div className="flex flex-col lg:flex-row p-4">
      {/* Catálogo */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-6 text-center">Catálogo de Productos</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productos.map(producto => (
            <div key={producto.id_producto} className="border rounded-lg shadow p-4 bg-white">
              <img
                src={producto.imagen_url}
                alt={producto.nombre}
                className="w-full h-48 object-contain mb-4 rounded"
              />
              <h2 className="text-xl font-semibold mb-2">{producto.nombre}</h2>
              <p className="text-gray-600 mb-1">{producto.descripcion}</p>
              <p className="text-lg font-bold text-blue-600 mb-2">${producto.precio}</p>
              <button
                onClick={() => agregarAlCarrito(producto)}
                className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-300 w-full"
              >
                Agregar al carrito
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Carrito */}
      <div className="lg:w-1/4 w-full mt-8 lg:mt-0 lg:ml-6 bg-gray-100 p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-2">Carrito de Compras</h2>
        {carrito.length === 0 ? (
          <p className="text-gray-500">El carrito está vacío.</p>
        ) : (
          <ul className="space-y-2">
            {carrito.map((producto, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>{producto.nombre} - ${producto.precio}</span>
                <button
                  onClick={() => eliminarDelCarrito(index)}
                  className="text-red-500 hover:text-red-700 text-sm"
                  title="Eliminar del carrito"
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        )}
        <button className="bg-green-500 text-white py-2 px-4 mt-4 w-full rounded hover:bg-green-600 transition">
          Realizar Compra
        </button>
      </div>
    </div>
  );
};

export default Home;
