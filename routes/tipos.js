const router = require('express').Router();
const c = require('../controllers/tipoController');
const { validarId } = require('../controllers/utilidades');

router.param('id', validarId);

router.get('/', c.listar);
router.get('/:id', c.obtener);
router.post('/', c.crear);
router.put('/:id', c.actualizar);
router.delete('/:id', c.eliminar);

module.exports = router;
