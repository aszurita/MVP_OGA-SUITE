function initializePermissionsMemory() {
    permisosTemp.clear(); // Limpiar antes de cargar
    $("#permissions-body tr").each(function () {
        let row = $(this);
        let user = row.find(".permission-checkbox").data("user").trim(); // Obtener el nombre de usuario real


        row.find(".permission-checkbox").each(function () {
            let button = $(this).data("button");
            let isChecked = $(this).prop("checked");

            if (!permisosTemp.has(button)) {
                permisosTemp.set(button, new Set());
            }

            if (isChecked) {
                permisosTemp.get(button).add(user);
            }
        });
    });

    console.log("📌 Memoria Temporal Inicializada:", permisosTemp);
}

window.initializePermissionsMemory = initializePermissionsMemory;