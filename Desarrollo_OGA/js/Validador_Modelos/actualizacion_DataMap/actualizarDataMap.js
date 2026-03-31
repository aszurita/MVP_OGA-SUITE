/* js/Validador_Modelos/actualizacion_DataMap/actualizarDataMap.js
 * ----------------------------------------------------------------
 *  • Actualiza el valor de *una* pregunta dentro de dataMapGlobal
 *  • Recalcula:
 *        – score de la SUB-sección
 *        – score de la SECCIÓN principal
 *        – score FINAL
 *  • Refresca en el DOM la etiqueta Score de la sub-sección
 *    y la de la sección principal.
 * ---------------------------------------------------------------- */
function actualizarDataMap (
  porcentajeCompletado,   // nuevo %  (string o número)
  aplica,                 // boolean  true → 1 · false → 0
  seccionFiltrada,        // nombre de sección principal
  subId,                  // id de la sub-sección
  paramId,                // id del parámetro
  idx                     // índice de la pregunta
){

  /* ── 1. Salvaguardas básicas ───────────────────────────────────── */
  const seccion    = dataMapGlobal[seccionFiltrada];
  if(!seccion){ console.error("Sección inexistente:", seccionFiltrada); return; }

  const sub        = seccion[subId];
  if(!sub){ console.error("Sub-sección inexistente:", subId); return; }

  const parametro  = sub.parametros[paramId];
  if(!parametro){ console.error("Parámetro inexistente:", paramId); return; }

  const pregunta   = parametro.preguntas[idx];
  if(!pregunta){ console.error("Pregunta inexistente idx:", idx); return; }

  /* ── 2. Actualizar el modelo en memoria ────────────────────────── */
  pregunta.porcentajeCompletado = parseInt(porcentajeCompletado,10) || 0;
  pregunta.aplica               = aplica ? 1 : 0;

  /* ── 3. Recalcular scores (memoria) ────────────────────────────── */
  recalcularScoreSubseccion(sub);
  recalcularScoreSeccion(seccionFiltrada);
  actualizarScoreFinal();

  /* ── 4. Refrescar etiquetas Score en el DOM ────────────────────── */
  actualizarScoreSubseccionEnDOM(seccionFiltrada, String(subId));   // label de sub-sección
  actualizarScoreSeccionEnDOM(seccionFiltrada);                     // label de sección

  /* ── 5. Debug opcional ─────────────────────────────────────────── */
  console.log("📊 DataMap actualizado:", dataMapGlobal);
}


/* js/Validador_Modelos/utils/sanitizeId.js
   Devuelve un string válido para usar como id/selector */
function sanitizeId(txt = ""){
  return txt
          .toString()
          .normalize("NFD")               // quita tildes
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/\s+/g, "_")           // espacios → «_»
          .replace(/[^\w\-]/g, "")        // quita símbolos raros
          .toLowerCase();
}
