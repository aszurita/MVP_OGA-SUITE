/* js/Validador_Modelos/recalcularTodo.js
   ---------------------------------------------------------------
   Recorre TODO el dataMapGlobal y actualiza los scores de todos
   los niveles, refrescando las etiquetas en el DOM.              */

function recalcularTodo () {
  Object.entries(dataMapGlobal).forEach(([seccionNombre, seccionData]) => {

    /* ▸ Re-calcular cada SUB-sección */
    Object.values(seccionData).forEach(entry => {
      if (entry && entry.parametros) {
        recalcularScoreSubseccion(entry);
      }
    });

    /* ▸ Re-calcular la SECCIÓN completa */
    recalcularScoreSeccion(seccionNombre);
    actualizarScoreSeccionEnDOM(seccionNombre);
  });

  /* ▸ Finalmente el Score FINAL global */
  actualizarScoreFinal();
}
