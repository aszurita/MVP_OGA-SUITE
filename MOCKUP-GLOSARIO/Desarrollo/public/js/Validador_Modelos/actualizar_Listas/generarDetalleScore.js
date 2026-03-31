function generarDetalleScore(id_validacion, dataMapGlobal, usuario, fecha) {
  const detalleScoreList = [];

  // Verificar si dataMapGlobal está definido y no es un objeto vacío.
  if (!dataMapGlobal || Object.keys(dataMapGlobal).length === 0) {
    console.error("El objeto dataMapGlobal está vacío o no está definido.");
    return detalleScoreList;
  }

  // Itera sobre los objetos de cada sección principal (ej. el objeto para "Revisión Documentación").
  Object.values(dataMapGlobal).forEach(seccion => {
    
    // Itera sobre todas las claves dentro del objeto de la sección (ej. "1", "2", "peso_seccion", etc.).
    Object.keys(seccion).forEach(key => {
      const subseccion = seccion[key];

      // **LA CLAVE ESTÁ AQUÍ**: Solo procesamos el elemento si es un objeto que contiene parámetros.
      // Esto nos permite procesar las subsecciones ("1", "2", etc.) y omitir los metadatos.
      if (typeof subseccion === 'object' && subseccion !== null && subseccion.hasOwnProperty('parametros')) {

        // Se itera sobre los parámetros de cada subsección.
        Object.values(subseccion.parametros).forEach(parametro => {
          if (parametro && parametro.preguntas) {

            // Se itera sobre las preguntas de cada parámetro.
            parametro.preguntas.forEach(pregunta => {
              // Se crea el objeto para Z_DETALLE_SCORE y se añade a la lista.
              detalleScoreList.push({
                id_validacion: id_validacion,
                id_pregunta: pregunta.id,
                valor: pregunta.porcentajeCompletado,
                aplica: pregunta.aplica,
                usuario: usuario,
                fecha: fecha
              });
            });
          }
        });
      }
    });
  });

  console.log("Lista de detalles generada:", detalleScoreList);
  return detalleScoreList;
}