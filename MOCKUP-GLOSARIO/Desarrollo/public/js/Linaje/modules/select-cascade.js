/**
 * Módulo de cascada de selects para el sistema de Linaje
 * Maneja la lógica de cascada servidor→base→esquema→tabla→campos
 */

class SelectCascadeManager {
  /**
   * Inicializa el gestor de cascada de selects
   */
  constructor() {
    // IDs de los elementos DOM
    this.selectors = {
      type: 'typeInput2',        // ← NUEVO: tipo de nodo
      server: 'srvInput',
      database: 'dbInput',
      schema: 'schemaInput',
      table: 'tableInput',
      fields: 'fieldsInput'
    };

    // Gestión de solicitudes asíncronas
    this.requestIds = {
      server: 0,
      database: 0,
      schema: 0,
      table: 0,
      fields: 0
    };

    // Cache local para optimizar solicitudes (complementa el caché de ApiManager)
    this.cache = {
      servers: null,
      databases: {},
      schemas: {},
      tables: {},
      fields: {}
    };

    // Flag para operaciones
    this.isClearing = false;

    // Cache de ultimos valores seleccionados (evita dobles disparos)
    this.lastSelectedValues = {};

    // Inicialización
    this.init();
  }

  /**
   * Inicializa el sistema de cascada
   */
  init() {
    this.initializeSelect2Components();
    this.setupEventListeners();
    // loadServers() ahora se ejecuta solo cuando se necesite (tipo === 'tabla')
  }

  /**
   * Verifica si Select2 está disponible
   * @returns {boolean} true si Select2 está disponible
   */
  isSelect2Available() {
    return window.$ && $.fn && $.fn.select2;
  }

  /**
   * Inicializa todos los componentes Select2
   */
  initializeSelect2Components() {
    // Verificar disponibilidad de Select2
    if (!this.isSelect2Available()) {
      return;
    }

    this.initializeServerSelect();
    this.initializeDatabaseSelect();
    this.initializeSchemaSelect();
    this.initializeTableSelect();
    this.initializeFieldsSelect();
    this.initializeTypeSelect();
    //this.syncTypeVisibility(); // sincroniza al cargar

    // Añadir el checkbox "Seleccionar todo" para campos
    this.addSelectAllCheckbox();
  }

  /**
   * Inicializa selector de tipos de nodo 
   */
  initializeTypeSelect() {
    const $el = $('#typeInput2');

    // ⬇️ forzamos sin emojis
    this.populateTypeInputFromLinaje($el, { useIcons: true });

    this.initializeSelect('typeInput2', {
      placeholder: 'Selecciona un tipo',
      minimumResultsForSearch: 0,
      searchInputPlaceholder: 'Buscar tipo...',
      allowClear: true
    });
  }

  populateTypeInputFromLinaje($el, { useIcons = false } = {}) {
    try {
      if (typeof getValoresTipoNodoLinaje !== 'function') return;
      const tipos = getValoresTipoNodoLinaje();
      if (!Array.isArray(tipos) || tipos.length === 0) return;

      const prevValue = ($el.val() || '').toString();
      const prevNormalized = this.normalizeNodeTypeValue(prevValue);
      $el.empty();
      $el.append(new Option('', '', true, true)); // placeholder

      const dedupeKeys = new Set();
      const optionValues = new Set();

      tipos.forEach(t => {
        const label = String(t || '').trim();
        if (!label) return;

        const normalized = this.normalizeNodeTypeValue(label);
        const dedupeKey = normalized || label.toUpperCase();
        if (dedupeKeys.has(dedupeKey)) return;
        dedupeKeys.add(dedupeKey);

        const optionValue = normalized || label;
        const icon = this.getNodeIcon(label);
        const displayName = this.getNodeDisplayName(label);
        const optionText = useIcons && icon ? `${icon} ${displayName}` : displayName;

        $el.append(new Option(optionText, optionValue, false, false));
        optionValues.add(optionValue);
      });

      this.addAlwaysAvailableNodeTypes($el, dedupeKeys, optionValues, { useIcons });

      const valueToRestore =
        (prevNormalized && optionValues.has(prevNormalized)) ? prevNormalized :
          (prevValue && optionValues.has(prevValue) ? prevValue : null);

      if (valueToRestore) {
        $el.val(valueToRestore);
      }
    } catch (e) { console.warn(e); }
  }

  normalizeNodeTypeValue(typeName) {
    if (typeof ConfigUtils !== 'undefined' && typeof ConfigUtils.normalizeNodeType === 'function') {
      return ConfigUtils.normalizeNodeType(typeName);
    }
    const raw = (typeName || '').toString().trim().toLowerCase();
    return raw || null;
  }

