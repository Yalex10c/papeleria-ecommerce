import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

function Navbar() {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600 hover:text-blue-800">
        Papelería Saturn
      </Link>
      <div className="flex gap-4 items-center">
        <Link
          to="/"
          className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
        >
          Inicio
        </Link>
        <Link
          to="/cart"
          className="relative text-gray-700 hover:text-blue-600 transition-colors duration-200"
        >
          <ShoppingCart className="w-6 h-6" />
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
