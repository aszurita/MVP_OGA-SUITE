<!DOCTYPE html>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls"
    Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
    <html lang="en" xmlns:mso="urn:schemas-microsoft-com:office:office"
        xmlns:msdt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882">

    <%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls"
        Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

        <head>
            <meta charset="UTF-8">
            <title>Validador Modelos </title>
            <link rel="icon" type="image/png" href="img/OGA_icon.png">
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

            <link rel="stylesheet" href="font/iconsmind-s/css/iconsminds.css" />
            <link rel="stylesheet" href="font/simple-line-icons/css/simple-line-icons.css" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

            <link rel="stylesheet" href="css/vendor/bootstrap.min.css" />
            <link rel="stylesheet" href="css/vendor/bootstrap.rtl.only.min.css" />
            <link rel="stylesheet" href="css/vendor/component-custom-switch.min.css" />
            <link rel="stylesheet" href="css/vendor/perfect-scrollbar.css" />
            <link rel="stylesheet" href="css/vendor/dataTables.colResize.css" />
            <link rel="stylesheet" href="css/vendor/dataTables.bootstrap4.min.css" />
            <script>
                var n = new Date().getTime();
                document.write('<link href="css/style.css?v=' + n + '" rel="stylesheet" />');
            </script>
            <script>
                (function () {
                    var hoy = new Date();
                    var inicioNavidad = new Date(hoy.getFullYear(), 10, 1); // diciembre = 11 (0-based)
                    window.usarLogoNavidad = hoy >= inicioNavidad;
                })();
            </script>
            <script>
                var n = new Date().getTime();
                document.write('<link href="js/Validador_Modelos/style/style-validador-modelos.css?v=' + n + '" rel="stylesheet" />');
            </script>

            <script>
                window.__initFromURLDone = false;
            </script>

            <link rel="stylesheet" href="css/main.css" />
            <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">

            <script src="js/vendor/jquery-3.3.1.min.js"></script>

            <style>
                /* Ejemplo para la librerí­a Select2 */
                .select2 {
                    max-width: 88%;
                }

                /* switch-lg  25 % más ancho/alto */
                .switch-lg .custom-control-input~.custom-control-label::before,
                .switch-lg .custom-control-input~.custom-control-label::after {
                    transform: scale(1.25);
                }

                /* Botón magenta reutilizable */
                .btn-magenta {
                    background-color: #D2006E !important;
                    border-color: #D2006E !important;
                    color: #fff !important;
                    padding: .25rem .7rem;
                    border-radius: .35rem;
                    font-weight: 500;
                    transition: background-color .15s ease-in-out;
                }

                .btn-magenta:hover,
                .btn-magenta:focus {
                    background-color: #b4005c !important;
                    /* un magenta un poco más oscuro */
                    border-color: #b4005c !important;
                    color: #fff !important;
                    text-decoration: none;
                }

                /* Íconos dentro del botón  blancos */
                .btn-magenta .simple-icon-notebook {
                    font-size: 1.1rem;
                    color: #fff;
                    line-height: 1;
                }
            </style>
        </head>

        <body id="app-container" class="menu-default show-spinner">
            <nav class="navbar fixed-top">
                <div class="d-flex align-items-center navbar-left">
                    <a href="#" class="menu-button d-none d-md-block">
                        <svg class="main" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 17">
                            <rect x="0.48" y="0.5" width="7" height="1" />
                            <rect x="0.48" y="7.5" width="7" height="1" />
                            <rect x="0.48" y="15.5" width="7" height="1" />
                        </svg>
                        <svg class="sub" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 17">
                            <rect x="1.56" y="0.5" width="16" height="1" />
                            <rect x="1.56" y="7.5" width="16" height="1" />
                            <rect x="1.56" y="15.5" width="16" height="1" />
                        </svg>
                    </a>

                    <a href="#" class="menu-button-mobile d-xs-block d-sm-block d-md-none">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 17">
                            <rect x="0.5" y="0.5" width="25" height="1" />
                            <rect x="0.5" y="7.5" width="25" height="1" />
                            <rect x="0.5" y="15.5" width="25" height="1" />
                        </svg>
                    </a>

                    <div class="search" data-search-path="Pages.Search.html?q=">
                        <input placeholder="Search...">
                        <span class="search-icon">
                            <i class="simple-icon-magnifier"></i>
                        </span>
                    </div>
                </div>


                <a class="navbar-logo" href="OGASuite.aspx">
                    <img id="logo-navbar" class="logo logo--invert d-none d-xs-block" src="logos/oga_color.png" data-logo-default="logos/oga_color.png" data-logo-navidad="logos/oga_navidad.png">
                    <img class="logo-mobile d-block d-xs-none" src="logos/OGA_icon.png">
            <div id="contenedor-nieve"></div>
                </a>
                <script>
                    (function () {
                        var usarLogoNavidad = window.usarLogoNavidad === true;
                        var logoNavbar = document.getElementById('logo-navbar');
                        if (!logoNavbar) return;
                        var logoDefault = logoNavbar.getAttribute('data-logo-default') || logoNavbar.src;
                        var logoNavidad = logoNavbar.getAttribute('data-logo-navidad') || logoDefault;
                        logoNavbar.src = usarLogoNavidad ? logoNavidad : logoDefault;
                        if (usarLogoNavidad) {
                            logoNavbar.classList.remove('logo--invert');
                            logoNavbar.classList.add('logo--navidad-large');
                        } else {
                            logoNavbar.classList.add('logo--invert');
                            logoNavbar.classList.remove('logo--navidad-large');
                        }
                    })();
                </script>

                <div class="navbar-right">
                    <div class="header-icons d-inline-block align-middle">

                        <div class="position-relative d-none d-sm-inline-block">
                            <button class="header-icon btn btn-empty" type="button" id="iconMenuButton"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i class="simple-icon-grid"></i>
                            </button>
                            <div class="dropdown-menu dropdown-menu-right mt-3  position-absolute"
                                id="iconMenuDropdown">
                                <a href="http://vamos.bancoguayaquil.com/sitios/informaciongerencial/Paginas/ANALYTICS/Marlon%20Z/PAGINAS/COMUNIDAD_ANALITICA/index.aspx"
                                    class="icon-menu-item quicklinks">
                                    <img src="img/datahub.png" alt="Logo DataHub">
                                    <span>Data Hub</span>
                                </a>

                                <a href="#" class="icon-menu-item">
                                    <i class="iconsminds-male-female d-block"></i>
                                    <span>Users</span>
                                </a>

                                <a href="#" class="icon-menu-item">
                                    <i class="iconsminds-puzzle d-block"></i>
                                    <span>Components</span>
                                </a>

                                <a href="#" class="icon-menu-item">
                                    <i class="iconsminds-bar-chart-4 d-block"></i>
                                    <span>Profits</span>
                                </a>

                                <a href="#" class="icon-menu-item">
                                    <i class="iconsminds-file d-block"></i>
                                    <span>Surveys</span>
                                </a>

                                <a href="#" class="icon-menu-item">
                                    <i class="iconsminds-suitcase d-block"></i>
                                    <span>Tasks</span>
                                </a>

                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div class="menu">
                <div class="main-menu">
                    <div class="scroll">
                        <ul class="list-unstyled" id="suite-navbar">
                            <li>
                                <a href="SobreOGA.aspx">
                                    <i class="simple-icon-question"></i>
                                    <span>Acerca de Nosotros</span>
                                </a>
                            </li>
                            <li>
                                <a href="PoliticasProcedimientos.aspx">
                                    <i class="iconsminds-letter-open"></i>
                                    <span>Polí­ticas y Procedimientos</span>
                                </a>
                            </li>
                            <li>
                                <a href="LibroDominios.aspx">
                                    <i class="iconsminds-library"></i>
                                    <span>Libro de Dominios</span>
                                </a>
                            </li>
                            <li>
                                <a href="Glosario.aspx">
                                    <i class="iconsminds-diploma-2"></i>
                                    <span>Glosario de Términos</span>
                                </a>
                            </li>
                            <li>
                                <a href="IndicadoresGestion.aspx">
                                    <i class="iconsminds-line-chart-1"></i>
                                    <span>Indicadores de Gestión</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="sub-menu">
                    <div class="scroll">
                        <div id="sub-menu-suite">

                        </div>
                        <div class="ps__rail-x" style="left: 0px; bottom: 0px;">
                            <div class="ps__thumb-x" tabindex="0" style="left: 0px; width: 0px;"></div>
                        </div>
                        <div class="ps__rail-y" style="top: 0px; right: 0px;">
                            <div class="ps__thumb-y" tabindex="0" style="top: 0px; height: 0px;"></div>
                        </div>
                    </div>
                </div>
            </div>

            <main>
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-12" style="padding:10px">
                            <!-- <i class="simple-icon-arrow-left-circle m-1 regresar" onclick="history.back()"></i> -->
                            <h1 style="padding-left:0">Validador de Modelos</h1>

                            <!-- Contenedor con dos grupos alineados en una fila -->
                            <style>
                                .btn-validacion-ui {
                                    background-color: #FFFFFF !important;
                                    border: none !important;
                                    box-shadow: none !important;
                                    height: 40px;
                                    width: 40px;
                                    padding: 0;
                                    border-radius: 8px;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    transition: background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
                                    cursor: pointer;
                                }

                                .btn-validacion-ui i {
                                    font-size: 20px;
                                    color: #B4005C;
                                    transition: color 0.2s ease;
                                }

                                /* Hover y focus sólo si está habilitado */
                                .btn-validacion-ui:not(:disabled):hover,
                                .btn-validacion-ui:not(:disabled):focus-visible {
                                    background-color: #B4005C !important;
                                    box-shadow: 0 0 6px rgba(180, 0, 92, 0.3);
                                }

                                .btn-validacion-ui:not(:disabled):hover i,
                                .btn-validacion-ui:not(:disabled):focus-visible i {
                                    color: #FFFFFF !important;
                                }

                                /* Cuando está deshabilitado: sin cursor especial, sin hover, sin sombra */
                                .btn-validacion-ui:disabled {
                                    opacity: 0.5;
                                    cursor: default !important;
                                    pointer-events: none;
                                }

                                /* Card coloreable por semáforo */
                                .card-score {
                                    border: 1px solid #e0e0e0;
                                    transition: background-color .2s ease, border-color .2s ease, color .2s ease;
                                }

                                .card-score .card-title {
                                    margin-bottom: 8px;
                                }

                                .card-score .score-value {
                                    font-weight: 700;
                                }

                                /* Estados (86-100 verde, 71-85 amarillo, 50-70 naranja, <50 rojo) */
                                .card-score.status-verde {
                                    background: #eaf6ee !important;
                                    border-color: #cde9d6;
                                    color: #1b3d2c;
                                }

                                .card-score.status-amarillo {
                                    background: #fff9e1 !important;
                                    border-color: #f3e6a4;
                                    color: #4d3c00;
                                }

                                .card-score.status-naranja {
                                    background: #fff2e6 !important;
                                    border-color: #ffd1a6;
                                    color: #5a2e00;
                                }

                                .card-score.status-rojo {
                                    background: #ffe9e9 !important;
                                    border-color: #f6bcbc;
                                    color: #5a0c0c;
                                }

                                /* Asegura contraste del tí­tulo y el valor */
                                .card-score.status-verde .card-title,
                                .card-score.status-amarillo.card-title,
                                .card-score.status-naranja .card-title,
                                .card-score.status-rojo .card-title,
                                .card-score .score-value {
                                    color: inherit !important;
                                }
                            </style>






                            <div
                                style="display: flex; justify-content: space-between; align-items: center; padding: 0 8px;">
                                <!-- Grupo izquierdo -->
                                <div style="display: flex; gap: 15px;">
                                    <button id="btnValidacionesInfo" class="btn-validacion-ui"
                                        title="Ver todas las validaciones">
                                        <i class="simple-icon-notebook"></i>
                                    </button>

                                    <button id="btnNuevaValidacion" class="btn-validacion-ui"
                                        title="Iniciar una nueva validación" disabled>
                                        <i class="simple-icon-plus"></i>
                                    </button>
                                </div>

                                <!-- Grupo derecho -->
                                <div style="display: flex; gap: 10px;">
                                    <button id="guardarValidacionBtn" class="btn-validacion-ui"
                                        title="Guardar esta validación">
                                        <i class="fas fa-save"></i>
                                    </button>

                                    <button id="btnDescartarCambios" class="btn-validacion-ui"
                                        title="Descartar todos los cambios">
                                        <i class="simple-icon-trash"></i>
                                    </button>

                                    <button id="btnBloquearValidacion" class="btn-validacion-ui"
                                        title="Validación editable (click para bloquear)">
                                        <i class="simple-icon-lock-open"></i>
                                    </button>

                                    <button id="btnAprobaciónCierre" class="btn-validacion-ui" title="Aprobación de cierre"
                                        style="display: none;">
                                        <i class="fas fa-file-signature"></i>
                                    </button>

                                    <button id="btnImprimir" class="btn-validacion-ui" title="Imprimir validación">
                                        <i class="simple-icon-printer"></i>
                                    </button>
                                    <button id="btnCopiarLink" class="btn-validacion-ui"
                                        title="Copiar link de esta validacion">
                                        <i class="fas fa-link"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div class="row pl-3">
                        <div class="col-lg-4 col-12 mb-4" style=" display: flex; flex-direction: column;">
                            <!-- ðŸ”½ ComboBox de selección de modelo -->
                            <div class="card" style="margin-bottom: 15px;">
                                <div class="card-body">
                                    <label for="modeloSelect" class="form-label font-weight-bold">Selecciona un
                                        Modelo:</label>

                                    <div class="d-flex align-items-center">

                                        <select id="modeloSelect" class="form-control min-w-0">
                                            <option value="" disabled selected>ðŸ“„ Selecciona un modelo...</option>
                                        </select>

                                    </div>
                                </div>
                            </div>

                            <style>
                                .modelo-box {
                                    display: inline-block;
                                    padding: 6px 10px;
                                    border: 1px solid #e1e4ea;
                                    border-radius: 0;
                                    /* recto */
                                    background: #f7f8fa;
                                    font-weight: 600;
                                    color: #333;
                                    white-space: normal;
                                    /* permite salto de lí­nea */
                                    line-height: 1.4;
                                    max-width: 100%;
                                    word-break: break-word;
                                }
                            </style>



                            <script>
                                // Espera a que el option esté cargado (si llenas el select de forma así­ncrona)
                                function esperarOpcionModelo(codigo, { intentos = 20, cadaMs = 150 } = {}) {
                                    return new Promise(res => {
                                        let i = 0;
                                        const step = () => {
                                            const $opt = $("#modeloSelect option[value='" + codigo + "']");
                                            if ($opt.length) { res($opt.text().trim() || codigo); }
                                            else if (++i >= intentos) { res(codigo); }
                                            else { setTimeout(step, cadaMs); }
                                        };
                                        step();
                                    });
                                }

                                window.__bootFromURL = false;

                                // Espera a que exista el option
                                function esperarOpcionModelo(codigo, { intentos = 20, cadaMs = 150 } = {}) {
                                    return new Promise(res => {
                                        let i = 0;
                                        (function step() {
                                            const $opt = $("#modeloSelect option[value='" + codigo + "']");
                                            if ($opt.length) return res($opt.text().trim() || codigo);
                                            if (++i >= intentos) return res(codigo);
                                            setTimeout(step, cadaMs);
                                        })();
                                    });
                                }

                                async function aplicarModeloDeURL_yReemplazarSelect() {
                                    const qs = new URLSearchParams(window.location.search);
                                    const modeloQS = (qs.get("modelo") || "").trim();
                                    const idValidacionQS = (qs.get("id_validacion") || "").trim() || null;
                                    if (!modeloQS) return;

                                    // evita correr dos veces
                                    if (window.__bootFromURL) return;
                                    window.__bootFromURL = true;

                                    // Selecciona el modelo en el <select> y lo deshabilita (NO lo reemplaza)
                                    $("#modeloSelect").val(modeloQS).prop("disabled", true);
                                    const nombreModelo = await esperarOpcionModelo(modeloQS);

                                    // muestra el nombre al lado
                                    //$("label[for='modeloSelect']").text("Modelo seleccionado:");
                                    //const $labelRow = $("#modeloSelect").closest(".d-flex");
                                    //if ($labelRow.length && !$("#modeloDisplay").length) {
                                    //    $labelRow.append(`<div id="modeloDisplay" class="modelo-box" title="${nombreModelo}" style="margin-left:8px;">${nombreModelo}</div>`);
                                    //}

                                    // Dispara el flujo principal una sola vez
                                    if (typeof procesarModeloSeleccionado === "function") {
                                        procesarModeloSeleccionado(modeloQS, idValidacionQS);
                                    } else {
                                        console.warn("procesarModeloSeleccionado no está aún disponible");
                                    }
                                }

                                // Ejecutar al cargar
                                if (document.readyState === "loading") {
                                    document.addEventListener("DOMContentLoaded", aplicarModeloDeURL_yReemplazarSelect);
                                } else {
                                    aplicarModeloDeURL_yReemplazarSelect();
                                }
                            </script>

                            <!-- ðŸ”½ CARD DE SCORE FINAL -->
                            <div class="row">
                                <div class="col-12 mb-3">
                                    <!-- Card Score Final (arriba) -->
                                    <div class="card h-100 card-score">
                                        <div class="card-body p-2 text-center d-flex flex-column align-items-center">
                                            <h5 class="card-title mb-2" style="font-size:25px;">Score Final</h5>
                                            <span id="score-final-label" class="font-weight-bold score-value"
                                                style="font-size:1.5rem;">0.00%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <style>
                                .modal-aprobacion-backdrop {
                                    position: fixed;
                                    inset: 0;
                                    background: rgba(0, 0, 0, .5);
                                    backdrop-filter: blur(4px);
                                    z-index: 1050;
                                    opacity: 0;
                                    transition: opacity .2s ease-in-out;
                                }

                                .modal-aprobacion-backdrop.show {
                                    opacity: 1;
                                }

                                .modal-aprobacion {
                                    position: fixed;
                                    top: 50%;
                                    left: 50%;
                                    transform: translate(-50%, -50%) scale(0.95);
                                    z-index: 1051;
                                    width: 90%;
                                    max-width: 550px;
                                    background: #fff;
                                    border-radius: 12px;
                                    box-shadow: 0 8px 30px rgba(0, 0, 0, .2);
                                    display: flex;
                                    flex-direction: column;
                                    opacity: 0;
                                    transition: opacity .2s ease-in-out, transform .2s ease-in-out;
                                }

                                .modal-aprobacion.show {
                                    opacity: 1;
                                    transform: translate(-50%, -50%) scale(1);
                                }

                                .modal-aprobacion-header {
                                    padding: 12px 16px;
                                    border-bottom: 1px solid #dee2e6;
                                    display: flex;
                                    align-items: center;
                                    justify-content: space-between;
                                }

                                .modal-aprobacion-header h5 {
                                    margin: 0;
                                    font-weight: 600;
                                    font-size: 1.2rem;
                                    color: #343a40;
                                }

                                .modal-aprobacion-body {
                                    padding: 16px;
                                    flex-grow: 1;
                                }

                                .modal-aprobacion-body p {
                                    margin-top: 0;
                                    margin-bottom: 1.5rem;
                                    color: #495057;
                                }

                                .modal-aprobacion-body label {
                                    font-weight: 500;
                                    margin-bottom: 8px;
                                    color: #343a40;
                                }

                                .modal-aprobacion-body textarea {
                                    resize: vertical;
                                    min-height: 100px;
                                }

                                .modal-aprobacion-footer {
                                    padding: 12px 16px;
                                    border-top: 1px solid #dee2e6;
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: center;
                                    gap: 12px;
                                }

                                .modal-aprobacion-actions {
                                    display: flex;
                                    gap: 12px;
                                }
                            </style>

                            <div id="modalConfirmarAprobacion" style="display: none;">
                                <div class="modal-aprobacion-backdrop"></div>
                                <div class="modal-aprobacion" role="dialog">
                                    <div class="modal-aprobacion-header">
                                        <h5>Confirmar Cierre de Validación</h5>
                                    </div>
                                    <div class="modal-aprobacion-body">
                                        <p>¿Seguro de cerrar la validación?</p>
                                        <p class="text-muted mb-1">Solo el sponsor del modelo puede aprobar el cierre.</p>
                                        <p class="text-muted mb-0">Sponsor: <span id="sponsor-cierre">-</span></p>
                                    </div>
                                    <div class="modal-aprobacion-footer">
                                        <button type="button" class="btn btn-outline-secondary btn-ver-reporte-aprobacion">Ver reporte</button>
                                        <div class="modal-aprobacion-actions">
                                            <button type="button" class="btn btn-light" id="btnCancelarCierre">Cancelar</button>
                                            <button type="button" class="btn btn-magenta" id="btnConfirmarCierre">Aprobar</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Modal de aprobación con observación -->
                            <div id="modalAprobacionFinal" style="display: none;">
                                <div class="modal-aprobacion-backdrop"></div>
                                <div class="modal-aprobacion" role="dialog">
                                    <div class="modal-aprobacion-header">
                                    <h5>Confirmar Aprobación</h5>
                                    </div>
                                    <div class="modal-aprobacion-body">
                                        <p>Estás a punto de aprobar este modelo.</p>
                                        <label for="observacionesCierre">Observaciones Finales (Opcional):</label>
                                        <textarea id="observacionesCierre" class="form-control" placeholder="Añade un comentario final si es necesario..."></textarea>
                                    </div>
                                    <div class="modal-aprobacion-footer">
                                        <button type="button" class="btn btn-outline-secondary btn-ver-reporte-aprobacion">Ver reporte</button>
                                        <div class="modal-aprobacion-actions">
                                            <button type="button" class="btn btn-light" id="btnCancelarAprobacionFinal">Cancelar</button>
                                            <button type="button" class="btn btn-magenta" id="btnConfirmarAprobacionFinal">Aprobar</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <script>

                                $(document).ready(function () {
                                    // Evita handlers duplicados si recargas parciales
                                    $("#btnBloquearValidacion").off("click").on("click", function () {
                                        const codigoModelo = getModeloActual();
                                        if (!codigoModelo) { return; }
                                        mostrarModalAprobacion();
                                    });

                                    // Añadir listener para el nuevo botón de aprobación
                                    async function modeloTieneAMC(codigoModelo) {
                                        let codCanva = (modeloInfoCompleta && modeloInfoCompleta.cod_canva) ? modeloInfoCompleta.cod_canva : "";
                                        if (!codCanva && codigoModelo) {
                                            try {
                                                const rowsModelo = await postQuery({
                                                    campos: "cod_canva,codigo,codigo_final",
                                                    origen: "[PROCESOS_BI].[dbo].[vw_inventario_modelo_y_artefactos_resumido]",
                                                    condicion: `codigo='${esc(codigoModelo)}' OR codigo_final='${esc(codigoModelo)}'`
                                                });
                                                codCanva = (rowsModelo[0] || {}).cod_canva || "";
                                            } catch (e) {
                                                console.warn("[amc] No se pudo obtener cod_canva:", e);
                                            }
                                        }
                                        if (!codCanva && codigoModelo) {
                                            try {
                                                const rowsModelo = await postQuery({
                                                    campos: "cod_canva",
                                                    origen: "procesos_bi.dbo.T_DOMINIO_ART_MODELOS",
                                                    condicion: `codigo='${esc(codigoModelo)}'`
                                                });
                                                codCanva = (rowsModelo[0] || {}).cod_canva || "";
                                            } catch (e) {
                                                console.warn("[amc] No se pudo obtener cod_canva (T_DOMINIO_ART_MODELOS):", e);
                                            }
                                        }
                                        const norm = String(codCanva || "").trim().toUpperCase();
                                        if (!norm) return false;
                                        if (norm === "NONE" || norm === "NULL" || norm === "-" || norm === "N/A") return false;
                                        return true;
                                    }

                                    $("#btnAprobaciónCierre").off("click").on("click", async function () {
                                        if (!getModeloActual()) { return; }
                                        if (window.idValidacionActual) {
                                            await actualizarImagenAprobacion(window.idValidacionActual, null, true);
                                        }
                                        if (window.validacionAprobada) {
                                            showNotification("top", "center", "info", "Este modelo ya esta aprobado por el sponsor.", 2500);
                                            return;
                                        }
                                        const tieneAMC = await modeloTieneAMC(getModeloActual());
                                        const $modal = $("#modalAprobacionFinal");
                                        const $msg = $modal.find(".modal-aprobacion-body p").first();
                                        const $btnAprobar = $("#btnConfirmarAprobacionFinal");
                                        if (!tieneAMC) {
                                            if ($msg.length) {
                                                $msg.text("Este modelo no se encuentra vinculado a ningún AMC, por favor agregarlo antes de aprobar.");
                                            }
                                            $btnAprobar.prop("disabled", true);
                                        } else {
                                            if ($msg.length) {
                                                $msg.text("Estás a punto de aprobar este modelo.");
                                            }
                                            $btnAprobar.prop("disabled", false);
                                        }
                                        mostrarModalAprobacionFinal();
                                    });

                                    // Validaciï¿½n: solo el sponsor debe poder aprobar
                                    const escSponsor = (s) => String(s ?? "").replace(/'/g, "''");
                                    const postQuerySponsor = async ({ campos = "*", origen, condicion = "1=1" }) => {
                                        const resp = await fetch("http://gobinfoana01-2:8510/query", {
                                            method: "POST",
                                            headers: { accept: "application/json", "Content-Type": "application/json" },
                                            body: JSON.stringify({ campos, origen, condicion })
                                        });
                                        if (!resp.ok) throw new Error("HTTP " + resp.status + " - " + origen);
                                        const data = await resp.json();
                                        return Array.isArray(data) ? data : [data];
                                    };

                                    async function obtenerSponsorModelo(codigoModelo) {
                                        // 1) Recuperar cod_canva (prioriza cache de modelo)
                                        let codCanva = (modeloInfoCompleta && modeloInfoCompleta.cod_canva) ? modeloInfoCompleta.cod_canva : "";
                                        if (!codCanva && codigoModelo) {
                                            try {
                                                const rowsModelo = await postQuerySponsor({
                                                    campos: "cod_canva",
                                                    origen: "procesos_bi.dbo.T_DOMINIO_ART_MODELOS",
                                                    condicion: `codigo='${escSponsor(codigoModelo)}'`
                                                });
                                                codCanva = (rowsModelo[0] || {}).cod_canva || "";
                                            } catch (e) {
                                                console.warn("[sponsor] No se pudo obtener cod_canva:", e);
                                            }
                                        }
                                        if (!codCanva) return { codigo: "", nombre: "" };

                                        // 2) Buscar sponsor en el Canvas
                                        let sponsor = "";
                                        try {
                                            const rows = await postQuerySponsor({
                                                campos: "sponsor",
                                                origen: "PROCESOS_BI.dbo.T_ANALYTICS_MODEL_CANVAS",
                                                condicion: `id_amc='${escSponsor(codCanva)}'`
                                            });
                                            sponsor = (rows[0] || {}).sponsor || "";
                                        } catch (e) {
                                            console.warn("[sponsor] No se pudo obtener sponsor:", e);
                                            return { codigo: "", nombre: "" };
                                        }
                                        if (!sponsor) return { codigo: "", nombre: "" };

                                        const nombre = (typeof getUsuarioPorCodigo === "function")
                                            ? (getUsuarioPorCodigo(sponsor) || "")
                                            : "";

                                        return { codigo: sponsor, nombre };
                                    }

                                    async function esUsuarioActualSponsor(codigoModelo) {
                                        const sponsorInfo = await obtenerSponsorModelo(codigoModelo);
                                        const sponsor = sponsorInfo.codigo;
                                        if (!sponsor) return false;

                                        // 3) Datos del usuario actual
                                        const datos = (typeof obtenerDatosUsuario === "function") ? obtenerDatosUsuario() : null;
                                        const fallback = (typeof obtenerUsuario === "function") ? obtenerUsuario() : {};

                                        const normalize = (v) => {
                                            if (!v) return "";
                                            const raw = String(v).toLowerCase().trim();
                                            const sinDominio = raw.includes("\\") ? raw.split("\\").pop() : raw;
                                            const sinCorreo = sinDominio.includes("@") ? sinDominio.split("@")[0] : sinDominio;
                                            return sinCorreo;
                                        };

                                        const candidatos = [
                                            datos?.usuario,
                                            datos?.codigo,
                                            datos?.current_user,
                                            fallback?.usuario,
                                            fallback?.codigo,
                                            fallback?.current_user,
                                            window.current_user,
                                            window.usuarioActual
                                        ].filter(Boolean).map(normalize).filter(Boolean);

                                        const usuarioActual = candidatos[0] || "";
                                        const codigoActual = candidatos.find(c => /^[0-9]+$/.test(c)) || "";

                                        // Sponsor puede estar almacenado como codigo o usuario
                                        const sponsorLower = String(sponsor || "").toLowerCase();
                                        const usuarioSponsor = (sponsorInfo.nombre || "").toLowerCase();

                                        const esSponsor =
                                            (usuarioActual && (usuarioActual === sponsorLower || usuarioActual === usuarioSponsor)) ||
                                            (codigoActual && (codigoActual === sponsorLower));
                                        const esTester = candidatos.some(u => u === "gortiz" || u === "22827");
                                        return esSponsor || esTester;
                                    }

                                    async function actualizarSponsorCierre() {
                                        const $label = $("#sponsor-cierre");
                                        if (!$label.length) return;
                                        const codigoModelo = getModeloActual();
                                        if (!codigoModelo) {
                                            $label.text("-");
                                            return;
                                        }
                                        $label.text("Cargando...");
                                        try {
                                            const sponsorInfo = await obtenerSponsorModelo(codigoModelo);
                                            const sponsorTexto = sponsorInfo.nombre
                                                ? `${sponsorInfo.nombre} (${sponsorInfo.codigo})`
                                                : (sponsorInfo.codigo || "No disponible");
                                            $label.text(sponsorTexto || "No disponible");
                                        } catch (e) {
                                            console.warn("[sponsor] No se pudo actualizar el sponsor:", e);
                                            $label.text("No disponible");
                                        }
                                    }

                                    function mostrarModalAprobacion() {
                                        const $modal = $("#modalConfirmarAprobacion");
                                        $modal.show();
                                        setTimeout(() => $modal.find('.modal-aprobacion, .modal-aprobacion-backdrop').addClass('show'), 10);
                                        actualizarSponsorCierre();
                                    }

                                    function mostrarModalAprobacionFinal() {
                                        const $modal = $("#modalAprobacionFinal");
                                        $modal.show();
                                        setTimeout(() => $modal.find('.modal-aprobacion, .modal-aprobacion-backdrop').addClass('show'), 10);
                                    }

                                    function ocultarModalAprobacion() {
                                        const $modal = $("#modalConfirmarAprobacion");
                                        $modal.find('.modal-aprobacion, .modal-aprobacion-backdrop').removeClass('show');
                                        setTimeout(() => $modal.hide(), 200);
                                    }

                                    function ocultarModalAprobacionFinal() {
                                        const $modal = $("#modalAprobacionFinal");
                                        $modal.find('.modal-aprobacion, .modal-aprobacion-backdrop').removeClass('show');
                                        setTimeout(() => $modal.hide(), 200);
                                    }

                                    $("#btnCancelarCierre").on("click", ocultarModalAprobacion);
                                    $(".modal-aprobacion-backdrop").on("click", ocultarModalAprobacion);
                                    $("#btnCancelarAprobacionFinal").on("click", ocultarModalAprobacionFinal);
                                    $("#modalAprobacionFinal .modal-aprobacion-backdrop").on("click", ocultarModalAprobacionFinal);

                                    $(".btn-ver-reporte-aprobacion").on("click", function () {
                                        const $btnImprimir = $("#btnImprimir");
                                        if ($btnImprimir.length) {
                                            $btnImprimir.trigger("click");
                                        }
                                    });

                                    $("#btnConfirmarCierre").on("click", async function () {
                                        const codigoModelo = getModeloActual();
                                        if (!codigoModelo) return;

                                        try {
                                            await bloquearValidacion(window.idValidacionActual, codigoModelo);
                                        } catch (e) {
                                            console.warn("No se pudo bloquear en backend:", e);
                                        }
                                        aplicarEstadoBotones(true);
                                        aplicarBloqueoUI(true);
                                        window.esValidacionBloqueada = true;
                                        actualizarImagenAprobacion(window.idValidacionActual || null, null, true);

                                        const nombreModelo = getNombreModelo();
                                        enviarCorreoCierreValidacion(codigoModelo, window.idValidacionActual || null, nombreModelo, "");

                                        ocultarModalAprobacion();
                                    });

                                    $("#btnConfirmarAprobacionFinal").on("click", async function () {
                                        const codigoModelo = getModeloActual();
                                        if (!codigoModelo) return;
                                        if (window.idValidacionActual) {
                                            await actualizarImagenAprobacion(window.idValidacionActual, null, true);
                                        }
                                        if (window.validacionAprobada) {
                                            showNotification("top", "center", "info", "Este modelo ya esta aprobado por el sponsor.", 2500);
                                            return;
                                        }
                                        const usuarioEsSponsor = await esUsuarioActualSponsor(codigoModelo);
                                        if (!usuarioEsSponsor) {
                                            showNotification("top", "center", "warning", "Solo el sponsor del modelo puede aprobar el cierre.", 3500);
                                            return;
                                        }
                                        const observacionesFinales = $("#observacionesCierre").val() || "";

                                        await registrarAprobacionCabecera(window.idValidacionActual, observacionesFinales);

                                        aplicarEstadoBotones(true);
                                        aplicarBloqueoUI(true);
                                        window.esValidacionBloqueada = true;

                                        const nombreModelo = getNombreModelo();
                                        enviarCorreoAprobacionValidacion(codigoModelo, window.idValidacionActual || null, nombreModelo, observacionesFinales);

                                        actualizarImagenAprobacion(window.idValidacionActual || null, true);

                                        ocultarModalAprobacionFinal();
                                        $("#observacionesCierre").val('');
                                    });


                                    $(".btn-icon-only")
                                        .off("mouseenter mouseleave")
                                        .on("mouseenter", function () {
                                            $(this).css({ transform: "scale(1.1)", boxShadow: "0 4px 8px rgba(0,0,0,0.15)" });
                                        })
                                        .on("mouseleave", function () {
                                            $(this).css({ transform: "scale(1)", boxShadow: "none" });
                                        });
                                });
                            </script>



                            <!-- ðŸ”½ CARDS DE SECCIONES PRINCIPALES -->
                            <div class="card mb-4" style="margin-top: 15px;">
                                <div class="card-body seccion">

                                </div>
                            </div>

                            <!-- ðŸ”¶ CARD DE OBSERVACIONES GENERAL -->
                            <div class="card mb-3" id="card-observaciones" style="display:none;">
                                <div class="card-body">
                                    <label for="txtObservaciones" class="font-weight-bold">
                                        Observaciones de la validación:
                                    </label>
                                    <textarea id="txtObservaciones" class="form-control" rows="4"
                                        placeholder="Escribe tus comentarios"></textarea>
                                </div>
                            </div>


                            <!-- ðŸ”˜ Botón para guardar validación 
                            <div class="card">
                                <div class="card-body text-center">
                                    <button id="guardarValidacionBtn" class="btn btn-primary w-100"
                                        style="background-color: #D2006E; border-color: #D2006E;">
                                        Guardar Validación
                                    </button>
                                </div>
                            </div>
                            -->
                        </div>

                        <div class="contenedores-cards col-lg-8 col-12">
                            <style>
                                .info-model-card {
                                    position: relative;
                                    overflow: hidden;
                                }

                                .modelo-aprobado-stamp {
                                    position: absolute;
                                    right: 57px;
                                    bottom: 44px;
                                    width: 120px;
                                    height: 120px;
                                    background-image: url("img/no-aprobado.png");
                                    background-repeat: no-repeat;
                                    background-size: contain;
                                    opacity: 0;
                                    transform: rotate(-8deg) scale(1.3);
                                    transition: opacity .2s ease, transform .2s ease, background-image .2s ease;
                                    pointer-events: none;
                                    display: none;
                                }

                                .info-model-card.validacion-aprobada .modelo-aprobado-stamp {
                                    background-image: url("img/aprobado.png");
                                    opacity: 0.95;
                                    transform: rotate(-8deg) scale(1.3);
                                }
                            </style>
                            <!-- ðŸ”¹ Card de información del modelo -->
                            <div class="card mb-3 info-model-card no-bloquear" id="modelo-info-card"
                                style="display: none;">
                                <div class="card-body">
                                    <div class="modelo-aprobado-stamp" aria-hidden="true"></div>
                                    <h5 class="card-title font-weight-bold text-center" style="color: #D2006E;">
                                        Información del Modelo</h5>
                                    <p><strong>Código:</strong><span id="info-codigo"></span>| <span
                                            id="info-nombre"></span></p>
                                    <p><strong>Objetivo:</strong> <span id="info-objetivo"></span></p>
                                    <p><strong>Tipo Artefacto:</strong> <span id="info-tipo"></span></p>
                                    <p><strong>Uso:</strong> <span id="info-uso"></span></p>
                                    <p><strong>Ciclo:</strong> <span id="info-ciclo"></span></p>
                                    <p><strong>Año de Creación:</strong> <span id="info-anio"></span></p>
                                </div>
                            </div>


                            <!-- ðŸ”¹ Card de las Subsecciones -->
                            <div id="subcards-container">
                                <div class="card">
                                <div class="card-body"
                                        style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 3px 8px rgba(210, 0, 110, 0.2); padding: 14px; border: 1px solid #D2006E;">
                                        <div class="d-flex align-items-center justify-content-center"
                                            style="padding-bottom: 6px;">
                                            <h3 id="nombre-atributo" class="mb-0 font-weight-bold text-center"
                                                style="color: #D2006E; font-size: 1.75rem; letter-spacing: 0.02em;">
                                                Selecciona un Modelo
                                            </h3>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div id="info-model-card" class="mb-3"></div>
                            <div id="subcards-container"></div>
                            <div id="contenedor-observaciones" class="mt-3"></div>
                        </div>
                    </div>
                </div>
                </div>
            </main>

            <footer class="page-footer">
                <div class="footer-content">
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col-12 col-sm-6">
                                <p class="mb-0 text-muted">Banco Guayaquil 2023</p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
            <script src="js/vendor/bootstrap.bundle.min.js"></script>
            <script src="js/vendor/perfect-scrollbar.min.js"></script>
            <script src="js/vendor/mousetrap.min.js"></script>
            <script src="js/vendor/Chart.bundle.min.js"></script>
            <script src="js/vendor/chartjs-plugin-datalabels.js"></script>

            <script src="js/dore.script.js"></script>
            <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>

            <script src="https://cdn.ckeditor.com/ckeditor5/39.0.1/classic/ckeditor.js"></script>
            <script>
                let globalObsEditor = null;
                document.addEventListener("DOMContentLoaded", () => {
                    const txt = document.getElementById("txtObservaciones");
                    if (!txt) return;

                    ClassicEditor
                        .create(txt)
                        .then(editor => {
                            globalObsEditor = editor;
                            txt._ckEditorInstance = editor;
                        })
                        .catch(console.error);
                });
            </script>


            <script src="js/scripts.single.theme.js"></script>
            <script src="js/jquery.SPServices.v2014-02.min.js"></script>
            <script src="js/vendor/datatables.min.js"></script>
            <script src="js/vendor/buttons.dataTables.min.js"></script>
            <script src="js/vendor/jszip.min.js"></script>
            <script src="js/vendor/buttons.html5.min.js"></script>
            <script src="js/vendor/dataTables.Resize.js"></script>
            <script src="js/vendor/bootstrap-notify.min.js"></script>

            <!--utils-->
            <!-- API -->
            <script src="js/Validador_Modelos/api/apiValidador.js"></script>

            <script src="js/Validador_Modelos/utils/resetDataMapGlobal.js"></script>
            <script src="js/Validador_Modelos/actualizacion_DataMap/actualizarScoreFinal.js"></script>
            <script src="js/Validador_Modelos/utils/initNuevaValidacionListener.js"></script>
            <script src="js/Validador_Modelos/utils/inyectarAplicaDesdeDetalle.js"></script>


            <!-- cards -->
            <script src="js/Validador_Modelos/cards/crearCardHtml.js"></script>
            <script src="js/Validador_Modelos/cards/crearParametrosHtml.js"></script>
            <script src="js/Validador_Modelos/cards/crearPreguntasHtml.js"></script>

            <!-- cargas -->
            <script src="js/Validador_Modelos/cargas/cargarDatosEnMapa.js"></script>
            <script src="js/Validador_Modelos/cargas/cargarModelosDesdeSharePoint.js"></script>
            <script src="js/Validador_Modelos/cargas/cargarModeloSeleccionado.js"></script>
            <script src="js/Validador_Modelos/cargas/cargarPlantillaCompleta.js"></script>
            <script src="js/Validador_Modelos/cargas/cargarSeccionesUnicas.js"></script>
            <script src="js/Validador_Modelos/cargas/cargarSubseccionesYParametros.js"></script>
            <script src="js/Validador_Modelos/cargas/cargarValoresPrevios.js"></script>
            <script src="js/Validador_Modelos/cargas/mostrarInformacionModelo.js"></script>
            <script src="js/Validador_Modelos/cargas/obtenerDataMapGlobal.js"></script>
            <script src="js/Validador_Modelos/cargas/buscarValidacionYDetallePorModelo.js"></script>
            <!--<script src="js/Validador_Modelos/cargas/guardarValidacionEnTxt.js"></script>-->
            <script src="js/Validador_Modelos/cargas/obtenerSeccionActual.js"></script>
            <script src="js/Validador_Modelos/cargas/getUsuarioPorCodigo.js"></script>

            <!-- recalcular score-->
            <script src="js/Validador_Modelos/recalcular_scores/recalcularTodo.js"></script>
            <script src="js/Validador_Modelos/recalcular_scores/recalcularScoreSubseccion.js"></script>
            <script src="js/Validador_Modelos/recalcular_scores/recalcularScoreSeccion.js"></script>

            <!--actualizaciones datamapglobal-->
            <script src="js/Validador_Modelos/actualizacion_DataMap/actualizarDataMapDesdeDetalleScore.js"></script>
            <script src="js/Validador_Modelos/actualizacion_DataMap/actualizarDataMap.js"></script>
            <script src="js/Validador_Modelos/actualizacion_DataMap/actualizarDataMapFromSlider.js"></script>
            <script src="js/Validador_Modelos/actualizacion_DataMap/actualizarDataMapFromSwitch.js"></script>

            <script src="js/Validador_Modelos/actualizacion_DataMap/actualizarScoreSeccionEnDOM.js"></script>

            <!--actualizar listas-->
            <script src="js/Validador_Modelos/actualizar_Listas/generarCabeceraScore.js"></script>
            <script src="js/Validador_Modelos/actualizar_Listas/generarDetalleScore.js"></script>
            <script src="js/Validador_Modelos/actualizar_Listas/insertarCabeceraScore.js"></script>
            <script src="js/Validador_Modelos/actualizar_Listas/insertarDetalleScore.js"></script>
            <script src="js/Validador_Modelos/actualizar_Listas/updateObservacionesCabecera.js"></script>
            <script src="js/Validador_Modelos/actualizar_Listas/updateDetalleScore.js"></script>
            <script src="js/Validador_Modelos/actualizar_Listas/insertarDetalleDesdePlantilla.js"></script>

            <!--utils2-->
            <script src="js/Validador_Modelos/utils/renderizarContenido.js"></script>
            <script src="js/Validador_Modelos/utils/actualizarTextoBotonGuardar.js"></script>
            <script src="js/Validador_Modelos/utils/sincronizarDetalleScore.js"></script>
            <script src="js/Validador_Modelos/utils/obtenerIdValidacionMayor.js"></script>
            <script src="js/Validador_Modelos/utils/descartarCambiosListener.js"></script>
            <script src="js/Validador_Modelos/utils/verificarCambiosEnPreguntas.js"></script>
            <script src="js/Validador_Modelos/utils/manejarGuardarValidacion.js"></script>
            <script src="js/Validador_Modelos/utils/bloquearValidacion.js"></script>
            <script src="js/Validador_Modelos/utils/switchGlobalSubseccion.js"></script>
            <script src="js/Validador_Modelos/utils/buscarUltimaValidacion.js"></script>
            <script src="js/Validador_Modelos/utils/construirPlantillaImpresion.js"></script>


            <!--panel de validacion-->
            <script src="js/Validador_Modelos/panel_validacion/asegurarEstilosTablaValidaciones.js"></script>
            <script src="js/Validador_Modelos/panel_validacion/crearModalValidaciones.js"></script>
            <script src="js/Validador_Modelos/panel_validacion/initValidacionesPopupListener.js"></script>
            <script src="js/Validador_Modelos/panel_validacion/mostrarModalValidaciones.js"></script>
            <script src="js/Validador_Modelos/panel_validacion/obtenerDatosValidaciones.js"></script>
            <script src="js/Validador_Modelos/panel_validacion/pintarTablaValidaciones.js"></script>

            <script>
                var n = new Date().getTime();
                document.write('<script src="js/suite.js?v=' + n + '"> <' + '/' + 'script>');
            </script>
            <script>
                window.dataMapGlobal = window.dataMapGlobal || {};
                window.cabeceraObservaciones = window.cabeceraObservaciones || {};
                window.cabeceraglobal = window.cabeceraglobal || {};
                window.modeloInfoCompleta = window.modeloInfoCompleta || {};

            </script>

            <script src="js/Validador_Modelos/utils/uiBotones.js"></script>

            <script>
                // Trae la cabecera exacta por id_validacion
                // js/Validador_Modelos/cargas/buscarCabeceraPorIdValidacion.fetch.js
                const API_URL = "http://gobinfoana01-2:8510/query";

                /* Utils locales (si ya las tienes globales, puedes omitir estas) */
                async function postQuery({ campos = "*", origen, condicion = "1=1" }) {
                    const resp = await fetch(API_URL, {
                        method: "POST",
                        headers: { "accept": "application/json", "Content-Type": "application/json" },
                        body: JSON.stringify({ campos, origen, condicion })
                    });
                    if (!resp.ok) throw new Error(`HTTP ${resp.status} ’ ${origen}`);
                    const json = await resp.json();
                    return Array.isArray(json) ? json : [json];
                }
                const esc = s => String(s ?? "").replace(/'/g, "''");
                const isNumeric = v => /^[0-9]+$/.test(String(v ?? ""));

                /**
                 * Reemplazo 1:1 de la versión SPServices
                 * Devuelve ví­a callback la cabecera por id_validacion (o null si no hay).
                 */
                function buscarCabeceraPorIdValidacion(idValidacion, cb) {
                    if (!idValidacion) return cb(null);

                    (async () => {
                        try {
                            const resp = await fetch("http://gobinfoana01-2:8510/query", {
                                method: "POST",
                                headers: { accept: "application/json", "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    campos: "*",
                                    origen: "procesos_bi.dbo.T_Z_cabecera_SCORE",
                                    condicion: `id_validacion='${idValidacion}'`
                                })
                            });

                            const raw = await resp.text();
                            if (!resp.ok) {
                                console.error(" CABECERA HTTP", resp.status, raw);
                                return cb(null);
                            }

                            let parsed = raw ? JSON.parse(raw) : [];
                            const arr = Array.isArray(parsed) ? parsed : [parsed];
                            if (!arr.length) return cb(null);

                            const r = arr[0];

                            const cab = {
                                id_validacion:
                                    r.id_validacion ?? r.ID_VALIDACION ?? r.Id_Validacion ?? String(idValidacion),
                                fecha_Finalizacion:
                                    (r.fecha_Finalizacion ?? r.fecha_finalizacion ?? r.FECHA_FINALIZACION ?? r.FECHA_FIN ?? null),
                                codigo_modelo:
                                    (r.codigo_modelo ?? r.CODIGO_MODELO ?? null),
                                usuario:
                                    (r.usuario ?? r.USUARIO ?? r.codigo_usuario ?? r.CODIGO_USUARIO ?? null),

                                observaciones: (r.observaciones ?? r.OBSERVACIONES ?? "") || "",
                                obs_seccion1: (r.obs_seccion1 ?? r.OBS_SECCION1 ?? "") || "",
                                obs_seccion2: (r.obs_seccion2 ?? r.OBS_SECCION2 ?? "") || "",
                                obs_seccion3: (r.obs_seccion3 ?? r.OBS_SECCION3 ?? "") || "",
                                obs_seccion4: (r.obs_seccion4 ?? r.OBS_SECCION4 ?? "") || ""
                            };

                            window.cabeceraObservaciones = {
                                observaciones: cab.observaciones,
                                obs_seccion1: cab.obs_seccion1,
                                obs_seccion2: cab.obs_seccion2,
                                obs_seccion3: cab.obs_seccion3,
                                obs_seccion4: cab.obs_seccion4
                            };
                            window.draftObservaciones = { ...window.cabeceraObservaciones };

                            if (window.globalObsEditor) {
                                window.globalObsEditor.setData(window.cabeceraObservaciones.observaciones || "");
                            } else {
                                $("#txtObservaciones").val(window.cabeceraObservaciones.observaciones || "");
                            }

                            cb(cab);
                        } catch (e) {
                            console.error(" Error en buscarCabeceraPorIdValidacion:", e);
                            cb(null);
                        }
                    })();
                }

            </script>


            <script>
                function esBloqueadaPorFecha(fechaFinal) {
                    const cerrada = !!(fechaFinal && fechaFinal !== "null" && fechaFinal !== "-");
                    return cerrada;
                }

                async function actualizarImagenAprobacion(idValidacion, aprobadoForce, mostrarSiCerrado = false) {
                    const $stamp = $("#modelo-info-card .modelo-aprobado-stamp");
                    const $btnAprobacion = $("#btnAprobaciónCierre");
                    const setEstado = (aprobado) => {
                        const isOk = !!aprobado;
                        window.validacionAprobada = isOk;
                        const mostrar = isOk || mostrarSiCerrado;
                        $("#modelo-info-card").toggleClass("validacion-aprobada", isOk);
                        if ($btnAprobacion.length) {
                            $btnAprobacion.prop("disabled", isOk);
                            if (isOk) {
                                $btnAprobacion.attr("title", "Aprobado por sponsor");
                            } else {
                                $btnAprobacion.attr("title", "Aprobación de cierre");
                            }
                        }
                        if (isOk) {
                            $stamp
                                .css("background-image", 'url("img/aprobado.png")')
                                .css("opacity", 0.95)
                                .css("transform", "rotate(-8deg) scale(1.2)")
                                .show();
                        } else if (mostrar) {
                            $stamp
                                .css("background-image", 'url("img/no-aprobado.png")')
                                .css("opacity", 0.85)
                                .css("transform", "rotate(-8deg) scale(1.1)")
                                .show();
                        } else {
                            $stamp.hide();
                        }
                    };

                    // Si se fuerza el estado (al aprobar manualmente), solo actualizar UI.
                    if (typeof aprobadoForce === "boolean") {
                        setEstado(aprobadoForce);
                        return;
                    }

                    // Sin id, mostrar como no aprobado por defecto
                    if (!idValidacion) {
                        setEstado(false);
                        return;
                    }

                    try {
                        const resp = await fetch("http://gobinfoana01-2:8510/query", {
                            method: "POST",
                            headers: { accept: "application/json", "Content-Type": "application/json" },
                            body: JSON.stringify({
                                campos: "usuario_aprobacion",
                                origen: "procesos_bi.dbo.t_z_cabecera_score",
                                condicion: `id_validacion=${idValidacion}`
                            })
                        });
                        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
                        let data = await resp.json();
                        const row = Array.isArray(data) ? data[0] : data;
                        const usuarioAprob = row ? row.usuario_aprobacion : null;
                        const aprobado = !!(usuarioAprob && usuarioAprob !== "null" && usuarioAprob !== "-");
                        setEstado(aprobado);
                    } catch (e) {
                        console.warn("No se pudo validar usuario_aprobacion:", e);
                        setEstado(false);
                    }
                }



                function aplicarEstadoBotones(esBloqueada) {
                    window.esValidacionBloqueada = esBloqueada;

                    if (!esBloqueada) {
                        $("#btnBloquearValidacion").prop("disabled", false)
                            .html('<i class="simple-icon-lock-open ml-1" style="font-size:20px;"></i>')
                            .css({ color: "#28a745", borderColor: "#28a745" })
                            .attr("title", "Validación editable (click para bloquear)");

                        $("#guardarValidacionBtn, #btnDescartarCambios").prop("disabled", false);
                        $("#btnNuevaValidacion").prop("disabled", true);
                    } else {
                        $("#btnBloquearValidacion").prop("disabled", true)
                            .html('<i class="simple-icon-lock ml-1" style="font-size:20px;"></i>')
                            .css({ color: "#dc3545", borderColor: "#dc3545" })
                            .attr("title", "Validación cerrada");

                        $("#guardarValidacionBtn, #btnDescartarCambios").prop("disabled", true);
                        $("#btnNuevaValidacion").prop("disabled", false);
                    }

                    $("#btnAprobaciónCierre").toggle(!!esBloqueada);
                    $("#btnImprimir").prop("disabled", false);
                    actualizarImagenAprobacion(window.idValidacionActual || null, null, !!esBloqueada);
                }

                function aplicarBloqueoUI(esBloqueada) {
                    if (esBloqueada) {
                        bloquearSeccionesPrincipales();
                        $(".slider-porcentaje, .completado-slider").prop("disabled", true).css("filter", "grayscale(100%)");
                        $(".switch-aplica, .sw-aplica-sub").prop("disabled", true);
                    } else {
                        desbloquearSecciones();
                        $(".slider-porcentaje, .completado-slider").prop("disabled", false).css("filter", "");
                        $(".switch-aplica, .sw-aplica-sub").prop("disabled", false);
                    }
                }

                function procesarModeloSeleccionado(codigo, idValidacionQS) {
                    if (!codigo) return;

                    const continuarConCab = (cab) => {
                        const fechaFinal = cab ? cab.fecha_Finalizacion : null;
                        const esBloqueada = esBloqueadaPorFecha(fechaFinal);

                        // id_validacion activo
                        if (cab?.id_validacion) window.idValidacionActual = cab.id_validacion;
                        else if (idValidacionQS) window.idValidacionActual = idValidacionQS;

                        // Estado UI
                        aplicarEstadoBotones(esBloqueada);
                        aplicarBloqueoUI(esBloqueada);

                        // Cargar detalles y luego renderizar por SECCIÓN
                        try {
                            const idQS = idValidacionQS || null;
                            cargarModeloSeleccionado(codigo, esBloqueada, idQS, () => {
                                window.dataMapGlobal = window.dataMapGlobal || {};
                                window.modeloActual = codigo;

                                const secciones = Object.keys(window.dataMapGlobal || {});
                                const seccionInicial =
                                    (window.seccionSeleccionada && window.dataMapGlobal[window.seccionSeleccionada])
                                        ? window.seccionSeleccionada
                                        : (secciones[0] || null);

                                console.log("[procModelo] secciones:", secciones, "elegida:", seccionInicial, "bloq:", esBloqueada);

                                if (seccionInicial) {
                                    $(".seccion-item").removeClass("selected");
                                    $(`.seccion-item[data-seccion="${seccionInicial}"]`).addClass("selected");
                                    window.seccionSeleccionada = seccionInicial;

                                    //  pinta parámetros + OBS (CKEditor) también cuando viene por URL
                                    cargarSubseccionesYParametros(seccionInicial);
                                } else {
                                    $("#subcards-container").html(`<div class="alert alert-warning">No hay secciones para mostrar.</div>`);
                                }
                            });
                        } catch (e) {
                            console.warn("cargarModeloSeleccionado falló:", e);
                            window.dataMapGlobal = window.dataMapGlobal || {};
                            const secciones = Object.keys(window.dataMapGlobal || {});
                            const seccionInicial = secciones[0] || null;
                            if (seccionInicial) cargarSubseccionesYParametros(seccionInicial);
                        }
                    };

                    //   Aquí­ decides con URL:
                    const idQS =
                        idValidacionQS ||
                        (new URLSearchParams(window.location.search).get('id_validacion') || "").trim() ||
                        null;


                    if (idQS && typeof buscarCabeceraPorIdValidacion === "function") {
                        // Historial: trae esa cabecera exacta; si no existe, cae a la última
                        buscarCabeceraPorIdValidacion(idQS, function (cab) {
                            if (!cab) return buscarValidacionYDetallePorModelo(codigo, continuarConCab);
                            continuarConCab(cab);
                        });
                    } else {
                        // Sin id en URL: usa la última validación del modelo
                        buscarValidacionYDetallePorModelo(codigo, continuarConCab);
                    }
                }












                const qs = new URLSearchParams(window.location.search);
                const modeloQS = (qs.get('modelo') || "").trim();
                const idValidacionQS = (qs.get('id_validacion') || "").trim();

                $(document).ready(function () {
                    bloquearSeccionesPrincipales();
                });

                //$(document).ready(function () {
                //    if (modeloQS && !window.__initFromURLDone) {
                // si todaví­a existe el select, deja el valor (aunque luego lo reemplaces por el box)
                //        $("#modeloSelect").val(modeloQS);
                //        procesarModeloSeleccionado(modeloQS, idValidacionQS || null);
                //    }
                //});

                $(document).on("click", ".seccion-item", function () {
                    if ($(this).hasClass("disabled")) return;

                    const seccionSeleccionada = $(this).data("seccion");
                    window.seccionSeleccionada = seccionSeleccionada;
                    seccionActual = seccionSeleccionada;
                    $(".seccion-item").removeClass("selected");
                    $(this).addClass("selected");
                    cargarSubseccionesYParametros(seccionSeleccionada);
                });

            </script>

            <script type="text/javascript">
                $(document).ready(function () {
                    cargarModelosDesdeSharePoint();

                    $("#guardarValidacionBtn").on("click", function () {
                        const modeloSeleccionado = getModeloActual();
                        if (!modeloSeleccionado) {
                            alert(" Debes seleccionar un modelo para guardar.");
                            return;
                        }
                        // Aquí­ irá la lógica de guardado más adelante
                    });
                });

                $(document).ready(function () {
                    cargarSeccionesUnicas(); // Genera las secciones
                });
            </script>


            <script>
                $(document).ready(function () {
                    $("#guardarValidacionBtn").click(function () {
                        manejarGuardarValidacion(); // Llama a la función que maneja el guardado
                    });
                });

                descartarCambiosListener(); // listener del boton de descartar Cambios
                switchGlobalSubseccion(); //listener del switch global de cada subseccion

                /* justo después de declarar otros globals */
                let isNuevaValidacion = false;


                /* ----------------------------------------------------------------------------------------                
                
                Inicializa la Página con los eventos necesarios para el Validador de Modelos
                - Carga los modelos disponibles
                - Configura el evento de cambio del select de modelos
                - Configura el evento del botón de nueva validación
                - Configura el evento del botón de bloquear validación
                - Configura el evento del botón de eliminar detalles de validación
                
                --------------------------------------------------------------------------------------------*/



                $(document).ready(function () {

                    /* Se habilita/deshabilita cada vez que cargo un modelo */
                    $(document).ready(function () {
                        $("#modeloSelect").on("change", function () {
                            const codigo = $(this).val();
                            if (!codigo) return;
                            const idQS = (new URLSearchParams(window.location.search).get('id_validacion') || "").trim() || null;
                            procesarModeloSeleccionado(codigo, idQS);
                        });
                    });

                    /* Botón NUEVA VALIDACIÓN */
                    $("#btnNuevaValidacion").on("click", function () {

                        window.spIdCabecera = (parseInt(window.spIdCabecera, 10) + 1).toString();
                        if ($(this).prop("disabled")) return;

                        $("#guardarValidacionBtn").prop("disabled", false);
                        $("#btnDescartarCambios").prop("disabled", false);
                        $("#btnBloquearValidacion").prop("disabled", false);
                        $("#btnNuevaValidacion").prop("disabled", true);

                        // 1. bandera para manejarGuardarValidacion()
                        isNuevaValidacion = true;
                        window.esValidacionBloqueada = false;

                        cargarSubseccionesYParametros(window.seccionSeleccionada);       // Llamar a la función para cargar subsecciones
                        sincronizarSwitchesMaestros();
                        resetDataMapGlobal();                  //  helper nuevo
                        actualizarScoreFinal();                // label 0 %
                        desbloquearSecciones();

                        // 3. deja todos los sliders / switches en cero
                        $(".slider-porcentaje").val(0).trigger("input"); // si usas input range
                        $(".switch-aplica").prop("checked", true).trigger("change");
                        $(".sw-aplica-sub").prop("checked", true).trigger("change");
                        // 4. limpia observaciones draft + DOM
                        window.cabeceraObservaciones = {};
                        window.draftObservaciones = {};

                        // Resetear campo de observaciones globales (CKEditor o textarea)
                        if (window.globalObsEditor) {
                            globalObsEditor.setData("");
                        } else {
                            $("#txtObservaciones").val("");
                        }

                        /*showNotification("top", "center", "info",
                            "Ahora estás creando una NUEVA validación. Recuerda modificar preguntas antes de guardar.", 3500);
                        */
                    });
                });

            </script>

            <script>

                let detalleBackupEliminado = null;

                $(document).ready(function () {
                    // El manejador de #btnBloquearValidacion se ha movido y modificado arriba para incluir el modal.
                    // Este bloque ya no es necesario para ese botón.
                });

/*
                function eliminarDetallesDeValidacion(id_validacion, callback) {
                    (async () => {
                        // 1) Buscar IDs ví­a endpoint
                        const origen = "BG_Lab.dbo.Z_DETALLES_SCORE_Prueba";
                        const CAMPOS = "ID,id_validacion"; // solo lo necesario
                        const cond = `id_validacion=${isNumeric(id_validacion) ? id_validacion : `'${esc(id_validacion)}'`}`;

                        let rows;
                        try {
                            rows = await postQuery({ campos: CAMPOS, origen, condicion: cond });
                            console.log(`ðŸ“¡ [endpoint] Encontrados ${rows.length} detalles para id_validacion=${id_validacion}`);
                        } catch (err) {
                            console.error(" Error al consultar detalles para eliminar (endpoint):", err);
                            callback && callback();
                            return;
                        }

                        const ids = rows
                            .map(r => r.ID ?? r.id ?? r.SpId ?? r.sp_id)
                            .filter(v => v !== undefined && v !== null)
                            .map(String);

                        if (!ids.length) {
                            console.warn(" No se encontraron detalles para eliminar.");
                            callback && callback();
                            return;
                        }

                        // 2) Eliminar cada uno en SharePoint (mantener SPServices)
                        let eliminados = 0;
                        ids.forEach(id => {
                            $().SPServices({
                                operation: "DeleteListItems",
                                async: true,
                                listName: "Z_DETALLES_SCORE",
                                ID: id,
                                completefunc: function () {
                                    eliminados++;
                                    if (eliminados === ids.length) {
                                        console.log(` Eliminados ${eliminados} detalles de la validación ${id_validacion}`);
                                        callback && callback();
                                    }
                                }
                            });
                        });
                    })().catch(err => {
                        console.error(" eliminarDetallesDeValidacion (mixed):", err);
                        callback && callback();
                    });
                }
*/
            </script>

            <script>
                let modeloInfoCompleta = {};
                let cabeceraglobal = {};

                function construirLinkValidacionActual() {
                    const modelo = getModeloActual();
                    if (!modelo) return null;
                    const idVal = (window.idValidacionActual || "").toString().trim();
                    const base = "http://vamos.bancoguayaquil.com/sitios/informaciongerencial/OGA_Suite/Produccion/ValidadorModelos.aspx";
                    const params = [`modelo=${encodeURIComponent(modelo)}`];
                    if (idVal) params.push(`id_validacion=${encodeURIComponent(idVal)}`);
                    return `${base}?${params.join("&")}`;
                }

                $(document).on("click", "#btnCopiarLink", async () => {
                    const link = construirLinkValidacionActual();
                    if (!link) {
                        showNotification("top", "center", "warning", "Selecciona un modelo primero", 2000);
                        return;
                    }
                    try {
                        if (navigator.clipboard && navigator.clipboard.writeText) {
                            await navigator.clipboard.writeText(link);
                        } else {
                            const temp = document.createElement("textarea");
                            temp.value = link;
                            temp.style.position = "fixed";
                            temp.style.top = "-9999px";
                            document.body.appendChild(temp);
                            temp.focus();
                            temp.select();
                            document.execCommand("copy");
                            temp.remove();
                        }
                        showNotification("top", "center", "success", "Link copiado al portapapeles", 2000);
                    } catch (e) {
                        console.warn("No se pudo copiar el link:", e);
                        showNotification("top", "center", "danger", "No se pudo copiar el link", 2000);
                    }
                });

                async function obtenerSponsorParaReporte(codigoModelo) {
                    console.log("[reporte] obtenerSponsorParaReporte codigoModelo:", codigoModelo);
                    let codCanva = (modeloInfoCompleta && modeloInfoCompleta.cod_canva) ? modeloInfoCompleta.cod_canva : "";
                    console.log("[reporte] cod_canva cache modeloInfoCompleta:", codCanva);
                    if (!codCanva && codigoModelo) {
                        try {
                            const rowsModelo = await postQuery({
                                campos: "cod_canva,codigo,codigo_final",
                                origen: "[PROCESOS_BI].[dbo].[vw_inventario_modelo_y_artefactos_resumido]",
                                condicion: `codigo='${esc(codigoModelo)}' OR codigo_final='${esc(codigoModelo)}'`
                            });
                            console.log("[reporte] rowsModelo vista:", rowsModelo);
                            codCanva = (rowsModelo[0] || {}).cod_canva || "";
                        } catch (e) {
                            console.warn("[reporte] No se pudo obtener cod_canva:", e);
                        }
                    }
                    if (!codCanva && codigoModelo) {
                        try {
                            const rowsModelo = await postQuery({
                                campos: "cod_canva",
                                origen: "procesos_bi.dbo.T_DOMINIO_ART_MODELOS",
                                condicion: `codigo='${esc(codigoModelo)}'`
                            });
                            console.log("[reporte] rowsModelo T_DOMINIO_ART_MODELOS:", rowsModelo);
                            codCanva = (rowsModelo[0] || {}).cod_canva || "";
                        } catch (e) {
                            console.warn("[reporte] No se pudo obtener cod_canva (T_DOMINIO_ART_MODELOS):", e);
                        }
                    }
                    console.log("[reporte] cod_canva final:", codCanva);
                    if (!codCanva) return "";

                    try {
                        const rows = await postQuery({
                            campos: "sponsor",
                            origen: "PROCESOS_BI.dbo.T_ANALYTICS_MODEL_CANVAS",
                            condicion: `id_amc='${esc(codCanva)}'`
                        });
                        console.log("[reporte] rows sponsor:", rows);
                        const sponsor = String((rows[0] || {}).sponsor || "").trim();
                        console.log("[reporte] sponsor raw:", sponsor);
                        if (!sponsor) return "";
                        let nombre = "";
                        console.log("[reporte] getNombrePorCodigo type:", typeof getNombrePorCodigo);
                        if (/^[0-9]+$/.test(sponsor) && typeof getNombrePorCodigo === "function") {
                            nombre = getNombrePorCodigo(sponsor) || "";
                        }
                        if (!nombre && window.SharePointUtils && typeof window.SharePointUtils.getNombrePorCodigo === "function") {
                            nombre = window.SharePointUtils.getNombrePorCodigo(sponsor) || "";
                        }
                        const buscarNombreEnSP = (codigo, valueType) => {
                            let nom = "";
                            if (typeof $ === "undefined" || typeof $().SPServices !== "function") return "";
                            const camlQuery = `
                              <Query>
                                <Where>
                                  <Eq>
                                    <FieldRef Name="CODIGO_EMPLEADO" />
                                    <Value Type="${valueType}">${codigo}</Value>
                                  </Eq>
                                </Where>
                              </Query>`;
                            $().SPServices({
                                operation: "GetListItems",
                                async: false,
                                listName: "Z_DATOS_EMPLEADOS",
                                CAMLQuery: camlQuery,
                                CAMLViewFields: `<ViewFields><FieldRef Name="NOMBRE_COMPLETO" /></ViewFields>`,
                                completefunc: function (xData, Status) {
                                    if (Status !== "success") {
                                        console.warn("[reporte] SPServices status:", Status);
                                        return;
                                    }
                                    const fila = $(xData.responseXML).find("z\\:row").first();
                                    if (fila.length) nom = fila.attr("ows_NOMBRE_COMPLETO") || "";
                                },
                            });
                            return nom;
                        };
                        if (!nombre && /^[0-9]+$/.test(sponsor)) {
                            nombre = buscarNombreEnSP(sponsor, "Text") || "";
                        }
                        if (!nombre && /^[0-9]+$/.test(sponsor)) {
                            nombre = buscarNombreEnSP(sponsor, "Number") || "";
                        }
                        if (!nombre && typeof obtenerDatosUsuario === "function") {
                            const datos = obtenerDatosUsuario(sponsor);
                            console.log("[reporte] datos usuario sponsor:", datos);
                            nombre = datos?.nombreCompleto || datos?.nombres || "";
                        }
                        if (!nombre && typeof getEmployeeCodeByUser === "function" && !/^[0-9]+$/.test(sponsor)) {
                            const codigo = getEmployeeCodeByUser(sponsor) || "";
                            if (codigo && typeof getNombrePorCodigo === "function") {
                                nombre = getNombrePorCodigo(codigo) || "";
                            }
                        }
                        console.log("[reporte] nombre sponsor:", nombre);
                        return nombre || "SPONSOR NO DISPONIBLE";
                    } catch (e) {
                        console.warn("[reporte] No se pudo obtener sponsor:", e);
                        return "";
                    }
                }

                $(document).on("click", "#btnImprimir", async () => {
                    const codigoModelo = getModeloActual();
                    if (!codigoModelo) {
                        showNotification("top", "center", "warning", "Selecciona un modelo primero", 2000);
                        return;
                    }

                    // Fuentes de datos
                    const cab = cabeceraObservaciones || cabeceraglobal || {};
                    const mapa = dataMapGlobal || {};
                    const info = modeloInfoCompleta || {};

                    const nombres = getNombrePorCodigo(cab.usuario)

                    // Genera el HTML del informe (asegúrate que tu función acepte el 3er arg si lo usas dentro)
                    const aprobadoPor = await obtenerSponsorParaReporte(codigoModelo);
                    const observacionAprobacion = ($("#observacionesCierre").val() || "").trim();
                    const html = construirPlantillaImpresion(cab, mapa, nombres, aprobadoPor, observacionAprobacion);
                    abrirVistaPreviaEnPopup(html);

                    /* ===== Popup de vista previa ===== */
                    function abrirVistaPreviaEnPopup(html) {
                        // Cierra uno previo si existiera
                        const prev = document.getElementById("printPreviewModal");
                        if (prev) prev.remove();

                        const wrap = document.createElement("div");
                        wrap.id = "printPreviewModal";
                        wrap.innerHTML = `
                        <div class="pp-backdrop"></div>
                        <div class="pp-dialog" role="dialog" aria-modal="true" aria-label="Vista previa del informe">
                            <div class="pp-toolbar">
                                <div class="pp-title">Vista previa del informe</div>
                                <div class="pp-actions">
                                <button class="pp-btn pp-close" id="ppClose" aria-label="Cerrar"></button>
                                </div>
                            </div>
                            <iframe class="pp-frame" id="ppFrame"></iframe>
                        </div>
                        <style>
                        /* Overlay */
                        #printPreviewModal .pp-backdrop{
                            position:fixed;
                            inset:0;
                            background:rgba(0,0,0,.45);
                            backdrop-filter:saturate(120%) blur(2px);
                            z-index:99998;
                            }

                            #printPreviewModal .pp-dialog{
                            position:fixed;
                            left:50%;
                            top:50%;
                            transform:translate(-50%,-50%);
                            width:min(96vw, 1100px);
                            height:min(94vh, 800px);
                            background:#fff;
                            border-radius:14px;
                            overflow:hidden;
                            box-shadow:0 18px 60px rgba(0,0,0,.35);
                            display:flex;
                            flex-direction:column;
                            z-index:99999;
                            border:1px solid var(--line, #e6e7ea);
                            }

                            #printPreviewModal .pp-toolbar{
                            display:flex;
                            align-items:center;
                            justify-content:space-between;
                            gap:12px;
                            padding:8px 10px;
                            background:#f7f8fa;
                            border-bottom:1px solid var(--line, #e6e7ea);
                            }

                            #printPreviewModal .pp-title{
                            font-weight:700;
                            color:#202225;
                            letter-spacing:.2px;
                            }

                            #printPreviewModal .pp-actions{
                            display:flex;
                            gap:8px;
                            }

                            /* Botones */
                            #printPreviewModal .pp-btn{
                            border:1px solid var(--lineDark, #cfd3d8);
                            background:#fff;
                            color:#202225;
                            padding:4px 8px;
                            border-radius:8px;
                            font-size:12px;
                            cursor:pointer;
                            transition: background .15s ease, border-color .15s ease, color .15s ease, transform .06s ease, box-shadow .15s ease;
                            }

                            #printPreviewModal .pp-btn:hover{
                            background:#f1f3f6;
                            }

                            #printPreviewModal .pp-btn:active{
                            transform: translateY(1px);
                            }

                            /* Cerrar  estilo elegante usando tu color de acento */
                            #printPreviewModal .pp-close{
                            background: var(--accent, #b4005c);
                            color: #fff;
                            border-color: var(--accent, #b4005c);
                            }

                            #printPreviewModal .pp-close:hover{
                            background: #a10055;            /* un tono más oscuro */
                            border-color: #a10055;
                            }

                            #printPreviewModal .pp-close:active{
                            transform: translateY(1px);
                            filter: brightness(0.96);
                            }

                            /* Estado activo suave (sin color-mix por compatibilidad) */
                            #printPreviewModal .pp-close:active{
                            filter: brightness(0.96);
                            }

                            /* Accesibilidad: foco visible */
                            #printPreviewModal .pp-btn:focus-visible{
                            outline: 2px solid var(--accent, #b4005c);
                            outline-offset: 2px;
                            box-shadow: 0 0 0 2px #fff, 0 0 0 4px rgba(180,0,92,.25);
                            }

                            /* Contenido (iframe) */
                            #printPreviewModal .pp-frame{
                            width:100%;
                            height:100%;
                            border:0;
                            background:#fff;
                            }

                            /* Responsive */
                            @media (max-width: 700px){
                            #printPreviewModal .pp-dialog{
                                width:98vw;
                                height:94vh;
                            }
                            #printPreviewModal .pp-title{
                                font-size:14px;
                            }
                            }

                            /* No mostrar el modal en impresión */
                            @media print{
                            #printPreviewModal{ display:none !important; }
                            }
                                </style>
                            `;
                        document.body.appendChild(wrap);
                        document.body.style.overflow = "hidden";

                        const frame = wrap.querySelector("#ppFrame");
                        // Carga el HTML dentro del iframe (srcdoc si existe, si no, blob)
                        if ("srcdoc" in frame) {
                            frame.srcdoc = html;
                        } else {
                            const blob = new Blob([html], { type: "text/html;charset=utf-8" });
                            const url = URL.createObjectURL(blob);
                            frame.src = url;
                            frame.dataset.blobUrl = url;
                        }

                        // Cerrar
                        const close = () => {
                            document.body.style.overflow = "";
                            if (frame.dataset.blobUrl) URL.revokeObjectURL(frame.dataset.blobUrl);
                            wrap.remove();
                            document.removeEventListener("keydown", onEsc);
                        };
                        const onEsc = (e) => { if (e.key === "Escape") close(); };
                        document.addEventListener("keydown", onEsc);
                        wrap.querySelector("#ppClose").addEventListener("click", close);
                        wrap.querySelector(".pp-backdrop").addEventListener("click", close);

                        // Imprimir (imprime el contenido del iframe)
                        wrap.querySelector("#ppPrint").addEventListener("click", () => {
                            if (frame && frame.contentWindow) frame.contentWindow.print();
                        });
                    }
                });
            </script>


        </body>

    </html>

