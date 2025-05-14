import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentPage = ({ carrito }) => {
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

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Nombre:', name);
    console.log('Dirección:', `${address} #${houseNumber}, ${colony}, CP ${postalCode}`);
    console.log('Método de pago:', paymentMethod);

    if (paymentMethod === 'creditCard') {
      console.log('Número de tarjeta:', cardNumber);
      console.log('Fecha de expiración:', expiryDate);
      console.log('CVV:', cvv);
    } else if (paymentMethod === 'paypal') {
      console.log('Correo de PayPal:', paypalEmail);
    }

    setSuccessMessage('¡Compra realizada con éxito!');
  };

  const calcularTotal = () => {
    return carrito?.reduce((total, producto) => total + producto.precio, 0).toFixed(2);
  };

  const goBack = () => {
    navigate('/cart'
    )
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <header className="text-center mb-6">
        <h1 className="text-2xl font-bold">Dirección y Método de Pago</h1>
        <p className="text-gray-600">Completa los datos para finalizar tu compra.</p>
      </header>

      {successMessage && (
        <div className="bg-green-100 text-green-800 p-4 rounded mb-4 text-center">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Datos de envío */}
        <div>
          <label className="block font-semibold">Nombre del destinatario</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block font-semibold">Calle</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
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
              onChange={(e) => setHouseNumber(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="flex-1">
            <label className="block font-semibold">Colonia</label>
            <input
              type="text"
              value={colony}
              onChange={(e) => setColony(e.target.value)}
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
            onChange={(e) => setPostalCode(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Método de pago */}
        <div>
          <label className="block font-semibold">Método de Pago</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Selecciona un método</option>
            <option value="creditCard">Tarjeta de Crédito</option>
            <option value="paypal">PayPal</option>
            <option value="bankTransfer">Transferencia Bancaria</option>
          </select>
        </div>

        {/* Campos dinámicos según método */}
        {paymentMethod === 'creditCard' && (
          <>
            <div>
              <label className="block font-semibold">Número de Tarjeta</label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
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
                  onChange={(e) => setExpiryDate(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex-1">
                <label className="block font-semibold">CVV</label>
                <input
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
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
              onChange={(e) => setPaypalEmail(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        )}

        {/* Resumen del carrito */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Resumen del Carrito</h2>
          <ul className="border border-gray-300 rounded divide-y divide-gray-200">
            {carrito?.map((producto, i) => (
              <li key={i} className="flex justify-between p-2">
                <span>{producto.nombre}</span>
                <span>${producto.precio.toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="text-right font-bold mt-2">
            Total: ${calcularTotal()}
          </div>
        </div>

        {/* Botones */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Finalizar Compra
        </button>
      </form>

       <div className="text-center mt-6">
        <button
          onClick={goBack}
          className="text-gray-600 hover:underline"
        >
          ← Regresar
        </button>
      </div>
    </div>
      );
};

export default PaymentPage;
