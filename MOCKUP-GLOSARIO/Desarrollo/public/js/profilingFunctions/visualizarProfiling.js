function visualizarProfiling(nombreArchivo) {   //Autor: Jared Castillo
    let url = `${BASE_URL}Profiling/${nombreArchivo}`;
    window.open(url, '_blank');
  }

  window.visualizarProfiling = visualizarProfiling;