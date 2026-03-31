// js/Validador_Modelos/cargarDatosEnMapa.js
function cargarDatosEnMapa(xData, seccionFiltrada) {

  /* -- Asegurarnos de tener contenedor para la sección -- */
  if (!dataMapGlobal[seccionFiltrada]) dataMapGlobal[seccionFiltrada] = {};
  const dataMap = dataMapGlobal[seccionFiltrada];

  /* ───────────── Recorremos cada fila de la lista SP ───────────── */
  $(xData.responseXML).find("z\\:row, row").each(function () {

    /* ► Campos SharePoint */
    const seccion         = ($(this).attr("ows_seccion_validacion") || "").trim();
    const pesoSeccion     = parseInt($(this).attr("ows_peso_seccion") || "0", 10);

    /* Filtrado por sección solicitada */
    if (normalizar(seccion) !== normalizar(seccionFiltrada)) return;

    const transId         = parseInt($(this).attr("ows_trans_id") || "0", 10);
    const subId           = parseInt($(this).attr("ows_subseccion_id")    || "0", 10);
    const subNombre       = $(this).attr("ows_subseccion_validacion");
    const paramId         = parseInt($(this).attr("ows_parametro_id")     || "0", 10);
    const paramNombre     = $(this).attr("ows_parametro");
    const pregunta        = $(this).attr("ows_pregunta");
    const peso            = $(this).attr("ows_peso") || "0";
    const preguntaId      = parseInt($(this).attr("ows_pregunta_id")      || "0", 10);

    /* Campos mínimos requeridos */
    if (!subId || !subNombre || !paramId || !paramNombre || !pregunta || !preguntaId) {
      console.warn("Fila omitida por datos incompletos:", {subId, subNombre, paramId, paramNombre, pregunta, preguntaId});
      return;
    }

    /* ► Inicializar nivel 'sección' una sola vez */
    if (dataMap.peso_seccion === undefined) {
      dataMap.peso_seccion = pesoSeccion;
      dataMap.seccion_score = 0;
      dataMap.trans_id      = transId;
    }

    /* ► Sub-sección */
    if (!dataMap[subId]) {
      dataMap[subId] = {
        nombre          : subNombre,
        peso_subseccion : parseInt($(this).attr("ows_peso_subseccion") || "0", 10),
        subseccion_score: 0,
        subseccion_id   : subId,
        parametros      : {}
      };
    }

    /* ► Parámetro */
    if (!dataMap[subId].parametros[paramId]) {
      dataMap[subId].parametros[paramId] = {
        nombre        : paramNombre,
        parametros_id : paramId,
        preguntas     : []
      };
    }

    /* ► Pregunta */
    dataMap[subId].parametros[paramId].preguntas.push({
      id                  : preguntaId,
      texto               : pregunta,
      peso                : peso,
      porcentajeCompletado: 0,   // valor base (0%)
      aplica              : 1    // aplica = true por defecto
    });
  });

  /* ──────── Re-calcular scores para ESTA sección ──────── */
  Object.values(dataMap).forEach(entry => {
    if (entry && entry.parametros) {
      recalcularScoreSubseccion(entry);
    }
  });
  recalcularScoreSeccion(seccionFiltrada);

  /* ► Refrescar UI */
  actualizarScoreSeccionEnDOM(seccionFiltrada);
  actualizarScoreFinal();

  console.log("✅ Mapa procesado con pesos y scores:", dataMapGlobal);
}

/* Helper interno de normalización (sin tildes / espacios extra) */
function normalizar(txt) {
  return (txt || "").trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function bloquearSeccionesPrincipales() {
  $(".seccion-item").addClass("disabled").css({
    "pointer-events": "none",
    "opacity": "0.4"
  });
}

function desbloquearSecciones() {
  $(".seccion-item").removeClass("disabled").css({
    "pointer-events": "auto",
    "opacity": "1"
  });
}

  
/* js/Validador_Modelos/recalcular_scores/calcularScoreFinal.js
   ------------------------------------------------------------
   Devuelve el score final (número entre 0-100, **NO** string)  */
function calcularScoreFinal(){

  let num = 0, den = 0;

  Object.values(dataMapGlobal).forEach(sec => {
    if (!sec.__activa) return;                     // descarta secciones vacías
    const peso = +sec.peso_seccion || 0;
    num += peso * (+sec.seccion_score);
    den += peso;
  });

  return den ? +(num / den).toFixed(2) : 0;
}

