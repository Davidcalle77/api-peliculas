// Conexion a SQL Server usando Sequelize
require('dotenv').config();
const { Sequelize } = require('sequelize');

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

const sequelize = new Sequelize(
  process.env.DB_NAME || 'peliculas_db',
  process.env.DB_USER || 'sa',
  process.env.DB_PASS || '',
  config
);

module.exports = sequelize;
