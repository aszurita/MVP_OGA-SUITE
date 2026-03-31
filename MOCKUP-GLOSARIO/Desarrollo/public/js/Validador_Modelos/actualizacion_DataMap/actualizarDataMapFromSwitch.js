// Función para actualizar el dataMap desde el switch de aplica
function actualizarDataMapFromSwitch(seccionFiltrada, subId, paramId, idx, switchState, completadoId, tooltipId) {
  const slider = document.getElementById(completadoId);
  const porcentajeCompletado = slider.value;
  // Llamamos a actualizarDataMap con el nuevo estado del switch y el porcentaje
  actualizarDataMap(porcentajeCompletado, switchState, seccionFiltrada, subId, paramId, idx);
}
