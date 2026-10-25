const { Genero } = require('../models');
const crearCrud = require('./crudController');

module.exports = crearCrud(Genero, 'Género');
