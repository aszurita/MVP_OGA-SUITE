/* js/Validador_Modelos/utils/resetDataMapGlobal.js
   ------------------------------------------------ */
function resetDataMapGlobal () {

  /* 1. Deja en 0 cada pregunta y cada score en memoria */
  Object.entries(dataMapGlobal).forEach(([seccionNom, seccionData]) => {

    let seccionScore = 0;

    for (const [subId, sub] of Object.entries(seccionData)) {
      if (!sub || !sub.parametros) continue;

      let subScore = 0;

      Object.values(sub.parametros).forEach(param => {
        param.preguntas.forEach(p => {
          p.porcentajeCompletado = 0;
          p.aplica               = 1;               // mini-switch ON
        });
      });

      /* ◆ Fuerza el switch maestro ON */
      sub.aplica           = 1;                      // ← NUEVO
      sub.subseccion_score = subScore;

      /* ◆ Si la tarjeta ya existe, tilda el checkbox maestro */
      const gSw = document.getElementById(`sw-global-collapse-${subId}`) ||
                  document.querySelector(`[data-subid='${subId}']`);
      if (gSw) gSw.checked = true;                  // visual
    }

    seccionData.seccion_score = seccionScore;
  });

  /* 2. Refresca etiquetas del DOM */
  Object.entries(dataMapGlobal).forEach(([seccionNom, seccionData]) => {
    actualizarScoreSeccionEnDOM(seccionNom);
    Object.keys(seccionData).forEach(subId => {
      actualizarScoreSubseccionEnDOM(seccionNom, String(subId));
    });
  });

  /* 3. Score final a 0 % */
  actualizarScoreFinal();

  console.log("🧹 dataMapGlobal y etiquetas reiniciadas a 0 %");
}
