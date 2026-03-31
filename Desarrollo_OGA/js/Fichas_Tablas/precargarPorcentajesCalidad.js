async function precargarPorcentajesCalidad() {
  const dataObj = await getCalidad_atributo(null);
  const dataArray = Object.values(dataObj || []);
  console.log(`🔎 Total registros crudos recibidos: ${dataArray.length}`);

  const mapaAgrupado = Object.create(null);

  // Agrupación de datos válidos por clave
  for (const entidad of dataArray) {
    if (!entidad?.plataforma) continue;

    const valor = parseFloat(entidad.valor);
    if (isNaN(valor) || valor >= 999) continue;

    const clave = `${entidad.plataforma}__${entidad.servidor}__${entidad.base}__${entidad.esquema}__${entidad.tabla}`;
    if (!mapaAgrupado[clave]) mapaAgrupado[clave] = [];

    mapaAgrupado[clave].push({
      valor,
      id_atributos: entidad.id_atributos?.toString()
    });
  }

  const campos = window.camposAtributoGlobal || [];
  const resultado = Object.create(null);

  for (const [clave, registros] of Object.entries(mapaAgrupado)) {
    const suma = registros.reduce((acc, r) => acc + r.valor, 0);
    const promedio = suma / registros.length;

    const idsConCalidad = new Set(registros.map(r => r.id_atributos));
    const cantidadConCalidad = idsConCalidad.size;

    const [plataforma, servidor, base, esquema, tabla] = clave.split("__");

    const totalAtributos = campos.filter(item => {
      if (!item) return false;
      return (
        item.plataforma?.trim() === plataforma &&
        item.servidor?.trim() === servidor &&
        item.base?.trim() === base &&
        item.esquema?.trim() === esquema &&
        item.tabla?.trim() === tabla &&
        item.codigo &&
        !item.codigo.startsWith('***')
      );
    }).length;

    let porcentajeFinal = Math.round(promedio);
    if (totalAtributos > 0 && cantidadConCalidad < totalAtributos) {
      porcentajeFinal = Math.round(promedio * (cantidadConCalidad / totalAtributos));
    }

    resultado[clave] = {
      porcentaje: porcentajeFinal,
      cantidadConCalidad,
      totalAtributos
    };
  }

  console.log('✅ Resultado final precargado:', resultado);
  return resultado;
}