  getNodeIcon(typeName) {
    if (typeof ConfigUtils !== 'undefined' && typeof ConfigUtils.getNodeIcon === 'function') {
      return ConfigUtils.getNodeIcon(typeName);
    }
    return '';
  }

  getNodeDisplayName(typeName) {
    if (typeof ConfigUtils !== 'undefined' && typeof ConfigUtils.getNodeDisplayName === 'function') {
      return ConfigUtils.getNodeDisplayName(typeName);
    }
    return (typeName || '').toString().trim() || 'Tipo';
  }

  addAlwaysAvailableNodeTypes($el, dedupeKeys, optionValues, { useIcons = false } = {}) {
    if (typeof ConfigUtils === 'undefined' || typeof ConfigUtils.getAlwaysAvailableNodeTypes !== 'function') {
      return;
    }

    const extras = ConfigUtils.getAlwaysAvailableNodeTypes();
    extras.forEach(({ key, name, icon }) => {
      if (!key || dedupeKeys.has(key)) return;
      dedupeKeys.add(key);
      optionValues.add(key);

      const optionText = useIcons && icon ? `${icon} ${name}` : name;
      $el.append(new Option(optionText, key, false, false));
    });
  }
  /**
   * Inicializa selector de servidores
   */
  initializeServerSelect() {
    this.initializeSelect(this.selectors.server, {
      placeholder: 'Selecciona un servidor',
      minimumResultsForSearch: 0, // Siempre mostrar búsqueda
      searchInputPlaceholder: 'Buscar servidor...'
    });
  }

  /**
   * Inicializa selector de bases de datos
   */
  initializeDatabaseSelect() {
    this.initializeSelect(this.selectors.database, {
      placeholder: 'Selecciona una base',
      minimumResultsForSearch: 0, // Siempre mostrar búsqueda
      disabled: true
    });
  }

  /**
   * Inicializa selector de esquemas
   */
  initializeSchemaSelect() {
    this.initializeSelect(this.selectors.schema, {
      placeholder: 'Selecciona un esquema',
      minimumResultsForSearch: 0, // Siempre mostrar búsqueda
      disabled: true
    });
  }

  /**
   * Inicializa selector de tablas
   */
  initializeTableSelect() {
    this.initializeSelect(this.selectors.table, {
      placeholder: 'Selecciona una tabla',
      minimumResultsForSearch: 0, // Siempre mostrar búsqueda
      disabled: true
    });
  }

  getTableOrigin() {
    const sId = this.selectors.server;
    const dId = this.selectors.database;
    const scId = this.selectors.schema;

    const server = (this.getSelectedValue(sId) || '').toString().trim();
    const database = (this.getSelectedValue(dId) || '').toString().trim();
    const schema = (this.getSelectedValue(scId) || '').toString().trim();

    return (server && database && schema) ? `${server}.${database}.${schema}` : null;
  }


  /**
   * Inicializa selector de campos
   */
  initializeFieldsSelect() {
    this.initializeSelect(this.selectors.fields, {
      placeholder: 'Selecciona campos',
      closeOnSelect: false,
      disabled: true,
      minimumResultsForSearch: 0, // Siempre mostrar búsqueda
      searchInputPlaceholder: 'Buscar campos...'
    });
  }

  /**
   * Método genérico para inicializar un selector con Select2
   * @param {string} selectorId - ID del elemento a inicializar
   * @param {Object} options - Opciones de configuración para Select2
   */
  initializeSelect(selectorId, options = {}) {
    const defaultOptions = {
      allowClear: true,
      width: '100%',
      dropdownParent: $('body'), // Usar body como contenedor para evitar problemas de z-index
      dropdownCssClass: 'select2-dropdown-linaje' // Clase personalizada para styling
    };

    $(`#${selectorId}`).select2({
      ...defaultOptions,
      ...options
    });

    // Asegurar que los dropdowns tengan z-index alto después de inicializar
    setTimeout(() => {
      $('.select2-dropdown-linaje').parent().css('z-index', 9999);
    }, 0);
  }

  /**
   * Configura los event listeners para los selectores
   */
  setupEventListeners() {
    // Ya estamos dentro de DOMContentLoaded en Linaje.aspx,
    // así que enganchamos directamente los eventos.
    this.setupSelectionEvents();
    this.setupClearEvents();
  }

