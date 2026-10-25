const { Productora } = require('../models');
const crearCrud = require('./crudController');

module.exports = crearCrud(Productora, 'Productora');
