// js/Linaje/modules/linaje-save-modal.js
// Modal logic for saving linaje JSON to the database
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory(require('./api.js'));
  } else {
    root.LinajeSaveModal = factory(root.apiManager);
  }
})(typeof self !== 'undefined' ? self : this, function (apiManager) {
  'use strict';

  class LinajeSaveModal {
    constructor({ getJson, getUser, showGenerationToast }) {
      this.getJson = getJson;
      this.getUser = getUser;
      this.modalId = 'linajeSaveModal';
      this.saveBtnId = 'linajeSaveModalSaveBtn';
      this.cancelBtnId = 'linajeSaveModalCancelBtn';
      this.nameInputId = 'linajeSaveModalName';
      this.confirmModalId = 'linajeOverwriteModal';
      this.confirmNameId = 'linajeOverwriteModalName';
      this.confirmButtonId = 'linajeOverwriteConfirmBtn';
      this.rejectButtonId = 'linajeOverwriteCancelBtn';
      this._pendingSavePayload = null;
      this._skipOverwriteForName = null;
      this.isSaving = false;
      this.showGenerationToast = showGenerationToast;
      this._bindEvents();
    }

    _bindEvents() {
      const saveBtn = document.getElementById(this.saveBtnId);
      saveBtn?.addEventListener('click', () => this.save());

      const confirmBtn = document.getElementById(this.confirmButtonId);
      confirmBtn?.addEventListener('click', () => this._handleConfirmOverwrite());

      const rejectBtn = document.getElementById(this.rejectButtonId);
      rejectBtn?.addEventListener('click', () => this._closeOverwritePrompt());

      this._attachOverlayClose(this.modalId, () => this.close());
      this._attachOverlayClose(this.confirmModalId, () => this._closeOverwritePrompt());

    }

    _getModalElement() {
      return document.getElementById(this.modalId);
    }

    _emitEvent(name) {
      const modalEl = this._getModalElement();
      if (!modalEl) return;
      modalEl.dispatchEvent(new CustomEvent(`linajeSaveModal:${name}`, { bubbles: true }));
    }

    _attachOverlayClose(modalId, onClose) {
      const modal = document.getElementById(modalId);
      if (!modal) return;
      modal.addEventListener('click', (event) => {
        if (event.target === modal) {
          onClose?.();
        }
      });
    }

    async save() {
      if (this.isSaving) return;

      const nombreLinaje = document
        .getElementById(this.nameInputId)
        .value
        .trim();

      if (!nombreLinaje) {
        this.showGenerationToast?.(
          'Debe colocar un nombre para el Linaje.',
          true
        );
        return;
      }

      let codigoJson;

      try {
        const rawJson = typeof this.getJson === 'function'
          ? this.getJson()
          : null;

        if (!rawJson) {
          throw new Error('No se pudo obtener el JSON del linaje.');
        }

        codigoJson = typeof rawJson === 'string'
          ? rawJson
          : JSON.stringify(rawJson);

        const parsed = JSON.parse(codigoJson);

        const nodes =
          parsed?.elements?.nodes ??
          parsed?.nodes ??
          [];

        if (!Array.isArray(nodes) || nodes.length === 0) {
          throw new Error('Debe agregar al menos un nodo al linaje.');
        }

      } catch (error) {
        this.showGenerationToast?.(
          error.message || 'Error validando el linaje.',
          true
        );
        return;
      }

      const usuarioCreador =
        typeof this.getUser === 'function'
          ? this.getUser()
          : 'desconocido';

      const fechaCreacion = new Date().toISOString().split('T')[0];

      const payload = {
        nombreLinaje,
        codigoJson,
        usuarioCreador,
        fechaCreacion
      };

      const shouldPrompt = await this._shouldPromptOverwrite(nombreLinaje);
      if (shouldPrompt) {
        this._pendingSavePayload = payload;
        this._showOverwritePrompt(nombreLinaje);
        return;
      }

      await this._executeSave(payload);
    }

    async _executeSave(payload) {
      if (this.isSaving) return;
      this.isSaving = true;
      try {
        await apiManager.postLinajeGuardado(payload);
        this.close();
        this.showGenerationToast?.(
          'Linaje guardado correctamente.'
        );
      } catch (error) {
        this.close();
        this.showGenerationToast?.(
          `Error al guardar: ${error?.message || error}`,
          true
        );
      } finally {
        this.isSaving = false;
        this._skipOverwriteForName = null;
      }
    }

    async _shouldPromptOverwrite(name) {
      if (!name) return false;
      const normalized = name.toString().trim().toUpperCase();
      if (!normalized) return false;
      if (this._skipOverwriteForName === normalized) return false;
      return await this._nameExists(normalized);
    }

    async _nameExists(name) {
      if (!apiManager?.searchLinajes) return false;
      const normalized = name.toString().trim().toUpperCase();
      if (!normalized) return false;
      try {
        const results = await apiManager.searchLinajes(name, 5);
        return (results || []).some(r => {
          const candidate = (r.nombre_linaje || r.NombreLinaje || '').toString().trim().toUpperCase();
          return candidate === normalized;
        });
      } catch (error) {
        console.error('linajeSaveModal _nameExists', error);
        return false;
      }
    }

    _showOverwritePrompt(name) {
      const modal = document.getElementById(this.confirmModalId);
      if (!modal) return;
      const nameElement = document.getElementById(this.confirmNameId);
      if (nameElement) nameElement.textContent = name;
      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
    }

    _closeOverwritePrompt() {
      const modal = document.getElementById(this.confirmModalId);
      if (!modal) return;
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
      this._pendingSavePayload = null;
    }

    _handleConfirmOverwrite() {
      if (!this._pendingSavePayload) {
        this._closeOverwritePrompt();
        return;
      }
      const payload = this._pendingSavePayload;
      this._pendingSavePayload = null;
      this._skipOverwriteForName = payload.nombreLinaje.toString().trim().toUpperCase();
      this._closeOverwritePrompt();
      this._executeSave(payload);
    }


    open() {
      const modalEl = this._getModalElement();
      if (!modalEl) return;

      modalEl.classList.remove('hidden');
      modalEl.setAttribute('aria-hidden', 'false');
      modalEl.querySelector('input, textarea, select')?.focus();
      this._emitEvent('open');
    }

    close() {
      const modalEl = this._getModalElement();
      if (!modalEl) return;

      modalEl.classList.add('hidden');
      modalEl.setAttribute('aria-hidden', 'true');
      this._emitEvent('close');
    }

  }

  return LinajeSaveModal;
});
