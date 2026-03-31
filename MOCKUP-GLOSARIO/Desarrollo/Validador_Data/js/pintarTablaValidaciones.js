// 🔹 Inyecta estilos una sola vez
function asegurarEstilosTablaValidaciones() {
  if (document.getElementById("validacionesChipsCSS")) return;
  $("head").append(`
    <style id="validacionesChipsCSS">
      /* Chips de estado (magenta brand: #B4005C) */
      .chip {
        display:inline-flex; align-items:center;
        padding:2px 10px; border-radius:9999px;
        font-weight:600; font-size:12px; line-height:20px;
        border:1px solid transparent; white-space:nowrap;
      }
      /* CERRADO (verde armónico) */
      .chip--cerrado{
        background:#E8FFF4;     /* verde pastel */
        color:#065F46;          /* texto verde profundo */
        border-color:#34D399;   /* emerald-400 */
      }
      /* EN PROCESO (magenta de marca en suave) */
      .chip--proceso{
        background:#FDE7F2;     /* magenta muy claro */
        color:#7A0B46;          /* magenta oscuro para contraste */
        border-color:#B4005C;   /* borde magenta brand */
      }
    </style>
  `);
}
function getModelCode() {
  let modelCode = null;
  try {
    // URL del padre (si estás en un iframe) o la propia
    const urlParams = new URLSearchParams(window.parent.location.search || window.location.search);
    modelCode = urlParams.get("codigo");
    console.log("Código del modelo detectado:", modelCode);
  } catch (err) {
    console.error("No se pudo obtener el código del modelo:", err);
  }
  return modelCode;
}

function pintarTablaValidaciones(filas) {
  asegurarEstilosTablaValidaciones();

  const tabla = $("#tblValidaciones");
  if ($.fn.DataTable.isDataTable(tabla)) {
    tabla.DataTable().clear().destroy();
  }

  const dt = tabla.DataTable({
    data: filas,
    deferRender: true,
    paging: true,
    pageLength: 10,
    autoWidth: false,
    scrollX: true,
    order: [[0, 'asc'], [1, 'asc']],
    dom: 'tlip',
    buttons: [{
      extend: 'excel',
      text: 'Exportar a Excel',
      customize: xlsx => customizeExcel(xlsx, "Historial de validaciones", "")
    }],
    columns: [
      { data: 'codigo_modelo', title: 'Código modelo' },
      { data: 'fecha_ini', title: 'Fecha de inicio', width: '90px' },
      { data: 'usuario_crea', title: 'Usuario creación', width: '140px' },
      { data: 'score', title: 'Score', width: '60px', className: 'text-right' },

      // 🆕 Estado con chip (para display) pero texto plano para ordenar/exportar
      { 
        data: 'estado',
        title: 'Estado',
        width: '70px',
        className: 'text-center',
        render: function (data, type) {
          // Para ordenar/filtrar/exportar → devuelve texto plano
          if (type !== 'display') return data || '';
          const isCerrado = /^cerrado$/i.test(String(data || ''));
          const cls = isCerrado ? 'chip chip--cerrado' : 'chip chip--proceso';
          const txt = isCerrado ? 'Cerrado' : 'En proceso';
          return `<span class="${cls}">${txt}</span>`;
        }
      },

      { data: 'usuario_mod', title: 'Usuario modificación', width: '140px' },
      { data: 'fecha_act', title: 'Fecha actualización', width: '90px' }
    ],
    language: {
      emptyTable: 'Sin registros',
      info: '_TOTAL_ resultados',
      lengthMenu: 'Mostrar _MENU_',
      search: '',
      paginate: { next: '>', previous: '<' }
    },
    initComplete: function () {
      const api = this.api();
      const modelCode = getModelCode(); 
  
      if (modelCode) {
        $("#fltValidaciones").val(modelCode); 
        api.search(modelCode).draw();        
      }
  
      // mantener búsqueda manual
      $("#fltValidaciones").on("keyup", function () {
        api.search(this.value).draw();
      });
          
      setTimeout(() => {
        $("#tblValidaciones").colResizable({
          liveDrag: true,
          gripInnerHtml: "<div class='grip'</div>",
          draggingClass: "dragging",
          resizeMode: 'fit'
        });
      }, 100);
    }
  });

  new $.fn.dataTable.Buttons(dt, {
    buttons: [{
      extend: 'excel',
      customize: xlsx => customizeExcel(xlsx, "Historial de validaciones", "")
    }]
  });
  
  // exportas con tu propia función
  function exportarExcel() {
    dt.button(0).trigger();
  }
}
