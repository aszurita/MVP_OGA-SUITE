function loadPermissionsMatrix() {
    console.log("🔄 Cargando matriz de permisos...");

    const employees = getEmpleadosTalentoYCultura();
    tableEmployees = employees;
    let permisosMap = new Map();
    let manuallyAddedUsers = new Set();
    let displayedUsers = new Set();

    const tableContainer = $(".table-container");
    const tableHeader = $("#permissions-header");
    const tableBody = $("#permissions-body");

    tableHeader.empty();
    tableBody.empty();

    tableHeader.append("<th>Usuario</th>");

    const allOptions = getAllOptions("PeopleAnalytics");
    let allOptionsSet = new Set(allOptions.map(option => option.descripcion.toUpperCase()));

    allOptions.forEach(option => {
        let descripcionUpper = option.descripcion.toUpperCase();
        let usuariosConPermiso = option.permisos.map(user => user.toLowerCase());

        if (!permisosMap.has(descripcionUpper)) {
            permisosMap.set(descripcionUpper, new Set());
        }
        usuariosConPermiso.forEach(user => permisosMap.get(descripcionUpper).add(user));
    });

    const primaryColors = ["#d6007b", "#4e4e4e"];
    let colorIndex = 0;
    let colIndex = 1;
    let noSortableIndexes = [0];
    let orderedColumns = [];

    opcionesRelacionadas.forEach((subopciones, opcionPrincipal) => {
        let opcionPrincipalUpper = opcionPrincipal.toUpperCase();
        if (allOptionsSet.has(opcionPrincipalUpper)) {
            let mainColor = primaryColors[colorIndex % 2];
            let subColor = lightenColor(mainColor, 0.09);

            tableHeader.append(`
                <th class="main-option sorting_disabled" style="background-color:${mainColor}; color: white; position: relative; height: 60px; vertical-align: top;">
                    <span style="display: block; font-size: 13px; padding: 6px 6px 0 6px;">${opcionPrincipalUpper}</span>
                    <input type="checkbox" class="header-select-checkbox"
                           data-button="${opcionPrincipalUpper}"
                           style="position: absolute; top: 6px; right: 6px; z-index: 10;">
                </th>
            `);
            
            
            orderedColumns.push(opcionPrincipalUpper);
            noSortableIndexes.push(colIndex++);

            subopciones.forEach(subopcion => {
                let subopcionUpper = subopcion.toUpperCase();
                if (allOptionsSet.has(subopcionUpper)) {
                    tableHeader.append(`
                        <th class="sub-option sorting_disabled" style="background-color:${subColor}; color: white; position: relative; height: 60px; vertical-align: top;">
                            <span style="display: block; font-size: 13px; padding: 6px 6px 0 6px;">${subopcionUpper}</span>
                            <input type="checkbox" class="header-select-checkbox"
                                   data-button="${subopcionUpper}"
                                   style="position: absolute; top: 6px; right: 6px; z-index: 10;">
                        </th>
                    `);
                    
                    
                    orderedColumns.push(subopcionUpper);
                    noSortableIndexes.push(colIndex++);
                }
            });

            colorIndex++;
        }
    });

    let employeesWithPermissions = employees.filter(employee => {
        return [...permisosMap.values()].some(permisos => permisos.has(employee.usuario.toLowerCase()));
    });

    employeesWithPermissions.forEach(employee => {
        if (displayedUsers.has(employee.usuario.toLowerCase())) return;

        let row = `<tr><td>${employee.nombreCompleto} | ${employee.usuario}</td>`;

        orderedColumns.forEach(option => {
            let checked = permisosMap.has(option) && permisosMap.get(option).has(employee.usuario.toLowerCase()) ? "checked" : "";
            row += `<td class='text-center'>
                        <input type='checkbox' class='permission-checkbox' data-user='${employee.usuario.toLowerCase()}' data-button='${option}' ${checked}>
                    </td>`;
        });

        row += `</tr>`;
        tableBody.append(row);
        displayedUsers.add(employee.usuario.toLowerCase());
    });

    initializePermissionsMemory();

    $("#permissions-table").DataTable({
        destroy: true,
        paging: true,
        searching: true,
        scrollX: true,
        order: [],
        columnDefs: [
            { targets: noSortableIndexes, orderable: false }
        ],
        language: {
            search: "Buscar Usuario: ",
            lengthMenu: "Mostrar _MENU_ entradas",
            info: "Mostrando _START_ a _END_ de _TOTAL_ entradas",
            infoEmpty: "Mostrando 0 a 0 de 0 entradas",
            infoFiltered: "(filtrado de _MAX_ entradas totales)",
            loadingRecords: "Cargando...",
            zeroRecords: "No se encontraron registros coincidentes",
            emptyTable: "No hay datos disponibles en la tabla",
            paginate: {
                first: "Primero",
                previous: "Anterior",
                next: "Siguiente",
                last: "Último"
            }
        }
    });

    if ($("#add-user-btn").length === 0) {
        $("#permissions-table_filter label").after('<button id="add-user-btn" class="btn btn-primary ml-2 simple-icon-magnifier-add"></button>');
        $("#add-user-btn").after('<button id="save-permissions" class="btn btn-primary ml-2">Guardar Permisos</button>');
    }

    $('#permissions-table_paginate').css('padding-right', '500px');

    $("#add-user-btn").off("click").on("click", function() {
        let searchValue = $(".dataTables_filter input").val().trim().toLowerCase();
        if (searchValue.length === 0) {
            showNotification("top", "center", "info", "Ingrese un nombre o usuario para agregar.");
            return;
        }

        let foundEmployee = tableEmployees.find(emp =>
            emp.usuario.toLowerCase().includes(searchValue) ||
            emp.nombreCompleto.toLowerCase().includes(searchValue)
        );

        if (!foundEmployee) {
            showNotification("top", "center", "info", "Usuario no encontrado en la lista de empleados.");
            return;
        }

        if (displayedUsers.has(foundEmployee.usuario.toLowerCase()) || manuallyAddedUsers.has(foundEmployee.usuario.toLowerCase())) {
            showNotification("top", "center", "info", "El usuario ya ha sido agregado.");
            return;
        }

        manuallyAddedUsers.add(foundEmployee.usuario.toLowerCase());
        displayedUsers.add(foundEmployee.usuario.toLowerCase());

        let newRow = `<tr><td>${foundEmployee.nombreCompleto} | ${foundEmployee.usuario}</td>`;
        orderedColumns.forEach(option => {
            newRow += `<td class='text-center'>
                        <input type='checkbox' class='permission-checkbox' data-user='${foundEmployee.usuario.toLowerCase()}' data-button='${option}'>
                    </td>`;
        });

        newRow += `</tr>`;
        $("#permissions-table").DataTable().row.add($(newRow)).draw();

        console.log(`✅ Usuario agregado manualmente: ${foundEmployee.nombreCompleto}`);
    });
}


window.loadPermissionsMatrix = loadPermissionsMatrix;
