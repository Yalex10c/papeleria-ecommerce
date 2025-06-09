import React, { useState, useEffect } from 'react';
import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Cart from './pages/Cart';
import CheckoutForm from './components/CheckoutForm';
import LoginCliente from './pages/LoginCliente';
import RegistroCliente from './pages/RegistroCliente';
import HistorialPedidos from './pages/HistorialPedidos'; // ruta correspondiente

//Admin
import AdminHome from './pages/AdminHome';
import AdminCategories from './pages/AdminCategories';
import AdminProductos from './pages/AdminProductos';
import AdminPedidos from './pages/AdminPedidos';
import AdminConfiguracion from './pages/AdminConfiguracion';

function App() {
  const [carrito, setCarrito] = useState(() => {
    const almacenado = localStorage.getItem('carrito');
    return almacenado ? JSON.parse(almacenado) : [];
  });

  // Actualiza localStorage cada vez que cambie el carrito
  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);

  const agregarAlCarrito = async (producto) => {
    const token = localStorage.getItem('token');
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

    // Enviar al backend solo si hay token
    if (token) {
      try {
        await fetch('http://localhost:5000/api/carrito', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            id_producto: producto.id,
            cantidad: 1
          })
        });
      } catch (error) {
        console.error('Error al sincronizar con backend:', error);
      }
    }
  };
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home agregarAlCarrito={agregarAlCarrito} />} />
        <Route path="/cart" element={<Cart carrito={carrito} setCarrito={setCarrito} />} />
        <Route path="/checkout" element={<CheckoutForm carrito={carrito} />} />
        <Route path="/login" element={<LoginCliente />} />
        <Route path="/registro-cliente" element={<RegistroCliente />} />
        <Route path="/cliente/home" element={<Home />} />
        <Route path="/historial" element={<HistorialPedidos />} />

        <Route path="/admin" element={<AdminHome />} />
        <Route path="/admin/categorias" element={<AdminCategories />} />
        <Route path="/admin/productos" element={<AdminProductos />} />
        <Route path="/admin/pedidos" element={<AdminPedidos />} />
        <Route path="/admin/configuracion" element={<AdminConfiguracion />} />





      </Routes>
    </Router>
  );
}

export default App; 
