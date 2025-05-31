import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/usuarios/login', {
        correo_electronico: correo,
        contraseña: password,
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('usuario', JSON.stringify(response.data.usuario));

      setMensaje('Inicio de sesión exitoso ✅');

      setTimeout(() => {
        if (response.data.usuario.tipo_usuario === 'admin') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/cliente/home';
        }
      }, 1000);
    } catch (error) {
      setMensaje(error.response?.data?.error || '❌ Error al iniciar sesión');
    }
  };

  // Opcional: función para redirigir a registro cliente
  const handleRegistroClick = () => {
    window.location.href = '/registro-cliente';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
        <input
          type="email"
          placeholder="Correo electrónico"
          className="w-full p-2 border mb-4 rounded"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="w-full p-2 border mb-4 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Iniciar Sesión
        </button>

        <button
          type="button"
          onClick={handleRegistroClick}
          className="w-full mt-4 bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Registrarse como Cliente
        </button>

        {mensaje && <p className="mt-4 text-center text-red-500">{mensaje}</p>}
      </form>
    </div>
  );
};

export default Login;
