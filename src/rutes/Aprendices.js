import express from 'express';
import { check } from 'express-validator';
import controladorAprendis from '../controllers/Aprendices.js';
import { validarJWT } from '../middleware/validarJWT.js';
import { validarCampos } from '../middleware/validar-campos.js';
import { aprendicesHelper } from '../helpers/Aprendices.js';
import { fichasHelper } from '../helpers/Fichas.js';

const router = express.Router();

// POST /api/aprendices
router.post('/', [
    validarJWT,
    check('cc', 'El campo cc es obligatorio').not().isEmpty(),
    check('cc').custom(async (cc) => {
        await aprendicesHelper.existecc(cc);
    }),
    check('nombre', 'El campo nombre es obligatorio').not().isEmpty(),
    check('email', 'El campo email es obligatorio').not().isEmpty().isEmail(),
    check('email').custom(async (email) => {
        await aprendicesHelper.existeEmail(email);
    }),
    check('telefono', 'El campo telefono es obligatorio').not().isEmpty(),
    check('IdFicha', 'El campo IdFicha es obligatorio y debe ser un Mongo ID').not().isEmpty().isMongoId(),
    check('IdFicha').custom(async (IdFicha) => {
        await fichasHelper.existeFichaID(IdFicha);
    }),
    validarCampos
], controladorAprendis.crearAprendis);

// GET /api/aprendices/listar
router.get('/listar', [
    validarJWT
], controladorAprendis.listarAprendis);

// DELETE /api/aprendices/eliminar/:id
router.delete('/eliminar/:id', [
    validarJWT,
    check('id', 'El ID proporcionado no es válido').isMongoId(),
    check('id').custom(aprendicesHelper.existeAprendizID),
    validarCampos
], controladorAprendis.eliminarAprendis);

// PUT /api/aprendices/editar/:id
router.put('/editar/:id', [
    validarJWT,
    check('id', 'El ID proporcionado no es válido').isMongoId(),
    check('cc', 'El campo cc es obligatorio').optional().not().isEmpty(),
    check('cc').custom(async (cc, { req }) => {
        await aprendicesHelper.existecc(cc, req.params.id);
    }),
    check('nombre', 'El campo nombre es obligatorio').optional().not().isEmpty(),
    check('email', 'El campo email es obligatorio').optional().not().isEmpty().isEmail(),
    check('email').custom(async (email, { req }) => {
        await aprendicesHelper.existeEmail(email, req.params.id);
    }),
    check('telefono', 'El campo telefono es obligatorio').optional().not().isEmpty(),
    check('IdFicha', 'El campo IdFicha es obligatorio').optional().not().isEmpty().isMongoId(),
    check('IdFicha').custom(async (IdFicha) => {
        await fichasHelper.existeFichaID(IdFicha);
    }),
    validarCampos
], controladorAprendis.editarAprendis);

// PUT /api/aprendices/activarDesactivarAprendiz/:id
router.put('/activarDesactivarAprendiz/:id', [
    validarJWT,
    check('id', 'ID inválido').isMongoId(),
    check('id').custom(aprendicesHelper.existeAprendizID),
    validarCampos
], controladorAprendis.activarDesactivarAprendiz);

export default router;
