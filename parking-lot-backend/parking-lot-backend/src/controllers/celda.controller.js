const celda = require("../models/celda.model");

// GET /api/v1/celdas
const getAll = async (req, res) => {
    try {
        const celdas = await celda.getAll();
        res.json(celdas);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener celdas", detalle: err.message });
    }
};

// GET /api/v1/celdas/disponibles
const getDisponibles = async (req, res) => {
    try {
        const celdas = await celda.getDisponibles();
        res.json(celdas);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener celdas disponibles", detalle: err.message });
    }
};

// GET /api/v1/celdas/ocupadas
const getOcupadas = async (req, res) => {
    try {
        const celdas = await celda.getOcupadas();
        res.json(celdas);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener celdas ocupadas", detalle: err.message });
    }
};

// GET /api/v1/celdas/:id
const getById = async (req, res) => {
    try {
        const c = await celda.findById(req.params.id);
        if (!c) return res.status(404).json({ error: "Celda no encontrada" });
        res.json(c);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener celda", detalle: err.message });
    }
};

// GET /api/v1/celdas/tipo/:id_tipo
const getByTipo = async (req, res) => {
    try {
        const celdas = await celda.findByIdTipo(req.params.id_tipo);
        res.json(celdas);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener celdas por tipo", detalle: err.message });
    }
};

// PATCH /api/v1/celdas/:id/estado
const updateEstado = async (req, res) => {
    try {
        const { estado } = req.body;
        if (!["disponible", "ocupada", "mantenimiento"].includes(estado)) {
            return res.status(400).json({ error: "Estado inválido. Use 'disponible', 'ocupada' o 'mantenimiento'" });
        }
        await celda.updateEstado(req.params.id, estado);
        res.json({ message: `Estado de la celda actualizado a '${estado}'` });
    } catch (err) {
        res.status(500).json({ error: "Error al actualizar estado de celda", detalle: err.message });
    }
};

module.exports = { getAll, getDisponibles, getOcupadas, getById, getByTipo, updateEstado };
