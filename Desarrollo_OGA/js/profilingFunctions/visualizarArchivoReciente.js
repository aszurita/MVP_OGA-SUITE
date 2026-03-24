function visualizarArchivoReciente(base, esquema, tabla) {   //Autor: Jared Castillo
    const archivoBase = `${base}-${esquema}-${tabla}-`;
  
    $().SPServices({
      operation: "GetListItems",
      async: false,
      listName: "OGA_Suite",
      CAMLQueryOptions: `<QueryOptions><Folder>${BASE_URL}Profiling</Folder></QueryOptions>`,
      completefunc: function (xData, Status) {
        if (Status !== "success") {
          console.error("❌ Error al obtener archivos de profiling");
          return;
        }
  
        let archivos = [];
  
        $(xData.responseXML).find("z\\:row").each(function () {
          const nombre = $(this).attr("ows_LinkFilename");
          if (nombre && nombre.startsWith(archivoBase)) {
            const partes = nombre.split("-");
            const fechaHoraStr = partes[partes.length - 1].replace(".html", "").replace(".aspx", ""); // Por si acaso tiene extensión
            console.log("fechaHoraStr : ", fechaHoraStr);
            console.log("partes:", partes);
            archivos.push({
              nombre: nombre,
              fechaHora: fechaHoraStr
            });
          }
        });
  
        if (archivos.length === 0) {
          console.warn("⚠️ No se encontraron archivos recientes para:", archivoBase);
          return;
        }
  
        // Ordenar por fechaHora descendente
        archivos.sort((a, b) => b.fechaHora.localeCompare(a.fechaHora));
  
        const archivoMasReciente = archivos[0].nombre;
        console.log("📄 Archivo más reciente:", archivoMasReciente);
  
        visualizarProfiling(archivoMasReciente);
      }
    });
  }

  window.visualizarArchivoReciente = visualizarArchivoReciente;