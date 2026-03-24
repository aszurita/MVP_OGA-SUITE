// creamos la funcion para bloquear una validación donde lo que se hace es editar en la cabecera de la validación, agregandole la fecha de finalización la fecha que se activo el boton como fecha de bloqueo

async function bloquearValidacion(id_validacion, codigoModelo) {
  const fechaFinalizacion = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  if (!id_validacion) {
    console.warn("[bloquearValidacion] id_validacion vacio, no se envia update.");
    showNotification("top", "center", "warning", "No se pudo obtener el ID de validacion.", 2500);
    return false;
  }

  const payload = {
    tabla: "procesos_bi.dbo.T_Z_CABECERA_SCORE",
    datos: { FECHA_FINALIZACION: fechaFinalizacion },
    condicion: `id_validacion='${id_validacion}'`
  };

  console.log("[bloquearValidacion] PUT http://gobinfoana01-2:8510/update (FECHA_FINALIZACION)", payload);

  try {
    const resp = await fetch("http://gobinfoana01-2:8510/update", {
      method: "PUT",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const raw = await resp.text();
    let body = null;
    try { body = raw ? JSON.parse(raw) : null; } catch (_) { body = raw; }

    if (resp.ok && !(body && body.detail)) {
      console.log(`Validacion ${id_validacion} bloqueada correctamente (FECHA_FINALIZACION).`, body);
      showNotification("top", "center", "success", "Validacion cerrada correctamente.", 2000);
      console.log("Validacion bloqueada para el modelo:", codigoModelo);
      $("#guardarValidacionBtn").prop("disabled", true);
      $("#btnDescartarCambios").prop("disabled", true);
      $("#btnBloquearValidacion").prop("disabled", true);
      return true;
    }

    const ultimoError = { status: resp.status, detail: body && body.detail ? body.detail : body };
    console.warn("[bloquearValidacion] Update rechazado (FECHA_FINALIZACION):", ultimoError);
  } catch (e) {
    console.error("[bloquearValidacion] Error de red/JS:", e);
  }

  showNotification("top", "center", "danger", "No se pudo bloquear la validacion. Revisa la consola.", 3000);
  console.error("[bloquearValidacion] No se pudo bloquear la validacion (solo FECHA_FINALIZACION).", { id_validacion });
  return false;
}

// Envuelve HTML en CDATA para compatibilidad con columnas enriquecidas de SharePoint
function wrapCdata(html = "") {
  return `<![CDATA[\n${html}\n]]>`;
}

function obtenerUsuarioPersona(persona) {
  if (!persona) return "";
  const usuario = (persona.usuario || "").toString().trim();
  if (usuario) return usuario.toLowerCase();
  const correo = (persona.correo || "").toString().trim();
  if (correo) return correo.split("@")[0].toLowerCase();
  const codigo = (persona.codigo || "").toString().trim();
  return codigo.toLowerCase();
}

function obtenerUsuarioPersona(persona) {
  if (!persona) return "";
  const usuario = (persona.usuario || "").toString().trim();
  if (usuario) return usuario.toLowerCase();
  const correo = (persona.correo || "").toString().trim();
  if (correo) return correo.split("@")[0].toLowerCase();
  const codigo = (persona.codigo || "").toString().trim();
  return codigo.toLowerCase();
}

// Construye un resumen HTML (tabla) para los correos de validacion
function buildResumenCorreo({ destinatario = "", modelo = "", estado = "", score = "--", link = "#", observacion = "" }) {
  const obsRow = observacion
    ? `<tr><td style="border: 1px solid #ccc; padding: 10px;">Observacion</td><td style="border: 1px solid #ccc; padding: 10px;">${observacion}</td></tr>`
    : "";

  return `
Hola ${destinatario || ""},<br><br>
Se ha ${estado.toLowerCase() || "actualizado"} la validacion del modelo <strong>${modelo}</strong>. A continuacion, encontraras el resumen:<br><br>
<table style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;">
  <tr style="background-color: #f2f2f2;">
    <th style="border: 1px solid #ccc; padding: 10px; text-align: left;">Campo</th>
    <th style="border: 1px solid #ccc; padding: 10px; text-align: left;">Valor</th>
  </tr>
  <tr>
    <td style="border: 1px solid #ccc; padding: 10px;">Estado de validacion</td>
    <td style="border: 1px solid #ccc; padding: 10px;">${estado || "N/A"}</td>
  </tr>
  <tr>
    <td style="border: 1px solid #ccc; padding: 10px;">Modelo</td>
    <td style="border: 1px solid #ccc; padding: 10px;">${modelo}</td>
  </tr>
  <tr>
    <td style="border: 1px solid #ccc; padding: 10px;">Score final</td>
    <td style="border: 1px solid #ccc; padding: 10px;">${score}</td>
  </tr>
  ${obsRow}
  <tr>
    <td style="border: 1px solid #ccc; padding: 10px;">Enlace</td>
    <td style="border: 1px solid #ccc; padding: 10px;"><a href="${link}" target="_blank" rel="noopener noreferrer">Ver modelo</a></td>
  </tr>
</table>
`;
}

function bloquearSlidersYSwitches() {
  document.querySelectorAll('.completado-slider').forEach(slider => {
    slider.disabled = true;
    slider.style.filter = 'grayscale(100%)';
  });

  document.querySelectorAll('.custom-switch-input').forEach(switchInput => {
    switchInput.disabled = true;
  });
}

function desbloquearSlidersYSwitches() {
  document.querySelectorAll('.completado-slider').forEach(slider => {
    // solo habilita sliders si el switch está activado (aplica)
    const switchId = slider.id.replace('completado', 'switch');
    const switchInput = document.getElementById(switchId);
    if (switchInput?.checked) {
      slider.disabled = false;
      slider.style.filter = 'none';
    }
  });

  document.querySelectorAll('.custom-switch-input').forEach(switchInput => {
    switchInput.disabled = false;
  });
}


async function enviarCorreoCierreValidacion(codigoModelo, idValidacionActual, nombreModelo, observacionAprobacion = "") {
  const esc = (s) => String(s ?? "").replace(/'/g, "''");
  const postQuery = async ({ campos = "*", origen, condicion = "1=1" }) => {
    const resp = await fetch("http://gobinfoana01-2:8510/query", {
      method: "POST",
      headers: { accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ campos, origen, condicion })
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status} - ${origen}`);
    const data = await resp.json();
    return Array.isArray(data) ? data : [data];
  };

  const resolvePersona = (entrada) => {
    const valor = (entrada == null) ? "" : String(entrada).trim();
    let codigo = valor;
    let usuario = valor;
    let nombre = valor;
    let correo = "";

    if (typeof getNombrePorCodigo === "function" && valor) {
      const nom = getNombrePorCodigo(valor);
      if (nom) nombre = nom;
    }
    if (typeof getUsuarioPorCodigo === "function" && valor) {
      const usr = getUsuarioPorCodigo(valor);
      if (usr) usuario = usr;
    }

    if (typeof obtenerDatosUsuario === "function") {
      const datos = obtenerDatosUsuario(usuario || valor);
      if (datos) {
        codigo = datos.codigo || codigo;
        usuario = datos.usuario || usuario;
        nombre = datos.nombreCompleto || datos.nombres || nombre;
        correo = datos.correo || correo;
      }
    }

    return { codigo, usuario, nombre, correo };
  };

  try {
    const destinatarios = [];
    let nombreModeloBD = "";
    let infoModeloRaw = {};
    let cabeceraCreador = {};

    try {
      const condicionModelo = `codigo='${esc(codigoModelo)}'`;
      const rows = await postQuery({
        campos: "codigo_responsable, cod_canva, modelo_analitica",
        origen: "procesos_bi.dbo.T_DOMINIO_ART_MODELOS",
        condicion: condicionModelo
      });
      const first = rows[0] || {};
      infoModeloRaw = first;
      nombreModeloBD = (first.modelo_analitica || "").trim();
      if (first.codigo_responsable) {
        destinatarios.push({ rol: "Responsable", ...resolvePersona(first.codigo_responsable) });
      }
      if (first.cod_canva) {
        const condicionSponsor = `id_amc='${esc(first.cod_canva)}'`;
        const canv = await postQuery({
          campos: "sponsor",
          origen: "PROCESOS_BI.dbo.T_ANALYTICS_MODEL_CANVAS",
          condicion: condicionSponsor
        });
        const sponsor = (canv[0] || {}).sponsor;
        if (sponsor) destinatarios.push({ rol: "Sponsor", ...resolvePersona(sponsor) });
      }
    } catch (e) {
      console.warn("[correo cierre] No se pudo obtener responsable/sponsor:", e);
    }

    try {
      if (idValidacionActual) {
        const cab = await postQuery({
          campos: "usuario",
          origen: "procesos_bi.dbo.t_z_cabecera_score",
          condicion: `id_validacion=${idValidacionActual}`
        });
        cabeceraCreador = cab[0] || {};
        const usuarioCreador = cabeceraCreador.usuario;
        if (usuarioCreador) destinatarios.push({ rol: "Creador de validacion", ...resolvePersona(usuarioCreador) });
      }
    } catch (e) {
      console.warn("[correo cierre] No se pudo obtener creador:", e);
    }

    const nombreModeloParaCorreo = (nombreModelo || nombreModeloBD || codigoModelo || "Modelo").trim();

    const score = (window.ultimoScoreFinal != null)
      ? Number(window.ultimoScoreFinal).toFixed(2) + "%"
      : (typeof scoreFinalCabecera !== "undefined"
        ? Number(scoreFinalCabecera || 0).toFixed(2) + "%"
        : "--");

    console.log("[correo cierre] Simulacion de destinatarios", {
      modelo: nombreModeloParaCorreo,
      codigoModelo,
      idValidacion: idValidacionActual,
      nombreModelo,
      score,
      destinatarios
    });
    const linkBase = "http://vamos.bancoguayaquil.com/sitios/informaciongerencial/OGA_Suite/Produccion/ValidadorModelos.aspx";
    const link = `${linkBase}?modelo=${encodeURIComponent(codigoModelo || "")}${idValidacionActual ? `&id_validacion=${encodeURIComponent(idValidacionActual)}` : ""}`;

    console.log("[correo cierre] Datos modelo usados para correo", {
      codigoModelo,
      nombreModeloParam: nombreModelo,
      nombreModeloBD,
      registroModelo: infoModeloRaw,
      cabeceraCreador,
      link
    });
    destinatarios.forEach(d => {
      console.log(`[correo cierre] ${d.rol}: codigo=${d.codigo}, usuario=${d.usuario}, nombre=${d.nombre}, correo=${d.correo}`);
    });

    for (const d of destinatarios) {
      if (d.rol !== "Responsable" && d.rol !== "Sponsor") continue;
      const usuarioPersona = obtenerUsuarioPersona(d);
      if (!usuarioPersona) {
        console.warn("[correo cierre] Usuario destinatario vacio, se omite envio.", d);
        continue;
      }

      const asunto = d.rol === "Sponsor"
        ? `Pendiente de aprobación - ${nombreModeloParaCorreo}`
        : `Validacion finalizada - ${nombreModeloParaCorreo}`;

      const cuerpoHtml = d.rol === "Sponsor"
        ? `
          <p>Hola ${d.nombre || usuarioPersona},</p>
          <p>La validación del modelo <strong>${nombreModeloParaCorreo}</strong> ha sido cerrada y requiere tu aprobación como Sponsor.</p>
          <table style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;">
            <tr style="background-color: #f2f2f2;">
              <th style="border: 1px solid #ccc; padding: 10px; text-align: left;">Campo</th>
              <th style="border: 1px solid #ccc; padding: 10px; text-align: left;">Valor</th>
            </tr>
            <tr>
              <td style="border: 1px solid #ccc; padding: 10px;">Estado de validación</td>
              <td style="border: 1px solid #ccc; padding: 10px;">Pendiente de aprobación (Sponsor)</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ccc; padding: 10px;">Modelo</td>
              <td style="border: 1px solid #ccc; padding: 10px;">${nombreModeloParaCorreo}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ccc; padding: 10px;">Score final</td>
              <td style="border: 1px solid #ccc; padding: 10px;">${score}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ccc; padding: 10px;">Acción requerida</td>
              <td style="border: 1px solid #ccc; padding: 10px;">Por favor revisa y aprueba el cierre.</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ccc; padding: 10px;">Enlace</td>
              <td style="border: 1px solid #ccc; padding: 10px;"><a href="${link}" target="_blank" rel="noopener noreferrer">Abrir validación</a></td>
            </tr>
          </table>
          <p style="margin-top:12px;">Gracias,<br />Notificaciones Oga Suite</p>
        `
        : buildResumenCorreo({
            destinatario: d.nombre || d.codigo || "",
            modelo: nombreModeloParaCorreo,
            estado: "Finalizada",
            score,
            link
          });

      const payload = {
        tabla: "PROCESOS_BI.DBO.t_cola_mensajes",
        datos: {
          NOMBRE_PERSONA: d.nombre || usuarioPersona,
          USUARIO_PERSONA: usuarioPersona,
          ASUNTO_CORREO: asunto,
          CUERPO_CORREO: cuerpoHtml,
          ENVIADO: 0,
          FECHA_ENVIO: new Date().toISOString(),
          FECHA_INGRESO_EN_COLA: new Date().toISOString(),
          FIRMA: "Notificaciones Oga Suite"
        }
      };

      console.log("[correo cierre] Encolando correo", { destinatario: usuarioPersona, rol: d.rol, asunto, link });
      await enviarCorreoApi(payload);
    }
  } catch (e) {
    console.warn("[correo cierre] Fallo la simulacion de destinatarios:", e);
  }
}

// Correos de aprobacion (responsable, sponsor, validador) - redirigidos a gortiz por ahora
async function enviarCorreoAprobacionValidacion(codigoModelo, idValidacionActual, nombreModelo, observacionAprobacion = "") {
  const esc = (s) => String(s ?? "").replace(/'/g, "''");
  const postQuery = async ({ campos = "*", origen, condicion = "1=1" }) => {
    const resp = await fetch("http://gobinfoana01-2:8510/query", {
      method: "POST",
      headers: { accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ campos, origen, condicion })
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status} - ${origen}`);
    const data = await resp.json();
    return Array.isArray(data) ? data : [data];
  };

  const resolvePersona = (entrada) => {
    const valor = (entrada == null) ? "" : String(entrada).trim();
    let codigo = valor, usuario = valor, nombre = valor, correo = "";
    if (typeof getNombrePorCodigo === "function" && valor) {
      const nom = getNombrePorCodigo(valor);
      if (nom) nombre = nom;
    }
    if (typeof getUsuarioPorCodigo === "function" && valor) {
      const usr = getUsuarioPorCodigo(valor);
      if (usr) usuario = usr;
    }
    if (typeof obtenerDatosUsuario === "function") {
      const datos = obtenerDatosUsuario(usuario || valor);
      if (datos) {
        codigo = datos.codigo || codigo;
        usuario = datos.usuario || usuario;
        nombre = datos.nombreCompleto || datos.nombres || nombre;
        correo = datos.correo || correo;
      }
    }
    return { codigo, usuario, nombre, correo };
  };

  try {
    const destinatarios = [];
    let nombreModeloBD = "";

    try {
      const rows = await postQuery({
        campos: "codigo_responsable, cod_canva, modelo_analitica",
        origen: "procesos_bi.dbo.T_DOMINIO_ART_MODELOS",
        condicion: `codigo='${esc(codigoModelo)}'`
      });
      const first = rows[0] || {};
      nombreModeloBD = (first.modelo_analitica || "").trim();
      if (first.codigo_responsable) destinatarios.push({ rol: "Responsable", ...resolvePersona(first.codigo_responsable) });
      if (first.cod_canva) {
        const canv = await postQuery({
          campos: "sponsor",
          origen: "PROCESOS_BI.dbo.T_ANALYTICS_MODEL_CANVAS",
          condicion: `id_amc='${esc(first.cod_canva)}'`
        });
        const sponsor = (canv[0] || {}).sponsor;
        if (sponsor) destinatarios.push({ rol: "Sponsor", ...resolvePersona(sponsor) });
      }
    } catch (e) {
      console.warn("[correo aprobacion] No se pudo obtener responsable/sponsor:", e);
    }

    try {
      if (idValidacionActual) {
        const cab = await postQuery({
          campos: "usuario",
          origen: "procesos_bi.dbo.t_z_cabecera_score",
          condicion: `id_validacion=${idValidacionActual}`
        });
        const usuarioCreador = (cab[0] || {}).usuario;
        if (usuarioCreador) destinatarios.push({ rol: "Validador", ...resolvePersona(usuarioCreador) });
      }
    } catch (e) {
      console.warn("[correo aprobacion] No se pudo obtener creador:", e);
    }

    const nombreModeloParaCorreo = (nombreModelo || nombreModeloBD || codigoModelo || "Modelo").trim();

    const score = (window.ultimoScoreFinal != null)
      ? Number(window.ultimoScoreFinal).toFixed(2) + "%"
      : (typeof scoreFinalCabecera !== "undefined"
        ? Number(scoreFinalCabecera || 0).toFixed(2) + "%"
        : "--");

    const linkBase = "http://vamos.bancoguayaquil.com/sitios/informaciongerencial/OGA_Suite/Produccion/ValidadorModelos.aspx";
    const link = `${linkBase}?modelo=${encodeURIComponent(codigoModelo || "")}${idValidacionActual ? `&id_validacion=${encodeURIComponent(idValidacionActual)}` : ""}`;

    for (const d of destinatarios) {
      const usuarioPersona = obtenerUsuarioPersona(d);
      if (!usuarioPersona) {
        console.warn("[correo aprobacion] Usuario destinatario vacio, se omite envio.", d);
        continue;
      }

      const asunto = `Validacion aprobada - ${nombreModeloParaCorreo}`;
      const cuerpoHtml = buildResumenCorreo({
        destinatario: d.nombre || d.codigo || "",
        modelo: nombreModeloParaCorreo,
        estado: "Aprobada",
        score,
        link,
        observacion: observacionAprobacion || ""
      });

      const payload = {
        tabla: "PROCESOS_BI.DBO.t_cola_mensajes",
        datos: {
          NOMBRE_PERSONA: d.nombre || usuarioPersona,
          USUARIO_PERSONA: usuarioPersona,
          ASUNTO_CORREO: asunto,
          CUERPO_CORREO: cuerpoHtml,
          ENVIADO: 0,
          FECHA_ENVIO: new Date().toISOString(),
          FECHA_INGRESO_EN_COLA: new Date().toISOString(),
          FIRMA: "Notificaciones Oga Suite"
        }
      };

      console.log("[correo aprobacion] Encolando correo", { destinatario: usuarioPersona, rol: d.rol, asunto, link });
      await enviarCorreoApi(payload);
    }
  } catch (e) {
    console.warn("[correo aprobacion] Fallo el envio:", e);
  }
}

// Notifica inicio de una nueva validacion (correo al responsable, via API de cola)
async function enviarCorreoInicioValidacion(codigoModelo, nombreModelo, idValidacionActual) {
  const esc = (s) => String(s ?? "").replace(/'/g, "''");
  const postQuery = async ({ campos = "*", origen, condicion = "1=1" }) => {
    const resp = await fetch("http://gobinfoana01-2:8510/query", {
      method: "POST",
      headers: { accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ campos, origen, condicion })
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status} - ${origen}`);
    const data = await resp.json();
    return Array.isArray(data) ? data : [data];
  };

  let codigoResponsable = "";
  let nombreModeloBD = "";
  try {
    const rows = await postQuery({
      campos: "codigo_responsable, modelo_analitica",
      origen: "procesos_bi.dbo.T_DOMINIO_ART_MODELOS",
      condicion: `codigo='${esc(codigoModelo)}'`
    });
    const first = rows[0] || {};
    codigoResponsable = first.codigo_responsable || "";
    nombreModeloBD = (first.modelo_analitica || "").trim();
  } catch (e) {
    console.warn("[correo inicio] No se pudo obtener responsable/nombre de modelo:", e);
  }

  const nombreResponsable = (typeof getNombrePorCodigo === "function" && codigoResponsable)
    ? (getNombrePorCodigo(codigoResponsable) || codigoResponsable)
    : (codigoResponsable || "Responsable del modelo");

  const usuarioResponsable = (typeof getUsuarioPorCodigo === "function" && codigoResponsable)
    ? (getUsuarioPorCodigo(codigoResponsable) || "")
    : "";

  // Fallback al usuario actual si el modelo no tiene responsable
  const datosActual = (typeof obtenerDatosUsuario === "function") ? obtenerDatosUsuario() : null;
  const fallbackActual = (typeof obtenerUsuario === "function") ? obtenerUsuario() : {};
  const candidatoActual = (datosActual?.usuario || datosActual?.codigo || fallbackActual?.usuario || fallbackActual?.codigo || window.current_user || "").toString().trim().toLowerCase();

  const usuarioPersona = (usuarioResponsable || codigoResponsable || candidatoActual || "").trim().toLowerCase();
  if (!usuarioPersona) {
    console.warn("[correo inicio] Usuario responsable vacio y sin fallback, se omite envio.");
    return;
  }

  const nombreModeloParaCorreo = (nombreModelo || nombreModeloBD || codigoModelo || "Modelo").trim();
  const asunto = `Validacion registrada - ${nombreModeloParaCorreo}`;

  const linkHost = "https://vamos.bancoguayaquil.com";
  const linkPath = "/sitios/informaciongerencial/OGA_Suite/Produccion/ValidadorModelos.aspx";
  const link = `${linkHost}${linkPath}?modelo=${encodeURIComponent(codigoModelo || "")}${idValidacionActual ? `&id_validacion=${encodeURIComponent(idValidacionActual)}` : ""}`;
  const linkHref = link.startsWith("http") ? link : `https://${link.replace(/^https?:\/\//, "")}`;

  const cuerpoHtml = `
    <p>Hola ${nombreResponsable || usuarioPersona},</p>
    <p>Se registró una nueva validación para el modelo <strong>${nombreModeloParaCorreo}</strong>.</p>
    <table style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;">
      <tr style="background-color: #f2f2f2;">
        <th style="border: 1px solid #ccc; padding: 10px; text-align: left;">Campo</th>
        <th style="border: 1px solid #ccc; padding: 10px; text-align: left;">Valor</th>
      </tr>
      <tr>
        <td style="border: 1px solid #ccc; padding: 10px;">Estado de validación</td>
        <td style="border: 1px solid #ccc; padding: 10px;">Registrada</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ccc; padding: 10px;">Modelo</td>
        <td style="border: 1px solid #ccc; padding: 10px;">${nombreModeloParaCorreo}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ccc; padding: 10px;">Enlace</td>
        <td style="border: 1px solid #ccc; padding: 10px;"><a href="${linkHref}" target="_blank" rel="noopener noreferrer">Abrir validación</a><br />${linkHref}</td>
      </tr>
    </table>
    <p style="margin-top:12px;">Saludos</p>
  `;

  const nowIso = new Date().toISOString();
  const payload = {
    tabla: "PROCESOS_BI.DBO.t_cola_mensajes",
    datos: {
      NOMBRE_PERSONA: nombreResponsable || usuarioPersona,
      USUARIO_PERSONA: usuarioPersona,
      ASUNTO_CORREO: asunto,
      CUERPO_CORREO: cuerpoHtml,
      ENVIADO: 0,
      FECHA_ENVIO: nowIso,
      FECHA_INGRESO_EN_COLA: nowIso,
      FIRMA: "Notificaciones Oga Suite"
    }
  };

  console.log("[correo inicio] Encolando correo", { destinatario: usuarioPersona, asunto, link: linkHref });
  console.log("[correo inicio] Payload cola mensajes", payload);
  await enviarCorreoApi(payload);
}

// Helper robusto para enviar correo por la API (fetch o $.ajax) con logs claros
async function enviarCorreoApi(payload) {
  const url = "http://gobinfoana01-2:8510/insert";
  const body = JSON.stringify(payload);

  if (typeof fetch === "function") {
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json"
      },
      body
    });
    const respText = await resp.text().catch(() => "");
    if (!resp.ok) {
      console.warn("[correo api] Error HTTP", { status: resp.status, body: respText });
      return;
    }
    console.log("[correo api] OK", { status: resp.status, body: respText });
    return;
  }

  if (typeof $ !== "undefined" && typeof $.ajax === "function") {
    return new Promise((resolve) => {
      $.ajax({
        url,
        method: "POST",
        contentType: "application/json",
        data: body,
        success: (data, textStatus, jqXHR) => {
          console.log("[correo api] OK", { status: jqXHR.status, body: data });
          resolve();
        },
        error: (jqXHR, textStatus, errorThrown) => {
          console.warn("[correo api] Error AJAX", { status: jqXHR.status, textStatus, errorThrown, responseText: jqXHR.responseText });
          resolve();
        }
      });
    });
  }

  console.warn("[correo api] No fetch ni $.ajax disponibles para enviar el correo");
}
// Registra usuario/fecha/observación de aprobación en cabecera
async function registrarAprobacionCabecera(id_validacion, observacionFinal) {
  if (!id_validacion) return false;

  const hoy = new Date().toISOString().split("T")[0];
  const u = (typeof obtenerUsuario === "function") ? obtenerUsuario() : {};

  // Si existe la función global obtenerDatosUsuario, úsala para traer el código de empleado
  let usuarioLogin = "gortiz";
  if (typeof obtenerDatosUsuario === "function") {
    const datos = obtenerDatosUsuario(); // sin parámetro => usuario actual
    if (datos?.codigo) {
      usuarioLogin = String(datos.codigo).trim();
    } else if (datos?.usuario) {
      usuarioLogin = String(datos.usuario).trim();
    }
  } else {
    // Fallback a login sin dominio
    usuarioLogin = ((u?.current_user || u?.usuario || u?.displayName || "gortiz").split("\\").pop() || "gortiz").trim();
  }

  console.log("[aprobacion] usuario detectado:", usuarioLogin, "payload raw user object:", u);

  const payload = {
    tabla: "procesos_bi.dbo.t_z_cabecera_score",
    datos: {
      USUARIO_APROBACION: usuarioLogin,
      FECHA_APROBACION: hoy,
      OBSERVACION_APROBACION: observacionFinal || ""
    },
    condicion: `id_validacion=${id_validacion}`
  };

  try {
    const resp = await fetch("http://gobinfoana01-2:8510/update", {
      method: "PUT",
      headers: { accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const body = await resp.json().catch(() => null);
    if (!resp.ok || (body && body.detail)) {
      console.warn("[aprobacion] Error HTTP/Detail al actualizar cabecera", resp.status, body);
      return false;
    }
    console.log("[aprobacion] Cabecera aprobada:", payload);

    // Actualizar sello en UI si existe la función global
    if (typeof actualizarImagenAprobacion === "function") {
      actualizarImagenAprobacion(id_validacion, true);
    }
    return true;
  } catch (e) {
    console.warn("[aprobacion] No se pudo actualizar cabecera:", e);
    return false;
  }
}




/*function eliminarDetallesDeValidacion(id_validacion, callback) {
    const caml = `
      <Query>
        <Where>
          <Eq>
            <FieldRef Name='id_validacion'/>
            <Value Type='Text'>${id_validacion}</Value>
          </Eq>
        </Where>
      </Query>`;
  
    $().SPServices({
      operation: "GetListItems",
      async: true,
      listName: "Z_DETALLES_SCORE",
      CAMLQuery: caml,
      completefunc: function (xData, status) {
        if (status !== "success") {
          console.error("âŒ Error al consultar detalles para eliminar.");
          return callback();
        }
  
        const ids = [];
        $(xData.responseXML).SPFilterNode("z:row").each(function () {
          const itemId = $(this).attr("ows_ID");
          if (itemId) ids.push(itemId);
        });
  
        if (!ids.length) {
          console.warn("âš ï¸ No hay detalles válidos para eliminar.");
          return callback();
        }
  
        console.log("ðŸ§¾ IDs para eliminar:", ids);
  
        // Construir bloque de eliminaciones en lote
        const updates = ids.map(id => `
          <Method ID="${id}" Cmd="Delete">
            <Field Name="ID">${id}</Field>
          </Method>`).join("");
  
        $().SPServices({
          operation: "UpdateListItems",
          async: true,
          listName: "Z_DETALLES_SCORE",
          batchCmd: "Delete",
          updates: `<Batch OnError="Continue">${updates}</Batch>`,
          completefunc: function (xData, status) {
            if (status === "success") {
              console.log(`âœ… Eliminados ${ids.length} detalles de la validación ${id_validacion}`);
              callback();
            } else {
              console.error("âŒ Error eliminando detalles.");
              callback();
            }
          }
        });
      }
    });
  }
  
  */
