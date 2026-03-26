/**
 * Módulo de gestión de Cytoscape para el sistema de Linaje
 * Maneja toda la lógica del grafo visual
 */

class CytoscapeManager {
  constructor() {
    this.cy = null;
    this.idCounter = 0;
    this.nodoPadreId = "padre";
    this.sourcePort = null;
    this.selectedEdge = null;
    this.entidadBaseId = '';
    this.entidadContext = null;
    this.snapshotLoaded = false;
    this.nodeTypes = ConfigUtils.getNodeTypes();
    this.graphConfig = ConfigUtils.getGraphConfig();
    this.defaultNodeIcon = (ConfigUtils.getDefaultNodeIcon && ConfigUtils.getDefaultNodeIcon()) || '🧩';

    this.undoStack = [];
    this.maxUndoStack = 20;
    this.init();
  }

  getTypeMetadata(tipo) {
    const raw = (tipo ?? '').toString().trim();
    const normalizeFn = (typeof ConfigUtils !== 'undefined' && typeof ConfigUtils.normalizeNodeType === 'function')
      ? ConfigUtils.normalizeNodeType
      : null;
    const normalized = normalizeFn ? normalizeFn(raw) : raw.toLowerCase();

    if (normalized && this.nodeTypes?.[normalized]) {
      const def = this.nodeTypes[normalized];
      return {
        raw,
        key: normalized,
        name: def.name,
        icon: def.icon,
        isKnown: true
      };
    }

    const fallbackKey = raw ? raw.toLowerCase() : '';
    return {
      raw,
      key: fallbackKey,
      name: raw || 'Nodo',
      icon: null,
      isKnown: false
    };
  }

  deleteSelectedNode() {
    if (!this.cy) return;

    const selNodes = this.cy.$('node:selected, node.selected');
    const selEdges = this.cy.$('edge:selected, edge.selected');

    // Permitir borrar aristas seleccionadas
    if (selEdges.length) {
      this.saveState();
      this.cy.remove(selEdges);
      this.selectedEdge = null;
    }

    if (!selNodes.length) {
      if (selEdges.length) { // ya borramos edges; refrescamos layout/json y salimos
        this.applyHorizontalLayout();
        this.updateJSON();
      } else {
        this.notify('Selecciona un nodo SIN conexiones para eliminarlo.', 'error');
      }
      return;
    }

    // Regla: sólo nodos sin conexiones (grado 0)
    const deletable = selNodes.filter(n => n.connectedEdges().length === 0);
    const blocked = selNodes.filter(n => n.connectedEdges().length > 0);

    if (blocked.length) {
      const names = blocked.map(n => n.data('label') || n.id()).slice(0, 5).join(', ');
      this.notify(`No puedes eliminar nodos con conexiones. Desconectalos primero: ${names}${blocked.length > 5 ? '...' : ''}`, 'error');
    }

    if (deletable.length) {
      this.saveState();
      this.cy.remove(deletable);
    }

    // Limpieza mínima de estados internos
    if (this.sourcePort) {
      this.sourcePort.removeClass('selected');
      this.sourcePort = null;
    }

    if (selEdges.length || deletable.length) {
      this.applyHorizontalLayout();
      this.updateJSON();
    }
  }

  duplicateSelectedNode() {
    if (!this.cy) return;

    // Tomar el primer nodo seleccionado
    const sel = this.cy.$('node:selected, node.selected');
    if (!sel || sel.length === 0) {
      this.notify('Selecciona un nodo para duplicar.', 'error');
      return;
    }

    const node = sel[0];

    // Evitar duplicar el nodo padre (si no quieres permitirlo)
    if (node.id() === this.nodoPadreId) {
      this.notify('No se puede duplicar el nodo padre.', 'error');
      return;
    }

    // Clonar los datos del nodo (sin hijos: no copiamos edges)
    const originalData = { ...(node.data() || {}) };

    // Limpiar campos internos/derivados
    delete originalData.id;
    delete originalData.esPadre; // por si acaso

    // Asignar nuevo id incremental manteniendo el tipo
    const tipoMeta = this.getTypeMetadata(originalData.tipo);
    const normalizedTipo = tipoMeta.key || (originalData.tipo || '').toString().trim().toLowerCase() || 'otros';
    const icon = tipoMeta.icon || originalData.icon || this.defaultNodeIcon;
    const newId = (normalizedTipo || 'n') + (this.idCounter++);

    const newData = {
      ...originalData,
      id: newId,
      tipo: normalizedTipo,
      icon
    };

    // Posicionar al lado del original con un pequeño offset
    const p = node.position();
    this.saveState();
    const nuevo = this.cy.add({
      data: newData,
      position: { x: p.x + 40, y: p.y + 40 }
    });

    // Opcional: seleccionar el nuevo y deseleccionar el original
    node.unselect();
    nuevo.select();

    // Mantener layout/JSON al día
    this.applyHorizontalLayout();
    this.updateJSON();
  }


  /**
   * Inicializa Cytoscape
   */
  init() {
    this.cy = cytoscape({
      container: document.getElementById('cy'),
      style: this.getNodeStyles(),
      layout: {
        name: 'preset'
      },
      // Configuración de zoom
      minZoom: 0.2,
      maxZoom: 3,
      zoomingEnabled: true,
      userZoomingEnabled: true,
      wheelSensitivity: 0.3 // Valor más bajo = zoom más suave (0.1-1.0)
    });

    this.mountTooltip();        // monta el tooltip en <body>
    //this.bindTooltipEvents();   // engancha mouseover/mouseout/pan/zoom
    this.setupEventListeners();
    this.setupTooltipHoverDelay();

  }

  // Cantidad típica que cabe con font-size 10 y width ~160px
  MAX_LABEL_CHARS = 15;  // ajusta según ancho/tamaño de fuente

