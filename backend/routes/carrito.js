const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_muy_segura';

// Middleware para verificar token
function autenticarToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.usuario = user;
    next();
  });
}

// 1. Obtener carrito del usuario autenticado
router.get('/', autenticarToken, async (req, res) => {
  try {
    const { id_usuario } = req.usuario;

    const query = `
      SELECT p.id_producto, p.nombre, p.precio, p.imagen_url, dc.cantidad
      FROM detalle_carrito dc
      JOIN productos p ON p.id_producto = dc.id_producto
      WHERE dc.id_usuario = $1
    `;
    const result = await db.query(query, [id_usuario]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener carrito:', error);
    res.status(500).json({ error: 'Error interno' });
  }
});

// 2. Agregar producto al carrito
router.post('/', autenticarToken, async (req, res) => {
  try {
    const { id_usuario } = req.usuario;
    const { id_producto, cantidad } = req.body;

    const existe = await db.query(
      'SELECT * FROM detalle_carrito WHERE id_usuario = $1 AND id_producto = $2',
      [id_usuario, id_producto]
    );

    if (existe.rows.length > 0) {
      await db.query(
        'UPDATE detalle_carrito SET cantidad = cantidad + $1 WHERE id_usuario = $2 AND id_producto = $3',
        [cantidad, id_usuario, id_producto]
      );
    } else {
      await db.query(
        'INSERT INTO detalle_carrito (id_usuario, id_producto, cantidad) VALUES ($1, $2, $3)',
        [id_usuario, id_producto, cantidad]
      );
    }

    res.status(200).json({ mensaje: 'Producto agregado al carrito' });
  } catch (error) {
    console.error('Error al agregar al carrito:', error);
    res.status(500).json({ error: 'Error interno' });
  }
});

// 3. Eliminar producto del carrito
router.delete('/:id_producto', autenticarToken, async (req, res) => {
  try {
    const { id_usuario } = req.usuario;
    const { id_producto } = req.params;

    await db.query(
      'DELETE FROM detalle_carrito WHERE id_usuario = $1 AND id_producto = $2',
      [id_usuario, id_producto]
    );

    res.json({ mensaje: 'Producto eliminado del carrito' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error interno' });
  }
});

// 4. Actualizar cantidad de un producto en el carrito
router.put('/:id_producto', autenticarToken, async (req, res) => {
  try {
    const { id_usuario } = req.usuario;
    const { id_producto } = req.params;
    const { cantidad } = req.body;

    if (cantidad < 1) {
      return res.status(400).json({ error: 'Cantidad inválida' });
    }

    await db.query(
      'UPDATE detalle_carrito SET cantidad = $1 WHERE id_usuario = $2 AND id_producto = $3',
      [cantidad, id_usuario, id_producto]
    );

    res.json({ mensaje: 'Cantidad actualizada' });
  } catch (error) {
    console.error('Error al actualizar cantidad:', error);
    res.status(500).json({ error: 'Error interno' });
  }
});

module.exports = router;
