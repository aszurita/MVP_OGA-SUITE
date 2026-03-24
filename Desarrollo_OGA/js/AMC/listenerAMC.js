
function listenerAMC() {
  const empleados = (getEmpleados() || []).filter(Boolean);
  const objetoAreas = {}
  const objetoEmpleados = {}
  const objetoAreasEmpleados = {}
  const objetoUsuarioEmpleados = {}
  empleados.forEach(e => {
    if (!objetoAreasEmpleados[e.centroCosto]) objetoAreasEmpleados[e.centroCosto] = []
    objetoAreasEmpleados[e.centroCosto].push({ text: e.nombreCompleto, id: e.codigo })

    if (!objetoAreas[e.codCentroCosto]) objetoAreas[e.codCentroCosto] = e.centroCosto

    objetoEmpleados[e.codigo] = e
    objetoUsuarioEmpleados[e.usuario] = e
  })
  const listaAreas = Object.entries(objetoAreas || {})?.map(([codigoArea, nombreArea]) => ({ text: nombreArea, id: codigoArea }))
  const listaSponsor = Object.entries(objetoEmpleados || {})?.map(([codigoEmpleado, objetoEmpleado]) => ({ text: objetoEmpleado.nombreCompleto, id: objetoEmpleado.codigo }))
  $('#amc-area-solicitante').select2({
    theme: "bootstrap",
    placeholder: "",
    maximumSelectionSize: 6,
    containerCssClass: ":all:",
    data: listaAreas,
  }).on("select2:select", function (event) {
    const valorSeleccionado = event.params.data.id;
    const textoSeleccionado = event.params.data.text;
    const sponsorSelected = $("#amc-sponsor").val() || { centroCosto: "" }
    let currentAmcId = $("#amc-name").attr("amc-id")
    if (window.objetoAMC[currentAmcId] && (window.objetoAMC[currentAmcId].area_solicitante || "").toString() !== valorSeleccionado.toString()) {
      window.objetoAMC[currentAmcId].area_solicitante = valorSeleccionado
      window.celdaEditada = true
    }
    if (objetoAreasEmpleados[textoSeleccionado] !== sponsorSelected.centroConsto) {
      setOpcionesSelect({
        idSelect: "amc-sponsor",
        dataSelect: valorSeleccionado.trim() ? objetoAreasEmpleados[textoSeleccionado] : listaSponsor,
      })
    }

  });

  $("#btnEliminarAMC").on("click", function (e) {
    e.preventDefault();
    const amcId = $("#amc-name").attr("amc-id") || "";
    if (!amcId) {
      return showNotification("top", "center", "info", "Selecciona primero un Analytics Model Canvas guardado para poder eliminarlo.", 2500);
    }
    const amcName = $("#amc-name").val().trim() || amcId;
    if (typeof canAdminAMC === "function" && !canAdminAMC(amcId)) {
      return showNotification("top", "center", "danger", "Solo el creador del AMC o un usuario con permisos puede eliminarlo.", 2500);
    }
    $("#modalEliminarAMCName").text(amcName);
    $("#modalEliminarAMC").modal("show");
  });

  $("#btnConfirmarEliminarAMC").on("click", function () {
    const amcId = $("#amc-name").attr("amc-id") || "";
    if (!amcId) {
      $("#modalEliminarAMC").modal("hide");
      return;
    }
    const amcName = $("#amc-name").val().trim() || amcId;
    if (typeof isAMCLinkedToModelAPI === "function" && isAMCLinkedToModelAPI({ idAMC: amcId })) {
      $("#modalEliminarAMC").modal("hide");
      return showNotification(
        "top",
        "center",
        "warning",
        "No se puede eliminar porque estÃ¡ asociado a un modelo, por favor desvincular primero.",
        5000
      );
    }
    deleteAnalyticsModelCanvasAPI({
      idAMC: amcId,
      onSuccess: function () {
        showNotification("top", "center", "success", `Se eliminÃ³ correctamente el Analytics Model Canvas '${amcName}'.`, 3000);
        if (window.objetoAMC) delete window.objetoAMC[amcId];
        clearAMC();
      },
      onError: function (xhr, status, errorThrown) {
        console.error("Error eliminando AMC via API:", status, errorThrown, xhr && xhr.responseText);
        showNotification("top", "center", "danger", "No se pudo eliminar el Analytics Model Canvas (API).", 4000);
      }
    });
    $("#modalEliminarAMC").modal("hide");
  });

  $('#amc-sponsor').select2({
    theme: "bootstrap",
    placeholder: "",
    maximumSelectionSize: 6,
    containerCssClass: ":all:",
    data: listaSponsor,
  }).on("select2:select", function (event) {
    const valorSeleccionado = event.params.data.id;
    const textoSeleccionado = event.params.data.text;
    let currentAmcId = $("#amc-name").attr("amc-id")
    if (window.objetoAMC[currentAmcId] && (window.objetoAMC[currentAmcId].sponsor || "").toString() !== valorSeleccionado.toString()) {
      window.objetoAMC[currentAmcId].sponsor = valorSeleccionado
      window.objetoAMC[currentAmcId].area_solicitante = (objetoEmpleados[valorSeleccionado] || { codCentroCosto: "" }).codCentroCosto
      window.celdaEditada = true
    }
    $("#amc-area-solicitante").val((objetoEmpleados[valorSeleccionado] || { codCentroCosto: "" }).codCentroCosto).trigger("change")
  });

  // Evento para detectar cuando se borra el texto del campo
  $("#amc-area-solicitante").on("input", function () {
    let currentValue = $(this).val();
    if (!currentValue || !currentValue.trim()) {
      // Si el campo estÃ¡ vacÃ­o, restaurar la lista original
      setOpcionesSelect({
        idSelect: "amc-sponsor",
        dataSelect: listaSponsor,
      })
    }
  });

  window.objetoAreasEmpleados = objetoAreasEmpleados
  window.objetoUsuarioEmpleados = objetoUsuarioEmpleados
  window.objetoEmpleados = objetoEmpleados

  const formatoSelect = document.getElementById("amc-formato")
  const catalogoAMC = Object.entries(getCatalogoOGASUITE("10")).map(([value, label]) => {
    const option = document.createElement("option");
    option.text = label;
    option.value = value;
    formatoSelect.add(option)
  })

  $('#amc-formato').select2({
    theme: "bootstrap",
    placeholder: "",
    maximumSelectionSize: 6,
    containerCssClass: ":all:",
    minimumResultsForSearch: Infinity,
  });

  $("#amc-formato").on("change", function () {
    (window.objetoAMC[$("#amc-name").attr("amc-id")] || { formato: "" }).formato = $(this).val();
    if (window.amcSeleccionado && (window.objetoAMC[$("#amc-name").attr("amc-id")] || { formato: "" }).formato !== $(this).val()) {
      window.celdaEditada = true
    }
    if ($(this).val() === "3") {
      $("#amc-decisiones").css("background-color", "#d7d7d7")
      $("#amc-tareas").css("background-color", "#d7d7d7")
      $("#amc-predicciones").css("background-color", "#d7d7d7")
      $("#amc-evaluacion-desarrollo").css("background-color", "#d7d7d7")
      $("#amc-evaluacion").css("background-color", "#d7d7d7")
    } else {
      $("#amc-decisiones").css("background-color", "transparent")
      $("#amc-tareas").css("background-color", "transparent")
      $("#amc-predicciones").css("background-color", "transparent")
      $("#amc-evaluacion-desarrollo").css("background-color", "transparent")
      $("#amc-evaluacion").css("background-color", "transparent")
    }
  })

  $("#btnDescartarCambios").on("click", function (e) {
    clearAMC();
    const analyticsModelCanvas = getAnalyticsModelCanvasAPI();
    const objetoAMC = {}
    const listaAMC = analyticsModelCanvas.forEach(amc => objetoAMC[amc.idAMC] = {
      "DECISIONES": amc.decisiones ? amc.decisiones.split("||") : [],
      "PREDICCIONES": amc.predicciones ? amc.predicciones.split("||") : [],
      "TAREAS": amc.tareas ? amc.tareas.split("||") : [],
      "EVALUACIÓN EN DESARROLLO": amc.evaluacionDesarrollo ? amc.evaluacionDesarrollo.split("||") : [],
      "PROPUESTA DE VALOR": amc.propuestaValor ? amc.propuestaValor.split("||") : [],
      "FUENTES DE DATOS": amc.fuentesDatos ? amc.fuentesDatos.split("||") : [],
      "CARACTERÍSTICAS PARA EL MODELO": amc.caracteristicasReentrenamiento ? amc.caracteristicasReentrenamiento.split("||") : [],
      "RECOLECCIÓN DE INFORMACIÓN": amc.recoleccionInformacion ? amc.recoleccionInformacion.split("||") : [],
      "TIEMPOS Y RESPONSABLES": amc.tiemposResponsables ? amc.tiemposResponsables.split("||") : [],
      "MONITOREO DE CREACIÓN DE VALOR": amc.monitoreoCreacionValor ? amc.monitoreoCreacionValor.split("||") : [],
      "EVALUACIÓN EN LÍNEA": amc.evaluacion ? amc.evaluacion.split("||") : [],
      "nombre_amc": amc.nombreAMC || "",
      "area_solicitante": amc.areaSolicitante || "",
      "sponsor": amc.sponsor || "",
      "formato": amc.formato || "",
      "usuario_creacion": amc.usuarioCreacion || "",
      "id_amc": amc.idAMC || "",
      "estado": amc.estado || "ACTIVO",
      "usuarios_permisos": (amc.usuariosPermisos || "").split("||").map(e => e.trim()).filter(e => e),
      "fecha_ultima_modificacion": amc.fechaUltimaModificacion || ""
    })

    const listaOpcionesAMC = Object.keys(objetoAMC || {})?.map(e => ({ label: objetoAMC[e].nombre_amc, value: e }))
    window.objetoAMC = objetoAMC
    $("#modalConfirmar").modal("hide")
  })

  $("#btnContinuarEditando").on("click", function (e) {
    $("#modalConfirmar").modal("hide")
  })

  $("#btnBorrarAMC").on("click", function (e) {
    if (window.amcSeleccionado && window.celdaEditada) $("#modalConfirmar").modal("show")
    else if (!window.amcSeleccionado && window.celdaEditada) $("#modalConfirmar").modal("show")
    else clearAMC()
  })

  $("#btnGuardarAMC").on("click", function (e) {
    const valueAreaSolicitante = $("#amc-area-solicitante").val();
    const valueSponsor = $("#amc-sponsor").val();
    const valueFormato = $("#amc-formato").val();
    const amcName = $("#amc-name").val().trim();
    let amcId = $("#amc-name").attr("amc-id");

    // Validar que todos los campos de encabezado estÃ©n llenos
    if (!valueAreaSolicitante || !valueSponsor || !valueFormato || !amcName) {
      return showNotification(
        "top",
        "center",
        "info",
        "Debe llenar correctamente todos los campos (Proyecto, Ãrea Solicitante, Sponsor, Formato).",
        3000
      );
    }

    const objAMC = window.objetoAMC[amcId];

    if (!objAMC) {
      return showNotification(
        "top",
        "center",
        "info",
        "Debe ingresar contenido en al menos una de las celdas antes de guardar.",
        3000
      );
    }

    // Validar si hay al menos una celda con contenido
    if (!validarCeldasLlenas(objAMC)) {
      return showNotification(
        "top",
        "center",
        "info",
        "Debe ingresar contenido en al menos una de las celdas antes de guardar.",
        3000
      );
    }

    const joinOrNull = (arr) => {
      if (!Array.isArray(arr)) return null;
      const filtered = arr.filter(e => (e || "").toString().trim() !== "");
      return filtered.length ? filtered.join("||") : null;
    };

    // Actualizamos los valores del AMC en memoria con los seleccionados del encabezado
    objAMC["area_solicitante"] = valueAreaSolicitante;
    objAMC["sponsor"] = valueSponsor;
    objAMC["formato"] = valueFormato;
    objAMC["nombre_amc"] = amcName;

    const datos_usuario = getUserAndDate();
    const nombre_usuario_modificacion = datos_usuario[0][0];
    const localISOTime = new Date().toISOString();

    const amcSponsor = objAMC.sponsor;
    const amcAreaSolicitante = objAMC.area_solicitante;
    const amcFormato = objAMC.formato;
    const amcDecisiones = objAMC.DECISIONES.join("||");
    const amcPredicciones = objAMC.PREDICCIONES.join("||");
    const amcTareas = objAMC.TAREAS.join("||");
    const amcEvaluacionDesarrollo = objAMC["EVALUACIÓN EN DESARROLLO"].join("||");
    const amcPropuestaValor = objAMC["PROPUESTA DE VALOR"].join("||");
    const amcFuentesDatos = objAMC["FUENTES DE DATOS"].join("||");
    const amcCaracteristicasReentrenamiento = objAMC["CARACTERÍSTICAS PARA EL MODELO"].join("||");
    const amcRecoleccionInformacion = objAMC["RECOLECCIÓN DE INFORMACIÓN"].join("||");
    const amcTiemposResponsables = objAMC["TIEMPOS Y RESPONSABLES"].join("||");
    const amcMonitoreoCreacionValor = objAMC["MONITOREO DE CREACIÓN DE VALOR"].join("||");
    const amcEvaluacion = objAMC["EVALUACIÓN EN LÍNEA"].join("||");

    const toNull = (val) => {
      if (val === null || val === undefined) return null;
      const str = String(val).trim();
      return str === "" ? null : val;
    };
    const amcExistente = getAnalyticsModelCanvasAPI({ idAMC: amcId, useCache: false })[0];
    const IS_OGA = typeof isOGA === "function" && isOGA();

    if (amcExistente) {
      if (
        window.current_user !== amcExistente.usuarioCreacion &&
        !IS_OGA &&
        !(amcExistente.usuariosPermisos || "").split("||").includes(window.current_user)
      ) {
        return showNotification(
          "top",
          "center",
          "danger",
          "Solo el creador del AMC o un usuario con permisos puede modificarlo.",
          3000
        );
      }

      updateAnalyticsModelCanvasAPI({
        data: {
          nombre_amc: toNull(amcName),
          sponsor: toNull(amcSponsor),
          area_solicitante: toNull(amcAreaSolicitante),
          formato: toNull(amcFormato),
          decisiones: joinOrNull(objAMC.DECISIONES),
          predicciones: joinOrNull(objAMC.PREDICCIONES),
          tareas: joinOrNull(objAMC.TAREAS),
          evaluacion_desarrollo: joinOrNull(objAMC["EVALUACIÓN EN DESARROLLO"]),
          propuesta_valor: joinOrNull(objAMC["PROPUESTA DE VALOR"]),
          fuentes_datos: joinOrNull(objAMC["FUENTES DE DATOS"]),
          caracteristicas_reentrenamiento: joinOrNull(objAMC["CARACTERÍSTICAS PARA EL MODELO"]),
          recoleccion_informacion: joinOrNull(objAMC["RECOLECCIÓN DE INFORMACIÓN"]),
          tiempos_responsables: joinOrNull(objAMC["TIEMPOS Y RESPONSABLES"]),
          monitoreo_creacion_valor: joinOrNull(objAMC["MONITOREO DE CREACIÓN DE VALOR"]),
          evaluacion: joinOrNull(objAMC["EVALUACIÓN EN LÍNEA"]),
          usuario_ultima_modificacion: toNull(nombre_usuario_modificacion),
          fecha_ultima_modificacion: localISOTime,
          usuarios_permisos: toNull(objAMC.usuarios_permisos),
        },
        condicion: `id_amc='${amcId}'`,
        onSuccess: function () {
          showNotification(
            "top",
            "center",
            "success",
            "Se ha editado correctamente el Analytics Model Canvas.",
            3000
          );
          reloadAMC(amcId);
        },
        onError: function (xhr, status, errorThrown) {
          console.error("Error actualizando AMC via API:", status, errorThrown, xhr && xhr.responseText);
          showNotification("top", "center", "danger", "No se pudo actualizar el Analytics Model Canvas (API).", 4000);
        }
      });
    } else {
      const amcUsuarioCreacion = window.current_user;

      insertAnalyticsModelCanvasAPI({
        data: {
          id_amc: amcId,
          nombre_amc: toNull(amcName),
          area_solicitante: toNull(amcAreaSolicitante),
          sponsor: toNull(amcSponsor),
          formato: toNull(amcFormato),
          decisiones: joinOrNull(objAMC.DECISIONES),
          predicciones: joinOrNull(objAMC.PREDICCIONES),
          tareas: joinOrNull(objAMC.TAREAS),
          evaluacion_desarrollo: joinOrNull(objAMC["EVALUACIÓN EN DESARROLLO"]),
          propuesta_valor: joinOrNull(objAMC["PROPUESTA DE VALOR"]),
          fuentes_datos: joinOrNull(objAMC["FUENTES DE DATOS"]),
          caracteristicas_reentrenamiento: joinOrNull(objAMC["CARACTERÍSTICAS PARA EL MODELO"]),
          recoleccion_informacion: joinOrNull(objAMC["RECOLECCIÓN DE INFORMACIÓN"]),
          tiempos_responsables: joinOrNull(objAMC["TIEMPOS Y RESPONSABLES"]),
          monitoreo_creacion_valor: joinOrNull(objAMC["MONITOREO DE CREACIÓN DE VALOR"]),
          evaluacion: joinOrNull(objAMC["EVALUACIÓN EN LÍNEA"]),
          usuario_creacion: toNull(amcUsuarioCreacion),
          fecha_creacion: localISOTime,
          usuario_ultima_modificacion: toNull(nombre_usuario_modificacion),
          fecha_ultima_modificacion: localISOTime,
          estado: "1",
          usuarios_permisos: toNull(objAMC.usuarios_permisos),
        },
        onSuccess: function () {
          const br = "&lt;br&gt;"
          const amcLink = `${BASE_URL}AnalyticsModelCanvas.aspx?amc=${amcId}`
          const emailBody = `Se ha creado un nuevo Analytics Model Canvas:${br}${br}
          Nombre del AMC: ${amcName}${br}
          Usuario de Creaci?n: ${amcUsuarioCreacion}${br}
          Para acceder al Analytics Model Canvas de un click en el siguiente &lt;a href=&quot;${amcLink}&quot; target=&quot;_blank&quot;&gt;link&lt;/a&gt;|N
          `;
          const destinatarios = "jcastillo3&fchang"
          escribirListaCorreo(destinatarios, destinatarios, "CreaciÃ³n de Analytics Model Canvas", emailBody)
          showNotification("top", "center", "success", "Se ha guardado correctamente el Analytics Model Canvas.", 3000);
          reloadAMC(amcId);
        },
        onError: function (xhr, status, errorThrown) {
          console.error("Error insertando AMC via API:", status, errorThrown, xhr && xhr.responseText);
          showNotification("top", "center", "danger", "No se pudo guardar el Analytics Model Canvas (API).", 4000);
        }
      });
    }
  });


  $("#btnDescargarAMC").on("click", function (e) {
    guardarAMC("amc-wrapper")
  })

  $("#btnGuardarEditarCelda").on("click", function () {
    guardarCelda()
  })

  $("#btnCancelarEditarCelda").on("click", function () {
    $("#modalEditarCelda").modal("hide")
  })

  $("#btn-ficha-amc").on("click", function () {
    if (window.__amcFichaBusy) return;
    window.__amcFichaBusy = true;
    const $btn = $(this);
    $btn.prop("disabled", true).addClass("disabled");
    try {
      // Comprueba si el DataTable ya est? inicializado
      if (!$.fn.DataTable.isDataTable('#amc-table')) {
        FichaAnalyticsModelCanvas()
      }
      redrawDataTable("amc-table", getDataFichaAMC())
      // $("#amc-table-search").val($("#amc-name").attr("amc-id").split("-")[0])
      $("#amc-table-search").val(window.current_user)
      $("#amc-table").DataTable().search(window.current_user).draw()
      $("#modalFichaAnalyticsModelCanvas").modal("show")
    } finally {
      window.__amcFichaBusy = false;
      $btn.prop("disabled", false).removeClass("disabled");
    }
  })

  $("#btnGuardarEditarElemento").on("click", function () {
    const modal = $("#modalEditarElementoCelda")
    const [amcId, title, index] = modal.attr("data-content").split("||")
    const currentText = modal.attr("data-original-value")
    const newText = $("#modalInputElementoCelda").val()
    if (newText && currentText !== newText) {
      const currentAMC = window.objetoAMC[amcId]
      currentAMC[title][index] = newText;
      window.celdaEditada = true
      $("#modalEditarElementoCelda").modal("hide")
      reloadAMC(amcId)
    }
    $("#modalInputElementoCelda").val("")
  })

  $("#btnCancelarEditarElemento").on("click", function () {
    const modal = $("#modalEditarElementoCelda")
    modal.modal("hide")
  })

  document.getElementById('btnExportarAMC').onclick = function () {
    // Seleccionar todos los elementos con clase .amc-cell
    const amcCells = document.querySelectorAll('.amc-cell');
    const amcSections = document.querySelectorAll('.amc-section');
    const amcSubsections = document.querySelectorAll('.amc-subsection');
    const section2 = document.getElementById('amc-section-2');
    const editIcons = document.querySelectorAll('.simple-icon-note');
    const deleteIcons = document.querySelectorAll('.simple-icon-close');
    const cellContentWrapper = document.querySelectorAll('.amc-cell__content-wrapper');
    const amcInputs = document.querySelectorAll(".amc-input")
    const amcActions = document.querySelectorAll(".btnActions")
    const btnFichaAmc = document.getElementById('btn-ficha-amc');

    btnFichaAmc.style.visibility = "hidden"

    const commentsCard = document.querySelector(".seguimiento-card")

    commentsCard.style.visibility = "hidden"

    // Cambiar el estilo de overflow y height de las celdas y secciones
    amcCells.forEach((el) => {
      el.style.overflow = 'visible'; // Eliminar el scroll de las celdas
      // el.style.height = 'auto';      // Asegurarse de que las celdas se expandan segÃºn su contenido

      el.style.setProperty('height', 'auto', 'important');
      // el.style.setProperty('min-height', '50%', 'important');
      el.style.setProperty("flex", 1, "important")
    });

    cellContentWrapper.forEach(e => {
      e.style.overflow = "visible";
      e.style.height = "auto"
    })

    amcSections.forEach((section) => {
      section.style.height = 'auto'; // Asegurarse de que las secciones se expandan con el contenido de las celdas
    });

    amcSubsections.forEach((section) => {
      section.style.height = 'auto'; // Asegurarse de que las secciones se expandan con el contenido de las celdas
    });

    // Ocultar los iconos de editar y eliminar
    editIcons.forEach(icon => {
      icon.style.visibility = 'hidden'; // Ocultar iconos de editar
    });
    deleteIcons.forEach(icon => {
      icon.style.visibility = 'hidden'; // Ocultar iconos de eliminar
    });

    amcInputs.forEach(input => {
      input.style.border = 'none'
    })

    amcActions.forEach(btn => {
      btn.style.visibility = 'hidden'
    })

    // Agregar el estilo de impresiÃ³n en formato horizontal antes de llamar a print
    const style = document.createElement('style');
    style.innerHTML = `
          @media print {
      @page {
          size: landscape; /* OrientaciÃ³n horizontal */
          margin: 0; /* Sin mÃ¡rgenes entre la pÃ¡gina y el contenido */
      }
  
      body {
          margin: auto;
          padding: 0;
          width: 80%;
      }
  
      .container-amc {
          display: block;
          width: 100%;
      }
  
      .amc-section {
          display: block;
          width: 100%;
          height: auto !important; /* Expandir secciones */
          overflow: visible !important; /* Evitar scroll */
          page-break-inside: avoid; /* Evitar cortes dentro de secciones */
      }
  
      .amc-cell {
          display: block;
          width: 100%;
          height: auto !important; /* Expandir las celdas al contenido */
          overflow: visible !important;
          margin: 0 !important;
          padding: 0 !important;
      }
  
      /* Ocultar iconos durante la impresiÃ³n */
      .simple-icon-note,
      .simple-icon-close,
      .simple-icon-trash {
          visibility: hidden !important;
      }
  
      
  }
      `;
    document.head.appendChild(style);

    // Abrir la ventana de impresiÃ³n (simula Ctrl + P)
    window.print();

    // Restaurar el overflow y el height de las celdas y secciones despuÃ©s de la impresiÃ³n
    setTimeout(() => {
      commentsCard.style.visibility = "visible"

      amcCells.forEach((el) => {
        el.style.overflow = 'auto';  // Restaurar el valor original de overflow
        // el.style.height = '100%';    // Restaurar el valor original de height
      });

      amcSections.forEach((section) => {
        section.style.height = '65%'; // Restaurar el valor original de height en las secciones
      });
      section2.style.height = '35%'

      cellContentWrapper.forEach(e => {
        e.style.overflow = "auto";
        e.style.height = "85%"
      })

      amcSubsections.forEach((section) => {
        section.style.height = 'auto'; // Asegurarse de que las secciones se expandan con el contenido de las celdas
      });

      // Restaurar la visibilidad de los iconos de editar y eliminar
      editIcons.forEach(icon => {
        icon.style.visibility = 'visible'; // Restaurar iconos de editar
      });
      deleteIcons.forEach(icon => {
        icon.style.visibility = 'visible'; // Restaurar iconos de eliminar
      });
      amcInputs.forEach(input => {
        input.style.border = '1px solid #d7d7d7'
      })

      amcActions.forEach(btn => {
        btn.style.visibility = 'visible'
      })

      btnFichaAmc.style.visibility = "hidden"

    }, 100); // Espera antes de restaurar los estilos (ajustable)
  };


  $("#seguimiento-cancelar-respuesta").on("click", function () {
    $("#seguimiento-comentario-respuesta").text(``)
    $("#seguimiento-comentario-respuesta").attr("comentario", "")
    $("#seguimiento-comentario-respuesta").attr("edit-id", "")
    $("#seguimiento-comentario-respuesta").attr("edit-spid", "")
    $("#seguimiento-comentario-respuesta").attr("edit-parent", "")
    $("#seguimiento-comentario-respuesta").attr("edit-doc", "")
    document.getElementById("seguimiento-cancelar-respuesta").style.visibility = "hidden";
  })


  const analyticsModelCanvas = getAnalyticsModelCanvasAPI();
  const objetoAMC = {}
  const listaAMC = analyticsModelCanvas.forEach(amc => objetoAMC[amc.idAMC] = {
    "DECISIONES": amc.decisiones ? amc.decisiones.split("||") : [],
    "PREDICCIONES": amc.predicciones ? amc.predicciones.split("||") : [],
    "TAREAS": amc.tareas ? amc.tareas.split("||") : [],
    "EVALUACIÓN EN DESARROLLO": amc.evaluacionDesarrollo ? amc.evaluacionDesarrollo.split("||") : [],
    "PROPUESTA DE VALOR": amc.propuestaValor ? amc.propuestaValor.split("||") : [],
    "FUENTES DE DATOS": amc.fuentesDatos ? amc.fuentesDatos.split("||") : [],
    "CARACTERÍSTICAS PARA EL MODELO": amc.caracteristicasReentrenamiento ? amc.caracteristicasReentrenamiento.split("||") : [],
    "RECOLECCIÓN DE INFORMACIÓN": amc.recoleccionInformacion ? amc.recoleccionInformacion.split("||") : [],
    "TIEMPOS Y RESPONSABLES": amc.tiemposResponsables ? amc.tiemposResponsables.split("||") : [],
    "MONITOREO DE CREACIÓN DE VALOR": amc.monitoreoCreacionValor ? amc.monitoreoCreacionValor.split("||") : [],
    "EVALUACIÓN EN LÍNEA": amc.evaluacion ? amc.evaluacion.split("||") : [],
    "nombre_amc": amc.nombreAMC || "",
    "area_solicitante": amc.areaSolicitante || "",
    "sponsor": amc.sponsor || "",
    "formato": amc.formato || "",
    "usuario_creacion": amc.usuarioCreacion || "",
    "id_amc": amc.idAMC || "",
    "estado": amc.estado || "ACTIVO",
    "usuarios_permisos": (amc.usuariosPermisos || "").split("||").map(e => e.trim()).filter(e => e),
    "fecha_ultima_modificacion": amc.fechaUltimaModificacion || ""
  })

  const listaOpcionesAMC = Object.keys(objetoAMC || {})?.map(e => ({ label: objetoAMC[e].nombre_amc, value: e }))
  window.objetoAMC = objetoAMC
  $("#amc-name").autocomplete({
    source: listaOpcionesAMC,
    focus: function (event, ui) {
      event.preventDefault();
      let amc = ui.item.value;
      let amcName = ui.item.label;
    },
    select: function (event, ui) {
      // Evitar que se establezca el valor por defecto del input (que serÃ­a el `value`)
      event.preventDefault();
      let amc = ui.item.value
      let amcName = ui.item.label
      $("#amc-name").attr("amc-id", amc)
      clearAMC()
      reloadAMC(amc)

      window.amcSeleccionado = true
    }
  }).autocomplete("widget").addClass("select-amc")

  $(".seguimiento-card-button").on("click", (function (t) {
    t.preventDefault();
    $(".seguimiento-card").toggleClass("shown")
    $(".seguimiento-card-button").toggleClass("text-primary")
    let tooltipTriggerList = document.querySelectorAll('[data-toggle="tooltip"]');
    let tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl, {
      boundary: document.body,
      container: 'body',
      trigger: 'hover'
    }));

    tooltipList.forEach((tooltip) => { $('.tooltip').hide(); });

  }))

  $("#seguimiento-comentarios").html(`
        <div class="mb-2 text-center">
          No hay observaciones por el momento
        </div>
      `)
  $("#btn-adjuntar-documento").on("click", function () {
    document.getElementById("input-adjuntar-documento").click()

  })
  $("#input-adjuntar-documento").on("change", function () {
    const files = $(this)[0].files;
    let fileNames = $.map(files, function (file) {
      return file.name
    }).join(", ");
    document.getElementById("name-adjuntar-documento").textContent = fileNames

  })

  $("#btn-enviar-observacion").on("click", function () {

    const inputSeguimiento = $("#seguimiento-input")
    const amcNombre = $("#amc-name").val()
    const amcId = $("#amc-name").attr("amc-id")
    if (!amcId || !inputSeguimiento.val()) return;
    const amcComentario = (getAnalyticsModelCanvasAPI({ idAMC: amcId, useCache: false }) || [])[0]
    if (!amcComentario) return showNotification("top", "center", "info", "Debe guardar primero el Analytics Model Canvas antes de poder ingresar una observaciÃ³n.", 2000)
    const text = inputSeguimiento.val().trim()
    const idAMC = amcComentario.idAMC;
    const editId = $("#seguimiento-comentario-respuesta").attr("edit-id") || "";
    const editSpId = $("#seguimiento-comentario-respuesta").attr("edit-spid") || "";
    const editParent = $("#seguimiento-comentario-respuesta").attr("edit-parent") || "0";
    const editDoc = $("#seguimiento-comentario-respuesta").attr("edit-doc") || "";
    const isEditing = Boolean(editId);
    const idComentario = isEditing
      ? editId
      : getNextIdAMC({
        list: getComentariosAMC({ username: window.current_user, includeInactive: true }),
        parameter: "idComentario"
      })
    const localISOTime = new Date()
    const idPadre = isEditing ? (editParent || "0") : ($("#seguimiento-comentario-respuesta").attr("comentario") || "0")

    const files = $("#input-adjuntar-documento")[0].files;
    const folderUrl = `${BASE_URL}docs/AnalyticsModelCanvas`;
    const file = files[0]
    let newFileName = ""
    let fileUrl = editDoc || ""
    if (file) {
      //uploadFileToSharePoint(file, folderUrl, amcComentario.idAMC);
      const fileResult = uploadFileToSharePoint(file, folderUrl, amcComentario.idAMC);
      if (fileResult === false) return; // Detiene todo si la extensiÃ³n no es vÃ¡lida

      let nombreDocumento = file.name
      // Obtiene la extensiÃ³n del archivo
      const fileExtension = file.name.split('.').pop().toLowerCase();
      nombreDocumento = nombreDocumento.split(".")[0].split(" ").join("_")
      newFileName = `${nombreDocumento}.${fileExtension}`;
      fileUrl = `${amcComentario.idAMC}_${newFileName}`
    }

    const objetoUsuarioActual = obtenerUsuario()
    const currentUserKey = (window.current_user || "").toString().toLowerCase().split("\\").pop();
    const empleadoActual = (window.objetoUsuarioEmpleados || {})[window.current_user]
      || (window.objetoUsuarioEmpleados || {})[currentUserKey]
      || {};
    const autorNombre = empleadoActual.nombreCompleto || window.nombreCompleto || window.current_user || "";
    const comentarioPayload = {
      id_comentario: idComentario,
      id_oga: idAMC,
      id_respuesta: idPadre,
      origen: "AMC",
      sn_activo: 1,
      comentario: text,
      fecha_comentario: localISOTime.toISOString(),
      autor_comentario_nombres: autorNombre,
      autor_comentario_usuario: window.current_user || currentUserKey,
      documento_adjunto: fileUrl,
    };

    if (isEditing) {
      updateComentarioOGA_SQL({
        data: comentarioPayload,
        condicion: `id_comentario='${escapeSqlValue(idComentario)}' AND id_oga='${escapeSqlValue(idAMC)}'`
      });
    } else {
      insertComentarioOGA_SQL({ data: comentarioPayload });
    }

    const objectNameEmployees = listToObject({ lista: empleados, parametroClave: "nombreCompleto" }) || {}
    // const userMentions = twttr.txt.extractMentions(text)
    const userMentions = inputSeguimiento.attr("mentions") ? inputSeguimiento.attr("mentions").split("&") : []
    const br = "&lt;br&gt;"
    const anchor = "&lt;br&gt;"

    //const usernames = userMentions?.map(name => (objectNameEmployees[name.slice(1)] || { usuario: "" }).usuario)
    const usernames = userMentions
      .map(name => (objectNameEmployees[name.slice(1)] || { usuario: "" }).usuario)
      .filter(Boolean); // Elimina strings vacÃ­os
    const allRecipients = [...usernames, window.current_user];
    const destinatarios = [...new Set(allRecipients)].join("&");

    const amcLink = `${BASE_URL}AnalyticsModelCanvas.aspx?amc=${idAMC}`
    const emailBody = `Se han realizado observaciones sobre el Analytics Model Canvas de: ${amcComentario.nombreAMC}, comentando lo siguiente: ${br}${br}${window.current_user}: ${text} ${br}${br}Para acceder al Analytics Model Canvas de un click en el siguiente &lt;a href=&quot;${amcLink}&quot; target=&quot;_blank&quot;&gt;link&lt;/a&gt;|N`;
    escribirListaCorreo(destinatarios, destinatarios, "Analytics Model Canvas - ObservaciÃ³n", emailBody)

    setComentariosAMC(getComentariosAMC({ amcId: idAMC }))
    inputSeguimiento.val("")
    $("#input-adjuntar-documento").val("")
    $("#seguimiento-comentario-respuesta").attr("comentario", "")
    $("#seguimiento-cancelar-respuesta").click()

  })

  const users = Object.values(objetoUsuarioEmpleados)
    .filter(Boolean)
    .map(user => {
      const nombre = user.nombreCompleto || user.NOMBRE_COMPLETO || user.usuario || user.codigo || "";
      return {
        label: nombre ? `@${nombre}` : "",
        keywords: [
          user.usuario ? `@${user.usuario}` : "",
          user.codigo ? `@${user.codigo}` : "",
          nombre ? `@${nombre.toLowerCase()}` : ""
        ].filter(Boolean)
      };
    })
    .filter(user => user.label && user.keywords.length);


  const inputSeguimiento = document.getElementById("seguimiento-input")
  const suggestions = document.getElementById("suggestions");

  inputSeguimiento.addEventListener("input", function () {
    const value = inputSeguimiento.value;
    const caretPosition = inputSeguimiento.selectionStart;

    // Encontrar la Ãºltima menciÃ³n en el texto (@nombre apellido)
    const mentions = twttr.txt.extractMentionsWithIndices(value);
    const currentMention = mentions.find(mention =>
      caretPosition > mention.indices[0] && caretPosition <= mention.indices[1]
    );

    if (currentMention) {
      const query = `${currentMention.screenName.toLowerCase()}`;
      const filteredUsers = getSuggestions({ input: query, users });

      if (filteredUsers.length > 0) {
        suggestions.innerHTML = filteredUsers
          .map(user => `<li>${user}</li>`)
          .join("");
        suggestions.style.display = "block";
      } else {
        suggestions.style.display = "none";
      }
    } else {
      suggestions.style.display = "none";
    }

    // Actualizar el atributo mentions eliminando menciones borradas
    updateMentions();
  });

  // FunciÃ³n para eliminar menciones borradas del atributo "mentions"
  function updateMentions() {
    const value = inputSeguimiento.value;
    let currentValue = inputSeguimiento.getAttribute("mentions");

    if (currentValue) {
      let mentionsList = currentValue.split("&");

      // Filtrar solo las menciones que todavÃ­a estÃ¡n en el texto
      mentionsList = mentionsList.filter(mention => value.includes(mention));

      // Actualizar el atributo
      inputSeguimiento.setAttribute("mentions", mentionsList.join("&"));
    }
  }

  // Manejar clic en la sugerencia
  suggestions.addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
      const mention = e.target.textContent;
      const value = inputSeguimiento.value;

      // Reemplazar la menciÃ³n actual con la seleccionada
      const mentions = twttr.txt.extractMentionsWithIndices(value);
      const caretPosition = inputSeguimiento.selectionStart;
      const currentMention = mentions.find(mention =>
        caretPosition > mention.indices[0] && caretPosition <= mention.indices[1]
      );

      if (currentMention) {
        const before = value.slice(0, currentMention.indices[0]);
        const after = value.slice(currentMention.indices[1]);
        inputSeguimiento.value = `${before}${mention} ${after}`;

        let currentValue = inputSeguimiento.getAttribute("mentions");
        let valueList = currentValue ? currentValue.split("&") : [];

        // Agregar la nueva menciÃ³n si no estÃ¡ duplicada
        if (!valueList.includes(mention)) valueList.push(mention);

        // Actualizar el atributo "mentions"
        inputSeguimiento.setAttribute("mentions", valueList.join("&"));
        suggestions.style.display = "none";
      }

      // Sincronizar nuevamente para asegurarse de que todo estÃ¡ correcto
      updateMentions();
    }
  });


  // Hide suggestions on blur
  inputSeguimiento.addEventListener("blur", () => {
    setTimeout(() => suggestions.style.display = "none", 200);
  });

  $("#btn-ficha-documentos-adjuntos").on("click", function () {
    $("#modalDocumentosAdjuntos").modal("show")
  })

}

window.listenerAMC = listenerAMC;




