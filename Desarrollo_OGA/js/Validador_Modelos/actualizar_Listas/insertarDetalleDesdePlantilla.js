/* js/Validador_Modelos/actualizar_Listas/insertarDetalleDesdePlantilla.js
 * -----------------------------------------------------------------
 *  Invoca el SP que inserta todos los detalles de una validación
 *  a partir de la tabla plantilla.
 *  SP: dbo.sp_OGA_Insert_Detalle_Validacion
 * -----------------------------------------------------------------*/
async function insertarDetalleDesdePlantilla(id_validacion, usuario) {
    console.log("➡️ Parámetros recibidos en insertarDetalleDesdePlantilla:", { id_validacion, usuario });

    if (!id_validacion || !usuario) {
    console.error("⚠️ insertarDetalleDesdePlantilla: Faltan id_validacion o usuario.");
    return { ok: false, detail: "Parámetros insuficientes." };
  }

  const payload = {
    procedure_name: "sp_OGA_Insert_Detalle_Validacion",
    parameters: {
      variable_id: Number(id_validacion),
      variable_usuario: Number(usuario) || 0,
    }
  };

  console.log("🔵 Ejecutando POST http://gobinfoana01-2:8510/execute-stored-procedure (Insertar Detalle desde Plantilla)", payload);

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
      console.error(`❌ Error al ejecutar SP de inserción para id_validacion=${id_validacion}`, body);
      return { ok: false, detail: body?.detail || `HTTP ${resp.status}` };
    }

    console.log(`✅ SP de inserción ejecutado para id_validacion=${id_validacion}`, body);
    return { ok: true, body };
  } catch (e) {
    console.error(`❌ Error de red/JS al ejecutar SP de inserción para id_validacion=${id_validacion}`, e);
    return { ok: false, detail: e.message };
  }
}
