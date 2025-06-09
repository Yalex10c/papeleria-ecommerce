const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todas las categorías (nombre, id y descripción si se requiere más adelante)
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT id_categoria, nombre, descripcion FROM categorias ORDER BY nombre ASC');
    res.json(result.rows); // Devuelve objetos completos, útiles si se necesita el ID también
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ error: 'Error interno' });
  }
});

// Crear nueva categoría
router.post('/', async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const insertQuery = `
      INSERT INTO categorias (nombre, descripcion)
      VALUES ($1, $2) RETURNING *`;
    const values = [nombre, descripcion];
    const result = await db.query(insertQuery, values);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear categoría:', error);
    res.status(500).json({ error: 'Error interno' });
  }
});

// Actualizar categoría
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    const updateQuery = `
      UPDATE categorias SET nombre = $1, descripcion = $2 WHERE id_categoria = $3 RETURNING *`;
    const values = [nombre, descripcion, id];
    const result = await db.query(updateQuery, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    res.status(500).json({ error: 'Error interno' });
  }
});

// Eliminar categoría
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM categorias WHERE id_categoria = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    res.json({ mensaje: 'Categoría eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    res.status(500).json({ error: 'Error interno' });
  }
});

module.exports = router;
