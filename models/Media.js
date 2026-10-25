// Modulo de Media (peliculas y series)
// Las llaves foraneas (generoId, directorId, productoraId, tipoId) se crean en models/index.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Media = sequelize.define(
  'Media',
  {
    serial: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: { notEmpty: { msg: 'El serial es obligatorio' } },
    },
    titulo: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: { notEmpty: { msg: 'El título es obligatorio' } },
    },
    sinopsis: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    url: {
      type: DataTypes.STRING(400),
      allowNull: false,
      unique: true,
      validate: { notEmpty: { msg: 'La URL es obligatoria' } },
    },
    imagenPortada: {
      type: DataTypes.STRING(400),
      allowNull: true,
    },
    anioEstreno: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isInt: { msg: 'El año de estreno debe ser un número entero' },
        min: { args: [1888], msg: 'El año de estreno no es válido' },
        max: { args: [2100], msg: 'El año de estreno no es válido' },
      },
    },
  },
  {
    tableName: 'media',
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaActualizacion',
  }
);

module.exports = Media;
