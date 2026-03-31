function convertirFechaISO(fechaLegible) {
    const partes = fechaLegible.split(' ');
    const fecha = partes[0].split('/');
    const hora = partes[1];
    return `${fecha[2]}-${fecha[1]}-${fecha[0]}T${hora}`;
  }
  
  function mostrarPopupProfiling(base, esquema, tabla) {
    console.log("🔍 Mostrando profiling para:", base, esquema, tabla);
    $('#profilingModal').remove();
  
    buscarArchivos(base, esquema, tabla, function (archivos) {
      if (!archivos || archivos.length === 0) {
        console.warn("⚠️ No se encontraron archivos de profiling.");
        showNotification("top", "center", "warning", "No se encontraron archivos");
        return;
      }
  
      console.log("📦 Archivos encontrados:", archivos);
  
      const archivosData = archivos.map(archivo => {
        const partes = archivo.split("-")[3].split("_");
        const fecha = partes[0];
        const hora = partes[1];
        const fechaFormateada = `${fecha.substring(6, 8)}/${fecha.substring(4, 6)}/${fecha.substring(0, 4)}`;
        const horaFormateada = `${hora.substring(0, 2)}:${hora.substring(2, 4)}`;
        const fechaLegible = `${fechaFormateada} ${horaFormateada}`;
        const fechaISO = convertirFechaISO(fechaLegible);
        return { archivo, fechaLegible, fechaISO };
      });
  
      console.log("📅 Antes de ordenar:", archivosData.map(a => a.fechaISO));
  
      archivosData.sort((a, b) => b.fechaISO.localeCompare(a.fechaISO));
  
      console.log("✅ Después de ordenar (más recientes primero):", archivosData.map(a => a.fechaISO));
  
      let tableHTML = `<table id="profilingTable" class="table table-striped table-bordered" style="width: 100%; min-width: 800px; word-wrap: break-word;">
                        <thead>
                            <tr>
                                <th style="width: 190px;">Nombre de la Tabla</th>
                                <th style="width: 170px;">Archivo</th>
                                <th style="width: 140px;">Fecha y Hora Generada</th>
                                <th style="width: 130px;">Acción</th>
                            </tr>
                        </thead>
                        <tbody>`;
  
      archivosData.forEach(({ archivo, fechaLegible }) => {
        const valorBusqueda = `[${base}] . [${esquema}] . [${tabla}]`;
  
        tableHTML += `<tr>
                        <td>${valorBusqueda}</td>
                        <td>${archivo}</td>
                        <td>${fechaLegible}</td>
                        <td style="text-align: center;">
                            <button style="font-size: 13px;" class="badge badge-pill badge-secondary atributo" onclick="visualizarProfiling('${archivo}')">
                                <i class="fas fa-eye simple-icon-doc"></i> Ver Profiling
                            </button>
                        </td>
                      </tr>`;
      });
  
      tableHTML += '</tbody></table>';
  
      let modalHTML = `<div class="modal fade" id="profilingModal" tabindex="-1" role="dialog" aria-labelledby="profilingModalLabel" aria-hidden="true">
                        <div class="modal-dialog" role="document" style="max-width: 90%; width: 1000px;">
                            <div class="modal-content" style="border-radius: 10px; min-width: 1000px;">
                                <div class="modal-header" style="border-bottom: 1px solid #ddd;">
                                    <h5 class="modal-title" id="profilingModalLabel">Historial de Profiling</h5>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body" style="overflow-x: auto; padding: 20px;">
                                    ${tableHTML}
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                                </div>
                            </div>
                        </div>
                    </div>`;
  
      $("body").append(modalHTML);
      $("#profilingModal").modal('show');
  
      $('#profilingModal').on('shown.bs.modal', function () {
        $('#profilingTable').DataTable({
          paging: true,
          searching: true,
          ordering: true,
          //order: [[2, 'desc']],
          info: true,
          pageLength: 10,
          autoWidth: true,
          scrollX: true,
          scrollCollapse: true,
          colResize: {
            isEnabled: true,
            hasBoundCheck: false
          },
          language: {
            search: "Buscar: ",
            lengthMenu: "Mostrar _MENU_ entradas",
            info: "Mostrando _START_ a _END_ de _TOTAL_ entradas",
            infoEmpty: "Mostrando 0 a 0 de 0 entradas",
            infoFiltered: "(filtrado de _MAX_ entradas totales)",
            loadingRecords: "Cargando...",
            zeroRecords: "No se encontraron registros coincidentes",
            emptyTable: "No hay datos disponibles en la tabla",
            paginate: {
              first: "Primero",
              previous: "Anterior",
              next: "Siguiente",
              last: "Último"
            }
          }
        });
  
        $('#profilingTable_filter').css('text-align', 'right');
        $('#profilingTable_length label').css('padding-right', '235px');
        $('#profilingTable_paginate').css('padding-right', '350px');
      });
    });
  }
  
  window.mostrarPopupProfiling = mostrarPopupProfiling;
  