import React, { useState, useEffect } from 'react';
import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Cart from './pages/Cart';
import CheckoutForm from './components/CheckoutForm';

function App() {
  const [carrito, setCarrito] = useState(() => {
    const almacenado = localStorage.getItem('carrito');
    return almacenado ? JSON.parse(almacenado) : [];
  });

  // Actualiza localStorage cada vez que cambie el carrito
  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);

  const agregarAlCarrito = (producto) => {
    const existente = carrito.find(p => p.id === producto.id);
    let nuevoCarrito;
    if (existente) {
      nuevoCarrito = carrito.map(p =>
        p.id === producto.id ? { ...p, cantidad: (p.cantidad || 1) + 1 } : p
      );
    } else {
      nuevoCarrito = [...carrito, { ...producto, cantidad: 1 }];
    }
    setCarrito(nuevoCarrito);
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home agregarAlCarrito={agregarAlCarrito} />} />
        <Route path="/cart" element={<Cart carrito={carrito} setCarrito={setCarrito} />} />
        <Route path="/checkout" element={<CheckoutForm carrito={carrito} />} />
      </Routes>
    </Router>
  );
}

export default App;

