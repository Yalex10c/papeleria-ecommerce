import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/productos';
const CATEGORIAS_URL = 'http://localhost:5000/api/categorias';

const AdminProductos = () => {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    imagen_url: '',
    id_categoria: '',
  });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
  }, []);

  const fetchProductos = async () => {
    const res = await axios.get(API_URL);
    setProductos(res.data);
  };

  const fetchCategorias = async () => {
    const res = await axios.get(CATEGORIAS_URL);
    setCategorias(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modoEdicion) {
        await axios.put(`${API_URL}/${productoEditando}`, form);
      } else {
        await axios.post(API_URL, form);
      }
      setForm({ nombre: '', descripcion: '', precio: '', stock: '', imagen_url: '', id_categoria: '' });
      setModoEdicion(false);
      setProductoEditando(null);
      fetchProductos();
    } catch (error) {
      alert(error.response?.data?.error || 'Error');
    }
  };

  const handleEditar = (producto) => {
    setForm(producto);
    setModoEdicion(true);
    setProductoEditando(producto.id_producto);
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Eliminar este producto?')) {
      await axios.delete(`${API_URL}/${id}`);
      fetchProductos();
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestión de Productos</h2>
        <button
          onClick={() => navigate('/admin')}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          ← Regresar
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow p-4 rounded mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} className="p-2 border rounded" required />
        <input type="text" name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} className="p-2 border rounded" required />
        <input type="number" name="precio" placeholder="Precio" value={form.precio} onChange={handleChange} className="p-2 border rounded" required />
        <input type="number" name="stock" placeholder="Stock" value={form.stock} onChange={handleChange} className="p-2 border rounded" required />
        <input type="text" name="imagen_url" placeholder="URL de Imagen" value={form.imagen_url} onChange={handleChange} className="p-2 border rounded" required />
        <select name="id_categoria" value={form.id_categoria} onChange={handleChange} className="p-2 border rounded" required>
          <option value="">Selecciona una categoría</option>
          {categorias.map((cat) => (
            <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nombre}</option>
          ))}
        </select>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded col-span-full hover:bg-blue-600">
          {modoEdicion ? 'Actualizar Producto' : 'Crear Producto'}
        </button>
      </form>

      <table className="w-full bg-white shadow rounded overflow-hidden">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">Nombre</th>
            <th className="p-2">Precio</th>
            <th className="p-2">Stock</th>
            <th className="p-2">Categoría</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((prod) => (
            <tr key={prod.id_producto} className="border-t">
              <td className="p-2">{prod.nombre}</td>
              <td className="p-2">${prod.precio}</td>
              <td className="p-2">{prod.stock}</td>
              <td className="p-2">{categorias.find(c => c.id_categoria === prod.id_categoria)?.nombre || 'Sin categoría'}</td>
              <td className="p-2 space-x-2">
                <button onClick={() => handleEditar(prod)} className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600">Editar</button>
                <button onClick={() => handleEliminar(prod.id_producto)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProductos;
