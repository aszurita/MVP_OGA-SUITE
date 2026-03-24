function setMainOptions() {
    const options = getOptions("PeopleAnalytics", "principal");
    console.log("Opciones principales obtenidas:", options);

    const section = $("#menu-options");
    section.empty();
    section.addClass("d-flex flex-wrap justify-content-center");

    options.forEach((e, index) => {
        const style = index % 2 === 0 ? "btn-primary" : "btn-outline-primary";
        const button = $(`
            <button class='btn-people-analytics btn ${style} m-2' 
                    id='btn-${e.descripcion.toLowerCase().replace(/\s+/g, "-")}' 
                    data-opcion='${e.descripcion.toLowerCase().replace(/\s+/g, "-")}' 
                    data-url='${e.url}' 
                    style='height:200px;width:200px;'>
                <i class='${e.icono}'></i>
                <h2 class='font-weight-bold'>${e.descripcion}</h2>
            </button>`);

        section.append(button);

        button.on("click", function () {
            const opcion = $(this).data("opcion");
            const url = $(this).data("url");

            if (url && url !== "#") {
                window.open(url, "_blank");
            } else {
                $("#main-section").hide();
                $(".subsection").hide();
                $("#section-name").text(e.descripcion);
                $("#btn-section-back").css("visibility", "visible");
                registrar_visita("PEOPLE ANALYTICS", e.descripcion);
                console.log(`SE REGISTRO INTERACCION: PAGINA: PEOPLE ANALYTICS, SUBOPCION:${e.descripcion}`);

                if (opcion === "seguridades") {
                    // Insertar dinámicamente solo si no existe
                    if ($("#seguridades").length === 0) {
                        const seguridadesHTML = `
                            <section id="seguridades" class="subsection">
                                <div class="table-container">
                                    <table id="permissions-table" class="table table-striped table-bordered">
                                        <thead>
                                            <tr id="permissions-header">
                                                <th>Usuario</th>
                                            </tr>
                                        </thead>
                                        <tbody id="permissions-body"></tbody>
                                    </table>
                                </div>
                            </section>`;
                        $(".main-container").append(seguridadesHTML);
                    }
                    $("#seguridades").show();
                    loadPermissionsMatrix();
                } else {
                    // Crear dinámicamente otras subsecciones solo si no existen
                    if ($("#" + opcion).length === 0) {
                        $(".main-container").append(`<section id="${opcion}" class="subsection"><div class="section-options d-flex flex-wrap justify-content-center"></div></section>`);
                    }
                    $("#" + opcion).show();
                    setSubsectionOptions("PeopleAnalytics", opcion);
                }
            }
        });
    });

    $("#permissions-table, #save-permissions").hide();
}

// Modifica también el botón "back" para restablecer correctamente la vista principal
$("#btn-section-back").on("click", function () {
    $(".subsection").hide();
    $("#main-section").show();
    $("#section-name").text("People Analytics");
    $("#btn-section-back").css("visibility", "hidden");
});
