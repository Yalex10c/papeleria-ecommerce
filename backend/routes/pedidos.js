const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/auth');

// Crear un pedido
router.post('/', authenticateToken, async (req, res) => {
  const userId = req.user.id_usuario;
  const { id_metodo_pago, carrito, total } = req.body;

  try {
    // Crear pedido
    const insertPedidoQuery = `
      INSERT INTO pedidos (id_usuario, id_metodo_pago, total, estado)
      VALUES ($1, $2, $3, 'pendiente') RETURNING id_pedido
    `;
    const pedidoResult = await db.query(insertPedidoQuery, [userId, id_metodo_pago, total]);
    const id_pedido = pedidoResult.rows[0].id_pedido;

    // Insertar detalle pedido
    for (const item of carrito) {
      const insertDetalleQuery = `
        INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario)
        VALUES ($1, $2, $3, $4)
      `;
      await db.query(insertDetalleQuery, [id_pedido, item.id_producto, item.cantidad, item.precio]);
    }

    res.status(201).json({ message: 'Pedido creado', id_pedido });
  } catch (error) {
    console.error('Error al crear pedido:', error);
    res.status(500).json({ error: 'Error interno' });
  }
});

// Obtener pedidos del usuario autenticado
router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.id_usuario;

  try {
    const pedidosQuery = `
      SELECT * FROM pedidos WHERE id_usuario = $1 ORDER BY fecha_pedido DESC
    `;
    const pedidosResult = await db.query(pedidosQuery, [userId]);
    res.json(pedidosResult.rows);
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ error: 'Error interno' });
  }
});

module.exports = router;
