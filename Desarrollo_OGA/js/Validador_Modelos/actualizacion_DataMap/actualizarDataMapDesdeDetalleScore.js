/* js/Validador_Modelos/actualizacion_DataMap/actualizarDataMapDesdeDetalleScore.js
 * -------------------------------------------------------------------------------
 * ▸ Inyecta valores y flags `aplica` provenientes de Z_DETALLES_SCORE
 * ▸ Calcula sub.aplica = 0 cuando TODAS las preguntas de la sub-sección ⇒ aplica = 0
 * ▸ Recalcula scores y repinta la sección que el usuario estaba viendo                */

function actualizarDataMapDesdeDetalleScore (detalles) {
  /* 1️⃣  Validación rápida */
  if (!Array.isArray(detalles) || detalles.length === 0) {
    console.warn("⚠️ No hay detalles para actualizar el dataMapGlobal.");
    return;
  }

  /* 2️⃣  Lookup por id_pregunta */
  const detMap = new Map(
    detalles.map(d => [parseInt(d.id_pregunta, 10), d])
  );

  /* 3️⃣  Actualizamos preguntas y calculamos sub.aplica */
  Object.values(dataMapGlobal).forEach(sec => {
    Object.values(sec).forEach(sub => {
      if (!sub || !sub.parametros) return;

      let algunaPreguntaActiva = false;

      Object.values(sub.parametros).forEach(param => {
        param.preguntas.forEach(p => {
          const det = detMap.get(+p.id);
          if (det) {
            p.porcentajeCompletado = +det.valor;   // valor desde SharePoint
            p.aplica               = +det.aplica;  // 0 | 1
          }
          if (p.aplica === 1) algunaPreguntaActiva = true;
        });
      });

      /* ⬅️  Flag de la sub-sección: 1 si al menos una pregunta aplica */
      sub.aplica = algunaPreguntaActiva ? 1 : 0;
    });
  });

  /* 4️⃣  Recalcular scores (sub-sección, sección y final) */
  recalcularTodo();

  /* 5️⃣  Repintar la sección que el usuario tenía abierta (si existe) */
  const abierta = obtenerSeccionActual();
  if (abierta) {
    renderizarContenido(".contenedores-cards", abierta);
  }
}
