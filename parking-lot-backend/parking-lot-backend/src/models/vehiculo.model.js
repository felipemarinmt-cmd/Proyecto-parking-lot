const db = require("../config/db");

const Vehiculo = {
  // Obtener todos los vehículos con su propietario
  getAll: async () => {
    const [rows] = await db.query(`
      SELECT 
        v.*,
        u.primer_nombre, u.primer_apellido,
        u.numero_documento AS documento_propietario
      FROM VEHICULO v
      LEFT JOIN USUARIO u ON v.USUARIO_id_usuario = u.id_usuario
    `);
    return rows;
  },

  // Buscar vehículo por ID
  findById: async (id) => {
    const [rows] = await db.query(
      `SELECT 
        v.*,
        u.primer_nombre, u.primer_apellido
       FROM VEHICULO v
       LEFT JOIN USUARIO u ON v.USUARIO_id_usuario = u.id_usuario
       WHERE v.id = ?`,
      [id],
    );
    return rows[0];
  },

  // Buscar vehículo por placa
  findByPlaca: async (placa) => {
    const [rows] = await db.query("SELECT * FROM VEHICULO WHERE placa = ?", [
      placa,
    ]);
    return rows[0];
  },

  // Obtener vehículos de un usuario específico
  findByUsuario: async (id_usuario) => {
    const [rows] = await db.query(
      "SELECT * FROM VEHICULO WHERE USUARIO_id_usuario = ?",
      [id_usuario],
    );
    return rows;
  },

  // Crear nuevo vehículo
  create: async (vehiculoData) => {
    const { placa, color, modelo, marca, tipo, USUARIO_id_usuario } =
      vehiculoData;

    const [result] = await db.query(
      `INSERT INTO VEHICULO (placa, color, modelo, marca, tipo, USUARIO_id_usuario)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [placa, color, modelo, marca, tipo, USUARIO_id_usuario],
    );
    return result.insertId;
  },

  // Actualizar datos del vehículo (solo admin)
  update: async (id, data) => {
    const { placa, color, modelo, marca, tipo } = data;

    await db.query(
      `UPDATE VEHICULO SET 
        placa = ?, color = ?, modelo = ?, marca = ?, tipo = ?
       WHERE id = ?`,
      [placa, color, modelo, marca, tipo, id],
    );
  },

  // Reasignar vehículo a otro usuario (solo admin)
  asignarUsuario: async (id_vehiculo, id_usuario) => {
    await db.query("UPDATE VEHICULO SET USUARIO_id_usuario = ? WHERE id = ?", [
      id_usuario,
      id_vehiculo,
    ]);
  },
};

module.exports = Vehiculo;
