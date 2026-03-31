function crearModalValidaciones() {
  if (document.getElementById("modalValidaciones")) return;

  if (!document.getElementById("colResizeScripts")) {
    $("head").append(`
      <link rel="stylesheet" href="https://code.jquery.com/ui/1.13.2/themes/base/jquery-ui.css">
      <style>
        .grip { background:#b4005c; width:3px; height:100%; cursor:col-resize; float:right; }
        .dragging { background-color: rgba(180,0,92,0.1); }
        #tblValidaciones thead th {
          position: relative;
          white-space: nowrap;
          background:#f8fafc;
          color:#0f172a;
          border-bottom:2px solid #e2e8f0;
        }
      </style>
      <script id="colResizeScripts" src="https://code.jquery.com/ui/1.13.2/jquery-ui.min.js"></script>
      <script src="https://cdn.jsdelivr.net/gh/colresizable/colResizable@master/colResizable-1.6.min.js"></script>
    `);
  }

  $("body").append(`
    <div class="modal fade" id="modalValidaciones" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-xl modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header py-2">
            <h4 class="modal-title font-weight-bold mb-0">Historial de validaciones – Todos los modelos</h4>
            <button class="close" data-dismiss="modal"><span>&times;</span></button>
          </div>
          <div class="modal-body p-3">
            <div class="d-flex mb-2">
              <input id="fltValidaciones" class="form-control form-control-sm"
                     placeholder="Buscar..." style="max-width:220px">
            </div>
            <div class="table-responsive">
              <table id="tblValidaciones" class="table tabla-validaciones w-100">
                <thead>
                  <tr>
                    <th>Código modelo</th>
                    <th>Fecha de inicio</th>
                    <th>Usuario creación</th>
                    <th>Score</th>
                    <th>Estado</th>
                    <th>Usuario modificación</th>
                    <th>Fecha actualización</th>
                  </tr>
                </thead>
                <tbody></tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `);

  setTimeout(() => {
    $("#tblValidaciones").colResizable({
      liveDrag: true,
      gripInnerHtml: "<div class='grip'></div>",
      draggingClass: "dragging",
      resizeMode: 'fit'
    });
  }, 500);
}