  truncateGraphemes(str, max = this.MAX_LABEL_CHARS) {
    if (!str) return '';
    try {
      const seg = new Intl.Segmenter('es', { granularity: 'grapheme' });
      const g = [...seg.segment(String(str))].map(s => s.segment);
      return g.length <= max ? str : g.slice(0, max - 1).join('') + '…';
    } catch {
      const s = String(str);
      return s.length <= max ? s : s.slice(0, max - 1) + '…';
    }
  }
  /**
   * Obtiene estilos para nodos y aristas
   */
  getNodeStyles() {
    return [
      {
        selector: 'node',
        style: {
          'label': ele => {
            const nombre = ele.data('nombre') || '';
            const tipo = ele.data('tipo') || '';
            const typeMeta = this.getTypeMetadata(tipo);
            const tipoNombre = typeMeta.name;
            const icon = ele.data('icon') || typeMeta.icon || this.defaultNodeIcon;

            const iconSafe = icon ? `${icon}\u00A0` : '';
            const short = this.truncateGraphemes(nombre, 30); // más texto visible
            return `${iconSafe}${tipoNombre}\n${short}`;
          },

          // Texto
          'text-wrap': 'wrap',
          'text-max-width': 90,
          'text-valign': 'center',
          'text-halign': 'center',
          'font-family': 'system-ui, "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", "Segoe UI Symbol", sans-serif',
          'font-size': 9,
          'min-zoomed-font-size': 8,
          'color': '#160F41',

          // Nodo (más compacto)
          'shape': 'roundrectangle',
          'background-color': 'rgba(255,255,255,0.95)',
          'border-color': '#D2006E',
          'border-width': 1,
          'width': 170,                 // antes 160
          'height': 40,

          'box-shadow': '0 4px 12px rgba(233, 30, 99, 0.2)',
          'transition-property': 'background-color, border-color, box-shadow',
          'transition-duration': '0.3s'
        }

      },
      {
        selector: 'node[id = "padre"]',
        style: {
          'background-color': '#2596be',
          'border-color': '#2596be',
          'color': '#ffffff',
          'text-outline-width': 0,
          'text-wrap': 'wrap',
          'text-max-width': 90,
          'font-size': 8,
          'font-weight': 'bold',
          'width': 150,
          'height': 40,
          'label': ele => {
            const nombre = ele.data('nombre') || '';
            const tipo = ele.data('tipo') || '';
            const typeMeta = this.getTypeMetadata(tipo);
            const tipoNombre = (typeMeta.name || '').toUpperCase();
            const icon = ele.data('icon') || typeMeta.icon || this.defaultNodeIcon;
            const iconSafe = icon ? `${icon}\u00A0` : '';
            return `${iconSafe}${tipoNombre}\n${nombre}`;
          }
        }
      },
      {
        selector: 'node:selected',
        style: {
          'border-color': '#FF0066', // Magenta más intenso
          'border-width': 3, // Borde más grueso
          'background-color': '#fff6fa', // Fondo ligeramente rosado
          'box-shadow': '0 6px 20px rgba(233, 30, 99, 0.6)', // Sombra más intensa
          'color': '#880E4F', // Color de texto más oscuro
          'text-outline-color': '#ffffff', // Contorno blanco para el texto
          'text-outline-width': 1 // Grosor del contorno del texto
        }
      },
      {
        selector: 'node[id = "padre"]:selected',
        style: {
          'border-color': '#ffffff',
          'color': '#ffffff',
          'text-outline-width': 0
        }
      },
      {
        selector: 'node:hover',
        style: {
          'background-color': 'rgba(255,255,255,1)',
          'border-color': '#D2006E',
          'box-shadow': '0 6px 20px rgba(233, 30, 99, 0.3)'
        }
      },
      {
        selector: 'node[id = "padre"]:hover',
        style: {
          'background-color': '#d81b60',
          'border-color': '#ffffff'
        }
      },
      {
        selector: 'edge',
        style: {
          'curve-style': 'straight',
          'width': 2,
          'line-color': '#5C577A',
          'target-arrow-shape': 'triangle',
          'target-arrow-color': '#5C577A',
          'arrow-scale': 1.2,
          'opacity': 0.8,
          'transition-property': 'line-color, target-arrow-color',
          'transition-duration': '0.3s'
        }
      },
      {
        selector: 'edge:selected',
        style: {
          'line-color': '#FF0066', // Magenta más intenso
          'target-arrow-color': '#FF0066', // Magenta más intenso
          'width': 3, // Línea más gruesa
          'opacity': 1,
          'arrow-scale': 1.5, // Flecha más grande
          'line-style': 'solid' // Línea sólida
        }
      }
    ];
  }

  /**
   * Configura event listeners
   */
  setupEventListeners() {
    // Crear conexiones entre nodos
    this.cy.on('tap', 'node', (evt) => this.handleNodeTap(evt));

    // Seleccionar aristas
    this.cy.on('tap', 'edge', (evt) => this.handleEdgeTap(evt));

    // Deseleccionar al hacer clic en el fondo
    this.cy.on('tap', (evt) => this.handleBackgroundTap(evt));

    // Mostrar información en hover
    this.cy.on('mouseover', 'node', (evt) => this.handleNodeHover(evt));
    this.cy.on('mouseout', 'node', (evt) => this.handleNodeOut(evt));

    // Borrar elementos con Delete
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
  }

  /**
   * Maneja click en nodo
   */
  handleNodeTap(evt) {
    const node = evt.target;

    if (this.sourcePort && !this.cy.hasElementWithId(this.sourcePort.id())) {
      this.sourcePort = null;
      return;
    }

    if (this.sourcePort && this.sourcePort.id() === node.id()) {
      this.clearSelectedNodes(node);
      return;
    }

    if (!this.sourcePort) {
      this.sourcePort = node;
      node.addClass('selected');
    } else {
      const sourceId = this.sourcePort.id();
      const targetId = node.id();
      const existingEdge = this.cy.edges(`[source = "${sourceId}"][target = "${targetId}"]`);
      if (targetId === this.nodoPadreId && sourceId === this.nodoPadreId) {
        LinajeHelpers?.showToast?.('El nodo padre solo puede recibir conexiones.', 'info');
        this.clearSelectedNodes(node);
        return;
      }

      if (targetId === this.nodoPadreId && sourceId !== this.nodoPadreId) {
        // permitir conexión hacia el padre
      } else if (sourceId === this.nodoPadreId) {
        LinajeHelpers?.showToast?.('El nodo padre solo puede recibir conexiones.', 'info');
        this.clearSelectedNodes(node);
        return;
      }

      if (existingEdge.length > 0) {
        LinajeHelpers?.showToast?.('Ya existe una conexión entre esos nodos.', 'error');
        this.clearSelectedNodes(node);
        return;
      }

      if (sourceId !== targetId) {
        this.saveState();
        this.cy.add({ data: { source: sourceId, target: targetId } });
        this.applyHorizontalLayout();
        this.updateJSON();
      }
      this.clearSelectedNodes(node);
    }
  }

  clearSelectedNodes(targetNode) {
    if (this.sourcePort) {
      if (typeof this.sourcePort.unselect === 'function') {
        this.sourcePort.unselect();
      }
      this.sourcePort.removeClass('selected');
      this.sourcePort = null;
    }
    if (targetNode) {
      if (typeof targetNode.unselect === 'function') {
        targetNode.unselect();
      }
      targetNode.removeClass('selected');
    }

    // Cytoscape vuelve a aplicar la selecci��n despu��s del evento tap.
    // Aseguramos que no quede ning��n nodo con el pseudo estado `:selected`.
    requestAnimationFrame(() => {
      if (!this.sourcePort) {
        const residual = this.cy?.nodes(':selected');
        if (residual && residual.length) {
          residual.unselect();
        }
      }
    });
  }

  /**
   * Maneja click en arista
   */
  handleEdgeTap(evt) {
    const edge = evt.target;

    if (this.selectedEdge) {
      this.selectedEdge.removeClass('selected');
    }

    this.selectedEdge = edge;
    edge.addClass('selected');
  }

