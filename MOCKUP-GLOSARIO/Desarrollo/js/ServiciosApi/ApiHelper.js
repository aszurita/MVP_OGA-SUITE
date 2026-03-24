/**
 * SqlHelper.js
 * Capa base para comunicación con la API de SQL Server.
 */
const SqlHelper = {
    BASE_URL: "http://gobinfoana01-2:8510",

    async _request(endpoint, method, body) {
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
                const errorText = await response.text().catch(() => '');
                throw new Error(`[SqlHelper] Error HTTP ${response.status}: ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`[SqlHelper] Fallo en ${endpoint}:`, error);
            throw error; // Lanza el error para que el UI pueda mostrar notificaciones
        }
    },

    /**
     * Ejecuta un SELECT en la base de datos.
     */
    async query(campos, origen, condicion = "1=1") {
        const data = await this._request('/query', 'POST', { campos, origen, condicion });
        // Garantizamos que siempre retorne un Array, incluso si la API devuelve un solo objeto
        return Array.isArray(data) ? data : (data ? [data] : []);
    },

    /**
     * Ejecuta un INSERT.
     */
    async insert(tabla, datos) {
        return this._request('/insert', 'POST', { tabla, datos });
    },

    /**
     * Ejecuta un UPDATE.
     */
    async update(tabla, datos, condicion) {
        return this._request('/update', 'PUT', { tabla, datos, condicion });
    }
};

window.SqlHelper = SqlHelper;