const express = require("express");
const router = express.Router();
const { getAll, getByPlaca, create, update, deleteVehiculo } = require("../controllers/vehiculo.controller");
const { verifyToken, requireAdmin } = require("../middlewares/auth.middleware");

router.get("/", verifyToken, getAll);
router.get("/:placa", verifyToken, getByPlaca);
router.post("/", verifyToken, create);
router.put("/:id", verifyToken, update);
router.delete("/:id", verifyToken, requireAdmin, deleteVehiculo);

module.exports = router;
