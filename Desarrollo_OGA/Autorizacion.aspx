<!DOCTYPE html>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<html lang="en" xmlns:mso="urn:schemas-microsoft-com:office:office" xmlns:msdt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882">

<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<head>
    <meta charset="UTF-8">
    <title>Autorizaciones</title>
    <link rel="icon" type="image/png" href="img/OGA_icon.png"><script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

    <link rel="stylesheet" href="font/iconsmind-s/css/iconsminds.css" />
    <link rel="stylesheet" href="font/simple-line-icons/css/simple-line-icons.css" />

    <link rel="stylesheet" href="css/vendor/bootstrap.min.css" />
    <link rel="stylesheet" href="css/vendor/bootstrap.rtl.only.min.css" />
    <link rel="stylesheet" href="css/vendor/component-custom-switch.min.css" />
    <link rel="stylesheet" href="css/vendor/perfect-scrollbar.css" />
    <link rel="stylesheet" href="css/vendor/dataTables.bootstrap4.min.css" />
    <link rel="stylesheet" href="css/vendor/buttons.bootstrap4.min.css" />
    <link rel="stylesheet" href="css/vendor/dataTables.colResize.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-notify/0.2.0/js/bootstrap-notify.min.js"></script>
    <script>
        var n = new Date().getTime();
        document.write('<link href="css/style.css?v='+n+'" rel="stylesheet" />');
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
                .dropdown-menu > li:hover > .dropdown-submenu {
                display: block;
                }
                .dataTables_wrapper   {
                    font-size: 11.7px;
                }

                .link_subrrayado:hover {
                text-decoration: underline;
                }

                .botonAceptar,
                .botonDenegar {
                background: none;
                border: none;
                padding: 0;
                cursor: pointer;
                outline: none; 
                font-size: 24px;
                margin-right: 20px;
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
                .dataTables_filter {
                    position: absolute;
                    top: 0;
                    left: 0;
                }
                
                #autorizacion_wrapper .dataTables_filter input {
                border:0.5px solid #696767;
                padding: 6px;
                border-radius: 13px;
                width : 300px;
                height :40px;
                position: relative;
                top: 0;
                left: 0;
                }

                .some-container {
                    position: absolute;
                    top: 18px;
                    right: 27px;
                    display: flex;
                    align-items: center;
                }
                
                .buttons-excel {
                    
                margin-top: 33px;
                color: #808080; 
                background-color: white; 
                border: none;
                border-radius: 0;
                float: right;
                height:50px;
                }

                .btn-excel:hover {
                color: inherit; 
                background-color: inherit; 
                border: inherit; 
                }


                .dataTables_paginate .paginate_button {
                    height: 38px;
                }
                

                .dataTables_wrapper .dataTables_paginate .paginate_button.next, 
                .dataTables_wrapper .dataTables_paginate .paginate_button.previous{
                    height: 38px;
                }
                
                .btn-group.float-md-right.mr-1.mb-1 {
                margin-bottom: 40px;
                }
                .disabled-button {
                opacity: 0.5; /* Reduce la opacidad para que parezca desvanecido */
                pointer-events: none; /* Evita que el botón sea tocable */
                }

                .icon-container {
                height: auto; /* Por defecto, la altura se ajusta automáticamente */
                display: flex; /* Distribuye los í­conos en una fila */
                flex-wrap: wrap; /* Permite que los í­conos se envuelvan si no hay suficiente espacio */
                }

                table.dataTable td {
                word-wrap: break-word;
                white-space: normal;
                overflow: hidden;
                }

                .form-check-input {
                transform: scale(1.5); 
                margin-right: 20px;
                }

                .form-check-label {
                margin-left: 10px; 
                display: inline-block;
                }

                .btn-aprobar-todos {
                font-size: 23px; /* Tamaño deseado para el texto del botón */
                height: 30px; /* Altura deseada para el botón */
                margin-top: 40px;
                padding-top: 3px;
                color: #808080; 
                background-color: white;
                border: none;
                border-radius: 0;
                margin-left : -19px;
                width: 50px;
                }

                .btn-aprobar-todos:hover {
                color: inherit; /* Mantener el color original */
                background-color: inherit; /* Mantener el color de fondo original */
                border: inherit; /* Mantener el borde original */
                }

                .btn-aprobar-todos:active {
                color: inherit;
                background-color: white;
                border: inherit;
                }

                .btn-aprobar-todos:focus {
                outline: none;
                }

                .btn-seleccionar-todos {
                font-size: 23px; /* Tamaño deseado para el texto del botón */
                height: 45px; /* Altura deseada para el botón */
                margin-top: 40px;
                padding-top: 3px;
                color: #808080; 
                background-color: white; 
                border: none;
                border-radius: 0;
                background-position: 5px center;
                }

                .btn-seleccionar-todos:hover {
                color: inherit; /* Mantener el color original */
                background-color: inherit; /* Mantener el color de fondo original */
                border: inherit; /* Mantener el borde original */
                }

                .btn-seleccionar-todos:active {
                color: inherit;
                background-color: inherit;
                border: inherit;
                }

                .btn-denegar-todos {
                font-size: 23px; /* Tamaño deseado para el texto del botón */
                height: 30px; /* Altura deseada para el botón */
                margin-top: 40px;
                padding-top: 3px;
                color: #808080; 
                background-color: white; 
                border: none;
                border-radius: 0;
                margin-left : -7px;
                width: 50px;

                }

                .btn-denegar-todos:hover {
                color: inherit; /* Mantener el color original */
                background-color: inherit; /* Mantener el color de fondo original */
                border: inherit; /* Mantener el borde original */
                }

                .btn-denegar-todos:active {
                color: inherit;
                background-color: inherit;
                border: inherit;
                }

                .btn-excel:hover {
                color: inherit; 
                background-color: inherit; 
                border: inherit; 
                }

                .btn-seleccionar-todos::before {
                    content: "";
                    display: inline-block;
                    width: 23px;
                    height: 24px;
                    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="%23808080" class="bi bi-square" viewBox="0 0 16 16" data-toggle="tooltip" title="Marcar todos / Desmarcar todos"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/></svg>');
                    background-size: contain;
                    background-repeat: no-repeat;
                    vertical-align: middle;
                    margin-left: -16px;
                    margin-top: -8px;
                }

                .btn-seleccionar-todos.checked::before {
                    content: "";
                    display: inline-block;
                    width: 23px;
                    height: 24px;
                    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="%23808080" class="bi bi-check-square" viewBox="0 0 16 16" data-toggle="tooltip" title="Marcar todos / Desmarcar todos"><path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/><path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/></svg>');
                    background-size: contain;
                    background-repeat: no-repeat;
                    vertical-align: middle;
                    color: #808080; 
                }


                .dataTables_wrapper .btn-seleccionar-todos:focus,
                .dataTables_wrapper .btn-seleccionar-todos:active,
                .dataTables_wrapper .btn-aprobar-todos:focus,
                .dataTables_wrapper .btn-aprobar-todos:active,
                .dataTables_wrapper .btn-denegar-todos:focus,
                .dataTables_wrapper .btn-denegar-todos:active,
                .dataTables_wrapper .btn-excel:focus,
                .dataTables_wrapper .btn-excel:active {
                    background-color: transparent !important; 
                    box-shadow: none !important; 
                }

                i.simple-icon-check.style\= {
                margin-left: -8px;
                }

                icon-excel-btn{
                margin-left: 10px;
                }

                .small-font {
                font-size: 10px;
                line-height: 1.9;
                font-family: Arial, sans-serif;
                margin-left : 20px;
                }


                </style>

