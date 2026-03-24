function reemplazarPorLotesPorID(listaNombre, columnaNombre, valorOriginal, valorNuevo, desdeID = 0, lote = 500) {
  console.log(`🔍 Cargando registros con ID > ${desdeID} (máx ${lote})...`);

  const query = `
    <Query>
      <Where>
        <Gt>
          <FieldRef Name='ID' />
          <Value Type='Counter'>${desdeID}</Value>
        </Gt>
      </Where>
      <OrderBy><FieldRef Name='ID' Ascending='TRUE' /></OrderBy>
    </Query>
  `;

  $().SPServices({
    operation: "GetListItems",
    async: true,
    listName: listaNombre,
    CAMLQuery: query,
    CAMLRowLimit: lote,
    completefunc: function (xData, Status) {
      const rows = $(xData.responseXML).SPFilterNode("z:row");
      if (rows.length === 0) {
        console.log("✅ Fin del recorrido. Ya no hay más registros.");
        return;
      }

      let ultimoID = desdeID;
      let batch = "";
      let actualizados = 0;

      rows.each(function (i) {
        const itemID = parseInt($(this).attr("ows_ID"));
        const valorActual = $(this).attr("ows_" + columnaNombre);
        ultimoID = itemID;

        if (valorActual === valorOriginal && valorActual !== valorNuevo) {
          actualizados++;
          batch += `
            <Method ID='${i + 1}' Cmd='Update'>
              <Field Name='ID'>${itemID}</Field>
              <Field Name='${columnaNombre}'>${valorNuevo}</Field>
            </Method>
          `;
        }
      });

      if (actualizados > 0) {
        $().SPServices({
          operation: "UpdateListItems",
          async: true,
          batchCmd: "Update",
          listName: listaNombre,
          updates: `<Batch OnError='Continue'>${batch}</Batch>`,
          completefunc: function () {
            console.log(`✔ Se actualizaron ${actualizados} registros del bloque. Último ID: ${ultimoID}`);
            // Llamamos el siguiente bloque automáticamente
            setTimeout(() => {
              reemplazarPorLotesPorID(listaNombre, columnaNombre, valorOriginal, valorNuevo, ultimoID, lote);
            }, 500); // puedes bajar esto a 250ms si todo va bien
          }
        });
      } else {
        console.log(`⏩ Nada que actualizar en este lote. Pasando al siguiente (último ID: ${ultimoID})...`);
        setTimeout(() => {
          reemplazarPorLotesPorID(listaNombre, columnaNombre, valorOriginal, valorNuevo, ultimoID, lote);
        }, 500);
      }
    }
  });
}
