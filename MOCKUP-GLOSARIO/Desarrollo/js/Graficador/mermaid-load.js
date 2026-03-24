/*
 * Modal de carga para Graficador (buscar y cargar diagramas guardados)
 */

(function () {
    const loadModal = {
        init: function (editor) {
            if (!editor) return;

            editor.loadDialog = document.getElementById('loadDiagramModal');
            editor.loadButton = document.getElementById('btnLoadDiagram');
            editor.loadSearchInput = document.getElementById('loadSearchInput');
            editor.loadResultsList = document.getElementById('loadResultsList');
            editor.loadResultsStatus = document.getElementById('loadResultsStatus');
            editor.loadRecentBody = document.getElementById('loadRecentBody');
            editor.loadSubmitButton = document.getElementById('loadDiagramSubmit');
            editor.loadSelectedItem = null;
            editor.loadSearchTimer = null;
            editor.loadSelectedIndex = -1;

            if (!editor.loadDialog || !editor.loadButton) return;

            editor.loadButton.addEventListener('click', () => this.open(editor));
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
                        this.setStatus(editor, 'Selecciona un diagrama');
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
        },

        open: function (editor) {
            if (!editor.loadDialog) return;
            editor.loadDialog.classList.remove('hidden');
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
            if (!editor.loadDialog) return;
            editor.loadDialog.classList.add('hidden');
            editor.loadDialog.classList.remove('load-results-open');
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
                const nombre = item.NOMBRE_SP || item.nombre_sp || 'Sin nombre';
                const usuario = item.user_creacion || item.USER_CREACION || '';
                const fecha = item.fecha_creacion || item.FECHA_CREACION || item.fecha || item.FECHA || '';
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
            const rows = (items || []).slice(0, 50);
            rows.forEach((item) => {
                const nombre = item.NOMBRE_SP || item.nombre_sp || 'Sin nombre';
                const usuario = item.user_creacion || item.USER_CREACION || ' ';
                const fecha = item.fecha_creacion || item.FECHA_CREACION || item.fecha || item.FECHA || ' ';
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
                row.innerHTML = '<td colspan="3">Sin resultados</td>';
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
                editor.loadSearchInput.value = selected.NOMBRE_SP || editor.loadSearchInput.value;
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
            if (!editor.loadDialog) return;
            editor.loadDialog.classList.toggle('load-results-open', !!open);
        },

        loadRecent: async function (editor) {
            if (!editor.api) {
                editor.showGenerationToast?.('API del Graficador no disponible.', true);
                return;
            }
            try {
                const results = await editor.api.listCatalogo(50);
                results.sort((a, b) => {
                    return new Date(b.FECHA_CREACION) - new Date(a.FECHA_CREACION);
                });
                editor.loadRecentResults = results || [];
                this.renderRecentTable(editor, editor.loadRecentResults);
            } catch (error) {
                this.renderRecentTable(editor, []);
                console.error('Graficador: error buscando diagramas', error);
            }
        },


        search: async function (editor) {
            if (!editor.api) {
                editor.showGenerationToast?.('API del Graficador no disponible.', true);
                return;
            }
            const term = (editor.loadSearchInput?.value || '').trim();
            if (!term) {
                this.renderResults(editor, []);
                this.setStatus(editor, 'Escribe para buscar');
                this.toggleDropdown(editor, false);
                return;
            }
            this.setStatus(editor, 'Buscando...');
            this.toggleDropdown(editor, true);
            try {
                const results = await editor.api.searchCatalogo(term, 20);
                editor.loadResults = results || [];
                editor.loadSelectedItem = null;
                editor.loadSelectedIndex = -1;
                this.renderResults(editor, editor.loadResults, true);
                if (!editor.loadResults.length) {
                    this.setStatus(editor, 'Sin resultados');
                } else {
                    this.setStatus(editor, 'Selecciona un diagrama');
                }
            } catch (error) {
                this.setStatus(editor, 'Error al buscar');
                this.toggleDropdown(editor, false);
                editor.showGenerationToast?.('No se pudo completar la busqueda.', true);
                console.error('Graficador: error buscando diagramas', error);
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
                editor.showGenerationToast?.('Selecciona un diagrama para cargar.', true);
                return;
            }
            const grafico = (selected.GRAFICO || '').trim();
            if (!grafico) {
                editor.showGenerationToast?.('El diagrama seleccionado no tiene grafico.', true);
                return;
            }
            editor.editor.value = grafico;
            if (editor.titleInput && selected.NOMBRE_SP) {
                editor.titleInput.value = selected.NOMBRE_SP;
            }
            editor.saveState();
            editor.render();
            const shareName = selected.NOMBRE_SP || selected.nombre_sp || selected.NOMBRE || '';
            if (shareName) {
                editor.updateShareUrl(shareName);
            }
            editor.showGenerationToast?.('Diagrama cargado correctamente.');
            this.close(editor);
        }
    };

    window.GraficadorLoadModal = loadModal;
})();