  mountTooltip() {
    if (!this.tooltipEl) {
      const el = document.createElement('div');
      el.id = 'informacionNodo';
      el.className = 'node-info';
      el.style.position = 'fixed';
      el.style.display = 'none';
      el.style.pointerEvents = 'auto';
      el.style.zIndex = '9999';
      document.body.appendChild(el);
      this.tooltipEl = el;
    }

    if (!this._expandedTipIds) this._expandedTipIds = new Set();

    // Delegación de clics en botones del tooltip (una sola vez)
    if (!this._tooltipClickBound) {
      this._tooltipClickBound = true;

      this.tooltipEl.addEventListener('click', (ev) => {
        const btn = ev.target.closest('[data-action]');
        if (!btn) return;

        const action = btn.getAttribute('data-action');
        const node = this._tipNode;
        if (!node || (typeof node.destroyed === 'function' && node.destroyed())) return;

        switch (action) {
          case 'toggle': {
            const id = node.id();
            const box = this.tooltipEl;
            const wasExpanded = this._expandedTipIds.has(id);

            // Guarda posición y tamaño previos para crecer hacia abajo
            const prevW = box.offsetWidth || 0;
            const prevLeft = parseFloat(box.style.left) || 0;
            const prevTop = parseFloat(box.style.top) || 0;
            const prevCenter = prevLeft + prevW / 2;

            if (wasExpanded) this._expandedTipIds.delete(id);
            else this._expandedTipIds.add(id);
            const nowExpanded = !wasExpanded;

            box.innerHTML = this.renderCompactTooltip(node);
            box.classList.toggle('is-expanded', nowExpanded);

            // Mide el nuevo ancho oculto para recentrar en X, manteniendo el mismo TOP
            const measure = (elem) => {
              const d = elem.style.display, v = elem.style.visibility;
              elem.style.visibility = 'hidden'; elem.style.display = 'block';
              const w = elem.offsetWidth || prevW;
              elem.style.display = d; elem.style.visibility = v;
              return w;
            };
            const newW = measure(box);
            const MARGIN = 8, vw = window.innerWidth;
            const newLeft = Math.min(Math.max(Math.round(prevCenter - newW / 2), MARGIN),
              vw - newW - MARGIN);

            // 👇 No tocamos el TOP: así el contenido aparece “hacia abajo” sobre el nodo
            box.style.left = `${newLeft}px`;
            box.style.top = `${Math.round(prevTop)}px`;

            // Reconfirma “TOP” y conserva el top previo (evita flip lateral)
            if (typeof this.placeTooltipSmart === 'function') {
              this.placeTooltipSmart(node, box, { lock: 'top', keepTop: true });
            }
            break;
          }


          case 'duplicate': {
            // Selecciona solo ese nodo y usa tu método existente
            this.cy.elements().unselect();
            node.select();
            if (typeof this.duplicateSelectedNode === 'function') {
              this.duplicateSelectedNode();
            }
            // Re-pinta el tooltip del original
            this.tooltipEl.innerHTML = this.renderCompactTooltip(node);
            if (typeof this.placeTooltipSmart === 'function') {
              this.placeTooltipSmart(node);
              requestAnimationFrame(() => this.placeTooltipSmart(node));
            }
            break;
          }

          case 'delete': {
            // Selecciona solo ese nodo y usa tu método existente
            this.cy.elements().unselect();
            node.select();
            if (typeof this.deleteSelectedNode === 'function') {
              this.deleteSelectedNode();
            }
            // Si el nodo ya no existe, oculta tooltip; si no, re-render
            if (!this.cy.hasElementWithId(node.id())) {
              this.tooltipEl.style.display = 'none';
              this._tipNode = null;
            } else {
              this.tooltipEl.innerHTML = this.renderCompactTooltip(node);
              if (typeof this.placeTooltipSmart === 'function') {
                this.placeTooltipSmart(node);
                requestAnimationFrame(() => this.placeTooltipSmart(node));
              }
            }
            break;
          }
        }
      });
    }
  }


