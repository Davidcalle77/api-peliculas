// Modulo de Productora: nombre, estado, slogan, descripcion y fechas
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Productora = sequelize.define(
  'Productora',
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
    slogan: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    descripcion: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    tableName: 'productoras',
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaActualizacion',
  }
);

module.exports = Productora;
