/**
 * Carga la plantilla de validación desde la API, usando caché para mejorar el rendimiento.
 * La primera vez consulta la API; las siguientes usa la copia en memoria.
 * @returns {Promise<Object>} Una promesa que resuelve con la plantilla completa.
 */

// Variable para almacenar la plantilla en caché
window._plantillaCache = null;

async function fetchAndProcessPlantilla() {
  const data = await fetchPlantillaFromAPI();
  const listaPlantilla = Array.isArray(data) ? data : [data].filter(Boolean);

  const plantilla = {};
  listaPlantilla.forEach(item => {
    const seccion = (item.seccion_validacion || "").trim();
    if (!seccion) return;

    const sec = plantilla[seccion] ??= {
      peso_seccion: parseInt(item.peso_seccion || "0", 10),
      seccion_score: 0,
      trans_id: parseInt(item.trans_id || "0", 10)
    };

    const subId = String(parseInt(item.subseccion_id, 10));
    const sub = sec[subId] ??= {
      nombre: item.subseccion_validacion,
      peso_subseccion: parseInt(item.peso_subseccion || "0", 10),
      subseccion_score: 0,
      subseccion_id: parseInt(subId, 10),
      parametros: {}
    };

    const paramId = String(parseInt(item.parametro_id, 10));
    const param = sub.parametros[paramId] ??= {
      nombre: item.parametro,
      parametros_id: parseInt(paramId, 10),
      preguntas: []
    };

    param.preguntas.push({
      id: parseInt(item.pregunta_id, 10),
      texto: item.pregunta,
      peso: item.peso || "0",
      porcentajeCompletado: 0,
      aplica: 1
    });
  });
  return plantilla;
}

async function cargarPlantillaCompleta(callback) {
  if (window._plantillaCache) {
    console.log("📋 Plantilla base cargada desde caché.");
    dataMapGlobal = JSON.parse(JSON.stringify(window._plantillaCache));
    callback?.();
    return;
  }

  try {
    const plantilla = await fetchAndProcessPlantilla();
    window._plantillaCache = plantilla; // Guardar en caché
    dataMapGlobal = JSON.parse(JSON.stringify(plantilla)); // Usar una copia
    console.log("📋 Plantilla base cargada desde API y cacheada.");
    recalcularTodo();
    callback?.();
  } catch (error) {
    console.error("❌ Error en cargarPlantillaCompleta:", error);
    showNotification("top", "center", "danger", "No se pudo cargar la plantilla de validación.", 3000);
  }
}
