/**
 * @file Módulo de utilidades para la gestión de selectores de fuentes de datos.
 * @description Provee una clase para manejar los selectores en cascada (servidor, base, etc.).
 * @author Giancarlo Ortiz */

// Ajusta el ancho de un <select> (y su contenedor select2) al texto.
function fitSelectAutoWidth(select, opts = {}) {
  if (!select) return;
  const min = Number(select.dataset.minWidth || opts.min) || 140;
  const max = Number(select.dataset.maxWidth || opts.max) || 520;
  const basePad = Number(select.dataset.extraPad || opts.pad) || 50;
  const padSelected = Number(select.dataset.extraPadSelected || opts.padSelected) || 60;
  const padMax = Number(select.dataset.extraPadMax || opts.padMax) || basePad;
  const mode = opts.mode || select.dataset.fitMode || 'selected'; // 'selected' | 'max'
  const options = Array.from(select.options || []);

  const span = document.createElement('span');
  span.style.position = 'absolute';
  span.style.visibility = 'hidden';
  span.style.whiteSpace = 'pre';
  const cs = window.getComputedStyle(select);
  span.style.font = cs.font;
  span.style.fontSize = cs.fontSize;
  span.style.fontFamily = cs.fontFamily;
  span.style.fontWeight = cs.fontWeight;
  document.body.appendChild(span);
  const measure = (text) => {
    span.textContent = text || '';
    return span.getBoundingClientRect().width;
  };
  let target = 0;
  if (mode === 'max') {
    options.forEach(opt => { target = Math.max(target, measure(opt ? opt.text : '')); });
  } else {
    const opt = select.options[select.selectedIndex];
    target = measure(opt ? opt.text : '');
  }
  const pad = mode === 'max' ? padMax : padSelected;
  const width = Math.min(Math.max(target + pad, min), max);
  span.remove();

  select.style.width = `${width}px`;
  const $select = window.jQuery ? window.jQuery(select) : null;
  const $s2 = $select ? $select.next('.select2') : null;
  if ($s2 && $s2.length) {
    $s2.css('width', `${width}px`);
    $s2.find('.select2-selection').css('width', `${width}px`);
  }
}

/**
 * Autocompletado de fuentes basado en texto libre (Servidor.Base.Esquema.Tabla).
 * Realiza la busqueda contra LOG_ENTIDADES_OFICIAL cuando hay al menos 4 caracteres.
 */
class FuenteTypeahead {
  constructor(elements, onAddFuente, options = {}) {
    this.elements = elements;
    this.onAddFuente = onAddFuente;
    this.options = options || {};
    this.autoAddOnSelect = !!options.autoAddOnSelect;
    this.onSelect = options.onSelect || null;
    const apiSvc = (typeof ApiService !== 'undefined') ? ApiService : null;
    this.api = window.ApiService || apiSvc || window.__apiManager;
    this.minChars = Number(elements?.input?.data('minChars')) || 4;
    this.debounceMs = 320;
    this.queryToken = 0;
    this.lastResults = [];
    this.bindEvents();
  }

  bindEvents() {
    const { input, btnAdd } = this.elements;
    if (!input || !input.length) return;

    input.on('input.fuente', () => this.handleInput());
    input.on('focus.fuente', () => this.handleInput());
    input.on('keydown.fuente', (e) => this.handleKeydown(e));

    if (btnAdd && btnAdd.length) {
      btnAdd.on('click.fuente', () => this.handleAdd());
    }

    const ns = '.fuente-' + (input.attr('id') || Math.random().toString(36).slice(2));
    $(document).off('mousedown' + ns).on('mousedown' + ns, (ev) => {
      if (!$(ev.target).closest(input).length && !$(ev.target).closest(this.elements.suggestions).length) {
        this.clearSuggestions();
      }
    });
  }

  handleInput() {
    clearTimeout(this._timer);
    const term = (this.elements.input.val() || '').trim();
    if (!term || term.length < this.minChars) {
      this.clearSuggestions();
      return;
    }
    this._timer = setTimeout(() => this.search(term), this.debounceMs);
  }

