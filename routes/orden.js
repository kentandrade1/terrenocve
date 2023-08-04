const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const { crearOrden,
    obtenerOrdenes,
    obtenerOrdenesXusuario,
    actualizarOrden, 
    borrarOrden } = require('../controllers/orden');

const {existeProductoPorId } = require('../helpers/db-validators');

const router = Router();

/**
 * {{url}}/api/categorias
 */

//  Obtener todas las categorias - publico
router.get('/', obtenerOrdenes );

router.get('/:id', obtenerOrdenesXusuario );

// Obtener una categoria por id - publico

// Crear categoria - privado - cualquier persona con un token válido
router.post('/', [ 
    validarJWT,
    check('entrada','La entrada es obligatorio').not().isEmpty(),
    check('solar','No es un id de Mongo').isMongoId(),

    validarCampos
], crearOrden );

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