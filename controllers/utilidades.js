// Funciones de ayuda que usan todos los controladores

// Convierte los errores de la base de datos en respuestas claras
function manejarError(res, error) {
  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      mensaje: 'Datos inválidos',
      errores: ['Ya existe un registro con ese valor en un campo que no se puede repetir (nombre, serial o url)'],
    });
  }

  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({
      mensaje: 'Datos inválidos',
      errores: error.errors.map((e) => e.message),
    });
  }

  if (error.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(409).json({
      mensaje: 'No se puede completar la operación: el registro está relacionado con otros datos o la referencia no existe',
    });
  }

  console.error(error);
  return res.status(500).json({ mensaje: 'Error interno del servidor' });
}

// Evita que el cliente cambie el id o las fechas desde el body
function limpiarBody(body) {
  const datos = { ...(body || {}) };
  delete datos.id;
  delete datos.fechaCreacion;
  delete datos.fechaActualizacion;
  return datos;
}

// Revisa que el :id de la URL sea un numero entero
function validarId(req, res, next, id) {
  if (!Number.isInteger(Number(id)) || Number(id) < 1) {
    return res.status(400).json({ mensaje: 'El id debe ser un número entero positivo' });
  }
  next();
}

module.exports = { manejarError, limpiarBody, validarId };
