import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState(JSON.parse(localStorage.getItem('carrito')) || []);  // Cargar carrito desde localStorage

  useEffect(() => {
    axios.get('http://localhost:5000/api/productos')
      .then(response => setProductos(response.data))
      .catch(error => console.error(error));
  }, []);

  const agregarAlCarrito = (producto) => {
    const nuevoCarrito = [...carrito, producto];
    setCarrito(nuevoCarrito);
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));  // Guardar carrito en localStorage
  };

  return (
    <div className="p-4 flex">
      <div className="flex-1"> {/* Columna de productos */}
        <h1 className="text-2xl font-bold mb-4">Catálogo de Productos</h1>
        <div className="grid grid-cols-3 gap-4">
          {productos.map(producto => (
            <div key={producto.id} className="border p-4">
              <h2 className="text-xl">{producto.nombre}</h2>
              <p>{producto.descripcion}</p>
              <p>${producto.precio}</p>
              <button 
                onClick={() => agregarAlCarrito(producto)} 
                className="bg-blue-500 text-white py-2 px-4 mt-2 hover:bg-blue-700 transition-colors duration-300">
                  Agregar al carrito
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Panel lateral para el carrito */}
      <div className="w-1/4 p-4 bg-gray-100 ml-4">
        <h2 className="text-xl font-bold mb-2">Carrito de Compras</h2>
        {carrito.length === 0 ? (
          <p>El carrito está vacío.</p>
        ) : (
          <ul>
            {carrito.map((producto, index) => (
              <li key={index} className="my-2">
                {producto.nombre} - ${producto.precio}
              </li>
            ))}
          </ul>
        )}
        <button className="bg-green-500 text-white py-2 px-4 mt-4">Realizar Compra</button>
      </div>
    </div>
  );
};

export default Home;
