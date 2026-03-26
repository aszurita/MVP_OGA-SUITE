// Obtener TODAS las opciones desde SharePoint sin importar los permisos

//NOTA: PARA QUE APAEZCAN BOTONES EN LA INTERFAZ LOS NOMBRES DE LOS BOTONES (columna descripcion de la lista de sharepoint) DEBEN ESTAR EN MAYUSCULA
//los nombres de las opciones (columna opcion en la lista de sharepoint deben seguir este formato) en minusculas y el separador sea un guion ejemplo : "data-analytics"
// el parametro menu debe tener el mismo formato que en la lista de sharepoint
function getAllOptionsWithoutFilteringPermissions(menu, opcionFiltro = "") {
    let options = [];
    let queryCondition = `<Eq><FieldRef Name='menu' /><Value Type='Text'>${menu}</Value></Eq>`;

    if (opcionFiltro) {
        queryCondition = `<And>
            ${queryCondition}
            <Eq><FieldRef Name='opcion' /><Value Type='Text'>${opcionFiltro}</Value></Eq>
          </And>`;
    }

    let camlQuery = `<Query><Where>${queryCondition}</Where></Query>`;

    $().SPServices({
        operation: "GetListItems",
        async: false,
        listName: "DESARROLLO_AUTOSERVICIO_PORTAL",
        CAMLQuery: camlQuery,
        CAMLViewFields: "<ViewFields><FieldRef Name='descripcion' /><FieldRef Name='icono' /><FieldRef Name='url' /><FieldRef Name='permisos' /></ViewFields>",
        completefunc: function (xData) {
            console.log("📌 Todas las opciones obtenidas de SharePoint (sin filtrar por permisos):");
            $(xData.responseXML).find("z\\:row").each(function () {
                options.push({
                    descripcion: $(this).attr("ows_descripcion"),
                    icono: $(this).attr("ows_icono") || "iconsminds-user",
                    url: $(this).attr("ows_url") || "",
                    permisos: ($(this).attr("ows_permisos") || "").split("||") // Convertir en array
                });
            });
            console.log("📌 Opciones sin filtrar:", options);
        }
    });

    return options;
}

window.getAllOptionsWithoutFilteringPermissions = getAllOptionsWithoutFilteringPermissions;