  /**
   * Configura eventos de selección para la cascada
   */
  setupSelectionEvents() {
    // Tipo cambia -> mostrar/ocultar database-selectors
    this.registerSelectionEvent(this.selectors.type, (tipo) => {
      this.toggleDatabaseSelectors(tipo);
    });

    // Servidor cambia -> cargar bases de datos
    this.registerSelectionEvent(this.selectors.server, (serverName) => {
      this.loadDatabases(serverName);
    });

    // Base de datos cambia -> cargar esquemas
    this.registerSelectionEvent(this.selectors.database, (databaseName) => {
      const serverName = this.getSelectedValue(this.selectors.server);
      this.loadSchemas(serverName, databaseName);
    });

    // Esquema cambia -> cargar tablas
    this.registerSelectionEvent(this.selectors.schema, (schemaName) => {
      const serverName = this.getSelectedValue(this.selectors.server);
      const databaseName = this.getSelectedValue(this.selectors.database);
      this.loadTables(serverName, databaseName, schemaName);
    });

    // Tabla cambia -> cargar campos
    this.registerSelectionEvent(this.selectors.table, (tableName) => {
      const serverName = this.getSelectedValue(this.selectors.server);
      const databaseName = this.getSelectedValue(this.selectors.database);
      const schemaName = this.getSelectedValue(this.selectors.schema);
      this.loadFields(serverName, databaseName, schemaName, tableName);
    });
  }

  /**
   * Registra un evento de selección para un selector
   * @param {string} selectorId - ID del selector
   * @param {Function} handler - Función a ejecutar con el valor seleccionado
   */
  registerSelectionEvent(selectorId, handler) {
    const $el = $(`#${selectorId}`);

    const runHandler = (selectedValue) => {
      const prev = this.lastSelectedValues[selectorId];
      if (selectedValue === prev) return;
      this.lastSelectedValues[selectorId] = selectedValue;
      handler(selectedValue);
    };

    // Evento Select2 (seleccion manual)
    $el.on('select2:select', (e) => {
      const selectedValue = e?.params?.data?.id ?? this.getSelectedValue(selectorId);
      runHandler(selectedValue);
    });

    // Fallback para cambios programaticos o cuando no se dispara select2:select
    $el.on('change', () => {
      const selectedValue = this.getSelectedValue(selectorId);
      runHandler(selectedValue);
    });
  }

  /**
   * Configura eventos de limpieza
   */
  setupClearEvents() {
    // Registrar evento de limpieza para cada selector
    Object.values(this.selectors).forEach(selectorId => {
      $(`#${selectorId}`).on('select2:clear', (e) => {
        this.handleClearCascade(e.target.id);
      });
    });
  }

  /**
   * Obtiene el valor seleccionado de un selector
   * @param {string} selectorId - ID del selector
   * @returns {string|null} Valor seleccionado o null
   */
  getSelectedValue(selectorId) {
    return $(`#${selectorId}`).val() || null;
  }

  /**
   * Maneja limpieza en cascada cuando se presiona la X
   * @param {string} clearedSelectId - ID del selector limpiado
   */
  handleClearCascade(clearedSelectId) {
    // Prevenir múltiples ejecuciones simultáneas
    if (this.isClearing) {
      return;
    }

    this.isClearing = true;

    try {
      // Determinar qué selectores limpiar basado en el ID limpiado
      const selectorsToReset = this.getSelectorsToReset(clearedSelectId);

      // Resetear cada selector en la cascada
      selectorsToReset.forEach(selectorId => {
        this.resetSelector(selectorId);
      });

      // Actualizar checkbox "Seleccionar todo" si es necesario
      if (selectorsToReset.includes(this.selectors.fields)) {
        this.updateSelectAllCheckbox(0);
      }
    } finally {
      // Resetear flag después de un breve delay
      setTimeout(() => {
        this.isClearing = false;
      }, 100);
    }
  }

  /**
   * Determina qué selectores deben resetearse basado en el selector limpiado
   * @param {string} clearedSelectId - ID del selector limpiado
   * @returns {Array} Array de IDs de selectores a resetear
   */
  getSelectorsToReset(clearedSelectId) {
    const { type, server, database, schema, table, fields } = this.selectors;

    switch (clearedSelectId) {
      case type:
        return [server, database, schema, table, fields]; // ← NUEVO: tipo resetea todo
      case server:
        return [database, schema, table, fields];
      case database:
        return [schema, table, fields];
      case schema:
        return [table, fields];
      case table:
        return [fields];
      default:
        return [];
    }
  }

  /**
   * Resetea un selector específico
   * @param {string} selectorId - ID del selector a resetear
   */
  resetSelector(selectorId) {
    const $sel = $(`#${selectorId}`);
    const placeholders = {
      [this.selectors.database]: 'Selecciona una base',
      [this.selectors.schema]: 'Selecciona un esquema',
      [this.selectors.table]: 'Selecciona una tabla',
      [this.selectors.fields]: 'Selecciona campos',
      [this.selectors.server]: 'Selecciona un servidor',
      [this.selectors.type]: 'Selecciona un tipo'
    };

    $sel.empty().prop('disabled', true);

    // Para los campos, no añadimos placeholder como opción
    if (selectorId !== this.selectors.fields) {
      $sel.append(new Option(placeholders[selectorId], '', true, true));
    }

    // Si es el tipo, también ocultar database-selectors
    if (selectorId === this.selectors.type) {
      this.toggleDatabaseSelectors(null);
    }

    $sel.trigger('change');

    if (selectorId === this.selectors.table) {
      this.clearDescripcionInput();
    }
  }

