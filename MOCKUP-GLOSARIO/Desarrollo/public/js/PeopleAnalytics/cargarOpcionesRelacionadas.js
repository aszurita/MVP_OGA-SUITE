function cargarOpcionesRelacionadas() {
    opcionesRelacionadas.clear();

    // Obtener todas las opciones válidas de People Analytics
    let opcionesValidas = new Set(getAllOptionsWithoutFilteringPermissions("PeopleAnalytics", "principal").map(opt =>
        opt.descripcion.toUpperCase().replace(/-/g, " ")
    ));
    console.log("🔍 Opciones válidas obtenidas de PeopleAnalytics:", opcionesValidas);

    let camlQuery = `<Query><Where><IsNotNull><FieldRef Name='opcion' /></IsNotNull></Where></Query>`;

    $().SPServices({
        operation: "GetListItems",
        async: false,
        listName: "DESARROLLO_AUTOSERVICIO_PORTAL",
        CAMLQuery: camlQuery,
        CAMLViewFields: "<ViewFields><FieldRef Name='descripcion' /><FieldRef Name='opcion' /></ViewFields>",
        completefunc: function (xData) {
            console.log("📦 Datos obtenidos de SharePoint para relaciones:", xData.responseXML);

            let opcionesEncontradas = new Set(); // Para rastrear opciones principales que tienen subopciones

            let opcionesPrincipales = getOptions("PeopleAnalytics", "principal");

            $(xData.responseXML).find("z\\:row").each(function () {
                let subopcion = ($(this).attr("ows_descripcion") || "").trim().toUpperCase().replace(/-/g, " ");
                let opcionPrincipal = ($(this).attr("ows_opcion") || "").trim().toUpperCase().replace(/-/g, " ");

                console.log(`🔹 Opción Principal: ${opcionPrincipal}, Subopción: ${subopcion}`);

                // Filtrar solo si la opción principal existe en People Analytics
                if (opcionesValidas.has(opcionPrincipal)) {
                    opcionesEncontradas.add(opcionPrincipal);

                    if (!opcionesRelacionadas.has(opcionPrincipal)) {
                        opcionesRelacionadas.set(opcionPrincipal, new Set());
                    }
                    opcionesRelacionadas.get(opcionPrincipal).add(subopcion);
                }
            });

            // 🔹 Agregar opciones principales sin subopciones
            opcionesValidas.forEach(opcion => {
                console.log("LOG OPCION VALIDA (opcion):", opcion)
                if (!opcionesRelacionadas.has(opcion)) {
                    opcionesRelacionadas.set(opcion, new Set());
                }
            });

            console.log("📌 Opciones Relacionadas Cargadas (Incluyendo sin subopciones):", opcionesRelacionadas);
        }
    });
}

window.cargarOpcionesRelacionadas = cargarOpcionesRelacionadas;