const Incidencia = require("../models/incidencia.model");

// GET /api/v1/incidencias
const getAll = async (req, res) => {
    try {
        const incidencias = await Incidencia.getAll();
        res.json(incidencias);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener incidencias", detalle: err.message });
    }
};

// GET /api/v1/incidencias/:id
const getById = async (req, res) => {
    try {
        const incidencia = await Incidencia.findById(req.params.id);
        if (!incidencia) return res.status(404).json({ error: "Incidencia no encontrada" });
        res.json(incidencia);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener incidencia", detalle: err.message });
    }
};

// POST /api/v1/incidencias
const create = async (req, res) => {
    try {
        const { descripcion, fecha, acceso_id } = req.body;
        if (!descripcion) {
            return res.status(400).json({ error: "La descripcion es requerida" });
        }
        const id = await Incidencia.create({
            descripcion,
            fecha,
            acceso_id,
            usuario_id: req.user?.id,
        });
        res.status(201).json({ message: "Incidencia registrada", id });
    } catch (err) {
        res.status(500).json({ error: "Error al crear incidencia", detalle: err.message });
    }
};

// PUT /api/v1/incidencias/:id
const update = async (req, res) => {
    try {
        const { descripcion, estado } = req.body;
        if (!descripcion && !estado) {
            return res.status(400).json({ error: "Debe proporcionar descripcion o estado para actualizar" });
        }
        const existe = await Incidencia.findById(req.params.id);
        if (!existe) return res.status(404).json({ error: "Incidencia no encontrada" });

        await Incidencia.update(req.params.id, {
            descripcion: descripcion ?? existe.descripcion,
            estado: estado ?? existe.estado,
        });
        res.json({ message: "Incidencia actualizada correctamente" });
    } catch (err) {
        res.status(500).json({ error: "Error al actualizar incidencia", detalle: err.message });
    }
};

// DELETE /api/v1/incidencias/:id
const deleteIncidencia = async (req, res) => {
    try {
        const existe = await Incidencia.findById(req.params.id);
        if (!existe) return res.status(404).json({ error: "Incidencia no encontrada" });
        await Incidencia.delete(req.params.id);
        res.json({ message: "Incidencia eliminada correctamente" });
    } catch (err) {
        res.status(500).json({ error: "Error al eliminar incidencia", detalle: err.message });
    }
};

module.exports = { getAll, getById, create, update, deleteIncidencia };
