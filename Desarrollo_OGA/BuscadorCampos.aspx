<!DOCTYPE html>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls"
    Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
    <html lang="en" xmlns:mso="urn:schemas-microsoft-com:office:office"
        xmlns:msdt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882">

    <%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls"
        Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

        <head>
            <meta charset="UTF-8">
            <title>Explorador de Metadatos</title>
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
            <link rel="stylesheet" href="css/pagination.css" />
            <input type="file" id="excelUpload" accept=".xlsx,.xls" style="display:none" />
            <script src="https://cdn.jsdelivr.net/npm/xlsx/dist/xlsx.full.min.js"></script>

            <style>
                .loader-dots {
                    background-color: "#D2006";
                    color: #fff;
                    font-weight: bold;
                    border-radius: 3px;
                    border: 1px;
                    display: block;
                    text-align: center;
                }

                .loader-dots:after {
                    content: '....';
                    width: 0;
                    position: absolute;
                    overflow: hidden;
                    animation: loader-dots-animation 2s infinite;
                }

                @keyframes loader-dots-animation {
                    0% {
                        width: 0em;
                    }

                    50% {
                        width: 1.2em;
                    }

                    100% {
                        width: 0em;
                    }
                }

                .datos-cargados {
                    background-color: #00b30c;
                    color: #fff;
                    font-weight: bold;
                    border-radius: 3px;
                    border: 1px;
                    display: block;
                    text-align: center;
                }

                .dropdown-menu li {
                    position: relative;
                }

                .dropdown-menu .dropdown-submenu {
                    display: none;
                    position: absolute;
                    left: 100%;
                    top: -7px;
                }

                .dropdown-menu .dropdown-submenu-left {
                    right: 100%;
                    left: auto;
                }

                .dropdown-menu>li:hover>.dropdown-submenu {
                    display: block;
                }

                .dataTables_wrapper {
                    font-size: 11.7px;
                }

                .link_subrrayado {
                    cursor: pointer;
                }

                .link_subrrayado:hover {
                    text-decoration: underline;
                }

                /* Estilo para el tooltip */
                .tooltip-container {
                    position: relative;
                    display: inline-block;
                }

                .tooltip-container .tooltip-text {
                    visibility: hidden;
                    width: 200px;
                    background-color: #333;
                    color: #fff;
                    text-align: center;
                    border-radius: 5px;
                    padding: 5px;
                    position: absolute;
                    z-index: 1;
                    bottom: 125%;
                    /* Cambiar según la posición deseada */
                    left: 50%;
                    margin-left: -100px;
                    opacity: 0;
                    transition: opacity 0.3s;
                }

                .tooltip-container:hover .tooltip-text {
                    visibility: visible;
                    opacity: 1;
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
                    top: 14%;
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
<mso:_CopySource msdt:dt="string">http://vamos.bancoguayaquil.com/sitios/informaciongerencial/OGAsuite_Produccion/Produccion/BuscadorCampos.aspx</mso:_CopySource>
<mso:Order msdt:dt="string">233500.000000000</mso:Order>
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

                    <!-- <div class="search" data-search-path="Pages.Search.html?q=">
                <input placeholder="Buscar...">
                <span class="search-icon">
                    <i class="simple-icon-magnifier"></i>
                </span>
            </div> -->
                </div>

                <a class="navbar-logo" href="OGASuite.aspx">
                    <img id="logo-navbar" class="logo logo--invert d-none d-xs-block" src="logos/oga_color.png"
                        data-logo-default="logos/oga_color.png" data-logo-navidad="logos/oga_navidad.png">
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

                        <div class="position-relative d-inline-block">
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
                            <li class="active">
                                <a href="#">
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
                        <div class="col-12">
                            <div class="">
                                <h1>Explorador de Metadatos</h1>
                                <div class="loader-dots col-2 mb-1" id="status_carga"
                                    style="background-color:white;color:#D2006E">Cargando datos, espere</div>
                            </div>
                            <div class="mb-2">
                                <div class="collapse d-md-block" id="displayOptions">
                                    <div class="d-block d-md-inline-block" id="Barrabusqueda" style="width: 100%;">
                                        <button class="btn btn-outline-dark btn-xs dropdown-toggle float-md-left"
                                            style="height:30px;" type="button" data-toggle="dropdown"
                                            aria-haspopup="true" aria-expanded="false"
                                            id="dropdown-buscador">Campo</button>
                                        <div class="dropdown-menu">
                                            <a class="dropdown-item" id="opcionfiltro">Tabla</a>
                                            <a class="dropdown-item" id="opcionfiltro2">Atributo</a>
                                        </div>
                                        <div class="search-sm float-md-left mr-1 mb-1 align-top"
                                            style="width:20.6%; display:flex;margin-left:10px">
                                            <input placeholder="Buscar..." id="campos-search"
                                                style="width: 100%;height:30px;" autocomplete="off">
                                            <i class="simple-icon-trash" id="campos-buscar"
                                                onclick="borrarFiltrosBuscadorCampos()"> </i>
                                            <div id="preloader_1" style="height:30px;">
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                            </div>
                                        </div>



                                    </div>

                                </div>
                            </div>
                            <div class="separator mb-3"></div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-3" id="columna-arbol" style="display: none;">
                            <div class="card">
                                <div class="card-body">
                                    <div class="arbol" id="arbol_campos">
                                        <ul class="list-unstyled" id="menuTypes" style="display: block;">
                                            <li class="ml-0">
                                                <a href="#" data-toggle="collapse" data-target="#collapseMenuLevel"
                                                    aria-expanded="true" aria-controls="collapseMenuLevel"
                                                    class="rotate-arrow-icon collapsed">
                                                    <i class="simple-icon-arrow-down"></i> <span
                                                        class="d-inline-block">Menu Levels</span>
                                                </a>
                                                <div id="collapseMenuLevel" class="collapse" data-parent="#menuTypes">
                                                    <ul class="list-unstyled inner-level-menu">
                                                        <li>
                                                            <a href="#">
                                                                <i class="simple-icon-layers"></i> <span
                                                                    class="d-inline-block">Sub
                                                                    Level</span>
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a href="#" data-toggle="collapse"
                                                                data-target="#collapseMenuLevel2" aria-expanded="true"
                                                                aria-controls="collapseMenuLevel2"
                                                                class="rotate-arrow-icon collapsed">
                                                                <i class="simple-icon-arrow-down"></i> <span
                                                                    class="d-inline-block">Another
                                                                    Level</span>
                                                            </a>
                                                            <div id="collapseMenuLevel2" class="collapse">
                                                                <ul class="list-unstyled inner-level-menu">
                                                                    <li>
                                                                        <a href="#">
                                                                            <i class="simple-icon-layers"></i> <span
                                                                                class="d-inline-block">Sub
                                                                                Level</span>
                                                                        </a>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12" id="columna-datatable" style="position: relative;">
                            <div id="loading" class="text-center" style="">
                                <div class="spinner-border" role="status">
                                    <span class="sr-only">Cargando...</span>
                                </div>
                            </div>
                            <div class="mb-2">

                                <div class="d-flex justify-content-end align-items-center mb-2">


                                    <!-- Icono Subir Excel -->
                                    <span id="uploadInline" class="ml-2">
                                        <i id="btnSubirExcel" class="simple-icon-cloud-upload btn-icon"
                                            data-toggle="tooltip" data-placement="bottom"
                                            title="Importar archivo Excel"></i>
                                        <input id="excelUpload" type="file" accept=".xlsx,.xls" style="display:none" />
                                        <!-- Botón Recomendación Automática -->
                                        <i id="btnRecomendarDef" class="iconsminds-idea btn-icon mb-2"
                                            data-toggle="tooltip" data-placement="bottom"
                                            title="Recomendación automática de definiciones"></i>
                                    </span>


                                </div>

                                <style>
                                    .btn-icon {
                                        cursor: pointer;
                                        font-size: 22px;
                                        color: #D2006E;
                                        /* magenta corporativo */
                                        transition: transform .2s ease, color .2s ease;
                                    }

                                    .btn-icon:hover {
                                        color: #a00052;
                                        /* tono más oscuro en hover */
                                        transform: scale(1.2);
                                    }

                                    .btn-icon-only {
                                        background: none !important;
                                        border: none !important;
                                        padding: 0 !important;
                                        box-shadow: none !important;
                                    }

                                    .btn-icon {
                                        cursor: pointer;
                                        font-size: 22px;
                                        color: #D2006E;
                                        /* magenta corporativo */
                                        transition: transform .2s ease, color .2s ease;
                                    }

                                    .btn-icon:hover {
                                        color: #a00052;
                                        /* más oscuro en hover */
                                        transform: scale(1.2);
                                    }
                                </style>

                                <script>
                                    // Inicializa tooltip de Bootstrap solo cuando jQuery estЂ disponible
                                    (function initTooltipsSafely() {
                                        const init = function () {
                                            if (window.jQuery && typeof window.jQuery.fn.tooltip === "function") {
                                                window.jQuery(function () {
                                                    $('[data-toggle="tooltip"]').tooltip();
                                                });
                                                return true;
                                            }
                                            return false;
                                        };

                                        if (!init()) {
                                            document.addEventListener("DOMContentLoaded", function () {
                                                init();
                                            });
                                        }
                                    })();

                                    document.addEventListener('DOMContentLoaded', () => {
                                        const el = document.getElementById('btnDescargarExcel');
                                        if (!el) return;

                                        el.addEventListener('click', function () {
                                        });
                                    });
                                </script>


                                <table id="campos" class="table">
                                    <div class="col-6" id="ownertitle" style="display: none;">

                                        <h6 id="ownertext" class="card-title" style="visibility: hidden;"></h6>
                                    </div>

                                    <thead>
                                        <tr>
                                            <th data-column="0">Campo</th>
                                            <th data-column="1">Código</th>
                                            <th data-column="2">Atributo</th>
                                            <th data-column="3">Definición</th>
                                            <th data-column="4">Plataforma</th>
                                            <th data-column="5">Servidor</th>
                                            <th data-column="6">Base</th>
                                            <th data-column="7">Esquema</th>
                                            <th data-column="8">Tabla</th>
                                            <th data-column="9">Tipo</th>
                                            <th data-column="10">Largo</th>
                                            <th data-column="11">Permite NULL</th>
                                            <th data-column="12">Descripción</th>
                                            <th data-column="13">Clasificación</th>
                                            <th data-column="14">Avance (%)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                </table>
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



            <div class="modal fade" id="modalAtributo" role="dialog" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header pb-3 pt-3">
                            <h5 class="modal-title" id="exampleModalContentLabel">Agregar Atributo</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <form>
                                <div class="form-row">
                                    <div class="form-group col-md-6">
                                        <label for="tipo" class="col-form-label">Tipo:</label>
                                        <select type="text" class="form-control" id="tipo">
                                            <option value="ATRIBUTO">Atributo</option>
                                        </select>
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label for="idatributo" class="col-form-label">ID:</label>
                                        <input type="text" class="form-control" id="idatributo">
                                    </div>
                                </div>

                                <div class="form-row">
                                    <div class="form-group col-md-6">
                                        <label for="nombrea" class="col-form-label">Nombre Atributo:</label>
                                        <textarea class="form-control" id="NOMBREA"></textarea>
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label for="Descripcion" class="col-form-label">Descripción Atributo:</label>
                                        <textarea class="form-control" id="Descripcion"></textarea>
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group col-md-6">
                                        <label for="nombred" class="col-form-label">Dominio:</label>
                                        <select data-width="100%"
                                            class="form-control select2-multiple select2-hidden-accessible"
                                            multiple="multiple" aria-hidden="true" type="text" id="nombred">
                                            <option label="&nbsp;">&nbsp;</option>
                                        </select>
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label for="nombresub" class="col-form-label">Subdominio:</label>
                                        <select data-width="100%" type="text"
                                            class="form-control select2-multiple select2-hidden-accessible"
                                            multiple="multiple" aria-hidden="true" type="text" id="nombresub">
                                            <option label="&nbsp;">&nbsp;</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group col-md-6">
                                        <label for="nombred" class="col-form-label">Subcategorí­a:</label>
                                        <input disabled placeholder="EN REVISIÓN" type="text" class="form-control"
                                            id="nombresubcategoria1">
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label for="nombresub" class="col-form-label">Tipo de atributo:</label>
                                        <select data-width="100%" type="text"
                                            class="form-control select2-multiple select2-hidden-accessible"
                                            multiple="multiple" aria-hidden="true" type="text" id="nombrecaract">
                                            <option label="&nbsp;">&nbsp;</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group col-md-6">
                                        <label for="nombred" class="col-form-label">Dato Personal:</label>
                                        <select data-width="100%" class="form-control " aria-hidden="true" type="text"
                                            id="datopersonal">
                                            <option label="&nbsp;">&nbsp;</option>
                                            <option value="1">Si</option>
                                            <option value="0">No</option>
                                        </select>
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label for="nombresub" class="col-form-label">Golden Record:</label>
                                        <select data-width="100%" type="text" class="form-control " aria-hidden="true"
                                            type="text" id="goldenrecord">
                                            <option label="&nbsp;">&nbsp;</option>
                                            <option value="1">Si</option>
                                            <option value="0">No</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group ">
                                    <label for="catalogos" class="col-form-label">Catálogos Asociados:</label>
                                    <select data-width="100%"
                                        class="form-control select2-multiple select2-hidden-accessible"
                                        multiple="multiple" aria-hidden="true" type="text" id="catalogos">
                                        <option label="&nbsp;">&nbsp;</option>
                                    </select>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" id="btnagregaratributo" class="btn btn-primary ">Guardar</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal fade" id="detalleModal1" tabindex="-1" role="dialog" aria-labelledby="detalleModalLabel"
                aria-hidden="true">
                <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">
                        <div class="modal-header p-3">
                            <h3 class="modal-title" id="detalleModalLabel1"> </h3>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="alert alert-danger alert-dismissible" id="alertadetalle"
                                style="display: none;justify-content: center;width: 100%;align-items: center;">
                                <strong>Alerta!</strong> No se puede editar si la definición se encuentra vací­a!
                            </div>
                            <div class="alert alert-danger alert-dismissible" id="alertano"
                                style="display: none;justify-content: center;width: 100%;align-items: center;">
                                <strong>Alerta!</strong>
                                Ya existe un atributo asignado a este campo!
                            </div>
                            <div class="card mb-4">
                                <div class="card-body">
                                    <h4 class="mb-4" id="definicionCampo">Editar texto:</h4>
                                    <div class="">
                                        <div class="input-group" style="width:100%;height:80px">
                                        </div>
                                        <div class="mt-3" style="display: flex;justify-content: flex-end;">
                                            <button id="btndetalle" type="button"
                                                class="btn btn-secondary p-3 ">Guardar</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


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
                                <strong>Alerta!</strong> No se puede editar si data owner se encuentra vací­o! ,
                                Recuerda
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





                                        <button id="btnownerSolicitud" type="button"
                                            class="btn btn-secondary p-3 float-right">Solicitar</button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>




            <div class="modal fade" id="detalleModal3" role="dialog" aria-labelledby="detalleModalLabel"
                aria-hidden="true" style="z-index: 1045;">
                <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">
                        <div class="modal-header p-3">
                            <h3 class="modal-title" id="detalleModalLabel3"> </h3>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="card mb-4">
                                <div class="card-body">
                                    <div class="float-md-right mr-1">
                                        <i class="iconsminds-add btn-primary rounded" onclick="addAtributo()"
                                            id="nuevoatributo" data-toggle="tooltip" data-placement="bottom"
                                            data-original-title="Nuevo Atributo"
                                            style="font-size:20px;cursor: pointer;"></i>
                                    </div>
                                    <div class="alert alert-danger alert-dismissible" id="alertaatributo"
                                        style="display: none;justify-content: center;width: 100%;align-items: center;">
                                        <strong>Alerta!</strong> No se puede editar si el atributo se encuentra vací­o!
                                    </div>
                                    <h4 class="mb-4">Seleccione un atributo</h4>
                                    <div class="row pb-3 pt-3"
                                        style="display:flex; align-items:center;justify-content:center"
                                        id="select-atributo-wrapper">
                                    </div>
                                    <div class="row pb-3 pt-3"
                                        style="display:flex; align-items:center; justify-content: center;"
                                        id="input-atributo-detalle-wrapper">
                                        <label for="input-atributo-detalle" style="width: 80%;">(Opcional)</label>
                                        <input placeholder="" value="" id="input-atributo-detalle" class="form-control"
                                            style="width: 80%;" />
                                    </div>

                                    <div class="row mt-3"
                                        style="display:flex; align-items:center;justify-content: flex-end">



                                        <button type="button" id="btnatributo"
                                            class="btn btn-secondary p-3 float-right">Guardar</button>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal documentación de campo -->
            <div class="modal fade" id="modalDocumentacionCampo" role="dialog"
                aria-labelledby="modalDocumentacionCampoLabel" aria-hidden="true" style="z-index: 1045;">
                <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">
                        <div class="modal-header p-3">
                            <h3 class="modal-title" id="modalDocumentacionCampoLabel"> </h3>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">

                            <div class="form-section">
                                <div class="full-width">
                                    <label for="detalleCampo">Definición de campo (Explicación)</label>
                                    <textarea id="detalleCampo" class="form-control" rows="4"
                                        aria-label="With textarea"></textarea>
                                </div>

                                <div>
                                    <label for="atributoselect">Asignar atributo</label>
                                    <select class="form-control select2-single" data-width="100%" id="atributoselect">
                                        <option label="&nbsp;">&nbsp;</option>
                                    </select>
                                </div>

                                <div class="pb-2">
                                    <i class="simple-icon-plus btn-icon" onclick="addAtributo()" id="nuevoatributo"
                                        data-toggle="tooltip" data-original-title="Nuevo Atributo"></i>
                                </div>
                            </div>
                            <div class="alert alert-danger alert-dismissible mt-3" id="alertaatributo"
                                style="display: none;">
                                <strong>Â¡Alerta!</strong> No se puede editar si el atributo se encuentra vací­o.
                            </div>

                            <div class="mt-4 d-flex justify-content-end">
                                <button type="button" id="btnDocumentacionCampo"
                                    class="btn btn-primary">Guardar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal de Confirmación
        <div class="modal fade" id="confirmModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" >
            <div class="modal-dialog" role="document">
                <div class="modal-content" style="border: 2px solid #cfcfcf;">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Confirmación</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                    Â¿Desea también agregar una definición?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal" id="confirmNo">No</button>
                        <button type="button" id="confirmYes" class="btn btn-primary">Sí­</button>
                    </div>
                </div>
            </div>
        </div> -->

            <!-- Modal de Confirmación -->
            <div class="modal fade" id="confirmModal" tabindex="-1" role="dialog" aria-labelledby="confirmModalLabel"
                aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content border-0 shadow-lg" style="border-radius: 8px;">
                        <div class="modal-header border-0" style="padding: 1rem 1.5rem;">
                            <h5 class="modal-title font-weight-bold" id="confirmModalLabel">Confirmación</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"
                                style="outline: none;">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body" style="padding: 1.5rem; font-size: clamp(1rem, 1.5vw, 1.2rem);">
                            ¿Desea también agregar una definición?
                        </div>

                        <div class="modal-footer border-0" style="padding: 1rem 1.5rem;">
                            <button type="button" class="btn btn-outline-secondary" id="btnConfirmNo">No</button>
                            <button type="button" id="btnConfirmYes" class="btn btn-primary">Sí­</button>
                        </div>
                    </div>
                </div>
            </div>



            <div class="modal fade" id="buscadorowners" role="dialog" aria-labelledby="detalleModalLabel"
                aria-hidden="true">
                <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content" id="modalcontentdo">
                        <div class="modal-header p-3">
                            <h5 class="modal-title" id="detalleModalLabel">Data Owner / Data Steward </h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>

                        <div class="modal-body">
                            <div class="alert alert-danger alert-dismissible" id="alerta"
                                style="display: none;justify-content: center;width: 100%;align-items: center;">
                                <strong>Alerta!</strong> El campo que desea eliminar se encuentra vací­o.
                            </div>
                            <div class="row"
                                style="justify-content: space-between; align-items:center;padding-bottom:20px;padding-top:5px;padding-left:35px">
                                <div class="row">
                                    <button
                                        class="btn btn-outline-dark btn-xs dropdown-toggle btnreporte float-md-left mr-2"
                                        style="border-color:#c0c0c0 ;" type="button" data-toggle="dropdown"
                                        aria-haspopup="true" aria-expanded="false" id="dropdown-reporte">Data
                                        Owner</button>
                                    <div class="dropdown-menu" style="padding: 2px;cursor:pointer">
                                        <a class="dropdown-item" id="opcionreporte">Data Steward</a>

                                    </div>
                                    <select class='form-control select2-single' data-width="230px" aria-hidden="true"
                                        id="dataownerselect2">
                                        <option label="&nbsp;">&nbsp;</option>


                                    </select>
                                    <i class="iconsminds-magnifi-glass float-right" data-toggle="tooltip"
                                        data-placement="bottom" data-original-title="Buscar" id="buscadorDO"
                                        style="font-size: 18px;"></i>

                                </div>
                                <i class="simple-icon-people float-right" data-toggle="tooltip" data-placement="bottom"
                                    data-original-title="Todos" id="todosowner"
                                    style="font-size: 21px;color:gray;margin-right:25px"></i>


                            </div>
                            <div class="separator mb-3"></div>

                            <table id="bOwner" class="table" style="font-size: 11.7px;">
                                <thead>
                                    <tr>
                                        <th>Data Owner</th>
                                        <th>Data Steward</th>
                                        <th>Plataforma</th>
                                        <th>Servidor</th>
                                        <th>Base</th>
                                        <th>Esquema</th>
                                        <th>Tabla</th>
                                    </tr>
                                </thead>
                                <tbody>
                                </tbody>
                            </table>

                        </div>
                    </div>
                </div>
            </div>


            <div id="modalDelete" data-backdrop="false" class="modal fade show" tabindex="-1" role="dialog"
                aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header p-3">
                            <h5 class="modal-title" id="detalleDelete"> </h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <h6 id="modalquestion"></h6>

                            <div class="modal-footer">

                                <button type="button" id="btnDelete" data-dismiss="modal"
                                    class="btn btn-primary">Guardar</button>
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
                            <div class="alert alert-danger alert-dismissible" id="alertads"
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


            <div class="modal fade" id="detalleModal5" role="dialog" aria-labelledby="detalleModalLabel"
                aria-hidden="true">
                <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">
                        <div class="modal-header p-3">
                            <h3 class="modal-title" id="detalleModalLabel5"> </h3>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="alert alert-danger alert-dismissible" id="alertadominio"
                                style="display: none;justify-content: center;width: 100%;align-items: center;">
                                <strong>Alerta!</strong> No se puede enviar la solicitud: Verifique que ha seleccionado
                                una clasificación y un dominio requerido, y que ambos sean diferentes a los actuales.
                            </div>

                            <div class="alert alert-danger alert-dismissible" id="alertadominio_Verificacion"
                                style="display: none;justify-content: center;width: 100%;align-items: center;">
                                <strong>Alerta!</strong> Ya existe una solicitud en proceso con los mismos datos que se
                                estan enviando.
                            </div>
                            <div class="card mb-4">
                                <div class="card-body">
                                    <h6 class="mb-4" id="etiquetatabla">Etiquetar tabla</h6>
                                    <div class="row pt-3 pb-4"
                                        style="align-items:center;justify-content:space-around;padding-bottom:20px">
                                        <h7 class="col-3">Asignar etiqueta:</h7>
                                        <select class="form-control select2-single" style="width: 60%;"
                                            id="clasificacionselect">
                                            <option label="&nbsp;">&nbsp;</option>
                                        </select>

                                    </div>
                                    <div class="row pt-3 pb-4"
                                        style="align-items:center;justify-content:space-around;padding-bottom:20px">
                                        <h7 class="col-3">Clasificación medallón:</h7>
                                        <select class="form-control select2-single" style="width: 60%;"
                                            id="medallonselect">
                                            <option label="&nbsp;">&nbsp;</option>
                                            <option value="BRONCE">Bronce</option>
                                            <option value="PLATA">Plata</option>
                                            <option value="ORO">Oro</option>
                                        </select>

                                    </div>
                                    <div id="divClasificacion" style="display: none;" class="mt-3">
                                        <h6 class="mb-4" id="mensajedominio">No existen dominios asignados a esta tabla
                                        </h6>
                                        <div class="row pb-4"
                                            style="align-items:center;justify-content:space-around;padding-bottom:20px">
                                            <h7 class="col-3">Asignar dominio(s):</h7>
                                            <select class="form-control select2-multiple" multiple="multiple"
                                                data-width="60%" id="dominioselect">
                                                <option label="&nbsp;">&nbsp;</option>
                                            </select>

                                        </div>
                                    </div>

                                    <div class="row mt-2"
                                        style="display:flex; align-items:center;justify-content: flex-end">

                                        <button id="btndominioSolicitud" data-dismiss="modal" type="button"
                                            class="btn btn-secondary p-3 float-right">Solicitar</button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal fade" id="detalleModal8" tabindex="-1" role="dialog" aria-labelledby="detalleModalLabel"
                aria-hidden="true">
                <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">
                        <div class="modal-header p-3">
                            <h3 class="modal-title" id="detalleModalLabel8"> </h3>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="alert alert-danger alert-dismissible" id="alertadetalletabla"
                                style="display: none;justify-content: center;width: 100%;align-items: center;">
                                <strong>Alerta!</strong> No se puede editar si la definición se encuentra vací­a!
                            </div>
                            <div class="card mb-4">
                                <div class="card-body">
                                    <h4 class="mb-4" id="definicionTabla">Editar texto:</h4>
                                    <div class="">
                                        <div class="input-group" style="width:100%;height:80px">
                                            <textarea id="detalleTabla" class="form-control"
                                                aria-label="With textarea"></textarea>
                                        </div>
                                        <div class="mt-3" style="display: flex;justify-content: flex-end;">
                                            <button id="btndetalleTabla" type="button"
                                                class="btn btn-secondary p-3 ">Guardar</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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
                                    style="display: flex; flex-direction: row; justify-content: space-between; padding-left: 5%; padding-right: 5%;">

                                    <div class="datos_tabla" style="display: flex; flex-direction: column;">
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

                                    <div class="datos_tabla" style="display: flex; flex-direction: column;">
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

                                    <div class="datos_tabla" style="display: flex; flex-direction: column;">
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

                                    <div class="datos_tabla" style="display: flex; flex-direction: column;">
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


            <!-- Modal aceptar todas las recomendaciones-->
            <div class="modal fade" id="modalConfirmarRecomendaciones" tabindex="-1" role="dialog"
                aria-labelledby="modalConfirmarRecomendacionesLabel" aria-hidden="true" style="z-index: 1060;">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header p-3">
                            <h3 class="modal-title" id="modalConfirmarRecomendacionesLabel">Confirmación</h3>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <p class="font-weight-bold" style="font-size: 1.1rem;"
                                id="modalConfirmarRecomendacionesTitle">
                            </p>
                            <p class="text-semi-muted">Esta acción aplicará los cambios sugeridos a todos los campos
                                visibles.</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-outline-secondary"
                                data-dismiss="modal">Cancelar</button>
                            <button type="button" id="btnAceptarRecomendacionesConfirmado" class="btn btn-primary">Estoy
                                seguro</button>
                        </div>
                    </div>
                </div>
            </div>
            <script src="js/vendor/jquery-3.3.1.min.js"></script>
            <script src="js/vendor/bootstrap.bundle.min.js"></script>

            <script src="js/vendor/perfect-scrollbar.min.js"></script>

            <script src="js/vendor/select2.full.js"></script>
            <script src="js/vendor/datatables.min.js"></script>
            <script src="js/vendor/buttons.dataTables.min.js"></script>
            <script src="js/vendor/jszip.min.js"></script>
            <script src="js/vendor/buttons.html5.min.js"></script>
            <script src="js/vendor/dataTables.Resize.js"></script>
            <script src="js/vendor/mousetrap.min.js"></script>

            <script src="js/dore-plugins/select.from.library.js"></script>
            <script src="js/dore.script.js"></script>
            <script src="js/scripts.single.theme.js"></script>
            <script src="js/pagination.min.js"></script>
            <script src="js/jquery.SPServices.v2014-02.min.js"></script>
            <script src="js/vendor/bootstrap-notify.min.js"></script>
            <script src="js/custom-js/xlsx.full.min.js"></script>
            <script src="js/CasodeUso/apiService.js"></script>
            <script src="js/profilingFunctions/buscarArchivos.js"></script>
            <script src="js/profilingFunctions/estadoProfiling.js"></script>
            <script src="js/profilingFunctions/generarProfiling.js"></script>
            <script src="js/profilingFunctions/mostrarPopupProfiling.js"></script>
            <script src="js/profilingFunctions/obtenerEtiquetaEstado.js"></script>
            <script src="js/profilingFunctions/visualizarArchivoReciente.js"></script>
            <script src="js/profilingFunctions/visualizarProfiling.js"></script>

            <script src="js/ServiciosApi/ApiHelper.js"></script>
            <script src="js/ServiciosApi/TerminosService.js"></script>
            <script>
                var n = new Date().getTime();
                document.write('<script src="js/suite.js?v=' + n + '"> <' + '/' + 'script>');
            </script>
            <script src="js/metadataTabla.js"></script>
            <script>
                document.write('<script src="js/chatbot/chatbot_main.js?v=' + n + '"><' + '/' + 'script>');
            </script>
            <script>
                window.addEventListener("DOMContentLoaded", function () {
                    if (window.ogaChatbot && typeof window.ogaChatbot.init === "function") {
                        window.ogaChatbot.init({
                            title: "Asistente OGA",
                            subtitle: "Buscador de campos",
                            welcomeMessage: "Hola, estoy listo para ayudarte a navegar el buscador de campos.",
                        });
                    }
                });
            </script>
            <script src="js/BuscadorCampos/ui-controller.js"></script>
            <script src="js/Fichas_Tablas/abrirModalIndicadores.js"></script>
            <script src="js/Fichas_Tablas/cargarAtributosCalidad.js"></script>
            <script src="js/Fichas_Tablas/cargarIndicadoresPorAtributo.js"></script>
            <script src="js/Fichas_Tablas/cerrarModalIndicadores.js"></script>
            <script src="js/Fichas_Tablas/getCatalogoIndicadores.js"></script>
            <script>
                (function initBuscadorCampos() {
                    if (window.jQuery && typeof window.jQuery === "function") {
                        $(document).ready(buscadorCampos);
                    } else {
                        document.addEventListener("DOMContentLoaded", function () {
                            if (typeof buscadorCampos === "function") {
                                buscadorCampos();
                            }
                        });
                    }
                })();

            </script>
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
                window.calidadTablasOficiales = getAutocompletadoTablas();

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

                $(document).ready(function () {
                    listenerDominios();
                    listenerbtnAddAtributo();
                    fichaTablas();
                });
            </script>

            <script>
                // Pinta el nombre si ya existe
                (function setNombreTabla() {
                    const elNombre = document.getElementById("nombreTabla");
                    if (elNombre) {
                        elNombre.textContent = window.tablab || "";
                    }
                })();

                //function mostrarBotonSubirExcel(nombreTabla) {
                //    document.getElementById("nombreTabla").textContent = nombreTabla;
                //    document.getElementById("contenedorSubirExcel").style.display = "block";
                //}



            </script>

            <script>
                function notify(type, msg, ms = 2500) {
                    // Usa tu notificador si existe (no mostramos alert para evitar "Página web dice")
                    if (typeof showNotification === "function") {
                        showNotification("top", "center", type, msg, ms);
                    } else if (window.Swal && Swal.fire) {
                        const icon = (type === "danger") ? "error" : (type || "info");
                        Swal.fire({ icon, title: msg, timer: ms, showConfirmButton: false });
                    } else {
                    }
                }

                // ========== Helpers ==========
                const esc = v => (v ?? "").toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                const norm = s => (s || "").toString()
                    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                    .toLowerCase().replace(/\s+/g, " ").trim();



                // Obtiene mapa desde la tabla HTML: campo normalizado â†’ fila
                function getTablaActualMap() {
                    if (!$.fn.dataTable.isDataTable('#campos')) return new Map();
                    const rows = $('#campos').DataTable().rows({ search: 'applied' }).data().toArray();
                    const m = new Map();
                    rows.forEach(r => m.set(norm(r.campo), r));
                    return m;
                }

                // Construye <Method> para batch SOAP
                function buildMethodXml({ cmd, id, fields }) {
                    let xml = `<Method ID="1" Cmd="${cmd}">`;
                    if (cmd === "Update") xml += `<Field Name="ID">${id}</Field>`;
                    for (const [k, v] of Object.entries(fields)) xml += `<Field Name="${k}">${esc(v)}</Field>`;
                    xml += `</Method>`;
                    return xml;
                }

                // Enví­a a SharePoint en lotes
                function sendBatches(listName, methods, chunkSize = 80) {
                    for (let i = 0; i < methods.length; i += chunkSize) {
                        const updates = `<Batch OnError="Continue" ListVersion="1">${methods.slice(i, i + chunkSize).join("")}</Batch>`;
                        $().SPServices({ operation: "UpdateListItems", async: false, listName, updates });
                    }
                }
                const DATASET_URL = "http://vamos.bancoguayaquil.com/sitios/informaciongerencial/OGA_Suite/Produccion/datasets-txt/Z_INF_TECNICA_FICHAS.txt";
                const DATASET_URL_DEFINICION = "http://vamos.bancoguayaquil.com/sitios/informaciongerencial/OGA_Suite/Produccion/datasets-txt/Z_INF_TECNICA_LARGA.txt";


                function escapeRegExp(s) {
                    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                }
                function detectDelimiter(headerLine) {
                    const candidates = ['|', ';', '\t', ','];
                    let best = { delim: '|', count: 1 };
                    for (const d of candidates) {
                        const parts = headerLine.split(d);
                        if (parts.length > best.count) best = { delim: d, count: parts.length };
                    }
                    return best.delim;
                }

                function normalizeHeader(s) {
                    return (s || '')
                        .toString()
                        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                        .toLowerCase().trim();
                }

                async function contarEnDatasetConCodigo(camposOriginales, url = DATASET_URL) {
                    const campos = (camposOriginales || [])
                        .map(c => (c ?? '').toString().trim().toUpperCase())
                        .filter(Boolean);

                    if (!campos.length) {
                        console.warn('No hay campos para buscar en el dataset.');
                        return {};
                    }

                    // Descargar dataset
                    let txt = '';
                    try {
                        const resp = await fetch(url, { cache: 'no-store' });
                        if (!resp.ok) {
                            console.warn('No se pudo descargar el dataset:', resp.status, resp.statusText);
                            return {};
                        }
                        txt = await resp.text();
                    } catch (err) {
                        console.warn('Error al descargar/leer el dataset:', err);
                        return {};
                    }

                    const linesAll = txt.split(/\r?\n/);
                    if (!linesAll.length) return {};

                    // Detectar header (primera lí­nea no vací­a)
                    let headerIdx = -1;
                    for (let i = 0; i < linesAll.length; i++) {
                        if ((linesAll[i] || '').trim() !== '') { headerIdx = i; break; }
                    }
                    if (headerIdx === -1) return {};

                    const headerLine = linesAll[headerIdx];
                    const delim = detectDelimiter(headerLine);
                    const headers = headerLine.split(delim).map(h => h?.toString().trim() ?? '');

                    // í­ndice de 'codigo' en el header
                    const normHeaders = headers.map(normalizeHeader);
                    const idxCodigo = normHeaders.indexOf('codigo');

                    if (idxCodigo === -1) {
                        console.warn("No se encontró la columna 'codigo' en el header del dataset. Headers:", headers);
                    }

                    const results = {};
                    // Precompilar regex ||CAMPO||
                    const regs = campos.map(c => ({ campo: c, rx: new RegExp(`\\|\\|${escapeRegExp(c)}\\|\\|`, 'g') }));

                    // Recorrer lí­neas (omitimos header)
                    for (const { campo, rx } of regs) {
                        let count = 0;
                        const coincidencias = [];
                        const freqCodigo = new Map(); // codigo -> repeticiones

                        for (let i = headerIdx + 1; i < linesAll.length; i++) {
                            const line = linesAll[i];
                            if (!line) continue;
                            if (rx.test(line)) {
                                count++;

                                // Extraer 'codigo' si existe
                                let codigoVal = '';
                                if (idxCodigo !== -1) {
                                    const cols = line.split(delim);
                                    codigoVal = (cols[idxCodigo] ?? '').toString().trim();
                                    if (codigoVal) {
                                        const k = codigoVal;
                                        freqCodigo.set(k, (freqCodigo.get(k) || 0) + 1);
                                    }
                                }

                                coincidencias.push({ linea: i + 1, texto: line, codigo: codigoVal });
                            }
                        }

                        // Obtener el 'codigo' más repetido
                        let topCodigo = { valor: '', count: 0 };
                        for (const [val, cnt] of freqCodigo.entries()) {
                            if (cnt > topCodigo.count) topCodigo = { valor: val, count: cnt };
                        }

                        results[campo] = { total: count, topCodigo, coincidencias };
                    }

                    // Mostrar resumen en consola
                    const resumen = Object.entries(results).map(([campo, info]) => ({
                        campo,
                        coincidencias: info.total,
                        codigo_mas_repetido: info.topCodigo?.valor || '',
                        repeticiones_codigo: info.topCodigo?.count || 0,
                    })).sort((a, b) => b.coincidencias - a.coincidencias);


                    // (Opcional) Mostrar ejemplos
                    for (const [campo, info] of Object.entries(results)) {
                        if (info.total > 0) {
                            info.coincidencias.slice(0, 8).forEach(c => {
                            });
                        }
                    }

                    return results;
                }


                // ========== Lectura del Excel (solo 2 columnas) ==========
            </script>


            <script>
                (function () {
                    // ============ Utils ============
                    const normalize = s => (s || "").toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
                    const norm = normalize; // alias por compatibilidad
                    const eqNorm = (a, b) => norm(a) === norm(b);
                    const isEmpty = v => !norm(v);
                    const esc = s => (s || "").toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

                    // Encabezados tolerantes (modo minimal)
                    const HEAD_Campo = ["nombre de campo", "campo", "columna"];
                    const HEAD_Detalle = ["descripcion campo", "descripción campo", "descripcion", "detalle", "description"];

                    // Encabezados formato fijo (modo robusto)
                    const FIXED_HEADERS = {
                        campo: ["nombre de campo", "campo", "columna"],
                        codigo: ["codigo atributo", "codigo", "cod atributo", "codigo_atributo"],
                        descAtributo: ["descripcion atributo", "desc atributo", "descripcion_atributo"],
                        descCampo: ["descripcion campo", "descripción campo", "descripcion", "detalle", "description"],
                        plataforma: ["plataforma"],
                        servidor: ["servidor"],
                        base: ["base", "base de datos"],
                        esquema: ["esquema", "schema"],
                        tabla: ["tabla"],
                        tipo_dato: ["tipo de dato", "tipo_dato", "tipo"],
                        largo: ["largo", "longitud", "length"]
                    };

                    // Busca í­ndice de columna por candidatos normalizados
                    function findIndex(headers, candidates) {
                        const hs = headers.map(h => (h ?? "").toString());
                        const set = hs.map(norm);
                        const wants = candidates.map(norm);
                        return set.findIndex(h => wants.includes(h));
                    }

                    // Encuentra la fila de encabezado válida (que contiene al menos los grupos requeridos)
                    function findHeaderRow(rows, requiredGroups) {
                        for (let r = 0; r < rows.length; r++) {
                            const headers = (rows[r] || []).map(h => (h ?? "").toString());
                            const ok = requiredGroups.every(group => findIndex(headers, group) !== -1);
                            if (ok) return { rowIndex: r, headers };
                        }
                        return null;
                    }

                    // Extrae {campo, detalle} desde 2 columnas (modo minimal)
                    function extractPairsMinimal(rows) {
                        const headers = (rows[0] || []).map(h => (h ?? "").toString());
                        const idxCampo = findIndex(headers, HEAD_Campo);
                        const idxDetalle = findIndex(headers, HEAD_Detalle);
                        if (idxCampo === -1 || idxDetalle === -1) return [];

                        const raw = rows.slice(1).map(r => ({
                            campo: (r[idxCampo] ?? "").toString().trim(),
                            detalle: (r[idxDetalle] ?? "").toString().trim()
                        })).filter(p => p.campo);

                        const dedupe = new Map();
                        for (const p of raw) dedupe.set(norm(p.campo), p);
                        return Array.from(dedupe.values());
                    }

                    // Extrae filas con formato fijo (devuelve objetos extensos con metadatos)
                    function extractRowsFixed(rows) {
                        const required = [FIXED_HEADERS.campo, FIXED_HEADERS.descCampo]; // mí­nimo necesario
                        const hdr = findHeaderRow(rows, required);
                        if (!hdr) return [];

                        const headers = hdr.headers;
                        const start = hdr.rowIndex + 1;

                        const col = {
                            campo: findIndex(headers, FIXED_HEADERS.campo),
                            codigo: findIndex(headers, FIXED_HEADERS.codigo),
                            descAttr: findIndex(headers, FIXED_HEADERS.descAtributo),
                            descCampo: findIndex(headers, FIXED_HEADERS.descCampo),
                            plataforma: findIndex(headers, FIXED_HEADERS.plataforma),
                            servidor: findIndex(headers, FIXED_HEADERS.servidor),
                            base: findIndex(headers, FIXED_HEADERS.base),
                            esquema: findIndex(headers, FIXED_HEADERS.esquema),
                            tabla: findIndex(headers, FIXED_HEADERS.tabla),
                            tipo_dato: findIndex(headers, FIXED_HEADERS.tipo_dato),
                            largo: findIndex(headers, FIXED_HEADERS.largo),
                        };

                        const out = [];
                        for (let i = start; i < rows.length; i++) {
                            const r = rows[i] || [];
                            const campo = (r[col.campo] ?? "").toString().trim();
                            if (!campo) continue;

                            const fila = {
                                campo,
                                detalle: col.descCampo !== -1 ? (r[col.descCampo] ?? "").toString().trim() : "",
                                codigo: col.codigo !== -1 ? (r[col.codigo] ?? "").toString().trim() : "",
                                descripcion: col.descAttr !== -1 ? (r[col.descAttr] ?? "").toString().trim() : "",
                                plataforma: col.plataforma !== -1 ? (r[col.plataforma] ?? "").toString().trim() : "",
                                servidor: col.servidor !== -1 ? (r[col.servidor] ?? "").toString().trim() : "",
                                base: col.base !== -1 ? (r[col.base] ?? "").toString().trim() : "",
                                esquema: col.esquema !== -1 ? (r[col.esquema] ?? "").toString().trim() : "",
                                tabla: col.tabla !== -1 ? (r[col.tabla] ?? "").toString().trim() : "",
                                tipo_dato: col.tipo_dato !== -1 ? (r[col.tipo_dato] ?? "").toString().trim() : "",
                                largo: col.largo !== -1 ? (r[col.largo] ?? "").toString().trim() : "",
                            };
                            out.push(fila);
                        }

                        const dedupe = new Map();
                        for (const p of out) dedupe.set(norm(p.campo), p);
                        return Array.from(dedupe.values());
                    }

                    // ============ Listener: subir Excel ============
                    document.getElementById("excelUpload").addEventListener("change", function (e) {
                        const file = e.target.files[0];
                        if (!file) return;

                        const reader = new FileReader();
                        reader.onload = async function (evt) {
                            try {
                                const wb = XLSX.read(new Uint8Array(evt.target.result), { type: "array" });
                                const ws = wb.Sheets[wb.SheetNames[0]];
                                if (!ws) return;

                                const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
                                if (!rows.length) return;

                                // 1) Intento formato fijo; 2) Si no, modo minimal
                                let items = extractRowsFixed(rows);
                                if (!items.length) items = extractPairsMinimal(rows);

                                // Log: campo -> descripcion (previo a cualquier filtro)
                                console.group("Excel parseado: campo -> descripcion");
                                if (!items.length) {
                                    console.warn("No se encontraron registros con los encabezados esperados.");
                                } else {
                                    items.forEach(x => console.log(`â€¢ ${x.campo} -> ${x.detalle || ""}`));
                                    console.info(`Total pares detectados: ${items.length}`);
                                }
                                console.groupEnd();
                                if (!items.length) return;

                                // Tabla actual (catálogo)
                                const tablaMap = (typeof getTablaActualMap === "function") ? getTablaActualMap() : new Map();
                                const nowISO = new Date().toISOString();

                                // Usuario actual para auditorí­a
                                let userCode = "";
                                try {
                                    if (typeof getUserAndDate === "function") {
                                        const datos = getUserAndDate();
                                        const userArr = datos?.[0] || [];
                                        userCode = userArr?.[0] || "";
                                    }
                                    if (!userCode && window.current_user_code) userCode = window.current_user_code;
                                } catch (_) { }

                                // Filtrado por coincidencia de CAMPO
                                const sinMatchCampo = items.filter(it => !tablaMap.has(norm(it.campo)));
                                const conCampo = items.filter(it => tablaMap.has(norm(it.campo)));

                                // Filtro por entorno (solo si Excel provee alguno de los 4: plataforma/servidor/base/esquema)
                                const candidatos = conCampo.filter(it => {
                                    const fila = tablaMap.get(norm(it.campo));
                                    const checks = [];
                                    if (!isEmpty(it.plataforma)) checks.push(eqNorm(fila.plataforma, it.plataforma));
                                    if (!isEmpty(it.servidor)) checks.push(eqNorm(fila.servidor, it.servidor));
                                    if (!isEmpty(it.base)) checks.push(eqNorm(fila.base, it.base));
                                    if (!isEmpty(it.esquema)) checks.push(eqNorm(fila.esquema, it.esquema));
                                    return checks.every(Boolean); // si Excel no trajo ninguno, no bloquea
                                });

                                const descartesEntorno = conCampo.filter(it => !candidatos.includes(it));

                                // Logs de depuración
                                if (sinMatchCampo.length) {
                                    console.warn("Campos sin match de nombre (ignorados):", sinMatchCampo.map(z => z.campo));
                                }
                                if (descartesEntorno.length) {
                                    console.warn("Descartados por entorno (Plataforma/Servidor/Base/Esquema no coinciden):",
                                        descartesEntorno.map(z => ({
                                            campo: z.campo,
                                            plataforma_xlsx: z.plataforma || "",
                                            servidor_xlsx: z.servidor || "",
                                            base_xlsx: z.base || "",
                                            esquema_xlsx: z.esquema || ""
                                        }))
                                    );
                                }

                                // Construcción final de preparados SOLO con candidatos válidos
                                const preparados = candidatos.map(ex => {
                                    const fila = tablaMap.get(norm(ex.campo)) || {};
                                    const tieneDetalle = !isEmpty(fila?.detalle);
                                    const tieneCodigo = !isEmpty(fila?.codigo);
                                    const tieneAtributo = !isEmpty(fila?.descripcion);

                                    let detalleFinal = fila?.detalle || "";
                                    let usuarioDet = "";
                                    let fechaDet = "";

                                    // Solo se bloquea si ya existe una definición real (que no sea recomendación).
                                    if (!isEmpty(ex.detalle) && (!tieneDetalle || (fila?.detalle || "").startsWith("***"))) {
                                        detalleFinal = ex.detalle;
                                        usuarioDet = userCode;
                                        fechaDet = nowISO;
                                    }

                                    return {
                                        plataforma: ex.plataforma || fila?.plataforma || "",
                                        servidor: ex.servidor || fila?.servidor || "",
                                        base: ex.base || fila?.base || "",
                                        esquema: ex.esquema || fila?.esquema || "",
                                        tabla: ex.tabla || fila?.tabla || (window.tablab || ""),
                                        campo: ex.campo,

                                        detalle: detalleFinal,
                                        tipo_dato: ex.tipo_dato || fila?.tipo_dato || "",
                                        largo: ex.largo || fila?.largo || "",
                                        permite_null: fila?.permite_null || "",

                                        usuario_modificacion_detalle: usuarioDet,
                                        fecha_modificacion_detalle: fechaDet,

                                        // atributos adicionales (si vienen en Excel)
                                        codigo: ex.codigo || "",
                                        descripcion: ex.descripcion || "",
                                        ordinal_position: fila?.ordinal_position || "",
                                        golden_record: fila?.golden_record || "",
                                        usuario_modificacion_atributo: "",
                                        fecha_modificacion_atributo: ""
                                    };
                                });

                                console.group("  Match final (campo + entorno)");
                                console.info(`Excel total: ${items.length}`);
                                console.info(`Coinciden campo+entorno: ${preparados.length}`);
                                console.groupEnd();

                                if (!preparados.length) return;

                                // (Opcional) recomendaciones
                                try {
                                    if (typeof contarEnDatasetConCodigo === "function" && typeof aplicarRecomendacionesAtributo === "function") {
                                        const camposExcel = items.map(i => i.campo);
                                        const results = await contarEnDatasetConCodigo(camposExcel);
                                        aplicarRecomendacionesAtributo(results);
                                    }
                                } catch (recoErr) {
                                    console.warn("Error generando/aplicando recomendaciones de código:", recoErr);
                                }

                                // Upsert
                                const res = await upsertZInfTecnica(preparados);
                                console.log("Resultado upsert:", res);

                            } catch (err) {
                                console.error("Error procesando el Excel:", err);
                            } finally {
                                e.target.value = ""; // permite re-subir el mismo archivo
                            }
                        };
                        reader.readAsArrayBuffer(file);
                    });

                    // ============ Upsert SharePoint (sin pisar con vací­os y clave con plataforma) ============
                    async function upsertZInfTecnica(filas) {
                        const tablaRef = window.tablab || (filas[0]?.tabla) || "";
                        if (!tablaRef || !filas?.length) {
                            return { updated: 0, created: 0, total: 0 };
                        }

                        // 1) Leer existentes por tabla
                        const CAMLQuery = `<Query><Where><Eq><FieldRef Name="tabla" /><Value Type="Text">${esc(tablaRef)}</Value></Eq></Where></Query>`;
                        const CAMLViewFields = `<ViewFields>
          <FieldRef Name="ID"/><FieldRef Name="plataforma"/><FieldRef Name="servidor"/><FieldRef Name="base"/><FieldRef Name="esquema"/>
          <FieldRef Name="tabla"/><FieldRef Name="campo"/>
        </ViewFields>`;

                        const existentes = [];
                        await new Promise(resolve => {
                            $().SPServices({
                                operation: "GetListItems",
                                async: false,
                                listName: "Z_INF_TECNICA",
                                CAMLQuery, CAMLViewFields,
                                completefunc: function (xData, status) {
                                    if (status === "success") {
                                        $(xData.responseXML).SPFilterNode("z:row").each(function () {
                                            const $r = $(this);
                                            existentes.push({
                                                ID: $r.attr("ows_ID"),
                                                plataforma: $r.attr("ows_plataforma") || "",
                                                servidor: $r.attr("ows_servidor") || "",
                                                base: $r.attr("ows_base") || "",
                                                esquema: $r.attr("ows_esquema") || "",
                                                tabla: $r.attr("ows_tabla") || "",
                                                campo: $r.attr("ows_campo") || ""
                                            });
                                        });
                                    }
                                    resolve();
                                }
                            });
                        });

                        const key = o => [o.plataforma, o.servidor, o.base, o.esquema, (o.tabla || tablaRef), o.campo].map(norm).join("|");
                        const mapExist = new Map(existentes.map(e => [key(e), e]));

                        // 2) Construir métodos evitando pisar con vací­os
                        const methods = [];
                        let updated = 0, created = 0;

                        for (const f of filas) {
                            const exist = mapExist.get(key(f));

                            const fields = {};
                            const setIf = (val, name) => {
                                if (typeof val !== "undefined" && val !== null && val !== "") fields[name] = val;
                            };

                            // Solo empujamos campos no vací­os
                            setIf(f.plataforma, "plataforma");
                            setIf(f.servidor, "servidor");
                            setIf(f.base, "base");
                            setIf(f.esquema, "esquema");
                            setIf(f.tabla, "tabla");
                            setIf(f.campo, "campo");

                            setIf(f.detalle, "detalle");
                            setIf(f.plataforma, "plataforma");
                            setIf(f.tipo_dato, "tipo_dato");
                            setIf(f.largo, "largo");
                            setIf(f.permite_null, "permite_null");
                            setIf(f.usuario_modificacion_detalle, "usuario_modificacion_detalle");
                            setIf(f.fecha_modificacion_detalle, "fecha_modificacion_detalle");

                            setIf(f.codigo, "codigo");
                            setIf(f.descripcion, "descripcion");
                            setIf(f.ordinal_position, "ordinal_position");
                            setIf(f.golden_record, "golden_record");
                            setIf(f.usuario_modificacion_atributo, "usuario_modificacion_atributo");
                            setIf(f.fecha_modificacion_atributo, "fecha_modificacion_atributo");

                            if (exist?.ID) {
                                updated++;
                                methods.push(buildMethodXml({ cmd: "Update", id: exist.ID, fields }));
                            } else {
                                created++;
                                methods.push(buildMethodXml({ cmd: "New", fields }));
                            }
                        }

                        if (methods.length) {
                            // Si tu sendBatches retorna Promesa, puedes: await sendBatches("Z_INF_TECNICA", methods, 80);
                            sendBatches("Z_INF_TECNICA", methods, 80);
                        }

                        // 3) Refrescar DataTable local (si aplica)
                        try { applyLocalUpdatesToDataTable(filas); } catch (_) { }

                        // 4) Recalcular y persistir avance inmediato para la tabla afectada
                        try {
                            if (typeof arrayCamposDistinct === "function" && typeof actualizarDominio === "function") {
                                const dataset = (Array.isArray(window.campos) && window.campos.length) ? window.campos : filas;
                                const agg = arrayCamposDistinct(dataset) || [];

                                // Actualizar todas las tablas involucradas en el lote recibido
                                const llavesAfectadas = new Set(
                                    filas.map(f => [f.plataforma, f.servidor, f.base, f.esquema, f.tabla]
                                        .map(v => (v || "").toString().trim().toUpperCase())
                                        .join("_"))
                                );

                                agg.forEach(match => {
                                    const keyMatch = [match.plataforma, match.servidor, match.base, match.esquema, match.tabla]
                                        .map(v => (v || "").toString().trim().toUpperCase())
                                        .join("_");
                                    if (!llavesAfectadas.has(keyMatch)) return;
                                    const pct = match?.porcentaje_avance;
                                    if (pct !== undefined && pct !== null) {
                                        actualizarDominio("avance", match.tabla, match.servidor, match.base, match.esquema, pct);
                                    }
                                });
                            }
                        } catch (err) {
                            console.warn("No se pudo recalcular/persistir avance inmediato:", err);
                        }

                        const total = methods.length;
                        return { updated, created, total };
                    }

                    // ============ Refresco DataTable local ============
                    function applyLocalUpdatesToDataTable(filas) {
                        if (!Array.isArray(filas) || !filas.length) return;

                        const k = o => [o.plataforma, o.servidor, o.base, o.esquema, o.tabla, o.campo].map(norm).join("|");
                        const patch = new Map(filas.map(f => [k(f), f]));

                        if (Array.isArray(window.campos) && window.campos.length) {
                            window.campos = window.campos.map(row => {
                                const keyRow = k(row);
                                if (patch.has(keyRow)) {
                                    const f = patch.get(keyRow);
                                    const newRow = { ...row };
                                    if (!isEmpty(f.detalle)) newRow.detalle = f.detalle;
                                    if (!isEmpty(f.descripcion)) newRow.descripcion = f.descripcion;
                                    if (!isEmpty(f.codigo)) newRow.codigo = f.codigo;
                                    if (!isEmpty(f.tipo_dato)) newRow.tipo_dato = f.tipo_dato;
                                    if (!isEmpty(f.largo)) newRow.largo = f.largo;
                                    if (f.usuario_modificacion_detalle) newRow.usuario_modificacion_detalle = f.usuario_modificacion_detalle;
                                    if (f.fecha_modificacion_detalle) newRow.fecha_modificacion_detalle = f.fecha_modificacion_detalle;
                                    return newRow;
                                }
                                return row;
                            });
                        }

                        // Actualizar también info_tecnica (fuente de arrayCamposDistinct)
                        if (Array.isArray(window.info_tecnica) && window.info_tecnica.length) {
                            window.info_tecnica = window.info_tecnica.map(row => {
                                const keyRow = k(row);
                                if (patch.has(keyRow)) {
                                    const f = patch.get(keyRow);
                                    const newRow = { ...row };
                                    if (!isEmpty(f.detalle)) newRow.detalle = f.detalle;
                                    if (!isEmpty(f.descripcion)) newRow.descripcion = f.descripcion;
                                    if (!isEmpty(f.codigo)) newRow.codigo = f.codigo;
                                    if (!isEmpty(f.tipo_dato)) newRow.tipo_dato = f.tipo_dato;
                                    if (!isEmpty(f.largo)) newRow.largo = f.largo;
                                    if (f.usuario_modificacion_detalle) newRow.usuario_modificacion_detalle = f.usuario_modificacion_detalle;
                                    if (f.fecha_modificacion_detalle) newRow.fecha_modificacion_detalle = f.fecha_modificacion_detalle;
                                    return newRow;
                                }
                                return row;
                            });

                            // Recalcular y persistir avance solo para las llaves afectadas (rápido)
                            try {
                                const llavesAfectadas = new Set(filas.map(f =>
                                    [norm(f.plataforma), norm(f.servidor), norm(f.base), norm(f.esquema), norm(f.tabla)].join("_")
                                ));

                                if (typeof actualizarDominio === "function") {
                                    llavesAfectadas.forEach(ll => {
                                        const [pl, sv, ba, es, tb] = ll.split("_");
                                        const pct = calcularAvanceTabla(window.info_tecnica, {
                                            plataforma: pl, servidor: sv, base: ba, esquema: es, tabla: tb
                                        });
                                        if (pct !== null && pct !== undefined) {
                                            actualizarDominio("avance", tb, sv, ba, es, pct, pl);
                                        }
                                    });
                                }
                            } catch (err) {
                                console.warn("No se pudo recalcular avance local:", err);
                            }
                        }

                        if (Array.isArray(window.campos) && window.campos.length) {
                            if (typeof redrawDataTableBuscadorCampos === "function") {
                                redrawDataTableBuscadorCampos("campos", window.campos);
                            } else if ($.fn.dataTable.isDataTable('#campos')) {
                                const dt = $('#campos').DataTable();
                                dt.clear().rows.add(window.campos).draw(false);
                            }
                        } else if ($.fn.dataTable.isDataTable('#campos')) {
                            $('#campos').DataTable().draw(false);
                        }
                    }

                })();
            </script>






            <script>
                // Proximo a documentar
                function logDatosTablaCampos({ todas = true } = {}) {
                    if (!$.fn.dataTable.isDataTable('#campos')) {
                        return;
                    }
                    const dt = $('#campos').DataTable();

                    const rows = todas
                        ? dt.rows({ search: 'applied' }).data().toArray()
                        : dt.rows({ page: 'current' }).data().toArray();


                    const vistaSP = rows.map(r => ({
                        codigo: r.codigo,
                        descripcion: r.descripcion,
                        detalle: r.detalle,
                        plataforma: r.plataforma,
                        servidor: r.servidor,
                        base: r.base,
                        esquema: r.esquema,
                        tabla: r.tabla,
                        campo: r.campo,
                        tipo_dato: r.tipo_dato,
                        largo: r.largo,
                        permite_null: r.permite_null,
                        ordinal_position: r.ordinal_position,
                        golden_record: r.golden_record,
                        llave_unica: r.llave_unica
                    }));
                }
            </script>


            <!-- Spotlight (tutorial) -->
            <style>
                .guide-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, .55);
                    z-index: 9998
                }

                .guide-highlight {
                    position: fixed;
                    z-index: 9999;
                    border-radius: 10px;
                    box-shadow: 0 0 0 4px #D2006E inset, 0 0 0 2000px rgba(0, 0, 0, .55);
                    transition: all .2s ease;
                    pointer-events: none
                }

                .guide-tooltip {
                    position: fixed;
                    z-index: 10000;
                    background: #fff;
                    color: #222;
                    border-radius: 10px;
                    padding: 12px 14px;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, .18);
                    max-width: 360px;
                    font-size: 14px;
                    line-height: 1.35
                }

                .guide-arrow {
                    position: fixed;
                    z-index: 10000;
                    width: 0;
                    height: 0;
                    border-left: 10px solid transparent;
                    border-right: 10px solid transparent;
                    border-bottom: 10px solid #fff
                }

                .guide-controls {
                    margin-top: 8px;
                    display: flex;
                    gap: 8px;
                    justify-content: flex-end
                }

                .guide-btn {
                    background: #D2006E;
                    color: #fff;
                    border: 0;
                    border-radius: 8px;
                    padding: 6px 10px;
                    cursor: pointer
                }

                .guide-btn.secondary {
                    background: #eee;
                    color: #333
                }
            </style>

            <script>
                function startTutorial(element, mensaje) {
                    $(element).tooltip('dispose'); // limpia tooltip previo
                    $(element).tooltip({
                        title: mensaje,
                        placement: "bottom",
                        trigger: "manual",
                        template: '<div class="tooltip bs-tooltip-bottom tutorial-tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner bg-danger text-white"></div></div>'
                    }).tooltip('show');
                    setTimeout(() => $(element).tooltip('hide'), 5000); // cierra a los 5s
                }

                /* Valida que TODAS las filas (window.campos o DataTable completa) tengan un único esquema */
                function validarUnSoloEsquemaGlobal() {
                    let rows = [];
                    if (Array.isArray(window.campos) && window.campos.length) {
                        rows = window.campos.slice();
                    } else if ($.fn.DataTable && $.fn.DataTable.isDataTable('#campos')) {
                        rows = $('#campos').DataTable().rows().data().toArray();
                    } else if ($.fn.dataTable && $.fn.dataTable.isDataTable('#campos')) {
                        rows = $('#campos').DataTable().rows().data().toArray();
                    }

                    if (!rows.length) {
                        // âš ï¸ No filas: NO tutorial
                        return { ok: false, reason: 'SIN_FILAS', count: 0, ejemplos: [] };
                    }

                    const set = new Map();
                    const norm = s => (s || "").toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

                    for (const r of rows) {
                        const servidor = (r?.servidor ?? "").toString();
                        const base = (r?.base ?? "").toString();
                        const esquema = (r?.esquema ?? "").toString();

                        // La clave única ahora es la combinación de los tres.
                        const key = `${norm(servidor)}|${norm(base)}|${norm(esquema)}`;
                        const displayValue = `${servidor}.${base}.${esquema}`;

                        if (norm(servidor) && norm(base) && norm(esquema)) {
                            set.set(key, displayValue);
                        }
                    }

                    const count = set.size;
                    if (count === 0) {
                        // âš ï¸ Sin esquemas detectados: NO tutorial
                        return { ok: false, reason: 'SIN_ESQUEMA', count: 0, ejemplos: [] }; // No hay contextos completos
                    }
                    if (count > 1) {
                        // âŒ Múltiples esquemas: aquí­ SÍ queremos tutorial
                        const ejemplos = Array.from(set.values()).slice(0, 5);
                        return { ok: false, reason: 'MULTIPLES', count, ejemplos }; // Múltiples contextos
                    }

                    // âœ… Un solo esquema
                    return { ok: true, reason: 'OK', count: 1, ejemplos: [] }; // Un solo contexto
                }


                /* Obtener header <th> por tí­tulo (texto real en la cabecera) */
                function getHeaderElementByTitle(dt, titleWanted) {
                    const wanted = norm(titleWanted);
                    const idxs = dt.columns().indexes().toArray();
                    for (const i of idxs) {
                        const th = dt.column(i).header();
                        const txt = norm($(th).text());
                        if (txt === wanted || txt.includes(wanted)) return th;
                    }
                    return null;
                }

                /* Esperar a que DataTable esté lista (o devolverla si ya lo está) */
                function getDT(sel = '#campos') {
                    const ready = ($.fn.DataTable && $.fn.DataTable.isDataTable && $.fn.DataTable.isDataTable(sel))
                        || ($.fn.dataTable && $.fn.dataTable.isDataTable && $.fn.dataTable.isDataTable(sel));
                    if (ready) return Promise.resolve($(sel).DataTable());
                    return new Promise(resolve => {
                        $(document).one('init.dt', function (e, settings) {
                            if (settings && settings.nTable && ('#' + settings.nTable.id) === sel) {
                                resolve(new $.fn.dataTable.Api(settings));
                            }
                        });
                    });
                }

                /* ------- Mini-tutorial spotlight ------- */
                (function () {
                    let guideState = null;

                    function placeAround(el, tip, arrow, highlight, pos = 'right') {
                        const r = el.getBoundingClientRect();
                        const pad = 8;
                        highlight.style.left = (r.left - pad) + 'px';
                        highlight.style.top = (r.top - pad) + 'px';
                        highlight.style.width = (r.width + pad * 2) + 'px';
                        highlight.style.height = (r.height + pad * 2) + 'px';

                        const spacing = 10;
                        let tipLeft, tipTop, aLeft, aTop, css = {};
                        if (pos === 'right') {
                            tipLeft = r.right + spacing; tipTop = Math.max(10, r.top);
                            aLeft = r.right + 2; aTop = r.top + Math.min(20, r.height / 2);
                            css = { borderLeft: '10px solid #fff', borderRight: 'none', borderBottom: '10px solid transparent' };
                        } else if (pos === 'left') {
                            tipLeft = Math.max(10, r.left - 360 - spacing); tipTop = Math.max(10, r.top);
                            aLeft = r.left - 2; aTop = r.top + Math.min(20, r.height / 2);
                            css = { borderRight: '10px solid #fff', borderLeft: 'none', borderBottom: '10px solid transparent' };
                        } else if (pos === 'top') {
                            tipLeft = Math.max(10, r.left); tipTop = Math.max(10, r.top - 110);
                            aLeft = r.left + Math.min(r.width / 2, 40); aTop = tipTop + 100;
                            css = { borderBottom: 'none', borderTop: '10px solid #fff', borderLeft: '10px solid transparent', borderRight: '10px solid transparent' };
                        } else { // bottom
                            tipLeft = Math.max(10, r.left); tipTop = r.bottom + spacing;
                            aLeft = r.left + Math.min(r.width / 2, 40); aTop = r.bottom + 2;
                            css = { borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderBottom: '10px solid #fff' };
                        }
                        tip.style.left = tipLeft + 'px'; tip.style.top = tipTop + 'px';
                        arrow.style.left = aLeft + 'px'; arrow.style.top = aTop + 'px';
                        Object.assign(arrow.style, css);
                    }

                    function ensureVisible(el) {
                        const r = el.getBoundingClientRect();
                        const inV = r.top >= 0 && r.bottom <= (window.innerHeight || document.documentElement.clientHeight);
                        if (!inV) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }

                    function build() {
                        const overlay = document.createElement('div'); overlay.className = 'guide-overlay';
                        const highlight = document.createElement('div'); highlight.className = 'guide-highlight';
                        const tip = document.createElement('div'); tip.className = 'guide-tooltip';
                        const arrow = document.createElement('div'); arrow.className = 'guide-arrow';
                        document.body.append(overlay, highlight, tip, arrow);
                        return { overlay, highlight, tip, arrow };
                    }

                    function destroy() {
                        if (!guideState) return;
                        const { overlay, highlight, tip, arrow, keyHandler } = guideState;
                        [overlay, highlight, tip, arrow].forEach(n => n && n.remove());
                        document.removeEventListener('keydown', keyHandler);
                        guideState = null;
                    }

                    function renderStep(step) {
                        const { highlight, tip, arrow } = guideState;
                        let el = step.element || (typeof step.getEl === 'function' ? step.getEl() : null) || (step.selector ? document.querySelector(step.selector) : null);
                        if (!el) { tip.innerHTML = '<b>No se encontró el elemento objetivo.</b>'; return; }
                        ensureVisible(el);
                        placeAround(el, tip, arrow, highlight, step.position || 'right');
                        tip.innerHTML = `
        <div>${step.html || step.text || ''}</div>
        <div class="guide-controls">
          ${guideState.index > 0 ? '<button class="guide-btn secondary" data-action="prev">Atrás</button>' : ''}
          ${guideState.index < guideState.steps.length - 1
                                ? '<button class="guide-btn" data-action="next">Siguiente</button>'
                                : '<button class="guide-btn" data-action="done">Listo</button>'}
        </div>`;
                    }

                    function attachHandlers() {
                        guideState.tip.onclick = (e) => {
                            const action = e.target?.getAttribute('data-action');
                            if (!action) return;
                            if (action === 'prev' && guideState.index > 0) { guideState.index--; renderStep(guideState.steps[guideState.index]); }
                            else if (action === 'next' && guideState.index < guideState.steps.length - 1) { guideState.index++; renderStep(guideState.steps[guideState.index]); }
                            else if (action === 'done') { destroy(); }
                        };
                    }

                    function startSchemaGuide(steps) {
                        if (!Array.isArray(steps) || !steps.length) return;
                        const { overlay, highlight, tip, arrow } = build();
                        const keyHandler = (e) => { if (e.key === 'Escape') destroy(); };
                        document.addEventListener('keydown', keyHandler);
                        guideState = { steps, index: 0, overlay, highlight, tip, arrow, keyHandler };
                        attachHandlers();
                        renderStep(steps[0]);
                        window.addEventListener('resize', () => renderStep(guideState.steps[guideState.index]));
                        window.addEventListener('scroll', () => renderStep(guideState.steps[guideState.index]), { passive: true });
                    }

                    window.startSchemaGuide = startSchemaGuide;
                    window.stopSchemaGuide = destroy;
                })();

                /* ------- CLICK del botón subir: valida, guí­a, o abre file input ------- */
                document.getElementById("btnSubirExcel").addEventListener("click", async () => {

                    const res = validarUnSoloEsquemaGlobal();

                    if (!res.ok) {
                        if (res.reason === 'MULTIPLES') {
                            const thEsquema = await focusTutorialOnColumn('#campos', 'Tabla');
                            if (thEsquema) {
                                startSchemaGuide([{
                                    element: thEsquema,
                                    position: 'bottom',
                                    html: `<b>Paso 1:</b> Filtra o selecciona un único <em>tabla</em> en esta columna.<br>
                                                 <small>Detectados: ${res.count}. Ej.: ${res.ejemplos.join(", ")}</small>`
                                }]);
                            } else {
                                console.warn("No encontré la columna 'Tabla' en la cabecera.");
                            }
                            // Bloquea apertura del file input
                            return;
                        }

                        // Estos casos NO muestran tutorial
                        if (res.reason === 'SIN_FILAS') {
                            notify?.("warning", "No hay filas para validar la tabla.");
                        } else if (res.reason === 'SIN_ESQUEMA') {
                            notify?.("warning", "No se detectó ninguna tabla en los datos.");
                        }
                        return; // no abrir file input
                    }

                    const switchChecked = document.getElementById("switchS3").checked;
                    if (switchChecked) {
                        startSchemaGuide([{
                            element: document.querySelector("#switchS3").parentElement,
                            position: 'bottom',
                            html: `<b>Acción requerida:</b><br>
                                   Para importar un Excel, necesitas ver los campos individuales. Por favor, <b>desactiva</b> el modo "Agrupar Nivel Tabla".`
                        }]);
                        return; // Detiene la ejecución
                    }

                    // âœ… Validación OK â†’ abrir selector de archivo
                    document.getElementById("excelUpload").click();
                });

            </script>

            <!-- Helpers para tutorial -->
            <script>
                function ensureColumnVisible(tableSelector, tituloCol, padding = 40) {
                    if (!$.fn.dataTable.isDataTable(tableSelector)) return null;

                    const dt = $(tableSelector).DataTable();
                    const th = getHeaderElementByTitle(dt, tituloCol);
                    if (!th) return null;

                    // contenedores scrolleables
                    const $wrapper = $(tableSelector).closest('.dataTables_wrapper');
                    const body = $wrapper.find('.dataTables_scrollBody').get(0);
                    const head = $wrapper.find('.dataTables_scrollHead').get(0);

                    if (!body) return th; // no hay scroll horizontal, no hace falta mover

                    // Posición horizontal del th relativo al contenedor
                    const thRect = th.getBoundingClientRect();
                    const bodyRect = body.getBoundingClientRect();
                    const current = body.scrollLeft;
                    const deltaLeft = thRect.left - bodyRect.left - padding;
                    const deltaRight = thRect.right - bodyRect.right + padding;

                    let nextScroll = current;
                    if (deltaLeft < 0) {
                        // El th está a la izquierda, desplazar a la izquierda
                        nextScroll = current + deltaLeft;
                    } else if (deltaRight > 0) {
                        // El th está a la derecha, desplazar a la derecha
                        nextScroll = current + deltaRight;
                    }

                    // Aplicar desplazamiento (sincroniza head/body)
                    body.scrollLeft = nextScroll;
                    if (head) head.scrollLeft = nextScroll;

                    return th;
                }

                /**
                 * Helper para usar antes de lanzar el tutorial:
                 * - Asegura que la tabla #campos exista
                 * - Desplaza hasta la columna objetivo
                 * - Devuelve el TH (para spotlight) o null si no está
                 */
                function focusTutorialOnColumn(tableSelector, tituloCol) {
                    if (!$.fn.dataTable.isDataTable(tableSelector)) {
                        console.warn("âš ï¸ DataTable no inicializada:", tableSelector);
                        return null;
                    }
                    // Primero intenta con el estado actual
                    let th = ensureColumnVisible(tableSelector, tituloCol);
                    if (th) return th;

                    // Si justo acaba de dibujar, un pequeño defer a veces ayuda
                    return new Promise(resolve => {
                        setTimeout(() => {
                            const th2 = ensureColumnVisible(tableSelector, tituloCol);
                            resolve(th2);
                        }, 50);
                    });
                }
            </script>

            <!-- fin de tutorial    -->
            <script>
                function aplicarRecomendacionesAtributo(results) {
                    const camposRecomendados = new Set();
                    if (!results) return camposRecomendados;

                    const norm = s => (s || "").toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().trim();
                    const recoMap = new Map();
                    for (const [campo, info] of Object.entries(results)) {
                        const sugerido = info?.topCodigo?.valor || "";
                        if (sugerido) recoMap.set(norm(campo), sugerido);
                    }

                    if (Array.isArray(window.campos)) {
                        window.campos = window.campos.map(row => {
                            const key = norm(row.campo);
                            const sugerido = recoMap.get(key);
                            if (!sugerido || (row.codigo && !String(row.codigo).startsWith("***") && row.codigo.trim() !== "")) {
                                return row;
                            }
                            camposRecomendados.add(row.campo.toUpperCase());
                            return { ...row, codigo: `***${sugerido}` };
                        });

                        if (typeof redrawDataTableBuscadorCampos === "function") {
                            redrawDataTableBuscadorCampos("campos", window.campos);
                        } else if ($.fn.dataTable && $.fn.dataTable.isDataTable('#campos')) {
                            $('#campos').DataTable().clear().rows.add(window.campos).draw(false);
                        }
                    }
                    return camposRecomendados;
                }

                function aplicarRecomendacionesDetalle(recoMap) {
                    if (!(recoMap instanceof Map)) return;
                    if (!Array.isArray(window.campos) || !window.campos.length) {
                        console.warn("No hay campos para aplicar recomendaciones.");
                        return;
                    }

                    let aplicadas = 0, yaTenianDetalle = 0, yaTenianReco = 0;

                    window.campos = window.campos.map(row => {
                        const key = (row?.campo ?? '').toString().trim().toUpperCase();
                        if (!key) return row;

                        const reco = recoMap.get(key);
                        if (!reco || !reco.detalle) return row;

                        const detalle = (row.detalle ?? '').toString();
                        const tieneReal = detalle.trim() !== '' && !detalle.startsWith('***');
                        const yaReco = detalle.startsWith('***');

                        if (tieneReal) { yaTenianDetalle++; return row; }
                        if (yaReco) { yaTenianReco++; return row; }

                        aplicadas++;
                        return { ...row, detalle: `***${reco.detalle}` };
                    });

                    // Redibujar DataTable para ver el UI de recomendación
                    if (typeof redrawDataTableBuscadorCampos === "function") {
                        redrawDataTableBuscadorCampos("campos", window.campos);
                    } else if ($.fn.dataTable && $.fn.dataTable.isDataTable('#campos')) {
                        const dt = $('#campos').DataTable();
                        dt.clear().rows.add(window.campos).draw(false);
                    }

                }
            </script>



            <script>
                function getAllCamposFromDT() {
                    if (!$.fn.dataTable || !$.fn.dataTable.isDataTable('#campos')) {
                        console.warn("âš ï¸ #campos no está inicializada como DataTable.");
                        return [];
                    }
                    const rows = $('#campos').DataTable().rows().data().toArray();
                    // dedupe + upper
                    const set = new Set();
                    for (const r of rows) {
                        const c = (r?.campo ?? '').toString().trim();
                        if (c) set.add(c.toUpperCase());
                    }
                    const result = Array.from(set);
                    return result;
                }


                async function recomendarDefinicionesDesdeDataset(camposUpper, url = DATASET_URL_DEFINICION) {
                    if (!Array.isArray(camposUpper) || !camposUpper.length) {
                        console.warn("No hay campos para procesar.");
                        return new Map();
                    }

                    // Descargar dataset
                    let txt = "";
                    try {
                        const resp = await fetch(url, { cache: 'no-store' });
                        if (!resp.ok) {
                            console.warn("No se pudo descargar el dataset:", resp.status, resp.statusText);
                            return new Map();
                        }
                        txt = await resp.text();
                    } catch (err) {
                        console.warn("Error al descargar/leer el dataset:", err);
                        return new Map();
                    }

                    const linesAll = txt.split(/\r?\n/);
                    if (!linesAll.length) return new Map();
                    if (linesAll.length < 2) return new Map(); // Necesita al menos header y una lí­nea de datos

                    // Header
                    let headerIdx = -1;
                    for (let i = 0; i < linesAll.length; i++) {
                        if ((linesAll[i] || '').trim() !== '') { headerIdx = i; break; }
                        if (linesAll[i]?.trim()) { headerIdx = i; break; }
                    }
                    if (headerIdx === -1) return new Map();

                    const headerLine = linesAll[headerIdx];
                    const delim = detectDelimiter(headerLine);
                    const headers = headerLine.split(delim).map(h => (h ?? '').toString().trim());
                    const normHeaders = headers.map(normalizeHeader);

                    const idxCampo = normHeaders.indexOf('campo');
                    const idxDetalle = normHeaders.indexOf('detalle');

                    if (idxCampo === -1 || idxDetalle === -1) {
                        console.warn("âš ï¸ No se encontraron columnas requeridas en el dataset (se necesitan 'campo' y 'detalle'). Headers:", headers);
                        return new Map();
                    }

                    const targetSet = new Set(camposUpper); // CAMPO en UPPER
                    const bucket = new Map(); // CAMPO_UPPER => { total, freqDetalle(Map), ejemplos[] }
                    for (const C of targetSet) bucket.set(C, { total: 0, freqDetalle: new Map(), ejemplos: [] });

                    for (let i = headerIdx + 1; i < linesAll.length; i++) {
                        const line = linesAll[i];
                        if (!line) continue;
                        if (!line?.trim()) continue;
                        const cols = line.split(delim);
                        const campoDS = (cols[idxCampo] ?? '').toString().trim().toUpperCase();
                        let detalleDS = (cols[idxDetalle] ?? '').toString().trim();

                        // â— CORREGIDO: Primero verificar si es un código, luego limpiar.
                        if (detalleDS.startsWith('***') && !isNaN(parseInt(detalleDS.slice(3), 10))) {
                            continue; // Saltar esta lí­nea, no es una definición válida
                        }
                        // Si no es un código, limpiar asteriscos iniciales.
                        while (detalleDS.startsWith('*')) detalleDS = detalleDS.substring(1).trim();

                        if (!campoDS || !targetSet.has(campoDS)) continue;

                        const entry = bucket.get(campoDS);
                        entry.total++;
                        if (detalleDS) entry.freqDetalle.set(detalleDS, (entry.freqDetalle.get(detalleDS) || 0) + 1);
                        if (detalleDS) entry.freqDetalle.set(detalleDS, (entry.freqDetalle.get(detalleDS) || 0) + 1); // El if ya valida que detalleDS no sea vací­o
                        if (entry.ejemplos.length < 6) {
                            entry.ejemplos.push({ linea: i + 1, campo: campoDS, detalle: detalleDS, texto: line });
                        }
                    }

                    // Elegimos detalle más repetido y construimos el Map retorno
                    const recoMap = new Map(); // CAMPO_UPPER -> {detalle, count}
                    const resumen = [];
                    for (const [campoU, info] of bucket.entries()) {
                        let topDetalle = { valor: '', count: 0 };
                        for (const [val, cnt] of info.freqDetalle.entries()) {
                            if (cnt > topDetalle.count) topDetalle = { valor: val, count: cnt };
                        }
                        if (topDetalle.valor) {
                            recoMap.set(campoU, { detalle: topDetalle.valor, count: topDetalle.count });
                        }

                        resumen.push({
                            campo: campoU,
                            coincidencias: info.total,
                            detalle_mas_repetido: topDetalle.valor,
                            repeticiones_detalle: topDetalle.count
                        });

                        /*
                        if (info.total > 0) {
                            info.ejemplos.forEach(e => console.log(`Lí­nea ${e.linea} | detalle="${e.detalle}" â†’ ${e.texto}`));
                            if (info.total > info.ejemplos.length) console.log(`â€¦y ${info.total - info.ejemplos.length} coincidencias más.`);
                        }
                        */
                    }

                    resumen.sort((a, b) => b.coincidencias - a.coincidencias);

                    // â¬…ï¸ DEVUELVE el Map con recomendaciones
                    return recoMap;
                }

                document.getElementById("btnRecomendarDef").addEventListener("click", async () => {
                    // Validar que solo haya un esquema antes de continuar
                    const res = validarUnSoloEsquemaGlobal();

                    if (!res.ok) {
                        if (res.reason === 'MULTIPLES') {
                            const thTabla = await focusTutorialOnColumn('#campos', 'Tabla');
                            if (thTabla) {
                                startSchemaGuide([{
                                    element: thTabla,
                                    position: 'bottom',
                                    html: `<b>Paso 1:</b> Filtra o selecciona una única <em>tabla</em> en esta columna.<br>
                                                 <small>Detectados: ${res.count}. Ej.: ${res.ejemplos.join(", ")}</small>`
                                }]);
                            }
                        } else if (res.reason === 'SIN_FILAS') {
                            notify("warning", "No hay datos en la tabla para generar recomendaciones.", 2500);
                        }
                        return; // Detener si no hay un único esquema
                    }

                    // ðŸ’¡ Validar que el switch de "Agrupar Nivel Tabla" esté activo (AHORA ES LA ÚLTIMA VALIDACIÓN)
                    const switchChecked = document.getElementById("switchS3").checked;
                    if (switchChecked) {
                        startSchemaGuide([{
                            element: document.querySelector("#switchS3").parentElement,
                            position: 'bottom',
                            html: `<b>Acción requerida:</b><br>
                                   Para usar las recomendaciones, necesitas ver los campos individuales. Por favor, <b>desactiva</b> el modo "Agrupar Nivel Tabla".`
                        }]);
                        return; // Detiene la ejecución
                    }

                    if (!$.fn.dataTable || !$.fn.dataTable.isDataTable('#campos')) {
                        console.warn("La DataTable #campos no está inicializada.");
                        return;
                    }
                    const camposUpper = getAllCamposFromDT();
                    if (!camposUpper.length) {
                        console.warn("No hay datos en la tabla para procesar.");
                        return;
                    }

                    showRecoLoader("Generando recomendaciones");

                    try {
                        // 1. Recomendar atributos primero
                        const resultsCod = await contarEnDatasetConCodigo(camposUpper);
                        const camposConAtributoRecomendado = aplicarRecomendacionesAtributo(resultsCod);

                        // 2. Recomendar definiciones SOLO para los campos que NO tienen atributo recomendado
                        const camposParaDefinicion = camposUpper.filter(c => !camposConAtributoRecomendado.has(c));
                        if (camposParaDefinicion.length > 0) {
                            const recoMapDef = await recomendarDefinicionesDesdeDataset(camposParaDefinicion);
                            aplicarRecomendacionesDetalle(recoMapDef);
                        }
                    } catch (err) {
                        console.warn("Error durante el proceso de recomendación:", err);
                    } finally {
                        hideRecoLoader();
                    }

                });

            </script>






            <!-- Overlay de carga para recomendaciones -->
            <div id="recoLoader" class="loader-overlay" style="display:none;">
                <div class="loader-box">
                    <div class="lds-dual-ring"></div>
                    <div class="loader-msg">Generando recomendaciones</div>
                    <div class="progress mt-2" style="width: 100%; height: 10px;">
                        <div id="recoProgressBar" class="progress-bar progress-bar-simulated" role="progressbar"
                            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
                            style="width: 0%; background-color: #D2006E;"></div>
                    </div>
                </div>
            </div>

            <script>
                function showRecoLoader(msg = "Generando recomendaciones") {
                    const el = document.getElementById("recoLoader");
                    if (!el) return;
                    const m = el.querySelector(".loader-msg");
                    if (m) m.textContent = msg;
                    el.style.display = "flex";

                    // deshabilitar botones mientras carga
                    try {
                        document.getElementById("btnRecomendarDef")?.classList.add("disabled");
                        document.getElementById("btnSubirExcel")?.classList.add("disabled");
                        // Si usas el botón de DataTables
                        document.querySelectorAll(".dt-buttons button").forEach(b => b.disabled = true);
                    } catch { }
                }

                function hideRecoLoader() {
                    const el = document.getElementById("recoLoader");
                    if (!el) return;
                    el.style.display = "none";
                    // habilitar botones
                    try {
                        document.getElementById("btnRecomendarDef")?.classList.remove("disabled");
                        document.getElementById("btnSubirExcel")?.classList.remove("disabled");
                        document.querySelectorAll(".dt-buttons button").forEach(b => b.disabled = false);
                    } catch { }
                }
            </script>


            <style>
                /* Overlay pantalla completa */
                .loader-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(255, 255, 255, 0.65);
                    display: none;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    backdrop-filter: blur(1px);
                }

                .loader-box {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: .75rem;
                    padding: 1rem 1.25rem;
                    background: #fff;
                    border-radius: 10px;
                    box-shadow: 0 6px 18px rgba(0, 0, 0, .12);
                    min-width: 260px;
                }

                .lds-dual-ring {
                    display: inline-block;
                    width: 42px;
                    height: 42px;
                }

                .lds-dual-ring:after {
                    content: " ";
                    display: block;
                    width: 42px;
                    height: 42px;
                    margin: 1px;
                    border-radius: 50%;
                    border: 3px solid #D2006E;
                    border-color: #D2006E transparent #D2006E transparent;
                    animation: lds-dual-ring 1s linear infinite;
                }

                @keyframes lds-dual-ring {
                    0% {
                        transform: rotate(0deg);
                    }

                    100% {
                        transform: rotate(360deg);
                    }
                }

                .progress-bar-simulated {
                    width: 0%;
                    animation: simulated-progress 3.5s ease-in-out infinite;
                }

                @keyframes simulated-progress {
                    0% {
                        width: 0%;
                    }

                    30% {
                        width: 65%;
                    }

                    100% {
                        width: 100%;
                    }
                }

                .loader-msg {
                    font-weight: 600;
                    color: #333;
                    text-align: center;
                }
            </style>

            <style>
                .custom-tooltip .tooltip-inner {
                    max-width: 500px !important;
                    /* Aumenta el ancho máximo. !important para asegurar que se aplique. */
                    width: auto;
                    /* Permite que el ancho se ajuste al contenido. */
                    text-align: left;
                    /* Alinea el texto a la izquierda para mejor lectura. */
                }
            </style>
            <style>
                #ownertitle {
                    display: none !important;
                }

                #ownertext {
                    visibility: hidden !important;
                }
            </style>
            <script>
                (function () {
                    const params = new URLSearchParams(window.location.search);
                    const tabla = params.get('tabla') || '';
                    const servidor = params.get('servidor') || '';
                    const base = params.get('base') || '';
                    const esquema = params.get('esquema') || '';
                    if (!tabla) return;
                    const gridContainer = document.getElementById("columna-datatable");
                    const tableWrapper = gridContainer ? gridContainer.querySelector(".mb-2") : null;
                    const loading = document.getElementById("loading");
                    if (tableWrapper) {
                        tableWrapper.style.opacity = "0";
                        tableWrapper.style.visibility = "hidden";
                    }
                    if (loading) {
                        loading.style.display = "block";
                    }

                    const norm = (v) => (v || '').toString().trim().toUpperCase();
                    const hideOwner = () => {
                        const ownertitle = document.getElementById("ownertitle");
                        if (ownertitle) ownertitle.style.display = "none";
                        const ownertext = document.getElementById("ownertext");
                        if (ownertext) ownertext.style.visibility = "hidden";
                    };
                    const desactivarAgrupador = () => {
                        const sw = document.getElementById("switchS3");
                        if (!sw) return;
                        // Si esta activado, un solo click lo desactiva y ejecuta la lógica de columnas/campos
                        if (sw.checked) {
                            sw.click();
                        }
                    };

                    const refineExact = () => {
                        const data = Array.isArray(window.campos) && window.campos.length
                            ? window.campos
                            : (Array.isArray(window.info_tecnica) ? window.info_tecnica : []);
                        if (!data.length) return;
                        const rows = data.filter(row => {
                            const t = norm(row.txt_desc_tabla || row.tabla || row.campo);
                            if (t !== norm(tabla)) return false;
                            if (servidor && norm(row.txt_servidor || row.servidor) !== norm(servidor)) return false;
                            if (base && norm(row.txt_host || row.base) !== norm(base)) return false;
                            if (esquema && norm(row.txt_fuente_esquema || row.esquema) !== norm(esquema)) return false;
                            return true;
                        });
                        if (!rows.length) return;
                        window.campos = rows;
                        window.camposdistinct = (typeof arrayCamposDistinct === 'function') ? arrayCamposDistinct(rows) : rows;
                        desactivarAgrupador();
                        const agrupar = (typeof window.$ === 'function') && window.$("#switchS3").is(':checked');
                        if (typeof setDataTableBuscadorCampos === 'function') {
                            setDataTableBuscadorCampos(agrupar ? window.camposdistinct : window.campos);
                        }
                        if (tableWrapper) {
                            tableWrapper.style.opacity = "1";
                            tableWrapper.style.visibility = "visible";
                        }
                        if (loading) {
                            loading.style.display = "none";
                        }
                    };

                    let attempts = 0;
                    const applyHelper = () => {
                        if (typeof window.$ !== 'function') {
                            if (attempts++ < 30) setTimeout(applyHelper, 300);
                            return;
                        }
                        const dataReady = Array.isArray(window.info_tecnica) && window.info_tecnica.length;
                        if (typeof mostrarbusquedaTabla === 'function' && dataReady) {
                            mostrarbusquedaTabla(norm(servidor), norm(base), norm(esquema), norm(tabla));
                            hideOwner();
                            setTimeout(refineExact, 300);
                            return;
                        }
                        if (typeof segmentarTablaCampos === 'function' && dataReady) {
                            segmentarTablaCampos('campos', norm(servidor), norm(base), norm(esquema), norm(tabla), true, '', true);
                            hideOwner();
                            setTimeout(refineExact, 300);
                            return;
                        }
                        if (attempts++ < 30) {
                            setTimeout(applyHelper, 300);
                        }
                    };

                    window.addEventListener('load', applyHelper);
                })();
            </script>
        </body>

    </html>