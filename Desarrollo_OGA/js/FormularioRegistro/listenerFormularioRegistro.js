function listenerFormularioRegistro() {         //Refactorizado por Jared Castillo
    window.catalogoSkills = getCatalogoOGASUITE("12")
    window.catalogoRolFuncion = getCatalogoOGASUITE("14")
    window.catalogoRolDatos = getCatalogoOGASUITE("11")
    window.employees = getEmpleados();
    window.employeesObject = {}
    window.employeesUsernameObject = {}

    window.longLoc = getLongLocUsers()
    window.longLocObject = {}
    window.longLocUsernameObject = {}

    const employeesOptions = [{ id: "", text: "" }]
    const modalSkills = $("#modalSkills")

    window.longLoc.forEach(e => {
        window.longLocObject[e.codigo] = e
        window.longLocUsernameObject[e.usuario.toLowerCase()] = e
    })

    window.employees.forEach(e => {
        // if(!e.centroCosto.toLowerCase().includes("jubilados") && !(e.region || "").toLowerCase().includes("jubilados")){
        if (!e.centroCosto.toLowerCase().includes("jubilados")) {
            window.employeesObject[e.codigo] = e
            window.employeesUsernameObject[e.usuario.toLowerCase()] = e
            employeesOptions.push({ label: e.codigo, value: e.codigo })
        }
    })

    function getUrlParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    function autoFillUserData(userCode) {   //Autor de funcion Jared Castillo
        const user = window.employeesObject[userCode];
        const userLongLoc = window.longLocObject[userCode];

        if (user) {
            $("#select-user-code").val(userCode);
            $("#username-input").val(user.usuario);
            $("#name-input").val(user.nombreCompleto);
            $("#email-input").val(user.correo);
            $("#agency-input").val(user.localidad);
            $("#area-input").val(`${user.codCentroCosto}-${user.centroCosto}`);
            $("#banca-input").val(user.area);
            $("#position-input").val(`${user.codCargo}-${user.cargo}`);

            const userRolFuncion = userLongLoc ? userLongLoc.codigoRolFuncion : "";
            const userRolDatos = userLongLoc ? userLongLoc.codigoRolDatos : "";
            const userSkills = userLongLoc ? userLongLoc.habilidades : "";

            $("#select-rol-funcion").val(userRolFuncion).trigger("change");
            $("#select-rol-datos").val(userRolDatos).trigger("change");

            let skills = userSkills ? userSkills.split("|") : [];
            modalSkills.attr("user-skills", userSkills);
            setUserSkills({ skills });

            if (userLongLoc) {
                $("#btn-register").text("ACTUALIZAR");
            } else {
                $("#btn-register").text("REGISTRAR");
            }
        }
    }

    function clearForm() {
        $("#select-user-code").val("");
        $("#username-input").val("");
        $("#name-input").val("");
        $("#email-input").val("");
        $("#agency-input").val("");
        $("#area-input").val("");
        $("#banca-input").val("");
        $("#position-input").val("");
        $("#select-rol-funcion").val("").trigger("change");
        $("#select-rol-datos").val("").trigger("change");
        modalSkills.attr("user-skills", "");
        setUserSkills({ skills: [] });
        $("#btn-register").text("REGISTRAR");
    }

    // Obtener código de la URL si existe
    const codigoFromUrl = getUrlParameter("codigo");

    $("#select-user-code").autocomplete({
        source: employeesOptions,
        minLength: 2,
        select: function (event, ui) {
            autoFillUserData(ui.item.value);
        }
    }).autocomplete("widget");

    const rolFuncionOptions = Object.entries(window.catalogoRolFuncion).map(([id, text]) => ({ id, text }))
    rolFuncionOptions.unshift({ id: "", text: "" })
    const rolDatosOptions = Object.entries(window.catalogoRolDatos).map(([id, text]) => ({ id, text }))
    rolDatosOptions.unshift({ id: "", text: "" })

    $("#select-rol-funcion").select2({
        theme: "bootstrap",
        placeholder: "",
        maximumSelectionSize: 6,
        containerCssClass: ":all:",
        data: rolFuncionOptions,
    }).on("select2:select", function (event) {
        const valorSeleccionado = event.params.data.id;
        const labelRolFuncion = event.params.data.text;
        if (!modalSkills.attr("user-skills") || !modalSkills.attr("user-skills").split("|").includes("-1")) {
            const skillSuggestions = getSkillSuggestions({ rolFuncion: labelRolFuncion })
            setUserSkills({ skills: skillSuggestions })
            modalSkills.attr("user-skills", skillSuggestions.join("|"))
        }
        $("section-permissions").attr("amc-id")
    });

    $("#select-rol-datos").select2({
        theme: "bootstrap",
        placeholder: "",
        maximumSelectionSize: 6,
        containerCssClass: ":all:",
        data: rolDatosOptions,
        minimumResultsForSearch: Infinity,
    });
    $("#select-user-code").autocomplete({
        source: employeesOptions,
        minLength: 2,
        select: function (event, ui) {
            const userCode = ui.item.value
            const user = window.employeesObject[userCode]
            const userLongLoc = window.longLocObject[userCode]
            $("#username-input").val(user.usuario)
            $("#name-input").val(user.nombreCompleto)
            $("#email-input").val(user.correo)
            $("#agency-input").val(user.localidad)
            $("#area-input").val(`${user.codCentroCosto}-${user.centroCosto}`)
            $("#banca-input").val(user.area)
            $("#position-input").val(`${user.codCargo}-${user.cargo}`)
            const userRolFuncion = userLongLoc ? userLongLoc.codigoRolFuncion : ""
            const userRolDatos = userLongLoc ? userLongLoc.codigoRolDatos : ""
            const userSkills = userLongLoc ? userLongLoc.habilidades : ""
            $("#select-rol-funcion").val(userRolFuncion).trigger("change")
            $("#select-rol-datos").val(userRolDatos).trigger("change")
            let skills = userSkills ? userSkills.split("|") : []
            const btnAddSkill = $("#btn-add-skill")
            modalSkills.attr("user-skills", userSkills)
            setUserSkills({ skills })
            if (userLongLoc) $("#btn-register").text("ACTUALIZAR")
            else $("#btn-register").text("REGISTRAR")
        }
    }).autocomplete("widget")

    $("#btn-add-skill").on("click", function () {
        $(".checkbox-skill").prop("checked", false)
        const currentSkills = (modalSkills.attr("user-skills") || "").split("|")
        currentSkills.forEach(e => {
            $(`#skill-${e}`).prop("checked", true)
        })

        modalSkills.show()
    })

    $("#btn-cancel-skills").on("click", function () {
        const currentSkills = (modalSkills.attr("user-skills") || "").split("|")
        // Se verifica que los skills seleccionados que no se encuentren en la lista de skills del usuario se desmarquen al cancelar
        Array.from($(".checkbox-skill")).forEach(e => {
            if (!currentSkills.includes(e) && e.checked) e.click()
        })
        modalSkills.hide()
    })

    $("#btn-save-skills").on("click", function () {
        // Obtengo todos los skills que han sido seleccionados
        const checkedSkills = Array.from($(".checkbox-skill")).filter(e => e.checked).map(e => e.id.split("-")[1])
        // Guardo las skills seleccionadas en el atributo del modal cuando se guarda
        setUserSkills({ skills: checkedSkills })
        modalSkills.attr("user-skills", checkedSkills.join("|"))
        modalSkills.hide()
    })

    setSkills(Object.entries(window.catalogoSkills))

    $("#btn-table-users").on("click", function () {
        $("#modal-table-users").show()
    })
    $("#btn-close-modal-users").on("click", function () {
        $("#modal-table-users").hide()
    })
    $("#btn-close-skills").on("click", function () {
        $("#modalSkills").hide()
    })

    $("#btn-close-ficha-usuario").on("click", function () {
        $("#modal-ficha-usuario").hide()
    })

    $(".checkbox-item").off("click").on("click", function (event) {
        const checkbox = $(this).find("input");
        checkbox.click();
        event.stopPropagation();
    })

    function gestionarBusquedaCheckboxes() {
        const $search = $("#search-skill");
        const $selectAll = $("#select-all-skills");
        const $checkboxItems = $(".checkbox-item");
        const $checkboxSkills = $(".checkbox-skill");

        // Función para actualizar el estado de "Seleccionar todos"
        function actualizarSelectAll() {
            const visibles = $(".checkbox-item:visible .checkbox-skill");
            const seleccionados = visibles.filter(":checked");
            $selectAll.prop("checked", visibles.length > 0 && visibles.length === seleccionados.length);
        }

        // Evento para "Seleccionar todos"
        $selectAll.on("change", function () {
            $(".checkbox-item:visible .checkbox-skill").prop("checked", this.checked);
        });

        // Evento para checkboxes individuales
        $checkboxItems.on("change", ".checkbox-skill", actualizarSelectAll);

        // Función de búsqueda con debounce
        let debounceTimer;
        $search.on("input", function () {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                const filtro = $(this).val().toLowerCase();
                if (filtro === "") {
                    $checkboxItems.show();  // Mostrar todos cuando se borra el filtro
                } else {
                    $checkboxItems.each(function () {
                        const label = $(this).data("label").toLowerCase();
                        $(this).toggle(label.includes(filtro)); // Usamos toggle correctamente
                    });
                }
                actualizarSelectAll();  // Actualiza el estado de "Seleccionar todos"
            }, 200);
        });
        $(".checkbox-skill").off("click").on("click", function (event) {
            event.stopPropagation(); // Evita activación accidental por el div padre

            // Si alguno se desmarca, desmarcar "Seleccionar todos"
            if (!$(this).prop("checked")) {
                $("#select-all-skills").prop("checked", false);
            } else {
                // Si todos están marcados, activar "Seleccionar todos"
                if ($(".checkbox-skill:checked").length === $(".checkbox-skill").length) {
                    $("#select-all-skills").prop("checked", true);
                }
            }
        });
    }

    // Llamamos a la función para inicializar todo
    gestionarBusquedaCheckboxes();

    $("#btn-register").on("click", function () {
        const userCode = $("#select-user-code").val();
        const employee = window.employeesObject[userCode];
        const userSkills = modalSkills.attr("user-skills");
        const rolFuncion = $("#select-rol-funcion").val();
        const rolDatos = $("#select-rol-datos").val();
        console.log("rol datos seleccionado", rolDatos)
        const formattedDate = employee && employee.fecha_ingreso ? formatDate(new Date(employee.fecha_ingreso), true) : "";

        // Verificar si los campos obligatorios están vacíos
        if (!userCode || !employee || !rolFuncion || !rolDatos) {
            showNotification("top", "center", "danger", "Todos los campos son obligatorios. Complete la información antes de registrar.", 3000);
            return; // Evita continuar con el registro
        }

        // Verificar la selección de habilidades si Rol Datos es "DataCitizen"
        if (rolDatos === "1" && userSkills.trim() === "") {
            showNotification("top", "center", "danger", "Debe seleccionar al menos una habilidad para registrar un DataCitizen.", 3000);
            return;
        }
        

        if (!window.longLocObject[userCode]) {
            $().SPServices({
                operation: "UpdateListItems",
                async: false,
                batchCmd: "New",
                listName: "LONG_LOC_MODEL_ART",
                valuepairs: [
                    ["trans_id", "1"],
                    ["trans_nombre", "NONE"],
                    ["trans_nombre_tab", "EMPLEADOS"],
                    ["valor1", employee.centroCosto],
                    ["valor2", employee.cargo],
                    ["valor3", employee.localidad],
                    ["valor4", employee.codigo],
                    ["valor5", employee.nombres],
                    ["valor6", employee.apellido_paternal],
                    ["valor7", employee.apellido_maternal],
                    ["valor8", employee.correo],
                    ["valor9", formattedDate],
                    ["valor10", employee.area],
                    ["valor11", window.catalogoRolFuncion[rolFuncion] || rolFuncion],
                    ["valor12", userSkills],
                    ["valor13", window.catalogoRolDatos[rolDatos] || rolDatos],
                    ["CODIGO_ROL_FUNCION", rolFuncion],
                    ["CODIGO_ROL_DATOS", rolDatos],
                    ["ESTADO", "PENDIENTE"],
                ],
                completefunc: function (xData, Status) {
                    showNotification("top", "center", "success", "Se ha guardado el registro correctamente.", 1500);
                    let br = "&lt;br&gt;";
                    let datosUsuario = obtenerUsuario();
                    const formregLink = `${BASE_URL}FormularioRegistro.aspx?codigo=${employee.codigo}`;
                    escribirListaCorreo(
                        `${employee.usuario}&nsaltos`,
                        "jcastillo3",
                        "Autorización de acceso a Oga Suite",
                        `El usuario con la siguiente información ha solicitado acceso a Oga Suite:${br}
                        Informacion del Colaborador:${br}
                        Codigo: ${employee.codigo}${br}
                        Usuario: ${employee.usuario}${br}
                        Nombre Colaborador: ${employee.nombreCompleto}${br}
                        Correo: ${employee.correo}${br}
                        Agencia: ${employee.localidad}${br}
                        Banca: ${employee.area}${br}
                        Centro de Costo: ${employee.codCentroCosto} - ${employee.centroCosto}${br}
                        Cargo: ${employee.codCargo} - ${employee.cargo}${br}
                        Rol Funcion: ${window.catalogoRolFuncion[rolFuncion]}${br}
                        Rol Datos: ${window.catalogoRolDatos[rolDatos]}${br}${br}
                        Para acceder al Formulario de Registro de un click en el siguiente &lt;a href=&quot;${formregLink}&quot; target=&quot;_blank&quot;&gt;link&lt;/a&gt;|N${br}
                        ${br}Por favor tomar contacto con el usuario para solventar su pedido.${br}Saludos
                        ${br}
                        `
                    );

                    window.longLocObject[userCode] = { codigo: userCode, habilidades: userSkills, codigoRolDatos: rolDatos, codigoRolFuncion: rolFuncion };
                    redrawDataTable("table-users", getLongLocUsers());
                    $("#select-user-code").val(userCode).data("ui-autocomplete")._trigger("select", null, { item: { label: userCode, value: userCode } });
                },
            });
        } else {
            const newValuePairs = [
                ["valor1", employee.centroCosto],
                ["valor2", employee.cargo],
                ["valor3", employee.localidad],
                ["valor5", employee.nombres],
                ["valor6", employee.apellido_paternal],
                ["valor7", employee.apellido_maternal],
                ["valor8", employee.correo],
                ["valor9", formattedDate],
                ["valor10", employee.area],
                ["valor11", window.catalogoRolFuncion[rolFuncion] || rolFuncion],
                ["valor13", window.catalogoRolDatos[rolDatos] || rolDatos],
                ["CODIGO_ROL_FUNCION", rolFuncion],
                ["CODIGO_ROL_DATOS", rolDatos],
                ["valor12", userSkills],
            ];

            $().SPServices.SPUpdateMultipleListItems({
                async: true,
                listName: "LONG_LOC_MODEL_ART",
                batchCmd: "Update",
                CAMLQuery: `<Query><Where><Eq><FieldRef Name="valor4"/><Value Type="Text">${userCode}</Value></Eq></Where></Query>`,
                valuepairs: newValuePairs,
                completefunc: function (xData, Status) {
                    showNotification("top", "center", "success", "Se ha actualizado el registro.", 1500);
                    redrawDataTable("table-users", getLongLocUsers());
                },
            });
        }

        $("#select-all-skills").prop("checked", false);
    });


    if (isOGA() || window.current_user === "nsaltos" || window.current_user === "ccuenca" || window.current_user === "jcastillo3" || window.current_user === "jsalas" || window.current_user === "vvalencia1" || window.current_user === "VVALENCIA1") {
        // Si es de OGA mostrar todas las opciones de administración
        $("#label-user-code").css("background-color", "#fff")
        $("#select-user-code").prop("disabled", false)
        $("#btn-table-users").show()
        if (codigoFromUrl ) {
            autoFillUserData(codigoFromUrl);
        } else {
            clearForm(); // Si no hay código en la URL, limpiar formulario
        }
    } else {
        $("#btn-table-users").hide()
        $("#select-user-code").css("border", "none")
        $("#label-user-code").css("background-color", "transparent")
        const code = window.employeesUsernameObject[window.current_user].codigo
        $("#select-user-code").val(code).data("ui-autocomplete")._trigger("select", null, { item: { label: code, value: code } });
    }
    $(".form-control:disabled").css("border", "none")

    

}

window.listenerFormularioRegistro = listenerFormularioRegistro;