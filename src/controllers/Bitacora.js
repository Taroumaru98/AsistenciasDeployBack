import Bitacora from '../models/Bitacora.js';
import Aprendices from '../models/Aprendices.js';

const bitacoraController = {
    crearBitacora: async (req, res) => {
        const { cc, fecha } = req.body;
        try {
    
            const aprendiz = await Aprendices.findOne({ cc });
            
            
    
            if (!aprendiz) {
                return res.status(404).json({ error: 'Aprendiz no encontrado' });
            }
            
            const nuevaBitacora = new Bitacora({
                IdAprendis: aprendiz._id,
                fecha: fecha || Date.now(),
                estado: 'pendiente' 
            });
            const resultado = await nuevaBitacora.save();
            console.log('Bitácora creada:', resultado);
            res.status(201).json(resultado);
        } catch (error) {
            console.error('Error al crear bitácora:', error);
            res.status(500).json({ error: 'Error al crear bitácora' });
        }
    },
    
    // Listar todas las entradas de bitácora
    listarTodo: async (req, res) => {
        try {
            const bitacoras = await Bitacora.find({})
                .populate({
                    path: 'IdAprendis',
                    populate: { path: 'IdFicha' }
                })
                .exec();

            console.log(bitacoras);
            res.json(bitacoras);
        } catch (error) {
            console.error('Error al listar las entradas de bitácora:', error);
            res.status(500).json({ error: 'Error al listar las entradas de bitácora' });
        }
    },

    // Listar entradas de bitácora por ID de Aprendis
    listarPorAprendis: async (req, res) => {
        const { idAprendis } = req.params;
        try {
            const bitacoras = await Bitacora.find({ IdAprendis: idAprendis });
            console.log(`Lista de entradas de bitácora para el aprendiz ${idAprendis}:`, bitacoras);
            res.json(bitacoras);
        } catch (error) {
            console.error(`Error al listar las entradas de bitácora para el aprendiz ${idAprendis}:`, error);
            res.status(500).json({ error: `Error al listar las entradas de bitácora para el aprendiz ${idAprendis}` });
        }
    },

    // Listar entradas de bitácora por ID de Ficha (si aplicable)
    listarPorFicha: async (req, res) => {
        const { IdFicha } = req.params;
        try {
            const bitacoras = await Bitacora.find()
                .populate({
                    path: 'IdAprendis',
                    match: { IdFicha }
                });
    
            const filteredBitacoras = bitacoras.filter(bitacora => bitacora.IdAprendis);
    
            console.log(`Lista de entradas de bitácora para la ficha ${IdFicha}:`, filteredBitacoras);
            res.json(filteredBitacoras);
        } catch (error) {
            console.error(`Error al listar las entradas de bitácora para la ficha ${IdFicha}:`, error);
            res.status(500).json({ error: `Error al listar las entradas de bitácora para la ficha ${IdFicha}` });
        }
    },
    

    // Listar entradas de bitácora entre dos fechas
    listarPorFechas: async (req, res) => {
        const { fechaInicio, fechaFin } = req.query; // Obtener fechas del query params
        try {
            // Convertir fechas a objetos Date
            const startDate = new Date(fechaInicio);
            const endDate = new Date(fechaFin);

            // Asegurarse de que las fechas sean válidas
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                return res.status(400).json({ error: 'Fechas inválidas' });
            }

            // Obtener bitácoras entre las fechas
            const bitacoras = await Bitacora.find({
                fecha: {
                    $gte: startDate,
                    $lte: endDate
                }
            })
            .populate({
                path: 'IdAprendis',
                populate: { path: 'IdFicha' }
            })
            .exec();

            console.log(`Lista de entradas de bitácora entre ${fechaInicio} y ${fechaFin}:`, bitacoras);
            res.json(bitacoras);
        } catch (error) {
            console.error(`Error al listar las entradas de bitácora entre ${fechaInicio} y ${fechaFin}:`, error);
            res.status(500).json({ error: `Error al listar las entradas de bitácora entre ${fechaInicio} y ${fechaFin}` });
        }
    },
    actualizarEstado: async (req, res) => {
        const { id } = req.params;
        const { estado } = req.body;

        const estadosPermitidos = ['pendiente', 'asistió', 'faltó', 'excusa'];
        if (!estadosPermitidos.includes(estado)) {
            return res.status(400).json({ error: 'Estado no válido' });
        }

        try {
            const bitacoraActualizada = await Bitacora.findByIdAndUpdate(
                id,
                { estado },
                { new: true } 
            );

            if (!bitacoraActualizada) {
                return res.status(404).json({ error: 'Bitácora no encontrada' });
            }

            console.log('Bitácora actualizada:', bitacoraActualizada);
            res.json(bitacoraActualizada);
        } catch (error) {
            console.error('Error al actualizar el estado de la bitácora:', error);
            res.status(500).json({ error: 'Error al actualizar el estado de la bitácora' });
        }
    }
};

export default bitacoraController;
