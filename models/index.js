// Aqui se juntan los modelos y se definen las relaciones entre tablas
const sequelize = require('../config/db');
const Genero = require('./Genero');
const Director = require('./Director');
const Productora = require('./Productora');
const Tipo = require('./Tipo');
const Media = require('./Media');

// Una media pertenece a UN genero, UN director, UNA productora y UN tipo.
// Las 4 llaves foraneas son obligatorias.
Media.belongsTo(Genero, { as: 'genero', foreignKey: { name: 'generoId', allowNull: false }, onDelete: 'NO ACTION' });
Media.belongsTo(Director, { as: 'director', foreignKey: { name: 'directorId', allowNull: false }, onDelete: 'NO ACTION' });
Media.belongsTo(Productora, { as: 'productora', foreignKey: { name: 'productoraId', allowNull: false }, onDelete: 'NO ACTION' });
Media.belongsTo(Tipo, { as: 'tipo', foreignKey: { name: 'tipoId', allowNull: false }, onDelete: 'NO ACTION' });

module.exports = { sequelize, Genero, Director, Productora, Tipo, Media };
