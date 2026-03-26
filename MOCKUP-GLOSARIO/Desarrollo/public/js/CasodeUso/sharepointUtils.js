/**
 * @file Módulo de utilidades para interactuar con listas de SharePoint.
 * @description Encapsula llamadas a SPServices para obtener datos de empleados.
 * @author Giancarlo Ortiz */

const SharePointUtils = {
  /**
   * Obtiene el nombre completo de un empleado a partir de su código.
   * @param {string} codigoEmpleado - El código del empleado.
   * @returns {string} El nombre completo o una cadena vacía si no se encuentra.
   */
  getNombrePorCodigo(codigoEmpleado = "") {
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
      async: false, // Síncrono para retornar el valor directamente.
      listName: "Z_DATOS_EMPLEADOS",
      CAMLQuery: camlQuery,
      CAMLViewFields: `<ViewFields><FieldRef Name="NOMBRE_COMPLETO" /></ViewFields>`,
      completefunc: function (xData, Status) {
        if (Status !== "success") {
          console.error("❌ Error consultando SharePoint (getNombrePorCodigo):", Status);
          return;
        }
        const fila = $(xData.responseXML).find("z\\:row").first();
        if (fila.length) {
          nombre = fila.attr("ows_NOMBRE_COMPLETO") || "";
        }
      },
    });
    return nombre;
  },

  /**
   * Obtiene el código de un empleado a partir de su nombre de usuario de SharePoint.
   * @param {string} userName - El nombre de usuario (ej. 'domain\\user').
   * @returns {string} El código del empleado o una cadena vacía.
   */
  getEmployeeCodeByUser(userName) {
    if (!userName) return "";
    let userCode = "";
    const accountName = userName.split('|').pop();

    $().SPServices({
        operation: "GetListItems",
        async: false,
        listName: "Z_DATOS_EMPLEADOS",
        CAMLQuery: `<Query><Where><Eq><FieldRef Name='USUARIO' /><Value Type='Text'>${accountName}</Value></Eq></Where></Query>`,
        CAMLViewFields: "<ViewFields><FieldRef Name='CODIGO_EMPLEADO' /></ViewFields>",
        completefunc: function (xData, Status) {
            if (Status === "success") {
                const item = $(xData.responseXML).find("z\\:row").first();
                if (item.length) {
                    userCode = item.attr("ows_CODIGO_EMPLEADO") || "";
                }
            } else {
                console.error("Error getting employee code by user:", Status);
            }
        }
    });
    return userCode;
  }
};

// Exponer globalmente para compatibilidad con código antiguo que pueda necesitarlo.
window.SharePointUtils = SharePointUtils
window.getNombrePorCodigo = SharePointUtils.getNombrePorCodigo;
window.getEmployeeCodeByUser = SharePointUtils.getEmployeeCodeByUser;
