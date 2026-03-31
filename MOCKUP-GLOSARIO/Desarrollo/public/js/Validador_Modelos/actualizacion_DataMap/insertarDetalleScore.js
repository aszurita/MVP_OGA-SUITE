// insertarDetalleScore.js

function toYMD(dateLike) {
  if (!dateLike) return null;
  const s = String(dateLike).trim();

  // "DD-MM-YYYY" o "DD/MM/YYYY"
  const m = s.match(/^(\d{2})[-/](\d{2})[-/](\d{4})$/);
  if (m) {
    const [_, dd, mm, yyyy] = m;
    return `${yyyy}-${mm}-${dd}`;
  }

  // ISO/Date
  const d = new Date(s);
  if (!isNaN(d)) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }
  return null; // si no es parseable, mejor null
}

const numOrNull = v => (Number.isFinite(Number(v)) ? Number(v) : null);

async function insertarDetalleScore(detalleScoreList) {
  if (!Array.isArray(detalleScoreList) || !detalleScoreList.length) {
    console.error("No hay datos para insertar en Z_DETALLES_SCORE.");
    return;
  }

  for (const d of detalleScoreList) {
    const FECHA_NORM = toYMD(d.fecha ?? d.FECHA); // 👈 normalizamos aquí

    const basePayload = {
      tabla: "procesos_bi.dbo.T_Z_detalles_SCORE", // usa MAYÚSCULAS consistente
      datos: {
        ID_VALIDACION: numOrNull(d.id_validacion ?? d.ID_VALIDACION),
        ID_PREGUNTA:   numOrNull(d.id_pregunta   ?? d.ID_PREGUNTA),
        VALOR:         numOrNull(d.valor         ?? d.VALOR),
        APLICA:        numOrNull(d.aplica        ?? d.APLICA),
        USUARIO:       (d.usuario ?? d.USUARIO ?? "") || null,
        FECHA:         FECHA_NORM // 👈 YYYY-MM-DD o null
      }
    };

    // Si la fecha no es válida, mejor no enviarla (deja que DB maneje NULL/DEFAULT)
    if (!basePayload.datos.FECHA) delete basePayload.datos.FECHA;

    // Log para verificar lo que enviamos
    console.log("🔵 POST http://gobinfoana01-2:8510/insert (Detalle)", basePayload);

    try {
      let resp = await fetch("http://gobinfoana01-2:8510/insert", {
        method: "POST",
        headers: { accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(basePayload)
      });

      // fallback a /insertar si /insert no existe
      if (resp.status === 404) {
        console.warn("⚠️ /insert 404. Reintentando en /insertar");
        resp = await fetch("http://gobinfoana01-2:8510/insertar", {
          method: "POST",
          headers: { accept: "application/json", "Content-Type": "application/json" },
          body: JSON.stringify(basePayload)
        });
      }

      const raw = await resp.text();
      if (resp.ok) {
        console.log("✅ Detalle guardado correctamente.", raw || "(sin cuerpo)");
        continue;
      }

      // Si falla por conversión de fecha, reintenta sin FECHA (NULL) o con hoy
      const isDateConvError = /Conversion failed when converting date/i.test(raw);
      if (isDateConvError) {
        console.warn("⚠️ Error de conversión de fecha. Reintentando SIN FECHA…", raw);

        const payloadSinFecha = JSON.parse(JSON.stringify(basePayload));
        delete payloadSinFecha.datos.FECHA;

        let resp2 = await fetch("http://gobinfoana01-2:8510/insert", {
          method: "POST",
          headers: { accept: "application/json", "Content-Type": "application/json" },
          body: JSON.stringify(payloadSinFecha)
        });
        if (resp2.status === 404) {
          resp2 = await fetch("http://gobinfoana01-2:8510/insertar", {
            method: "POST",
            headers: { accept: "application/json", "Content-Type": "application/json" },
            body: JSON.stringify(payloadSinFecha)
          });
        }

        const raw2 = await resp2.text();
        if (resp2.ok) {
          console.log("✅ Detalle guardado (sin FECHA).", raw2 || "(sin cuerpo)");
          continue;
        }

        console.warn("⚠️ Reintento sin FECHA también falló. Probando con HOY…", raw2);
        const hoy = toYMD(new Date());
        const payloadConHoy = JSON.parse(JSON.stringify(basePayload));
        payloadConHoy.datos.FECHA = hoy;

        let resp3 = await fetch("http://gobinfoana01-2:8510/insert", {
          method: "POST",
          headers: { accept: "application/json", "Content-Type": "application/json" },
          body: JSON.stringify(payloadConHoy)
        });
        if (resp3.status === 404) {
          resp3 = await fetch("http://gobinfoana01-2:8510/insertar", {
            method: "POST",
            headers: { accept: "application/json", "Content-Type": "application/json" },
            body: JSON.stringify(payloadConHoy)
          });
        }
        const raw3 = await resp3.text();
        if (resp3.ok) {
          console.log("✅ Detalle guardado (FECHA=hoy).", raw3 || "(sin cuerpo)");
          continue;
        }

        throw new Error(`HTTP ${resp3.status}: ${raw3}`);
      }

      throw new Error(`HTTP ${resp.status}: ${raw}`);
    } catch (e) {
      console.error("❌ Error guardando detalle:", e, basePayload);
      // si quieres parar el flujo ante el primer error, haz: throw e;
    }
  }
}