  /**
   * Carga servidores
   */
  async loadServers() {
    const selectorId = this.selectors.server;
    const myReq = ++this.requestIds.server;

    // Preparar selector para carga
    this.setLoading(selectorId, 'Cargando servidores...');

    // Resetear selectores dependientes
    this.resetDependentSelectors(selectorId);

    try {
      // Obtener datos (desde caché o API)
      const servidores = await this.fetchServerData(myReq);
      if (myReq !== this.requestIds.server) return;

      // Actualizar selector con datos
      this.updateSelector(selectorId, servidores, 'Selecciona un servidor');

      // Preseleccionar si hay parámetro en URL
      // this.preselectFromUrl(selectorId, servidores, 'servidor');
    } catch (e) {
      this.handleLoadError(selectorId, 'servidores', e);
    }
  }

  /**
   * Obtiene datos de servidores (desde caché o API)
   * @param {number} requestId - ID de la petición actual
   * @returns {Promise<Array>} Lista de servidores
   */
  async fetchServerData(requestId) {
    if (this.cache.servers) {
      return this.cache.servers;
    } else {
      const servidores = await apiManager.getServers();
      if (requestId !== this.requestIds.server) {
        throw new Error('Petición obsoleta');
      }
      // Guardar en cache
      this.cache.servers = servidores;
      return servidores;
    }
  }

  /**
   * Establece un selector en estado de carga
   * @param {string} selectorId - ID del selector
   * @param {string} loadingText - Texto a mostrar durante la carga
   */
  setLoading(selectorId, loadingText) {
    const $sel = $(`#${selectorId}`);
    $sel.empty().prop('disabled', true);
    $sel.append(new Option(loadingText, '', true, true));
    $sel.trigger('change');
  }

  /**
   * Resetea selectores dependientes basado en el selector actual
   * @param {string} selectorId - ID del selector actual
   */
  resetDependentSelectors(selectorId) {
    const selectorsToReset = this.getSelectorsToReset(selectorId);
    selectorsToReset.forEach(dependentId => {
      this.resetSelector(dependentId);
    });
  }

  /**
   * Actualiza un selector con datos
   * @param {string} selectorId - ID del selector
   * @param {Array} items - Array de elementos para añadir al selector
   * @param {string} placeholder - Texto de placeholder
   */
  updateSelector(selectorId, items, placeholder) {
    const $sel = $(`#${selectorId}`);

    // Limpiar y añadir placeholder
    $sel.empty();

    if (selectorId !== this.selectors.fields) {
      $sel.append(new Option(placeholder, '', true, true));
    }

    // Añadir opciones
    items.forEach(item => {
      const value = typeof item === 'string' ? item : (item.value || item.name);
      const label = typeof item === 'string' ? item : (item.label || item.name || item.value);
      $sel.append(new Option(label, value));
    });

    // Habilitar si hay opciones
    $sel.prop('disabled', items.length === 0);
  }

  /**
   * Preselecciona un valor desde URL si existe
   * @param {string} selectorId - ID del selector
   * @param {Array} items - Array de elementos disponibles
   * @param {string} paramName - Nombre del parámetro URL
   */

  // METODO LEGACY (NO USADO)
  preselectFromUrl(selectorId, items, paramName) {
    const preValue = LinajeHelpers.getQueryParam(paramName);
    const itemValues = items.map(item =>
      typeof item === 'string' ? item : (item.value || item.name)
    );

    if (preValue && itemValues.includes(preValue)) {
      $(`#${selectorId}`).val(preValue).trigger('change');
    }
  }

  /**
   * Maneja error de carga
   * @param {string} selectorId - ID del selector
   * @param {string} resourceName - Nombre del recurso que se estaba cargando
   * @param {Error} error - Error capturado
   */
  handleLoadError(selectorId, resourceName, error) {
    LinajeHelpers.handleError(error, `cargando ${resourceName}`);
    const $sel = $(`#${selectorId}`);
    $sel.empty().prop('disabled', true);
    $sel.append(new Option(`Error al cargar ${resourceName}`, '', true, true));
    $sel.trigger('change');

    if (selectorId === this.selectors.fields) {
      this.updateSelectAllCheckbox(0);
    }
  }


