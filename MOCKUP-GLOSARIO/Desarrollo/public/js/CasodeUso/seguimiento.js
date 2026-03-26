/**
 * @file MÃ³dulo para gestionar el componente de seguimiento y comentarios.
 * @description Encapsula la lÃ³gica para mostrar, enviar y adjuntar archivos en la tarjeta de seguimiento.
 * @author Giancarlo Ortiz */
const SeguimientoManager = {
    config: {
        amcId: null,
        currentUser: null,
        folderUrl: `${BASE_URL}docs/AnalyticsModelCanvas`,
        correoApiUrl: "http://gobinfoana01-2:8510/insert",
        empleados: [],
    },
    initialized: false,
    editingCommentId: null,
    editingSpItemId: null,
    editingParentId: null,

    /**
     * Inicializa el componente de seguimiento.
     * @param {object} config - ConfiguraciÃ³n inicial { amcId, currentUser, empleados }.
     */
    init(config = {}) {
        this.config = { ...this.config, ...config };
        if (this.initialized) {
            this.updateUI();
            return;
        }

        this.renderHTML();
        this.cacheDom();
        this.bindEvents();
        this.updateUI();
        this.initialized = true;
    },

    /**
     * Inserta el HTML del componente en el body.
     */
    renderHTML() {
        const html = `
            <div class="seguimiento-card default-transition" style="opacity: 1;">
                <div class="card h-100 ">
                    <div class="card-body ">
                        <div class="d-flex flex-column justify-content-center align-items-center">
                            <div class="seguimiento-card-content">
                                <div class="flex-grow-1 px-2" id="seguimiento-comentarios" style="overflow: auto; max-height:300px;"></div>
                                <div class="seguimiento-input-wrapper d-flex align-items-center" style="gap:6px;position:relative;">
                                    <textarea placeholder="Escriba su observaciÃ³n" id="seguimiento-input" class="form-control"></textarea>
                                    <ul id="suggestions"></ul>
                                    <i class="simple-icon-paper-plane bg-primary h-100" id="btn-enviar-observacion"></i>
                                </div>
                                <div class="d-flex justify-content-between">
                                    <div class="d-flex align-items-center">
                                        <span class="" style="color: #6c757d;" id="seguimiento-conteo">0 Entradas</span>
                                        <div type="file" id="btn-adjuntar-documento" class="d-flex align-items-center justify-content-center" style="cursor: pointer;">
                                            <i class="simple-icon-paper-clip ml-2 text-primary" style="cursor: pointer;"></i>
                                            <span id="name-adjuntar-documento"></span>
                                            <input id="input-adjuntar-documento" style="display: none;" type="file" accept=".xlsx,.xls,.pptx,.ppt,.txt,.csv,.pdf,.docx"/>
                                        </div>
                                    </div>
                                    <div class="d-flex align-items-center" style="gap: .25rem;"><i class="iconsminds-close" style="visibility: hidden; cursor:pointer;" id="seguimiento-cancelar-respuesta"></i><span id="seguimiento-comentario-respuesta" style="font-size: 10px;"></span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <a href="#" class="seguimiento-card-button text-primary" data-toggle="tooltip" data-placement="top" title="Seguimiento"> <i class="iconsminds-speach-bubble-dialog"></i> </a>
            </div>`;
        document.body.insertAdjacentHTML('beforeend', html);
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
            attachBtn: $('#btn-adjuntar-documento'),
            fileInput: $('#input-adjuntar-documento'),
            fileNameSpan: $('#name-adjuntar-documento'),
            countSpan: $('#seguimiento-conteo'),
            cancelReplyBtn: $('#seguimiento-cancelar-respuesta'),
            replyInfoSpan: $('#seguimiento-comentario-respuesta'),
        };
    },

    /**
     * Asigna los manejadores de eventos.
     */
    bindEvents() {
        this.elements.button.on("click", (e) => {
            e.preventDefault();
            this.elements.card.toggleClass("shown");
            this.elements.button.toggleClass("text-primary");
        });

        this.elements.attachBtn.on("click", () => this.elements.fileInput.click());

        this.elements.fileInput.on("change", () => {
            const files = this.elements.fileInput[0].files;
            this.elements.fileNameSpan.text($.map(files, file => file.name).join(", "));
        });

        this.elements.sendBtn.on("click", () => this.enviarObservacion());

        this.elements.cancelReplyBtn.on("click", () => this.cancelarRespuesta());

        // LÃ³gica de menciones (requiere twitter-text.js)
        if (typeof twttr !== 'undefined') {
            this.setupMentions();
        }
    },

    /**
     * Actualiza la UI con los datos actuales (ej. comentarios).
     */
    updateUI() {
        if (this.config.amcId) {
            const comentarios = getComentariosAMC({ amcId: this.config.amcId });
            this.setComentarios(comentarios);
        } else {
            this.setComentarios([]);
        }
    },

    normalizeUser(user = "") {
        const safe = (user || "").toString().trim().toLowerCase();
        if (!safe) return "";
        const withoutDomain = safe.includes("\\") ? safe.split("\\").pop() : safe;
        const withoutEmail = withoutDomain.includes("@") ? withoutDomain.split("@")[0] : withoutDomain;
        return withoutEmail;
    },

    /**
     * Configura la lÃ³gica para autocompletar menciones de usuarios.
     */
    setupMentions() {
        const users = Object.values(this.config.empleados).map(user => ({
            label: `@${user.nombreCompleto}`,
            keywords: [`@${user.usuario}`, `@${user.codigo}`, `@${user.nombreCompleto.toLowerCase()}`]
        }));

        this.elements.input.on("input", () => {
            const value = this.elements.input.val();
            const caretPosition = this.elements.input[0].selectionStart;
            const mentions = twttr.txt.extractMentionsWithIndices(value);
            const currentMention = mentions.find(m => caretPosition > m.indices[0] && caretPosition <= m.indices[1]);

            if (currentMention) {
                const query = currentMention.screenName.toLowerCase();
                const filteredUsers = getSuggestions({ input: query, users });
                if (filteredUsers.length > 0) {
                    this.elements.suggestions.html(filteredUsers.map(user => `<li>${user}</li>`).join("")).show();
                } else {
                    this.elements.suggestions.hide();
                }
            } else {
                this.elements.suggestions.hide();
            }
            this.updateMentionsAttribute();
        });

        this.elements.suggestions.on("click", "li", (e) => {
            const mention = $(e.target).text();
            const value = this.elements.input.val();
            const mentions = twttr.txt.extractMentionsWithIndices(value);
            const caretPosition = this.elements.input[0].selectionStart;
            const currentMention = mentions.find(m => caretPosition > m.indices[0] && caretPosition <= m.indices[1]);

            if (currentMention) {
                const before = value.slice(0, currentMention.indices[0]);
                const after = value.slice(currentMention.indices[1]);
                this.elements.input.val(`${before}${mention} ${after}`);

                let valueList = (this.elements.input.attr("mentions") || "").split("&").filter(Boolean);
                if (!valueList.includes(mention)) valueList.push(mention);
                this.elements.input.attr("mentions", valueList.join("&"));
                this.elements.suggestions.hide();
            }
            this.updateMentionsAttribute();
        });

        this.elements.input.on("blur", () => setTimeout(() => this.elements.suggestions.hide(), 200));
    },

    updateMentionsAttribute() {
        const value = this.elements.input.val();
        let currentValue = this.elements.input.attr("mentions");
        if (currentValue) {
            let mentionsList = currentValue.split("&").filter(mention => value.includes(mention));
            this.elements.input.attr("mentions", mentionsList.join("&"));
        }
    },/**
     * EnvÃ­a una nueva observaciÃ³n o comentario.
     */
    enviarObservacion() {
        const amcId = this.config.amcId;
        const text = this.elements.input.val().trim();

        if (!amcId || !text) {
            showNotification("top", "center", "info", "Debe guardar el AMC y escribir un comentario.", 2000);
            return;
        }

        if (this.editingCommentId) {
            this.actualizarObservacion({
                amcId,
                text,
                idComentario: this.editingCommentId,
                idPadre: this.editingParentId || "0",
            });
            return;
        }

        const idComentario = `${(this.config.currentUser || "user").toLowerCase()}-${Date.now()}`;
        const localISOTime = new Date();
        const idPadre = this.elements.replyInfoSpan.attr("comentario") || "0";
        const file = this.elements.fileInput[0].files[0];
        let fileUrl = "";

        if (file) {
            const fileResult = uploadFileToSharePoint(file, this.config.folderUrl, amcId);
            if (fileResult === false) return;
            const fileExtension = file.name.split('.').pop().toLowerCase();
            const nombreDocumento = file.name.split(".")[0].split(" ").join("_");
            fileUrl = `${amcId}_${nombreDocumento}.${fileExtension}`;
        }

        insertComentarioOGA_SQL({
            data: {
                id_comentario: idComentario,
                id_oga: amcId,
                id_respuesta: idPadre,
                origen: "AMC",
                comentario: text,
                fecha_comentario: localISOTime.toISOString(),
                autor_comentario_nombres: this.config.empleados[this.config.currentUser]?.nombreCompleto || this.config.currentUser,
                autor_comentario_usuario: this.config.currentUser,
                documento_adjunto: fileUrl,
                sn_activo: 1
            },
            onSuccess: () => {
                const objectNameEmployees = listToObject({ lista: getEmpleados(), parametroClave: "nombreCompleto" });
                const userMentions = (this.elements.input.attr("mentions") || "").split("&").filter(Boolean);
                const usernames = [...new Set(userMentions.map(name => (objectNameEmployees[name.slice(1)] || { usuario: "" }).usuario).filter(Boolean))];
                const amcLink = `${BASE_URL}AnalyticsModelCanvas.aspx?amc=${amcId}`;

                if (usernames.length > 0) {
                    this.enviarCorreosPorMencion({
                        destinatarios: usernames,
                        comentario: text,
                        enlace: amcLink,
                        nombreCaso: "Analytics Model Canvas",
                        fileUrl: fileUrl ? `${this.config.folderUrl}/${fileUrl}` : ""
                    });
                }
                this.setComentarios(getComentariosAMC({ amcId }));
                this.elements.input.val("");
                this.elements.fileInput.val("");
                this.cancelarRespuesta();
            }
        });
    },

    /**
     * Actualiza un comentario existente.
     */
    actualizarObservacion({ amcId, text, idComentario, idPadre = "0" }) {
        const comentarioIdValue = (idComentario || "").toString().trim();
        const idPadreValue = idPadre || "0";

        if (!comentarioIdValue) {
            if (typeof showNotification === "function") {
                showNotification("top", "center", "danger", "No se pudo identificar el comentario a actualizar.", 2500);
            }
            return;
        }

        const localISOTime = new Date();
        updateComentarioOGA_SQL({
            data: {
                comentario: text,
                fecha_comentario: localISOTime.toISOString(),
                autor_comentario_nombres: this.config.empleados[this.config.currentUser]?.nombreCompleto || this.config.currentUser,
                autor_comentario_usuario: this.config.currentUser,
                id_respuesta: idPadreValue,
                origen: "AMC"
            },
            condicion: `id_comentario='${escapeSqlValue(comentarioIdValue)}' AND id_oga='${escapeSqlValue(amcId)}'`,
            onSuccess: () => {
                this.setComentarios(getComentariosAMC({ amcId }));
                this.elements.input.val("");
                this.elements.fileInput.val("");
                this.cancelarRespuesta();
            }
        });
    },

    /**
     * Limpia la informaciÃ³n de "respondiendo a".
     */
    cancelarRespuesta() {
        this.editingCommentId = null;
        this.editingSpItemId = null;
        this.editingParentId = null;
        this.elements.replyInfoSpan.text("").attr("comentario", "");
        this.elements.cancelReplyBtn.css("visibility", "hidden");
    },

    /**
     * Renderiza la lista de comentarios en la UI.
     * @param {Array} comentarios - Array de objetos de comentario.
     */
    setComentarios(comentarios) {
        this.elements.countSpan.text(`${comentarios.length} ${comentarios.length === 1 ? "Entrada" : "Entradas"}`);
        if (comentarios.length === 0) {
            this.elements.commentsContainer.html(`<div class="mb-2 text-center">No hay observaciones por el momento</div>`);
            return;
        }

        this.elements.commentsContainer.empty();
        const sortedComments = comentarios.sort((a, b) => this.parseCommentDate(b.fechaComentario) - this.parseCommentDate(a.fechaComentario));
        const respuestas = [];

        sortedComments.forEach(item => {
            if (item.idPadre === "0") {
                const commentCard = this.createCommentCard(item);
                this.elements.commentsContainer.append(commentCard);
            } else {
                respuestas.unshift(item);
            }
        });

        respuestas.forEach(item => {
            const respuestaCard = this.createCommentCard(item, true);
            $(`#comment-card-${item.idPadre}`).after(respuestaCard);
        });
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

        const avatar = `<div class="avatar"><img src="img/Data Science_38.svg" alt="Author"></div>`;
        const content = `
            <div class="d-flex w-100 comentario-text-wrapper">
                <div class="d-flex flex-column w-75">
                    <span class="font-weight-bold" style="font-size:10px;">${item.autorComentarioNombres}</span>
                    <span style="color:#8f8f8f;font-size:10px;">${fechaFormateada}</span>
                    <span style="font-size:10px;">${comentario}</span>
                    ${item.documentoAdjunto ? `<a style="font-size:10px;" class="text-primary" href="${this.config.folderUrl}/${item.documentoAdjunto}" target="_blank">Documento Adjunto</a>` : ""}
                </div>
            </div>`;
        
        card.html(avatar + content);

        if (!isReply) {
            const replyButton = $('<button>', {
                class: 'd-flex',
                style: 'border-radius:0.75rem !important; width:25%; justify-content:center; align-items:center; border:none; background:none;',
                html: '<i class="iconsminds-left-1 text-primary" style="font-size:1.5rem;" title="Responder" data-toggle="tooltip"></i>'
            }).on('click', () => {
                this.editingCommentId = null;
                this.editingSpItemId = null;
                this.editingParentId = null;
                this.elements.replyInfoSpan.text(`Respondiendo a ${item.autorComentarioNombres}`).attr("comentario", item.idComentario);
                this.elements.cancelReplyBtn.css("visibility", "visible");
            });
            card.find('.comentario-text-wrapper').append(replyButton);
        }

        return card;
    },

    enviarCorreosPorMencion({ destinatarios = [], comentario = "", enlace = "", nombreCaso = "", fileUrl = "" }) {
        if (!Array.isArray(destinatarios) || destinatarios.length === 0) return;
        const casoUsoNombre = nombreCaso || `AMC #${this.config.amcId || ""}`;
        const asunto = `Nueva observaciÃ³n en seguimiento â€“ Caso de Uso: ${casoUsoNombre}`;
        const autorNombre = this.config.empleados[this.config.currentUser]?.nombreCompleto || this.config.currentUser;
        const cuerpoHtml = this.buildCorreoHtml({
            casoUsoNombre,
            autorNombre,
            comentario,
            enlace,
            adjuntoUrl: fileUrl
        });
        const nowIso = new Date().toISOString();
        destinatarios.forEach((username) => {
            const empleado = this.config.empleados.find?.(e => (e.usuario || e.codigo || "").toLowerCase() === username.toLowerCase()) || {};
            const nombrePersona = empleado?.nombreCompleto || username;
            const payload = {
                tabla: "PROCESOS_BI.DBO.t_cola_mensajes",
                datos: {
                    NOMBRE_PERSONA: nombrePersona,
                    USUARIO_PERSONA: username,
                    ASUNTO_CORREO: asunto,
                    CUERPO_CORREO: cuerpoHtml,
                    ENVIADO: 0,
                    FECHA_ENVIO: nowIso,
                    FECHA_INGRESO_EN_COLA: nowIso,
                    FIRMA: "Equipo Gobierno de Datos"
                }
            };
            this.postCorreoApi(payload);
        });
    },

    buildCorreoHtml({ casoUsoNombre = "", autorNombre = "", comentario = "", enlace = "", adjuntoUrl = "" }) {
        const comentarioSeguro = this.escapeHtml(comentario);
        const autorSeguro = this.escapeHtml(autorNombre);
        const casoSeguro = this.escapeHtml(casoUsoNombre || `AMC #${this.config.amcId}`);
        const adjuntoHtml = adjuntoUrl
            ? `<p><strong>Adjunto:</strong><br /><a href="${adjuntoUrl}" target="_blank" rel="noopener">Ver archivo</a></p>`
            : "";
        const enlaceHtml = enlace
            ? `<p><a href="${enlace}" target="_blank" rel="noopener">Abrir seguimiento</a></p>`
            : "";
        return `<p>Estimado/a,</p>
<p>Se ha registrado una <strong>nueva observaciÃ³n en seguimiento</strong> asociada al siguiente caso de uso:</p>
<p><strong>Caso de Uso:</strong><br />${casoSeguro}</p>
<p><strong>Autor:</strong><br />${autorSeguro}</p>
<p><strong>Comentario:</strong><br />${comentarioSeguro}</p>
${adjuntoHtml}
${enlaceHtml}
<p>Si necesita apoyo adicional, no dude en responder este correo o comunicarse con el equipo de <strong>Gobierno de Datos</strong>.</p>
<p>Saludos cordiales,<br /><strong>Notificaciones Oga Suite</strong></p>`;
    },

    escapeHtml(text) {
        const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" };
        return (text || "").replace(/[&<>"']/g, (m) => map[m]);
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
    }
};


