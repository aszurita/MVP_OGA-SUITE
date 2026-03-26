/**
 * apiService.js
 * Capa base para comunicación con la API de SQL Server.
 * Idéntico al ApiService del proyecto original, convertido a ES Module.
 */
// En dev local: usa la variable VITE_API_URL del .env (apunta directo al servidor)
// En Docker/Azure: VITE_API_URL=/api  (Nginx hace el proxy hacia el backend)
const BASE_URL = import.meta.env.VITE_API_URL || 'http://gobinfoana01-2:8510';

async function _fetch(endpoint, method, body) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => `HTTP ${response.status}`);
    throw new Error(`Error en API (${endpoint}): ${response.status} - ${errorText}`);
  }

  return response.json();
}

const apiService = {
  /**
   * SELECT — campo, origen y condición al endpoint /query
   * @param {{ campos: string, origen: string, condicion?: string }} body
   */
  async query(body) {
    const data = await _fetch('/query', 'POST', {
      condicion: '1=1',
      ...body,
    });
    return Array.isArray(data) ? data : data ? [data] : [];
  },

  /**
   * INSERT al endpoint /insert
   */
  async insert(tabla, datos) {
    return _fetch('/insert', 'POST', { tabla, datos });
  },

  /**
   * UPDATE al endpoint /update
   */
  async update(tabla, datos, condicion) {
    return _fetch('/update', 'PUT', { tabla, datos, condicion });
  },
};

export default apiService;