  /**
   * Muestra/oculta los selectores de base de datos según el tipo seleccionado
   * @param {string} tipo - Tipo de nodo seleccionado
   */
  toggleDatabaseSelectors(tipoRaw) {
    const $db = $('#database-selectors');
    const $name = $('#nameSection');
    if (!$db.length) return;

    const dbEl = $db[0];
    const nameEl = $name.length ? $name[0] : null;
    const tipo = (tipoRaw || '').toString().trim().toLowerCase();
    const showDb = (tipo === 'tabla');

    const showBox = (el) => {
      if (!el) return;
      el.hidden = false;
      el.classList?.remove?.('is-hidden');
      el.style.removeProperty('display');
      // Forzar si alguna regla externa mantiene display:none
      if (getComputedStyle(el).display === 'none') {
        el.style.setProperty('display', 'block', 'important');
      }
    };

    const hideBox = (el) => {
      if (!el) return;
      el.hidden = true;
      el.style.setProperty('display', 'none', 'important');
    };

    if (showDb) {
      showBox(dbEl);
      hideBox(nameEl);
      this.loadServers?.();
    } else {
      hideBox(dbEl);
      showBox(nameEl);
    }
  }



  /**
   * Carga bases de datos
   * @param {string} serverName - Nombre del servidor
   */
  async loadDatabases(serverName) {
    const selectorId = this.selectors.database;
    const myReq = ++this.requestIds.database;

    // Preparar selector para carga
    this.setLoading(selectorId, 'Cargando bases...');

    // Resetear selectores dependientes
    this.resetDependentSelectors(selectorId);

    if (!serverName) return;

    try {
      // Obtener datos (desde caché o API)
      const bases = await this.fetchDatabaseData(serverName, myReq);
      if (myReq !== this.requestIds.database) return;

      // Actualizar selector con datos
      this.updateSelector(selectorId, bases, 'Selecciona una base');
      // this.preselectFromUrl(selectorId, bases, 'base');
    } catch (e) {
      this.handleLoadError(selectorId, 'bases de datos', e);
    }
  }

  /**
   * Obtiene datos de bases de datos (desde caché o API)
   * @param {string} serverName - Nombre del servidor
   * @param {number} requestId - ID de la petición actual
   * @returns {Promise<Array>} Lista de bases de datos
   */
  async fetchDatabaseData(serverName, requestId) {
    const cacheKey = serverName;

    if (this.cache.databases[cacheKey]) {
      return this.cache.databases[cacheKey];
    } else {
      const bases = await apiManager.getDatabases(serverName);
      if (requestId !== this.requestIds.database) {
        throw new Error('Petición obsoleta');
      }
      // Guardar en cache
      this.cache.databases[cacheKey] = bases;
      return bases;
    }
  }

  /**
   * Carga esquemas
   * @param {string} serverName - Nombre del servidor
   * @param {string} databaseName - Nombre de la base de datos
   */
  async loadSchemas(serverName, databaseName) {
    const selectorId = this.selectors.schema;
    const myReq = ++this.requestIds.schema;

    // Preparar selector para carga
    this.setLoading(selectorId, 'Cargando esquemas...');

    // Resetear selectores dependientes
    this.resetDependentSelectors(selectorId);

    if (!serverName || !databaseName) return;

    try {
      // Obtener datos (desde caché o API)
      const esquemas = await this.fetchSchemaData(serverName, databaseName, myReq);
      if (myReq !== this.requestIds.schema) return;

      // Actualizar selector con datos
      this.updateSelector(selectorId, esquemas, 'Selecciona un esquema');

      // Preseleccionar si hay parámetro en URL
      // this.preselectFromUrl(selectorId, esquemas, 'esquema');
    } catch (e) {
      this.handleLoadError(selectorId, 'esquemas', e);
    }
  }

  /**
   * Obtiene datos de esquemas (desde caché o API)
   * @param {string} serverName - Nombre del servidor
   * @param {string} databaseName - Nombre de la base de datos
   * @param {number} requestId - ID de la petición actual
   * @returns {Promise<Array>} Lista de esquemas
   */
  async fetchSchemaData(serverName, databaseName, requestId) {
    const cacheKey = `${serverName}:${databaseName}`;

    if (this.cache.schemas[cacheKey]) {
      return this.cache.schemas[cacheKey];
    } else {
      const esquemas = await apiManager.getSchemas(serverName, databaseName);
      if (requestId !== this.requestIds.schema) {
        throw new Error('Petición obsoleta');
      }
      // Guardar en cache
      this.cache.schemas[cacheKey] = esquemas;
      return esquemas;
    }
  }

