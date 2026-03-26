/*
 * Modal de guardado para Graficador (solo nombre del SP)
 */

(function () {
    const saveModal = {
        pendingState: null,

        init: function (editor) {
            if (!editor) return;

            editor.saveDialog = document.getElementById('saveDiagramModal');
            editor.saveButton = document.getElementById('btnSaveDiagram');
            editor.saveNameInput = document.getElementById('saveNameInput');
            editor.saveCancelButton = document.getElementById('saveDiagramCancel');
            editor.saveSubmitButton = document.getElementById('saveDiagramSubmit');

            // --- 2. Referencias al Modal de Sobrescritura (Nuevo) ---
            this.overwriteModal = document.getElementById('diagramOverwriteModal');
            this.overwriteNameLabel = document.getElementById('diagramOverwriteModalName');
            this.overwriteConfirmBtn = document.getElementById('diagramOverwriteConfirmBtn');
            this.overwriteCancelBtn = document.getElementById('diagramOverwriteCancelBtn');

            if (!editor.saveDialog || !editor.saveButton) return;

            editor.saveButton.addEventListener('click', () => this.open(editor));
            editor.saveCancelButton?.addEventListener('click', () => this.close(editor));
            editor.saveSubmitButton?.addEventListener('click', () => this.submit(editor));

            this.overwriteCancelBtn?.addEventListener('click', () => this.closeOverwriteModal());
            this.overwriteConfirmBtn?.addEventListener('click', () => this.confirmOverwrite(editor));
        },

        open: function (editor) {
            if (!editor.saveDialog) return;
            editor.saveDialog.classList.remove('hidden');
            if (editor.saveNameInput && editor.titleInput) {
                const currentTitle = (editor.titleInput.value || '').trim();
                if (currentTitle) {
                    editor.saveNameInput.value = currentTitle;
                }
                editor.saveNameInput.focus();
            }
        },

        close: function (editor) {
            if (!editor.saveDialog) return;
            editor.saveDialog.classList.add('hidden');
            this.closeOverwriteModal()
            this.pendingState = null;
        },

        submit: async function (editor) {
            if (!editor.api) {
                editor.showGenerationToast?.('API del Graficador no disponible.', true);
                return;
            }
            const nombreSp = (editor.saveNameInput?.value || '').trim();
            if (!nombreSp) {
                editor.showGenerationToast?.('Ingresa el nombre del SP.', true);
                return;
            }
            const graficoRaw = (editor.editor?.value || '').trim();
            if (!graficoRaw) {
                editor.showGenerationToast?.('No hay diagrama para guardar.', true);
                return;
            }
            try {
                // Validación contra BDD
                const results = await editor.api.getAllNombres();
                const match = (results || []).find(r => {
                    const dbName = r.NOMBRE_SP || r.nombre_sp;
                    return dbName && dbName.toUpperCase() === nombreSp.toUpperCase();
                });
                if (match) {
                    this.pendingState = { nombre: nombreSp, grafico: graficoRaw };
                    this.openOverwriteModal(nombreSp);
                }
                else {
                    await this.executeSave(editor, nombreSp, graficoRaw);
                }
            } catch (error) {
                const message = error?.message ? error.message : String(error);
                editor.showGenerationToast?.(`Error al guardar: ${message}`, true);
                console.error('Graficador: error guardando diagrama', error);
            }
        },

        openOverwriteModal: function (nombre) {
            if (!this.overwriteModal) return;
            if (this.overwriteNameLabel) this.overwriteNameLabel.textContent = nombre;
            this.overwriteModal.classList.remove('hidden');
        },

        closeOverwriteModal: function () {
            if (!this.overwriteModal) return;
            this.overwriteModal.classList.add('hidden');
        },

        confirmOverwrite: async function (editor) {
            if (!this.pendingState) return;
            this.closeOverwriteModal();
            await this.executeSave(editor, this.pendingState.nombre, this.pendingState.grafico);
        },

        // --- LÓGICA DE GUARDADO FINAL (API) ---
        executeSave: async function (editor, nombreSp, grafico) {
            try {
                await editor.api.saveCatalogo({
                    nombreSp,
                    grafico
                });

                if (editor.titleInput) {
                    editor.titleInput.value = nombreSp;
                }
                editor.showGenerationToast?.('Diagrama guardado correctamente.');

                this.pendingSaveData = null;
                this.close(editor);

            } catch (error) {
                const message = error?.message ? error.message : String(error);
                editor.showGenerationToast?.(`Error al guardar: ${message}`, true);
                console.error('Graficador: error guardando diagrama', error);
            }
        }
    };

    window.GraficadorSaveModal = saveModal;
})();