<!--[if gte mso 9]><SharePoint:CTFieldRefs runat=server Prefix="mso:" FieldList="FileLeafRef"><xml>
<mso:CustomDocumentProperties>
<mso:_CopySource msdt:dt="string">http://vamos.bancoguayaquil.com/sitios/informaciongerencial/OGAsuite_Produccion/Produccion/Catalogo_Referencias.aspx</mso:_CopySource>
<mso:Order msdt:dt="string">233600.000000000</mso:Order>
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
                <input placeholder="Buscar...">
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
                    <button class="header-icon btn btn-empty " type="button" id="iconMenuButton" data-toggle="dropdown"
                        aria-haspopup="true" aria-expanded="false">
                        <i class="simple-icon-grid"></i>
                    </button>
                    <div class="dropdown-menu dropdown-menu-right mt-3  position-absolute" id="iconMenuDropdown">
                        <a href="http://vamos.bancoguayaquil.com/sitios/informaciongerencial/Paginas/ANALYTICS/Marlon%20Z/PAGINAS/COMUNIDAD_ANALITICA/index.aspx" class="icon-menu-item quicklinks">
                            <img src="img/datahub.png" alt="Logo DataHub">
                            <span>Data Hub</span>
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
            <div class="row pb-2">
                <div class="col-12">
                    <h1>Aprobación de solicitudes</h1>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-body">
                                    <div id="segmentador-container" class="some-container">
                                        <!-- Aquí­ se agregará el segmentador -->
                                    </div>
                                   
                            <table id="autorizacion" class="table" >
                                 <thead>
                                        <tr>
                                            <th>Respuesta</th>
                                            <th>Tipo Autorizacion</th>
                                            <th>Fecha solicitud</th>
                                            <th>Estado</th>
                                            <th>Entidad</th>
                                            <th>Original</th>
                                            <th>Responsable</th>
                                            <th>Autor cambio</th>
                                            <th>Autor Aprobacion</th>
                                            <th>Fecha Aprobacion</th>
                                            <th>Motivo</th>
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

        <!-- Modal -->
            <div class="modal fade" id="motivoModalRechazado" tabindex="-1" role="dialog" aria-labelledby="motivoModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                    <h5 class="modal-title" id="motivoModalLabel">Rechazo de solicitud</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    </div>
                    <div class="modal-body">
                    <h3 class="modal-title small-font" id="AccionModalLabel">Accion:</h3>
                    <h3 class="modal-title small-font" id="EntidadModalLabel">Entidad :</h3>
                        <div style= "display: flex;">
                            <h3 class="modal-title small-font" id="AnteriorModalLabel">Anterior :</h3>
                            <h3 class="modal-title small-font" id="NuevoModalLabel">Nuevo :</h3>    
                        </div>
                    <h3 class="modal-title small-font" id="motivoModalLabel"> <strong>MOTIVO DEL RECHAZO :</strong></h3>
                    <textarea id="motivoTexto" class="form-control" rows="4" placeholder="Escribe el motivo aquí­..."></textarea>
                    </div>
                    <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" id="confirmarRechazo">Rechazar</button>
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
    <script src="js/vendor/jquery-3.3.1.min.js"></script>
    <script src="js/vendor/bootstrap.bundle.min.js"></script>
    <script src="js/vendor/perfect-scrollbar.min.js"></script>
    <script src="js/vendor/mousetrap.min.js"></script>
    <script src="js/dore.script.js"></script>
    <script src="js/scripts.single.theme.js"></script>
    <script src="https://d3js.org/d3.v5.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/2.1.1/TweenMax.min.js"></script>
    <script src="js/jquery.SPServices.v2014-02.min.js"></script>
    <script src="js/vendor/datatables.min.js"></script>
    <script src="js/vendor/buttons.dataTables.min.js"></script>
    <script src="js/vendor/jszip.min.js"></script>
    <script src="js/vendor/buttons.html5.min.js"></script>
    <script src="js/vendor/dataTables.Resize.js"></script>
    <script src="js/vendor/bootstrap-notify.min.js"></script>
    <script>
        var n = new Date().getTime();
        document.write('<script src="js/suite.js?v='+n+'"> <'+'/'+'script>');
    </script>
    <script>
          window.existeEnSP_TablasOficiales = function ({ tabla, servidor, base, esquema }) {
    const CAML = '<Query><Where>\
      <And>\
        <Eq><FieldRef Name="txt_desc_tabla"/><Value Type="Text">' + tabla + '</Value></Eq>\
        <And>\
          <Eq><FieldRef Name="txt_servidor"/><Value Type="Text">' + servidor + '</Value></Eq>\
          <And>\
            <Eq><FieldRef Name="txt_host"/><Value Type="Text">' + base + '</Value></Eq>\
            <Eq><FieldRef Name="txt_fuente_esquema"/><Value Type="Text">' + esquema + '</Value></Eq>\
          </And>\
        </And>\
      </And>\
    </Where></Query>';
  
    let existe = false;
    let sp_id = null;
  
    $().SPServices({
      operation: "GetListItems",
      async: false,
      listName: "Z_METADATA_TABLAS",
      CAMLQuery: CAML,
      CAMLViewFields: "<ViewFields><FieldRef Name='ID' /></ViewFields>",
      completefunc: function (xData, Status) {
        const $rows = $(xData.responseXML).SPFilterNode("z:row");
        if ($rows.length > 0) {
          existe = true;
          sp_id = parseInt($rows.attr("ows_ID"), 10);
        }
        console.log("ðŸ” [preflight SP] matches:", $rows.length, "sp_id:", sp_id, "Status:", Status, { tabla, servidor, base, esquema });
      }
    });
  
    return { existe, sp_id };
  };
        $(document).ready(function() {
        Autorizacion_Solicitudes();
        });
    </script>

</body>
</html>

