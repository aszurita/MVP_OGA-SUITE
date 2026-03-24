function actualizarDataMapFromSlider(seccionFiltrada, subId, paramId,
  idx, porcentajeCompletado, switchId) {
const switchState = document.getElementById(switchId).checked;
actualizarDataMap(porcentajeCompletado, switchState,
seccionFiltrada, subId, paramId, idx);

/* ⭐ mantiene el % que ve el usuario */
const tooltip = document.getElementById(`tooltip-${subId}-${paramId}-${idx}`);
if (tooltip) tooltip.innerText = `${porcentajeCompletado}%`;
}
