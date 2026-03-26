/* js/Validador_Modelos/recalcular_scores/recalcularScoreSubseccion.js
   -------------------------------------------------------------------
   Recalcula el score de UNA sub-sección. Si `aplica` = 0 devolvemos 0. */

function recalcularScoreSubseccion (subseccion) {
  /* 🔕 Si la sub-sección completa está apagada ⇒ score = 0 */
  if (subseccion.aplica === 0) {
    subseccion.subseccion_score = 0;
    return;
  }

  let numerador   = 0;
  let denominador = 0;

  Object.values(subseccion.parametros).forEach(parametro => {
    parametro.preguntas.forEach(pregunta => {
      const peso       = parseFloat(pregunta.peso) || 0;
      const porcentaje = (parseFloat(pregunta.porcentajeCompletado) || 0) / 100;
      const aplica     = pregunta.aplica;          // 1 u 0 según mini-switch

      numerador   += peso * porcentaje * aplica;
      denominador += peso * aplica;
    });
  });

  const score = denominador === 0 ? 0 : (numerador / denominador) * 100;
  subseccion.subseccion_score = parseFloat(score.toFixed(2)) || 0;
}
