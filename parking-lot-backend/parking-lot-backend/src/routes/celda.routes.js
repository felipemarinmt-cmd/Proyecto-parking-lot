const express = require("express");
const router = express.Router();
const { getAll, getDisponibles, getOcupadas, getById, getByTipo, updateEstado } = require("../controllers/celda.controller");
const { verifyToken, requireAdmin } = require("../middlewares/auth.middleware");

// IMPORTANTE: rutas específicas antes de las parametrizadas
router.get("/disponibles", verifyToken, getDisponibles);
router.get("/ocupadas", verifyToken, getOcupadas);
router.get("/tipo/:id_tipo", verifyToken, getByTipo);
router.get("/", verifyToken, getAll);
router.get("/:id", verifyToken, getById);
router.patch("/:id/estado", verifyToken, requireAdmin, updateEstado);

module.exports = router;
