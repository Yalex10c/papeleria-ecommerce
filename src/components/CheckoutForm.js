// src/components/CheckoutForm.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CheckoutForm = ({ carrito }) => {
  const navigate = useNavigate();

  // Estados del formulario
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [colony, setColony] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Calcular total del carrito
  const calcularTotal = () =>
    carrito?.reduce((sum, producto) => sum + producto.precio * (producto.cantidad || 1), 0).toFixed(2);

  // Volver al carrito
  const goBack = () => navigate('/cart');

  // Envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage('¡Compra realizada con éxito!');
    localStorage.removeItem('carrito');
  };

  return (
    <div className="flex flex-col md:flex-row max-w-5xl mx-auto px-4 py-8 gap-8">
      {/* ======== FORMULARIO ======== */}
      <div className="md:w-2/3">
        <h1 className="text-2xl font-bold mb-4">Dirección y Método de Pago</h1>

        {successMessage && (
          <div className="bg-green-100 text-green-800 p-4 rounded mb-4 text-center">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold">Nombre del destinatario</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold">Calle</label>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block font-semibold">Número</label>
              <input
                type="text"
                value={houseNumber}
                onChange={e => setHouseNumber(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="flex-1">
              <label className="block font-semibold">Colonia</label>
              <input
                type="text"
                value={colony}
                onChange={e => setColony(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold">Código Postal</label>
            <input
              type="text"
              value={postalCode}
              onChange={e => setPostalCode(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold">Método de Pago</label>
            <select
              value={paymentMethod}
              onChange={e => setPaymentMethod(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Selecciona un método</option>
              <option value="creditCard">Tarjeta de Crédito</option>
              <option value="paypal">PayPal</option>
              <option value="bankTransfer">Transferencia Bancaria</option>
            </select>
          </div>

          {paymentMethod === 'creditCard' && (
            <>
              <div>
                <label className="block font-semibold">Número de Tarjeta</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={e => setCardNumber(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block font-semibold">Expira (MM/AA)</label>
                  <input
                    type="text"
                    value={expiryDate}
                    onChange={e => setExpiryDate(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="flex-1">
                  <label className="block font-semibold">CVV</label>
                  <input
                    type="text"
                    value={cvv}
                    onChange={e => setCvv(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>
            </>
          )}

          {paymentMethod === 'paypal' && (
            <div>
              <label className="block font-semibold">Correo de PayPal</label>
              <input
                type="email"
                value={paypalEmail}
                onChange={e => setPaypalEmail(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Finalizar Compra
          </button>
        </form>

        <div className="text-center mt-6">
          <button onClick={goBack} className="text-gray-600 hover:underline">
            ← Regresar
          </button>
        </div>
      </div>

      {/* ======== RESUMEN DEL CARRITO ======== */}
      <aside className="md:w-1/3 bg-gray-100 p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Resumen del Carrito</h2>
        <ul className="divide-y divide-gray-200">
          {carrito?.map((producto, idx) => (
            <li key={idx} className="py-2 flex justify-between">
              <span>{producto.nombre} × {producto.cantidad || 1}</span>
              <span>${(producto.precio * (producto.cantidad || 1)).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="text-right font-bold mt-2">Total: ${calcularTotal()}</div>
      </aside>
    </div>
  );
};

export default CheckoutForm;
