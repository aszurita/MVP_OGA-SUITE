/**
 * Calcula el porcentaje de avance de metadatos para una tabla específica.
 *
 * El dataset esperado es `window.info_tecnica` (o `window.campos` como respaldo) que se construye
 * antes de renderizar el Buscador de Campos a partir de los TXT `Z_INF_TECNICA` y `Z_INF_TECNICA_FICHAS`
 * (descargados en `suite.js`) y de los cambios cargados en la sesión; por eso cada fila contiene
 * `plataforma`, `servidor`, `base`, `esquema`, `tabla`, `detalle` y `descripcion`.
 * trae `plataforma`, `servidor`, `base`, `esquema`, `tabla`, `detalle` y `descripcion`.
 *
 * @param {Array} dataset - Lista de filas técnicas (normalmente `window.info_tecnica`).
 * @param {Object} filtro - Objeto con las claves {plataforma, servidor, base, esquema, tabla}.
 *                          Se normalizan y comparan con cada fila para incluir sólo esa tabla.
 * @returns {string|null} Porcentaje entero (redondeado) del número de campos que tienen detalle o descripción válidos,
 *                        o `null` si no hay filas que coincidan.
 */
(function () {
  const normalizeForAvance = (value) => (value || "").toString()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toUpperCase().replace(/\s+/g, " ").trim();

  function calcularAvanceTabla(dataset, filtro = {}) {
    if (!Array.isArray(dataset) || !dataset.length) return null;
    if (typeof filtro !== "object" || filtro === null) return null;

    const fields = ["plataforma", "servidor", "base", "esquema", "tabla"];
    const filterNorm = {};
    fields.forEach(field => {
      const raw = filtro[field] ?? filtro[field.toUpperCase()] ?? "";
      filterNorm[field] = normalizeForAvance(raw);
    });

    let tot = 0;
    let ok = 0;
    dataset.forEach(row => {
      if (!row) return;
      for (const field of fields) {
        const required = filterNorm[field];
        if (required && normalizeForAvance(row[field]) !== required) {
          return;
        }
      }
      tot += 1;
      const det = (row.detalle || "").toString();
      const desc = (row.descripcion || "").toString();
      const cuenta = (
        (det.replace(/\s+/g, "") !== "" && !det.startsWith("***")) ||
        (desc.replace(/\s+/g, "") !== "" && !desc.startsWith("***"))
      );
      if (cuenta) ok += 1;
    });

    if (!tot) return null;
    return ((ok / tot) * 100).toFixed(0);
  }

  window.calcularAvanceTabla = calcularAvanceTabla;
})();
