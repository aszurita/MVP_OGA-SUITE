(function () {
    const sqlModal = {
        init: function (editor) {
            if (!editor) return;
            editor.sqlDialog = document.getElementById('sqlGenerationModal');
            editor.sqlTextArea = document.getElementById('sqlInputTextarea');
            editor.sqlFileInput = document.getElementById('sqlFileModalInput');
            editor.sqlFileBtn = document.getElementById('btnTriggerFile');
            
            editor.sqlCancelBtn = document.getElementById('sqlModalCancel');
            editor.sqlSubmitBtn = document.getElementById('sqlModalSubmit');

            if (!editor.sqlDialog) return;

            editor.sqlCancelBtn?.addEventListener('click', () => this.close(editor));
            editor.sqlSubmitBtn?.addEventListener('click', () => this.submit(editor));
            
            editor.sqlFileBtn?.addEventListener('click', () => {
                editor.sqlFileInput?.click();
            });

            editor.sqlFileInput?.addEventListener('change', (e) => {
                const file = e.target?.files && e.target.files[0];
                if (!file) return;
                
                const reader = new FileReader();
                reader.onload = () => {
                    if (editor.sqlTextArea) {
                        editor.sqlTextArea.value = reader.result || '';
                    }
                    e.target.value = ''; 
                };
                reader.onerror = () => {
                    editor.showGenerationToast?.('Error al leer el archivo.', true);
                };
                reader.readAsText(file);
            });
        },

        open: function (editor) {
            if (!editor.sqlDialog) return;
            
            if (editor.sqlTextArea) editor.sqlTextArea.value = '';
            
            editor.sqlDialog.classList.remove('hidden');
            editor.sqlTextArea?.focus();
        },

        close: function (editor) {
            if (!editor.sqlDialog) return;
            editor.sqlDialog.classList.add('hidden');
        },

        submit: function (editor) {
            const sqlText = (editor.sqlTextArea?.value || '').trim();
            
            if (!sqlText) {
                editor.showGenerationToast?.('El contenido SQL está vacío.', true);
                return;
            }
            if (typeof editor.generateDiagramFromSql === 'function') {
                editor.generateDiagramFromSql(sqlText);
                this.close(editor);
            } else {
                console.error('La función generateDiagramFromSql no existe en el editor.');
            }
        }
    };

    window.GraficadorSqlModal = sqlModal;
})();