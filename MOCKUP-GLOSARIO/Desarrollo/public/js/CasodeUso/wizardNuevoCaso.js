/**
 * @file Modulo para gestionar el wizard de "Nuevo Caso de Uso".
 * @author Giancarlo Ortiz */


const FALLBACK_REPORT_STYLES_NUEVO = `
body { font-family: "Segoe UI", Arial, sans-serif; background:#f9fafb; margin:0; padding:16px; color:#0f172a; }
.rep-page { max-width: 980px; margin: 0 auto; }
.rep-hero { background:#fff; border:1px solid #e5e7eb; border-radius:10px; padding:14px 16px; display:flex; flex-direction:column; gap:12px; }
.rep-hero__text h1 { margin:0; font-size:22px; }
.rep-kicker { margin:0; font-size:11px; letter-spacing:.35em; text-transform:uppercase; color:#9ca3af; }
.rep-subtitle { margin:4px 0 0; font-size:13px; color:#6b7280; }
.rep-card { background:#fefefe; border:1px solid #e1e5ee; border-radius:10px; padding:10px; }
.rep-card--wide { grid-column:1 / -1; }
.rep-section { background:#fff; border:1px solid #e5e7eb; border-radius:10px; padding:14px 16px; margin-bottom:10px; }
.rep-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:10px; }
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
`



