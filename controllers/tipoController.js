const { Tipo } = require('../models');
const crearCrud = require('./crudController');

module.exports = crearCrud(Tipo, 'Tipo');