  async search(term) {
    const token = ++this.queryToken;
    const safe = term.replace(/'/g, "''").toUpperCase();
    this.renderMessage('Buscando...');
    if (!this.api || typeof this.api.query !== 'function') {
      this.renderMessage('No hay servicio de busqueda disponible.');
      return;
    }
    try {
      const rows = await this.api.query({
        campos: "distinct SERVIDOR+'.'+CATALOGO+'.'+ESQUEMA_TABLA+'.'+NOMBRE_TABLA NOMBRE_TABLA",
        origen: "LOG_ENTIDADES_OFICIAL",
        condicion: `UPPER(SERVIDOR+'.'+CATALOGO+'.'+ESQUEMA_TABLA+'.'+NOMBRE_TABLA) LIKE '%${safe}%'`
      });
      if (token !== this.queryToken) return; // Descarta respuestas viejas
      const options = Array.from(new Set((rows || [])
        .map(r => (r?.NOMBRE_TABLA || '').trim())
        .filter(Boolean)))
        .slice(0, 50);
      this.lastResults = options;
      if (!options.length) {
        this.renderMessage('Sin coincidencias.');
        return;
      }
      this.renderSuggestions(options);
    } catch (error) {
      console.error('Error cargando sugerencias de fuentes:', error);
      this.renderMessage('No se pudo cargar sugerencias.');
    }
  }

  handleKeydown(e) {
    const items = this.elements.suggestions?.children('.item');
    if (e.key === 'Enter') {
      e.preventDefault();
      if (items && items.length && this._activeIndex >= 0) {
        const val = $(items[this._activeIndex]).data('val');
        this.select(val);
      } else {
        this.handleAdd();
      }
      return;
    }
    if (!items || !items.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const current = Number.isInteger(this._activeIndex) ? this._activeIndex : -1;
      this._activeIndex = Math.min(current + 1, items.length - 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const current = Number.isInteger(this._activeIndex) ? this._activeIndex : items.length;
      this._activeIndex = Math.max(current - 1, 0);
    } else {
      return;
    }
    items.removeClass('active');
    $(items[this._activeIndex]).addClass('active')[0]?.scrollIntoView({ block: 'nearest' });
  }

  handleAdd() {
    const raw = (this.elements.input.val() || '').trim();
    if (!raw || raw.length < this.minChars) {
      alert(`Escribe al menos ${this.minChars} caracteres para buscar la fuente.`);
      return;
    }
    if ((raw.match(/\./g) || []).length < 3) {
      alert('Usa el formato Servidor.Base.Esquema.Tabla.');
      return;
    }
    this.select(raw, { forceAdd: true });
  }

  select(value, { forceAdd = false } = {}) {
    if (!value) return;
    const shouldAdd = forceAdd || this.autoAddOnSelect;
    if (shouldAdd && this.onAddFuente) {
      this.onAddFuente(value);
      this.elements.input.val('');
    } else {
      if (this.onSelect) this.onSelect(value);
      this.elements.input.val(value);
    }
    this.clearSuggestions();
  }

  renderSuggestions(list) {
    const { suggestions } = this.elements;
    if (!suggestions || !suggestions.length) return;
    suggestions.empty();
    this._activeIndex = -1;
    list.forEach(val => {
      const $it = $('<div class="item">').text(val).attr('data-val', val);
      $it.on('mousedown', (ev) => { ev.preventDefault(); this.select(val); });
      suggestions.append($it);
    });
    suggestions.removeClass('d-none');
  }

  renderMessage(msg) {
    const { suggestions } = this.elements;
    if (!suggestions || !suggestions.length) return;
    suggestions.empty().append($('<div class="item text-semi-muted">').text(msg));
    suggestions.removeClass('d-none');
  }

  clearSuggestions() {
    const { suggestions } = this.elements;
    this._activeIndex = -1;
    suggestions?.addClass('d-none').empty();
  }

  reset() {
    if (this.elements?.input) this.elements.input.val('');
    this.clearSuggestions();
  }
}

window.FuenteTypeahead = FuenteTypeahead;
window.fitSelectAutoWidth = fitSelectAutoWidth;

class FuentesManager {
  /**
   * @param {object} elements - Un objeto con los elementos jQuery de los selectores.
   * @param {jQuery} elements.servidor
   * @param {jQuery} elements.base
   * @param {jQuery} elements.esquema
   * @param {jQuery} elements.tabla
   * @param {jQuery} elements.btnAdd
   * @param {Function} onAddFuente - Callback que se ejecuta al agregar una fuente.
   */
  constructor(elements, onAddFuente) {
    this.elements = elements;
    this.onAddFuente = onAddFuente;
    this.api = window.__apiManager || new ApiManager();
    this.suppressCascade = false;
    this.bindEvents();
    this.initSelect2();
  }

  initSelect2() {
    const { servidor, base, esquema, tabla } = this.elements;
    // Encuentra el modal padre de los selectores
    const $modal = servidor.closest('.modal');

    [servidor, base, esquema, tabla].forEach($el => {
      if ($el.data('select2')) return; // Evitar reinicialización
      $el.select2({
        theme: 'bootstrap',
        dropdownParent: $modal.length ? $modal : $('body')
      });
      if (typeof window.fitSelectAutoWidth === 'function') {
        // Ajusta después de que select2 calcule su contenedor
        setTimeout(() => window.fitSelectAutoWidth($el[0]), 0);
      }
      // Ancho máximo al abrir, seleccionado al cerrar
      $el.on('select2:open', () => fitSelectAutoWidth($el[0], { mode: 'max' }));
      $el.on('select2:close', () => fitSelectAutoWidth($el[0], { mode: 'selected' }));
    });
  }

  bindEvents() {
    const { servidor, base, esquema, tabla, btnAdd } = this.elements;
    servidor.on('change', () => { if (this.suppressCascade) return; this.loadDatabases(); });
    base.on('change', () => { if (this.suppressCascade) return; this.loadSchemas(); });
    esquema.on('change', () => { if (this.suppressCascade) return; this.loadTables(); });
    if (btnAdd && btnAdd.length) {
      btnAdd.off('click.fuentesManager').on('click.fuentesManager', () => this.addFuente());
    }
    // También permite agregar con "Enter" en la tabla
    tabla.on('keydown.fuentesManager', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.addFuente();
      }
    });

    // Ajuste dinámico de ancho según la opción seleccionada
    [servidor, base, esquema, tabla].forEach($el => {
      $el.on('change.autofit', () => fitSelectAutoWidth($el[0], { mode: 'selected' }));
    });
  }