  renderCompactTooltip(node) {
    const d0 = node.data() || {};
    const d = (d0.nodo && typeof d0.nodo === 'object') ? d0.nodo : d0;

    const tipo = (d.tipo || '').toString().trim();
    const typeMeta = this.getTypeMetadata(tipo);
    const tipoNombre = typeMeta.name;
    const emoji = d.icon || typeMeta.icon || this.defaultNodeIcon;
    const nombre = d.nombre || d.label || node.id() || '';
    const isExpanded = this._expandedTipIds?.has(node.id());

    const esc = (s) => String(s ?? '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

    // Origen “bonito” → ahora lo mostraremos en la cabecera
    const origenRaw = d.origen || d.origin || '';
    const origenPretty = origenRaw
      .replace(/\s*->\s*/g, ' -> ')
      .replace(/\./g, ' -> ');

    // Descripción (cuerpo)
    const desc = d.descripcion || d.description || '';

    // Campos (cuerpo)
    let camposArr = Array.isArray(d.campos) ? d.campos
      : (typeof d.campos === 'string'
        ? d.campos.split(/[\n,]/).map(x => x.trim()).filter(Boolean)
        : []);
    if (!camposArr.length && Array.isArray(d.fields)) camposArr = d.fields;

    // Detalle: ya NO incluye origen
    const detalleHTML = `
    ${desc ? `<div class="ni-text ni-desc">${esc(desc)}</div>` : ''}
    ${camposArr.length ? `<div class="ni-fields"><ul>${camposArr.map(c => `<li>${esc(c)}</li>`).join('')}</ul></div>` : ''}
  `;

    return `
        <div class="ni-wrap ni-rows">
          <!-- Cabecera: emoji + tipo + nombre + ORIGEN -->
          <div class="ni-row ni-row-head">
      <!-- Fila superior: emoji + meta (pegados) -->
      <div class="ni-head-top">
        <span class="ni-emoji">${esc(emoji)}</span>
        <div class="ni-meta">
          <div class="ni-type">${esc(tipoNombre)}</div>
          <div class="ni-title" title="${esc(nombre)}">${esc(nombre)}</div>
        </div>
      </div>

      <!-- Fila inferior: origen centrado y más juntito -->
      ${origenPretty ? `
        <div class="ni-head-bottom">
          <div class="ni-text ni-origen ni-origen-head" title="${esc(origenPretty)}">
            ${esc(origenPretty)}
          </div>
        </div>
      ` : ''}
    </div>


      <!-- Acciones -->
      <div class="ni-row ni-row-actions">
        <button class="btn-reveal" data-action="toggle"
                title="${isExpanded ? 'Ver menos' : 'Ver más'}"
                aria-label="${isExpanded ? 'Ver menos' : 'Ver más'}">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            ${isExpanded
        ? '<polyline points="18 15 12 9 6 15"></polyline>'
        : '<polyline points="6 9 12 15 18 9"></polyline>'}
          </svg>
          <span class="label">${isExpanded ? 'Ver menos' : 'Ver más'}</span>
        </button>

        <button class="btn-reveal" data-action="delete" title="Eliminar nodo seleccionado" aria-label="Eliminar nodo seleccionado">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
            <path d="M10 11v6"></path>
            <path d="M14 11v6"></path>
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
          </svg>
          <span class="label">Eliminar</span>
        </button>

        <button class="btn-reveal" data-action="duplicate" title="Duplicar nodo seleccionado" aria-label="Duplicar nodo seleccionado">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="9" y="9" width="10" height="10" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <span class="label">Duplicar</span>
        </button>
      </div>

      <!-- Detalle (discreto) -->
      <div class="ni-detail" style="${isExpanded ? '' : 'display:none'}">
        ${detalleHTML}
      </div>
    </div>
  `;
  }


  setupTooltipHoverDelay() {
    // ===== CONFIG =====
    this.hoverDelayMs = 700;      // 0.7 segundo de delay
    this._hoverTimer = null;
    this._hoverTargetId = null;
    this._hideTimer = null;
    this._tipNode = this._tipNode || null;

    // ===== HELPERS =====
    this.ensureTooltipBox = this.ensureTooltipBox || (() => {
      let box = document.getElementById('informacionNodo');
      if (!box) {
        box = document.createElement('div');
        box.id = 'informacionNodo';
        box.className = 'node-info';
        document.body.appendChild(box);
      }
      if (box.parentElement !== document.body) document.body.appendChild(box);
      return box;
    });

    this.showTooltip = this.showTooltip || ((node) => {
      const box = this.ensureTooltipBox();
      box.innerHTML = this.renderCompactTooltip(node);
      const expanded = this._expandedTipIds?.has(node.id());
      box.classList.toggle('is-expanded', !!expanded);

      box.style.display = 'block';
      box.style.visibility = 'hidden';
      box.classList.remove('is-hiding', 'is-visible');

      this._tipNode = node;
      if (typeof this.placeTooltipSmart === 'function') {
        this.placeTooltipSmart(node, box, { prefer: expanded ? 'bottom' : null }); // <- NUEVO
      }

      requestAnimationFrame(() => {
        box.style.visibility = '';
        box.classList.add('is-visible');
      });
    });


    this.hideTooltip = this.hideTooltip || (() => {
      clearTimeout(this._hoverTimer);
      this._hoverTimer = null;
      this._hoverTargetId = null;
      clearTimeout(this._hideTimer);        // <- añade esto
      this._hideTimer = null;

      const box = document.getElementById('informacionNodo');
      if (!box) { this._tipNode = null; return; }
      box.classList.remove('is-expanded');  // <- añade esto antes de ocultar

      // Suaviza salida
      box.classList.remove('is-visible');
      box.classList.add('is-hiding');

      const handleEnd = (e) => {
        if (e && e.target !== box) return;
        box.removeEventListener('transitionend', handleEnd);
        // Termina realmente de ocultar
        box.style.display = 'none';
        box.style.visibility = 'hidden';
        box.classList.remove('is-hiding');
      };

      // Espera la transición (fallback por si no dispara)
      box.addEventListener('transitionend', handleEnd);
      setTimeout(handleEnd, 240); // fallback seguro
      this._tipNode = null;
    });

    this.scheduleHover = this.scheduleHover || ((node) => {
      // Si ya está visible para este mismo nodo, no reprogrames
      if (this._tipNode && this._tipNode.id() === node.id()) return;

      clearTimeout(this._hoverTimer);
      this._hoverTargetId = node.id();
      this._hoverTimer = setTimeout(() => {
        if (this._hoverTargetId === node.id()) this.showTooltip(node);
      }, this.hoverDelayMs);
    });

    this.cancelHover = this.cancelHover || (() => {
      clearTimeout(this._hoverTimer);
      this._hoverTimer = null;
      this._hoverTargetId = null;
    });

    // ===== NO OCULTAR SI ENTRAS AL TOOLTIP =====
    (() => {
      const box = this.ensureTooltipBox();
      // Evita esconderlo si el mouse entra al propio tooltip
      box.addEventListener('mouseenter', () => {
        clearTimeout(this._hideTimer);
      });
      box.addEventListener('mouseleave', () => {
        clearTimeout(this._hideTimer);
        this._hideTimer = setTimeout(() => this.hideTooltip(), 120);
      });
    })();

    // ===== EVENTOS CYTOSCAPE =====
    const cy = this.cy || this.cytoscapeManager?.cy;
    if (!cy) return; // por si acaso
    const $container = cy.container();

    // Limpia listeners anteriores equivalentes para no duplicar
    cy.off('mouseover', 'node');
    cy.off('mouseout', 'node');
    cy.off('grab', 'node');
    cy.off('free', 'node');
    cy.off('pan');
    cy.off('zoom');
    cy.off('drag');

    const isTipVisible = () => {
      const box = document.getElementById('informacionNodo');
      return box && box.style.display !== 'none' && box.classList.contains('is-visible');
    };

    // Programar el timer al entrar
    cy.on('mouseover', 'node', (evt) => {
      if (evt.originalEvent && evt.originalEvent.defaultPrevented) return;
      const node = evt.target;

      // Cursor "mano"
      $container.style.cursor = 'pointer';

      // Cancelar hides pendientes
      clearTimeout(this._hideTimer);

      // Hot-switch: si ya hay tooltip y cambiamos de nodo, mostrar inmediato
      if (isTipVisible() && this._tipNode && this._tipNode.id() !== node.id()) {
        clearTimeout(this._hoverTimer);
        this._hoverTargetId = node.id();
        this._tipNode = node;          // asegúrate de trackear el nodo actual
        this.showTooltip(node);        // sin delay
        return;
      }
      // Caso normal (desde vacío): usar delay configurado
      this.scheduleHover(node);
    });

    // Cancelar al salir, y esconder con un mini delay
    cy.on('mouseout', 'node', () => {
      this.cancelHover();
      $container.style.cursor = '';    // volver a cursor por defecto
      clearTimeout(this._hideTimer);
      this._hideTimer = setTimeout(() => this.hideTooltip(), 120);
    });

    cy.on('grab', 'node', () => {
      this.saveState();
      $container.style.cursor = 'grabbing';
    });
    cy.on('free', 'node', () => { $container.style.cursor = ''; });

    // Si el usuario pan/zoom/drag: cancela y oculta
    cy.on('pan zoom drag', () => {
      this.cancelHover();
      this.hideTooltip();
      $container.style.cursor = '';
    });

    // Opcional (móvil): mostrar con taphold (~500ms)
    cy.off('taphold', 'node');
    cy.on('taphold', 'node', (evt) => {
      this.showTooltip(evt.target);
    });
  }

  bindTooltipEvents() {
    const cy = this.cy;

    // Observa cambios de tamaño del tooltip (texto que entra, wraps, etc.)
    if (!this._tipRO) {
      this._tipRO = new ResizeObserver(() => {
        if (this.tooltipEl.style.display === 'block' && this._tipNode) {
          this.placeTooltipSmart(this._tipNode);
        }
      });
      this._tipRO.observe(this.tooltipEl);
    }

    // Throttle para mousemove
    let tipRAF = null;
    const scheduleReposition = () => {
      if (tipRAF) return;
      tipRAF = requestAnimationFrame(() => {
        tipRAF = null;
        if (this.tooltipEl.style.display === 'block' && this._tipNode) {
          this.placeTooltipSmart(this._tipNode);
        }
      });
    };

    cy.on('mouseover', 'node', (e) => {
      if (evt.originalEvent && evt.originalEvent.defaultPrevented) return;
      const n = e.target;
      // 2) Muestra y posiciona
      this.tooltipEl.style.display = 'block';
      // Delegación de clicks dentro del tooltip (botones)
      if (!this._tooltipClickBound) {
        this._tooltipClickBound = true;
        this.tooltipEl.addEventListener('click', (ev) => {
          const btn = ev.target.closest('[data-action]');
          if (!btn) return;
          ev.stopPropagation();

          const action = btn.getAttribute('data-action');
          const node = this._tipNode;   // el nodo bajo hover actual
          if (!node || node.destroyed()) return;

          switch (action) {
            case 'toggle': {
              const id = node.id();
              let expanded = false;
              if (this._expandedTipIds.has(id)) {
                this._expandedTipIds.delete(id);
              } else {
                this._expandedTipIds.add(id);
                expanded = true;
              }

              this.tooltipEl.innerHTML = this.renderCompactTooltip(node);
              this.tooltipEl.classList.toggle('is-expanded', expanded); // marca expandido

              if (typeof this.placeTooltipSmart === 'function') {
                this.placeTooltipSmart(node, this.tooltipEl, { prefer: expanded ? 'bottom' : null });
                requestAnimationFrame(() => this.placeTooltipSmart(node, this.tooltipEl, { prefer: expanded ? 'bottom' : null }));
              }
              break;
            }
            case 'duplicate': {
              // Selecciona ese nodo y llama a tu método existente
              this.cy.elements().unselect();
              node.select();
              this.duplicateSelectedNode();
              // Mantén el hover del original
              this.tooltipEl.innerHTML = this.renderCompactTooltip(node);
              this.placeTooltipSmart(node);
              break;
            }
            case 'delete': {
              // Selecciona ese nodo y llama a tu método existente (respeta tu regla de “sin conexiones”)
              this.cy.elements().unselect();
              node.select();
              this.deleteSelectedNode();
              // Si se borró, oculta tooltip
              if (!this.cy.hasElementWithId(node.id())) {
                this.tooltipEl.style.display = 'none';
                this._tipNode = null;
              } else {
                // Si no se pudo borrar (tenía conexiones), re-render
                this.tooltipEl.innerHTML = this.renderCompactTooltip(node);
                this.placeTooltipSmart(node);
              }
              break;
            }
          }
        });
      }
      this._tipNode = n;

      // 3) Posiciona ahora…
      this.placeTooltipSmart(n);
      // …y también en el PRÓXIMO frame (cuando el layout ya “asentó”)
      requestAnimationFrame(() => this.placeTooltipSmart(n));
    });

    cy.on('mouseout', 'node', () => {
      this.tooltipEl.style.display = 'none';
      this._tipNode = null;
    });

    // Reposiciona en pan/zoom (lo tenías)
    cy.on('pan zoom', () => {
      if (this.tooltipEl.style.display === 'block' && this._tipNode) {
        this.placeTooltipSmart(this._tipNode);
      }
    });

    // Reposiciona mientras mueves el mouse sobre el nodo (suave)
    cy.on('mousemove', 'node', (e) => {
      if (this._tipNode && e.target === this._tipNode) scheduleReposition();
    });

    // Por si cambia el tamaño de la ventana
    window.addEventListener('resize', scheduleReposition);
  }


  // ---- Posicionador inteligente (flip + clamp) ----
  // ---- Posicionador inteligente (flip + clamp) ----
  // ---- Posicionador inteligente (flip + clamp) ----
  placeTooltipSmart(node, el = this.tooltipEl, opts = {}) {
    const PAD = -1;    // ligero solape con el nodo
    const MARGIN = 8;  // margen con viewport

    const cRect = this.cy.container().getBoundingClientRect();
    const nb = node.renderedBoundingBox();

    const anchor = {
      top: cRect.top + nb.y1,
      bottom: cRect.top + nb.y2,
      left: cRect.left + nb.x1,
      right: cRect.left + nb.x2,
      cx: cRect.left + (nb.x1 + nb.x2) / 2,
      cy: cRect.top + (nb.y1 + nb.y2) / 2
    };

    // Medición sin parpadeo
    const measure = (elem) => {
      const prevDisp = elem.style.display;
      const prevVis = elem.style.visibility;
      elem.style.visibility = 'hidden';
      elem.style.display = 'block';
      const w = elem.offsetWidth || 320;
      const h = elem.offsetHeight || 200;
      elem.style.display = prevDisp;
      elem.style.visibility = prevVis;
      return { w, h };
    };

    const { w, h } = measure(el);
    const vw = window.innerWidth, vh = window.innerHeight;
    const clamp = (v, a, b) => Math.min(Math.max(v, a), b);

    const posTop = {
      name: 'top',
      x: clamp(anchor.cx - w / 2, MARGIN, vw - w - MARGIN),
      y: anchor.top - h - PAD
    };

    // 🔒 Bloqueo en TOP: no “flip”. Con keepTop=true conservamos el top previo
    if (opts.lock === 'top') {
      const x = posTop.x;
      let y = posTop.y;

      if (opts.keepTop && this._lastTipPos && typeof this._lastTipPos.y === 'number') {
        y = this._lastTipPos.y; // crece hacia abajo desde el mismo top
      } else {
        y = clamp(y, MARGIN, vh - h - MARGIN);
      }

      el.style.left = `${Math.round(x)}px`;
      el.style.top = `${Math.round(y)}px`;
      el.classList.remove('node-info--bottom', 'node-info--left', 'node-info--right', 'node-info--top');
      el.classList.add('node-info--top');

      this._lastTipPos = { x, y, name: 'top', w, h };
      return this._lastTipPos;
    }

    // Modo normal (primer hover): top → bottom → right → left
    const candidates = [
      posTop,
      { name: 'bottom', x: clamp(anchor.cx - w / 2, MARGIN, vw - w - MARGIN), y: anchor.bottom + PAD },
      { name: 'right', x: anchor.right + PAD, y: clamp(anchor.cy - h / 2, MARGIN, vh - h - MARGIN) },
      { name: 'left', x: anchor.left - w - PAD, y: clamp(anchor.cy - h / 2, MARGIN, vh - h - MARGIN) },
    ];

    const fits = (c) => c.x >= MARGIN && c.y >= MARGIN &&
      c.x + w <= vw - MARGIN && c.y + h <= vh - MARGIN;

    let pos = candidates.find(fits);
    if (!pos) {
      const over = (c) => Math.max(0, MARGIN - c.x)
        + Math.max(0, MARGIN - c.y)
        + Math.max(0, (c.x + w) - (vw - MARGIN))
        + Math.max(0, (c.y + h) - (vh - MARGIN));
      pos = candidates.sort((a, b) => over(a) - over(b))[0];
      pos.x = clamp(pos.x, MARGIN, vw - w - MARGIN);
      pos.y = clamp(pos.y, MARGIN, vh - h - MARGIN);
    }

    el.style.left = `${Math.round(pos.x)}px`;
    el.style.top = `${Math.round(pos.y)}px`;
    el.classList.remove('node-info--top', 'node-info--bottom', 'node-info--left', 'node-info--right');
    el.classList.add(`node-info--${pos.name}`);

    this._lastTipPos = { x: pos.x, y: pos.y, name: pos.name, w, h };
    return this._lastTipPos;
  }


  _measureTooltip() {
    const el = this.tooltipEl;
    const prevDisp = el.style.display;
    const prevVis = el.style.visibility;
    el.style.visibility = 'hidden';
    el.style.display = 'block';
    const w = el.offsetWidth || 320;
    const h = el.offsetHeight || 200;
    el.style.display = prevDisp;
    el.style.visibility = prevVis;
    return { w, h };
  }

  /**
   * Maneja click en fondo
   */
  handleBackgroundTap(evt) {
    if (evt.target === this.cy) {
      if (this.selectedEdge) {
        this.selectedEdge.removeClass('selected');
        this.selectedEdge = null;
      }
      if (this.sourcePort) {
        this.sourcePort.removeClass('selected');
        this.sourcePort = null;
      }
    }
  }

  handleNodeHover(evt) {
    const node = evt.target;
    if (!this.tooltipEl) this.mountTooltip();

    this._tipNode = node;                        // para los botones

    this.tooltipEl.style.display = 'block';
    this.tooltipEl.innerHTML = this.renderCompactTooltip(node);

    if (typeof this.placeTooltipSmart === 'function') {
      this.placeTooltipSmart(node);
      requestAnimationFrame(() => this.placeTooltipSmart(node));
    }
  }



  /**
   * Maneja salida de hover
   */
  handleNodeOut(evt) {
    document.getElementById('informacionNodo').style.display = 'none';
  }

  /**
   * Maneja teclas
   */
  handleKeyDown(e) {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (this.selectedEdge) {
        this.cy.remove(this.selectedEdge);
        this.selectedEdge = null;
        this.applyHorizontalLayout();
        this.updateJSON();
      }
      if (this.sourcePort) {
        this.cy.remove(this.sourcePort);
        this.sourcePort = null;
        this.applyHorizontalLayout();
        this.updateJSON();
      }
    }
  }

