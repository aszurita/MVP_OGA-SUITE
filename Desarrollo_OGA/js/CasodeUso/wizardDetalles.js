/**
 * @file Módulo para gestionar el wizard de "Detalles del Caso de Uso".
 * @description Encapsula la lógica del modal de edición, incluyendo navegación,
 *              validación, carga de datos y el proceso de actualización.
 * @author Giancarlo Ortiz */

const FALLBACK_REPORT_STYLES_DETALLES = `
body { font-family: "Segoe UI", Arial, sans-serif; background:#f9fafb; margin:0; padding:16px; color:#6b7280; }
.rep-page { max-width: 980px; margin: 0 auto; }
.rep-hero { background:#fff; border:1px solid #e5e7eb; border-radius:10px; padding:14px 16px; display:flex; flex-direction:column; gap:12px; }
.rep-hero__text h1 { margin:0; font-size:22px; }
.rep-kicker { margin:0; font-size:11px; letter-spacing:.35em; text-transform:uppercase; color:#9ca5af; }
.rep-subtitle { margin:4px 0 0; font-size:13px; color:#6b7280; }
.rep-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:10px; }
.rep-section { background:#fff; border:1px solid #e5e7eb; border-radius:10px; padding:14px 16px; margin-bottom:10px; }
.rep-card { background:#fefefe; border:1px solid #e1e5ee; border-radius:10px; padding:10px; }
.rep-card--wide { grid-column:1 / -1; }
.rep-hero-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); gap:10px; }
.hero-card { display:flex; align-items:center; gap:10px; border:1px solid #e5e7eb; border-radius:10px; padding:10px; background:#fff; }
.hero-icon { width:44px; height:44px; border-radius:50%; border:1px solid #e5e7eb; display:flex; align-items:center; justify-content:center; background:#fff; color:var(--hero-icon-color,#b4005c); }
.hero-icon i { font-size:18px; }
.hero-card__value { margin:0; font-size:18px; font-weight:700; }
.hero-card__label { margin:2px 0 0; font-size:11px; color:#6b7280; text-transform:uppercase; letter-spacing:0.25em; }
.kv-wrap { border:1px solid #e5e7eb; border-radius:10px; overflow:hidden; background:#fff; margin-top:6px; }
.kv-table { width:100%; border-collapse: collapse; }
.kv-table td { padding:10px 14px; vertical-align:top; border-bottom:1px solid #f1f2f6; }
.kv-table tr:last-child td { border-bottom:none; }
.kv-table td.k { background:#f7f8fb; font-weight:600; width:40%; }
.rep-list { list-style:none; padding-left:0; margin:6px 0 0; }
.rep-list li { position:relative; padding-left:14px; margin:4px 0; }
.rep-list li::before { content:''; position:absolute; left:0; top:8px; width:8px; height:8px; border-radius:50%; background:#b4005c; }
.muted { color:#6b7280; font-size:12px; }
`;

