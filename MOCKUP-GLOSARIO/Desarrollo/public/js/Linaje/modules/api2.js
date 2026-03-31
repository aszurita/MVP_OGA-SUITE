(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    const AINGINE = (root && root.AINGINE) || require('../../AINGINE.js');
    module.exports = factory(AINGINE);
  } else {
    root.ApiManager = factory(root.AINGINE);
    root.apiManager = new root.ApiManager();
  }
})(typeof self !== 'undefined' ? self : this, function (AINGINE) {
  'use strict';

  if (!AINGINE || typeof AINGINE.get !== 'function') {
    throw new Error('[ApiManager] AINGINE no está disponible. Carga ../../AINGINE.js primero.');
  }

  const tryRequire = (path) => {
    try {
      return require(path);
    } catch (_) {
      return null;
    }
  };

  const ConfigBridge = (typeof ConfigUtils !== 'undefined')
    ? ConfigUtils
    : (tryRequire('../config/config.js')?.ConfigUtils || null);

  const HelperBridge = (typeof LinajeHelpers !== 'undefined')
    ? LinajeHelpers
    : (tryRequire('../utils/helpers.js')?.LinajeHelpers || null);

  const DEFAULT_TABLE = 'BG_Lab.dbo.t_linage_entidades';
  const EMPTY_SNAPSHOT = { elements: { nodes: [], edges: [] } };

  const sanitizeId = (value) => (value ?? '').toString().trim().replace(/'/g, "''");
  const toJsonString = (value) => typeof value === 'string' ? value : JSON.stringify(value ?? {}, null, 2);

  const buildEntidadBaseId = (parts = {}) => {
    if (HelperBridge?.buildEntidadBaseId) return HelperBridge.buildEntidadBaseId(parts);
    const normalize = (val) => (val ?? '').toString().trim().toUpperCase();
    const tokens = [parts.base, parts.servidor, parts.esquema, parts.tabla]
      .map(normalize)
      .filter(Boolean);
    return tokens.length ? `[${tokens.join('].[')}]` : '';
  };

  const resolveCurrentUser = () => {
    if (HelperBridge?.getCurrentUser) return HelperBridge.getCurrentUser('desconocido');
    if (typeof window !== 'undefined' && window.current_user) {
      const raw = String(window.current_user);
      const clean = raw.includes('\\') ? raw.split('\\').pop() : raw;
      return clean.trim().toLowerCase() || 'desconocido';
    }
    return 'desconocido';
  };

  const ensureWriteMethod = (methodName) => {
    if (typeof AINGINE[methodName] !== 'function') {
      throw new Error(`[ApiManager] AINGINE.${methodName} no está disponible.`);
    }
  };

  class ApiManager {
    constructor() {
      this.linajeTable = (ConfigBridge?.getLinajeTable && ConfigBridge.getLinajeTable()) || DEFAULT_TABLE;
    }

    async getTableDescription(code) {
      const raw = (code ?? '').toString().trim();
      if (!raw) return '';
      const normalized = raw.toUpperCase().replace(/'/g, "''");

      const rows = await AINGINE.get({
        select: 'descripcion_tabla',
        from: 'procesos_bi.dbo.t_tablas_oficiales',
        where: `txt_desc_tabla = '${normalized}'`
      });

      const desc = Array.isArray(rows) && rows[0] ? rows[0].descripcion_tabla : '';
      return (typeof desc === 'string' ? desc : String(desc || '')).trim();
    }

    async getServers() {
      const rows = await AINGINE.get({
        select: 'DISTINCT UPPER(SERVIDOR) AS name',
        from: 'procesos_bi.dbo.LOG_ENTIDADES_OFICIAL',
        where: '1=1'
      });
      return rows.map(r => r?.name).filter(Boolean).sort((a, b) => a.localeCompare(b));
    }

    async getDatabases(serverName) {
      if (!serverName) return [];
      const rows = await AINGINE.get({
        select: 'DISTINCT UPPER(CATALOGO) AS name',
        from: 'procesos_bi.dbo.LOG_ENTIDADES_OFICIAL',
        where: `SERVIDOR = '${serverName}'`
      });
      return rows.map(r => r?.name).filter(Boolean).sort((a, b) => a.localeCompare(b));
    }

    async getSchemas(serverName, databaseName) {
      if (!serverName || !databaseName) return [];
      const rows = await AINGINE.get({
        select: 'DISTINCT UPPER(ESQUEMA_TABLA) AS name',
        from: 'procesos_bi.dbo.LOG_ENTIDADES_OFICIAL',
        where: `SERVIDOR = '${serverName}' AND CATALOGO = '${databaseName}'`
      });
      return rows.map(r => r?.name).filter(Boolean).sort((a, b) => a.localeCompare(b));
    }

    async getTables(serverName, databaseName, schemaName) {
      if (!serverName || !databaseName || !schemaName) return [];
      const rows = await AINGINE.get({
        select: 'DISTINCT UPPER(NOMBRE_TABLA) AS name',
        from: 'procesos_bi.dbo.LOG_ENTIDADES_OFICIAL',
        where: `SERVIDOR = '${serverName}' AND CATALOGO = '${databaseName}' AND ESQUEMA_TABLA = '${schemaName}'`
      });
      return rows.map(r => r?.name).filter(Boolean).sort((a, b) => a.localeCompare(b));
    }

    async getFields(serverName, databaseName, schemaName, tableName) {
      if (!serverName || !databaseName || !schemaName || !tableName) return [];
      const rows = await AINGINE.get({
        select: 'DISTINCT UPPER(COLUMN_NAME) AS name',
        from: 'procesos_bi.dbo.LOG_ENTIDADES_CAMPOS_OFICIAL',
        where: `SERVIDOR = '${serverName}' AND TABLE_CATALOG = '${databaseName}' AND TABLE_SCHEMA = '${schemaName}' AND TABLE_NAME = '${tableName}'`
      });
      return rows.map(r => r?.name).filter(Boolean).sort((a, b) => a.localeCompare(b));
    }

    getEnvironmentInfo() {
      return { endpoint: '[AINGINE.endpoint fijo]', timestamp: new Date().toISOString() };
    }
    clearCache() {}
    setDevelopmentMode() {}
    getPerformanceStats() { return {}; }
    setupConnectivityListeners() {}
    validateConfiguration() { return true; }
    processQueuedRequests() { return Promise.resolve(); }
    shouldUseMockData() { return false; }
    generateCacheKey() { return ''; }

    buildEntidadBaseId(parts) {
      return buildEntidadBaseId(parts);
    }

    getCurrentUser() {
      return resolveCurrentUser();
    }

    async getLinajeRecord(entidadBaseId) {
      const key = sanitizeId(entidadBaseId);
      if (!key) return null;

      const rows = await AINGINE.get({
        select: 'TOP 1 id_linage, id_entidad_base, txt_json, fec_creacion, usuario_creacion, fec_modificacion, usuario_modificacion, sn_activo',
        from: this.linajeTable,
        where: `id_entidad_base = '${key}'`
      });

      return Array.isArray(rows) && rows.length ? rows[0] : null;
    }

    async getNextLinajeId() {
      const rows = await AINGINE.get({
        select: 'ISNULL(MAX(id_linage),0)+1 AS nextId',
        from: this.linajeTable,
        where: '1=1'
      });
      const next = Array.isArray(rows) && rows[0] ? rows[0].nextId : null;
      return Number(next) > 0 ? Number(next) : 1;
    }

    async insertLinajeRecord({ entidadBaseId, jsonText, usuario }) {
      ensureWriteMethod('insert');
      const nextId = await this.getNextLinajeId();
      const body = {
        tabla: this.linajeTable,
        datos: {
          ID_LINAGE: nextId,
          ID_ENTIDAD_BASE: entidadBaseId,
          TXT_JSON: jsonText || '{}',
          FEC_CREACION: new Date().toISOString(),
          USUARIO_CREACION: (usuario || this.getCurrentUser()),
          SN_ACTIVO: 1
        }
      };

      await AINGINE.insert(body);
      return {
        id_linage: nextId,
        id_entidad_base: entidadBaseId,
        txt_json: jsonText,
        fec_creacion: body.datos.FEC_CREACION,
        usuario_creacion: body.datos.USUARIO_CREACION,
        sn_activo: 1
      };
    }

    async updateLinajeRecord(idLinage, { entidadBaseId, jsonText, usuario }) {
      if (!idLinage) throw new Error('[ApiManager] id_linage es requerido para actualizar.');
      ensureWriteMethod('update');
      const body = {
        tabla: this.linajeTable,
        datos: {
          TXT_JSON: jsonText || '{}',
          FEC_MODIFICACION: new Date().toISOString(),
          USUARIO_MODIFICACION: (usuario || this.getCurrentUser()),
          SN_ACTIVO: 1
        },
        condicion: `id_linage = ${idLinage}`
      };

      await AINGINE.update(body);
      return {
        id_linage: idLinage,
        id_entidad_base: entidadBaseId,
        txt_json: jsonText,
        fec_modificacion: body.datos.FEC_MODIFICACION,
        usuario_modificacion: body.datos.USUARIO_MODIFICACION,
        sn_activo: 1
      };
    }

    async saveLinajeSnapshot({ entidadBaseId, snapshot, usuario }) {
      const key = sanitizeId(entidadBaseId);
      if (!key) throw new Error('[ApiManager] id_entidad_base es requerido para guardar.');
      const jsonText = toJsonString(snapshot);
      const user = usuario || this.getCurrentUser();
      const existing = await this.getLinajeRecord(key);

      if (existing?.id_linage) {
        const updated = await this.updateLinajeRecord(existing.id_linage, {
          entidadBaseId: key,
          jsonText,
          usuario: user
        });
        return { action: 'update', record: updated };
      }

      const created = await this.insertLinajeRecord({
        entidadBaseId: key,
        jsonText,
        usuario: user
      });
      return { action: 'insert', record: created };
    }

    async loadLinajeSnapshot({ entidadBaseId, autoCreate = false, usuario } = {}) {
      const key = sanitizeId(entidadBaseId);
      if (!key) throw new Error('[ApiManager] id_entidad_base es requerido para cargar.');

      let record = await this.getLinajeRecord(key);
      if (record) return { status: 'loaded', record };

      if (autoCreate) {
        record = await this.insertLinajeRecord({
          entidadBaseId: key,
          jsonText: JSON.stringify(EMPTY_SNAPSHOT),
          usuario: usuario || this.getCurrentUser()
        });
        return { status: 'created', record };
      }

      return { status: 'not_found', record: null };
    }
  }

  return ApiManager;
});
