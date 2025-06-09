const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todos los métodos de pago
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM metodos_pago ORDER BY id_metodo_pago');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener métodos de pago:', error);
    res.status(500).json({ error: 'Error al obtener métodos de pago' });
  }
});

module.exports = router;
