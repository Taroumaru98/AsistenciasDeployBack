import Bitacoras from "../models/Bitacora.js";

const BitacorasHelper = {
    existeBitacoraId: async (id) => {
        try {
            const existe = await Bitacoras.findById(id);
            if (!existe) {
                throw new Error(`La bitacora con ID ${id} no existe`);
            }
            return existe;
        } catch (error) {
            throw new Error(`Error al buscar la bitacora por ID: ${error.message}`);
        }
    },

}

export { BitacorasHelper };