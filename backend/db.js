const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'ecommerce',
});

pool.connect()
  .then(() => console.log('Conectado a la base de datos PostgreSQL'))
  .catch(err => console.error('Error conectando a PostgreSQL:', err));

module.exports = {
  query: (text, params) => pool.query(text, params),
};
