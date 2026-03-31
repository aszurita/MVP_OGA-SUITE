/* ---------------------------------------------------------
 *  Botón «Nueva validación»
 * ---------------------------------------------------------*/
$(document).ready(function (){

  $("#btnNuevaValidacion").on("click", function (){

    if ($(this).prop("disabled")) return;

    window.isNuevaValidacion = true;

    /* — reset memoria y etiquetas — */
    resetDataMapGlobal();        // tu helper existente → deja mini-switch ON
    actualizarScoreFinal();

    /* — reset controles — */
    $(".slider-porcentaje").val(0).trigger("input");
    $(".custom-switch-input").prop("checked", true).trigger("change");

    /* Alinear maestros después del reset */
    sincronizarSwitchesMaestros();

    /* — UX — */
    desbloquearSecciones();
    $(".seccion-item").removeClass("selected")
                      .first().trigger("click");

    // Resetear observaciones en memoria usando las plantillas por defecto
    window.cabeceraObservaciones = {
      observaciones: "",
      obs_seccion1: "",
      obs_seccion2: "",
      obs_seccion3: "",
      obs_seccion4: ""
    };
    window.draftObservaciones = { ...window.cabeceraObservaciones };

    const DEFAULT_GLOBALOBS_HTML =
  `<p><strong>OBSERVACIONES GENERALES</strong></p>
   <ul>
     <li>&nbsp;</li>
   </ul>
   <p><strong>RECOMENDACIONES PRIORITARIAS</strong></p>
   <figure class="table">
     <table>
       <thead>
         <tr>
           <th>Acción</th>
           <th>Impacto</th>
           <th>Plazo sugerido</th>
         </tr>
       </thead>
       <tbody>
         <tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
         <tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
         <tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
       </tbody>
     </table>
   </figure>
   <p><strong>PRÓXIMOS PASOS</strong></p>
   <ul>
     <li>&nbsp;</li>
   </ul>`;

    globalObsEditor.setData(DEFAULT_GLOBALOBS_HTML);

    // Forzar que la primera sección pinte nuevamente el template por defecto
    const primeraSeccion = $(".seccion-item").first().data("seccion") || window.seccionActual;
    if (primeraSeccion) {
      window.seccionActual = primeraSeccion;
      cargarSubseccionesYParametros(primeraSeccion);
    } else {
      $("#contenedor-observaciones").empty();
    }

    window.cabeceraObservaciones = {
      observaciones: "",
      obs_seccion1: "",
      obs_seccion2: "",
      obs_seccion3: "",
      obs_seccion4: "",
    };

const DEFAULT_SUBOBS_HTML =
  `<figure class="table">
     <table>
       <thead>
         <tr><th>Fortalezas</th></tr>
       </thead>
       <tbody>
         <tr><td>&nbsp;</td></tr>
         <tr><td>&nbsp;</td></tr>
         <tr><td>&nbsp;</td></tr>
       </tbody>
     </table>
   </figure>
   <figure class="table">
     <table>
       <thead>
         <tr><th>Oportunidades de mejora</th></tr>
       </thead>
       <tbody>
         <tr><td>&nbsp;</td></tr>
         <tr><td>&nbsp;</td></tr>
         <tr><td>&nbsp;</td></tr>
       </tbody>
     </table>
   </figure>`;

    
    

    const defaultSubObs = (typeof DEFAULT_SUBOBS_HTML === "string") ? DEFAULT_SUBOBS_HTML : "";
    if (SECTION_COLUMNS && typeof SECTION_COLUMNS === "object") {
      Object.values(SECTION_COLUMNS).forEach(col => {
        const idLimpio = (typeof sanitizeId === "function") ? sanitizeId(col) : col;
        const $txt = $(`#txtObsSec_${idLimpio}`);
        if (!$txt.length) return;
        const el = $txt[0];
        const editor = el._ckEditorInstance;
        if (editor && typeof editor.setData === "function") {
          editor.setData(defaultSubObs);
        } else {
          $txt.val(defaultSubObs);
        }
      });
    }

    // Limpiar la observación de la sección que se mostrará (la primera)
    // cargarSubseccionesYParametros se encargará de limpiar el CKEditor de la sección

    showNotification("top","center","info",
      "Ahora estás creando una NUEVA validación. Recuerda modificar al menos una pregunta antes de guardar.",
      3500);
  });
});


