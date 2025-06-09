import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminConfiguracion = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState({
    nombre_tienda: '',
    logo_url: '',
    color_primario: '',
    color_nombre_tienda: '',     // Nuevo campo
    fuente_nombre_tienda: '',    // Nuevo campo
    url_contacto: '',
    texto_footer: ''
  });

  const [mensaje, setMensaje] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('http://localhost:5000/api/configuracion')
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(err => console.error('Error al obtener config:', err));
  }, []);

  const handleChange = (e) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  const handleGuardar = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/configuracion', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(config)
      });

      if (response.ok) {
        setMensaje('¡Configuración guardada!');
      } else {
        const error = await response.json();
        alert(error?.error || 'Error al guardar');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Configuración de la Tienda</h2>

      {mensaje && <p className="bg-green-100 text-green-800 p-2 rounded mb-4">{mensaje}</p>}

      <div className="space-y-4">
        <input name="nombre_tienda" value={config.nombre_tienda} onChange={handleChange} placeholder="Nombre de la tienda" className="w-full p-2 border rounded" />
        <input name="logo_url" value={config.logo_url} onChange={handleChange} placeholder="URL del logo" className="w-full p-2 border rounded" />
        <input name="color_primario" value={config.color_primario} onChange={handleChange} placeholder="Color primario (#hex)" className="w-full p-2 border rounded" />
        <input name="color_nombre_tienda" value={config.color_nombre_tienda} onChange={handleChange} placeholder="Color del nombre de la tienda (#hex)" className="w-full p-2 border rounded" />

        {/* Select de fuente */}
        <select
          name="fuente_nombre_tienda"
          value={config.fuente_nombre_tienda}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Seleccionar fuente</option>
          <option value="Roboto">Roboto</option>
          <option value="Open Sans">Open Sans</option>
          <option value="Lato">Lato</option>
          <option value="Montserrat">Montserrat</option>
          <option value="Oswald">Oswald</option>
          <option value="Raleway">Raleway</option>
          <option value="Poppins">Poppins</option>
          <option value="Merriweather">Merriweather</option>
          <option value="Playfair Display">Playfair Display</option>
          <option value="Rubik">Rubik</option>
          <option value="Nunito">Nunito</option>
          <option value="PT Sans">PT Sans</option>
          <option value="Inter">Inter</option>
          <option value="Work Sans">Work Sans</option>
          <option value="Ubuntu">Ubuntu</option>
          <option value="Bebas Neue">Bebas Neue</option>
          <option value="Quicksand">Quicksand</option>
          <option value="Source Sans Pro">Source Sans Pro</option>
          <option value="Archivo">Archivo</option>
          <option value="Inconsolata">Inconsolata</option>
        </select>

        <input name="url_contacto" value={config.url_contacto} onChange={handleChange} placeholder="URL de contacto" className="w-full p-2 border rounded" />
        <textarea name="texto_footer" value={config.texto_footer} onChange={handleChange} placeholder="Texto del footer" className="w-full p-2 border rounded" />

        <button onClick={handleGuardar} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Guardar Cambios
        </button>

        <div className="mt-4">
          <button onClick={() => navigate('/admin')} className="text-gray-500 hover:underline">← Volver al Panel</button>
        </div>
      </div>
    </div>
  );
};

export default AdminConfiguracion;
