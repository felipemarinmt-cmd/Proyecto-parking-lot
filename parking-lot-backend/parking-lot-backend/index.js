const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middlewares globales
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
const usuarioRoutes = require("./src/routes/usuario.routes");
const vehiculoRoutes = require("./src/routes/vehiculo.routes");
const celdaRoutes = require("./src/routes/celda.routes");
const accesoRoutes = require("./src/routes/acceso.routes");
const incidenciaRoutes = require("./src/routes/incidencia.routes");
const reporteRoutes = require("./src/routes/reporte.routes");

app.use("/api/v1/usuarios", usuarioRoutes);
app.use("/api/v1/vehiculos", vehiculoRoutes);
app.use("/api/v1/celdas", celdaRoutes);
app.use("/api/v1/accesos", accesoRoutes);
app.use("/api/v1/incidencias", incidenciaRoutes);
app.use("/api/v1/reportes", reporteRoutes);

// Ruta base
app.get("/", (req, res) => {
    res.json({ message: "Parking Lot API v1 - OK" });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ error: "Ruta no encontrada" });
});

// Manejo global de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Error interno del servidor", detalle: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
