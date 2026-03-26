/**
 * Genera el HTML de todas las preguntas de un parámetro.
 * @param {Object}  param              Objeto parámetro (con su array preguntas)
 * @param {string}  subId
 * @param {string}  paramId
 * @param {string}  seccionFiltrada
 * @param {boolean} esBloqueada        ← NUEVO (por defecto lee la global)
 */
function crearPreguntasHtml(
  param,
  subId,
  paramId,
  seccionFiltrada) {

  return param.preguntas.map((preg, idx) => {


    /* ── IDs únicos ───────────────────────────────────────── */
    const completadoId = `completado-${subId}-${paramId}-${idx}`;
    const tooltipId = `tooltip-${subId}-${paramId}-${idx}`;
    const switchId = `switch-${subId}-${paramId}-${idx}`;

    /* ── Estado inicial ───────────────────────────────────── */
    const porcentaje = preg.porcentajeCompletado || 0;
    const aplicaChecked = preg.aplica === 1 ? "checked" : "";

    /* 🔒 Deshabilitación centralizada */
    const sliderDisabled = (preg.aplica === 0 || window.esValidacionBloqueada) ? "disabled" : "";
    const sliderFilter = (preg.aplica === 0 || window.esValidacionBloqueada) ? "grayscale(100%)" : "none";
    const switchDisabled = window.esValidacionBloqueada ? "disabled" : "";

    return `
<div class="d-flex flex-wrap align-items-center justify-content-between mb-2"
     style="border-bottom: 1px solid #eaeaea; padding-bottom: 10px;">

  <!-- Pregunta ------------------------------------------------------- -->
  <h6 class="mb-0" style="flex: 2 1 45%; margin-right: 15px; color:#000;">
    ${preg.texto}
  </h6>

  <!-- Slider --------------------------------------------------------- -->
  <div class="d-flex align-items-center" style="flex: 1 1 30%; position: relative;">
    <label for="${completadoId}" class="mr-2 mb-0"><strong>Completado:</strong></label>
    <input  id="${completadoId}"  type="range"
            min="0" max="100" step="1"
            class="form-control-range completado-slider"
            value="${porcentaje}"
            ${sliderDisabled}
            oninput="
              const tooltip = document.getElementById('${tooltipId}');
              tooltip.innerText = this.value + '%';
              const percentage  = parseInt(this.value, 10);
              tooltip.style.left = 'calc(' + this.offsetWidth * percentage / 100 + 'px)';
              actualizarDataMapFromSlider(
                '${seccionFiltrada}','${subId}','${paramId}',${idx},this.value,'${switchId}'
              );
            "
            style="accent-color:#D2006E; width:60%; margin-right:10px; filter:${sliderFilter};">
    <div id="${tooltipId}"
         style="position:absolute; top:18px; background:#fff; color:#D2006E;
                padding:0 4px; border-radius:8px; font-size:12px;
                transform:translateX(-50%); margin-left:85px;
                font-weight:700; border:1px solid #D2006E;">
      ${porcentaje}%
    </div>
  </div>

  <!-- Switch --------------------------------------------------------- -->
  <div class="d-flex align-items-center" style="flex: 1 1 15%;">
  <label class="mr-2 mb-0"><strong>Aplica:</strong></label>

  <div class="custom-switch custom-switch-secondary">
    <!-- checkbox -->
    <input  class="custom-switch-input"
            id="${switchId}"
            type="checkbox"
            ${aplicaChecked} ${switchDisabled}
            onchange="if (this.disabled) return;
              const slider  = document.getElementById('${completadoId}');
              const tooltip = document.getElementById('${tooltipId}');
              const label   = this.nextElementSibling;

              if (this.checked) {
                label.style.background = '#D2006E';
                label.style.borderColor = '#D2006E';
                slider.disabled = ${window.esValidacionBloqueada ? 'true' : 'false'};
                slider.style.filter = 'none';
                tooltip.style.background = '#fff';
                tooltip.style.color = '#D2006E';
                tooltip.style.border = '1px solid #D2006E';
              } else {
                label.style.background = '#ccc';
                label.style.borderColor = '#ccc';
                slider.disabled = true;
                slider.style.filter = 'grayscale(100%)';
                slider.value = 0;
                tooltip.innerText = '0%';
                tooltip.style.background = '#555';
                tooltip.style.color = '#eee';
                tooltip.style.left = 'calc(0)';
              }
              actualizarDataMapFromSwitch(
                '${seccionFiltrada}', '${subId}', '${paramId}', ${idx},
                this.checked, '${completadoId}', '${tooltipId}'
              );
            ">

    <!-- label / palanca -->
    <label class="custom-switch-btn" for="${switchId}"
           style="
             background:${preg.aplica === 1 ? '#D2006E' : '#ccc'};
             border-color:${preg.aplica === 1 ? '#D2006E' : '#ccc'};
             ${window.esValidacionBloqueada ? 'pointer-events:none; cursor:not-allowed;' : ''}
           ">
    </label>
  </div>
</div>
</div>`;
  }).join("");
}
