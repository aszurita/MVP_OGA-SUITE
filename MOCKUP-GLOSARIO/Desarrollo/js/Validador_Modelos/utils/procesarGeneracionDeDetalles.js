function procesarGeneracionDeDetalles() {
    const usuario = getEmployeeCodeByUser();
    const fecha = formatoFecha();
    const id_validacion = window.idValidacionActual;

    if (!id_validacion) {
        console.error("❌ No se ha cargado un ID de validación.");
        return null;
    }

    console.log("📦 dataMapGlobal actual:");
    console.dir(dataMapGlobal); // Log completo para inspección

    const detallesGenerados = generarDetalleScore(id_validacion, dataMapGlobal, usuario, fecha);

    console.log("🆔 ID validación usado:", id_validacion);
    console.table(detallesGenerados);

    if (!detallesGenerados.length) {
        console.warn("❌ No se generaron detalles para guardar.");
        return null;
    }

    return detallesGenerados;
}
