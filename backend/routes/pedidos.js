const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/auth');

// Crear pedido desde carrito
router.post('/', authenticateToken, async (req, res) => {
  const userId = req.user.id_usuario;
  const { id_metodo_pago } = req.body;

  try {
    const productos = await db.query(
      `SELECT p.id_producto, p.precio, dc.cantidad 
       FROM detalle_carrito dc
       JOIN productos p ON p.id_producto = dc.id_producto
       WHERE dc.id_usuario = $1`,
      [userId]
    );

    if (productos.rows.length === 0) {
      return res.status(400).json({ error: 'El carrito está vacío' });
    }

    const total = productos.rows.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0);

    const pedidoResult = await db.query(
      `INSERT INTO pedidos (id_usuario, id_metodo_pago, total, estado)
       VALUES ($1, $2, $3, 'pendiente') RETURNING id_pedido`,
      [userId, id_metodo_pago, total]
    );

    const id_pedido = pedidoResult.rows[0].id_pedido;

    for (const item of productos.rows) {
      await db.query(
        `INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario)
         VALUES ($1, $2, $3, $4)`,
        [id_pedido, item.id_producto, item.cantidad, item.precio]
      );
    }

    await db.query('DELETE FROM detalle_carrito WHERE id_usuario = $1', [userId]);

    res.status(201).json({ message: 'Pedido creado correctamente', id_pedido });
  } catch (error) {
    console.error('Error al crear pedido:', error);
    res.status(500).json({ error: 'Error interno' });
  }
});

// Ver pedidos del usuario autenticado
router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.id_usuario;

  try {
    const pedidosResult = await db.query(
      `SELECT * FROM pedidos WHERE id_usuario = $1 ORDER BY fecha_pedido DESC`,
      [userId]
    );
    res.json(pedidosResult.rows);
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ error: 'Error interno' });
  }
});

// Ver todos los pedidos (admin)
router.get('/admin', authenticateToken, async (req, res) => {
  const { tipo_usuario } = req.user;
  if (tipo_usuario !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }

  try {
    const pedidos = await db.query('SELECT * FROM pedidos ORDER BY fecha_pedido DESC');
    res.json(pedidos.rows);
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ error: 'Error interno' });
  }
});

module.exports = router;
