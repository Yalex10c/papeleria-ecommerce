const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_aqui'; // Usa variable de entorno para seguridad

// Registrar usuario con contraseña hasheada y validaciones
router.post('/', async (req, res) => {
  const { nombre, correo_electronico, contraseña, telefono, tipo_usuario } = req.body;

  // Validación campos obligatorios
  if (!nombre || !correo_electronico || !contraseña || !telefono || !tipo_usuario) {
    return res.status(400).json({ error: 'Por favor completa todos los campos obligatorios.' });
  }


  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(correo_electronico)) {
    return res.status(400).json({ error: 'Correo electrónico no válido.' });
  }

  // Validar teléfono mexicano: exactamente 10 dígitos numéricos
  if (!/^\d{10}$/.test(telefono)) {
    return res.status(400).json({ error: 'El teléfono debe contener exactamente 10 dígitos numéricos.' });
  }

  // Validar tipo_usuario
  const tiposValidos = ['cliente', 'admin'];
  if (!tiposValidos.includes(tipo_usuario)) {
    return res.status(400).json({ error: 'Tipo de usuario inválido. Debe ser cliente o admin.' });
  }

  try {
    // Verificar si el correo ya existe
    const checkQuery = 'SELECT * FROM usuarios WHERE correo_electronico = $1';
    const checkResult = await db.query(checkQuery, [correo_electronico]);

    if (checkResult.rows.length > 0) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
    }

    // Hashear contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(contraseña, saltRounds);

    // Insertar usuario
    const insertQuery = `
  INSERT INTO usuarios (nombre, correo_electronico, contraseña_hash, telefono, tipo_usuario)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING id_usuario, nombre, correo_electronico, telefono, tipo_usuario`;

    const values = [nombre, correo_electronico, hashedPassword, telefono, tipo_usuario];
    const insertResult = await db.query(insertQuery, values);

    // 🆕 Crear carrito automáticamente
    await db.query('INSERT INTO carrito (id_usuario) VALUES ($1)', [insertResult.rows[0].id_usuario]);

    res.status(201).json(insertResult.rows[0]);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ error: 'Error interno' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { correo_electronico, contraseña } = req.body;

  try {
    const userQuery = 'SELECT * FROM usuarios WHERE correo_electronico = $1';
    const userResult = await db.query(userQuery, [correo_electronico]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = userResult.rows[0];
    const match = await bcrypt.compare(contraseña, user.contraseña_hash);
    if (!match) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const tokenPayload = { id_usuario: user.id_usuario, tipo_usuario: user.tipo_usuario };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1h' });

    res.json({
      token,
      usuario: {
        id_usuario: user.id_usuario,
        nombre: user.nombre,
        correo_electronico: user.correo_electronico,
        tipo_usuario: user.tipo_usuario,
      },
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno' });
  }
});

module.exports = router;
