/*  js/Validador_Modelos/listeners/switchGlobalSub.js
 *  -------------------------------------------------
 *  Listener «change» para el switch maestro (class=sw-aplica-sub)
 *
 *  ▸ Guarda / restaura el % original de cada pregunta  (p._backupPct)
 *  ▸ Sincroniza mini-switches, sliders y tooltips en la UI
 *  ▸ Recalcula:
 *       – Score de la SUB-sección
 *       – Score de la SECCIÓN principal
 *       – Score FINAL
 *  ▸ Refresca las etiquetas Score correspondientes en el DOM
 *  ------------------------------------------------- */

function switchGlobalSubseccion(){
$(document).on("change", ".sw-aplica-sub", function () {

  /* ───── 1. Localizar la sub-sección en dataMapGlobal ───── */
  const seccion = $(this).data("seccion") || seccionActual;     // respaldo
  const subId   = String($(this).data("subid"));                // siempre string
  const aplicar = this.checked ? 1 : 0;                         // 1 = ON - 0 = OFF

  const sub = dataMapGlobal[seccion]?.[subId];
  if (!sub) {
    console.error("❌ Sub-sección no encontrada", seccion, subId);
    return;
  }

  /* ───── 2. Actualizar modelo en memoria (backup / restore) ───── */
  Object.values(sub.parametros).forEach(param => {
    param.preguntas.forEach(p => {

      /* guarda/restaura el porcentaje original */
      if (!aplicar) {                               // ↯  OFF → respaldar + poner 0 %
        if (p._backupPct === undefined) p._backupPct = p.porcentajeCompletado;
        p.porcentajeCompletado = 0;
      } else {                                      // ↱  ON  → restaurar, si existe
        if (p._backupPct !== undefined) {
          p.porcentajeCompletado = p._backupPct;
          delete p._backupPct;
        }
      }
      p.aplica = aplicar;
    });
    sub.aplica = aplicar;
  });

  /* ───── 3. Sincronizar la UI (mini-switches / sliders) ───── */
  Object.entries(sub.parametros).forEach(([paramId, param]) => {
    param.preguntas.forEach((p, idx) => {

      const miniSwId = `switch-${subId}-${paramId}-${idx}`;
      const sliderId = `completado-${subId}-${paramId}-${idx}`;
      const ttId     = `tooltip-${subId}-${paramId}-${idx}`;

      const miniSw  = document.getElementById(miniSwId);
      const slider  = document.getElementById(sliderId);
      const tooltip = document.getElementById(ttId);

      /* ► mini-switch */
      if (miniSw){
        miniSw.checked  = !!aplicar;
        miniSw.disabled = !aplicar;

        const lbl = miniSw.nextElementSibling;      // pseudo-botón
        if (lbl){
          lbl.style.backgroundColor = aplicar ? "#D2006E" : "#ccc";
          lbl.style.borderColor     = aplicar ? "#D2006E" : "#ccc";
        }
      }

      /* ► slider + tooltip */
      if (slider && tooltip){
        const pct = aplicar ? p.porcentajeCompletado : 0;

        slider.disabled     = !aplicar;
        slider.style.filter = aplicar ? "none" : "grayscale(100%)";
        slider.value        = pct;

        tooltip.textContent = pct + "%";
        tooltip.style.left  = `calc(${slider.offsetWidth * pct / 100}px)`;
        tooltip.style.backgroundColor = aplicar ? "#ffffff" : "#555";
        tooltip.style.color           = aplicar ? "#D2006E" : "#eee";
        tooltip.style.border          = aplicar ? "1px solid #D2006E" : "none";
      }
    });
  });

  /* ───── 4. Recalcular scores (memoria) ───── */
  recalcularScoreSubseccion(sub);
  recalcularScoreSeccion(seccion);
  actualizarScoreFinal();

  /* ───── 5. Refrescar etiquetas Score en el DOM ───── */

  /* 5-a) Score de la SUB-sección */
  const scoreSubEl = document.getElementById(`score-collapse-main-${subId}`);
  if (scoreSubEl){
    scoreSubEl.textContent = sub.subseccion_score.toFixed(2);
  }

  /* 5-b) Score de la SECCIÓN (tarjeta lateral) */
  actualizarScoreSeccionEnDOM(seccion);
});

}