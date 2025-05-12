import React, { useState } from 'react';
import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Cart from './pages/Cart';
import CheckoutForm from './components/CheckoutForm'; // Importamos el componente de checkout

function App() {
  const [carrito, setCarrito] = useState(JSON.parse(localStorage.getItem('carrito')) || []);

  const agregarAlCarrito = (producto) => {
    const nuevoCarrito = [...carrito, producto];
    setCarrito(nuevoCarrito);
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));  // Guardar carrito en localStorage
  };

  return (
    <Router>
      <Navbar /> {/* Navbar siempre visible */}
      <Routes>
        <Route path="/" element={<Home agregarAlCarrito={agregarAlCarrito} />} />
        <Route path="/cart" element={<Cart carrito={carrito} />} />
        <Route path="/checkout" element={<CheckoutForm carrito={carrito} />} /> {/* Ruta de checkout */}
      </Routes>
    </Router>
  );
}

export default App;
