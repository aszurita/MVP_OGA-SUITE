/* js/Validador_Modelos/utils/verificarCambiosEnPreguntas.js
   ---------------------------------------------------------
   ▸ Devuelve TRUE si el usuario ha tocado al menos una pregunta.
   ▸ Compara el estado visible (dataMapGlobal) con el snapshot
     original (originalDataMap) que se genera:
       – al cargar la plantilla   (todo 0 % + aplica = 1)
       – al cargar la última validación guardada
       – justo DESPUÉS de cada guardado con éxito
   --------------------------------------------------------- */
function verificarCambiosEnPreguntas () {

  if (!dataMapGlobal || typeof dataMapGlobal !== "object") return false;

  /* Si no existe snapshot aún, consideramos que no hay cambios */
  if (!originalDataMap || Object.keys(originalDataMap).length === 0) return false;

  let cambiado = false;
  const preguntasModificadas = []; // Array para guardar las preguntas que cambiaron

  /* Recorremos todas las preguntas uno-a-uno */
  Object.entries(dataMapGlobal).forEach(([secKey, seccion]) => {
    const seccionOrig = originalDataMap[secKey] || {};

    Object.entries(seccion).forEach(([subId, sub]) => {
      if (!sub || !sub.parametros) return;
      const subOrig = seccionOrig[subId] || {};

      Object.entries(sub.parametros).forEach(([paramId, param]) => {
        const paramOrig = subOrig.parametros?.[paramId] || {};

        param.preguntas.forEach((p, idx) => {
          const pOrig = paramOrig.preguntas?.[idx] || {};
          const pctActual = parseInt(p.porcentajeCompletado, 10);
          const pctOriginal = parseInt(pOrig.porcentajeCompletado || 0, 10);
          const aplicaActual = parseInt(p.aplica, 10);
          const aplicaOriginal = parseInt(pOrig.aplica ?? 1, 10);

          const pctDiff = pctActual !== pctOriginal;
          const aplicaDiff = aplicaActual !== aplicaOriginal;

          if (pctDiff || aplicaDiff) {
            cambiado = true;
            // Añadimos el detalle del cambio a nuestro array
            preguntasModificadas.push({
              pregunta: p.texto,
              cambio_porcentaje: pctDiff ? `de ${pctOriginal}% a ${pctActual}%` : 'Sin cambios',
              cambio_aplica: aplicaDiff ? `de ${aplicaOriginal === 1 ? 'Aplica' : 'No Aplica'} a ${aplicaActual === 1 ? 'Aplica' : 'No Aplica'}` : 'Sin cambios'
            });
          }
        });
      });
    });
  });

  // Si hubo cambios, los mostramos en la consola en formato de tabla
  if (cambiado) {
    console.log("🔧 ¡Cambios en preguntas detectados! Aquí está la lista:");
    console.table(preguntasModificadas);
  }

  return cambiado;
}
