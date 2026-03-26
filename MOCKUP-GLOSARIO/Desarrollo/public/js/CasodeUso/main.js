/**
 * @file Módulo principal para la página de Casos de Uso.
 * @description Este archivo orquesta la carga de datos, renderizado, interacciones de UI
 *              y la inicialización de los wizards para crear y ver detalles de los casos de uso.
 * @author Giancarlo Ortiz */

// Encapsulamos toda la lógica en un objeto para evitar polución del scope global.
const CasosDeUsoApp = {
    // --- PROPIEDADES ---
    DATA_ORIGINAL: [],
    idDominio: null,
    idDominioFromUrl: null,
    selectedSubdominio: null,
    selectedSubdominioFromUrl: null,
    subdominiosCache: [],
    elements: {}, // Cache para elementos del DOM
    autoOpenConfig: null,
    autoOpenHandled: false,
    dominiosCache: [],
    isDomainSelectionMode: false,
    searchMode: "subdominio", // dominio | caso | todos | subdominio
    groupMode: "subdominio",
    selectedStatusFilter: null,
    lastQuery: "",
    SUB_NULL_PARAM: "sin-subdominio",

    /**
     * Punto de entrada de la aplicación. Se llama cuando el DOM está listo.
     */
    init() {
        this.cacheDom();
        this.idDominio = this.getIdDominioFromUrl();
        this.selectedSubdominioFromUrl = this.getSelectedSubdominioFromUrl();
        this.autoOpenConfig = this.getAutoOpenConfigFromUrl();
        this.idDominioFromUrl = this.idDominio || null;
        this.isDomainSelectionMode = false; // Default: buscar casos (cargar todos si no hay dominio)
        this.searchMode = "subdominio";
        this.prepareSubdominioSearchUi();
        this.syncSearchModeUi();
        this.loadDominioInfo(); // Carga la info del dominio primero

        if (typeof EmpleadoUtils !== 'undefined' && typeof EmpleadoUtils.loadEmpleadosOnce === 'function') {
            EmpleadoUtils.loadEmpleadosOnce().then(() => {
                console.log("Empleados cargados para etiquetas de agrupación");
            });
        }
        this.bindEvents();
        this.loadCasosDeUso(); // Luego carga los casos de uso
    },

    /**
     * Almacena referencias a elementos del DOM para un acceso más eficiente.
     */
    cacheDom() {
        this.elements = {
            grid: document.getElementById("casos-uso-grid"),
            buscador: document.getElementById("buscarCasoUso"),
            badgeCount: document.getElementById("cuentaResultados"),
            btnNuevo: document.getElementById("btnNuevoCaso"),
            nombreDominio: document.getElementById("nombre-dominio"),
            domainSuggestions: document.getElementById("dominio-sugerencias"),
            subdominioSuggestions: document.getElementById("subdominio-sugerencias"),
            filterBtn: document.getElementById("cu-filter-btn"),
            filterHelper: document.getElementById("cu-filter-helper"),
            filterOptions: document.querySelectorAll(".cu-filter-option"),
        };
    },

    /**
     * Asigna los manejadores de eventos a los elementos de la UI.
     */
    bindEvents() {
        if (this.elements.buscador) {
            this.elements.buscador.addEventListener("input", () => {
                this.handleSearchInput(this.elements.buscador.value);
            });
            this.elements.buscador.addEventListener("focus", () => this.handleSearchFocus());
        }

        const breadcrumbCasos = document.getElementById("a-casos");
        if (breadcrumbCasos) {
            breadcrumbCasos.addEventListener("click", (e) => {
                e.preventDefault();
                this.setSearchMode("caso");
                if (this.DATA_ORIGINAL.length === 0) {
                    this.loadCasosDeUso();
                } else {
                    this.render(this.applySubdominioFilter(this.DATA_ORIGINAL));
                }
                this.cargarContadoresEstados();
            });
        }

        const breadcrumbSubdominios = document.getElementById("a-subdominios");
        if (breadcrumbSubdominios) {
            breadcrumbSubdominios.addEventListener("click", (e) => {
                e.preventDefault();
                this.setSearchMode("subdominio");
                if (this.DATA_ORIGINAL.length === 0) {
                    this.loadCasosDeUso();
                } else {
                    this.render(this.applySubdominioFilter(this.DATA_ORIGINAL));
                }
                this.cargarContadoresEstados();
            });
        }

        document.addEventListener("click", (e) => {
            const isInput = e.target === this.elements.buscador;
            const isDomSug = this.elements.domainSuggestions?.contains(e.target);
            const isSubSug = this.elements.subdominioSuggestions?.contains(e.target);
            if (!isInput && !isDomSug) this.hideDomainSuggestions();
            if (!isInput && !isSubSug) this.hideSubdominioSuggestions();
        });

        if (this.elements.filterOptions && this.elements.filterOptions.length > 0) {
            this.elements.filterOptions.forEach(opt => {
                opt.addEventListener("click", (e) => {
                    e.preventDefault();
                    const modo = opt.getAttribute("data-mode") || "caso";
                    this.setSearchMode(modo);
                });
            });
        }

        const groupOptions = document.querySelectorAll(".cu-group-option");
        if (groupOptions && groupOptions.length > 0) {
            groupOptions.forEach(opt => {
                opt.addEventListener("click", (e) => {
                    e.preventDefault();
                    const mode = opt.getAttribute("data-mode") || "subdominio";
                    this.setGroupMode(mode);
                });
            });
        }

        if (this.elements.grid) {
            this.elements.grid.addEventListener('click', (e) => {
                const card = e.target.closest('.cu-card[data-id]') || e.target.closest('.cu-card-sub[data-id]');
                if (card) {
                    this.showDetails(card.dataset.id);
                    return;
                }
                const subCard = e.target.closest('.cu-card[data-sub]') || e.target.closest('.cu-card-sub[data-sub]');
                if (subCard) {
                    const nombreSub = subCard.dataset.sub || "";
                    const clave = nombreSub === "Sin subdominio" ? "__NULL__" : nombreSub;
                    this.selectSubdominio({ nombre: nombreSub, clave });
                    this.render(this.applySubdominioFilter(this.DATA_ORIGINAL));
                }
            });
        }

        if (this.elements.btnNuevo) {
            this.elements.btnNuevo.addEventListener('click', () => {
                registrar_visita("CASOS DE USO", "Nuevo caso de uso");
                // La lógica de inicialización y limpieza del modal está en wizardNuevoCaso.js
                $('#modalNuevoCaso').modal('show');
            });
        }
    },

    prepareDomainSearchUi() {
        if (this.elements.buscador) {
            this.elements.buscador.placeholder = "Buscar dominio para ver sus casos de uso...";
            this.elements.buscador.value = "";
        }
    },

    prepareCaseSearchUi() {
        if (this.elements.buscador) {
            this.elements.buscador.placeholder = "Buscar por descripcion, estado o ID...";
        }
    },

    prepareSubdominioSearchUi() {
        if (this.elements.buscador) {
            this.elements.buscador.placeholder = "Buscar subdominio para filtrar casos de uso...";
            this.elements.buscador.value = "";
        }
    },

    handleSearchFocus() {
        if (this.isDomainSelectionMode) {
            this.handleDomainSearch(this.elements.buscador?.value || "");
        } else if (this.searchMode === "subdominio") {
            this.handleSubdominioSearch(this.elements.buscador?.value || "", { forceSuggestions: true });
        }
    },

    switchToDomainSelectionMode() {
        this.idDominioFromUrl = null;
        this.isDomainSelectionMode = true;
        this.searchMode = "dominio";
        this.prepareDomainSearchUi();
        this.syncSearchModeUi();
    },

    setSearchMode(modo) {
        if (modo === "dominio") {
            this.switchToDomainSelectionMode();
            this.handleDomainSearch(this.elements.buscador?.value || "");
            return;
        }

        if (modo === "subdominio") {
            this.selectedSubdominio = null;
            this.isDomainSelectionMode = false;
            this.searchMode = "subdominio";
            this.updateUrlParam("subdominio", null);
            // No abrir sugerencias ni limpiar input automáticamente; solo ajustar placeholder
            if (this.elements.buscador) {
                this.elements.buscador.placeholder = "Buscar subdominio para filtrar casos de uso...";
            }
            this.syncSearchModeUi();
            if (this.DATA_ORIGINAL.length === 0) {
                this.loadCasosDeUso();
            } else {
                this.render(this.applySubdominioFilter(this.DATA_ORIGINAL));
            }
            return;
        }

        if (modo === "todos") {
            this.idDominioFromUrl = null;
            this.idDominio = null;
            this.selectedSubdominio = null;
            this.searchMode = "todos";
            this.isDomainSelectionMode = false;
            this.prepareCaseSearchUi();
            if (this.elements.buscador) {
                this.elements.buscador.value = "";
            }
            this.syncSearchModeUi();
            this.updateUrlParam("id_dominio", null);
            this.updateUrlParam("subdominio", null);
            this.updateNavLinksWithDominio(null);
            this.loadCasosDeUso();
            return;
        }

        if (!this.idDominio) {
            this.switchToDomainSelectionMode();
            return;
        }

        this.selectedSubdominio = null;
        this.isDomainSelectionMode = false;
        this.searchMode = "caso";
        this.updateUrlParam("subdominio", null);
        this.prepareCaseSearchUi();
        this.syncSearchModeUi();
        if (this.DATA_ORIGINAL.length === 0) {
            this.loadCasosDeUso();
        } else {
            this.render(this.applySubdominioFilter(this.DATA_ORIGINAL));
        }
    },

    syncSearchModeUi() {
        if (this.elements.filterBtn) {
            const labelText = this.searchMode === "dominio"
                ? "Filtrar por: Dominios"
                : this.searchMode === "subdominio"
                    ? "Filtrar por: Subdominios"
                    : this.searchMode === "todos"
                        ? "Filtrar por: Todos los casos de uso"
                        : "Filtrar por: Casos";

            const spanLabel = this.elements.filterBtn.querySelector('.label');

            if (spanLabel) {
                spanLabel.textContent = labelText;
            } else {
                this.elements.filterBtn.innerHTML = `<i class="simple-icon-filter" style="font-size: 1.1em;"></i> <span class="label">${labelText}</span>`;
            }
        }

        if (this.elements.filterOptions && this.elements.filterOptions.length > 0) {
            this.elements.filterOptions.forEach(opt => {
                const mode = opt.getAttribute("data-mode");
                if (mode === "caso" && !this.idDominio) {
                    opt.classList.add("d-none");
                } else if (mode === "subdominio" && !this.DATA_ORIGINAL.length) {
                    opt.classList.add("d-none");
                } else {
                    opt.classList.remove("d-none");
                }
            });
        }

        if (this.elements.filterHelper) {
            if (this.searchMode === "dominio") {
                this.elements.filterHelper.textContent = "Buscando dominios";
            } else if (this.searchMode === "subdominio") {
                this.elements.filterHelper.textContent = "Buscando subdominios";
            } else if (this.searchMode === "todos") {
                this.elements.filterHelper.textContent = "Viendo todos los dominios";
            } else {
                const scope = this.idDominio ? "Buscando casos de uso" : "Buscando casos (todos los dominios)";
                this.elements.filterHelper.textContent = scope;
            }
        }

        const activeCrumb = this.searchMode === "subdominio" ? "a-subdominios" : "a-casos";
        this.setBreadcrumbActive(activeCrumb);
    },

    setGroupMode(mode) {
        this.groupMode = mode;
        const btn = document.getElementById("cu-group-btn");

        if (btn) {
            // Capitaliza la primera letra (ej: "especialista" -> "Especialista")
            const label = mode.charAt(0).toUpperCase() + mode.slice(1);
            const labelText = `Agrupar por: ${label}`;
            // Buscamos específicamente el span del texto
            const spanLabel = btn.querySelector('.label');

            if (spanLabel) {
                spanLabel.textContent = labelText;
            } else {
                // Fallback de seguridad por si alguna vez el DOM pierde el span
                btn.innerHTML = `
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1">
                      <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                      <polyline points="2 17 12 22 22 17"></polyline>
                      <polyline points="2 12 12 17 22 12"></polyline>
                    </svg>
                    <span class="label">${labelText}</span>
                `;
            }
        }

        this.refreshView();
    },

    resolveNombreEmpleado(codigo) {
        if (!codigo) return "Sin asignar";
        if (EmpleadoUtils.empleadosCache && Array.isArray(EmpleadoUtils.empleadosCache)) {
            const emp = EmpleadoUtils.empleadosCache.find(e => e.codigo == codigo);
            if (emp) return emp.nombreCompleto;
        }
        return `Colaborador (${codigo})`; // Fallback si no se ha cargado la lista aun
    },

    setBreadcrumbActive(anchorId) {
        const items = document.querySelectorAll("#secciones-casos .breadcrumb-item");
        items.forEach((li) => li.classList.remove("filtro-actual"));
        const anchor = document.getElementById(anchorId);
        const li = anchor?.closest("li");
        if (li) li.classList.add("filtro-actual");
    },

    async handleDomainSearch(query) {
        try {
            const dominios = await this.loadDominios();
            const q = (query || "").toString().toLowerCase().trim();
            const filtrados = q
                ? dominios.filter(d => d.codigo.toLowerCase().includes(q) || d.descripcion.toLowerCase().includes(q)).slice(0, 50)
                : dominios.slice(0, 20);
            this.renderDomainSuggestions(filtrados);
        } catch (error) {
            console.error("No se pudo cargar las sugerencias de dominios", error);
            this.hideDomainSuggestions();
        }
    },

    async handleSubdominioSearch(query, opts = {}) {
        const { forceSuggestions = false } = opts;
        const q = (query || "").toString().toLowerCase().trim();
        try {
            const subs = await this.loadSubdominios();
            if (!q) {
                if (forceSuggestions) {
                    this.renderSubdominioSuggestions(subs.slice(0, 50));
                } else {
                    // Sin texto: resetear selección y mostrar todos los subdominios
                    this.selectedSubdominio = null;
                    this.updateUrlParam("subdominio", null);
                    this.hideSubdominioSuggestions();
                    if (this.DATA_ORIGINAL.length === 0) {
                        await this.loadCasosDeUso();
                    } else {
                        this.render(this.applySubdominioFilter(this.DATA_ORIGINAL));
                    }
                }
                return;
            }
            const filtrados = subs.filter(s => s.nombre.toLowerCase().includes(q)).slice(0, 50);
            this.renderSubdominioSuggestions(filtrados);
        } catch (error) {
            console.error("No se pudo cargar las sugerencias de subdominios", error);
            this.hideSubdominioSuggestions();
        }
    },

    renderDomainSuggestions(lista) {
        const wrap = this.elements.domainSuggestions;
        if (!wrap) return;
        if (!lista || lista.length === 0) {
            wrap.innerHTML = "";
            wrap.style.display = "none";
            return;
        }

        wrap.innerHTML = lista.map(item => `
            <a href="#" class="list-group-item list-group-item-action" data-id="${item.id}">
                <strong>${item.codigo}</strong> - ${item.descripcion}
            </a>
        `).join("");

        wrap.querySelectorAll("a[data-id]").forEach(anchor => {
            anchor.addEventListener("click", (e) => {
                e.preventDefault();
                const id = anchor.getAttribute("data-id");
                const encontrado = lista.find(d => String(d.id) === String(id));
                if (encontrado) {
                    this.selectDominio(encontrado);
                }
            });
        });

        wrap.style.display = "block";
    },

    renderSubdominioSuggestions(lista) {
        const wrap = this.elements.subdominioSuggestions;
        if (!wrap) return;
        if (!lista || lista.length === 0) {
            wrap.innerHTML = "";
            wrap.style.display = "none";
            return;
        }
        wrap.innerHTML = lista.map(item => `
            <a href="#" class="list-group-item list-group-item-action" data-clave="${item.clave}">
                ${item.nombre}
            </a>
        `).join("");

        wrap.querySelectorAll("a[data-clave]").forEach(anchor => {
            anchor.addEventListener("click", (e) => {
                e.preventDefault();
                const clave = anchor.getAttribute("data-clave");
                const encontrado = lista.find(s => String(s.clave) === String(clave));
                if (encontrado) {
                    this.selectSubdominio(encontrado);
                }
            });
        });
        wrap.style.display = "block";
    },

    hideDomainSuggestions() {
        if (this.elements.domainSuggestions) {
            this.elements.domainSuggestions.style.display = "none";
        }
    },

    hideSubdominioSuggestions() {
        if (this.elements.subdominioSuggestions) {
            this.elements.subdominioSuggestions.style.display = "none";
        }
    },

    async selectDominio(dominio) {
        if (!dominio) return;
        this.idDominio = dominio.id;
        this.isDomainSelectionMode = false;
        this.searchMode = "caso";
        this.selectedSubdominio = null;
        if (this.elements.buscador) {
            this.elements.buscador.value = `${dominio.codigo} - ${dominio.descripcion}`;
            this.elements.buscador.placeholder = "Buscar por descripcion, estado o ID...";
        }
        this.syncSearchModeUi();
        this.hideDomainSuggestions();
        this.updateUrlParam("id_dominio", dominio.id);
        this.updateNavLinksWithDominio(dominio.id);
        await this.loadDominioInfo();
        await this.loadCasosDeUso();
    },

    async selectSubdominio(sub) {
        if (!sub) return;
        this.selectedSubdominio = sub.clave;
        this.searchMode = "subdominio";
        if (this.elements.buscador) {
            this.elements.buscador.value = sub.nombre;
            this.prepareCaseSearchUi();
        }
        this.hideSubdominioSuggestions();
        this.syncSearchModeUi();
        this.updateUrlParam("subdominio", this.encodeSubdominioParam(sub.clave));
        // Re-render con el filtro aplicado (sobre data cargada); si no hay data, recarga.
        if (this.DATA_ORIGINAL.length === 0) {
            await this.loadCasosDeUso();
        } else {
            this.render(this.applySubdominioFilter(this.DATA_ORIGINAL));
        }
    },

    async loadDominios() {
        if (this.dominiosCache.length > 0) return this.dominiosCache;

        const data = await ApiService.query({
            campos: "ID_DOMINIO as id, codigo_dominio as codigo, descripcion_dominio as descripcion, id_tipo_dominio",
            origen: "PROCESOS_BI.DBO.t_mapa_dominios",
            condicion: "1=1"
        });

        this.dominiosCache = data
            .map(d => ({
                id: d.id ?? d.ID_DOMINIO ?? d.id_dominio,
                codigo: (d.codigo ?? d.codigo_dominio ?? "").toString(),
                descripcion: (d.descripcion ?? d.descripcion_dominio ?? "").toString(),
                tipo_dominio: (() => {
                    const idTipo = Number(d.id_tipo_dominio);
                    if (idTipo === 1) return "Dominio Maestro";
                    if (idTipo === 2) return "Dominio Transaccional";
                    if (idTipo === 3) return "Dominio Derivado";
                    return "";
                })(),
                id_tipo_dominio: d.id_tipo_dominio
            }))
            .filter(d => d.id != null);

        return this.dominiosCache;
    },

    /**
     * Obtiene el id_dominio de los parámetros de la URL.
     * @returns {string} El ID del dominio o una cadena vací­a.
     */
    getIdDominioFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get("id_dominio") || "";
    },

    getSelectedSubdominioFromUrl() {
        const params = new URLSearchParams(window.location.search);
        const raw = params.get("subdominio") || null;
        if (!raw) return null;
        return raw === this.SUB_NULL_PARAM ? "__NULL__" : raw;
    },

    encodeSubdominioParam(valor) {
        return valor === "__NULL__" ? this.SUB_NULL_PARAM : valor;
    },

    getPreferredModeFromUrlOrReferrer() {
        const params = new URLSearchParams(window.location.search);
        const modeRaw = (params.get("mode") || params.get("view") || "").toLowerCase();
        if (["subdominio", "subdominios"].includes(modeRaw)) return "subdominio";
        const ref = (document.referrer || "").toLowerCase();
        if (ref.includes("librodominios.aspx")) return "subdominio";
        return "caso";
    },

    getAutoOpenConfigFromUrl() {
        const params = new URLSearchParams(window.location.search);
        const rawId = params.get("focus_caso") || params.get("id_caso_uso") || params.get("id_caso") || params.get("caso");
        if (!rawId) return null;
        const caseId = parseInt(rawId, 10);
        if (Number.isNaN(caseId)) return null;
        return {
            caseId,
            openSeguimiento: params.get("open_seguimiento") === "1",
            openReporte: params.get("open_reporte") === "1"
        };
    },

    /**
     * Carga la información del dominio y actualiza el tí­tulo en la cabecera.
     */
    async loadDominioInfo() {
        if (!this.idDominio) return;

        try {
            // Usamos la API para obtener la descripción del dominio por su ID.
            const dominioInfo = await ApiService.query({
                campos: "descripcion_dominio",
                origen: "PROCESOS_BI.DBO.t_mapa_dominios",
                condicion: `id_dominio = ${this.idDominio}`
            });

            if (dominioInfo.length > 0 && this.elements.nombreDominio) {
                const { descripcion_dominio, id } = dominioInfo[0];
                const nombreDelDominio = descripcion_dominio || '';

                // Actualiza el tí­tulo de la página
                this.elements.nombreDominio.textContent = nombreDelDominio;

                // Pre-carga el dominio en el modal de nuevo caso de uso
                const dominioSelect = document.getElementById('nc_dominio');
                if (dominioSelect) {
                    let option = dominioSelect.querySelector(`option[value="${id}"]`);
                    if (!option) {
                        option = document.createElement('option');
                        option.value = id;
                        option.textContent = nombreDelDominio;
                        dominioSelect.appendChild(option);
                    } else {
                        option.textContent = nombreDelDominio;
                    }
                    dominioSelect.value = id;
                    dominioSelect.dispatchEvent(new Event('change', { bubbles: true }));
                    if (window.jQuery) {
                        window.jQuery(dominioSelect).trigger('change');
                    }
                }
            }
        } catch (e) {
            console.error("Error al cargar la información del dominio:", e);
        }
    },

    async maybeAutoOpenCase() {
        if (this.autoOpenHandled || !this.autoOpenConfig?.caseId) {
            return;
        }
        this.autoOpenHandled = true;
        const { caseId, openReporte } = this.autoOpenConfig;
        try {
            if (openReporte && window.DetallesCasoWizard && typeof window.DetallesCasoWizard.requestAutoOpenReport === 'function') {
                window.DetallesCasoWizard.requestAutoOpenReport(true);
            }
            await this.showDetails(caseId);
        } catch (error) {
            console.warn("No se pudo abrir automáticamente el caso solicitado.", error);
        }
    },

    clearAutoOpenParamsFromUrl() {
        if (!window.history?.replaceState) return;
        try {
            const url = new URL(window.location.href);
            url.searchParams.delete("focus_caso");
            url.searchParams.delete("open_seguimiento");
            window.history.replaceState({}, document.title, url.toString());
        } catch (error) {
            console.warn("No se pudo limpiar los parámetros de auto apertura.", error);
        }
    },

    updateUrlParam(key, value) {
        if (!window.history?.replaceState) return;
        try {
            const url = new URL(window.location.href);
            if (value === null || value === undefined || value === "") {
                url.searchParams.delete(key);
            } else {
                url.searchParams.set(key, value);
            }
            window.history.replaceState({}, document.title, url.toString());
        } catch (error) {
            console.warn("No se pudo actualizar la URL:", error);
        }
    },

    updateNavLinksWithDominio(idDominio) {
        const links = {
            "a-dominio": "FichaDominio.aspx",
            "a-estructura": "Dominio_estructura.aspx",
            "a-artefactos": "Dominio_artefactos.aspx",
            "a-terminos": "Dominio_terminos_atributos.aspx",
            "a-metadatos": "Dominio_metadatos_linaje.aspx",
        };
        Object.entries(links).forEach(([id, base]) => {
            const anchor = document.getElementById(id);
            if (!anchor) return;
            if (idDominio) {
                const sep = base.includes("?") ? "&" : "?";
                anchor.href = `${base}${sep}id_dominio=${idDominio}`;
            } else {
                anchor.href = base;
            }
        });
        // El breadcrumb actual (casos) permanece en la página actual.
    },
    /**
     * Carga los casos de uso desde la API y los renderiza.
     */
    async loadCasosDeUso() {
        const condicion = this.idDominio
            ? `id_dominio = ${this.idDominio}`
            : "1=1";

        document.body.classList.add("show-spinner");
        try {
            // Aseguramos tener el mapa de dominios para etiquetar los grupos.
            const dominios = await this.loadDominios();
            this.dominiosMap = new Map(dominios.map(d => [Number(d.id), d]));

            this.DATA_ORIGINAL = await ApiService.query({
                campos: "*",
                origen: "PROCESOS_BI.DBO.t_casos_uso_analitica",
                condicion: condicion
            });
            // Si venimos con subdominio en URL, aplicarlo.
            if (this.selectedSubdominioFromUrl && !this.selectedSubdominio) {
                this.selectedSubdominio = this.selectedSubdominioFromUrl;
                this.updateUrlParam("subdominio", this.encodeSubdominioParam(this.selectedSubdominio));
                if (this.elements.buscador) {
                    this.elements.buscador.value = this.selectedSubdominio === "__NULL__" ? "Sin subdominio" : this.selectedSubdominio;
                }
            }
            this.render(this.applySubdominioFilter(this.DATA_ORIGINAL));
            this.syncSearchModeUi();
            await this.maybeAutoOpenCase();
        } catch (e) {
            console.error("Error al cargar casos de uso:", e);
            if (this.elements.grid) {
                this.elements.grid.innerHTML = `
                    <div class="card" style="padding:16px;">
                        <div class="text-danger mb-2"><strong>Error:</strong> No se pudo obtener la informacion.</div>
                        <div class="text-muted">Detalle: ${e?.message || e}</div>
                    </div>`;
            }
            this.updateResultCount(0);
        } finally {
            document.body.classList.remove("show-spinner");
            this.cargarContadoresEstados();
        }
    },

    /**
     * Calcula y renderiza los contadores de estado.
     * @param {Array} listaCasos - Tu arreglo de objetos con la información de casos de uso.
     */
    cargarContadoresEstados() {
        // 1. Obtenemos la data filtrada por texto y subdominio (pero SIN el filtro de estado)
        const q = (this.lastQuery || "").toString().toLowerCase().trim();
        let base = this.applySubdominioFilter(this.DATA_ORIGINAL);
        if (q) {
            base = base.filter(c => {
                const descripcion = (c.descripcion_caso_uso || "").toLowerCase();
                const estado = (c.estado_caso_uso || "").toLowerCase();
                const id = (c.id_caso_uso || "").toString();
                return descripcion.includes(q) || estado.includes(q) || id.includes(q);
            });
        }

        let conteo = { ingresado: 0, proceso: 0, calidad: 0, cerrado: 0 };

        if (base && base.length > 0) {
            base.forEach(caso => {
                const estadoRaw = (caso.estado_caso_uso || "").toString().toUpperCase().trim();
                if (this.isCerrado(estadoRaw)) {
                    conteo.cerrado++;
                } else if (this.isEnProceso(estadoRaw)) {
                    conteo.proceso++;
                } else if (this.isCalidad(estadoRaw)) {
                    conteo.calidad++;
                } else {
                    conteo.ingresado++;
                }
            });
        }

        // 2. Clases / Estilos dinámicos para saber cuál está seleccionado
        const opIngresado = (this.selectedStatusFilter && this.selectedStatusFilter !== 'INGRESADO') ? '0.4' : '1';
        const opProceso = (this.selectedStatusFilter && this.selectedStatusFilter !== 'PROCESO') ? '0.4' : '1';
        const opCalidad = (this.selectedStatusFilter && this.selectedStatusFilter !== 'EN CALIDAD') ? '0.4' : '1';
        const opCerrado = (this.selectedStatusFilter && this.selectedStatusFilter !== 'CERRADO') ? '0.4' : '1';

        const shadowIngresado = this.selectedStatusFilter === 'INGRESADO' ? 'box-shadow: 0 0 0 2px #444;' : '';
        const shadowProceso = this.selectedStatusFilter === 'PROCESO' ? 'box-shadow: 0 0 0 2px #444;' : '';
        const shadowCalidad = this.selectedStatusFilter === 'EN CALIDAD' ? 'box-shadow: 0 0 0 2px #444;' : '';
        const shadowCerrado = this.selectedStatusFilter === 'CERRADO' ? 'box-shadow: 0 0 0 2px #444;' : '';

        // 3. Generar HTML con cursor pointer y estilos
        const htmlContadores = `
    <button class="btn status-filter-btn cu-state--ingresado d-flex flex-column align-items-center justify-content-center mx-1 shadow-sm" data-status="INGRESADO" title="Filtrar Ingresados" style="cursor: pointer; opacity: ${opIngresado}; ${shadowIngresado}; padding: 4px 8px; border-radius: 8px; min-width: 90px;">
        <strong style="font-size: 1.2em; display: flex; align-items: center; gap: 6px;">
            <i class="simple-icon-login"></i> 
            ${conteo.ingresado}
        </strong>
        <span style="font-size: 0.8rem; font-weight: 500;">Ingresados</span>
    </button>
    
    <button class="btn status-filter-btn cu-state--proceso d-flex flex-column align-items-center justify-content-center mx-1 shadow-sm" data-status="PROCESO" title="Filtrar en Proceso" style="cursor: pointer; opacity: ${opProceso}; ${shadowProceso}; padding: 4px 8px; border-radius: 8px; min-width: 90px;">
        <strong style="font-size: 1.2em; display: flex; align-items: center; gap: 6px;">
            <i class="simple-icon-refresh"></i> 
            ${conteo.proceso}
        </strong>
        <span style="font-size: 0.8rem; font-weight: 500;">En Proceso</span>
    </button>
    
    <button class="btn status-filter-btn cu-state--calidad d-flex flex-column align-items-center justify-content-center mx-1 shadow-sm" data-status="EN CALIDAD" title="Filtrar en Calidad" style="cursor: pointer; opacity: ${opCalidad}; ${shadowCalidad}; padding: 4px 8px; border-radius: 8px; min-width: 90px;">
        <strong style="font-size: 1.2em; display: flex; align-items: center; gap: 6px;">
            <i class="simple-icon-pie-chart"></i> 
            ${conteo.calidad}
        </strong>
        <span style="font-size: 0.8rem; font-weight: 500;">En Calidad</span>
    </button>

    <button class="btn status-filter-btn cu-state--cerrado d-flex flex-column align-items-center justify-content-center mx-1 shadow-sm" data-status="CERRADO" title="Filtrar Cerrados" style="cursor: pointer; opacity: ${opCerrado}; ${shadowCerrado}; padding: 4px 8px; border-radius: 8px; min-width: 90px;">
        <strong style="font-size: 1.2em; display: flex; align-items: center; gap: 6px;">
            <i class="simple-icon-check"></i> 
            ${conteo.cerrado}
        </strong>
        <span style="font-size: 0.8rem; font-weight: 500;">Cerrados</span>
    </button>
`;

        const contenedor = document.getElementById('contenedor-contadores');
        if (contenedor) {
            contenedor.innerHTML = htmlContadores;

            // 4. Agregar listeners de click a cada span
            contenedor.querySelectorAll('.status-filter-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const status = e.currentTarget.getAttribute('data-status');

                    // Si hacemos clic en el filtro ya activo, lo apagamos; si no, lo encendemos.
                    if (this.selectedStatusFilter === status) {
                        this.selectedStatusFilter = null;
                    } else {
                        this.selectedStatusFilter = status;
                    }

                    // Refrescamos la UI aplicando el nuevo filtro
                    this.refreshView();
                });
            });
        }
    },

    /**
    * Renderiza un array de casos de uso en la grilla.
    * @param {Array<Object>} data - El array de casos de uso a renderizar.
    **/
    render(data, options = {}) {
        const { grid } = this.elements;
        if (!grid) return;

        // Manejo de estado vacío
        if (!data || data.length === 0) {
            grid.innerHTML = `
            <div class="text-center p-5" style="grid-column: 1 / -1; width: 100%;">
              <i class="iconsminds-empty-box" style="font-size: 3rem; color: #9ca3af;"></i>
              <h5 class="mt-3 mb-2">Sin casos de uso registrados</h5>
              <p class="text-muted">No se encontraron resultados con los filtros actuales.</p>
            </div>`;
            this.updateResultCount(0);
            this.cargarContadoresEstados();
            return;
        }

        const esc = (v) => String(v == null ? "" : v).replace(/[&<>"']/g, (m) => ({
            "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
        }[m]));

        if (this.groupMode === "subdominio" && !this.selectedSubdominio) {
            const normalizeSub = (s) => {
                const val = (s || "").toString().trim();
                return val || "Sin subdominio";
            };
            const gruposSub = data.reduce((acc, caso) => {
                const sub = normalizeSub(caso.SUBDOMINIO || caso.subdominio);
                if (!acc[sub]) acc[sub] = [];
                acc[sub].push(caso);
                return acc;
            }, {});
            const ordenSub = Object.keys(gruposSub).sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }));

            grid.innerHTML = `
              <div class="casos-grid">
                ${ordenSub.map(sub => {
                const count = gruposSub[sub].length;
                return `
                      <div class="cu-card-sub cu-card-sub--hover" data-sub="${esc(sub)}">
                        <div class="cu-header">
                          <div class="cu-icon"><i class="simple-icon-layers" title="Subdominio"></i></div>
                          <h5 class="cu-title" title="${esc(sub)}">${esc(sub)}</h5>
                        </div>
                        <div class="cu-status">
                          <span class="cu-state cu-state--ingresado">${count} caso${count === 1 ? "" : "s"}</span>
                        </div>
                      </div>
                    `;
            }).join("")}
              </div>
            `;
            this.updateResultCount(ordenSub.length);
            this.cargarContadoresEstados();
            return;
        }

        const grupos = this.agruparDatos(data);
        const ordenGrupos = Object.keys(grupos).sort((a, b) => {
            const aEsSin = a.startsWith("Sin ");
            const bEsSin = b.startsWith("Sin ");
            if (aEsSin && !bEsSin) return 1;
            if (!aEsSin && bEsSin) return -1;
            return a.localeCompare(b, "es", { sensitivity: "base" });
        });

        // 3. Generar HTML
        grid.innerHTML = ordenGrupos.map(groupName => `
        <div class="cu-group">
          <div class="cu-group__header">
            <div class="cu-group__title">${esc(groupName)}</div>
            <span class="cu-group__count">${grupos[groupName].length} caso${grupos[groupName].length === 1 ? "" : "s"}</span>
          </div>
          <div class="casos-grid cu-group__grid">
            ${grupos[groupName].map(caso => this.getCardTemplate(caso)).join("")}
          </div>
        </div>
    `).join("");

        this.updateResultCount(data.length);
        this.cargarContadoresEstados();
    },


    refreshView() {
        const datosFiltrados = this.filterData(this.lastQuery);
        const forceCases = (this.lastQuery || "").trim().length > 0;
        this.render(datosFiltrados, { forceCases });
    },

    async handleSearchInput(value) {
        const query = value ?? "";
        this.lastQuery = query; // Guardamos el estado
        if (this.isDomainSelectionMode) {
            await this.handleDomainSearch(query);
            return;
        }
        if (this.searchMode === "subdominio") {
            await this.handleSubdominioSearch(query);
            this.refreshView();
            return;
        }
        this.refreshView();
    },

    /**
     * Genera el HTML para una tarjeta de caso de uso.
     * @param {Object} caso - El objeto del caso de uso.
     * @returns {string} El string HTML de la tarjeta.
     */
    getCardTemplate(caso) {
        const titulo = caso.descripcion_caso_uso || "Sin descripción";
        const id = caso.id_caso_uso ?? "-";
        const estadoRaw = (caso.estado_caso_uso || "-").toString().trim().toUpperCase();
        const { stateClass, stateLabel } = this.getEstadoBadge(estadoRaw);
        let hoverClass = "";
        if (this.isCerrado(estadoRaw)) {
            hoverClass = " cu-card--hover-green";
        }
        else if (this.isEnProceso(estadoRaw)) {
            hoverClass = " cu-card--hover";
        }
        else if (this.isCalidad(estadoRaw)) {
            hoverClass = " cu-card--hover-blue";
        }
        // Usamos data-id para el event listener delegado
        return `
            <div class="cu-card${hoverClass}" data-id="${id}">
              <div class="cu-header">
                <div class="cu-icon"><i class="simple-icon-folder" title="Caso #${id}"></i></div>
                <h5 class="cu-title" title="${titulo}">${titulo}</h5>
              </div>
              <div class="cu-status">
                <span class="${stateClass}" title="Estado">${stateLabel}</span>
              </div>
            </div>
          `;
    },

    getEstadoBadge(estadoRaw = "") {
        const estado = estadoRaw.toString().toUpperCase().trim();

        if (this.isCerrado(estado)) {
            return { stateClass: "cu-state cu-state--cerrado", stateLabel: estado || "CERRADO" };
        }

        if (this.isEnProceso(estado)) {
            return { stateClass: "cu-state cu-state--proceso", stateLabel: estado || "EN PROCESO" };
        }

        if (this.isCalidad(estado)) {
            return { stateClass: "cu-state cu-state--calidad", stateLabel: estado || "EN CALIDAD" };
        }

        return { stateClass: "cu-state cu-state--ingresado", stateLabel: estado || "INGRESADO" };
    },

    isCerrado(estadoRaw) {
        const estado = (estadoRaw || "").toString().toUpperCase();
        return estado === "CERRADO" || estado === "FINALIZADO";
    },

    isEnProceso(estadoRaw) {
        const estado = (estadoRaw || "").toString().toUpperCase();
        return estado.includes("PROCESO")
    },


    isCalidad(estadoRaw) {
        const estado = (estadoRaw || "").toString().toUpperCase();
        return estado.includes("CALIDAD")
    },

    /**
     * Filtra los datos de casos de uso basándose en una consulta y en su estado.
     * @param {string} query - El término de búsqueda.
     * @returns {Array<Object>} Un array con los casos de uso filtrados.
     */
    filterData(query) {
        const q = (query || "").toString().toLowerCase().trim();
        // 1. Aplicamos el filtro de Subdominio (si existe)
        let base = this.applySubdominioFilter(this.DATA_ORIGINAL);

        // 2. Aplicamos el filtro de texto 
        if (q) {
            base = base.filter(c => {
                const descripcion = (c.descripcion_caso_uso || "").toLowerCase();
                const estado = (c.estado_caso_uso || "").toLowerCase();
                const id = (c.id_caso_uso || "").toString();
                return descripcion.includes(q) || estado.includes(q) || id.includes(q);
            });
        }

        // 3. NUEVO: Aplicamos el filtro de estado si hicimos clic en un contador
        if (this.selectedStatusFilter) {
            base = base.filter(c => {
                const estadoRaw = (c.estado_caso_uso || "").toString().toUpperCase().trim();
                if (this.selectedStatusFilter === 'CERRADO') return this.isCerrado(estadoRaw);
                if (this.selectedStatusFilter === 'PROCESO') return this.isEnProceso(estadoRaw);
                if (this.selectedStatusFilter === 'EN CALIDAD') return this.isCalidad(estadoRaw);
                // Si no es cerrado ni proceso, asumimos ingresado
                return !this.isCerrado(estadoRaw) && !this.isEnProceso(estadoRaw) && !this.isCalidad(estadoRaw);
            });
        }
        return base;
    },

    /**
    * Transforma una lista plana de casos en un objeto agrupado.
    * @param {Array} lista - Lista de casos ya filtrados.
    * @returns {Object} - Objeto con claves (nombre grupo) y valores (array de casos).
    */
    agruparDatos(lista) {
        return lista.reduce((acc, caso) => {
            let keyDisplay = "";
            //let keySort = ""; Opcional por si hay ordenar por algo distinto al nombre
            switch (this.groupMode) {
                case "especialista":
                    const codEsp = caso.cod_especialista;
                    keyDisplay = codEsp ? this.resolveNombreEmpleado(codEsp) : "Sin Especialista Asignado";
                    break;
                case "sponsor":
                    const codSpon = caso.cod_sponsor;
                    keyDisplay = codSpon ? this.resolveNombreEmpleado(codSpon) : "Sin Sponsor Asignado";
                    break;
                case "estado":
                    keyDisplay = (caso.estado_caso_uso || "SIN ESTADO").toUpperCase();
                    break;
                case "subdominio":
                default:
                    // Normalizar subdominio
                    const sub = (caso.SUBDOMINIO || caso.subdominio || "").trim();
                    keyDisplay = sub || "Sin subdominio";
                    break;
            }

            if (!acc[keyDisplay]) acc[keyDisplay] = [];
            acc[keyDisplay].push(caso);
            return acc;
        }, {});
    },

    applySubdominioFilter(data) {
        if (!this.selectedSubdominio) return data;
        return data.filter(caso => {
            const sub = (caso.SUBDOMINIO || caso.subdominio || "").trim();
            if (this.selectedSubdominio === "__NULL__") {
                return sub === "";
            }
            return sub.toLowerCase() === this.selectedSubdominio.toLowerCase();
        });
    },

    async loadSubdominios() {
        if (this.subdominiosCache.length > 0 && this._subdominiosCacheDominio === this.idDominio) {
            return this.subdominiosCache;
        }
        try {
            const condicion = this.idDominio
                ? `ID_DOMINIO = ${Number(this.idDominio)}`
                : "1=1";
            const data = await ApiService.query({
                campos: "DISTINCT SUBDOMINIO, ID_DOMINIO",
                origen: "PROCESOS_BI.DBO.t_casos_uso_analitica",
                condicion
            });
            const lista = (data || []).map(d => (d.SUBDOMINIO || d.subdominio || "").toString());
            const unicos = Array.from(new Set(lista));
            const parsed = [
                { nombre: "Sin subdominio", clave: "__NULL__" },
                ...unicos
                    .filter(s => s.trim() !== "")
                    .map(s => ({ nombre: s.trim(), clave: s.trim() }))
            ];
            this.subdominiosCache = parsed;
            this._subdominiosCacheDominio = this.idDominio;
            return parsed;
        } catch (error) {
            console.error("Error cargando subdominios:", error);
            return [];
        }
    },

    /**
     * Muestra el modal de detalles para un caso de uso especí­fico.
     * @param {string|number} id - El ID del caso de uso.
     */
    async showDetails(id) {
        try {
            // Realiza una nueva consulta a la API para obtener los datos más frescos.
            const casos = await ApiService.query({
                campos: "*",
                origen: "PROCESOS_BI.DBO.t_casos_uso_analitica",
                condicion: `ID_CASO_USO = ${id}`
            });
            const caso = casos[0];
            console.log("[CasosDeUso] Datos obtenidos para detalle:", { idSolicitado: id, casos, caso });
            if (!caso) {
                alert("No se encontraron detalles para este caso de uso.");
                return;
            }

            // TODO: agregar referencia al nuevo campo para el tipo de iniciativa
            registrar_visita("CASOS DE USO", `Detalles del caso de uso: ${id}`);
            // Llenar los datos en los campos del modal de detalles
            $('#detalle-id').val(caso.id_caso_uso ?? "");
            $('#detalle-descripcion').val(caso.descripcion_caso_uso ?? "");
            $('#detalle-estado').val(caso.estado_caso_uso ?? "ABIERTO");
            $('#detalle-activo').val(caso.sn_activo ? "1" : "0");
            $('#detalle-tipo').val(caso.tipo_iniciativa ?? "BAU");
            $('#detalle-especialista').val(caso.cod_especialista ?? "");
            $('#detalle-sponsor').val(caso.cod_sponsor ?? "");
            $('#detalle-ingeniero').val(caso.cod_ingeniero_responsable ?? "");
            $('#detalle-detalle_caso_uso').val(caso.detalle_caso_uso || '');
            $('#detalle-entregable_caso_uso').val(caso.entregable_caso_uso || '');
            const subdominioValor = (caso.SUBDOMINIO || '').trim();
            $('#detalle-subdominio').val(subdominioValor);

            // Cargar y mostrar el nombre del dominio
            if (caso.id_dominio) {
                $('#detalle-dominio-nombre').attr('data-id-dominio', caso.id_dominio);
            }
            // Mostrar el modal (asumiendo que el wizard de detalles se inicializa en el evento 'show.bs.modal')
            $("#modalDetallesCaso").modal("show");
        } catch (error) {
            console.error("Error al cargar los detalles del caso de uso:", error);
            alert("Error al cargar los detalles. Revisa la consola para más información.");
        }
    },

    /**
     * Actualiza el contador de resultados en la UI.
     * @param {number} count - El número de resultados.
     */
    updateResultCount(count) {
        if (this.elements.badgeCount) {
            this.elements.badgeCount.textContent = `${count} resultado${count === 1 ? "" : "s"}`;
        }
    },

    /**
     * Expone la función de recarga para que pueda ser llamada desde otros módulos.
     */
    refrescar() {
        return this.loadCasosDeUso();
    }
};

// --- INICIALIZACIÓN ---

// Inicializa la aplicación principal cuando el DOM está listo.
document.addEventListener("DOMContentLoaded", () => {
    CasosDeUsoApp.init();
});

// Expone la función de refresco globalmente para que otros scripts (como los de guardado en modales) puedan llamarla.
window.refrescarCasosUso = () => CasosDeUsoApp.loadCasosDeUso();

