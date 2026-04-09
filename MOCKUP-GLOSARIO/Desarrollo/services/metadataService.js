/**
 * metadataService.js  (v2 — AINGINE directo)
 * ============================================
 * Reemplaza la capa que apuntaba a localhost:8000 (SQLite local).
 * Consulta directamente gobinfoana01-2:8510 usando apiService.js.
 *
 * Fuentes SQL:
 *   - Campos : procesos_bi.dbo.vw_informacion_atributos_larga  (JOIN tablas + clasificacion)
 *   - Tablas : procesos_bi.dbo.t_tablas_oficiales              (JOIN fuente + clasificacion)
 */
import apiService from './apiService.js';

// ── SELECT y FROM fijos ────────────────────────────────────────────────────────

const CAMPOS_SELECT = [
  'v.desc_tecnica_atributo      AS campo',
  'CONVERT(varchar, v.id_atributos) AS codigo',
  'v.txt_desc_atributo           AS atributo',
  'v.detalle_campo               AS definicion',
  'v.txt_fuente_aprovisionamiento AS plataforma',
  'v.txt_servidor                AS servidor',
  'v.txt_host                   AS base',
  'v.txt_fuente_esquema         AS esquema',
  'v.desc_tecnica_tabla         AS tabla',
  'v.txt_desc_tipo_dato_atributo AS tipo',
  'v.largo_atributo             AS largo',
  'v.sn_nulo                   AS permite_null',
  'v.ordinal_position',
  'CONVERT(varchar, v.golden_record_campo) AS golden_record',
  'v.usuario_modificacion_detalle',
  'v.fecha_modificacion_detalle',
  'v.usuario_modificacion_atributo',
  'v.fecha_modificacion_atributo',
  't.descripcion_tabla',
  "ISNULL(CONVERT(varchar, t.avance), '0') AS avance",
  'c.clasificacion',
  't.nombre_data_owner',
  't.nombre_data_steward',
].join(', ');

const CAMPOS_ORIGEN = [
  'procesos_bi.dbo.vw_informacion_atributos_larga v',
  'LEFT JOIN procesos_bi.dbo.t_tablas_oficiales t',
    'ON v.id_fuente_aprovisionamiento = t.id_fuente_aprovisionamiento',
    'AND v.desc_tecnica_tabla = t.txt_desc_tabla',
  'LEFT JOIN procesos_bi.dbo.t_clasificacion_tablas c',
    'ON t.id_clasificacion = c.id_clasificacion',
].join(' ');

const TABLAS_SELECT = [
  't.txt_desc_tabla                        AS tabla',
  't.descripcion_tabla                     AS descripcion',
  'f.txt_fuente_aprovisionamiento          AS plataforma',
  'f.txt_servidor                          AS servidor',
  'f.txt_host                              AS base',
  "ISNULL(f.txt_fuente_esquema, 'DBO')    AS esquema",
  't.nombre_data_owner',
  't.nombre_data_steward',
  "ISNULL(CONVERT(varchar, t.avance), '0') AS avance",
  'c.clasificacion',
  'CONVERT(varchar, t.data_owner)         AS data_owner',
  'CONVERT(varchar, t.data_steward)       AS data_steward',
  't.etiquetas',
  't.usuario_modificacion_descripcion',
  't.fecha_modificacion_descripcion',
  't.usuario_modificacion_do',
  't.fecha_modificacion_do',
  't.usuario_modificacion_ds',
  't.fecha_modificacion_ds',
  't.usuario_modificacion_clasif',
  't.fecha_modificacion_clasif',
].join(', ');

const TABLAS_ORIGEN = [
  'procesos_bi.dbo.t_tablas_oficiales t',
  'JOIN procesos_bi.dbo.t_fuente_aprovisionamiento f',
    'ON t.id_fuente_aprovisionamiento = f.id_fuente_aprovisionamiento',
    'AND f.sn_activo = 1',
  'LEFT JOIN procesos_bi.dbo.t_clasificacion_tablas c',
    'ON t.id_clasificacion = c.id_clasificacion',
].join(' ');

