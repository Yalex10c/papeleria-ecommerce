import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const Home = () => {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [config, setConfig] = useState({});
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const location = useLocation();

  // Obtener categoría desde la URL
  const query = new URLSearchParams(location.search);
  const categoria = query.get("categoria");

  // Cargar productos (filtrados si hay categoría)
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const endpoint = categoria
          ? `http://localhost:5000/api/productos?categoria=${encodeURIComponent(categoria)}`
          : 'http://localhost:5000/api/productos';

        const res = await axios.get(endpoint);
        setProductos(res.data);
      } catch (err) {
        console.error('Error productos:', err);
      }
    };

    fetchProductos();
  }, [categoria]);

  // Cargar carrito y configuración
  useEffect(() => {
    if (token) {
      axios.get('http://localhost:5000/api/carrito', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => setCarrito(res.data))
        .catch(err => console.error('Error carrito:', err));
    }

    axios.get('http://localhost:5000/api/configuracion')
      .then(res => setConfig(res.data))
      .catch(err => console.error('Error configuración:', err));
  }, [token]);

  const agregarAlCarrito = async (producto) => {
    if (!token) return alert('Debes iniciar sesión para agregar productos');
    try {
      await axios.post('http://localhost:5000/api/carrito', {
        id_producto: producto.id_producto,
        cantidad: 1
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const response = await axios.get('http://localhost:5000/api/carrito', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCarrito(response.data);
    } catch (err) {
      console.error('Error al agregar:', err);
    }
  };

  const eliminarDelCarrito = async (id_producto) => {
    if (!token) return alert('Debes iniciar sesión');
    try {
      await axios.delete(`http://localhost:5000/api/carrito/${id_producto}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const response = await axios.get('http://localhost:5000/api/carrito', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCarrito(response.data);
    } catch (err) {
      console.error('Error al eliminar:', err);
    }
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row p-4">
        <div className="flex-1">

          {productos.length === 0 ? (
            <p className="text-center text-gray-500">No hay productos para esta categoría.</p>
          ) : (
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
                    style={{ backgroundColor: config.color_primario || '#3b82f6' }}
                    className="hover:brightness-110 text-white py-2 px-4 rounded transition w-full"
                  >
                    Agregar al carrito
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:w-1/4 w-full mt-8 lg:mt-0 lg:ml-6 bg-gray-100 p-4 rounded shadow sticky top-4 self-start h-fit">
          <h2 className="text-xl font-bold mb-2">Carrito de Compras</h2>
          {carrito.length === 0 ? (
            <p className="text-gray-500">El carrito está vacío.</p>
          ) : (
            <>
              <ul className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {carrito.map(producto => (
                  <li key={producto.id_producto} className="flex justify-between items-center">
                    <span>{producto.nombre} × {producto.cantidad}</span>
                    <button
                      onClick={() => eliminarDelCarrito(producto.id_producto)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      ❌
                    </button>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate('/cart')}
                className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
              >
                Ir al carrito
              </button>
            </>
          )}
        </div>
      </div>

      {config.texto_footer && (
        <footer className="text-center text-sm text-gray-600 mt-12 border-t pt-4">
          {config.texto_footer}
        </footer>
      )}
    </>
  );
};

export default Home;
