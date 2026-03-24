function setSubsectionOptions(menu, opcion) {
    const options = getOptions(menu, opcion);
    const section = $("#" + opcion + " .section-options");
    section.empty();

    // Asegurar que la sección tiene las clases flexbox correctas
    section.addClass("d-flex flex-wrap justify-content-center");

    if (options.length === 0) {
        section.append("<p>No hay opciones disponibles</p>");
        return;
    }

    options.forEach((e, index) => {
        const style = index % 2 === 0 ? "btn-primary" : "btn-outline-primary";
        const button = $(`
            <a href='${e.url}' target='_blank' class='btn-people-analytics btn ${style} m-2' style='height: 200px; width: 200px;'>
                <i class='${e.icono}'></i>
                <h6 class='font-weight-bold'>${e.descripcion}</h6>
            </a>`);

        section.append(button);

        button.on("click", function () {
            registrar_visita(opcion.toUpperCase().replace(/-/g, " "), e.descripcion);
            console.log(`SE REGISTRO INTERACCION: PAGINA: ${opcion.toUpperCase().replace(/-/g, " ")}, SUBOPCION: ${e.descripcion}`);
        });
    });

    $("#" + opcion).show();
}

window.setSubsectionOptions = setSubsectionOptions;
