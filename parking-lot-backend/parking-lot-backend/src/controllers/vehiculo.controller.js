const vehiculo = require("../models/vehiculo.model");

// GET /api/v1/vehiculos
const getAll = async (req, res) => {
    try {
        const vehiculos = await vehiculo.getAll();
        res.json(vehiculos);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener vehículos", detalle: err.message });
    }
};

// GET /api/v1/vehiculos/:placa
const getByPlaca = async (req, res) => {
    try {
        const v = await vehiculo.findByDocumento(req.params.placa);
        if (!v) return res.status(404).json({ error: "Vehículo no encontrado" });
        res.json(v);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener vehículo", detalle: err.message });
    }
};

// POST /api/v1/vehiculos
const create = async (req, res) => {
    try {
        const { placa, usuario_id } = req.body;
        if (!placa || !usuario_id) {
            return res.status(400).json({ error: "placa y usuario_id son requeridos" });
        }

        const existe = await vehiculo.findByDocumento(placa);
        if (existe) {
            return res.status(409).json({ error: "Ya existe un vehículo con esa placa" });
        }

        const result = await vehiculo.create({ placa, usuario_id });
        res.status(201).json({ message: "Vehículo registrado", id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: "Error al crear vehículo", detalle: err.message });
    }
};

// PUT /api/v1/vehiculos/:id
const update = async (req, res) => {
    try {
        await vehiculo.update(req.params.id, req.body);
        res.json({ message: "Vehículo actualizado correctamente" });
    } catch (err) {
        res.status(500).json({ error: "Error al actualizar vehículo", detalle: err.message });
    }
};

// DELETE /api/v1/vehiculos/:id
const deleteVehiculo = async (req, res) => {
    try {
        await vehiculo.delete(req.params.id);
        res.json({ message: "Vehículo eliminado correctamente" });
    } catch (err) {
        res.status(500).json({ error: "Error al eliminar vehículo", detalle: err.message });
    }
};

module.exports = { getAll, getByPlaca, create, update, deleteVehiculo };
