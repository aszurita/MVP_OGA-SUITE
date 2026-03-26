/**
 * AINGINE.js (API-only, endpoint único fijo)
 * Cliente HTTP minimalista para Linaje/OGASuite.
 * - Endpoint único (constante)
 * - Método genérico get({select, from, where}, options?)
 * - Timeout + reintentos (sin mocks, sin modo dev)
 * UMD export: window.AINGINE (browser) / module.exports (Node).
 */
(function (globalFactory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = globalFactory();
  } else {
    window.AINGINE = globalFactory();
  }
})(function () {
  'use strict';

  // ================== CONFIG (endpoint único) ==================
  const ENDPOINT = 'http://gobinfoana01-2:8510/query'; // <-- fija aquí el único endpoint

  // ================== UTIL ==================
  function assertNonEmptyString(value, name) {
    const s = (value ?? '').toString().trim();
    if (!s) throw new Error(`[AINGINE] ${name} es requerido`);
    return s;
  }

  function previewBody(body) {
    if (!body) return undefined;
    if (typeof body === 'string') {
      try { return JSON.parse(body); } catch (_) { return body.slice(0, 200); }
    }
    return body;
  }

  // fetch con timeout (AbortController)
  async function fetchWithTimeout(url, options = {}, timeoutMs = 10000) {
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const id = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
    const method = (options && options.method) || 'GET';
    const startedAt = Date.now();
    const bodyInfo = previewBody(options?.body);
    try {
      const res = await fetch(url, { ...options, signal: controller ? controller.signal : undefined });
      if (id) clearTimeout(id);
      return res;
    } catch (err) {
      if (id) clearTimeout(id);
      const duration = `${Date.now() - startedAt}ms`;
      const meta = bodyInfo ? { method, url, body: bodyInfo, duration } : { method, url, duration };
      const aborted = controller && controller.signal && controller.signal.aborted;
      if (aborted) {
        console.error('[AINGINE] ✖ Timeout', meta);
      } else {
        console.error('[AINGINE] ✖ Fetch error', meta, err);
      }
      throw err;
    }
  }

  // ================== CORE CLIENT ==================
  class ApiClient {
    constructor(endpoint) {
      this.endpoint = assertNonEmptyString(endpoint, 'ENDPOINT');
      this.baseUrl = this.endpoint.replace(/\/query\s*$/i, '') || this.endpoint;
    }

    async postQuery(body, options = {}) {
      const {
        timeout = 30000
      } = options;

      try {
        const res = await fetchWithTimeout(this.endpoint, {
          method: 'POST',
          headers: { accept: 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        }, timeout);

        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

        const data = await res.json();
        return Array.isArray(data) ? data : [];
      } catch (error) {
        throw error || new Error('[AINGINE] Error desconocido al ejecutar postQuery');
      }
    }

    buildWriteUrl(path) {
      const suffix = path.startsWith('/') ? path : `/${path}`;
      return `${this.baseUrl}${suffix}`;
    }

    validateWritePayload(payload, { requireCondition = false, ignoreFields } = {}) {
      if (!payload || typeof payload !== 'object') {
        throw new Error('[AINGINE] Payload debe ser un objeto.');
      }
      const tabla = assertNonEmptyString(payload.tabla, 'tabla');
      const datos = payload.datos;
      if (!datos || typeof datos !== 'object') {
        throw new Error('[AINGINE] datos debe ser un objeto.');
      }
      const filteredDatos = (ignoreFields && Array.isArray(ignoreFields) && ignoreFields.length)
        ? Object.fromEntries(Object.entries(datos).filter(([k]) => !ignoreFields.includes(k)))
        : datos;

      if (requireCondition) {
        const condicion = assertNonEmptyString(payload.condicion, 'condicion');
        return { tabla, datos: filteredDatos, condicion };
      }
      return { tabla, datos: filteredDatos };
    }

    async requestWrite(path, payload, { method = 'POST', timeout = 30000 } = {}) {
      const url = this.buildWriteUrl(path);
      const res = await fetchWithTimeout(url, {
        method,
        headers: { accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }, timeout);

      let data = null;
      try {
        data = await res.json();
      } catch (_) {
        data = null;
      }

      if (!res.ok) {
        const detail = data?.detail || `${res.status} ${res.statusText}`;
        const error = new Error(`[AINGINE] Error ${method} ${path}: ${detail}`);
        error.status = res.status;
        error.response = data;
        throw error;
      }

      return data;
    }

    async insert(payload, options = {}) {
      const clean = this.validateWritePayload(payload, options);
      return this.requestWrite('/insert', clean, { method: 'POST', ...options });
    }

    async update(payload, options = {}) {
      const clean = this.validateWritePayload(payload, { requireCondition: true, ...options });
      return this.requestWrite('/update', clean, { method: 'PUT', ...options });
    }
  }

  // Instancia privada con endpoint fijo
  const _client = new ApiClient(ENDPOINT);

  // ================== API PÚBLICA ==================
  const AINGINE = {
    /**
     * Ejecuta una consulta genérica
     * @param {Object} q
     * @param {string} q.select  - Campos/expresión (campos)
     * @param {string} q.from    - Origen/tabla     (origen)
     * @param {string} q.where   - Condición        (condicion)
     * @param {Object} [options] - { retryAttempts, retryDelay, timeout }
     * @returns {Promise<Array<Object>>}
     */
    async get(q, options) {
      // Normaliza options para que nunca sea null/undefined/valor no-objeto
      const opts = (options && typeof options === 'object') ? options : {};

      const select = assertNonEmptyString(q?.select, 'select');
      const from = assertNonEmptyString(q?.from, 'from');
      const where = (q?.where ?? '1=1').toString().trim();

      const body = { campos: select, origen: from, condicion: where };
      return _client.postQuery(body, opts);
    },

    async insert(payload, options) {
      return _client.insert(payload, options);
    },

    async update(payload, options) {
      return _client.update(payload, options);
    }
  };

  return AINGINE;

});
