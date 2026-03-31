/**
 * @file Módulo para centralizar las llamadas a la API del Validador de Modelos.
 * @author Giancarlo Ortiz */

/**
 * Obtiene la lista de modelos analíticos desde la API.
 * @returns {Promise<Array<Object>>} Una promesa que resuelve a un array de modelos.
 */
async function fetchModelosFromAPI() {
  const API_URL = 'http://gobinfoana01-2:8510/query';
  const payload = {
    campos: "id, codigo, modelo_analitica",
    origen: "procesos_bi.dbo.T_DOMINIO_ART_MODELOS",
    condicion: "tipo_artefacto='4'" // Posiblemente necesite comillas si es un campo de texto
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error(`Error en la API: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("❌ Error al obtener modelos desde la API:", error);
    return []; // Devuelve un array vacío en caso de error para no romper el flujo.
  }
}

/**
 * Obtiene la plantilla completa de validación desde la API.
 * @returns {Promise<Array<Object>>} Una promesa que resuelve a un array con las filas de la plantilla.
 */
async function fetchPlantillaFromAPI() {
  const API_URL = 'http://gobinfoana01-2:8510/query';
  const payload = {
    campos: "*",
    origen: "procesos_bi.dbo.T_Z_plantilla_validacion",
    condicion: "1=1"
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error(`Error en la API al cargar la plantilla: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("❌ Error al obtener la plantilla desde la API:", error);
    throw error; // Lanzamos el error para que la función que llama lo maneje.
  }
}