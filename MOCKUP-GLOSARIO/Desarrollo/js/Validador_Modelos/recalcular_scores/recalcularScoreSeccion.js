/* js/Validador_Modelos/recalcular_scores/recalcularScoreSeccion.js
   ----------------------------------------------------------------
   Recalcula el score de una SECCIÓN principal, ignorando aquellas
   sub-secciones cuyo flag `aplica` = 0                               */

function recalcularScoreSeccion (seccionFiltrada) {
  const dataMap = dataMapGlobal[seccionFiltrada];
  if (!dataMap) return;

  let numerador   = 0;
  let denominador = 0;

  Object.values(dataMap).forEach(entry => {
    /* Solo tomamos objetos que realmente son sub-secciones */
    if (typeof entry === "object" && entry.subseccion_score !== undefined) {

      /* ⛔️ Si la sub-sección está inactiva no cuenta */
      if (entry.aplica === 0) return;

      const peso  = entry.peso_subseccion || 0;
      const score = entry.subseccion_score || 0;

      numerador   += peso * score;
      denominador += peso;
    }
  });

  const scoreSeccion    = denominador === 0 ? 0 : (numerador / denominador);
  dataMap.seccion_score = parseFloat(scoreSeccion.toFixed(2)) || 0;
}
