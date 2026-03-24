function cargarAtributosCalidad() {
  console.log("[cargarAtributosCalidad] Ejecutando...");
  $("#lista-atributos-calidad").html("");

  const { plataforma, servidor, base, esquema, tabla } = window.contextoTablaSeleccionada;

  // Obtener info larga y corta y unirlas
  const tablasoficialesInfo = getInfoTablasOficiales();
  const info_tecnica_corta = getInfoTecnicaCorta();

  leerDataset("Z_INF_TECNICA_LARGA").then(info_tecnica => {
    console.log("[cargarAtributosCalidad] info_tecnica cargada con longitud:", info_tecnica.length);

    const camposProcesados = {};
    const resultado_info_tecnica = [];

    // Agregar elementos únicos de la lista corta
    info_tecnica_corta.forEach(elemento => {
      if (!camposProcesados[elemento.llave_unica]) {
        if (tablasoficialesInfo[elemento.llave_tabla]) {
          elemento.clasificacion = tablasoficialesInfo[elemento.llave_tabla].clasificacion;
          elemento.descripcion_tabla = tablasoficialesInfo[elemento.llave_tabla].descripcion_tabla;
        } else {
          elemento.clasificacion = " ";
          elemento.descripcion_tabla = " ";
        }
        resultado_info_tecnica.push(elemento);
        camposProcesados[elemento.llave_unica] = true;
      }
    });

    // Agregar elementos únicos de la lista larga
    info_tecnica.forEach(elemento => {
      if (!camposProcesados[elemento.llave_unica]) {
        if (tablasoficialesInfo[elemento.llave_tabla]) {
          elemento.clasificacion = tablasoficialesInfo[elemento.llave_tabla].clasificacion;
          elemento.descripcion_tabla = tablasoficialesInfo[elemento.llave_tabla].descripcion_tabla;
        } else {
          elemento.clasificacion = " ";
          elemento.descripcion_tabla = " ";
        }
        const split = elemento.llave_unica.split("_");
        if (split[split.length - 1]) {
          resultado_info_tecnica.push(elemento);
          camposProcesados[elemento.llave_unica] = true;
        }
      }
    });

    // Filtrar por contexto y código válido
    let camposFiltrados = resultado_info_tecnica.filter(item =>
      item.plataforma === plataforma &&
      item.servidor === servidor &&
      item.base === base &&
      item.esquema === esquema &&
      item.tabla === tabla &&
      item.codigo
    );

    console.log("CAMPOS FILTRADOS: ", camposFiltrados)

    // Agrupar por combinación única de código y campo
    const vistos = new Set();
    const camposUnicos = [];

    camposFiltrados.forEach((item, idx) => {
      const key = `${item.codigo}||${item.campo}`;
      if (!vistos.has(key)) {
        vistos.add(key);
        camposUnicos.push({ ...item, index: idx });
      }
    });

    window.camposAtributo = camposFiltrados;
    console.log("[cargarAtributosCalidad] Campos únicos dibujados:", camposUnicos);

    if (camposUnicos.length === 0) {
      showNotification("top", "center", "info", "No se encontraron atributos para la tabla seleccionada.");
      return;
    }

    window.lista_calidad_atributo = getCalidad_atributo();

    // Agrupar por código para saber si hay múltiples campos asociados
    const codigoToCampos = {};
    camposUnicos.forEach(item => {
      if (!codigoToCampos[item.codigo]) codigoToCampos[item.codigo] = new Set();
      codigoToCampos[item.codigo].add(item.campo);
    });

    // Dibujar enlaces
    camposUnicos.forEach(({ descripcion, campo, codigo, index }) => {
      if(descripcion){
      const nombre = descripcion; //|| "(Sin descripción)";
      const nombreAMostrar = codigoToCampos[codigo].size > 1 ? `${nombre} (${campo})` : nombre;

      let html = `<a href="#" class="mb-2 atributo-link" data-index="${index}" data-codigo="${codigo}">${nombreAMostrar}</a>`;
      $("#lista-atributos-calidad").append(html);
      }
    });

    $(".atributo-link").click(async function (e) {
      e.preventDefault();

      const index = $(this).data("index");

      const campoSeleccionado = window.camposAtributo[index];
      console.log("CAMPO SELECCIONADO", campoSeleccionado);
      const nombre = $(this).text();
      const id = campoSeleccionado.codigo;
      console.log("id DEL ATRIBUTO CAMPO SELECCIONADO", id);
      $("#campo").val(campoSeleccionado.campo);
      $("#atributo-actual").text(nombre);

      cargarIndicadoresPorAtributo(id);
    });
  }).catch(error => {
    console.error("[cargarAtributosCalidad] Error al cargar dataset:", error);
    showNotification("top", "center", "danger", "Error al cargar los datos de atributos.");
  });
}

window.cargarAtributosCalidad = cargarAtributosCalidad;
