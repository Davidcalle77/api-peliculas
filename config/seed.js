// Datos iniciales que pide el enunciado (solo se crean si las tablas estan vacias)
const { Genero, Tipo } = require('../models');

async function sembrarDatos() {
  if ((await Genero.count()) === 0) {
    const generos = ['Acción', 'Aventura', 'Ciencia ficción', 'Drama', 'Terror'];
    for (const nombre of generos) {
      await Genero.create({ nombre });
    }
  }

  if ((await Tipo.count()) === 0) {
    const tipos = ['Película', 'Serie'];
    for (const nombre of tipos) {
      await Tipo.create({ nombre });
    }
  }
}

module.exports = sembrarDatos;
