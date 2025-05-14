// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, HomeIcon, LogIn } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <div className="text-xl font-bold">
        <Link to="/" className="hover:underline flex items-center gap-2">
          <HomeIcon size={20} />
          Inicio
        </Link>
      </div>
      <div className="flex gap-6">
        <Link to="/cart" className="hover:underline flex items-center gap-2">
          <ShoppingCart size={20} />
          Carrito
        </Link>
        <Link to="/login" className="hover:underline flex items-center gap-2">
          <LogIn size={20} />
          Iniciar sesión
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
