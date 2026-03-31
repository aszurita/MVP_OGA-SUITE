/*
 * Modal de carga para Linajes (buscar y cargar linajes guardados)
 */
(function () {
    const loadModal = {
        init: function (editor) {
            if (!editor) return;

            // NOTA: Asegúrate de crear el modal HTML con estos IDs o ajustarlos aquí
            editor.loadLineageDialog = document.getElementById('loadLineageModal');
            editor.loadLineageButton = document.getElementById('btnLoadLineage');
            editor.loadSearchInput = document.getElementById('loadLineageSearchInput');
            editor.loadResultsList = document.getElementById('loadLineageResultsList');
            editor.loadResultsStatus = document.getElementById('loadLineageResultsStatus');
            editor.loadRecentBody = document.getElementById('loadLineageRecentBody');
            editor.loadSubmitButton = document.getElementById('loadLineageSubmit');

            editor.loadSelectedItem = null;
            editor.loadSearchTimer = null;
            editor.loadSelectedIndex = -1;

            if (!editor.loadLineageDialog || !editor.loadLineageButton) return;

            editor.loadLineageButton.addEventListener('click', () => this.open(editor));
            editor.loadSubmitButton?.addEventListener('click', () => this.loadSelected(editor));

            editor.loadSearchInput?.addEventListener('keydown', (event) => {
                const key = event.key || event.keyCode;
                switch (key) {
                    case 'ArrowDown':
                    case 40:
                        event.preventDefault();
                        this.moveSelection(editor, 1);
                        break;
                    case 'ArrowUp':
                    case 38:
                        event.preventDefault();
                        this.moveSelection(editor, -1);
                        break;
                    case 'Enter':
                    case 'NumpadEnter':
                    case 13:
                        event.preventDefault();
                        if (editor.loadSelectedIndex >= 0 || editor.loadSelectedItem) {
                            this.loadSelected(editor);
                            break;
                        }
                        this.setStatus(editor, 'Selecciona un linaje');
                        break;
                    default:
                        break;
                }
            });

            editor.loadSearchInput?.addEventListener('input', () => {
                if (editor.loadSearchTimer) {
                    clearTimeout(editor.loadSearchTimer);
                }
                editor.loadSearchTimer = setTimeout(() => {
                    const term = (editor.loadSearchInput?.value || '').trim();
                    if (!term) {
                        this.renderResults(editor, []);
                        this.setStatus(editor, 'Escribe para buscar');
                        this.toggleDropdown(editor, false);
                        return;
                    }
                    this.search(editor);
                }, 500);
            });

            this._attachOverlayClose(editor);
        },

        open: function (editor) {
            if (!editor.loadLineageDialog) return;
            editor.loadLineageDialog.classList.remove('hidden');
            editor.loadSelectedItem = null;
            editor.loadResults = [];
            editor.loadSelectedIndex = -1;

            if (editor.loadSearchInput) {
                editor.loadSearchInput.value = '';
                editor.loadSearchInput.focus();
            }

            this.renderResults(editor, []);
            this.setStatus(editor, 'Escribe para buscar');
            this.toggleDropdown(editor, false);
            editor.loadRecentSelected = null;
            this.loadRecent(editor);
        },

        close: function (editor) {
            if (!editor.loadLineageDialog) return;
            editor.loadLineageDialog.classList.add('hidden');
            editor.loadLineageDialog.classList.remove('load-results-open');
        },

        _attachOverlayClose(editor) {
            editor.loadLineageDialog?.addEventListener('click', (event) => {
                if (event.target === editor.loadLineageDialog) {
                    this.close(editor);
                }
            });
        },

        setStatus: function (editor, text) {
            if (!editor.loadResultsStatus) return;
            editor.loadResultsStatus.textContent = text;
        },

        renderResults: function (editor, items, forceOpen = false) {
            if (!editor.loadResultsList) return;
            editor.loadResultsList.innerHTML = '';

            items.forEach((item, index) => {
                const entry = document.createElement('div');
                entry.className = 'load-result-item';

                // ADAPTACIÓN: Campos de tu tabla de linajes
                const nombre = item.NOMBRE_LINAJE || item.nombre_linaje || item.NOMBRE || 'Sin nombre';
                const usuario = item.user_creacion || item.USER_CREACION || '';
                const fecha = item.fecha_creacion || item.FECHA_CREACION || item.FechaCreacion || item.fecha || item.FECHA || '';

                const metaParts = [];
                if (usuario) metaParts.push(`Usuario: ${usuario}`);
                if (fecha) metaParts.push(`Fecha: ${fecha}`);

                const metaHtml = metaParts.length ? `<div class="load-result-meta">${metaParts.join(' | ')}</div>` : '';

                entry.innerHTML = `<strong>${nombre}</strong>${metaHtml}`;
                entry.addEventListener('mousedown', (event) => {
                    event.preventDefault();
                    this.selectItem(editor, index);
                    this.loadSelected(editor);
                });
                editor.loadResultsList.appendChild(entry);
            });

            this.updateHighlight(editor);
            const hasTerm = !!(editor.loadSearchInput?.value || '').trim();
            this.toggleDropdown(editor, forceOpen || hasTerm);
        },

        renderRecentTable: function (editor, items) {
            if (!editor.loadRecentBody) return;
            editor.loadRecentBody.innerHTML = '';
            const rows = (items || []).slice(0, 10);

            rows.forEach((item) => {
                // ADAPTACIÓN: Campos de visualización de la tabla
                const nombre = item.NOMBRE_LINAJE || item.nombre_linaje || item.NOMBRE || 'Sin nombre';
                const usuario = item.user_creacion || item.USER_CREACION || '-';
                const fecha = item.fecha_creacion || item.FECHA_CREACION || item.FechaCreacion || item.fecha || item.FECHA || '-';

                const row = document.createElement('tr');
                row.innerHTML = `<td>${nombre}</td><td>${usuario}</td><td>${fecha}</td>`;

                row.addEventListener('click', () => {
                    editor.loadRecentSelected = item;
                    editor.loadRecentBody.querySelectorAll('tr').forEach(r => r.classList.remove('selected'));
                    row.classList.add('selected');
                });
                editor.loadRecentBody.appendChild(row);
            });

            if (!rows.length) {
                const row = document.createElement('tr');
                row.innerHTML = '<td colspan="3">Sin resultados recientes</td>';
                editor.loadRecentBody.appendChild(row);
            }
        },

        selectItem: function (editor, index) {
            const items = editor.loadResults || [];
            const selected = items[index];
            if (!selected) return;

            editor.loadSelectedItem = selected;
            editor.loadSelectedIndex = index;

            if (editor.loadSearchInput) {
                // Ajustar al nombre del campo correcto
                editor.loadSearchInput.value = selected.NOMBRE_LINAJE || selected.NOMBRE || editor.loadSearchInput.value;
            }
            this.updateHighlight(editor);
        },

        moveSelection: function (editor, delta) {
            const items = editor.loadResults || [];
            if (!items.length) return;

            let next = typeof editor.loadSelectedIndex === 'number' ? editor.loadSelectedIndex : -1;
            if (next < 0) {
                next = delta > 0 ? 0 : items.length - 1;
            } else {
                next += delta;
                if (next < 0) next = items.length - 1;
                if (next >= items.length) next = 0;
            }
            this.selectItem(editor, next);
        },

        updateHighlight: function (editor) {
            const nodes = editor.loadResultsList?.querySelectorAll('.load-result-item') || [];
            nodes.forEach((node, idx) => {
                node.classList.toggle('selected', idx === editor.loadSelectedIndex);
            });
            if (editor.loadSelectedIndex >= 0 && nodes[editor.loadSelectedIndex]) {
                nodes[editor.loadSelectedIndex].scrollIntoView({ block: 'nearest' });
            }
        },

        toggleDropdown: function (editor, open) {
            if (!editor.loadLineageDialog) return;
            editor.loadLineageDialog.classList.toggle('load-results-open', !!open);
        },

        // --- MÉTODOS DE API PARA LINAJES ---

        loadRecent: async function (editor) {
            if (!editor.api) {
                editor.showGenerationToast?.('API no disponible.', true);
                return;
            }
            try {
                //existe un método listLinajes
                const results = await editor.api.listLinajes(10);
                editor.loadRecentResults = results || [];
                this.renderRecentTable(editor, editor.loadRecentResults);
            } catch (error) {
                this.renderRecentTable(editor, []);
                console.error('LineageModal: error buscando recientes', error);
            }
        },

        search: async function (editor) {
            if (!editor.api) {
                editor.showGenerationToast?.('API no disponible.', true);
                return;
            }
            const term = (editor.loadSearchInput?.value || '').trim();
            if (!term) {
                this.renderResults(editor, []);
                this.setStatus(editor, 'Escribe para buscar');
                this.toggleDropdown(editor, false);
                return;
            }

            this.setStatus(editor, 'Buscando linajes...');
            this.toggleDropdown(editor, true);

            try {
                // existe un método searchLinajes
                const results = await editor.api.searchLinajes(term, 20);
                editor.loadResults = results || [];
                editor.loadSelectedItem = null;
                editor.loadSelectedIndex = -1;

                this.renderResults(editor, editor.loadResults, true);

                if (!editor.loadResults.length) {
                    this.setStatus(editor, 'Sin linajes encontrados');
                } else {
                    this.setStatus(editor, 'Selecciona un linaje');
                }
            } catch (error) {
                this.setStatus(editor, 'Error al buscar');
                this.toggleDropdown(editor, false);
                console.error('LineageModal: error busqueda', error);
            }
        },

        loadSelected: function (editor) {
            let selected = editor.loadSelectedItem;

            if (!selected && editor.loadSelectedIndex >= 0) {
                selected = (editor.loadResults || [])[editor.loadSelectedIndex];
            }
            if (!selected && editor.loadRecentSelected) {
                selected = editor.loadRecentSelected;
            }

            if (!selected) {
                editor.showGenerationToast?.('Selecciona un linaje para cargar.', true);
                return;
            }

            console.log("LINAGE SELECTED:", selected);

            // CORRECCIÓN AQUÍ: Agregamos soporte para 'contenido', 'codigojson', etc.
            // Si el valor es un objeto JSON directo, lo convertimos a string para validarlo
            let rawContent =
                selected.contenido ||
                selected.CONTENIDO ||
                selected.codigojson ||
                selected.CodigoJson ||
                selected.GRAFICO ||
                null;

            console.log("RAW CONTENT:", rawContent);


            // Si viene como objeto, lo serializamos
            if (typeof rawContent === 'object') {
                rawContent = JSON.stringify(rawContent);
            }

            if (!rawContent) {
                editor.showGenerationToast?.(
                    'El linaje seleccionado no tiene JSON guardado en la base de datos.',
                    true
                );
                return;
            }

            const contenido = rawContent.trim();

            if (!contenido || contenido === '{}') {
                editor.showGenerationToast?.(
                    'El linaje seleccionado tiene JSON vacío o inválido.',
                    true
                );
                return;
            }


            // Pasamos el contenido al editor (el "setter" en el ASPX lo procesará)
            try {
                JSON.parse(contenido);
            } catch {
                editor.showGenerationToast?.('El JSON del linaje no es válido.', true);
                return;
            }
            editor.editor.value = contenido;


            // Actualizar título si existe input
            const nombre =
                selected.NOMBRE_LINAJE ||
                selected.nombre_linaje ||
                selected.NombreLinaje ||
                selected.NOMBRE;

            if (nombre) {
                const tituloInput = document.getElementById('tituloFlujoActual');
                if (tituloInput) {
                    tituloInput.value = nombre;

                    // Disparar evento por si hay listeners (save/share/etc)
                    tituloInput.dispatchEvent(new Event('input', { bubbles: true }));
                    window.linajeShare?.buildShareUrl(nombre);
                }
            }


            editor.saveState();
            editor.render();

            editor.showGenerationToast?.('El linaje ha cargado correctamente.');
            this.close(editor);
        }
    };

    window.LineageLoadModal = loadModal;
})();
