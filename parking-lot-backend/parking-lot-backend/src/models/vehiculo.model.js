const db = require("../config/db");

const vehiculo = {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM VEHICULO");
    return rows;
  },

  findByDocumento: async (placa) => {
    const [rows] = await db.query("SELECT * FROM VEHICULO WHERE placa = ?", [placa]);
    return rows[0];
  },

  findByUsuario: async (usuario_id) => {
    const [rows] = await db.query("SELECT * FROM VEHICULO WHERE usuario_id = ?", [usuario_id]);
    return rows;
  },

  create: async (vehiculoData) => {
    const { placa, usuario_id } = vehiculoData;
    const [result] = await db.query(
      "INSERT INTO VEHICULO (placa, usuario_id) VALUES (?, ?)",
      [placa, usuario_id]
    );
    return result;
  },

  update: async (id, data) => {
    const { placa } = data;
    await db.query("UPDATE VEHICULO SET placa = ? WHERE id_vehiculo = ?", [placa, id]);
  },

  delete: async (id) => {
    await db.query("DELETE FROM VEHICULO WHERE id_vehiculo = ?", [id]);
  },
};

module.exports = vehiculo;
