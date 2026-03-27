/**
 * dominiosService.js
 * Servicio para gestionar el Libro de Dominios desde SQL Server.
 * Usa apiService.js como capa base de comunicación.
 */
import apiService from './apiService.js';

// La tabla de dominios real en SQL (la misma que usa el Glosario para listar dominios)
const TABLA_DOMINIOS_MAPA    = 'PROCESOS_BI.DBO.t_mapa_dominios';
const TABLA_DOMINIO_AVANCES  = 'PROCESOS_BI.DBO.T_DOMINIO_AVANCES';
const TABLA_ARTEFACTOS       = 'PROCESOS_BI.DBO.T_ARTEFACTOS';
const TABLA_ESTRUCTURA       = 'PROCESOS_BI.DBO.T_ESTRUCTURA_DOMINIO';
const TABLA_TABLAS_INV       = 'PROCESOS_BI.DBO.T_TABLAS_INVENTARIO';
const TABLA_CASOS_USO        = 'PROCESOS_BI.DBO.t_casos_uso_analitica';
const TABLA_CU_FUENTES       = 'PROCESOS_BI.DBO.T_CASOS_USO_FUENTES';
const TABLA_CU_TERMINOS      = 'PROCESOS_BI.DBO.T_CASOS_USO_TERMINOS_MB';
const TABLA_TERMINOS         = 'procesos_bi.dbo.T_terminos';

// ─── NORMALIZACIÓN ─────────────────────────────────────────────────────────────
// t_mapa_dominios puede tener campos como descripcion_dominio, tipo_dominio, etc.
// Esta función unifica los nombres de campo para que los componentes siempre
// reciban las mismas propiedades independientemente del nombre real en BD.
function normalizarDominio(row) {
  // Soporta tanto mayúsculas como minúsculas (el driver puede devolver cualquiera)
  const r = {};
  Object.keys(row).forEach((k) => { r[k.toLowerCase()] = row[k]; });

  return {
    id_dominio:        r.id_dominio       ?? r.id            ?? null,
    nombre_dominio:    r.descripcion_dominio ?? r.nombre_dominio ?? r.nombre ?? '',
    tipo_dominio:      r.tipo_dominio     ?? r.tipo          ?? '',
    porcentaje_avance: parseFloat(r.porc_avance ?? r.porcentaje_avance ?? r.avance ?? 0) || 0,
    ola:               r.ola              ?? r.ola_dominio   ?? '',
    estado:            r.estado           ?? r.sn_activo     ?? '',
    familia:           r.familia          ?? '',
    operacion:         r.operacion        ?? '',
    concepto:          r.concepto         ?? r.descripcion   ?? '',
    codificacion:      r.codificacion     ?? r.cod_dominio   ?? '',
    subdominios:       r.subdominios      ?? '',
    color_dominio:     r.color_dominio    ?? null,
    // Preserva el objeto original por si se necesita algún campo extra
    _raw: row,
  };
}

// ─── DOMINIOS ──────────────────────────────────────────────────────────────────

/**
 * Obtiene todos los dominios del Libro de Dominios.
 * Usa t_mapa_dominios (tabla confirmada en producción).
 */
export async function getDominios() {
  try {
    const rows = await apiService.query({
      campos: '*',
      origen: TABLA_DOMINIOS_MAPA,
      condicion: 'sn_activo = 1',
    });
    return rows.map(normalizarDominio);
  } catch (err) {
    console.error('[dominiosService] getDominios:', err);
    return [];
  }
}

/**
 * Obtiene un dominio por su ID.
 * @param {number|string} id
 */
export async function getDominioById(id) {
  try {
    const rows = await apiService.query({
      campos: '*',
      origen: TABLA_DOMINIOS_MAPA,
      condicion: `id_dominio = ${id}`,
    });
    return rows.length > 0 ? normalizarDominio(rows[0]) : null;
  } catch (err) {
    console.error('[dominiosService] getDominioById:', err);
    return null;
  }
}

// ─── AVANCES ───────────────────────────────────────────────────────────────────

/**
 * Obtiene el checklist de avances de un dominio.
 * @param {number|string} id_dominio
 */
export async function getAvancesDominio(id_dominio) {
  try {
    return await apiService.query({
      campos: 'id_avance, id_dominio, tarea, estado, porcentaje',
      origen: TABLA_DOMINIO_AVANCES,
      condicion: `id_dominio = ${id_dominio}`,
    });
  } catch (err) {
    console.error('[dominiosService] getAvancesDominio:', err);
    return [];
  }
}

// ─── ARTEFACTOS ────────────────────────────────────────────────────────────────

/**
 * Obtiene los artefactos asociados a un dominio.
 * @param {number|string} id_dominio
 */
export async function getArtefactosByDominio(id_dominio) {
  try {
    return await apiService.query({
      campos: 'id_artefacto, id_dominio, nombre, tipo_artefacto, descripcion, sn_activo',
      origen: TABLA_ARTEFACTOS,
      condicion: `id_dominio = ${id_dominio} AND sn_activo = 1`,
    });
  } catch (err) {
    console.error('[dominiosService] getArtefactosByDominio:', err);
    return [];
  }
}

// ─── ESTRUCTURA ────────────────────────────────────────────────────────────────

/**
 * Obtiene la estructura de personas asignadas a un dominio.
 * @param {number|string} id_dominio
 */
