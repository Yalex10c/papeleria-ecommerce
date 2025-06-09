import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CheckoutForm = () => {
  const navigate = useNavigate();
  const [carrito, setCarrito] = useState([]);
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
  const [token, setToken] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) return;

    setToken(storedToken);

    fetch('http://localhost:5000/api/carrito', {
      headers: { 'Authorization': `Bearer ${storedToken}` }
    })
      .then(res => res.json())
      .then(data => setCarrito(data))
      .catch(err => console.error('Error al cargar el carrito:', err));
  }, []);

  const calcularTotal = () =>
    carrito.reduce((sum, p) => sum + p.precio * p.cantidad, 0).toFixed(2);

  const goBack = () => navigate('/cart');

  const obtenerIdMetodoPago = (valor) => {
    switch (valor) {
      case 'creditCard': return 1;
      case 'paypal': return 2;
      case 'bankTransfer': return 3;
      default: return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const id_metodo_pago = obtenerIdMetodoPago(paymentMethod);
    if (!id_metodo_pago) return alert('Selecciona un método de pago válido');
    if (carrito.length === 0) return alert('Tu carrito está vacío');

    const orderData = {
      id_metodo_pago,
      name,
      address,
      houseNumber,
      colony,
      postalCode,
    };

    try {
      const response = await fetch('http://localhost:5000/api/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error?.error || 'Error al crear la orden');
      }

      setSuccessMessage('¡Compra realizada con éxito!');
    } catch (err) {
      console.error('Error en checkout:', err);
      alert('Hubo un problema al procesar tu compra');
    }
  };

  return (
    <div className="flex flex-col md:flex-row max-w-5xl mx-auto px-4 py-8 gap-8">
      <div className="md:w-2/3">
        <h1 className="text-2xl font-bold mb-4">Dirección y Método de Pago</h1>

        {successMessage && (
          <div className="bg-green-100 text-green-800 p-4 rounded mb-4 text-center">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Nombre" className="w-full p-2 border rounded" />
          <input type="text" value={address} onChange={e => setAddress(e.target.value)} required placeholder="Calle" className="w-full p-2 border rounded" />
          <div className="flex space-x-4">
            <input type="text" value={houseNumber} onChange={e => setHouseNumber(e.target.value)} required placeholder="Número" className="flex-1 p-2 border rounded" />
            <input type="text" value={colony} onChange={e => setColony(e.target.value)} required placeholder="Colonia" className="flex-1 p-2 border rounded" />
          </div>
          <input type="text" value={postalCode} onChange={e => setPostalCode(e.target.value)} required placeholder="Código Postal" className="w-full p-2 border rounded" />

          <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} required className="w-full p-2 border rounded">
            <option value="">Selecciona un método</option>
            <option value="creditCard">Tarjeta de Crédito</option>
            <option value="paypal">PayPal</option>
            <option value="bankTransfer">Transferencia Bancaria</option>
          </select>

          {paymentMethod === 'creditCard' && (
            <>
              <input type="text" value={cardNumber} onChange={e => setCardNumber(e.target.value)} placeholder="Número de tarjeta" className="w-full p-2 border rounded" required />
              <div className="flex space-x-4">
                <input type="text" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} placeholder="MM/AA" className="flex-1 p-2 border rounded" required />
                <input type="text" value={cvv} onChange={e => setCvv(e.target.value)} placeholder="CVV" className="flex-1 p-2 border rounded" required />
              </div>
            </>
          )}

          {paymentMethod === 'paypal' && (
            <input type="email" value={paypalEmail} onChange={e => setPaypalEmail(e.target.value)} placeholder="Correo de PayPal" className="w-full p-2 border rounded" required />
          )}

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Finalizar Compra
          </button>
        </form>

        <div className="text-center mt-6">
          <button onClick={goBack} className="text-gray-600 hover:underline">← Regresar</button>
        </div>
      </div>

      <aside className="md:w-1/3 bg-gray-100 p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Resumen del Carrito</h2>
        <ul className="space-y-3">
          {carrito.map((producto, idx) => (
            <li key={producto.id_producto || idx} className="flex items-center gap-4 bg-white p-2 rounded shadow">
              <img
                src={producto.imagen_url}
                alt={producto.nombre}
                className="w-16 h-16 object-contain rounded"
              />
              <div className="flex-1">
                <p className="font-medium">{producto.nombre} × {producto.cantidad}</p>
                <p className="text-sm text-gray-600">${(producto.precio * producto.cantidad).toFixed(2)}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="text-right font-bold mt-2">Total: ${calcularTotal()}</div>
      </aside>
    </div>
  );
};

export default CheckoutForm;
