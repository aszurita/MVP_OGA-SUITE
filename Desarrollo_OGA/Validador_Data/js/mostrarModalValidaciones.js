
// FUNCIÓN PRINCIPAL MEJORADA

async function mostrarModalValidaciones() {
  try {
    // 1️⃣ Crear el modal
    crearModalValidaciones();

    // 2️⃣ Mostrar modal inmediatamente
    $("#modalValidaciones").modal("show");

    console.log("🔍 Cargando historial de validaciones...");

    // Validar que las funciones necesarias existan
    if (typeof obtenerTodasLasCabeceras !== 'function') {
      throw new Error('La función obtenerTodasLasCabeceras no está definida');
    }
    if (typeof obtenerUltimosDetalles !== 'function') {
      throw new Error('La función obtenerUltimosDetalles no está definida');
    }

    const cabeceras = await obtenerTodasLasCabeceras();
    const detalles = await obtenerUltimosDetalles(cabeceras);

    console.log("📊 Datos obtenidos:", cabeceras, detalles);

    // Validar datos obtenidos
    if (!Array.isArray(cabeceras)) {
      throw new Error('Las cabeceras no son un array válido');
    }

    // 1️⃣ Extraer todos los códigos únicos de usuarios
    const codigosUsuarios = new Set();
    cabeceras.forEach(c => {
      if (c && c.usuario) codigosUsuarios.add(c.usuario);
    });
    
    // Validar que detalles sea un objeto
    if (detalles && typeof detalles === 'object') {
      Object.values(detalles).forEach(d => {
        if (d && d.usuario) codigosUsuarios.add(d.usuario);
      });
    }

    // 2️⃣ Obtener mapa de nombres con UNA sola consulta
    const nombreMap = await getNombreMapDesdeCodigosGrupo(codigosUsuarios);

    // 3️⃣ Construir filas con nombres, score y código clickeable
    const filas = cabeceras.map(c => {
      // Validaciones de seguridad
      const codigoModelo = c?.codigo_modelo || '';
      const usuario = c?.usuario || '';
      const fecha = c?.fecha || '';
      const fechaFinalizacion = c?.fecha_Finalizacion ?? c?.fecha_finalizacion;
      const score = c?.score || "0.00";
      const idValidacion = c?.id_validacion || '';

      // Detalle correspondiente
      const detalle = detalles?.[idValidacion] || {};
      
      return {
        id_validacion: idValidacion,
        codigo_modelo: codigoModelo ? `
          <span
            style="color:#333;font-weight:500;cursor:pointer;display:inline-flex;align-items:center;"
            onmouseover="this.style.color='#D2006E'; this.style.fontWeight='600';"
            onmouseout="this.style.color='#333'; this.style.fontWeight='500';"
            onclick="$('#modalValidaciones').modal('hide'); guardarIdValidacionEnModelo('${codigoModelo.replace(/'/g, "\\'")}', '${idValidacion}');"
            title="Click para guardar ID de validación: ${idValidacion}">
            ${codigoModelo}
          </span>
        ` : '',
        usuario_crea: nombreMap[usuario] || usuario,
        fecha_ini: fecha,
        estado: estadoDesdeFechaFin(fechaFinalizacion),
        usuario_mod: nombreMap[detalle.usuario] || detalle.usuario || "",
        fecha_act: detalle.fecha || "",
        score: score
      };
    });

    console.log("📊 Datos para la tabla de validaciones:", filas);

    // 4️⃣ Pintar tabla cuando los datos estén listos
    if (typeof pintarTablaValidaciones === 'function') {
      pintarTablaValidaciones(filas);
    } else {
      console.error('La función pintarTablaValidaciones no está definida');
    }

  } catch (err) {
    console.error("❌ Error al cargar historial:", err);
    notificar("danger", `Error al cargar historial de validaciones: ${err.message}`);
  }
}


window.codigoModeloSeleccionadoValidacion = null;

