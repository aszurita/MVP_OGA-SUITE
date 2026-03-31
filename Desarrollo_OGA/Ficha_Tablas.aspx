<!DOCTYPE html>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls"
    Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
    <html lang="en" xmlns:mso="urn:schemas-microsoft-com:office:office"
        xmlns:msdt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882">

    <%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls"
        Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

        <head>
            <meta charset="UTF-8">
            <title>Ficha Tablas Oficiales</title>
            <link rel="icon" type="image/png" href="img/OGA_icon.png">
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

            <link rel="stylesheet" href="font/iconsmind-s/css/iconsminds.css" />
            <link rel="stylesheet" href="font/simple-line-icons/css/simple-line-icons.css" />

            <link rel="stylesheet" href="css/vendor/bootstrap.min.css" />
            <link rel="stylesheet" href="css/vendor/bootstrap.rtl.only.min.css" />
            <link rel="stylesheet" href="css/vendor/component-custom-switch.min.css" />
            <link rel="stylesheet" href="css/vendor/perfect-scrollbar.css" />
            <link rel="stylesheet" href="css/vendor/dataTables.colResize.css" />
            <link rel="stylesheet" href="css/vendor/select2.min.css" />
            <link rel="stylesheet" href="css/vendor/select2-bootstrap.min.css" />
            <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
            <link rel="stylesheet" href="css/vendor/dataTables.bootstrap4.min.css" />
            <link rel="stylesheet" href="css/vendor/buttons.bootstrap4.min.css" />
            <script>
                var n = new Date().getTime();
                document.write('<link href="css/style.css?v=' + n + '" rel="stylesheet" />');
            </script>
            <script>
                (function () {
                    var hoy = new Date();
                    var inicioNavidad = new Date(hoy.getFullYear(), 11, 1); // diciembre = 11 (0-based)
                    window.usarLogoNavidad = hoy >= inicioNavidad;
                })();
            </script>
            <link rel="stylesheet" href="css/main.css" />
            <style>
                .badge-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 5px;
                    /* Espacio entre las etiquetas */
                }

                .badge {
                    font-size: 12px;
                    white-space: nowrap;
                    /* Evita que las etiquetas se desborden */
                }

                .dataTables_length {
                    position: absolute;
                    bottom: 0;
                    right: 0;
                }

                .dataTables_length {
                    position: absolute;
                    bottom: 0;
                    right: 0;
                }

                .dataTables_info {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                }

                .no-resize {
                    resize: none !important;
                }


                .dataTables_paginate .paginate_button {
                    height: 38px;
                }


                .dataTables_wrapper .dataTables_paginate .paginate_button.next,
                .dataTables_wrapper .dataTables_paginate .paginate_button.previous {
                    height: 38px;
                }

                .disabled-button {
                    opacity: 0.5;
                    /* Reduce la opacidad para que parezca desvanecido */
                    pointer-events: none;
                    /* Evita que el botón sea tocable */
                }

                .notification-success {
                    background-color: magenta !important;
                    color: white;
                }

                .link_subrrayado {
                    cursor: pointer;
                }

                .link_subrrayado:hover {
                    text-decoration: underline;
                    color: #D2006E !important;
                }

                #modal_indicadores {
                    display: none;
                    position: fixed;
                    z-index: 9999;
                    background: #00000057;
                    top: 100px;
                    left: 50%;
                    transform: translateX(-50%);
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);

                }

                .modal-content {
                    border-radius: 10px;
                }

                .form-group {
                    margin-bottom: 0px;
                    display: flex;
                    flex-direction: column;
                    padding-right: 50px;
                    width: 170px;
                }

                .input_datos_tabla {
                    border-radius: 5px;
                    border-width: 0.1px;
                    border: none;
                    outline: none;
                    box-shadow: none;
                    pointer-events: none;
                }

                .label_datos_tabla {
                    font-weight: bold;
                }

                #modal_indicadores.active {
                    display: block !important;
                }

                .btnGuardarIndicadores {
                    background: none;
                    border: none;
                    padding: 0;
                    cursor: pointer;
                    outline: none;
                    font-size: 16px;
                    margin-right: 20px;
                    transform: translateX(10px);
                    padding-top: 0px;
                    color: rgb(210, 0, 110);
                }

                .btnGuardarIndicadores:disabled {
                    color: #696767;
                    cursor: not-allowed;
                    /* Cambia el cursor para indicar que el botón está deshabilitado */
                    opacity: 0.6;
                    /* Reduce la opacidad del botón para hacerlo parecer deshabilitado */
                }

                button.btnConsultarCalidad {
                    padding: .5rem;
                    border: 0px;
                    background-color: rgb(210, 0, 110);
                    color: white;
                    border-radius: 3px;
                }

                .modal_consulta_calidad {
                    display: none;
                    /* Oculta el modal por defecto */
                    position: fixed;
                    /* Fija el modal en la pantalla */
                    top: 13%;
                    /* Posiciona el modal en la parte superior */
                    left: 50%;
                    /* Posiciona el modal en el centro horizontal */
                    transform: translate(-50%, 0%);
                    /* Ajusta el modal para que esté perfectamente centrado */
                    z-index: 9999;
                    /* Asegura que el modal esté por encima de otros elementos */
                    background-color: white;
                    /* Color de fondo del modal */
                    padding: 20px;
                    /* Espaciado interno del modal */
                    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                    /* Sombra del modal */
                    border-radius: 10px;
                    /* Bordes redondeados */
                }

                .modal_consulta_calidad.active {
                    display: block;
                    /* Muestra el modal cuando tiene la clase 'active' */
                    width: 70%;
                    padding: 10px;
                }

                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px;
                    border-bottom: 1px solid #ddd;
                    padding: 1px;
                }

                .modal-backdrop {
                    top: 100px !important;
                    width: 110vw;
                }

                .modal {
                    top: 50px;
                }

                .btn-outline-magenta {
                    color: #D2006E !important;
                    border: 1px solid #D2006E !important;
                    background-color: transparent;
                    border-radius: 25px;
                    padding: 3% 12px;
                    font-weight: 500;
                    transition: all 0.2s ease-in-out;
                }

                .btn-outline-magenta:hover {
                    background-color: #D2006E !important;
                    color: white !important;
                }
            </style>

            <!--[if gte mso 9]><SharePoint:CTFieldRefs runat=server Prefix="mso:" FieldList="FileLeafRef"><xml>
