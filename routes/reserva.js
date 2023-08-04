const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos } = require('../middlewares');

const { crearReserva,
    obtenerReservas,
    obtenerReservasXusuario,
    actualizarOrden, 
    borrarOrden } = require('../controllers/reserva');

const {existeProductoPorId } = require('../helpers/db-validators');

const router = Router();

/**
 * {{url}}/api/categorias
 */

//  Obtener todas las categorias - publico
router.get('/', obtenerReservas );

router.get('/:id', obtenerReservasXusuario );

// Obtener una categoria por id - publico

// Crear categoria - privado - cualquier persona con un token válido
router.post('/', [ 
    validarJWT,

    check('solar','No es un id de Mongo').isMongoId(),

    validarCampos
], crearReserva );

// Actualizar - privado - cualquiera con token válido
router.put('/:id',[
    validarJWT,

    validarCampos
], actualizarOrden );

// Borrar una categoria - Admin
router.delete('/:id',[
    validarJWT,

    check('id', 'No es un id de Mongo válido').isMongoId(),

    validarCampos,
], borrarOrden);


module.exports = router;