/* js/Validador_Modelos/panel_validacion/obtenerDatosValidaciones.js
   -----------------------------------------------------------------*/
async function obtenerTodasLasCabeceras() {
  try {
    const resp = await fetch("http://gobinfoana01-2:8510/query", {
      method: "POST",
      headers: { accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        campos: "id_validacion, codigo_modelo, usuario, fecha, fecha_Finalizacion, score_final",
        origen: "procesos_bi.dbo.T_Z_CABECERA_SCORE",
        condicion: "1=1"
      })
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    let data = await resp.json();
    if (!Array.isArray(data)) data = data ? [data] : [];

    // Orden equivalente al CAML (id_validacion DESC)
    data.sort((a, b) => Number(b.id_validacion) - Number(a.id_validacion));

    return data.map(r => ({
      id_validacion: r.id_validacion,
      codigo_modelo: r.codigo_modelo,
      usuario: r.usuario ?? "",
      fecha: r.fecha ?? "",
      fecha_Finalizacion: r.fecha_Finalizacion ?? "",
      score: (isNaN(parseFloat(r.score_final)) ? 0 : parseFloat(r.score_final)).toFixed(2)
    }));
  } catch (e) {
    console.error("Error en obtenerTodasLasCabeceras:", e);
    return [];
  }
}


/*  Devuelve un mapa { id_validacion ➜ { usuario, fecha } }
    con el último registro encontrado en T_Z_DETALLES_SCORE para cada id_validacion
   ---------------------------------------------------------------- */
async function obtenerUltimosDetalles(cabs) {
  if (!cabs || !cabs.length) return {};

  // IDs únicos
  const ids = Array.from(new Set(cabs.map(c => String(c.id_validacion)).filter(Boolean)));
  if (!ids.length) return {};

  try {
    const resp = await fetch("http://gobinfoana01-2:8510/query", {
      method: "POST",
      headers: { accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        campos: "id_validacion, usuario, fecha",
        origen: "procesos_bi.dbo.T_Z_detalles_SCORE",
        condicion: `id_validacion IN (${ids.map(id => `'${id}'`).join(",")})`
      })
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    let data = await resp.json();
    if (!Array.isArray(data)) data = data ? [data] : [];

    // Tomamos el "último" por id_validacion. Si 'fecha' viene como YYYY-MM-DD, ordenamos por fecha desc.
    // Si no hay fecha confiable, al menos respetamos el último por orden de llegada.
    data.sort((a, b) => {
      const fa = (a.fecha || "").toString();
      const fb = (b.fecha || "").toString();
      return fb.localeCompare(fa) || String(b.id_validacion).localeCompare(String(a.id_validacion));
    });

    const map = {};
    for (const r of data) {
      const id = String(r.id_validacion);
      if (!map[id]) {
        map[id] = {
          usuario: r.usuario ?? "",
          fecha: r.fecha ?? ""
        };
      }
    }
    return map;
  } catch (e) {
    console.error("Error en obtenerUltimosDetalles:", e);
    return {};
  }
}
