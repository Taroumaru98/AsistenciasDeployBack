import express from 'express';
import { check } from 'express-validator';
import bitacoraController from '../controllers/Bitacora.js';
import { validarCampos } from '../middleware/validar-campos.js';
import { validarJWT } from '../middleware/validarJWT.js';
import { BitacorasHelper } from '../helpers/Bitacora.js';
import { aprendicesHelper } from '../helpers/Aprendices.js';

const router = express.Router();

// Ruta para crear una bitácora
router.post('/', [
    check('cc', 'El número de cédula (cc) del aprendiz es obligatorio').not().isEmpty(),
    check('cc', 'El número de cédula (cc) del aprendiz es inválido').isLength({ min: 10}), 
    check('cc').custom(aprendicesHelper.verificarcc), 
    validarCampos
], bitacoraController.crearBitacora);

// Ruta para listar todas las bitácoras
router.get('/Listar', [
    validarJWT,
], bitacoraController.listarTodo);

// Ruta para listar bitácoras por ID de Aprendiz
router.get('/ListarAprendis/:idAprendis', [
    validarJWT,
    check('idAprendis', 'El ID es inválido').isMongoId(),
    check('idAprendis').custom(aprendicesHelper.existeAprendizID),
    validarCampos,
], bitacoraController.listarPorAprendis);

// Ruta para listar bitácoras por ID de Ficha
router.get('/ListarFicha/:IdFicha', [
    validarJWT,
], bitacoraController.listarPorFicha);

// Ruta para listar bitácoras entre dos fechas
router.get('/ListarPorFechas', [
    validarJWT,
    check('fechaInicio', 'Fecha de inicio inválida').isISO8601(),
    check('fechaFin', 'Fecha de fin inválida').isISO8601(),
    validarCampos
], bitacoraController.listarPorFechas);

router.put('/ActualizarEstado/:id', [
    validarJWT,
    check('id', 'El ID de la bitácora es inválido').isMongoId(),
    check('id').custom(BitacorasHelper.existeBitacoraId),
    check('estado', 'El estado es obligatorio').not().isEmpty(),
    check('estado').isIn(['pendiente', 'asistió', 'faltó', 'excusa']),
    validarCampos
], bitacoraController.actualizarEstado);

export default router;
