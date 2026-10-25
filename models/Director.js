// Modulo de Director: nombres, estado y fechas
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Director = sequelize.define(
  'Director',
  {
    nombres: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: { notEmpty: { msg: 'Los nombres son obligatorios' } },
    },
    estado: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'Activo',
      validate: { isIn: { args: [['Activo', 'Inactivo']], msg: 'El estado debe ser Activo o Inactivo' } },
    },
  },
  {
    tableName: 'directores',
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaActualizacion',
  }
);

module.exports = Director;