  /**
   * Crea nodo padre inicial
   */
  // cytoscape-manager.js
  crearNodoPadre(nodoSeleccionado) {
    if (this.cy.getElementById(this.nodoPadreId).length > 0) {
      return;
    }

    if (nodoSeleccionado.entidadBaseId) {
      this.entidadBaseId = nodoSeleccionado.entidadBaseId;
    }

    this.entidadContext = {
      servidor: nodoSeleccionado.servidor || null,
      base: nodoSeleccionado.base || null,
      esquema: nodoSeleccionado.esquema || null,
      tabla: nodoSeleccionado.tabla || null
    };

    const typeMeta = this.getTypeMetadata(nodoSeleccionado.tipo);
    const normalizedType = typeMeta.key || 'otros';

    const nodoPadre = {
      data: {
        id: this.nodoPadreId,
        nombre: nodoSeleccionado.nombre,
        descripcion: nodoSeleccionado.descripcion || '',
        tipo: normalizedType,
        icon: typeMeta.icon || this.defaultNodeIcon,
        esPadre: true,
        servidor: nodoSeleccionado.servidor,
        base: nodoSeleccionado.base,
        esquema: nodoSeleccionado.esquema,
        tabla: nodoSeleccionado.tabla,
        // NUEVO (opcionales)
        ...(nodoSeleccionado.origen ? { origen: nodoSeleccionado.origen } : {}),
        ...(Array.isArray(nodoSeleccionado.campos) && nodoSeleccionado.campos.length
          ? { campos: nodoSeleccionado.campos } : {})
      },
      position: { x: 100, y: 200 }
    };

    this.cy.add(nodoPadre);
    this.applyHorizontalLayout();
    this.updateJSON();
  }