const NuevoCasoWizard = {
  TOTAL_STEPS: 4,
  currentStep: 1,
  empleadosCache: null,
  idDominio: null, // <-- NUEVO: Almacenar el ID del dominio de la URL
  isStepDirty: false, // <-- NUEVO: Para rastrear si hay cambios sin guardar.
  currentCasoId: null, // <-- NUEVO: Almacenar el ID del caso de uso en creacion.
  ROL_ORDER: {
    'Líder de Dominio': 1,
    'Lider de Dominio': 1, // fallback sin acento
    'Custodio': 2,
    'Data Translator': 3,
    'Especialista de Calidad': 4,
    'Administrador': 5,
  },
  responsablesEnEdicion: [], // Responsables adicionales en UI
  responsablesParaDesactivar: [], // IDs a desactivar en BD
  fuentesSeleccionadas: [],
  initialized: false,
  _skipActivoChange: false,
  _activoConfirmBound: false,
  _subdominioStylesInjected: false,
  subdominiosCache: new Map(),
  pendingSubdominioValue: null,
  // Caches para iconos de fuentes
  calidadCache: new Map(),
  calidadInflight: new Map(),
  metallonCache: new Map(),
  metallonInflight: new Map(),
  profilingCache: new Map(),
  profilingInflight: new Map(),

  /**
   * Inicializa el wizard, configurando la navegacion y los manejadores de eventos.
   */
  init() {
    // Evita reinicializar si ya esta activo
    if (this.initialized) return;

    this.cacheDom();
    this.injectSubdominioStyles();
    this.initSubdominioSelect();

    this.idDominio = this.getIdDominioFromUrl(); // Inicializar idDominio
    this.bindEvents();

    this.initialized = true;
  },

  /**
   * Guarda referencias a los elementos del DOM para un acceso mas rapido.
   */
  cacheDom() {
    this.elements = {
      modal: $('#modalNuevoCaso'),
      form: $('#formNuevoCaso'),
      sections: $('#formNuevoCaso .form-section'),
      prevBtn: $('#btnPrevStep'),
      nextBtn: $('#btnNextStep'),
      saveBtn: $('#btnGuardarCaso'),
      reportBtn: $('#btnReporteNuevo'),
      wizardSteps: $('#wizardSteps'),
      descInput: $('#nc_descripcion'),
      domainSelect: $('#nc_dominio'),
      domainHelp: $('#nc_dominio_help'),
      estadoInput: $('#nc_estado'),
      detalleInput: $('#nc_detalle_caso_uso'),
      entregableInput: $('#nc_entregable_caso_uso'),
      subdominioSelect: $('#nc_subdominio'),
      // Inputs de responsables para detectar cambios
      inpEspecialista: $('#nc_inp_especialista'),
      inpSponsor: $('#nc_inp_sponsor'),
      inpIngeniero: $('#nc_inp_ingeniero'),
      // Elementos para fuentes de datos
      fuentes: {
        input: $('#nc_fuente_input'),
        suggestions: $('#nc_fuente_sugerencias'),
        btnAdd: $('#btnAgregarFuente'),
        btnAddSelect: $('#btnAgregarFuenteSelect'),
        servidor: $('#nc_servidor'),
        base: $('#nc_base'),
        esquema: $('#nc_esquema'),
        tabla: $('#nc_tabla'),
        lista: $('#listaFuentes'),
      },
      modalAtributo: $('#modalAtributo'),
      dominioAtributo: $('#modalAtributo #nombred'),
      subdominioAtributo: $('#modalAtributo #nombresub'),
      listaTerminos: $('#listaTerminosCasoUso'),
      containerTerminosAsociados: $('#containerTerminosAsociados'),
      buscarTerminoInput: $('#buscarTermino'),
      containerSinTerminos: $('#containerSinTerminos'),
      listaTerminosDetalle: $('#listaTerminosDetalle'), // <-- Referencia a la lista de terminos del modal de detalle
      // Asignar terminos existentes
      asignarTerminosSelect: $('#nc_asignar_terminos'),
      btnAsignarTerminos: $('#btnAsignarTerminos'),
      // Responsables adicionales
      responsables: {
        inpEmpleado: $('#nc_inp_responsable_adic'),
        codEmpleado: $('#nc_cod_responsable_adic'),
        sugEmpleado: $('#sug_nc_inp_responsable_adic'),
        rolSelect: $('#nc_rol_responsable_adic'),
        btnAdd: $('#btnAgregarResponsable'),
        lista: $('#listaResponsables'),
      }

    };
  },

  /**
   * Asigna los manejadores de eventos para el wizard.
   */
  bindEvents() {
    const { elements } = this;

    // Navegacion del wizard
    elements.prevBtn.on('click', () => this.goTo(this.currentStep - 1));

    elements.nextBtn.off('click').on('click', () => {
      // Si estamos en el paso 1 creando, "Siguiente" simplemente valida y pasa al 2 (NO GUARDA)
      if (!this.currentCasoId && this.currentStep === 1) {
        if (this.validateStep(1)) {
          this.goTo(2);
        }
      }
      // Si estamos en otro paso y hay cambios, obligamos a guardar y avanzar
      else if (this.isStepDirty) {
        this.handleSaveClick(true);
      }
      // Si no hay cambios, navegamos libremente
      else if (this.validateStep(this.currentStep)) {
        if (this.currentStep < this.TOTAL_STEPS) {
          this.goTo(this.currentStep + 1);
        }
      }
    });

    // Clic en la barra de pasos
    elements.wizardSteps.on('click', '.nav-link', (e) => {
      if (this.isStepDirty) {
        showNotification("top", "center", "warning", "Debes guardar los cambios antes de navegar a otro paso.", 2500);
        return;
      }
      const targetStep = Number(e.currentTarget.getAttribute('data-goto'));
      if (targetStep > this.currentStep && !this.validateStep(this.currentStep)) {
        return;
      }
      this.goTo(targetStep);
    });

    // Eventos del modal
    elements.modal.on('show.bs.modal', () => this.prepareSubdominioBeforeShow());
    elements.modal.on('shown.bs.modal', () => this.onShow());
    elements.modal.on('hidden.bs.modal', () => this.onHide());
    elements.reportBtn.on('click', () => this.showReport());

    // Evitar submit con Enter en pasos intermedios
    elements.form.on('submit', (e) => e.preventDefault());
    elements.form.on('keydown', (e) => {
      if (e.key === 'Enter' && this.currentStep !== this.TOTAL_STEPS && $(e.target).closest('textarea').length === 0) {
        e.preventDefault();
        elements.nextBtn.click();
      }
    });

    // Detectar cambios en los formularios para habilitar/deshabilitar botones
    const trackableInputs = elements.descInput
      .add(elements.domainSelect)
      .add(elements.subdominioSelect)
      .add(elements.inpEspecialista)
      .add(elements.inpSponsor)
      .add(elements.detalleInput)
      .add(elements.entregableInput)
      .add(elements.inpIngeniero);

    trackableInputs.on('input change', () => this.markStepAsDirty());
    // Limpiar validacion al escribir
    trackableInputs.on('input.removeErr change.removeErr', (e) => {
      $(e.currentTarget).removeClass('input-underline-invalid is-invalid');
      if (e.currentTarget.id === 'nc_dominio') {
        elements.domainHelp.text('-').removeClass('text-danger');
      }
    });

    // Inicializar los manejadores de fuentes (typeahead + selects)
    const handleAddFuente = async (clave, opts = {}) => {
      const normalized = (clave || '').trim();
      const { skipSync } = opts;
      if (!normalized) return;
      if (normalized.length > 255) {
        alert('La clave de la fuente supera los 255 caracteres.');
        return;
      }
      if (!skipSync) {
        await this.setFuenteFieldsFromClave(normalized);
      }
      if (!this.fuentesSeleccionadas.includes(normalized)) {
        this.fuentesSeleccionadas.push(normalized);
        this.markStepAsDirty(); // Marcar como sucio al agregar fuente
        this.renderFuentes();
      } else { alert('Esa fuente ya esta en la lista.'); }
    };
    this.fuenteTypeahead = new FuenteTypeahead(
      { input: this.elements.fuentes.input, suggestions: this.elements.fuentes.suggestions, btnAdd: null },
      handleAddFuente,
      { autoAddOnSelect: false, onSelect: (val) => this.setFuenteFieldsFromClave(val) }
    );
    this.fuentesManager = new FuentesManager(
      { servidor: this.elements.fuentes.servidor, base: this.elements.fuentes.base, esquema: this.elements.fuentes.esquema, tabla: this.elements.fuentes.tabla, btnAdd: this.elements.fuentes.btnAdd },
      handleAddFuente
    );


    if (this.fuentesManager) {
      const fm = this.fuentesManager;
      const ns = '.nuevoFuentesOpen';
      this.elements.fuentes.servidor.off('select2:open' + ns).on('select2:open' + ns, () => { fm.suppressCascade = false; fm.loadServers(); });
      this.elements.fuentes.base.off('select2:open' + ns).on('select2:open' + ns, () => {
        fm.suppressCascade = false;
        if (this.elements.fuentes.servidor.val()) fm.loadDatabases();
      });
      this.elements.fuentes.esquema.off('select2:open' + ns).on('select2:open' + ns, () => {
        fm.suppressCascade = false;
        if (this.elements.fuentes.servidor.val() && this.elements.fuentes.base.val()) fm.loadSchemas();
      });
      this.elements.fuentes.tabla.off('select2:open' + ns).on('select2:open' + ns, () => {
        fm.suppressCascade = false;
        if (this.elements.fuentes.servidor.val() && this.elements.fuentes.base.val() && this.elements.fuentes.esquema.val()) fm.loadTables();
      });
    }

    const addFuenteFromUi = () => {
      const s = this.elements.fuentes.servidor.val();
      const b = this.elements.fuentes.base.val();
      const e = this.elements.fuentes.esquema.val();
      const t = this.elements.fuentes.tabla.val();
      if (s && b && e && t) {
        handleAddFuente(`${s}.${b}.${e}.${t}`, { skipSync: true });
        return;
      }
      if ((this.elements.fuentes.input.val() || '').trim()) {
        if (this.fuenteTypeahead && typeof this.fuenteTypeahead.handleAdd === 'function') {
          this.fuenteTypeahead.handleAdd();
        }
        return;
      }
      alert('Usa la busqueda rapida o completa Servidor/Base/Esquema/Tabla antes de agregar.');
    };
    if (this.elements.fuentes.btnAdd && this.elements.fuentes.btnAdd.length) {
      this.elements.fuentes.btnAdd.off('click.fuente click.fuentesManager').on('click.nuevoFuentes', addFuenteFromUi);
    }


    // Boton de guardar
    elements.saveBtn.on('click', () => this.handleSaveClick());

    // --- Logica de Responsables Adicionales ---
    const { responsables } = this.elements;
    EmpleadoUtils.attachEmpleadoTypeahead(
      'nc_inp_responsable_adic',
      'sug_nc_inp_responsable_adic',
      'nc_cod_responsable_adic'
    );

    responsables.btnAdd.on('click', async () => {
      const codEmpleado = responsables.codEmpleado.val();
      const nombreEmpleado = responsables.inpEmpleado.val();
      const rol = responsables.rolSelect.val();
      const usuarioCode = SharePointUtils.getEmployeeCodeByUser(window.current_user);
      const idCaso = this.currentCasoId;

      if (!codEmpleado || !nombreEmpleado) {
        alert('Por favor, selecciona un empleado valido.');
        return;
      }

      // Validacion para no agregar duplicados (case-insensitive)
      const yaExiste = this.responsablesEnEdicion.some(r =>
        String(r.cod_empleado).toLowerCase() === String(codEmpleado).toLowerCase() &&
        String(r.rol).toLowerCase() === String(rol).toLowerCase()
      );
      if (yaExiste) {
        alert('Este responsable con ese rol ya ha sido agregado.');
        return;
      }

      try {
        // Asegurarse de que el caso de uso ya ha sido creado
        if (!idCaso) {
          await this.handleSaveStep();
          if (!this.currentCasoId) { // Si despues de guardar aun no hay ID, algo fallo.
            alert("Error: No se pudo crear el caso de uso. Guarda el primer paso antes de anadir responsables.");
            return;
          }
        }

        responsables.btnAdd.prop('disabled', true);
        const nuevoResponsable = {
          ID_CASO_USO: this.currentCasoId,
          USUARIO_ESTRUCTURA: codEmpleado,
          USUARIO_ROL: rol,
          USUARIO_CREACION: usuarioCode,
          FEC_CREACION: new Date().toISOString().slice(0, 23).replace('T', ' '),
          SN_ACTIVO: 1
        };

        await ApiService.insert('PROCESOS_BI.DBO.T_CASOS_USO_ESTRUCTURA', nuevoResponsable);
        await this.loadResponsablesDelCaso(); // Recargar la lista desde la BD
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

    // --- INICIO: Logica para editar y eliminar responsables ---
    responsables.lista.on('click', '.btn-edit-responsable-nuevo', (e) => {
      const index = $(e.currentTarget).data('index');
      this.responsablesEnEdicion.forEach((resp, i) => {
        resp.isEditing = (i === index);
      });
      this.renderResponsables();
    });

    responsables.lista.on('click', '.btn-save-responsable-nuevo', async (e) => {
      const index = $(e.currentTarget).data('index');
      const respToUpdate = this.responsablesEnEdicion[index];
      const nuevoRol = $(e.currentTarget).closest('li').find('select').val();
      const usuarioCode = SharePointUtils.getEmployeeCodeByUser(window.current_user);
      const fechaModificacion = new Date().toISOString().slice(0, 23).replace('T', ' ');

      if (respToUpdate.rol === nuevoRol) {
        respToUpdate.isEditing = false;
        this.renderResponsables();
        return;
      }

      const yaExisteConEseRol = this.responsablesEnEdicion.some((resp, i) =>
        i !== index &&
        String(resp.cod_empleado) === String(respToUpdate.cod_empleado) &&
        String(resp.rol).toLowerCase() === String(nuevoRol).toLowerCase()
      );

      if (yaExisteConEseRol) {
        alert('Este empleado ya tiene asignado el rol seleccionado en otro registro.');
        return;
      }

      try {
        await ApiService.update(
          'PROCESOS_BI.DBO.T_CASOS_USO_ESTRUCTURA',
          { USUARIO_ROL: nuevoRol, FEC_MODIFICACION: fechaModificacion, USUARIO_MODIFICACION: usuarioCode },
          `ID_ESTRUCTURA = ${respToUpdate.id_responsable}`
        );
        respToUpdate.rol = nuevoRol;
        respToUpdate.isEditing = false;
        this.markStepAsDirty();
        this.renderResponsables();
        showNotification("top", "center", "success", "Rol actualizado correctamente.", 1500);
      } catch (error) {
        console.error("Error al actualizar el rol:", error);
        alert("No se pudo actualizar el rol. Error: " + error.message);
      }
    });

    responsables.lista.on('click', '.btn-del-responsable-nuevo', (e) => {
      const index = $(e.currentTarget).data('index');
      this.handleDeleteResponsable(index);
    });
    // --- FIN: Logica para editar y eliminar responsables ---

    const lockTipoTermino = () => {
      const tipoSelect = $("#tipo");
      tipoSelect.html(`<option value="TERMINO" selected>Termino</option>`);
      tipoSelect.val("TERMINO");
    };

    // Boton para abrir modal de nuevo termino en el paso 4
    const openAtributoModalHandler = () => {
      // Asegurarse de que el listener para el tipo esta activo y las opciones estan configuradas
      listenerbtnAddAtributo();
      addAtributo();
      // En Casos de Uso solo permitimos crear terminos
      lockTipoTermino();
      // Forzar calculo del ID para 'TERMINO'
      $("#tipo").trigger('change');

      // Logica de cascada para Dominio -> Subdominio (Casos de Uso)
      const dominioSelect = elements.dominioAtributo;
      const subdominioSelect = $('#nombresub');

      // Asignar el evento change para cargar subdominios
      dominioSelect.off('change.wizard').on('change.wizard', async () => {
        const idDominio = dominioSelect.val();
        subdominioSelect.empty().trigger('change');

        if (idDominio) {
          try {
            const casosUso = await ApiService.query({
              campos: "ID_CASO_USO AS id, DESCRIPCION_CASO_USO AS text",
              origen: "PROCESOS_BI.DBO.T_CASOS_USO_ANALITICA",
              condicion: `ID_DOMINIO = ${idDominio}`
            });

            subdominioSelect.append(new Option('', '')); // Opcion en blanco
            casosUso.forEach(caso => {
              subdominioSelect.append(new Option(caso.text, caso.id, false, false));
            });

            // Preseleccionar el subdominio si el ID del caso de uso actual ya existe
            if (this.currentCasoId && casosUso.some(c => Number(c.id) === this.currentCasoId)) {
              subdominioSelect.val(this.currentCasoId).trigger('change');
            }
          } catch (error) {
            console.error("Error al cargar los casos de uso para el subdominio:", error);
          }
        }
      });

      // Preseleccionar el dominio actual, lo que disparara el evento 'change' anterior
      if (this.idDominio) {
        dominioSelect.val(this.idDominio).trigger('change');
      }
    };

    $('#btnAbrirModalAtributo').on('click', openAtributoModalHandler);
    $('#btnAbrirModalAtributoPrincipal').on('click', openAtributoModalHandler);

    // Evento personalizado: al crear un termino, asignarlo automaticamente al caso
    $(document).on('terminoCreado.wizard', (event, data) => {
      const terminoId = data && data.id;
      if (!this.currentCasoId) return;
      if (terminoId) {
        this.handleAsignarTerminoRecienCreado(this.currentCasoId, terminoId);
      } else {
        this.loadAndRenderTerms();
      }
    });

    // Evento para el buscador de terminos
    elements.buscarTerminoInput.on('keyup', (e) => {
      const searchTerm = $(e.currentTarget).val().toLowerCase();
      elements.listaTerminos.find('li').each(function () {
        const termText = $(this).text().toLowerCase();
        const isVisible = termText.includes(searchTerm);
        $(this).toggle(isVisible);
      });
    });

    // Delegaci+n de eventos para eliminar un termino de la lista
    elements.listaTerminos.on('click', '.btn-delete-term', (e) => this.handleDeleteTerm(e));
    elements.listaTerminos.on('click', '.btn-edit-term', (e) => this.handleEditTerm(e, this));

    // Boton para asignar terminos existentes
    elements.btnAsignarTerminos.on('click', () => this.handleAsignarTerminos());


    // Inicializar Select2 para el campo de dominio en el modal de atributos
    // cuando el modal se muestra, para que sea searchable.
    elements.modalAtributo.off('shown.bs.modal.wizard').on('shown.bs.modal.wizard', () => {
      // Aseguramos que el select2 se inicialice solo si no lo esta ya.
      if (!elements.dominioAtributo.data('select2')) {
        elements.dominioAtributo.select2({
          theme: "bootstrap",
          placeholder: "Seleccione un dominio",
          allowClear: true,
          minimumResultsForSearch: 0, // Siempre mostrar el campo de busqueda
          dropdownParent: elements.modalAtributo
        });
      }
      // Hacemos lo mismo para el subdominio para unificar el estilo
      if (!elements.subdominioAtributo.data('select2')) {
        elements.subdominioAtributo.select2({
          theme: "bootstrap",
          placeholder: "Seleccione un subdominio",
          allowClear: true,
          minimumResultsForSearch: 0,
          dropdownParent: elements.modalAtributo
        });
      }
    });
  },

  /**
   * Logica a ejecutar cuando se muestra el modal.
   */
  async onShow() {
    const urlSubdominio = this.getSubdominioFromUrl();
    let pendingSubdominio = this.pendingSubdominioValue != null ? this.pendingSubdominioValue : this.elements.subdominioSelect.val();
    if (!pendingSubdominio && urlSubdominio !== null) {
      pendingSubdominio = urlSubdominio;
      this.pendingSubdominioValue = urlSubdominio;
    }

    // --- Limpieza completa al ABRIR el modal ---
    this.currentCasoId = null;
    this.elements.form[0].reset();
    this.setupActivoConfirmation();
    this.markStepAsClean();

    // Limpieza explicita de fuentes
    this.fuentesSeleccionadas = [];
    this.renderFuentes();
    if (this.fuenteTypeahead) this.fuenteTypeahead.reset();
    if (this.fuentesManager) this.fuentesManager.resetDownstream(0);

    // Limpieza de responsables
    this.responsablesEnEdicion = [];
    this.responsablesParaDesactivar = [];
    this.renderResponsables();
    this.clearResponsablesUI();

    this.elements.estadoInput.val('INGRESADO');
    $('#nc_sn_activo').val('1');
    this.goTo(1);

    await this.initSubdominioSelect();
    this.setSubdominioPreset(pendingSubdominio);
    await this.refreshSubdominios(true);

    // Cargar datos para los selectores
    const idDominioUrl = new URLSearchParams(location.search).get("id_dominio");
    await this.loadInitialData(idDominioUrl);
    this.setSubdominioPreset(pendingSubdominio);

    try {
      await EmpleadoUtils.loadEmpleadosOnce();
      EmpleadoUtils.attachEmpleadoTypeahead('nc_inp_especialista', 'sug_nc_inp_especialista', 'nc_cod_especialista', 'nc_cod_especialista_nombre');
      EmpleadoUtils.attachEmpleadoTypeahead('nc_inp_sponsor', 'sug_nc_inp_sponsor', 'nc_cod_sponsor', 'nc_cod_sponsor_nombre');
      EmpleadoUtils.attachEmpleadoTypeahead('nc_inp_ingeniero', 'sug_nc_inp_ingeniero', 'nc_cod_ingeniero', 'nc_cod_ingeniero_nombre');
    } catch (e) {
      console.error('Error al cargar la lista de empleados para el typeahead:', e);
    }
  },

  /**
   * Logica a ejecutar cuando se oculta el modal.
   */
  onHide() {
    // La limpieza principal ahora se hace en onShow para mayor consistencia y evitar efectos secundarios.
    // Aqu+ solo nos aseguramos de que el wizard vuelva al primer paso al cerrar.
    if (this.fuenteTypeahead) this.fuenteTypeahead.reset();
    this.goTo(1);
    this.pendingSubdominioValue = null;
  },

  /**
   * Obtiene el id_dominio de los parametros de la URL.
   * @returns {string} El ID del dominio o una cadena vacia.
   */
  getIdDominioFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id_dominio") || "";
  },

  /**
   * Limpia los campos de la UI relacionados con los responsables.
   */
  clearResponsablesUI() {
    ['especialista', 'sponsor', 'ingeniero'].forEach(rol => {
      $(`#nc_inp_${rol}`).val('');
      $(`#nc_cod_${rol}`).val('');
      $(`#sug_nc_inp_${rol}`).addClass('d-none').empty();
      $(`#nc_cod_${rol}_nombre`).text('-');
    });
  },

  async setFuenteFieldsFromClave(clave) {
    if (!clave || !this.fuentesManager || !this.elements || !this.elements.fuentes) return;
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

  /**
   * Carga los datos iniciales necesarios para los selectores del modal.
   */
  async loadInitialData(idDominioUrl = null) {
    // Ya no cargamos estados dinamicos para mantener solo los 3 definidos.
    const loadDomains = this.populateDomainSelect();
    const loadStates = Promise.resolve(); // Promesa resuelta para mantener la estructura.
    const loadServers = this.fuentesManager ? this.fuentesManager.loadServers() : Promise.resolve();

    // Ejecutar todas las cargas en paralelo y luego preseleccionar el dominio
    try {
      await Promise.all([loadDomains, loadStates, loadServers]);
      this.preselectDomain(idDominioUrl);
    } catch (error) {
      console.error("Error durante la carga de datos iniciales del wizard:", error);
    }
    // La carga y preseleccion de subdominios se maneja al mostrar el modal.
  },

  /**
   * Navega a un paso especifico del wizard.
   * @param {number} step - El numero del paso al que se desea ir.
   */
  goTo(step) {
    this.currentStep = Math.min(Math.max(step, 1), this.TOTAL_STEPS);
    const { elements } = this;

    elements.sections.addClass('d-none').removeClass('active');
    elements.sections.filter(`[data-step="${this.currentStep}"]`).removeClass('d-none').addClass('active');

    elements.wizardSteps.find('.nav-link').removeClass('active');
    elements.wizardSteps.find(`.nav-link[data-goto="${this.currentStep}"]`).addClass('active');

    // Si navegamos al paso 4, cargamos los terminos
    if (this.currentStep === 4) {
      this.loadAndRenderTerms();
    }

    this.markStepAsClean(); // Cada vez que navegamos, el paso se considera "limpio".
  },

  /**
   * Actualiza la visibilidad de los botones Siguiente/Guardar.
   */
  updateButtonStates() {
    const { nextBtn, saveBtn } = this.elements;
    const isLastStep = this.currentStep === this.TOTAL_STEPS;

    // Si no hay ID y estamos en el paso 1, estamos creando un caso.
    const isCreationStep1 = !this.currentCasoId && this.currentStep === 1;

    // Solo mostramos Guardar si hay cambios, PERO bloqueamos el Guardar en el Paso 1 inicial
    if (this.isStepDirty && !isCreationStep1) {
      nextBtn.addClass('d-none');
      saveBtn.removeClass('d-none');
      saveBtn.text(isLastStep ? 'Guardar y Finalizar' : 'Guardar Progreso');
    } else {
      saveBtn.addClass('d-none');
      nextBtn.removeClass('d-none');
      if (isLastStep) nextBtn.addClass('d-none');
    }

    this.elements.prevBtn.toggleClass('d-none', this.currentStep === 1);
  },

  markStepAsDirty() { this.isStepDirty = true; this.updateButtonStates(); },
  markStepAsClean() { this.isStepDirty = false; this.updateButtonStates(); },

  showReport() {
    const html = this.buildReportHtml();
    this.openReportPreview(html, 'Resumen del caso de uso (borrador)');
  },

  buildReportHtml() {
    const estadoText = $('#nc_estado option:selected').text() || $('#nc_estado').val() || 'Sin estado';
    const dominioText = this.elements.domainSelect.find('option:selected').text().trim() || this.elements.domainSelect.val() || 'Sin dominio';
    const subdominioText = (this.elements.subdominioSelect.val() || 'Sin subdominio').toString().trim() || 'Sin subdominio';

    const terminos = $('#listaTerminosCasoUso li').map(function () {
      return ($(this).text() || '').replace(/\s+/g, ' ').trim();
    }).get().filter(Boolean);

    const responsablesPrincipales = [
      ['Especialista', $('#nc_inp_especialista').val()],
      ['Sponsor', $('#nc_inp_sponsor').val()],
      ['Ingeniero Responsable', $('#nc_inp_ingeniero').val()],
    ];

    const responsablesAdicionales = this.responsablesEnEdicion.map(resp => ({
      name: resp.nombre || resp.cod_empleado || 'Responsable',
      role: resp.rol || ''
    }));

    const generalInfo = [
      ['Descripcion', $('#nc_descripcion').val()],
      ['Estado', estadoText],
      ['Habilitado', $('#nc_sn_activo option:selected').text() || $('#nc_sn_activo').val()],
      ['Dominio', dominioText],
      ['Subdominio', subdominioText],
      ['Detalle', $('#nc_detalle_caso_uso').val()],
      ['Entregable', $('#nc_entregable_caso_uso').val()],
    ];

    const summaryItems = [
      { label: 'Fuentes', value: this.fuentesSeleccionadas.length || 0, icon: 'simple-icon-layers', accent: '#7c3aed' },
      { label: 'Trminos', value: terminos.length || 0, icon: 'simple-icon-book-open', accent: '#d97706' },
      { label: 'Responsables', value: (responsablesPrincipales.filter(r => r[1]).length + responsablesAdicionales.length) || 0, icon: 'simple-icon-people', accent: '#047857' },
    ];

    const titleValue = ($('#nc_descripcion').val() || 'Caso de uso').trim();
    const payload = {
      title: titleValue,
      subtitle: 'Borrador del caso de uso',
      summaryItems,
      generalInfo,
      responsablesPrincipales,
      responsablesAdicionales,
      fuentes: [...this.fuentesSeleccionadas],
      terminos
    };
    const template = window.CasoUsoReportTemplate;
    if (template && typeof template.build === 'function') {
      return template.build(payload);
    }
    return this.renderFallbackReport(payload);
  },

  renderFallbackReport(payload) {
    const {
      title,
      subtitle,
      summaryItems = [],
      generalInfo = [],
      responsablesPrincipales = [],
      responsablesAdicionales = [],
      fuentes = [],
      terminos = []
    } = payload;

    const defaultSummary = [
      { label: 'Fuentes', value: 0, icon: 'simple-icon-layers', accent: '#7c3aed' },
      { label: 'Terminos', value: 0, icon: 'simple-icon-book-open', accent: '#d97706' },
      { label: 'Responsables', value: 0, icon: 'simple-icon-people', accent: '#047857' }
    ];

    const normalizedSummary = summaryItems.length ? summaryItems : defaultSummary;

    const summaryHtml = normalizedSummary
      .map((item) => `
        <div class="hero-card" style="--hero-icon-color:${item.accent || '#6b7280'}">
          <span class="hero-icon"><i class="${this.escapeHtml(item.icon || 'simple-icon-info')}"></i></span>
          <div>
            <p class="hero-card__value">${this.escapeHtml(item.value != null ? item.value : '-')}</p>
            <p class="hero-card__label">${this.escapeHtml(item.label)}</p>
          </div>
        </div>`)
      .join('');

    const pairs = (rows = []) => {
      const data = rows.length ? rows : [['Sin datos', '']];
      const content = data
        .map(([label, value]) => `
          <tr>
            <td class="k">${this.escapeHtml(label)}</td>
            <td>${this.escapeHtml(value || '-')}</td>
          </tr>`).join('');
      return `
        <div class="kv-wrap">
          <table class="kv-table">
            <tbody>${content}</tbody>
          </table>
        </div>`;
    };

    const list = (items = [], emptyLabel = 'Sin datos') => {
      const normalized = Array.isArray(items) ? items : [];
      const rendered = normalized
        .map((item) => (item == null ? '' : item).toString().trim())
        .filter(Boolean)
        .map((item) => `<li>${this.escapeHtml(item)}</li>`)
        .join('');
      if (!rendered) {
        return `<div class="muted">${this.escapeHtml(emptyLabel)}</div>`;
      }
      return `<ul class="rep-list">${rendered}</ul>`;
    };

    const responsablesRowsHtml = (responsablesPrincipales.length
      ? responsablesPrincipales
      : [['Responsable', 'Sin datos']])
      .map(([label, value]) => `
        <tr>
          <td class="k" style="width:40%">${this.escapeHtml(label)}</td>
          <td>${this.escapeHtml(value || '-')}</td>
        </tr>`).join('');

    const adicionalesHtml = (responsablesAdicionales.length
      ? `<div class="block-title">Responsables adicionales</div>
        <div class="kv-wrap">
          <table class="kv-table">
            <tbody>
              ${responsablesAdicionales.map(({ name, role }) => `
                <tr>
                  <td class="k" style="width:40%">${this.escapeHtml(role || '-')}</td>
                  <td>${this.escapeHtml(name || '-')}</td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>`
      : `<div class="muted">Sin responsables adicionales</div>`);

    return `
      <div class="report-page">
        <header class="brand">
          <img class="logo" src="img/logo_bg_magenta.png" alt="OGA">
          <img class="logo" src="logos/oga_color.png" alt="Governance & Quality">
        </header>
        <section class="rep-hero">
          <div class="rep-hero__text">
            <p class="rep-kicker">Resumen</p>
            <h1>${this.escapeHtml(title)}</h1>
            <p class="rep-subtitle">${this.escapeHtml(subtitle)}</p>
          </div>
          <div class="rep-hero-grid">
            ${summaryHtml}
          </div>
        </section>

        <section class="rep-section">
          <h2>Informacion general</h2>
          ${pairs(generalInfo)}
        </section>

        <section class="rep-section rep-grid">
          <div class="rep-card">
            <h3>Responsables</h3>
            <div class="kv-wrap">
              <table class="kv-table">
                <tbody>${responsablesRowsHtml}</tbody>
              </table>
            </div>
            ${adicionalesHtml}
          </div>
          <div class="rep-card rep-card--wide">
            <h3>Fuentes</h3>
            ${list(fuentes, 'Sin fuentes registradas')}
          </div>
        </section>

        <section class="rep-section">
          <h3>Terminos asociados</h3>
          ${list(terminos, 'Sin terminos asociados')}
        </section>
      </div>
    `;
  },

  openReportPreview(html, title = 'Resumen del caso de uso (borrador)') {
    const win = window.open('', '_blank', 'width=1100,height=800');
    if (!win) {
      alert('No se pudo abrir la vista previa. Habilita los pop-ups para continuar.');
      return;
    }

    const styles = (window.CasoUsoReportTemplate && window.CasoUsoReportTemplate.styles) || FALLBACK_REPORT_STYLES_NUEVO;
    win.document.write(`<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>${this.escapeHtml(title)}</title><style>${styles}</style></head><body>${html}</body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => { try { win.print(); } catch (e) { } }, 300);
  },
  escapeHtml(str) {
    return String(str == null ? '' : str).replace(/[&<>\"']/g, (c) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[c] || c));
  },

  /**
   * Valida los campos del paso actual.
   * @param {number} step - El paso a validar.
   * @returns {boolean} - `true` si es valido, `false` si no.
   */
  validateStep(step) {
    let isValid = true;

    const markErr = ($el) => {
      $el.addClass('input-underline-invalid is-invalid');
      isValid = false;
    };

    if (step === 1) {
      const { descInput, domainSelect } = this.elements;
      const desc = descInput.val().trim();

      if (!desc || desc.length > 400) markErr(descInput);

      if (!domainSelect.val()) {
        markErr(domainSelect);
        this.elements.domainHelp.text('Selecciona un dominio').addClass('text-danger');
      }
    }
    else if (step === 2) {
      // Validar responsables obligatorios
      const esp = $('#nc_cod_especialista').val();
      const spon = $('#nc_cod_sponsor').val();
      const ing = $('#nc_cod_ingeniero').val();

      if (!esp) markErr(this.elements.inpEspecialista);
      if (!spon) markErr(this.elements.inpSponsor);
      if (!ing) markErr(this.elements.inpIngeniero);

      if (!isValid) {
        showNotification("top", "center", "warning", "Especialista, Sponsor e Ingeniero son obligatorios para guardar.", 3000);
      }
    }

    if (!isValid) {
      this.elements.form.find('.is-invalid').first().focus();
    }

    return isValid;
  },

  async populateDomainSelect() {
    const { domainSelect, modal } = this.elements;
    if (!domainSelect || !domainSelect.length) return;

    try {
      const dominios = await this.cargarDominios();
      domainSelect.empty().append(new Option('Seleccione un dominio...', ''));
      dominios.forEach(d => {
        const label = d.codigo ? `${d.codigo} - ${d.descripcion}` : d.descripcion;
        domainSelect.append(new Option(label, d.id));
      });

      if (!domainSelect.data('select2')) {
        domainSelect.select2({
          theme: "bootstrap",
          dropdownParent: modal,
          width: '100%',
          placeholder: 'Seleccione un dominio...'
        });
      } else {
        domainSelect.trigger('change.select2');
      }

      domainSelect.off('change.nuevoCasoDominio').on('change.nuevoCasoDominio', async () => {
        this.clearSubdominioSelection();
        await this.loadSubdominiosForCurrentDomain(true);
      });
    } catch (e) {
      console.error("Error cargando dominios:", e);
    }
  },


  async cargarDominios() {
    if (this.dominiosCache) return this.dominiosCache;
    try {
      const data = await ApiService.query({
        campos: "ID_DOMINIO AS id, codigo_dominio AS codigo, descripcion_dominio AS descripcion",
        origen: "PROCESOS_BI.DBO.T_MAPA_DOMINIOS",
        condicion: "1=1"
      });
      this.dominiosCache = data.map(d => ({
        id: d.id,
        codigo: (d.codigo == null ? "" : d.codigo).toString(),
        descripcion: (d.descripcion == null ? "" : d.descripcion).toString()
      }));
      return this.dominiosCache;
    } catch (e) {
      console.error("Error cargando dominios:", e);
      return [];
    }
  },

  clearSubdominioSelection() {
    const { subdominioSelect } = this.elements;
    if (!subdominioSelect || !subdominioSelect.length) return;
    subdominioSelect.val('').trigger('change');
  },

  async initSubdominioSelect() {
    const { subdominioSelect, modal } = this.elements;
    if (!subdominioSelect || !subdominioSelect.length) return;
    const currentVal = subdominioSelect.val();
    await this.loadSubdominiosForCurrentDomain(false);

    if (subdominioSelect.data('select2')) {
      try { subdominioSelect.select2('destroy'); } catch (e) { }
    }
    subdominioSelect.select2({
      theme: "bootstrap",
      dropdownParent: modal,
      placeholder: "Escribe o selecciona un subdominio...",
      width: '100%',
      allowClear: true,
      dropdownCssClass: 'select2-subdominio-dropdown',
      tags: true,
      tokenSeparators: [','],
      createTag(params) {
        const term = (params.term || '').trim();
        if (!term) return null;
        const exists = subdominioSelect.find('option').filter((_, option) =>
          (option.value || '').toLowerCase() === term.toLowerCase()).length > 0;
        if (exists) return null;
        return { id: term, text: term, newTag: true };
      }
    });

    // Reaplicar valor actual (si viene preset)
    this.setSubdominioPreset(currentVal);
  },

  prepareSubdominioBeforeShow() {
    const { subdominioSelect } = this.elements || {};
    if (!subdominioSelect || !subdominioSelect.length) return;
    const pendingValue = subdominioSelect.val();
    this.initSubdominioSelect().then(() => {
      this.setSubdominioPreset(pendingValue);
      this.loadSubdominiosForCurrentDomain(false);
    });
  },

  async loadSubdominiosForCurrentDomain(force = true) {
    const dominioId = this.elements && this.elements.domainSelect ? this.elements.domainSelect.val() : null;
    const cacheKey = dominioId || '__ALL__';
    if (force) {
      this.subdominiosCache.delete(cacheKey);
    }
    await this.loadAndPopulateSubdominios(force, dominioId);
  },

  async loadAndPopulateSubdominios(force = false, dominioId = null) {
    const lista = await this.fetchSubdominios(force, dominioId);
    this.populateSubdominioOptions(lista);
    return lista;
  },

  // Compatibilidad con llamados anteriores
  async refreshSubdominios(force = true) {
    return this.loadSubdominiosForCurrentDomain(force);
  },

  setSubdominioPreset(value) {
    const trimmed = (value || '').toString().trim();
    this.pendingSubdominioValue = trimmed || null;
    const { subdominioSelect } = this.elements || {};
    if (!subdominioSelect || !subdominioSelect.length) return;
    if (trimmed) {
      const exists = subdominioSelect
        .find('option')
        .filter((_, option) => option.value === trimmed)
        .length > 0;
      if (!exists) {
        subdominioSelect.append(new Option(trimmed, trimmed, true, true));
      }
    }
    subdominioSelect.val(trimmed || '').trigger('change').trigger('change.select2');
  },

  populateSubdominioOptions(lista) {
    const { subdominioSelect } = this.elements;
    if (!subdominioSelect || !subdominioSelect.length) return;
    const currentValue = subdominioSelect.val();
    subdominioSelect.empty().append(new Option('', ''));
    (lista || []).forEach(item => {
      subdominioSelect.append(new Option(item.nombre, item.nombre));
    });
    const desiredValue = (this.pendingSubdominioValue || currentValue || "").toString();
    let finalValue = '';
    if (desiredValue) {
      const exists = subdominioSelect.find(`option[value="${desiredValue}"]`).length > 0;
      if (!exists) {
        subdominioSelect.append(new Option(desiredValue, desiredValue, true, true));
      }
      finalValue = desiredValue;
    }
    subdominioSelect.val(finalValue).trigger('change').trigger('change.select2');
    if (this.pendingSubdominioValue && finalValue) {
      this.pendingSubdominioValue = null;
    }
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
    // Conservado para compatibilidad; sin estilos especiales al usar datalist.
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
      return avance;
    };

    const avance = lookupAvance(key);
    if (!avance) return null;
    const label = `${avance}`.includes("%") ? avance : `${avance}%`;
    return `Documentación de la tabla: ${label}`;
  },

  async decorateMetallonIcon($icon, clave) {
    if (!$icon || !$icon.length) return;

    const ensureMetallonModal = () => {
      if (document.getElementById("modalMetallonFuenteNuevo")) return;
      const modalHtml = `
        <div class="modal fade" id="modalMetallonFuenteNuevo" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static">
          <div class="modal-dialog modal-dialog-centered" role="document" style="z-index: 1061;">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Clasificación Medallón</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <label for="selectMetallonFuenteNuevo">Selecciona una opción:</label>
                <select id="selectMetallonFuenteNuevo" class="form-control">
                  <option value="">Sin clasificación</option>
                  <option value="oro">Oro</option>
                  <option value="plata">Plata</option>
                  <option value="bronce">Bronce</option>
                </select>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-primary" id="btnGuardarMetallonFuenteNuevo">Guardar</button>
              </div>
            </div>
          </div>
        </div>`;
      $('body').append(modalHtml);
      $('#modalMetallonFuenteNuevo').on('shown.bs.modal', function () {
        const $backs = $('.modal-backdrop');
        $backs.last().css('z-index', 1060);
        $(this).css('z-index', 1065);
      });
    };

    ensureMetallonModal();

    try {
      const clasificacionRaw = await this.getMetallonPorFuente(clave);
      const clasificacion = (clasificacionRaw || '').toString().trim().toLowerCase();
      // Avance desde cache/SP/TXT
      const parseKey = (k) => {
        const p = (k || "").split(".");
        if (p.length < 4) return null;
        const [srv, db, sch, tbl] = p;
        return {
          srv: (srv || "").toUpperCase(),
          db: (db || "").toUpperCase(),
          sch: (sch || "DBO").toUpperCase(),
          tbl: (tbl || "").toUpperCase(),
          key: `${(srv || "").toUpperCase()}_${(sch || "DBO").toUpperCase()}_${(db || "").toUpperCase()}_${(tbl || "").toUpperCase()}`
        };
      };
      const lookupAvance = ({ key }) => {
        let avance = null;
        const cachesp = window.tablas_oficiales || (typeof getInfoTablasOficialesTemp === "function" ? getInfoTablasOficialesTemp() : null);
        if (cachesp && cachesp[key]) {
          avance = cachesp[key].avance || cachesp[key].avance_porcentaje || null;
        }
        if (!avance && typeof getInfoTablasOficialesTxt === "function") {
          const baseTXT = getInfoTablasOficialesTxt() || {};
          if (baseTXT[key]) avance = baseTXT[key].avance || null;
        }
        return avance;
      };
      const map = {
        oro: { icon: 'simple-icon-trophy', color: 'text-warning', label: 'Oro' },
        plata: { icon: 'simple-icon-diamond', color: 'text-secondary', label: 'Plata' },
        bronce: { icon: 'simple-icon-trophy', color: 'text-danger', label: 'Bronce' },
      };
      const conf = map[clasificacion] || map.bronce;
      $icon.empty().append($('<i>').addClass(`${conf.icon} ${conf.color}`));
      const tooltip = `${conf.label}`;
      try { $icon.tooltip('dispose'); } catch (e) { }
      $icon.attr({ 'data-toggle': 'tooltip', title: tooltip });
      $icon.tooltip({ title: tooltip, placement: 'top', container: 'body', boundary: 'window' });
      $icon.css('visibility', 'visible').show();

      // Click: abrir modal y guardar en SP
      $icon.css('cursor', 'pointer').off('click.metallonNuevo').on('click.metallonNuevo', () => {
        const $modal = $('#modalMetallonFuenteNuevo');
        const $select = $('#selectMetallonFuenteNuevo');
        $select.val(clasificacion || "");
        $modal.modal('show');

        $('#btnGuardarMetallonFuenteNuevo').off('click').on('click', () => {
          const nuevo = ($select.val() || '').toString().trim().toLowerCase();
          // Cache local
          this.metallonCache = this.metallonCache || new Map();
          this.metallonCache.set(clave, nuevo);

          // Combinar etiquetas previas (SP + TXT) y persistir
          try {
            const parts = (clave || "").split('.');
            if (parts.length >= 4 && typeof actualizarTablasOficiales === "function") {
              const [servidor, base, esquema, tabla] = parts;
              const codMap = { oro: "5", plata: "4", bronce: "3" };
              const codigo = codMap[nuevo] || "";
              if (codigo) {
                const medallonSet = new Set(["5", "4", "3", "ORO", "PLATA", "BRONCE"]);
                const keyCache = `${servidor.toUpperCase()}_${esquema.toUpperCase()}_${base.toUpperCase()}_${tabla.toUpperCase()}`;
                const setCodigos = new Set();
                const addEtiquetas = (valor) => {
                  (valor || "").toString().split("|").forEach(c => {
                    const norm = (c || "").trim();
                    if (!norm) return;
                    if (medallonSet.has(norm.toUpperCase()) || medallonSet.has(norm)) return;
                    setCodigos.add(norm);
                  });
                };
                // SP cache
                if (window.tablas_oficiales && window.tablas_oficiales[keyCache]) {
                  addEtiquetas(window.tablas_oficiales[keyCache].etiquetas_numero || window.tablas_oficiales[keyCache].etiquetas || "");
                }
                // TXT base si existe función
                if (typeof getInfoTablasOficialesTxt === "function") {
                  const baseTXT = getInfoTablasOficialesTxt() || {};
                  if (baseTXT[keyCache]) {
                    addEtiquetas(baseTXT[keyCache].etiquetas || baseTXT[keyCache].etiquetas_numero || "");
                  }
                }
                setCodigos.add(codigo);
                const etiquetasNumFinal = Array.from(setCodigos).join("|");

                const pre = typeof window.existeEnSP_TablasOficiales === "function"
                  ? window.existeEnSP_TablasOficiales({ tabla, servidor, base, esquema })
                  : { existe: true };
                if (pre.existe && typeof actualizarTablasOficiales === "function") {
                  actualizarTablasOficiales("etiquetas", tabla, servidor, base, esquema, etiquetasNumFinal);
                } else if (typeof escribirTablasOficiales === "function") {
                  escribirTablasOficiales("etiquetas", tabla, " ", servidor, base, esquema, etiquetasNumFinal);
                }
                // Actualizar cache global
                if (!window.tablas_oficiales) window.tablas_oficiales = {};
                if (!window.tablas_oficiales[keyCache]) {
                  window.tablas_oficiales[keyCache] = {
                    servidor, base, esquema, tabla,
                    etiquetas: etiquetasNumFinal, etiquetas_numero: etiquetasNumFinal
                  };
                } else {
                  window.tablas_oficiales[keyCache].etiquetas = etiquetasNumFinal;
                  window.tablas_oficiales[keyCache].etiquetas_numero = etiquetasNumFinal;
                }
              }
            }
          } catch (err) {
            console.warn("No se pudo registrar Medallón en SP (nuevo caso):", err);
          }

          $modal.modal('hide');
          this.decorateMetallonIcon($icon, clave);
          if (typeof showNotification === "function") {
            showNotification("top", "center", "success", "Clasificación Medallón actualizada.");
          }
        });
      });
    } catch (error) {
      console.error('Error decorando clasificacion de fuente:', clave, error);
      try { $icon.tooltip('dispose'); } catch (e) { }
      $icon.css('visibility', 'hidden').show();
    }
  },

  async getMetallonPorFuente(clave) {
    const key = (clave || '').trim();
    if (!key) return null;
    if (this.metallonCache.has(key)) return this.metallonCache.get(key);
    if (this.metallonInflight.has(key)) return this.metallonInflight.get(key);

    const parts = key.split('.');
    if (parts.length < 4) return null;
    const [servidor, base, esquema, tabla] = parts;

    const getClasifFromRecord = (rec = {}) => {
      const etiquetas = (rec.etiquetas || rec.etiquetas_numero || "").toString().split("|").map(s => s.trim()).filter(Boolean);
      const mapMedallon = { "5": "oro", "4": "plata", "3": "bronce", "ORO": "oro", "PLATA": "plata", "BRONCE": "bronce" };
      const medallon = etiquetas.find(c => mapMedallon[c]);
      if (medallon) return mapMedallon[medallon];
      const clas = (rec.clasificacion || "").toString().trim().toLowerCase();
      return clas || null;
    };

    const loadTablasTxt = async () => {
      if (this._tablasOficialesTxtCache) return this._tablasOficialesTxtCache;
      const url = "http://vamos.bancoguayaquil.com/sitios/informaciongerencial/OGA_Suite/Produccion/datasets-txt/Z_TABLAS_OFICIALES.txt";
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
          const keyTxt = `${srv}_${sch}_${db}_${tbl}`;
          cache[keyTxt] = {
            clasificacion: norm(vals[i_clasif]).toLowerCase(),
            etiquetas: norm(vals[i_etiquetas]).toUpperCase()
          };
        }
        this._tablasOficialesTxtCache = cache;
      } catch (err) {
        console.warn("No se pudo leer Z_TABLAS_OFICIALES.txt:", err);
        this._tablasOficialesTxtCache = {};
      }
      return this._tablasOficialesTxtCache;
    };

    const promise = (async () => {
      let clasif = null;
      const keyTxt = `${servidor.toUpperCase()}_${esquema.toUpperCase()}_${base.toUpperCase()}_${tabla.toUpperCase()}`;

      // 1) SharePoint primero
      const spCache = window.tablas_oficiales || (typeof getInfoTablasOficialesTemp === "function" ? getInfoTablasOficialesTemp() : null);
      if (spCache && spCache[keyTxt]) {
        clasif = getClasifFromRecord(spCache[keyTxt]);
      }

      // 2) TXT si SP no tiene
      if (!clasif) {
        const tablasTxt = await loadTablasTxt();
        if (tablasTxt && tablasTxt[keyTxt]) {
          clasif = getClasifFromRecord(tablasTxt[keyTxt]);
        }
      }

      // 3) Fallback API
      if (!clasif) {
        const esc = (v) => String(v || '').replace(/'/g, "''");
        const queryBody = {
          campos: "TOP 1 CLASIFICACION_METALLON",
          origen: "PROCESOS_BI.dbo.vw_T_Calidad_Backlog_Completa",
          condicion: `SERVIDOR='${esc(servidor)}' AND BASE='${esc(base)}' AND ESQUEMA='${esc(esquema)}' AND TABLA='${esc(tabla)}'`
        };
        try {
          const rows = await ApiService.query(queryBody);
          if (rows && rows.length) {
            const r = rows[0] || {};
            clasif = r.CLASIFICACION_METALLON || r.clasificacion_metallon || r.CLASIFICACION || r.clasificacion || null;
            if (clasif) clasif = String(clasif).trim().toLowerCase();
          }
        } catch (err) {
          console.error('Error consultando clasificacion Metallon (fallback):', key, err);
        }
      }

      this.metallonCache.set(key, clasif);
      this.metallonInflight.delete(key);
      return clasif;
    })();

    this.metallonInflight.set(key, promise);
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
        if (pct >= 90) colorClass = 'text-success';
        else if (pct < 70) colorClass = 'text-danger';
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

  async decorateProfilingIcon($anchor, clave) {
    if (!$anchor || !$anchor.length) return;
    try {
      const info = await this.getUltimoProfilingPorFuente(clave);
      if (!info) {
        $anchor.removeAttr('href').css('visibility', 'hidden').show();
        return;
      }
      $anchor.attr('href', info.url);
      const safeName = this.escapeHtml(info.nombre || '-');
      const tooltipHtml = `<strong>Profiling:</strong> ${safeName}`;
      try { $anchor.tooltip('dispose'); } catch (e) { }
      $anchor.attr({
        'data-html': 'true',
        'data-toggle': 'tooltip',
        'data-original-title': tooltipHtml,
        title: tooltipHtml
      });
      $anchor.tooltip({
        html: true,
        title: tooltipHtml,
        placement: 'top',
        container: 'body',
        boundary: 'window',
        template: '<div class="tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner text-left"></div></div>'
      });
      $anchor.css('visibility', 'visible').show();
    } catch (error) {
      console.error('Error decorando profiling de fuente:', clave, error);
      $anchor.removeAttr('href').css('visibility', 'hidden').show();
    }
  },

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

          const parseFecha = (txt) => {
            const cleaned = (txt || '').trim();
            if (!cleaned) return null;
            const partsDate = cleaned.split(/[-_]/).map(p => parseInt(p, 10)).filter(n => !Number.isNaN(n));
            if (partsDate.length < 3) return null;
            const [y, m, d] = partsDate;
            const dt = new Date(y, (m || 1) - 1, d || 1);
            return Number.isNaN(dt.getTime()) ? null : dt;
          };

          const ordenados = candidatos
            .map(c => ({ nombre: c.nombre, fecha: parseFecha(c.fechaStr) }))
            .filter(c => c.fecha)
            .sort((a, b) => b.fecha - a.fecha);

          if (!ordenados.length) {
            resolve(null);
            return;
          }
          const masReciente = ordenados[0];
          resolve({ nombre: masReciente.nombre, url: `${folder}${masReciente.nombre}` });
        }
      });
    }).catch(err => {
      console.error("Error al obtener profiling de fuente:", clave, err);
      return null;
    });

    this.profilingInflight.set(key, promise);
    promise.finally(() => this.profilingInflight.delete(key));

    const result = await promise;
    this.profilingCache.set(key, result);
    return result;
  },

  getSubdominioFromUrl() {
    try {
      const params = new URLSearchParams(window.location.search);
      const raw = params.get('subdominio');
      if (!raw) return null;
      const trimmed = raw.trim();
      if (!trimmed || trimmed === "sin-subdominio" || trimmed === "__NULL__") return "";
      return trimmed;
    } catch (error) {
      console.error("No se pudo obtener el subdominio desde la URL:", error);
      return null;
    }
  },

  async preselectDomain(dominioId) {
    if (!dominioId) return;
    const { domainSelect } = this.elements;
    if (!domainSelect || !domainSelect.length) return;
    if (domainSelect.find(`option[value="${dominioId}"]`).length > 0) {
      domainSelect.val(dominioId).trigger('change');
      return;
    }
    try {
      const dominios = await this.cargarDominios();
      const domSel = dominios.find(d => Number(d.id) === Number(dominioId));
      if (domSel) {
        const label = domSel.codigo ? `${domSel.codigo} - ${domSel.descripcion}` : domSel.descripcion;
        const option = new Option(label, domSel.id);
        domainSelect.append(option);
        domainSelect.val(domSel.id).trigger('change');
      }
    } catch (e) {
      console.warn("No se pudo precargar el dominio por defecto:", e);
    }
  },

  renderFuentes() {
    const { lista } = this.elements.fuentes;
    lista.empty();
    const totalFuentes = this.fuentesSeleccionadas.length;

    // Actualizar el t+tulo con el contador
    $('#titulo-fuentes-agregadas-nuevo').html(`Fuentes agregadas <span class="badge badge-pill badge-primary ml-1">${totalFuentes}</span>`);

    this.fuentesSeleccionadas.forEach((clave, i) => {
      const $li = $('<li>').addClass('list-group-item d-flex justify-content-between align-items-center');
      const tabla = (clave || '').split('.').pop();
      const href = tabla ? `BuscadorCampos.aspx?tabla=${encodeURIComponent(tabla)}` : 'BuscadorCampos.aspx';
      const $icons = $('<span class="fuente-icons d-inline-flex align-items-center"></span>');
      const $metallonIcon = $('<span class="fuente-extra-icon fuente-extra-1 mr-1" style="display:inline-block; width:18px; visibility:hidden;"></span>');
      const $extraIcon2 = $('<span class="fuente-extra-icon fuente-extra-2 mr-1" style="display:inline-block; width:18px; visibility:hidden;"></span>');
      $icons.append($metallonIcon, $extraIcon2);
      this.decorateMetallonIcon($metallonIcon, clave);
      const $profilingIcon = $('<a class="mr-1 fuente-profiling" style="display:inline-block; width:18px; visibility:hidden;" target="_blank" rel="noopener noreferrer" title="Profiling"><i class="simple-icon-graph text-primary"></i></a>');
      $icons.append($profilingIcon);
      this.decorateProfilingIcon($profilingIcon, clave);
      const $qualityIcon = $('<i class="simple-icon-pie-chart text-muted mr-2 fuente-calidad" style="cursor: default; display:inline-block; width:18px; visibility:hidden;" title="Calidad"></i>');
      $icons.append($qualityIcon);
      this.decorateCalidadIcon($qualityIcon, clave);
      const meta = this.parseFuenteKey ? this.parseFuenteKey(clave) : null;
      const tooltipAvance = this.getAvanceTooltip ? this.getAvanceTooltip(meta) : null;
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

      // Cambiado el boton por un icono y se a+ade modal de confirmacion
      const $delIcon = $('<i class="simple-icon-trash text-danger p-1" style="cursor: pointer;" title="Eliminar Fuente"></i>');
      $delIcon.on('click', () => {
        $('#confirmDeleteModalBody').text('Estas seguro de que quieres quitar esta fuente?');
        $('#confirmDeleteModal').modal('show');

        $('#btnConfirmDelete').off('click').on('click', () => {
          $('#confirmDeleteModal').modal('hide');
          this.fuentesSeleccionadas.splice(i, 1);
          this.markStepAsDirty(); // Marcar como sucio al eliminar fuente
          this.renderFuentes();
        });
      });
      $li.append($delIcon);
      lista.append($li);
    });
    const ul = lista.get(0);
    if (ul) ul.scrollTop = ul.scrollHeight;
  },

  async syncFuentesDesdeBD() {
    if (!this.currentCasoId) return;
    try {
      const data = await ApiService.query({
        campos: 'CLAVE_FUENTE, SN_ACTIVO',
        origen: 'PROCESOS_BI.DBO.T_CASOS_USO_FUENTES',
        condicion: `ID_CASO_USO = ${this.currentCasoId} AND SN_ACTIVO = 1`
      });
      this.fuentesSeleccionadas = (data || [])
        .map(fuente => fuente.CLAVE_FUENTE || fuente.clave_fuente || '')
        .filter(Boolean);
      this.renderFuentes();
    } catch (error) {
      console.error('Error al recargar las fuentes del caso:', error);
    }
  },

  renderResponsables() {
    const { lista } = this.elements.responsables;
    lista.empty();
    const order = this.ROL_ORDER || {};
    this.responsablesEnEdicion.sort((a, b) => {
      const va = order[a.rol] || Number.MAX_SAFE_INTEGER;
      const vb = order[b.rol] || Number.MAX_SAFE_INTEGER;
      if (va !== vb) return va - vb;
      return (a.nombre || '').localeCompare(b.nombre || '');
    });
    const total = this.responsablesEnEdicion.length;

    $('#titulo-responsables-agregados-nuevo').html(`Responsables agregados <span class="badge badge-pill badge-primary ml-1">${total}</span>`);

    if (total === 0) {
      lista.append('<li class="list-group-item text-muted">Sin responsables adicionales.</li>');
      return;
    }

    this.responsablesEnEdicion.forEach((resp, index) => {
      const $li = $('<li>').addClass('list-group-item d-flex justify-content-between align-items-center');

      if (resp.isEditing) {
        // --- MODO EDICION ---
        const $select = $(`
          <select class="form-control form-control-sm" style="width: 120px;">
            <option value="Líder de Dominio" ${resp.rol === 'Líder de Dominio' || resp.rol === 'Lider de Dominio' ? 'selected' : ''}>Líder de Dominio</option>
            <option value="Custodio" ${resp.rol === 'Custodio' ? 'selected' : ''}>Custodio</option>
            <option value="Data Translator" ${resp.rol === 'Data Translator' ? 'selected' : ''}>Data Translator</option>
            <option value="Especialista de Calidad" ${resp.rol === 'Especialista de Calidad' ? 'selected' : ''}>Especialista de Calidad</option>
            <option value="Administrador" ${resp.rol === 'Administrador' ? 'selected' : ''}>Administrador</option>
          </select>
        `);
        const $spanNombre = $(`<span>: ${resp.nombre}</span>`);
        const $saveIcon = $(`<i class="simple-icon-check text-success p-1 btn-save-responsable-nuevo" style="cursor: pointer;" title="Guardar Rol" data-index="${index}"></i>`);

        $li.append($('<div>').addClass('d-flex align-items-center').append($select).append($spanNombre));
        $li.append($saveIcon);
      } else {
        // --- MODO VISTA ---
        $li.append(`<span><strong>${resp.rol}:</strong> ${resp.nombre}</span>`);
        const $editIcon = $(`<i class="simple-icon-pencil text-info p-1 btn-edit-responsable-nuevo" style="cursor: pointer;" title="Editar Rol" data-index="${index}"></i>`);
        const $delIcon = $(`<i class="simple-icon-trash text-danger p-1 btn-del-responsable-nuevo" style="cursor: pointer;" title="Eliminar Responsable" data-index="${index}"></i>`);
        $li.append($('<div>').append($editIcon).append($delIcon));
      }
      lista.append($li);
    });
  },

  /**
   * Carga los responsables adicionales desde la base de datos para el caso de uso actual.
   */
  async loadResponsablesDelCaso() {
    this.elements.responsables.lista.html('<li class="list-group-item text-muted">Cargando responsables...</li>');
    const idCaso = this.currentCasoId;
    if (!idCaso) {
      this.elements.responsables.lista.html('<li class="list-group-item text-warning">Guarda el primer paso para empezar.</li>');
      return;
    }

    try {
      const data = await ApiService.query({
        campos: 'ID_ESTRUCTURA, USUARIO_ESTRUCTURA, USUARIO_ROL, SN_ACTIVO',
        origen: 'PROCESOS_BI.DBO.T_CASOS_USO_ESTRUCTURA',
        condicion: `ID_CASO_USO = ${idCaso} AND SN_ACTIVO = 1`
      });

      this.responsablesEnEdicion = data.map(r => ({
        id_responsable: r.ID_ESTRUCTURA,
        cod_empleado: r.USUARIO_ESTRUCTURA,
        nombre: SharePointUtils.getNombrePorCodigo(r.USUARIO_ESTRUCTURA) || 'Nombre no encontrado',
        rol: r.USUARIO_ROL
      }));
      this.renderResponsables();
    } catch (e) {
      console.error('Error cargando responsables adicionales:', e);
      this.elements.responsables.lista.html('<li class="list-group-item text-danger">Error al cargar responsables</li>');
    }
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
   * Maneja el clic en el boton de guardar.
   * Si es el ultimo paso, guarda y cierra. Si no, solo guarda el progreso.
   */
  async handleSaveClick() {
    const andNavigate = arguments.length > 0 && arguments[0] === true;
    this.elements.saveBtn.prop('disabled', true);
    try {
      await this.handleSaveStep();

      // Si es el ultimo paso, cierra el modal y refresca.
      if (this.currentStep === this.TOTAL_STEPS || andNavigate) {
        this.elements.modal.modal('hide');
        if (window.refrescarCasosUso) {
          window.refrescarCasosUso();
        }
      } else {
        this.markStepAsClean(); // Marcar el paso como limpio despues de guardar
        // Si acabamos de guardar el primer paso, refrescamos la vista principal.
        if (this.currentStep === 1 && window.refrescarCasosUso) {
          window.refrescarCasosUso();
        }
        if (andNavigate && this.currentStep < this.TOTAL_STEPS) {
          this.goTo(this.currentStep + 1);
        }
        showNotification("top", "center", "success", "Progreso guardado correctamente.", 1500);
      }
    } catch (err) {
      console.error('Error al guardar el paso:', err);
      alert('Error al guardar: ' + err.message);
    } finally {
      this.elements.saveBtn.prop('disabled', false);
    }
  },

  /**
   * Logica central de guardado por paso (inserta o actualiza).
   */
  async handleSaveStep() {
    const { descInput, domainSelect, estadoInput } = this.elements;
    const usuarioCode = typeof SharePointUtils !== 'undefined' ? SharePointUtils.getEmployeeCodeByUser(window.current_user) : 0;

    if (!usuarioCode) throw new Error("No se pudo determinar el usuario actual.");

    const subdominioVal = (this.elements.subdominioSelect.val() || '').trim();
    const nowSql = () => new Date().toISOString().slice(0, 23).replace('T', ' ');

    if (!this.currentCasoId) {
      if (this.currentStep < 2) {
        throw new Error("Debes avanzar al paso 2 y asignar los responsables antes de guardar.");
      }

      if (!this.validateStep(1) || !this.validateStep(2)) {
        throw new Error("Faltan campos obligatorios en el Paso 1 o 2.");
      }

      const FEC_CREACION = nowSql();
      const datos = {
        DESCRIPCION_CASO_USO: descInput.val().trim(),
        DETALLE_CASO_USO: this.elements.detalleInput.val().trim(),
        ENTREGABLE_CASO_USO: this.elements.entregableInput.val().trim(),
        ID_DOMINIO: Number(domainSelect.val()),
        ESTADO_CASO_USO: estadoInput.val(),
        SN_ACTIVO: Number($('#nc_sn_activo').val()),
        SUBDOMINIO: subdominioVal || null,
        // Roles añadidos directamente en la creación
        COD_ESPECIALISTA: Number($('#nc_cod_especialista').val()),
        COD_SPONSOR: Number($('#nc_cod_sponsor').val()),
        COD_INGENIERO_RESPONSABLE: Number($('#nc_cod_ingeniero').val()),
        USUARIO_CREACION: usuarioCode,
        FEC_CREACION
      };

      await ApiService.insert('PROCESOS_BI.DBO.T_CASOS_USO_ANALITICA', datos);

      this.currentCasoId = await this.fetchCasoIdByMarca(datos.DESCRIPCION_CASO_USO, datos.USUARIO_CREACION, datos.FEC_CREACION);
      if (!this.currentCasoId) {
        throw new Error('No se pudo obtener el ID del caso recién creado.');
      }

      console.log(`Caso de Uso creado con ID: ${this.currentCasoId}`);

      this.fuentesSeleccionadas = [];
      this.renderFuentes();

      // Inicializar panel lateral de Seguimiento de comentarios
      $('.seguimiento-card')
        .appendTo($('#modalNuevoCaso').find('.modal-content'))
        .addClass('seguimiento-card--modal')
        .fadeIn();

      if (typeof SeguimientoManager !== 'undefined') {
        SeguimientoManager.init({
          parentId: this.currentCasoId,
          parentField: "id_oga",
          currentUser: window.current_user || 'gortiz',
          empleados: window.empleados || {},
          folderUrl: `${typeof BASE_URL !== 'undefined' ? BASE_URL : ''}docs/SeguimientoCasosUso`,
          origen: "CDU",
          parentName: datos.DESCRIPCION_CASO_USO || null,
          parentDomainId: datos.ID_DOMINIO || Number(domainSelect.val()) || null,
        });
      }

    }
    else {
      const datosUpdate = {};

      if (this.currentStep === 1) {
        if (!this.validateStep(1)) throw new Error("Validación fallida en el Paso 1.");
        datosUpdate.DESCRIPCION_CASO_USO = descInput.val().trim();
        datosUpdate.ID_DOMINIO = Number(domainSelect.val());
        datosUpdate.DETALLE_CASO_USO = this.elements.detalleInput.val().trim();
        datosUpdate.ENTREGABLE_CASO_USO = this.elements.entregableInput.val().trim();
        datosUpdate.ESTADO_CASO_USO = estadoInput.val();
        datosUpdate.SUBDOMINIO = subdominioVal || null;
      }

      if (this.currentStep === 2) {
        if (!this.validateStep(2)) throw new Error("Faltan responsables obligatorios en el Paso 2.");
        datosUpdate.COD_ESPECIALISTA = Number($('#nc_cod_especialista').val());
        datosUpdate.COD_SPONSOR = Number($('#nc_cod_sponsor').val());
        datosUpdate.COD_INGENIERO_RESPONSABLE = Number($('#nc_cod_ingeniero').val());
      }

      if (this.currentStep === 3 && this.fuentesSeleccionadas.length > 0) {
        const promesasFuentes = this.fuentesSeleccionadas.map(clave =>
          ApiService.insert('PROCESOS_BI.DBO.t_casos_uso_fuentes', {
            ID_CASO_USO: this.currentCasoId,
            CLAVE_FUENTE: clave,
            SN_ACTIVO: 1,
            USUARIO_CREACION: usuarioCode
          })
        );
        await Promise.all(promesasFuentes);
        await this.syncFuentesDesdeBD();
      }

      if (Object.keys(datosUpdate).length > 0 || this.currentStep === 2) {
        datosUpdate.FEC_MODIFICACION = nowSql();
        datosUpdate.USUARIO_MODIFICACION = usuarioCode;
        await ApiService.update('PROCESOS_BI.DBO.T_CASOS_USO_ANALITICA', datosUpdate, `ID_CASO_USO = ${this.currentCasoId}`);
        console.log(`Caso de Uso ID: ${this.currentCasoId} actualizado en el paso ${this.currentStep}.`);
      }

      if (this.responsablesParaDesactivar.length > 0) {
        const idsParaDesactivar = this.responsablesParaDesactivar.join(',');
        await ApiService.update(
          'PROCESOS_BI.DBO.T_CASOS_USO_ESTRUCTURA',
          { SN_ACTIVO: 0, FEC_MODIFICACION: nowSql(), USUARIO_MODIFICACION: usuarioCode },
          `ID_ESTRUCTURA IN (${idsParaDesactivar})`
        );
        this.responsablesParaDesactivar = [];
        await this.loadResponsablesDelCaso();
      }
    }
  },

  async fetchCasoIdByMarca(desc, userCode, fecCreacion) {
    const sqlEscape = (s) => String(s).replace(/'/g, "''");
    const condicion = `DESCRIPCION_CASO_USO = '${sqlEscape(desc)}' AND USUARIO_CREACION = ${Number(userCode)} AND FEC_CREACION = '${fecCreacion}'`;

    const result = await ApiService.query({
      campos: 'ID_CASO_USO',
      origen: 'PROCESOS_BI.DBO.t_casos_uso_analitica',
      condicion
    });

    const row = result[0];
    return row ? Number(row.ID_CASO_USO) : null;
  },

  /**
   * Carga y renderiza los Terminos asociados al caso de uso actual (tabla SQL y fallback SP).
   */
  async loadAndRenderTerms() {
    const { listaTerminos, listaTerminosDetalle } = this.elements;
    this.initTerminosSearch();
    listaTerminos.html('<li class="list-group-item text-muted">Cargando...</li>');
    listaTerminosDetalle.html('<li class="list-group-item text-muted">Cargando...</li>');

    const idCasoUso = Number(this.currentCasoId);
    if (!idCasoUso) {
      const msg = '<li class="list-group-item text-muted">Guarda el primer paso para ver y agregar términos.</li>';
      listaTerminos.html(msg);
      listaTerminosDetalle.html(msg);
      return;
    }

    try {
      // 1. Buscamos las relaciones en la tabla intermedia
      const relaciones = await window.SqlHelper.query(
        'ID_CASO_TERMINOS, COD_TERMINOS, TIPO_TERMINOS',
        'PROCESOS_BI.DBO.t_casos_uso_terminos_mb',
        `ID_CASO_USO = ${idCasoUso} AND SN_ACTIVO = 1`
      );

      // ----------------------------------------------------------------------
      // RAMA A: NO hay relaciones (Fallback a búsqueda por txt_desc_subdominio)
      // ----------------------------------------------------------------------
      if (!relaciones || relaciones.length === 0) {
        // Buscamos términos donde la cadena txt_desc_subdominio contenga el ID del caso
        // Se usa LIKE porque puede tener el formato "12; 45; 6"
        const terminosFallback = await window.SqlHelper.query(
          'id, tipo, nombre, descripcion, prioridad',
          window.TerminosService.TABLA || 'procesos_bi.dbo.T_terminos',
          `txt_desc_subdominio LIKE '%${idCasoUso}%' AND sn_activo = 1`
        );

        const terminosFormateados = terminosFallback.map(row => {
          const prioridadNum = Number(row.prioridad);
          return {
            id: row.id,
            sharepointId: row.id,
            nombre: row.nombre,
            descripcion: row.descripcion,
            prioridad: Number.isNaN(prioridadNum) || row.prioridad === null ? Number.POSITIVE_INFINITY : prioridadNum,
            casoTermId: null
          };
        }).sort((a, b) => a.prioridad - b.prioridad);

        this.renderTerms(terminosFormateados);
        return;
      }

      // ----------------------------------------------------------------------
      // RAMA B: SÍ hay relaciones (Cargamos el detalle de cada término)
      // ----------------------------------------------------------------------
      const terminos = await Promise.all(relaciones.map(async (rel) => {
        const infoTermino = await window.TerminosService.getById(rel.COD_TERMINOS);

        if (infoTermino) {
          const prioridadNum = Number(infoTermino.prioridad);
          return {
            id: infoTermino.id,
            sharepointId: rel.COD_TERMINOS, // Mantenido por compatibilidad
            nombre: infoTermino.nombre,
            descripcion: infoTermino.descripcion,
            prioridad: Number.isNaN(prioridadNum) || infoTermino.prioridad === null ? Number.POSITIVE_INFINITY : prioridadNum,
            casoTermId: rel.ID_CASO_TERMINOS,
            tipo: rel.TIPO_TERMINOS
          };
        } else {
          // Fallback si la relación existe pero el término fue borrado
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

      const ordenados = terminos
        .filter(Boolean)
        .sort((a, b) => (a.prioridad || Number.POSITIVE_INFINITY) - (b.prioridad || Number.POSITIVE_INFINITY));

      this.renderTerms(ordenados);

    } catch (error) {
      this.renderTermsError();
      console.error('Error al cargar términos del caso de uso:', error);
    }
  },

  renderTerms(terminos) {
    const { listaTerminos, listaTerminosDetalle, containerTerminosAsociados, containerSinTerminos } = this.elements;

    if (terminos.length === 0) {
      $('#titulo-terminos-asociados-nuevo').html('Terminos Asociados');
      containerSinTerminos.show();
      containerTerminosAsociados.hide();
      listaTerminos.empty(); // Limpiamos las listas por si acaso
      listaTerminosDetalle.empty();
      return;
    }

    $('#titulo-terminos-asociados-nuevo').html(`Terminos Asociados <span class="badge badge-pill badge-primary ml-1">${terminos.length}</span>`);
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
        </li>
      `}).join('');

    listaTerminos.html(html);
    listaTerminosDetalle.html(html);
    listaTerminosDetalle.html(html);
  },

  /**
   * Muestra un mensaje de error en las listas de terminos.
   */
  renderTermsError() {
    const msg = '<li class="list-group-item text-danger">Error al cargar la lista de terminos.</li>';
    this.elements.listaTerminos.html(msg);
    this.elements.listaTerminosDetalle.html(msg);
    console.error("Error al cargar los terminos con SPServices.");
  },

  /**
   * Maneja la eliminacion (desasociacion) de un termino del caso de uso.
   */
  async handleDeleteTerm(event) {
    const $li = $(event.currentTarget).closest('li');
    const caseTermId = $li.data('case-term-id');
    const termId = $li.data('term-id');

    if (!caseTermId && !termId) {
      console.error('No se pudo encontrar el ID del término a eliminar.');
      return;
    }

    $('#confirmDeleteModalBody').text('¿Estás seguro de que quieres quitar este término del caso de uso?');
    $('#confirmDeleteModal').modal('show');

    $('#btnConfirmDelete').off('click').on('click', async () => {
      $('#confirmDeleteModal').modal('hide');

      try {
        const usuarioCode = typeof SharePointUtils !== 'undefined'
          ? SharePointUtils.getEmployeeCodeByUser(window.current_user)
          : 0;

        // Caso 1: Existe una relación formal en la tabla puente
        if (caseTermId) {
          const fechaModificacion = new Date().toISOString().slice(0, 23).replace('T', ' ');
          await window.SqlHelper.update(
            'PROCESOS_BI.DBO.t_casos_uso_terminos_mb',
            { SN_ACTIVO: 0, FEC_MODIFICACION: fechaModificacion, USUARIO_MODIFICACION: usuarioCode },
            `ID_CASO_TERMINOS = ${caseTermId}`
          );
        }
        // Caso 2: Relación implícita guardada en el campo del término (Fallback)
        else if (termId) {
          // Utilizamos TerminosService para actualizar la base de datos de términos
          // Esto limpia el campo y automáticamente registra la auditoría (fecha y autor)
          await window.TerminosService.update(
            termId,
            { txt_desc_subdominio: "" },
            usuarioCode
          );
        }

        if (typeof showNotification === 'function') {
          showNotification('top', 'center', 'success', 'Término quitado correctamente.', 2000);
        }

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
   * Maneja la edicion de un termino, abriendo el modal con los datos precargados.
   */
  async handleEditTerm(event, context) {
    const termId = $(event.currentTarget).closest('li').data('term-id');
    if (!termId) {
      console.error("No se pudo encontrar el ID del término a editar.", event.currentTarget);
      return;
    }

    try {
      // 1. Obtener todos los datos del término directo desde SQL Server
      const termData = await window.TerminosService.getById(termId);

      if (!termData) {
        throw new Error("Término no encontrado en la base de datos.");
      }

      // 2. Abrir y poblar el modal en modo EDICIÓN
      $('#btnAbrirModalAtributo').click(); // Simula el clic para inicializar el modal

      setTimeout(async () => {
        $('#exampleModalContentLabel').text('Editar Término');
        $('#modalAtributo').modal('show');

        // Deshabilitar el listener de 'change' temporalmente para evitar recálculo de ID
        $("#tipo").off('change.listenerTipo');
        $("#tipo").val('TERMINO').trigger('change');
        $("#tipo").prop('disabled', true); // No se puede cambiar el tipo de un término existente

        // Poblar los campos principales
        $('#idatributo').val(termData.id);
        $('#NOMBREA').val(termData.nombre || '');
        $('#Descripcion').val(termData.descripcion || '');

        // Cargar dominios y seleccionar el correcto (Soporta si la API trae ID o la descripción)
        const dominios = await this.cargarDominios();
        const idDominio = termData.id_dominio || (dominios.find(d => d.descripcion === termData.dominio)?.id);
        if (idDominio) {
          $('#nombred').val(idDominio).trigger('change');
        }

        // Poblar selects múltiples y campos extra
        if (termData.caracteristicas) $('#nombrecaract').val(termData.caracteristicas.split('; ')).trigger('change');
        if (termData.dato_personal !== undefined && termData.dato_personal !== null) $('#datopersonal').val(termData.dato_personal).trigger('change');
        if (termData.golden_record !== undefined && termData.golden_record !== null) $('#goldenrecord').val(termData.golden_record ? '1' : '0').trigger('change');
        if (termData.catalogos_asociados) $('#catalogos').val(termData.catalogos_asociados.split('; ')).trigger('change');
        $('#prioridad_glosario').val(termData.prioridad || '');

        // Sobrescribir el evento de guardado
        const saveButton = $('#btnagregaratributo');
        saveButton.off('click.saveAtributo'); // Limpiar cualquier listener anterior

        saveButton.on('click.saveAtributo', async () => {

          // Armamos el payload limpio para SQL Server
          const payloadUpdate = {
            nombre: $("#NOMBREA").val().trim(),
            descripcion: $("#Descripcion").val().trim(),
            id_dominio: $("#nombred").val() ? Number($("#nombred").val()) : null,
            caracteristicas: ($("#nombrecaract").val() || []).join('; '),
            dato_personal: $("#datopersonal").val() ? Number($("#datopersonal").val()) : null,
            golden_record: $("#goldenrecord").val() === "1" ? 1 : 0,
            catalogos_asociados: ($("#catalogos").val() || []).join('; '),
            prioridad: $("#prioridad_glosario").val() ? Number($("#prioridad_glosario").val()) : null
          };

          try {
            // Obtenemos el ID del usuario para auditoría
            const usuarioCode = typeof SharePointUtils !== 'undefined'
              ? SharePointUtils.getEmployeeCodeByUser(window.current_user)
              : 0;

            // Enviamos a guardar usando TerminosService
            await window.TerminosService.update(termData.id, payloadUpdate, usuarioCode);

            if (typeof showNotification === 'function') {
              showNotification("top", "center", "success", "Término actualizado correctamente.", 2000);
            }

            $('#modalAtributo').modal('hide');
            context.loadAndRenderTerms(); // Recargar la tabla con el contexto pasado

          } catch (error) {
            console.error("Error al actualizar el término:", error);
            if (typeof showNotification === 'function') {
              showNotification("top", "center", "danger", "Ocurrió un error al actualizar el término.", 3000);
            }
          }
        });

        // Restaurar el listener original cuando el modal se cierre
        $('#modalAtributo').off('hidden.bs.modal.restore').on('hidden.bs.modal.restore', () => {
          saveButton.off('click.saveAtributo');

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
        showNotification("top", "center", "danger", "Ocurrió un error al cargar los datos del término para editar.", 3000);
      }
    }
  },

  /**
   * Inicializa el campo de busqueda de terminos con Select2.
   */
  async initTerminosSearch() {
    const { asignarTerminosSelect } = this.elements;

    if (asignarTerminosSelect.data('select2')) {
      return; // Ya inicializado
    }

    try {
      // 1. Consultar directamente a SQL Server
      // Pedimos solo 'id' y 'nombre', filtramos por tipo TERMINO activo, y delegamos el ordenamiento a SQL
      const terminosDb = await window.SqlHelper.query(
        "id, nombre",
        window.TerminosService.TABLA || "procesos_bi.dbo.T_terminos",
        "tipo = 'TERMINO' AND sn_activo = 1 ORDER BY nombre ASC"
      );

      // 2. Mapear los resultados de la base de datos al formato que exige Select2
      const terminosData = terminosDb.map(termino => ({
        id: termino.id,
        text: `${termino.nombre} (ID: ${termino.id})`
      }));

      // 3. Inicializar Select2 con la data estructurada
      asignarTerminosSelect.select2({
        theme: "bootstrap",
        placeholder: "Buscar por nombre o ID de término...",
        data: terminosData,
        minimumInputLength: 2,
        language: {
          inputTooShort: function (args) {
            return "Por favor, ingresa 2 o más caracteres";
          }
        }
      });

    } catch (error) {
      console.error("Error al cargar términos para el buscador con SQL Server:", error);

      // Fallback para inicializar un select2 vacío en caso de error de red o de base de datos
      // Así evitamos que la interfaz (UI) se rompa
      asignarTerminosSelect.select2({
        theme: "bootstrap",
        placeholder: "Error al cargar términos..."
      });
    }
  },

  /**
   * Maneja la asignacion de terminos existentes al caso de uso (tabla T_CASOS_USO_TERMINOS, fallback SP).
   */
  async handleAsignarTerminos() {
    const { asignarTerminosSelect } = this.elements;
    const terminosSeleccionados = asignarTerminosSelect.val();

    if (!terminosSeleccionados || terminosSeleccionados.length === 0) {
      showNotification('top', 'center', 'info', 'No has seleccionado ningun termino para asignar.', 2000);
      return;
    }

    if (!this.currentCasoId) {
      showNotification('top', 'center', 'warning', 'Guarda el primer paso antes de asignar terminos.', 2500);
      return;
    }

    const usuarioCode = SharePointUtils.getEmployeeCodeByUser(window.current_user);
    const nowSql = () => new Date().toISOString().slice(0, 23).replace('T', ' ');
    this.elements.btnAsignarTerminos.prop('disabled', true).text('Asignando...');

    try {
      const existentes = await ApiService.query({
        campos: 'ID_CASO_TERMINOS, COD_TERMINOS, SN_ACTIVO',
        origen: 'PROCESOS_BI.DBO.t_casos_uso_terminos_mb',
        condicion: `ID_CASO_USO = ${this.currentCasoId}`
      });
      const mapaExistentes = new Map((existentes || []).map(r => [String(r.COD_TERMINOS), r]));

      const promesas = [];
      terminosSeleccionados.forEach((terminoIdRaw) => {
        const terminoId = Number(terminoIdRaw);
        const existente = mapaExistentes.get(String(terminoId));

        if (existente) {
          if (!existente.SN_ACTIVO) {
            promesas.push(ApiService.update(
              'PROCESOS_BI.DBO.t_casos_uso_terminos_mb',
              { SN_ACTIVO: 1, FEC_MODIFICACION: nowSql(), USUARIO_MODIFICACION: usuarioCode },
              `ID_CASO_TERMINOS = ${existente.ID_CASO_TERMINOS}`
            ));
          }
          return;
        }

        promesas.push(ApiService.insert('PROCESOS_BI.DBO.t_casos_uso_terminos_mb', {
          ID_CASO_USO: this.currentCasoId,
          TIPO_TERMINOS: 'T',
          COD_TERMINOS: String(terminoId),
          SN_ACTIVO: 1,
          USUARIO_CREACION: usuarioCode,
          FEC_CREACION: nowSql()
        }));
      });

      await Promise.all(promesas);
      showNotification('top', 'center', 'success', 'Terminos asignados correctamente.', 2000);
      this.loadAndRenderTerms();
      asignarTerminosSelect.val(null).trigger('change');
    } catch (error) {
      console.error('Error al asignar terminos:', error);
      showNotification('top', 'center', 'danger', 'Ocurrio un error al asignar los terminos.', 3000);
    } finally {
      this.elements.btnAsignarTerminos.prop('disabled', false).html(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg><span class="label">Asignar</span>`);
    }
  }
  ,


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
        origen: 'PROCESOS_BI.DBO.t_casos_uso_terminos_mb',
        condicion: `ID_CASO_USO = ${idCasoUso} AND COD_TERMINOS = '${terminoId}'`
      });

      if (existentes && existentes.length) {
        const rel = existentes[0];
        if (!rel.SN_ACTIVO) {
          await ApiService.update(
            'PROCESOS_BI.DBO.t_casos_uso_terminos_mb',
            { SN_ACTIVO: 1, FEC_MODIFICACION: nowSql(), USUARIO_MODIFICACION: usuarioCode },
            `ID_CASO_TERMINOS = ${rel.ID_CASO_TERMINOS}`
          );
        }
      } else {
        await ApiService.insert('PROCESOS_BI.DBO.t_casos_uso_terminos_mb', {
          ID_CASO_USO: idCasoUso,
          TIPO_TERMINOS: 'T',
          COD_TERMINOS: String(terminoId),
          SN_ACTIVO: 1,
          USUARIO_CREACION: usuarioCode,
          FEC_CREACION: nowSql()
        });
      }

      this.loadAndRenderTerms();
    } catch (error) {
      console.error('Error al asignar termino recien creado:', error);
      this.loadAndRenderTerms();
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
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">Estas seguro de marcarlo como inactivo?</div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-secondary btn-cancelar" data-dismiss="modal">Cancelar</button>
              <button type="button" class="btn btn-primary btn-confirmar">Si, continuar</button>
            </div>
          </div>
        </div>
      </div>`;
    $('body').append(html);
    modal = $('#confirmInactiveModal');
    return modal;
  },

  setupActivoConfirmation() {
    if (this._activoConfirmBound) return;
    const select = $('#nc_sn_activo');
    if (!select.length) return;
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
        modal.find('.modal-body').text('Estas seguro de marcar este caso de uso como inactivo?');
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

// Inicializa el wizard cuando el DOM esta listo.
$(document).ready(() => {
  NuevoCasoWizard.init();
});

