/* js/Validador_Modelos/updateDetalleScore.js
   ------------------------------------------------------------------
   Actualiza los registros indicados en «registros».
   Cada objeto DEBE traer:
       { _internalId , valor , aplica }
--------------------------------------------------------------------*/
async function updateDetalleScore(registros = [], usuario, fecha) {
  if (!registros.length) return;

  // Validación rápida de entradas
  const faltanId = registros.filter(r => !r || r._internalId == null);
  if (faltanId.length) {
    console.warn("⚠️ Hay registros sin _internalId, se omitirán:", faltanId);
  }

  const tasks = registros.map(async (r) => {
    if (r == null || r._internalId == null) return { ok: false, skipped: true };

    // Payload para el API (usa MAYÚSCULAS en nombres de columnas)
    const payload = {
      tabla: "procesos_bi.dbo.T_Z_detalles_SCORE",
      datos: {
        VALOR: Number.isFinite(+r.valor) ? +r.valor : 0,
        APLICA: Number.isFinite(+r.aplica) ? +r.aplica : 0,
        FECHA: fecha,                 // "YYYY-MM-DD"
        USUARIO: String(usuario ?? "")
      },
      condicion: `ID = ${r._internalId}` // usamos el ID interno como clave
    };

    // Log demostrando el uso del endpoint y lo que se envía
    console.log("🔵 PUT http://gobinfoana01-2:8510/update", payload);

    try {
      const resp = await fetch("http://gobinfoana01-2:8510/update", {
        method: "PUT",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      // Intenta leer JSON (algunos back pueden retornar 200 con 'detail' de error)
      let body = null;
      try { body = await resp.json(); } catch (_) {}

      if (!resp.ok) {
        console.error(`❌ Update ID=${r._internalId} HTTP ${resp.status}`, body);
        return { ok: false, status: resp.status, body };
      }

      // Si el body trae 'detail' de error aunque sea 200, también lo reportamos
      if (body && body.detail) {
        console.error(`❌ Update ID=${r._internalId} detail:`, body.detail);
        return { ok: false, status: 200, body };
      }

      console.log(`✅ Update OK ID=${r._internalId}`, body);
      return { ok: true, body };
    } catch (e) {
      console.error(`❌ Error de red/JS en update ID=${r._internalId}:`, e);
      return { ok: false, error: e };
    }
  });

  const results = await Promise.all(tasks);
  const okCount = results.filter(x => x && x.ok).length;
  const total = registros.filter(r => r && r._internalId != null).length;
  console.log(`📊 Resumen: ${okCount}/${total} registros actualizados exitosamente`);
}
