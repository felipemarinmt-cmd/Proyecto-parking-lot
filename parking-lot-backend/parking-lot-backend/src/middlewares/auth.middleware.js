const jwt = require("jsonwebtoken");

/**
 * Middleware: verifica que el request tenga un JWT válido.
 * Agrega req.user con el payload del token.
 */
const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Token no proporcionado" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Token inválido o expirado" });
    }
};

/**
 * Middleware: verifica que el usuario autenticado tenga perfil de administrador.
 * Debe usarse DESPUÉS de verifyToken.
 */
const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.perfil !== "admin") {
        return res.status(403).json({ error: "Acceso denegado: se requieren permisos de administrador" });
    }
    next();
};

module.exports = { verifyToken, requireAdmin };
