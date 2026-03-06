const db = require("../config/db");

const Acceso = {
    /**
     * Registra la entrada de un vehículo a una celda.
     * Crea el registro de acceso y actualiza el estado de la celda a 'ocupada'.
     */
    registrarEntrada: async ({ vehiculo_id, celda_id, usuario_id }) => {
        const [result] = await db.query(
            `INSERT INTO ACCESO (vehiculo_id, celda_id, usuario_id, fecha_hora_entrada, estado)
       VALUES (?, ?, ?, NOW(), 'activo')`,
            [vehiculo_id, celda_id, usuario_id]
        );
        return result.insertId;
    },

    /**
     * Registra la salida de un acceso activo.
     */
    registrarSalida: async (id_acceso) => {
        await db.query(
            `UPDATE ACCESO SET fecha_hora_salida = NOW(), estado = 'finalizado'
       WHERE id_acceso = ? AND estado = 'activo'`,
            [id_acceso]
        );
    },

    getAll: async () => {
        const [rows] = await db.query(
            `SELECT a.*, v.placa, c.numero_celda
       FROM ACCESO a
       JOIN VEHICULO v ON a.vehiculo_id = v.id_vehiculo
       JOIN CELDA c ON a.celda_id = c.id_celda
       ORDER BY a.fecha_hora_entrada DESC`
        );
        return rows;
    },

    findById: async (id) => {
        const [rows] = await db.query(
            `SELECT a.*, v.placa, c.numero_celda
       FROM ACCESO a
       JOIN VEHICULO v ON a.vehiculo_id = v.id_vehiculo
       JOIN CELDA c ON a.celda_id = c.id_celda
       WHERE a.id_acceso = ?`,
            [id]
        );
        return rows[0];
    },

    getActivos: async () => {
        const [rows] = await db.query(
            `SELECT a.*, v.placa, c.numero_celda
       FROM ACCESO a
       JOIN VEHICULO v ON a.vehiculo_id = v.id_vehiculo
       JOIN CELDA c ON a.celda_id = c.id_celda
       WHERE a.estado = 'activo'
       ORDER BY a.fecha_hora_entrada DESC`
        );
        return rows;
    },

    findActivoByVehiculo: async (vehiculo_id) => {
        const [rows] = await db.query(
            `SELECT * FROM ACCESO WHERE vehiculo_id = ? AND estado = 'activo'`,
            [vehiculo_id]
        );
        return rows[0];
    },

    getByVehiculo: async (vehiculo_id) => {
        const [rows] = await db.query(
            `SELECT * FROM ACCESO WHERE vehiculo_id = ? ORDER BY fecha_hora_entrada DESC`,
            [vehiculo_id]
        );
        return rows;
    },
};

module.exports = Acceso;
