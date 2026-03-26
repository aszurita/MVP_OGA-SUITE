/* js/Validador_Modelos/manejarGuardarValidacion.js */
/* -------------------------------------------------
 *  ▸ Guarda/actualiza la validación de un modelo:
 *      – Inserta cabecera + detalle la 1.ª vez
 *      – Sincroniza preguntas que cambiaron
 *      – Actualiza solo las observaciones de sección editadas
 *  ▸ Tras guardar hace snapshotOriginalState() para que
 *    «Descartar cambios» sepa volver al último estado persistido.
 * ------------------------------------------------- */

/* ===== Helpers saneo de HTML (sub-observaciones) ===== */
// Quita NBSP y etiquetas; deja solo texto plano
function _plainText(html = "") {
  return html
    .replace(/&nbsp;|\u00A0/gi, " ")
    .replace(/>\s+</g, "><")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ¿La sub-obs está vacía? (solo headers/espacios del template)
function esSubObsVacia(html) {
  if (!html) return true;
  const t = _plainText(html).toLowerCase()
    .replace(/\bfortalezas\b/gi, "")
    .replace(/\boportunidades de mejora\b/gi, "")
    .trim();
  return t.length === 0;
}

// Normaliza: si es “vacía”, devuelve ""; si no, la original recortada
function normalizarSubObs(html) {
  return esSubObsVacia(html) ? "" : (html || "").trim();
}


/* ===== Guardar validación ===== */
function manejarGuardarValidacion() {
  /* 0) Datos base */
  console.log("🔵 Iniciando guardar validación…");
  const codigoModelo = getModeloActual();
  const nombreModelo = getNombreModelo();
  const usuario = getEmployeeCodeByUser();
  const fecha = formatoFecha();                       // «dd-mm-yyyy»

  //pronto un get preguntas modificadas

  
  console.log("USUARIO:", usuario);

  if (!codigoModelo) {
    showNotification("top", "center", "danger", "Debes seleccionar un modelo para guardar.", 2000);
    return;
  }

  if (window.esValidacionBloqueada) {
    showNotification("top", "center", "warning", "Esta validación está cerrada. Crea una nueva para editar.", 3000);
    return;
  }

  /* 1) Observaciones (vuelca visibles → draft y normaliza) */
  saveVisibleObsToDraft();
  const obsGlobalTxt = getObservacionesGlobal();

  const obsSecciones = normalizarObs({
    ...cabeceraObservaciones,     // lo que existía
    ...draftObservaciones         // lo visible editado
  });

  // sanea sub-obs (si son solo plantilla → "")
  Object.values(SECTION_COLUMNS).forEach(col => {
    obsSecciones[col] = normalizarSubObs(obsSecciones[col]);
  });

  const obsTotales = { observaciones: obsGlobalTxt, ...obsSecciones };
  console.log("🟣 obsTotales hacia SP:", JSON.stringify(obsTotales, null, 2));

  /* 2) Score final en memoria */
  actualizarScoreFinal(false);
  const scoreFinal = window.ultimoScoreFinal;

  /* 3) Obtener última cabecera/detalle para decidir INSERT/UPDATE */
  buscarUltimaValidacion(codigoModelo, async (res) => {
    // 🔎 Debug de la respuesta cruda y sus llaves
    console.log("🔍 Respuesta buscarUltimaValidacion:", res);
    console.log("🧩 Claves en la respuesta:", res ? Object.keys(res) : "(sin datos)");





    // const insertar = !isNuevaValidacion || !res;
    const insertar = isNuevaValidacion || !res;
    console.log("🆕 Modo insertar:", insertar, isNuevaValidacion, res);
    const preguntasCamb = verificarCambiosEnPreguntas();

    // ID interno de la cabecera (Counter/PK de la tabla)
    const internalId = insertar ? null : res.id_validacion;

    // En algunos entornos 'usuario' puede no venir; hacemos fallback a MAYÚSCULAS
    const usuarioValue = res ? (res.usuario ?? res.USUARIO ?? "") : "";
    const usuarioYaSet = !!String(usuarioValue).trim();

    // Observaciones globales (fallback a MAYÚSCULAS)
    const obsGlobalActual = res ? (res.observaciones ?? res.OBSERVACIONES ?? "") : "";

    // Observaciones por sección: tomamos del objeto 'res' tolerando mayúsculas
    const obsSeccionesActuales = {};
    Object.values(SECTION_COLUMNS).forEach((col) => {
      // ej. "obs_seccion2" → busca res.obs_seccion2 o res.OBS_SECCION2
      obsSeccionesActuales[col] = res ? (res[col] ?? res[col.toUpperCase()] ?? "") : "";
    });

    // Detecta cambio en observaciones (solo en update)
    const obsCamb = !insertar && (
      (obsGlobalTxt !== obsGlobalActual) ||
      Object.values(SECTION_COLUMNS).some((col) => (obsSecciones[col] ?? "") !== (obsSeccionesActuales[col] ?? ""))
    );

    // Reglas: nueva ⇒ ≥1 pregunta; update ⇒ pregunta ó obs
    const cambiosOK = insertar ? preguntasCamb : (preguntasCamb || obsCamb);

    // Reglas: nueva ⇒ ≥1 pregunta; update ⇒ pregunta ó obs
    console.log("🧮 Decisiones:", {
      insertar,
      preguntasCamb,
      obsCamb,
      internalId,
      usuarioYaSet,
      obsGlobalActual,
      obsSeccionesActuales
    });
    if (!cambiosOK) {
      showNotification(
        "top", "center", "danger",
        insertar
          ? "Para guardar una nueva validación debes modificar al menos una pregunta."
          : "No se detectaron cambios para guardar.",
        2000
      );
      return;
    }

    /* 4) id_validacion a emplear */
    const id_validacion = insertar ? await obtenerIdValidacionMayor() : res.id_validacion;

    console.log("🆔 id_validacion a usar:", id_validacion);

    /* 5) CABECERA */
    if (insertar) {                                            /* NEW */
      const cab = generarCabeceraScore(id_validacion, codigoModelo, usuario, fecha, scoreFinal, obsTotales);
      console.log("cabecera: ", cab)
      const resIns = await insertarCabeceraScore(cab);
      if (!resIns.ok) {
        showNotification("top", "center", "danger", "No se pudo insertar la cabecera.", 2500);
        return;
      }

      await actualizarCodValidacion(codigoModelo, id_validacion); // opcional (ver función)
    } else {                                                  /* UPD */
      if (obsCamb) {
        console.log("entre en obsCamb", obsCamb);
        await updateObservacionesCabecera(id_validacion, obsTotales, fecha);
      }
      if (preguntasCamb) {
        console.log("entre en preguntasCamb", preguntasCamb)
        await updateScoreFinalCabecera(id_validacion, scoreFinal, fecha);
      }
    }

    /* 6) DETALLE */
    if (preguntasCamb) {
      const nuevoDet = generarDetalleScore(id_validacion, dataMapGlobal, usuario, fecha);

      if (insertar) {
        // --- NUEVO FLUJO DE INSERCIÓN ---
        // 1. Llama al SP para crear los registros base desde la plantilla.
        console.log("⚙️ Ejecutando SP de inserción base...");
        const resInsertPlantilla = await insertarDetalleDesdePlantilla(id_validacion, usuario);

        if (resInsertPlantilla.ok) {
          // 2. Si la inserción base fue exitosa, ahora actualiza con los valores reales del usuario.
          console.log("⚙️ Actualizando detalles con valores del usuario...");
          await updateDetalleScore(id_validacion, nuevoDet, usuario, fecha);
        } else {
          showNotification("top", "center", "danger", "No se pudo crear el detalle de la validación.", 2500);
          return; // Detener si el paso 1 falla
        }
      } else {
        // --- FLUJO DE ACTUALIZACIÓN (se mantiene igual) ---
        await sincronizarDetalleScore(id_validacion, res.detalles || [], nuevoDet, usuario, fecha);
      }
    }

    /* 7) Feedback + sincroniza memoria local + snapshot */
    showNotification("top", "center", "success", `Cambios de «${nombreModelo}» guardados correctamente.`, 2000);

    // Si es nueva validación, notifica inicio (correo al responsable; por ahora se envía a gortiz)
    if (insertar) {
      await enviarCorreoInicioValidacion(codigoModelo, nombreModelo, id_validacion);
    }

    // Mantén en memoria lo último para imprimir sin depender del backend
    window.cabeceraObservaciones = { observaciones: obsGlobalTxt, ...obsSecciones };
    window.draftObservaciones = { ...window.cabeceraObservaciones };

    isNuevaValidacion = false;
    snapshotOriginalState();
  });
}


/* ===== Observación General ===== */
function getObservacionesGlobal() {
  if (globalObsEditor) return globalObsEditor.getData().trim();
  const el = document.getElementById("txtObservaciones");
  return el ? (el.value || "").trim() : "";
}


/* ===== actualizarCodValidacion: fix log ===== */
function actualizarCodValidacion(codigo_final, id_validacion) {
  if (!codigo_final || !id_validacion) return;   // sanity-check

  const valuepairs = [
    ["cod_validacion", String(id_validacion)]
  ];
  console.log("⬆️  Payload hacia SharePoint:", valuepairs);

  $().SPServices.SPUpdateMultipleListItems({
    async: true,
    listName: "INV_MODEL_ART",
    batchCmd: "Update",
    CAMLQuery: `
      <Query>
        <Where>
          <Eq>
            <FieldRef Name='codigo_final' />
            <Value Type='Text'>${codigo_final}</Value>
          </Eq>
        </Where>
      </Query>`,
    valuepairs: valuepairs,
    completefunc: function (xhr, Status) {
      const exito = Status === "success"
        || (xhr && xhr.status === 200 && xhr.statusText === "OK");
      if (exito) {
        console.log(`✅ cod_validacion «${id_validacion}» actualizado en INV_MODEL_ART`);
      } else {
        console.error("❌ No se pudo actualizar cod_validacion",
          { Status, httpStatus: xhr?.status, xhr });
      }
    }
  });
}


/* ===== Link Canvas ===== */
function linkCanvas(cod_canva) {
  if (!cod_canva) return "#";                     // valor seguro
  return `${BASE_URL}]AnalyticsModelCanvas.aspx?amc=${encodeURIComponent(cod_canva)}`;
}


/* ===== Snapshot estado original ===== */
let originalDataMap = {};   // clon profundo del dataMap inicial
let originalObs = "";       // texto de observaciones original

function snapshotOriginalState() {
  originalDataMap = JSON.parse(JSON.stringify(dataMapGlobal)); // deep-clone
  originalObs = getObservacionesGlobal();
}


/* ===== Mapeo columnas por sección ===== */
const SECTION_COLUMNS = {
  "Revisión Documentación": "obs_seccion1",
  "Validación Teórica": "obs_seccion2",
  "Validación Técnica": "obs_seccion3",
  "Backtesting y Estabilidad": "obs_seccion4"
};


/* ===== Card de Observaciones por Sección ===== */
function renderObservacionesCard(seccion) {
  const col = SECTION_COLUMNS[seccion];
  if (!col) return "";
  const id = `txtObsSec_${sanitizeId(col)}`;
  const valor = (draftObservaciones[col] ?? cabeceraObservaciones[col] ?? "");

  return `
    <div class="card mb-3 obs-section-card" data-seccion="${seccion}">
      <div class="card-body">
        <label class="font-weight-bold">Observaciones – ${seccion}:</label>
        <textarea id="${id}" class="form-control" rows="4" placeholder="Escribe tus comentarios…">${valor}</textarea>
      </div>
    </div>`;
}


/* ===== Render secciones + Observaciones (prefill + CKEditor) ===== */
function cargarSubseccionesYParametros(seccionFiltrada, selector = "#subcards-container") {
  // guarda lo visible antes de cambiar
  try { saveVisibleObsToDraft(); } catch (e) { console.warn("saveVisibleObsToDraft()", e); }

  // 1) Verificación de datos
  const dataSecc = dataMapGlobal[seccionFiltrada];
  if (!dataSecc) {
    console.error("No existe la sección:", seccionFiltrada);
    console.warn("Secciones disponibles en dataMapGlobal:", Object.keys(dataMapGlobal || {}));
    return;
  }

  // 2) Render principal (cards de parámetros)
  renderizarContenido(selector, seccionFiltrada, window.esValidacionBloqueada);

  // 3) Observaciones (sub-sección)
  const $obsCont = $("#contenedor-observaciones");

  // Destruye CKEditor previo
  $obsCont.find("textarea").each((_i, txt) => {
    if (txt._ckEditorInstance) {
      try { txt._ckEditorInstance.destroy(); } catch { }
      txt._ckEditorInstance = null;
    }
  });

  // Limpia e inserta la card de observaciones
  $obsCont.empty();
  $obsCont.append(renderObservacionesCard(seccionFiltrada));

  // Prefill: draft > cabecera > default (solo UI)
  const col = SECTION_COLUMNS[seccionFiltrada];
  const base = ((draftObservaciones?.[col] ?? cabeceraObservaciones?.[col]) || "").trim();
  const valor = base || DEFAULT_SUBOBS_HTML;

  const textarea = $obsCont.find("textarea")[0];
  if (textarea) {
    textarea.value = valor;
    if (window.ClassicEditor && typeof ClassicEditor.create === "function") {
      ClassicEditor
        .create(textarea)
        .then(editor => {
          textarea._ckEditorInstance = editor;
          editor.setData(valor);
        })
        .catch(console.error);
    }
  }

  // 4) Sincronización de switches maestros
  sincronizarSwitchesMaestros($(selector));
}


/* ===== Observaciones de secciones (lee CKEditor si está) ===== */
function getObservacionesSecciones() {
  const res = { ...draftObservaciones };

  Object.entries(SECTION_COLUMNS).forEach(([_, col]) => {
    const $txt = $(`#txtObsSec_${sanitizeId(col)}`);
    if ($txt.length) {                          // visible
      const el = $txt[0];
      const editor = el._ckEditorInstance;
      const val = editor ? editor.getData() : ($txt.val() || "");
      res[col] = normalizarSubObs(val);        // 👈 sanea
    } else if (!(col in res)) {                // nunca visitada
      res[col] = normalizarSubObs(cabeceraObservaciones[col] || "");
    } else {
      res[col] = normalizarSubObs(res[col]);   // por si quedó sin saneo
    }
  });
  return res;          // {obs_seccion1:"", obs_seccion2:"", …}
}


/* ===== Draft de observaciones (desde visible) ===== */
let cabeceraObservaciones = {};   // lo que viene de SharePoint
let draftObservaciones = {};   // lo que el usuario va escribiendo
let seccionActual = "";   // sección principal visible

function saveVisibleObsToDraft() {
  Object.values(SECTION_COLUMNS).forEach(col => {
    const $txt = $(`#txtObsSec_${sanitizeId(col)}`);
    if ($txt.length) {
      const el = $txt[0];
      const editor = el._ckEditorInstance;
      const valor = editor ? editor.getData() : ($txt.val() || "");
      draftObservaciones[col] = normalizarSubObs(valor);   // 👈 saneado
    }
  });
}


/* ===== Normalizador “todas las columnas” ===== */
function normalizarObs(objParcial = {}) {
  const out = {};
  Object.values(SECTION_COLUMNS).forEach(col => {
    out[col] = (objParcial[col] ?? "").trim();
  });
  return out;  // {obs_seccion1:"", …}
}


/* ===== Fecha DD-MM-YYYY ===== */
function formatoFecha(dateObj = new Date()) {
  const d = dateObj.getDate().toString().padStart(2, "0");
  const m = (dateObj.getMonth() + 1).toString().padStart(2, "0");
  const y = dateObj.getFullYear();
  return `${d}-${m}-${y}`;
}
