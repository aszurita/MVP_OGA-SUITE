<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Portal Analítica</title>
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
            height: 100dvh;
            width: 100%;
        }

        .btn-portal-analitica {
            position: relative;
            box-shadow: 0 2px 5px 1px rgba(64, 60, 67, .16) !important;
            /* background: white !important; */
            border-radius: 0.75rem !important;
            border: initial;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-width: 0;
            word-wrap: break-word;
            padding: 1.5rem 2rem;
            height: 250px;
            width: 250px;
        }

        .btn-portal-analitica>i {
            font-size: 3rem;
        }

        #data-analytics,
        #voz-colaborador {
            display: none;
        }

        .section-options {
            width: 85% !important;
        }

        .section-options>a {
            height: 150px;
            width: 150px;
        }

        .main-container>section {
            display: flex;
            justify-content: center;
        }

        #btn-section-back,
        #btn-service-back {
            display: none;
            position: absolute;
            border: none;
            background: none;
            font-size: 1.5rem;
            left: 5%;
        }
    </style>

</head>

<body id="app-container" class="menu-default show-spinner" style="padding: 0 !important;">
    <main class="main-container">
        <header class="d-flex w-100 justify-content-center align-items-center" style="position: relative; height: 10%;">
            <button id="btn-section-back" class="d-flex align-items-center justify-content-center">
                <i class="iconsminds-left-1 text-primary"></i>
            </button>
            <h1 class="h1 font-weight-bold" id="section-name">Portal Analítica</h1>
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
        document.write('<script src="js/suite.js?v=' + n + '"> <' + '/' + 'script>');
    </script>
    <script src="js/PortalAnalitica/getOptions.js"></script>
    <script src="js/PortalAnalitica/setMainOptions.js"></script>
    <script src="js/PortalAnalitica/setSubsectionOptions.js"></script>

    <script>

        $(document).ready(function () {
            $("#btn-section-back").css("visibility", "hidden");
            registrar_visita("PORTAL ANALÍTICA") //Autor: Jared Castillo Chiang
            obtenerUsuario();
            setTimeout(setMainOptions, 500);

            $("#btn-section-back").on("click", function () {
                $(".subsection").hide();
                $("#main-section").show();
                $("#section-name").text("Portal Analítica");
                $("#btn-section-back").css("visibility", "hidden");
            });

        });

        const ICONS = {
            servicios: "simple-icon-diamond",
            "geo-analítica": "iconsminds-location-2",
            experimentos: "iconsminds-atom",
            demos: "iconsminds-id-card"
        }

    </script>

</body>

</html>