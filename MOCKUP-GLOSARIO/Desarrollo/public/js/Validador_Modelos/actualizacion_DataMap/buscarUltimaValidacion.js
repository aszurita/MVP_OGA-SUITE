// js/Validador_Modelos/cargas/buscarUltimaValidacion.fetch.js


/* -------- utilidades -------- */
async function postQuery({ campos = "*", origen, condicion = "1=1" }) {
  const resp = await fetch(window.API_URL, {
    method: "POST",
    headers: { "accept": "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ campos, origen, condicion })
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status} → ${origen}`);
  const json = await resp.json();
  return Array.isArray(json) ? json : [json]; // normalizar
}

const isNumeric = v => /^[0-9]+$/.test(String(v ?? ""));

/* Ordena por id_validacion DESC (para tomar la última) */
function sortByIdValidacionDesc(a, b) {
  const A = Number(a.id_validacion ?? a.ID_VALIDACION ?? a.Id_Validacion ?? 0);
  const B = Number(b.id_validacion ?? b.ID_VALIDACION ?? b.Id_Validacion ?? 0);
  return B - A;
}

/* -------- FUNCIÓN PRINCIPAL -------- */
/*
   Devuelve: { _internalId, id_validacion, observaciones, obs_seccion1…4, score_final, detalles[] }
*/
function buscarUltimaValidacion(codigoModelo, cb) {
  (async () => {
    /* 1️⃣  CABECERA más reciente ----------------------------------- */
    const origenCab = "procesos_bi.dbo.T_Z_CABECERA_SCORE";
    const CAMPOS_CAB = [
      "ID",
      "id_validacion",
      "observaciones",
      "score_final",
      "obs_seccion1",
      "obs_seccion2",
      "obs_seccion3",
      "obs_seccion4",
      "codigo_modelo"
    ].join(",");

    const condCab = `codigo_modelo='${esc(codigoModelo)}'`;

    let cabeceras = await postQuery({ campos: CAMPOS_CAB, origen: origenCab, condicion: condCab });
    if (!cabeceras.length) { cb(null); return; }

    // Tomar la MÁS RECIENTE (idéntico efecto a RowLimit=1 + OrderBy DESC)
    cabeceras.sort(sortByIdValidacionDesc);
    const r = cabeceras[0];

    // Mapeo tolerante a alias/mayúsculas
    const cab = {
      _internalId  : String(r.ID ?? r.id ?? r.SpId ?? r.sp_id ?? ""),
      id_validacion: String(r.id_validacion ?? r.ID_VALIDACION ?? r.Id_Validacion ?? ""),
      observaciones: r.observaciones ?? r.OBSERVACIONES ?? "",
      obs_seccion1 : r.obs_seccion1  ?? r.OBS_SECCION1  ?? "",
      obs_seccion2 : r.obs_seccion2  ?? r.OBS_SECCION2  ?? "",
      obs_seccion3 : r.obs_seccion3  ?? r.OBS_SECCION3  ?? "",
      obs_seccion4 : r.obs_seccion4  ?? r.OBS_SECCION4  ?? "",
      score_final  : parseFloat(String(r.score_final ?? r.SCORE_FINAL ?? "0")) || 0
    };

    /* 2️⃣  DETALLE de ESA cabecera ------------------------------ */
    const origenDet  = "procesos_bi.dbo.T_Z_detalles_SCORE";
    const CAMPOS_DET = ["ID", "id_validacion", "id_pregunta", "valor", "aplica"].join(",");
    const condDet    = `id_validacion=${isNumeric(cab.id_validacion) ? cab.id_validacion : `'${esc(cab.id_validacion)}'`}`;

    const detRows = await postQuery({ campos: CAMPOS_DET, origen: origenDet, condicion: condDet });

    cab.detalles = detRows.map(d => ({
      _internalId: String(d.ID ?? d.id ?? d.SpId ?? d.sp_id ?? ""),
      id_pregunta: String(d.id_pregunta ?? d.ID_PREGUNTA ?? d.Id_Pregunta ?? ""),
      valor      : parseInt(String(d.valor ?? d.VALOR ?? "0"), 10) || 0,
      aplica     : parseInt(String(d.aplica ?? d.APLICA ?? "1"), 10) || 1
    }));

    cb(cab);
  })().catch(err => {
    console.error("❌ buscarUltimaValidacion (fetch) →", err);
    cb(null);
  });
}


/* js/Validador_Modelos/cargas/buscarUltimaValidacion.js
   Devuelve: {id_validacion, observaciones, obs_seccion1…4, score_final, detalles[]} 
function buscarUltimaValidacion(codigoModelo, cb){

  /* 1️⃣  CABECERA más reciente ----------------------------------- 
  $().SPServices({
    operation : "GetListItems",
    async     : true,
    listName  : "Z_CABECERA_SCORE",
    CAMLQuery : `
      <Query>
        <Where>
          <Eq>
            <FieldRef Name='codigo_modelo'/><Value Type='Text'>${codigoModelo}</Value>
          </Eq>
        </Where>
        <OrderBy><FieldRef Name='id_validacion' Ascending='FALSE'/></OrderBy>
      </Query>`,
    CAMLViewFields : `
      <ViewFields>
        <FieldRef Name='ID'/><FieldRef Name='id_validacion'/>
        <FieldRef Name='observaciones'/><FieldRef Name='score_final'/>
        <FieldRef Name='obs_seccion1'/><FieldRef Name='obs_seccion2'/>
        <FieldRef Name='obs_seccion3'/><FieldRef Name='obs_seccion4'/>
      </ViewFields>`,
    RowLimit : 1,                                    // ⬅️ ¡solo la última!
    completefunc : (xData, st)=>{
      if(st!=="success"){ cb(null); return; }

      const row = $(xData.responseXML).SPFilterNode("z:row").first();
      if(!row.length){ cb(null); return; }

      const cab = {
        _internalId  : row.attr("ows_ID"),            // para UPDATEs
        id_validacion: row.attr("ows_id_validacion"),
        observaciones: row.attr("ows_observaciones") || "",
        obs_seccion1 : row.attr("ows_obs_seccion1")  || "",
        obs_seccion2 : row.attr("ows_obs_seccion2")  || "",
        obs_seccion3 : row.attr("ows_obs_seccion3")  || "",
        obs_seccion4 : row.attr("ows_obs_seccion4")  || "",
        score_final  : parseFloat(row.attr("ows_score_final")||"0")
      };

      /* 2️⃣  DETALLE de ESA cabecera ------------------------------ 
      $().SPServices({
        operation : "GetListItems",
        async     : true,
        listName  : "Z_DETALLES_SCORE",
        CAMLQuery : `
          <Query>
            <Where>
              <Eq>
                <FieldRef Name='id_validacion'/><Value Type='Text'>${cab.id_validacion}</Value>
              </Eq>
            </Where>
          </Query>`,
        completefunc : (x2, st2)=>{
          if(st2==="success"){
            cab.detalles = [];
            $(x2.responseXML).SPFilterNode("z:row").each(function(){
              cab.detalles.push({
                _internalId : $(this).attr("ows_ID"),
                id_pregunta: $(this).attr("ows_id_pregunta"),
                valor      : parseInt($(this).attr("ows_valor")||"0",10),
                aplica     : parseInt($(this).attr("ows_aplica")||"1",10)
              });
            });
          }
          cb(cab);
        }
      });
    }
  });
}
*/