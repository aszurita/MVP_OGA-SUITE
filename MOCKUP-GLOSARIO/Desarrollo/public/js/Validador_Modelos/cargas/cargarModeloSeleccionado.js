/* -------------------------------------------------
 *  Carga el modelo elegido desde el combo.
 * -------------------------------------------------*/
function cargarModeloSeleccionado (codigoModelo, esBloqueada, idValidacion){

  if (!codigoModelo){
    showNotification("top","center","danger",
      "Seleccione un modelo antes de continuar.", 2000);
    return;
  }
  console.log("Cargando modelo:", codigoModelo, "idValidacion:", idValidacion, "es Bloqueado:", esBloqueada);
  /* Reset memoria */
  seccionActual = null;
  cabeceraObservaciones = {};
  draftObservaciones    = {};
  window.modeloTieneCabecera = false;

  /* Reset UI */
  $(".seccion-item").removeClass("selected");
  $("#subcards-container").empty();
  $("#score-final-label").text("0.00%");
  $("#card-observaciones").hide();
  $("#txtObservaciones").val("");
  actualizarTextoBotonGuardar(false);

  bloquearSeccionesPrincipales();
  mostrarInformacionModelo(codigoModelo);

  /* Pipeline */
  cargarPlantillaCompleta(() => {

    cargarValoresPrevios(codigoModelo, idValidacion, () => {

      desbloquearSecciones();
      $("#card-observaciones").show();

      /* Ajusta switches con el mapa ya cargado */
      sincronizarSwitchesMaestros();

      /* Render de la primera sección */
      $(".seccion-item").first().trigger("click");
    });

  });

  /* Bloquea la UI si es una validación bloqueada */
  if (esBloqueada) {
    console.log("Bloqueando UI")
    bloquearSlidersYSwitches();
    //$("#btnBloquearValidacion").prop("disabled", true);
    //$("#btnDescartarCambios").prop("disabled", true);
    //$("#guardarValidacionBtn").prop("disabled", true);
  } else {
    console.log("Validación abierta, UI desbloqueada")

  }

}
