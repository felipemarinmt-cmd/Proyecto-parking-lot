const express = require("express");
const router = express.Router();
const { getAll, getActivos, getById, registrarEntrada, registrarSalida } = require("../controllers/acceso.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

// IMPORTANTE: rutas estáticas antes de las parametrizadas
router.get("/activos", verifyToken, getActivos);
router.get("/", verifyToken, getAll);
router.get("/:id", verifyToken, getById);
router.post("/entrada", verifyToken, registrarEntrada);
router.patch("/:id/salida", verifyToken, registrarSalida);

module.exports = router;
