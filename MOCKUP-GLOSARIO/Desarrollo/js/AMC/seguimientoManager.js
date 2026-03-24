/**
 * @file Módulo reutilizable para gestionar un componente de seguimiento y comentarios.
 * @description Encapsula la lógica para mostrar, enviar y adjuntar archivos en una tarjeta de seguimiento.
 * @author Giancarlo Ortiz */
const SeguimientoManager = {
    config: {
        parentId: null, // ID del elemento al que se asociará el seguimiento (ej. un ID de caso de uso)
        parentField: "id_oga", // Nombre de la columna en la tabla SQL que almacena el parentId
        folderUrl: `${BASE_URL}docs/Seguimiento`, // Carpeta para adjuntos
        correoApiUrl: "http://gobinfoana01-2:8510/insert", // Endpoint para cola de correos
        sqlApiBase: "http://gobinfoana01-2:8510", // Base API para SQL
        sqlTable: "procesos_bi.dbo.t_COMENTARIOS_OGA", // Tabla SQL para comentarios
        origen: "AMC", // Origen lógico (AMC, CU, etc.)
        currentUser: null, // Nombre de usuario actual (ej. 'gortiz')
        empleados: {}, // Objeto de empleados { usuario: { ... }}
        objetoNombresEmpleados: {}, // Objeto para buscar por nombre completo
        parentName: null, // Nombre descriptivo del caso de uso para mensajes
        parentDomainId: null, // Dominio asociado para construir enlaces
    },
    elements: {},
    initialized: false,
    isRendered: false, // Flag para saber si el HTML ya está en el DOM
    replyTo: null,
    editingCommentId: null,
    editingSpItemId: null,
    editingParentId: null,
    editingAttachment: "",
    editingHiddenVersion: "",
    inlineEditContext: null,
    editorInstance: null,
    maxSugestions: 50,

    /**
     * Inicializa el componente de seguimiento.
     * @param {object} config - Configuración inicial.
     */
    async init(config = {}) {
        const resolvedConfig = await this.prepareConfig(config);
        if (!resolvedConfig) {
            console.error("SeguimientoManager: Faltan parámetros de configuración (parentId, currentUser o empleados).");
            return;
        }
        this.config = { ...this.config, ...resolvedConfig };
        this.config.objetoNombresEmpleados = listToObject({ lista: Object.values(this.config.empleados), parametroClave: "nombreCompleto" });

        if (this.initialized) {
            this.updateUI();
            return;
        }

        // Si el HTML no ha sido renderizado por el manager, lo hace.
        // Si el HTML ya existe en la página, se salta este paso.
        if (!this.isRendered) {
            this.renderHTML();
        }
        this.cacheDom();
        this.bindEvents();
        this.updateUI();
        this.initialized = true;
        this.initCKEditor()
    },

    getCKEditorMentionsFeed() {
        return Object.values(this.config.empleados).map(user => {
            const plain = user.nombreCompleto || user.usuario || "";
            const usuario = user.usuario || user.codigo || plain;
            return {
                id: `@${usuario}`,
                userId: usuario,
                name: plain
            };
        });
    },

    async initCKEditor() {
        // 1. Mapeamos tus empleados al formato del Feed de CKEditor
        const usersFeed = Object.values(this.config.empleados).map(user => {
            const plain = user.nombreCompleto || user.usuario || "";
            const usuario = user.usuario || user.codigo || plain;
            return {
                id: `@${usuario}`, // Lo que se inserta como ID interno
                userId: usuario,
                name: plain        // El nombre visible en la lista
            };
        });

        try {
            this.editorInstance = await CKEDITOR.ClassicEditor.create(document.querySelector('#seguimiento-input'), {
                toolbar: {
                    items: ['bold', 'italic', 'strikethrough', 'underline', '|', 'blockQuote', 'link', '|', 'bulletedList', 'numberedList', '|', 'undo', 'redo']
                },
                language: 'es',
                placeholder: 'Escribe tu comentario aquí...',
                removePlugins: [
                    // 1. Inteligencia Artificial (El error que te acaba de salir)
                    'AIAssistant',
                    'OpenAITextAdapter',

                    // 2. Colaboración en Tiempo Real (Estilo Google Docs)
                    'RealTimeCollaborativeComments',
                    'RealTimeCollaborativeTrackChanges',
                    'RealTimeCollaborativeRevisionHistory',
                    'PresenceList',
                    'Comments',
                    'TrackChanges',
                    'TrackChangesData',
                    'RevisionHistory',

                    // 3. Productivity Pack (Funciones premium de ofimática)
                    'DocumentOutline',
                    'FormatPainter',
                    'PasteFromOfficeEnhanced',
                    'CaseChange',
                    'SlashCommand',
                    'Template',
                    'TableOfContents',

                    // 4. Exportación e Importación Premium
                    'ExportPdf',
                    'ExportWord',
                    'ImportWord',
                    'ImportPdf',

                    //  5. Servicios en la Nube de Pago (Manejo de imágenes premium)
                    'CKBox',
                    'CKFinder',
                    'EasyImage',

                    // 6. Otros componentes comerciales (Matemáticas, Ortografía, Paginación)
                    'Pagination',
                    'WProofreader',
                    'MathType',
                    'ChemType'
                ],
                mention: {
                    feeds: [
                        {
                            marker: '@',
                            feed: (query) => {
                                const filterQuery = query.toLowerCase();

                                // 1. Filtramos las coincidencias
                                const resultados = usersFeed.filter(user =>
                                    user.name.toLowerCase().includes(filterQuery) ||
                                    user.userId.toLowerCase().includes(filterQuery)
                                );

                                // 2. Retornamos solo los primeros 10
                                return resultados.slice(0, this.maxSugestions);
                            },
                            itemRenderer: (item) => {
                                const itemElement = document.createElement('span');
                                itemElement.classList.add('custom-item');
                                itemElement.textContent = `${item.name} (${item.userId})`;
                                return itemElement;
                            },
                            dropdownLimit: this.maxSugestions,
                        }
                    ]
                },
                link: {
                    addTargetToExternalLinks: true,
                    decorators: {
                        openInNewTab: {
                            mode: 'manual',
                            label: 'Abrir en una nueva pestaña',
                            attributes: {
                                target: '_blank',
                                rel: 'noopener noreferrer'
                            }
                        }
                    }
                }
            });
            console.log("CKEditor inicializado con menciones");
        } catch (error) {
            console.error("Error al inicializar CKEditor:", error);
        }
    },

    renderHTML() {
        if ($('.seguimiento-card').length > 0) {
            this.isRendered = true;
            return;
        }
        const html = `
            <div class="seguimiento-card default-transition" style="opacity: 1;">
                <div class="card h-100 ">
                    <div class="card-body ">
                        <div class="d-flex flex-column justify-content-center align-items-center">
                            <div class="seguimiento-card-content">
                                <div class="flex-grow-1 px-2" id="seguimiento-comentarios" style="overflow: auto; max-height:300px;"></div>
                                
                                <div class="seguimiento-input-wrapper d-flex flex-column w-100" style="position:relative; margin-top: 10px;">
                                    <div id="seguimiento-input"></div>
                                    
                                    <div class="d-flex justify-content-end mt-2">
                                        <button class="btn btn-primary btn-sm d-flex align-items-center" id="btn-enviar-observacion">
                                            <i class="simple-icon-paper-plane mr-1"></i> Enviar
                                        </button>
                                    </div>
                                </div>
                                
                                <div class="d-flex justify-content-between mt-2">
                                    <div class="d-flex align-items-center">
                                        <span class="" style="color: #6c757d;" id="seguimiento-conteo">0 Entradas</span>
                                        <div type="file" id="btn-adjuntar-documento" class="d-flex align-items-center justify-content-center" style="cursor: pointer;">
                                            <i class="simple-icon-paper-clip ml-2 text-primary" style="cursor: pointer;"></i>
                                            <span id="name-adjuntar-documento"></span>
                                            <input id="input-adjuntar-documento" style="display: none;" type="file" accept=".xlsx,.xls,.pptx,.ppt,.txt,.csv,.pdf,.docx"/>
                                        </div>
                                    </div>
                                    <div class="d-flex align-items-center" style="gap: .25rem;">
                                        <i class="iconsminds-close" style="visibility: hidden; cursor:pointer;" id="seguimiento-cancelar-respuesta"></i>
                                        <span id="seguimiento-comentario-respuesta" style="font-size: 10px;"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <a href="#" class="seguimiento-card-button text-primary" data-toggle="tooltip" data-placement="top" title="Seguimiento"> <i class="iconsminds-speach-bubble-dialog"></i> </a>
            </div>`;
        document.body.insertAdjacentHTML('beforeend', html);
        this.isRendered = true;
    },

    /**
     * Guarda referencias a los elementos del DOM.
     */
    cacheDom() {
        this.elements = {
            card: $('.seguimiento-card'),
            button: $('.seguimiento-card-button'),
            commentsContainer: $('#seguimiento-comentarios'),
            input: $('#seguimiento-input'),
            suggestions: $('#suggestions'),
            sendBtn: $('#btn-enviar-observacion'),
            correoBtn: $('#btn-previsualizar-correo'),
            attachBtn: $('#btn-adjuntar-documento'),
            fileInput: $('#input-adjuntar-documento'),
            fileNameSpan: $('#name-adjuntar-documento'),
            countSpan: $('#seguimiento-conteo'),
            cancelReplyBtn: $('#seguimiento-cancelar-respuesta'),
            replyInfoSpan: $('#seguimiento-comentario-respuesta'),
        };
        this.clearMentionsAttr();
    },

    /**
     * Asigna los manejadores de eventos.
     */
    bindEvents() {
        this.elements.button.on("click", (e) => {
            e.preventDefault();
            this.elements.card.toggleClass("shown");
            this.elements.button.toggleClass("text-primary");
            if (typeof this.elements.button.tooltip === 'function') {
                this.elements.button.tooltip('hide');
            }
        });

        // Usar delegación de eventos para asegurar que el clic funcione incluso si el DOM cambia.
        $(document).on("click", "#btn-adjuntar-documento", (e) => {
            // Si el clic se originó en el input, no hacemos nada para evitar un ciclo.
            if ($(e.target).is('#input-adjuntar-documento')) {
                return;
            }
            $('#input-adjuntar-documento').trigger('click');
        });

        $(document).on("change", "#input-adjuntar-documento", () => {
            const files = $('#input-adjuntar-documento')[0].files;
            $('#name-adjuntar-documento').text($.map(files, file => file.name).join(", "));
        });

        this.elements.sendBtn.on("click", () => this.enviarObservacion());

        this.elements.cancelReplyBtn.on("click", () => this.cancelarRespuesta());

        this.setupMentions();

        // Escuchador para botones de formato (Textarea Principal)
        $(document).on("click", ".format-btn-main", (e) => {
            e.preventDefault();
            const format = $(e.currentTarget).data("format");
            this.applyTextFormat(this.elements.input[0], format);
        });

        // Escuchador para botones de formato (Textarea Edición Inline)
        $(document).on("click", ".format-btn-inline", (e) => {
            e.preventDefault();
            const format = $(e.currentTarget).data("format");
            const textarea = $(e.currentTarget).closest('.comentario-message').find('textarea')[0];
            this.applyTextFormat(textarea, format);
        });

        this.elements.correoBtn.on("click", (e) => {
            e.preventDefault();
            this.abrirModalCorreo();
        });
    },

    /**
     * Actualiza la UI con los comentarios actuales.
     */
    updateUI() {
        if (this.config.parentId) {
            const comentarios = this.getComentarios({ parentId: this.config.parentId });
            this.setComentarios(comentarios);
        } else {
            this.setComentarios([]);
        }
    },

    /**
     * Configura la lógica para autocompletar menciones de usuarios.
     */
    setupMentions() {
        const users = Object.values(this.config.empleados).map(user => {
            const plain = user.nombreCompleto || user.usuario || "";
            const usuario = user.usuario || user.codigo || plain;
            return {
                label: `@${plain}`,
                plain,
                usuario,
                keywords: [
                    `@${user.usuario || ""}`,
                    `@${user.codigo || ""}`,
                    `@${(user.nombreCompleto || "").toLowerCase()}`
                ]
            };
        });

        this.elements.input.on("input", () => {
            const value = this.elements.input.val() || "";
            const caretPosition = this.elements.input[0]?.selectionStart || value.length;
            const mentions = this.extractMentionsWithIndices(value);
            const currentMention = mentions.find(m => caretPosition > m.indices[0] && caretPosition <= m.indices[1]);

            if (currentMention) {
                const query = currentMention.screenName.toLowerCase();
                const filteredUsers = users.filter(user =>
                    user.keywords.some(k => (k || "").toLowerCase().includes(query))
                ).slice(0, this.maxSugestions);
                if (filteredUsers.length > 0) {
                    this.elements.suggestions
                        .html(filteredUsers.map(user => `<li data-usuario="${user.usuario}" data-display="${user.plain}">${user.plain}</li>`).join(""))
                        .show();
                    this.elements.button.css("pointer-events", "none");
                } else {
                    this.elements.suggestions.hide();
                    this.elements.button.css("pointer-events", "");
                }
            } else {
                this.elements.suggestions.hide();
                this.elements.button.css("pointer-events", "");
            }
            this.syncMentionsAttr();
        });

        this.elements.suggestions
            .on("click", "li", (e) => {
                const $target = $(e.target);
                const mentionId = $target.data('usuario') || $target.data('display');
                const displayText = $target.data('display') || '';
                const value = this.elements.input.val() || "";
                const mentions = this.extractMentionsWithIndices(value);
                const caretPosition = this.elements.input[0]?.selectionStart || value.length;
                const currentMention = mentions.find(m => caretPosition > m.indices[0] && caretPosition <= m.indices[1]);

                if (currentMention && displayText) {
                    const before = value.slice(0, currentMention.indices[0]);
                    const after = value.slice(currentMention.indices[1]);
                    const needsSpace = after.length && !after.startsWith(" ");
                    const newValue = `${before}${displayText}${needsSpace ? " " : ""}${after}`;
                    this.elements.input.val(newValue);
                    this.elements.suggestions.hide();
                    this.elements.button.css("pointer-events", "");
                    this.addMentionAttr(mentionId);
                }
                this.syncMentionsAttr();
            })
            .on("mousedown", (e) => {
                // Evita que el blur del textarea se dispare al hacer click o scroll sobre la lista.
                e.preventDefault();
            });

        this.elements.input.on("blur", () => setTimeout(() => {
            this.elements.suggestions.hide();
            this.elements.button.css("pointer-events", "");
        }, 200));
    },

    /**
     * Devuelve las menciones almacenadas en el textarea.
     * @returns {string[]}
     */
    getMentionsAttrList() {
        if (!this.elements.input || typeof this.elements.input.attr !== 'function') return [];
        const rawValue = this.elements.input.attr('data-mentions') || "";
        return rawValue ? rawValue.split("&").filter(Boolean) : [];
    },

    /**
     * Guarda el listado de menciones en el textarea.
     * @param {string[]} mentions
     */
    setMentionsAttrList(mentions = []) {
        if (!this.elements.input || typeof this.elements.input.attr !== 'function') return;
        this.elements.input.attr('data-mentions', mentions.join("&"));
    },

    /**
     * Elimina menciones que ya no están presentes en el texto.
     */
    syncMentionsAttr() {
        if (!this.elements.input) return;
        const text = (this.elements.input.val() || "").toLowerCase();
        const mentions = this.getMentionsAttrList().filter(mention => {
            const display = (this.getEmployeeDisplay(mention) || "").toLowerCase();
            return display && text.includes(display);
        });
        this.setMentionsAttrList(mentions);
    },

    /**
     * Agrega una nueva mención al atributo del textarea.
     * @param {string} mention
     */
    addMentionAttr(mentionId) {
        if (!mentionId) return;
        const mentions = this.getMentionsAttrList();
        if (!mentions.includes(mentionId)) {
            mentions.push(mentionId);
            this.setMentionsAttrList(mentions);
        }
    },

    /**
     * Limpia todas las menciones almacenadas.
     */
    clearMentionsAttr() {
        this.setMentionsAttrList([]);
    },

    /**
     * Obtiene los usuarios (códigos) a partir de las menciones almacenadas.
     * @returns {string[]}
     */
    getMentionUsernames() {
        return this.getMentionsAttrList()
            .map(mention => this.getEmployeeUsername(mention))
            .filter(Boolean);
    },

    getEmployeeRecord(id) {
        return this.config.empleados[id]
            || this.config.objetoNombresEmpleados[id]
            || {};
    },

    getEmployeeDisplay(id) {
        const emp = this.getEmployeeRecord(id);
        return emp.nombreCompleto || emp.NOMBRE_COMPLETO || emp.usuario || emp.USUARIO || "";
    },

    getEmployeeUsername(id) {
        const emp = this.getEmployeeRecord(id);
        return emp.usuario || emp.USUARIO || emp.codigo || emp.CODIGO_EMPLEADO || id;
    },


    async prepareConfig(config) {
        const parentId = config.parentId || this.config.parentId;
        const currentUser = config.currentUser || this.config.currentUser;
        if (!parentId || !currentUser) {
            return null;
        }
        const empleados = await this.resolveEmployees(config.empleados);
        if (!empleados || !Object.keys(empleados).length) {
            return null;
        }
        return {
            ...config,
            parentId,
            currentUser,
            empleados,
            parentName: config.parentName ?? this.config.parentName ?? null,
            parentDomainId: config.parentDomainId ?? this.config.parentDomainId ?? null,
        };
    },

    async resolveEmployees(externalEmpleados) {
        let empleados = this.normalizeEmployeesCollection(externalEmpleados);
        if (Object.keys(empleados).length) {
            return empleados;
        }

        if (typeof window !== 'undefined' && Array.isArray(window.empleados) && window.empleados.length) {
            empleados = this.normalizeEmployeesCollection(window.empleados);
            if (Object.keys(empleados).length) {
                return empleados;
            }
        }

        if (typeof getEmpleados === 'function') {
            try {
                const lista = getEmpleados();
                empleados = this.normalizeEmployeesCollection(lista);
                if (Object.keys(empleados).length) {
                    if (typeof window !== 'undefined') {
                        window.empleados = lista;
                    }
                    return empleados;
                }
            } catch (error) {
                console.warn("SeguimientoManager: error al ejecutar getEmpleados()", error);
            }
        }

        if (typeof window !== 'undefined' && window.EmpleadoUtils) {
            const utils = window.EmpleadoUtils;
            if (Array.isArray(utils.empleadosCache) && utils.empleadosCache.length) {
                empleados = this.normalizeEmployeesCollection(utils.empleadosCache);
                if (Object.keys(empleados).length) {
                    return empleados;
                }
            }
            if (typeof utils.loadEmpleadosOnce === 'function') {
                try {
                    const lista = await utils.loadEmpleadosOnce();
                    empleados = this.normalizeEmployeesCollection(lista);
                    if (Object.keys(empleados).length) {
                        if (typeof window !== 'undefined') {
                            window.empleados = lista;
                        }
                        return empleados;
                    }
                } catch (error) {
                    console.warn("SeguimientoManager: no se pudo cargar empleados con EmpleadoUtils.loadEmpleadosOnce()", error);
                }
            }
        }

        return {};
    },

    normalizeEmployeesCollection(collection) {
        if (!collection) return {};
        const map = {};
        if (Array.isArray(collection)) {
            collection.forEach((emp) => {
                if (!emp) return;
                const normalized = { ...emp };
                normalized.nombreCompleto = normalized.nombreCompleto || normalized.NOMBRE_COMPLETO || `${normalized.NOMBRES || ""} ${normalized.APELLIDOS || ""}`.trim();
                normalized.usuario = normalized.usuario || normalized.USUARIO || normalized.codigo_usuario || "";
                normalized.codigo = normalized.codigo || normalized.CODIGO_EMPLEADO || normalized.codEmpleado || "";
                const key = (normalized.usuario || normalized.codigo || "").toString().trim();
                if (!key) return;
                map[key] = normalized;
            });
            return map;
        }
        if (typeof collection === 'object') {
            return { ...collection };
        }
        return {};
    },

    hasTwitterMentionsLib() {
        return typeof twttr !== 'undefined' && twttr.txt && typeof twttr.txt.extractMentionsWithIndices === 'function';
    },

    extractMentionsWithIndices(text) {
        const sourceText = text || "";
        if (this.hasTwitterMentionsLib()) {
            return twttr.txt.extractMentionsWithIndices(sourceText);
        }
        const mentions = [];
        const length = sourceText.length;
        const isSeparator = (char) => /\s/.test(char);
        for (let i = 0; i < length; i++) {
            if (sourceText[i] === '@') {
                let end = i + 1;
                while (end < length && !isSeparator(sourceText[end])) {
                    end++;
                }
                if (end > i + 1) {
                    mentions.push({
                        screenName: sourceText.slice(i + 1, end),
                        indices: [i, end]
                    });
                }
                i = end - 1;
            }
        }
        return mentions;
    },

    extractMentions(text) {
        const sourceText = text || "";
        if (this.hasTwitterMentionsLib()) {
            return twttr.txt.extractMentions(sourceText);
        }
        return this.extractMentionsWithIndices(sourceText).map(m => m.screenName);
    },

    normalizeUser(user = "") {
        const safe = (user || "").toString().trim().toLowerCase();
        if (!safe) return "";
        const withoutDomain = safe.includes("\\") ? safe.split("\\").pop() : safe;
        const withoutEmail = withoutDomain.includes("@") ? withoutDomain.split("@")[0] : withoutDomain;
        return withoutEmail;
    },

    escapeSqlValue(value = "") {
        return String(value).replace(/'/g, "''");
    },

    upperKeysLocal(obj = {}) {
        const out = {};
        Object.keys(obj || {}).forEach(key => {
            out[String(key).toUpperCase()] = obj[key];
        });
        return out;
    },

    getParentFieldSql() {
        return (this.config.parentField || "").toString() === "id_amc" ? "id_oga" : this.config.parentField;
    },

    resolveOrigen(parentId) {
        if (this.config.origen) return this.config.origen;
        const raw = (parentId || "").toString().trim();
        if (!raw) return null;
        return /^\d+$/.test(raw) ? "CDU" : "AMC";
    },

    /**
     * Envía una nueva observación o comentario.
     */
    enviarObservacion() {
        console.log("--- DEBUG: Iniciando enviarObservacion ---");

        const parentId = this.config.parentId;

        // 1. Obtenemos el HTML enriquecido directamente de CKEditor
        let htmlContent = this.editorInstance ? this.editorInstance.getData() : "";

        // 2. Validamos que no esté vacío (CKEditor suele devolver "<p>&nbsp;</p>" si está vacío)
        const plainTextCheck = document.createElement('div');
        plainTextCheck.innerHTML = htmlContent;
        if (!plainTextCheck.textContent.trim() && !htmlContent.includes('<img') && !htmlContent.includes('<span class="mention"')) {
            showNotification("top", "center", "info", "Debe escribir un comentario.", 2000);
            return;
        }

        // 3. Extraer las menciones leyendo los atributos 'data-mention' que genera CKEditor
        const mentionUsernames = [];
        const mentionNodes = plainTextCheck.querySelectorAll('.mention');
        mentionNodes.forEach(node => {
            const rawMention = node.getAttribute('data-mention'); // Devuelve "@gortiz"
            if (rawMention) {
                // Le quitamos el '@' para quedarnos solo con el código/usuario
                mentionUsernames.push(rawMention.substring(1));
            }
        });

        console.log(`DEBUG: Parent ID: ${parentId}, Menciones encontradas:`, mentionUsernames);

        // Si estamos editando un comentario desde el input principal (fallback de tu código original)
        if (this.editingCommentId) {
            this.actualizarObservacion({
                parentId,
                text: htmlContent, // Enviamos el HTML validado
                idComentario: this.editingCommentId,
                spItemId: this.editingSpItemId,
                idPadre: this.editingParentId || "0",
                keepAttachment: this.editingAttachment || "",
                fechaComentario: this.editingFecha || "",
                autorComentarioNombres: this.editingAutor || ""
            });
            return;
        }

        // Generamos IDs y Fechas para un comentario nuevo
        const idComentario = this.getNextId();
        const localISOTime = new Date();
        const idPadre = this.replyTo || "0";
        console.log(`DEBUG: Nuevo ID Comentario: ${idComentario}, ID Padre: ${idPadre}`);

        // Subida de archivos adjuntos (se mantiene intacto)
        const file = this.elements.fileInput[0].files[0];
        let fileUrl = "";

        if (file) {
            console.log("DEBUG: Archivo detectado:", file.name);
            const fileResult = uploadFileToSharePoint(file, this.config.folderUrl, parentId);
            if (fileResult === false) {
                console.error("DEBUG: Error al subir el archivo a SharePoint. Abortando.");
                return;
            }
            const fileExtension = file.name.split('.').pop().toLowerCase();
            const nombreDocumento = file.name.split(".")[0].split(" ").join("_");
            fileUrl = `${parentId}_${nombreDocumento}.${fileExtension}`;
            console.log("DEBUG: URL del archivo generado:", fileUrl);
        }

        const origen = this.resolveOrigen(parentId);
        if (!origen) {
            showNotification("top", "center", "danger", "No se pudo determinar el origen del comentario.", 2500);
            return;
        }

        const parentField = this.getParentFieldSql();
        const payload = {
            id_comentario: idComentario,
            [parentField]: parentId,
            id_respuesta: idPadre,
            origen,
            comentario: htmlContent, // Guardamos el HTML puro en la BD
            fecha_comentario: localISOTime.toISOString(),
            autor_comentario_nombres: this.config.empleados[this.config.currentUser]?.nombreCompleto || this.config.currentUser,
            autor_comentario_usuario: this.config.currentUser,
            documento_adjunto: fileUrl,
            sn_activo: 1
        };

        console.log("DEBUG: Preparando para enviar a SQL con los siguientes datos:", payload);

        // Llamada AJAX para insertar en base de datos
        $.ajax({
            url: `${this.config.sqlApiBase}/insert`,
            method: "POST",
            async: false,
            contentType: "application/json",
            data: JSON.stringify({
                tabla: this.config.sqlTable,
                datos: this.upperKeysLocal(payload)
            }),
            success: () => {
                // --- Notificaciones por correo a los mencionados ---
                if (mentionUsernames.length > 0) {
                    console.log("DEBUG: Enviando notificaciones por mención a:", mentionUsernames);
                    const seguimientoLink = this.buildSeguimientoLink(parentId);
                    this.enviarCorreosPorMencion({
                        destinatarios: mentionUsernames,
                        comentario: htmlContent, // El correo también se enviará con el formato HTML (Negritas, cursivas, etc)
                        enlace: seguimientoLink,
                        fileUrl: fileUrl ? `${this.config.folderUrl}/${fileUrl}` : ""
                    });
                }

                console.log("DEBUG: Actualizando UI y limpiando campos.");
                this.updateUI();

                if (this.editorInstance) {
                    this.editorInstance.setData(''); // Vaciamos CKEditor
                }
                this.elements.fileInput.val("");
                $('#name-adjuntar-documento').text(""); // Limpiamos el texto del adjunto

                this.cancelarRespuesta();
                console.log("--- DEBUG: Fin de enviarObservacion ---");
            },
            error: (xhr, status, errorThrown) => {
                console.error("DEBUG: Error al insertar comentario (SQL):", status, errorThrown, xhr && xhr.responseText);
                showNotification("top", "center", "danger", "No se pudo guardar el comentario.", 2500);
            }
        });
    },

    /**
     * Actualiza un comentario existente.
     */
    actualizarObservacion({ parentId, text, idComentario, spItemId, idPadre = "0", keepAttachment = "", allowFileUpload = true, fechaComentario = "", autorComentarioNombres = "" }) {
        console.log("DEBUG: actualizarObservacion -> entrada", {
            parentId,
            text,
            idComentario,
            idPadre,
            keepAttachment,
            allowFileUpload,
            fechaComentario,
            autorComentarioNombres
        });
        const comentarioIdValue = (idComentario || "").toString().trim();
        const idPadreValue = (idPadre || "0").toString();
        if (!comentarioIdValue) {
            console.error("SeguimientoManager: idComentario no valido para actualizar", { idComentario });
            if (typeof showNotification === "function") {
                showNotification("top", "center", "danger", "No se pudo identificar el comentario a actualizar.", 2500);
            }
            return;
        }
        const localISOTime = new Date();
        const file = allowFileUpload ? this.elements.fileInput?.[0]?.files?.[0] : null;
        let fileUrl = keepAttachment || this.editingAttachment || "";

        if (file) {
            console.log("DEBUG: Archivo detectado para actualizaci?n:", file.name);
            const fileResult = uploadFileToSharePoint(file, this.config.folderUrl, parentId);
            if (fileResult === false) {
                console.error("DEBUG: Error al subir el archivo a SharePoint en modo edici?n. Abortando.");
                return;
            }
            const fileExtension = file.name.split('.').pop().toLowerCase();
            const nombreDocumento = file.name.split(".")[0].split(" ").join("_");
            fileUrl = `${parentId}_${nombreDocumento}.${fileExtension}`;
            console.log("DEBUG: URL del archivo generado (edici?n):", fileUrl);
        }

        const decodedUpdateText = this.decodeHtmlEntities(text);
        const origen = this.resolveOrigen(parentId);
        if (!origen) {
            if (typeof showNotification === "function") {
                showNotification("top", "center", "danger", "No se pudo determinar el origen del comentario (AMC/CDU).", 2500);
            }
            return;
        }
        const parentField = this.getParentFieldSql();
        const condicion = `id_comentario='${this.escapeSqlValue(comentarioIdValue)}' AND ${parentField}='${this.escapeSqlValue(parentId)}'`;
        const payload = {
            comentario: decodedUpdateText,
            fecha_comentario: localISOTime.toISOString(),
            autor_comentario_nombres: this.config.empleados[this.config.currentUser]?.nombreCompleto || this.config.currentUser,
            autor_comentario_usuario: this.config.currentUser,
            documento_adjunto: fileUrl,
            id_respuesta: idPadreValue,
            origen
        };

        $.ajax({
            url: `${this.config.sqlApiBase}/update`,
            method: "PUT",
            async: false,
            contentType: "application/json",
            data: JSON.stringify({
                tabla: this.config.sqlTable,
                datos: this.upperKeysLocal(payload),
                condicion
            }),
            success: () => {
                this.resetInlineEditContext();
                this.updateUI();
                this.elements.input.val("");
                this.elements.fileInput.val("");
                this.clearMentionsAttr();
                this.elements.suggestions.hide();
                this.cancelarRespuesta();
                this.editingCommentId = null;
                this.editingSpItemId = null;
                this.editingParentId = null;
            },
            error: (xhr, status, errorThrown) => {
                console.error("SeguimientoManager: fallo al actualizar comentario (SQL)", { status, errorThrown, response: xhr && xhr.responseText });
                if (typeof showNotification === "function") {
                    showNotification("top", "center", "danger", "No se pudo actualizar el comentario.", 3000);
                }
            }
        });

        // let spIdNumber = parseInt(spItemId, 10);
        // const comentarioIdNumber = parseInt(idComentario, 10);
        // const idPadreNumber = parseInt(idPadre, 10) || 0;
        // if (Number.isNaN(comentarioIdNumber)) {
        //     console.error("SeguimientoManager: idComentario no valido para actualizar", { idComentario });
        //     if (typeof showNotification === "function") {
        //         showNotification("top", "center", "danger", "No se pudo identificar el comentario a actualizar.", 2500);
        //     }
        //     return;
        // }
        //
        // if (Number.isNaN(spIdNumber)) {
        // const rowsFound = [];
        // const parentValue = `${parentId}`;
        // const idPadreValue = `${idPadre}`;
        //
        // const queries = [
        //     {
        //         label: "num_solo_parent",
        //         caml: `<Query><Where><And>
        //                     <Eq><FieldRef Name='id_comentario'/><Value Type='Number'>${idComentario}</Value></Eq>
        //                     <Eq><FieldRef Name='${this.config.parentField}'/><Value Type='Number'>${parentValue}</Value></Eq>
        //                 </And></Where></Query>`
        //     },
        //     {
        //         label: "num_con_padre",
        //         caml: `<Query><Where><And><And>
        //                     <Eq><FieldRef Name='id_comentario'/><Value Type='Number'>${idComentario}</Value></Eq>
        //                     <Eq><FieldRef Name='${this.config.parentField}'/><Value Type='Number'>${parentValue}</Value></Eq>
        //                 </And>
        //                     <Eq><FieldRef Name='id_padre'/><Value Type='Number'>${idPadreValue}</Value></Eq>
        //                 </And></Where></Query>`
        //     },
        //     {
        //         label: "text_solo_parent",
        //         caml: `<Query><Where><And>
        //                     <Eq><FieldRef Name='id_comentario'/><Value Type='Text'>${idComentario}</Value></Eq>
        //                     <Eq><FieldRef Name='${this.config.parentField}'/><Value Type='Text'>${parentValue}</Value></Eq>
        //                 </And></Where></Query>`
        //     },
        //     {
        //         label: "text_con_padre",
        //         caml: `<Query><Where><And><And>
        //                     <Eq><FieldRef Name='id_comentario'/><Value Type='Text'>${idComentario}</Value></Eq>
        //                     <Eq><FieldRef Name='${this.config.parentField}'/><Value Type='Text'>${parentValue}</Value></Eq>
        //                 </And>
        //                     <Eq><FieldRef Name='id_padre'/><Value Type='Text'>${idPadreValue}</Value></Eq>
        //                 </And></Where></Query>`
        //     }
        // ];
        //
        // let foundId = NaN;
        // let source = "no_encontrado";
        //
        // for (const q of queries) {
        //     if (!Number.isNaN(foundId)) break;
        //     console.log("SeguimientoManager: buscar comentario", { idComentario, parentId, idPadre, camlLabel: q.label, caml: q.caml });
        //         operation: "GetListItems",
        //         async: false,
        //         CAMLQuery: q.caml,
        //         CAMLViewFields: "<ViewFields><FieldRef Name='ID' /><FieldRef Name='id_comentario' /><FieldRef Name='id_amc' /><FieldRef Name='id_padre' /></ViewFields>",
        //         CAMLRowLimit: 5,
        //         completefunc: (xData) => {
        //             const manager = this;
        //             $(xData.responseXML).find("z\:row").each(function () {
        //                 const spId = parseInt($(this).attr("ows_ID"), 10);
        //                 const row = {
        //                     source: q.label,
        //                     spId,
        //                     idComentario: $(this).attr("ows_id_comentario"),
        //                     idAmc: $(this).attr("ows_id_amc"),
        //                     idPadre: $(this).attr("ows_id_padre")
        //                 };
        //                 rowsFound.push(row);
        //                 if (Number.isNaN(foundId)) {
        //                     foundId = spId;
        //                     source = q.label;
        //                 }
        //             });
        //         }
        //     });
        // }
        // console.log("SeguimientoManager: resultado busqueda comentario", { idComentario, parentId, idPadre, foundId, source, rowsFound });
        // return foundId;
        return NaN;
    },

    /**
     * Limpia la información de "respondiendo a".
     */
    cancelarRespuesta() {
        this.replyTo = null;
        this.elements.replyInfoSpan.text("").attr("comentario", "");
        this.elements.cancelReplyBtn.css("visibility", "hidden");
        this.editingCommentId = null;
        this.editingSpItemId = null;
        this.editingParentId = null;
        this.editingAttachment = "";
        this.editingFecha = "";
        this.editingAutor = "";
        this.editingHiddenVersion = "";
        this.resetInlineEditContext();
    },

    resetInlineEditContext() {
        const ctx = this.inlineEditContext;
        if (!ctx) return;

        if (ctx.editorInstance) {
            ctx.editorInstance.destroy().catch(err => console.error("Error destruyendo CKEditor inline:", err));
        }

        if (ctx.editContainer) {
            ctx.editContainer.hide().empty();
        }

        ctx.textSpan?.show();
        ctx.editButton?.show();
        ctx.saveButton?.hide();
        ctx.cancelButton?.hide();

        this.inlineEditContext = null;
    },

    /**
     * Renderiza la lista de comentarios en la UI.
     * @param {Array} comentarios - Array de objetos de comentario.
     */
    setComentarios(comentarios) {
        this.resetInlineEditContext();
        this.elements.countSpan.text(`${comentarios.length} ${comentarios.length === 1 ? "Entrada" : "Entradas"}`);
        this.elements.commentsContainer.empty();

        if (comentarios.length === 0) {
            this.elements.commentsContainer.html(`<div class="mb-2 text-center">No hay observaciones por el momento</div>`);
            return;
        }

        const sortedComments = [...comentarios].sort((a, b) => this.parseCommentDate(a.fechaComentario) - this.parseCommentDate(b.fechaComentario));
        const respuestas = [];

        sortedComments.forEach(item => {
            if (item.idPadre === "0") {
                const commentCard = this.createCommentCard(item);
                this.elements.commentsContainer.append(commentCard);
            } else {
                respuestas.push(item);
            }
        });

        respuestas.forEach(item => {
            const respuestaCard = this.createCommentCard(item, true);
            $(`#comment-card-${item.idPadre}`).after(respuestaCard);
        });

        this.scrollComentariosToBottom();
    },

    scrollComentariosToBottom() {
        const container = this.elements?.commentsContainer?.[0];
        if (!container) return;
        container.scrollTop = container.scrollHeight;
    },

    /**
     * Crea el HTML para una tarjeta de comentario.
     * @param {object} item - El objeto de comentario.
     * @param {boolean} isReply - Si es una respuesta a otro comentario.
     * @returns {jQuery} - El elemento jQuery de la tarjeta.
     */
    createCommentCard(item, isReply = false) {
        const fechaFormateada = getFormattedDate({ date: this.parseCommentDate(item.fechaComentario), hour: true });
        const comentario = item.comentario.trim() || 'Sin comentarios';
        const card = $('<div>', {
            id: isReply ? `reply-${item.idComentario}` : `comment-card-${item.idComentario}`,
            class: 'custom-card mb-2 d-flex p-2 flex-row',
            style: `gap:1rem; box-shadow:none !important; background-color:${isReply ? '#fae5f0' : '#e7effe'} !important; ${isReply ? 'margin-left:4rem !important;' : ''}`
        });

        const avatar = $('<div>', { class: 'avatar' }).html('<img src="img/Data Science_38.svg" alt="Author">');
        const wrapper = $('<div>', { class: 'd-flex w-100 comentario-text-wrapper' });
        const contentCol = $('<div>', { class: 'd-flex flex-column w-75' });
        const author = $('<span>', { class: 'font-weight-bold comentario-author' }).text(item.autorComentarioNombres);
        const fecha = $('<span>', { class: 'comentario-date' }).text(fechaFormateada);

        const messageContainer = $('<div>', { class: 'comentario-message w-100' });
        let htmlToRender = comentario;
        const commentText = $('<div>', { class: 'comentario-text ck-content w-100' }).html(htmlToRender);

        // --- 1. NUEVO CONTENEDOR PARA EL EDITOR INLINE ---
        // Reemplazamos el textarea y los botones de formato por un simple div
        const editContainer = $('<div>', {
            class: 'comentario-edit-container w-100',
            style: 'display:none; color: #333;' // Color base para evitar conflictos con temas oscuros
        });
        messageContainer.append(commentText, editContainer);

        contentCol.append(author, fecha, messageContainer);
        if (item.documentoAdjunto) {
            const adjunto = $('<a>', {
                class: 'text-primary comentario-adjunto',
                href: `${this.config.folderUrl}/${item.documentoAdjunto}`,
                target: '_blank'
            }).text('Documento Adjunto');
            contentCol.append(adjunto);
        }
        wrapper.append(contentCol);
        const actionsWrapper = $('<div>', { class: 'd-flex align-items-start ml-auto comentario-actions' });
        wrapper.append(actionsWrapper);
        card.append(avatar, wrapper);

        if (!isReply) {
            const replyButton = $('<button>', {
                class: 'd-flex btn-reply-comment comentario-action-btn',
                type: 'button',
                html: '<i class="iconsminds-left-1 text-primary" title="Responder"></i>'
            }).on('click', () => {
                this.resetInlineEditContext();
                this.replyTo = item.idComentario;
                this.editingCommentId = null;
                this.editingSpItemId = null;
                this.editingParentId = null;
                this.editingAttachment = "";
                this.elements.replyInfoSpan.text(`Respondiendo a ${item.autorComentarioNombres}`).attr("comentario", item.idComentario);
                this.elements.cancelReplyBtn.css("visibility", "visible");
            });
            actionsWrapper.append(replyButton);
        }

        const normalizedCurrentUser = this.normalizeUser(this.config.currentUser);
        const normalizedAuthor = this.normalizeUser(item.autorComentarioUsuario);
        const canEdit = normalizedCurrentUser && normalizedAuthor && normalizedCurrentUser === normalizedAuthor;

        if (canEdit) {
            // --- 2. LÓGICA DEL BOTÓN EDITAR ---
            const editButton = $('<button>', {
                class: 'd-flex btn-edit-comment comentario-action-btn',
                type: 'button',
                html: '<i class="simple-icon-pencil" title="Editar comentario"></i>'
            }).on('click', async (e) => { // Hacemos la función asyncrona
                e.preventDefault();
                e.stopPropagation();
                this.resetInlineEditContext();

                const originalText = (item.comentario || "").trim();
                commentText.hide();
                editContainer.show();
                editButton.hide();
                saveButton.show();

                const usersFeed = this.getCKEditorMentionsFeed();
                let inlineEditorInstance = null;

                // Inicializamos CKEditor en este div específico
                try {
                    inlineEditorInstance = await CKEDITOR.ClassicEditor.create(editContainer[0], {
                        toolbar: {
                            items: ['bold', 'italic', 'strikethrough', 'underline', '|', 'blockQuote', 'link', '|', 'bulletedList', 'numberedList', '|', 'undo', 'redo']
                        },
                        language: 'es',
                        placeholder: 'Escribe tu comentario aquí...',
                        removePlugins: [
                            // 🤖 1. Inteligencia Artificial (El error que te acaba de salir)
                            'AIAssistant',
                            'OpenAITextAdapter',

                            // 👥 2. Colaboración en Tiempo Real (Estilo Google Docs)
                            'RealTimeCollaborativeComments',
                            'RealTimeCollaborativeTrackChanges',
                            'RealTimeCollaborativeRevisionHistory',
                            'PresenceList',
                            'Comments',
                            'TrackChanges',
                            'TrackChangesData',
                            'RevisionHistory',

                            // 🛠️ 3. Productivity Pack (Funciones premium de ofimática)
                            'DocumentOutline',
                            'FormatPainter',
                            'PasteFromOfficeEnhanced',
                            'CaseChange',
                            'SlashCommand',
                            'Template',
                            'TableOfContents',

                            // 📄 4. Exportación e Importación Premium
                            'ExportPdf',
                            'ExportWord',
                            'ImportWord',
                            'ImportPdf',

                            // ☁️ 5. Servicios en la Nube de Pago (Manejo de imágenes premium)
                            'CKBox',
                            'CKFinder',
                            'EasyImage',

                            // 🔤 6. Otros componentes comerciales (Matemáticas, Ortografía, Paginación)
                            'Pagination',
                            'WProofreader',
                            'MathType',
                            'ChemType'
                        ],
                        mention: {
                            feeds: [
                                {
                                    marker: '@',
                                    feed: (query) => {
                                        const filterQuery = query.toLowerCase();

                                        // 1. Filtramos las coincidencias
                                        const resultados = usersFeed.filter(user =>
                                            user.name.toLowerCase().includes(filterQuery) ||
                                            user.userId.toLowerCase().includes(filterQuery)
                                        );

                                        // 2. Retornamos solo los primeros 10
                                        return resultados.slice(0, this.maxSugestions);
                                    },
                                    itemRenderer: (item) => {
                                        const itemElement = document.createElement('span');
                                        itemElement.classList.add('custom-item');
                                        itemElement.textContent = `${item.name} (${item.userId})`;
                                        return itemElement;
                                    },
                                    dropdownLimit: this.maxSugestions
                                }
                            ]
                        },
                        link: {
                            addTargetToExternalLinks: true,
                            decorators: {
                                openInNewTab: {
                                    mode: 'manual',
                                    label: 'Abrir en una nueva pestaña',
                                    attributes: {
                                        target: '_blank',
                                        rel: 'noopener noreferrer'
                                    }
                                }
                            }
                        }
                    });

                    // Cargamos el HTML existente en el editor
                    inlineEditorInstance.setData(originalText);

                    // Enfocamos el editor para que el usuario empiece a escribir de inmediato
                    inlineEditorInstance.focus();
                } catch (error) {
                    console.error("Error al inicializar CKEditor inline:", error);
                }

                // Guardamos la instancia en el contexto para poder leerla al guardar
                this.inlineEditContext = {
                    id: item.idComentario,
                    spItemId: item.spItemId || "",
                    parentId: item.idPadre || "0",
                    attachment: item.documentoAdjunto || "",
                    fechaComentario: item.fechaComentario || "",
                    autorComentarioNombres: item.autorComentarioNombres || "",
                    editorInstance: inlineEditorInstance, // <-- Guardamos la instancia aquí
                    editContainer: editContainer,
                    textSpan: commentText,
                    editButton,
                    saveButton,
                    originalText
                };
            });

            // --- 3. LÓGICA DEL BOTÓN GUARDAR ---
            const saveButton = $('<button>', {
                class: 'd-flex btn-save-comment comentario-action-btn',
                type: 'button',
                style: 'display:none;',
                html: '<i class="simple-icon-check text-success" title="Guardar comentario"></i>'
            }).on('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                if (!this.inlineEditContext || !this.inlineEditContext.editorInstance) return;

                // Obtenemos el HTML enriquecido directamente del editor inline
                const nuevoHTML = this.inlineEditContext.editorInstance.getData();

                // Validamos que no esté vacío
                const plainTextCheck = document.createElement('div');
                plainTextCheck.innerHTML = nuevoHTML;
                if (!plainTextCheck.textContent.trim() && !nuevoHTML.includes('<img') && !nuevoHTML.includes('<span class="mention"')) {
                    return showNotification("top", "center", "info", "Debe escribir un comentario.", 2000);
                }

                this.actualizarObservacion({
                    parentId: this.config.parentId || item.idAmc || "",
                    text: nuevoHTML, // Enviamos el HTML validado
                    idComentario: item.idComentario,
                    spItemId: item.spItemId || "",
                    idPadre: item.idPadre || "0",
                    keepAttachment: item.documentoAdjunto || "",
                    allowFileUpload: false,
                    fechaComentario: item.fechaComentario || "",
                    autorComentarioNombres: item.autorComentarioNombres || ""
                });
            });
            const deleteButton = $('<button>', {
                class: 'd-flex btn-delete-comment comentario-action-btn',
                type: 'button',
                html: '<i class="simple-icon-trash" title="Eliminar comentario"></i>'
            }).on('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const ok = confirm("Se eliminara este comentario. Desea continuar?");
                if (!ok) return;
                const parentField = this.getParentFieldSql();
                const parentId = this.config.parentId || item.idAmc || "";
                const condicion = `id_comentario='${this.escapeSqlValue(item.idComentario)}' AND ${parentField}='${this.escapeSqlValue(parentId)}'`;
                $.ajax({
                    url: `${this.config.sqlApiBase}/update`,
                    method: "PUT",
                    contentType: "application/json",
                    data: JSON.stringify({
                        tabla: this.config.sqlTable,
                        datos: this.upperKeysLocal({ sn_activo: 0 }),
                        condicion
                    }),
                    success: () => {
                        const selector = isReply ? `#reply-${item.idComentario}` : `#comment-card-${item.idComentario}`;
                        const card = this.elements?.commentsContainer?.find(selector);
                        if (card && card.length) card.remove();
                        this.updateUI();
                    },
                    error: (xhr, status, errorThrown) => {
                        console.error("SeguimientoManager: fallo al eliminar comentario (SQL)", { status, errorThrown, response: xhr && xhr.responseText });
                        showNotification("top", "center", "danger", "No se pudo eliminar el comentario.", 3000);
                    }
                });
            });
            actionsWrapper.prepend(editButton);
            actionsWrapper.prepend(saveButton);
            actionsWrapper.prepend(deleteButton);
        }

        return card;
    },

    startCommentEdit(item) {
        if (!item || !item.idComentario) return;
        this.resetInlineEditContext();
        this.replyTo = null;
        this.editingCommentId = item.idComentario;
        this.editingSpItemId = item.spItemId || "";
        this.editingParentId = item.idPadre || "0";
        this.editingAttachment = item.documentoAdjunto || "";
        this.editingHiddenVersion = item.owshiddenversion || "";
        this.editingFecha = item.fechaComentario || "";
        this.editingAutor = item.autorComentarioNombres || "";
        this.elements.replyInfoSpan.text(`Editando tu comentario`).attr("comentario", item.idComentario);
        this.elements.cancelReplyBtn.css("visibility", "visible");
        this.elements.input.val((item.comentario || "").trim());
        this.elements.input.focus();
        this.elements.card.addClass("shown");
        this.elements.button.addClass("text-primary");
    },

    /**
     * Obtiene los comentarios asociados al ID padre.
     * @param {object} params - Parámetros de b+¦squeda.
     * @returns {Array} - Lista de comentarios.
     */
    getComentarios({ parentId }) {
        const comentarios = [];
        const parentField = this.getParentFieldSql();
        const origen = this.resolveOrigen(parentId);
        const conditions = [];
        if (parentId) conditions.push(`${parentField}='${this.escapeSqlValue(parentId)}'`);
        if (origen) conditions.push(`origen='${this.escapeSqlValue(origen)}'`);
        conditions.push("sn_activo=1");
        const condicion = conditions.length ? conditions.join(" AND ") : "1=1";

        try {
            $.ajax({
                url: `${this.config.sqlApiBase}/query`,
                method: "POST",
                async: false,
                contentType: "application/json",
                data: JSON.stringify({
                    campos: "*",
                    origen: this.config.sqlTable,
                    condicion
                }),
                success: (resp) => {
                    const rows = Array.isArray(resp) ? resp : (resp ? [resp] : []);
                    rows.forEach(row => {
                        if (!row) return;
                        comentarios.push({
                            "spItemId": row.id || "",
                            "idComentario": row.id_comentario || "",
                            "idAmc": row.id_oga || "",
                            "idPadre": row.id_respuesta || "0",
                            "comentario": this.decodeHtmlEntities(row.comentario || ""),
                            "fechaComentario": row.fecha_comentario || "",
                            "autorComentarioNombres": row.autor_comentario_nombres || "",
                            "autorComentarioUsuario": row.autor_comentario_usuario || "",
                            "documentoAdjunto": row.documento_adjunto || "",
                            "owshiddenversion": ""
                        });
                    });
                }
            });
        } catch (e) {
            console.warn("SeguimientoManager: error en query SQL comentarios", e);
        }

        // const comentarios = [];
        //     operation: "GetListItems",
        //     async: false,
        //     CAMLQuery: `<Query><Where><Eq><FieldRef Name="${this.config.parentField}"/><Value Type="text">${parentId}</Value></Eq></Where></Query>`,
        //     CAMLViewFields: "<ViewFields>\
        //                         <FieldRef Name='id_comentario' />\
        //                         <FieldRef Name='id_amc' />\
        //                         <FieldRef Name='id_padre' />\
        //                         <FieldRef Name='comentario' />\
        //                         <FieldRef Name='fecha_comentario' />\
        //                         <FieldRef Name='autor_comentario_nombres' />\
        //                         <FieldRef Name='autor_comentario_usuario' />\
        //                         <FieldRef Name='documento_adjunto' />\
        //                         <FieldRef Name='ID' />\
        //                     </ViewFields>",
        //     completefunc: (xData, Status) => {
        //         const manager = this;
        //         $(xData.responseXML).find("z\\:row").each(function () {
        //             comentarios.push({
        //                 "spItemId": $(this).attr("ows_ID") || "",
        //                 "idComentario": $(this).attr("ows_id_comentario") || $(this).attr("ows_ID") || "",
        //                 "idAmc": $(this).attr("ows_id_amc") || "",
        //                 "idPadre": $(this).attr("ows_id_padre") || "0",
        //                 "comentario": manager.decodeHtmlEntities($(this).attr("ows_comentario") || ""),
        //                 "fechaComentario": $(this).attr("ows_fecha_comentario") || "",
        //                 "autorComentarioNombres": $(this).attr("ows_autor_comentario_nombres") || "",
        //                 "autorComentarioUsuario": $(this).attr("ows_autor_comentario_usuario") || "",
        //                 "documentoAdjunto": $(this).attr("ows_documento_adjunto") || "",
        //                 "owshiddenversion": $(this).attr("ows_owshiddenversion") || "",
        //             });
        //         });
        //     }
        // });
        return comentarios;
    },

    /**
     * Aplica etiquetas markdown (** o *) al texto seleccionado en el textarea
     */
    applyTextFormat(textarea, markdownChar) {
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const val = textarea.value;
        const selectedText = val.substring(start, end);
        const before = val.substring(0, start);
        const after = val.substring(end);

        textarea.value = before + markdownChar + selectedText + markdownChar + after;
        textarea.focus();

        // Mueve el cursor al lugar correcto (dentro de las etiquetas si no habia seleccion, o al final si la habia)
        const newCursorPos = selectedText.length === 0 ? start + markdownChar.length : start + markdownChar.length + selectedText.length + markdownChar.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
        $(textarea).trigger("input"); // Dispara el evento input para que no se bugueen las menciones
    },

    /**
     * Transforma el texto plano (con markdown) a HTML seguro para mostrarlo
     */
    parseMarkdown(text) {
        if (!text) return "";
        let escaped = this.escapeHtml(text);
        escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        escaped = escaped.replace(/\*(.*?)\*/g, '<em>$1</em>');
        escaped = escaped.replace(/\n/g, '<br>');
        return escaped;
    },

    /**
     * Obtiene el siguiente ID disponible para un comentario.
     * @returns {number} - El siguiente ID.
     */
    getNextId() {
        const user = (this.config.currentUser || "user").toString().toLowerCase();
        const ts = Date.now();
        return `${user}-${ts}`;

        // let maxId = 0;
        // const camlQuery = "<Query><OrderBy><FieldRef Name='ID' Ascending='False' /></OrderBy></Query>";
        // const viewFields = "<ViewFields><FieldRef Name='id_comentario' /><FieldRef Name='ID' /></ViewFields>";
        //     operation: "GetListItems",
        //     async: false,
        //     CAMLQuery: camlQuery,
        //     CAMLViewFields: viewFields,
        //     CAMLRowLimit: 1,
        //     completefunc: (xData, Status) => {
        //         $(xData.responseXML).find("z\:row").each(function () {
        //             const idComentario = parseInt($(this).attr("ows_id_comentario"), 10);
        //             const spId = parseInt($(this).attr("ows_ID"), 10);
        //             const candidate = Math.max(
        //                 Number.isNaN(idComentario) ? 0 : idComentario,
        //                 Number.isNaN(spId) ? 0 : spId
        //             );
        //             if (candidate > maxId) {
        //                 maxId = candidate;
        //             }
        //         });
        //     }
        // });
        // return maxId + 1;
    },

    buildSeguimientoLink(parentId) {
        const origin = window.location.origin || `${window.location.protocol}//${window.location.host}`;
        const produccionPath = "/sitios/informaciongerencial/OGA_Suite/Produccion/CasosDeUso.aspx";
        const baseUrl = `${origin}${produccionPath}`;
        const currentParams = new URLSearchParams(window.location.search || "");
        const dominioId = (this.config.parentDomainId || "").toString().trim()
            || currentParams.get("id_dominio") || "";

        try {
            const url = new URL(baseUrl);
            if (dominioId) {
                url.searchParams.set("id_dominio", dominioId);
            }
            url.searchParams.set("focus_caso", parentId);
            url.searchParams.set("open_seguimiento", "1");
            url.hash = "";
            return url.toString();
        } catch (error) {
            const params = [];
            if (dominioId) {
                params.push(`id_dominio=${encodeURIComponent(dominioId)}`);
            }
            params.push(
                `focus_caso=${encodeURIComponent(parentId)}`,
                "open_seguimiento=1"
            );
            return `${baseUrl}?${params.join("&")}`;
        }
    },

    enviarCorreosPorMencion({ destinatarios = [], comentario = "", enlace = "", fileUrl = "" }) {
        if (!Array.isArray(destinatarios) || destinatarios.length === 0) return;
        const casoUsoNombre = (this.config.parentName || `Caso de Uso #${this.config.parentId || ""}`).trim();
        const asunto = `Nueva observación en seguimiento – Caso de Uso: ${casoUsoNombre}`;
        const autorNombre = this.config.empleados[this.config.currentUser]?.nombreCompleto || this.config.currentUser;
        const cuerpoHtml = this.buildCorreoHtml({
            casoUsoNombre,
            autorNombre,
            comentario,
            enlace,
            adjuntoUrl: fileUrl
        });
        const nowIso = new Date().toISOString();
        destinatarios.push(this.config.currentUser)
        const nombresDestino = destinatarios.join("&");
        const payload = {
            tabla: "PROCESOS_BI.DBO.t_cola_mensajes",
            datos: {
                NOMBRE_PERSONA: autorNombre,
                USUARIO_PERSONA: nombresDestino,
                ASUNTO_CORREO: asunto,
                CUERPO_CORREO: cuerpoHtml,
                ENVIADO: 0,
                FECHA_ENVIO: nowIso,
                FECHA_INGRESO_EN_COLA: nowIso,
                FIRMA: "Equipo Gobierno de Datos"
            }
        };
        this.postCorreoApi(payload);
    },

    buildCorreoHtml({ casoUsoNombre = "", autorNombre = "", comentario = "", enlace = "", adjuntoUrl = "" }) {
        const comentarioFormateado = (comentario || "").replace(
            /class="mention"/g,
            'style="background-color: #e8f0fe; color: #1967d2; padding: 2px 4px; border-radius: 4px; text-decoration: none; font-weight: bold;"'
        );

        const autorSeguro = this.escapeHtml(autorNombre);
        const casoSeguro = this.escapeHtml(casoUsoNombre || `Caso de Uso #${this.config.parentId}`);

        const adjuntoHtml = adjuntoUrl
            ? `<p><strong>Adjunto:</strong><br /><a href="${adjuntoUrl}" target="_blank" rel="noopener">Ver archivo</a></p>`
            : "";
        const enlaceHtml = enlace
            ? `<p><a href="${enlace}" target="_blank" rel="noopener">Abrir seguimiento</a></p>`
            : "";

        return `<p>Estimado/a,</p>
                    <p>Se ha registrado una <strong>nueva observación en seguimiento</strong> asociada al siguiente caso de uso:</p>
                    <p><strong>Caso de Uso:</strong><br />${casoSeguro}</p>
                    <p><strong>Autor:</strong><br />${autorSeguro}</p>
                    <p><strong>Comentario:</strong></p>
                    <div style="background-color: #f9f9f9; border-left: 4px solid #D2006E; padding: 10px 15px; margin: 15px 0;">
                        ${comentarioFormateado}
                    </div>
                    ${adjuntoHtml}
                    ${enlaceHtml}
                    <p>Si necesita apoyo adicional, no dude en responder este correo o comunicarse con el equipo de <strong>Gobierno de Datos</strong>.</p>
                    <p>Saludos cordiales,<br /><strong>Notificaciones Oga Suite</strong></p>`;
    },

    escapeHtml(text) {
        const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" };
        return (text || "").replace(/[&<>"']/g, (m) => map[m]);
    },

    encodeXml(value) {
        if (value === undefined || value === null) return "";
        return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    },

    decodeHtmlEntities(text) {
        if (text === undefined || text === null) return "";
        if (typeof document !== "undefined" && document.createElement) {
            const textarea = document.createElement("textarea");
            textarea.innerHTML = text;
            return textarea.value;
        }
        return String(text);
    },

    parseCommentDate(dateValue) {
        if (!dateValue) return new Date();
        if (dateValue instanceof Date) return dateValue;
        const raw = String(dateValue).trim();
        if (!raw) return new Date();
        const hasTimezone = /([zZ]|[+\-]\d{2}:\d{2})$/.test(raw);
        const normalized = raw.includes(" ") ? raw.replace(" ", "T") : raw;
        const parsed = new Date(hasTimezone ? normalized : `${normalized}Z`);
        if (!Number.isNaN(parsed.getTime())) return parsed;
        const fallback = new Date(raw);
        return Number.isNaN(fallback.getTime()) ? new Date() : fallback;
    },

    postCorreoApi(payload) {
        const url = this.config.correoApiUrl;
        if (!url) return;
        try {
            if (typeof fetch === "function") {
                fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "accept": "application/json"
                    },
                    body: JSON.stringify(payload)
                }).catch((err) => console.error("SeguimientoManager: error al enviar correo (fetch)", err));
            } else if (typeof $ !== "undefined" && typeof $.ajax === "function") {
                $.ajax({
                    url,
                    method: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(payload)
                }).fail((err) => console.error("SeguimientoManager: error al enviar correo (ajax)", err));
            }
        } catch (error) {
            console.error("SeguimientoManager: error al preparar envio de correo", error);
        }
    },

    abrirModalCorreo: function () {
        // 1. Validamos que el modal general esté cargado
        if (!window.ModalGeneral || typeof window.ModalGeneral.openCorreoModal !== 'function') {
            console.error("SeguimientoManager: ModalGeneral no está disponible.");
            if (typeof showNotification === 'function') {
                showNotification("top", "center", "danger", "El servicio de correos no está disponible.");
            }
            return;
        }

        // 2. Extraemos el HTML del editor
        const htmlContent = this.editorInstance ? this.editorInstance.getData() : "";

        // 3. Creamos un elemento temporal para validaciones y extracción
        const plainTextCheck = document.createElement('div');
        plainTextCheck.innerHTML = htmlContent;

        if (!plainTextCheck.textContent.trim() && !htmlContent.includes('<img') && !htmlContent.includes('<span class="mention"')) {
            if (typeof showNotification === 'function') {
                showNotification("top", "center", "warning", "Debe escribir un comentario antes de enviarlo por correo.");
            }
            return;
        }

        // 🌟 NUEVO: Extraer los usuarios mencionados en el editor
        const mentionUsernames = [];
        const mentionNodes = plainTextCheck.querySelectorAll('.mention');

        mentionNodes.forEach(node => {
            const rawMention = node.getAttribute('data-mention'); // Ej: "@usuario"
            if (rawMention) {
                const username = rawMention.substring(1); // Quitamos el '@'
                if (!mentionUsernames.includes(username)) {
                    mentionUsernames.push(username + "@bancoguayaquil.com");
                }
            }
        });

        // Unimos los usuarios separados por un espacio (formato que acepta el input del modal)
        const destinatariosTo = mentionUsernames.filter(Boolean);

        // 4. Extraemos las variables del entorno
        const casoUsoNombre = (this.config.parentName || `Caso de Uso #${this.config.parentId || ""}`).trim();
        const autorNombre = this.config.empleados[this.config.currentUser]?.nombreCompleto || this.config.currentUser;
        const enlace = typeof this.buildSeguimientoLink === 'function' ? this.buildSeguimientoLink(this.config.parentId) : "";

        // 5. Generamos el cuerpo del correo
        const bodyHtml = this.buildCorreoHtml({
            casoUsoNombre: casoUsoNombre,
            autorNombre: autorNombre,
            comentario: htmlContent,
            enlace: enlace,
            adjuntoUrl: ""
        });

        // 6. Preparamos los datos del modal
        const asunto = `Nueva observación en seguimiento – Caso de Uso: ${casoUsoNombre}`;
        const userEmail = (window.ModalGeneral && typeof window.ModalGeneral.getCurrentEmail === 'function'
            ? window.ModalGeneral.getCurrentEmail()
            : (window._spPageContextInfo && _spPageContextInfo.userEmail) || window.current_email || '');

        // 7. Invocamos el ModalGeneral
        window.ModalGeneral.openCorreoModal({
            initialValues: {
                to: destinatariosTo,
                subject: asunto,
                cc: userEmail,
                bodyHtml: bodyHtml
            },
            defaultCc: userEmail
        }).then((controller) => {
            if (controller && typeof controller.hydrate === 'function') {
                controller.hydrate({
                    to: destinatariosTo,
                    cc: userEmail
                });
            }
        });
    },
};