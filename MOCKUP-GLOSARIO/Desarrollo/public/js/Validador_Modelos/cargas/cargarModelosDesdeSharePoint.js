async function cargarModelosDesdeSharePoint() {
  const select = $("#modeloSelect");

  // Placeholder
  select
    .empty()
    .append('<option value="" disabled selected>📄 Selecciona un modelo...</option>');
  
  // Llamamos a la nueva función de la API
  const data = await fetchModelosFromAPI();
  
  // La API puede devolver un objeto si hay un solo resultado, o un array. Normalizamos.
  const listaModelos = (Array.isArray(data) ? data : [data]).filter(Boolean);
  
  // Ordenamos alfabéticamente por el nombre del modelo
  listaModelos.sort((a, b) => (a.modelo_analitica || "").localeCompare(b.modelo_analitica || ""));
  
  if (listaModelos.length > 0) {
    const nombresVistos = new Set();
    
    listaModelos.forEach(item => {
      // ❗ CORRECCIÓN: 'codigo_final' ya no existe. Usamos 'codigo' como el valor principal.
      const codigoFinal = item.codigo; 
      const idModelo = item.id;
      const codigo = item.codigo;
      const nombre = item.modelo_analitica;
      
      // Evita duplicados por nombre para un dropdown más limpio
      if (codigoFinal && nombre && !nombresVistos.has(nombre)) {
        nombresVistos.add(nombre);

        // El `value` debe ser `codigo`. Guardamos `id` por si acaso.
        select.append(
          `<option value="${codigoFinal}" data-id-modelo="${idModelo}">
             ${nombre} (${codigo})
           </option>`
        );
      }
    });
    
  } else {
    select.append('<option disabled>No se encontraron modelos.</option>');
  }
  
  // (Re)-inicializa Select2 para aplicar estilos y búsqueda
  if (select.hasClass("select2-hidden-accessible")) {
    select.select2("destroy");
  }
  select.select2({
    placeholder: "📄 Selecciona un modelo...",
    allowClear: true,
    width: "100%",
  });
}
