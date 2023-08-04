const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const { 
        obtenerSolares,
        crearSolar,
        obtenerSolar,
        actualizarSolar,
        borrarSolar
        } = require('../controllers/solares');
const { existeSolarPorId } = require('../helpers/db-validators');

const router = Router();

/**
 * {{url}}/api/categorias
 */

//  Obtener todas las categorias - publico
router.get('/', obtenerSolares );

router.post('/', [
    validarJWT,
    check('ubicacion', 'La ubicación es obligatoria').not().isEmpty(),
    check('ancho', 'El ancho es obligatorio').not().isEmpty(),
    check('largo', 'El largo es obligatorio').not().isEmpty(),
    validarCampos
], crearSolar);

router.get('/:id', [
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeSolarPorId),
    validarCampos
], obtenerSolar);

router.put('/:id', [
    validarJWT,

    check('id').custom(existeSolarPorId),
    validarCampos
], actualizarSolar);

// Borrar un solar
router.delete('/:id', [
    validarJWT,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeSolarPorId),
    validarCampos
], borrarSolar);

module.exports = router;