  /**
   * Carga tablas
   * @param {string} serverName - Nombre del servidor
   * @param {string} databaseName - Nombre de la base de datos
   * @param {string} schemaName - Nombre del esquema
   */
  async loadTables(serverName, databaseName, schemaName) {
    const selectorId = this.selectors.table;
    const myReq = ++this.requestIds.table;

    // Preparar selector para carga
    this.setLoading(selectorId, 'Cargando tablas...');

    // Resetear selectores dependientes
    this.resetDependentSelectors(selectorId);

    if (!serverName || !databaseName || !schemaName) return;

    try {
      // Obtener datos (desde caché o API)
      const tablas = await this.fetchTableData(serverName, databaseName, schemaName, myReq);
      if (myReq !== this.requestIds.table) return;

      // Actualizar selector con datos
      this.updateSelector(selectorId, tablas, 'Selecciona una tabla');

      // Activar búsqueda en tablas si hay muchas opciones
      if (tablas.length > 10) {
        this.enhanceTableSearch(selectorId);
      }

      // Preseleccionar si hay parámetro en URL
      // this.preselectFromUrl(selectorId, tablas, 'tabla');
    } catch (e) {
      this.handleLoadError(selectorId, 'tablas', e);
    }
  }

  /**
   * Mejora la búsqueda en el selector de tablas
   * @param {string} selectorId - ID del selector de tablas
   */
  enhanceTableSearch(selectorId) {
    const $sel = $(`#${selectorId}`);
    $sel.select2({
      placeholder: 'Selecciona una tabla',
      allowClear: true,
      width: '100%',
      dropdownParent: $('body'),
      dropdownCssClass: 'select2-dropdown-linaje',
      minimumInputLength: 0, // No requerir caracteres mínimos
      minimumResultsForSearch: 0, // Siempre mostrar búsqueda
      searchInputPlaceholder: 'Buscar tabla...'
    });


    // Asegurar que los dropdowns tengan z-index alto
    setTimeout(() => {
      $('.select2-dropdown-linaje').parent().css('z-index', 9999);
    }, 0);
  }

  /**
   * Obtiene datos de tablas (desde caché o API)
   * @param {string} serverName - Nombre del servidor
   * @param {string} databaseName - Nombre de la base de datos
   * @param {string} schemaName - Nombre del esquema
   * @param {number} requestId - ID de la petición actual
   * @returns {Promise<Array>} Lista de tablas
   */
  async fetchTableData(serverName, databaseName, schemaName, requestId) {
    const cacheKey = `${serverName}:${databaseName}:${schemaName}`;

    if (this.cache.tables[cacheKey]) {
      return this.cache.tables[cacheKey];
    } else {
      const tablas = await apiManager.getTables(serverName, databaseName, schemaName);
      if (requestId !== this.requestIds.table) {
        throw new Error('Petición obsoleta');
      }
      // Guardar en cache
      this.cache.tables[cacheKey] = tablas;
      return tablas;
    }
  }

  /**
   * Carga campos
   * @param {string} serverName - Nombre del servidor
   * @param {string} databaseName - Nombre de la base de datos
   * @param {string} schemaName - Nombre del esquema
   * @param {string} tableName - Nombre de la tabla
   */
  async loadFields(serverName, databaseName, schemaName, tableName) {
    const selectorId = this.selectors.fields;
    const myReq = ++this.requestIds.fields;

    // Preparar selector para carga
    this.setLoading(selectorId, 'Cargando campos...');
    $('#selectAllFields').prop('checked', false).prop('disabled', true);

    if (!serverName || !databaseName || !schemaName || !tableName) {
      return;
    }

    try {
      // Obtener datos (desde caché o API)
      const campos = await this.fetchFieldData(serverName, databaseName, schemaName, tableName, myReq);
      this.updateDescripcionFromTable(tableName);
      if (myReq !== this.requestIds.fields) {
        return;
      }

      // Configurar como select múltiple
      this.setupFieldsMultiSelect(selectorId, campos);

      // Actualizar el checkbox de "Seleccionar todo"
      this.updateSelectAllCheckbox(campos.length);
    } catch (e) {
      this.handleLoadError(selectorId, 'campos', e);
      this.updateSelectAllCheckbox(0);
    }

    
  }

  /**
   * Pide la descripción por código de tabla (p.ej. 'CC_VECTORIAL_001')
   * y la coloca en el input #descripcionInput
   * @param {string} tableCode
   */
  async updateDescripcionFromTable(tableCode) {
    try {
      const code = (tableCode || '').toString().trim();
      if (!code) return;

      const desc = await apiManager.getTableDescription(code);
      const $inp = $('#descripcionInput');
      if ($inp.length) {
        // Si prefieres NO sobreescribir cuando el usuario ya escribió algo,
        // cambia esta línea por: if (!$inp.val()) { $inp.val(desc || '').trigger('input'); }
        $inp.val(desc || '').trigger('input');
      }
    } catch (err) {
      console.warn('No se pudo cargar la descripción de la tabla:', err);
    }
  }

