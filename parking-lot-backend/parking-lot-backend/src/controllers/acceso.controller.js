const Acceso = require("../models/acceso.model");
const celda = require("../models/celda.model");
const vehiculo = require("../models/vehiculo.model");

// GET /api/v1/accesos
const getAll = async (req, res) => {
    try {
        const accesos = await Acceso.getAll();
        res.json(accesos);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener accesos", detalle: err.message });
    }
};

// GET /api/v1/accesos/activos
const getActivos = async (req, res) => {
    try {
        const activos = await Acceso.getActivos();
        res.json(activos);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener accesos activos", detalle: err.message });
    }
};

// GET /api/v1/accesos/:id
const getById = async (req, res) => {
    try {
        const acceso = await Acceso.findById(req.params.id);
        if (!acceso) return res.status(404).json({ error: "Acceso no encontrado" });
        res.json(acceso);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener acceso", detalle: err.message });
    }
};

// POST /api/v1/accesos/entrada
const registrarEntrada = async (req, res) => {
    try {
        const { vehiculo_id, celda_id, usuario_id } = req.body;

        if (!vehiculo_id || !celda_id) {
            return res.status(400).json({ error: "vehiculo_id y celda_id son requeridos" });
        }

        // Verificar que la celda esté disponible
        const celdaData = await celda.findById(celda_id);
        if (!celdaData) return res.status(404).json({ error: "Celda no encontrada" });
        if (celdaData.estado !== "disponible") {
            return res.status(409).json({ error: `La celda no está disponible. Estado actual: ${celdaData.estado}` });
        }

        // Verificar que el vehículo no tenga ya un acceso activo
        const accesoActivo = await Acceso.findActivoByVehiculo(vehiculo_id);
        if (accesoActivo) {
            return res.status(409).json({ error: "El vehículo ya tiene un acceso activo en el parqueadero" });
        }

        // Registrar entrada
        const id_acceso = await Acceso.registrarEntrada({
            vehiculo_id,
            celda_id,
            usuario_id: usuario_id || req.user?.id,
        });

        // Actualizar celda a ocupada
        await celda.updateEstado(celda_id, "ocupada");

        res.status(201).json({ message: "Entrada registrada exitosamente", id_acceso });
    } catch (err) {
        res.status(500).json({ error: "Error al registrar entrada", detalle: err.message });
    }
};

// PATCH /api/v1/accesos/:id/salida
const registrarSalida = async (req, res) => {
    try {
        const acceso = await Acceso.findById(req.params.id);
        if (!acceso) return res.status(404).json({ error: "Acceso no encontrado" });
        if (acceso.estado !== "activo") {
            return res.status(409).json({ error: "El acceso ya fue finalizado" });
        }

        // Registrar salida
        await Acceso.registrarSalida(req.params.id);

        // Liberar la celda
        await celda.updateEstado(acceso.celda_id, "disponible");

        res.json({ message: "Salida registrada exitosamente" });
    } catch (err) {
        res.status(500).json({ error: "Error al registrar salida", detalle: err.message });
    }
};

module.exports = { getAll, getActivos, getById, registrarEntrada, registrarSalida };
