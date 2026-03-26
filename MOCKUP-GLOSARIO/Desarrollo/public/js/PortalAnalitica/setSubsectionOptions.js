function setSubsectionOptions(menu, opcion) {   //Autor: Jared Castillo Chiang
    const options = getOptions(menu, opcion);
    const section = $("#" + opcion + " .section-options");
    section.empty();

    // Aplicar estilo para contenedor responsive de subopciones
    section.attr("style", "display: flex; flex-wrap: wrap; justify-content: center; gap: 2rem; padding: 1rem;");

    if (options.length === 0) {
        section.append("<p>No hay opciones disponibles</p>");
        return;
    }

    options.forEach((e, index) => {
        const style = index % 2 === 0 ? "btn-primary" : "btn-outline-primary";
        const button = $(`
            <a 
                href='${e.url}' 
                target='_blank' 
                class='btn-portal-analitica btn ${style}' 
                style='flex: 0 1 200px; height: 200px; width: 200px; display: flex; flex-direction: column; align-items: center; justify-content: center;'>
                <i class='${e.icono}' style='font-size: 2.5rem;'></i>
                <h6 class='font-weight-bold text-center mt-2'>${e.descripcion}</h6>
            </a>
        `);

        section.append(button);

        button.on("click", function () {
            registrar_visita(opcion, e.descripcion);
            console.log(`SE REGISTRO INTERACCION:  PAGINA: ${opcion}, SUBOPCION:${e.descripcion}`);
        });
    });

    $("#" + opcion).show();
}

window.setSubsectionOptions = setSubsectionOptions;
