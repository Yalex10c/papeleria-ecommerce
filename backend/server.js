const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas API
const usuariosRouter = require('./routes/usuarios');
const productosRouter = require('./routes/productos');
const carritoRouter = require('./routes/carrito');
const pedidosRouter = require('./routes/pedidos');
const categoriasRouter = require('./routes/categorias');
const metodosPagoRoutes = require('./routes/metodospago.js');
const configuracionRoutes = require('./routes/configuracion');

app.use('/api/usuarios', usuariosRouter);
app.use('/api/productos', productosRouter);
app.use('/api/carrito', carritoRouter);
app.use('/api/pedidos', pedidosRouter);
app.use('/api/categorias', categoriasRouter);
app.use('/api/metodospago', metodosPagoRoutes);
app.use('/api/configuracion', configuracionRoutes);

// Mensaje simple para probar conexión
app.get('/', (req, res) => {
  res.send('¡Servidor backend en funcionamiento!');
});

// Servir frontend
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

// React Router: enviar index.html para rutas no API
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
