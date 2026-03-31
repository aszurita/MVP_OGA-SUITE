const GlosarioEdit = {
    state: {
        setup: false,
        currentCard: null
    },

    setup: function () {
        if (this.state.setup) return;
        const resultados = document.getElementById("resultados");
        if (!resultados) return;

        resultados.addEventListener("click", (event) => {
            const button = event.target.closest(".glosario-btn-editar, .glosario-btn-guardar, .glosario-btn-cancelar, .glosario-btn-eliminar");
            if (!button) return;

            const card = button.closest(".glosario-item");
            if (!card) return;

            if (button.classList.contains("glosario-btn-editar")) {
                this.activateCard(card);
                setTimeout(() => {
                    this.inicializarSelects(card);
                }, 50);
            } else if (button.classList.contains("glosario-btn-cancelar")) {
                this.resetCard(card);
            } else if (button.classList.contains("glosario-btn-guardar")) {
                this.saveCard(card);
            } else if (button.classList.contains("glosario-btn-eliminar")) {
                this.openDeleteModal(card.dataset.itemId, card);
            }
        });

        this.state.setup = true;
    },

    activateCard: function (card) {
        if (!card) return;
        if (this.state.currentCard && this.state.currentCard !== card) {
            this.resetCard(this.state.currentCard);
        }

        card.classList.add("glosario-item-editing");
        card.querySelector(".glosario-btn-editar")?.setAttribute("disabled", "disabled");
        card.querySelector(".glosario-btn-guardar")?.removeAttribute("disabled");
        card.querySelector(".glosario-btn-cancelar")?.removeAttribute("disabled");

        const $card = $(card);
        $card.find('p[data-display-field]').slideUp(250);
        $card.find('.glosario-item-edit').slideDown(250);

        this.state.currentCard = card;
    },

    inicializarSelects: function (card) {
        const $formEdit = $(card).find('.glosario-item-edit');
        const $selectDominio = $formEdit.find('.edit-select-dominio');
        const $selectCasoUso = $formEdit.find('.edit-select-caso-uso');

        if ($selectDominio.hasClass("select2-hidden-accessible")) $selectDominio.select2('destroy');
        if ($selectCasoUso.hasClass("select2-hidden-accessible")) $selectCasoUso.select2('destroy');

        const rawDominios = $selectDominio.attr('data-valores') || '';
        const rawCasosUso = $selectCasoUso.attr('data-valores') || '';

        const dominiosGuardados = rawDominios.split(';').map(s => s.trim()).filter(Boolean);
        const casosUsoGuardados = rawCasosUso.split(';').map(s => s.trim()).filter(val => /^\d+$/.test(val));

        if ($.fn.select2) {
            const config = { theme: "bootstrap", dir: "ltr", width: '100%', placeholder: "" };
            $selectDominio.select2(config);
            $selectCasoUso.select2(config);
        }

        $selectDominio.val(dominiosGuardados).trigger('change');
        $selectCasoUso.val(casosUsoGuardados).trigger('change');
    },

    resetCard: function (card) {
        if (!card) return;
        card.classList.remove("glosario-item-editing");

        const guardar = card.querySelector(".glosario-btn-guardar");
        const cancelar = card.querySelector(".glosario-btn-cancelar");
        guardar?.setAttribute("disabled", "disabled");
        cancelar?.setAttribute("disabled", "disabled");
        card.querySelector(".glosario-btn-editar")?.removeAttribute("disabled");

        card.querySelectorAll("[data-field]").forEach(field => {
            if (field.tagName === "SELECT") {
                const defaultOpt = field.querySelector("option[selected]");
                if (defaultOpt) field.value = defaultOpt.value;
            } else if (typeof field.defaultValue !== "undefined") {
                field.value = field.defaultValue;
            }
        });

        if (this.state.currentCard === card) {
            this.state.currentCard = null;
        }
        const $card = $(card);
        $card.find('.glosario-item-edit').slideUp(250);
        $card.find('p[data-display-field]').slideDown(250);
    },

    saveCard: async function (card) {
        if (!card) return;

        const spId = card.dataset.itemId;
        const metadId = card.dataset.metadId;

        if (!spId || !metadId) {
            if (typeof showNotification === 'function') {
                showNotification("top", "center", "danger", "No se pudo identificar el registro de forma completa.");
            }
            return;
        }

        const fields = {};
        $(card).find("[data-field]").each(function () {
            const fieldName = $(this).data("field");
            fields[fieldName] = $(this).val();
        });

        const normalizedTipo = (fields.tipo || "").trim().toUpperCase() || "TERMINO";
        const normalizedNombre = (fields.nombre || "").trim();

        // Extraemos valores actuales
        const casosUsoSeleccionados = Array.isArray(fields.caso_uso) ? fields.caso_uso.map(Number) : [];
        let dominiosArray = Array.isArray(fields.dominio) ? [...fields.dominio] : (fields.dominio ? fields.dominio.split(';').map(s => s.trim()).filter(Boolean) : []);

        // 🌟 AGREGAR DOMINIOS AUTOMÁTICAMENTE SEGÚN EL CASO DE USO (CON FALLBACK SQL)
        // Usamos for...of en lugar de forEach para poder usar 'await' de forma segura
        for (const idCaso of casosUsoSeleccionados) {
            let nombreDominioCaso = null;

            if (window.mapaCasoUsoDominio && window.mapaCasoUsoDominio[idCaso.toString()]) {
                // Opción A: Está en caché
                nombreDominioCaso = window.mapaCasoUsoDominio[idCaso.toString()];
            } else {
                // Opción B: No está en caché, consultamos a SQL
                try {
                    const resDominio = await ApiService.query({
                        campos: 'd.descripcion_dominio',
                        origen: 'PROCESOS_BI.DBO.t_casos_uso_analitica c INNER JOIN PROCESOS_BI.DBO.t_mapa_dominios d ON c.id_dominio = d.id_dominio',
                        condicion: `c.id_caso_uso = ${idCaso}`
                    });

                    if (resDominio && resDominio.length > 0 && resDominio[0].descripcion_dominio) {
                        nombreDominioCaso = resDominio[0].descripcion_dominio.trim();
                        // Guardamos en caché para las siguientes iteraciones/operaciones
                        window.mapaCasoUsoDominio = window.mapaCasoUsoDominio || {};
                        window.mapaCasoUsoDominio[idCaso.toString()] = nombreDominioCaso;
                    }
                } catch (error) {
                    console.warn(`No se pudo resolver el dominio del caso de uso ${idCaso}:`, error);
                }
            }

            // Si logramos obtener el dominio (por caché o SQL) y no está en la lista, lo agregamos
            if (nombreDominioCaso && !dominiosArray.includes(nombreDominioCaso)) {
                dominiosArray.push(nombreDominioCaso);
            }
        }

        // Unimos los arreglos procesados para mandarlos a SQL
        const strDominio = dominiosArray.join("; ");
        const strCasoUso = casosUsoSeleccionados.join("; ");

        if (typeof esNombreDuplicado === 'function' && esNombreDuplicado(normalizedNombre, normalizedTipo, spId)) {
            if (typeof showNotification === 'function') {
                showNotification("top", "center", "danger", `Ya existe un ${normalizedTipo.toLowerCase()} con ese nombre.`);
            }
            return;
        }

        let usuarioCode = 0;
        if (typeof SharePointUtils !== 'undefined') {
            const codigo = SharePointUtils.getEmployeeCodeByUser(window.current_user);
            if (codigo) usuarioCode = Number(codigo);
        }

        const payload = {
            nombre: normalizedNombre,
            tipo: normalizedTipo,
            dominios: strDominio, // Se manda la lista de dominios actualizada
            casos_uso: strCasoUso,
            descripcion: fields.descripcion || ""
        };

        const self = this;

        if (typeof toggleGlosarioImportLoading === 'function') toggleGlosarioImportLoading(true);

        try {
            // 1. Actualizamos el registro principal usando TerminosService
            await TerminosService.update(spId, payload, usuarioCode);

            // 2. Actualizamos la tabla puente (T_CASOS_USO_TERMINOS)
            const nowSql = () => new Date().toISOString().slice(0, 23).replace('T', ' ');

            const existentes = await ApiService.query({
                campos: 'ID_CASO_TERMINOS, ID_CASO_USO, SN_ACTIVO',
                origen: 'PROCESOS_BI.DBO.T_CASOS_USO_TERMINOS_MB',
                condicion: `COD_TERMINOS = '${metadId}'`
            });

            const mapaExistentes = new Map((existentes || []).map(r => [Number(r.ID_CASO_USO), r]));
            const promesasSql = [];

            casosUsoSeleccionados.forEach(idCasoUso => {
                const existente = mapaExistentes.get(idCasoUso);
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
                        COD_TERMINOS: String(metadId),
                        SN_ACTIVO: 1,
                        USUARIO_CREACION: usuarioCode,
                        FEC_CREACION: nowSql()
                    }));
                }
            });

            for (const [idCasoUso, registro] of mapaExistentes.entries()) {
                if (registro.SN_ACTIVO && !casosUsoSeleccionados.includes(idCasoUso)) {
                    promesasSql.push(ApiService.update(
                        'PROCESOS_BI.DBO.T_CASOS_USO_TERMINOS_MB',
                        { SN_ACTIVO: 0, FEC_MODIFICACION: nowSql(), USUARIO_MODIFICACION: usuarioCode },
                        `ID_CASO_TERMINOS = ${registro.ID_CASO_TERMINOS}`
                    ));
                }
            }

            if (promesasSql.length > 0) await Promise.all(promesasSql);

            if (window.mapaTerminoCasosUso) {
                window.mapaTerminoCasosUso.set(String(metadId), casosUsoSeleccionados.map(String));
            }

            // Refrescamos atributos en UI
            $(card).find('.edit-select-caso-uso').attr('data-valores', strCasoUso);
            $(card).find('.edit-select-dominio').attr('data-valores', strDominio);

            const casoUsoDisplayNames = casosUsoSeleccionados
                .map(id => window.diccionarioCasosUso && window.diccionarioCasosUso[id])
                .filter(Boolean);

            const casoUsoHtml = casoUsoDisplayNames.length > 0
                ? ` <span class="mb-0 glosario-caso-uso" data-caso-id="${casosUsoSeleccionados.join(';')}" style="font-size: 0.85rem; color: #6c757d !important;">| ${casoUsoDisplayNames.join(' | ')}</span>`
                : '';

            const $displayDominio = $(card).find('[data-display-field="dominio"]');
            if ($displayDominio.length) {
                $displayDominio.html(`<i class="simple-icon-folder-alt mr-1"></i> ${strDominio.replaceAll(";", " |")}${casoUsoHtml}`);
            }

            // Actualizamos la tarjeta y mostramos notificación
            fields.dominio = strDominio;
            fields.caso_uso = strCasoUso;

            if (typeof updateCardDisplay === 'function') updateCardDisplay(card, fields);
            self.resetCard(card);

            if (typeof showNotification === 'function') {
                showNotification("top", "center", "success", "Registro y relaciones actualizados correctamente.", 4000);
            }

        } catch (error) {
            console.error("Error al guardar la tarjeta en SQL:", error);
            if (typeof showNotification === 'function') {
                showNotification("top", "center", "danger", "Fallo al actualizar el registro. Revise la conexión.", 4000);
            }
        } finally {
            if (typeof toggleGlosarioImportLoading === 'function') toggleGlosarioImportLoading(false);
        }
    },

    openDeleteModal: function (recordId, card) {
        const modal = $("#glosario-delete-modal");
        if (!modal.length) {
            if (confirm("¿Eliminar este registro?")) {
                this.deleteItem(recordId, card);
            }
            return;
        }
        modal.data("record-id", recordId);
        modal.data("card-el", card);
        modal.modal("show");
    },

    deleteItem: async function (recordId, card) {
        if (!recordId) return;

        if (typeof toggleGlosarioImportLoading === 'function') toggleGlosarioImportLoading(true);

        let usuarioCode = 0;
        if (typeof SharePointUtils !== 'undefined') {
            const codigo = SharePointUtils.getEmployeeCodeByUser(window.current_user);
            if (codigo) usuarioCode = Number(codigo);
        }

        try {
            await TerminosService.desactivarElemento(recordId, "Eliminado desde UI", usuarioCode);

            $("#glosario-delete-modal").modal("hide");

            if (card && card.parentNode) {
                $(card).fadeOut(300, function () { $(this).remove(); });
            }

            if (typeof showNotification === 'function') {
                showNotification("top", "center", "success", "Registro desactivado correctamente.");
            }
            return true;

        } catch (error) {
            console.error("Error al eliminar (SQL):", error);
            if (typeof showNotification === 'function') {
                showNotification("top", "center", "danger", "No se pudo desactivar el registro.");
            }
            return false;
        } finally {
            if (typeof toggleGlosarioImportLoading === 'function') toggleGlosarioImportLoading(false);
        }
    }
};