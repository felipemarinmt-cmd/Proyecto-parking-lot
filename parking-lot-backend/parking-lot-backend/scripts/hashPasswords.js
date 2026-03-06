/**
 * Script utilitario para hashear contraseñas existentes en texto plano
 * y crear un usuario administrador inicial.
 *
 * Uso:
 *   node scripts/hashPasswords.js         → hashea contraseñas existentes
 *   node scripts/hashPasswords.js --seed  → también crea usuario admin
 */

const bcrypt = require("bcryptjs");
const mysql = require("mysql2/promise");
require("dotenv").config();

const args = process.argv.slice(2);
const seedAdmin = args.includes("--seed");

async function main() {
    const db = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    console.log("✅ Conectado a la base de datos");

    // ────────────────────────────────────────────────
    // 1. Hashear contraseñas en texto plano existentes
    // ────────────────────────────────────────────────
    const [usuarios] = await db.query("SELECT id_usuario, clave FROM USUARIO");
    let actualizados = 0;

    for (const u of usuarios) {
        const yaTieneHash = u.clave && u.clave.startsWith("$2");
        if (!yaTieneHash && u.clave) {
            const hashed = await bcrypt.hash(u.clave, 10);
            await db.query("UPDATE USUARIO SET clave = ? WHERE id_usuario = ?", [hashed, u.id_usuario]);
            console.log(`  🔒 Usuario ID ${u.id_usuario} → contraseña hasheada`);
            actualizados++;
        }
    }

    if (actualizados === 0) {
        console.log("  ℹ️  No hay contraseñas en texto plano que migrar.");
    } else {
        console.log(`  ✅ ${actualizados} contraseña(s) migrada(s) a bcrypt.\n`);
    }

    // ────────────────────────────────────────────────
    // 2. (Opcional) Crear usuario administrador inicial
    // ────────────────────────────────────────────────
    if (seedAdmin) {
        const ADMIN = {
            tipo_documento: "CC",
            numero_documento: "admin001",
            primer_nombre: "Admin",
            segundo_nombre: "",
            primer_apellido: "Sistema",
            segundo_apellido: "",
            direccion_correo: "admin@parkinglot.com",
            numero_celular: "3000000000",
            foto_perfil: null,
            clave: "admin1234",          // ← puedes cambiar esta clave antes de correr el script
            PERFIL_USUARIO_id: 1,        // ← asegúrate de que el ID 1 sea el perfil admin en tu DB
        };

        // Verificar si ya existe
        const [existing] = await db.query(
            "SELECT id_usuario FROM USUARIO WHERE numero_documento = ?",
            [ADMIN.numero_documento]
        );

        if (existing.length > 0) {
            console.log("  ⚠️  Ya existe un usuario con documento 'admin001'. No se creó duplicado.");
        } else {
            const hashedClave = await bcrypt.hash(ADMIN.clave, 10);
            await db.query(
                `INSERT INTO USUARIO
         (tipo_documento, numero_documento, primer_nombre, segundo_nombre,
          primer_apellido, segundo_apellido, direccion_correo, numero_celular,
          foto_perfil, estado, clave, PERFIL_USUARIO_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'activo', ?, ?)`,
                [
                    ADMIN.tipo_documento,
                    ADMIN.numero_documento,
                    ADMIN.primer_nombre,
                    ADMIN.segundo_nombre,
                    ADMIN.primer_apellido,
                    ADMIN.segundo_apellido,
                    ADMIN.direccion_correo,
                    ADMIN.numero_celular,
                    ADMIN.foto_perfil,
                    hashedClave,
                    ADMIN.PERFIL_USUARIO_id,
                ]
            );
            console.log("  🎉 Usuario administrador creado:");
            console.log(`     Documento: ${ADMIN.numero_documento}`);
            console.log(`     Clave:     ${ADMIN.clave}  ← ¡Cambia esto en producción!`);
        }
    }

    await db.end();
    console.log("\n✅ Listo.");
}

main().catch((err) => {
    console.error("❌ Error:", err.message);
    process.exit(1);
});