// RESTAURAR VARIABLE AL CARGAR LA PÁGINA
(function() {
  // Restaurar automáticamente desde localStorage al cargar
  const codigoGuardado = localStorage.getItem("codigoModeloSeleccionadoValidacion");
  if (codigoGuardado) {
    window.codigoModeloSeleccionadoValidacion = codigoGuardado;
    
    // También restaurar en window.parent si es accesible
    try {
      if (window.parent && window.parent !== window) {
        window.parent.codigoModeloSeleccionadoValidacion = codigoGuardado;
      }
    } catch (e) {
      console.warn("No se pudo restaurar en window.parent:", e.message);
    }
    
    console.log("✅ Código del modelo restaurado desde localStorage:", codigoGuardado);
  }
})();

// FUNCIÓN PARA OBTENER EL CÓDIGO GUARDADO
window.obtenerCodigoModelo = function() {
  // 1. Primero desde memoria
  if (window.codigoModeloSeleccionadoValidacion) {
    return window.codigoModeloSeleccionadoValidacion;
  }
  
  // 2. Desde localStorage como fallback
  const codigoGuardado = localStorage.getItem("codigoModeloSeleccionadoValidacion");
  if (codigoGuardado) {
    window.codigoModeloSeleccionadoValidacion = codigoGuardado;
    return codigoGuardado;
  }
  
  return null;
};

