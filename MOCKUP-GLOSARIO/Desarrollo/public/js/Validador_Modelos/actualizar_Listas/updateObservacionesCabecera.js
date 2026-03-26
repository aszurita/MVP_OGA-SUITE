/* js/Validador_Modelos/actualizar_Listas/updateObservacionesCabecera.js */

/**
 * Construye el payload para actualizar las observaciones de la cabecera.
 * @param {number} internalId - El ID de la fila en la base de datos.
 * @param {object} obsObj - Objeto con las observaciones.
 * @param {string} fecha - La fecha en formato "dd-mm-yyyy".
 * @returns {object} El payload listo para la API.
 */
function buildUpdateObservacionesPayload(internalId, obsObj = {}, fecha) {
  // Mantiene compatibilidad con tu helper si existe
  const normalizadas = (typeof normalizarObs === "function")
    ? normalizarObs(obsObj)
    : {
        obs_seccion1: obsObj.obs_seccion1,
        obs_seccion2: obsObj.obs_seccion2,
        obs_seccion3: obsObj.obs_seccion3,
        obs_seccion4: obsObj.obs_seccion4
      };

  const datos = { FECHA: toYMD(fecha) };

  if (Object.prototype.hasOwnProperty.call(obsObj, "observaciones")) {
    datos.OBSERVACIONES = (obsObj.observaciones ?? "").toString();
  }

  ["obs_seccion1", "obs_seccion2", "obs_seccion3", "obs_seccion4"].forEach(k => {
    if (Object.prototype.hasOwnProperty.call(normalizadas, k)) {
      datos[k.toUpperCase()] = (normalizadas[k] ?? "").toString();
    }
  });

  return {
    tabla: "procesos_bi.dbo.T_Z_cabecera_SCORE",
    datos,
    condicion: `Id_validacion = ${internalId}`
  };
}
/* js/Validador_Modelos/updateObservacionesCabecera.js
 * -----------------------------------------------------------------
 *  Actualiza:
 *     ─ observaciones        (texto global)
 *     ─ obs_seccion1..4      (por sección)
 *  Sólo sobre-escribe las claves presentes en `obsObj`.
 *  Siempre añade auditoría → fecha
 *  Target: BG_Lab.DBO.Z_CABECERA_SCORE_Prueba
 * -----------------------------------------------------------------*/
async function updateObservacionesCabecera(internalId, obsObj = {}, fecha) {
  if (!internalId) {
    console.warn("⚠️ updateObservacionesCabecera: internalId vacío, se aborta.");
    return;
  }

  const payload = buildUpdateObservacionesPayload(internalId, obsObj, fecha);
  console.log("🔵 PUT http://gobinfoana01-2:8510/update (Cabecera - Observaciones)", payload);

  try {
    const resp = await fetch("http://gobinfoana01-2:8510/update", {
      method: "PUT",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const body = await resp.json().catch(() => null);

    if (!resp.ok) {
      console.error(`❌ Observaciones KO (HTTP ${resp.status})`, body);
      return;
    }
    if (body && body.detail) {
      console.error("❌ Observaciones KO (detail):", body.detail);
      return;
    }

    console.log("📝 Observaciones OK", body);
  } catch (e) {
    console.error("❌ Error de red/JS en updateObservacionesCabecera:", e);
  }
}

/**
 * Construye el payload para actualizar el score final de la cabecera.
 * @param {number} internalId - El ID de la fila en la base de datos.
 * @param {number} score - El score final.
 * @param {string} fecha - La fecha en formato "dd-mm-yyyy".
 * @returns {object} El payload listo para la API.
 */
function buildUpdateScoreFinalPayload(internalId, score, fecha) {
  return {
    tabla: "procesos_bi.dbo.T_Z_cabecera_SCORE",
    datos: {
      SCORE_FINAL: Number(score) || 0,
      FECHA: toYMD(fecha)
    },
    condicion: `id_validacion = ${internalId}`
  };
}

/* js/Validador_Modelos/actualizar_Listas/updateScoreFinalCabecera.js
 * -----------------------------------------------------------------
 *  Sólo actualiza la columna SCORE_FINAL + FECHA de una cabecera
 *  Target: BG_Lab.DBO.Z_CABECERA_SCORE_Prueba
 * -----------------------------------------------------------------*/
async function updateScoreFinalCabecera(internalId, score, fecha) {
  if (!internalId) {
    console.warn("⚠️ updateScoreFinalCabecera: internalId vacío, se aborta.");
    return;
  }

  const payload = buildUpdateScoreFinalPayload(internalId, score, fecha);
  console.log("🔵 PUT http://gobinfoana01-2:8510/update (Cabecera - score_final)", payload);

  try {
    const resp = await fetch("http://gobinfoana01-2:8510/update", {
      method: "PUT",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const body = await resp.json().catch(() => null);

    if (!resp.ok) {
      console.error(`❌ Error score_final (HTTP ${resp.status})`, body);
      return;
    }
    if (body && body.detail) {
      console.error("❌ Error score_final (detail):", body.detail);
      return;
    }

    console.log("✅ score_final actualizado", body);
  } catch (e) {
    console.error("❌ Error de red/JS en updateScoreFinalCabecera:", e);
  }
}


/*  Devuelve únicamente las columnas que el usuario pudo modificar.
 *  Si una sección no está visible NO se incluye en el objeto.      */
function getObservacionesSecciones() {
  const result = {};
  Object.entries(SECTION_COLUMNS).forEach(([_, col]) => {
    const $txt = $(`#txtObsSec_${sanitizeId(col)}`);
    if ($txt.length) {                               // la sección está cargada
      result[col] = ($txt.val() || "").trim();       // incluso vacío ⇒ update
    }
  });
  return result; // p.e. {obs_seccion2:"texto", obs_seccion3:""}
}
