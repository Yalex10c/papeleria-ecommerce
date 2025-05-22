const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

// Importar routers
const usuariosRouter = require('./routes/usuarios');
const productosRouter = require('./routes/productos');
const carritoRouter = require('./routes/carrito');
const pedidosRouter = require('./routes/pedidos');
const categoriasRouter = require('./routes/categorias');


// Usar routers
app.use('/api/usuarios', usuariosRouter);
app.use('/api/productos', productosRouter);
app.use('/api/carrito', carritoRouter);
app.use('/api/pedidos', pedidosRouter);
app.use('/api/categorias', categoriasRouter);


app.get('/', (req, res) => {
  res.send('¡Servidor backend en funcionamiento!');
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
