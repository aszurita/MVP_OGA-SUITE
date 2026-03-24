function verificarBloqueoPorModeloSeleccionado(selectId = "#modeloSelect") {
    const codigoModelo = $(selectId).val();

    if (!codigoModelo) return;

    console.log("📄 Modelo seleccionado:", codigoModelo);

    buscarValidacionYDetallePorModelo(codigoModelo, function (resultado) {
        if (!resultado) {
            console.warn("📭 El modelo no tiene validaciones registradas.");
            window.validacionBloqueada = false;

            // Desactivar todo por defecto
            $("#btnBloquearValidacion").prop("disabled", true);
            $("#guardarValidacionBtn, #btnDescartarCambios").prop("disabled", true);
            $("#btnNuevaValidacion").prop("disabled", true);
            return;
        }

        const fechaFinal = resultado.fecha_Finalizacion;
        const id_validacion = resultado.id_validacion;

        // Evaluar si ya está finalizada
        const estaBloqueado = !!fechaFinal && fechaFinal !== "null";
        window.validacionBloqueada = estaBloqueado;
        window.idValidacionActual = id_validacion;

        console.log("🆔 ID validación:", id_validacion);
        console.log("🔒 Estado de bloqueo:", estaBloqueado ? "BLOQUEADA" : "EDITABLE");

        const btn = $("#btnBloquearValidacion");

        if (estaBloqueado) {
            // Si ya está cerrada, deshabilitar todo menos nueva validación
            btn.prop("disabled", true)
                .html('<i class="simple-icon-lock ml-1" style="font-size: 20px;"></i>')
                .css({ color: "#dc3545", borderColor: "#dc3545" })
                .attr("title", "Validación cerrada");

            $("#guardarValidacionBtn, #btnDescartarCambios").prop("disabled", true);
            $("#btnNuevaValidacion").prop("disabled", false); // solo este habilitado

        } else {
            // Si está editable, permitir edición pero NO nueva validación
            btn.prop("disabled", false)
                .html('<i class="simple-icon-lock-open ml-1" style="font-size: 20px;"></i>')
                .css({ color: "#28a745", borderColor: "#28a745" })
                .attr("title", "Validación editable (click para bloquear)");

            $("#guardarValidacionBtn, #btnDescartarCambios").prop("disabled", false);
            $("#btnNuevaValidacion").prop("disabled", true); // bloqueado cuando es editable
        }
    });
}
