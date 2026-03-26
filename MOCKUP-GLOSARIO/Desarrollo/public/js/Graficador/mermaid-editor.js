/**
 * MOTOR DEL EDITOR MERMAID (Studio) - V4.0 FINAL + ZOOM INFINITO
 */

// Codificado en UTF-8 para conservar los acentos del espa?ol ecuatoriano.


const mermaidEditor = {
    // --- REFERENCIAS ---
    editor: null,
    output: null,
    status: null,
    container: null,
    leftPane: null,
    previewPane: null,
    resizer: null,
    loadingOverlay: null,
    errorBanner: null,
    contextMenu: null,

    // Modales
    textModal: null,
    colorModal: null,
    noteModal: null,
    nodeTextInput: null,
    noteTextInput: null,
    shareParamKey: 'sp',
    shareButton: null,

    getIconMarkup: function (id) {
        return `<svg class="icon"><use href="#${id}"></use></svg>`;
    },

    // --- ESTADO ---
    renderTimer: null,
    zoomLevel: 0.25,
    initialScale: 0.25,
    panX: 0,
    panY: 0,
    isPanning: false,
    startX: 0,
    startY: 0,

    // Pan Mode Toggle
    panModeEnabled: false,

    // Interacción
    selectedNodeId: null,
    selectedEdgeId: null,
    isConnecting: false,

    // Historial
    history: [],
    historyIndex: -1,
    isUndoing: false,
    autoFitPending: true,
    codePanelVisible: false,
    generateCodeBtn: null,
    api: null,
    generationToastTimer: null,
    loadDialog: null,

    // ========================================================
    // 1. INICIALIZACIÓN
    // ========================================================
    init: function () {
        // DOM Elements
        this.editor = document.getElementById('codigoMermaid');
        this.output = document.getElementById('mermaidOutput');
        this.status = document.getElementById('editorStatus');
        this.container = document.querySelector('.studio-container');
        this.leftPane = document.querySelector('.editor-pane');
        this.previewPane = document.getElementById('previewPane');
        this.resizer = document.getElementById('resizer');
        this.contextMenu = document.getElementById('contextMenu');
        this.toggleCodeBtn = document.getElementById('btnToggleCode');
        this.errorBanner = document.getElementById('codeErrorBanner');
        this.titleInput = document.getElementById('tituloFlujoActual');
        this.generateCodeBtn = document.getElementById('btnToggleCodePrompt');
        this.copyToast = document.getElementById('copyToast');
        this.sqlFileInput = document.getElementById('sqlFileInput');
        this.api = this.resolveApi();

        // Modales Ref
        this.textModal = document.getElementById('textModal');
        this.colorModal = document.getElementById('colorModal');
        this.noteModal = document.getElementById('noteModal');
        this.nodeTextInput = document.getElementById('nodeTextInput');
        this.noteTextInput = document.getElementById('noteTextInput');

        // Crear Overlay Carga
        if (!document.getElementById('loadingOverlay')) {
            const overlay = document.createElement('div');
            overlay.id = 'loadingOverlay';
            overlay.className = 'loading-overlay';
            overlay.innerHTML = '<div class="spinner"></div><div class="loading-text">Procesando diagrama...</div>';
            document.querySelector('.preview-pane').appendChild(overlay);
            this.loadingOverlay = overlay;
        } else {
            this.loadingOverlay = document.getElementById('loadingOverlay');
        }

        if (!this.editor) return;

        // Eventos de Editor
        this.editor.addEventListener('input', () => {
            if (!this.isUndoing) this.saveState();
            this.handleInput();
        });

        // Botón Render
        const btnRender = document.getElementById('btnActualizarGrafico');
        if (btnRender) btnRender.addEventListener('click', () => this.render());

        // Botón Descargar PNG
        // const btnDownloadPNG = document.getElementById('btnDownloadPNG');
        // if(btnDownloadPNG) btnDownloadPNG.addEventListener('click', () => this.exportDiagramPDF());

        // Toggle Pan Mode (Mano)
        const btnTogglePan = document.getElementById('btnTogglePan');
        if (btnTogglePan) btnTogglePan.addEventListener('click', () => this.togglePanMode());

        // Botón Agregar Nota
        const btnAddNote = document.getElementById('btnAddNote');
        if (btnAddNote) btnAddNote.addEventListener('click', () => this.openNoteModal());

        // Clics Globales (Cerrar menús)
        document.addEventListener('click', (e) => {
            if (this.contextMenu &&
                !this.contextMenu.contains(e.target) &&
                !e.target.closest('.node') &&
                !e.target.closest('.edgePath')) {
                this.hideMenu();
            }
            if (e.target.classList.contains('custom-modal-overlay')) {
                this.closeModals();
            }
        });

        // Inicializar Módulos
        this.initResizer();
        this.initZoomPan();
        this.initHistoryControls();

        this.initTitleEditing();
        this.initCodeGeneration();
        this.initShareButton();
        if (window.GraficadorSaveModal && typeof window.GraficadorSaveModal.init === 'function') {
            window.GraficadorSaveModal.init(this);
        }
        if (window.GraficadorLoadModal && typeof window.GraficadorLoadModal.init === 'function') {
            window.GraficadorLoadModal.init(this);
        }
        if (window.GraficadorSqlModal && typeof window.GraficadorSqlModal.init === 'function') {
            window.GraficadorSqlModal.init(this);
        }
        // Estado inicial
        this.saveState();
        this.render();
        this.loadDiagramFromUrlParameter();

        if (this.toggleCodeBtn) {
            this.toggleCodeBtn.addEventListener('click', () => this.toggleCodePanel());
        }

        this.container?.classList.toggle('editor-hidden', !this.codePanelVisible);
        this.updateCodeToggleState();
        this.alignEditorWithOutput();

        window.addEventListener('resize', () => this.alignEditorWithOutput());
    },

    initTitleEditing: function () {
        if (!this.titleInput) return;
        this.titleInput.addEventListener('focus', (e) => e.target.select());
        this.titleInput.addEventListener('blur', (e) => {
            if (!e.target.value.trim()) {
                e.target.value = 'Nuevo Flujo';
            }
        });
    },

    initCodeGeneration: function () {
        if (this.generateCodeBtn) {
            const newBtn = this.generateCodeBtn.cloneNode(true);
            this.generateCodeBtn.parentNode.replaceChild(newBtn, this.generateCodeBtn);
            this.generateCodeBtn = newBtn;

            this.generateCodeBtn.addEventListener('click', () => {
                if (window.GraficadorSqlModal) {
                    window.GraficadorSqlModal.open(this);
                } else {
                    console.error('El modal SQL no está cargado.');
                }
            });
        }
    },

    generateDiagramFromSql: async function (sqlText) {
        if (!this.api) {
            this.showGenerationToast('API del Graficador no disponible.', true);
            return;
        }

        const rawSql = (sqlText ?? '').toString().trim();
        if (!rawSql) {
            this.showGenerationToast('SQL vacío. Proporciona una consulta válida.', true);
            return;
        }

        try {
            this.setSqlLoadingState(true);
            this.hideCodeError();
            this.actualizarEstado('writing');
            const mermaid = await this.api.generateDiagramFromSql(rawSql, { timeout: 120000 });
            if (!mermaid) throw new Error('Respuesta vacía del servidor.');
            this.editor.value = mermaid.trim();
            this.saveState();
            this.render();
            this.showGenerationToast('Diagrama generado desde SQL');
        } catch (error) {
            const message = (error?.message) ? error.message : String(error);
            this.showGenerationToast(`Error: ${message}`, true);
            this.showCodeError(`Error al generar el diagrama: ${message}`);
            console.error('Graficador: error generando diagrama', error);
        } finally {
            this.setSqlLoadingState(false);
        }
    },

    setSqlLoadingState: function (active) {
        if (!this.loadingOverlay) return;
        this.loadingOverlay.classList.toggle('active', active);
    },

    showGenerationToast: function (message, isError = false) {
        if (!this.copyToast) return;
        this.copyToast.textContent = message;
        if (isError) {
            this.copyToast.style.background = '#e17055';
        } else {
            this.copyToast.style.background = '';
        }
        this.copyToast.classList.add('active');
        if (this.generationToastTimer) {
            clearTimeout(this.generationToastTimer);
        }
        this.generationToastTimer = setTimeout(() => {
            this.copyToast.classList.remove('active');
        }, 1800);
    },

    resolveApi: function () {
        if (typeof window === 'undefined') return null;
        if (window.graficadorApi) return window.graficadorApi;
        if (window.GraficadorApi) return new window.GraficadorApi();
        return null;
    },

    handleInput: function () {
        this.actualizarEstado('writing');
        clearTimeout(this.renderTimer);
        this.renderTimer = setTimeout(() => this.render(), 800);
    },

    // ========================================================
    // 2. HISTORIAL (UNDO / REDO)
    // ========================================================
    initHistoryControls: function () {
        document.getElementById('btnUndo')?.addEventListener('click', () => this.undo());
        document.getElementById('btnRedo')?.addEventListener('click', () => this.redo());

        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
                e.preventDefault();
                this.undo();
            }
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
                e.preventDefault();
                this.redo();
            }
        });
    },

    initTitleEditing: function () {
        if (!this.titleInput) return;
        this.titleInput.addEventListener('focus', (e) => e.target.select());
        this.titleInput.addEventListener('blur', (e) => {
            if (!e.target.value.trim()) {
                e.target.value = 'Nuevo Flujo';
            }
        });
    },

    saveState: function () {
        const currentCode = this.editor.value;
        if (this.history.length > 0 && this.history[this.historyIndex] === currentCode) return;

        if (this.historyIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.historyIndex + 1);
        }

        this.history.push(currentCode);
        this.historyIndex++;

        if (this.history.length > 50) {
            this.history.shift();
            this.historyIndex--;
        }
    },

    undo: function () {
        if (this.historyIndex > 0) {
            this.isUndoing = true;
            this.historyIndex--;
            this.editor.value = this.history[this.historyIndex];
            this.render();
            this.isUndoing = false;
        }
    },

    redo: function () {
        if (this.historyIndex < this.history.length - 1) {
            this.isUndoing = true;
            this.historyIndex++;
            this.editor.value = this.history[this.historyIndex];
            this.render();
            this.isUndoing = false;
        }
    },

    // ========================================================
    // 3. RENDERIZADO
    // ========================================================
    render: async function () {
        const codigo = this.editor.value;
        if (!codigo.trim()) return;

        if (!window.mermaid) {
            setTimeout(() => this.render(), 200);
            return;
        }

        try {
            // MOSTRAR Overlay
            if (this.loadingOverlay) this.loadingOverlay.classList.add('active');
            this.actualizarEstado('writing');

            if (!window.mermaid) throw new Error("Mermaid no cargado");

            if (await window.mermaid.parse(codigo)) {
                this.output.classList.remove('dimmed');

                const id = 'graph-' + Math.floor(Math.random() * 10000);
                this.output.innerHTML = '';

                setTimeout(async () => {
                    const { svg } = await window.mermaid.render(id, codigo);
                    this.output.innerHTML = svg;

                    this.hideCodeError();
                    this.autoFit();
                    this.autoFitPending = false;

                    this.initInteractions();
                    this.alignEditorWithOutput();

                    // OCULTAR Overlay
                    if (this.loadingOverlay) this.loadingOverlay.classList.remove('active');
                    this.actualizarEstado('ok');
                }, 50);
            }
        } catch (error) {
            console.warn("Error sintaxis:", error);
            this.output.classList.add('dimmed');
            this.actualizarEstado('error');
            this.showCodeError('El código Mermaid tiene errores de sintaxis.');

            // OCULTAR Overlay incluso si hay error
            if (this.loadingOverlay) this.loadingOverlay.classList.remove('active');
        }
    },

    // ========================================================
    // 4. INTERACCIONES VISUALES (CLICS EN NODOS Y FLECHAS)
    // ========================================================
    initInteractions: function () {
        // NODOS
        const nodes = this.output.querySelectorAll('.node');
        nodes.forEach(node => {
            node.style.cursor = 'pointer';
            node.onclick = (e) => {
                e.stopPropagation();

                // ✅ MEJORADO: Captura más precisa del ID
                let nodeId = node.id;

                // Quitar prefijo "flowchart-" si existe
                if (nodeId.startsWith('flowchart-')) {
                    nodeId = nodeId.replace('flowchart-', '');
                }

                // Quitar sufijo "-XXX" si existe (números al final)
                const parts = nodeId.split('-');
                if (parts.length > 1 && !isNaN(parts[parts.length - 1])) {
                    parts.pop(); // Quitar último elemento si es número
                    nodeId = parts.join('-');
                }

                console.log("Nodo Click:", nodeId);

                if (this.isConnecting) {
                    this.completeConnection(nodeId);
                } else {
                    this.selectedNodeId = nodeId;
                    this.selectedEdgeId = null;
                    this.showMenu(e, node);
                }
            };
        });

        // FLECHAS (Edición con color)
        const edges = this.output.querySelectorAll('.edgePath');
        edges.forEach((edge, index) => {
            edge.style.cursor = 'pointer';
            edge.onclick = (e) => {
                e.stopPropagation();

                console.log("Flecha Click:", index);

                this.selectedEdgeId = index;
                this.selectedNodeId = null;
                this.showEdgeMenu(e, edge);
            };
        });
    },

    showMenu: function (e, nodeElement) {
        if (!this.contextMenu) return;

        // Restaurar menú original para nodos
        this.restoreOriginalMenu();
        this.contextMenu.classList.add('active');
        this.positionContextMenu(e);
    },

    // Menú para Flechas
    showEdgeMenu: function (e, edgeElement) {
        if (!this.contextMenu) return;
        // Cambiar menú para mostrar opciones de flecha
        this.contextMenu.innerHTML = `
            <button class="ctx-btn" title="Color" onclick="mermaidEditor.openEdgeColorModal()">${this.getIconMarkup('icon-palette')}</button>
            <button class="ctx-btn" title="Texto" onclick="mermaidEditor.openEdgeTextModal()">${this.getIconMarkup('icon-font')}</button>
            <button class="ctx-btn" title="Grosor" onclick="mermaidEditor.applyEdgeBold()">${this.getIconMarkup('icon-thickness')}</button>
            <button class="ctx-btn delete" title="Eliminar" onclick="mermaidEditor.menuDeleteEdge()">${this.getIconMarkup('icon-trash')}</button>
        `;

        this.contextMenu.classList.add('active');
        this.positionContextMenu(e);
    },

    restoreOriginalMenu: function () {
        if (!this.contextMenu) return;
        this.contextMenu.innerHTML = `
        <button class="ctx-btn" title="Conectar" onclick="mermaidEditor.menuConnect()">${this.getIconMarkup('icon-arrow')}</button>
        <button class="ctx-btn" title="Editar" onclick="mermaidEditor.openTextModal()">${this.getIconMarkup('icon-pen')}</button>
        <button class="ctx-btn" title="Estilo" onclick="mermaidEditor.openColorModal()">${this.getIconMarkup('icon-palette')}</button>
        <button class="ctx-btn" title="Borde Negrita" onclick="mermaidEditor.applyNodeBold()">${this.getIconMarkup('icon-bold')}</button>
        <button class="ctx-btn delete" title="Eliminar" onclick="mermaidEditor.menuDelete()">${this.getIconMarkup('icon-trash')}</button>
    `;
    },

    toggleCodePanel: function () {
        const prevZoom = this.zoomLevel;
        const prevPanX = this.panX;
        const prevPanY = this.panY;

        this.codePanelVisible = !this.codePanelVisible;
        this.container?.classList.toggle('editor-hidden', !this.codePanelVisible);
        this.updateCodeToggleState();
        this.autoFitPending = false;
        this.alignEditorWithOutput();

        this.zoomLevel = prevZoom;
        this.panX = prevPanX;
        this.panY = prevPanY;
        this.actualizarTransformacion();
    },

    updateCodeToggleState: function () {
        if (!this.toggleCodeBtn) return;
        const label = this.toggleCodeBtn.querySelector('.label');
        this.toggleCodeBtn.setAttribute('aria-pressed', this.codePanelVisible ? 'true' : 'false');
        this.toggleCodeBtn.title = this.codePanelVisible ? 'Ocultar código' : 'Mostrar código';
        if (label) {
            label.textContent = this.codePanelVisible ? 'Ocultar Código' : 'Mostrar Código';
        }
    },

    hideMenu: function () {
        if (this.contextMenu) {
            this.contextMenu.classList.remove('active');
            this.isConnecting = false;
            this.restoreOriginalMenu();
        }
    },

    positionContextMenu: function (e) {
        if (!this.contextMenu || !this.previewPane) return;
        const clickX = e.clientX;
        const clickY = e.clientY;

        requestAnimationFrame(() => {
            const previewRect = this.previewPane.getBoundingClientRect();
            let posX = clickX - previewRect.left;
            let posY = clickY - previewRect.top;

            const menuRect = this.contextMenu.getBoundingClientRect();
            const menuWidth = menuRect.width || 180;
            const menuHeight = menuRect.height || 60;
            const padding = 8;

            posX -= menuWidth / 2;
            posY -= menuHeight;

            if (posX < padding) posX = padding;
            if (posY < padding) posY = padding;
            if (posX + menuWidth > previewRect.width - padding) posX = previewRect.width - menuWidth - padding;
            if (posY + menuHeight > previewRect.height - padding) posY = previewRect.height - menuHeight - padding;

            this.contextMenu.style.left = posX + 'px';
            this.contextMenu.style.top = posY + 'px';
            this.contextMenu.style.transform = 'translate(0, 0)';
        });
    },

    alignEditorWithOutput: function () {
        if (!this.leftPane || !this.output || !this.container) return;
        requestAnimationFrame(() => {
            const containerRect = this.container.getBoundingClientRect();
            const outputRect = this.output.getBoundingClientRect();
            if (!containerRect || !outputRect) return;
            let offsetTop = outputRect.top - containerRect.top;
            if (offsetTop < 0) offsetTop = 0;
            this.leftPane.style.top = offsetTop + 'px';
        });
    },

    // ========================================================
    // 5. ACCIONES DEL MENÚ CONTEXTUAL (NODOS)
    // ========================================================

    menuDelete: function () {
        if (!this.selectedNodeId) return;
        const id = this.selectedNodeId;
        let text = this.editor.value;

        const regex = new RegExp(`^.*\\b${id}\\b.*$`, 'gm');
        const newText = text.replace(regex, '');

        this.editor.value = newText.replace(/^\s*[\r\n]/gm, '');
        this.saveState();
        this.hideMenu();
        this.render();
    },

    menuConnect: function () {
        this.isConnecting = true;
        this.contextMenu.classList.remove('active');

        const status = document.getElementById('editorStatus');
        status.innerHTML = `${this.getIconMarkup('icon-arrow')} Selecciona destino...`;
        status.className = 'studio-status status-writing';
    },

    completeConnection: function (targetId) {
        if (this.selectedNodeId && targetId && this.selectedNodeId !== targetId) {
            const newLine = `\n    ${this.selectedNodeId} --> ${targetId}`;
            this.editor.value += newLine;
            this.saveState();
            this.render();
        }
        this.isConnecting = false;
        this.actualizarEstado('ok');
    },

    openTextModal: function () {
        if (!this.selectedNodeId) return;
        this.hideMenu();
        this.nodeTextInput.value = "";
        this.textModal.classList.remove('hidden');
        this.nodeTextInput.focus();

        this.nodeTextInput.onkeydown = (e) => {
            if (e.key === 'Enter') this.applyTextEdit();
        };
    },

    applyTextEdit: function () {
        const newText = this.nodeTextInput.value.trim();
        if (newText && this.selectedNodeId) {
            let code = this.editor.value;

            // ✅ MEJORADO: Escapar caracteres especiales en el ID
            const escapedId = this.selectedNodeId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

            // ✅ MEJORADO: Regex más precisa
            const regex = new RegExp(`(\\b${escapedId}\\s*[\\(\\[\\{]+)(.*?)([\\)\\]\\}]+)`, 'gi');

            if (code.match(regex)) {
                // Reemplazar solo la primera coincidencia
                this.editor.value = code.replace(regex, `$1${newText}$3`);
            } else {
                // Si no existe, agregarlo después del header
                const headerMatch = code.match(/^graph\s+\w+/m);
                if (headerMatch) {
                    const pos = code.indexOf(headerMatch[0]) + headerMatch[0].length;
                    this.editor.value = code.slice(0, pos) + `\n    ${this.selectedNodeId}["${newText}"]` + code.slice(pos);
                } else {
                    this.editor.value += `\n    ${this.selectedNodeId}["${newText}"]`;
                }
            }
            this.saveState();
            this.render();
        }
        this.closeModals();
    },
    openColorModal: function () {
        if (!this.selectedNodeId) return;
        this.hideMenu();
        this.colorModal.classList.remove('hidden');
    },

    applyColor: function (fill, color) {
        if (!this.selectedNodeId) return;
        const styleLine = `\n    style ${this.selectedNodeId} fill:${fill},color:${color},stroke:#333,stroke-width:2px`;
        this.editor.value += styleLine;
        this.saveState();
        this.render();
        this.closeModals();
    },

    applyNodeBold: function () {
        if (!this.selectedNodeId) return;
        const styleLine = `\n    style ${this.selectedNodeId} stroke-width:5px`;
        this.editor.value += styleLine;
        this.saveState();
        this.render();
        this.hideMenu();
    },

    // ========================================================
    // 6. EDICIÓN DE FLECHAS
    // ========================================================

    openEdgeColorModal: function () {
        if (this.selectedEdgeId === null) return;
        this.hideMenu();

        const edgeColorModal = document.createElement('div');
        edgeColorModal.className = 'custom-modal-overlay';
        edgeColorModal.innerHTML = `
            <div class="custom-modal">
                <h3>🎨 Color de Flecha</h3>
                <div class="color-grid">
                    <div class="color-option" style="background:#333;" onclick="mermaidEditor.applyEdgeColor('#333')"></div>
                    <div class="color-option" style="background:#ff7675;" onclick="mermaidEditor.applyEdgeColor('#ff7675')"></div>
                    <div class="color-option" style="background:#fdcb6e;" onclick="mermaidEditor.applyEdgeColor('#fdcb6e')"></div>
                    <div class="color-option" style="background:#00b894;" onclick="mermaidEditor.applyEdgeColor('#00b894')"></div>
                    <div class="color-option" style="background:#0984e3;" onclick="mermaidEditor.applyEdgeColor('#0984e3')"></div>
                    <div class="color-option" style="background:#6c5ce7;" onclick="mermaidEditor.applyEdgeColor('#6c5ce7')"></div>
                    <div class="color-option" style="background:#d10074;" onclick="mermaidEditor.applyEdgeColor('#d10074')"></div>
                    <div class="color-option" style="background:#e17055;" onclick="mermaidEditor.applyEdgeColor('#e17055')"></div>
                    <div class="color-option" style="background:#74b9ff;" onclick="mermaidEditor.applyEdgeColor('#74b9ff')"></div>
                    <div class="color-option" style="background:#a29bfe;" onclick="mermaidEditor.applyEdgeColor('#a29bfe')"></div>
                    <div class="color-option" style="background:#55efc4;" onclick="mermaidEditor.applyEdgeColor('#55efc4')"></div>
                    <div class="color-option" style="background:#ffeaa7;" onclick="mermaidEditor.applyEdgeColor('#ffeaa7')"></div>
                </div>
                <div class="modal-actions">
                    <button class="btn-cancel" onclick="this.closest('.custom-modal-overlay').remove()">Cerrar</button>
                </div>
            </div>
        `;
        document.body.appendChild(edgeColorModal);
    },

    applyEdgeColor: function (color) {
        if (this.selectedEdgeId === null) return;
        const styleLine = `\n    linkStyle ${this.selectedEdgeId} stroke:${color},stroke-width:3px`;
        this.editor.value += styleLine;
        this.saveState();
        this.render();

        document.querySelector('.custom-modal-overlay')?.remove();
    },

    openEdgeTextModal: function () {
        if (this.selectedEdgeId === null) return;
        this.hideMenu();

        const edgeTextModal = document.createElement('div');
        edgeTextModal.className = 'custom-modal-overlay';
        edgeTextModal.innerHTML = `
            <div class="custom-modal">
                <h3>✏️ Texto en Flecha</h3>
                <input type="text" id="edgeTextInput" placeholder="Texto para la flecha..." autocomplete="off" style="width:100%; padding:10px; border:1px solid #ddd; border-radius:6px; font-size:14px;">
                <div class="modal-actions" style="margin-top:20px;">
                    <button class="btn-cancel" onclick="this.closest('.custom-modal-overlay').remove()">Cancelar</button>
                    <button class="btn-save" onclick="mermaidEditor.applyEdgeText()">Agregar</button>
                </div>
            </div>
        `;
        document.body.appendChild(edgeTextModal);

        setTimeout(() => {
            document.getElementById('edgeTextInput')?.focus();
        }, 100);
    },

    applyEdgeText: function () {
        const input = document.getElementById('edgeTextInput');
        const text = input?.value.trim();

        if (text && this.selectedEdgeId !== null) {
            // Buscar la flecha por índice y agregar texto
            const lines = this.editor.value.split('\n');
            let arrowCount = -1;

            for (let i = 0; i < lines.length; i++) {
                if (lines[i].includes('-->') || lines[i].includes('-.->') || lines[i].includes('==>')) {
                    arrowCount++;
                    if (arrowCount === this.selectedEdgeId) {
                        // Agregar texto a la flecha
                        lines[i] = lines[i].replace(/-->|-.->|==>/, `-->|${text}|`);
                        break;
                    }
                }
            }

            this.editor.value = lines.join('\n');
            this.saveState();
            this.render();
        }

        document.querySelector('.custom-modal-overlay')?.remove();
    },

    applyEdgeBold: function () {
        if (this.selectedEdgeId === null) return;
        const styleLine = `\n    linkStyle ${this.selectedEdgeId} stroke-width:5px`;
        this.editor.value += styleLine;
        this.saveState();
        this.render();
        this.hideMenu();
    },

    menuDeleteEdge: function () {
        if (this.selectedEdgeId === null) return;

        const lines = this.editor.value.split('\n');
        let arrowCount = -1;
        let lineToDelete = -1;

        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes('-->') || lines[i].includes('-.->') || lines[i].includes('==>')) {
                arrowCount++;
                if (arrowCount === this.selectedEdgeId) {
                    lineToDelete = i;
                    break;
                }
            }
        }

        if (lineToDelete !== -1) {
            lines.splice(lineToDelete, 1);
            this.editor.value = lines.join('\n');
            this.saveState();
            this.render();
        }

        this.hideMenu();
    },

    // ========================================================
    // 7. SISTEMA DE NOTAS
    // ========================================================

    openNoteModal: function () {
        if (!this.noteModal) return;
        this.noteTextInput.value = "";
        this.noteModal.classList.remove('hidden');
        this.noteTextInput.focus();
    },

    applyNote: function () {
        const noteText = this.noteTextInput.value.trim();
        if (!noteText) {
            this.closeModals();
            return;
        }

        // Agregar nota al diagrama
        const noteId = 'NOTE' + Math.floor(Math.random() * 1000);
        const noteLine = `\n    ${noteId}[📝 ${noteText}]`;
        const styleLine = `\n    style ${noteId} fill:#fff9c4,color:#333,stroke:#fbc02d,stroke-width:2px`;

        this.editor.value += noteLine + styleLine;
        this.saveState();
        this.render();
        this.closeModals();
    },

    closeModals: function () {
        this.textModal?.classList.add('hidden');
        this.colorModal?.classList.add('hidden');
        this.noteModal?.classList.add('hidden');
        this.saveDialog?.classList.add('hidden');
        this.loadDialog?.classList.add('hidden');
        this.sqlDialog?.classList.add('hidden');
    },

    initShareButton: function () {
        this.shareButton = document.getElementById('btnShareLink');
        if (!this.shareButton) return;
        this.shareButton.addEventListener('click', () => this.shareCurrentDiagram());
    },

    shareCurrentDiagram: async function () {
        if (typeof window === 'undefined') return;
        const shareName = this.getCurrentShareName();
        if (!shareName || shareName.toUpperCase() === 'NUEVO FLUJO') {
            this.showGenerationToast('Asigna un nombre válido y guarda antes de compartir.', true);
            return;
        }
        if (!this.api) {
            this.showGenerationToast('Error: API no conectada.', true);
            return;
        }
        try {
            let allNames = [];
            if (typeof this.api.getAllNombres === 'function') {
                allNames = await this.api.getAllNombres();
            }
            else {
                this.showGenerationToast("No se encontro la funcion para obtener los nombres");
                return;
            }

            const match = (allNames || []).find(r => {
                const dbName = r.NOMBRE_SP || r.nombre_sp || r.NOMBRE_LINAJE || '';
                return dbName.toUpperCase() === shareName.toUpperCase();
            });

            if (!match) {
                this.showGenerationToast(`El diagrama "${shareName}" no está guardado en base de datos.`, true);
                return;
            }
            const shareUrl = this.updateShareUrl(shareName);
            const copied = await this.copyTextToClipboard(shareUrl);

            if (copied) {
                this.showGenerationToast('Enlace copiado al portapapeles');
            } else {
                this.showGenerationToast('Enlace generado, pero no se pudo copiar automáticamente.', true);
            }

        } catch (error) {
            console.error('Error al compartir:', error);
            this.showGenerationToast('Error de conexión al validar el diagrama.', true);
        }
    },

    getCurrentShareName: function () {
        const name = (this.titleInput?.value || '').trim();
        return name || 'Nuevo Flujo';
    },

    updateShareUrl: function (value) {
        if (typeof window === 'undefined') return '';
        const safeValue = (value ?? '').toString().trim();
        if (!safeValue) {
            return window.location.href;
        }
        const newUrl = this.buildShareUrl(safeValue);
        if (window.history?.replaceState) {
            window.history.replaceState({}, '', newUrl);
        }
        return newUrl;
    },

    buildShareUrl: function (value) {
        if (typeof window === 'undefined') return '';
        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);
        params.set(this.shareParamKey, value);
        url.search = params.toString();
        return url.toString();
    },

    async copyTextToClipboard(text) {
        if (!text) return false;
        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(text);
                return true;
            }
        } catch (error) {
            console.warn('Graficador: clipboard error', error);
        }
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        let success = false;
        try {
            success = document.execCommand('copy');
        } catch (error) {
            console.warn('Graficador: fallback copy failed', error);
        }
        document.body.removeChild(textarea);
        return success;
    },

    getSharedParamValue: function () {
        if (typeof window === 'undefined') return '';
        const params = new URLSearchParams(window.location.search);
        const value = params.get(this.shareParamKey);
        return (value || '').trim();
    },

    async loadDiagramFromUrlParameter() {
        if (typeof window === 'undefined') return;
        const sharedName = this.getSharedParamValue();
        if (!sharedName || !this.api || typeof this.api.getCatalogoByName !== 'function') return;
        this.showGenerationToast('Cargando diagrama compartido...');
        try {
            const record = await this.api.getCatalogoByName(sharedName);
            const grafico = (record?.GRAFICO || record?.grafico || '').trim();
            if (!grafico) {
                this.showGenerationToast('No se encontró el diagrama compartido.', true);
                return;
            }
            const nombre = record?.NOMBRE_SP || sharedName;
            this.applySharedDiagram(grafico, nombre);
            this.showGenerationToast('Diagrama cargado desde enlace compartido.');
        } catch (error) {
            console.error('Graficador: error al cargar diagrama compartido', error);
            this.showGenerationToast('No se pudo cargar el diagrama compartido.', true);
        }
    },

    applySharedDiagram: function (grafico, nombre) {
        if (!grafico) return;
        this.editor.value = grafico;
        if (this.titleInput && nombre) {
            this.titleInput.value = nombre;
        }
        this.saveState();
        this.render();
        if (nombre) {
            this.updateShareUrl(nombre);
        }
    },

    // ========================================================
    // 8. BARRA DE HERRAMIENTAS (INSERTAR)
    // ========================================================
    insertar: function (tipo) {
        let snippet = "";
        switch (tipo) {
            case 'node': snippet = "\n    N[Proceso]"; break;
            case 'decision': snippet = "\n    C{Decisión?}"; break;
            case 'circle': snippet = "\n    Q((Fin))"; break;
            case 'db': snippet = "\n    DB[(BaseDatos)]"; break;
            case 'arrow': snippet = " --> "; break;
            case 'arrow_dotted': snippet = " -.-> "; break;
            case 'arrow_thick': snippet = " ==> "; break;
            case 'subgraph': snippet = "\n    subgraph Grupo\n        A --> B\n    end"; break;
        }

        const appendToEnd = ['node', 'decision', 'circle', 'db', 'subgraph'].includes(tipo);
        const text = this.editor.value;

        if (appendToEnd) {
            const body = snippet.startsWith('\n') ? snippet.slice(1) : snippet;
            const separator = text.trim().length ? '\n' : '';
            this.editor.value = `${text}${separator}${body}`;
            this.editor.focus();
            const newPos = this.editor.value.length;
            this.editor.setSelectionRange(newPos, newPos);
        } else {
            const start = this.editor.selectionStart;
            const end = this.editor.selectionEnd;
            this.editor.value = text.substring(0, start) + snippet + text.substring(end);
            this.editor.focus();
            const newPos = start + snippet.length;
            this.editor.setSelectionRange(newPos, newPos);
        }

        this.saveState();
        this.render();
    },

    // ========================================================
    // 9. DESCARGAR PNG (FUNCIONAL)
    // ========================================================
    downloadPNG: function () {
        const svg = this.output.querySelector('svg');
        if (!svg) {
            alert('⚠️ No hay diagrama para descargar. Renderiza primero.');
            return;
        }

        // ✅ SOLUCIÓN: Usar librería html2canvas (ya incluida en muchos navegadores)
        // Si no funciona, usaremos método alternativo directo

        try {
            const svgElement = svg;
            const bbox = svg.getBBox();
            const padding = 40;

            // Crear un contenedor temporal
            const container = document.createElement('div');
            container.style.position = 'absolute';
            container.style.left = '-9999px';
            container.style.background = 'white';
            container.style.padding = padding + 'px';

            const clonedSvg = svgElement.cloneNode(true);
            container.appendChild(clonedSvg);
            document.body.appendChild(container);

            // Usar toDataURL como alternativa a toBlob
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = bbox.width + (padding * 2);
            canvas.height = bbox.height + (padding * 2);

            // Fondo blanco
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Serializar SVG
            const svgData = new XMLSerializer().serializeToString(clonedSvg);
            const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(svgBlob);

            const img = new Image();
            img.crossOrigin = "anonymous";

            img.onload = () => {
                ctx.drawImage(img, padding, padding);

                // ✅ Usar toDataURL en lugar de toBlob (más compatible)
                const dataUrl = canvas.toDataURL('image/png');

                const link = document.createElement('a');
                const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
                link.download = `diagrama_${timestamp}.png`;
                link.href = dataUrl;
                link.click();

                // Limpiar
                document.body.removeChild(container);
                URL.revokeObjectURL(url);

                console.log('✅ PNG descargado correctamente');
            };

            img.onerror = () => {
                document.body.removeChild(container);
                URL.revokeObjectURL(url);
                console.error('❌ Error al cargar imagen');
                alert('Error al generar PNG. Tu navegador bloquea recursos externos.');
            };

            img.src = url;

        } catch (error) {
            console.error('❌ Error:', error);
            alert('Error al descargar PNG: ' + error.message);
        }
    },

    /*
    exportDiagramPDF: async function() {
      const svg = this.output.querySelector('svg');
      if (!svg) {
        alert('No hay diagrama para exportar. Renderiza primero.');
        return;
      }
  
      const bbox = svg.getBBox();
      if (bbox.width === 0 || bbox.height === 0) {
        alert('El diagrama no tiene dimensiones válidas para PDF.');
        return;
      }
  
      const jspdfGlobal = window.jspdf;
      const svg2pdfFn = window.svg2pdf;
      if (!jspdfGlobal?.jsPDF || !svg2pdfFn) {
        console.warn('No se encontró jsPDF/svg2pdf. Se descargará el SVG.');
        this.downloadSVG();
        return;
      }
  
      const margin = 24;
      const pageWidth = Math.ceil(bbox.width + margin * 2);
      const pageHeight = Math.ceil(bbox.height + margin * 2);
      const { jsPDF } = jspdfGlobal;
      const orientation = bbox.width >= bbox.height ? 'landscape' : 'portrait';
  
      const doc = new jsPDF({
        orientation,
        unit: 'pt',
        format: [pageWidth, pageHeight]
      });
  
      const clonedSvg = svg.cloneNode(true);
      const viewBox = svg.getAttribute('viewBox');
      clonedSvg.setAttribute('width', bbox.width);
      clonedSvg.setAttribute('height', bbox.height);
      if (viewBox) {
        clonedSvg.setAttribute('viewBox', viewBox);
      } else {
        clonedSvg.setAttribute('viewBox', `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`);
      }
  
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '-9999px';
      container.style.pointerEvents = 'none';
      container.style.opacity = '0';
      container.appendChild(clonedSvg);
      document.body.appendChild(container);
  
      try {
        await svg2pdfFn(clonedSvg, doc, {
          x: margin,
          y: margin,
          width: bbox.width,
          height: bbox.height,
          scale: 1
        });
        const pdfDataUri = doc.output('datauristring');
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const link = document.createElement('a');
        link.download = `diagrama_${timestamp}.pdf`;
        link.href = pdfDataUri;
        link.click();
        console.log('Diagrama exportado a PDF');
      } catch (error) {
        console.error('Error exportando PDF:', error);
        alert('No se pudo generar el PDF. Se descargará el SVG en su lugar.');
        this.downloadSVG();
      } finally {
        document.body.removeChild(container);
      }
    },
    */

    downloadSVG: function () {
        const svg = this.output.querySelector('svg');
        if (!svg) {
            alert('⚠️ No hay diagrama para descargar. Renderiza primero.');
            return;
        }
        const serializer = new XMLSerializer();
        const source = serializer.serializeToString(svg);
        const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        link.download = 'diagrama_' + timestamp + '.svg';
        link.href = url;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    },

    // ========================================================
    // 10. TOGGLE PAN MODE (MANO)
    // ========================================================

    togglePanMode: function () {
        this.panModeEnabled = !this.panModeEnabled;
        const btn = document.getElementById('btnTogglePan');

        if (this.panModeEnabled) {
            // Activar modo mano
            this.output.classList.add('pan-mode');
            btn?.classList.add('active');
            console.log('✋ Modo MANO activado');
        } else {
            // Desactivar modo mano
            this.output.classList.remove('pan-mode');
            btn?.classList.remove('active');
            console.log('👆 Modo SELECCIÓN activado');
        }
    },

    // ========================================================
    // 11. UTILS (AutoFit, Zoom, Resizer)
    // ========================================================
    autoFit: function () {
        const svg = this.output.querySelector('svg');
        if (!svg) return;

        const bbox = svg.getBBox();
        const styles = window.getComputedStyle(this.output);
        const padLeft = parseFloat(styles.paddingLeft) || 0;
        const padRight = parseFloat(styles.paddingRight) || 0;
        const padTop = parseFloat(styles.paddingTop) || 0;
        const padBottom = parseFloat(styles.paddingBottom) || 0;

        const canvasRect = this.output.getBoundingClientRect();
        if (bbox.width === 0 || canvasRect.width === 0) return;

        const rect = svg.getBoundingClientRect();
        const computedTransform = window.getComputedStyle(svg).transform;
        let baseWidth = rect.width;
        let baseHeight = rect.height;
        if (computedTransform && computedTransform !== 'none' && this.zoomLevel) {
            baseWidth = rect.width / this.zoomLevel;
            baseHeight = rect.height / this.zoomLevel;
        }
        if (!baseWidth || !baseHeight) {
            baseWidth = bbox.width;
            baseHeight = bbox.height;
        }
        if (!baseWidth) return;

        const canvasWidth = Math.max(this.output.clientWidth - padLeft - padRight, 200);
        const baseMargin = Math.min(Math.max(canvasWidth * 0.03, 12), 80);
        const availableWidth = Math.max(canvasWidth - baseMargin * 2, 200);
        const ratio = availableWidth / baseWidth;

        const MIN_SCALE = 0.2;
        const MAX_SCALE = 0.95;
        let newScale = ratio;
        if (ratio > 1) {
            newScale = Math.min(ratio, MAX_SCALE);
        }
        newScale = Math.max(newScale, MIN_SCALE);

        if (!isFinite(newScale) || newScale <= 0) newScale = MIN_SCALE;
        newScale = Math.max(newScale, MIN_SCALE);

        const targetCenterX = canvasRect.width / 2;

        const renderWidth = baseWidth * newScale;
        const halfScaledWidth = renderWidth / 2;

        this.zoomLevel = newScale;
        this.output.scrollLeft = 0;
        this.output.scrollTop = 0;
        this.panX = targetCenterX - halfScaledWidth;
        this.panY = 0;
        this.actualizarTransformacion(true);

        requestAnimationFrame(() => {
            const renderedWidth = svg.getBoundingClientRect().width || renderWidth;
            const finalPanX = targetCenterX - (renderedWidth / 2);
            this.panX = finalPanX;
            this.actualizarTransformacion(true);
            console.log(`[AutoFit] Canvas ${canvasRect.width}px / disponible ${availableWidth}px | svg ${baseWidth}px | zoom ${newScale.toFixed(2)} | SVG final: ${renderedWidth}px`);
        });
    },

    actualizarTransformacion: function (forceZeroY = false) {
        const svg = this.output.querySelector('svg');
        if (!svg) return;
        const translateY = forceZeroY ? 0 : this.panY;
        svg.style.transform = `translate(${this.panX}px, ${translateY}px) scale(${this.zoomLevel})`;
        svg.style.transformOrigin = '0 0';
    },

    // ========================================================
    // 12. ZOOM Y PAN (✅ SIN LÍMITES + RUEDA SOLO SCROLL)
    // ========================================================
    initZoomPan: function () {
        // Botones de Zoom (✅ SIN LÍMITES)
        document.getElementById('btnZoomIn')?.addEventListener('click', () => this.zoomIn());
        document.getElementById('btnZoomOut')?.addEventListener('click', () => this.zoomOut());

        const btnZoomFit = document.getElementById('btnZoomFit');
        if (btnZoomFit) {
            btnZoomFit.addEventListener('click', () => {
                this.autoFitPending = false;
                this.autoFit();
            });
        }

        // Zoom con Ctrl + rueda del mouse (anclado al puntero)
        this.output.addEventListener('wheel', (e) => {
            if (!e.ctrlKey) return;
            e.preventDefault();
            const rect = this.output.getBoundingClientRect();
            const anchorX = e.clientX - rect.left;
            const anchorY = e.clientY - rect.top;
            if (e.deltaY < 0) {
                this.zoomIn(anchorX, anchorY);
            } else if (e.deltaY > 0) {
                this.zoomOut(anchorX, anchorY);
            }
        }, { passive: false });

        // Pan con Mouse (arrastrar)
        this.output.addEventListener('mousedown', (e) => {
            // Solo permitir pan si el modo está activado O si se hace clic en el fondo (no en nodos)
            if (!this.panModeEnabled && (e.target.closest('.node') || e.target.closest('.edgePath'))) {
                return; // No hacer pan si estamos en modo selección y clickeamos un elemento
            }

            this.isPanning = true;
            this.startX = e.clientX - this.panX;
            this.startY = e.clientY - this.panY;
            this.output.style.cursor = 'grabbing';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!this.isPanning) return;
            this.panX = e.clientX - this.startX;
            this.panY = e.clientY - this.startY;
            this.actualizarTransformacion();
        });

        document.addEventListener('mouseup', () => {
            if (this.isPanning) {
                this.isPanning = false;
                if (this.panModeEnabled) {
                    this.output.style.cursor = 'grab';
                } else {
                    this.output.style.cursor = 'default';
                }
            }
        });

        // ✅ RUEDA DEL MOUSE: CTRL+RUEDA activa el zoom
        // Scroll natural sigue funcionando si no se presiona Ctrl
    },

    zoomIn: function (anchorX, anchorY) {
        const step = 0.1;
        const nextZoom = (this.zoomLevel || 1) + step;
        this.applyZoom(nextZoom, anchorX, anchorY);
        console.log('🔍 Zoom:', this.zoomLevel.toFixed(2));
    },

    zoomOut: function (anchorX, anchorY) {
        const step = 0.1;
        const minZoom = 0.05;
        const nextZoom = Math.max((this.zoomLevel || 1) - step, minZoom);
        this.applyZoom(nextZoom, anchorX, anchorY);
        console.log('🔍 Zoom:', this.zoomLevel.toFixed(2));
    },

    applyZoom: function (newZoom, anchorX, anchorY) {
        const svg = this.output.querySelector('svg');
        if (!svg) return;
        const rect = this.output.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const ax = typeof anchorX === 'number' ? anchorX : centerX;
        const ay = typeof anchorY === 'number' ? anchorY : centerY;
        const currentZoom = this.zoomLevel || 1;
        const safeZoom = Math.max(newZoom, 0.05);
        const worldX = (ax - this.panX) / currentZoom;
        const worldY = (ay - this.panY) / currentZoom;
        this.zoomLevel = safeZoom;
        this.panX = ax - worldX * safeZoom;
        this.panY = ay - worldY * safeZoom;
        this.actualizarTransformacion();
    },


    // ========================================================
    // 13. RESIZER (Divisor entre Editor y Preview)
    // ========================================================
    initResizer: function () {
        if (!this.resizer) return;

        let isResizing = false;

        this.resizer.addEventListener('mousedown', (e) => {
            isResizing = true;
            document.body.style.cursor = 'col-resize';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;

            const containerRect = this.container.getBoundingClientRect();
            const newWidth = e.clientX - containerRect.left;
            const percentage = (newWidth / containerRect.width) * 100;

            if (percentage > 20 && percentage < 80) {
                this.leftPane.style.width = percentage + '%';
            }
        });

        document.addEventListener('mouseup', () => {
            if (isResizing) {
                isResizing = false;
                document.body.style.cursor = 'default';
            }
        });
    },

    // ========================================================
    // 14. FUNCIONES PÚBLICAS (Usadas por script.js)
    // ========================================================
    cargarCodigo: function (codigo) {
        this.editor.value = codigo;
        this.autoFitPending = true;
        this.saveState();
        this.render();
    },

    showCodeError: function (message) {
        if (!this.errorBanner) return;
        const textNode = this.errorBanner.querySelector('span');
        if (textNode) textNode.textContent = message;
        this.errorBanner.classList.add('active');
    },

    hideCodeError: function () {
        if (!this.errorBanner) return;
        this.errorBanner.classList.remove('active');
    },

    actualizarEstado: function (estado) {
        if (!this.status) return;

        this.status.className = 'studio-status';

        switch (estado) {
            case 'ok':
                this.status.classList.add('status-ok');
                this.status.innerHTML = `${this.getIconMarkup('icon-check')} Listo`;
                break;
            case 'error':
                this.status.classList.add('status-error');
                this.status.innerHTML = `${this.getIconMarkup('icon-warning')} Error de sintaxis`;
                break;
            case 'writing':
                this.status.classList.add('status-writing');
                this.status.innerHTML = `${this.getIconMarkup('icon-pen')} Editando...`;
                break;
        }
    }

};
// ========================================================
// AUTO-INICIALIZACIÓN
// ========================================================
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('vistaStudio')) {
        mermaidEditor.init();
        console.log('✅ Mermaid Editor V4.0 FINAL + ZOOM INFINITO cargado correctamente');
    }
});
// Exportar globalmente
window.mermaidEditor = mermaidEditor;
