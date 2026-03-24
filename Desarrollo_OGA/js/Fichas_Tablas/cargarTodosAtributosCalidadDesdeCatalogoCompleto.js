async function cargarTodosAtributosCalidadDesdeCatalogoCompleto() {
  if (window.camposAtributoGlobal) {
    console.log("[SKIP] Atributos ya cargados");
    return;
  }

  console.log("[cargarTodosAtributosCalidadDesdeCatalogoCompleto] Ejecutando...");
  const tablasoficialesInfo = getInfoTablasOficiales();
  const info_tecnica_corta = getInfoTecnicaCorta();
  const info_tecnica = window._Z_INF_TECNICA_LARGA || await getDatasetTecnicaLargaConCache();

  const camposProcesados = new Set();
  const resultado_info_tecnica = [];

  const procesar = (elemento) => {
    if (!elemento || camposProcesados.has(elemento.llave_unica)) return;
    const tablaInfo = tablasoficialesInfo[elemento.llave_tabla] || {};
    elemento.clasificacion = tablaInfo.clasificacion || " ";
    elemento.descripcion_tabla = tablaInfo.descripcion_tabla || " ";
    resultado_info_tecnica.push(elemento);
    camposProcesados.add(elemento.llave_unica);
  };

  async function procesarEnChunks(datos, chunkSize = 1000) {
    for (let i = 0; i < datos.length; i += chunkSize) {
      const chunk = datos.slice(i, i + chunkSize);
      chunk.forEach(procesar);
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }

  console.time('⏱ Procesar técnica corta/larga');
  await procesarEnChunks(info_tecnica_corta);
  await procesarEnChunks(info_tecnica);
  console.timeEnd('⏱ Procesar técnica corta/larga');

  const indexTecnica = new Map();
  for (const item of resultado_info_tecnica) {
    if (!item.codigo || item.codigo.startsWith("***")) continue;
    const clave = `${item.plataforma}__${item.servidor}__${item.base}__${item.esquema}__${item.tabla}`;
    if (!indexTecnica.has(clave)) indexTecnica.set(clave, []);
    indexTecnica.get(clave).push(item);
  }

  const atributosGlobales = [];
  for (const tabla of window.catalogoCompleto || []) {
    const clave = `${tabla.plataforma}__${tabla.servidor}__${tabla.base}__${tabla.esquema}__${tabla.tabla}`;
    const encontrados = indexTecnica.get(clave);
    if (encontrados) atributosGlobales.push(...encontrados);
  }

  window.camposAtributoGlobal = atributosGlobales;
  console.log("[✅ COMPLETADO] Total atributos cargados:", atributosGlobales.length);
}
