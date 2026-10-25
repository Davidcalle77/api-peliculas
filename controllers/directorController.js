const { Director } = require('../models');
const crearCrud = require('./crudController');

module.exports = crearCrud(Director, 'Director');
