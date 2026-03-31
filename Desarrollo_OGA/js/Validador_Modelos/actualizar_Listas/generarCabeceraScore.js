/* js/Validador_Modelos/generarCabeceraScore.js
 * ----------------------------------------------------------------
 *  Devuelve un array-objeto con TODAS las columnas de la cabecera.
 *  – observaciones        → texto global ("" si no hay)
 *  – obs_seccion1 … 4     → observaciones por sección
 * ----------------------------------------------------------------*/
function generarCabeceraScore(id_validacion, codigoModelo,
                              usuario, fecha, scoreFinal, obs = {}) {

  const observacionesTxt = obs.observaciones || "";

  return [{
    id_validacion : String(id_validacion),
    codigo_modelo : codigoModelo,
    usuario,
    fecha,
    score_final   : scoreFinal,               // 🆕
    observaciones : observacionesTxt,
    obs_seccion1  : obs.obs_seccion1 || "",
    obs_seccion2  : obs.obs_seccion2 || "",
    obs_seccion3  : obs.obs_seccion3 || "",
    obs_seccion4  : obs.obs_seccion4 || ""
  }];
}

