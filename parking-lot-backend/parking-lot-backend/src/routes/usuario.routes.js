const express = require("express");
const router = express.Router();
const { login, register, getAll, getByDocumento, update, updateEstado } = require("../controllers/usuario.controller");
const { verifyToken, requireAdmin } = require("../middlewares/auth.middleware");

router.post("/login", login);
router.post("/register", register);

router.get("/", verifyToken, requireAdmin, getAll);
router.get("/:documento", verifyToken, getByDocumento);
router.put("/:id", verifyToken, update);
router.patch("/:id/estado", verifyToken, requireAdmin, updateEstado);

module.exports = router;
