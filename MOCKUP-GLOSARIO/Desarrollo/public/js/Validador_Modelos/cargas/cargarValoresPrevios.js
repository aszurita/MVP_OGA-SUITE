/* js/Validador_Modelos/cargarValoresPrevios.js
 * -------------------------------------------------
 *  • Trae cabecera + detalle de la última validación
 *  • Cachea las observaciones por sección   (cabeceraObservaciones)  ← SIN template
 *  • Carga la “Observación general”         (#txtObservaciones)      ← con template si vacío
 *  • Vuelca el detalle en dataMapGlobal     (preguntas / scores)
 *  • Deja listo el snapshotOriginalState()
 * ------------------------------------------------- */

function cargarValoresPrevios(codigoModelo, idValidacion, done) {
  // Limpieza UI global
  if (globalObsEditor) {
    globalObsEditor.setData("");
  } else {
    $("#txtObservaciones").val("");
  }

  $("#subcards-container").empty();
  $("#contenedor-observaciones").empty();

  Object.values(SECTION_COLUMNS).forEach(col => {
    $(`#txtObsSec_${sanitizeId(col)}`).val("");
  });

  seccionActual = "";
  draftObservaciones = {};

  buscarValidacionYDetallePorModelo(codigoModelo, idValidacion, res => {
    console.log("[cargarValoresPrevios] Resultado de buscarValidacionYDetallePorModelo:", res);

    // Limpieza visual previa
    Object.values(SECTION_COLUMNS).forEach(col => {
      $(`#txtObsSec_${sanitizeId(col)}`).val("");
    });
    $("#txtObservaciones").val("");

    const existe = !!res;
    actualizarTextoBotonGuardar(existe);

    /* ─── 1) NO existe validación previa ───────────────────── */
    if (!existe) {
      // En memoria: VACÍO   (no guardes templates)
      cabeceraObservaciones = {
        observaciones   : "",
        obs_seccion1    : "",
        obs_seccion2    : "",
        obs_seccion3    : "",
        obs_seccion4    : "",
        usuario         : "",
        fecha           : "",
        fecha_Finalizacion : ""
      };

      // Draft también vacío
      draftObservaciones = { ...cabeceraObservaciones };

      // UI: muestra template en la global
      if (globalObsEditor) {
        globalObsEditor.setData(DEFAULT_GLOBALOBS_HTML);
      } else {
        $("#txtObservaciones").val(DEFAULT_GLOBALOBS_HTML);
      }

      // recalcula, snapshot y termina
      try { recalcularTodo(); } catch {}
      snapshotOriginalState();
      return done?.();
    }

    /* ─── 2) EXISTE validación previa ──────────────────────── */
    // En memoria: valores reales NORMALIZADOS (sin templates)
    cabeceraObservaciones = {
      observaciones   : (res.observaciones || "").trim(),
      obs_seccion1    : normalizarSubObs(res.obs_seccion1 || ""),
      obs_seccion2    : normalizarSubObs(res.obs_seccion2 || ""),
      obs_seccion3    : normalizarSubObs(res.obs_seccion3 || ""),
      obs_seccion4    : normalizarSubObs(res.obs_seccion4 || ""),
      usuario         : res.usuario || "",
      fecha           : res.fecha || "",
      fecha_Finalizacion : res.fecha_Finalizacion || ""
    };

    // UI GLOBAL: si viene vacía → muestra template
    if (globalObsEditor) {
      globalObsEditor.setData(cabeceraObservaciones.observaciones || DEFAULT_GLOBALOBS_HTML);
    } else {
      $("#txtObservaciones").val(cabeceraObservaciones.observaciones || DEFAULT_GLOBALOBS_HTML);
    }

    // Si ya hay algún textarea de sección en DOM (raro en este punto),
    // precárgalo con real o template SOLO PARA UI:
    Object.entries(SECTION_COLUMNS).forEach(([_, col]) => {
      const $txt = $(`#txtObsSec_${sanitizeId(col)}`);
      if ($txt.length) {
        const base  = cabeceraObservaciones[col];
        const valor = base ? base : DEFAULT_SUBOBS_HTML;
        $txt.val(valor);
      }
    });

    // Detalle → dataMap
    actualizarDataMapDesdeDetalleScore(res.detalles);

    // Snapshot
    snapshotOriginalState();
    done?.();
  });
}

/* ===== Click en secciones (guardar draft + renderizar) ===== */
function sectionClickListener() {
  $(document).off("click", ".seccion-item").on("click", ".seccion-item", function () {
    if ($(this).hasClass("disabled")) return;

    const nuevaSeccion = $(this).data("seccion");

    // 1) Guarda la sección saliente en draft (normalizada)
    if (seccionActual) {
      const colOld = SECTION_COLUMNS[seccionActual];
      if (colOld) {
        const $old = $(`#txtObsSec_${sanitizeId(colOld)}`);
        if ($old.length) {
          const edOld    = $old[0]._ckEditorInstance;
          const valorOld = edOld ? edOld.getData() : ($old.val() || "");
          draftObservaciones[colOld] = normalizarSubObs(valorOld); // 👈 clave
        }
      }
    }

    // 2) Si es la misma, no hagas nada
    if (nuevaSeccion === seccionActual) return;

    // 3) Cambio visual
    $(".seccion-item").removeClass("selected");
    $(this).addClass("selected");

    // 4) Renderiza nueva sección (prefill + CKEditor se hace en cargarSubseccionesYParametros)
    seccionActual = nuevaSeccion;
    cargarSubseccionesYParametros(seccionActual);
  });
}

// Init una vez
sectionClickListener();


/* ===== Templates por defecto ===== */
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
