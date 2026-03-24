/**
 * Módulo controlador de UI para el sistema de Linaje
 * Maneja la interacción de usuario y eventos de UI
 */

class UIController {
  constructor() {
    this.cytoscapeManager = null;
    this.selectCascadeManager = null;
  }

  /**
   * Inicializa el controlador con las dependencias
   */
  initialize(cytoscapeManager, selectCascadeManager) {
    this.cytoscapeManager = cytoscapeManager;
    this.selectCascadeManager = selectCascadeManager;

    this.setupEventListeners();
    this.initializeParentNode();

    // Ajustar el layout después de la inicialización
    document.getElementById('reajustarBtn')?.click();
  }

  /**
   * Configura los event listeners principales
   */
  setupEventListeners() {
    document.getElementById('submitBtn').addEventListener('click', () => this.handleAddNode());
    document.getElementById('guardarLinajeBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.handleSaveLinaje();
    });
    document.getElementById('eraseLinaje')?.addEventListener('click', () => this.handleClearCanvas());
    document.getElementById('reajustarBtn').addEventListener('click', () => this.cytoscapeManager.applyHorizontalLayout());
    document.getElementById('guardarBtn').addEventListener('click', () => this.cytoscapeManager.saveGraph());
    document.getElementById('cargarBtn').addEventListener('click', () => document.getElementById('fileInput').click());
    document.getElementById('fileInput').addEventListener('change', (e) => this.handleFileLoad(e));
    document.getElementById('togglePanelBtn').addEventListener('click', () => this.toggleRightPanel());
    document.getElementById('deleteBtn')?.addEventListener('click', () => { this.cytoscapeManager.deleteSelectedNode(); });
    document.getElementById('duplicateBtn')?.addEventListener('click', () => { this.cytoscapeManager.duplicateSelectedNode(); });

