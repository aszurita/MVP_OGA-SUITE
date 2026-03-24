<!DOCTYPE html>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<html lang="en" xmlns:mso="urn:schemas-microsoft-com:office:office" xmlns:msdt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882">

<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<head>
    <meta charset="UTF-8">
    <title>Ficha Atributo</title>
    <link rel="icon" type="image/png" href="img/OGA_icon.png" data-icon-default="img/OGA_icon.png" data-icon-navidad="img/OGA_icon_navidad.png">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

    <link rel="stylesheet" href="font/iconsmind-s/css/iconsminds.css" />
    <link rel="stylesheet" href="font/simple-line-icons/css/simple-line-icons.css" />

    <link rel="stylesheet" href="css/vendor/bootstrap.min.css" />
    <link rel="stylesheet" href="css/vendor/bootstrap.rtl.only.min.css" />
    <link rel="stylesheet" href="css/vendor/component-custom-switch.min.css" />
    <link rel="stylesheet" href="css/vendor/perfect-scrollbar.css" />
    <link rel="stylesheet" href="css/vendor/dataTables.colResize.css" />
    <link rel="stylesheet" href="css/vendor/dataTables.bootstrap4.min.css" />
    <script>
        var n = new Date().getTime();
        document.write('<link href="css/style.css?v='+n+'" rel="stylesheet" />');
    </script>
    <link rel="stylesheet" href="css/main.css" />
    <script>
        (function () {
            var hoy = new Date();
            var inicioNavidad = new Date(hoy.getFullYear(), 11, 1);
            window.usarLogoNavidad = hoy >= inicioNavidad;
        })();
    </script>
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">

    <style>
        .resumen-metadatos-linaje {
            width: 280px!important;
            position: absolute;
            z-index: 1020;
            top: 50%;
            right: 0;
            /* background: #fff; */
            /* box-shadow: 0 1px 15px rgba(0,0,0,.04), 0 1px 6px rgba(0,0,0,.04); */
            transform: translate(280px,-50%);
            padding-top: 10px;
            padding-bottom: 10px;
            transition: transform .4s ease-out;
        }
        .resumen-metadatos-linaje .resumen-metadatos-linaje-button {
            position: absolute;
            left: -47px;
            background: #fff;
            padding: 13px;
            border-radius: .2rem;
            color: #3a3a3a;
            /* box-shadow: -2px 0 5px rgba(0,0,0,.04); */
            box-shadow: -2px 0px 10px rgba(0, 0, 0, 0.2); /* Sombra del modal */
            font-size: 20px;
            top: 50%;
            transform: translateY(-50%);
            color: #00365a;
        }
        
        .resumen-metadatos-linaje.shown {
            transform: translate(0,calc(-50% + .5px));
            transition: transform .4s ease-out;
        }

        .link_subrrayado {
            cursor: pointer;
        }

        .link_subrrayado:hover {
            text-decoration: underline;
            color: #D2006E !important;
        }


    .modal_editar_indicadores {
        display: none; /* Oculta el modal por defecto */
        position: fixed; /* Fija el modal en la pantalla */
        top: 2%; /* Posiciona el modal en la parte superior */
        /* left: 54.5%; Posiciona el modal en el centro horizontal */
        /* transform: translate(-50%, 0%); Ajusta el modal para que esté perfectamente centrado */

        
        z-index: 1050; /* Asegura que el modal esté por encima de otros elementos */
        background-color: white; /* Color de fondo del modal */
        padding: 20px; /* Espaciado interno del modal */
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); /* Sombra del modal */
        border-radius: 10px; /* Bordes redondeados */
    }

    .modal-content {
        max-width: 100%; /* Ancho máximo del contenido del modal */
        margin: auto; /* Centra el contenido dentro del modal */
        border-radius: 10px !important;
    }


    .valor-input-text{
        color:#e9ecef
    }

    .modal_editar_indicadores.active {
        display: flex; /* Muestra el modal cuando tiene la clase 'active' */
        width: 85%;
        padding: 15px;
        height: 80vh;
        overflow-y: auto;
    }

    .modal_consulta_calidad{
        display: none; /* Oculta el modal por defecto */
        position: fixed; /* Fija el modal en la pantalla */
        top: 14%; /* Posiciona el modal en la parte superior */
        left: 50%; /* Posiciona el modal en el centro horizontal */
        transform: translate(-50%, 0%); /* Ajusta el modal para que esté perfectamente centrado */
        z-index: 1052; /* Asegura que el modal esté por encima de otros elementos */
        background-color: white; /* Color de fondo del modal */
        padding: 20px; /* Espaciado interno del modal */
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); /* Sombra del modal */
        border-radius: 10px; /* Bordes redondeados */
    }

    .modal_consulta_calidad.active {
        display: block; /* Muestra el modal cuando tiene la clase 'active' */
        width: 70%;
        padding: 10px;
    }


    .input_procentajes{
        width: 50%;
    }

    form#form_indicadores {
    text-align: center;
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

    #consulta_indicadores_calidad_length label {
        display: flex;
    }


    #indicadores_calidad_wrapper .dataTables_length {
        display: none;
    }

    #indicadores_calidad_wrapper .dataTables_info {
        display: none;
    }


    .dataTables_scrollBody{
        width: 100% !important;
        overflow-x: auto !important; 
    }
 
    .dataTables_scrollHeadInner{
        width: 100% !important;
        min-width: 100%; 
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

    .checkbox-no-aplica-wrapper{
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .select-entidades{
        overflow-y: auto;
        max-height: 400px;
        padding: 1px;
        position: fixed;
    }

    .btnGuardarIndicadores{
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
    .form-group{
        margin-bottom: 0px;
        display: flex;
        flex-direction: row;
        padding-right: 50px;
        width: 170px;
    }

    .form-group-title{
        display: flex;
        flex-direction: column;
    }

    .input_datos_tabla{
        border-radius: 5px;
        border-width: 0.1px;
        margin-bottom: 5px;
        border: none; 
        outline: none; 
        box-shadow: none;
        pointer-events: none; 
    }

    .label_datos_tabla{
        font-weight: bold;
    }

    .ui-autocomplete {
        z-index: 1055; 
    }
    

    #indicadores_calidad_wrapper .dataTables_paginate {
    display: none;
    }


    .tabla_indicadores_calidad {
        min-width: 300px !important; /* Ancho minimo de la tabla */    
        width: 100% !important; /* Ancho fijo de la tabla */
        table-layout: fixed; /* Asegura que las columnas respeten el ancho definido */
    }

    .tabla_indicadores_calidad th, .tabla_indicadores_calidad td {
        width:20%; /* Ancho fijo de las columnas */
        overflow: hidden; /* Oculta el contenido desbordado */
        text-overflow: ellipsis; /* Agrega "..." al contenido desbordado */
        white-space: nowrap; /* Evita que el texto se divida en varias lí­neas */
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        border-bottom: 1px solid #ddd;
        padding: 1px;
    }

    .close {
        font-size: 28px;
        font-weight: bold;
        cursor: pointer;
        color: #aaa;
    }

    .close_consulta {
        font-size: 28px;
        font-weight: bold;
        cursor: pointer;
        color: #aaa;
    }

    .btnGuardarIndicadores:disabled {
        color: #696767;
        cursor: not-allowed; /* Cambia el cursor para indicar que el botón está deshabilitado */
        opacity: 0.6; /* Reduce la opacidad del botón para hacerlo parecer deshabilitado */
    }

    input.form-control.form-input-valor.valor_calidad_atributo {
        height: 25px;
        width: 100%;
        /*transform: translateX(20px);*/
    }

    input.form-control.form-input-valor.valor_calidad_reglas {
        width: 100%;
        height: 25px;
        /*transform: translateX(20px);*/
    }

    button.btnConsultarCalidad {
        /* height: 30px;
        width: 30px; */
        padding: .5rem;
        border: 0px;
        background-color: rgb(210, 0, 110);
        color: white;
        border-radius: 3px;
    }

    ul.pagination {
        margin-bottom: 0;
    }


    .input-campos-search-select{
        overflow-y: auto;
    }

    .modal-backdrop{
        top: 100px !important;
        width: 110vw;
    }

    .modal{
        top:50px;
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

                <div class="position-relative d-none d-sm-inline-block">
                    <button class="header-icon btn btn-empty" type="button" id="iconMenuButton" data-toggle="dropdown"
                        aria-haspopup="true" aria-expanded="false">
                        <i class="simple-icon-grid"></i>
                    </button>
                    <div class="dropdown-menu dropdown-menu-right mt-3  position-absolute" id="iconMenuDropdown">
                        <a href="http://vamos.bancoguayaquil.com/sitios/informaciongerencial/Paginas/ANALYTICS/Marlon%20Z/PAGINAS/COMUNIDAD_ANALITICA/index.aspx" class="icon-menu-item quicklinks">
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
                <div class="col-12" style="padding:18px">
                    <i class="simple-icon-arrow-left-circle m-1 regresar" onclick="history.back()"></i><h1 style="padding-left:5px">Ficha de Atributo</h1>
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
            <div class="row pl-3">
                <div class="col-12" >
                    <div class="card">
                        <div class="card-body">
                            <div class="d-flex align-items-center" style="padding-bottom:10px">
                                <i class="simple-icon-arrow-down simple-icon-arrow-up" onclick="toggleAll()" style="cursor:pointer;color:#D2006E" id="icono-expandir"></i>
                                <h3 id="nombre-atributo" class="d-inline-block font-weight mb-0 pl-1 mr-2" style="color:#D2006E">Nombre de Atributo</h3>
                                <div id="caracteristicas-badges" class="pb-1">
                                </div>
                            </div>
                            <div id="accordion">
                                <div class="border">
                                    <div id="paint1">
                                        <i class="simple-icon-arrow-down pt-3 pr-2 simple-icon-arrow-up" onclick="toggleArrow(this)" style="cursor:pointer;float: right;" data-toggle="collapse" data-target="#detalle" aria-expanded="false" aria-controls="detalle"></i>
                                        <button style="display:flex;width: 90%;justify-content:flex-start" onclick="expandir(this)" class="btn btn-link collapsed" data-toggle="collapse" data-target="#detalle" aria-expanded="false" aria-controls="detalle">
                                            <p class="mb-0" style="font-size:15px">Detalle</p>
                                        </button>
                                    </div>
                                   
                                    
                                    <div id="detalle" class="collapse">
                                        <div class="p-4">
                                            <p><span class="font-weight-bold">Dominio: </span><span id="dominio">Dominio</span></p>
                                            <p><span class="font-weight-bold">Sub Dominio: </span><span id="subdominio">Dominio</span></p>
                                            <p><span class="font-weight-bold">Sub Categorí­a: </span><span id="subcategoria">Sub Categorí­a</span></p>
                                            <p><span class="font-weight-bold">Descripción: </span><span id="observacion">Descripción.</span></p>
                                            <p><span class="font-weight-bold">Tipo de Atributo:</span></p>
                                            <div id="caracteristicas"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="border">
                                    <div id="paint2">
                                        <i class="simple-icon-arrow-down pt-3 pr-2 simple-icon-arrow-up" onclick="toggleArrow(this)" style="cursor:pointer;float: right;" data-toggle="collapse" data-target="#informaciontecnica" aria-expanded="false" aria-controls="informaciontecnica"></i>
                                        <button style="display:flex;width: 90%;justify-content:flex-start" onclick="expandir(this)" class="btn btn-link collapsed" data-toggle="collapse" data-target="#informaciontecnica" aria-expanded="false" aria-controls="informaciontecnica">
                                            <p class="mb-0" style="font-size:15px">Metadatos y Linaje</p>
                                        </button>
                                    </div>
                                   
                                    <div id="informaciontecnica" class="collapse">
                                        <div class="p-4" style="position:relative; overflow-x: hidden;">
                                            <div class="resumen-metadatos-linaje default-transition" style="opacity: 1;">
                                                <div class="card h-100 ">
                                                    <div class="card-body ">
                                                        
                                                       <div class="d-flex flex-column justify-content-center align-items-center">
                                                            <div class="chart-container" style="width: 130px; height: 140px;">
                                                                <canvas id="resumen-chart"></canvas>
                                                            </div>
                                                            <p id="numeroEntidadesResumen" style="font-weight: 600;"></p>
                                                            <div id="resumen-contadores" class="d-flex w-100">
                                                                <div class="container" style="display:grid; grid-template-columns: repeat(2, 1fr);gap: 12px;">
                                                                    <div class="custom-card align-items-center mx-2 p-1">
                                                                        <span id="resumen-contador-bases" class="text-primary">0</span>
                                                                        <span class="text-secondary">Bases</span>
                                                                    </div>
                                                                    <div class="custom-card align-items-center mx-2 p-1">
                                                                        <span id="resumen-contador-tablas" class="text-primary">0</span>
                                                                        <span class="text-secondary">Tablas</span>
                                                                    </div>
                                                                    <div class="custom-card align-items-center mx-2 p-1">
                                                                        <span id="resumen-contador-campos" class="text-primary">0</span>
                                                                        <span class="text-secondary">Campos</span>
                                                                    </div>
                                                                    <div class="custom-card align-items-center mx-2 p-1">
                                                                        <span id="resumen-contador-artefactos" class="text-primary">0</span>
                                                                        <span class="text-secondary">Artefactos</span>
                                                                    </div>
                                                                </div>
                                                                
                                                                
                                                            </div>
                                                       </div>
                                                    </div>
                                                </div>
                                                <a href="#" class="resumen-metadatos-linaje-button text-primary" data-toggle="tooltip" data-placement="top" title="Resumen"> <i class="simple-icon-chart"></i> </a>
                                            </div>
                                            <table id="tabla" class="table" style="border-collapse: separate;">
                                                <thead>
                                                    <tr>
                                                        <th>Servidor</th>
                                                        <th>Esquema</th>
                                                        <th>Base</th>
                                                        <th>Tabla</th>
                                                        <th>Campo</th>
                                                        <th>Tipo de Dato</th>
                                                        <th>Largo</th>
                                                        <th>Permite Null</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                </tbody>
                                            </table>
                                            
                                                <div id="mostrarerror" class="card  mb-3  mr-2">
                                                
                                                    <div class="card-body">
                                                        <div class="d-flex flex-row pb-2">
                                                            
                                                            <div class=" d-flex flex-grow-1 min-width-zero">
                                                                <div
                                                                    class="m-2 pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
                                                                    <div class="min-width-zero">
                                                                        <p class="mb-0 truncate list-item-heading">Sección No Disponible</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                    
                                                        <div class="chat-text-left">
                                                            <p class="mb-0 text-semi-muted">
                                                                Continúa explorando las demás opciones!
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            
                                        </div>

                                      
                                    </div>
                                </div>
                                <div class="border">
                                    <div id="paint3">
                                        <i class="simple-icon-arrow-down pt-3 pr-2 simple-icon-arrow-up" onclick="toggleArrow(this)" style="cursor:pointer;float: right;" data-toggle="collapse" data-target="#origen" aria-expanded="false" aria-controls="origen"></i>
                                        <button style="display:flex;width: 90%;justify-content:flex-start" onclick="expandir(this)" class="btn btn-link collapsed" data-toggle="collapse" data-target="#origen" aria-expanded="false" aria-controls="origen">
                                            <p class="mb-0" style="font-size:15px">Origen Datos de Referencia</p>
                                        </button>
                                    </div>
                                   
                                    <div id="origen" class="collapse">
                                        <div class="p-4">
                                            <table id="catalogoficha" class="table"style="border-collapse: separate;" >
                                                <thead>
                                                    <tr>
                                                        <th>Código</th>
                                                        <th>Nombre</th>
                                                        <th>Descripción</th>
                                                        <th>Plataforma</th>
                                                        <th>Servidor</th>
                                                        <th>Ubicación</th>
                                                        <th>Observación</th>
                                                        <th>Responsable</th>
                                                        <th>Validado</th>                                                   </tr>
                                                </thead>
                                                <tbody>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div class="border">
                                    <div id="paint4">
                                        <i class="simple-icon-arrow-down pt-3 pr-2 simple-icon-arrow-up" onclick="toggleArrow(this)" style="cursor:pointer;float: right;" data-toggle="collapse" data-target="#indicadores" aria-expanded="false" aria-controls="indicadores"></i>
                                        <button style="display:flex;width: 90%;justify-content:flex-start" onclick="expandir(this)" class="btn btn-link collapsed" data-toggle="collapse" data-target="#indicadores" aria-expanded="false" aria-controls="indicadores">
                                            <p class="mb-0" style="font-size:15px">Indicadores de Calidad</p>
                                        </button>
                                    </div>

                                    
                                    <div id="indicadores" class="collapse row"style="align-items: center;justify-content: center;padding:0px" >
                                        
                                        <div style="display: flex; justify-content: flex-start; width: 100%; margin-bottom: 20px;padding-left: 20px;">
                                            <button id="formulario_indicadores" style="color: white; background: rgb(210, 0, 110); border: 0;">
                                                Actualizar indicadores
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                                    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                                                </svg>
                                            </button>

                                        </div>

                                        <div class="chart-container" style="display:flex;justify-content: center;width: 30%; flex-direction: column; align-items: center;">
                                            <canvas id="categoryChart1"></canvas>
                                            <p id="numeroEntidadesPromedio" style="font-weight: 600;"></p>
                                        </div>
                                        
                                        <div style="display:flex;width:65%;flex-direction:row;flex-wrap:wrap;justify-content: center; ">
                                            <div class="chart-container" style="">
                                                <canvas id="categoryChart2"></canvas>
                                            </div>
                                            <div class="chart-container" style="">
                                                <canvas id="categoryChart3"></canvas>
                                            </div>
                                            <div class="chart-container" style="">
                                                <canvas id="categoryChart4"></canvas>
                                            </div>
                                            <div class="chart-container" style="">
                                                <canvas id="categoryChart5"></canvas>
                                            </div>
                                            <div class="chart-container" style="">
                                                <canvas id="categoryChart6"></canvas>
                                            </div>
                                            <div class="chart-container" style="">
                                                <canvas id="categoryChart7"></canvas>
                                            </div>
                                            <div class="chart-container" style="">
                                                <canvas id="categoryChart8"></canvas>
                                            </div>
                                            <div class="chart-container" style="">
                                                <canvas id="categoryChart9"></canvas>
                                            </div>
                                            <div class="chart-container" style="">
                                                <canvas id="categoryChart10"></canvas>
                                            </div>

                                        </div>
                                       
                                    </div>
                                    
                                    <!-- Modal indicadores de calidad -->
                                    <!-- Modal indicadores de calidad -->
<div id="modal_indicadores" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-xl" role="document" style="max-width: 85%;">
      <div class="modal-content" style="height: 85vh; overflow-y: auto;">
  
        <div class="modal-header" style="padding: 10px;">
          <h2>Indicadores de calidad</h2>
          <button type="button" class="close" data-dismiss="modal" aria-label="Cerrar">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
  
        <div id="modal_indicadores_content" class="modal-body row">
  
          <!-- Columna Izquierda -->
          <div class="col-3" id="modal_indicadores_izq">
            <div>
              <button id="btnConsultarIndicadores" class="btnConsultarCalidad" data-toggle="tooltip" title="Detalle de indicadores">
                Ver detalle de indicadores
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-binoculars-fill" viewBox="0 0 16 16">
                  <path d="M4.5 1A1.5 1.5 0 0 0 3 2.5V3h4v-.5A1.5 1.5 0 0 0 5.5 1zM7 4v1h2V4h4v.882a.5.5 0 0 0 .276.447l.895.447A1.5 1.5 0 0 1 15 7.118V13H9v-1.5a.5.5 0 0 1 .146-.354l.854-.853V9.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v.793l.854.853A.5.5 0 0 1 7 11.5V13H1V7.118a1.5 1.5 0 0 1 .83-1.342l.894-.447A.5.5 0 0 0 3 4.882V4zM1 14v.5A1.5 1.5 0 0 0 2.5 16h3A1.5 1.5 0 0 0 7 14.5V14zm8 0v.5a1.5 1.5 0 0 0 1.5 1.5h3a1.5 1.5 0 0 0 1.5-1.5V14zm4-11H9v-.5A1.5 1.5 0 0 1 10.5 1h1A1.5 1.5 0 0 1 13 2.5z"/>
                </svg>
              </button>
            </div>
  
            <div class="d-flex align-items-center mt-4">
              <div class="float-md-right mr-1">
                <i class="iconsminds-add btn-primary rounded" id="nueva-entidad" data-toggle="tooltip" title="Nueva entidad" style="font-size:20px; cursor:pointer;"></i>
              </div>
              <div class="search-sm ml-2" style="width: 100%;">
                <input placeholder="Agregue una Entidad" id="entidad-search" autocomplete="off" class="form-control ui-autocomplete-input">
              </div>
            </div>
  
            <div class="card mt-4">
              <div class="card-body pt-3" style="padding: 0.75rem;">
                <div id="lista-entidades-calidad" class="ml-1 d-flex flex-column overflow-auto" style="height:280px;">
                  <!-- Contenido dinámico -->
                </div>
              </div>
            </div>
          </div>
  
          <!-- Columna Derecha -->
          <div class="col-9" id="modal_indicadores_der">
            <div class="datos_tabla d-flex justify-content-between align-items-center pb-2">
              <h5 id="entidad-actual">Seleccione una entidad</h5>
            </div>
  
            <div class="datos_tabla d-flex justify-content-between px-4" style="justify-content: space-between; padding-left: 2%; padding-right: 5%; gap: 7%" >
              <div class="d-flex flex-column">
                <div class="form-group d-flex">
                  <label class="label_datos_tabla" for="Aprovisionamiento">Plataforma:</label>
                  <input class="input_datos_tabla" type="text" id="Aprovisionamiento" name="Aprovisionamiento" readonly>
                </div>
                <div class="form-group d-flex">
                  <label class="label_datos_tabla" for="servidor">Servidor:</label>
                  <input class="input_datos_tabla" type="text" id="servidor" name="servidor" readonly>
                </div>
              </div>
  
              <div class="d-flex flex-column">
                <div class="form-group d-flex">
                  <label class="label_datos_tabla" for="base">Base:</label>
                  <input class="input_datos_tabla" type="text" id="base" name="base" readonly>
                </div>
                <div class="form-group d-flex">
                  <label class="label_datos_tabla" for="Esquema">Esquema:</label>
                  <input class="input_datos_tabla" type="text" id="Esquema" name="Esquema" readonly>
                </div>
              </div>
  
              <div class="d-flex flex-column">
                <div class="form-group d-flex">
                  <label class="label_datos_tabla" for="campo">Campo:</label>
                  <input class="input_datos_tabla" type="text" id="campo" name="campo" readonly>
                </div>
                <div class="form-group d-flex">
                  <label class="label_datos_tabla" for="atributo-nombre">Atributo:</label>
                  <input class="input_datos_tabla" type="text" id="atributo-nombre" readonly>
                </div>
              </div>

              <div class="d-flex flex-column">
                <div class="form-group d-flex">
                  <label class="label_datos_tabla" for="documentacion">Documentación:</label>
                  <input class="input_datos_tabla" type="text" id="documentacion" name="documentacion" readonly>
                </div>
                <div class="form-group d-flex">
                  <label class="label_datos_tabla" for="atributo-nombre"></label>
                  <input class="input_datos_tabla" type="text" id="atributo-nombre" readonly>
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
                                        <table id="consulta_indicadores_calidad" class="table" >
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
                                    <!-- tabla desplegable -->
                                    <div class="p-4" id="tablaf" style="display: none;">
                                        <table id="tablac" class="table">
                                            <thead>
                                                <tr style=>
                                                    <th>Data Element</th>
                                                    <th>Rows Passed</th>
                                                    <th>Rows Failed</th>
                                                    <th>Result</th>
                                                
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

    <div class="modal fade" id="detalleModal" tabindex="-1" role="dialog" aria-labelledby="detalleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header p-3">
              <h5 class="modal-title" id="detalleModalLabel">Detalle de Catalogo </h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
                <p id="descModal"></p>
                <table id="detalletabla" class="table" style="min-width: 700px">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Descripción</th>
                            <th>Codigo Superior</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
                <button type="button" class="btn btn-secondary p-3 float-right" data-dismiss="modal">Cerrar</button>
            </div>
          </div>
        </div>
      </div>

    <!-- Modal de Confirmación -->
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
            Â¿Estás seguro que deseas eliminar la información ingresada sin haberla guardado?
            </div>
            <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">No</button>
            <button type="button" id="confirmYes" class="btn btn-primary">Sí­</button>
            </div>
        </div>
        </div>
    </div>
   
    <script src="js/vendor/jquery-3.3.1.min.js"></script>
    <script src="js/vendor/bootstrap.bundle.min.js"></script>
    <script src="js/vendor/perfect-scrollbar.min.js"></script>
    <script src="js/vendor/mousetrap.min.js"></script>
    <script src="js/vendor/Chart.bundle.min.js"></script>
    <script src="js/vendor/chartjs-plugin-datalabels.js"></script>
    
    <script src="js/dore.script.js"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>


    <script src="js/scripts.single.theme.js"></script>
    <script src="js/jquery.SPServices.v2014-02.min.js"></script>
    <script src="js/vendor/datatables.min.js" ></script>
    <script src="js/vendor/buttons.dataTables.min.js"></script>
    <script src="js/vendor/jszip.min.js"></script>
    <script src="js/vendor/buttons.html5.min.js"></script>
    <script src="js/vendor/dataTables.Resize.js"></script>
    <script src="js/vendor/bootstrap-notify.min.js"></script>
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
        document.write('<script src="js/suite.js?v='+n+'"> <'+'/'+'script>');
    </script>
    <script>
        $(document).ready(fichaAtributo());
    </script>
    <!--Accion para abir modal de formulario de indicadores -->
    <script>
        $(document).ready(function () {
            var modal = $('#modal_indicadores');
            var btn = document.getElementById("formulario_indicadores");
    
            // Al hacer click en el botón
            btn.onclick = function() {
                registrar_visita("INDICADORES DE CALIDAD", "FORMULARIO DE INDICADORES DE CALIDAD");
                modal.modal('show'); // Abre el modal usando jQuery
            };
    
            // Cerrar el modal si hacen click en el fondo oscuro o en el botón de cerrar (ya automático con Bootstrap)
            modal.on('hidden.bs.modal', function () {
                // Aquí­ puedes agregar lógica adicional si quieres cuando el modal se cierra
            });
        });
    </script>
    
    <!--Accion para abir modal de consulta de listado de tablas con atributos -->
    <script>
        // Código para abrir y cerrar el modal
        let modal_consulta = document.getElementById("modal_consulta_calidad");
        let btn_consulta = document.getElementById("btnConsultarIndicadores");
        let span_consulta = document.getElementsByClassName("close_consulta")[0];

        btn_consulta.onclick = function() {
            registrar_visita("INDICADORES DE CALIDAD","CONSULTA DE INDICADORES DE CALIDAD");
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

    <script>
        $(document).ready(function() {
            Indicadores_calidad();
        });
    </script>
</body>

</html>

