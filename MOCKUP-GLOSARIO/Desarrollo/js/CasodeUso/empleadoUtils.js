/**
 * @file Módulo de utilidades para la búsqueda y manejo de empleados.
 * @description Provee funciones para cargar, cachear y mostrar empleados en un typeahead.
 * @author Giancarlo Ortiz */

const EmpleadoUtils = {
  /** @type {any[] | null} */
  empleadosCache: null,

  /**
   * Carga la lista de empleados desde SharePoint (vía SPServices) una sola vez.
   * @returns {Promise<any[]>}
   */
  async loadEmpleadosOnce() {
    if (this.empleadosCache) return this.empleadosCache;

    return new Promise((resolve, reject) => {
      try {
        // Asume que getEmpleados() existe globalmente y es síncrona.
        const arr = getEmpleados();
        arr.sort((a, b) => (a.nombreCompleto || '').localeCompare(b.nombreCompleto || ''));
        this.empleadosCache = arr;
        resolve(this.empleadosCache);
      } catch (e) {
        console.error("Falló la llamada a getEmpleados()", e);
        reject(e);
      }
    });
  },

  /**
   * Filtra la lista de empleados cacheados por nombre, código o usuario.
   * @param {string} q - El término de búsqueda.
   * @param {any[]} list - La lista de empleados a filtrar.
   * @returns {any[]}
   */
  filterEmps(q, list) {
    const s = (q || '').trim().toLowerCase();
    if (!s) return list.slice(0, 40);
    return list.filter(e =>
      (e.nombreCompleto || '').toLowerCase().includes(s) ||
      String(e.codigo || '').includes(s) ||
      (e.usuario || '').toLowerCase().includes(s)
    ).slice(0, 40);
  },

  /**
   * Conecta la lógica de typeahead (autocompletado) a un input de empleado.
   * @param {string} inpId - ID del input de texto.
   * @param {string} sugId - ID del contenedor de sugerencias.
   * @param {string} hiddenId - ID del input oculto para el código.
   * @param {string} labelId - ID del elemento para mostrar el nombre seleccionado.
   */
  attachEmpleadoTypeahead(inpId, sugId, hiddenId, labelId) {
    const $inp = $('#' + inpId);
    const $sug = $('#' + sugId);
    const $hid = $('#' + hiddenId);
    const $lbl = $('#' + labelId);

    let idx = -1; // índice activo para navegación con teclado

    const render = (list) => {
      $sug.empty();
      if (!list.length) {
        $sug.addClass('d-none');
        return;
      }
      list.forEach((e) => {
        const $it = $('<div class="item">').text(e.nombreCompleto || '(sin nombre)');
        $it.on('mousedown', (ev) => { // mousedown para seleccionar antes de que el input pierda el foco
          ev.preventDefault();
          select(e);
        });
        $sug.append($it);
      });
      idx = -1;
      $sug.removeClass('d-none');
    };

    const select = (emp) => {
      $inp.val(emp.nombreCompleto || '');
      $hid.val(emp.codigo || '');
      $lbl.text(emp.nombreCompleto || '—');
      $sug.addClass('d-none').empty();
    };

    const onInput = async () => {
      const emps = await this.loadEmpleadosOnce();
      const q = $inp.val();
      render(this.filterEmps(q, emps));
    };

    $inp.off('.emp').on('input.emp focus.emp', onInput)
      .on('keydown.emp', async (e) => {
        const $items = $sug.children('.item');
        if (!$items.length) return;

        if (e.key === 'ArrowDown') { e.preventDefault(); idx = Math.min(idx + 1, $items.length - 1); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); idx = Math.max(idx - 1, 0); }
        else if (e.key === 'Enter') {
          e.preventDefault();
          if (idx >= 0) {
            const emps = await this.loadEmpleadosOnce();
            const list = this.filterEmps($inp.val(), emps);
            select(list[idx]);
          }
        } else if (e.key === 'Escape') { $sug.addClass('d-none'); }

        $items.removeClass('active').eq(idx).addClass('active').get(0)?.scrollIntoView({ block: 'nearest' });
      });

    // Cierra las sugerencias si se hace clic fuera
    $(document).off('mousedown.emp_' + inpId).on('mousedown.emp_' + inpId, (ev) => {
      if (!$(ev.target).closest('#' + inpId + ', #' + sugId).length) {
        $sug.addClass('d-none');
      }
    });
  },
};
