// Obtener opciones desde SharePoint
function getOptions(menu, opcionFiltro = "") {   //Autor: Jared Castillo Chiang
    let options = [];
    let queryCondition = `<Eq><FieldRef Name='menu' /><Value Type='Text'>${menu}</Value></Eq>`;

    if (opcionFiltro) {
        queryCondition = `<And>
                    ${queryCondition}
                    <Eq><FieldRef Name='opcion' /><Value Type='Text'>${opcionFiltro}</Value></Eq>
                </And>`;
    }

    let camlQuery = `<Query><Where>${queryCondition}</Where></Query>`;

    console.log("Ejecutando consulta:", camlQuery);

    $().SPServices({
        operation: "GetListItems",
        async: false,
        listName: "DESARROLLO_AUTOSERVICIO_PORTAL",
        CAMLQuery: camlQuery,
        CAMLViewFields: "<ViewFields><FieldRef Name='descripcion' /><FieldRef Name='icono' /><FieldRef Name='url' /></ViewFields>",
        completefunc: function (xData) {
            $(xData.responseXML).find("z\\:row").each(function () {
                options.push({
                    descripcion: $(this).attr("ows_descripcion"),
                    icono: $(this).attr("ows_icono") || "iconsminds-user",
                    url: $(this).attr("ows_url") || ""
                });
            });
            console.log("Opciones obtenidas:", options);
        }
    });

    return options;
}

window.getOptions = getOptions;