<mso:CustomDocumentProperties>
<mso:_CopySource msdt:dt="string">http://vamos.bancoguayaquil.com/sitios/informaciongerencial/OGAsuite_Produccion/Produccion/Ficha_Atributo.aspx</mso:_CopySource>
<mso:Order msdt:dt="string">224000.000000000</mso:Order>
<mso:TemplateUrl msdt:dt="string"></mso:TemplateUrl>
<mso:xd_ProgID msdt:dt="string"></mso:xd_ProgID>
<mso:_SourceUrl msdt:dt="string"></mso:_SourceUrl>
<mso:_SharedFileIndex msdt:dt="string"></mso:_SharedFileIndex>
</mso:CustomDocumentProperties>
</xml></SharePoint:CTFieldRefs><![endif]-->
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
                        <div class="col-12 row" style="padding:18px">
                            <i class="simple-icon-arrow-left-circle m-1 regresar" onclick="history.back()"></i>
                            <h2 class="ml-3 mb-2" style="" id="Dominioname">Tablas Oficiales</h2>
                            <!--                <nav class="breadcrumb-container d-none d-sm-block d-lg-inline-block" aria-label="breadcrumb">
                        <ol class="breadcrumb pt-0" id="secciones-dominio">
                            <li class="breadcrumb-item">
                                <a href="">Estructura</a>
                            </li>
                            <li class="breadcrumb-item filtro-actual">
                                <a href="">Atributos</a>
                            </li>
                            <li class="breadcrumb-item">
                                <a href="">Artefactos</a>
                            </li>
                            <li class="breadcrumb-item">
                                <a href="">Términos</a>
                            </li>
                            <li class="breadcrumb-item">
                                <a href="">Acta de Reunión</a>
                            </li>
                            <li class="breadcrumb-item">
                                <a href="">Documentación</a>
                            </li>
                        </ol>
                    </nav> -->
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12">
                            <div class="card">
                                <div class="card-body">
                                    <div id="segmentador-container" class="some-container">
                                        <!-- Aquí­ se agregará el segmentador -->
                                    </div>
                                    <div style="padding-bottom:10px;display: flex; flex-direction: column;">
                                        <div class="d-flex align-items-center">
                                            <h3 id="nombre-dominio" class="d-inline-block font-weight mb-0 pl-1"> de
                                                Dominio</h3>
                                            <div id="caracteristicas-badges" class="pb-1">
                                            </div>
                                            <br>
                                        </div>
                                        <div class="search-sm float-md-left mr-1 mb-1 align-top d-flex align-items-center"
                                            style="width:20.6%; display:flex;margin-left:10px">
                                            <input placeholder="Buscar..." id="btn_tablas_oficiales-search"
                                                style="width: 100%;height:30px;" autocomplete="off">
                                            <i class="simple-icon-trash btn-primary"
                                                style="padding: .5rem 1rem; margin-left: 3px; cursor: pointer; border-radius: 20px;"
                                                id="btn_tablas_oficiales-trash-icon"
                                                onclick="borrarBusquedaFichaTablas()"> </i>
                                        </div>
                                        <div class="ml-2" style="min-width: 280px; width: 41%;">
                                            <label class="mb-1" for="filtro-caso-uso">Filtrar por Caso de Uso</label>
                                            <select id="filtro-caso-uso" class="form-control form-control-sm select2-single">
                                                <option value=""></option>
                                            </select>
                                        </div>
                                    </div>
                                    <table id="tablaOficial" class="table">
                                        <thead>
                                            <tr>
                                                <th>Plataforma</th>
                                                <th>Tablas</th>
                                                <th>Metadato | Campo</th>
                                                <th>Etiqueta</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
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

            <div class="modal fade" id="detalleModal2" role="dialog" aria-labelledby="detalleModalLabel"
                aria-hidden="true">
                <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">
                        <div class="modal-header p-3">
                            <h3 class="modal-title" id="detalleModalLabel2"> </h3>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="alert alert-danger alert-dismissible" id="alertado"
                                style="display: none;justify-content: center;width: 100%;align-items: center;">
                                <strong>Alerta!</strong> No se puede editar si data owner se encuentra vací­o! , Recuerda
                                : Â¡El DataOwner solicitado debe ser diferente al actual!
                            </div>
                            <div class="card mb-4">
                                <div class="card-body">
                                    <h4 class="mb-4" id="mensajeowner">No existe Data Owner asignado a la tabla</h4>
                                    <div class="row pt-3 pb-4"
                                        style="align-items:center;justify-content:space-around;padding-bottom:20px">
                                        <h7 class="col-3">Asignar data owner:</h7>
                                        <select class='form-control select2-single' data-width="70%" aria-hidden="true"
                                            id="dataownerselect">
                                            <option label="&nbsp;">&nbsp;</option>


                                        </select>
                                    </div>


                                    <div class="row mt-2"
                                        style="display:flex; align-items:center;justify-content: flex-end">






                                        <button type="button" class="btn btn-secondary p-3 float-right"
                                            id="btnownerSolicitud">Solicitar</button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            <div class="modal fade" id="detalleModal4" role="dialog" aria-labelledby="detalleModalLabel"
                aria-hidden="true">
                <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">
                        <div class="modal-header p-3">
                            <h3 class="modal-title" id="detalleModalLabel4"> </h3>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="alert alert-danger alert-dismissible" id="alertado_steward"
                                style="display: none;justify-content: center;width: 100%;align-items: center;">
                                <strong>Alerta!</strong> No se puede editar si data steward se encuentra vací­o! ,
                                Recuerda : Â¡El DataSteward solicitado debe ser diferente al actual!

                            </div>
                            <div class="card mb-4">
                                <div class="card-body">
                                    <h4 class="mb-4" id="mensajesteward">No existe Data Steward asignado a la tabla</h4>
                                    <div class="row pt-3 pb-4"
                                        style="align-items:center;justify-content:space-around;padding-bottom:20px">
                                        <h7 class="col-3">Asignar data steward:</h7>
                                        <select class='form-control select2-single' data-width="70%" aria-hidden="true"
                                            id="dataselect">
                                            <option label="&nbsp;">&nbsp;</option>


                                        </select>
                                    </div>

                                    <div class="row mt-2"
                                        style="display:flex; align-items:center;justify-content: flex-end">
                                        <button id="btnstewardSolicitud" type="button"
                                            class="btn btn-secondary p-3 float-right">Solicitar</button>







                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal Indicadores de Calidad para Tablas -->
            <!-- Modal Indicadores de Calidad para Tablas -->
            <div id="modal_indicadores" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-xl" role="document" style="max-width: 85%;">
                    <div class="modal-content"
                        style="height: 85vh; overflow-y: auto; padding: 1%; border-radius: 10px;">

                        <div class="modal-header" style="padding: 10px;">
                            <h2>Indicadores de calidad</h2>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Cerrar">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>

                        <div id="modal_indicadores_content" class="modal-body row">

                            <!-- Columna Izquierda -->
                            <div class="col-3" id="modal_indicadores_izq">
                                <div style="width: 100%;">
                                    <button id="btnConsultarIndicadores" class="btnConsultarCalidad"
                                        data-toggle="tooltip" title="Detalle de indicadores">
                                        Ver detalle de indicadores
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                            fill="currentColor" class="bi bi-binoculars-fill" viewBox="0 0 16 16">
                                            <path
                                                d="M4.5 1A1.5 1.5 0 0 0 3 2.5V3h4v-.5A1.5 1.5 0 0 0 5.5 1zM7 4v1h2V4h4v.882a.5.5 0 0 0 .276.447l.895.447A1.5 1.5 0 0 1 15 7.118V13H9v-1.5a.5.5 0 0 1 .146-.354l.854-.853V9.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v.793l.854.853A.5.5 0 0 1 7 11.5V13H1V7.118a1.5 1.5 0 0 1 .83-1.342l.894-.447A.5.5 0 0 0 3 4.882V4zM1 14v.5A1.5 1.5 0 0 0 2.5 16h3A1.5 1.5 0 0 0 7 14.5V14zm8 0v.5a1.5 1.5 0 0 0 1.5 1.5h3a1.5 1.5 0 0 0 1.5-1.5V14zm4-11H9v-.5A1.5 1.5 0 0 1 10.5 1h1A1.5 1.5 0 0 1 13 2.5z" />
                                        </svg>
                                    </button>
                                </div>

                                <div class="card" style="margin-top: 1.5rem;">
                                    <div class="card-body pt-3" style="padding: 0.75rem;">
                                        <div id="lista-atributos-calidad" class="ml-1 d-flex flex-column overflow-auto"
                                            style="height: 280px;">
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Columna Derecha -->
                            <div class="col-9" id="modal_indicadores_der">
                                <div class="datos_tabla"
                                    style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 5px;">
                                    <h5 id="atributo-actual">Seleccione un atributo</h5>
                                </div>

                                <div class="datos_tabla"
                                    style="display: flex; flex-direction: row; justify-content: space-between; padding-left: 1%; padding-right: 5%; gap: 4%; width: 100%;">

                                    <div class="datos_tabla_wrap" style="display: flex; flex-direction: column;">
                                        <div class="form-group" style="display: flex; flex-direction: row;">
                                            <label class="label_datos_tabla" for="Aprovisionamiento">Plataforma:</label>
                                            <input class="input_datos_tabla" type="text" id="Aprovisionamiento" readonly
                                                style="padding-bottom: 8px;">
                                        </div>

                                        <div class="form-group" style="display: flex; flex-direction: row;">
                                            <label class="label_datos_tabla" for="servidor">Servidor:</label>
                                            <input class="input_datos_tabla" type="text" id="servidor" readonly
                                                style="padding-bottom: 8px;">
                                        </div>
                                    </div>

                                    <div class="datos_tabla_wrap" style="display: flex; flex-direction: column;">
                                        <div class="form-group" style="display: flex; flex-direction: row;">
                                            <label class="label_datos_tabla" for="base">Base:</label>
                                            <input class="input_datos_tabla" type="text" id="base" readonly
                                                style="padding-bottom: 8px;">
                                        </div>

                                        <div class="form-group" style="display: flex; flex-direction: row;">
                                            <label class="label_datos_tabla" for="Esquema">Esquema:</label>
                                            <input class="input_datos_tabla" type="text" id="Esquema" readonly
                                                style="padding-bottom: 8px;">
                                        </div>
                                    </div>

                                    <div class="datos_tabla_wrap" style="display: flex; flex-direction: column;">
                                        <div class="form-group" style="display: flex; flex-direction: row;">
                                            <label class="label_datos_tabla" for="campo">Campo:</label>
                                            <input class="input_datos_tabla" type="text" id="campo" readonly
                                                style="padding-bottom: 8px;">
                                        </div>

                                        <div class="form-group" style="display: flex; flex-direction: row;">
                                            <label class="label_datos_tabla" for="nombre-tabla">Tabla:</label>
                                            <input class="input_datos_tabla" type="text" id="nombre-tabla" readonly
                                                style="padding-bottom: 8px;">
                                        </div>
                                    </div>

                                    <div class="datos_tabla_wrap" style="display: flex; flex-direction: column;">
                                        <div class="form-group" style="display: flex; flex-direction: row;">
                                            <label class="label_datos_tabla" for="documentacion">Documentación:</label>
                                            <input class="input_datos_tabla" type="text" id="documentacion" readonly
                                                style="padding-bottom: 8px;">
                                        </div>

                                        <div class="form-group" style="display: flex; flex-direction: row;">
                                            <!-- AGREGADO: Botón Guardar Todo -->
                                            <button id="btnGuardarTodosIndicadores" type="button"
                                                class="btn btn-outline-magenta mb-1">Guardar Todo</button>
                                        </div>
                                    </div>

                                </div>

                                <table id="indicadores_calidad" class="table tabla_indicadores_calidad">
                                    <thead>
                                        <tr>
                                            <th>No aplica</th>
                                            <th>Indicadores</th>
                                            <th>id_dimension</th>
                                            <th>Valor</th>
                                            <th>Reglas</th>
                                            <th>Usuario</th>
                                            <th>Última modificación</th>
                                            <th>Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <!-- Se llena dinámicamente -->
                                    </tbody>
                                </table>
                            </div>

                        </div>

                    </div>
                </div>
            </div>


            <!-- Modal tabla de consulta de calidad -->
            <div id="modal_consulta_calidad" class="modal_consulta_calidad">
                <div class="modal-header">
                    <h2>Consulta de indicadores de calidad</h2>
                    <span class="close_consulta">&times;</span>
                </div>
                <div style="overflow-x: auto;">
                    <table id="consulta_indicadores_calidad" class="table">
                        <thead>
                            <tr>
                                <th>Nombre de Entidad</th>
                                <th>Atributo</th>
                                <th>Dimension</th>
                                <th>Valor</th>
                                <th>Usuario Actualizacion</th>
                                <th>Fecha Actualizacion</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
            </div>





            <div id="detalleModal7" class="modal fade " tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header p-3">
                            <h5 class="modal-title" id="detalleDeleteDominio">Dominios </h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body ">
                            <h6 id="modalquestion" class="pt-2 pb-3"></h6>
                            <div class="row ml-1 pt-2 pb-2">
                                <label class=" custom-control custom-checkbox mb-1  ">
                                    <input type="checkbox" id="checkdominio" class="custom-control-input">
                                    <span class="custom-control-label">&nbsp;</span>
                                </label>
                                <h6 id="alldominios" class="col-11 pl-1" style="font-size:15.5px"></h6>
                            </div>


                            <button type="button" id="btnDeleteDominio" data-dismiss="modal"
                                class="btn btn-primary float-right mt-4 mb-1">Guardar</button>

                        </div>
                    </div>
                </div>
            </div>

            <div class="modal fade" id="detalleModal9" tabindex="-1" role="dialog" aria-labelledby="detalleModalLabel9"
                aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="detalleModalLabel9">Administración de Etiquetas</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="alert alert-danger alert-dismissible" id="alertado_etiqueta"
                                style="display: none; justify-content: center; width: 100%; align-items: center;">
                                <strong>Alerta!</strong> No se puede añadir etiqueta si el campo esta vacio!
                            </div>
                            <h6 id="etiquetasTitulo">Seleccione una o más etiquetas que describan la tabla:</h6>
                            <select class="form-control" id="etiquetasCampo" multiple="multiple">
                                <!-- Las etiquetas se agregarán aquí­ -->
                            </select>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" id="btnEtiquetas">Guardar</button>
                        </div>
                    </div>
                </div>
            </div>



            <script src="js/vendor/jquery-3.3.1.min.js"></script>
            <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>
            <script src="js/vendor/bootstrap.bundle.min.js"></script>
            <script src="js/vendor/perfect-scrollbar.min.js"></script>
            <script src="js/vendor/mousetrap.min.js"></script>
            <script src="js/vendor/Chart.bundle.min.js"></script>
            <script src="js/vendor/chartjs-plugin-datalabels.js"></script>

            <script src="js/dore.script.js"></script>


            <script src="js/scripts.single.theme.js"></script>
            <script src="js/jquery.SPServices.v2014-02.min.js"></script>
            <script src="js/dore-plugins/select.from.library.js"></script>
            <script src="js/vendor/datatables.min.js"></script>
            <script src="js/vendor/buttons.dataTables.min.js"></script>
            <script src="js/vendor/jszip.min.js"></script>
            <script src="js/vendor/buttons.html5.min.js"></script>
            <script src="js/vendor/dataTables.Resize.js"></script>
            <script src="js/vendor/select2.full.js"></script>
            <script src="js/pagination.min.js"></script>
            <script src="js/vendor/bootstrap-notify.min.js"></script>
            <script src="js/profilingFunctions/buscarArchivos.js"></script>
            <script src="js/profilingFunctions/estadoProfiling.js"></script>
            <script src="js/profilingFunctions/generarProfiling.js"></script>
            <script src="js/profilingFunctions/mostrarPopupProfiling.js"></script>
            <script src="js/profilingFunctions/obtenerEtiquetaEstado.js"></script>
            <script src="js/profilingFunctions/visualizarArchivoReciente.js"></script>
            <script src="js/profilingFunctions/visualizarProfiling.js"></script>
            <script src="js/Fichas_Tablas/cargarTodosAtributosCalidadDesdeCatalogoCompleto.js"></script>
            <script src="js/Fichas_Tablas/construirCatalogoConEstado.js"></script>
            <script src="js/Fichas_Tablas/insertarIconosCalidadEnTabla.js"></script>
            <script>
                var n = new Date().getTime();
                document.write('<script src="js/suite.js?v=' + n + '"> <' + '/' + 'script>');
            </script>
            <script src="js/Fichas_Tablas/abrirModalIndicadores.js"></script>
            <script src="js/Fichas_Tablas/cargarAtributosCalidad.js"></script>
            <script src="js/Fichas_Tablas/cargarIndicadoresPorAtributo.js"></script>
            <script src="js/Fichas_Tablas/cerrarModalIndicadores.js"></script>
            <script src="js/Fichas_Tablas/getCatalogoIndicadores.js"></script>
            <script src="js/Fichas_Tablas/precargarPorcentajesCalidad.js"></script>
            <!--Accion para abir modal de consulta de listado de tablas con atributos -->
            <script>
                // Modal de consulta indicadores
                let modal_consulta = document.getElementById("modal_consulta_calidad");
                let btn_consulta = document.getElementById("btnConsultarIndicadores");
                let span_consulta = document.getElementsByClassName("close_consulta")[0];

                if (btn_consulta) {
                    btn_consulta.onclick = function () {
                        registrar_visita("INDICADORES DE CALIDAD", "CONSULTA DE INDICADORES DE CALIDAD");
                        modal_consulta.classList.add('active');
                    };
                }

                if (span_consulta) {
                    span_consulta.onclick = function () {
                        modal_consulta.classList.remove('active');
                    };
                }

                window.onclick = function (event) {
                    if (event.target === modal_consulta) {
                        modal_consulta.classList.remove('active');
                    }
                };

            </script>
            <script>
                window.calidadTablasOficiales = getAutocompletadoTablas(); // función existente

                $(document).ready(function () {
                    $("#modal_indicadores .close").on("click", function () {
                        $("#modal_indicadores").removeClass("active");
                        cerrarModalIndicadores();
                    });
                });

                // Código para abrir y cerrar el modal
                var modal = document.getElementById("modal_indicadores");
                var span = document.getElementsByClassName("close")[0];

                span.onclick = function () {
                    modal.classList.remove('active');
                }

                window.onclick = function (event) {
                    if (event.target == document.getElementById("modal_indicadores")) {
                        cerrarModalIndicadores();
                    }
                }

                $(document).ready(async function () { 
                   await fichaTablas(); // carga catalogoCompleto
                });
            </script>
        </body>

    </html>

