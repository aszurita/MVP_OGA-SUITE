<!DOCTYPE html>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<html lang="en" xmlns:mso="urn:schemas-microsoft-com:office:office" xmlns:msdt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882">

<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<head>
    <meta charset="UTF-8">
    <title>Clasificación de Campañas</title>
    <!-- ESTILOS MINIMOS PARA TRABAJAR CON ESTA PLANTILLA -->
    <link rel="icon" type="image/png" href="img/OGA_icon.png" data-icon-default="img/OGA_icon.png" data-icon-navidad="img/OGA_icon_navidad.png">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

    <link rel="stylesheet" href="font/iconsmind-s/css/iconsminds.css" />
    <link rel="stylesheet" href="font/simple-line-icons/css/simple-line-icons.css" />

    <link rel="stylesheet" href="css/vendor/bootstrap.min.css" />
    <link rel="stylesheet" href="css/vendor/bootstrap.rtl.only.min.css" />
    <link rel="stylesheet" href="css/vendor/perfect-scrollbar.css" />
    <link rel="stylesheet" href="css/vendor/component-custom-switch.min.css" />
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
    <link href="https://cdn.jsdelivr.net/npm/@ttskch/select2-bootstrap4-theme@1.5.2/dist/select2-bootstrap4.min.css" rel="stylesheet" />
    <!--== CACHE BUSTING ==-->
    <script>
        var n = new Date().getTime();
        document.write('<link href="css/style.css?v=' + n + '" rel="stylesheet" />');
    </script>
    <!--== /CACHE BUSTING ==-->
    <link rel="stylesheet" href="css/main.css" />
    <link rel="stylesheet" href="css/pagination.css" />


    <script>
        (function () {
            var hoy = new Date();
            var inicioNavidad = new Date(hoy.getFullYear(), 11, 1);
            window.usarLogoNavidad = hoy >= inicioNavidad;
        })();
    </script>


    <style>

        .card {
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            padding: 20px;
            width: 90%;
            max-width: 900px;
            box-sizing: border-box;
        }

        .input-group-container {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: -10px;
        }

        .input-group {
            flex: 1;
            min-width: 250px; /* Ajusta el ancho mí­nimo para que los campos se acomoden bien */
            margin-top: 20px;
        }

        .input-group label {
            font-weight: bold;
            font-size: 1.1em;
            color: #333;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-right: 15px;
            min-width: 100px;
            display: flex;
            align-items: center;
            border-radius: 4px;
            padding: 5px;
        }

        .input-group select,
        .input-group input {
            flex: 1;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
        }

        .confirmation {
            text-align: center;
            margin-top: 30px;
        }

        .confirmation h1 {
            font-size: 1.2em;
            margin-bottom: 20px;
        }

        .confirmation button {
            background-color: rgb(210, 0, 110);
            color: white;
            border: none;
            padding: 12px 24px;
            font-size: 1.1em;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease;
            width: 5px;
            height: 40px;
            border-radius: 10px;
        }


        .btnguardarnomenclatura {
            margin-bottom: 10px;
            transform: translateX(-7px);
        }

        /* Media query para pantallas pequeñas */
        @media (max-width: 768px) {
            .input-group-container {
                flex-direction: column;
            }
            
            .input-group {
                margin-bottom: 15px; /* Espacio entre campos cuando están uno debajo del otro */
            }
        }

        p.concatenar {
            margin-top: 1px;
            padding-top: 10px;
        }

        .select2-container--bootstrap4 .select2-results__option--highlighted, .select2-container--bootstrap4 .select2-results__option--highlighted.select2-results__option[aria-selected="true"] {
        color: #fff;
        background-color: rgb(210, 0, 110);
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            border-bottom: 1px solid #ddd;
            padding: 1px;
            font-family: 'Roboto', sans-serif;
            font-weight: 700;
        }

        .portapapeles{
            border: none;
            background-color: white;
        }
        .btnCopiar_portapapeles{
            height: 20px;
            background-color: white;
            border: none;
            margin-top: -10px;
            margin-left: 10px;
        }
        .modal-copiar-portapapeles{
            display: flex;
            margin-left: 30%;
        }

        .consulta_catalogo_nomenclatura{
            border: none;
            background-color: white;
            transform: translateX(-190px);
            margin-top: -5px;
        }

        .modal_consulta_lista_Nomenclaturas{
            display: none; 
            position: absolute;
            top: 11%;
            left: 50%;
            transform: translate(-50%, 0%);
            z-index: 1000; 
            background-color: white; 
            padding: 20px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); 
            border-radius: 10px;
            overflow-y: auto;
            height: 70dvh;
        }

        .modal_consulta_lista_Nomenclaturas.active {
            display: block; 
            width: 700px;
            padding: 10px;
        }

        .close_consulta {
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
            color: #aaa;
        }

        div.dataTables_wrapper div.dataTables_filter input {
            margin-left: 0;
            border: 0.5px solid #696767;
            padding: 6px;
            border-radius: 13px;
            width : 300px;
            height :40px;
            position: relative;
            top: 0;
            left: 0;
            margin-top: 10px;
        }

        .dataTables_length {
            position: absolute;
            bottom: 0;
            right: 0;
            display: flex;
            padding-right: 70px;
            transform: translateY(-30px); 
        }

        .dataTables_info {
            position: absolute;
            bottom: 0;
            left: 0;
            padding-left: 30px;
            transform: translateY(-40px);
        }

        #consulta_lista_Nomenclaturas_length label {
        display: flex;
        }

        .btn_formulario_Nomenclaturas_Campañas{
            border: none;
            background-color: white;
            margin-top: -9px;
        }

        .modal_formulario_Nomenclaturas_Campañas{
            display: none;
            position: absolute;
            top: 9%;
            left: 50%;
            transform: translate(-50%, 0%);
            z-index: 999;
            background-color: white;
            padding: 20px; 
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); 
            border-radius: 10px;
            overflow-y: auto;
            height: 70dvh;
        }

        .modal_formulario_Nomenclaturas_Campañas.active {
            display: block; 
            width: 825px;
            padding: 10px;
        }

        .close_consulta_formulario_Nomenclaturas_Campañas {
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
            color: #aaa;
        }
        .ui-autocomplete {
            z-index: 1050; 
        }
        .centered-div {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            text-align: center; 
            word-wrap: break-word; 
            padding: 1px;
            margin-left: -71px;
        }
        
    
        .concatenar {
            margin: 0;
            font-weight: bold;
        }

        #consulta_lista_Nomenclaturas {
            width: 100% !important;
        }
        
        table.dataTable {
            min-width: 500px !important;
            border-collapse: none  !important;
        }

        .dataTables_scrollHeadInner {
            width: 100% !important;
        }

        #consulta_mis_campañas_generadas_wrapper .dataTables_paginate {
        display: none;
        }

        #consulta_mis_campañas_generadas_wrapper .dataTables_length {
        display: none;
        }

        #consulta_mis_campañas_generadas_wrapper .dataTables_info {
            display: none;
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
                <input placeholder="Buscar...">
                <span class="search-icon">
                    <i class="simple-icon-magnifier"></i>
                </span>
            </div>
        </div>

        <a class="navbar-logo" href="OGASuite.aspx">
            <img id="logo-navbar" class="logo logo--invert d-none d-xs-block" src="logos/oga_color.png" data-logo-default="logos/oga_color.png" data-logo-navidad="logos/oga_navidad.png">
            <img class="logo-mobile d-block d-xs-none" src="logos/OGA_icon.png" data-logo-default="logos/OGA_icon.png" data-logo-navidad="logos/OGA_icon_navidad.png">
            <div id="contenedor-nieve"></div>
        </a>
        <script>
            (function () {
                var usarLogoNavidad = window.usarLogoNavidad === true;
                var logoNavbar = document.getElementById('logo-navbar');
                if (logoNavbar) {
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
                }
                var favicon = document.querySelector('link[rel="icon"]');
                if (favicon) {
                    var iconDefault = favicon.getAttribute('data-icon-default') || favicon.getAttribute('href');
                    var iconNavidad = favicon.getAttribute('data-icon-navidad') || iconDefault;
                    favicon.setAttribute('href', usarLogoNavidad ? iconNavidad : iconDefault);
                }
                var logoMobile = document.querySelector('.logo-mobile');
                if (logoMobile) {
                    var mobileDefault = logoMobile.getAttribute('data-logo-default') || logoMobile.getAttribute('src');
                    var mobileNavidad = logoMobile.getAttribute('data-logo-navidad') || mobileDefault;
                    logoMobile.setAttribute('src', usarLogoNavidad ? mobileNavidad : mobileDefault);
                }
            })();
        </script>

        <div class="navbar-right">
            <div class="header-icons d-inline-block align-middle">
                <!-- CARGADO DESDE JS (revisar navbar() en suite.js) -->
                <div class="position-relative d-none d-sm-inline-block">
                    <button class="header-icon btn btn-empty" type="button" id="iconMenuButton" data-toggle="dropdown"
                        aria-haspopup="true" aria-expanded="false">
                        <i class="simple-icon-grid"></i>
                    </button>
                    <div class="dropdown-menu dropdown-menu-right mt-3  position-absolute" id="iconMenuDropdown">
                        <a href="http://vamos.bancoguayaquil.com/sitios/informaciongerencial/Paginas/ANALYTICS/Marlon%20Z/PAGINAS/COMUNIDAD_ANALITICA/index.aspx"
                        class="icon-menu-item quicklinks">
                            <img src="img/datahub.png" alt="Logo DataHub">
                            <span>Data Hub</span>
                        </a>
                    </div>
                </div>

                <div class="position-relative d-inline-block">
                </div>

            </div>
        </div>
    </nav>
    <div class="menu">
        <!-- DESDE JS (revisar navbar() en suite.js) -->
        <div class="main-menu">
            <div class="scroll">
                <ul class="list-unstyled" id="suite-navbar">
                    <li>
                        <a href="SobreOGA.aspx">
                            <i class="simple-icon-question"></i>
                            <span>Acerca de Nosotros</span>
                        </a>
                    </li>
                    <li class="active">
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
        <!-- SUBMENU CARGADO DESDE JS (revisar navbar() en suite.js) -->
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
    <!-- ESPACIO PRINCIPAL-BODY DEL SITIO -->
    <main>
        <div class="container-fluid">
            <div class="row pb-2">
                <div class="col-12">
                    <h1 id="nombre-dominio">Nombre de Dominio</h1>
                        <nav class="breadcrumb-container d-none d-sm-block d-lg-inline-block" aria-label="breadcrumb">
                            <ol class="breadcrumb pt-0" id="secciones-dominio">
                                <li class="breadcrumb-item">
                                    <a id="a-dominio" href="FichaDominio.aspx">Ficha de Dominio</a>
                                </li>
                                <li class="breadcrumb-item">
                                    <a id="a-estructura" href="Dominio_estructura.aspx">Estructura</a>
                                </li>
                                <li class="breadcrumb-item filtro-actual">
                                    <a id="a-artefactos" href="">Artefactos</a>
                                </li>
                                <li class="breadcrumb-item">
                                    <a id="a-terminos" href="Dominio_terminos_atributos.aspx">Terminos y Atributos</a>
                                </li>
                                <li class="breadcrumb-item">
                                    <a id="a-actas" href="">Acta de Reunión</a>
                                </li>
                                <li class="breadcrumb-item">
                                    <a id ="a-metadatos" href="">Metadatos y Linaje</a>
                                </li>
                            </ol>
                        </nav>
                    <div class="mb-2">
                        <h3 id = "subtitulo"><i class="simple-icon-arrow-left-circle m-1 regresar" onclick="history.back()"></i>    Clasificación de Campañas</h3>
                        <div class="separator mb-1"></div>
                        <div style="display: flex;justify-content: flex-end;margin-top : -28px;">
                            <button id="btn_formulario_Nomenclaturas_Campañas" class="btn_formulario_Nomenclaturas_Campañas" data-toggle="tooltip" title="Clasificación de Campañas">
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-binoculars-fill" viewBox="0 0 16 16">
                                    <path d="M4.5 1A1.5 1.5 0 0 0 3 2.5V3h4v-.5A1.5 1.5 0 0 0 5.5 1zM7 4v1h2V4h4v.882a.5.5 0 0 0 .276.447l.895.447A1.5 1.5 0 0 1 15 7.118V13H9v-1.5a.5.5 0 0 1 .146-.354l.854-.853V9.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v.793l.854.853A.5.5 0 0 1 7 11.5V13H1V7.118a1.5 1.5 0 0 1 .83-1.342l.894-.447A.5.5 0 0 0 3 4.882V4zM1 14v.5A1.5 1.5 0 0 0 2.5 16h3A1.5 1.5 0 0 0 7 14.5V14zm8 0v.5a1.5 1.5 0 0 0 1.5 1.5h3a1.5 1.5 0 0 0 1.5-1.5V14zm4-11H9v-.5A1.5 1.5 0 0 1 10.5 1h1A1.5 1.5 0 0 1 13 2.5z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row mt-2" id="tipos_campañas">
            </div>
            <nav class="mt-4 mb-4">
                <div class="pagination justify-content-center"></div>
            </nav>
        </div>
    </main>

    <!-- /MODAL DEL FORMULARIO DE NOMENCLATURA-->
    <div class="modal_formulario_Nomenclaturas_Campañas" id ="modal_formulario_Nomenclaturas_Campañas" >
        <div class="modal-header">
            <h2>Nomenclaturas de Campañas</h2>
            <button id="btncatalogo_nomenclatura" class="consulta_catalogo_nomenclatura" data-toggle="tooltip" title="Consulta de Nomenclaturas">
                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" d="M11 4.717c-2.286-.58-4.16-.756-7.045-.71A1.99 1.99 0 0 0 2 6v11c0 1.133.934 2.022 2.044 2.007 2.759-.038 4.5.16 6.956.791V4.717Zm2 15.081c2.456-.631 4.198-.829 6.956-.791A2.013 2.013 0 0 0 22 16.999V6a1.99 1.99 0 0 0-1.955-1.993c-2.885-.046-4.76.13-7.045.71v15.081Z" clip-rule="evenodd"/>
                  </svg>
            </button>
            <span class="close_consulta_formulario_Nomenclaturas_Campañas">&times;</span>
        </div>
        <div class="input-group">
            <label for="categoria">INICIATIVA</label>
            <input type="text" id="input_iniciativa" style="text-transform: uppercase;">
        </div>
        <div class="input-group-container">
            <div class="input-group">
                <label for="categoria">CATEGORIA</label>
                <select id="categoria" class="form-control select2-single" onchange="actualizacion_clave()" data-width="100%">
                    <option value="">Seleccione una opción</option>
                </select>
            </div>
            <div class="input-group">
                <label for="subcategoria">SUB CATEGORIA</label>
                <select id="subcategoria" class="form-control select2-single" onchange="actualizacion_clave()" data-width="100%">
                    <option value="">Seleccione una opción</option>
                </select>
            </div>
            <div class="input-group">
                <label for="descripcion_campaña">DESCRIPCION DE CAMPÁí‘A</label>
                <input type="text" id="descripcion_campaña" oninput="actualizacion_clave()" style="text-transform: uppercase;">
            </div>
        </div>
        <div class="modal-copiar-portapapeles">
            <div class="centered-div">
                <p class="concatenar">Tu Clave de campaña es: <br> <span id="clave">-</span></p>
                <button class="btnCopiar_portapapeles" data-toggle="tooltip" title="Copiar en el portapapeles" onclick="copiarAlPortapapeles()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-clipboard portapapeles" viewBox="0 0 16 16">
                        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
                        <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/>
                    </svg>
                </button>
            </div>
        </div>
        <div class="confirmation">
            <h1>Â¿Deseas crear la clave en producción?</h1>
            <button onclick="ListenerGuardarClaveCampaña()" data-toggle="tooltip" title="Guardar clave" >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-floppy-fill btnguardarnomenclatura" viewBox="0 0 16 16">
                    <path d="M0 1.5A1.5 1.5 0 0 1 1.5 0H3v5.5A1.5 1.5 0 0 0 4.5 7h7A1.5 1.5 0 0 0 13 5.5V0h.086a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5H14v-5.5A1.5 1.5 0 0 0 12.5 9h-9A1.5 1.5 0 0 0 2 10.5V16h-.5A1.5 1.5 0 0 1 0 14.5z"/>
                    <path d="M3 16h10v-5.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5zm9-16H4v5.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5zM9 1h2v4H9z"/>
                </svg>    
            </button>
        </div>
        <div>
            <div class="modal-header">
                <h2>Mis campañas Generadas</h2>
                <div id="segmentador-container" class="some-container">
                                        
                    <div class="btn-group float-md-right mr-1 mb-1">                      
                        <button class="btn btn-segmentar btn-xs dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="segmentar-tabla-btn"> Segmentar Por Todos
                        </button>
                        <div class="dropdown-menu" x-placement="bottom-start" style="position: absolute; will-change: transform; margin-right: 75px; top: 0px; left: 0px; transform: translate3d(0px, 26px, 0px);">
                            <a class="dropdown-item" href="#" id="opcion-todas">Todas</a>
                            <a class="dropdown-item" href="#" id="mis-campañas">Mis Campañas</a>
                        </div> 
                    </div>
                </div>
            </div>
            <table id="consulta_mis_campañas_generadas" class="table" >
                    <thead>
                        <tr>
                            <th>nombre_campaña</th>
                            <th>categoria</th>
                            <th>sub-categoria</th>
                            <th>descripcion</th>
                            <th>cod_usuario</th>
                            <th>fecha_creacion</th>
                        </tr>
                    </thead>
                <tbody>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Modal tabla de consulta de lista de Nomenclaturas -->
    <div id="modal_consulta_lista_Nomenclaturas" class="modal_consulta_lista_Nomenclaturas">
        <div class="modal-header">
            <h2>Nomenclatura de Campañas</h2>
            <span class="close_consulta">&times;</span>
        </div>
        <table id="consulta_lista_Nomenclaturas" class="table tabla_diccionario_Nomenclaturas" >
                <thead>
                    <tr>
                        <th>INICIATIVA</th>
                        <th>CATEGORIA</th>
                        <th>SUB CATEGORIA</th>
                    </tr>
                </thead>
            <tbody>
            </tbody>
        </table>
    </div>
    
    <!-- /ESPACIO PRINCIPAL-BODY DEL SITIO -->
    <footer class="page-footer" style="bottom:-20%;">
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

    <!-- Las siguientes son las librerí­as mí­nimas para desarrollar un nuevo sitio con la plantilla Dore -->
    <script src="js/vendor/jquery-3.3.1.min.js"></script>
    <script src="js/vendor/bootstrap.bundle.min.js"></script>
    <script src="js/vendor/perfect-scrollbar.min.js"></script>
    <script src="js/dore.script.js"></script>
    <script src="js/scripts.single.theme.js"></script>
    <script src="js/pagination.min.js"></script>
    <script src="js/jquery.SPServices.v2014-02.min.js"></script> <!-- LIBRERÍA QUE PERMITE CONEXIÓN HACIA SHAREPOINT -->
    <script src="js/vendor/datatables.min.js" ></script>
    <script src="js/vendor/buttons.dataTables.min.js"></script>
    <script src="js/vendor/jszip.min.js"></script>
    <script src="js/vendor/buttons.html5.min.js"></script>
    <script src="js/vendor/dataTables.Resize.js"></script>
    <script src="js/vendor/bootstrap-notify.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>
    <!--== CACHE BUSTING ==-->
    <script>
        var n = new Date().getTime();
        document.write('<script src="js/suite.js?v=' + n + '"> <' + '/' + 'script>');
    </script>
    <!--== /CACHE BUSTING ==-->

    <!--Accion para concatenar lo que se coloque en el combo -->
    <script>
        function actualizacion_clave() {
            const categoria = document.getElementById('categoria').value;
            const subcategoria = document.getElementById('subcategoria').value;
            const descripcion_campaña = document.getElementById('descripcion_campaña').value.toUpperCase();
            document.getElementById('clave').innerText = `${categoria}-${subcategoria}-${descripcion_campaña}`;
        }

    </script>

    <!--Accion para abir modal de consulta de listado de tabla con lista Nomenclaturas -->
    <script>
        // Código para abrir y cerrar el modal
        let modal_consulta = document.getElementById("modal_consulta_lista_Nomenclaturas");
        let btn_consulta = document.getElementById("btncatalogo_nomenclatura");
        let span_consulta = document.getElementsByClassName("close_consulta")[0];

        btn_consulta.onclick = function() {
            registrar_visita("NOMENCLATURAS CAMPAí‘AS","CONSULTA DE NOMENCLATURAS CAMPAí‘AS");
            modal_consulta.classList.add('active');
        }

        span_consulta.onclick = function() {
            modal_consulta.classList.remove('active');
        }

        window.onclick = function(event) {
            if (event.target == modal_consulta) {
                modal_consulta.classList.remove('active');
            }
        }
    </script>

    <!--Accion para abir modal del formulario claves de campañas -->
    <script>
        // Código para abrir y cerrar el modal
        let modal_form_nomenclaturas = document.getElementById("modal_formulario_Nomenclaturas_Campañas");
        let btn_form_nomenclaturas = document.getElementById("btn_formulario_Nomenclaturas_Campañas");
        let span_form_nomenclaturas = document.getElementsByClassName("close_consulta_formulario_Nomenclaturas_Campañas")[0];

        btn_form_nomenclaturas.onclick = function() {
            registrar_visita("NOMENCLATURAS CAMPAí‘AS","FORMULARIO DE NOMENCLATURAS CAMPAí‘AS");
            // Obtén la URL actual
            const currentUrl = new URL(window.location.href);

            // Elimina el parámetro
            currentUrl.searchParams.set("modal", "1");

            // Actualiza la URL en el historial del navegador sin recargar la página
            window.history.replaceState(null, '', currentUrl.toString());

            modal_form_nomenclaturas.classList.add('active');
        }

        span_form_nomenclaturas.onclick = function() {
            // Obtén la URL actual
            const currentUrl = new URL(window.location.href);

            // Elimina el parámetro
            currentUrl.searchParams.delete("modal");

            // Actualiza la URL en el historial del navegador sin recargar la página
            window.history.replaceState(null, '', currentUrl.toString());
            modal_form_nomenclaturas.classList.remove('active');
        }

        window.onclick = function(event) {
            if (event.target == modal_form_nomenclaturas) {
                modal_form_nomenclaturas.classList.remove('active');
            }
        }
    </script>

    <script>
        $(document).ready(campañas());
    </script>

    <!--Funciones para los modales -->
    <script>
        $(document).ready(function() {
            ListadoNomenclaturas();
        });
    </script>
</body>

</html>
