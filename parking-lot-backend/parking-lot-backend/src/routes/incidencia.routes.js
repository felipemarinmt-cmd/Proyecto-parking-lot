const express = require("express");
const router = express.Router();
const { getAll, getById, create, update, deleteIncidencia } = require("../controllers/incidencia.controller");
const { verifyToken, requireAdmin } = require("../middlewares/auth.middleware");

router.get("/", verifyToken, getAll);
router.get("/:id", verifyToken, getById);
router.post("/", verifyToken, create);
router.put("/:id", verifyToken, update);
router.delete("/:id", verifyToken, requireAdmin, deleteIncidencia);

module.exports = router;
