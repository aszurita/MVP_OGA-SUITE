/* js/Validador_Modelos/panel_validacion/initValidacionesPopup.js */
function initValidacionesPopupListener(){
  // ⬇️ usa el id REAL que está en tu <button>
  $(document).on("click", "#btnValidacionesInfo", mostrarModalValidaciones);
}
$(document).ready(initValidacionesPopupListener);
