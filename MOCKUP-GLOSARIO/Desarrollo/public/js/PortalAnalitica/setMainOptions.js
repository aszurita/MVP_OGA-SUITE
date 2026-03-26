function setMainOptions() {  // Autor: Jared Castillo Chiang
    const options = getOptions("PortalAnalitica", "principal");
    const section = $("#menu-options");
    section.empty();

    // Asegurar que el contenedor soporte múltiples filas
    section.css({
        display: "flex",
        "flex-wrap": "wrap",
        "justify-content": "center",
        "gap": "2rem",
        "max-width": "100%",
        "padding": "2rem"
    });

    options.forEach((e, index) => {
        const opcionId = e.descripcion.toLowerCase().replace(/\s+/g, "-");

        // Crear sección si no existe
        if ($(`#${opcionId}`).length === 0) {
            const nuevaSeccion = $(`
                <section id="${opcionId}" class="subsection" style="display: none;">
                    <div class="section-options d-flex justify-content-center align-items-center flex-wrap" style="gap: 2rem;"></div>
                </section>
            `);
            $(".main-container").append(nuevaSeccion);
        }

        const style = index % 2 === 0 ? "btn-primary" : "btn-outline-primary";
        const button = $(`
            <button class='btn-portal-analitica btn ${style}' data-opcion='${opcionId}' data-url='${e.url}'>
                <i class='${e.icono}'></i>
                <h2 class='font-weight-bold'>${e.descripcion}</h2>
            </button>
        `);

        section.append(button);

        // Acción del botón
        button.on("click", function () {
            const opcion = $(this).data("opcion");
            const url = $(this).data("url");
            registrar_visita("PORTAL ANALÍTICA", e.descripcion);

            if (url && url !== "#") {
                window.open(url, "_blank");
            } else {
                $(".subsection").hide();
                $("#main-section").hide();
                $(`#${opcion}`).show();
                $("#section-name").text(e.descripcion);
                $("#btn-section-back").css("visibility", "visible");
                setSubsectionOptions("PortalAnalitica", opcion);
            }
        });
    });
}
