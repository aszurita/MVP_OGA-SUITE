/**
 * Lector de Analytics Model Canvas vía API SQL.
 * Retorna un arreglo similar al consumido por suite.js.
 */
function normalizeUTCString(value = "") {
  const raw = (value || "").toString().trim();
  if (!raw) return "";
  if (raw.endsWith("Z")) return raw;
  return `${raw}Z`;
}

const AMC_API_CACHE = {
  items: new Map()
};

function buildAMCCacheKey({ idAMC = null, nombreAMC = null, username = null } = {}) {
  return `id=${idAMC || ""}|nombre=${nombreAMC || ""}|user=${username || ""}`;
}

function clearAnalyticsModelCanvasCache() {
  AMC_API_CACHE.items.clear();
}

function getAnalyticsModelCanvasAPI({
  idAMC = null,
  nombreAMC = null,
  username = null,
  useCache = true,
  cacheMs = 15000
} = {}) {
  const items = [];
  const escapeVal = (val = "") => String(val).replace(/'/g, "''");

  let condicion = "1=1";
  if (idAMC) condicion = `id_amc='${escapeVal(idAMC)}'`;
  else if (nombreAMC) condicion = `nombre_amc='${escapeVal(nombreAMC)}'`;
  else if (username) condicion = `(id_amc LIKE '${escapeVal(username)}-%' OR usuario_creacion LIKE '${escapeVal(username)}%')`;
  // SOLUCION TEMPORAL: ocultar AMCs marcados como eliminados (estado = 0).
  condicion = `(${condicion}) AND (estado IS NULL OR estado <> '0')`;

  const cacheKey = buildAMCCacheKey({ idAMC, nombreAMC, username });
  if (useCache) {
    const cached = AMC_API_CACHE.items.get(cacheKey);
    if (cached && (Date.now() - cached.ts) < cacheMs) {
      return cached.data.slice();
    }
  }

  try {
    $.ajax({
      url: "http://gobinfoana01-2:8510/query",
      method: "POST",
      async: false,
      contentType: "application/json",
      data: JSON.stringify({
        campos: "*",
        origen: "procesos_bi.dbo.T_ANALYTICS_MODEL_CANVAS",
        condicion
      }),
      success: function (resp) {
        const rows = Array.isArray(resp) ? resp : (resp ? [resp] : []);
        rows.forEach(row => {
          if (!row) return;
          items.push({
            idAMC: row.id_amc || "",
            nombreAMC: row.nombre_amc || "",
            areaSolicitante: row.area_solicitante || "",
            sponsor: (row.sponsor || "").toLowerCase(),
            formato: row.formato || "",
            decisiones: row.decisiones || "",
            predicciones: row.predicciones || "",
            tareas: row.tareas || "",
            evaluacionDesarrollo: row.evaluacion_desarrollo || "",
            propuestaValor: row.propuesta_valor || "",
            fuentesDatos: row.fuentes_datos || "",
            caracteristicasReentrenamiento: row.caracteristicas_reentrenamiento || "",
            recoleccionInformacion: row.recoleccion_informacion || "",
            tiemposResponsables: row.tiempos_responsables || "",
            monitoreoCreacionValor: row.monitoreo_creacion_valor || "",
            evaluacion: row.evaluacion || "",
            usuarioCreacion: (row.usuario_creacion || "").toLowerCase(),
          fechaCreacion: normalizeUTCString(row.fecha_creacion),
          usuarioUltimaModificacion: row.usuario_ultima_modificacion || "",
          fechaUltimaModificacion: normalizeUTCString(row.fecha_ultima_modificacion),
            estado: row.estado || "",
            usuariosPermisos: row.usuarios_permisos || "",
          });
        });
      }
    });
  } catch (e) {
    console.warn("AMC API exception:", e);
  }

  if (useCache) {
    AMC_API_CACHE.items.set(cacheKey, { ts: Date.now(), data: items.slice() });
  }
  return items;
}


function upperKeys(obj = {}) {
  const out = {};
  Object.keys(obj).forEach(key => {
    out[String(key).toUpperCase()] = obj[key];
  });
  return out;
}

function insertAnalyticsModelCanvasAPI({ data = {}, onSuccess = null, onError = null } = {}) {
  const payload = {
    tabla: "procesos_bi.dbo.T_ANALYTICS_MODEL_CANVAS",
    datos: upperKeys(data)
  };

  $.ajax({
    url: "http://gobinfoana01-2:8510/insert",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(payload),
    success: function (resp) {
      clearAnalyticsModelCanvasCache();
      if (typeof invalidateFichaAMCCache === "function") {
        invalidateFichaAMCCache();
      }
      if (typeof onSuccess === "function") onSuccess(resp);
    },
    error: function (xhr, status, errorThrown) {
      if (typeof onError === "function") onError(xhr, status, errorThrown);
    }
  });
}

function updateAnalyticsModelCanvasAPI({ data = {}, condicion = "", onSuccess = null, onError = null } = {}) {
  const payload = {
    tabla: "procesos_bi.dbo.T_ANALYTICS_MODEL_CANVAS",
    datos: upperKeys(data),
    condicion
  };

  $.ajax({
    url: "http://gobinfoana01-2:8510/update",
    method: "PUT",
    contentType: "application/json",
    data: JSON.stringify(payload),
    success: function (resp) {
      clearAnalyticsModelCanvasCache();
      if (typeof invalidateFichaAMCCache === "function") {
        invalidateFichaAMCCache();
      }
      if (typeof onSuccess === "function") onSuccess(resp);
    },
    error: function (xhr, status, errorThrown) {
      if (typeof onError === "function") onError(xhr, status, errorThrown);
    }
  });
}

function deleteAnalyticsModelCanvasAPI({ idAMC = null, condicion = "", onSuccess = null, onError = null } = {}) {
  if (!idAMC && !condicion) return;
  const condition = condicion || `id_amc='${(String(idAMC || "")).replace(/'/g, "''")}'`;
  // SOLUCION TEMPORAL: no se borra físicamente, solo se marca estado = 0.
  updateAnalyticsModelCanvasAPI({
    data: {
      estado: "0",
      fecha_ultima_modificacion: new Date().toISOString(),
      usuario_ultima_modificacion: (window.current_user || "").toLowerCase()
    },
    condicion: condition,
    onSuccess,
    onError
  });
}

function isAMCLinkedToModelAPI({ idAMC = null } = {}) {
  if (!idAMC) return false;
  let linked = false;
  const escapeVal = (val = "") => String(val).replace(/'/g, "''");
  try {
    $.ajax({
      url: "http://gobinfoana01-2:8510/query",
      method: "POST",
      async: false,
      contentType: "application/json",
      data: JSON.stringify({
        campos: "top 1 cod_canva",
        origen: "procesos_bi.dbo.T_DOMINIO_ART_MODELOS",
        condicion: `cod_canva='${escapeVal(idAMC)}'`
      }),
      success: function (resp) {
        const rows = Array.isArray(resp) ? resp : (resp ? [resp] : []);
        linked = rows.length > 0;
      }
    });
  } catch (e) {
    console.warn("AMC link check exception:", e);
  }
  return linked;
}
