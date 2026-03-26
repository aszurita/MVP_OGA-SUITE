// Función para generar una nueva entrada en SharePoint
// Función para insertar en SharePoint con fecha en formato dd/MM/yyyy
async function generarProfiling(usuario, servidor, base, esquema, tabla) {  //Autor: Jared Castillo
  let values = [
    // ["Title", tabla],  // Algunas listas requieren 'Title'
    ["BASE", base],
    ["SERVIDOR", servidor],
    ["ESQUEMA", esquema],
    ["TABLA", tabla],
    ["USUARIO", usuario],
    ["ESTADO", 0], // Estado siempre como texto
  ]

  if (servidor === "DATABRICKS") {
    const result = await ApiService.query({
      campos: "top 10 servidor, catalogo, esquema_tabla, NOMBRE_TABLA",
      origen: "procesos_bi.dbo.LOG_ENTIDADES_OFICIAL",
      condicion: `servidor = '${servidor}' and catalogo = '${base}' and esquema_tabla = '${esquema}' and NOMBRE_TABLA = '${tabla}'`,
    });
    if (result.length === 0) {
      console.log("No hay data en la base de datos")
      return 
    }
    const data = result[0];
    console.log(data)
    debugger
    values = [
      // ["Title", tabla],  // Algunas listas requieren 'Title'
      ["BASE", data.catalogo],
      ["SERVIDOR", data.servidor],
      ["ESQUEMA", data.esquema_tabla],
      ["TABLA", data.NOMBRE_TABLA],
      ["USUARIO", usuario],
      ["ESTADO", 0], // Estado siempre como texto
    ]
    console.log(values)
    debugger
    return
  }

  console.log("Intentando agregar entrada a SharePoint nuevo test sin fecha y sin estado Z_Profiling:", { usuario, base, esquema, tabla });

  $().SPServices({
    operation: "UpdateListItems",
    async: false,
    batchCmd: "New",
    listName: "Z_Profiling", // Asegurar que el nombre sea exacto
    valuepairs: values,
    completefunc: function (xData, Status) {
      console.log("Respuesta de SharePoint:", xData, Status);

      if (Status === "success") {
        showNotification("top", "center", "success", "Se ha generado correctamente el profiling para la tabla.");

      } else {
        console.log("Error al generar el profiling:", xData.responseText);
        showNotification("top", "center", "danger", "Error al generar el profiling.");
      }
    }
  });
}

window.generarProfiling = generarProfiling;