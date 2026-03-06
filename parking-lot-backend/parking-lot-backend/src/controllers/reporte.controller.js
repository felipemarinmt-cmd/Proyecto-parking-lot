const Reporte = require("../models/reporte.model");

// GET /api/v1/reportes/dia
const getResumenDia = async (req, res) => {
    try {
        const resumen = await Reporte.getResumenDia();
        res.json(resumen);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener resumen del día", detalle: err.message });
    }
};

// GET /api/v1/reportes/ocupacion
const getOcupacionActual = async (req, res) => {
    try {
        const ocupacion = await Reporte.getOcupacionActual();
        res.json(ocupacion);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener ocupación", detalle: err.message });
    }
};

// GET /api/v1/reportes/historial?fecha=YYYY-MM-DD
const getHistorialPorFecha = async (req, res) => {
    try {
        const { fecha } = req.query;
        const historial = await Reporte.getHistorialPorFecha(fecha);
        res.json(historial);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener historial", detalle: err.message });
    }
};

// GET /api/v1/reportes/ingresos?inicio=YYYY-MM-DD&fin=YYYY-MM-DD
const getIngresosPorPeriodo = async (req, res) => {
    try {
        const { inicio, fin } = req.query;
        if (!inicio || !fin) {
            return res.status(400).json({ error: "Se requieren los parámetros 'inicio' y 'fin' (formato YYYY-MM-DD)" });
        }
        const ingresos = await Reporte.getIngresosPorPeriodo(inicio, fin);
        res.json(ingresos);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener ingresos", detalle: err.message });
    }
};

module.exports = { getResumenDia, getOcupacionActual, getHistorialPorFecha, getIngresosPorPeriodo };
