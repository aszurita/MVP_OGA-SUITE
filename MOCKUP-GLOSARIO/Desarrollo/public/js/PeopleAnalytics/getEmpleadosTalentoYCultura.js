function getEmpleadosTalentoYCultura() {
  const empleados = [];

  // Consulta a la lista Z_DATOS_EMPLEADOS sin filtros de BANCA ni CENTRO_COSTO
  let queryZDatosEmpleados = `<Query>
<Where>
  <IsNotNull>
    <FieldRef Name="USUARIO"/>
  </IsNotNull>
</Where>
</Query>`;

  $().SPServices({
      operation: "GetListItems",
      async: false,
      listName: "Z_DATOS_EMPLEADOS",
      CAMLQuery: queryZDatosEmpleados,
      CAMLViewFields: "<ViewFields>\
      <FieldRef Name='CODIGO_EMPLEADO' />\
      <FieldRef Name='NOMBRE_COMPLETO' />\
      <FieldRef Name='COD_CENTRO_COSTO' />\
      <FieldRef Name='CENTRO_COSTO' />\
      <FieldRef Name='USUARIO' />\
      <FieldRef Name='AGENCIA' />\
      <FieldRef Name='REGION' />\
      <FieldRef Name='BANCA' />\
      <FieldRef Name='CORREO' />\
      <FieldRef Name='NOMBRES' />\
      <FieldRef Name='APELLIDO_PATERNO' />\
      <FieldRef Name='APELLIDO_MATERNO' />\
  </ViewFields>",
      completefunc: function (xData, Status) {
          $(xData.responseXML).find("z\\:row").each(function () {
              const data = {
                  "codigo": $(this).attr("ows_CODIGO_EMPLEADO") || "",
                  "nombreCompleto": $(this).attr("ows_NOMBRE_COMPLETO") || "",
                  "centroCosto": $(this).attr("ows_CENTRO_COSTO") || "",
                  "codCentroCosto": $(this).attr("ows_COD_CENTRO_COSTO") || "",
                  "usuario": ($(this).attr("ows_USUARIO") || "").toLowerCase(),
                  "area": $(this).attr("ows_BANCA") || "",
                  "agencia": $(this).attr("ows_AGENCIA") || "",
                  "region": $(this).attr("ows_REGION") || "",
                  "correo": ($(this).attr("ows_USUARIO") ? $(this).attr("ows_USUARIO") + "@bancoguayaquil.com" : ""),
                  "nombres": $(this).attr("ows_NOMBRES") || "",
                  "apellido_paternal": $(this).attr("ows_APELLIDO_PATERNO") || "",
                  "apellido_maternal": $(this).attr("ows_APELLIDO_MATERNO") || "",
              };
              empleados.push(data);
          });

          console.log("✅ Todos los empleados cargados:", empleados);
      }
  });

  return empleados;
}

window.getEmpleadosTalentoYCultura = getEmpleadosTalentoYCultura;
