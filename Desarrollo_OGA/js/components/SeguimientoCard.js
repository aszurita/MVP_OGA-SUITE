const seguimientoCardTemplate = document.createElement("template");
seguimientoCardTemplate.innerHTML = `
    <style>
        /* Estilos movidos desde style.css y encapsulados aquí */
        :host {
            --theme-color-1: #D2006E;
            --primary-color: #3a3a3a;
            --separator-color: #d7d7d7;
            --foreground-color: white;
        }

        .seguimiento-card {
            width: 550px !important;
            position: fixed;
            z-index: 1020;
            top: 50%;
            right: 0;
            transform: translate(550px, -50%);
            padding-top: 10px;
            padding-bottom: 10px;
            transition: transform .4s ease-out;
            max-height: 400px;
            opacity: 1;
        }

        .seguimiento-card.shown {
            transform: translate(0, calc(-50% + .5px));
        }

        .seguimiento-card-button {
            position: fixed;
            left: -47px;
            background: var(--foreground-color);
            padding: 13px;
            border-radius: .2rem;
            color: var(--primary-color);
            box-shadow: -2px 0px 10px rgba(0, 0, 0, 0.2);
            font-size: 20px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--theme-color-1);
        }

        .seguimiento-card-content {
            display: flex;
            flex-direction: column;
            width: 100%;
            justify-content: space-between;
            gap: 6px;
        }

        .seguimiento-input-wrapper > i {
            font-size: 1rem;
            text-align: center;
            align-items: center;
            display: flex;
            justify-content: center;
            padding: .6rem .75rem;
            border-radius: 20px;
            cursor: pointer;
        }

        #seguimiento-comentarios {
            overflow: auto;
            max-height: 300px;
        }

        .avatar {
            height: 40px;
            width: 40px;
            margin-top: 2%;
        }

        #suggestions {
            position: absolute;
            border: 1px solid #ccc;
            background: white;
            list-style: none;
            padding: 0;
            margin: 0;
            width: 300px;
            max-height: 150px;
            overflow-y: auto;
            display: none;
            top: 100%;
        }

        #suggestions li {
            padding: 5px 10px;
            cursor: pointer;
        }

        #suggestions li:hover {
            background: #f0f0f0;
        }
        
        .card {
            border: initial;
            background: white;
            border-radius: 0.1rem;
            box-shadow: 0 1px 15px rgba(0, 0, 0, 0.2), 0 1px 6px rgba(0, 0, 0, 0.1);
        }
        
        .card-body {
            padding: 1.75rem;
        }

        .h-100 { height: 100% !important; }
        .d-flex { display: flex !important; }
        .flex-column { flex-direction: column !important; }
        .justify-content-center { justify-content: center !important; }
        .align-items-center { align-items: center !important; }
        .flex-grow-1 { flex-grow: 1 !important; }
        .px-2 { padding-left: .5rem !important; padding-right: .5rem !important; }
        .justify-content-between { justify-content: space-between !important; }
        .ml-2 { margin-left: .5rem !important; }
        .text-primary { color: var(--theme-color-1) !important; }
        .bg-primary { background-color: var(--theme-color-1) !important; }
        .form-control {
            display: block;
            width: 100%;
            height: calc(1.5em + .75rem + 2px);
            padding: .375rem .75rem;
            font-size: .8rem;
            font-weight: 400;
            line-height: 1.5;
            color: #495057;
            background-color: #fff;
            background-clip: padding-box;
            border: 1px solid #ced4da;
            border-radius: .25rem;
            transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
        }
        textarea.form-control {
            height: auto;
        }
    </style>
    <div class="seguimiento-card default-transition">
        <div class="card h-100">
            <div class="card-body">
               <div class="d-flex flex-column justify-content-center align-items-center">
                <div class="seguimiento-card-content">
                    <div class="flex-grow-1 px-2" id="seguimiento-comentarios">
                        <div class="mb-2 text-center">No hay observaciones por el momento</div>
                    </div>
                    <div class="seguimiento-input-wrapper d-flex align-items-center" style="gap:6px;position:relative;">
                        <textarea placeholder="Escriba su observación" id="seguimiento-input" class="form-control"></textarea>
                        <ul id="suggestions"></ul>
                        <i class="simple-icon-paper-plane bg-primary h-100" id="btn-enviar-observacion"></i>
                    </div>
                    <div class="d-flex justify-content-between">
                        <div class="d-flex align-items-center">
                            <span style="color: #6c757d;" id="seguimiento-conteo">0 Entradas</span>
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
        <a href="#" class="seguimiento-card-button" data-toggle="tooltip" data-placement="top" title="Seguimiento">
            <i class="iconsminds-speach-bubble-dialog"></i>
        </a>
    </div>
`;

class SeguimientoCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(seguimientoCardTemplate.content.cloneNode(true));
        
        // --- 1. Referencias a elementos del Shadow DOM ---
        this.card = this.shadowRoot.querySelector('.seguimiento-card');
        this.toggleButton = this.shadowRoot.querySelector('.seguimiento-card-button');
        this.sendButton = this.shadowRoot.querySelector("#btn-enviar-observacion");
        this.attachButton = this.shadowRoot.querySelector('#btn-adjuntar-documento');
        this.fileInput = this.shadowRoot.querySelector('#input-adjuntar-documento');
        this.fileNameSpan = this.shadowRoot.querySelector('#name-adjuntar-documento');
        this.cancelReplyButton = this.shadowRoot.querySelector('#seguimiento-cancelar-respuesta');
    }

    connectedCallback() {
        // --- 2. Lógica de UI que estaba en listenerAMC se mueve aquí ---
        this.toggleButton.addEventListener('click', this.toggleCard.bind(this));
        this.attachButton.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', this.updateFileName.bind(this));
        this.cancelReplyButton.addEventListener('click', this.cancelReply.bind(this));
        this.sendButton.addEventListener('click', this.sendComment.bind(this));
        
        // Inicializar tooltips si es necesario (Bootstrap)
        if (typeof $ === 'function') {
            $(this.toggleButton).tooltip();
        }

        // --- 3. Lógica de Autocompletado de Menciones ---
        this._initializeMentions();
    }

    // --- 4. Observador de Atributos para `amc-id` ---
    static get observedAttributes() {
        return ['amc-id'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'amc-id' && newValue && oldValue !== newValue) {
            this.loadComments();
        }
    }

    disconnectedCallback() {
        // Limpiar listeners para evitar fugas de memoria
        this.toggleButton.removeEventListener('click', this.toggleCard.bind(this));
        this.sendButton.removeEventListener('click', this.sendComment.bind(this));
        this.attachButton.removeEventListener('click', () => this.fileInput.click());
        this.fileInput.removeEventListener('change', this.updateFileName.bind(this));
        this.cancelReplyButton.removeEventListener('click', this.cancelReply.bind(this));
    }

    // --- Métodos del componente ---
    // --- 5. Lógica de Negocio (Cargar y Enviar Comentarios) ---

    toggleCard(e) {
        e.preventDefault();
        this.card.classList.toggle('shown');
        this.toggleButton.classList.toggle('text-primary');
    }

    updateFileName() {
        const files = this.fileInput.files;
        if (files.length > 0) {
            this.fileNameSpan.textContent = files[0].name;
        } else {
            this.fileNameSpan.textContent = '';
        }
    }

    cancelReply() {
        const replySpan = this.shadowRoot.querySelector('#seguimiento-comentario-respuesta');
        replySpan.textContent = '';
        replySpan.setAttribute('comentario', '');
        this.cancelReplyButton.style.visibility = 'hidden';
    }

    loadComments() {
        const amcId = this.getAttribute('amc-id');
        if (!amcId) {
            this.renderComments([]);
            return;
        }
        // Asumimos que getComentariosAMC está disponible globalmente
        const comments = getComentariosAMC({ amcId });
        this.renderComments(comments);
    }

    renderComments(comments) {
        const container = this.shadowRoot.querySelector("#seguimiento-comentarios");
        const countSpan = this.shadowRoot.querySelector("#seguimiento-conteo");
        
        countSpan.textContent = `${comments.length} Entradas`;

        if (comments.length === 0) {
            container.innerHTML = `<div class="mb-2 text-center">No hay observaciones por el momento</div>`;
            return;
        }

        container.innerHTML = ""; // Limpiar contenedor
        const sortedComments = comments.sort((a, b) => new Date(b.fechaComentario) - new Date(a.fechaComentario));
        const parentComments = sortedComments.filter(c => c.idPadre === "0");
        const replies = sortedComments.filter(c => c.idPadre !== "0");

        parentComments.forEach(item => {
            const commentCard = this._createCommentCard(item);
            container.appendChild(commentCard);

            // Adjuntar respuestas
            replies
                .filter(reply => reply.idPadre === item.idComentario)
                .forEach(reply => {
                    const replyCard = this._createCommentCard(reply, true);
                    commentCard.after(replyCard);
                });
        });
    }

    _createCommentCard(item, isReply = false) {
        const folderUrl = `http://vamos.bancoguayaquil.com/sitios/informaciongerencial/OGA_Suite/Desarrollo/docs/AnalyticsModelCanvas`;
        const fechaFormateada = getFormattedDate({ date: new Date(item.fechaComentario), hour: true });
        const comentario = item.comentario.trim() || 'Sin comentarios';

        const card = document.createElement("div");
        card.id = `comment-card-${item.idComentario}`;
        card.className = "custom-card mb-2 d-flex p-2 flex-row";
        card.style = `gap:1rem; box-shadow:none !important; background-color: ${isReply ? '#fae5f0' : '#e7effe'} !important; ${isReply ? 'margin-left: 4rem !important;' : ''}`;

        card.innerHTML = `
            <div class="avatar">
              <img src="img/Data Science_38.svg" alt="Author">
            </div>
            <div class="d-flex w-100 comentario-text-wrapper">
              <div class="d-flex flex-column w-75">
                <span class="font-weight-bold" style="font-size:10px;">${item.autorComentarioNombres}</span>
                <span style="color:#8f8f8f;font-size:10px;">${fechaFormateada}</span>
                <span style="font-size:10px;">${comentario}</span>
                ${item.documentoAdjunto ? `<a style="font-size:10px;" class="text-primary" href="${folderUrl}/${item.documentoAdjunto}" target="_blank">Documento Adjunto</a>` : ""}
              </div>
            </div>
        `;

        if (!isReply) {
            const button = document.createElement("button");
            button.className = "d-flex";
            button.style = "border-radius:0.75rem !important; width:25%; justify-content:center; align-items:center; border:none; background:none;";
            button.innerHTML = `<i class="iconsminds-left-1 text-primary" style="font-size:1.5rem;"></i>`;
            button.onclick = () => this.handleReply(item.idComentario, item.autorComentarioNombres);
            card.querySelector(".comentario-text-wrapper").appendChild(button);
        }

        return card;
    }

    handleReply(commentId, authorName) {
        const replySpan = this.shadowRoot.querySelector("#seguimiento-comentario-respuesta");
        replySpan.textContent = `Respondiendo a ${authorName}`;
        replySpan.setAttribute("comentario", commentId);
        this.cancelReplyButton.style.visibility = "visible";
    }

    async sendComment() {
        const amcId = this.getAttribute('amc-id');
        const inputEl = this.shadowRoot.querySelector("#seguimiento-input");
        const text = inputEl.value.trim();

        if (!amcId || !text) {
            showNotification("top", "center", "warning", "Debe seleccionar un AMC y escribir un comentario.", 2000);
            return;
        }

        // Lógica de subida de archivo
        let fileUrl = "";
        const files = this.fileInput.files;
        if (files.length > 0) {
            const file = files[0];
            const folderUrl = `http://vamos.bancoguayaquil.com/sitios/informaciongerencial/OGA_Suite/Desarrollo/docs/AnalyticsModelCanvas`;
            const uploadResult = await uploadFileToSharePoint(file, folderUrl, amcId); // Asumiendo que esta función es async y devuelve la URL o un error.
            if (uploadResult.success) {
                fileUrl = uploadResult.fileUrl;
            } else {
                showNotification("top", "center", "danger", "Error al subir el archivo adjunto.");
                return; // Detener si la subida falla
            }
        }

        const idComentario = getNextIdAMC({ list: getComentariosAMC({ username: window.current_user }), parameter: "idComentario" });
        const localISOTime = new Date(Date.now() - (new Date().getTimezoneOffset() * 60000)).toISOString();
        const idPadre = this.shadowRoot.querySelector("#seguimiento-comentario-respuesta").getAttribute("comentario") || "0";

        $().SPServices({
            operation: "UpdateListItems",
            async: false,
            batchCmd: "New",
            listName: "Z_COMENTARIOS_AMC",
            valuepairs: [
                ["id_comentario", idComentario],
                ["id_amc", amcId],
                ["id_padre", idPadre],
                ["comentario", text],
                ["fecha_comentario", localISOTime],
                ["autor_comentario_nombres", window.nombreCompleto],
                ["autor_comentario_usuario", window.current_user],
                ["documento_adjunto", fileUrl],
            ],
            completefunc: (xData, Status) => {
                if (Status === "success") {
                    this.loadComments(); // Recargar comentarios
                    inputEl.value = "";
                    this.fileInput.value = "";
                    this.fileNameSpan.textContent = "";
                    this.cancelReply();
                } else {
                    showNotification("top", "center", "danger", "Error al enviar el comentario.");
                }
            }
        });
    }

    _initializeMentions() {
        // Esta parte es compleja de replicar sin jQuery UI y depende de cómo esté estructurado `twttr.txt`.
        // Por ahora, la lógica de menciones se mantendrá en `listenerAMC.js` actuando sobre el DOM global.
        // Para una modularización completa, se necesitaría una librería de autocompletado que funcione con Shadow DOM.
        console.warn("La funcionalidad de menciones (@) no está completamente modularizada y depende de listeners globales.");
    }
}

window.customElements.define('seguimiento-card', SeguimientoCard);
