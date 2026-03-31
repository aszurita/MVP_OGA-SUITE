/* js/Validador_Modelos/panel_validacion/estilosTablaValidaciones.js
   -----------------------------------------------------------------
   Inyecta el “look” magenta cuando aún no existe.                   */
function asegurarEstilosTablaValidaciones(){

  if (document.getElementById("cssTablaValidaciones")) return;   // ya está

  const css = `
    .tabla-validaciones thead th{
      background:#D2006E!important;color:#fff!important;border-color:#D2006E!important
    }
    .tabla-validaciones tbody td{
      vertical-align:middle;border-top:1px solid #e6e6e6
    }`;
  const tag = document.createElement("style");
  tag.id = "cssTablaValidaciones";
  tag.textContent = css;
  document.head.appendChild(tag);
}
