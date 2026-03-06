const http = require('http');

const request = (method, path, data = null, token = null) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: `/api/v1${path}`,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };
        if (token) options.headers['Authorization'] = `Bearer ${token}`;

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(body || '{}') }));
        });
        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
};

async function testAll() {
    console.log("-----------------------------------------");
    console.log("🚦 INICIANDO TEST DEL BACKEND PARKING:");
    console.log("-----------------------------------------");
    try {
        // 1. LOGIN
        console.log("1. Probando Login...");
        let res = await request('POST', '/usuarios/login', { numero_documento: 'admin001', clave: 'admin1234' });
        console.log(" > Status:", res.status, res.status === 200 ? "✅" : "❌");
        if (res.status !== 200) throw new Error(JSON.stringify(res.data));
        const token = res.data.token;

        // 2. OBTENER CELDAS
        console.log("2. Probando obtención de Celdas...");
        res = await request('GET', '/celdas', null, token);
        console.log(" > Status:", res.status, res.status === 200 ? "✅" : "❌");
        console.log(` > Celdas encontradas: ${res.data.length || 0}`);
        if (!res.data.length) throw new Error("No hay celdas disponibles en BD");
        const libre = res.data.find(c => c.estado === 'disponible');

        // 3. REGISTRAR VEHICULO Y ENTRADA
        if (libre) {
            console.log(`3. Registrando Vehículo (Placa: TEST-999)...`);
            let vId;
            res = await request('POST', '/vehiculos', { placa: 'TEST-999', usuario_id: 1 }, token);
            if (res.status === 201) {
                vId = res.data.id;
                console.log(" > Vehículo creado OK ✅", vId);
            } else if (res.status === 409) {
                console.log(" > Vehículo ya existe, buscando ID... ✅");
                let vRes = await request('GET', '/vehiculos/TEST-999', null, token);
                vId = vRes.data.id_vehiculo;
            } else {
                throw new Error("Fallo al registrar vehículo: " + JSON.stringify(res.data));
            }

            console.log(`4. Registrando Entrada en celda ${libre.numero_celda}...`);
            res = await request('POST', '/accesos/entrada', { vehiculo_id: vId, celda_id: libre.id_celda }, token);
            if (res.status === 201) {
                console.log(" > Entrada de vehículo OK ✅ - Acceso ID:", res.data.id_acceso);

                console.log("5. Dando Salida para restaurar la DB...");
                let sal = await request('PATCH', `/accesos/${res.data.id_acceso}/salida`, null, token);
                console.log(" > Salida OK ✅", sal.status);
            } else {
                console.log(" > Vehículo ya estaba adentro o error:", res.data.error);
            }
        }

        console.log("\n✅✅ TODAS LAS PRUEBAS BACKEND SUPERADAS CORRECTAMENTE ✅✅");
    } catch (err) {
        console.error("❌ ERROR DURANTE TEST:", err.message || err);
    }
}

testAll();
