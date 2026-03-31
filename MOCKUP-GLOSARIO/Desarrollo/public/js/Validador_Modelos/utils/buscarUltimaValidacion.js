function getVal(row, key) {
  if (!row || !key) return undefined;
  const lk = key.toLowerCase();
  for (const k in row) {
    if (Object.prototype.hasOwnProperty.call(row, k) && k.toLowerCase() === lk) {
      return row[k];
    }
  }
  return undefined;
}

function sqlEscapeLiteral(s = "") {
  return String(s).replace(/'/g, "''");
}

function cleanLookupId(val = "") {
  return val.toString().split(";#")[0] || "";
}

function buscarUltimaValidacion(codigoModelo, cb) {
  (async () => {
    try {
      // 🔵 1) CABECERA más reciente
      const condicionCab =
        `codigo_modelo='${sqlEscapeLiteral(codigoModelo)}' ORDER BY id_validacion DESC`;

      console.log("🔵 Ejecutando CABECERA en endpoint http://gobinfoana01-2:8510/query", {
        campos: "TOP 1 *",
        origen: "PROCESOS_BI.dbo.t_z_cabecera_score",
        condicion: condicionCab
      });

      const respCab = await fetch("http://gobinfoana01-2:8510/query", {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          campos: "TOP 1 *",
          origen: "PROCESOS_BI.dbo.t_z_cabecera_score",
          condicion: condicionCab
        })
      });

      if (!respCab.ok) throw new Error(`HTTP ${respCab.status}`);
      const cabRes = await respCab.json();
      const cabArr = Array.isArray(cabRes) ? cabRes : [cabRes];
      console.log("Respuesat de Array ", cabArr)
      if (!cabArr.length) {
        cb(null);
        return;
      }

      const r = cabArr[0];
      const cab = {
        _internalId  : getVal(r, "ID") ?? getVal(r, "id"),
        id_validacion: String(getVal(r, "id_validacion") ?? ""),
        observaciones: getVal(r, "observaciones") || "",
        obs_seccion1 : getVal(r, "obs_seccion1")  || "",
        obs_seccion2 : getVal(r, "obs_seccion2")  || "",
        obs_seccion3 : getVal(r, "obs_seccion3")  || "",
        obs_seccion4 : getVal(r, "obs_seccion4")  || "",
        score_final  : parseFloat(getVal(r, "score_final") ?? "0")
      };

      if (!cab.id_validacion) {
        cb(cab);
        return;
      }

      // 🔵 2) DETALLES de esa cabecera
      const condicionDet = `id_validacion='${sqlEscapeLiteral(cab.id_validacion)}'`;

      console.log("🔵 Ejecutando DETALLE en endpoint http://gobinfoana01-2:8510/query", {
        campos: "TOP 200 *",
        origen: "PROCESOS_BI.dbo.t_z_detalles_score",
        condicion: condicionDet
      });

      const respDet = await fetch("http://gobinfoana01-2:8510/query", {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          campos: "TOP 200 *",
          origen: "PROCESOS_BI.dbo.t_z_detalles_score",
          condicion: condicionDet
        })
      });

      if (!respDet.ok) throw new Error(`HTTP ${respDet.status}`);
      const detRes = await respDet.json();
      const detArr = Array.isArray(detRes) ? detRes : [detRes];

      cab.detalles = detArr.map(d => {
        const rawIdPreg = getVal(d, "id_pregunta") ?? "";
        const idPreg = parseInt(cleanLookupId(String(rawIdPreg)), 10);

        return {
          _internalId : getVal(d, "ID") ?? getVal(d, "id"),
          id_pregunta : Number.isFinite(idPreg) ? idPreg : null,
          valor       : parseInt(getVal(d, "valor")  ?? "0", 10),
          aplica      : parseInt(getVal(d, "aplica") ?? "1", 10)
        };
      });

      cb(cab);
    } catch (e) {
      console.error("❌ Error en buscarUltimaValidacion:", e);
      cb(null);
    }
  })();
}
