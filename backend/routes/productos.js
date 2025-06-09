const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todos los productos o filtrados por categoría
router.get('/', async (req, res) => {
  const { categoria } = req.query;

  try {
    let query;
    let params;

    if (categoria) {
      query = `
        SELECT p.* FROM productos p
        JOIN categorias c ON p.id_categoria = c.id_categoria
        WHERE c.nombre = $1
      `;
      params = [categoria];
    } else {
      query = 'SELECT * FROM productos';
      params = [];
    }

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error interno' });
  }
});

// Crear un nuevo producto con validación de categoría
router.post('/', async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, imagen_url, id_categoria } = req.body;

    // Validar categoría
    const categoriaValida = await db.query('SELECT id_categoria FROM categorias WHERE id_categoria = $1', [id_categoria]);
    if (categoriaValida.rows.length === 0) {
      return res.status(400).json({ error: 'Categoría inválida' });
    }

    const insertQuery = `
      INSERT INTO productos (nombre, descripcion, precio, stock, imagen_url, id_categoria)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
    const values = [nombre, descripcion, precio, stock, imagen_url, id_categoria];
    const result = await db.query(insertQuery, values);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error interno' });
  }
});

// Actualizar producto con validación de categoría
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock, imagen_url, id_categoria } = req.body;

    // Validar categoría
    const categoriaValida = await db.query('SELECT id_categoria FROM categorias WHERE id_categoria = $1', [id_categoria]);
    if (categoriaValida.rows.length === 0) {
      return res.status(400).json({ error: 'Categoría inválida' });
    }

    const updateQuery = `
      UPDATE productos
      SET nombre = $1, descripcion = $2, precio = $3, stock = $4, imagen_url = $5, id_categoria = $6
      WHERE id_producto = $7
      RETURNING *`;
    const values = [nombre, descripcion, precio, stock, imagen_url, id_categoria, id];
    const result = await db.query(updateQuery, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error interno' });
  }
});

// Eliminar producto
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM productos WHERE id_producto = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error interno' });
  }
});

module.exports = router;
