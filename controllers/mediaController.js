// Controlador de Media (peliculas y series)
// Aqui estan las reglas especiales del enunciado:
//  - Solo se pueden elegir generos, directores y productoras ACTIVOS
//  - El tipo debe existir
//  - El serial y la URL no se pueden repetir
const { Op } = require('sequelize');
const { Media, Genero, Director, Productora, Tipo } = require('../models');
const { manejarError, limpiarBody } = require('./utilidades');

// Para mostrar los datos completos (y no solo los ids) al consultar
const incluir = [
  { model: Genero, as: 'genero', attributes: ['id', 'nombre', 'estado'] },
  { model: Director, as: 'director', attributes: ['id', 'nombres', 'estado'] },
  { model: Productora, as: 'productora', attributes: ['id', 'nombre', 'estado'] },
  { model: Tipo, as: 'tipo', attributes: ['id', 'nombre'] },
];

const RELACIONES = [
  { campo: 'generoId', modelo: Genero, nombre: 'el género', usaEstado: true },
  { campo: 'directorId', modelo: Director, nombre: 'el director', usaEstado: true },
  { campo: 'productoraId', modelo: Productora, nombre: 'la productora', usaEstado: true },
  { campo: 'tipoId', modelo: Tipo, nombre: 'el tipo', usaEstado: false },
];

// Revisa que genero, director, productora y tipo existan y esten activos.
// Devuelve un texto con el error, o null si todo esta bien.
async function validarRelaciones(datos, obligatorias, actual = {}) {
  for (const r of RELACIONES) {
    const valor = datos[r.campo];

    if (valor === undefined || valor === null) {
      if (obligatorias) return `El campo ${r.campo} es obligatorio`;
      continue;
    }

    // Si en una edicion llega el mismo valor que ya tenia, no se vuelve a validar
    if (String(valor) === String(actual[r.campo])) continue;

    if (!Number.isInteger(Number(valor))) return `El campo ${r.campo} debe ser un número`;

    const registro = await r.modelo.findByPk(valor);
    if (!registro) return `No existe ${r.nombre} con id ${valor}`;
    if (r.usaEstado && registro.estado !== 'Activo') {
      return `No se puede usar ${r.nombre} con id ${valor} porque está Inactivo`;
    }
  }
  return null;
}

// Revisa que el serial y la URL no esten repetidos
async function validarUnicos(datos, idActual) {
  for (const campo of ['serial', 'url']) {
    if (datos[campo] === undefined) continue;
    const where = { [campo]: datos[campo] };
    if (idActual) where.id = { [Op.ne]: idActual };
    if (await Media.findOne({ where })) {
      return `Ya existe una producción con ese ${campo}`;
    }
  }
  return null;
}

// GET /api/media
async function listar(req, res) {
  try {
    const lista = await Media.findAll({ include: incluir, order: [['id', 'ASC']] });
    res.json(lista);
  } catch (error) {
    manejarError(res, error);
  }
}

// GET /api/media/:id
async function obtener(req, res) {
  try {
    const media = await Media.findByPk(req.params.id, { include: incluir });
    if (!media) return res.status(404).json({ mensaje: 'Producción no encontrada' });
    res.json(media);
  } catch (error) {
    manejarError(res, error);
  }
}

// POST /api/media
async function crear(req, res) {
  try {
    const datos = limpiarBody(req.body);

    const error = (await validarRelaciones(datos, true)) || (await validarUnicos(datos));
    if (error) return res.status(400).json({ mensaje: error });

    const nueva = await Media.create(datos);
    const completa = await Media.findByPk(nueva.id, { include: incluir });
    res.status(201).json(completa);
  } catch (error) {
    manejarError(res, error);
  }
}

// PUT /api/media/:id
async function actualizar(req, res) {
  try {
    const media = await Media.findByPk(req.params.id);
    if (!media) return res.status(404).json({ mensaje: 'Producción no encontrada' });

    const datos = limpiarBody(req.body);

    const error = (await validarRelaciones(datos, false, media)) || (await validarUnicos(datos, media.id));
    if (error) return res.status(400).json({ mensaje: error });

    await media.update(datos);
    const completa = await Media.findByPk(media.id, { include: incluir });
    res.json(completa);
  } catch (error) {
    manejarError(res, error);
  }
}

// DELETE /api/media/:id
async function eliminar(req, res) {
  try {
    const media = await Media.findByPk(req.params.id);
    if (!media) return res.status(404).json({ mensaje: 'Producción no encontrada' });
    await media.destroy();
    res.json({ mensaje: 'Producción eliminada correctamente' });
  } catch (error) {
    manejarError(res, error);
  }
}

module.exports = { listar, obtener, crear, actualizar, eliminar };
