function insertarIconosCalidadEnTabla() {
  const tabla = $('#tablaOficial').DataTable();
  const rows = tabla.rows({ page: 'current' }).nodes();

  rows.each(function (row) {
    const data = tabla.row(row).data();
    const claveCalidad = `${data.plataforma}__${data.servidor}__${data.base}__${data.esquema}__${data.tabla}`;
    const datosCalidad = window.mapaPorcentajesCalidad?.[claveCalidad];

    if (datosCalidad?.porcentaje > 0) {
      const iconoCalidad = `
        <icon class="simple-icon-badge estado-tooltip"
          data-toggle="tooltip"
          data-placement="right"
          title="Porcentaje de calidad: ${datosCalidad.porcentaje}%\n(${datosCalidad.cantidadConCalidad} de ${datosCalidad.totalAtributos} campos)"
          style="font-size: 14px; color:rgb(209, 47, 109); cursor: pointer; margin-left: 4px;"
          onclick="abrirModalIndicadores('${data.plataforma}', '${data.servidor}', '${data.base}', '${data.esquema}', '${data.tabla}')">
        </icon>`;

      const $estadoContainer = $(row).find('.estado-icon-placeholder');
      if (!$estadoContainer.find('.simple-icon-badge').length) {
        $estadoContainer.append(iconoCalidad);
        $estadoContainer.find('[data-toggle="tooltip"]').tooltip();
      }
    }
  });
}