// FUNCIÓN PARA GUARDAR EL ID DE VALIDACIÓN EN EL MODELO
window.guardarIdValidacionEnModelo = async function(codigoModelo, idValidacion = null) {
  // Flag para evitar duplicar notificaciones de éxito
  if (!window.notificacionSuccessActiva) window.notificacionSuccessActiva = false;

  // Función interna para notificaciones usando Bootstrap Notify
  const notificar = (tipo, mensaje, duracion = 3000, from = "top", align = "center") => {
    const contexto = window.parent || window;
    if (typeof contexto.$ === "undefined" || !contexto.$.notify) return;

    if (tipo === "success" && window.notificacionSuccessActiva) return;
    if (tipo === "success") window.notificacionSuccessActiva = true;

    contexto.$.notifyClose();
    contexto.$.notify(
      { message: mensaje },
      { 
        type: tipo,
        placement: { from, align },
        delay: duracion,
        onClose: () => { 
          if (tipo === "success") window.notificacionSuccessActiva = false; 
        }
      }
    );
  };

  try {
    if (!codigoModelo) {
      notificar("danger", "No se proporcionó código del modelo");
      return;
    }

    if (!idValidacion) {
      notificar("danger", "No se proporcionó ID de validación");
      return;
    }

    console.log("Guardando ID de validación:", idValidacion, "para modelo:", codigoModelo);

    // Buscar por ID para obtener el código del modelo correcto
    const consultaPayload = {
      campos: "id_validacion, codigo_modelo",
      origen: "PROCESOS_BI.dbo.T_z_cabecera_score",
      condicion: `id_validacion='${idValidacion}'`
    };

    const respuestaConsulta = await fetch("http://gobinfoana01-2:8510/query", {
      method: "POST",
      headers: { "accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(consultaPayload)
    });

    if (!respuestaConsulta.ok) throw new Error("Error al consultar T_z_cabecera_score: " + respuestaConsulta.status);
    const datosConsulta = await respuestaConsulta.json();

    if (!datosConsulta?.length) {
      notificar("warning", `No se encontró registro para el ID de validación: ${idValidacion}`);
      return;
    }

    const codigoModeloVerificado = datosConsulta[0].codigo_modelo;
    console.log("Código del modelo verificado desde BD:", codigoModeloVerificado);

    // Actualizar COD_VALIDACION en T_DOMINIO_ART_MODELOS
    const updatePayload = {
      tabla: "PROCESOS_BI.DBO.T_DOMINIO_ART_MODELOS",
      datos: { COD_VALIDACION: idValidacion },
      condicion: `CODIGO='${codigoModeloVerificado}'`
    };

    const respuestaUpdate = await fetch("http://gobinfoana01-2:8510/update", {
      method: "PUT",
      headers: { "accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(updatePayload)
    });

    if (!respuestaUpdate.ok) throw new Error("Error al actualizar COD_VALIDACION: " + respuestaUpdate.status);
    const datosUpdate = await respuestaUpdate.json();
    console.log("COD_VALIDACION actualizado:", datosUpdate);

    // Actualizar dinámicamente el tab sin refrescar
    if (window.parent) {
      if (typeof window.parent.refrescartabs === "function") {
        window.parent.refrescartabs("validacion"); 
      }
      if (typeof window.parent.actualizarTabConContenido === "function") {
        window.parent.actualizarTabConContenido("validacion", idValidacion);
      }

      // Cerrar modal al finalizar
      const $parent = window.parent.$;
      if ($parent) {
        $parent('#modalValidaciones').modal('hide');
      }
    }

    // Notificación de éxito
    notificar("success", `Validación ${idValidacion} guardada correctamente para el modelo ${codigoModeloVerificado}`);

  } catch (err) {
    console.error("Error en guardarIdValidacionEnModelo:", err);
    notificar("danger", err.message || "Ocurrió un error inesperado");
  }
};

// FUNCIONES AUXILIARES MEJORADAS
function estadoDesdeFechaFin(fechaFin) {
  try {
    const s = (fechaFin ?? "").toString().trim();
    return s ? "Cerrado" : "En proceso";
  } catch (error) {
    console.warn('Error al procesar fecha de finalización:', error);
    return "En proceso";
  }
}

async function getNombreMapDesdeCodigosGrupo(codigosSet) {
  try {
    const codigos = Array.from(codigosSet).filter(Boolean);
    if (!codigos.length) return {};

    // Validar que SPServices esté disponible
    if (typeof $ === 'undefined' || !$.fn.SPServices) {
      console.warn('SPServices no está disponible para obtener nombres');
      return {};
    }

    const valuesXml = codigos.map(c => `<Value Type='Text'>${c}</Value>`).join("");

    return new Promise((resolve, reject) => {
      $().SPServices({
        operation: "GetListItems",
        async: true,
        listName: "Z_DATOS_EMPLEADOS",
        CAMLQuery: `
          <Query>
            <Where>
              <In>
                <FieldRef Name="CODIGO_EMPLEADO"/>
                <Values>${valuesXml}</Values>
              </In>
            </Where>
          </Query>`,
        CAMLViewFields: `
          <ViewFields>
            <FieldRef Name="CODIGO_EMPLEADO"/>
            <FieldRef Name="NOMBRE_COMPLETO"/>
          </ViewFields>`,
        completefunc: function (xData, status) {
          const map = {};
          if (status === "success") {
            try {
              $(xData.responseXML).SPFilterNode("z:row").each(function () {
                const codigo = $(this).attr("ows_CODIGO_EMPLEADO");
                const nombre = $(this).attr("ows_NOMBRE_COMPLETO");
                if (codigo) map[codigo] = nombre || codigo;
              });
            } catch (parseError) {
              console.warn('Error al parsear respuesta de empleados:', parseError);
            }
          } else {
            console.warn('Error al obtener datos de empleados:', xData.responseText);
          }
          resolve(map);
        }
      });
    });
  } catch (error) {
    console.error('Error en getNombreMapDesdeCodigosGrupo:', error);
    return {};
  }
}

// INICIALIZACIÓN SEGURA
document.addEventListener("DOMContentLoaded", function() {
  try {
    if (typeof $ !== 'undefined' && $.fn.modal) {
      $("#modalValidaciones").modal("show");
      $("#modalValidaciones").fadeIn();
    } else {
      console.warn('jQuery o Bootstrap modal no está disponible');
    }
  } catch (error) {
    console.error('Error al inicializar modal:', error);
  }
});

// ======================
// FUNCIÓN DE DEPURACIÓN

function debugSharePointConnection() {
  const checks = {
    jquery: typeof $ !== 'undefined',
    spservices: typeof $ !== 'undefined' && $.fn.SPServices,
    bootstrap: typeof $ !== 'undefined' && $.fn.modal,
    url: window.location.href,
    parentUrl: window.parent !== window ? window.parent.location.href : 'Same window'
  };
  
  console.table(checks);
  return checks;
}
// Ejecutar automáticamente al cargar Modal.aspx
window.onload = async function() {
  if (typeof mostrarModalValidaciones === 'function') {
      mostrarModalValidaciones();
      document.body.style.background = 'transparent'; // quita fondo blanco
  }
};

