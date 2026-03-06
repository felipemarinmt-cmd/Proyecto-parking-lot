const db = require("../config/db");

const Incidencia = {
    create: async ({ descripcion, fecha, acceso_id, usuario_id }) => {
        const [result] = await db.query(
            `INSERT INTO INCIDENCIA (descripcion, fecha, acceso_id, usuario_id, estado)
       VALUES (?, ?, ?, ?, 'abierta')`,
            [descripcion, fecha || new Date(), acceso_id, usuario_id]
        );
        return result.insertId;
    },

    getAll: async () => {
        const [rows] = await db.query(
            `SELECT i.*, u.primer_nombre, u.primer_apellido
       FROM INCIDENCIA i
       LEFT JOIN USUARIO u ON i.usuario_id = u.id_usuario
       ORDER BY i.fecha DESC`
        );
        return rows;
    },

    findById: async (id) => {
        const [rows] = await db.query(
            `SELECT i.*, u.primer_nombre, u.primer_apellido
       FROM INCIDENCIA i
       LEFT JOIN USUARIO u ON i.usuario_id = u.id_usuario
       WHERE i.id_incidencia = ?`,
            [id]
        );
        return rows[0];
    },

    update: async (id, { descripcion, estado }) => {
        await db.query(
            `UPDATE INCIDENCIA SET descripcion = ?, estado = ? WHERE id_incidencia = ?`,
            [descripcion, estado, id]
        );
    },

    delete: async (id) => {
        await db.query(`DELETE FROM INCIDENCIA WHERE id_incidencia = ?`, [id]);
    },
};

module.exports = Incidencia;
