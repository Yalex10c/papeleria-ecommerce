import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminCategories() {
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/categorias');
      setCategorias(res.data);
    } catch (error) {
      setMensaje('Error al cargar categorías');
    }
  };

  const crearCategoria = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/categorias', {
        nombre,
        descripcion,
      });
      setCategorias([...categorias, res.data]);
      setNombre('');
      setDescripcion('');
      setMensaje('Categoría creada con éxito');
    } catch (error) {
      setMensaje('Error al crear categoría');
    }
  };

  const eliminarCategoria = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/categorias/${id}`);
      setCategorias(categorias.filter((cat) => cat.id_categoria !== id));
      setMensaje('Categoría eliminada');
    } catch (error) {
      setMensaje('Error al eliminar categoría');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Gestión de Categorías</h2>
        <button
          onClick={() => navigate('/admin')}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Regresar al Panel
        </button>
      </div>

      {mensaje && <p className="mb-4 text-green-600">{mensaje}</p>}

      <form onSubmit={crearCategoria} className="mb-6">
        <input
          type="text"
          placeholder="Nombre de categoría"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="border p-2 mr-2 rounded"
        />
        <input
          type="text"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
          className="border p-2 mr-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Crear
        </button>
      </form>

      <ul>
        {categorias.map((cat) => (
          <li
            key={cat.id_categoria}
            className="mb-2 flex justify-between items-center border-b pb-2"
          >
            <div>
              <strong>{cat.nombre}</strong> - {cat.descripcion}
            </div>
            <button
              onClick={() => eliminarCategoria(cat.id_categoria)}
              className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
