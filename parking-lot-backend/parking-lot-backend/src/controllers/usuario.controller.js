const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario.model");

// POST /api/v1/usuarios/login
const login = async (req, res) => {
    try {
        const { numero_documento, clave } = req.body;

        if (!numero_documento || !clave) {
            return res.status(400).json({ error: "numero_documento y clave son requeridos" });
        }

        const usuario = await Usuario.findByDocumento(numero_documento);
        if (!usuario) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        const match = await bcrypt.compare(clave, usuario.clave);
        if (!match) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        if (usuario.estado !== "activo") {
            return res.status(403).json({ error: "Usuario inactivo. Contacte al administrador." });
        }

        const payload = {
            id: usuario.id_usuario,
            numero_documento: usuario.numero_documento,
            perfil: usuario.perfil || "cliente",
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || "8h",
        });

        res.json({
            message: "Login exitoso",
            token,
            usuario: {
                id: usuario.id_usuario,
                nombre: `${usuario.primer_nombre} ${usuario.primer_apellido}`,
                correo: usuario.direccion_correo,
                perfil: usuario.perfil,
            },
        });
    } catch (err) {
        res.status(500).json({ error: "Error en el servidor", detalle: err.message });
    }
};

// POST /api/v1/usuarios/register
const register = async (req, res) => {
    try {
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
        } = req.body;

        if (!numero_documento || !clave || !primer_nombre || !primer_apellido) {
            return res.status(400).json({ error: "Faltan campos requeridos" });
        }

        const existe = await Usuario.findByDocumento(numero_documento);
        if (existe) {
            return res.status(409).json({ error: "Ya existe un usuario con ese número de documento" });
        }

        const hashedClave = await bcrypt.hash(clave, 10);

        const id = await Usuario.create({
            tipo_documento,
            numero_documento,
            primer_nombre,
            segundo_nombre,
            primer_apellido,
            segundo_apellido,
            direccion_correo,
            numero_celular,
            foto_perfil,
            clave: hashedClave,
            PERFIL_USUARIO_id: PERFIL_USUARIO_id || 2,
        });

        res.status(201).json({ message: "Usuario creado exitosamente", id });
    } catch (err) {
        res.status(500).json({ error: "Error al crear usuario", detalle: err.message });
    }
};

// GET /api/v1/usuarios
const getAll = async (req, res) => {
    try {
        const usuarios = await Usuario.getAll();
        // No exponer la clave
        const result = usuarios.map(({ clave, ...u }) => u);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener usuarios", detalle: err.message });
    }
};

// GET /api/v1/usuarios/:documento
const getByDocumento = async (req, res) => {
    try {
        const usuario = await Usuario.findByDocumento(req.params.documento);
        if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
        const { clave, ...result } = usuario;
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener usuario", detalle: err.message });
    }
};

// PUT /api/v1/usuarios/:id
const update = async (req, res) => {
    try {
        await Usuario.update(req.params.id, req.body);
        res.json({ message: "Usuario actualizado correctamente" });
    } catch (err) {
        res.status(500).json({ error: "Error al actualizar usuario", detalle: err.message });
    }
};

// PATCH /api/v1/usuarios/:id/estado
const updateEstado = async (req, res) => {
    try {
        const { estado } = req.body;
        if (!["activo", "inactivo"].includes(estado)) {
            return res.status(400).json({ error: "Estado inválido. Use 'activo' o 'inactivo'" });
        }
        await Usuario.updateEstado(req.params.id, estado);
        res.json({ message: `Estado del usuario actualizado a '${estado}'` });
    } catch (err) {
        res.status(500).json({ error: "Error al actualizar estado", detalle: err.message });
    }
};

module.exports = { login, register, getAll, getByDocumento, update, updateEstado };
