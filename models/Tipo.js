// Modulo de Tipo: nombre, descripcion y fechas (no tiene estado segun el enunciado)
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Tipo = sequelize.define(
  'Tipo',
  {
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: { notEmpty: { msg: 'El nombre es obligatorio' } },
    },
    descripcion: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    tableName: 'tipos',
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaActualizacion',
  }
);

module.exports = Tipo;
