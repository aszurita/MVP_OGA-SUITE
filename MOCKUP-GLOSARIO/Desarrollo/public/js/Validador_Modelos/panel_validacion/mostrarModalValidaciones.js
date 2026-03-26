async function mostrarModalValidaciones() {
  crearModalValidaciones();

  try {
    const cabeceras = await obtenerTodasLasCabeceras();
    const detalles = await obtenerUltimosDetalles(cabeceras);


    // 1. Extraer todos los códigos únicos
    const codigosUsuarios = new Set();
    cabeceras.forEach(c => codigosUsuarios.add(c.usuario));
    Object.values(detalles).forEach(d => codigosUsuarios.add(d.usuario));

    // 2. Obtener mapa de nombres con UNA sola consulta
    const nombreMap = await getNombreMapDesdeCodigosGrupo(codigosUsuarios);

    // 3. Construir filas con nombres y score
    const filas = cabeceras.map(c => ({
      id_validacion: c.id_validacion,
      codigo_modelo: `
  <a href="http://vamos.bancoguayaquil.com/sitios/informaciongerencial/OGA_Suite/${DEBUG ? "Desarrollo" : "Produccion"}/ValidadorModelos.aspx?modelo=${encodeURIComponent(c.codigo_modelo)}&id_validacion=${c.id_validacion}"
     class="btn btn-sm btn-link font-weight-bold d-inline-flex align-items-center"
     target="_blank" rel="noopener noreferrer">
       ${c.codigo_modelo}
       <i class="simple-icon-share ml-1"></i>
  </a>`,
      usuario_crea: nombreMap[c.usuario] || c.usuario,
      fecha_ini: c.fecha,
      estado: estadoDesdeFechaFin(c.fecha_Finalizacion ?? c.fecha_finalizacion),
      usuario_mod: nombreMap[detalles[c.id_validacion]?.usuario] || "",
      fecha_act: detalles[c.id_validacion]?.fecha || "",
      score: c.score || "0.00"
    }));


    pintarTablaValidaciones(filas);
    $("#modalValidaciones").modal("show");
  } catch (err) {
    console.error("❌ Error al cargar historial:", err);
    alert("Error al cargar historial de validaciones.");
  }
}

function estadoDesdeFechaFin(fechaFin) {
  const s = (fechaFin ?? "").toString().trim();
  return s ? "Cerrado" : "En proceso";
}

/**
 * Consulta SharePoint una sola vez para obtener los nombres de todos los códigos de empleado.
 * Usa la lista Z_DATOS_EMPLEADOS.
 */
async function getNombreMapDesdeCodigosGrupo(codigosSet) {
  const codigos = Array.from(codigosSet).filter(Boolean);
  if (!codigos.length) return {};

  const valuesXml = codigos.map(c => `<Value Type='Text'>${c}</Value>`).join("");

  return new Promise(resolve => {
    $().SPServices({
      operation: "GetListItems",
      async: true,
      listName: "Z_DATOS_EMPLEADOS",
      CAMLQuery: `
        <Query>
          <Where>
            <In>
              <FieldRef Name="CODIGO_EMPLEADO"/>
              <Values>${valuesXml}</Values>
            </In>
          </Where>
        </Query>`,
      CAMLViewFields: `
        <ViewFields>
          <FieldRef Name="CODIGO_EMPLEADO"/>
          <FieldRef Name="NOMBRE_COMPLETO"/>
        </ViewFields>`,
      completefunc: function (xData, status) {
        const map = {};
        if (status === "success") {
          $(xData.responseXML).SPFilterNode("z:row").each(function () {
            const codigo = $(this).attr("ows_CODIGO_EMPLEADO");
            const nombre = $(this).attr("ows_NOMBRE_COMPLETO");
            if (codigo) map[codigo] = nombre || codigo;
          });
        }
        resolve(map);
      }
    });
  });
}
