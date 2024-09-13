import Usuario from '../models/Usuarios.js';
import bcryptjs from "bcrypt";
import { generarJWT } from "../middleware/validarJWT.js";
import sendMail from '../services/mailer.js';
import jwt from 'jsonwebtoken';


const usuarioController = {
    // Crear un nuevo usuario
    crearUsuario: async (req, res) => {
        const { email, password, nombre } = req.body;

        try {
            // Verificar si el usuario ya existe
            const usuarioExistente = await Usuario.findOne({ email });
            if (usuarioExistente) {
                return res.status(400).json({ error: 'El usuario ya existe' });
            }

            // Encriptar la contraseña
            const salt = bcryptjs.genSaltSync();
            const passwordEncriptada = bcryptjs.hashSync(password, salt);

            const nuevoUsuario = new Usuario({
                email,
                password: passwordEncriptada,
                nombre
            });

            const resultado = await nuevoUsuario.save();
            console.log('Usuario creado:', resultado);

            res.status(201).json(resultado);
        } catch (error) {
            console.error('Error al crear usuario:', error);
            res.status(500).json({ error: 'Error al crear usuario' });
        }
    },

    enviarCorreoRecuperacion: async (req, res) => {
        const { email } = req.body;

        try {
            // Verificar si el usuario existe
            const usuario = await Usuario.findOne({ email });
            if (!usuario) {
                return res.status(404).json({ error: 'El usuario no existe' });
            }

            // Generar un token de recuperación
            const token = jwt.sign({ uid: usuario._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

            // Crear la URL de restablecimiento
            const resetUrl = "http://localhost:5173/#/uppass";

            // Enviar el correo
            const subject = 'Recuperación de contraseña';
            const text = `Hola ${usuario.nombre}, has solicitado restablecer tu contraseña. 
            Haz clic en el siguiente enlace para continuar: ${resetUrl}`;

            await sendMail(usuario.email, subject, text);

            res.json({ msg: 'Correo de restablecimiento enviado. Revisa tu bandeja de entrada.' });
        } catch (error) {
            console.error('Error al enviar el correo de recuperación:', error);
            res.status(500).json({ error: 'Error al enviar el correo de recuperación' });
        }
    },

    // loguin
    
    login: async (req, res) => {
        const { email, password } = req.body;
        try {
            // Verificar si el usuario existe y si la contraseña es correcta
            const usuario = await Usuario.findOne({ email });

            if (!usuario || usuario.estado === 0 || !bcryptjs.compareSync(password, usuario.password)) {
                return res.status(401).json({
                    msg: "Usuario / Password no son correctos",
                });
            }

            // Generar token JWT
            const token = await generarJWT(usuario._id);

            res.json({
                usuario,
                token,
            });
        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({ msg: "Hable con el WebMaster" });
        }
    },

    // Listar todos los usuarios
    listarUsuarios: async (req, res) => {
        try {
            const usuarios = await Usuario.find();
            console.log('Lista de usuarios:', usuarios);
            res.json(usuarios);
        } catch (error) {
            console.error('Error al listar usuarios:', error);
            res.status(500).json({ error: 'Error al listar usuarios' });
        }
    },

    // Editar un usuario por su ID
    editarUsuario: async (req, res) => {
        const { id } = req.params;
        const { email, nombre } = req.body;

        try {
            const usuarioActualizado = await Usuario.findByIdAndUpdate(id, {
                email,
                nombre
            }, { new: true });

            if (!usuarioActualizado) {
                throw new Error('Usuario no encontrado');
            }

            console.log('Usuario editado:', usuarioActualizado);
            res.json(usuarioActualizado);
        } catch (error) {
            console.error('Error al editar usuario:', error);
            res.status(500).json({ error: 'Error al editar usuario' });
        }
    },

    // Cambiar la contraseña de un usuario por su ID
    restablecerContrasena: async (req, res) => {
        const { token, nuevaPassword } = req.body; // Obtén el token y nueva contraseña del cuerpo de la solicitud
    
        if (!token || !nuevaPassword) {
            return res.status(400).json({ error: 'Token y nueva contraseña son requeridos.' });
        }
    
        try {
            // Verificar y decodificar el token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
            // Buscar al usuario usando el ID del token
            const usuario = await Usuario.findById(decoded.uid);
    
            if (!usuario) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
    
            // Encriptar la nueva contraseña
            const salt = bcryptjs.genSaltSync();
            usuario.password = bcryptjs.hashSync(nuevaPassword, salt);
    
            await usuario.save();
    
            res.json({ msg: 'Contraseña restablecida correctamente' });
        } catch (error) {
            console.error('Error al restablecer contraseña:', error);
            res.status(400).json({ error: 'Token inválido o expirado' });
        }
    },
    

    // Eliminar un usuario por su ID
    eliminarUsuario: async (req, res) => {
        const { id } = req.params;

        try {
            const resultado = await Usuario.findByIdAndDelete(id);

            if (!resultado) {
                throw new Error('Usuario no encontrado');
            }

            console.log('Usuario eliminado:', resultado);
            res.json({ msg: 'Usuario eliminado correctamente' });
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            res.status(500).json({ error: 'Error al eliminar usuario' });
        }
    },

    // Activar o desactivar un usuario por su ID
    activarDesactivarUsuario: async (req, res) => {
        const { id } = req.params;

        try {
            const usuario = await Usuario.findById(id);

            if (!usuario) {
                throw new Error('Usuario no encontrado');
            }

            usuario.estado = usuario.estado === 1 ? 0 : 1; // Alternar estado entre 1 y 0
            await usuario.save();

            const mensaje = usuario.estado === 1 ? 'Usuario activado' : 'Usuario desactivado';
            console.log(mensaje + ':', usuario);
            res.json({ msg: mensaje + ' correctamente' });
        } catch (error) {
            console.error('Error al activar/desactivar usuario:', error);
            res.status(500).json({ error: 'Error al activar/desactivar usuario' });
        }
    }
};

export default usuarioController;