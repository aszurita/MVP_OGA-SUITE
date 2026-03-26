function cargarIndicadoresPorAtributo(id_atributo) {
    window.idAtributoSeleccionado = id_atributo; // donde id_atributo es el valor seleccionado
  
    if (!window.CorreoEmpleado) {
      window.CorreoEmpleado = getDataOwners()[2];
    }
  
    const indicadores = getCalidad_atributo(id_atributo);
    if (!indicadores) {
      console.error("❌ getCalidad_atributo devolvió undefined para", id_atributo);
      return;
    }
  
    const catalogo = getCatalogoIndicadores();
    const { plataforma, servidor, base, esquema, tabla } = window.contextoTablaSeleccionada;
  
    let data_tabla = [];
  
    catalogo.forEach(indicador => {
      const key = `${id_atributo}_${indicador.id_dimension}_${plataforma}_${servidor}_${base}_${esquema}_${tabla}`;
      const registro = indicadores[key];
  
      let rawValor = registro?.valor ?? "";
      let isNoAplica = rawValor === "999";
      let porcentaje = isNoAplica ? "999" : rawValor; // aún lo necesitas como número para el render
  
      data_tabla.push({
        value: indicador.id_dimension,
        text: indicador.nombre,
        porcentaje: porcentaje, // sigue siendo "999" para lógica de desactivación
        mostrar_porcentaje: isNoAplica ? "" : `${porcentaje}%`, // 👈 esto es nuevo
        descripcion_reglas: isNoAplica ? "" : (registro?.descripcion_reglas || ""),
        usuario_ult_actualizacion: (() => {
          let codigo = registro?.usuario_ult_actualizacion;
          if (!codigo) return "";
          let nombre = window.CorreoEmpleado?.[codigo];
          return nombre ? nombre.split("@")[0] : codigo;
        })(),
        fecha_ult_actualizacion: registro?.fecha_ult_actualizacion || ""
      });
  
  
    });
  
    if ($.fn.DataTable.isDataTable('#indicadores_calidad')) {
      $('#indicadores_calidad').DataTable().clear().destroy();
    }
  
    setDataTableIndicadoresCalidad(data_tabla);
    $('#indicadores_calidad').DataTable().columns.adjust().draw();
    $('.btnGuardarIndicadores').prop('disabled', true); // Deshabilita los botones al inicio
    listener_calidad_atributos(); // Vuelve a asignar los listeners por cada render
    actualizarIndicadores(id_atributo);
    ActualizarInputsModal(id_atributo);
  
  }

window.cargarIndicadoresPorAtributo = cargarIndicadoresPorAtributo;