  /**
   * Crea nodo desde parámetros URL
   */
  // cytoscape-manager.js
  crearNodoDesdeURL() {
    const params = new URLSearchParams(location.search);

    // Lee parámetros (soporta legacy). Normalizo a mayúsculas lo que viene de BD para que
    // coincida con la API (que retorna UPPER).
    const servidor = (params.get('servidor') || '').toString().trim().toUpperCase();
    const base = (params.get('base') || '').toString().trim().toUpperCase();
    const esquema = (params.get('esquema') || '').toString().trim().toUpperCase();
    const tabla = (params.get('tabla') || '').toString().trim().toUpperCase();
    const tipo = (params.get('tipo') || 'tabla').toString().trim().toLowerCase();

    // Si no viene nombre, usa la tabla
    const nombre = (params.get('nombre') || tabla).toString().trim();

    if (!tabla || !nombre) return false;

    // FQN en estilo dotted (el tooltip ya lo cambia a " -> ")
    const origen = (servidor && base && esquema) ? `${servidor}.${base}.${esquema}` : '';
    const entidadBaseId = LinajeHelpers.buildEntidadBaseId({
      base,
      servidor,
      esquema,
      tabla
    });

    // Descripción inicial: si viene por parámetro úsala; si no, FQN+tabla como fallback
    const descripcionParam = (params.get('descripcion') || '').toString().trim();
    const descripcionFqn = origen ? `${origen}.${tabla}` : tabla;
    const descripcion = descripcionParam || descripcionFqn;

    // 1) Crea ya el nodo padre con lo que tenemos
    this.crearNodoPadre({
      nombre, descripcion, tipo,
      servidor, base, esquema, tabla,
      origen,            // opcional
      entidadBaseId,
      campos: []         // se llenará luego si aplica
    });

    if (entidadBaseId && typeof apiManager !== 'undefined' && typeof apiManager.loadLinajeSnapshot === 'function') {
      this.loadSnapshotFromApi({ entidadBaseId }).then((loaded) => {
        if (!loaded && tipo === 'tabla' && servidor && base && esquema && tabla) {
          this.fetchAndApplyTableMetadata({ servidor, base, esquema, tabla, descripcionParam, origen });
        }
      });
    } else if (tipo === 'tabla' && servidor && base && esquema && tabla) {
      this.fetchAndApplyTableMetadata({ servidor, base, esquema, tabla, descripcionParam, origen });
    }

    return true;
  }

  fetchAndApplyTableMetadata({ servidor, base, esquema, tabla, descripcionParam, origen }) {
    if (typeof apiManager === 'undefined') return;
    Promise.all([
      apiManager.getFields(servidor, base, esquema, tabla).catch(() => []),
      apiManager.getTableDescription(tabla).catch(() => '')
    ]).then(([fields, desc]) => {
      const n = this.cy.getElementById(this.nodoPadreId);
      if (!n || n.empty()) return;

      if (Array.isArray(fields) && fields.length) {
        n.data('campos', fields);
      }
      if (!descripcionParam && desc) {
        n.data('descripcion', desc);
      }
      if (origen) {
        n.data('origen', origen);
      }

      this.updateJSON();
      this.applyHorizontalLayout();
    });
  }


  /**
   * Añade nuevo nodo
   */
  addNode(nombre, descripcion, tipo, campos = [], origen = null) {
    // Si no existe padre, el primer add lo crea y terminamos.
    if (!this.hasParent()) {
      let servidor = null, base = null, esquema = null, tabla = null;

      if (tipo === 'tabla') {
        // origen puede venir como "SRV.DB.SCH" o "SRV -> DB -> SCH"
        const parts = (origen || '')
          .replace(/\s*->\s*/g, '.')  // "A -> B -> C" => "A.B.C"
          .replace(/\s+/g, '')        // quita espacios
          .split('.');
        servidor = parts[0] || null;
        base = parts[1] || null;
        esquema = parts[2] || null;
        tabla = nombre || null;
      }

      const desc = (descripcion && descripcion.trim())
        ? descripcion.trim()
        : (servidor && base && esquema && nombre
          ? `${servidor}.${base}.${esquema}.${nombre}`
          : (nombre || ''));

      this.saveState();
      this.crearNodoPadre({
        nombre,
        descripcion: desc,
        tipo,
        servidor,
        base,
        esquema,
        tabla,
        ...(origen ? { origen } : {}),
        ...(Array.isArray(campos) && campos.length ? { campos } : {})
      });

      return; // no continúes: este primer add establece el padre
    }

    // Ya existe padre → agregar nodo normal (tu lógica actual)
    const typeMeta = this.getTypeMetadata(tipo);
    const normalizedType = typeMeta.key || 'otros';
    const icon = typeMeta.icon || this.defaultNodeIcon;

    const data = {
      nombre,
      tipo: normalizedType,
      ...(typeof origen === 'string' && origen.trim() ? { origen: origen.trim() } : {}),
      descripcion,
      ...(Array.isArray(campos) && campos.length ? { campos } : {}),
      icon,
      id: normalizedType + this.idCounter++
    };

    const nuevoNodo = {
      data,
      position: { x: 100 + (this.idCounter * 200), y: 150 }
    };
    this.saveState();

    this.cy.add(nuevoNodo);
    this.applyHorizontalLayout();
    this.updateJSON();
  }


