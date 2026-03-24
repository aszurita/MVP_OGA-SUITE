function crearParametrosHtml(sub, subId, seccionFiltrada, esBloqueada ) {
  const parametros = sub.parametros || {};
  return Object.entries(parametros).map(([paramId, param]) => {
    const collapseId = `collapse-${subId}-${paramId}`;
    const preguntasHtml = crearPreguntasHtml(param, subId, paramId, seccionFiltrada, esBloqueada);

    return `
      <div class="border border-card mb-2">
        <button class="btn btn-link collapsed d-flex justify-content-between align-items-center w-100"
                type="button"
                data-toggle="collapse"
                data-target="#${collapseId}"
                aria-expanded="false"
                aria-controls="${collapseId}"
                onclick="setTimeout(() => updateToggleButtonState('${subId}'), 350)">
          <p class="mb-0" style="font-size: 1.2rem; color: #D2006E;">${param.nombre}</p>
          <i class="simple-icon-arrow-down"></i>
        </button>
        <div id="${collapseId}" class="collapse">
          <div class="card-body p-2">${preguntasHtml}</div>
        </div>
      </div>`;
  }).join("");
}


function updateToggleButtonState(subId) {
  const button = document.getElementById(`toggle-all-params-${subId}`);
  if (button) {
    const mainCollapse = button.closest('.collapse');
    const visibleParams = mainCollapse.querySelectorAll('.collapse.show').length - 1; // -1 para excluir el principal
    
    if (visibleParams === 0) {
      button.textContent = 'Descolapsar todos';
    } else {
      const totalParams = mainCollapse.querySelectorAll('.collapse').length - 1;
      if (visibleParams === totalParams) {
        button.textContent = 'Colapsar todos';
      }
    }
  }
}