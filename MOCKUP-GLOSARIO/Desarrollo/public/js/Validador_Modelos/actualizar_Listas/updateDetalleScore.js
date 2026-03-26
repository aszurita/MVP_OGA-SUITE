/* js/Validador_Modelos/updateDetalleScore.js
 * -----------------------------------------------------------------
 *  Actualiza múltiples preguntas de una validación usando el SP
 *  dbo.sp_OGA_ActualizarDetallesScore_Prueba
 * -----------------------------------------------------------------*/
async function updateDetalleScore(id_validacion, registros, usuario, fecha) {
  if (!registros.length) {
    console.log("⚠️ No hay registros para actualizar");
    return;
  }

  console.log("▶️ Iniciando updateDetalleScore (vía Stored Procedure) con:", {
    id_validacion,
    registros,
    usuario,
    fecha
  });

  // 1. Formatear los registros al formato "id_pregunta|valor|aplica,..."
  const registros_actualizar = registros
    .map(r => `${r.id_pregunta}|${r.valor}|${r.aplica}`)
    .join(',');

  // 2. Construir el payload para el procedimiento almacenado
  const payload = {
    procedure_name: "dbo.sp_OGA_ActualizarDetallesScore",
    parameters: {
      id_validacion: id_validacion,
      usuario_modificacion: Number(usuario) || 0,
      registros_actualizar: registros_actualizar
    }
  };

  console.log("🔵 Ejecutando POST http://gobinfoana01-2:8510/execute-stored-procedure", payload);

  try {
    const resp = await fetch("http://gobinfoana01-2:8510/execute-stored-procedure", {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const body = await resp.json().catch(() => null);

    if (!resp.ok || (body && body.detail)) {
      console.error(`❌ Error al ejecutar SP para id_validacion=${id_validacion}`, body);
    } else {
      console.log(`✅ SP ejecutado exitosamente para id_validacion=${id_validacion}`, body);
    }
  } catch (e) {
    console.error(`❌ Error de red/JS al ejecutar SP para id_validacion=${id_validacion}`, e);

  }

  console.log("🏁 updateDetalleScore finalizado");
}
