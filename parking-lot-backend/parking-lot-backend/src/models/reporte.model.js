const db = require("../config/db");

const Reporte = {
    /**
     * Resumen del día: total de accesos, vehículos que entraron y salieron hoy.
     */
    getResumenDia: async () => {
        const [rows] = await db.query(
            `SELECT
         COUNT(*) AS total_accesos,
         SUM(CASE WHEN estado = 'activo' THEN 1 ELSE 0 END) AS vehiculos_en_parqueadero,
         SUM(CASE WHEN estado = 'finalizado' THEN 1 ELSE 0 END) AS vehiculos_salidos
       FROM ACCESO
       WHERE DATE(fecha_hora_entrada) = CURDATE()`
        );
        return rows[0];
    },

    /**
     * Ocupación actual: disponibles vs ocupadas.
     */
    getOcupacionActual: async () => {
        const [rows] = await db.query(
            `SELECT
         SUM(CASE WHEN estado = 'disponible' THEN 1 ELSE 0 END) AS disponibles,
         SUM(CASE WHEN estado = 'ocupada' THEN 1 ELSE 0 END) AS ocupadas,
         COUNT(*) AS total
       FROM CELDA`
        );
        return rows[0];
    },

    /**
     * Historial de accesos filtrado por fecha (sin param = hoy).
     */
    getHistorialPorFecha: async (fecha) => {
        const fechaFiltro = fecha || new Date().toISOString().split("T")[0];
        const [rows] = await db.query(
            `SELECT a.id_acceso, v.placa, c.numero_celda,
              a.fecha_hora_entrada, a.fecha_hora_salida, a.estado
       FROM ACCESO a
       JOIN VEHICULO v ON a.vehiculo_id = v.id_vehiculo
       JOIN CELDA c ON a.celda_id = c.id_celda
       WHERE DATE(a.fecha_hora_entrada) = ?
       ORDER BY a.fecha_hora_entrada DESC`,
            [fechaFiltro]
        );
        return rows;
    },

    /**
     * Total de accesos (ingresos) por período.
     */
    getIngresosPorPeriodo: async (fechaInicio, fechaFin) => {
        const [rows] = await db.query(
            `SELECT DATE(fecha_hora_entrada) AS fecha, COUNT(*) AS total_ingresos
       FROM ACCESO
       WHERE DATE(fecha_hora_entrada) BETWEEN ? AND ?
       GROUP BY DATE(fecha_hora_entrada)
       ORDER BY fecha ASC`,
            [fechaInicio, fechaFin]
        );
        return rows;
    },
};

module.exports = Reporte;
