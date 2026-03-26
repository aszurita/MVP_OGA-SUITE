/* js/Validador_Modelos/obtenerIdValidacionMayor.js
 * ------------------------------------------------
 *  Devuelve el siguiente id_validacion disponible:
 *    – lista vacía        → 1
 *    – lista con filas    → (máximo id_validacion) + 1
 *  Usa endpoint /query en lugar de SPServices
 * ------------------------------------------------ */
async function obtenerIdValidacionMayor() {
  let maxId = 0;

  const payload = {
    campos: "MAX(ID_VALIDACION) as MAX_ID",
    origen: "procesos_bi.dbo.T_Z_CABECERA_SCORE",
    condicion: "1=1"
  };

  console.log("🔵 POST http://gobinfoana01-2:8510/query (obtenerIdValidacionMayor)", payload);

  try {
    const resp = await fetch("http://gobinfoana01-2:8510/query", {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!resp.ok) {
      console.error(`❌ Error consultando Z_CABECERA_SCORE (HTTP ${resp.status})`);
      return 1;
    }

    const data = await resp.json().catch(() => []);
    const arr = Array.isArray(data) ? data : [data];

    if (arr.length && arr[0].MAX_ID != null) {
      maxId = parseInt(arr[0].MAX_ID, 10) || 0;
    }

    const nuevoId = maxId + 1;
    console.log("🔢 Nuevo id_validacion generado:", nuevoId);
    return nuevoId;
  } catch (e) {
    console.error("❌ Error de red/JS en obtenerIdValidacionMayor:", e);
    return 1;
  }
}
