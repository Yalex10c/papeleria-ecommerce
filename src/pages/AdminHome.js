import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminHome = () => {
  const navigate = useNavigate();

  // Obtener info del admin del localStorage
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Panel de Administración
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Cerrar Sesión
        </button>
      </header>

      <section className="bg-white rounded shadow p-6">
        <h2 className="text-xl mb-4">Bienvenido, {usuario?.nombre || 'Admin'}</h2>

        <nav className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            onClick={() => navigate('/admin/pedidos')}
            className="cursor-pointer bg-blue-500 text-white p-6 rounded shadow hover:bg-blue-600 text-center"
          >
            Gestión Pedidos
          </div>
          <div
            onClick={() => navigate('/admin/categorias')}
            className="cursor-pointer bg-green-500 text-white p-6 rounded shadow hover:bg-green-600 text-center"
          >
            Crear Categoria
          </div>
          <div
            onClick={() => navigate('/admin/productos')}
            className="cursor-pointer bg-yellow-500 text-white p-6 rounded shadow hover:bg-yellow-600 text-center"
          >
            Crear Productos
          </div>
          <div
            onClick={() => navigate('/admin/configuracion')}
            className="cursor-pointer bg-purple-500 text-white p-6 rounded shadow hover:bg-purple-600 text-center"
          >
            Configuración Tienda
          </div>
        </nav>
      </section>
    </div>
  );
};

export default AdminHome;
