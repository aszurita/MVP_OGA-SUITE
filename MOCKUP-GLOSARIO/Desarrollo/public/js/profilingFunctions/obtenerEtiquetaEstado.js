
function obtenerEtiquetaEstado(estado) {  //Autor: Jared Castillo
    switch (estado) {
      case 2:
        return "Profiling Generado";
      case 1:
        return "En Proceso de Profiling";
      case 0:
        return "En Proceso de Profiling";
      default:
        return "";
    }
  }

  window.obtenerEtiquetaEstado = obtenerEtiquetaEstado;