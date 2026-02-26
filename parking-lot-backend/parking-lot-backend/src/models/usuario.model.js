const db = require("../config/db");

const Usuario = {
  // Obtener todos los usuarios
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM USUARIO");
    return rows;
  },

  // Buscar usuario por número de documento
  findByDocumento: async (numero_documento) => {
    const [rows] = await db.query(
      "SELECT * FROM USUARIO WHERE numero_documento = ?",
      [numero_documento],
    );
    return rows[0]; // Devuelve solo el primero
  },

  // Crear un nuevo usuario
  create: async (userData) => {
    const {
      tipo_documento,
      numero_documento,
      primer_nombre,
      segundo_nombre,
      primer_apellido,
      segundo_apellido,
      direccion_correo,
      numero_celular,
      foto_perfil,
      clave,
      PERFIL_USUARIO_id,
    } = userData;

    const [result] = await db.query(
      `INSERT INTO USUARIO 
       (tipo_documento, numero_documento, primer_nombre, segundo_nombre, 
        primer_apellido, segundo_apellido, direccion_correo, numero_celular, 
        foto_perfil, estado, clave, PERFIL_USUARIO_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'activo', ?, ?)`,
      [
        tipo_documento,
        numero_documento,
        primer_nombre,
        segundo_nombre,
        primer_apellido,
        segundo_apellido,
        direccion_correo,
        numero_celular,
        foto_perfil,
        clave,
        PERFIL_USUARIO_id,
      ],
    );
    return result.insertId;
  },

  // Actualizar estado (activo/inactivo)
  updateEstado: async (id, estado) => {
    await db.query("UPDATE USUARIO SET estado = ? WHERE id_usuario = ?", [
      estado,
      id,
    ]);
  },

  // Actualizar datos personales
  update: async (id, data) => {
    const { primer_nombre, primer_apellido, direccion_correo, numero_celular } =
      data;
    await db.query(
      `UPDATE USUARIO SET primer_nombre=?, primer_apellido=?, 
       direccion_correo=?, numero_celular=? WHERE id_usuario=?`,
      [primer_nombre, primer_apellido, direccion_correo, numero_celular, id],
    );
  },
};

module.exports = Usuario;
