function savePermissions() {
    console.log("🚀 Iniciando actualización en SharePoint...");

    if (permisosTemp.size === 0) {
        console.log("⚠️ No hay cambios para guardar.");
        showNotification("top", "center", "warning", "No se han realizado cambios en los permisos.");
        return;
    }

    let processedUpdates = 0;
    let totalUpdates = permisosTemp.size;

    permisosTemp.forEach((usersSet, button) => {
        let updatedPermissions = [...usersSet].join("||");

        console.log(`🔍 Buscando en SharePoint: Botón: ${button}, Usuarios: ${updatedPermissions}`);

        $().SPServices({
            operation: "GetListItems",
            async: true,
            listName: "DESARROLLO_AUTOSERVICIO_PORTAL",
            CAMLQuery: `<Query><Where>
                    <Eq><FieldRef Name='descripcion' /><Value Type='Text'>${button}</Value></Eq>
                </Where></Query>`,
            CAMLViewFields: "<ViewFields><FieldRef Name='permisos' /><FieldRef Name='ID' /></ViewFields>",
            completefunc: function (xData) {
                let itemID = null;
                let existingPermissions = "";

                $(xData.responseXML).find("z\\:row").each(function () {
                    itemID = $(this).attr("ows_ID");
                    existingPermissions = $(this).attr("ows_permisos") || "";
                });

                if (itemID) {
                    if (existingPermissions === updatedPermissions) {
                        console.log(`⚠️ No hay cambios en permisos para ${button}, se omite actualización.`);
                        processedUpdates++;
                        if (processedUpdates === totalUpdates) {
                            finalizePermissionUpdate();
                        }
                        return;
                    }

                    $().SPServices({
                        operation: "UpdateListItems",
                        async: true,
                        listName: "DESARROLLO_AUTOSERVICIO_PORTAL",
                        updates: `<Batch OnError="Continue">
                    <Method ID="1" Cmd="Update">
                        <Field Name="ID">${itemID}</Field>
                        <Field Name="permisos">${updatedPermissions}</Field>
                    </Method>
                  </Batch>`,
                        completefunc: function () {
                            console.log(`✅ Permisos actualizados en SharePoint: ${button} → ${updatedPermissions}`);
                            processedUpdates++;

                            if (processedUpdates === totalUpdates) {
                                finalizePermissionUpdate();
                            }
                        }
                    });
                } else {
                    console.log(`⚠️ No se encontró el botón ${button} en SharePoint.`);
                    processedUpdates++;
                    if (processedUpdates === totalUpdates) {
                        finalizePermissionUpdate();
                    }
                }
            }
        });
    });
}

window.savePermissions = savePermissions;