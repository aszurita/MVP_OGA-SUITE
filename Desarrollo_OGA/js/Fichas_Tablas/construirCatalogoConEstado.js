async function construirCatalogoConEstado(catalogo) {
  const catalogoConEstado = await Promise.all(catalogo.map(async (data) => {
    const estado = await estadoProfiling(data.base, data.esquema, data.tabla);
    data.tiene_profiling = estado === 2;
    data._estado = estado;
    return data;
  }));
  return catalogoConEstado;
}