// ── CACHE (tablas son pocas, se cargan una vez) ────────────────────────────────
let _tablasCache   = null;
let _tablasPromise = null;

// ── HELPERS ───────────────────────────────────────────────────────────────────

/** Escapa comillas simples para SQL Server */
function esc(v) {
  return String(v ?? '').replace(/'/g, "''");
}

function upperClean(v, def = ' ') {
  if (!v) return def;
  const s = String(v).toUpperCase().trim().replace(/[()\\]/g, '').replace(/<BR>/gi, '');
  return s || def;
}

/** llave_tabla: SERVIDOR_ESQUEMA_BASE_TABLA  (mismo orden que load_db.py) */
function llaveTabla({ servidor, esquema, base, tabla }) {
  return [
    upperClean(servidor, ' '),
    upperClean(esquema, 'DBO'),
    upperClean(base,    ' '),
    upperClean(tabla,   ' '),
  ].join('_');
}

/** Pagina un array en memoria */
function paginate(arr, page, size) {
  const total = arr.length;
  const pages = Math.max(1, Math.ceil(total / size));
  const start = (page - 1) * size;
  return {
    items: arr.slice(start, start + size),
    total,
    pages,
    page,
    size,
  };
}

function normalizeTabla(raw) {
  const r = {};
  Object.keys(raw).forEach(k => { r[k.toLowerCase()] = raw[k]; });
  const servidor  = (r.servidor  || '').trim().toUpperCase();
  const esquema   = (r.esquema   || 'DBO').trim().toUpperCase();
  const base      = (r.base      || '').trim().toUpperCase();
  const tabla     = (r.tabla     || '').trim().toUpperCase();
  const plataforma = (r.plataforma || '').trim().toUpperCase();
  return {
    ...r,
    servidor, esquema, base, tabla, plataforma,
    llave_tabla: llaveTabla({ servidor, esquema, base, tabla }),
  };
}

function normalizeCampo(raw) {
  const r = {};
  Object.keys(raw).forEach(k => { r[k.toLowerCase()] = raw[k]; });
  const servidor  = (r.servidor  || '').trim().toUpperCase();
  const esquema   = (r.esquema   || '').trim().toUpperCase();
  const base      = (r.base      || '').trim().toUpperCase();
  const tabla     = (r.tabla     || '').trim().toUpperCase();
  const plataforma = (r.plataforma || '').trim().toUpperCase();
  const campo     = (r.campo     || '').trim().toUpperCase();
  const lt = llaveTabla({ servidor, esquema, base, tabla });
  return {
    ...r,
    servidor, esquema, base, tabla, plataforma, campo,
    codigo:           r.codigo    || '',
    atributo:         r.atributo  || '',
    definicion:       r.definicion || '',
    tipo:             r.tipo      || '',
    largo:            r.largo     || '-',
    permite_null:     r.permite_null,
    clasificacion:    r.clasificacion    || '',
    descripcion_tabla: r.descripcion_tabla || '',
    avance:           r.avance    || '0',
    llave_tabla:      lt,
    llave_unica:      lt + '_' + upperClean(campo, ' '),
  };
}

// ── TABLAS con cache ──────────────────────────────────────────────────────────

async function fetchAllTablas() {
  if (_tablasCache)   return _tablasCache;
  if (_tablasPromise) return _tablasPromise;

  _tablasPromise = apiService.query({
    campos:    TABLAS_SELECT,
    origen:    TABLAS_ORIGEN,
    condicion: '1=1',
  }).then(rows => {
    _tablasCache = rows
      .map(normalizeTabla)
      .filter(r => r.servidor && r.base && r.plataforma);
    _tablasPromise = null;
    return _tablasCache;
  });

  return _tablasPromise;
}

function filterTablas(tablas, { servidor, base, esquema, plataforma, clasificacion, q, owner_q, owner_type } = {}) {
  return tablas.filter(r => {
    if (servidor     && r.servidor?.toUpperCase()     !== servidor.toUpperCase())     return false;
    if (base         && r.base?.toUpperCase()         !== base.toUpperCase())         return false;
    if (esquema      && r.esquema?.toUpperCase()      !== esquema.toUpperCase())      return false;
    if (plataforma   && r.plataforma?.toUpperCase()   !== plataforma.toUpperCase())   return false;
    if (clasificacion && r.clasificacion?.toUpperCase() !== clasificacion.toUpperCase()) return false;
    if (q) {
      const term = q.toUpperCase();
      if (!r.tabla?.toUpperCase().includes(term) && !r.descripcion?.toUpperCase().includes(term)) return false;
    }
    if (owner_q) {
      const term = owner_q.toUpperCase();
      const campo = owner_type === 'steward' ? r.nombre_data_steward : r.nombre_data_owner;
      if (!campo?.toUpperCase().includes(term)) return false;
    }
    return true;
  });
}

// ── CAMPOS condicion dinámica ─────────────────────────────────────────────────

function buildCamposCondicion({ servidor, base, esquema, tabla, tabla_q, plataforma, clasificacion, q } = {}) {
  const conditions = [
    "LTRIM(RTRIM(ISNULL(v.txt_servidor, ''))) NOT IN ('', ' ')",
    "LTRIM(RTRIM(ISNULL(v.txt_host, ''))) NOT IN ('', ' ')",
    "LTRIM(RTRIM(ISNULL(v.txt_fuente_aprovisionamiento, ''))) != ''",
  ];

  if (servidor)     conditions.push(`UPPER(v.txt_servidor) = '${esc(servidor.toUpperCase())}'`);
  if (base)         conditions.push(`UPPER(v.txt_host) = '${esc(base.toUpperCase())}'`);
  if (esquema)      conditions.push(`UPPER(v.txt_fuente_esquema) = '${esc(esquema.toUpperCase())}'`);
  if (tabla)        conditions.push(`UPPER(v.desc_tecnica_tabla) = '${esc(tabla.toUpperCase())}'`);
  if (tabla_q)      conditions.push(`UPPER(v.desc_tecnica_tabla) LIKE '%${esc(tabla_q.toUpperCase())}%'`);
  if (plataforma)   conditions.push(`UPPER(v.txt_fuente_aprovisionamiento) = '${esc(plataforma.toUpperCase())}'`);
  if (clasificacion) conditions.push(`UPPER(c.clasificacion) = '${esc(clasificacion.toUpperCase())}'`);
  if (q) {
    const term = esc(q.toUpperCase());
    conditions.push(
      `(UPPER(v.desc_tecnica_atributo) LIKE '%${term}%'` +
      ` OR UPPER(v.txt_desc_atributo) LIKE '%${term}%'` +
      ` OR UPPER(v.detalle_campo) LIKE '%${term}%')`
    );
  }

  return conditions.join(' AND ');
}

// ── EXPORTS PÚBLICOS (misma interfaz que la versión anterior) ─────────────────

/** Verifica que la API AINGINE responde */
export function checkHealth() {
  return apiService.query({
    campos:    'top 1 1 AS ok',
    origen:    'procesos_bi.dbo.t_tablas_oficiales',
    condicion: '1=1',
  }).then(() => ({ status: 'ok' }));
}

/**
 * Filtros disponibles derivados del cache de tablas.
 * Devuelve { servidores, plataformas, clasificaciones }
 */
export async function getFilters() {
  const tablas = await fetchAllTablas();
  return {
    servidores:     [...new Set(tablas.map(r => r.servidor).filter(Boolean))].sort(),
    plataformas:    [...new Set(tablas.map(r => r.plataforma).filter(Boolean))].sort(),
    clasificaciones:[...new Set(tablas.map(r => r.clasificacion).filter(Boolean))].sort(),
  };
}

/**
 * Vista nivel tabla — filtra sobre el cache de tablas y pagina en memoria.
 * Misma firma que antes: { plataforma, servidor, base, esquema, q, owner_q, owner_type, page, page_size }
 */
export async function getTableView({
  plataforma, servidor, base, esquema, clasificacion,
  q, owner_q, owner_type,
  page = 1, page_size = 20,
} = {}) {
  const tablas   = await fetchAllTablas();
  const filtered = filterTablas(tablas, { servidor, base, esquema, plataforma, clasificacion, q, owner_q, owner_type });
  return paginate(filtered, page, page_size);
}

/**
 * Owners y Stewards únicos (para autocompletado del modal DataOwners).
 */
export async function getOwnerFacets() {
  const tablas = await fetchAllTablas();
  return {
    owners:   [...new Set(tablas.map(r => r.nombre_data_owner).filter(Boolean))].sort(),
    stewards: [...new Set(tablas.map(r => r.nombre_data_steward).filter(Boolean))].sort(),
  };
}

/**
 * Vista nivel campo — consulta AINGINE con filtros como condición SQL.
 * Aplica TOP 2000 cuando no hay filtro fuerte (servidor / base / tabla / tabla_q).
 * Misma firma que antes: { plataforma, servidor, base, esquema, tabla, tabla_q, clasificacion, q, page, page_size }
 */
export async function getFieldView({
  plataforma, servidor, base, esquema, tabla, tabla_q,
  clasificacion, q,
  page = 1, page_size = 20,
} = {}) {
  const hasStrongFilter = !!(servidor || base || tabla || tabla_q);
  const selectPrefix    = hasStrongFilter ? '' : 'TOP 2000 ';

  const condicion = buildCamposCondicion({ servidor, base, esquema, tabla, tabla_q, plataforma, clasificacion, q });

  const rows = await apiService.query({
    campos:    selectPrefix + CAMPOS_SELECT,
    origen:    CAMPOS_ORIGEN,
    condicion,
  });

  const normalized = rows
    .map(normalizeCampo)
    .sort((a, b) => {
      const cmp = f => (a[f] || '').localeCompare(b[f] || '');
      return cmp('servidor') || cmp('base') || cmp('esquema') || cmp('tabla') ||
        (Number(a.ordinal_position) - Number(b.ordinal_position));
    });

  return paginate(normalized, page, page_size);
}

/**
 * Detalle de una tabla por llave_tabla (desde cache).
 */
export async function getTablaDetalle(llave_tabla) {
  const tablas = await fetchAllTablas();
  const found  = tablas.find(t => t.llave_tabla === llave_tabla.toUpperCase());
  if (!found) throw new Error(`Tabla '${llave_tabla}' no encontrada`);
  return found;
}

/**
 * Todos los campos de una tabla específica (usa getFieldView con filtros exactos).
 */
export async function getCamposDeTabla(llave_tabla, { page = 1, size = 500 } = {}) {
  const tablas = await fetchAllTablas();
  const t = tablas.find(r => r.llave_tabla === llave_tabla.toUpperCase());
  if (!t) return { items: [], total: 0, pages: 1, page: 1, size };
  return getFieldView({ servidor: t.servidor, base: t.base, esquema: t.esquema, tabla: t.tabla, page, page_size: size });
}

/**
 * Árbol jerárquico servidor → base → esquema → tablas.
 * Construido desde el cache de tablas.
 */
export async function getArbol(servidor = null) {
  const tablas = await fetchAllTablas();
  const source = servidor
    ? tablas.filter(r => r.servidor?.toUpperCase() === servidor.toUpperCase())
    : tablas;

  const tree = {};
  for (const r of source) {
    const sv = r.servidor || '';
    const ba = r.base     || '';
    const es = r.esquema  || '';
    if (!tree[sv])       tree[sv] = {};
    if (!tree[sv][ba])   tree[sv][ba] = {};
    if (!tree[sv][ba][es]) tree[sv][ba][es] = [];
    tree[sv][ba][es].push({ tabla: r.tabla || '', clasificacion: r.clasificacion || '' });
  }
  return tree;
}

/** Invalida el cache de tablas (útil tras operaciones de escritura). */
export function invalidarCacheTablas() {
  _tablasCache   = null;
  _tablasPromise = null;
}
