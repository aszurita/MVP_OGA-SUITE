/**
 * terminosService.js
 * Servicio para gestionar el Glosario de Términos desde SQL Server.
 * Réplica fiel de TerminosService.js y DominiosService.js del proyecto original,
 * convertido a ES Module y usando apiService.js.
 */
import apiService from './apiService.js';

const TABLA_TERMINOS  = 'procesos_bi.dbo.T_terminos';
const TABLA_DOMINIOS  = 'PROCESOS_BI.DBO.t_mapa_dominios';
const TABLA_CASOS_USO = 'PROCESOS_BI.DBO.t_casos_uso_analitica';
const TABLA_CU_TERM   = 'PROCESOS_BI.DBO.T_CASOS_USO_TERMINOS_MB';

function upperKeys(obj) {
  return Object.keys(obj).reduce((acc, key) => {
    acc[key.toUpperCase()] = obj[key];
    return acc;
  }, {});
}

// ─── CLASIFICADOR ──────────────────────────────────────────────────────────────
function clasificarDiccionario(items) {
  const data = {
    todos: items,
    terminos: [],
    atributos: [],
    golden: [],
    elemento_clave: [],
    atributo_referencia: [],
    dominios: new Map(),
  };

  items.forEach((item) => {
    const tipo           = (item.tipo || '').toUpperCase();
    const golden         = item.golden_record;
    const caracteristicas = (item.caracteristicas || '').toLowerCase();

    if (tipo === 'TERMINO') data.terminos.push(item);
    if (tipo === 'ATRIBUTO' || tipo === 'ATRIBUTO/TERMINO') data.atributos.push(item);
    if (golden === 1 || golden === true || golden === '1') data.golden.push(item);
    if (caracteristicas.includes('cde') || caracteristicas.includes('elemento clave de datos'))
      data.elemento_clave.push(item);
    if (caracteristicas.includes('ar') || caracteristicas.includes('atributo de referencia'))
      data.atributo_referencia.push(item);

    const dominiosRaw = item.dominios || '';
    dominiosRaw.trim().split(';').forEach((dom) => {
      const d = dom.trim();
      if (d) data.dominios.set(d, (data.dominios.get(d) || 0) + 1);
    });
  });

  return data;
}

// ─── TÉRMINOS ──────────────────────────────────────────────────────────────────
export async function getTerminosAll() {
  try {
    const items = await apiService.query({
      campos: '*',
      origen: TABLA_TERMINOS,
      condicion: 'sn_activo = 1',
    });
    return clasificarDiccionario(items);
  } catch (err) {
    console.error('[TerminosService] getTerminosAll:', err);
    return { todos: [], terminos: [], atributos: [], golden: [], elemento_clave: [], atributo_referencia: [], dominios: new Map() };
  }
}

export async function getTerminoById(id) {
  try {
    const rows = await apiService.query({
      campos: '*',
      origen: TABLA_TERMINOS,
      condicion: `id = ${id} AND sn_activo = 1`,
    });
    return rows.length > 0 ? rows[0] : null;
  } catch (err) {
    console.error('[TerminosService] getTerminoById:', err);
    return null;
  }
}

export async function crearNuevoTermino(datos, idAutor = 0) {
  const payload = {
    tipo:                  datos.tipo || 'TERMINO',
    nombre:                datos.nombre,
    descripcion:           datos.descripcion,
    fecha_creacion:        new Date().toISOString(),
    autor_creacion:        idAutor,
    dominios:              datos.dominios || null,
    casos_uso:             datos.casos_uso || null,
    caracteristicas:       datos.caracteristicas || null,
    txt_desc_subcategoria: datos.txt_desc_subcategoria || null,
    dato_personal:         datos.dato_personal || null,
    golden_record:         datos.golden_record ? 1 : 0,
    catalogos_asociados:   datos.catalogos_asociados || null,
    etiqueta_tecnica:      datos.etiqueta_tecnica || null,
    prioridad:             datos.prioridad || null,
    sn_activo:             1,
  };
  return apiService.insert(TABLA_TERMINOS, upperKeys(payload));
}

