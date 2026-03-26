function buscarArchivos(base, esquema, tabla, callback) {  //Autor: Jared Castillo
    const baseURL = `${BASE_URL}Profiling/`;
    const archivoBase = `${base}-${esquema}-${tabla}-`;
  
    console.log("🔍 Buscando archivos en la carpeta Profiling con base:", archivoBase);
  
    $().SPServices({
      operation: "GetListItems",
      async: false,
      listName: "OGA_Suite",  // El nombre de la lista es OGA_Suite
      CAMLQueryOptions: `<QueryOptions><Folder>${BASE_URL}Profiling</Folder></QueryOptions>`,
      completefunc: function (xData, Status) {
        console.log("📂 Respuesta de SharePoint:", xData, Status);
  
        if (Status === "success") {
          let archivos = [];
          $(xData.responseXML).find("z\\:row").each(function () {
            let nombreArchivo = $(this).attr("ows_LinkFilename");
            archivos.push(nombreArchivo);
          });
  
          // Filtrar los archivos que contienen archivoBase
          let archivosFiltrados = archivos.filter(nombre => nombre.includes(archivoBase));
  
          console.log("📋 Archivos filtrados que coinciden:", archivosFiltrados);
  
          callback(archivosFiltrados);
        } else {
          console.log("❌ Error obteniendo archivos:", xData.responseText);
          callback([]);
        }
      }
    });
  }

  window.buscarArchivos = buscarArchivos;