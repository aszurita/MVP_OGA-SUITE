(function (global) {
  'use strict';

  const cache = new Map();

  function normalizeCasoId(raw) {
    const value = (raw ?? '').toString().trim();
    return value === '' ? null : value.match(/^\d+$/) ? value : null;
  }

  function capitalize(value) {
    const text = (value ?? '').toString();
    if (!text) return text;
    return text[0].toUpperCase() + text.slice(1);
  }

  async function queryCasoUso(idCaso) {
    if (!idCaso) return null;
    if (cache.has(idCaso)) return cache.get(idCaso);
    if (typeof AINGINE === 'undefined' || typeof AINGINE.get !== 'function') {
      console.warn('[Glosario/api] AINGINE no está disponible');
      cache.set(idCaso, null);
      return null;
    }

    try {
      const rows = await AINGINE.get({
        select: 'id_caso_uso, sn_activo, descripcion_caso_uso',
        from: 'procesos_bi.dbo.t_casos_uso_analitica',
        where: `id_caso_uso = '${idCaso}' AND sn_activo = '1'`
      });
      const result = Array.isArray(rows) && rows.length ? rows[0] : null;
      if (result && typeof result.descripcion_caso_uso === 'string') {
        result.descripcion_caso_uso = capitalize(result.descripcion_caso_uso.trim());
      }
      cache.set(idCaso, result);
      return result;
    } catch (error) {
      console.error('[Glosario/api] No se pudo obtener el caso de uso', error);
      cache.set(idCaso, null);
      return null;
    }
  }

  function extractCasoIdFromSubdominio(value) {
    if (!value) return null;
    const tokens = value.toString().split(";");
    for (let i = tokens.length - 1; i >= 0; i--) {
      const candidate = tokens[i].trim();
      if (!candidate) continue;
      const matches = candidate.match(/\d+/g);
      if (matches && matches.length) {
        return normalizeCasoId(matches[matches.length - 1]);
      }
    }
    return null;
  }

  function clearCache() {
    cache.clear();
  }

  const GlosarioApi = {
    extractCasoIdFromSubdominio,
    fetchCasoUsoDescripcion: async function (idCaso) {
      const normalized = normalizeCasoId(idCaso);
      const row = await queryCasoUso(normalized);
      return row ? row.descripcion_caso_uso : null;
    },
    fetchCasoUso: queryCasoUso,
    clearCache,
  };

  global.GlosarioApi = global.GlosarioApi || GlosarioApi;
})(window);
