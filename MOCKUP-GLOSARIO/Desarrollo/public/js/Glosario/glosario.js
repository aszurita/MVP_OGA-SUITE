const GlosarioApp = {
    dictCache: {},
    regexSeguro: null,

    init: async function () {
        // 1. Esperamos a que todos los diccionarios y relaciones SQL estén listos
        await this.precargarMapaDominios();

        if (typeof listenerbtnAddAtributo === 'function') listenerbtnAddAtributo();

        const dataGlosario = typeof TerminosService !== 'undefined' ? await TerminosService.getTerminosAll() : { todos: [] };
        console.log("GlosarioApp.init() -> términos total:", dataGlosario.todos?.length);

        window.glosario = dataGlosario;
        window.aux = typeof sortGlosario === 'function' ? sortGlosario(dataGlosario.todos) : dataGlosario.todos;
        window.currentGlosarioView = 'card';

        this.buildDictionary();

        // Sobrescribimos las variables globales
        window.printSearchResults = this.printSearchResults.bind(this);
        window.template = this.template.bind(this);
        window.linkifyDescription = this.linkifyDescription.bind(this);

        this.setupGlosarioViews();
        this.printSearchResults(dataGlosario.todos, { skipUrlFilter: true });

        this.setupCardActions();

        if (typeof autocompletado === 'function') {
            autocompletado(document.getElementById("glosario-search"), "nombre", dataGlosario.todos);
        }

        if (typeof registrar_visita === 'function') registrar_visita("INDICE", "GLOSARIO EMPRESARIAL DE DATOS");
        if (typeof estandarizarSegmentacion === 'function') estandarizarSegmentacion();
        if (typeof aplicarBusquedaGlosarioDesdeUrl === 'function') aplicarBusquedaGlosarioDesdeUrl();

        this.renderMenuDominios();
        this.renderMenuRecientes(10);
        this.habilitarCopiaHTMLGlosario();
    },

    setupCardActions: function () {
        // Botón Copiar Tarjeta
        $(document).off('click', '.glosario-btn-copy').on('click', '.glosario-btn-copy', function (e) {
            e.preventDefault();
            const tarjeta = $(this).closest('.glosario-item')[0];
            if (!tarjeta) return;

            const clone = tarjeta.cloneNode(true);
            const dropdownBotones = clone.querySelector('.position-absolute');
            if (dropdownBotones) dropdownBotones.remove();
            const formEdicion = clone.querySelector('.glosario-item-edit');
            if (formEdicion) formEdicion.remove();

            const htmlLimpio = clone.outerHTML;
            const textoPlano = tarjeta.innerText;

            const dummy = document.createElement('div');
            dummy.contentEditable = true;

            dummy.style.position = 'fixed';
            dummy.style.top = '0';
            dummy.style.left = '0';
            dummy.style.opacity = '0';

            document.body.appendChild(dummy);
            dummy.focus();

            const listener = function (ev) {
                ev.clipboardData.setData("text/html", htmlLimpio);
                ev.clipboardData.setData("text/plain", textoPlano);
                ev.preventDefault();
            };
            document.addEventListener("copy", listener);
            document.execCommand("copy");
            document.removeEventListener("copy", listener);

            document.body.removeChild(dummy);

            if (typeof showNotification === 'function') {
                showNotification("top", "center", "success", "Tarjeta copiada al portapapeles.", 1500);
            }
        });

        // Botón Compartir Término
        $(document).off('click', '.glosario-btn-share').on('click', '.glosario-btn-share', function (e) {
            e.preventDefault();
            const nombre = $(this).attr('data-nombre');

            const baseUrl = window.location.href.split('?')[0];
            const shareUrl = baseUrl + "?buscar=" + encodeURIComponent(nombre);

            const dummy = document.createElement('input');

            dummy.style.position = 'fixed';
            dummy.style.top = '0';
            dummy.style.left = '0';
            dummy.style.opacity = '0';

            document.body.appendChild(dummy);
            dummy.value = shareUrl;
            dummy.select();
            document.execCommand('copy');
            document.body.removeChild(dummy);

            if (typeof showNotification === 'function') {
                showNotification("top", "center", "success", "Enlace compartido copiado al portapapeles.", 1500);
            }
        });
    },

    buildDictionary: function () {
        console.log("Construyendo diccionario de enlaces cruzados...");
        const todos = window.glosario?.todos || window.aux || [];

        if (!todos || todos.length === 0) return;

        const nombres = [];
        todos.forEach(item => {
            const nombre = (item.nombre || "").replaceAll('<br>', '').trim();
            const desc = item.descripcion || "Ver definición";

            if (nombre.length > 3) {
                nombres.push(nombre);
                this.dictCache[nombre.toLowerCase()] = desc;
                this.dictCache[nombre.toLowerCase() + "_name"] = nombre;
            }
        });

        if (nombres.length === 0) return;

        nombres.sort((a, b) => b.length - a.length);

        const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const nombresEscapados = nombres.map(escapeRegExp);

        const regexStr = '(?<=^|[^\\p{L}\\p{N}])(' + nombresEscapados.join('|') + ')(?=[^\\p{L}\\p{N}]|$)';
        this.regexSeguro = new RegExp(regexStr, 'giu');

        console.log(`Diccionario construido exitosamente con ${nombres.length} términos.`);
    },

    linkifyDescription: function (descripcion, currentTermName) {
        if (!descripcion || !this.regexSeguro) return descripcion || 'Sin descripción disponible.';

        return descripcion.replace(this.regexSeguro, (match) => {
            let lowerMatch = match.toLowerCase();

            if (currentTermName && lowerMatch === currentTermName.toLowerCase()) return match;

            let termDesc = this.dictCache[lowerMatch];
            let exactName = this.dictCache[lowerMatch + "_name"];

            if (!termDesc) return match;

            termDesc = termDesc.replace(/<[^>]*>?/gm, '').replace(/"/g, '&quot;');
            if (termDesc.length > 180) termDesc = termDesc.substring(0, 177) + '...';

            return `<span class="glosario-crosslink badge badge-light" data-termino="${exactName || match}" data-toggle="tooltip" title="${termDesc}">${match}</span>`;
        });
    },

    precargarMapaDominios: async function () {
        window.mapaDominiosSubdominios = window.mapaDominiosSubdominios || new Map();
        window.diccionarioCasosUso = window.diccionarioCasosUso || {};
        window.mapaTerminoCasosUso = window.mapaTerminoCasosUso || new Map();
        window.mapaCasoUsoDominio = window.mapaCasoUsoDominio || {};

        try {
            const [dominiosData, casosUsoData, relacionesData] = await Promise.all([
                ApiService.query({
                    campos: "id_dominio, descripcion_dominio",
                    origen: "PROCESOS_BI.DBO.t_mapa_dominios",
                    condicion: "1=1"
                }),
                ApiService.query({
                    campos: "id_caso_uso, descripcion_caso_uso, id_dominio",
                    origen: "PROCESOS_BI.DBO.t_casos_uso_analitica",
                    condicion: "descripcion_caso_uso IS NOT NULL AND descripcion_caso_uso != ''"
                }),
                ApiService.query({
                    campos: "id_caso_uso, cod_terminos",
                    origen: "PROCESOS_BI.DBO.t_casos_uso_terminos_mb",
                    condicion: "sn_activo = 1"
                })
            ]);

            const mapIdToNameDominio = new Map();

            if (dominiosData) {
                dominiosData.forEach(d => {
                    const nombreDom = (d.descripcion_dominio || "").trim();
                    if (nombreDom) {
                        window.mapaDominiosSubdominios.set(nombreDom, []);
                        mapIdToNameDominio.set(d.id_dominio, nombreDom);
                    }
                });
            }

            if (casosUsoData) {
                casosUsoData.forEach(item => {
                    const idCaso = item.id_caso_uso;
                    const nombreCaso = (item.descripcion_caso_uso.trim() || "").trim();
                    if (idCaso !== undefined && idCaso !== null && nombreCaso) {
                        window.diccionarioCasosUso[idCaso.toString()] = nombreCaso;

                        if (item.id_dominio && mapIdToNameDominio.has(item.id_dominio)) {
                            window.mapaCasoUsoDominio[idCaso.toString()] = mapIdToNameDominio.get(item.id_dominio);
                        }
                    }
                });
            }

            if (relacionesData) {
                relacionesData.forEach(rel => {
                    const idTermino = String(rel.cod_terminos).trim();
                    const idCasoUso = String(rel.id_caso_uso).trim();

                    if (!window.mapaTerminoCasosUso.has(idTermino)) {
                        window.mapaTerminoCasosUso.set(idTermino, []);
                    }
                    window.mapaTerminoCasosUso.get(idTermino).push(idCasoUso);
                });
            }

        } catch (error) {
            console.error("Error al precargar Dominios y Casos de Uso:", error);
        }
    },

    setupGlosarioViews: function () {
        const btnCard = document.getElementById('glosario-card-view');
        const btnList = document.getElementById('glosario-list-view');
        if (!btnCard || !btnList) return;

        btnCard.addEventListener('click', () => {
            window.currentGlosarioView = 'card';
            btnCard.classList.replace('text-semi-muted', 'text-primary');
            btnList.classList.replace('text-primary', 'text-semi-muted');
            this.printSearchResults(window.currentTerminosSearch || window.glosario.todos, { skipUrlFilter: true });
        });

        btnList.addEventListener('click', () => {
            window.currentGlosarioView = 'list';
            btnList.classList.replace('text-semi-muted', 'text-primary');
            btnCard.classList.replace('text-primary', 'text-semi-muted');
            this.printSearchResults(window.currentTerminosSearch || window.glosario.todos, { skipUrlFilter: true });
        });
    },

    printSearchResults: function (resultados, options = {}) {
        window.currentTerminosSearch = resultados;
        const { skipUrlFilter = false } = options;
        const rawBuscar = skipUrlFilter ? null : (typeof getParams === 'function' ? getParams("buscar") : null);
        const parametroBusqueda = rawBuscar ? rawBuscar.replace(/\+/g, " ") : rawBuscar;

        if (parametroBusqueda && typeof calcularSimilitud === 'function') {
            resultados = resultados.filter(e => calcularSimilitud(e.nombre, parametroBusqueda) > 80)
        }

        const sortedResults = typeof sortGlosario === 'function' ? sortGlosario(resultados.slice()) : resultados.slice();
        window.glosarioExportData = sortedResults.slice();

        if (typeof updateGlosarioCount === 'function') updateGlosarioCount(sortedResults.length);

        const self = this;

        $('.pagination').pagination({
            dataSource: sortedResults,
            pageSize: 10,
            className: 'paginationjs-theme-bg',
            showSizeChanger: true,
            afterRender: function () {
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
            },
            callback: function (data, pagination) {
                let html = self.template(data, pagination.pageSize, window.currentGlosarioView);
                if (!data || data.length === 0) {
                    $("#resultados").html(`
                      <div class="card text-center p-4 my-3 shadow-sm" style="border: 1px solid #D0D0D0; background: #ffffff;">
                        <h5 class="mt-2 mb-1" style="font-weight: 600;">No se encontraron resultados</h5>
                      </div>`);
                } else {
                    $("#resultados").html(html);
                }
            }
        });
    },

    // 🌟🌟🌟 FUNCION TEMPLATE ACTUALIZADA 🌟🌟🌟
    template: function (datos, pagina, tipoVista = 'card') {
        let html = tipoVista === 'card' ? '<div class="glosario-grid">' : '<div>';
        let contador = 1;
        let separador = '<div class="separator mb-4 mt-4"></div>';

        let opcionesDominioHtml = '<option label="&nbsp;" value=""></option>';
        if (window.mapaDominiosSubdominios && window.mapaDominiosSubdominios.size > 0) {
            Array.from(window.mapaDominiosSubdominios.keys()).forEach(dom => {
                opcionesDominioHtml += `<option value="${dom}">${dom}</option>`;
            });
        }

        let opcionesCasosUsoHtml = '<option label="&nbsp;" value=""></option>';
        if (window.diccionarioCasosUso) {
            Object.entries(window.diccionarioCasosUso).forEach(([id, nombre]) => {
                opcionesCasosUsoHtml += `<option value="${id}">${nombre}</option>`;
            });
        }

        const iconos = {
            "Impacto en procesos": '<i class="iconsminds-gears"></i>',
            "Impacto en negocio / reputacional": '<i class="simple-icon-eye"></i>',
            "Impacto económico": '<i class="iconsminds-dollar"></i>',
            "Impacto regulatorio": '<i class="iconsminds-police-station"></i>'
        };

        const self = this;

        $.each(datos, function (index, item) {
            let atributos = undefined;
            let atr_html = '';

            // Renderizado de características e íconos
            if (item.caracteristicas) {
                atributos = item.caracteristicas.split("; ");
                let CDE = atributos.indexOf("(CDE) Elemento clave de datos");
                let AR = atributos.indexOf("(AR) Atributo de Referencia");
                if (AR >= 0 && CDE >= 0) {
                    let temp = atributos.toSpliced(CDE, 1);
                    temp.unshift("(CDE) Elemento clave de datos");
                    atributos = temp;
                }
                for (let n = 0; n < atributos.length; n++) {
                    if (atributos[n].includes("CDE")) {
                        if (atributos[n].includes("(")) {
                            atributos[n] = atributos[n].split(" ")[0].replace("(", "").replace(")", "");
                            atr_html += '<span class="badge badge-pill badge-secondary atributo caracteristica" title="Critical Data Element">' + atributos[n] + '</span>';
                        } else {
                            atr_html += '<span class="badge badge-pill badge-secondary atributo" title="' + atributos[n] + '">' + iconos[atributos[n]] + '</span>';
                        }
                    } else {
                        if (atributos[n].includes("(")) {
                            atributos[n] = atributos[n].split(" ")[0].replace("(", "").replace(")", "");
                            atr_html += '<span class="badge badge-pill badge-secondary atributo caracteristica" title="Atributo de Referencia">' + atributos[n] + '</span>';
                        } else {
                            atr_html += '<span class="badge badge-pill badge-secondary atributo" title="' + atributos[n] + '">' + iconos[atributos[n]] + '</span>';
                        }
                    }
                }
            }

            let datoPersonal = parseInt(item.dato_personal);
            if (datoPersonal > 0) {
                let { data, subsegmentos } = getSegmentos();
                let complementoTooltip = ` - ${subsegmentos[3][datoPersonal].label}`;
                let tooltip = `Dato personal${datoPersonal > 1 ? complementoTooltip : ""} `;
                atr_html += `<span class="badge badge-pill badge-secondary atributo" title="${tooltip}"><i class="iconsminds-business-man"></i></span>`;
            }

            if (item.golden_record == 1 || item.golden_record === true || item.golden_record === "1") {
                atr_html += '<span class="badge badge-pill badge-secondary atributo" title="Golden Record"><i class="simple-icon-diamond"></i></span>';
            }

            const tipoRaw = (item.tipo || "").toUpperCase();
            const spId = item.id || "";
            const metadId = item.id || spId;

            const rawDate = item.fecha_modificacion || item.fecha_creacion;
            const fechaAct = rawDate ? rawDate.split('T')[0].split(' ')[0] : 'No disponible';

            // 🌟🌟 LÓGICA DE DOMINIOS Y CASOS DE USO MEJORADA 🌟🌟
            const casosUsoIds = window.mapaTerminoCasosUso?.get(String(metadId)) || [];

            let dominiosHeredados = [];

            // Construimos la data para el Tooltip (Nombre CU + Dominio)
            let casoUsoTooltipData = casosUsoIds.map(id => {
                let nombreCaso = window.diccionarioCasosUso[id];
                if (!nombreCaso) return null;

                // Buscamos el dominio heredado
                let dominioDelCaso = window.mapaCasoUsoDominio ? window.mapaCasoUsoDominio[id.toString()] : null;
                if (dominioDelCaso) {
                    dominiosHeredados.push(dominioDelCaso);
                }

                // Formato para el tooltip: "Nombre de CU <i>(Dominio)</i>"
                return dominioDelCaso ? `${nombreCaso} <i style="color:#e0e0e0; font-size:0.9em;">(${dominioDelCaso})</i>` : nombreCaso;
            }).filter(Boolean);

            let casoUsoHtml = '';
            if (casoUsoTooltipData.length > 0) {
                // Ordenamos alfabéticamente para el tooltip
                casoUsoTooltipData.sort((a, b) => a.localeCompare(b));
                const textoTooltip = casoUsoTooltipData.join('<br>');

                // Para el texto plano (visible en la tarjeta), solo mostramos los nombres limpios
                let plainNames = casosUsoIds.map(id => window.diccionarioCasosUso[id]).filter(Boolean).sort((a, b) => a.localeCompare(b));
                const textoPlano = plainNames.join(' | ');

                const limiteCaracteres = 60;
                let textoVisible = textoPlano;
                if (textoPlano.length > limiteCaracteres) {
                    textoVisible = textoPlano.substring(0, limiteCaracteres).trim() + '...';
                }

                casoUsoHtml = ` <span class="mb-0 glosario-caso-uso" data-caso-id="${casosUsoIds.join(';')}" data-toggle="tooltip" data-placement="top" data-html="true" title="${textoTooltip.replace(/"/g, '&quot;')}" style="font-size: 0.85rem; color: #6c757d !important; cursor: help;">| ${textoVisible}</span>`;
            }

            // Unificamos dominios directos + dominios heredados usando un SET para evitar duplicados
            let dominiosDirectos = (item.dominios || "").split(';').map(d => d.trim()).filter(Boolean);
            let todosLosDominios = new Set([...dominiosDirectos, ...dominiosHeredados]);
            let domainValue = Array.from(todosLosDominios).join(" | ") || "Sin dominio";

            // Guardamos la string plana original para el modal de edición (para que no rompa el select múltiple)
            const dbDominio = (item.dominios || '').replace(/"/g, '&quot;');
            const dbCasoUso = casosUsoIds.join(';');

            // 🌟🌟 FIN LÓGICA DE DOMINIOS 🌟🌟

            let titulo = '';
            if (tipoRaw === "ATRIBUTO") {
                titulo = '<a href="Ficha_Atributo.aspx?atributo=' + item.id + '" class="list-item-heading color-theme-1 link_subrrayado" style="font-size: 1.1rem; font-weight: bold;">' + (item.nombre || "").replaceAll('<br>', '') + '</a>';
            } else {
                titulo = `<p class="list-item-heading mb-0 mr-2" style="font-size: 1rem; font-weight: bold; color: #D2006E ">${(item.nombre || "").replaceAll('<br>', '')}</p>`;
            }

            const nombreLimpio = (item.nombre || "").replaceAll('<br>', '');
            const topActionPos = tipoVista === 'card' ? '15px' : '0px';
            const rightActionPos = tipoVista === 'card' ? '15px' : '10px';

            const isOgaUser = (typeof isOGA === "function" && isOGA());
            const optionsMenu = isOgaUser ? `
                <div class="dropdown">
                    <button class="btn btn-empty p-0" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="simple-icon-options-vertical" style="color: #6c757d;"></i>
                    </button>
                    <div class="dropdown-menu dropdown-menu-right glosario-item-actions" data-id="${spId}" data-type="${tipoRaw}">
                        <button class="dropdown-item glosario-btn-editar" type="button" data-id="${spId}" data-type="${tipoRaw}">
                            <i class="simple-icon-pencil mr-2"></i> Editar término
                        </button>
                        <button class="dropdown-item text-success glosario-btn-guardar" type="button" disabled>
                            <i class="simple-icon-check mr-2"></i> Guardar cambios
                        </button>
                        <button class="dropdown-item text-danger glosario-btn-cancelar" type="button" disabled>
                            <i class="simple-icon-close mr-2"></i> Cancelar edición
                        </button>
                        <div class="dropdown-divider"></div>
                        <button class="dropdown-item text-danger glosario-btn-eliminar" type="button">
                            <i class="simple-icon-trash mr-2"></i> Eliminar registro
                        </button>
                    </div>
                </div>` : '';

            const actions = `
            <div class="position-absolute d-flex align-items-center" style="top: ${topActionPos}; right: ${rightActionPos}; z-index: 10; gap: 10px;">
                <button class="btn btn-empty p-0 glosario-btn-copy" type="button" title="Copiar Tarjeta" aria-label="Copiar Tarjeta">
                    <i class="simple-icon-docs" style="color: #6c757d; font-size: 0.7rem; line-height: 1;"></i>
                </button>
                <button class="btn btn-empty p-0 glosario-btn-share" type="button" title="Compartir Enlace" data-nombre="${nombreLimpio.replace(/"/g, '&quot;')}">
                    <i class="simple-icon-share" style="color: #6c757d; font-size: 0.7rem; line-height: 1;"></i>
                </button>
                ${optionsMenu}
            </div>`;

            const formEditHtml = `
            <div class="glosario-item-edit p-3 mt-3 bg-light" data-id="${spId}" style="display:none; border: 1px solid #d7d7d7;">
                <div class="form-row">
                    <div class="form-group col-md-6">
                        <label class="font-weight-bold">Nombre</label>
                        <input type="text" class="form-control" data-field="nombre" value="${(item.nombre || '').replaceAll('<br>', '')}">
                    </div>
                    <div class="form-group col-md-6">
                        <label class="font-weight-bold">Tipo</label>
                        <select class="form-control" data-field="tipo">
                            <option value="ATRIBUTO" ${tipoRaw === "ATRIBUTO" ? 'selected' : ''}>ATRIBUTO</option>
                            <option value="TERMINO" ${tipoRaw === "TERMINO" ? 'selected' : ''}>TERMINO</option>
                            <option value="ATRIBUTO/TERMINO" ${tipoRaw === "ATRIBUTO/TERMINO" ? 'selected' : ''}>ATRIBUTO/TERMINO</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group col-md-6">
                        <label class="font-weight-bold">Dominio</label>
                        <select class="form-control edit-select-dominio" multiple="multiple" data-field="dominio" data-valores="${dbDominio}">
                            ${opcionesDominioHtml}
                        </select>
                    </div>
                    <div class="form-group col-md-6">
                      <label class="font-weight-bold">Caso de Uso</label>
                      <select class="form-control edit-select-caso-uso" multiple="multiple" data-field="caso_uso" data-valores="${dbCasoUso}">
                            ${opcionesCasosUsoHtml}
                      </select>
                    </div>
                </div>
                <div class="form-group mb-0">
                    <label class="font-weight-bold">Descripción</label>
                    <textarea class="form-control" data-field="descripcion" rows="3">${(item.descripcion || '')}</textarea>
                </div>
            </div>`;

            let textDescripcion = item.descripcion || 'Sin descripción disponible.';
            if (typeof self.linkifyDescription === 'function') {
                textDescripcion = self.linkifyDescription(textDescripcion, (item.nombre || '').replaceAll('<br>', ''));
            }

            if (tipoVista === 'card') {
                html += `
            <div class="card glosario-item shadow-sm" data-item-id="${spId}" data-metad-id="${metadId}" style="border-radius: 10px; border: 1px solid #e3e3e3; width: 100%;">
                <div class="card-body position-relative">
                    ${actions}
                    
                    <div class="resultado-head d-flex justify-content-between align-items-start flex-wrap" style="padding-right: 110px;">
                        <div class="d-flex flex-column mb-2">
                            <div class="d-flex align-items-center gap-2 mb-1">
                                ${titulo}
                            </div>
                            <div class="atributos d-flex gap-1">
                                ${atr_html}
                            </div>
                            <p class="mb-0 mt-2" data-display-field="ultima_actualizacion" style="font-size: 0.75rem;">
                                <i class="simple-icon-calendar mr-1"></i> Últ. act: ${fechaAct}
                            </p>
                        </div>
                    </div>
                    
                    ${formEditHtml}
                    
                    <div>
                        <p class="mb-1" style="font-weight: 600; font-size: 0.8rem; color: #245794;" data-display-field="tipo">
                            ${typeof mayusc_each_word === "function" ? mayusc_each_word(item.tipo) : tipoRaw}
                        </p>
                        <p class="mb-2" style="font-weight: 500; font-size: 0.8rem; color: #333;" data-display-field="dominio">
                            <i class="simple-icon-folder-alt mr-1"></i> ${domainValue}${casoUsoHtml}
                        </p>
                        <p id="term-desc" class="mb-0" style="text-align:justify; line-height: 1.5;" data-display-field="descripcion">
                            ${textDescripcion}
                        </p>
                    </div>
                </div>
            </div>`;
            } else {
                html += `
            <div class="mb-4 glosario-item position-relative" data-item-id="${spId}" data-metad-id="${metadId}">
                ${actions}

                <div class="resultado-head d-flex justify-content-between align-items-center flex-wrap" style="padding-right: 110px;">
                    <div class="d-flex gap-2 align-items-center flex-nowrap">
                        ${titulo}
                        <div class="atributos d-flex gap-1">
                            ${atr_html}
                        </div>
                    </div>
                    <p class="mb-0 text-muted" data-display-field="ultima_actualizacion" style="font-size: 0.8rem; color: #6c757d !important;">
                        <i class="simple-icon-calendar mr-1"></i> Últ. act: ${fechaAct}
                    </p>
                </div>
                
                ${formEditHtml}
                
                <p class="mb-1 mt-2" data-display-field="tipo" style="font-weight: 600; font-size: 0.80rem; color: #d1007e;">
                    ${typeof mayusc_each_word === "function" ? mayusc_each_word(item.tipo) : tipoRaw}
                </p>
                <p class="mb-1" style="font-weight: 500; font-size: 0.80rem; color: #333;" data-display-field="dominio">
                    <i class="simple-icon-folder-alt mr-1"></i> ${domainValue}${casoUsoHtml}
                </p>
                <p class="mb-2 text" style="text-align:justify; line-height: 1.5;" data-display-field="descripcion">
                    ${textDescripcion}
                </p>
                
                ${(contador == pagina || index + 1 == datos.length ? ' ' : separador)}
            </div>`;

                contador == pagina ? contador = 1 : contador++;
            }
        });
        html += '</div>';
        return html;
    },

    renderMenuDominios: function () {
        const dominiosMap = window.glosario?.dominios;
        const $container = $('#lista-dominios-container');

        if (!dominiosMap || $container.length === 0) return;

        const dominiosArray = Array.from(dominiosMap.entries())
            .filter(([nombre, cantidad]) => nombre && nombre.trim() !== "")
            .sort((a, b) => b[1] - a[1]);

        let html = '<ul class="list-group list-group-flush">';
        dominiosArray.forEach(([nombre, cantidad]) => {
            html += `
            <li class="list-group-item d-flex justify-content-between align-items-center dominio-item p-2" title="${nombre}" style="cursor: pointer;">
                <span class="dominio-text mr-2">${nombre}</span>
                <span class="badge badge-pill dominio-badge">${cantidad}</span>
            </li>
        `;
        });
        html += '</ul>';

        $container.html(html);

        const $sidebarDominios = $('#sidebar-dominios');
        const $wrapperRecientes = $('#wrapper-recientes');
        const $btnToggle = $('#btn-toggle-dominios');
        const $btnClose = $('#btn-close-dominios');

        $btnToggle.off('click');
        $btnClose.off('click');
        $container.off('click', '.dominio-item');
        $(document).off('click.cerrarDominios');

        $btnToggle.on('click', function (e) {
            e.preventDefault();
            $sidebarDominios.toggleClass('open');
            if ($sidebarDominios.hasClass('open')) {
                $wrapperRecientes.addClass('d-none');
            } else {
                $wrapperRecientes.removeClass('d-none');
            }
        });

        $btnClose.on('click', function (e) {
            e.preventDefault();
            $sidebarDominios.removeClass('open');
            $wrapperRecientes.removeClass('d-none');
        });

        $(document).on('click.cerrarDominios', function (e) {
            if ($sidebarDominios.hasClass('open')) {
                if (!$(e.target).closest('#sidebar-dominios').length &&
                    !$(e.target).closest('#btn-toggle-dominios').length) {
                    $sidebarDominios.removeClass('open');
                    $wrapperRecientes.removeClass('d-none');
                }
            }
        });

        const self = this;

        $container.on('click', '.dominio-item', function () {
            $('.dominio-item').css('background-color', '');
            $(this).css('background-color', '#eef2f5');

            const dominioSeleccionado = $(this).find('.dominio-text').text().trim();
            window.dominio = dominioSeleccionado;

            let filtrado = typeof searchList === 'function' ? searchList(dominioSeleccionado, 'dominios', window.aux) : window.aux;

            self.printSearchResults(filtrado, { skipUrlFilter: true });

            const searchInput = document.getElementById('glosario-search');
            const buscarBtn = document.getElementById('glosario-buscar');
            if (searchInput) searchInput.outerHTML = searchInput.outerHTML;
            if (buscarBtn) buscarBtn.outerHTML = buscarBtn.outerHTML;

            if (typeof autocompletado === 'function') autocompletado(document.getElementById('glosario-search'), 'nombre', filtrado);

            if (typeof isList !== 'undefined' && !isList) {
                document.getElementById('dropdown-btn').innerText = typeof filtro !== 'undefined' ? filtro : dominioSeleccionado;
            }
            if (typeof closeAllLists === 'function') closeAllLists();

            if (window.innerWidth < 768) {
                $sidebarDominios.removeClass('open');
                $wrapperRecientes.removeClass('d-none');
            }
        });
    },

    renderMenuRecientes: function (n = 5) {
        const todos = window.glosario?.todos || [];
        const container = document.getElementById('lista-recientes-container');
        if (!container || todos.length === 0) return;
        const recientes = todos.slice().sort((a, b) => {
            const dateStrA = a.fecha_modificacion || a.fecha_creacion || "";
            const dateStrB = b.fecha_modificacion || b.fecha_creacion || "";
            const dateA = dateStrA ? new Date(dateStrA).getTime() : 0;
            const dateB = dateStrB ? new Date(dateStrB).getTime() : 0;
            return dateB - dateA;
        }).slice(0, n);

        let html = '<div>';
        recientes.forEach(item => {
            const nombre = (item.nombre || "Sin nombre").replaceAll('<br>', '');
            const tipo = (item.tipo || "Desc.").toUpperCase();
            const fechaRaw = item.fecha_modificacion || item.fecha_creacion || "Sin fecha";
            const fecha = fechaRaw.split("T")[0].split(" ")[0];
            const itemId = item.id || "";
            html += `
            <div class="reciente-item" data-id="${itemId}" data-nombre="${nombre}" style="cursor: pointer;">
                <div class="reciente-titulo" title="${nombre}">${nombre}</div>
                <div class="reciente-meta">
                    <span class="reciente-tipo">${tipo}</span>
                    <span><i class="simple-icon-calendar"></i> ${fecha}</span>
                </div>
            </div>
        `;
        });
        html += '</div>';
        container.innerHTML = html;

        const self = this;
        const tarjetasRecientes = container.querySelectorAll('.reciente-item');

        tarjetasRecientes.forEach(tarjeta => {
            tarjeta.addEventListener('click', function () {
                const terminoNombre = this.getAttribute('data-nombre');
                const inputBusqueda = document.getElementById('glosario-search');
                if (inputBusqueda) inputBusqueda.value = terminoNombre;
                limpiarFiltros();

                let filtrado = typeof searchList === 'function' ? searchList(terminoNombre, 'nombre', window.aux || window.glosario.todos, true) : [];

                self.printSearchResults(filtrado, { skipUrlFilter: true });
            });
        });

        const sidebar = document.getElementById('sidebar-recientes');
        if (sidebar) sidebar.classList.add('open');

        $('#btn-toggle-recientes').off('click').on('click', function (e) {
            e.preventDefault();
            const $wrapperRecientes = $('#wrapper-recientes');
            const $sidebarDominios = $('#sidebar-dominios');
            $wrapperRecientes.toggleClass('d-none');
            if ($sidebarDominios.hasClass('open')) $sidebarDominios.removeClass('open');
        });

        $('#btn-close-recientes').off('click').on('click', function (e) {
            e.preventDefault();
            $('#wrapper-recientes').addClass('d-none');
        });
    },

    habilitarCopiaHTMLGlosario: function () {
        document.addEventListener('copy', function (e) {
            const target = e.target;
            const tarjeta = target.closest('.glosario-item');

            if (!tarjeta) return;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;
            const seleccion = window.getSelection().toString();
            if (seleccion.length > 0) return;

            e.preventDefault();
            const clone = tarjeta.cloneNode(true);

            const dropdownBotones = clone.querySelector('.position-absolute');
            if (dropdownBotones) dropdownBotones.remove();

            const formEdicion = clone.querySelector('.glosario-item-edit');
            if (formEdicion) formEdicion.remove();

            const headContainer = clone.querySelector('.resultado-head');
            if (headContainer) headContainer.style.paddingRight = '0';

            const title = clone.querySelector('.list-item-heading');
            if (title) title.style.cssText = "font-size: 18px; font-weight: bold; color: #D2006E; margin: 0 0 12px 0; text-decoration: none; display: block;";

            const date = clone.querySelector('[data-display-field="ultima_actualizacion"]');
            if (date) date.style.cssText = "font-size: 13px; color: #6c757d; margin: 0 0 16px 0; display: block;";

            const type = clone.querySelector('[data-display-field="tipo"]');
            if (type) type.style.cssText = "font-size: 14px; color: #245794; margin: 0 0 8px 0; display: block;";

            const domain = clone.querySelector('[data-display-field="dominio"]');
            if (domain) domain.style.cssText = "font-size: 14px; color: #4a4a4a; margin: 0 0 16px 0; display: block;";

            const casoUso = clone.querySelector('.glosario-caso-uso');
            if (casoUso) casoUso.style.cssText = "font-size: 13px; color: #6c757d; margin-left: 5px;";

            const desc = clone.querySelector('[data-display-field="descripcion"]');
            if (desc) desc.style.cssText = "text-align: justify; line-height: 1.6; font-size: 14px; color: #333333; margin: 0; display: block;";

            const iconos = clone.querySelectorAll('i');
            iconos.forEach(i => {
                i.style.cssText = "margin-right: 6px; color: #6c757d;";
            });

            const badges = clone.querySelectorAll('.badge-secondary.atributo');
            badges.forEach(b => {
                b.style.cssText = "display: inline-block; padding: 4px 8px; font-size: 12px; font-weight: bold; color: #ffffff; background-color: #6c757d; border-radius: 12px; margin-right: 5px; text-decoration: none;";
            });

            const crosslinks = clone.querySelectorAll('.glosario-crosslink');
            crosslinks.forEach(c => {
                c.style.cssText = "display: inline-block; padding: 2px 4px; font-size: 14px; color: #245794; background-color: #f4f8fa; border: 1px dashed #245794; border-radius: 4px; text-decoration: none; font-weight: 500; margin: 0 2px;";
            });

            const flexContainers = clone.querySelectorAll('.d-flex');
            flexContainers.forEach(f => {
                f.style.display = "block";
                f.style.marginBottom = "5px";
            });

            const contenidoInterno = clone.innerHTML;

            const htmlLimpio = `
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 650px; font-family: 'Segoe UI', Arial, sans-serif; margin-bottom: 15px;">
                <tr>
                    <td style="border: 1px solid #cccccc; border-radius: 12px; padding: 24px; background-color: #ffffff; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                        ${contenidoInterno}
                    </td>
                </tr>
            </table>
            `;

            if (e.clipboardData) {
                e.clipboardData.setData('text/html', htmlLimpio);
                e.clipboardData.setData('text/plain', tarjeta.innerText.replace(/\n\s*\n/g, '\n'));

                if (typeof showNotification === 'function') {
                    showNotification("top", "center", "success", "Tarjeta copiada al portapapeles.", 1500);
                }
            }
        });
    },

    initDominio: async function () {
        await this.precargarMapaDominios();

        if (typeof listenerDominios === 'function') listenerDominios();
        if (typeof listenerbtnAddAtributo === 'function') listenerbtnAddAtributo();

        const catalogo = typeof getCatalogoSegmentador === 'function' ? getCatalogoSegmentador() : {};
        let nombre_dominio = (getParams("dominio") || "").replace(/\+/g, ' ').trim();
        let tipo = getParams("tipo");

        let dominio = typeof searchDominios === 'function' ? searchDominios("descripcion_dominio", nombre_dominio) : null;
        if (!dominio) {
            console.error("[GlosarioApp] No se encontró el dominio:", nombre_dominio);
            return;
        }

        const idDominio = (typeof dominio.attr === 'function') ? dominio.attr("ows_id_dominio") : dominio.id_dominio;
        if (typeof fillBreadcrumbs === 'function') fillBreadcrumbs(idDominio, nombre_dominio);
        $("#nombre-dominio").text(nombre_dominio);

        const glosario = typeof TerminosService !== 'undefined' ? await TerminosService.getTerminosPorDominio(nombre_dominio) : { todos: [] };

        window.glosario = glosario;
        window.aux = typeof sortGlosario === 'function' ? sortGlosario(glosario.todos) : glosario.todos;
        window.currentGlosarioView = 'card';

        this.buildDictionary();
        this.setupGlosarioViews();
        this.setupCardActions();

        this.printSearchResults(glosario.todos, { skipUrlFilter: true });

        if (typeof autocompletado === 'function') {
            autocompletado(document.getElementById("glosario-search"), "nombre", glosario.todos);
        }

        if (typeof registrar_visita === 'function') registrar_visita("DICCIONARIO DE DOMINIO", nombre_dominio);

        if (localStorage.getItem("citizen") == null && typeof revisar_usuario === 'function') {
            localStorage.setItem('citizen', revisar_usuario());
        }

        if (localStorage.getItem("citizen") === "false") {
            const btnNuevo = document.getElementById("nuevoatributo");
            if (btnNuevo) btnNuevo.style.display = "none";
        }

        if (typeof estandarizarSegmentacion === 'function') estandarizarSegmentacion();

        if (tipo == "terminos" && catalogo["Término"]?.length && typeof segmentar === 'function') {
            segmentar(catalogo["Término"][0]);
        }

        if (tipo == "atributo" && catalogo["Atributos"]?.length && typeof segmentar === 'function') {
            segmentar(catalogo["Atributos"][0]);
        }

        this.aplicarBusquedaGlosarioDesdeUrl();
    },

    aplicarBusquedaGlosarioDesdeUrl: function (intento = 0) {
        const decodeParam = (v = "") => (v || "").toString().replace(/\+/g, " ").trim();
        const filtroUrl = decodeParam(typeof getParams === 'function' ? getParams("filtro") || getParams("criterio") : "").toLowerCase();
        const buscarUrl = decodeParam(typeof getParams === 'function' ? getParams("buscar") : "");
        const qUrl = decodeParam(typeof getParams === 'function' ? getParams("q") : "");

        if (filtroUrl) {
            window.criterioGlosario = filtroUrl;
            if (typeof setDropdownFiltroLabel === 'function') setDropdownFiltroLabel(filtroUrl);
            if (typeof nuevoCriterio === 'function') nuevoCriterio(filtroUrl);
        }

        if (filtroUrl === "dominio" && buscarUrl) {
            window.dominio = buscarUrl;
            window.dominioBaseBusqueda = buscarUrl;
            const filtrado = typeof searchList === 'function' ? searchList(buscarUrl, "dominios", window.aux) : [];

            this.printSearchResults(filtrado, { skipUrlFilter: true });

            if (typeof autocompletado === 'function') {
                autocompletado(document.getElementById("glosario-search"), "nombre", filtrado);
            }
            const btn = document.getElementById("dropdown-btn");
            if (btn) {
                btn.innerText = buscarUrl;
            }

            if (qUrl) {
                if (typeof setBusquedaGlosarioDesdeUrl === 'function') setBusquedaGlosarioDesdeUrl(qUrl);
                const filtradoQ = typeof searchList === 'function' ? searchList(qUrl, "nombre", filtrado) : [];
                this.printSearchResults(filtradoQ, { skipUrlFilter: true });
                if (typeof syncGlosarioBusquedaUrl === 'function') syncGlosarioBusquedaUrl(qUrl, "dominio");
                return;
            }
        }

        if (buscarUrl === null || buscarUrl === "") return;

        if (typeof setBusquedaGlosarioDesdeUrl === 'function') setBusquedaGlosarioDesdeUrl(buscarUrl);

        const criterioActual = typeof filtroGlosarioActual === 'function' ? filtroGlosarioActual() : "";
        if (criterioActual === "caso de uso" && (!window.casosDeUsoListado || !window.casosDeUsoListado.length)) {
            if (intento < 6) {
                return setTimeout(() => this.aplicarBusquedaGlosarioDesdeUrl(intento + 1), 250);
            }
        }

        this.ejecutarBusquedaGlosarioDesdeValor(buscarUrl);
    },

    ejecutarBusquedaGlosarioDesdeValor: function (valor) {
        const criterioActual = typeof filtroGlosarioActual === 'function' ? filtroGlosarioActual() : "";

        if (criterioActual === "caso de uso") {
            if (typeof seleccionarCasoUsoPorNombre === 'function') seleccionarCasoUsoPorNombre(valor);
            if (typeof syncGlosarioBusquedaUrl === 'function') syncGlosarioBusquedaUrl(valor);
            return;
        }

        if (criterioActual === "dominio") {
            window.dominio = valor;
            const filtrado = typeof searchList === 'function' ? searchList(valor || "", "dominios", window.aux) : [];
            this.printSearchResults(filtrado, { skipUrlFilter: true });
            if (typeof autocompletado === 'function') {
                autocompletado(document.getElementById("glosario-search"), "nombre", filtrado);
            }
            if (typeof syncGlosarioBusquedaUrl === 'function') syncGlosarioBusquedaUrl(valor);
            return;
        }

        const filtradoFinal = typeof searchList === 'function' ? searchList(valor || "", "nombre", window.aux) : [];
        this.printSearchResults(filtradoFinal, { skipUrlFilter: true });
        if (typeof syncGlosarioBusquedaUrl === 'function') syncGlosarioBusquedaUrl(valor);
    }
};

window.GlosarioApp = GlosarioApp;