  hasParent() {
    return this.cy && this.cy.getElementById(this.nodoPadreId).length > 0;
  }


  /**
   * Aplica layout horizontal
   */
  applyHorizontalLayout() {
    const nodes = this.cy.nodes();
    const edges = this.cy.edges();

    if (nodes.length === 0) return;

    const nodoPadre = this.cy.getElementById(this.nodoPadreId);

    if (!nodoPadre.length) {
      this.cy.layout({
        name: 'grid',
        rows: 1,
        spacingFactor: 2,
        avoidOverlap: true,
        animate: true,
        animationDuration: 500,
        padding: 50
      }).run();
      return;
    }

    const { HORIZONTAL_SPACING, VERTICAL_SPACING, CENTER_X, CENTER_Y } = this.graphConfig;

    nodoPadre.position({ x: CENTER_X, y: CENTER_Y });

    const padresDelPadre = [];
    const hijosDelPadre = [];

    edges.forEach(edge => {
      if (edge.data('target') === this.nodoPadreId) {
        padresDelPadre.push(edge.data('source'));
      }
    });

    const visitedRight = new Set();
    const rightLevels = new Map();

    const buildRightLevels = (nodeId, level) => {
      if (visitedRight.has(nodeId)) return;
      visitedRight.add(nodeId);

      if (!rightLevels.has(level)) {
        rightLevels.set(level, []);
      }
      rightLevels.get(level).push(nodeId);

      edges.forEach(edge => {
        if (edge.data('source') === nodeId) {
          buildRightLevels(edge.data('target'), level + 1);
        }
      });
    };

    edges.forEach(edge => {
      if (edge.data('source') === this.nodoPadreId) {
        buildRightLevels(edge.data('target'), 1);
      }
    });

    const visitedLeft = new Set();
    const leftLevels = new Map();

    const buildLeftLevels = (nodeId, level) => {
      if (visitedLeft.has(nodeId)) return;
      visitedLeft.add(nodeId);

      if (!leftLevels.has(level)) {
        leftLevels.set(level, []);
      }
      leftLevels.get(level).push(nodeId);

      edges.forEach(edge => {
        if (edge.data('target') === nodeId) {
          buildLeftLevels(edge.data('source'), level + 1);
        }
      });
    };

    padresDelPadre.forEach(nodeId => {
      buildLeftLevels(nodeId, 1);
    });

    leftLevels.forEach((nodeIds, level) => {
      const x = CENTER_X - (level * HORIZONTAL_SPACING);
      const nodeCount = nodeIds.length;
      const startY = CENTER_Y - ((nodeCount - 1) * VERTICAL_SPACING / 2);

      nodeIds.forEach((nodeId, index) => {
        const y = startY + (index * VERTICAL_SPACING);
        this.cy.getElementById(nodeId).position({ x, y });
      });
    });

    rightLevels.forEach((nodeIds, level) => {
      const x = CENTER_X + (level * HORIZONTAL_SPACING);
      const nodeCount = nodeIds.length;
      const startY = CENTER_Y - ((nodeCount - 1) * VERTICAL_SPACING / 2);

      nodeIds.forEach((nodeId, index) => {
        const y = startY + (index * VERTICAL_SPACING);
        this.cy.getElementById(nodeId).position({ x, y });
      });
    });

    const allConnectedNodes = new Set([this.nodoPadreId]);
    leftLevels.forEach(nodeIds => {
      nodeIds.forEach(nodeId => allConnectedNodes.add(nodeId));
    });
    rightLevels.forEach(nodeIds => {
      nodeIds.forEach(nodeId => allConnectedNodes.add(nodeId));
    });

    const nodosOrfanos = nodes.filter(node =>
      !allConnectedNodes.has(node.id())
    );

    nodosOrfanos.forEach((node, index) => {
      const x = CENTER_X + (index * HORIZONTAL_SPACING);
      const y = CENTER_Y + 150;
      node.position({ x, y });
    });

    const shouldAnimateFit = nodes.length > 1;
    const performFit = () => this.cy.fit(this.cy.elements(), 50);

    if (shouldAnimateFit) {
      this.cy.animate({
        fit: {
          eles: this.cy.elements(),
          padding: 50
        }
      }, {
        duration: 500
      });
    } else {
      performFit();
    }
  }

  /**
 * Construye y actualiza la representación JSON del grafo (recursivo y consistente)
 * Ahora la relación se llama "fuentes" en lugar de "hijos".
 * @param {Function} [callback] - Callback opcional para manejar el JSON generado
 * @returns {Object} La jerarquía de nodos en formato JSON
 */
  updateJSON(callback) {
    const cy = this.cy;
    const graph = cy.json();
    const nodesArr = Array.isArray(graph.elements?.nodes) ? graph.elements.nodes : [];
    const edgesArr = Array.isArray(graph.elements?.edges) ? graph.elements.edges : [];

    // Mapa rápido id -> data del nodo
    const nodeMap = new Map(nodesArr.map(n => [n.data.id, n.data]));

    // Padre
    const padreData = nodeMap.get(this.nodoPadreId);
    if (!padreData) {
      const nodeHierarchy = { message: 'No hay nodo padre definido' };
      if (typeof callback === 'function') callback(nodeHierarchy);
      document.getElementById('visualizacion').textContent = JSON.stringify(nodeHierarchy, null, 2);
      return nodeHierarchy;
    }

    // Índice de hijos salientes: sourceId -> [targetId, ...]
    const outIndex = new Map();
    const inIndex = new Map();
    for (const e of edgesArr) {
      const s = e.data.source, t = e.data.target;
      if (!outIndex.has(s)) outIndex.set(s, []);
      outIndex.get(s).push(t);
      if (!inIndex.has(t)) inIndex.set(t, []);
      inIndex.get(t).push(s);
    }

    // --- Recursivo: { nodo, fuentes: [] } ---
    const buildSubtree = (nodeId) => {
      const data = nodeMap.get(nodeId);
      const subtree = { nodo: data, fuentes: [] };

      const parents = inIndex.get(nodeId) || [];
      for (const parentId of parents) {
        if (nodeMap.has(parentId)) {
          subtree.fuentes.push(buildSubtree(parentId));
        }
      }
      return subtree;
    };

    // Arma jerarquía completa con "fuentes"
    const rootSubtree = buildSubtree(this.nodoPadreId);
    const nodeHierarchy = {
      padre: rootSubtree.nodo,
      fuentes: rootSubtree.fuentes
    };

    // Nodos conectados (para detectar huérfanos)
    const conectados = new Set();
    conectados.add(this.nodoPadreId);
    for (const e of edgesArr) {
      conectados.add(e.data.source);
      conectados.add(e.data.target);
    }
    const huerfanos = nodesArr
      .filter(n => !conectados.has(n.data.id) && n.data.id !== this.nodoPadreId)
      .map(n => n.data);
    if (huerfanos.length) nodeHierarchy.nodosHuerfanos = huerfanos;

    // Callback + DOM (compatibilidad)
    if (typeof callback === 'function') callback(nodeHierarchy);
    document.getElementById('visualizacion').textContent = JSON.stringify(nodeHierarchy, null, 2);

    return nodeHierarchy;
  }