  addFuente() {
    const { servidor, base, esquema, tabla } = this.elements;
    const s = servidor.val(), d = base.val(), sc = esquema.val(), t = tabla.val();
    if (!s || !d || !sc || !t) {
      alert('Selecciona Servidor, Base, Esquema y Tabla.');
      return;
    }
    const clave = `${s}.${d}.${sc}.${t}`;
    if (this.onAddFuente) {
      this.onAddFuente(clave);
    }
    tabla.focus();
  }

  async loadServers() {
    if (this.suppressCascade) return;
    const { servidor } = this.elements;
    this.setLoading(servidor, true);
    try {
      const res = await this.api.getServers();
      const servers = Array.from(new Set(res)).sort();
      this.fillOptions(servidor, servers);
    } catch (e) {
      console.error('Error cargando servidores:', e);
      this.fillOptions(servidor, []);
    } finally {
      this.setLoading(servidor, false);
      this.resetDownstream(1);
    }
  }

  async loadDatabases() {
    if (this.suppressCascade) return;
    const { servidor, base } = this.elements;
    const serverName = servidor.val();
    this.resetDownstream(1);
    if (!serverName) return;
    this.setLoading(base, true);
    try {
      const res = await this.api.getDatabases(serverName);
      this.fillOptions(base, Array.from(new Set(res)).sort());
    } catch (e) { console.error('Error cargando bases de datos:', e); }
    finally { this.setLoading(base, false); }
  }

  async loadSchemas() {
    if (this.suppressCascade) return;
    const { servidor, base, esquema } = this.elements;
    this.resetDownstream(2);
    if (!servidor.val() || !base.val()) return;
    this.setLoading(esquema, true);
    try {
      const res = await this.api.getSchemas(servidor.val(), base.val());
      this.fillOptions(esquema, Array.from(new Set(res)).sort());
    } catch (e) { console.error('Error cargando esquemas:', e); }
    finally { this.setLoading(esquema, false); }
  }

  async loadTables() {
    if (this.suppressCascade) return;
    const { servidor, base, esquema, tabla } = this.elements;
    this.resetDownstream(3);
    if (!servidor.val() || !base.val() || !esquema.val()) return;
    this.setLoading(tabla, true);
    try {
      const res = await this.api.getTables(servidor.val(), base.val(), esquema.val());
      this.fillOptions(tabla, Array.from(new Set(res)).sort());
    } catch (e) { console.error('Error cargando tablas:', e); }
    finally { this.setLoading(tabla, false); }
  }

  fillOptions($sel, items, placeholder = '-') {
    $sel.empty().append(new Option(placeholder, ''));
    items.forEach(x => $sel.append(new Option(x, x)));
    if (typeof window.fitSelectAutoWidth === 'function') {
      window.fitSelectAutoWidth($sel[0]);
    }
  }

  setLoading($sel, loading, label = 'Cargando...') {
    $sel.prop('disabled', loading);
    if (loading) this.fillOptions($sel, [], label);
  }

  resetDownstream(from) {
    const { base, esquema, tabla } = this.elements;
    if (from <= 1) { this.setLoading(base, true, '—'); }
    if (from <= 2) { this.setLoading(esquema, true, '—'); }
    if (from <= 3) { this.setLoading(tabla, true, '—'); }
  }
}