export async function getEstructuraByDominio(id_dominio) {
  try {
    return await apiService.query({
      campos: 'id_estructura, id_dominio, nombre_empleado, codigo_empleado, rol',
      origen: TABLA_ESTRUCTURA,
      condicion: `id_dominio = ${id_dominio}`,
    });
  } catch (err) {
    console.error('[dominiosService] getEstructuraByDominio:', err);
    return [];
  }
}

// ─── TABLAS OFICIALES ──────────────────────────────────────────────────────────

/**
 * Obtiene las tablas del inventario asociadas a un dominio por nombre.
 * @param {string} nombre_dominio
 */
export async function getTablasOficiales(nombre_dominio) {
  try {
    return await apiService.query({
      campos: 'id_tabla, id_dominio, nombre_dominio, servidor, base_datos, esquema, tabla, metadato, campo, porcentaje_completado, etiqueta',
      origen: TABLA_TABLAS_INV,
      condicion: `nombre_dominio = '${nombre_dominio}'`,
    });
  } catch (err) {
    console.error('[dominiosService] getTablasOficiales:', err);
    return [];
  }
}

// ─── CASOS DE USO ──────────────────────────────────────────────────────────────

/**
 * Obtiene los casos de uso de un dominio (todos los campos).
 * @param {number|string} id_dominio
 */
export async function getCasosUsoByDominio(id_dominio) {
  try {
    return await apiService.query({
      campos: 'id_caso_uso, descripcion_caso_uso, id_dominio, subdominio, estado, activo, tipo_iniciativa, detalle, entregable, especialista, sponsor, ingeniero_responsable',
      origen: TABLA_CASOS_USO,
      condicion: `id_dominio = ${id_dominio} AND activo = 1`,
    });
  } catch (err) {
    console.error('[dominiosService] getCasosUsoByDominio:', err);
    return [];
  }
}

/**
 * Obtiene un caso de uso por su ID con todos los detalles.
 * @param {number|string} id_caso_uso
 */
export async function getCasoUsoById(id_caso_uso) {
  try {
    const rows = await apiService.query({
      campos: 'id_caso_uso, descripcion_caso_uso, id_dominio, subdominio, estado, activo, tipo_iniciativa, detalle, entregable, especialista, sponsor, ingeniero_responsable',
      origen: TABLA_CASOS_USO,
      condicion: `id_caso_uso = ${id_caso_uso}`,
    });
    return rows.length > 0 ? rows[0] : null;
  } catch (err) {
    console.error('[dominiosService] getCasoUsoById:', err);
    return null;
  }
}

// ─── FUENTES DE CASO DE USO ────────────────────────────────────────────────────

/**
 * Obtiene las fuentes (tablas origen) asociadas a un caso de uso.
 * @param {number|string} id_caso_uso
 */
export async function getFuentesByCasoUso(id_caso_uso) {
  try {
    return await apiService.query({
      campos: 'id_fuente, id_caso_uso, servidor, base_datos, esquema, tabla',
      origen: TABLA_CU_FUENTES,
      condicion: `id_caso_uso = ${id_caso_uso}`,
    });
  } catch (err) {
    console.error('[dominiosService] getFuentesByCasoUso:', err);
    return [];
  }
}

// ─── TÉRMINOS DE CASO DE USO ───────────────────────────────────────────────────

/**
 * Obtiene los términos vinculados a un caso de uso
 * (join entre T_CASOS_USO_TERMINOS_MB y T_terminos).
 * @param {number|string} id_caso_uso
 */
export async function getTerminosByCasoUso(id_caso_uso) {
  try {
    // Primero obtenemos los vínculos
    const relaciones = await apiService.query({
      campos: 'id_caso_terminos, id_caso_uso, cod_terminos, sn_activo',
      origen: TABLA_CU_TERMINOS,
      condicion: `id_caso_uso = ${id_caso_uso} AND sn_activo = 1`,
    });

    if (!relaciones.length) return [];

    // Luego obtenemos los detalles de cada término
    const ids = relaciones.map((r) => r.cod_terminos || r.COD_TERMINOS).filter(Boolean).join(',');
    if (!ids) return [];

    return await apiService.query({
      campos: 'id, nombre, descripcion, tipo, dominios',
      origen: TABLA_TERMINOS,
      condicion: `id IN (${ids}) AND sn_activo = 1`,
    });
  } catch (err) {
    console.error('[dominiosService] getTerminosByCasoUso:', err);
    return [];
  }
}

// ─── TÉRMINOS POR DOMINIO ──────────────────────────────────────────────────────

/**
 * Obtiene términos/atributos filtrados por nombre de dominio y opcionalmente por tipo.
 * @param {string} nombre_dominio — nombre del dominio a buscar en el campo "dominios"
 * @param {string} [tipo] — 'atributo' | 'termino' | undefined (todos)
 */
export async function getTerminosByDominio(nombre_dominio, tipo) {
  try {
    let condicion = `dominios LIKE '%${nombre_dominio}%' AND sn_activo = 1`;

    if (tipo) {
      const tipoUpper = tipo.toUpperCase();
      if (tipoUpper === 'ATRIBUTO') {
        condicion += ` AND (tipo = 'ATRIBUTO' OR tipo = 'ATRIBUTO/TERMINO')`;
      } else if (tipoUpper === 'TERMINO') {
        condicion += ` AND tipo = 'TERMINO'`;
      }
    }

    return await apiService.query({
      campos: '*',
      origen: TABLA_TERMINOS,
      condicion,
    });
  } catch (err) {
    console.error('[dominiosService] getTerminosByDominio:', err);
    return [];
  }
}
