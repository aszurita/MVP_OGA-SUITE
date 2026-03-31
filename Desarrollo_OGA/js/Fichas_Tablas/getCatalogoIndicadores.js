function getCatalogoIndicadores() {
    const lista = [];
  
    $().SPServices({
      operation: "GetListItems",
      async: false,
      listName: "Z_CATALOGO_OGASUITE",
      CAMLQuery: "<Query><Where><Eq><FieldRef Name='txt_etiqueta'/><Value Type='Text'>Indicador de calidad</Value></Eq></Where></Query>",
      CAMLViewFields: "<ViewFields><FieldRef Name='valor1' /><FieldRef Name='valor2' /></ViewFields>",
      completefunc: function (xData, Status) {
        $(xData.responseXML).SPFilterNode("z:row").each(function () {
          lista.push({
            id_dimension: $(this).attr("ows_valor1"),
            nombre: $(this).attr("ows_valor2")
          });
        });
      }
    });
  
    return lista;
  }

window.getCatalogoIndicadores = getCatalogoIndicadores;