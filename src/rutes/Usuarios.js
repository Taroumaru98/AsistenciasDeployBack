import express from 'express';
import { check } from 'express-validator';
import usuarioController from '../controllers/usuarios.js';
import { validarJWT } from '../middleware/validarJWT.js';
import { validarCampos } from '../middleware/validar-campos.js';
import { usuarioHelper } from '../helpers/Usuarios.js';
import { validarTokenRecuperacion } from '../middleware/validarJWT.js';

const router = express.Router();

// Rutas para operaciones de Usuario
router.post('/', [
    check('email', 'El email es obligatorio').not().isEmpty(),
    check('email', 'El email no es válido').isEmail(),
    check('email').custom(usuarioHelper.existeEmail),
    check('password', 'La contraseña debe tener al menos 8 caracteres').isLength({ min: 8 }),
    validarCampos
], usuarioController.crearUsuario);

router.post('/login', [
    check('email', 'El email es obligatorio').not().isEmpty(),
    check('email', 'El email no es válido').isEmail(),
    check('password', 'La contraseña debe tener al menos 8 caracteres').isLength({ min: 8 }),
    validarCampos
], usuarioController.login);

router.get('/listar', [
    validarJWT
], usuarioController.listarUsuarios);

router.put('/editar/:id', [
    validarJWT,
    check('id', 'ID inválido').isMongoId(),
    check('email', 'El email es obligatorio').not().isEmpty(),
    check('email', 'El email no es válido').isEmail(),
    validarCampos
], usuarioController.editarUsuario);

router.post('/recuperar-contrasena', usuarioController.enviarCorreoRecuperacion);

router.post('/restablecer-contrasena', validarTokenRecuperacion, usuarioController.restablecerContrasena);
// router.put('/cambiarContrasena/:id', [
//     validarJWT,
//     check('id', 'ID inválido').isMongoId(),
//     check('password', 'La contraseña debe tener al menos 8 caracteres').isLength({ min: 8 }),
//     validarCampos
// ], usuarioController.cambiarContraseña);

router.put('/activarDesactivar/:id', [
    validarJWT,
    check('id', 'ID inválido').isMongoId(),
    validarCampos
], usuarioController.activarDesactivarUsuario);

router.delete('/eliminar/:id', [
    validarJWT,
    check('id', 'ID inválido').isMongoId(),
    validarCampos
], usuarioController.eliminarUsuario);

export default router;