    const uploadSpBtn = document.getElementById('uploadSpBtn');
    const spFileInput = document.getElementById('spFileInput');
    uploadSpBtn?.addEventListener('click', () => {
      spFileInput?.click();
    });
    spFileInput?.addEventListener('change', (e) => this.handleStoredProcedureFile(e));

    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        // Evita que el navegador intente hacer 'deshacer' en inputs si no estamos en uno
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          this.cytoscapeManager.undo();
        }
      }
    });

    const btnUndo = document.getElementById('btnUndoLinaje');
    if (btnUndo) {
      btnUndo.addEventListener('click', () => {
        this.cytoscapeManager.undo();
      });
    }

    this.setupExitConfirmModal();
  }

  setupExitConfirmModal() {
    const modal = document.getElementById('linajeExitConfirmModal');
    if (!modal) return;

    const confirmBtn = document.getElementById('linajeExitConfirmAcceptBtn');
    const cancelBtn = document.getElementById('linajeExitConfirmCancelBtn');

    this.exitConfirmModal = modal;
    this.exitConfirmResolve = null;

    const close = (result) => {
      if (!this.exitConfirmModal) return;
      this.exitConfirmModal.classList.add('hidden');
      this.exitConfirmModal.setAttribute('aria-hidden', 'true');

      const resolve = this.exitConfirmResolve;
      this.exitConfirmResolve = null;
      if (typeof resolve === 'function') {
        resolve(result);
      }
    };

    if (confirmBtn) confirmBtn.addEventListener('click', () => close(true));
    if (cancelBtn) cancelBtn.addEventListener('click', () => close(false));

    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        close(false);
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
        close(false);
      }
    });
  }

  requestExitConfirm() {
    const confirmMessage = '\u00bfEst\u00e1s seguro que deseas salir del canvas?\n\nEsta acci\u00f3n cerrar\u00e1 el diagrama actual, los cambios sin guardar se perder\u00e1n.';
    if (!this.exitConfirmModal) {
      return Promise.resolve(window.confirm(confirmMessage));
    }

    if (this.exitConfirmResolve) {
      try {
        this.exitConfirmResolve(false);
      } catch (error) {
        // noop
      }
    }

    this.exitConfirmModal.classList.remove('hidden');
    this.exitConfirmModal.setAttribute('aria-hidden', 'false');
    this.exitConfirmResolve = null;

    const focusTarget = document.getElementById('linajeExitConfirmAcceptBtn');
    if (focusTarget) {
      requestAnimationFrame(() => focusTarget.focus());
    }

    return new Promise((resolve) => {
      this.exitConfirmResolve = resolve;
    });
  }

  toggleRightPanel() {
    const panel = document.querySelector('.right-panel');
    panel.classList.toggle('visible');

    // Si se está haciendo visible y hay un grafo, actualizar JSON
    if (panel.classList.contains('visible') && this.cytoscapeManager) {
      this.cytoscapeManager.updateJSON((jsonData) => {
        // Callback opcional si necesitas hacer algo más con el JSON
      });
    }
  }

  /**
   * Maneja la adición de un nuevo nodo
   */
  handleAddNode() {
    const rawNombre = document.getElementById('nombreInput').value.trim();
    const descripcion = document.getElementById('descripcionInput').value.trim();
    const tipo = (document.getElementById('typeInput2').value || '').toString().trim().toLowerCase();

    if (!tipo) {
      this.notify('Por favor selecciona el tipo.', 'error');
      return;
    }

    let nombre;
    if (tipo === 'tabla') {
      const tableId = this.selectCascadeManager.selectors.table;
      let tableVal = this.selectCascadeManager.getSelectedValue(tableId);
      if (Array.isArray(tableVal)) tableVal = tableVal[0] || '';
      nombre = (tableVal || '').toString().trim();
    } else {
      nombre = rawNombre;
    }

    if (!nombre) {
      this.notify('Selecciona una tabla o ingresa un nombre.', 'error');
      return;
    }

    const camposSeleccionados = this.selectCascadeManager.getSelectedFields();
    const origen = (tipo === 'tabla') ? this.selectCascadeManager.getTableOrigin() : null;

    this.cytoscapeManager.addNode(nombre, descripcion, tipo, camposSeleccionados, origen);

    document.getElementById('nombreInput').value = '';
    document.getElementById('descripcionInput').value = '';
    document.getElementById('observacionInput').value = '';
    $('#tableInput').trigger('select2:clear');
    $('#tableInput').val(null).trigger('change');
    // Mover el foco al select superior para que el sidebar suba
    const typeEl = document.getElementById('tableInput');
    if (typeEl) {
      // timeout corto para que Select2 termine de limpiar antes de enfocar
      setTimeout(() => typeEl.focus(), 0);
    }
  }

  /**
   * Maneja la carga de un archivo
   */
  handleFileLoad(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);
        this.cytoscapeManager.loadGraph(jsonData);
        this.notify('\u00a1Archivo cargado exitosamente!', 'success');
      } catch (error) {
        this.notify('Error al cargar el archivo: ' + error.message, 'error');
      }
    };
    reader.readAsText(file);
  }

  /**
   * Maneja la selecci��n de un archivo SQL/SP
   */
  handleStoredProcedureFile(e) {
    const input = e.target;
    const file = input.files && input.files[0];
    input.value = '';
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = (ev.target?.result || '').toString();
      this.processStoredProcedureContent(content, file.name);
    };
    reader.onerror = () => {
      this.notify('No se pudo leer el archivo del SP.', 'error');
    };
    reader.readAsText(file);
  }

  /**
   * Procesa el texto de un SP y genera el linaje en memoria
   */
  processStoredProcedureContent(content, fileName = 'procedimiento.sql') {
    try {
      if (!content || !content.trim()) {
        this.notify('El archivo del SP está vacío.', 'error');
        return;
      }
      if (typeof SpParser === 'undefined' || typeof SpParser.parseToSnapshot !== 'function') {
        this.notify('El analizador de SP no está disponible.', 'error');
        return;
      }

      const { snapshot, meta } = SpParser.parseToSnapshot(content, { fileName });
      if (!snapshot) {
        this.notify('No se pudo interpretar el SP.', 'error');
        return;
      }

      this.cytoscapeManager.loadGraph(snapshot);
      if (meta?.entityId) {
        this.cytoscapeManager.entidadBaseId = meta.entityId;
        this.cytoscapeManager.entidadContext = {
          tipo: 'sp',
          schema: meta.schema,
          nombre: meta.objectName
        };
      } else {
        this.cytoscapeManager.entidadBaseId = '';
        this.cytoscapeManager.entidadContext = null;
      }
      this.cytoscapeManager.snapshotLoaded = false;

      const label = meta?.procedureName || fileName;
      this.notify(`Linaje generado desde ${label}`, 'success');
    } catch (error) {
      this.notify('Error al procesar el SP: ' + (error?.message || error), 'error');
    }
  }

  /**
   * Maneja el guardado explícito del linaje en la base
   */

  handleSaveLinaje() {
    console.log('CLICK guardarLinajeBtn → handleSaveLinaje');

    // 1. Singleton: crear el modal solo una vez
    if (!this.saveModalInstance) {

      // Aseguramos que la clase del modal esté disponible
      const ModalClass = window.LinajeSaveModal || LinajeSaveModal;

      this.saveModalInstance = new ModalClass({

        // A: Función para obtener el JSON del linaje actual
        getJson: () => {
          if (!this.cytoscapeManager) return null;

          const snapshot = this.cytoscapeManager.getCurrentSnapshot({
            forceLayout: true
          });

          return JSON.stringify(snapshot);
        },

        // B: Función para obtener el usuario creador
        getUser: () => {
          if (
            typeof UserHelper !== 'undefined' &&
            typeof UserHelper.getWebUser === 'function'
          ) {
            return UserHelper.getWebUser() || 'desconocido';
          }

          if (typeof window !== 'undefined') {
            if (window.current_user) return window.current_user;
            if (
              window._spPageContextInfo &&
              window._spPageContextInfo.userLoginName
            ) {
              return window._spPageContextInfo.userLoginName;
            }
          }

          return 'desconocido';
        },

        // C: Toast desacoplado (puente hacia UIController)
        showGenerationToast: (message, isError = false) => {
          this.notify(message, isError ? 'error' : 'success');
        }
      });
    }

    // 2. Abrir el modal visualmente
    this.saveModalInstance.open();
  }

  /**
     * Refresca la p?gina para reabrir Linaje en blanco
     */
  handleClearCanvas() {
    const baseUrl = (window.location.origin ? (window.location.origin + window.location.pathname) : window.location.href.split('?')[0]);
    const hasNodes = !!(this.cytoscapeManager && this.cytoscapeManager.cy && this.cytoscapeManager.cy.elements().length);

    if (!hasNodes) {
      window.location.href = baseUrl;
      return;
    }

    this.requestExitConfirm().then((confirmacion) => {
      if (confirmacion) {
        window.location.href = baseUrl;
      }
    });
  }

  /**
   * Inicializa el nodo padre
   */
  initializeParentNode() {
    this.cytoscapeManager.crearNodoDesdeURL(); // sin default
  }

  /**
   * Inicializa todos los componentes Select2
   */
  reinitSelect2All() {
    if (window.$ && $.fn && $.fn.select2) {
      $('select.form-select').each(function () {
        const $s = $(this);
        if ($s.hasClass('select2-hidden-accessible')) $s.select2('destroy');

        const placeholderOpt = $s.find('option[disabled][selected]').text() || 'Selecciona…';

        $s.select2({
          placeholder: placeholderOpt,
          allowClear: true,
          width: '100%',
          minimumResultsForSearch: 5,
          matcher: function (params, data) {
            if ($.trim(params.term) === '') return data;
            if (typeof data.text === 'undefined') return null;
            return data.text.toLowerCase().indexOf(params.term.toLowerCase()) > -1 ? data : null;
          },
          dropdownParent: $s.parent()
        });

        if (this.multiple) {
          $s.off('change.select2-custom').on('change.select2-custom', function () {
            for (const opt of this.options) {
              if (opt.selected) opt.classList.add('selected-custom');
              else opt.classList.remove('selected-custom');
            }
          }).trigger('change');
        }
      });
    }
  }

  notify(message, variant = 'info') {
    if (window.LinajeHelpers && typeof LinajeHelpers.showToast === 'function') {
      LinajeHelpers.showToast(message, variant);
    } else {
      alert(message);
    }
  }
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { UIController };
} else {
  window.UIController = UIController;
}
