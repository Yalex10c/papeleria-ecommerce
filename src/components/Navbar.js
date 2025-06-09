// src/components/Navbar.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogIn, LogOut } from 'lucide-react';
import axios from 'axios';

const Navbar = () => {
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [config, setConfig] = useState({});
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/api/configuracion")
      .then(res => setConfig(res.data))
      .catch(err => console.error("Error config:", err));

    axios.get("http://localhost:5000/api/categorias")
      .then(res => setCategorias(res.data))
      .catch(err => console.error("Error categorías:", err));
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const manejarFiltro = (e) => {
    const categoria = e.target.value;
    setCategoriaSeleccionada(categoria);
    navigate(`/?categoria=${categoria}`);
  };

  return (
    <nav
      className="px-6 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2 shadow-md"
      style={{
        backgroundColor: config.color_primario || '#2563eb',
        color: config.color_nombre_tienda || '#ffffff'
      }}
    >
      {/* Izquierda: Logo + Nombre */}
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2">
          {config.logo_url && (
            <img src={config.logo_url} alt="logo" className="h-10 w-auto" />
          )}
          <span
            className="text-xl font-bold"
            style={{
              color: config.color_nombre_tienda || '#ffffff',
              fontFamily: config.fuente_nombre_tienda || 'inherit'
            }}
          >
            {config.nombre_tienda || 'Mi Tienda'}
          </span>
        </Link>
      </div>

      {/* Centro: Filtro por categoría */}
      <div className="w-full md:w-auto">
        <select
          value={categoriaSeleccionada}
          onChange={manejarFiltro}
          className="text-black px-3 py-2 rounded w-full md:w-60"
        >
          <option value="">Todas las categorías</option>
          {categorias.map(cat => (
            <option key={cat.id_categoria || cat.nombre} value={cat.nombre}>
              {cat.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Derecha: Botones */}
      <div className="flex items-center gap-5">
        <Link to="/cart" className="hover:underline flex items-center gap-2">
          <ShoppingCart size={20} />
          Carrito
        </Link>

        {token ? (
          <>
            <Link to="/historial" className="hover:underline">Historial</Link>
            <button onClick={cerrarSesion} className="hover:underline flex items-center gap-2">
              <LogOut size={20} />
              Cerrar sesión
            </button>
          </>
        ) : (
          <Link to="/login" className="hover:underline flex items-center gap-2">
            <LogIn size={20} />
            Iniciar sesión
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
