// Función para generar una nueva entrada en SharePoint
// Función para insertar en SharePoint con fecha en formato dd/MM/yyyy
function generarProfiling(usuario, servidor, base, esquema, tabla) {  //Autor: Jared Castillo
  console.log(servidor, base, esquema, tabla)
  if (servidor === "DATABRICKS") {
    console.log("entro jeje")
  }
  debugger
  return


    console.log("Intentando agregar entrada a SharePoint nuevo test sin fecha y sin estado Z_Profiling:", { usuario, base, esquema, tabla });
    
    $().SPServices({
      operation: "UpdateListItems",
      async: false,
      batchCmd: "New",
      listName: "Z_Profiling", // Asegurar que el nombre sea exacto
      valuepairs: [
        // ["Title", tabla],  // Algunas listas requieren 'Title'
        ["BASE", base],
        ["SERVIDOR", servidor]
        ["ESQUEMA", esquema],
        ["TABLA", tabla],
        ["USUARIO", usuario],
        ["ESTADO", 0], // Estado siempre como texto
  
      ],
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