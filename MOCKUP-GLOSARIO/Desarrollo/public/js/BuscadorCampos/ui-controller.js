(function (root) {
  'use strict';

  if (!root.BuscadorCamposUI) {
    root.BuscadorCamposUI = {};
  }

  const BuscadorCamposUI = root.BuscadorCamposUI;

  function mergeRecords(current = {}, incoming = {}) {
    const result = { ...(current || {}) };
    for (const key in incoming) {
      if (!Object.prototype.hasOwnProperty.call(incoming, key)) continue;
      const value = incoming[key];
      if (value === undefined || value === null) continue;
      if (typeof value === 'string' && value.trim() === '') continue;
      result[key] = value;
    }
    return result;
  }

  function applyChangesToCaches(llaveTabla, cambios) {
    if (!llaveTabla || !cambios || typeof cambios !== 'object') return;
    const safeMerge = (dest = {}, src = {}) => mergeRecords(dest, src);
    if (typeof root.sincronizarCachesTablas === 'function') {
      try {
        root.sincronizarCachesTablas(llaveTabla, cambios);
        return;
      } catch (err) {
        console.warn('[BuscadorCamposUI] Error usando sincronizarCachesTablas:', err);
      }
    }
    const apply = (coleccion) => {
      if (!Array.isArray(coleccion)) return;
      coleccion.forEach(item => {
        if (item && item.llave_tabla === llaveTabla) Object.assign(item, safeMerge(item, cambios));
      });
    };
    apply(root.window?.campos);
    apply(root.window?.camposdistinct);
    apply(root.window?.info_tecnica);
  }

  function refreshDataTableView() {
    if (typeof root.redrawDataTableBuscadorCampos !== 'function') return;
    try {
      const isGrouped = root.$ ? root.$("#switchS3").is(':checked') : false;
      const dataset = isGrouped ? (root.window.camposdistinct || []) : (root.window.campos || []);
      root.redrawDataTableBuscadorCampos("campos", dataset);
    } catch (err) {
      console.warn('[BuscadorCamposUI] No se pudo refrescar el DataTable:', err);
    }
  }

  BuscadorCamposUI.refreshTempMetadata = function refreshTempMetadata() {
    try {
      if (typeof getInfoTablasOficialesTemp !== 'function') {
        console.warn('[BuscadorCamposUI] getInfoTablasOficialesTemp no está disponible.');
        return;
      }

      const tempData = getInfoTablasOficialesTemp() || {};
      if (!root.window.tablas_oficiales) {
        root.window.tablas_oficiales = {};
      }

      const target = root.window.tablas_oficiales;
      let cambiosAplicados = false;
      Object.keys(tempData).forEach(key => {
        const merged = mergeRecords(target[key], tempData[key]);
        target[key] = merged;
        applyChangesToCaches(key, tempData[key]);
        cambiosAplicados = true;
      });
      if (cambiosAplicados) refreshDataTableView();
    } catch (error) {
      console.error('[BuscadorCamposUI] Error al refrescar metadatos desde SharePoint:', error);
    }
  };

  BuscadorCamposUI.bindSearchRefresh = function bindSearchRefresh(config = {}) {
    const inputSelector = config.inputSelector || '#campos-search';
    const listSelector = config.listSelector || '#campos-searchautocomplete-list';
    const input = document.querySelector(inputSelector);

    if (input) {
      input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          BuscadorCamposUI.refreshTempMetadata();
        }
      });
    }

    document.addEventListener('click', (event) => {
      const list = document.querySelector(listSelector);
      if (!list) return;
      if (list.contains(event.target)) {
        BuscadorCamposUI.refreshTempMetadata();
      }
    }, true);
  };

  document.addEventListener('DOMContentLoaded', () => {
    BuscadorCamposUI.bindSearchRefresh({
      inputSelector: '#campos-search',
      listSelector: '#campos-searchautocomplete-list'
    });
  });

})(window);
