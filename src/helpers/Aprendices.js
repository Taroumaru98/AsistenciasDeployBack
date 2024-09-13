import Aprendices from "../models/Aprendices.js";

const aprendicesHelper = {
    existeAprendizID: async (id) => {
        try {
            console.log(`Buscando aprendiz con ID: ${id}`);
            const existe = await Aprendices.findById(id);
            if (!existe) {
                console.error(`El Aprendiz con ID ${id} no existe`);
                throw new Error(`El Aprendiz con ID ${id} no existe`);
            }
            return existe;
        } catch (error) {
            console.error(`Error al buscar el aprendiz por ID: ${error.message}`);
            throw new Error(`Error al buscar el aprendiz por ID: ${error.message}`);
        }
    },
    
    existecc: async (cc, id) => {
        try {
            // Verificar si existe un aprendiz con el mismo cc pero con un id diferente
            const existe = await Aprendices.findOne({ cc, _id: { $ne: id } });
            if (existe) {
                throw new Error(`Ya existe ese cc en la base de datos: ${cc}`);
            }
        } catch (error) {
            throw new Error(`Error al verificar cc: ${error.message}`);
        }
    },

    verificarcc: async (cc) => {
        try {
            const existe = await Aprendices.findOne({ cc });
            if (!existe) {
                throw new Error(`El cc ${cc} no está registrado`);
            }
            return existe;
        } catch (error) {
            throw new Error(`Error al verificar cc: ${error.message}`);
        }
    },

    existeEmail: async (email, id) => {
        try {
            // Verificar si existe un aprendiz con el mismo email pero con un id diferente
            const existe = await Aprendices.findOne({ email, _id: { $ne: id } });
            if (existe) {
                throw new Error(`Ya existe ese email en la base de datos: ${email}`);
            }
        } catch (error) {
            throw new Error(`Error al verificar email: ${error.message}`);
        }
    }
};

export { aprendicesHelper };
