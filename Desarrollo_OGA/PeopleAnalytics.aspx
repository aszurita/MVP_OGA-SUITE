<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>People Analytics</title>
    <link rel="icon" type="image/png" href="img/OGA_icon.png">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

    <link rel="stylesheet" href="font/iconsmind-s/css/iconsminds.css" />
    <link rel="stylesheet" href="font/simple-line-icons/css/simple-line-icons.css" />

    <link rel="stylesheet" href="css/vendor/bootstrap.min.css" />
    <link rel="stylesheet" href="css/vendor/bootstrap.rtl.only.min.css" />
    <link rel="stylesheet" href="css/vendor/select2.min.css" />
    <link rel="stylesheet" href="css/vendor/select2-bootstrap.min.css" />
    <link rel="stylesheet" href="css/vendor/component-custom-switch.min.css" />
    <link rel="stylesheet" href="css/vendor/perfect-scrollbar.css" />

    <link rel="stylesheet" href="css/vendor/dataTables.bootstrap4.min.css" />
    <link rel="stylesheet" href="css/vendor/buttons.bootstrap4.min.css" />
    <link rel="stylesheet" href="css/vendor/dataTables.colResize.css" />

    <link rel="stylesheet" href="css/vendor/select2.min.css" />
    <link rel="stylesheet" href="css/vendor/select2-bootstrap.min.css" />
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">

    <script>
        var n = new Date().getTime();
        document.write('<link href="css/style.css?v=' + n + '" rel="stylesheet" />');
    </script>
    <link rel="stylesheet" href="css/main.css" />
    <link rel="stylesheet" href="css/pagination.css" />
    <style>
        .main-container {
            margin: 0 !important;
            display: flex;
            flex-direction: column;
            height: 100vh;
            width: 100%;
        }

        .btn-people-analytics {
            position: relative;
            box-shadow: 0 2px 5px 1px rgba(64, 60, 67, .16) !important;
            border-radius: 0.75rem !important;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 1.5rem 2rem;
            height: 250px;
            width: 250px;
        }

        .btn-people-analytics>i {
            font-size: 3rem;
        }

        .subsection {
            display: none;
        }

        .section-options {
            width: 85% !important;
        }

        .main-container>section {
            display: flex;
            justify-content: center;
        }

        #btn-section-back {
            visibility: hidden;
            position: absolute;
            border: none;
            background: none;
            font-size: 1.5rem;
            left: 5%;
        }

        .custom-checkbox {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .table-container {
            width: 90%;
            margin: auto;
            overflow-x: auto;
        }

        #permissions-table {
            width: max-content;
            /* Se ajusta al contenido */
            min-width: 90%;
            border-collapse: collapse;
            table-layout: auto;
        }

        #permissions-table thead th {
            position: sticky;
            top: 0;
            background: #d6007b;
            /* Fondo rosa */
            color: white;
            text-align: center;
            vertical-align: middle;
            max-width: 200px;
            /* Limita el ancho del encabezado */
            white-space: nowrap;
            /* Evita que se desborde el texto */
            overflow: hidden;
            text-overflow: ellipsis;
            cursor: ew-resize;
            /* Indica que la columna es redimensionable */
            cursor: col-resize;
            /* Indica que la columna es redimensionable */
            position: relative;
            height: 50px;
            /* Altura del encabezado */
            word-wrap: break-word;
            /* Rompe el texto en palabras */
            white-space: normal;
            /* Permite que el texto haga salto de línea */
        }

        #permissions-table tbody td {
            white-space: nowrap;
            /* Mantiene el texto en una sola línea */
            text-align: center;
        }

        #permissions-table th:first-child,
        #permissions-table td:first-child {
            position: sticky;
            left: 0;
            background: white;
            z-index: 2;
        }

        .resize-handle {
            display: inline-block;
            width: 5px;
            height: 100%;
            background: transparent;
            cursor: ew-resize;
            position: absolute;
            right: 0;
            top: 0;
            cursor: col-resize;
        }

        /* Aplica específicamente a los textos de los encabezados */
        #permissions-table thead th span {
            display: block;
            max-width: 100%;
            font-size: 12px;
            font-weight: bold;
        }

        .header-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
            padding-top: 10px;
            /* Separa el texto del ícono */
        }

        .header-select-all {
            font-size: 16px;
            color: white;
            cursor: pointer;
            position: absolute;
            top: 2%;
            /* Ajuste en la posición */
            right: -36%;
        }

        /* Elimina las flechas de ordenación en la parte inferior derecha */
        .dataTables_wrapper .dataTables_scrollHead th {
            background-image: none !important;
        }
    </style>
