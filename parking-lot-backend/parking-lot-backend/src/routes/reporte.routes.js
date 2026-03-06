const express = require("express");
const router = express.Router();
const { getResumenDia, getOcupacionActual, getHistorialPorFecha, getIngresosPorPeriodo } = require("../controllers/reporte.controller");
const { verifyToken, requireAdmin } = require("../middlewares/auth.middleware");

router.get("/dia", verifyToken, requireAdmin, getResumenDia);
router.get("/ocupacion", verifyToken, getOcupacionActual);
router.get("/historial", verifyToken, requireAdmin, getHistorialPorFecha);
router.get("/ingresos", verifyToken, requireAdmin, getIngresosPorPeriodo);

module.exports = router;
