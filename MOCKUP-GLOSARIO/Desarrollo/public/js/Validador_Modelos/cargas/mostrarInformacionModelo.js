/* js/Validador_Modelos/mostrarInformacionModelo.js */
async function mostrarInformacionModelo(codigoModelo) {
  if (!codigoModelo) return;

  const esc = (s) => String(s ?? "").replace(/'/g, "''");
  const payload = {
    campos: "top 1 codigo,modelo_analitica,objetivo_del_modelo,txt_desc_tipo_artefacto,txt_desc_uso_modelo,txt_desc_ciclo_modelo,anio_creacion,fecha_reentrenamiento,cod_canva",
    origen: "[PROCESOS_BI].[dbo].[vw_inventario_modelo_y_artefactos_resumido]",
    condicion: `codigo='${esc(codigoModelo)}'`
  };

  try {
    const resp = await fetch("http://gobinfoana01-2:8510/query", {
      method: "POST",
      headers: { accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!resp.ok) throw new Error("HTTP " + resp.status);

    const data = await resp.json();
    const row = Array.isArray(data) ? data[0] : data;
    if (!row) return;

    modeloInfoCompleta = {
      codigo_final: row.codigo_final || row.codigo || "-",
      modelo_analitica: row.modelo_analitica || "-",
      objetivo_del_modelo: row.objetivo_del_modelo || "-",
      txt_desc_tipo_artefacto: row.txt_desc_tipo_artefacto || "-",
      txt_desc_uso_modelo: row.txt_desc_uso_modelo || "-",
      txt_desc_ciclo_modelo: row.txt_desc_ciclo_modelo || "-",
      anio_creacion: row.anio_creacion || "-",
      fecha_reentrenamiento: row.fecha_reentrenamiento || "-",
      cod_canva: row.cod_canva || ""
    };

    $("#info-codigo").html(`
      <a href="http://vamos.bancoguayaquil.com/sitios/informaciongerencial/DATAHUB/${DEBUG ? "Desarrollo" : "Produccion"}/descripcion_modelo_autom.aspx?codigo=${modeloInfoCompleta.codigo_final}"
         class="btn btn-sm btn-link font-weight-bold d-inline-flex align-items-center"
         target="_blank" rel="noopener noreferrer">
           ${modeloInfoCompleta.codigo_final}
           <i class="simple-icon-share ml-1"></i>
      </a>
    `);

    $("#info-nombre").text(modeloInfoCompleta.modelo_analitica);
    $("#info-objetivo").text(modeloInfoCompleta.objetivo_del_modelo);
    $("#info-tipo").text(modeloInfoCompleta.txt_desc_tipo_artefacto);
    $("#info-uso").text(modeloInfoCompleta.txt_desc_uso_modelo);
    $("#info-ciclo").text(modeloInfoCompleta.txt_desc_ciclo_modelo);
    $("#info-anio").text(modeloInfoCompleta.anio_creacion);
    $("#info-reentrenamiento").text(modeloInfoCompleta.fecha_reentrenamiento);

    $("#modelo-info-card").show();
  } catch (err) {
    console.warn("[modelo info] No se pudo cargar la info del modelo:", err);
  }
}
