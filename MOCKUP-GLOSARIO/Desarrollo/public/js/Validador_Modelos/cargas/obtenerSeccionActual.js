function obtenerSeccionActual() {
    const seccion = $(".seccion-item.selected").data("seccion");
    console.log("Seccion SELECCIONADA:", seccion)
    if (!seccion) {
      console.warn("⚠️ No se ha seleccionado ninguna sección actualmente.");
    }
    return seccion;
  }