function setDataTableUsers(usuarios) {
    // Orden personalizado para la columna Estado
    $.fn.dataTable.ext.order['estado-custom-order'] = function (settings, col) {
        return this.api().column(col, { order: 'index' }).nodes().map(function (td, i) {
            const estado = $(td).text().trim().toUpperCase();

            switch (estado) {
                case 'PENDIENTE': return 1;
                case 'ACTIVO': return 2;
                case 'DESHABILITADO': return 3;
                default: return 99;
            }
        });
    };


    const tableUsers = $('#table-users').DataTable({
        data: usuarios,
        "rowCallback": function (row, data, displayNum, displayIndex) {
            // Verifica la condición y colorea la fila en rojo si se cumple
            if (window.longLocObject[data.codigo] && !window.employeesObject[data.codigo] && window.longLocObject[data.codigo].estado != "DESHABILITADO") {
                $(row).css("background-color", "#FDCFF0");
                $(row).css("color", "#4B4B4B"); // Ajusta el color del texto si es necesario para mejor visibilidad
            }

            $('td:eq(0)', row).html(`<icon class="simple-icon-pencil mr-2" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></icon>\
    <span>${data.estado}</span>\
    <div class="dropdown-menu dropdown-menu-right mt-3">\
        <span  onclick="" class="btn-edit dropdown-item defin" href="#" style="cursor:pointer;">Editar</span>\
        <span  class="btn-aprove dropdown-item defin" href="#" style="cursor:pointer;">Aprobar</span>\
        <span  class="btn-disable dropdown-item defin" href="#" style="cursor:pointer;">Deshabilitar</span>\
        <span  class="btn-ficha dropdown-item defin" href="#" style="cursor:pointer;">Ficha</span>\
    </div>`);

            $(row).find(".btn-edit").off("click").on("click", function () {
                $("#modal-table-users").hide();
                $("#select-user-code").val(data.codigo).data("ui-autocomplete")._trigger("select", null, { item: { label: data.codigo, value: data.codigo } });
            });

            $(row).find(".btn-aprove").off("click").on("click", function () {
                updateDataCitizen({ userCode: data.codigo, valuepairs: [["ESTADO", "ACTIVO"]] });
                redrawDataTable("table-users", getLongLocUsers());
            });

            $(row).find(".btn-disable").off("click").on("click", function () {
                updateDataCitizen({ userCode: data.codigo, valuepairs: [["ESTADO", "DESHABILITADO"]] });
                redrawDataTable("table-users", getLongLocUsers());
            });

            $(row).find(".btn-ficha").off("click").on("click", function () {
                $("#ficha-user-code").text(data.codigo);
                $("#ficha-username").text(data.usuario);
                $("#ficha-name").text(data.nombreCompleto);
                $("#ficha-email").text(data.correo);
                $("#ficha-agency").text(data.localidad);
                $("#ficha-banca").text(data.banca);
                if (window.employeesObject[data.codigo]) {
                    $("#ficha-area").text(data.area + " - " + window.employeesObject[data.codigo].codCentroCosto);
                    $("#ficha-position").text(data.cargo + " - " + window.employeesObject[data.codigo].codCargo);
                } else {
                    $("#ficha-area").text(data.area);
                    $("#ficha-position").text(data.cargo);
                }

                $("#ficha-rol-funcion").text(data.rolFuncion);
                $("#ficha-rol-datos").text(data.rolDatos);
                $("#ficha-skills").html(data.habilidades.split("|").map(skill => `<li>${window.catalogoSkills[skill]}</li>`));
                $("#modal-ficha-usuario").show();
            });
        },


        initComplete: function () {
            let tabla = $("#table-users").DataTable()
            $("#table-users-search").on("keyup", function () {
                tabla.search(this.value).draw();
            })

            $('#table-users').on('init.dt', function () {
                // if ($.fn.DataTable.isDataTable('#amc-table')) {
                const tableUsers = $('#table-users').DataTable();

                $("#dataTablesCopy").on("click", function (event) {
                    event.preventDefault();
                    tableUsers.buttons(0).trigger();
                });

                $("#dataTablesExcel").on("click", function (event) {
                    event.preventDefault();
                    tableUsers.buttons(1).trigger();
                });

                $("#dataTablesCsv").on("click", function (event) {
                    event.preventDefault();
                    tableUsers.buttons(2).trigger();
                });
                // }
            });

        },
        paging: true,
        colResize: {
            isEnabled: true,
            hasBoundCheck: false
        },
        order: [[0, 'asc']],
        lengthChange: true,
        info: true,
        scrollX: true,
        scrollCollapse: true,
        scrollY: 'calc(50vh)',
        autoWidth: false,
        ordering: true,
        // scroller:true,
        searching: true,
        dom: 'fBtlip',
        buttons: [
            'copy',
            'excel',
            'csv',
        ],
        columnDefs: [
            {
                targets: 0, // Índice de la columna "Estado"
                orderDataType: 'estado-custom-order'
            }
        ],
        columns: [
            { data: 'estado', },
            { data: 'area', },
            { data: "cargo", },
            { data: 'localidad', },
            { data: 'usuario' },
            { data: 'codigo' },
            { data: 'nombreCompleto' },
            { data: 'correo' },
            { data: 'fechaIngreso', },
            { data: 'banca', },
            { data: 'rolFuncion', },
            { data: 'habilidades', },
            { data: 'rolDatos', },
        ],
        language: {
            paginate: {
                previous: "<i class='simple-icon-arrow-left'></i>",
                next: "<i class='simple-icon-arrow-right'></i>"
            }
        },
        drawCallback: function () {
            // $(".dataTables_scrollHeadInner").css("width", "100%")
            $("#table-users_paginate").css('font-size', "clamp(.5rem, .75rem, 1.5rem)")
            $("#table-users_length").css('font-size', "clamp(.5rem, .75rem, 1.5rem)")
            $("#table-users_length").css('margin-top', "1rem")
            $("#table-users_info").css('font-size', "clamp(.5rem, .75rem, 1.5rem)")
            $('#table-users').css('font-size', "clamp(.5rem, .75rem, 1.5rem)")
        }
    });

    $(".btn-group").css("display", "none")

    $("#table-users_filter").css("display", "none")
    $("#table-users").addClass("overflow-auto");
}

window.setDataTableUsers = setDataTableUsers;