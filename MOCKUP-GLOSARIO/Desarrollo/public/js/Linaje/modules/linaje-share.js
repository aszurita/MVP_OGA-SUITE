/**
 * LINAJE SHARE MODULE
 * Comparte y carga linajes vía URL (?sp=)
 * Reglas:
 *  - Solo se puede compartir si el linaje existe en la BDD
 *  - El nombre se toma SIEMPRE desde #tituloFlujoActual
 *  - Al abrir un link compartido, se carga el linaje y se actualiza el título
 */

const linajeShare = {

  shareParamKey: 'sp',
  shareButtonId: 'btnShareLinaje',
  titleInputId: 'tituloFlujoActual',

  controller: null,
  api: null,
  toastHandler: null,

  _defaultToast(message, isError = false) {
    if (isError) {
      console.error(message);
    } else {
      console.log(message);
    }
  },

  _toast(message, isError = false) {
    if (typeof this.toastHandler === 'function') {
      this.toastHandler(message, isError);
    } else {
      this._defaultToast(message, isError);
    }
  },

  // =====================================================
  // INIT
  // =====================================================
  init({ controller, api, showGenerationToast }) {
    if (!controller || typeof controller.loadDiagram !== 'function') {
      this._toast('linajeShare: controller inválido', true);
      return;
    }
    if (!api || typeof api.searchLinajes !== 'function') {
      this._toast('linajeShare: api inválida', true);
      return;
    }

    this.controller = controller;
    this.api = api;
    this.toastHandler = typeof showGenerationToast === 'function'
      ? showGenerationToast
      : this._defaultToast.bind(this);

    // Botón compartir
    const btn = document.getElementById(this.shareButtonId);
    if (btn) {
      btn.addEventListener('click', () => this.shareCurrentLinaje());
    }

    // Carga automática desde URL (?sp=)
    this.loadFromUrl();
  },

  // =====================================================
  // SHARE
  // =====================================================
  async shareCurrentLinaje() {
    const name = this.getShareName();

    if (!name) {
      this._toast('⚠️ Asigna un nombre y guarda el linaje antes de compartir.', true);
      return;
    }

    try {
      // Validación contra BDD
      const results = await this.api.searchLinajes(name, 5);

      const match = (results || []).find(r => {
        const n = r.nombre_linaje || r.NOMBRE_LINAJE || r.NombreLinaje;
        return n && n.toUpperCase() === name.toUpperCase();
      });

      if (!match) {
        this._toast(`⚠️ El linaje "${name}" no está guardado. Guarda antes de compartir.`, true);
        return;
      }

      const url = this.buildShareUrl(name);
      await this.copyToClipboard(url);

      this._toast('🔗 Enlace copiado para compartir');

    } catch (error) {
      console.error('Error validando linaje para compartir', error);
      this._toast('❌ Error al validar el linaje', true);
    }
  },

  getShareName() {
    return document.getElementById(this.titleInputId)?.value?.trim() || '';
  },

  buildShareUrl(value) {
    const url = new URL(window.location.href);
    url.searchParams.set(this.shareParamKey, value);
    history.replaceState({}, '', url);
    return url.toString();
  },

  // =====================================================
  // LOAD FROM URL
  // =====================================================
  async loadFromUrl() {
    const name = new URLSearchParams(window.location.search).get(this.shareParamKey);
    if (!name) return;

    try {
      const results = await this.api.searchLinajes(name, 5);

      const match = (results || []).find(r => {
        const n = r.nombre_linaje || r.NOMBRE_LINAJE || r.NombreLinaje;
        return n && n.toUpperCase() === name.toUpperCase();
      });

      if (!match) {
        this._toast(`⚠️ No se encontró el linaje "${name}"`, true);
        return;
      }

      let rawContent =
        match.contenido ||
        match.CONTENIDO ||
        match.codigojson ||
        match.CodigoJson ||
        match.GRAFICO ||
        null;

      if (!rawContent) {
        this._toast(`⚠️ El linaje "${name}" no tiene contenido guardado`, true);
        return;
      }

      if (typeof rawContent === 'object') {
        rawContent = JSON.stringify(rawContent);
      }

      let data;
      try {
        data = JSON.parse(rawContent);
      } catch {
        this._toast('❌ El JSON del linaje compartido es inválido', true);
        return;
      }

      this.applySharedLinaje(data, name);

    } catch (error) {
      console.error('Error cargando linaje compartido', error);
      this._toast('❌ Error al cargar el linaje compartido', true);
    }
  },

  applySharedLinaje(data, name) {
    // Cargar diagrama
    this.controller.loadDiagram(data);

    // Actualizar título (fuente única)
    const titleInput = document.getElementById(this.titleInputId);
    if (titleInput) {
      titleInput.value = name;
      titleInput.dispatchEvent(new Event('input', { bubbles: true }));
    }

    this._toast('Linaje cargado correctamente.');
  },

  // =====================================================
  // CLIPBOARD
  // =====================================================
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (initialError) {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.setAttribute('readonly', '');
        textArea.style.position = 'absolute';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        textArea.setSelectionRange(0, text.length);
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return true;
      } catch (fallbackError) {
        console.error('Error copiando al portapapeles', initialError, fallbackError);
        this._toast('⚠️ Copia manualmente el enlace:', true);
        return false;
      }
    }
  }
};

window.linajeShare = linajeShare;
