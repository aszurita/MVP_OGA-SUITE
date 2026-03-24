/**
 * Obtiene el usuario (columna USUARIO) a partir de un CODIGO_EMPLEADO.
 * @param {string} codigoEmpleado – Código del empleado a buscar
 * @returns {string} usuario – Nombre de usuario (vacío si no existe)
 */
function getUsuarioPorCodigo(codigoEmpleado = "") {
  if (!codigoEmpleado) return "";

  let usuario = "";

  const camlQuery = `
    <Query>
      <Where>
        <Eq>
          <FieldRef Name="CODIGO_EMPLEADO" />
          <Value Type="Text">${codigoEmpleado}</Value>
        </Eq>
      </Where>
    </Query>`;

  $().SPServices({
    operation: "GetListItems",
    async: false,            // síncrono para retornar inmediatamente
    listName: "Z_DATOS_EMPLEADOS",
    CAMLQuery: camlQuery,
    CAMLViewFields: `
      <ViewFields>
        <FieldRef Name="USUARIO" />
      </ViewFields>`,
    completefunc: function (xData, Status) {
      if (Status !== "success") {
        console.error("❌ Error consultando SharePoint:", Status);
        return;
      }

      const fila = $(xData.responseXML).find("z\\:row").first();
      if (fila.length) {
        usuario = (fila.attr("ows_USUARIO") || "").toLowerCase(); // opcional: a minúsculas
      }
    },
  });

  return usuario;
}

function getNombrePorCodigo(codigoEmpleado = "") {
  if (!codigoEmpleado) return "";

  let nombre = "";

  const camlQuery = `
    <Query>
      <Where>
        <Eq>
          <FieldRef Name="CODIGO_EMPLEADO" />
          <Value Type="Text">${codigoEmpleado}</Value>
        </Eq>
      </Where>
    </Query>`;

  $().SPServices({
    operation: "GetListItems",
    async: false, // Síncrono para retornar inmediatamente
    listName: "Z_DATOS_EMPLEADOS",
    CAMLQuery: camlQuery,
    CAMLViewFields: `
      <ViewFields>
        <FieldRef Name="NOMBRE_COMPLETO" />
      </ViewFields>`,
    completefunc: function (xData, Status) {
      if (Status !== "success") {
        console.error("❌ Error consultando SharePoint:", Status);
        return;
      }

      const fila = $(xData.responseXML).find("z\\:row").first();
      if (fila.length) {
        // Intenta obtener el nombre en este orden de prioridad:
        nombre = fila.attr("ows_NOMBRE_COMPLETO") || "";
      }
    },
  });

  return nombre;
}