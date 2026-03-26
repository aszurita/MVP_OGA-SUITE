 // Obtener opciones desde SharePoint
//NOTA: PARA QUE APAEZCAN BOTONES EN LA INTERFAZ LOS NOMBRES DE LOS BOTONES (columna descripcion de la lista de sharepoint) DEBEN ESTAR EN MAYUSCULA
//los nombres de las opciones (columna opcion en la lista de sharepoint deben seguir este formato) en minusculas y el separador sea un guion ejemplo : "data-analytics"
// el parametro menu debe tener el mismo formato que en la lista de sharepoint
// Obtener opciones desde SharePoint
function getOptions(menu, opcionFiltro = "") {
    // 🔧 BYPASS TEMPORAL - Mostrar todas las opciones sin filtrar
    console.log("⚠️ BYPASS ACTIVO: Mostrando todas las opciones para krodriguez1@bancoguayaquil.com");
    return getAllOptionsWithoutFilteringPermissions(menu, opcionFiltro);
    
    /* CÓDIGO ORIGINAL - Activar cuando los permisos funcionen
    let options = [];
    let usuarioActual = (window.current_user || obtenerUsuario() || "").toLowerCase();
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
            console.log("📌 Datos obtenidos de SharePoint:");
            $(xData.responseXML).find("z\\:row").each(function () {
                let permisos = $(this).attr("ows_permisos") || "";
                let listaUsuarios = permisos.split("||").filter(user => user.trim() !== "").map(user => user.toLowerCase());

                let opcion = {
                    descripcion: $(this).attr("ows_descripcion").toUpperCase(),
                    icono: $(this).attr("ows_icono") || "iconsminds-user",
                    url: $(this).attr("ows_url") || "",
                    permisos: listaUsuarios,
                };

                if (listaUsuarios.length === 0 || listaUsuarios.includes(usuarioActual)) {
                    options.push(opcion);
                }
            });

            console.log("📌 Opciones filtradas para el usuario:", options);
        }
    });

    return options;
    */
}

window.getOptions = getOptions;