/**
 * Graficador API
 * --------------
 * Cliente minimalista que envÃ­a SQL al endpoint /mermaid-diagram-Gemini
 * y devuelve el diagrama Mermaid generado.
 */
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.GraficadorApi = factory();
    root.graficadorApi = new root.GraficadorApi();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const tryRequire = (path) => {
    try {
      return require(path);
    } catch (_) {
      return null;
    }
  };

  const resolveAingine = () => {
    if (typeof window !== 'undefined' && window.AINGINE) return window.AINGINE;
    if (typeof globalThis !== 'undefined' && globalThis.AINGINE) return globalThis.AINGINE;
    return tryRequire('../AINGINE.js') || null;
  };

  const resolveUserHelper = () => {
    if (typeof window !== 'undefined' && window.UserHelper) return window.UserHelper;
    if (typeof globalThis !== 'undefined' && globalThis.UserHelper) return globalThis.UserHelper;
    return tryRequire('../helper_user.js') || null;
  };

  const FALLBACK_ENDPOINT = 'http://gobinfoana01-2:8510/mermaid-diagram-Gemini';
  const globalConfig = (typeof window !== 'undefined' && window.graficadorConfig) ? window.graficadorConfig : {};
  const DEFAULT_ENDPOINT = globalConfig.mermaidEndpoint || FALLBACK_ENDPOINT;

  function assertSql(value) {
    const candidate = (value ?? '').toString().trim();
    if (!candidate) {
      throw new Error('Se requiere SQL para generar el diagrama.');
    }
    return candidate;
  }

  function previewBody(body) {
    if (!body) return undefined;
    if (typeof body === 'string') {
      try { return JSON.parse(body); } catch (_) { return body.slice(0, 200); }
    }
    return body;
  }

  function buildUrlWithSql(endpoint, sql) {
    if (!endpoint) throw new Error('Endpoint no configurado para GraficadorApi.');
    const trimmed = (sql ?? '').toString().trim();
    if (!trimmed) throw new Error('SQL requerido.');
    try {
      const url = new URL(endpoint);
      url.searchParams.set('sql_code', trimmed);
      return url.toString();
    } catch (_) {
      const separator = endpoint.includes('?') ? '&' : '?';
      return `${endpoint}${separator}sql_code=${encodeURIComponent(trimmed)}`;
    }
  }

  function escapeSql(value) {
    return (value ?? '').toString().replace(/'/g, "''");
  }

  function getLocalIsoTime() {
    const tzoffset = (new Date()).getTimezoneOffset() * 60000;
    return (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
  }

  async function queryCatalogoWithFecha(aingine, { term, limit }) {
    const safe = term ? escapeSql(term) : '';
    const where = term ? `NOMBRE_SP LIKE '%${safe}%'` : '1=1';
    const base = 'dbo.TRB_OGA_SP_CATALOGO';
    const selectFechaCreacion = `TOP ${limit} NOMBRE_SP, GRAFICO, USER_CREACION, FECHA_CREACION`;
    return aingine.get({ select: selectFechaCreacion, from: base, where });
  }

  async function fetchWithTimeout(url, options = {}, timeoutMs = 120000) {
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const id = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
    const method = (options && options.method) || 'POST';
    const bodyInfo = previewBody(options?.body);
    const startedAt = Date.now();
    try {
      const res = await fetch(url, { ...options, signal: controller ? controller.signal : undefined });
      if (id) clearTimeout(id);
      return res;
    } catch (error) {
      if (id) clearTimeout(id);
      const duration = `${Date.now() - startedAt}ms`;
      const meta = bodyInfo ? { method, url, body: bodyInfo, duration } : { method, url, duration };
      const aborted = controller && controller.signal && controller.signal.aborted;
      if (aborted) {
        console.error('[GraficadorApi] Timeout', meta);
      } else {
        console.error('[GraficadorApi] Fetch error', meta, error);
      }
      throw error;
    }
  }

  function extractMermaidPayload(data) {
    if (typeof data === 'string') return data.trim();
    if (!data) return '';
    if (typeof data === 'object') {
      if (typeof data.diagram === 'string' && data.diagram.trim()) return data.diagram.trim();
      if (typeof data.mermaid === 'string' && data.mermaid.trim()) return data.mermaid.trim();
      if (typeof data.code === 'string' && data.code.trim()) return data.code.trim();
      if (typeof data.result === 'string' && data.result.trim()) return data.result.trim();
      return JSON.stringify(data);
    }
    return String(data);
  }

  class GraficadorApi {
    constructor(config = {}) {
      this.endpoint = config.endpoint || DEFAULT_ENDPOINT;
      this.aingine = resolveAingine();
    }

    async generateDiagramFromSql(sql, options = {}) {
      const expression = assertSql(sql);
      const timeout = options.timeout || 30000;
      const target = buildUrlWithSql(this.endpoint, expression);
      const res = await fetchWithTimeout(target, {
        method: 'POST',
        headers: {
          accept: 'application/json,text/plain'
        }
      }, timeout);

      if (!res.ok) {
        const payload = await (async () => {
          try { return await res.text(); } catch (_) { return res.statusText; }
        })();
        throw new Error(`HTTP ${res.status}: ${payload}`);
      }

      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const json = await res.json();
        const parsed = extractMermaidPayload(json);
        if (!parsed) throw new Error('Respuesta del servidor sin Mermaid vÃ¡lido.');
        return parsed;
      }

      const text = await res.text();
      if (!text.trim()) throw new Error('Respuesta vacía del servidor.');
      return text.trim();
    }

    ensureAingine() {
      if (!this.aingine || typeof this.aingine.get !== 'function') {
        throw new Error('AINGINE no está disponible. Carga js/AINGINE.js.');
      }
      return this.aingine;
    }

    async getServers() {
      const aingine = this.ensureAingine();
      const rows = await aingine.get({
        select: 'DISTINCT UPPER(SERVIDOR) AS name',
        from: 'procesos_bi.dbo.LOG_ENTIDADES_OFICIAL',
        where: '1=1'
      });
      return rows.map(r => r?.name).filter(Boolean).sort((a, b) => a.localeCompare(b));
    }

    async getDatabases(serverName) {
      const aingine = this.ensureAingine();
      if (!serverName) return [];
      const rows = await aingine.get({
        select: 'DISTINCT UPPER(CATALOGO) AS name',
        from: 'procesos_bi.dbo.LOG_ENTIDADES_OFICIAL',
        where: `SERVIDOR = '${serverName}'`
      });
      return rows.map(r => r?.name).filter(Boolean).sort((a, b) => a.localeCompare(b));
    }

    async getSchemas(serverName, catalogName) {
      const aingine = this.ensureAingine();
      if (!serverName || !catalogName) return [];
      const rows = await aingine.get({
        select: 'DISTINCT UPPER(ESQUEMA_TABLA) AS name',
        from: 'procesos_bi.dbo.LOG_ENTIDADES_OFICIAL',
        where: `SERVIDOR = '${serverName}' AND CATALOGO = '${catalogName}'`
      });
      return rows.map(r => r?.name).filter(Boolean).sort((a, b) => a.localeCompare(b));
    }

    async getAllNombres() {
      const aingine = this.ensureAingine();
      const rows = await aingine.get({
        select: 'NOMBRE_SP',
        from: 'dbo.TRB_OGA_SP_CATALOGO',
        where: '1=1'
      });
      return rows || [];
    }

    async searchCatalogo(term, limit = 20) {
      const aingine = this.ensureAingine();
      const query = (term ?? '').toString().trim();
      if (!query) return [];
      const rows = await queryCatalogoWithFecha(aingine, { term: query, limit });
      return rows || [];
    }

    async listCatalogo(limit = 20) {
      const aingine = this.ensureAingine();
      const rows = await queryCatalogoWithFecha(aingine, { term: '', limit });
      return rows || [];
    }

    async getCatalogoByName(nombreSp) {
      const aingine = this.ensureAingine();
      const safeName = (nombreSp ?? '').toString().trim();
      if (!safeName) return null;
      const safe = escapeSql(safeName);
      const rows = await aingine.get({
        select: 'TOP 1 NOMBRE_SP, GRAFICO, USER_CREACION, FECHA_CREACION',
        from: 'dbo.TRB_OGA_SP_CATALOGO',
        where: `NOMBRE_SP = '${safe}'`
      });
      return (rows && rows.length ? rows[0] : null);
    }

    async saveCatalogo({ nombreSp, grafico }) {
      const aingine = this.ensureAingine();
      if (typeof aingine.insert !== 'function') {
        throw new Error('AINGINE.insert no está disponible.');
      }
      if (typeof aingine.update !== 'function') {
        throw new Error('AINGINE.update no está disponible.');
      }
      const helper = resolveUserHelper();
      const userCreacion = helper?.getWebUser
        ? helper.getWebUser()
        : resolveCurrentUser();
      if (!userCreacion) {
        throw new Error('No se pudo determinar el usuario actual.');
      }
      const fechaActual = helper?.getFechaActual ? helper.getFechaActual() : getLocalIsoTime();
      const safeName = escapeSql(nombreSp);
      const existing = await aingine.get({
        select: 'COUNT(1) AS total',
        from: 'dbo.TRB_OGA_SP_CATALOGO',
        where: `NOMBRE_SP = '${safeName}'`
      });
      const total = parseInt(existing?.[0]?.total ?? existing?.[0]?.TOTAL ?? 0, 10) || 0;
      if (total > 0) {
        const updatePayload = {
          tabla: 'dbo.TRB_OGA_SP_CATALOGO',
          datos: {
            GRAFICO: grafico || null,
            USER_CREACION: userCreacion,
            FECHA_CREACION: fechaActual
          },
          condicion: `NOMBRE_SP = '${safeName}'`
        };
        return aingine.update(updatePayload);
      }
      const insertPayload = {
        tabla: 'dbo.TRB_OGA_SP_CATALOGO',
        datos: {
          NOMBRE_SP: nombreSp,
          GRAFICO: grafico || null,
          USER_CREACION: userCreacion,
          FECHA_CREACION: fechaActual
        }
      };
      return aingine.insert(insertPayload);
    }
  }

  return GraficadorApi;
});
