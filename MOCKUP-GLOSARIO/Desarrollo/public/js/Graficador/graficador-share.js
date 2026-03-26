/**
 * GRAFICADOR SHARE MODULE
 * Comparte y carga diagramas vía URL (?sp=)
 * Reglas:
 *  - Solo se puede compartir si el diagrama existe en la BDD
 *  - El nombre se toma SIEMPRE desde #tituloFlujoActual
 *  - Al abrir un link compartido, se carga el diagrama y se actualiza el título
 */

const graficadorShare = {

  shareParamKey: 'sp',
  shareButtonId: 'btnShareLink',
  titleInputId: 'tituloFlujoActual',

  controller: null,
  api: null,

  // =====================================================
  // INIT
  // =====================================================
  init({ controller, api }) {
    if (!controller || typeof controller.loadDiagram !== 'function') {
      console.warn('graficadorShare: controller inválido');
      return;
    }
    if (!api || typeof api.getAllNombres !== 'function') {
      console.warn('graficadorShare: api inválida');
      return;
    }

    this.controller = controller;
    this.api = api;

    // Botón compartir
    const btn = document.getElementById(this.shareButtonId);
    if (btn) {
      btn.addEventListener('click', () => this.shareCurrentDiagram());
    }

    // Carga automática desde URL (?sp=)
    this.loadFromUrl();
  },

  // =====================================================
  // SHARE
  // =====================================================
  async shareCurrentDiagram() {
    const name = this.getShareName();

    if (!name) {
      alert('⚠️ Asigna un nombre y guarda el diagrama antes de compartir.');
      return;
    }

    try {
      // Validación contra BDD
      const results = await this.api.getAllNombres();

      const match = (allNames || []).find(r => {
        const dbName = r.NOMBRE_SP || r.nombre_sp;
        return dbName && dbName.toUpperCase() === name.toUpperCase();
      });

      if (!match) {
        alert(`⚠️ El diagrama "${name}" no está guardado. Guarda antes de compartir.`);
        return;
      }

      const url = this.buildShareUrl(name);
      await this.copyToClipboard(url);

      alert('🔗 Enlace copiado para compartir');

    } catch (error) {
      console.error('Error validando diagrama para compartir', error);
      alert('❌ Error al validar el diagrama');
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
        alert(`⚠️ No se encontró el linaje "${name}"`);
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
        alert(`⚠️ El linaje "${name}" no tiene contenido guardado`);
        return;
      }

      if (typeof rawContent === 'object') {
        rawContent = JSON.stringify(rawContent);
      }

      let data;
      try {
        data = JSON.parse(rawContent);
      } catch {
        alert('❌ El JSON del linaje compartido es inválido');
        return;
      }

      this.applySharedLinaje(data, name);

    } catch (error) {
      console.error('Error cargando linaje compartido', error);
      alert('❌ Error al cargar el linaje compartido');
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
  },

  // =====================================================
  // CLIPBOARD
  // =====================================================
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      prompt('Copia el enlace:', text);
    }
  }
};

window.graficadorShare = graficadorShare;
