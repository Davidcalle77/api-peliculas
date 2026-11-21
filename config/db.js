// Conexion a la base de datos usando Sequelize
// - En la nube: PostgreSQL, a través de la variable DATABASE_URL
// - En local: SQL Server, con las variables DB_* del .env
require('dotenv').config();
const { Sequelize } = require('sequelize');

let sequelize;

if (process.env.DATABASE_URL) {
  // Nube (PostgreSQL)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false },
    },
  });
} else {
  // Local (SQL Server)
  const opcionesSqlServer = {
    encrypt: false,
    trustServerCertificate: true,
  };

  // Si usas una instancia con nombre (SQLEXPRESS) se indica en el .env
  if (process.env.DB_INSTANCE) {
    opcionesSqlServer.instanceName = process.env.DB_INSTANCE;
  }

  const config = {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mssql',
    dialectOptions: { options: opcionesSqlServer },
    logging: false,
  };

  if (!process.env.DB_INSTANCE) {
    config.port = Number(process.env.DB_PORT) || 1433;
  }

  sequelize = new Sequelize(
    process.env.DB_NAME || 'peliculas_db',
    process.env.DB_USER || 'sa',
    process.env.DB_PASS || '',
    config
  );
}

module.exports = sequelize;