  /** Limpia el input de descripción */
  clearDescripcionInput() {
    const $inp = $('#descripcionInput');
    if ($inp.length) $inp.val('').trigger('input');
  }


  /**
   * Configura el selector de campos como un select múltiple
   * @param {string} selectorId - ID del selector de campos
   * @param {Array} campos - Array de campos disponibles
   */
  setupFieldsMultiSelect(selectorId, campos) {
    const $sel = $(`#${selectorId}`);

    // Si ya estaba select2, destruir antes de rehacer todo
    if ($sel.hasClass('select2-hidden-accessible')) {
      // Limpia handlers con nuestro namespace para evitar duplicados
      $sel.off('.clearSearch');
      $sel.select2('destroy');
    }

    // Limpiar y configurar como select múltiple
    $sel.empty().prop('multiple', true);

    // Añadir opciones
    campos.forEach(campo => {
      $sel.append(new Option(campo, campo));
    });

    // Habilitar/Deshabilitar según haya opciones
    $sel.prop('disabled', campos.length === 0);

    if (campos.length > 0) {
      // Inicializar Select2
      $sel.select2({
        placeholder: 'Selecciona campos',
        allowClear: true,
        width: '100%',
        closeOnSelect: false,              // importante para múltiple
        dropdownParent: $('body'),
        dropdownCssClass: 'select2-dropdown-linaje',
        minimumResultsForSearch: 0         // siempre mostrar búsqueda
        // Ojo: "searchInputPlaceholder" no es estándar en v4
      });

      // Utilidad: limpia el cuadro de búsqueda inline del Select2 múltiple
      // Utilidad: limpia el cuadro de búsqueda inline del Select2 múltiple (sin enfocar)
      function clearInlineSearch($select) {
        const $inline = $select.next('.select2-container').find('.select2-search__field');
        if ($inline.length) {
          $inline.val('').trigger('input'); // recalcula ancho del textarea
          // NO hacer focus aquí
        }
      }


      // Hooks: cada seleccionar/deseleccionar/abrir/cerrar → limpiar búsqueda
      // Hooks: solo seleccionar/deseleccionar → limpiar búsqueda (sin focus)
      $sel
        .off('.clearSearch') // por si re-ejecutas esta función
        .on('select2:select.clearSearch select2:unselect.clearSearch', () => {
          clearInlineSearch($sel);
        });


      // (Opcional) asegurar z-index del dropdown
      setTimeout(() => {
        $('.select2-dropdown-linaje').parent().css('z-index', 9999);
      }, 0);

      // Tus estilos personalizados
      this.applyFieldStyles?.($sel);
    }
  }


  /**
   * Aplica estilos personalizados a los elementos seleccionados del selector de campos
   * @param {jQuery} $sel - Elemento jQuery del selector
   */
  applyFieldStyles($sel) {
    const container = $sel.next('.select2-container');

    if (container.length) {
      // Aplicar estilos a chips seleccionados
      container.find('.select2-selection__choice').css({
        'background-color': '#ffd1e6',
        'color': '#3a1030',
        'border': '1px solid #e91e63',
        'border-radius': '8px',
        'padding': '4px 8px',
        'margin-right': '6px',
        'margin-bottom': '4px'
      });

      // Ocultar la X de los chips
      container.find('.select2-selection__choice__remove').css({
        'display': 'none'
      });

      // Aplicar estilos a opciones en dropdown (hover)
      container.find('.select2-results__option--highlighted').css({
        'background-color': '#ffd1e6',
        'color': '#3a1030'
      });
    }
  }

  /**
   * Obtiene datos de campos (desde caché o API)
   * @param {string} serverName - Nombre del servidor
   * @param {string} databaseName - Nombre de la base de datos
   * @param {string} schemaName - Nombre del esquema
   * @param {string} tableName - Nombre de la tabla
   * @param {number} requestId - ID de la petición actual
   * @returns {Promise<Array>} Lista de campos
   */
  async fetchFieldData(serverName, databaseName, schemaName, tableName, requestId) {
    const cacheKey = `${serverName}:${databaseName}:${schemaName}:${tableName}`;

    if (this.cache.fields[cacheKey]) {
      return this.cache.fields[cacheKey];
    } else {
      const campos = await apiManager.getFields(serverName, databaseName, schemaName, tableName);
      if (requestId !== this.requestIds.fields) {
        throw new Error('Petición obsoleta');
      }
      // Guardar en cache
      this.cache.fields[cacheKey] = campos;
      return campos;
    }
  }

