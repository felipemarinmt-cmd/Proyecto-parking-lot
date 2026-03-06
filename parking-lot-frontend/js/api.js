// API Endpoint Helper
const BASE_URL = 'http://localhost:3000/api/v1';

const apiFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem('parklot_token');

    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: { ...headers, ...options.headers }
    });

    const data = await response.json();

    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem('parklot_token');
            localStorage.removeItem('parklot_user');
            window.location.reload(); // Redirige al login
        }
        throw new Error(data.error || 'Error en la petición API');
    }

    return data;
};

// Servicios exportables
const API = {
    login: (doc, password) => apiFetch('/usuarios/login', {
        method: 'POST',
        body: JSON.stringify({ numero_documento: doc, clave: password })
    }),

    getCeldas: () => apiFetch('/celdas'),

    getAccesosActivos: () => apiFetch('/accesos/activos'),

    registrarVehiculo: (placa) => apiFetch('/vehiculos', {
        method: 'POST',
        body: JSON.stringify({ placa, usuario_id: JSON.parse(localStorage.getItem('parklot_user')).id })
    }),

    registrarEntrada: (vehiculo_id, celda_id) => apiFetch('/accesos/entrada', {
        method: 'POST',
        body: JSON.stringify({ vehiculo_id, celda_id })
    }),

    registrarSalida: (acceso_id) => apiFetch(`/accesos/${acceso_id}/salida`, {
        method: 'PATCH'
    }),

    // Fallback opcional si tienes endpoint de resumen, 
    // pero calcularemos del lado del cliente por simplicidad/rapidez para la demo si no hay admin.

    // Exponiendo la función base para peticiones directas desde app.js
    fetch: apiFetch
};
