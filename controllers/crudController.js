// Controlador generico: crea las 5 operaciones (listar, obtener, crear, actualizar, eliminar)
// para cualquier modelo. Lo usan Genero, Director, Productora y Tipo.
const { manejarError, limpiarBody } = require('./utilidades');

function crearCrud(Modelo, etiqueta) {
  return {
    // GET /api/xxx
    listar: async (req, res) => {
      try {
        const registros = await Modelo.findAll({ order: [['id', 'ASC']] });
        res.json(registros);
      } catch (error) {
        manejarError(res, error);
      }
    },

    // GET /api/xxx/:id
    obtener: async (req, res) => {
      try {
        const registro = await Modelo.findByPk(req.params.id);
        if (!registro) return res.status(404).json({ mensaje: `${etiqueta} no encontrado` });
        res.json(registro);
      } catch (error) {
        manejarError(res, error);
      }
    },

    // POST /api/xxx
    crear: async (req, res) => {
      try {
        const nuevo = await Modelo.create(limpiarBody(req.body));
        res.status(201).json(nuevo);
      } catch (error) {
        manejarError(res, error);
      }
    },

    // PUT /api/xxx/:id
    actualizar: async (req, res) => {
      try {
        const registro = await Modelo.findByPk(req.params.id);
        if (!registro) return res.status(404).json({ mensaje: `${etiqueta} no encontrado` });
        await registro.update(limpiarBody(req.body));
        res.json(registro);
      } catch (error) {
        manejarError(res, error);
      }
    },

    // DELETE /api/xxx/:id
    eliminar: async (req, res) => {
      try {
        const registro = await Modelo.findByPk(req.params.id);
        if (!registro) return res.status(404).json({ mensaje: `${etiqueta} no encontrado` });
        await registro.destroy();
        res.json({ mensaje: `${etiqueta} eliminado correctamente` });
      } catch (error) {
        manejarError(res, error);
      }
    },
  };
}

module.exports = crearCrud;
