/* js/Validador_Modelos/renderizarContenido.js
 * -------------------------------------------
 *  ▸ Recibe la SECCIÓN principal que está visible y genera
 *    una tarjeta (`card`) por cada SUB-sección encontrada en
 *    `dataMapGlobal[seccionFiltrada]`.
 *  ▸ A cada tarjeta se le pasa el nombre de la sección para que
 *    el “switch global” pueda ubicar su posición exacta dentro
 *    de `dataMapGlobal`.
 * ------------------------------------------- */
function renderizarContenido(selectorContenedor, seccionFiltrada, esBloqueada) {
  const $contenedor = $(selectorContenedor);
  const dataMap = dataMapGlobal[seccionFiltrada];

  // Limpia el contenedor antes de volver a pintar
  $contenedor.empty();

  if (!dataMap) {
    console.error("❌ Sección inexistente en dataMapGlobal:", seccionFiltrada);
    return;
  }

  // Recorre sólo las claves que representan sub-secciones reales
  Object.entries(dataMap)
    .filter(([sid, sub]) => sub && typeof sub === "object" && sub.parametros)
    .forEach(([subId, sub]) => {
      const collapseIdMain = `collapse-main-${subId}`;

      const parametrosHtml = crearParametrosHtml(
        sub, subId,
        seccionFiltrada,
        esBloqueada
      );

      const cardHtml = crearCardHtml(
        sub,
        subId,
        collapseIdMain,
        parametrosHtml,
        seccionFiltrada // ← sin bloqueo
      );

      $contenedor.append(cardHtml);
    });
}