const DetallesCasoWizard = {
  TOTAL_STEPS: 4,
  currentStep: 1,
  fuentesEnEdicion: [],
  mapaFuentes: {},
  fuentesParaDesactivar: [],
  responsablesEnEdicion: [], // <-- Para responsables adicionales
  responsablesParaDesactivar: [], // <-- NUEVO
  isStepDirty: false, // <-- Para rastrear si hay cambios sin guardar.
  reportReady: false,
  SUB_NULL_PARAM: "sin-subdominio",
  fuentesCache: new Map(),
  fuentesInflight: new Map(),
  calidadCache: new Map(),
  calidadInflight: new Map(),
  avancesCache: new Map(),
  profilingCache: new Map(),
  profilingInflight: new Map(),
  metallonCache: new Map(),
  metallonInflight: new Map(),
  autoOpenReportRequested: false,
  _reportCloseBound: false,
  _isOgaCached: null,
  initialized: false,
  subdominiosCache: new Map(),
  pendingSubdominioValue: null,
  _subdominioStylesInjected: false,
  terminosActuales: [],
  _skipActivoChange: false,
  _activoConfirmBound: false,
  ROL_ORDER: {
    'lider de dominio': 1,
    'custodio': 2,
    'data translator': 3,
    'especialista de calidad': 4,
    'administrador': 5
  },

  async init() {
    if (this.initialized) return;
    this.cacheDom();
    await GlosarioApp.precargarMapaDominios();
    this.injectSubdominioStyles();
    this.initSubdominioSelect(); // Prepare the select2 instance from the start
    this.bindEvents();
    this.bindReportCloseListener();
    this.applyPermissionsForUser();
    this.initialized = true;
  },

  cacheDom() {
    this.elements = {
      modal: $('#modalDetallesCaso'),
      sections: $('#modalDetallesCaso .detalle-section'),
      prevBtn: $('#btnPrevStepDetalle'),
      nextBtn: $('#btnNextStepDetalle'),
      saveBtn: $('#btnActualizarCaso'),
      reportBtn: $('#btnReporteDetalle'),
      wizardSteps: $('#wizardStepsDetalle'),
      listaFuentes: $('#detalle-lista-fuentes'),
      detalleInput: $('#detalle-detalle_caso_uso'),
      entregableInput: $('#detalle-entregable_caso_uso'),
      dominioNombreInput: $('#detalle-dominio-nombre'),
      subdominioSelect: $('#detalle-subdominio'),
      listaTerminos: $('#listaTerminosDetalle'),
      downloadTerminosBtn: $('#btnDescargarTerminosDetalleExcel'),
      // Fuentes de datos
      fuentes: {
        input: $('#detalle-fuente-input'),
        suggestions: $('#detalle-fuente-sugerencias'),
        btnAdd: $('#btnAgregarFuenteDetalle'),
        servidor: $('#detalle-servidor'),
        base: $('#detalle-base'),
        esquema: $('#detalle-esquema'),
        tabla: $('#detalle-tabla'),
      },
      // Elementos del modal de atributos
      modalAtributo: $('#modalAtributo'),
      dominioAtributo: $('#modalAtributo #nombred'),
      containerTerminosAsociados: $('#containerTerminosAsociadosDetalle'),
      buscarTerminoInput: $('#buscarTerminoDetalle'),
      containerSinTerminos: $('#containerSinTerminosDetalle'),
      // Asignar téminos existentes
      asignarTerminosSelect: $('#detalle_asignar_terminos'),
      btnAsignarTerminos: $('#btnAsignarTerminosDetalle'),
      // Responsables adicionales
      responsables: {
        inpEmpleado: $('#det_inp_responsable_adic'),
        codEmpleado: $('#det_cod_responsable_adic'),
        sugEmpleado: $('#sug_det_inp_responsable_adic'),
        rolSelect: $('#det_rol_responsable_adic'),
        btnAdd: $('#btnAgregarResponsableDetalle'),
        lista: $('#detalle-lista-responsables'),
      }
    };
  },
  setReportReady(isReady) {
    this.reportReady = !!isReady;
    if (this.elements && this.elements.reportBtn) {
      const $btn = this.elements.reportBtn;
      $btn.prop('disabled', !this.reportReady);
      // Ocultar por completo cuando no esté listo para evitar clics prematuros
      $btn.toggle(this.reportReady);
    }
    if (this.reportReady && this.autoOpenReportRequested) {
      this.autoOpenReportRequested = false;
      this.showReport();
    }
    this.applyPermissionsForUser();
  },

  requestAutoOpenReport(flag = true) {
    this.autoOpenReportRequested = !!flag;
    if (this.reportReady && this.autoOpenReportRequested) {
      this.autoOpenReportRequested = false;
      this.showReport();
    }
  },

  bindReportCloseListener() {
    if (this._reportCloseBound) return;
    this._reportCloseBound = true;
    window.addEventListener('message', (event) => {
      if (event && event.data && event.data.type === 'detalleReporteClose') {
        try { $('#modalDetallesCaso').modal('hide'); } catch (e) { }
      }
    });
  },

  isOgaUser() {
    if (this._isOgaCached !== null) return this._isOgaCached;
    try {
      const val = typeof isOGA === 'function' ? !!isOGA() : true;
      this._isOgaCached = val;
      return val;
    } catch (e) {
      return true; // fallback seguro para no bloquear
    }
  },

  applyPermissionsForUser(forceVal) {
    const canEdit = typeof forceVal === 'boolean' ? forceVal : this.isOgaUser();
    const modal = this.elements.modal || $('#modalDetallesCaso');
    if (!modal || !modal.length) return;

    modal.find('input:not([type=hidden])').prop('readonly', !canEdit);
    modal.find('textarea').prop('readonly', !canEdit);
    modal.find('select').prop('disabled', !canEdit);

    const buttons = [
      this.elements.saveBtn,
      this.elements.fuentes.btnAdd,
      this.elements.responsables.btnAdd,
      this.elements.btnAsignarTerminos
    ];
    buttons.forEach(btn => { if (btn && btn.length) btn.prop('disabled', !canEdit); });

    // Iconos/acciones de eliminación/edición
    modal.find('.btn-del-fuente, .btn-edit-responsable, .btn-del-responsable, .btn-save-responsable, .btn-edit-term, .btn-delete-term')
      .css('pointer-events', canEdit ? '' : 'none')
      .css('opacity', canEdit ? '' : '0.5');

    // Navegación y reporte permanecen habilitados para lectura
    if (!canEdit) {
      if (this.elements.prevBtn) this.elements.prevBtn.prop('disabled', false);
      if (this.elements.nextBtn) this.elements.nextBtn.prop('disabled', false);
      if (this.elements.reportBtn) {
        this.elements.reportBtn.prop('disabled', !this.reportReady);
        this.elements.reportBtn.toggle(this.reportReady);
      }
    }
  },

  setAddFuenteBtnLoading(isLoading) {
    const btn = this.elements?.fuentes?.btnAdd;
    if (!btn || !btn.length) return;
    const original = btn.data('original-html') || btn.html();
    if (!btn.data('original-html')) btn.data('original-html', original);
    if (isLoading) {
      btn.prop('disabled', true).addClass('loading')
        .html(`<span class="spinner-border spinner-border-sm align-middle mr-2" role="status" aria-hidden="true"></span><span class="label">Agregando...</span>`);
    } else {
      btn.prop('disabled', false).removeClass('loading').html(original);
    }
  },

  setSubdominioPreset(value) {
    const trimmed = (value || "").toString().trim();
    this.pendingSubdominioValue = trimmed || null;
    const { subdominioSelect } = this.elements || {};
    if (!subdominioSelect || !subdominioSelect.length) return;

    if (trimmed) {
      const exists = subdominioSelect
        .find('option')
        .filter((_, option) => option.value === trimmed)
        .length > 0;
      if (!exists) {
        subdominioSelect.append(new Option(trimmed, trimmed));
      }
    }

    subdominioSelect.val(trimmed || '');
    subdominioSelect.trigger('change');
    subdominioSelect.trigger('change.select2');
  },

  getSubdominioFromUrl() {
    try {
      const params = new URLSearchParams(window.location.search);
      const raw = params.get('subdominio');
      if (!raw) return null;
      const trimmed = raw.trim();
      if (!trimmed) return null;
      if (trimmed === this.SUB_NULL_PARAM || trimmed === "__NULL__") return "";
      return trimmed;
    } catch (error) {
      console.error("No se pudo obtener el subdominio desde la URL:", error);
      return null;
    }
  },

  bindEvents() {
    const { elements } = this;

    // Navegación del wizard
    elements.prevBtn.on('click', () => this.goTo(this.currentStep - 1));
    elements.nextBtn.on('click', () => { // <-- MODIFICADO
      if (this.isStepDirty) {
        this.handleSaveClick(true); // Guardar y luego navegar
      } else if (this.validateStep(this.currentStep)) {
        if (this.currentStep < this.TOTAL_STEPS) {
          this.goTo(this.currentStep + 1);
        }
      }
    });

    elements.wizardSteps.on('click', '.nav-link', (e) => {
      const target = Number(e.currentTarget.getAttribute('data-goto'));
      if (target > this.currentStep && !this.validateStep(this.currentStep)) return;
      this.goTo(target);
    });

    // Eventos del modal
    elements.modal.on('show.bs.modal', () => this.prepareSubdominioBeforeShow());
    elements.modal.on('shown.bs.modal', () => this.onShow());
    elements.modal.on('hidden.bs.modal', () => this.onHide());
    elements.reportBtn.on('click', () => this.showReport());
    elements.downloadTerminosBtn.on('click', () => this.downloadTermsExcel());

    // Detectar cambios en los formularios para habilitar/deshabilitar botones
    const trackableInputs = elements.detalleInput
      .add(elements.entregableInput)
      .add(elements.dominioNombreInput)
      .add(elements.subdominioSelect)
      .add($('#detalle-descripcion'))
      .add($('#detalle-estado'))
      .add($('#detalle-activo'))
      .add($('#detalle-tipo'))
      .add($('#det_inp_especialista'))
      .add($('#det_inp_sponsor'))
      .add($('#det_inp_ingeniero'));

    trackableInputs.on('input change', () => this.markStepAsDirty());


    // Actualizar tí­tulo
    $('#detalle-descripcion').on('input', () => this.setModalTitle());

    // Lógica de fuentes (typeahead + selects)
    const { fuentes } = this.elements;
    const handleAddFuente = async (clave, opts = {}) => {
      const normalized = (clave || '').trim();
      const { skipSync, idFuente = null } = opts;
      if (!normalized) return;
      if (normalized.length > 255) {
        alert('La clave de la fuente supera los 255 caracteres.');
        return;
      }
      if (!skipSync) {
        await this.setFuenteFieldsFromClave(normalized);
      }
      if (!this.fuentesEnEdicion.includes(normalized)) {
        this.fuentesEnEdicion.push(normalized);

        if (!this.mapaFuentes) this.mapaFuentes = {};

        if (idFuente) {
          this.mapaFuentes[normalized] = idFuente;
        }
        else if (!(normalized in this.mapaFuentes)) {
          this.mapaFuentes[normalized] = null;
        }

        const currentId = this.mapaFuentes[normalized];
        if (currentId) {
          const indexDel = this.fuentesParaDesactivar.indexOf(currentId);
          if (indexDel > -1) {
            this.fuentesParaDesactivar.splice(indexDel, 1);
          }
        }
        this.markStepAsDirty(); // Marcar como sucio al agregar fuente
        this.renderFuentes();
      } else {
        alert('Esa fuente ya esta en la lista.');
      }
    };
    this.fuenteTypeahead = new FuenteTypeahead(
      { input: fuentes.input, suggestions: fuentes.suggestions, btnAdd: null },
      handleAddFuente,
      { autoAddOnSelect: false, onSelect: (val) => this.setFuenteFieldsFromClave(val) }
    );
    this.fuentesManager = new FuentesManager(
      { servidor: fuentes.servidor, base: fuentes.base, esquema: fuentes.esquema, tabla: fuentes.tabla, btnAdd: fuentes.btnAdd },
      handleAddFuente
    );

    const addFuenteFromUi = async () => {
      const s = fuentes.servidor.val();
      const b = fuentes.base.val();
      const e = fuentes.esquema.val();
      const t = fuentes.tabla.val();
      try {
        this.setAddFuenteBtnLoading(true);
        if (s && b && e && t) {
          await handleAddFuente(`${s}.${b}.${e}.${t}`, { skipSync: true, idFuente: null });
          return;
        }
        if ((fuentes.input.val() || '').trim()) {
          if (this.fuenteTypeahead && typeof this.fuenteTypeahead.handleAdd === 'function') {
            this.fuenteTypeahead.handleAdd();
          }
          return;
        }
        alert('Usa la busqueda rapida o completa Servidor/Base/Esquema/Tabla antes de agregar.');
      } catch (error) {
        console.error('Error al agregar fuente desde UI:', error);
        alert('No se pudo agregar la fuente. Intenta nuevamente.');
      } finally {
        this.setAddFuenteBtnLoading(false);
      }
    };
    if (fuentes.btnAdd && fuentes.btnAdd.length) {
      fuentes.btnAdd.off('click.fuente click.fuentesManager').on('click.detalleFuentes', addFuenteFromUi);
    }

    elements.listaFuentes.on('click', '.btn-del-fuente', (e) => { // <-- MODIFICADO
      const $li = $(e.currentTarget).closest('li');
      const clave = $li.data('clave');
      const idFuente = (this.mapaFuentes && this.mapaFuentes[clave])
        ? this.mapaFuentes[clave]
        : $li.data('id-fuente');

      // Usar el modal de confirmación
      $('#confirmDeleteModalBody').text('¿Estás seguro de que quieres quitar esta fuente del caso de uso');
      $('#confirmDeleteModal').modal('show');

      $('#btnConfirmDelete').off('click').on('click', () => {
        $('#confirmDeleteModal').modal('hide');

        if (idFuente && !this.fuentesParaDesactivar.includes(idFuente)) {
          this.fuentesParaDesactivar.push(idFuente);
        }

        const index = this.fuentesEnEdicion.indexOf(clave);
        if (index > -1) {
          this.fuentesEnEdicion.splice(index, 1);
        }
        this.markStepAsDirty(); // Marcar como sucio al eliminar fuente
        this.renderFuentes();
      });
    });

    // Botón de guardar
    elements.saveBtn.on('click', () => this.handleSaveClick());

    // --- Lógica de Responsables Adicionales ---
    const { responsables } = this.elements;
    EmpleadoUtils.attachEmpleadoTypeahead(
      'det_inp_responsable_adic',
      'sug_det_inp_responsable_adic',
      'det_cod_responsable_adic'
    );

    responsables.btnAdd.on('click', async () => {
      const codEmpleado = responsables.codEmpleado.val();
      const nombreEmpleado = responsables.inpEmpleado.val();
      const rol = responsables.rolSelect.val();
      const idCaso = Number($('#detalle-id').val());
      const usuarioCode = SharePointUtils.getEmployeeCodeByUser(window.current_user);

      if (!codEmpleado || !nombreEmpleado) {
        alert('Por favor, selecciona un empleado válido.');
        return;
      }

      // Validación para no agregar duplicados (considerando activos)
      const yaExiste = this.responsablesEnEdicion.some(resp =>
        String(resp.cod_empleado).toLowerCase() === String(codEmpleado).toLowerCase() &&
        String(resp.rol).toLowerCase() === String(rol).toLowerCase()
      );

      if (yaExiste) {
        alert('Este responsable con el rol seleccionado ya ha sido agregado y está activo.');
        return;
      }

      try {
        responsables.btnAdd.prop('disabled', true);
        const nowSql = () => new Date().toISOString().slice(0, 23).replace('T', ' ');

        const nuevoResponsable = {
          ID_CASO_USO: idCaso,
          USUARIO_ESTRUCTURA: codEmpleado,
          USUARIO_ROL: rol,
          USUARIO_CREACION: usuarioCode,
          FEC_CREACION: nowSql(),
          SN_ACTIVO: 1
        };

        const result = await ApiService.insert(
          'PROCESOS_BI.DBO.T_CASOS_USO_ESTRUCTURA',
          nuevoResponsable
        );

        await this.loadResponsablesDelCaso(); // Recargamos la lista completa desde la BD
        showNotification("top", "center", "success", "Responsable asignado correctamente.", 1500);

      } catch (error) {
        console.error("Error al asignar responsable:", error);
        alert("No se pudo asignar el responsable. Error: " + error.message);
      } finally {
        responsables.btnAdd.prop('disabled', false);
        responsables.inpEmpleado.val('').focus();
        responsables.codEmpleado.val('');
      }
    });

    responsables.lista.on('click', '.btn-del-responsable', (e) => {
      const index = $(e.currentTarget).data('index');
      this.handleDeleteResponsable(index);
    });

    // --- INICIO: Lógica para editar rol de responsable ---
    responsables.lista.on('click', '.btn-edit-responsable', (e) => {
      const index = $(e.currentTarget).data('index');
      // Poner solo este item en modo edición
      this.responsablesEnEdicion.forEach((resp, i) => {
        resp.isEditing = (i === index);
      });
      this.renderResponsables();
    });

    responsables.lista.on('click', '.btn-save-responsable', async (e) => { // Make it async
      const index = $(e.currentTarget).data('index');
      const respToUpdate = this.responsablesEnEdicion[index];
      const nuevoRol = $(e.currentTarget).closest('li').find('select').val(); // Get the new role from the select
      const usuarioCode = SharePointUtils.getEmployeeCodeByUser(window.current_user);
      const fechaModificacion = new Date().toISOString().slice(0, 23).replace('T', ' ');

      if (respToUpdate.rol === nuevoRol) {
        // No change in role, just exit edit mode
        respToUpdate.isEditing = false;
        this.renderResponsables();
        return;
      }

      // --- INICIO: Validación de duplicado al editar ---
      const yaExisteConEseRol = this.responsablesEnEdicion.some((resp, i) =>
        i !== index && // No compararse consigo mismo
        resp.cod_empleado === respToUpdate.cod_empleado &&
        resp.rol === nuevoRol
      );

      if (yaExisteConEseRol) {
        alert('Este empleado ya tiene asignado el rol seleccionado en otro registro.');
        return; // Detener la operación
      }
      // --- FIN: Validación de duplicado al editar ---

      try {
        await ApiService.update(
          'PROCESOS_BI.DBO.T_CASOS_USO_ESTRUCTURA',
          { USUARIO_ROL: nuevoRol, FEC_MODIFICACION: fechaModificacion, USUARIO_MODIFICACION: usuarioCode },
          `ID_ESTRUCTURA = ${respToUpdate.id_responsable}`
        );
        respToUpdate.rol = nuevoRol; // Update local state after successful API call
        respToUpdate.isEditing = false;
        this.markStepAsDirty();
        this.renderResponsables();
        showNotification("top", "center", "success", "Rol actualizado correctamente.", 1500);
      } catch (error) {
        console.error("Error al actualizar el rol:", error);
        alert("No se pudo actualizar el rol. Error: " + error.message);
      }
    });
    // --- FIN: Lógica para editar rol de responsable ---

    const lockTipoTermino = () => {
      const tipoSelect = $("#tipo");
      tipoSelect.html(`<option value="TERMINO" selected>Témino</option>`);
      tipoSelect.val("TERMINO");
    };

    // Botón para abrir modal de nuevo témino en el paso 5
    const openAtributoModalHandler = () => {
      listenerbtnAddAtributo();
      addAtributo();
      // En Casos de Uso solo permitimos crear téminos
      lockTipoTermino();
      $("#tipo").trigger('change');

      const dominioSelect = this.elements.dominioAtributo;
      const subdominioSelect = $('#nombresub');

      dominioSelect.off('change.wizardDetalle').on('change.wizardDetalle', async () => {
        const idDominio = dominioSelect.val();
        subdominioSelect.empty().trigger('change');

        if (idDominio) {
          try {
            const casosUso = await ApiService.query({
              campos: "ID_CASO_USO AS id, DESCRIPCION_CASO_USO AS text",
              origen: "PROCESOS_BI.DBO.T_CASOS_USO_ANALITICA",
              condicion: `ID_DOMINIO = ${idDominio}`
            });

            subdominioSelect.append(new Option('', ''));
            casosUso.forEach(caso => {
              subdominioSelect.append(new Option(caso.text, caso.id, false, false));
            });

            const idCasoUsoActual = Number($('#detalle-id').val());
            if (idCasoUsoActual && casosUso.some(c => Number(c.id) === idCasoUsoActual)) {
              subdominioSelect.val(idCasoUsoActual).trigger('change');
            }
          } catch (error) {
            console.error("Error al cargar los casos de uso para el subdominio:", error);
          }
        }
      });

      const idDominioActual = $('#detalle-dominio-nombre').val();
      if (idDominioActual) {
        dominioSelect.val(idDominioActual).trigger('change');
      }
    };

    $('#btnAbrirModalAtributoDetalle').on('click', openAtributoModalHandler);
    $('#btnAbrirModalAtributoDetallePrincipal').on('click', openAtributoModalHandler);

    // Evento para refrescar y asignar automaticamente cuando se crea un termino nuevo
    $(document).on('terminoCreado.wizardDetalle', (event, data) => {
      const idCasoUso = Number($('#detalle-id').val());
      const terminoId = data && data.id;
      if (!idCasoUso) return;
      if (terminoId) {
        this.handleAsignarTerminoRecienCreado(idCasoUso, terminoId);
      } else {
        this.loadAndRenderTerms();
      }
    });

    // Botón para asignar téminos existentes
    elements.btnAsignarTerminos.on('click', () => this.handleAsignarTerminos());

    // Delegación de eventos para eliminar un témino de la lista
    elements.listaTerminos.on('click', '.btn-delete-term', (e) => this.handleDeleteTerm(e));
    elements.listaTerminos.on('click', '.btn-edit-term', (e) => this.handleEditTerm(e, this));

    // Evento para el buscador de téminos
    elements.buscarTerminoInput.on('keyup', (e) => {
      const searchTerm = $(e.currentTarget).val().toLowerCase();
      elements.listaTerminos.find('li').each(function () {
        const termText = $(this).text().toLowerCase();
        const isVisible = termText.includes(searchTerm);
        $(this).toggle(isVisible);
      });
    });

    // Inicializar Select2 para el modal de atributos
    elements.modalAtributo.on('shown.bs.modal', () => {
      if (!elements.dominioAtributo.data('select2')) {
        elements.dominioAtributo.select2({ theme: "bootstrap", placeholder: "Seleccione un dominio", dropdownParent: elements.modalAtributo });
      }
      if (!$('#nombresub').data('select2')) {
        $('#nombresub').select2({ theme: "bootstrap", placeholder: "Seleccione un subdominio", dropdownParent: elements.modalAtributo });
      }
    });
  },

  async onShow() {
    this.setModalTitle();
    this.setReportReady(false);
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('open_reporte') === '1') {
        this.requestAutoOpenReport(true);
      }
    } catch (e) { }
    this.setupActivoConfirmation();
    this.fuentesParaDesactivar = [];
    this.responsablesParaDesactivar = [];
    this.terminosActuales = [];
    const urlSubdominio = this.getSubdominioFromUrl();
    let pendingSubdominio = this.pendingSubdominioValue != null ? this.pendingSubdominioValue : $('#detalle-subdominio').val();
    if (!pendingSubdominio && urlSubdominio) {
      pendingSubdominio = urlSubdominio;
      this.pendingSubdominioValue = urlSubdominio;
    }
    await this.initSubdominioSelect();
    this.setSubdominioPreset(pendingSubdominio);
    await this.refreshSubdominios();
    await this.loadInitialData();
    // Reforzar dominio preseleccionado si viene desde main.js
    const domAttr = this.elements.dominioNombreInput.attr('data-id-dominio');
    if (domAttr) {
      this.elements.dominioNombreInput
        .val(String(domAttr).trim())
        .trigger('change')
        .trigger('change.select2');
      this.elements.dominioNombreInput.removeAttr('data-id-dominio');
    }
    this.setSubdominioPreset(pendingSubdominio);
    this.goTo(1); // <-- Mover goTo(1) para después de cargar los datos

    this.initTerminosSearch(); // Iniciar el buscador de términos
    this.applyPermissionsForUser();
    this.loadAndRenderTerms(); // Iniciar la carga de términos al abrir el modal
  },

  onHide() {
    this.goTo(1);
    this.elements.listaFuentes.empty();
    this.avancesCache.clear();
    this.fuentesEnEdicion = [];
    this.mapaFuentes = {};
    if (this.fuenteTypeahead) this.fuenteTypeahead.reset();
    if (this.fuentesManager) this.fuentesManager.resetDownstream(0);
    this.elements.responsables.lista.empty();
    this.responsablesEnEdicion = [];
    ['especialista', 'sponsor', 'ingeniero'].forEach(rol => {
      this.elements.dominioNombreInput.val('');
      $('#det_inp_' + rol).val('');
      $('#detalle-cod-' + rol).val('');
      $('#det_' + rol + '_nombre').text('-');
    });
    this.pendingSubdominioValue = null;
    this.setReportReady(false);
    SeguimientoManager.editorInstance.setData('');
  },

  async loadInitialData() {
    if (this.fuenteTypeahead) this.fuenteTypeahead.reset();
    const loadResponsables = (async () => {
      try {
        const empleados = await EmpleadoUtils.loadEmpleadosOnce();
        ['especialista', 'sponsor', 'ingeniero'].forEach(rol => {
          const code = $(`#detalle-cod-${rol}`).val() || $(`#detalle-${rol}`).val();
          $(`#detalle-cod-${rol}`).val(code);
          EmpleadoUtils.attachEmpleadoTypeahead(`det_inp_${rol}`, `sug_det_inp_${rol}`, `detalle-cod-${rol}`, `det_${rol}_nombre`);
          const emp = empleados.find(e => String(e.codigo) === String(code));
          if (emp) {
            $(`#det_inp_${rol}`).val(emp.nombreCompleto || '');
            $(`#det_${rol}_nombre`).text(emp.nombreCompleto || '-');
          }
        });
      } catch (e) {
        console.error("Error al configurar el typeahead de detalles:", e);
      }
    })();

    // Cargar y configurar el select de dominios
    await this.populateDomainSelectDetalle();

    const loadFuentes = this.loadFuentesDelCaso();
    const loadRespAdicionales = this.loadResponsablesDelCaso();
    const loadServers = this.fuentesManager ? this.fuentesManager.loadServers() : Promise.resolve();
    await Promise.all([loadResponsables, loadFuentes, loadServers, loadRespAdicionales]);
  },

  async populateDomainSelectDetalle() {
    const select = this.elements.dominioNombreInput;
    if (!select || !select.length) return;
    try {
      const data = await ApiService.query({
        campos: "ID_DOMINIO AS id, codigo_dominio AS codigo, descripcion_dominio AS descripcion",
        origen: "PROCESOS_BI.DBO.T_MAPA_DOMINIOS",
        condicion: "1=1"
      });
      select.empty().append(new Option('Seleccione un dominio...', ''));
      (data || []).forEach(d => {
        select.append(new Option(d.descripcion || '', d.id));
      });

      if (!select.data('select2')) {
        select.select2({ theme: "bootstrap", dropdownParent: this.elements.modal, width: '100%' });
      } else {
        select.trigger('change.select2');
      }

      // Determinar ID de dominio a preseleccionar
      let idDominioPreseleccionado = select.attr('data-id-dominio') || select.val();
      if (!idDominioPreseleccionado) {
        const idCaso = Number($('#detalle-id').val());
        if (idCaso) {
          try {
            const row = await ApiService.query({
              campos: 'ID_DOMINIO',
              origen: 'PROCESOS_BI.DBO.T_CASOS_USO_ANALITICA',
              condicion: `ID_CASO_USO = ${idCaso}`
            });
            if (row && row.length && row[0].ID_DOMINIO) {
              idDominioPreseleccionado = row[0].ID_DOMINIO;
              select.attr('data-id-dominio', idDominioPreseleccionado);
            }
          } catch (e) {
            console.error('No se pudo obtener el dominio del caso de uso:', e);
          }
        }
      }

      if (idDominioPreseleccionado) {
        const valStr = String(idDominioPreseleccionado).trim();
        select.val(valStr).trigger('change').trigger('change.select2');
        select.removeAttr('data-id-dominio');
      }
    } catch (e) {
      console.error("Error cargando dominios en detalles:", e);
    }
  },

  async setFuenteFieldsFromClave(clave) {
    if (!clave || !this.fuentesManager || !this.elements.fuentes) return;
    const parts = (clave || '').split('.');
    if (parts.length < 4) return;
    const [servidorVal, baseVal, esquemaVal, tablaVal] = parts;
    const { servidor, base, esquema, tabla } = this.elements.fuentes;
    const ensureOption = ($sel, val) => {
      if (!$sel || !$sel.length || !val) return;
      if ($sel.find(`option[value="${val}"]`).length === 0) {
        $sel.append(new Option(val, val, true, true));
      }
      $sel.val(val).trigger('change');
    };
    const fm = this.fuentesManager;
    if (!fm) return;
    const prevSuppress = fm.suppressCascade;
    try {
      fm.suppressCascade = false;
      await fm.loadServers();
      fm.suppressCascade = true;
      ensureOption(servidor, servidorVal);
      fm.suppressCascade = false;
      if (!servidorVal) return;

      await fm.loadDatabases();
      fm.suppressCascade = true;
      ensureOption(base, baseVal);
      fm.suppressCascade = false;
      if (!baseVal) return;

      await fm.loadSchemas();
      fm.suppressCascade = true;
      ensureOption(esquema, esquemaVal);
      fm.suppressCascade = false;
      if (!esquemaVal) return;

      await fm.loadTables();
      fm.suppressCascade = true;
      ensureOption(tabla, tablaVal);
      fm.suppressCascade = false;
    } catch (error) {
      console.error('No se pudieron sincronizar los selectores de fuente:', error);
    } finally {
      fm.suppressCascade = prevSuppress;
    }
  },

  async initSubdominioSelect() {
    const { subdominioSelect, modal } = this.elements;
    if (!subdominioSelect || !subdominioSelect.length) return;
    if (!subdominioSelect.data('select2')) {
      subdominioSelect.select2({
        theme: "bootstrap",
        dropdownParent: modal,
        width: '100%',
        placeholder: "Seleccione o escriba un subdominio...",
        allowClear: true,
        tags: true, // Permitir registrar subdominios nuevos desde el input
        createTag: (params) => {
          const term = (params.term || '').trim();
          if (!term) return null;
          const exists = subdominioSelect
            .find('option')
            .filter((_, opt) => (opt.value || '').toLowerCase() === term.toLowerCase())
            .length > 0;
          return exists ? null : { id: term, text: term, newTag: true };
        },
        dropdownCssClass: 'select2-subdominio-dropdown'
      });
    }
  },

  prepareSubdominioBeforeShow() {
    const pendingValue = $('#detalle-subdominio').val();
    if (!pendingValue) return;
    this.initSubdominioSelect().then(() => {
      this.setSubdominioPreset(pendingValue);
    });
  },

  async refreshSubdominios(force = true) {
    if (force) this.subdominiosCache = new Map();
    await this.loadAndPopulateSubdominios(force);
  },

  async loadAndPopulateSubdominios(force = false) {
    const lista = await this.fetchSubdominios(force);
    this.populateSubdominioOptions(lista);
    return lista;
  },

  populateSubdominioOptions(lista) {
    const { subdominioSelect } = this.elements;
    if (!subdominioSelect || !subdominioSelect.length) return;
    const currentValue = subdominioSelect.val();
    subdominioSelect.empty().append(new Option('', ''));
    lista.forEach(item => {
      subdominioSelect.append(new Option(item.nombre, item.nombre));
    });
    const desiredValue = (this.pendingSubdominioValue || currentValue || "").toString();
    let finalValue = '';
    if (desiredValue) {
      const exists = subdominioSelect
        .find('option')
        .filter((_, option) => option.value === desiredValue)
        .length > 0;
      finalValue = exists ? desiredValue : '';
      if (!exists) {
        subdominioSelect.append(new Option(desiredValue, desiredValue, true, true));
        finalValue = desiredValue;
      }
    }
    subdominioSelect.val(finalValue);
    if (this.pendingSubdominioValue && finalValue) {
      this.pendingSubdominioValue = null;
    }
    subdominioSelect.trigger('change');
    subdominioSelect.trigger('change.select2');
  },

  async fetchSubdominios(force = false, dominioId = null) {
    const cacheKey = dominioId || '__ALL__';
    if (!force && this.subdominiosCache.has(cacheKey)) {
      return this.subdominiosCache.get(cacheKey);
    }
    try {
      const condicionDominio = dominioId ? `AND id_dominio = ${Number(dominioId)}` : '';
      const data = await ApiService.query({
        campos: "txt_desc_subdominio",
        origen: "PROCESOS_BI.DBO.t_subdominios",
        condicion: `sn_activo = 1 ${condicionDominio}`
      });

      const parsed = (data || []).map(d => ({
        txt_desc_subdominio: (d.txt_desc_subdominio == null ? '' : d.txt_desc_subdominio).toString().trim(),
      })).filter(d => d.txt_desc_subdominio !== '');

      this.subdominiosCache.set(cacheKey, parsed);
      return parsed;

    } catch (error) {
      console.error("Error cargando subdominios (nuevo caso):", error);
      return [];
    }
  },

  injectSubdominioStyles() {
    if (this._subdominioStylesInjected) return;
    const css = `
      .select2-subdominio-dropdown .select2-results__option--highlighted {
      background-color: #D2006E !important;
      color: #fff !important;
    }
    `;
    $('head').append(`<style>${css}</style>`);
    this._subdominioStylesInjected = true;
  },

  parseFuenteKey(clave = "") {
    const p = (clave || "").split(".");
    if (p.length < 4) return null;
    const [srv, db, sch, tbl] = p;
    return {
      srv: (srv || "").toUpperCase(),
      db: (db || "").toUpperCase(),
      sch: (sch || "DBO").toUpperCase(),
      tbl: (tbl || "").toUpperCase(),
      key: `${(srv || "").toUpperCase()}_${(sch || "DBO").toUpperCase()}_${(db || "").toUpperCase()}_${(tbl || "").toUpperCase()}`
    };
  },

  getAvanceTooltip(meta) {
    if (!meta || !meta.key) return null;
    const key = meta.key;
    const dataset = Array.isArray(window.info_tecnica)
      ? window.info_tecnica
      : (Array.isArray(window.campos) ? window.campos : []);

    const resolvePlataforma = () => {
      const spCache = window.tablas_oficiales || (typeof getInfoTablasOficialesTemp === "function" ? getInfoTablasOficialesTemp() : null);
      if (spCache && spCache[key]) {
        return spCache[key].txt_fuente_aprovisionamiento || spCache[key].plataforma || "";
      }
      if (typeof getInfoTablasOficialesTxt === "function") {
        const txtCache = getInfoTablasOficialesTxt() || {};
        if (txtCache[key]) {
          return txtCache[key].txt_fuente_aprovisionamiento || txtCache[key].plataforma || "";
        }
      }
      return "";
    };

    const filtro = {
      plataforma: resolvePlataforma(),
      servidor: meta.srv,
      base: meta.db,
      esquema: meta.sch,
      tabla: meta.tbl
    };

    if (dataset.length && typeof window.calcularAvanceTabla === "function") {
      const avance = window.calcularAvanceTabla(dataset, filtro);
      if (avance !== null && typeof avance !== "undefined") {
        this.avancesCache.set(key, avance);
        const label = `${avance}`.includes("%") ? avance : `${avance}%`;
        return `Documentación de la tabla: ${label}`;
      }
    }

    const lookupAvance = (lookupKey) => {
      let avance = null;
      const spCache = window.tablas_oficiales || (typeof getInfoTablasOficialesTemp === "function" ? getInfoTablasOficialesTemp() : null);
      if (spCache && spCache[lookupKey]) {
        avance = spCache[lookupKey].avance || spCache[lookupKey].avance_porcentaje || null;
      }
      if (!avance && typeof getInfoTablasOficialesTxt === "function") {
        const baseTXT = getInfoTablasOficialesTxt() || {};
        if (baseTXT[lookupKey]) avance = baseTXT[lookupKey].avance || null;
      }
      this.avancesCache.set(key, avance);
      return avance;
    };

    const avance = lookupAvance(key);
    if (!avance) return null;
    this.avancesCache.set(key, avance);
    const label = `${avance}`.includes("%") ? avance : `${avance}%`;
    return `Documentación de la tabla: ${label}`;
  },

  goTo(step) {
    this.currentStep = Math.min(Math.max(step, 1), this.TOTAL_STEPS);
    const { elements } = this;
    elements.sections.addClass('d-none').removeClass('active');
    elements.sections.filter(`[data-step="${this.currentStep}"]`).removeClass('d-none').addClass('active');
    elements.wizardSteps.find('.nav-link').removeClass('active');
    elements.wizardSteps.find(`.nav-link[data-goto="${this.currentStep}"]`).addClass('active');
    elements.prevBtn.toggleClass('d-none', this.currentStep === 1);
    this.markStepAsClean(); // Cada vez que navegamos, el paso se considera "limpio".
  },

  /**
   * Actualiza la visibilidad de los botones Siguiente/Guardar.
   */
  updateButtonStates() {
    const { nextBtn, saveBtn } = this.elements;
    const isLastStep = this.currentStep === this.TOTAL_STEPS;

    if (this.isStepDirty) {
      nextBtn.addClass('d-none');
      saveBtn.removeClass('d-none');
      saveBtn.text(isLastStep ? 'Guardar y Finalizar' : 'Guardar Cambios');
    } else {
      saveBtn.addClass('d-none');
      nextBtn.removeClass('d-none');
    }
    // El botón "Anterior" no se ve afectado por el estado "dirty"
    this.elements.prevBtn.toggleClass('d-none', this.currentStep === 1);
  },
  markStepAsDirty() { this.isStepDirty = true; this.updateButtonStates(); },
  markStepAsClean() { this.isStepDirty = false; this.updateButtonStates(); },

  async showReport() {
    const html = await this.buildReportHtml();
    this.openReportPreview(html, 'Resumen del caso de uso');
  },

  async buildReportHtml() {
    const estadoText = $('#detalle-estado option:selected').text() || $('#detalle-estado').val() || 'Sin estado';
    const subdominioOption = $('#detalle-subdominio option:selected');
    const subdominioText = subdominioOption.length
      ? subdominioOption.text().trim()
      : ($('#detalle-subdominio').val() || 'Sin subdominio');

    // Usar los datos completos en memoria (tí­tulo + descripción) y caer al DOM si aíºn no están cargados.
    const terminos = (this.terminosActuales && this.terminosActuales.length
      ? this.terminosActuales
      : $('#listaTerminosDetalle li').map(function () {
        const $li = $(this);
        return {
          nombre: ($li.find('h6').text() || '').trim() || ($li.text() || '').trim(),
          descripcion: ($li.find('p').text() || '').trim()
        };
      }).get()
    ).map((t) => ({
      nombre: (t.nombre || t.title || t.nombre_metad || '').toString().trim(),
      descripcion: (t.descripcion || t.desc || t.descripcion_metad || '').toString().trim()
    })).filter(t => {
      const name = (t.nombre || '').toLowerCase();
      if (!name && !t.descripcion) return false;
      if (name.includes('cargando')) return false;
      if (name.includes('sin t') && name.includes('rmin')) return false; // descarta placeholder "Sin téminos..."
      return true;
    });
    const terminosList = terminos.map(t => {
      const nombre = t.nombre || 'Témino';
      const desc = t.descripcion || '';
      return desc ? `${nombre}: ${desc}` : nombre;
    });

    const responsablesPrincipales = [
      ['Especialista de Gobierno de Datos', $('#det_inp_especialista').val()],
      ['Sponsor', $('#det_inp_sponsor').val()],
      ['Ingeniero Responsable', $('#det_inp_ingeniero').val()],
    ];

    const responsablesAdicionales = this.responsablesEnEdicion.map(resp => ({
      name: resp.nombre || resp.cod_empleado || 'Responsable',
      role: resp.rol || ''
    }));

    const interacciones = this.collectInteracciones();

    const responsRows = responsablesPrincipales.map(([label, value]) => `
      <tr>
        <td class="k" style="width:40%">${this.escapeHtml(label)}</td>
        <td>${this.escapeHtml(value || "-")}</td>
      </tr>
    `).join("");

    const generalInfo = [
      ['Descripcin', $('#detalle-descripcion').val()],
      ['Estado', estadoText],
      ['Activo', $('#detalle-activo option:selected').text() || $('#detalle-activo').val()],
      ['Dominio', $('#detalle-dominio-nombre option:selected').text() || $('#detalle-dominio-nombre').val()],
      ['Subdominio', subdominioText],
      ['Detalle', $('#detalle-detalle_caso_uso').val()],
      ['Entregable', $('#detalle-entregable_caso_uso').val()],
    ];

    const summaryItems = [
      { label: 'Fuentes', value: this.fuentesEnEdicion.length || 0, icon: 'simple-icon-layers', accent: '#7c3aed' },
      { label: 'Téminos', value: terminos.length || 0, icon: 'simple-icon-book-open', accent: '#d97706' },
      { label: 'Responsables', value: (responsablesPrincipales.filter(r => r[1]).length + responsablesAdicionales.length) || 0, icon: 'simple-icon-people', accent: '#047857' },
    ];

    const titleCandidate = ($('#detalle-descripcion').val() || '').trim() || 'Caso de uso';
    const title = titleCandidate;
    const summaryHtml = (summaryItems.length
      ? summaryItems
      : [{ label: "Sin datos", value: "-", icon: "simple-icon-info", accent: "#6b7280" }]
    ).map((item) => `
      <div class="hero-card" style="--hero-icon-color:${item.accent || "#6b7280"}">
        <span class="hero-icon"><i class="${this.escapeHtml(item.icon || "simple-icon-info")}"></i></span>
        <div>
          <p class="hero-card__value">${this.escapeHtml(item.value != null ? item.value : "-")}</p>
          <p class="hero-card__label">${this.escapeHtml(item.label)}</p>
        </div>
      </div>
    `).join("");

    const fuentesProcesadas = await Promise.all(this.fuentesEnEdicion.map(async (fuenteRaw) => {
      if (!fuenteRaw) return null;

      const parts = fuenteRaw.split('.');
      const servidor = parts[0] || "-";
      const base = parts[1] || "-";
      const esquema = parts[2] || "-";
      const tabla = parts[3] || "-";

      const meta = this.parseFuenteKey(`${servidor}.${base}.${esquema}.${tabla}`);
      const avance = this.avancesCache.get(meta.key);
      const docStr = avance !== null ? `${avance}%` : "0%";

      let calidadStr = "-";
      try {
        const infoCalidad = await this.getCompletitudPorFuente(fuenteRaw);
        if (infoCalidad && infoCalidad.pct != null) {
          calidadStr = `${Number(infoCalidad.pct).toFixed(0)}%`;
        }
      } catch (error) {
        console.warn("No se pudo obtener calidad para:", fuenteRaw);
      }

      return `${servidor}.${base}.${esquema}.${tabla}.${docStr}.${calidadStr}`;
    }));

    const reportPayload = {
      title,
      subtitle: 'Ficha consolidada del caso de uso',
      summaryItems,
      generalInfo,
      responsablesPrincipales,
      responsablesAdicionales,
      fuentes: fuentesProcesadas.filter(f => f !== null),
      terminos,
      interacciones
    };

    const template = window.CasoUsoReportTemplate;
    if (template && typeof template.build === "function") {
      return template.build(reportPayload);
    }

    const pairs = (rows = []) => {
      const data = rows.length ? rows : [["Sin datos", ""]];
      const cells = data
        .map(([label, value]) => `
          <tr>
            <td class="k">${this.escapeHtml(label)}</td>
            <td>${this.escapeHtml(value || "-")}</td>
          </tr>`).join("");
      return `
        <div class="kv-wrap">
          <table class="kv-table">
            <tbody>${cells}</tbody>
          </table>
        </div>`;
    };

    const list = (items = [], emptyLabel = "Sin datos") => {
      const normalized = Array.isArray(items) ? items : [];
      const rendered = normalized
        .map((item) => (item || "").toString().trim())
        .filter(Boolean)
        .map((item) => `<li>${this.escapeHtml(item)}</li>`)
        .join("");
      if (!rendered) {
        return `<div class="muted">${this.escapeHtml(emptyLabel)}</div>`;
      }
      return `<ul class="rep-list">${rendered}</ul>`;
    };

    const adicionalesHtml = (responsablesAdicionales.length
      ? `<div class="block-title">Responsables adicionales</div>
          <div class="kv-wrap">
            <table class="kv-table">
              <tbody>
                ${responsablesAdicionales.map(({ name, role }) => `
                  <tr>
                    <td class="k" style="width:40%">${this.escapeHtml(role || "-")}</td>
                    <td>${this.escapeHtml(name || "-")}</td>
                  </tr>`).join("")}
              </tbody>
            </table>
          </div>`
      : `<div class="muted">Sin responsables adicionales</div>`
    );

    const interaccionesHtml = (() => {
      if (!interacciones || interacciones.length === 0) {
        return `<div class="muted">Sin interacciones registradas</div>`;
      }
      const rows = interacciones.map(({ autor, fecha, mensaje, adjunto }) => {
        const msg = this.escapeHtml(mensaje || '').replace(/\\n/g, '<br>');
        const link = adjunto ? `<div class="small text-muted">Adjunto: ${this.escapeHtml(adjunto)}</div>` : '';
        return `
          <tr>
            <td style="width:20%">${this.escapeHtml(fecha || '-')}</td>
            <td style="width:20%">${this.escapeHtml(autor || '-')}</td>
            <td>${msg}${link}</td>
          </tr>`;
      }).join("");
      return `
        <div class="kv-wrap">
          <table class="kv-table">
            <thead>
              <tr>
                <td class="k" style="width:20%">Fecha</td>
                <td class="k" style="width:20%">Nombre</td>
                <td class="k">Mensaje</td>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>`;
    })();

    return `
      <div class="rep-page">
        <div class="rep-hero">
          <div class="rep-hero__text">
            <p class="rep-kicker">Vista previa</p>
            <h1>${this.escapeHtml(title)}</h1>
            <p class="rep-subtitle">${this.escapeHtml(reportPayload.subtitle)}</p>
          </div>
          <div class="rep-hero-grid">
            ${summaryHtml}
          </div>
        </div>

        <div class="rep-section">
          <h2>Informacin general</h2>
          ${pairs(generalInfo)}
        </div>

        <div class="rep-section rep-grid">
          <div class="rep-card">
            <h3>Responsables</h3>
            <div class="kv-wrap">
              <table class="kv-table">
                <tbody>${responsRows}</tbody>
              </table>
            </div>
            ${adicionalesHtml}
          </div>
          <div class="rep-card rep-card--wide">
            <h3>Fuentes</h3>
            ${list(this.fuentesEnEdicion, "Sin fuentes registradas")}
          </div>
        </div>

        <div class="rep-section">
          <h3>Terminos asociados</h3>
          ${list(terminosList, "Sin terminos asociados")} 
        </div>

        <div class="rep-section">
          <h3>Interacciones</h3>
          ${interaccionesHtml}
        </div>
      </div>
    `;
  },

  collectInteracciones() {
    const primary = $('.seguimiento-card .comentario-text-wrapper').map(function () {
      const $wrapper = $(this);
      const spans = $wrapper.find('span');
      const $mensaje = $wrapper.find('.comentario-text');
      return {
        autor: (spans.eq(0).text() || '').trim(),
        fecha: (spans.eq(1).text() || '').trim(),
        mensaje: ($mensaje.html() || '').trim(),
        adjunto: ($wrapper.find('a').attr('href') || '').trim()
      };
    }).get().filter(x => (x.autor || x.fecha || x.mensaje || x.adjunto));

    if (primary.length) return primary;

    // Fallback: leer directamente del contenedor de comentarios renderizado
    const fallback = $('#seguimiento-comentarios .custom-card').map(function () {
      const $card = $(this);
      const spans = $card.find('span');
      const autor = (spans.eq(0).text() || '').trim();
      const fecha = (spans.eq(1).text() || '').trim();
      const mensaje = (spans.eq(2).text() || '').trim();
      const adj = ($card.find('a[href]').attr('href') || '').trim();
      return (autor || fecha || mensaje || adj) ? { autor, fecha, mensaje, adjunto: adj } : null;
    }).get().filter(Boolean);
    return fallback;
  },

  openReportPreview(html, title = 'Resumen del caso de uso') {
    const win = window.open('', '_blank', 'width=1100,height=800');
    if (!win) {
      alert('No se pudo abrir la vista previa. Habilita los pop-ups para continuar.');
      return;
    }

    const template = window.CasoUsoReportTemplate;
    const styles = template && template.styles ? template.styles : FALLBACK_REPORT_STYLES_DETALLES;
    const caseId = $('#detalle-id').val() || '';
    const shareUrl = (() => {
      try {
        const url = new URL(window.location.href);
        if (caseId) url.searchParams.set('focus_caso', caseId);
        url.searchParams.set('open_reporte', '1');
        return url.toString();
      } catch (e) {
        return window.location.href;
      }
    })();
    const controls = `
      <div style="padding:12px; text-align:right; position:sticky; top:0; background:#f8fafc; border-bottom:1px solid #e5e7eb; display:flex; gap:8px; justify-content:flex-end; align-items:center;">
        <button id="share-report-btn" style="padding:8px 12px; border:1px solid #d1d5db; border-radius:6px; background:#fff; cursor:pointer;">Compartir</button>
        <button id="print-report-btn" style="padding:8px 12px; border:1px solid #d1d5db; border-radius:6px; background:#fff; cursor:pointer;">Imprimir</button>
      </div>
    `;
    win.document.write(`<!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="utf-8">
          <title>${this.escapeHtml(title)}</title>
          <style>${styles}</style>
        </head>
        <body>
          ${controls}
          ${html}
          <script>(
            function(){ 
              const shareLink = ${JSON.stringify(shareUrl)}; 
              const btnShare = document.getElementById("share-report-btn"); 
              const btnPrint = document.getElementById("print-report-btn"); 
                if(btnShare){ 
                  btnShare.addEventListener("click", async function(){ 
                    try { 
                      if (navigator.clipboard && navigator.clipboard.writeText) { 
                        await navigator.clipboard.writeText(shareLink); 
                        alert("Enlace copiado. Comparte para abrir el caso y el reporte."); 
                      } 
                      else { 
                        const temp = document.createElement("textarea"); 
                        temp.value = shareLink; 
                        document.body.appendChild(temp); 
                        temp.select(); 
                        document.execCommand("copy"); 
                        document.body.removeChild(temp); 
                        alert("Enlace copiado. Comparte para abrir el caso y el reporte."); 
                      } 
                    } 
                    catch(e){ 
                      prompt("Copia el enlace para compartir:", shareLink); 
                    } 
                  }); 
                } 
                if(btnPrint){ 
                  btnPrint.addEventListener("click", function(){ 
                    window.print(); 
                  }); 
                } 
                window.addEventListener("unload", function(){ 
                try { 
                  if(window.opener){ 
                    window.opener.postMessage({ type: 'detalleReporteClose' }, '*'); 
                  } 
                }
                catch(e){} 
              });
              })();</script></body></html>`);
    win.document.close();
    win.focus();
  },
  escapeHtml(str) {
    return String(str || '').replace(/[&<>\"']/g, (c) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[c] || c));
  },

  validateStep(step) {
    if (step !== 1) return true;
    const desc = ($('#detalle-descripcion').val() || '').trim();
    if (!desc || desc.length > 400) {
      alert('La descripción es obligatoria y no puede exceder los 400 caracteres.');
      $('#detalle-descripcion').focus();
      return false;
    }
    return true;
  },

  setModalTitle() {
    const baseTitle = 'Detalles del Caso de Uso';
    const desc = ($('#detalle-descripcion').val() || '').trim();
    $('#modalDetallesCasoLabel').text(desc ? `${baseTitle} - ${desc}` : baseTitle);
  },

  // --- Lógica de Fuentes ---
  async loadFuentesDelCaso() {
    this.elements.listaFuentes.html('<li class="list-group-item text-muted">Cargando fuentesâ¦</li>');
    const idCaso = Number($('#detalle-id').val());
    if (!idCaso) {
      this.elements.listaFuentes.html('<li class="list-group-item text-warning">Sin ID de caso</li>');
      return;
    }

    try {
      const data = await this.getFuentesDeCasoCached(idCaso);
      data.forEach(f => {
        const clave = f.clave;
        const id = f.id_fuente;
        if (this.mapaFuentes[clave] === undefined) {
          this.mapaFuentes[clave] = id;
        } else if (this.mapaFuentes[clave] === null && id) {
          this.mapaFuentes[clave] = id;
        }
        if (!this.fuentesEnEdicion.includes(clave)) {
          this.fuentesEnEdicion.push(clave);
        }
      });

      this.renderFuentes();
    } catch (e) {
      console.error('Error cargando fuentes en modal:', e);
      this.elements.listaFuentes.html('<li class="list-group-item text-danger">Error al cargar fuentes</li>');
    }
  },

  renderFuentes() {
    const { listaFuentes } = this.elements;
    listaFuentes.empty();
    const totalFuentes = this.fuentesEnEdicion ? this.fuentesEnEdicion.length : 0;

    // Actualizar el tí­tulo con el contador
    $('#titulo-fuentes-agregadas-detalle').html(`Fuentes agregadas <span class="badge badge-pill badge-primary ml-1">${totalFuentes}</span>`);

    if (!this.fuentesEnEdicion || this.fuentesEnEdicion.length === 0) {
      listaFuentes.append('<li class="list-group-item text-muted">Sin fuentes asociadas.</li>');
      return; // No es necesario continuar si no hay fuentes
    }

    this.fuentesEnEdicion.forEach(clave => {
      const idFuente = this.mapaFuentes[clave] || '';
      const $li = $('<li>')
        .addClass('list-group-item d-flex justify-content-between align-items-center')
        .attr('data-clave', clave)
        .attr('data-id-fuente', idFuente);

      const meta = this.parseFuenteKey(clave);
      const urlParams = new URLSearchParams();
      if (meta?.srv) urlParams.set('servidor', meta.srv);
      if (meta?.db) urlParams.set('base', meta.db);
      if (meta?.sch) urlParams.set('esquema', meta.sch);
      if (meta?.tbl) urlParams.set('tabla', meta.tbl);
      const href = urlParams.toString() ? `BuscadorCampos.aspx?${urlParams.toString()}` : 'BuscadorCampos.aspx';
      const $icons = $('<span class="fuente-icons d-inline-flex align-items-center"></span>');
      const $metallonIcon = $('<span class="fuente-extra-icon fuente-extra-1 mr-1" style="display:inline-flex; align-items:center; justify-content:center; width:24px; height:24px; visibility:hidden;"></span>');
      const $extraIcon2 = $('<span class="fuente-extra-icon fuente-extra-2 mr-1" style="display:inline-block; width:18px; visibility:hidden;"></span>');
      $icons.append($metallonIcon, $extraIcon2);
      this.decorateMetallonIcon($metallonIcon, clave);
      const $profilingIcon = $('<div class="mr-1 dropdown fuente-profiling" style="display:inline-block; visibility:hidden;"></div>');
      $icons.append($profilingIcon);
      this.decorateProfilingIcon($profilingIcon, clave);
      const $qualityIcon = $('<i class="simple-icon-pie-chart text-muted mr-2 fuente-calidad" style="cursor: default; display:inline-block; width:18px; visibility:hidden;" title="Completitud"></i>');
      $icons.append($qualityIcon);
      this.decorateCalidadIcon($qualityIcon, clave);
      const tooltipAvance = this.getAvanceTooltip(meta);
      const $link = $('<a>')
        .attr({
          href,
          target: '_blank',
          rel: 'noopener noreferrer',
          ...(tooltipAvance ? { title: tooltipAvance, 'data-toggle': 'tooltip' } : {})
        })
        .text(clave);
      if (tooltipAvance) {
        $link.tooltip({ title: tooltipAvance, placement: 'top', container: 'body', boundary: 'window' });
      }
      const $left = $('<div class="d-flex align-items-center"></div>').append($icons, $link);
      $li.append($left);

      // Cambiado el botón por un í­cono
      const $delIcon = $('<i class="simple-icon-trash text-danger p-1 btn-del-fuente" style="cursor: pointer;" title="Eliminar Fuente"></i>');
      const $actionsDiv = $('<div class="d-flex align-items-center"></div>').append($delIcon);
      $li.append($actionsDiv);

      listaFuentes.append($li);
    });

    listaFuentes.scrollTop(listaFuentes[0].scrollHeight);
    this.applyPermissionsForUser();
  },

  async decorateMetallonIcon($icon, clave) {
    if (!$icon || !$icon.length) return;

    // --- 1. DEFINICIÓN DEL MODAL (HTML) ---
    const ensureMetallonModal = () => {
      if (document.getElementById("modalMetallonFuente")) return;

      const modalHtml = `
        <div class="modal fade" id="modalMetallonFuente" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static">
          <div class="modal-dialog modal-dialog-centered" role="document" style="z-index: 1061;">
            <div class="modal-content" style="border-radius: 15px; border: none; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
              <div class="modal-header">
                <div>
                  <h5 class="modal-title">Clasificación medallón</h5>
                  <p id="tableName" class="text-semi-muted mb-0" style="font-size: 0.9rem;"></p>
                </div>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <div class="form-group">
                    <label for="selectMetallonFuente">Selecciona una opción:</label>
                    <select id="selectMetallonFuente" class="form-control">
                    <option value="">Sin clasificación</option>
                    <option value="oro">Oro</option>
                    <option value="plata">Plata</option>
                    <option value="bronce">Bronce</option>
                    </select>
                </div>
                
                <div class="form-group">
                  <label for="selectEtiquetaMetallon" class="mb-1">Asignar etiqueta:</label>
                  <select id="selectEtiquetaMetallon" class="form-control select2-single" style="width: 100%;" aria-hidden="true">
                    <option label="&nbsp;">&nbsp;</option>
                  </select>
                </div>
                
                <div class="form-group" id="dominioMetallonGroup">
                  <label for="selectDominioMetallon" class="mb-1">Dominio (requerido si es Tabla Oficial):</label>
                  <select id="selectDominioMetallon" class="form-control select2-single" style="width: 100%;" multiple aria-hidden="true">
                    <option label="&nbsp;">&nbsp;</option>
                  </select>
                </div>

                <div class="form-group" id="calidadFuente" style="display:none; border-top: 1px solid #eee; padding-top: 15px; margin-top: 15px;">
                  <label for="selectCalidadFuente" class="mb-1 font-weight-bold">Ingeniero de Calidad a cargo:</label>
                  <div class="d-flex align-items-start">
                    <div style="flex-grow: 1;">
                        <select id="selectCalidadFuente" class="form-control select2-single" style="width: 100%;" aria-hidden="true">
                          <option label="&nbsp;">&nbsp;</option>
                        </select>
                    </div>
                    <button type="button" id="btnEnviarBacklog" class="btn btn-primary ml-2" style="height: calc(1.5em + 0.75rem + 2px);" title="Asignar y Enviar a Calidad" disabled>
                        <i class="simple-icon-paper-plane"></i>
                    </button>
                  </div>
                  <small class="text-muted d-block mt-1">Asigna esta fuente a un ingeniero para revisión.</small>
                  <small id="calidadFeedback" class="text-danger font-weight-bold d-block mt-1" style="display: none;"></small>
                </div> 
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary" id="btnGuardarMetallonFuente">Guardar Cambios</button>
              </div>
            </div>
          </div>
        </div>`;
      $('body').append(modalHtml);

      // Ajustes de Z-Index
      $('#modalMetallonFuente').on('shown.bs.modal', function () {
        const $backdrops = $('.modal-backdrop');
        $backdrops.last().css('z-index', 1060);
        $(this).css('z-index', 1065);
      });

      // Inicialización de librerías
      try {
        const catalogoEtiquetas = typeof getCatalogoOGASUITE === "function" ? (getCatalogoOGASUITE("4") || {}) : {};
        const $selEtiq = $('#selectEtiquetaMetallon');
        const $domSel = $('#selectDominioMetallon');

        $selEtiq.empty().append(new Option('', ''));
        Object.entries(catalogoEtiquetas).forEach(([codigo, texto]) => {
          $selEtiq.append(new Option(texto || codigo, codigo));
        });

        if (!document.getElementById('metallon-select2-styles')) {
          $('head').append(`<style id="metallon-select2-styles">#modalMetallonFuente .select2-container--open { z-index: 1075 !important; } #modalMetallonFuente .select2-container--open .select2-dropdown { z-index: 1076 !important; }</style>`);
        }

        if ($.fn.select2) {
          $selEtiq.select2({ theme: "bootstrap", width: "100%", placeholder: "Selecciona etiqueta", dropdownParent: $('#modalMetallonFuente'), allowClear: true });
          $selEtiq.on('select2:open', () => { $('#modalMetallonFuente').css('z-index', 1065); });
          $domSel.select2({ theme: "bootstrap", width: "100%", placeholder: "Seleccione dominio(s)", dropdownParent: $('#modalMetallonFuente'), allowClear: true });
        }

        // Carga de Ingenieros de Calidad
        const cargarIngenierosCalidad = async () => {
          const $calidadSel = $('#selectCalidadFuente');
          const $calidadContainer = $('#calidadFuente');

          if ($.fn.select2 && !$calidadSel.data('select2')) {
            $calidadSel.select2({ theme: "bootstrap", width: "100%", placeholder: "Seleccione Ingeniero", dropdownParent: $('#modalMetallonFuente'), allowClear: true });
          }

          if ($calidadSel.data('loaded')) return;
          try {
            const queryBody = {
              campos: "TOP 50 NOMBRE, CODIGO_EMPLEADO",
              origen: "STAGING.dbo.Dw_dim_colaboradores",
              condicion: "PUESTO LIKE '%QUALITY AND COMPLIANCE%' AND ESTADO = 'A' ORDER BY NOMBRE"
            };
            const rows = await ApiService.query(queryBody);

            $calidadSel.empty().append(new Option('', ''));

            if (rows && rows.length > 0) {
              rows.forEach(r => {
                const nombre = r.NOMBRE || r.nombre || "Desconocido";
                const id = r.CODIGO_EMPLEADO || r.codigo_empleado || "";
                $calidadSel.append(new Option(nombre, id));
              });
              $calidadSel.data('loaded', true);
              $calidadContainer.show();
            }
          } catch (error) { console.error("Error cargando ingenieros:", error); }
        };
        cargarIngenierosCalidad();

      } catch (err) { console.warn(err); }
    };
    ensureMetallonModal();

    try {
      // --- 2. OBTENER ESTADO ACTUAL ---
      const clasificacionRaw = await this.getMetallonPorFuente(clave);
      let clasificacion = (clasificacionRaw || '').toString().trim().toLowerCase();

      // Normalización
      if (clasificacion === "5") clasificacion = "oro";
      if (clasificacion === "4") clasificacion = "plata";
      if (clasificacion === "3") clasificacion = "bronce";
      if (clasificacion === "11") clasificacion = "sin clasificacion";

      const trophyMap = {
        oro: { label: 'Oro', key: 'oro' },
        plata: { label: 'Plata', key: 'plata' },
        bronce: { label: 'Bronce', key: 'bronce' },
        "sin clasificacion": { label: 'Sin clasificación', key: 'sin clasificacion' },
        default: { label: 'Sin clasificación', key: 'sin clasificacion' }
      };

      const config = trophyMap[clasificacion] || trophyMap.default;
      const isOfficial = await this.isTablaOficial(clave);

      // Renderizar Icono
      this.renderMedallonIcon($icon, config.key, isOfficial);

      const tooltip = `Clasificación medallón: ${config.label}`;
      try { $icon.tooltip('dispose'); } catch (e) { }
      $icon.attr({ 'data-toggle': 'tooltip', title: tooltip });
      $icon.tooltip({ title: tooltip, placement: 'top', container: 'body', boundary: 'window' });

      // Solo permitir clic si es usuario autorizado (OGA)
      if (this.isOgaUser()) {

        // --- 3. EVENTO CLIC: ABRIR MODAL ---
        $icon.css('cursor', 'pointer').off('click.metallon').on('click.metallon', () => {
          const $modal = $('#modalMetallonFuente');
          const $select = $('#selectMetallonFuente');
          const $selectEtiqueta = $('#selectEtiquetaMetallon');
          const $selectDominio = $('#selectDominioMetallon');
          const $selectCalidad = $('#selectCalidadFuente');
          const $btnBacklog = $('#btnEnviarBacklog');
          const $feedback = $('#calidadFeedback');

          // Resetear selects UI
          let valorSelect = clasificacion;
          if (valorSelect === "sin clasificacion" || valorSelect === "11") valorSelect = "";
          $select.val(valorSelect);

          if ($selectEtiqueta.data('select2')) $selectEtiqueta.val(null).trigger('change');
          else $selectEtiqueta.val([]);

          $selectDominio.val(null).trigger('change');

          // --- 🌟 LÓGICA DE VALIDACIÓN DEL BOTÓN ---
          let ingenieroAsignadoActual = null;
          $btnBacklog.data('existe', false);
          $selectCalidad.val(null).trigger('change');
          $selectCalidad.prop('disabled', false);

          // Obtener Porcentaje de Documentación (Desde cache global o fallback a 0)
          let porcentajeDoc = 0;
          const parts = (clave || "").split('.');
          if (parts.length >= 4) {
            const [servidor, base, esquema, tabla] = parts;
            $('#tableName').text(`${base}.${esquema}.${tabla}`);
            const keyCache = `${servidor.toUpperCase()}_${esquema.toUpperCase()}_${base.toUpperCase()}_${tabla.toUpperCase()}`;
            if (window.tablas_oficiales && window.tablas_oficiales[keyCache]) {
              porcentajeDoc = parseFloat(window.tablas_oficiales[keyCache].avance || 0);
            }
          }

          // Función central para evaluar si se habilita el botón
          const evaluarEstadoBotonCalidad = () => {
            const clasifActual = $('#selectMetallonFuente').val();
            const ingenieroSeleccionado = $('#selectCalidadFuente').val();

            let isDisable = false;
            let msg = "";

            const validClasif = ["oro", "plata", "bronce"];

            if (!validClasif.includes(clasifActual)) {
              isDisable = true;
              msg = "Debe ser Oro, Plata o Bronce para ser asignada a Calidad.";
            } else if (porcentajeDoc <= 70) {
              isDisable = true;
              msg = `La documentación (${porcentajeDoc}%) debe ser superior al 70%.`;
            } else if (!ingenieroSeleccionado) {
              isDisable = true;
              msg = "Seleccione un ingeniero.";
            } else if (ingenieroSeleccionado === ingenieroAsignadoActual) {
              isDisable = true;
              msg = "Este ingeniero ya está a cargo actualmente.";
            }

            $btnBacklog.prop('disabled', isDisable);

            if (isDisable && msg) {
              $feedback.text(msg).show();
            } else {
              $feedback.hide();
            }
          };

          // Escuchar cambios para revaluar en vivo
          $select.off('change.calidad').on('change.calidad', evaluarEstadoBotonCalidad);
          $selectCalidad.off('change.calidad').on('change.calidad', evaluarEstadoBotonCalidad);

          $modal.modal('show');

          // --- VERIFICAR ASIGNACIÓN EXISTENTE (BACKLOG) ---
          if (parts.length >= 4) {
            const [servidor, base, esquema, tabla] = parts;
            const esc = (v) => String(v || '').replace(/'/g, "''");
            const queryAsignado = {
              campos: "TOP 1 ingeniero_asignado, ingeniero_calidad",
              origen: "PROCESOS_BI.DBO.T_Calidad_Backlog",
              condicion: `SERVIDOR='${esc(servidor)}' AND BASE='${esc(base)}' AND ESQUEMA='${esc(esquema)}' AND TABLA='${esc(tabla)}'`
            };

            ApiService.query(queryAsignado).then(rows => {
              if (rows && rows.length > 0) {
                const row = rows[0];
                ingenieroAsignadoActual = row.ingeniero_asignado || row.INGENIERO_ASIGNADO;
                $btnBacklog.data('existe', true);

                if (ingenieroAsignadoActual) {
                  // Seteamos silenciosamente el valor sin disparar los eventos infinitos
                  $selectCalidad.val(ingenieroAsignadoActual).trigger('change.select2');
                }
              }
              evaluarEstadoBotonCalidad(); // Primera evaluación real con datos de BD
            }).catch(console.error);
          } else {
            evaluarEstadoBotonCalidad(); // Evaluación inicial si no hay BD
          }

          // Cargar datos previos (Dominios y Etiquetas)
          this.prefillDominiosPorDescripcion(clave);
          this.getEtiquetasMetallonPorFuente(clave)
            .then(async (etiquetasExistentes) => {
              if (!$selectEtiqueta || !$selectEtiqueta.length) return;
              const opciones = new Set(($selectEtiqueta.find('option') || []).map((_, opt) => opt.value).get());
              const etiquetaValida = (etiquetasExistentes || []).find(code => opciones.has(code));
              if (etiquetaValida) {
                $selectEtiqueta.val(etiquetaValida).trigger('change');
              } else {
                await this.prefillEtiquetaPorClasificacion($selectEtiqueta, clave);
              }
            })
            .catch(async () => {
              await this.prefillEtiquetaPorClasificacion($selectEtiqueta, clave);
            });

          $('#btnGuardarMetallonFuente').off('click').on('click', () => {
            const clasificacionSeleccionada = ($select.val() || '').toString().trim().toLowerCase();
            const etiquetaSel = $selectEtiqueta.val();
            const etiquetaTxt = ($selectEtiqueta.find('option:selected').text() || '').trim();

            const domVals = $selectDominio.val() || [];
            const domText = ($selectDominio.find('option:selected') || []).map((i, opt) => $(opt).text().trim()).get().filter(Boolean).join('; ');

            const etiquetaTxtUp = etiquetaTxt.toUpperCase();
            const isOficialEtiqueta = etiquetaTxtUp === 'TABLA OFICIAL';

            if (isOficialEtiqueta && !domVals.length) {
              alert('Para guardar como "Tabla Oficial", el dominio es obligatorio.');
              return;
            }

            // Mapeo
            const codMap = { oro: "5", plata: "4", bronce: "3", "": "11" };
            const codigoMedallon = codMap[clasificacionSeleccionada] || "11";
            const cacheVal = codigoMedallon === "11" ? "sin clasificacion" : clasificacionSeleccionada;

            // Actualizar caché visual
            this.metallonCache = this.metallonCache || new Map();
            this.metallonCache.set(clave, cacheVal);

            try {
              const parts = (clave || "").split('.');
              if (parts.length >= 4) {
                const [servidor, base, esquema, tabla] = parts;
                const keyCache = `${servidor.toUpperCase()}_${esquema.toUpperCase()}_${base.toUpperCase()}_${tabla.toUpperCase()}`;

                const datos_usuario = (typeof getUserAndDate === "function") ? getUserAndDate() : [[window.current_user], new Date().toISOString()];
                const usuarioMod = datos_usuario?.[0]?.[0] || window.current_user;
                const fechaMod = datos_usuario?.[1] || new Date().toISOString();

                let plataforma = "";
                if (window.tablas_oficiales && window.tablas_oficiales[keyCache]) plataforma = window.tablas_oficiales[keyCache].plataforma || "";

                const setCodigos = new Set();
                if (etiquetaSel) setCodigos.add(etiquetaSel);
                const etiquetasNumFinal = Array.from(setCodigos).join("|");

                let clasificacionColumnaValue = null;
                if (etiquetaTxtUp === "TABLA OFICIAL") clasificacionColumnaValue = "OFICIAL";
                else if (etiquetaTxtUp === "TABLA DE TRABAJO") clasificacionColumnaValue = "TRABAJO";
                else if (etiquetaTxtUp.includes("DESUSO")) clasificacionColumnaValue = "DESUSO";
                else if (etiquetaTxtUp.includes("TEMPORAL")) clasificacionColumnaValue = "TEMPORAL";

                const existe = (typeof window.existeEnSP_TablasOficiales === "function")
                  ? window.existeEnSP_TablasOficiales({ tabla, servidor, base, esquema }).existe
                  : (window.tablas_oficiales && !!window.tablas_oficiales[keyCache]);

                if (existe) {
                  // --- UPDATE ---
                  const camposUpdate = {};
                  camposUpdate["etiquetas"] = codigoMedallon;
                  camposUpdate["usuario_modificacion_etiqueta"] = usuarioMod;
                  camposUpdate["fecha_modificacion_etiqueta"] = fechaMod;

                  if (clasificacionColumnaValue) {
                    camposUpdate["clasificacion"] = clasificacionColumnaValue;
                    camposUpdate["usuario_modificacion_clasif"] = usuarioMod;
                    camposUpdate["fecha_modificacion_clasif"] = fechaMod;
                  }
                  if (domText) {
                    camposUpdate["descripcion_dominio"] = domText;
                    camposUpdate["usuario_modificacion_clasif"] = usuarioMod;
                    camposUpdate["fecha_modificacion_clasif"] = fechaMod;
                  }

                  const paresParaActualizar = Object.keys(camposUpdate).map(key => [key, camposUpdate[key]]);
                  const CAMLQuery = `<Query><Where><And><Eq><FieldRef Name="txt_desc_tabla"/><Value Type="Text">${tabla}</Value></Eq><And><Eq><FieldRef Name="txt_servidor"/><Value Type="Text">${servidor}</Value></Eq><And><Eq><FieldRef Name="txt_host"/><Value Type="Text">${base}</Value></Eq><Eq><FieldRef Name="txt_fuente_esquema"/><Value Type="Text">${esquema}</Value></Eq></And></And></And></Where></Query>`;

                  $().SPServices.SPUpdateMultipleListItems({
                    async: true,
                    listName: "Z_METADATA_TABLAS",
                    batchCmd: "Update",
                    CAMLQuery: CAMLQuery,
                    valuepairs: paresParaActualizar,
                    completefunc: (xData, Status) => { console.log("Update SP status:", Status); }
                  });

                } else {
                  // --- NEW ---
                  const valuepairsNew = [
                    ["txt_desc_tabla", tabla], ["txt_servidor", servidor], ["txt_host", base], ["txt_fuente_esquema", esquema],
                    ["etiquetas", codigoMedallon], ["txt_fuente_aprovisionamiento", plataforma],
                    ["usuario_modificacion_etiqueta", usuarioMod], ["fecha_modificacion_etiqueta", fechaMod]
                  ];
                  if (clasificacionColumnaValue) {
                    valuepairsNew.push(["clasificacion", clasificacionColumnaValue]);
                    valuepairsNew.push(["usuario_modificacion_clasif", usuarioMod]);
                    valuepairsNew.push(["fecha_modificacion_clasif", fechaMod]);
                  }
                  if (domText) {
                    valuepairsNew.push(["descripcion_dominio", domText]);
                    if (!clasificacionColumnaValue) {
                      valuepairsNew.push(["usuario_modificacion_clasif", usuarioMod]);
                      valuepairsNew.push(["fecha_modificacion_clasif", fechaMod]);
                    }
                  }

                  $().SPServices({
                    operation: "UpdateListItems",
                    async: true,
                    listName: "Z_METADATA_TABLAS",
                    batchCmd: "New",
                    valuepairs: valuepairsNew
                  });
                }

                // Actualizar Cache
                if (!window.tablas_oficiales) window.tablas_oficiales = {};
                if (!window.tablas_oficiales[keyCache]) window.tablas_oficiales[keyCache] = {};

                Object.assign(window.tablas_oficiales[keyCache], {
                  servidor, base, esquema, tabla,
                  etiquetas: etiquetasNumFinal,
                  etiquetas_numero: etiquetasNumFinal,
                  clasificacion: clasificacionColumnaValue || window.tablas_oficiales[keyCache].clasificacion,
                  descripcion_dominio: domText || window.tablas_oficiales[keyCache].descripcion_dominio
                });
              }
            } catch (err) { console.warn("Error Guardado Metallon:", err); }

            $modal.modal('hide');
            this.decorateMetallonIcon($icon, clave);
            if (typeof showNotification === "function") showNotification("top", "center", "success", "Información actualizada correctamente.");
          });

          // --- B. LÓGICA DE BACKLOG (INGENIERO) ---
          $('#btnEnviarBacklog').off('click').on('click', async function () {
            const $btn = $("#btnEnviarBacklog");
            if ($btn.prop('disabled')) return;

            const parts = (clave || "").split('.');
            if (parts.length >= 4) {
              const [servidor, base, esquema, tabla] = parts;
              const $select = $('#selectCalidadFuente');
              const idIngeniero = $select.val();

              if (!idIngeniero) { alert("Seleccione ingeniero"); return; }

              const nombreIngeniero = $select.find('option:selected').text().trim();
              const fecha = new Date().toLocaleDateString('en-CA');
              const usuarioActual = typeof SharePointUtils !== 'undefined' ? SharePointUtils.getEmployeeCodeByUser(window.current_user) : window.current_user;

              // Estado de carga (Mantiene el ícono del avión en el finally)
              $btn.prop('disabled', true).html('<i class="simple-icon-refresh"></i>');

              try {
                if ($btn.data('existe')) {
                  // === CASO UPDATE (Registro ya existe) ===
                  const datosUpdate = {
                    INGENIERO_CALIDAD: nombreIngeniero,
                    INGENIERO_ASIGNADO: idIngeniero,
                    FEC_MODIFICACION: fecha,
                    USUARIO_MODIFICACION: usuarioActual
                  };

                  const esc = (v) => String(v || '').replace(/'/g, "''");
                  const condicionUpdate = `SERVIDOR='${esc(servidor)}' AND BASE='${esc(base)}' AND ESQUEMA='${esc(esquema)}' AND TABLA='${esc(tabla)}'`;

                  if (typeof ApiService.update === 'function') {
                    await ApiService.update("PROCESOS_BI.DBO.T_Calidad_Backlog", datosUpdate, condicionUpdate);
                  } else {
                    const qry = `UPDATE PROCESOS_BI.DBO.T_Calidad_Backlog SET INGENIERO_CALIDAD='${nombreIngeniero}', INGENIERO_ASIGNADO='${idIngeniero}', FEC_MODIFICACION=GETDATE(), USUARIO_MODIFICACION='${usuarioActual}' WHERE ${condicionUpdate}`;
                    await ApiService.query({ query: qry });
                  }

                } else {
                  // === CASO INSERT (Nuevo registro) ===
                  const datosInsert = {
                    ID_ATRIBUTO: 0, SERVIDOR: servidor, BASE: base, ESQUEMA: esquema, TABLA: tabla,
                    INGENIERO_CALIDAD: nombreIngeniero, INGENIERO_ASIGNADO: idIngeniero,
                    ESTADO: "Pendiente", OBSERVACION: "", FEC_CREACION: fecha, USUARIO_INGRESO: usuarioActual,
                    FEC_MODIFICACION: null, USUARIO_MODIFICACION: "", PERIODICIDAD: null
                  };
                  await ApiService.insert("PROCESOS_BI.DBO.T_Calidad_Backlog", datosInsert);
                  $btn.data('existe', true);
                }

                // 🌟 Éxito: Actualizamos la variable de estado local y re-evaluamos para bloquear el botón
                ingenieroAsignadoActual = idIngeniero;
                evaluarEstadoBotonCalidad();

                await this.enviarCorreoAsignacionCalidad(idIngeniero, nombreIngeniero, clave, usuarioActual);

                if (typeof showNotification === 'function') showNotification('top', 'center', 'success', `Ingeniero asignado: ${nombreIngeniero}`);

              } catch (error) {
                console.error("Error backlog:", error);
                alert("Error al guardar en el Backlog.");
                $btn.prop('disabled', false); // Rehabilita si falla
              } finally {
                // Siempre restaurar el avión de papel
                $btn.html('<i class="simple-icon-paper-plane"></i>');
              }
            }
            await handleSaveClick();
          });

        });
      }

    } catch (error) {
      console.error('Error decorando:', clave, error);
      try { $icon.tooltip('dispose'); } catch (e) { }
      const fallbackSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2"><circle cx="12" cy="12" r="10"></circle></svg>`;
      $icon.empty().css({ color: '#6b7280', display: 'inline-flex', visibility: 'visible' }).append(fallbackSvg);
    }
  },

  async enviarCorreoAsignacionCalidad(idIngeniero, nombreIngeniero, claveTabla, usuarioAsignador) {
    if (!idIngeniero) return;

    const queryUser = {
      campos: "TOP 1 web_user",
      origen: "PROCESOS_BI.DBO.tmp_datos_empleados",
      condicion: `codigo='${idIngeniero}'`,
    }

    const asunto = `Asignación de Fuente para Revisión de Calidad: ${claveTabla}`;

    // Intentamos obtener el nombre completo del usuario que está asignando, o usamos su ID
    const nombreAsignador = window.nombreCompleto || usuarioAsignador || "Un usuario de Gobierno de Datos";
    const nombreCaso = ($('#detalle-descripcion').val() || "").trim();

    // Enlace para que el ingeniero vaya directo a la tabla (Ajusta la URL según tu aplicativo)
    const baseUrl = window.location.origin + window.location.pathname;
    const enlaceFuente = `${baseUrl}?buscar=${encodeURIComponent(claveTabla)}`;

    // Construcción del cuerpo HTML del correo con estilos inline
    const cuerpoHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #245794; padding: 20px; color: white; text-align: center;">
              <h2 style="margin: 0; font-size: 20px; font-weight: 600;">Nueva Asignación de Calidad</h2>
          </div>
          <div style="padding: 30px 20px;">
              <p style="font-size: 16px;">Hola <strong>${nombreIngeniero}</strong>,</p>
              <p style="font-size: 15px; line-height: 1.5;">Se te ha asignado una nueva fuente de datos para su revisión y gestión de calidad.</p>
              
              <div style="background-color: #f8f9fa; padding: 15px 20px; border-left: 4px solid #D2006E; margin: 25px 0; border-radius: 0 4px 4px 0;">
                  <p style="margin: 0 0 10px 0; font-size: 15px;"><strong>Fuente:</strong> <span style="color: #D2006E;">${claveTabla}</span></p>
                  <p style="margin: 0 0 10px 0; font-size: 15px;"><strong>Caso de uso:</strong> <span style="color: #D2006E;">${nombreCaso}</span></p>
                  <p style="margin: 0; font-size: 15px;"><strong>Asignado por:</strong> ${nombreAsignador}</p>
              </div>
              
              <p style="font-size: 15px; margin-bottom: 25px;">Por favor, revisa la información de esta fuente y procede con la evaluación correspondiente.</p>
              
              <div style="text-align: center; margin-top: 30px; margin-bottom: 10px;">
                  <a href="${enlaceFuente}" style="background-color: #D2006E; color: white; text-decoration: none; padding: 12px 25px; border-radius: 4px; font-weight: bold; font-size: 15px; display: inline-block;">Ver Fuente Asignada</a>
              </div>
          </div>
          <div style="background-color: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0;">Este es un mensaje automático del sistema de Gobierno de Datos.<br>Por favor, no respondas a este correo.</p>
          </div>
      </div>
    `;

    const nowIso = new Date().toISOString();
    try {
      const nombreDestino = await ApiService.query(queryUser)
      // Payload adaptado para insertarse directo en SQL
      const payload = {
        NOMBRE_PERSONA: nombreAsignador,
        USUARIO_PERSONA: nombreDestino.web_user,
        ASUNTO_CORREO: asunto,
        CUERPO_CORREO: cuerpoHtml,
        ENVIADO: 0,
        FECHA_ENVIO: nowIso,
        FECHA_INGRESO_EN_COLA: nowIso,
        FIRMA: "Equipo Gobierno de Datos"
      };

      await ApiService.insert("PROCESOS_BI.DBO.t_cola_mensajes", payload);
      console.log("Correo de asignación encolado correctamente vía ApiService.");
    } catch (error) {
      console.error("Error al encolar el correo de asignación:", error);
    }
  },

  async getMetallonPorFuente(clave) {
    const key = (clave || '').trim();
    if (!key) return null;

    if (this.metallonCache && this.metallonCache.has(key)) return this.metallonCache.get(key);
    if (this.metallonInflight && this.metallonInflight.has(key)) return this.metallonInflight.get(key);

    const parts = key.split('.');
    if (parts.length < 4) return null;
    const [servidor, base, esquema, tabla] = parts;

    const getClasifFromRecord = (rec = {}) => {
      const etiquetas = (rec.etiquetas || rec.etiquetas_numero || "").toString().split("|").map(s => s.trim()).filter(Boolean);
      const mapMedallon = {
        "5": "oro", "4": "plata", "3": "bronce",
        "ORO": "oro", "PLATA": "plata", "BRONCE": "bronce",
        "11": "sin clasificacion"
      };
      const medallon = etiquetas.find(c => mapMedallon[c]);
      if (medallon) return mapMedallon[medallon];
      const clas = (rec.clasificacion || "").toString().trim().toLowerCase();
      return clas || null;
    };

    const promise = (async () => {
      let clasif = null;

      const keyTxt = `${servidor.toUpperCase()}_${esquema.toUpperCase()}_${base.toUpperCase()}_${tabla.toUpperCase()}`;

      // 1. SharePoint Cache
      const spCache = window.tablas_oficiales || (typeof getInfoTablasOficialesTemp === "function" ? getInfoTablasOficialesTemp() : null);
      if (spCache && spCache[keyTxt]) {
        clasif = getClasifFromRecord(spCache[keyTxt]);
      }

      // 2. TXT Cache
      if (!clasif) {
        const tablasTxt = typeof this.loadTablasOficialesTxtCache === 'function' ? await this.loadTablasOficialesTxtCache() : null;
        if (tablasTxt && tablasTxt[keyTxt]) {
          clasif = getClasifFromRecord(tablasTxt[keyTxt]);
        }
      }

      // 3. Fallback API
      if (!clasif) {
        const esc = (v) => String(v || '').replace(/'/g, "''");
        const queryBody = {
          campos: "TOP 1 *",
          origen: "PROCESOS_BI.dbo.vw_T_Calidad_Backlog_Completa",
          condicion: `SERVIDOR='${esc(servidor)}' AND BASE='${esc(base)}' AND ESQUEMA='${esc(esquema)}' AND TABLA='${esc(tabla)}'`
        };
        try {
          const rows = await ApiService.query(queryBody);
          if (rows && rows.length) {
            const r = rows[0] || {};
            let rawVal = r.ETIQUETAS || r.etiquetas || r.CLASIFICACION_METALLON || r.clasificacion_metallon || r.CLASIFICACION || r.clasificacion || null;
            if (rawVal) clasif = getClasifFromRecord({ etiquetas: rawVal, clasificacion: rawVal });
          }
        } catch (err) { console.error('Error API Metallon:', key, err); }
      }

      this.metallonCache = this.metallonCache || new Map();
      this.metallonCache.set(key, clasif);
      this.metallonInflight.delete(key);
      return clasif;
    })();

    this.metallonInflight = this.metallonInflight || new Map();
    this.metallonInflight.set(key, promise);
    return promise;
  },

  async isTablaOficial(clave) {
    const clasif = await this.getClasificacionEtiquetaPorFuente(clave);
    if (clasif && clasif.toString().trim().toUpperCase() === 'TABLA OFICIAL') return true;
    const etiquetas = await this.getEtiquetasMetallonPorFuente(clave);
    return (etiquetas || []).some(e => (e || '').toString().trim().toUpperCase() === 'OFICIAL');
  },

  renderMedallonIcon($icon, key, isOfficial) {
    const normalizedKey = (key || '').toString().trim().toLowerCase();
    const nameMap = {
      oro: 'Gold',
      plata: 'Silver',
      bronce: 'Bronze',
      'sin clasificacion': 'Sin Clasificar'
    };
    const baseName = nameMap[normalizedKey] || nameMap['sin clasificacion'];
    const suffix = isOfficial ? ' Oficial' : '';
    const fileName = `${baseName}${suffix}.png`;
    const basePath = `${typeof BASE_URL !== 'undefined' ? BASE_URL : ''}img/medallones/`;
    const src = `${basePath}${encodeURI(fileName)}`;
    $icon.empty().css({
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      visibility: 'visible'
    }).append(`<img src="${src}" alt="Medallón ${baseName}" width="32" height="32" style="max-width:32px; max-height:32px;">`);
  },

  /**
   * Devuelve las etiquetas (códigos) actuales asociadas a la tabla (excluye medallón y "OFICIAL").
   */
  async getEtiquetasMetallonPorFuente(clave) {
    const key = (clave || '').trim();
    if (!key) return [];
    const parts = key.split('.');
    if (parts.length < 4) return [];
    const [servidor, base, esquema, tabla] = parts;
    const medallonSet = new Set(["5", "4", "3", "ORO", "PLATA", "BRONCE"]);
    const limpiar = (lista) => {
      const set = new Set();
      (lista || "").toString().split("|").forEach((cRaw) => {
        const c = (cRaw || "").trim();
        if (!c) return;
        if (medallonSet.has(c.toUpperCase()) || c.toUpperCase() === "OFICIAL") return;
        set.add(c);
      });
      return Array.from(set);
    };

    const keyTxt = `${servidor.toUpperCase()}_${esquema.toUpperCase()}_${base.toUpperCase()}_${tabla.toUpperCase()}`;
    const spCache = window.tablas_oficiales || (typeof getInfoTablasOficialesTemp === "function" ? getInfoTablasOficialesTemp() : null);
    if (spCache && spCache[keyTxt]) {
      const etiquetas = limpiar(spCache[keyTxt].etiquetas || spCache[keyTxt].etiquetas_numero || "");
      if (etiquetas.length) return etiquetas;
    }

    const tablasTxt = await this.loadTablasOficialesTxtCache();
    if (tablasTxt && tablasTxt[keyTxt]) {
      return limpiar(tablasTxt[keyTxt].etiquetas || tablasTxt[keyTxt].etiquetas_numero || "");
    }

    return [];
  },

  // Intenta seleccionar la etiqueta basada en la columna "clasificacion" (no medallón).
  async prefillEtiquetaPorClasificacion($selectEtiqueta, clave) {
    if (!$selectEtiqueta || !$selectEtiqueta.length) return;
    const clasif = await this.getClasificacionEtiquetaPorFuente(clave);
    if (!clasif) {
      $selectEtiqueta.val(null).trigger('change');
      return;
    }
    const norm = (s) => (s || '').toString().trim().toUpperCase();
    let valorMatch = null;
    $selectEtiqueta.find('option').each((_, opt) => {
      if (valorMatch !== null) return;
      const val = opt.value;
      const txt = (opt.text || '').toString();
      if (norm(val) === norm(clasif) || norm(txt) === norm(clasif)) {
        valorMatch = val;
      }
    });
    if (valorMatch !== null && valorMatch !== undefined && valorMatch !== '') {
      $selectEtiqueta.val(valorMatch).trigger('change');
    } else {
      $selectEtiqueta.val(null).trigger('change');
    }
  },

  // Evita que la opción vacía (placeholder) quede seleccionada en el select múltiple de dominios.
  cleanDominiosMetallonSelection() {
    const $domSel = $('#selectDominioMetallon');
    if (!$domSel || !$domSel.length) return;
    const vals = $domSel.val();
    if (!Array.isArray(vals)) return;
    const cleaned = vals.filter(v => v !== '' && v !== null && v !== undefined);
    if (cleaned.length !== vals.length) {
      $domSel.val(cleaned).trigger('change.select2');
    }
  },

  // Precarga dominios (select2 múltiple) usando la columna descripcion_dominio (separa por ";").
  async prefillDominiosPorDescripcion(clave) {
    const $domSel = $('#selectDominioMetallon');
    if (!$domSel || !$domSel.length) return;

    const necesitaRecarga = !$domSel.data('loaded') || $domSel.find('option').length <= 1;
    await this.loadDominiosMetallonOptions(necesitaRecarga); // forzar recarga para evitar quedarse desfasado

    const descripcion = await this.getDescripcionDominioPorFuente(clave);
    $domSel.val(null);
    if (!descripcion) {
      $domSel.trigger('change');
      return;
    }

    const target = new Set(
      descripcion.split(';').map(s => (s || '').trim().toUpperCase()).filter(Boolean)
    );
    const values = [];
    $domSel.find('option').each((_, opt) => {
      const txt = (opt.text || '').toString().trim().toUpperCase();
      if (target.has(txt)) values.push(opt.value);
    });
    const uniques = Array.from(new Set(values));
    if (uniques.length) {
      $domSel.val(uniques).trigger('change');
    } else {
      $domSel.trigger('change');
    }
  },

  // Carga/select2 para el select de dominios; forceReload permite refrescar catálogo (incluye nuevos).
  _cargandoDominios: false,

  async loadDominiosMetallonOptions(forceReload = false) {
    const $domSel = $('#selectDominioMetallon');
    if (!$domSel || !$domSel.length) return;

    // Si ya está cargando, esperamos y no hacemos nada para evitar duplicados
    if (this._cargandoDominios) return;
    if (!forceReload && $domSel.data('loaded')) return;
    this._cargandoDominios = true;
    try {
      const doms = typeof NuevoCasoWizard?.cargarDominios === 'function' ? await NuevoCasoWizard.cargarDominios() : [];

      if ($domSel.hasClass('select2-hidden-accessible')) {
        try { $domSel.select2('destroy'); } catch (err) { }
      }
      $domSel.next('.select2').remove();

      $domSel.empty().append(new Option('', ''));

      const seen = new Set();
      doms.forEach(d => {
        const key = `${d.id}-${(d.descripcion || '').trim().toUpperCase()}`;
        if (seen.has(key)) return;
        seen.add(key);
        $domSel.append(new Option(d.descripcion, d.id));
      });

      $domSel.data('loaded', true);
      $domSel.val(null);

      if ($.fn.select2) {
        $domSel.select2({
          theme: "bootstrap",
          width: "100%",
          placeholder: "Seleccione dominio(s)",
          dropdownParent: $('#modalMetallonFuente'),
          allowClear: true
        });
      }

      $domSel.off('change.cleanEmptyDominio').on('change.cleanEmptyDominio', () => {
        this.cleanDominiosMetallonSelection();
      });

    } catch (err) {
      console.warn("No se pudieron cargar dominios (medallón):", err);
    } finally {
      this._cargandoDominios = false;
    }
    this.cleanDominiosMetallonSelection();
  },

  // Obtiene descripción de dominio (columna descripcion_dominio) desde SP o TXT para Tabla Oficial.
  async getDescripcionDominioPorFuente(clave) {
    const key = (clave || '').trim();
    if (!key) return null;
    const parts = key.split('.');
    if (parts.length < 4) return null;
    const [servidor, base, esquema, tabla] = parts;
    const keyTxt = `${servidor.toUpperCase()}_${esquema.toUpperCase()}_${base.toUpperCase()}_${tabla.toUpperCase()}`;

    const normalize = (s) => (s || '').toString().trim();
    const fromRecord = (rec = {}) => normalize(rec.descripcion_dominio || rec.DESCRIPCION_DOMINIO || '');

    const spCache = window.tablas_oficiales || (typeof getInfoTablasOficialesTemp === "function" ? getInfoTablasOficialesTemp() : null);
    if (spCache && spCache[keyTxt]) {
      const val = fromRecord(spCache[keyTxt]);
      if (val) return val;
    }

    const tablasTxt = await this.loadTablasOficialesTxtCache();
    if (tablasTxt && tablasTxt[keyTxt]) {
      const val = fromRecord(tablasTxt[keyTxt]);
      if (val) return val;
    }

    return null;
  },

  // Obtiene la clasificación textual (columna clasificacion) desde SP o TXT, excluyendo medallón.
  async getClasificacionEtiquetaPorFuente(clave) {
    const key = (clave || '').trim();
    if (!key) return null;
    const parts = key.split('.');
    if (parts.length < 4) return null;
    const [servidor, base, esquema, tabla] = parts;
    const medallonSet = new Set(["5", "4", "3", "ORO", "PLATA", "BRONCE"]);
    const normalize = (s) => (s || '').toString().trim();
    const fromRecord = (rec = {}) => {
      let raw = normalize(rec.clasificacion || rec.CLASIFICACION || '');
      if (!raw) return null;
      const up = raw.toUpperCase();
      if (medallonSet.has(up)) return null;
      if (up === 'OFICIAL') raw = 'TABLA OFICIAL'; // map a la opción del catálogo
      return raw;
    };
    const keyTxt = `${servidor.toUpperCase()}_${esquema.toUpperCase()}_${base.toUpperCase()}_${tabla.toUpperCase()}`;

    const spCache = window.tablas_oficiales || (typeof getInfoTablasOficialesTemp === "function" ? getInfoTablasOficialesTemp() : null);
    if (spCache && spCache[keyTxt]) {
      const val = fromRecord(spCache[keyTxt]);
      if (val) return val;
    }

    const tablasTxt = await this.loadTablasOficialesTxtCache();
    if (tablasTxt && tablasTxt[keyTxt]) {
      const val = fromRecord(tablasTxt[keyTxt]);
      if (val) return val;
    }

    return null;
  },

  // Carga y cachea el TXT de Z_TABLAS_OFICIALES para reutilizarlo en clasificaciones/etiquetas.
  async loadTablasOficialesTxtCache() {
    if (this._tablasOficialesTxtCache) return this._tablasOficialesTxtCache;
    if (this._tablasTxtPromise) return this._tablasTxtPromise;
    const url = "http://vamos.bancoguayaquil.com/sitios/informaciongerencial/OGA_Suite/Produccion/datasets-txt/Z_TABLAS_OFICIALES.txt";

    const promise = (async () => {
      try {
        const txt = await $.ajax({ url, method: "GET", cache: false });
        const lines = String(txt || "").trim().split(/\r?\n/);
        if (lines.length < 2) {
          this._tablasOficialesTxtCache = {};
          return this._tablasOficialesTxtCache;
        }
        const headers = lines[0].split("||").map(h => h.trim());
        const idx = (name) => headers.indexOf(name);
        const i_servidor = idx("txt_servidor");
        const i_base = idx("txt_host");
        const i_esquema = idx("txt_fuente_esquema");
        const i_tabla = idx("txt_desc_tabla");
        const i_clasif = idx("clasificacion");
        const i_etiquetas = idx("etiquetas");
        const i_desc_dom = idx("descripcion_dominio");
        const cache = {};
        const norm = (v, def = "") => {
          const s = String(v ?? def).trim();
          return s === "" ? def : s;
        };
        for (let i = 1; i < lines.length; i++) {
          const vals = lines[i].split("||");
          const srv = norm(vals[i_servidor]).toUpperCase();
          const db = norm(vals[i_base]).toUpperCase();
          const sch = norm(vals[i_esquema] || "DBO").toUpperCase();
          const tbl = norm(vals[i_tabla]).toUpperCase();
          if (!srv || !db || !tbl) continue;
          const keyTxtRow = `${srv}_${sch}_${db}_${tbl}`;
          cache[keyTxtRow] = {
            clasificacion: norm(vals[i_clasif]).toLowerCase(),
            etiquetas: norm(vals[i_etiquetas]).toUpperCase(),
            descripcion_dominio: norm(i_desc_dom >= 0 ? vals[i_desc_dom] : "")
          };
        }
        this._tablasOficialesTxtCache = cache;
      } catch (err) {
        console.warn("No se pudo leer Z_TABLAS_OFICIALES.txt:", err);
        this._tablasOficialesTxtCache = {};
      } finally {
        this._tablasTxtPromise = null;
      }
      return this._tablasOficialesTxtCache;
    })();

    this._tablasTxtPromise = promise;
    return promise;
  },

  async decorateCalidadIcon($icon, clave) {
    if (!$icon || !$icon.length) return;
    try {
      const info = await this.getCompletitudPorFuente(clave);
      if (!info || info.pct == null) {
        $icon.css('visibility', 'hidden').show();
        return;
      }
      const pct = Number(info.pct);
      const pctLabel = Number.isFinite(pct) ? `${pct.toFixed(2)}%` : `${info.pct}%`;
      const formatNombre = (txt) => {
        const s = (txt || '').trim().toLowerCase();
        if (!s) return '-';
        return s.split(/\s+/).map(w => w ? w[0].toUpperCase() + w.slice(1) : '').join(' ').trim();
      };
      const ingenieroLabel = formatNombre(info.ingeniero);
      let colorClass = 'text-warning';
      if (Number.isFinite(pct)) {
        if (pct <= 0.1) {
          colorClass = 'text-semi-muted';
        } else if (pct >= 90) {
          colorClass = 'text-success';
        } else if (pct < 70) {
          colorClass = 'text-danger';
        }
      }
      $icon.removeClass('text-muted text-success text-warning text-danger').addClass(colorClass);
      const tooltipHtml = `<strong>Calidad:</strong> ${pctLabel}<br><strong>Ing. Calidad:</strong> ${ingenieroLabel}`;
      try { $icon.tooltip('dispose'); } catch (e) { }
      $icon.attr({
        'data-html': 'true',
        'data-toggle': 'tooltip',
        'data-original-title': tooltipHtml,
        title: tooltipHtml
      });
      $icon.tooltip({ html: true, title: tooltipHtml, placement: 'top', container: 'body', boundary: 'window', template: '<div class="tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner text-left"></div></div>' });
      $icon.css('visibility', 'visible').show();
    } catch (error) {
      console.error('Error decorando completitud de fuente:', clave, error);
      try { $icon.tooltip('dispose'); } catch (e) { }
      $icon.css('visibility', 'hidden').show();
    }
  },

  async getCompletitudPorFuente(clave) {
    const key = (clave || '').trim();
    if (!key) return null;
    if (this.calidadCache.has(key)) return this.calidadCache.get(key);
    if (this.calidadInflight.has(key)) return this.calidadInflight.get(key);

    const parts = key.split('.');
    if (parts.length < 4) return null;
    const [servidor, base, esquema, tabla] = parts;
    const esc = (v) => String(v || '').replace(/'/g, "''");

    const queryBody = {
      campos: "TOP 20 SERVIDOR, BASE, ESQUEMA, TABLA, ingeniero_calidad, promedio_buena_calidad, estado",
      origen: "PROCESOS_BI.dbo.vw_T_Calidad_Backlog_Completa",
      condicion: `SERVIDOR='${esc(servidor)}' AND BASE='${esc(base)}' AND ESQUEMA='${esc(esquema)}' AND TABLA='${esc(tabla)}'`
    };

    const promise = ApiService.query(queryBody).then(rows => {
      if (!rows || !rows.length) {
        this.calidadCache.set(key, null);
        this.calidadInflight.delete(key);
        return null;
      }
      const row = rows[0];
      const num = Number(row.promedio_buena_calidad);
      const pct = Number.isNaN(num) ? null : num;
      const info = pct == null ? null : { pct, ingeniero: row.ingeniero_calidad || '' };
      this.calidadCache.set(key, info);
      this.calidadInflight.delete(key);
      return info;
    }).catch(err => {
      console.error('Error consultando completitud de fuente:', key, err);
      this.calidadInflight.delete(key);
      return null;
    });

    this.calidadInflight.set(key, promise);
    return promise;
  },

  async decorateProfilingIcon($container, clave) {
    if (!$container || !$container.length) return;

    try {
      const info = await this.getUltimoProfilingPorFuente(clave);
      const hasInfo = !!(info && info.url);

      const parts = clave.split('.');
      const servidor = parts[0] || '';
      const base = parts[1] || '';
      const esquema = parts[2] || '';
      const tabla = parts[3] || '';

      const usuario = window.current_user || '';

      const accionGenerar = `generarProfiling('${usuario}', '${servidor}', '${base}','${esquema}','${tabla}')`;
      const accionVerHistorial = `mostrarPopupProfiling('${base}','${esquema}','${tabla}')`;

      let accionVerUltimo;
      let iconClass;
      let tooltipTitle;

      if (hasInfo) {
        accionVerUltimo = `window.open('${info.url}', '_blank')`;
        iconClass = "text-primary";
        const safeName = this.escapeHtml(info.nombre || '-');
        tooltipTitle = `<strong>Profiling:</strong> ${safeName}`;
      } else {
        accionVerUltimo = `alert('No se ha encontrado un reporte de profiling reciente para esta fuente.')`;
        iconClass = "text-semi-muted";
        tooltipTitle = `Sin profiling reciente`;
      }

      const dropdownHtml = `
            <a href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="simple-icon-graph ${iconClass}" style="font-size: 18px;"></i>
            </a>

            <div class="dropdown-menu dropdown-menu-right">
                <a class="dropdown-item" href="#" onclick="${accionGenerar}">
                    <i class="simple-icon-magic-wand mr-1"></i> Generar Profiling
                </a>
                
                <a class="dropdown-item" href="#" onclick="${accionVerHistorial}">
                    <i class="simple-icon-eye mr-1"></i> Ver historial Profiling
                </a>

                <a class="dropdown-item" href="#" onclick="${accionVerUltimo}; return false;">
                    <i class="simple-icon-link mr-1"></i> Ver ultimo Profiling 
                </a>
            </div>
        `;

      $container.html(dropdownHtml);

      const $trigger = $container.find('a[data-toggle="dropdown"]');
      $trigger.tooltip({
        title: tooltipTitle,
        html: true,
        placement: 'top',
        trigger: 'hover',
        container: 'body',
        boundary: 'window',
        template: '<div class="tooltip" role="tooltip" style="pointer-events: none;"><div class="arrow"></div><div class="tooltip-inner"></div></div>'
      });

      $container.on('show.bs.dropdown', function () {
        $trigger.tooltip('hide');
      });
      $container.css('visibility', 'visible').show();

    } catch (error) {
      console.error('Error decorando profiling de fuente:', clave, error);
      $container.css('visibility', 'hidden');
    }
  },

  // async decorateProfilingIcon($anchor, clave) {
  //   if (!$anchor || !$anchor.length) return;
  //   try {
  //     const info = await this.getUltimoProfilingPorFuente(clave);
  //     if (!info) {
  //       $anchor.removeAttr('href').css('visibility', 'hidden').show();
  //       return;
  //     }
  //     $anchor.attr('href', info.url);
  //     const safeName = this.escapeHtml(info.nombre || '-');
  //     const tooltipHtml = `<strong>Profiling:</strong> ${safeName}`;
  //     try { $anchor.tooltip('dispose'); } catch (e) { }
  //     $anchor.attr({
  //       'data-html': 'true',
  //       'data-toggle': 'tooltip',
  //       'data-original-title': tooltipHtml,
  //       title: tooltipHtml
  //     });
  //     $anchor.tooltip({
  //       html: true,
  //       title: tooltipHtml,
  //       placement: 'top',
  //       container: 'body',
  //       boundary: 'window',
  //       template: '<div class="tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner text-left"></div></div>'
  //     });
  //     $anchor.css('visibility', 'visible').show();
  //   } catch (error) {
  //     console.error('Error decorando profiling de fuente:', clave, error);
  //     $anchor.removeAttr('href').css('visibility', 'hidden').show();
  //   }
  // },

  async getUltimoProfilingPorFuente(clave) {
    const key = (clave || '').trim();
    if (!key) return null;
    if (this.profilingCache.has(key)) return this.profilingCache.get(key);
    if (this.profilingInflight.has(key)) return this.profilingInflight.get(key);

    const parts = key.split('.');
    if (parts.length < 4) return null;
    const [, base, esquema, tabla] = parts;
    const prefix = `${base}-${esquema}-${tabla}-`;
    const baseUrl = typeof BASE_URL !== 'undefined' ? BASE_URL : '';
    const folder = `${baseUrl}Profiling/`;

    const promise = new Promise((resolve) => {
      $().SPServices({
        operation: "GetListItems",
        async: true,
        listName: "OGA_Suite",
        CAMLQueryOptions: `<QueryOptions><Folder>${folder}</Folder></QueryOptions>`,
        CAMLViewFields: "<ViewFields><FieldRef Name='LinkFilename' /></ViewFields>",
        completefunc: (xData, Status) => {
          if (Status !== "success") {
            console.warn("No se pudieron obtener archivos de profiling para", clave);
            resolve(null);
            return;
          }
          const archivos = $(xData.responseXML).find("z\\:row, row").map(function () {
            const nombre = $(this).attr("ows_LinkFilename");
            return nombre || null;
          }).get().filter(Boolean);

          const candidatos = archivos
            .filter(nombre => nombre.startsWith(prefix))
            .map(nombre => {
              const resto = nombre.substring(prefix.length);
              const fechaStr = resto.split('.')[0] || '';
              return { nombre, fechaStr };
            });

          if (!candidatos.length) {
            resolve(null);
            return;
          }

          candidatos.sort((a, b) => b.fechaStr.localeCompare(a.fechaStr));
          const elegido = candidatos[0].nombre;
          resolve({ nombre: elegido, url: `${folder}${elegido}` });
        }
      });
    }).then((res) => {
      this.profilingCache.set(key, res);
      this.profilingInflight.delete(key);
      return res;
    }).catch(err => {
      console.error('Error consultando profiling de fuente:', key, err);
      this.profilingInflight.delete(key);
      return null;
    });

    this.profilingInflight.set(key, promise);
    return promise;
  },

  async getFuentesDeCasoCached(idCasoUso) {
    const key = Number(idCasoUso);
    if (this.fuentesCache.has(key)) return this.fuentesCache.get(key);
    if (this.fuentesInflight.has(key)) return this.fuentesInflight.get(key);

    const promise = (async () => {
      // Asume que `queryCasosUso` es una función global
      const rows = await ApiService.query({
        campos: 'ID_FUENTE, CLAVE_FUENTE',
        origen: 'PROCESOS_BI.DBO.T_CASOS_USO_FUENTES',
        condicion: `ID_CASO_USO = ${key} AND SN_ACTIVO = 1`
      });
      const data = rows.map(r => ({ id_fuente: r.ID_FUENTE, clave: r.CLAVE_FUENTE })).filter(x => x.clave);
      this.fuentesCache.set(key, data);
      this.fuentesInflight.delete(key);
      return data;
    })().catch(err => {
      this.fuentesInflight.delete(key);
      throw err;
    });

    this.fuentesInflight.set(key, promise);
    return promise;
  },

  // --- Lógica de Responsables Adicionales ---
  async loadResponsablesDelCaso() {
    this.elements.responsables.lista.html('<li class="list-group-item text-muted">Cargando responsablesâ¦</li>');
    const idCaso = Number($('#detalle-id').val());
    if (!idCaso) {
      this.elements.responsables.lista.html('<li class="list-group-item text-warning">Sin ID de caso</li>');
      return;
    }

    try {
      const data = await ApiService.query({
        campos: 'ID_ESTRUCTURA, USUARIO_ESTRUCTURA, USUARIO_ROL, SN_ACTIVO',
        origen: 'PROCESOS_BI.DBO.T_CASOS_USO_ESTRUCTURA', // No es necesario un alias aquí­
        condicion: `ID_CASO_USO = ${idCaso} AND SN_ACTIVO = 1` // Se quita el alias 'r.'
      });

      this.responsablesEnEdicion = data.map(r => ({
        id_responsable: r.ID_ESTRUCTURA,
        cod_empleado: r.USUARIO_ESTRUCTURA,
        nombre: SharePointUtils.getNombrePorCodigo(r.USUARIO_ESTRUCTURA) || 'Nombre no encontrado',
        rol: r.USUARIO_ROL,
        sn_activo: r.SN_ACTIVO
      }));
      this.renderResponsables();
    } catch (e) {
      console.error('Error cargando responsables adicionales:', e);
      this.elements.responsables.lista.html('<li class="list-group-item text-danger">Error al cargar responsables</li>');
    }
  },

  renderResponsables() {
    const { lista } = this.elements.responsables;
    lista.empty();
    // Ordenar por jerarquí­a de rol antes de renderizar
    const order = this.ROL_ORDER || {};
    const rolWeight = (rol) => {
      const norm = (rol || '').toString()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .toLowerCase().trim();
      return order[norm] || Number.MAX_SAFE_INTEGER;
    };
    this.responsablesEnEdicion.sort((a, b) => {
      const va = rolWeight(a.rol);
      const vb = rolWeight(b.rol);
      if (va !== vb) return va - vb;
      return (a.nombre || '').localeCompare(b.nombre || '');
    });
    const total = this.responsablesEnEdicion.length;

    $('#titulo-responsables-agregados-detalle').html(`Responsables agregados <span class="badge badge-pill badge-primary ml-1">${total}</span>`);

    if (total === 0) {
      lista.append('<li class="list-group-item text-muted">Sin responsables adicionales.</li>');
      return;
    }

    this.responsablesEnEdicion.forEach((resp, index) => {
      const $li = $('<li>').addClass('list-group-item d-flex justify-content-between align-items-center')
        .attr('data-id-responsable', resp.id_responsable);

      if (resp.isEditing) {
        // --- MODO EDICIíN ---
        const $select = $(`
          <select class="form-control form-control-sm" style="width: 120px;">
            <option value="Lí_der de Dominio" ${resp.rol === 'Lí_der de Dominio' ? 'selected' : ''}>Lí_der de Dominio</option>
            <option value="Custodio" ${resp.rol === 'Custodio' ? 'selected' : ''}>Custodio</option>
            <option value="Data Translator" ${resp.rol === 'Data Translator' ? 'selected' : ''}>Data Translator</option>
            <option value="Especialista de Calidad" ${resp.rol === 'Especialista de Calidad' ? 'selected' : ''}>Especialista de Calidad</option>
            <option value="Administrador" ${resp.rol === 'Administrador' ? 'selected' : ''}>Administrador</option>
          </select>
        `);
        const $spanNombre = $(`<span>: ${resp.nombre}</span>`);
        const $saveIcon = $(`<i class="simple-icon-check text-success p-1 btn-save-responsable" style="cursor: pointer;" title="Guardar Rol" data-index="${index}"></i>`);

        $li.append($('<div>').addClass('d-flex align-items-center').append($select).append($spanNombre));
        $li.append($saveIcon);
      } else {
        // --- MODO VISTA ---
        $li.append(`<span><strong>${resp.rol}:</strong> ${resp.nombre}</span>`);
        const $editIcon = $(`<i class="simple-icon-pencil text-info p-1 btn-edit-responsable" style="cursor: pointer;" title="Editar Rol" data-index="${index}"></i>`);
        const $delIcon = $(`<i class="simple-icon-trash text-danger p-1 btn-del-responsable" style="cursor: pointer;" title="Eliminar Responsable" data-index="${index}"></i>`);
        $li.append($('<div>').append($editIcon).append($delIcon));
      }
      lista.append($li);
    });
    this.applyPermissionsForUser();
  },

  handleDeleteResponsable(index) {
    const responsable = this.responsablesEnEdicion[index];
    if (responsable && responsable.id_responsable) {
      this.responsablesParaDesactivar.push(responsable.id_responsable);
    }
    this.responsablesEnEdicion.splice(index, 1);
    this.markStepAsDirty();
    this.renderResponsables();
  },


  /**
   * Maneja el guardado de un nuevo atributo.
   */
  async handleSaveAtributo() {
    const { atributos } = this.elements || {};
    if (!atributos) {
      console.warn("handleSaveAtributo llamado sin elementos de atributos configurados.");
      return;
    }

    const tipo = atributos.tipo.val();
    const id = atributos.id.val().trim();
    const nombre = atributos.nombre.val().trim();
    const descripcion = atributos.descripcion.val().trim();
    const dominioId = atributos.dominio.val();

    if (!id || !nombre || !descripcion || !dominioId) {
      showNotification("top", "center", "warning", "Por favor, completa todos los campos del atributo.");
      return;
    }

    // El flujo real de guardado vive en listenerbtnAddAtributo (suite.js),
    // que escribe en SharePoint. Este helper solo valida y delega a dicho flujo.
    atributos.btnAgregar.trigger('click');
  },

  /**
   * Maneja el clic en el botón de guardar.
   * Si es el íºltimo paso, guarda y cierra. Si no, solo guarda el progreso.
   */
  async handleSaveClick() {
    this.elements.saveBtn.prop('disabled', true);
    try {
      await this.handleUpdate(); // Llama a la lógica de guardado
      this.markStepAsClean(); // Marcar como limpio después de guardar
      showNotification("top", "center", "success", "Cambios guardados correctamente.", 1500);

      // Si es el íºltimo paso, cierra el modal y refresca.
      if (window.refrescarCasosUso) {
        await window.refrescarCasosUso();
      }
    } finally {
      this.elements.saveBtn.prop('disabled', false);
    }
  },

  /**
   * Carga y renderiza los téminos asociados al caso de uso actual.
   */
  async loadAndRenderTerms() {
    const { listaTerminos } = this.elements;
    listaTerminos.html('<li class="list-group-item text-muted">Cargando...</li>');
    this.elements.downloadTerminosBtn.prop('disabled', true);
    this.setReportReady(false);
    this.terminosActuales = [];

    const idCasoUso = Number($('#detalle-id').val());
    if (!idCasoUso) {
      listaTerminos.html('<li class="list-group-item text-muted">No se ha podido identificar el caso de uso.</li>');
      this.setReportReady(true);
      return;
    }

    try {
      // 1. Obtener las relaciones desde SQL Server (sustituyendo ApiService por SqlHelper por consistencia)
      const relaciones = await window.SqlHelper.query(
        'ID_CASO_TERMINOS, COD_TERMINOS, TIPO_TERMINOS',
        'PROCESOS_BI.DBO.T_CASOS_USO_TERMINOS_MB',
        `ID_CASO_USO = ${idCasoUso} AND SN_ACTIVO = 1`
      );

      if (!relaciones || relaciones.length === 0) {
        this.renderTerms([]);
        this.setReportReady(true);
        return;
      }

      // 2. Obtener la información de cada término usando TerminosService
      const terminos = await Promise.all((relaciones || []).map(async (rel) => {
        // Buscamos el término directamente en SQL Server
        const infoTermino = await window.TerminosService.getById(rel.COD_TERMINOS);

        if (infoTermino) {
          // Parseo seguro de prioridad desde SQL
          const prioridadNum = Number(infoTermino.prioridad);
          const prioridadFinal = Number.isNaN(prioridadNum) || infoTermino.prioridad === null
            ? Number.POSITIVE_INFINITY
            : prioridadNum;

          return {
            id: infoTermino.id,
            sharepointId: rel.COD_TERMINOS, // Se mantiene por si otro método depende de esta llave
            nombre: infoTermino.nombre,
            descripcion: infoTermino.descripcion,
            prioridad: prioridadFinal,
            casoTermId: rel.ID_CASO_TERMINOS,
            tipo: rel.TIPO_TERMINOS
          };
        } else {
          // Fallback en caso de que el ID exista en la relación pero el término esté inactivo/borrado
          return {
            id: '',
            sharepointId: rel.COD_TERMINOS,
            nombre: '(Término no encontrado)',
            descripcion: '',
            prioridad: Number.POSITIVE_INFINITY,
            casoTermId: rel.ID_CASO_TERMINOS,
            tipo: rel.TIPO_TERMINOS
          };
        }
      }));

      // 3. Ordenar y renderizar
      const ordenados = terminos
        .filter(Boolean)
        .sort((a, b) => (a.prioridad || Number.POSITIVE_INFINITY) - (b.prioridad || Number.POSITIVE_INFINITY));

      this.renderTerms(ordenados);
    } catch (error) {
      this.renderTermsError();
      console.error('Error al cargar términos del caso de uso:', error);
    } finally {
      this.setReportReady(true);
    }
  },
  /**
   * Renderiza la lista de téminos en la UI.
   * @param {Array<Object>} terminos - El array de objetos de téminos.
   */
  renderTerms(terminos) {
    const { listaTerminos, containerTerminosAsociados, containerSinTerminos } = this.elements;

    this.terminosActuales = terminos;
    const hasTerms = terminos.length > 0;
    this.elements.downloadTerminosBtn.prop('disabled', !hasTerms);

    if (!hasTerms) {
      $('#titulo-terminos-asociados-detalle').html('Terminos Asociados');
      containerSinTerminos.show();
      containerTerminosAsociados.hide();
      return;
    }
    $('#titulo-terminos-asociados-detalle').html(`Terminos Asociados <span class="badge badge-pill badge-primary ml-1">${terminos.length}</span>`);
    containerSinTerminos.hide();
    containerTerminosAsociados.show();

    const html = terminos.map(t => {
      const termId = t.sharepointId;
      const casoTermId = t.casoTermId;
      return `
      <li class="list-group-item" data-term-id="${termId || ''}" data-case-term-id="${casoTermId || ''}">
        <div class="d-flex w-100 justify-content-between">
          <h6 class="mb-1">${t.nombre || 'Sin nombre'}</h6>
            <div class="d-flex align-items-center">
              <i class="simple-icon-pencil text-info p-1 btn-edit-term" style="cursor: pointer;" title="Editar Termino"></i>
              <i class="simple-icon-trash text-danger p-1 btn-delete-term" style="cursor: pointer;" title="Quitar Termino del Caso de Uso"></i>
          </div>
        </div>
        <p class="mb-1 small">${t.descripcion || 'Sin descripcion.'}</p>
      </li>`;
    }).join('');
    listaTerminos.html(html);
    this.applyPermissionsForUser();
  },

  async downloadTermsExcel() {
    if (!this.terminosActuales || this.terminosActuales.length === 0) {
      showNotification("top", "center", "info", "No hay terminos asociados para descargar.", 2000);
      return;
    }
    const ok = await this.ensureXlsxLibrary();
    if (!ok || typeof XLSX === 'undefined') return;

    const rows = [
      ['ID Metadato', 'Nombre', 'Descripcion', 'Prioridad']
    ];
    this.terminosActuales.forEach((t) => {
      rows.push([t.id || '', t.nombre || '', t.descripcion || '', Number.isFinite(t.prioridad) ? t.prioridad : '']);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Terminos');

    const idCaso = $('#detalle-id').val() || 'caso_de_uso';
    const safeId = String(idCaso).trim().replace(/[^a-zA-Z0-9_-]+/g, '-');
    const filename = `terminos_asociados_${safeId || 'caso'}.xlsx`;
    XLSX.writeFile(workbook, filename);
  },

  async ensureXlsxLibrary() {
    if (typeof XLSX !== 'undefined') return true;
    const existing = document.getElementById('xlsx-lib');
    if (existing) {
      await new Promise((resolve, reject) => {
        existing.addEventListener('load', resolve, { once: true });
        existing.addEventListener('error', reject, { once: true });
      }).catch(() => { });
      return typeof XLSX !== 'undefined';
    }
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.id = 'xlsx-lib';
      script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
      script.onload = () => resolve(true);
      script.onerror = () => {
        alert('No se pudo cargar la libreria XLSX para exportar.');
        resolve(false);
      };
      document.head.appendChild(script);
    });
  },

  /**
   * Muestra un mensaje de error en las listas de téminos.
   */
  renderTermsError() {
    this.elements.listaTerminos.html('<li class="list-group-item text-danger">Error al cargar la lista de téminos.</li>');
    this.terminosActuales = [];
    this.elements.downloadTerminosBtn.prop('disabled', true);
    console.error("Error al cargar los téminos con SPServices en Detalles.");
  },

  /**
   * Maneja la eliminación (desasociación) de un témino del caso de uso.
   */
  async handleDeleteTerm(event) {
    const $li = $(event.currentTarget).closest('li');
    const caseTermId = $li.data('case-term-id'); // ID de la relación en la tabla puente
    const termId = $li.data('term-id'); // ID del término en SQL Server

    // 🌟 Obtenemos el ID del Caso de Uso actual para poder borrarlo de la cadena
    const idCasoUso = String(this.currentCasoId || $('#detalle-id').val());

    if (!caseTermId) {
      console.error('No se pudo encontrar el ID de la relación a eliminar.');
      return;
    }

    $('#confirmDeleteModalBody').text('¿Estás seguro de que quieres quitar este término del caso de uso?');
    $('#confirmDeleteModal').modal('show');

    $('#btnConfirmDelete').off('click').on('click', async () => {
      $('#confirmDeleteModal').modal('hide');

      try {
        // Obtenemos el ID/código del usuario
        const usuarioCode = typeof SharePointUtils !== 'undefined'
          ? SharePointUtils.getEmployeeCodeByUser(window.current_user)
          : 0;

        const fechaModificacion = new Date().toISOString().slice(0, 23).replace('T', ' ');

        // 1. Desactivamos la RELACIÓN entre el Caso de Uso y el Término
        await window.SqlHelper.update(
          'PROCESOS_BI.DBO.T_CASOS_USO_TERMINOS_MB',
          { SN_ACTIVO: 0, FEC_MODIFICACION: fechaModificacion, USUARIO_MODIFICACION: usuarioCode },
          `ID_CASO_TERMINOS = ${caseTermId}`
        );

        // 2. Limpiamos el ID del Caso de Uso de la cadena en el Diccionario global
        if (termId) {
          // 🌟 Agregamos 'await' para esperar la respuesta de SQL
          const term = await window.TerminosService.getById(termId);

          if (term) {
            // Separamos por punto y coma, limpiamos espacios y descartamos vacíos
            const casosArray = (term.casos_uso || "").split(";").map(c => c.trim()).filter(Boolean);

            // 🌟 Filtramos el array descartando el Caso de Uso que estamos eliminando
            const newCasosArray = casosArray.filter(id => id !== idCasoUso);

            // Actualizamos el término con la nueva lista unida por "; "
            await window.TerminosService.update(
              termId,
              { casos_uso: newCasosArray.join("; ") },
              usuarioCode
            );
          }
        }

        if (typeof showNotification === 'function') {
          showNotification('top', 'center', 'success', 'Término quitado correctamente.', 2000);
        }

        // Recargamos la lista
        this.loadAndRenderTerms();

      } catch (error) {
        console.error('Error al quitar el término:', error);
        if (typeof showNotification === 'function') {
          showNotification('top', 'center', 'danger', 'Ocurrió un error al quitar el término.', 3000);
        }
      }
    });
  },

  /**
   * Maneja la edición de un témino, abriendo el modal con los datos precargados.
   */
  async handleEditTerm(event, context) {
    const termId = $(event.currentTarget).closest('li').data('term-id');
    if (!termId) {
      console.error("No se pudo encontrar el ID del término a editar.", event.currentTarget);
      return;
    }

    try {
      // 1. Obtener todos los datos del término usando TerminosService (SQL Server)
      const termData = await window.TerminosService.getById(termId);

      if (!termData) {
        throw new Error("Término no encontrado en la base de datos.");
      }

      // 2. Abrir y poblar el modal en modo EDICIÓN
      $('#btnAbrirModalAtributoDetalle').click();

      setTimeout(async () => {
        $('#exampleModalContentLabel').text('Editar Término');
        $('#modalAtributo').modal('show');

        // Deshabilitar el listener de 'change' temporalmente para evitar recálculo de ID
        $("#tipo").off('change.listenerTipo');
        $("#tipo").val('TERMINO').trigger('change');
        $("#tipo").prop('disabled', true);

        // Poblar los campos principales
        $('#idatributo').val(termData.id);
        $('#NOMBREA').val(termData.nombre || '');
        $('#Descripcion').val(termData.descripcion || '');

        // 🌟 LÓGICA DE DOMINIOS MÚLTIPLES
        const $selectDominio = $('#nombred');
        if (typeof NuevoCasoWizard !== 'undefined') {
          const dominios = await NuevoCasoWizard.cargarDominios();

          // 1. Convertir el select a modo múltiple temporalmente
          $selectDominio.prop('multiple', true);
          if ($selectDominio.data('select2')) {
            $selectDominio.select2('destroy');
          }
          $selectDominio.select2({
            theme: "bootstrap",
            placeholder: "Seleccione dominio(s)",
            dropdownParent: $('#modalAtributo'),
            width: '100%'
          });

          // 2. Extraer los nombres guardados en SQL (ej: "Riesgos; Finanzas")
          const dominiosGuardados = (termData.dominios || termData.dominio || "").split(';').map(d => d.trim()).filter(Boolean);

          // 3. Buscar los IDs que corresponden a esos nombres en el catálogo
          const idsPreseleccionados = dominios
            .filter(d => dominiosGuardados.includes(d.descripcion))
            .map(d => d.id);

          // 4. Preseleccionar en la UI
          if (idsPreseleccionados.length > 0) {
            $selectDominio.val(idsPreseleccionados).trigger('change.select2');
          } else {
            $selectDominio.val(null).trigger('change.select2');
          }
        }

        // Poblar selects múltiples y campos extra
        if (termData.caracteristicas) $('#nombrecaract').val(termData.caracteristicas.split('; ')).trigger('change');
        if (termData.dato_personal !== undefined) $('#datopersonal').val(termData.dato_personal).trigger('change');
        if (termData.golden_record !== undefined) $('#goldenrecord').val(termData.golden_record ? '1' : '0').trigger('change');
        if (termData.catalogos_asociados) $('#catalogos').val(termData.catalogos_asociados.split('; ')).trigger('change');
        $('#prioridad_glosario').val(termData.prioridad || '');

        // Sobrescribir el evento de guardado
        const saveButton = $('#btnagregaratributo');
        saveButton.off('click.saveAtributo');

        saveButton.on('click.saveAtributo', async () => {

          const dominiosNombres = $('#nombred option:selected').map(function () {
            return $(this).text().trim();
          }).get().filter(Boolean).join('; ');

          const payloadUpdate = {
            nombre: $("#NOMBREA").val().trim(),
            descripcion: $("#Descripcion").val().trim(),
            dominios: dominiosNombres || null, // Guardamos la cadena separada por ";"
            caracteristicas: ($("#nombrecaract").val() || []).join('; '),
            dato_personal: $("#datopersonal").val() ? Number($("#datopersonal").val()) : null,
            golden_record: $("#goldenrecord").val() === "1" ? 1 : 0,
            catalogos_asociados: ($("#catalogos").val() || []).join('; '),
            prioridad: $("#prioridad_glosario").val() ? Number($("#prioridad_glosario").val()) : null
          };

          try {
            const usuarioCode = typeof SharePointUtils !== 'undefined'
              ? SharePointUtils.getEmployeeCodeByUser(window.current_user)
              : 0;

            await window.TerminosService.update(termData.id, payloadUpdate, usuarioCode);

            if (typeof showNotification === 'function') {
              showNotification("top", "center", "success", "Término actualizado correctamente.", 2000);
            }

            $('#modalAtributo').modal('hide');
            context.loadAndRenderTerms();

          } catch (error) {
            console.error("Error al actualizar el término:", error);
            if (typeof showNotification === 'function') {
              showNotification("top", "center", "danger", "Ocurrió un error al actualizar el término.", 3000);
            }
          }
        });

        // Restaurar el modal cuando se cierre para que no afecte a otros botones
        $('#modalAtributo').off('hidden.bs.modal.restore').on('hidden.bs.modal.restore', () => {
          saveButton.off('click.saveAtributo');

          $selectDominio.prop('multiple', false);
          if ($selectDominio.data('select2')) {
            $selectDominio.select2('destroy');
          }
          $selectDominio.select2({ theme: "bootstrap", dropdownParent: $('#modalAtributo'), width: '100%' });

          if (typeof listenerbtnAddAtributo === 'function') {
            listenerbtnAddAtributo();
          }

          $('#exampleModalContentLabel').text('Agregar Atributo/Término');
          $("#tipo").prop('disabled', false);
        });

      }, 200);

    } catch (error) {
      console.error("Error al preparar la edición del término:", error);
      if (typeof showNotification === 'function') {
        showNotification("top", "center", "danger", "Ocurrió un error al cargar los datos del término.", 3000);
      }
    }
  },

  /**
   * Inicializa el campo de bíºsqueda de téminos con Select2.
   */
  async initTerminosSearch() {
    const { asignarTerminosSelect } = this.elements;

    if (asignarTerminosSelect.data('select2')) {
      return; // Ya inicializado
    }

    try {
      // 1. Consultar a SQL Server usando SqlHelper
      // Traemos solo los campos necesarios, filtramos por TERMINO activo y ordenamos alfabéticamente
      const terminosDb = await window.SqlHelper.query(
        "id, nombre",
        window.TerminosService.TABLA || "procesos_bi.dbo.T_terminos",
        "tipo = 'TERMINO' AND sn_activo = 1 ORDER BY nombre ASC"
      );

      // 2. Mapear los resultados al formato exacto que requiere Select2 ({ id, text })
      const terminosData = terminosDb.map(termino => ({
        id: termino.id,
        text: `${termino.nombre} (ID: ${termino.id})`
      }));

      // 3. Inicializar Select2 con los datos de SQL
      asignarTerminosSelect.select2({
        theme: "bootstrap",
        placeholder: "Buscar por nombre o ID de término...",
        data: terminosData,
        minimumInputLength: 2,
        dropdownParent: this.elements.modal, // Asegura que el dropdown aparezca sobre el modal
        language: {
          inputTooShort: function (args) {
            return "Por favor, ingresa 2 o más caracteres";
          }
        }
      });

    } catch (error) {
      console.error("Error al cargar términos para el buscador con SQL Server en Detalles:", error);

      // Fallback visual en caso de error de conexión a la base de datos
      asignarTerminosSelect.select2({
        theme: "bootstrap",
        placeholder: "Error al cargar términos...",
        dropdownParent: this.elements.modal
      });
    }
  },

  /**
   * Maneja la asignación de téminos existentes al caso de uso.
   */
  async handleAsignarTerminos() {
    const { asignarTerminosSelect } = this.elements;
    const terminosSeleccionados = asignarTerminosSelect.val();
    const idCasoUso = Number($('#detalle-id').val());

    if (!terminosSeleccionados || terminosSeleccionados.length === 0) {
      if (typeof showNotification === 'function') showNotification('top', 'center', 'info', 'No has seleccionado ningun termino para asignar.', 2000);
      return;
    }

    if (!idCasoUso) {
      if (typeof showNotification === 'function') showNotification('top', 'center', 'warning', 'No se pudo identificar el caso de uso actual para la asignacion.', 2500);
      return;
    }

    const usuarioCode = typeof SharePointUtils !== 'undefined' ? SharePointUtils.getEmployeeCodeByUser(window.current_user) : 0;
    const nowSql = () => new Date().toISOString().slice(0, 23).replace('T', ' ');

    this.elements.btnAsignarTerminos.prop('disabled', true).text('Asignando...');

    try {
      // 1. Obtener relaciones existentes en la tabla puente para este Caso de Uso
      const existentes = await ApiService.query({
        campos: 'ID_CASO_TERMINOS, COD_TERMINOS, SN_ACTIVO',
        origen: 'PROCESOS_BI.DBO.T_CASOS_USO_TERMINOS_MB',
        condicion: `ID_CASO_USO = ${idCasoUso}`
      });
      const mapaExistentes = new Map((existentes || []).map(r => [String(r.COD_TERMINOS).trim(), r]));

      // 2. 🌟 NUEVO: Determinar el dominio al que pertenece el caso de uso
      const nombreDominioCaso = window.mapaCasoUsoDominio && window.mapaCasoUsoDominio[idCasoUso.toString()];

      const promesasSql = [];

      // 3. Procesar cada término seleccionado
      for (const terminoIdRaw of terminosSeleccionados) {
        const terminoId = String(terminoIdRaw).trim();
        const existente = mapaExistentes.get(terminoId);

        // A. LÓGICA DE TABLA PUENTE (Actualizar si existe inactivo, Insertar si es nuevo)
        if (existente) {
          if (!existente.SN_ACTIVO) {
            promesasSql.push(ApiService.update(
              'PROCESOS_BI.DBO.T_CASOS_USO_TERMINOS_MB',
              { SN_ACTIVO: 1, FEC_MODIFICACION: nowSql(), USUARIO_MODIFICACION: usuarioCode },
              `ID_CASO_TERMINOS = ${existente.ID_CASO_TERMINOS}`
            ));
          }
        } else {
          promesasSql.push(ApiService.insert('PROCESOS_BI.DBO.T_CASOS_USO_TERMINOS_MB', {
            ID_CASO_USO: idCasoUso,
            TIPO_TERMINOS: 'T',
            COD_TERMINOS: terminoId,
            SN_ACTIVO: 1,
            USUARIO_CREACION: usuarioCode,
            FEC_CREACION: nowSql()
          }));
        }

        // B. 🌟 LÓGICA DE ACTUALIZACIÓN DIRECTA DEL TÉRMINO (Idéntico a saveCard)
        promesasSql.push((async () => {
          const term = await window.TerminosService.getById(terminoId);
          if (term) {
            // Extraemos y limpiamos arreglos actuales
            let casosArray = (term.casos_uso || "").split(";").map(c => c.trim()).filter(Boolean);
            let dominiosArray = (term.dominios || term.dominio || "").split(";").map(d => d.trim()).filter(Boolean);

            let needsUpdate = false;

            // Agregamos el id del Caso de Uso si no está
            const idCasoUsoStr = String(idCasoUso);
            if (!casosArray.includes(idCasoUsoStr)) {
              casosArray.push(idCasoUsoStr);
              needsUpdate = true;
            }

            // Agregamos el Dominio del Caso de Uso si no está (Lógica en cascada de saveCard)
            if (nombreDominioCaso && !dominiosArray.includes(nombreDominioCaso)) {
              dominiosArray.push(nombreDominioCaso);
              needsUpdate = true;
            }

            // Si hubo cambios en los arrays, actualizamos el registro del término en la DB
            if (needsUpdate) {
              await window.TerminosService.update(
                terminoId,
                {
                  casos_uso: casosArray.join("; "),
                  dominios: dominiosArray.join("; ")
                },
                usuarioCode
              );
            }
          }
        })());
      }

      // Ejecutamos TODAS las inserciones, updates y modificaciones de términos en paralelo
      await Promise.all(promesasSql);

      // Actualizamos la caché global de mapaTerminoCasosUso en memoria
      if (window.mapaTerminoCasosUso) {
        terminosSeleccionados.forEach(termId => {
          const termStr = String(termId).trim();
          if (!window.mapaTerminoCasosUso.has(termStr)) {
            window.mapaTerminoCasosUso.set(termStr, []);
          }
          if (!window.mapaTerminoCasosUso.get(termStr).includes(String(idCasoUso))) {
            window.mapaTerminoCasosUso.get(termStr).push(String(idCasoUso));
          }
        });
      }

      if (typeof showNotification === 'function') showNotification('top', 'center', 'success', 'Términos asignados y actualizados correctamente.', 2000);

      this.loadAndRenderTerms();
      asignarTerminosSelect.val(null).trigger('change');

    } catch (error) {
      console.error('Error al asignar terminos:', error);
      if (typeof showNotification === 'function') showNotification('top', 'center', 'danger', 'Ocurrió un error al asignar los terminos.', 3000);
    } finally {
      this.elements.btnAsignarTerminos.prop('disabled', false).html(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg><span class="label">Asignar</span>`);
    }
  },

  /**
   * Asigna automaticamente un termino recien creado al caso de uso actual.
   * @param {number} idCasoUso
   * @param {number|string} terminoId
   */
  async handleAsignarTerminoRecienCreado(idCasoUso, terminoId) {
    try {
      const usuarioCode = SharePointUtils.getEmployeeCodeByUser(window.current_user);
      const nowSql = () => new Date().toISOString().slice(0, 23).replace('T', ' ');

      const existentes = await ApiService.query({
        campos: 'ID_CASO_TERMINOS, SN_ACTIVO',
        origen: 'PROCESOS_BI.DBO.T_CASOS_USO_TERMINOS_MB',
        condicion: `ID_CASO_USO = ${idCasoUso} AND COD_TERMINOS = '${terminoId}'`
      });

      if (existentes && existentes.length) {
        const rel = existentes[0];
        if (!rel.SN_ACTIVO) {
          await ApiService.update(
            'PROCESOS_BI.DBO.T_CASOS_USO_TERMINOS_MB',
            { SN_ACTIVO: 1, FEC_MODIFICACION: nowSql(), USUARIO_MODIFICACION: usuarioCode },
            `ID_CASO_TERMINOS = ${rel.ID_CASO_TERMINOS}`
          );
        }
      } else {
        await ApiService.insert('PROCESOS_BI.DBO.T_CASOS_USO_TERMINOS_MB', {
          ID_CASO_USO: idCasoUso,
          TIPO_TERMINOS: 'T',
          COD_TERMINOS: String(terminoId),
          SN_ACTIVO: 1,
          USUARIO_CREACION: usuarioCode,
          FEC_CREACION: nowSql()
        });
        await this.updateTerminoSubdominio(terminoId, idCasoUso);
      }

      this.loadAndRenderTerms();
    } catch (error) {
      console.error('Error al asignar termino recien creado:', error);
      this.loadAndRenderTerms();
    }
  },

  async updateTerminoSubdominio(terminoId, idCasoUso) {
    if (!terminoId || !idCasoUso) return;

    try {
      const token = String(idCasoUso);

      // 1. Obtener el término actual desde SQL Server
      const termino = await window.TerminosService.getById(terminoId);

      if (!termino) {
        console.error('No se pudo obtener el término para actualizar txt_desc_subdominio:', terminoId);
        return;
      }

      // 2. Extraer y procesar la lista actual de subdominios (casos de uso)
      // Ajusta 'txt_desc_subdominio' si en tu tabla SQL la columna se llama diferente (ej. 'subdominio')
      const current = (termino.casos_uso || '').trim();
      const parts = current.split(';').map(v => v.trim()).filter(Boolean);

      // Si el caso de uso ya está asociado, no hacemos nada
      if (parts.includes(token)) {
        return;
      }

      // 3. Agregar el nuevo caso de uso a la cadena
      const updated = parts.length > 0 ? `${current}; ${token}` : token;

      // Obtenemos el ID del usuario actual para la auditoría
      const usuarioCode = typeof SharePointUtils !== 'undefined'
        ? SharePointUtils.getEmployeeCodeByUser(window.current_user)
        : 0;

      // 4. Actualizar el término en la base de datos
      await window.TerminosService.update(
        termino.id,
        { casos_uso: updated },
        usuarioCode
      );

    } catch (error) {
      console.error('Error al actualizar txt_desc_subdominio del término:', error);
    }
  },
  // NOTE: esta funcion se ejecuta al guardar, tener en cuenta que el boton de guardar tiene dos listeners????
  // el otro se encuentra en CasosUso.aspx[2327], ambos hacen practicamente lo mismo, (el click ejecuta ambos btw)
  async handleUpdate() {
    this.elements.saveBtn.prop('disabled', true);
    try {
      const id = Number($('#detalle-id').val());
      if (!id) throw new Error("El ID del caso de uso es obligatorio.");

      const usuarioCode = await getEmployeeCodeByUser(window.current_user);
      if (!usuarioCode) throw new Error("No se pudo determinar el usuario actual.");

      const fechaModificacion = new Date().toISOString().slice(0, 23).replace('T', ' ');

      // 1. Actualizar el caso de uso principal
      await ApiService.update(
        "PROCESOS_BI.DBO.t_casos_uso_analitica",
        {
          DESCRIPCION_CASO_USO: ($('#detalle-descripcion').val() || "").trim(),
          DETALLE_CASO_USO: this.elements.detalleInput.val().trim(),
          ENTREGABLE_CASO_USO: this.elements.entregableInput.val().trim(),
          SUBDOMINIO: (this.elements.subdominioSelect.val() || "").trim(),
          ESTADO_CASO_USO: ($('#detalle-estado').val() || "").trim() || "ACTIVO",
          SN_ACTIVO: Number($('#detalle-activo').val()),
          TIPO_INICIATIVA: $('#detalle-tipo').val() || "BAU",
          COD_ESPECIALISTA: Number($('#detalle-cod-especialista').val()) || null,
          COD_SPONSOR: Number($('#detalle-cod-sponsor').val()) || null,
          COD_INGENIERO_RESPONSABLE: Number($('#detalle-cod-ingeniero').val()) || null,
          FEC_MODIFICACION: fechaModificacion,
          USUARIO_MODIFICACION: usuarioCode,
          ID_DOMINIO: Number(this.elements.dominioNombreInput.val()) || null
        },
        `ID_CASO_USO = ${id}`
      );

      // 2. Obtener TODAS las fuentes existentes (activas e inactivas) para este caso de uso
      const todasLasFuentesExistentes = await ApiService.query({
        campos: 'ID_FUENTE, CLAVE_FUENTE, SN_ACTIVO',
        origen: 'PROCESOS_BI.DBO.T_CASOS_USO_FUENTES',
        condicion: `ID_CASO_USO = ${id}`
      });
      const mapaFuentesExistentes = new Map(todasLasFuentesExistentes.map(f => [f.CLAVE_FUENTE, f]));
      const promesasFuentes = [];

      // 3. Procesar las fuentes que deben estar presentes (fuentesEnEdicion)
      for (const claveUI of this.fuentesEnEdicion) {
        const fuenteExistente = mapaFuentesExistentes.get(claveUI);

        if (fuenteExistente) {
          // La fuente ya existe. Si está inactiva, la reactivamos.
          if (fuenteExistente.SN_ACTIVO === 0 || fuenteExistente.SN_ACTIVO === false) {
            promesasFuentes.push(ApiService.update(
              'PROCESOS_BI.DBO.T_CASOS_USO_FUENTES',
              { SN_ACTIVO: 1, FEC_MODIFICACION: fechaModificacion, USUARIO_MODIFICACION: usuarioCode },
              `ID_FUENTE = ${fuenteExistente.ID_FUENTE}`
            ));
          }
          // Si ya existe y está activa, no hacemos nada.
        } else {
          // La fuente es genuinamente nueva, la insertamos.
          promesasFuentes.push(ApiService.insert('PROCESOS_BI.DBO.T_CASOS_USO_FUENTES', {
            ID_CASO_USO: id,
            CLAVE_FUENTE: claveUI,
            SN_ACTIVO: 1,
            USUARIO_CREACION: usuarioCode
          }));
        }
      }

      // 4. Desactivar fuentes que se eliminaron de la UI
      const clavesUI = new Set(this.fuentesEnEdicion);
      const fuentesADesactivar = todasLasFuentesExistentes.filter(f =>
        (f.SN_ACTIVO === 1 || f.SN_ACTIVO === true) && !clavesUI.has(f.CLAVE_FUENTE)
      );

      if (fuentesADesactivar.length > 0) {
        const idsParaBorrar = new Set();

        fuentesADesactivar.forEach(fuente => {
          idsParaBorrar.add(fuente.ID_FUENTE);

          if (this.mapaFuentes && this.mapaFuentes[fuente.CLAVE_FUENTE]) {
            delete this.mapaFuentes[fuente.CLAVE_FUENTE];
          }
        });

        if (this.fuentesCache.has(id)) {
          const listaActual = this.fuentesCache.get(id) || [];
          const listaLimpia = listaActual.filter(item => !idsParaBorrar.has(item.id_fuente));
          this.fuentesCache.set(id, listaLimpia);
        }

        const promesasDesactivacion = fuentesADesactivar.map(fuente => {
          return ApiService.update( // Usar ApiService.update
            "PROCESOS_BI.DBO.T_CASOS_USO_FUENTES",
            { SN_ACTIVO: 0, FEC_MODIFICACION: fechaModificacion, USUARIO_MODIFICACION: usuarioCode },
            `ID_FUENTE = ${fuente.ID_FUENTE}`
          );
        });
        promesasFuentes.push(...promesasDesactivacion);
      }

      await Promise.all(promesasFuentes);
      await this.loadFuentesDelCaso();

      // --- 5. Actualizar Responsables Adicionales ---
      const promesasResponsables = [];
      const todosLosResponsablesExistentes = await ApiService.query({
        campos: 'ID_ESTRUCTURA, USUARIO_ESTRUCTURA, USUARIO_ROL, SN_ACTIVO',
        origen: 'PROCESOS_BI.DBO.T_CASOS_USO_ESTRUCTURA',
        condicion: `ID_CASO_USO = ${id}`
      });
      const mapaResponsablesExistentes = new Map(todosLosResponsablesExistentes.map(r => [`${r.USUARIO_ESTRUCTURA}-${r.USUARIO_ROL}`, r]));

      // Procesar responsables en la UI
      for (const respUI of this.responsablesEnEdicion) {
        const clave = `${respUI.cod_empleado}-${respUI.rol}`;
        const respExistente = mapaResponsablesExistentes.get(clave);

        if (respExistente) {
          // Si existe pero está inactivo, reactivarlo
          if (respExistente.SN_ACTIVO === 0 || respExistente.SN_ACTIVO === false) {
            promesasResponsables.push(ApiService.update('PROCESOS_BI.DBO.T_CASOS_USO_ESTRUCTURA',
              { SN_ACTIVO: 1, FEC_MODIFICACION: fechaModificacion, USUARIO_MODIFICACION: usuarioCode },
              `ID_ESTRUCTURA = ${respExistente.ID_ESTRUCTURA}`
            ));
          }
        }
      }

      // Desactivar responsables eliminados de la UI
      if (this.responsablesParaDesactivar.length > 0) {
        const idsParaDesactivar = this.responsablesParaDesactivar.join(',');
        promesasResponsables.push(ApiService.update('PROCESOS_BI.DBO.T_CASOS_USO_ESTRUCTURA',
          { SN_ACTIVO: 0, FEC_MODIFICACION: fechaModificacion, USUARIO_MODIFICACION: usuarioCode },
          `ID_ESTRUCTURA IN (${idsParaDesactivar})`));
      }

      await Promise.all(promesasResponsables);

      // 4. Limpiar caché y refrescar UI
      this.fuentesCache.delete(id);
      this.fuentesParaDesactivar = [];
    } catch (error) {
      console.error("Error al actualizar el caso de uso:", error);
      alert("Error al actualizar: " + error.message);
    } finally {
      this.elements.saveBtn.prop('disabled', false);
    }
  },

  ensureConfirmInactiveModal() {
    let modal = $('#confirmInactiveModal');
    if (modal.length) return modal;
    const html = `
      <div class="modal fade" id="confirmInactiveModal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-sm modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h6 class="modal-title">Confirmar</h6>
              <button type="button" class="close" data-dismiss="modal" aria-label="Cerrar">
                <span aria-hidden="true">í</span>
              </button>
            </div>
            <div class="modal-body">Â¿Estás seguro de marcarlo como inactivo</div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-secondary btn-cancelar" data-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-primary btn-confirmar">Sí­, continuar</button>
            </div>
          </div>
        </div>
      </div>`;
    $('body').append(html);
    modal = $('#confirmInactiveModal');
    return modal;
  },

  setupActivoConfirmation() {
    const select = $('#detalle-activo');
    if (!select.length || this._activoConfirmBound) return;
    this._activoConfirmBound = true;
    let previous = select.val();
    const modal = this.ensureConfirmInactiveModal();
    select.on('focus', () => { previous = select.val(); });
    select.on('change', () => {
      if (this._skipActivoChange) {
        this._skipActivoChange = false;
        return;
      }
      const val = select.val();
      if (val === '0' || val === 0) {
        modal.find('.modal-body').text('¿Estás seguro de marcar este caso de uso como inactivo');
        modal.modal('show');
        modal.find('.btn-confirmar').off('click').on('click', () => {
          previous = '0';
          modal.modal('hide');
          this.markStepAsDirty();
        });
        modal.find('.btn-cancelar, .close').off('click').on('click', () => {
          this._skipActivoChange = true;
          select.val(previous || '1').trigger('change');
          modal.modal('hide');
        });
      } else {
        previous = val;
      }
    });
  }
};

$(document).ready(() => {
  DetallesCasoWizard.init();
});