export async function actualizarTermino(id, datos, idAutorModificacion = 0) {
  const payload = { ...datos };
  delete payload.id;
  delete payload.fecha_creacion;
  delete payload.autor_creacion;

  payload.fecha_modificacion  = new Date().toISOString();
  payload.autor_modificacion  = idAutorModificacion;
  if (payload.golden_record !== undefined)
    payload.golden_record = payload.golden_record ? 1 : 0;

  return apiService.update(TABLA_TERMINOS, upperKeys(payload), `id = ${id}`);
}

export async function desactivarTermino(id, motivo = 'Borrado manual', idAutorModificacion = 0) {
  const payload = {
    SN_ACTIVO:          0,
    MOTIVO_ELIMIN:      motivo,
    FECHA_MODIFICACION: new Date().toISOString(),
    AUTOR_MODIFICACION: idAutorModificacion,
  };
  return apiService.update(TABLA_TERMINOS, payload, `id = ${id}`);
}

// ─── DOMINIOS ─────────────────────────────────────────────────────────────────
export async function getDominios() {
  try {
    return await apiService.query({
      campos: 'id_dominio, descripcion_dominio',
      origen: TABLA_DOMINIOS,
      condicion: '1=1',
    });
  } catch (err) {
    console.error('[DominiosService] getDominios:', err);
    return [];
  }
}

// ─── CASOS DE USO ─────────────────────────────────────────────────────────────
export async function getCasosUso() {
  try {
    return await apiService.query({
      campos: 'id_caso_uso, descripcion_caso_uso, id_dominio',
      origen: TABLA_CASOS_USO,
      condicion: "descripcion_caso_uso IS NOT NULL AND descripcion_caso_uso != ''",
    });
  } catch (err) {
    console.error('[CasosUsoService] getCasosUso:', err);
    return [];
  }
}

// ─── RELACIONES TERMINO–CASO USO ──────────────────────────────────────────────
export async function getRelacionesTerminoCasoUso() {
  try {
    return await apiService.query({
      campos: 'id_caso_uso, cod_terminos',
      origen: TABLA_CU_TERM,
      condicion: 'sn_activo = 1',
    });
  } catch (err) {
    console.error('[CasosUsoService] getRelaciones:', err);
    return [];
  }
}

// ─── ACTUALIZAR RELACIONES (edición inline) ────────────────────────────────────
export async function sincronizarRelacionesCasoUso(metadId, casosUsoSeleccionados, usuarioCode) {
  const nowSql = () => new Date().toISOString().slice(0, 23).replace('T', ' ');

  const existentes = await apiService.query({
    campos: 'ID_CASO_TERMINOS, ID_CASO_USO, SN_ACTIVO',
    origen: TABLA_CU_TERM,
    condicion: `COD_TERMINOS = '${metadId}'`,
  });

  const mapaExistentes = new Map((existentes || []).map((r) => [Number(r.ID_CASO_USO), r]));
  const promesas = [];

  casosUsoSeleccionados.forEach((idCasoUso) => {
    const existente = mapaExistentes.get(idCasoUso);
    if (existente) {
      if (!existente.SN_ACTIVO)
        promesas.push(
          apiService.update(TABLA_CU_TERM, {
            SN_ACTIVO: 1,
            FEC_MODIFICACION: nowSql(),
            USUARIO_MODIFICACION: usuarioCode,
          }, `ID_CASO_TERMINOS = ${existente.ID_CASO_TERMINOS}`)
        );
    } else {
      promesas.push(
        apiService.insert(TABLA_CU_TERM, {
          ID_CASO_USO:          idCasoUso,
          TIPO_TERMINOS:        'T',
          COD_TERMINOS:         String(metadId),
          SN_ACTIVO:            1,
          USUARIO_CREACION:     usuarioCode,
          FEC_CREACION:         nowSql(),
        })
      );
    }
  });

  for (const [idCasoUso, reg] of mapaExistentes.entries()) {
    if (reg.SN_ACTIVO && !casosUsoSeleccionados.includes(idCasoUso))
      promesas.push(
        apiService.update(TABLA_CU_TERM, {
          SN_ACTIVO: 0,
          FEC_MODIFICACION: nowSql(),
          USUARIO_MODIFICACION: usuarioCode,
        }, `ID_CASO_TERMINOS = ${reg.ID_CASO_TERMINOS}`)
      );
  }

  if (promesas.length > 0) await Promise.all(promesas);
}
