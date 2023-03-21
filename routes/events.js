
/*
  Rutas de usuarios / Events
  host + /api/events
*/
const { Router } = require('express')
const { check } = require('express-validator')
const { validarJWT } = require('../middlewares/validar-jwt')
const { validarCampos } = require('../middlewares/validar-campos')

const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events.js')
const { isDate } = require('../helpers/isDate')

const router = Router()

router.use(validarJWT)

// obtener eventos
router.get('/',
getEventos)


// crear un nuevo evento
router.post('/', 
[ 
  check('title', 'El titulo es obligatorio').not().isEmpty(),
  check('start', 'Fecha de inicio es obligatoria').custom(isDate),
  check('end', 'Fecha de finalización es obligatoria').custom(isDate),
  validarCampos
],
crearEvento)

// actualizar eventos
router.put('/:id', actualizarEvento)

router.delete('/:id', eliminarEvento)

module.exports = router