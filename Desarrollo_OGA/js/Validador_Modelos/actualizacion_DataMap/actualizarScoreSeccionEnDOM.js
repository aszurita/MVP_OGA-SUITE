/* js/Validador_Modelos/actualizacion_DataMap/actualizarScoreSeccionEnDOM.js
   ------------------------------------------------------------------------ */

function actualizarScoreSeccionEnDOM (seccionFiltrada) {
  const dataMap = dataMapGlobal[seccionFiltrada];
  if (!dataMap) {
    console.warn("No se encontró el dataMap de la sección:", seccionFiltrada);
    return;
  }

  let numerador   = 0;
  let denominador = 0;

  /* Suma ponderada de las sub-secciones activas */
  Object.values(dataMap).forEach(entry => {
    if (typeof entry === "object" && entry.subseccion_score !== undefined) {
      if (entry.aplica === 0) return;           // ⛔️ ignorar inactivas

      const peso  = entry.peso_subseccion || 0;
      const score = entry.subseccion_score || 0;

      numerador   += peso * score;
      denominador += peso;
    }
  });

  const scoreSeccion     = denominador === 0 ? 0 : (numerador / denominador);
  const scoreFinal       = parseFloat(scoreSeccion.toFixed(2));
  dataMap.seccion_score  = scoreFinal;          // guarda en memoria

  /* Actualiza la etiqueta en la tarjeta lateral */
  const scoreElementId   = `score-seccion-${seccionFiltrada}`;
  const scoreElement     = document.getElementById(scoreElementId);

  if (scoreElement) {
    scoreElement.textContent = `${scoreFinal}%`;
  } else {
    console.warn("No se encontró el elemento del score de la sección:", scoreElementId);
  }

  console.log(`✅ Score actualizado para la sección “${seccionFiltrada}” → ${scoreFinal}%`);
}
