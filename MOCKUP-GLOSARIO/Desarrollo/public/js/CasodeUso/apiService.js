/**
 * @file Módulo de servicio para la comunicación con la API.
 * @description Centraliza todas las peticiones fetch (query, insert, update) a la API backend.
 * @author Giancarlo Ortiz */

const ApiService = {
  BASE_URL: "http://gobinfoana01-2:8510",

  /**
   * Realiza una petición a un endpoint de la API.
   * @param {string} endpoint - El endpoint de la API (ej. '/query', '/insert').
   * @param {string} method - El método HTTP (ej. 'POST', 'PUT').
   * @param {object} body - El cuerpo de la petición.
   * @returns {Promise<any>} La respuesta de la API en formato JSON.
   */
  async _fetch(endpoint, method, body) {
    try {
      const response = await fetch(`${this.BASE_URL}${endpoint}`, {
        method: method,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => `HTTP ${response.status}`);
        throw new Error(`Error en API (${endpoint}): ${response.status} - ${errorText}`);
      }

      return response.json();
    } catch (error) {
      console.error(`Fallo en la petición a ${endpoint}:`, error);
      throw error; // Re-lanza el error para que el llamador pueda manejarlo.
    }
  },

  /**
   * Ejecuta una consulta de tipo SELECT.
   * @param {{campos: string, origen: string, condicion: string}} queryBody - El cuerpo de la consulta.
   * @returns {Promise<any[]>} Un array con los resultados.
   */
  async query(queryBody) {
    const data = await this._fetch('/query', 'POST', queryBody);
    // Asegura que la salida siempre sea un array.
    return Array.isArray(data) ? data : (data ? [data] : []);
  },

  /**
   * Inserta un nuevo registro en una tabla.
   * @param {string} tabla - El nombre de la tabla.
   * @param {object} datos - El objeto con los datos a insertar.
   * @returns {Promise<any>}
   */
  async insert(tabla, datos) {
    return this._fetch('/insert', 'POST', { tabla, datos });
  },

  /**
   * Actualiza uno o más registros en una tabla.
   * @param {string} tabla - El nombre de la tabla.
   * @param {object} datos - El objeto con los campos a actualizar.
   * @param {string} condicion - La condición WHERE para la actualización.
   * @returns {Promise<any>}
   */
  async update(tabla, datos, condicion) {
    return this._fetch('/update', 'PUT', { tabla, datos, condicion });
  }
};

// Hacemos las funciones globales para que los scripts antiguos sigan funcionando temporalmente
// durante la refactorización. Una vez que todo esté modularizado, estas líneas se pueden eliminar.
window.queryCasosUso = (body) => ApiService.query(body);
window.insertApi = (tabla, datos) => ApiService.insert(tabla, datos);
window.updateApi = (payload) => ApiService.update(payload.tabla, payload.datos, payload.condicion);
window.ApiService = ApiService;