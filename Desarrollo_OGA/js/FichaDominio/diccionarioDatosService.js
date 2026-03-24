/**
 * @file Módulo de servicio para interactuar con la lista Z_DICCIONARIO_DATOS de SharePoint.
 * @description Centraliza las operaciones de lectura y escritura para el diccionario de datos.
 * @author Giancarlo Ortiz
 */

const DiccionarioDatosService = {
  /**
   * Obtiene todos los datos de la lista Z_DICCIONARIO_DATOS.
   * @returns {Array<Object>} Un array de objetos, donde cada objeto representa un ítem de la lista.
   */
  getDiccionarioDatosCompleto() {
    let resultados = [];
    $().SPServices({
      operation: "GetListItems",
      async: false,
      listName: "Z_DICCIONARIO_DATOS",
      CAMLViewFields: `<ViewFields>
                          <FieldRef Name='tipo_metad' />
                          <FieldRef Name='id_metad' />
                          <FieldRef Name='nombre_metad' />
                          <FieldRef Name='descripcion_metad' />
                          <FieldRef Name='descripcion_dominio' />
                          <FieldRef Name='fec_ultima_actualizacion' />
                          <FieldRef Name='caracteristicas' />
                          <FieldRef Name='txt_desc_subdominio' />
                          <FieldRef Name='txt_desc_subcategoria' />
                          <FieldRef Name='dato_personal' />
                          <FieldRef Name='golden_record' />
                          <FieldRef Name='catalogos_asociados' />
                          <FieldRef Name='etiqueta_tecnica' />
                          <FieldRef Name='sn_activo' />
                      </ViewFields>`,
      completefunc: function (xData, Status) {
        $(xData.responseXML).find("z\\:row").each(function () {
          let item = {};
          for (let i = 0; i < this.attributes.length; i++) {
            const attribute = this.attributes[i];
            const cleanName = attribute.name.replace('ows_', '');
            item[cleanName] = $(this).attr(attribute.name);
          }
          resultados.push(item);
        });
      }
    });
    return resultados;
  }
};
