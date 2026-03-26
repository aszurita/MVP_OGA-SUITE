/* js/Validador_Modelos/descartarCambiosListener.js
 * ------------------------------------------------ */
function descartarCambiosListener() {

    /* Escucha el clic aunque el botón se genere dinámicamente */
    $(document).on("click", "#btnDescartarCambios", () => {
  
      if ($.isEmptyObject(originalDataMap)) {
        showNotification("top", "center", "warning",
          "No hay cambios que descartar.", 2000);
        return;
      }
  
      /* ─── 1.  Restaurar snapshot de preguntas ─────────────── */
      dataMapGlobal = JSON.parse(JSON.stringify(originalDataMap));
  
      /* ─── 2.  Restaurar observaciones (global + subsecciones) */
      draftObservaciones = JSON.parse(JSON.stringify(cabeceraObservaciones));

  
      // 2a. Campo global (#txtObservaciones) — CKEditor 5 o textarea
      if (globalObsEditor) {
        globalObsEditor.setData(originalObs);
      } else {
        $("#txtObservaciones").val(originalObs);
      }

      if (seccionActual) {
        const col = SECTION_COLUMNS[seccionActual];
        const $txt = $(`#txtObsSec_${sanitizeId(col)}`);
        if ($txt.length) {
          const ed = $txt[0]._ckEditorInstance;
          const valor = draftObservaciones[col] || "";
          ed ? ed.setData(valor) : $txt.val(valor);
        }
      }
  
      /* ─── 3.  Recalcular scores ───────────────────────────── */
      recalcularTodo();
  
      /* ─── 4.  Volver a dibujar la subsección abierta ──────── */
      const abierta = obtenerSeccionActual();
      if (abierta) {
        cargarSubseccionesYParametros(abierta);      // ya limpia y re-renderiza
      } else {
        $("#subcards-container").empty();
      }
  
      /* ─── 5.  Feedback ───────────────────────────────────── */
      showNotification("top", "center", "info",
        "Cambios descartados.", 2000);
    });
  }
  