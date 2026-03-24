function abrirModalIndicadores(plataforma, servidor, base, esquema, tabla) {
    window.contextoTablaSeleccionada = { plataforma, servidor, base, esquema, tabla };
  
    if (!window.nombreatributo) {
      window.nombreatributo = getAtributosSelect()[0];
    }
    console.log("FUNCION: abrirModalIndicadores window.contextoTablaSeleccionada: ", window.contextoTablaSeleccionada)
    document.getElementById("modal_indicadores").classList.add("active");
    $("#Aprovisionamiento").val(plataforma);
    $("#servidor").val(servidor);
    $("#base").val(base);
    $("#Esquema").val(esquema);
    $("#nombre-tabla").val(tabla);
  
    try {
      window.calidadTablasOficiales = window.calidadTablasOficiales || getAutocompletadoTablas();
      const itemLlave = `[${servidor}].[${base}].[${esquema}].[${tabla}]`;
      const selectedItem = window.calidadTablasOficiales.find(item =>
        `[${item.txt_servidor}].[${item.txt_host}].[${item.txt_fuente_esquema}].[${item.txt_desc_tabla}]` === itemLlave
      );
      const documentacion = selectedItem?.txt_documentacion || selectedItem?.porcentaje_avance || "";
      $("#documentacion").val(`${documentacion}%`);
    } catch (err) {
      console.warn("calidadTablasOficiales no disponible");
    }
  
    cargarAtributosCalidad(); // esto pinta los atributos
    listener_consulta_calidad_atributos(); // 🔥 Esto activa el botón de ver indicadores
}

window.abrirModalIndicadores = abrirModalIndicadores;