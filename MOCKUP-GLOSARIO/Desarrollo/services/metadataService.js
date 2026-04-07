// Base URL de la API OGA — cambiar a producción cuando corresponda
const BASE_URL = 'http://localhost:8000';

async function apiFetch(path, params = {}) {
  const url = new URL(BASE_URL + path);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== '') url.searchParams.set(k, v);
  });
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
  return res.json();
}

/**
 * Normaliza la respuesta paginada de la API:
 * { total, page, size, pages, data } → { items, total, pages }
 */
function normalizePaginated(apiResponse) {
  return {
    items: apiResponse.data || [],
    total: apiResponse.total || 0,
    pages: apiResponse.pages || 1,
    page:  apiResponse.page  || 1,
    size:  apiResponse.size  || 0,
  };
}

/** Verifica estado de la base de datos */
export function checkHealth() {
  return apiFetch('/status');
}

/**
 * Carga los filtros disponibles para la barra lateral.
 * Devuelve { servidores, plataformas, clasificaciones }
 */
export async function getFilters() {
  const [servidores, plataformas, clasificaciones] = await Promise.all([
    apiFetch('/facetas/servidores'),
    apiFetch('/facetas/plataformas'),
    apiFetch('/facetas/clasificaciones'),
  ]);
  return { servidores, plataformas, clasificaciones };
}

/**
 * Vista nivel tabla — endpoint GET /tablas
 * Filtros: plataforma, servidor, base, esquema, q, page, size
 */
export function getTableView({ plataforma, servidor, base, esquema, q, owner_q, owner_type, page = 1, page_size = 20 } = {}) {
  return apiFetch('/tablas', { plataforma, servidor, base, esquema, q, owner_q, owner_type, page, size: page_size }).then(normalizePaginated);
}

export function getOwnerFacets() {
  return Promise.all([
    apiFetch('/facetas/owners'),
    apiFetch('/facetas/stewards'),
  ]).then(([owners, stewards]) => ({ owners, stewards }));
}

/**
 * Vista nivel campo — endpoint GET /campos
 * Filtros: plataforma, servidor, base, esquema, tabla, tabla_q (LIKE), clasificacion, q, page, size
 * tabla_q: búsqueda parcial en nombre de tabla (para "agrupar por campos" desde vista tabla)
 */
export function getFieldView({ plataforma, servidor, base, esquema, tabla, tabla_q, clasificacion, q, page = 1, page_size = 20 } = {}) {
  return apiFetch('/campos', { plataforma, servidor, base, esquema, tabla, tabla_q, clasificacion, q, page, size: page_size }).then(normalizePaginated);
}

/**
 * Detalle de un campo por llave_unica
 * Ejemplo: DATABRICKS_DBO_DEV_GOVERNANCE_SRI_HISTORICO_RUC
 */
export function getCampoDetalle(llave_unica) {
  return apiFetch(`/campos/${encodeURIComponent(llave_unica)}`);
}

/**
 * Detalle de una tabla + data owner/steward
 */
export function getTablaDetalle(llave_tabla) {
  return apiFetch(`/tablas/${encodeURIComponent(llave_tabla)}`);
}

/**
 * Campos de una tabla específica
 */
export function getCamposDeTabla(llave_tabla, { page = 1, size = 500 } = {}) {
  return apiFetch(`/tablas/${encodeURIComponent(llave_tabla)}/campos`, { page, size }).then(normalizePaginated);
}

/**
 * Árbol jerárquico servidor → base → esquema → tablas
 */
export function getArbol(servidor = null) {
  return apiFetch('/facetas/arbol', servidor ? { servidor } : {});
}
