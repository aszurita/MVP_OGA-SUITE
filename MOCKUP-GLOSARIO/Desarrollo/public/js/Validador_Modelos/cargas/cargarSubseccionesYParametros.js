/* -----------------------------------------------------------
 *  Renderiza la sección y alinea los switches maestros
 * -----------------------------------------------------------*/
function cargarSubseccionesYParametros(seccionFiltrada, selector = "#subcards-container") {
  // 0) Guarda lo que esté visible antes de cambiar
  try { saveVisibleObsToDraft(); } catch(e){ console.warn("saveVisibleObsToDraft()", e); }

  // 1) Verificar existencia de datos de la sección
  const dataSecc = dataMapGlobal[seccionFiltrada];
  if (!dataSecc) {
    console.error("No existe la sección:", seccionFiltrada);
    console.warn("Secciones disponibles en dataMapGlobal:", Object.keys(dataMapGlobal || {}));
    return;
  }

  // 2) Render principal (cards de parámetros)
  renderizarContenido(selector, seccionFiltrada, window.esValidacionBloqueada);

  // 3) Observaciones (sub-sección)
  const $cont = $(selector);

  // Destruye cualquier CKEditor previo que aún viva dentro del contenedor
  $cont.find("textarea").each((_i, txt) => {
    if (txt._ckEditorInstance) {
      try { txt._ckEditorInstance.destroy(); } catch {}
      txt._ckEditorInstance = null;
    }
  });

  // Limpia y vuelve a insertar la tarjeta de observaciones para esta sección
  $cont.find(".obs-section-card").remove();
  const obsCardHTML = renderObservacionesCard(seccionFiltrada);
  $cont.append(obsCardHTML);

  // 3.a) Prefill: draft > cabecera > default (tablas Fortalezas / Oportunidades)
  const col   = SECTION_COLUMNS[seccionFiltrada];
  const base  = ((draftObservaciones?.[col] ?? cabeceraObservaciones?.[col]) || "").trim();
  const valor = base || DEFAULT_SUBOBS_HTML;

  // Identifica el textarea recién insertado y carga el contenido antes del CKEditor
  const txtId = `#txtObsSec_${sanitizeId(col)}`;
  const $txt  = $cont.find(txtId);

  if ($txt.length) {
    // Carga el HTML por defecto/guardado en el <textarea>
    $txt.val(valor);

    // Inicializa CKEditor (si está disponible) con ese contenido
    if (window.ClassicEditor && typeof ClassicEditor.create === "function") {
      ClassicEditor
        .create($txt[0])
        .then(editor => {
          $txt[0]._ckEditorInstance = editor;
          // Si es una nueva validación, el valor debe estar vacío.
          // Si no, usamos el valor precargado.
          if (window.isNuevaValidacion) {
            editor.setData(DEFAULT_SUBOBS_HTML);
          } else {
            editor.setData(valor);
          }
        })
        .catch(console.error);
    }
  }

  // 4) Sincronización de switches maestros (según preguntas “aplican”)
  sincronizarSwitchesMaestros($cont);
}



/**
 * Reevalúa y ajusta TODOS los switches maestros (.sw-aplica-sub)
 *  ▸  OFF  ⇢  todas las preguntas: aplica = 0  y  porcentaje = 0
 *  ▸  ON   ⇢  cualquier otra combinación
 *  Se encarga de:
 *    – marcar / desmarcar el <input>
 *    – colorear el label
 *    – disparar "change" SOLO si cambia el estado
 */
function sincronizarSwitchesMaestros (scope = $(document)) {

  scope.find(".sw-aplica-sub").each(function () {

    const $master = $(this);
    const subId   = String($master.data("subid"));
    const seccion = $master.data("seccion") || window.seccionActual;

    const sub = dataMapGlobal?.[seccion]?.[subId];
    if (!sub || !sub.parametros) return;   // seguridad

    /* ¿Al menos una pregunta activa? (== - evita problema "1"/1) */
    const algunaActiva = Object.values(sub.parametros)
      .some(param => param.preguntas.some(p => p.aplica == 1));

    if ($master.prop("checked") !== algunaActiva){
      $master.prop("checked", algunaActiva).trigger("change");
    }
    const label = $(`label[for="${$master.attr("id")}"]`);
    if (algunaActiva) {
      label.css({ backgroundColor: '#D2006E', borderColor: '#D2006E' });
    } else {
      label.css({ backgroundColor: '#ccc', borderColor: '#ccc' });
    }
  });
}