  /**
   * Agrega checkbox "Seleccionar todo" al lado del select de campos
   */
  addSelectAllCheckbox() {
    const checkboxId = 'selectAllFields';
    const fieldsLabelSelector = `label[for="${this.selectors.fields}"]`;

    // Si ya existe un checkbox, solo actualizar handler
    if ($(`#${checkboxId}`).length > 0) {
      this.setupSelectAllHandler(checkboxId);
      return;
    }

    this.createSelectAllCheckbox(fieldsLabelSelector, checkboxId);
    this.setupSelectAllHandler(checkboxId);
  }

  /**
   * Crea el elemento checkbox "Seleccionar todo"
   * @param {string} labelSelector - Selector CSS del label donde añadir el checkbox
   * @param {string} checkboxId - ID para el checkbox
   */
  createSelectAllCheckbox(labelSelector, checkboxId) {
    const $label = $(labelSelector);
    if ($label.length === 0) {
      console.warn('⚠️ No se encontró el label para añadir el checkbox');
      return;
    }

    // Crear checkbox con estilo
    const checkboxHtml = `
      <input type="checkbox" id="${checkboxId}" class="select-all-checkbox" 
             style="margin-left: 8px; cursor: pointer; accent-color: #e91e63;">
    `;
    $label.append(checkboxHtml);

    // Añadir texto descriptivo
    $label.append('<span style="font-size: 12px; margin-left: 5px; color: #880e4f;">(todos)</span>');
  }

  /**
   * Configura el manejador de eventos para el checkbox "Seleccionar todo"
   * @param {string} checkboxId - ID del checkbox
   */
  setupSelectAllHandler(checkboxId) {
    const fieldsSelector = `#${this.selectors.fields}`;

    // Limpiar event listeners previos
    $(`#${checkboxId}`).off('change');
    $(fieldsSelector).off('change.selectAll');

    // Handler para el checkbox - seleccionar/deseleccionar todos
    $(`#${checkboxId}`).on('change', () => {
      const $fieldsSelect = $(fieldsSelector);
      const isChecked = $(`#${checkboxId}`).prop('checked');

      if (isChecked) {
        // Seleccionar todos los campos
        const allOptions = this.getAllFieldOptions($fieldsSelect);
        $fieldsSelect.val(allOptions).trigger('change');
      } else {
        // Deseleccionar todos
        $fieldsSelect.val(null).trigger('change');
      }
    });

    // Handler para actualizar estado del checkbox cuando cambia la selección
    $(fieldsSelector).on('change.selectAll', () => {
      this.updateCheckboxState(fieldsSelector, checkboxId);
    });
  }

  /**
   * Obtiene todos los valores de opciones de un select
   * @param {jQuery} $select - Elemento jQuery del select
   * @returns {Array} Array con los valores de las opciones
   */
  getAllFieldOptions($select) {
    return $select.find('option').map(function () {
      return $(this).val();
    }).get();
  }

  /**
   * Actualiza el estado del checkbox según la selección actual
   * @param {string} fieldsSelector - Selector CSS del select de campos
   * @param {string} checkboxId - ID del checkbox
   */
  updateCheckboxState(fieldsSelector, checkboxId) {
    const $fieldsSelect = $(fieldsSelector);
    const selectedCount = $fieldsSelect.val() ? $fieldsSelect.val().length : 0;
    const totalCount = $fieldsSelect.find('option').length;

    $(`#${checkboxId}`).prop('checked',
      selectedCount === totalCount && totalCount > 0
    );
  }

  /**
   * Actualiza el estado del checkbox "Seleccionar todo"
   * @param {number} totalCampos - Número total de campos disponibles
   */
  updateSelectAllCheckbox(totalCampos) {
    const $checkbox = $('#selectAllFields');
    if ($checkbox.length > 0) {
      $checkbox.prop('checked', false);
      $checkbox.prop('disabled', totalCampos === 0);
    }
  }

  /**
   * Obtiene los campos seleccionados
   * @returns {Array} Array con los campos seleccionados
   */
  getSelectedFields() {
    return $(`#${this.selectors.fields}`).val() || [];
  }

  /**
   * Obtiene la selección completa de todos los selectores
   * @returns {Object} Objeto con la selección actual
   */
  getSelected() {
    const { type, server, database, schema, table, fields } = this.selectors;

    return {
      tipo: $(`#${type}`).val() || null,        // ← NUEVO: tipo de nodo
      servidor: $(`#${server}`).val() || null,
      base: $(`#${database}`).val() || null,
      esquema: $(`#${schema}`).val() || null,
      tabla: $(`#${table}`).val() || null,
      campos: $(`#${fields}`).val() || []
    };
  }
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SelectCascadeManager };
} else {
  window.SelectCascadeManager = SelectCascadeManager;
}
