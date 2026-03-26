// insertarCabeceraScore.js

function toYMD(dateLike) {
  if (!dateLike) return "";
  // Acepta "DD-MM-YYYY" o "DD/MM/YYYY"
  const m = String(dateLike).match(/^(\d{2})[-/](\d{2})[-/](\d{4})$/);
  if (m) {
    const [_, dd, mm, yyyy] = m;
    return `${yyyy}-${mm}-${dd}`;
  }
  // Intenta parsear nativo/ISO
  const d = new Date(dateLike);
  if (!isNaN(d)) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }
  // Último recurso: devuélvelo tal cual
  return String(dateLike);
}

function normalizeCabInput(cab) {
  if (Array.isArray(cab)) {
    console.warn("⚠️ insertarCabeceraScore: recibí un ARRAY, tomaré el primer elemento.", cab[0]);
    return cab[0] || {};
  }
  return cab || {};
}

function buildCabeceraPayload(cabRaw) {
  const cab = normalizeCabInput(cabRaw);
  return {
    tabla: "procesos_bi.dbo.T_Z_cabecera_SCORE",
    datos: {
      ID_VALIDACION: Number(cab.id_validacion ?? cab.ID_VALIDACION),
      CODIGO_MODELO: String(cab.codigo_modelo ?? cab.codigoModelo ?? cab.CODIGO_MODELO ?? ""),
      OBSERVACIONES: String(cab.observaciones ?? cab.OBSERVACIONES ?? ""),
      OBS_SECCION1 : String(cab.obs_seccion1 ?? cab.OBS_SECCION1 ?? ""),
      OBS_SECCION2 : String(cab.obs_seccion2 ?? cab.OBS_SECCION2 ?? ""),
      OBS_SECCION3 : String(cab.obs_seccion3 ?? cab.OBS_SECCION3 ?? ""),
      OBS_SECCION4 : String(cab.obs_seccion4 ?? cab.OBS_SECCION4 ?? ""),
      SCORE_FINAL  : Number(cab.score_final ?? cab.scoreFinal ?? cab.SCORE_FINAL ?? 0),
      FECHA        : toYMD(cab.fecha ?? cab.FECHA),
      USUARIO      : String(cab.usuario ?? cab.USUARIO ?? "")
    }
  };
}

/**
 * Inserta la cabecera y retorna { ok, url, status, body, payload }.
 * Soporta:
 *  - objeto o array como input
 *  - /insert (primero) y si 404 → /insertar
 *  - reintento con datos como array si el backend lo exige
 */
async function insertarCabeceraScore(cab) {
  const payload = buildCabeceraPayload(cab);

  // Validación clara antes de enviar
  const idOk = Number.isFinite(payload.datos.ID_VALIDACION) && payload.datos.ID_VALIDACION > 0;
  const cmOk = !!String(payload.datos.CODIGO_MODELO || "").trim();

  if (!idOk || !cmOk) {
    console.error("❌ Falta ID_VALIDACION (>0) o CODIGO_MODELO en cab:", cab, payload);
    return { ok: false, url: null, status: 0, body: { detail: "Payload inválido" }, payload };
  }

  const doPost = async (url, bodyObj) => {
    console.log("🔵 POST", url, "(Cabecera)", bodyObj);
    const resp = await fetch(url, {
      method: "POST",
      headers: { accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(bodyObj)
    });
    const body = await resp.json().catch(() => null);
    return { resp, body, url };
  };

  // 1) Intento: /insert (más probable)
  let { resp, body, url } = await doPost("http://gobinfoana01-2:8510/insert", payload);

  // 2) Si 404, prueba /insertar
  if (resp.status === 404) {
    console.warn("⚠️ /insert devolvió 404. Reintentando con /insertar");
    ({ resp, body, url } = await doPost("http://gobinfoana01-2:8510/insertar", payload));
  }

  // 3) Si 400/422 y parece que quiere array, reintenta con datos como array
  if (!resp.ok && (resp.status === 400 || resp.status === 422)) {
    const hintArray = body && typeof body.detail === "string" && body.detail.toLowerCase().includes("array");
    if (hintArray || !Array.isArray(payload.datos)) {
      const payloadArr = { ...payload, datos: [payload.datos] };
      console.warn("⚠️ Reintentando con datos como arreglo:", payloadArr);
      ({ resp, body, url } = await doPost(url, payloadArr));
    }
  }

  if (!resp.ok || (body && body.detail)) {
    console.error("❌ Error al insertar cabecera:", { status: resp.status, url, body, payload });
    return { ok: false, url, status: resp.status, body, payload };
  }

  console.log("✅ Cabecera insertada vía", url, body);
  return { ok: true, url, status: resp.status, body, payload };
}