</head>

<body class="menu-default show-spinner">
    <main class="main-container">
        <header class="d-flex w-100 justify-content-center align-items-center" style="position: relative; height: 10%;">
            <button id="btn-section-back" class="d-flex align-items-center justify-content-center float-left">
                <i class="iconsminds-left-1 text-primary"></i>
            </button>
            <h1 class="h1 font-weight-bold" id="section-name">People Analytics</h1>
        </header>
        <section id="main-section">
            <div id="menu-options" class="d-flex w-100 justify-content-center" style="gap: 2rem;"></div>
        </section>
    </main>
    <script src="js/vendor/jquery-3.3.1.min.js"></script>
    <script src="js/vendor/select2.full.js"></script>
    <script src="js/vendor/bootstrap.bundle.min.js"></script>
    <script src="js/vendor/perfect-scrollbar.min.js"></script>
    <script src="js/vendor/mousetrap.min.js"></script>
    <script src="js/dore.script.js"></script>
    <script src="js/scripts.single.theme.js"></script>
    <script src="https://d3js.org/d3.v5.min.js"></script>
    <script src="js/jquery.SPServices.v2014-02.min.js"></script>
    <script src="js/vendor/datatables.min.js"></script>
    <script src="js/vendor/buttons.dataTables.min.js"></script>
    <script src="js/vendor/jszip.min.js"></script>
    <script src="js/vendor/buttons.html5.min.js"></script>
    <script src="js/vendor/dataTables.Resize.js"></script>
    <script src="js/vendor/bootstrap-notify.min.js"></script>
    <script src="js/custom-js/xlsx.full.min.js"></script>
    <script src="js/custom-js/html2pdf.bundle.min.js"></script>
    <script src="js/dore-plugins/select.from.library.js"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>
    <script>
        var n = new Date().getTime();
        document.write('<script src="js/suite.js?v=' + n + '"><' + '/' + 'script>');
    </script>
    <script src="js/PeopleAnalytics/initializePermissionsMemory.js"></script>
    <script src="js/PeopleAnalytics/setMainOptions.js"></script>
    <script src="js/PeopleAnalytics/getAllOptions.js"></script>
    <script src="js/PeopleAnalytics/getEmpleadosTalentoYCultura.js"></script>
    <script src="js/PeopleAnalytics/getOptions.js"></script>

    <script src="js/PeopleAnalytics/cargarOpcionesRelacionadas.js"></script>
    <script src="js/PeopleAnalytics/actualizarMemoriaPermisos.js"></script>
    <script src="js/PeopleAnalytics/savePermissions.js"></script>
    <script src="js/PeopleAnalytics/setSubsectionOptions.js"></script>
    <script src="js/PeopleAnalytics/getAllOptionsWithoutFilteringPermissions.js"></script>
    <script src="js/PeopleAnalytics/lightenColor.js"></script>
    <script src="js/PeopleAnalytics/loadPermissionsMatrix.js"></script>
    <script src="js/PeopleAnalytics/handleCheckboxEvents.js"></script>



    <script>
        // Esperamos a que el documento cargue y obtenemos el usuario actual
        $(document).ready(function () {
            registrar_visita("PEOPLE ANALYTICS")
            obtenerUsuario();
            setTimeout(setMainOptions, 500);
            cargarOpcionesRelacionadas();
            $("#btn-section-back").on("click", function () {
                $(".subsection").hide();
                $("#main-section").show();
                $("#section-name").text("People Analytics");
                $("#btn-section-back").css("visibility", "hidden");
            });

        });

        let permisosTemp = new Map(); // Mapa clave-valor { "Botón" -> Set(Usuarios) }

        // Mapa para almacenar las relaciones entre opciones principales y sus subopciones
        let opcionesRelacionadas = new Map();

        // Evento para detectar cambios en los checkboxes
        handleCheckboxEvents();

        // Función de finalización que actualiza la UI después de la actualización en SharePoint
        function finalizePermissionUpdate() {
            console.log("🎉 Todos los cambios fueron guardados correctamente.");
            showNotification("top", "center", "success", "Permisos actualizados exitosamente.");
            initializePermissionsMemory(); // Recargar la memoria con los valores actualizados
            loadPermissionsMatrix(); // Refrescar la matriz de permisos
        }

        // Evento para guardar permisos al hacer clic en el botón
        $(".main-container").on("click", "#save-permissions", savePermissions);

    </script>

</body>

</html>