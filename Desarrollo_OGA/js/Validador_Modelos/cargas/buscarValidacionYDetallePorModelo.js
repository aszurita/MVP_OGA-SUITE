function buscarValidacionYDetallePorModelo(codigoModelo, idValidacion, callback) {
  if (typeof idValidacion === "function") {
    callback = idValidacion;
    idValidacion = null;
  }

  (async () => {
    try {
      // 1) CABECERA
      const cabResp = await fetch("http://gobinfoana01-2:8510/query", {
        method: "POST",
        headers: { accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          campos: "*",
          origen: "procesos_bi.dbo.T_Z_CABECERA_SCORE",
          condicion: idValidacion
            ? `codigo_modelo='${codigoModelo}' AND id_validacion='${idValidacion}'`
            : `codigo_modelo='${codigoModelo}'`
        })
      });

      const cabRaw = await cabResp.text();
      if (!cabResp.ok) throw new Error(`CABECERA HTTP ${cabResp.status}: ${cabRaw}`);

      let cabParsed = cabRaw ? JSON.parse(cabRaw) : [];
      const cabArr = Array.isArray(cabParsed) ? cabParsed : [cabParsed];

      if (!cabArr.length) {
        console.warn("📭 El modelo aún no tiene validaciones.");
        return callback(null);
      }

      // Normalización inline
      let cabRows = cabArr.map(r => ({
        id_validacion: r.id_validacion ?? r.ID_VALIDACION ?? r.Id_Validacion ?? r.id ?? r.ID,
        spIdCabecera: r.ID ?? r.id_sp ?? null,
        codigo_modelo: (r.codigo_modelo ?? r.CODIGO_MODELO ?? r.modelo ?? r.MODELO ?? "").toString(),
        observaciones: (r.observaciones ?? r.OBSERVACIONES ?? "")?.toString() || "",
        obs_seccion1:  (r.obs_seccion1  ?? r.OBS_SECCION1  ?? "")?.toString() || "",
        obs_seccion2:  (r.obs_seccion2  ?? r.OBS_SECCION2  ?? "")?.toString() || "",
        obs_seccion3:  (r.obs_seccion3  ?? r.OBS_SECCION3  ?? "")?.toString() || "",
        obs_seccion4:  (r.obs_seccion4  ?? r.OBS_SECCION4  ?? "")?.toString() || "",
        usuario: (r.usuario ?? r.USUARIO ?? r.codigo_usuario ?? r.CODIGO_USUARIO ?? "")?.toString().trim() || "",
        fecha:   (r.fecha   ?? r.FECHA   ?? r.fecha_ini     ?? r.FECHA_INI     ?? "")?.toString() || "",
        fecha_Finalizacion:
                 (r.fecha_Finalizacion ?? r.fecha_finalizacion ?? r.FECHA_FINALIZACION ?? r.FECHA_FIN ?? "")?.toString() || ""
      })).filter(x => x.id_validacion != null);

      if (!idValidacion) {
        cabRows.sort((a, b) => Number(b.id_validacion) - Number(a.id_validacion));
      }
      const cab = cabRows[0];

      const idVal = String(cab.id_validacion);
      window.idValidacionActual = idVal;
      window.spIdCabecera = cab.spIdCabecera ?? null;

      const fecha_Finalizacion = (typeof spDateToDMY === "function")
        ? spDateToDMY(cab.fecha_Finalizacion)
        : (cab.fecha_Finalizacion || "");
      window.fecha_Finalizacion = fecha_Finalizacion;

      // 2) DETALLES — SOLO procesos_bi.dbo.T_Z_DETALLES_SCORE
      const detResp = await fetch("http://gobinfoana01-2:8510/query", {
        method: "POST",
        headers: { accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          campos: "id_validacion, id_pregunta, valor, aplica",
          origen: "procesos_bi.dbo.T_Z_detalles_SCORE",
          condicion: `id_validacion='${idVal}'`
        })
      });
      const detRaw = await detResp.text();
      if (!detResp.ok) throw new Error(`DETALLES HTTP ${detResp.status}: ${detRaw}`);

      let detParsed = detRaw ? JSON.parse(detRaw) : [];
      const detArr = Array.isArray(detParsed) ? detParsed : [detParsed];

      let detalles = detArr.map(r => ({
        id_validacion: r.id_validacion ?? r.ID_VALIDACION ?? r.Id_Validacion ?? r.id ?? r.ID,
        id_pregunta: Number(r.id_pregunta ?? r.ID_PREGUNTA ?? r.pregunta_id ?? 0),
        valor:       Number(r.valor       ?? r.VALOR       ?? 0),
        aplica:      Number(r.aplica      ?? r.APLICA      ?? 0)
      })).filter(d => String(d.id_validacion) === idVal);

      // 3) Fallback TXT si está cerrada y no hay detalles
      if (!detalles.length && fecha_Finalizacion) {
        try {
          const ruta = "http://vamos.bancoguayaquil.com/sitios/informaciongerencial/OGA_Suite/Desarrollo/datasets-txt/Z_DETALLES_SCORE_CERRADOS.txt";
          const res = await fetch(ruta);
          if (!res.ok) throw new Error(`Archivo no encontrado → ${ruta}`);
          const txt = await res.text();
          const lineas = txt.trim().split("\n").slice(1);
          let coincidencias = 0;
          for (const line of lineas) {
            const cols = line.split("||");
            if (cols[1] === idVal) {
              coincidencias++;
              detalles.push({
                id_pregunta: +cols[2],
                valor: +cols[3],
                aplica: +cols[4]
              });
            }
          }
          console.log(`[buscarValidacion] preguntas recuperadas del TXT para id_validacion ${idVal}: ${coincidencias}`);
        } catch (err) {
          console.error("❌ No se pudo leer el detalle desde TXT:", err);
        }
      }

      // 4) Callback final
      callback({
        id_validacion: idVal,
        detalles,
        observaciones: cab.observaciones || "",
        obs_seccion1:  cab.obs_seccion1 || "",
        obs_seccion2:  cab.obs_seccion2 || "",
        obs_seccion3:  cab.obs_seccion3 || "",
        obs_seccion4:  cab.obs_seccion4 || "",
        spIdCabecera:  cab.spIdCabecera ?? null,
        usuario:       cab.usuario || "",
        fecha:         cab.fecha || "",
        fecha_Finalizacion
      });

    } catch (e) {
      console.error("❌ Error en buscarValidacionYDetallePorModelo:", e);
      callback(null);
    }
  })();
}
