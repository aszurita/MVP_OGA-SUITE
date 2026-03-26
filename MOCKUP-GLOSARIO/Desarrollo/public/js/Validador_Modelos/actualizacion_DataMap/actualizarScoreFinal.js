/* js/Validador_Modelos/actualizacion_DataMap/actualizarScoreFinal.js
   ----------------------------------------------------------------- */
function actualizarScoreFinal (updateDOM = true) {
  let numerador   = 0;
  let denominador = 0;

  Object.values(dataMapGlobal).forEach(sec => {
    /* si tu lógica requiere sec.__activa, déjala; si no, quítala */
    if (sec.__activa === false) return;

    const peso  = +sec.peso_seccion  || 0;
    const score = +sec.seccion_score || 0;

    numerador   += peso * score;
    denominador += peso;
  });

  /* resultado en número – ej.: 83.47 */
  const scoreFinal = denominador === 0 ? 0 : (numerador / denominador);
  const scoreRedondeado = +scoreFinal.toFixed(2);     // → número, no string

  /* 🔑 aquí la “variable global” que otros módulos consultan */
  window.ultimoScoreFinal = scoreRedondeado;

  /* Etiqueta en pantalla */
  if (updateDOM) {
    const lbl = document.getElementById("score-final-label");
    if (lbl) lbl.textContent = `${scoreRedondeado}%`;
  }

  console.log(`🎯 Score Final actualizado: ${scoreRedondeado}%`);
  window.scoreFinalCabecera = scoreRedondeado;
  updateScoreFinalCard(scoreRedondeado)
  return scoreRedondeado;
}







function statusClassForFinalScore(score){
  const s = typeof score === "string" ? parseFloat(score) : Number(score) || 0;
  if (s >= 86) return "status-verde";
  if (s >= 71) return "status-amarillo";
  if (s >= 50) return "status-naranja";
  return "status-rojo";
}

function updateScoreFinalCard(score){
  const label = document.getElementById('score-final-label');
  if (!label) return;
  const card = label.closest('.card');
  if (!card) return;

  // Actualiza el texto
  const num = typeof score === "string" ? parseFloat(score) : Number(score) || 0;
  label.textContent = `${num.toFixed(2)}%`;

  // Limpia estados anteriores y aplica el nuevo
  const states = ["status-verde","status-amarillo","status-naranja","status-rojo"];
  card.classList.remove(...states);
  card.classList.add(statusClassForFinalScore(num));
}
