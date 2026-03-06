// Elementos de la UI
const loginScreen = document.getElementById('login-screen');
const dashScreen = document.getElementById('dashboard-screen');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');

const userNameEl = document.getElementById('user-name');
const userRoleEl = document.getElementById('user-role');

const kpiTotal = document.getElementById('kpi-total');
const kpiDisponibles = document.getElementById('kpi-disponibles');
const kpiOcupadas = document.getElementById('kpi-ocupadas');

const parkingGrid = document.getElementById('parking-grid');
const selectCelda = document.getElementById('select-celda');
const activityList = document.getElementById('activity-list');
const ingresoForm = document.getElementById('ingreso-form');

// Estado Global
let state = {
    celdas: [],
    activos: []
};

// --- INIT APP ---
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('parklot_token');
    if (token) {
        showDashboard();
    } else {
        showLogin();
    }
});

// --- AUTENTICACIÓN ---
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const doc = document.getElementById('login-doc').value;
    const pwd = document.getElementById('login-pwd').value;

    try {
        const res = await API.login(doc, pwd);
        localStorage.setItem('parklot_token', res.token);
        localStorage.setItem('parklot_user', JSON.stringify(res.usuario));
        showDashboard();
    } catch (err) {
        loginError.textContent = err.message;
        loginError.classList.remove('hide');
    }
});

document.getElementById('btn-logout').addEventListener('click', () => {
    localStorage.removeItem('parklot_token');
    localStorage.removeItem('parklot_user');
    showLogin();
});

function showLogin() {
    dashScreen.classList.add('hide');
    loginScreen.classList.remove('hide');
}

function showDashboard() {
    loginScreen.classList.add('hide');
    dashScreen.classList.remove('hide');

    const user = JSON.parse(localStorage.getItem('parklot_user'));
    userNameEl.textContent = user.nombre;
    userRoleEl.textContent = user.perfil.toUpperCase();

    loadDashboardData();
}

// --- CARGA DE DATOS ---
async function loadDashboardData() {
    try {
        console.log("Cargando datos del dashboard...");
        const [celdasData, activosData] = await Promise.all([
            API.getCeldas(),
            API.getAccesosActivos()
        ]);

        console.log("Celdas obtenidas:", celdasData);
        console.log("Accesos obtenidos:", activosData);

        state.celdas = celdasData;
        state.activos = activosData;

        renderKPIs();
        renderCeldas();
        renderActivos();
    } catch (err) {
        console.error("Error cargando dashboard o token vencido", err);
        alert("Error cargando el dashboard: " + err.message);
    }
}

function renderKPIs() {
    const disp = state.celdas.filter(c => c.estado === 'disponible').length;
    const ocup = state.celdas.filter(c => c.estado === 'ocupada').length;

    kpiTotal.textContent = state.celdas.length;
    kpiDisponibles.textContent = disp;
    kpiOcupadas.textContent = ocup;
}

function renderCeldas() {
    parkingGrid.innerHTML = '';
    selectCelda.innerHTML = '<option value="" disabled selected>Elegir Celda (Libres)</option>';

    // Ordenar celdas alfabéticamente
    const sortedCeldas = [...state.celdas].sort((a, b) => a.numero_celda.localeCompare(b.numero_celda));

    sortedCeldas.forEach(c => {
        // Para el grid visual
        const el = document.createElement('div');
        const isDisponible = c.estado === 'disponible';
        el.className = `celda-item ${isDisponible ? 'celda-disponible' : 'celda-ocupada'}`;
        el.innerHTML = `
      ${c.numero_celda}
      ${!isDisponible ? '<span>Ocupada</span>' : '<span>Libre</span>'}
    `;
        parkingGrid.appendChild(el);

        // Para el select box del formulario
        if (isDisponible) {
            const opt = document.createElement('option');
            opt.value = c.id_celda;
            opt.textContent = `${c.numero_celda} - Libre`;
            selectCelda.appendChild(opt);
        }
    });
}

function renderActivos() {
    if (state.activos.length === 0) {
        activityList.innerHTML = '<div class="list-empty">No hay vehículos registrados activos.</div>';
        return;
    }

    activityList.innerHTML = '';
    state.activos.forEach(a => {
        // Formato de hora simple
        const horaInfo = new Date(a.fecha_hora_entrada).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const div = document.createElement('div');
        div.className = 'activity-item';
        div.innerHTML = `
      <div class="act-info">
        <h4>Placa: ${a.placa ? a.placa.toUpperCase() : 'N/A'}</h4>
        <p>Celda ${a.numero_celda} • Ingreso: ${horaInfo}</p>
      </div>
      <button class="btn-sm-danger" onclick="darSalida(${a.id_acceso})">Da Salida</button>
    `;
        activityList.appendChild(div);
    });
}

// --- ACCIONES (Ingreso y Salida) ---

ingresoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const placa = document.getElementById('nueva-placa').value.toUpperCase();
    const celda_id = selectCelda.value;

    if (!placa || !celda_id) return;

    try {
        let vehiculo_id = null;

        try {
            // Check if vehicle exists
            const vRes = await API.fetch(`/vehiculos/${placa}`);
            // If API returns an array (from some backends), take the first element or handle differently
            // Based on backend vehiculo.controller.js it returns a single object if found.
            vehiculo_id = vRes.id_vehiculo;
        } catch {
            // Create if it doesn't exist
            const user = JSON.parse(localStorage.getItem('parklot_user'));
            const createRes = await API.registrarVehiculo(placa);
            vehiculo_id = createRes.id;
        }

        if (!vehiculo_id) {
            throw new Error("No se pudo obtener ni registrar el vehículo.");
        }

        // Registrar el acceso
        await API.registrarEntrada(vehiculo_id, celda_id);

        // Resetear formulario y recargar
        ingresoForm.reset();
        loadDashboardData();

        alert(`Ingreso de ${placa} registrado correctamente.`);

    } catch (err) {
        alert(`Error: ${err.message}`);
    }
});

window.darSalida = async function (id_acceso) {
    if (!confirm('¿Marcar salida de este vehículo?')) return;

    try {
        await API.registrarSalida(id_acceso);
        loadDashboardData(); // Refrescar pantalla
    } catch (err) {
        alert(`Error dando salida: ${err.message}`);
    }
};
