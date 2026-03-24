<!DOCTYPE html>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<html lang="en" xmlns:mso="urn:schemas-microsoft-com:office:office" xmlns:msdt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882">

<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<head>
    <meta charset="UTF-8">
    <title>Inventario</title>
    <link rel="icon" type="image/png" href="img/OGA_icon.png" data-icon-default="img/OGA_icon.png" data-icon-navidad="img/OGA_icon_navidad.png">
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
    <link rel="stylesheet" href="css/vendor/fullcalendar.min.css" />
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
    <link rel="stylesheet" href="css/pagination.css" />

<!--[if gte mso 9]><SharePoint:CTFieldRefs runat=server Prefix="mso:" FieldList="FileLeafRef"><xml>
<mso:CustomDocumentProperties>
<mso:_CopySource msdt:dt="string">http://vamos.bancoguayaquil.com/sitios/informaciongerencial/OGAsuite_Produccion/Produccion/Dominio_artefactos.aspx</mso:_CopySource>
<mso:Order msdt:dt="string">218400.000000000</mso:Order>
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
                        <h3 id= "subtitulo"> <i class="simple-icon-arrow-left-circle m-1 regresar" onclick="history.back()"></i> Inventario</h3>
                        
                            <div class="search-sm  row justify-content-between mb-1 align-top" >
                                <div class="search-sm" style="width:30.6%;height:28px; display:flex;">
                                    <input placeholder="Buscar..." id="inventario-search" style="width: 100%;" autocomplete="off">
                                    <i class="iconsminds-magnifi-glass mr-2" id="artefacto-buscar"> </i> 
                                   
                                </div>
                                <div class="float-right" style="display: flex">
                                    <div class="mr-1">
                                        <button class="btn btn-outline-light btn-xs dropdown-toggle float-md-left"  style="height:30px;color:gray"type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="dropdown-inventario">Todos</button>
                                        <div class="dropdown-menu" >
                                            <a class="dropdown-item" id="activos" >Activos</a>
                                            <a class="dropdown-item" id="terminados" >Terminados</a>
                                        </div>
                                    </div>
                                    <div class="input-daterange input-group float-right" id="datepicker" style="width:70.6%; display:flex;">
                                        <input type="text" class="input-sm form-control" name="start"
                                            placeholder="Start" id="startdate"/>
                                        <span class="input-group-addon"></span>
                                        <input type="text" id="enddate" class="input-sm form-control" name="end"
                                            placeholder="End" />
                                            
                                    </div>
                                    <div>
                                        <i  data-toggle="tooltip" data-placement="top" data-original-title="Filtrar por Fecha" id="filtrarfecha" style="font-size: 20px;cursor:pointer" class="iconsminds-filter-2"></i>

                                    </div>
                                    <div>
                                        <i  data-toggle="tooltip" data-placement="top" data-original-title="Eliminar Filtro por Fecha" id="eliminarFecha" style="font-size: 20px;cursor:pointer" class="simple-icon-trash"></i>

                                    </div>
                                    
                                    
                                </div>
                                
                            </div>
                          
                            
                     
                       
                    </div>
                    <div class="separator"></div>
                </div>
            </div>
            <div class="row pl-3">
                <div class="col-12">
                    <div class=" d-flex flex-row flex-wrap" id="artefactos">
                        <div class="card m-2 artefacto">
                            <div class="position-relative">
                            
                                <span
                                style="font-size:13px" class="badge badge-pill badge-theme-1 position-absolute badge-top-left">NEW</span>
                            </div>
                            <div class="card-body">
                                <a href="Pages.Details.html">
                                    <h6 class="mb-3 listing-heading ellipsis">
                                        Podcasting Operational Change
                                        Management Inside of Workflows
                                    </h6>
                                </a>
                               
                            </div>
                        </div>
                        <div class="card m-2 artefacto">
                            <div class="card-body text-center">
                                <i class="simple-icon-list" style="font-size: 25px;"></i>
                                <p class="card-text mb-0">Aenean ante magna, efficitur eu accumsan nec, aliquet.</p>
                            </div>
                        </div>
                        <div class="card m-2 artefacto">
                            <div class="card-body text-center">
                                <i class="simple-icon-list" style="font-size: 25px;"></i>
                                <p class="card-text mb-0">Aenean ante magna, efficitur eu accumsan nec, aliquet.</p>
                            </div>
                        </div>
                    </div>
                    <nav class="mt-4 mb-4">
                        <div class="pagination justify-content-center"></div>
                    </nav>
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

    <div class="modal fade" id="modalInventario" tabindex="-1" role="dialog" aria-labelledby="detalleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header p-3">
              <h5 class="modal-title" id="detalleModalLabel">Detalle de Inventario </h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
                <p id="descInventario"></p>
                <table id="inventariotabla" class="table" style="min-width: 3500px">
                    <thead>
                        <tr>
                            <th>Código </th>
                            <th>Iniciativa</th>
                            <th>Descripción</th>
                            <th>Prefijo</th>
                            <th>Dí­as</th>
                            <th>Estado</th>
                            <th>Valor Premio</th>
                            <th>Motivo</th>
                            <th>Meta</th>
                            <th>Periodo</th>
                            <th>Fecha Inicio</th>
                            <th>Fecha Fin</th>
                            <th>Log</th>
                            <th>Acción Táctica</th>
                            <th>Registro</th>
                            <th>Seguimiento</th>
                            <th>Tabla</th>
                            <th>Registro</th>
                            <th>Facturación</th>
                            <th>Tipo Premio</th>
                            <th>Consumos</th>
                            <th>Rubro</th>
                            <th>Tipo Producto</th>
                            <th>Sumatoria Consumos</th>
                            <th>Pasivos</th>
                            <th>Sponsor</th>
                            <th>Esquema</th>
                            <th>Tabla Audiencia</th>
                            <th>Tipo Campaña</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Modal para mostrar drawio de la campaña-->
      <div class="modal fade" id="modaldrawio" tabindex="-1" role="dialog" aria-labelledby="detalledrawio" aria-hidden="true">
        <div class="modal-dialog modal-xl h-100" role="document" style="min-width:95%;">
            <div class="modal-content h-100">
            <div class="modal-header p-3" style="border-bottom: unset;">
                <h5 class="modal-title" id="detalledrawio">Documentación de iniciativa</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div id="contanier_modaldrawio" class="modal-body">
                <object id="doc_modaldrawio" width="100%" height="100%" data=""></object>
            </div>
        </div>
    </div>
      </div>

    <script src="js/vendor/jquery-3.3.1.min.js"></script>
    <script src="js/vendor/bootstrap.bundle.min.js"></script>
    <script src="js/vendor/perfect-scrollbar.min.js"></script>
    <script src="js/vendor/mousetrap.min.js"></script>
    <script src="js/dore.script.js"></script>
    <script src="js/scripts.single.theme.js"></script>
    <script src="js/pagination.min.js"></script>
    <script src="js/vendor/buttons.dataTables.min.js"></script>
    <script src="js/jquery.SPServices.v2014-02.min.js"></script>
    <script src="js/vendor/dataTables.Resize.js"></script>
    <script src="js/vendor/fullcalendar.min.js"></script>
    <script src="js/vendor/bootstrap-datepicker.js"></script>
    <script>
        var n = new Date().getTime();
        document.write('<script src="js/suite.js?v='+n+'"> <'+'/'+'script>');
    </script>
    <script>
        $(document).ready(inventario_campañas());
    </script>
</body>

</html>

