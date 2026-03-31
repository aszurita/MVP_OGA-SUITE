function handleCheckboxEvents() {
    // Checkbox individual
    $(document).on("change", ".permission-checkbox", function () {
        const isChecked = $(this).prop("checked");
        const button = $(this).data("button").trim().toUpperCase().replace(/-/g, " ");
        const user = $(this).data("user").trim();
        const row = $(this).closest("tr");

        actualizarMemoriaPermisos(user, button, isChecked);

        // Si es opción principal, actualizar subopciones en esa fila
        if (opcionesRelacionadas.has(button)) {
            const subopciones = opcionesRelacionadas.get(button);
            row.find(".permission-checkbox").each(function () {
                const sub = $(this).data("button").trim().toUpperCase().replace(/-/g, " ");
                if (subopciones.has(sub)) {
                    $(this).prop("checked", isChecked);
                    actualizarMemoriaPermisos(user, sub, isChecked);
                }
            });
        }

        // Actualiza header-checkbox si aplica
        actualizarHeaderCheckbox(button);
    });

    // Checkbox de encabezado
    $(document).on("change", ".header-select-checkbox", function () {
        const button = $(this).data("button").trim().toUpperCase();
        const isChecked = $(this).prop("checked");

        let opcionesAfectadas = new Set([button]);
        if (opcionesRelacionadas.has(button)) {
            opcionesRelacionadas.get(button).forEach(sub => opcionesAfectadas.add(sub.toUpperCase()));
        }

        $('#permissions-table').DataTable().rows().every(function () {
            const rowNode = $(this.node());
            const user = rowNode.find("input.permission-checkbox").first().data("user");

            rowNode.find("input.permission-checkbox").each(function () {
                const botonActual = $(this).data("button").trim().toUpperCase();
                if (opcionesAfectadas.has(botonActual)) {
                    $(this).prop("checked", isChecked);
                    actualizarMemoriaPermisos(user, botonActual, isChecked);
                }
            });
        });

        // Actualizar todos los headers afectados
        opcionesAfectadas.forEach(actualizarHeaderCheckbox);
    });
}

function actualizarHeaderCheckbox(button) {
    const selector = `.permission-checkbox[data-button="${button}"]`;
    const checkboxes = $(selector);
    const allChecked = checkboxes.length > 0 && checkboxes.filter(":checked").length === checkboxes.length;
    $(`.header-select-checkbox[data-button="${button}"]`).prop("checked", allChecked);
}
