function cerrarModalIndicadores() {
    console.log("🧹 Cerrando y limpiando modal de indicadores");
  
    // Ocultar modal
    document.getElementById("modal_indicadores").classList.remove("active");
  
    // Limpiar inputs
    $("#Aprovisionamiento, #servidor, #base, #Esquema, #campo, #nombre-tabla, #documentacion").val("");
    $("#atributo-actual").text("Seleccione un atributo");
  
    // Limpiar lista lateral de atributos
    $("#lista-atributos-calidad").empty();
  
    // Resetear tabla indicadores
    if ($.fn.DataTable.isDataTable("#indicadores_calidad")) {
      $('#indicadores_calidad').DataTable().clear().destroy();
    }
    $("#indicadores_calidad").html(`
      <thead>
        <tr>
          <th>No aplica</th>
          <th>Indicadores</th>
          <th>id_dimension</th>
          <th>Valor</th>
          <th>Reglas</th>
          <th>Usuario</th>
          <th>Última modificación</th>
          <th>Acción</th>
        </tr>
      </thead>
      <tbody></tbody>
    `);
  
    // Limpiar variables globales
    delete window.contextoTablaSeleccionada;
    delete window.idAtributoSeleccionado;
    delete window.lista_calidad_atributo;
  }

window.cerrarModalIndicadores = cerrarModalIndicadores;