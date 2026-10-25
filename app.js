// Punto de entrada de la API REST de peliculas y series
require('dotenv').config();
const express = require('express');
const { sequelize } = require('./models');
const sembrarDatos = require('./config/seed');

const app = express();
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    mensaje: 'API de Películas y Series funcionando',
    rutas: ['/api/generos', '/api/directores', '/api/productoras', '/api/tipos', '/api/media'],
  });
});

// Una ruta por cada modulo
app.use('/api/generos', require('./routes/generos'));
app.use('/api/directores', require('./routes/directores'));
app.use('/api/productoras', require('./routes/productoras'));
app.use('/api/tipos', require('./routes/tipos'));
app.use('/api/media', require('./routes/media'));

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

// JSON mal escrito u otros errores
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ mensaje: 'El JSON enviado no es válido' });
  }
  console.error(err);
  res.status(500).json({ mensaje: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;

async function iniciar() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a SQL Server correcta');

    await sequelize.sync(); // crea las tablas si todavia no existen
    await sembrarDatos(); // agrega generos y tipos iniciales si estan vacios

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('No se pudo iniciar la API:', error.message);
    process.exit(1);
  }
}

iniciar();
