import React, { useState } from 'react';
import axios from 'axios';

const RegistroCliente = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    correo_electronico: '',
    contraseña: '',
    telefono: ''
  });

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  // Actualizar campos
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    // Añadir tipo_usuario 'cliente' para backend
    const dataToSend = { ...formData, tipo_usuario: 'cliente' };

    try {
      const response = await axios.post('http://localhost:5000/api/usuarios', dataToSend);
      const { nombre } = response.data;
      setMensaje(`¡Bienvenido ${nombre}! Puedes iniciar sesión ahora.`);
      setFormData({
        nombre: '',
        correo_electronico: '',
        contraseña: '',
        telefono: ''
      });
    } catch (err) {
      // Manejo básico de errores
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Error al registrar usuario');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Registro de Cliente</h2>

        <input
          type="text"
          name="nombre"
          placeholder="Nombre completo"
          className="w-full p-2 border mb-4 rounded"
          value={formData.nombre}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="correo_electronico"
          placeholder="Correo electrónico"
          className="w-full p-2 border mb-4 rounded"
          value={formData.correo_electronico}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="contraseña"
          placeholder="Contraseña"
          className="w-full p-2 border mb-4 rounded"
          value={formData.contraseña}
          onChange={handleChange}
          required
          minLength={6}
        />

        <input
          type="tel"
          name="telefono"
          placeholder="Teléfono (10 dígitos)"
          className="w-full p-2 border mb-4 rounded"
          value={formData.telefono}
          onChange={handleChange}
          required
          pattern="^\d{10}$"
          title="Debe contener exactamente 10 dígitos"
        />



        <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
          Registrarse
        </button>

        {mensaje && <p className="mt-4 text-center text-green-600">{mensaje}</p>}
        {error && <p className="mt-4 text-center text-red-600">{error}</p>}
      </form>
    </div>
  );
};

export default RegistroCliente;
