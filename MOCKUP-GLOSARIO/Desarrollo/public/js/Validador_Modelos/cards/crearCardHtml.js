/* ------------------------------------------------------------------
 * Tarjeta de sub-sección — botón global sin texto (solo icono)
 * ------------------------------------------------------------------ */
function crearCardHtml(
  sub,
  subId,
  collapseIdMain,
  parametrosHtml,
  seccionNombre
){
  const scoreId       = `score-collapse-main-${subId}`;
  const gSwId         = `sw-global-${collapseIdMain}`;
  const score         = (sub.subseccion_score ?? 0).toFixed(2);
  const toggleAllId   = `toggle-all-params-${subId}`;
  const secName       = sub.seccionNombre || seccionNombre;

  const swDisabled  = window.esValidacionBloqueada ? 'disabled' : '';
  const aplica = (isNuevaValidacion || sub.aplica === undefined || sub.aplica === null)
               ? true
               : sub.aplica;
  // console de sub.aplica y de aplica
  console.log(`Sub-aplica: ${sub.aplica}, Aplica: ${aplica}`);
  const swBgColor   = aplica ? '#D2006E' : '#ccc';
  const labelStyle  = window.esValidacionBloqueada
        ? 'pointer-events:none; cursor:not-allowed; background:#ccc; border-color:#ccc;'
        : `background:${swBgColor}; border-color:${swBgColor};`;

  return `
    <div class="card mb-4">
      <div class="card-header p-0">
        <!-- ⚡️ NUEVO CONTENEDOR A/B ------------------------------------------------ -->
        <div class="d-flex w-100">

          <!-- A ▸ 60 %: título que abre/cierra la sub-sección -->
          <div style="flex:0 0 60%;max-width:60%;min-width:0;">
            <button class="btn btn-link btn-block text-left"
                    type="button"
                    data-toggle="collapse"
                    data-target="#${collapseIdMain}"
                    aria-expanded="false"
                    aria-controls="${collapseIdMain}"
                    style="color:#D2006E;font-weight:600;font-size:17px;">
              ${sub.nombre}
              <i class="simple-icon-arrow-down"></i>
            </button>
          </div>

          <!-- B ▸ 40 % — botón global • switch • score -------------------------->
          <div class="d-flex align-items-center flex-wrap justify-content-end"
              style="flex:0 0 40%;max-width:40%;padding:10px;min-width:0;">

            <!-- Botón Des/Colapsar (circular) -->


            <button id="${toggleAllId}"
                    class="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center"
                    style="order:-1;width:34px;height:34px;padding:0;border-radius:17px;margin-right:44px;"
                    data-main="${collapseIdMain}"
                    data-state="collapsed"
                    title="Expandir todos los parámetros"
                    onclick="toggleAllParams('${subId}')"
                    type="button">
              <i class="simple-icon-arrow-down" style="transition:.2s;"></i>
            </button>

            <!-- Switch maestro -->
            <div class="custom-control custom-switch switch-lg"
                title="Aplica toda la sub-sección"
                style="margin-right:8px;">              <!-- separa del score -->
              <input  type="checkbox"
                      class="custom-control-input sw-aplica-sub"
                      id="${gSwId}"
                      data-seccion="${secName}"
                      data-subid="${subId}"
                      ${aplica ? 'checked' : ''}
                      ${window.esValidacionBloqueada ? 'disabled' : ''}>
              <label class="custom-control-label"
                    for="${gSwId}"
                    style="${window.esValidacionBloqueada
                            ? 'pointer-events:none;cursor:not-allowed;background:#ccc;border-color:#ccc;'
                            : `background:${aplica ? '#D2006E' : '#ccc'};border-color:${aplica ? '#D2006E' : '#ccc'};`}">
              </label>
            </div>

            <!-- Score -->
            <span style="font-size:1.2rem;color:#000;">
              <strong>Score:</strong>
              <span id="score-collapse-main-${subId}">${score}</span>%
            </span>
          </div>





        </div>
      </div>


      <!-- Contenido colapsable -->
      <div id="${collapseIdMain}" class="collapse">
        <div class="card-body">${parametrosHtml}</div>
      </div>
    </div>`;
}

/* ------------------------------------------------------------------
 * Abre / cierra tarjeta + parámetros; controla icono y estado
 * ------------------------------------------------------------------ */
function toggleAllParams(subId){
  const btn          = document.getElementById(`toggle-all-params-${subId}`);
  if(!btn) return;

  const mainCollapse = document.getElementById(btn.dataset.main);
  if(!mainCollapse) return;

  const isCollapsed  = btn.dataset.state === 'collapsed';

  /* mostrar / ocultar tarjeta y sub-collapses */
  $(mainCollapse).collapse(isCollapsed ? 'show' : 'hide');
  mainCollapse.querySelectorAll('.collapse').forEach(c=>{
    if(c!==mainCollapse) $(c).collapse(isCollapsed ? 'show' : 'hide');
  });

  /* rotar icono */
  const icon = btn.querySelector('.simple-icon-arrow-down');
  icon.style.transform = isCollapsed ? 'rotate(-180deg)' : 'rotate(0deg)';

  /* guardar nuevo estado */
  btn.dataset.state = isCollapsed ? 'expanded' : 'collapsed';
}

/* ------------------------------------------------------------------ */
function actualizarScoreSubseccionEnDOM(seccion, subId){
  const sub = dataMapGlobal[seccion]?.[subId];
  if(!sub) return;
  const lbl = document.getElementById(`score-collapse-main-${subId}`);
  if(lbl) lbl.textContent = sub.subseccion_score.toFixed(2);
}
