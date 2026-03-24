function getAllOptions(menu) {   //Autor: Jared Castillo Chiang
    let options = [];
    let queryCondition = `<Eq><FieldRef Name='menu' /><Value Type='Text'>${menu}</Value></Eq>`;
    let camlQuery = `<Query><Where>${queryCondition}</Where></Query>`;

    console.log("Obteniendo todas las opciones sin filtrar por permisos:", camlQuery);

    $().SPServices({
        operation: "GetListItems",
        async: false,
        listName: "DESARROLLO_AUTOSERVICIO_PORTAL",
        CAMLQuery: camlQuery,
        CAMLViewFields: "<ViewFields><FieldRef Name='descripcion' /><FieldRef Name='icono' /><FieldRef Name='url' /><FieldRef Name='permisos' /></ViewFields>",
        completefunc: function (xData) {
            $(xData.responseXML).find("z\\:row").each(function () {
                let descripcion = ($(this).attr("ows_descripcion") || "").trim().toUpperCase(); // Convertir a mayúsculas
                options.push({
                    descripcion: descripcion,
                    icono: $(this).attr("ows_icono") || "iconsminds-user",
                    url: $(this).attr("ows_url") || "",
                    permisos: ($(this).attr("ows_permisos") || "").split("||"), // Convertir en array
                });
            });
        }
    });

    return options;
}

window.getAllOptions = getAllOptions;