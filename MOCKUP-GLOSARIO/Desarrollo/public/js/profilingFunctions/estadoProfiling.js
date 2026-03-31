let cache = {}; // Cache to store state for each table

function estadoProfiling(base, esquema, tabla) {
  const key = `${base}-${esquema}-${tabla}`;
  if (cache[key] !== undefined) {
    return Promise.resolve(cache[key]);
  }

  return new Promise((resolve, reject) => {
    let estado = -1;

    $().SPServices({
      operation: "GetListItems",
      async: true,
      listName: "TEST_Z_Profiling",
      CAMLQuery: `<Query>
                    <Where>
                      <And>
                        <And>
                          <Eq><FieldRef Name='TABLA' /><Value Type='Text'>${tabla}</Value></Eq>
                          <Eq><FieldRef Name='BASE' /><Value Type='Text'>${base}</Value></Eq>
                        </And>
                        <Eq><FieldRef Name='ESQUEMA' /><Value Type='Text'>${esquema}</Value></Eq>
                      </And>
                    </Where>
                  </Query>`,
      completefunc: function (xData) {
        let found = false;

        $(xData.responseXML).find("z\\:row").each(function () {
          const estadoFila = Math.trunc($(this).attr("ows_ESTADO"));
          if (estadoFila == 2) { estado = 2; found = true; return false; }
          else if (estadoFila == 1) { estado = 1; found = true; }
          else if (estadoFila == 0) { estado = 0; found = true; }
        });

        cache[key] = estado;
        resolve(estado);
      },
      errorfunc: function (_, __, msg) {
        console.error("Error en profiling:", msg);
        reject(msg);
      }
    });
  });
}

window.estadoProfiling = estadoProfiling;