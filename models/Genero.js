// Modulo de Genero: nombre, estado, descripcion y fechas
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Genero = sequelize.define(
  'Genero',
  {
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: { notEmpty: { msg: 'El nombre es obligatorio' } },
    },
    estado: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'Activo',
      validate: { isIn: { args: [['Activo', 'Inactivo']], msg: 'El estado debe ser Activo o Inactivo' } },
    },
    descripcion: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    tableName: 'generos',
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaActualizacion',
  }
);

module.exports = Genero;
