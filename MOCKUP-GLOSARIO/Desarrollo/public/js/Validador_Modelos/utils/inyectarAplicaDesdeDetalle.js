/**
 * Inyecta flags `aplica` (y valores) al dataMapGlobal a partir de
 * la lista Z_DETALLES_SCORE.
 * @param {Array<{id_pregunta:string|number, valor:number, aplica:number}>} detalles
 */
function inyectarAplicaDesdeDetalle (detalles = []) {
  if (!Array.isArray(detalles) || !detalles.length) return;

  /* 🔍 lookup O(1) por id_pregunta */
  const detMap = new Map(detalles.map(d =>
    [parseInt(d.id_pregunta, 10), {valor:+d.valor, aplica:+d.aplica}]));

  /* 🧭 Recorremos TODA la plantilla */
  Object.values(dataMapGlobal).forEach(sec => {
    Object.values(sec).forEach(sub => {
      if (!sub || !sub.parametros) return;

      Object.values(sub.parametros).forEach(param => {
        param.preguntas.forEach(p => {
          const det = detMap.get(+p.id);
          if (det) {
            p.porcentajeCompletado = det.valor;
            p.aplica               = det.aplica;   // 0 | 1
          }
        });
      });
    });
  });

  /* ▶️ Calcula `sub.aplica` según sus preguntas */
  recalcularAplicaSubsecciones();
}

function recalcularAplicaSubsecciones () {
  Object.values(dataMapGlobal).forEach(sec => {
    Object.values(sec).forEach(sub => {
      if (!sub || !sub.parametros) return;

      const algunaActiva = Object.values(sub.parametros)
        .some(p => p.preguntas.some(q => q.aplica === 1));

      sub.aplica = algunaActiva ? 1 : 0;
    });
  });
}
