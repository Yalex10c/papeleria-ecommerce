const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/auth');

// Obtener configuración actual
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM configuracion_tienda LIMIT 1');
    res.json(result.rows[0] || {});
  } catch (error) {
    console.error('Error al obtener configuración:', error);
    res.status(500).json({ error: 'Error al obtener configuración' });
  }
});

// Actualizar configuración
router.put('/', authenticateToken, async (req, res) => {
  const {
    nombre_tienda,
    logo_url,
    color_primario,
    color_secundario,
    color_nombre_tienda,     // nuevo
    fuente_nombre_tienda,    // nuevo
    url_contacto,
    texto_footer
  } = req.body;

  try {
    const check = await db.query('SELECT * FROM configuracion_tienda LIMIT 1');

    if (check.rows.length > 0) {
      await db.query(`
        UPDATE configuracion_tienda
        SET nombre_tienda = $1,
            logo_url = $2,
            color_primario = $3,
            color_secundario = $4,
            color_nombre_tienda = $5,
            fuente_nombre_tienda = $6,
            url_contacto = $7,
            texto_footer = $8,
            fecha_actualizacion = NOW()
      `, [nombre_tienda, logo_url, color_primario, color_secundario, color_nombre_tienda, fuente_nombre_tienda, url_contacto, texto_footer]);
    } else {
      await db.query(`
        INSERT INTO configuracion_tienda (
          nombre_tienda, logo_url, color_primario, color_secundario,
          color_nombre_tienda, fuente_nombre_tienda,
          url_contacto, texto_footer, fecha_actualizacion
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      `, [nombre_tienda, logo_url, color_primario, color_secundario, color_nombre_tienda, fuente_nombre_tienda, url_contacto, texto_footer]);
    }

    res.json({ message: 'Configuración actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar configuración:', error);
    res.status(500).json({ error: 'Error al actualizar configuración' });
  }
});

module.exports = router;
