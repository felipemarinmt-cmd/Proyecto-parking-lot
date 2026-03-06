const db = require("../config/db");

const celda = {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM CELDA");
    return rows;
  },

  getDisponibles: async () => {
    const [rows] = await db.query("SELECT * FROM CELDA WHERE estado = 'disponible'");
    return rows;
  },
  
  getOcupadas: async () => {
    const [rows] = await db.query("SELECT * FROM CELDA WHERE estado = 'ocupada'");
    return rows;
  },

  findById: async (id) => {
    const [rows] = await db.query("SELECT * FROM CELDA WHERE id_celda = ?", [id]);
    return rows[0];
  },

  findByIdTipo: async (id_tipo) => {
    const [rows] = await db.query("SELECT * FROM CELDA WHERE TIPO_CELDA_id_tipo_celda = ?", [id_tipo]);
    return rows;
  },

  updateEstado: async (id, estado) => {
    await db.query("UPDATE CELDA SET estado = ? WHERE id_celda = ?", [estado, id]);
  }
};

module.exports = celda;