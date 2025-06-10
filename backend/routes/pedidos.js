// backend/routes/pedidos.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/auth');

// Crear pedido desde carrito
router.post('/', authenticateToken, async (req, res) => {
  const userId = req.user.id_usuario;
  const { id_metodo_pago, name, address, houseNumber, colony, postalCode } = req.body;

  if (!name || !address || !houseNumber || !colony || !postalCode) {
    return res.status(400).json({ error: 'Todos los campos de dirección son obligatorios' });
  }

  try {
    const productos = await db.query(`
      SELECT p.id_producto, p.precio, p.stock, p.nombre, dc.cantidad 
      FROM detalle_carrito dc
      JOIN productos p ON p.id_producto = dc.id_producto
      WHERE dc.id_usuario = $1`, [userId]);

    if (productos.rows.length === 0) {
      return res.status(400).json({ error: 'El carrito está vacío' });
    }

    for (const item of productos.rows) {
      if (item.stock < item.cantidad) {
        return res.status(400).json({ error: `Stock insuficiente para: ${item.nombre}` });
      }
    }

    const total = productos.rows.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0);

    const pedidoResult = await db.query(`
      INSERT INTO pedidos (
        id_usuario, id_metodo_pago, total, estado,
        nombre_destinatario, calle, numero_casa, colonia, codigo_postal
      ) VALUES ($1, $2, $3, 'pendiente', $4, $5, $6, $7, $8)
      RETURNING id_pedido`,
      [userId, id_metodo_pago, total, name, address, houseNumber, colony, postalCode]
    );

    const id_pedido = pedidoResult.rows[0].id_pedido;

    for (const item of productos.rows) {
      await db.query(`
        INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario)
        VALUES ($1, $2, $3, $4)`,
        [id_pedido, item.id_producto, item.cantidad, item.precio]
      );

      await db.query(`
        UPDATE productos SET stock = stock - $1 WHERE id_producto = $2`,
        [item.cantidad, item.id_producto]
      );
    }

    await db.query('DELETE FROM detalle_carrito WHERE id_usuario = $1', [userId]);

    res.status(201).json({ message: 'Pedido creado correctamente', id_pedido });
  } catch (error) {
    console.error('Error al crear pedido:', error);
    res.status(500).json({ error: 'Error interno' });
  }
});

// Obtener pedidos del usuario autenticado
router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.id_usuario;

  try {
    const pedidosResult = await db.query(`
      SELECT * FROM pedidos WHERE id_usuario = $1 ORDER BY fecha_pedido DESC`,
      [userId]
    );
    res.json(pedidosResult.rows);
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ error: 'Error interno' });
  }
});

// Obtener todos los pedidos (admin)
router.get('/admin', authenticateToken, async (req, res) => {
  if (req.user.tipo_usuario !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }

  try {
    const pedidos = await db.query(`
      SELECT 
        p.id_pedido,
        p.fecha_pedido,
        p.estado,
        p.total,
        u.nombre AS nombre_usuario,
        p.nombre_destinatario
      FROM pedidos p
      JOIN usuarios u ON p.id_usuario = u.id_usuario
      ORDER BY p.fecha_pedido DESC
    `);

    res.json(pedidos.rows);
  } catch (error) {
    console.error('Error al obtener pedidos (admin):', error);
    res.status(500).json({ error: 'Error interno' });
  }
});

// Obtener productos de un pedido
router.get('/admin/:id/detalle', authenticateToken, async (req, res) => {
  if (req.user.tipo_usuario !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }

  const id_pedido = req.params.id;

  try {
    const detalle = await db.query(`
      SELECT dp.id_producto, p.nombre, p.imagen_url, dp.cantidad, dp.precio_unitario
      FROM detalle_pedido dp
      JOIN productos p ON p.id_producto = dp.id_producto
      WHERE dp.id_pedido = $1`,
      [id_pedido]
    );

    res.json(detalle.rows);
  } catch (error) {
    console.error('Error al obtener detalle de pedido:', error);
    res.status(500).json({ error: 'Error interno al obtener detalle' });
  }
});

// Cambiar estado del pedido
router.put('/admin/:id/estado', authenticateToken, async (req, res) => {
  if (req.user.tipo_usuario !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }

  const id_pedido = req.params.id;
  const { estado } = req.body;

  try {
    await db.query(
      `UPDATE pedidos SET estado = $1 WHERE id_pedido = $2`,
      [estado, id_pedido]
    );
    res.json({ message: 'Estado actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar estado del pedido:', error);
    res.status(500).json({ error: 'Error al actualizar estado' });
  }
});

// Historial detallado del usuario
router.get('/historial', authenticateToken, async (req, res) => {
  const userId = req.user.id_usuario;

  try {
    const historial = await db.query(`
      SELECT 
        p.id_pedido, p.fecha_pedido, p.total, p.estado,
        p.nombre_destinatario, p.calle, p.numero_casa, p.colonia, p.codigo_postal,
        mp.nombre AS metodo_pago,
        dp.id_producto, pr.nombre, pr.imagen_url, dp.cantidad, dp.precio_unitario
      FROM pedidos p
      JOIN detalle_pedido dp ON dp.id_pedido = p.id_pedido
      JOIN productos pr ON pr.id_producto = dp.id_producto
      JOIN metodos_pago mp ON mp.id_metodo_pago = p.id_metodo_pago
      WHERE p.id_usuario = $1
      ORDER BY p.fecha_pedido DESC`,
      [userId]
    );

    res.json(historial.rows);
  } catch (error) {
    console.error('Error al obtener historial:', error);
    res.status(500).json({ error: 'Error interno al obtener historial' });
  }
});

module.exports = router;