  /**
   * Carga snapshot desde la API si existe
   */
  async loadSnapshotFromApi({ entidadBaseId } = {}) {
    if (!entidadBaseId || typeof apiManager === 'undefined' || typeof apiManager.loadLinajeSnapshot !== 'function') {
      return;
    }

    try {
      const usuario = LinajeHelpers.getCurrentUser();
      const { record } = await apiManager.loadLinajeSnapshot({
        entidadBaseId,
        usuario
      });

      if (record && record.txt_json) {
        try {
          const parsed = JSON.parse(record.txt_json);
          this.loadGraph(parsed);
          this.snapshotLoaded = true;
          return true;
        } catch (error) {
          LinajeHelpers.handleError(error, 'parsear snapshot remoto');
        }
      } else {
        this.snapshotLoaded = false;
        return false;
      }
    } catch (error) {
      LinajeHelpers.handleError(error, 'cargar snapshot desde API');
      this.snapshotLoaded = false;
      return false;
    }
  }

  getCurrentSnapshot({ forceLayout = false } = {}) {
    if (forceLayout) {
      this.applyHorizontalLayout();
    }
    const nodes = this.cy.nodes().map(node => {
      const data = { ...node.data() };
      const typeMeta = this.getTypeMetadata(data.tipo);
      if (typeMeta.key) {
        data.tipo = typeMeta.key;
      }
      if (typeMeta.isKnown) {
        delete data.icon;
      }
      return {
        data,
        position: node.position()
      };
    });

    const edges = this.cy.edges().map(edge => ({
      data: {
        source: edge.data('source'),
        target: edge.data('target')
      }
    }));

    return {
      elements: {
        nodes,
        edges
      }
    };
  }

  async persistSnapshot(snapshot) {
    if (!this.entidadBaseId) {
      throw new Error('No existe un identificador de entidad base para este grafo.');
    }
    if (typeof apiManager === 'undefined' || typeof apiManager.saveLinajeSnapshot !== 'function') {
      throw new Error('ApiManager no está disponible para guardar el linaje.');
    }

    try {
      const usuario = LinajeHelpers.getCurrentUser();
      await apiManager.saveLinajeSnapshot({
        entidadBaseId: this.entidadBaseId,
        snapshot,
        usuario
      });
      this.snapshotLoaded = true;
    } catch (error) {
      LinajeHelpers.handleError(error, 'guardar snapshot en API');
      throw error;
    }
  }


  /**
   * Guarda grafo como JSON
   */
  async saveGraph() {
    const snapshot = this.getCurrentSnapshot({ forceLayout: true });
    const jsonString = JSON.stringify(snapshot, null, 2);
    const filename = 'linaje-datos-' + LinajeHelpers.formatDateForFilename() + '.json';
    LinajeHelpers.downloadFile(jsonString, filename);
  }

  /**
   * Guarda snapshot en la base (sin descargar)
   */
  async saveLinaje() {
    if (!this.entidadBaseId) {
      throw new Error('No existe un identificador de entidad base para este grafo.');
    }
    if (typeof apiManager === 'undefined' || typeof apiManager.saveLinajeSnapshot !== 'function') {
      throw new Error('ApiManager no está disponible para guardar el linaje.');
    }
    const snapshot = this.getCurrentSnapshot({ forceLayout: true });
    await this.persistSnapshot(snapshot);
    this.snapshotLoaded = true;
  }

  saveState() {
    if (!this.cy) return;
    // Guardamos una copia profunda del estado actual SIN forzar un nuevo layout
    const snapshot = this.getCurrentSnapshot({ forceLayout: false });
    this.undoStack.push(JSON.parse(JSON.stringify(snapshot)));

    // Mantenemos el límite del historial
    if (this.undoStack.length > this.maxUndoStack) {
      this.undoStack.shift();
    }
  }

  undo() {
    if (!this.cy || this.undoStack.length === 0) {
      if (window.LinajeHelpers && typeof LinajeHelpers.showToast === 'function') {
        LinajeHelpers.showToast("No hay más acciones para deshacer", "info");
      }
      return;
    }

    // Sacamos el último estado guardado
    const previousState = this.undoStack.pop();

    // Lo cargamos usando preventLayout para respetar las coordenadas exactas 
    // y evitar que el grafo salte de regreso a una cuadrícula.
    this.loadGraph(previousState, { preventLayout: true });
  }

  /**
   * Limpia todos los elementos del grafo y reinicia el estado interno
   */
  clearGraph() {
    if (!this.cy) return;

    // 1. Eliminar elementos visuales (nodos y aristas)
    this.cy.elements().remove();

    // 2. Reiniciar contadores y estado interno
    this.idCounter = 0;
    this.sourcePort = null;
    this.selectedEdge = null;
    this.entidadBaseId = '';
    this.entidadContext = null;
    this.snapshotLoaded = false;

    // Opcional: Si necesitas reiniciar el zoom y la posición
    this.cy.reset();
  }

  /**
   * Carga grafo desde JSON
   */
  loadGraph(jsonData, { skipIconSanitize = false, preventLayout = false } = {}) {
    this.cy.elements().remove();

    if (jsonData.elements && jsonData.elements.nodes) {
      jsonData.elements.nodes.forEach(nodeData => {
        const data = nodeData.data;
        const typeMeta = this.getTypeMetadata(data.tipo);
        if (typeMeta.key) {
          data.tipo = typeMeta.key;
        }

        if (typeMeta.isKnown) {
          data.icon = typeMeta.icon;
        } else if (!data.icon && !skipIconSanitize) {
          data.icon = this.defaultNodeIcon;
        }

        this.cy.add({
          data: data,
          position: nodeData.position || { x: 300 + Math.random() * 200, y: 300 + Math.random() * 200 }
        });
      });
    }

    if (jsonData.elements && jsonData.elements.edges) {
      jsonData.elements.edges.forEach(edgeData => {
        this.cy.add({
          data: edgeData.data
        });
      });
    }

    const nodes = this.cy.nodes();
    let maxId = 0;
    nodes.forEach(node => {
      const id = node.id();
      const numericPart = id.replace(/[^0-9]/g, '');
      if (numericPart && parseInt(numericPart) > maxId) {
        maxId = parseInt(numericPart);
      }
    });
    this.idCounter = maxId + 1;

    if (!preventLayout) {
      this.applyHorizontalLayout();
    }
    this.updateJSON();
  }

  notify(message, variant = 'info') {
    if (window.LinajeHelpers && typeof LinajeHelpers.showToast === 'function') {
      LinajeHelpers.showToast(message, variant);
    } else if (typeof window !== 'undefined' && window.alert) {
      window.alert(message);
    }
  }

}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CytoscapeManager };
} else {
  window.CytoscapeManager = CytoscapeManager;
}
