<!DOCTYPE html>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<html lang="en" xmlns:mso="urn:schemas-microsoft-com:office:office" xmlns:msdt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882">

<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<head>
    <meta charset="UTF-8">
    <title>Ficha de Dominio</title>
    <link rel="icon" type="image/png" href="img/OGA_icon.png">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

    <link rel="stylesheet" href="font/iconsmind-s/css/iconsminds.css" />
    <link rel="stylesheet" href="font/simple-line-icons/css/simple-line-icons.css" />

    <link rel="stylesheet" href="css/vendor/bootstrap.min.css" />
    <link rel="stylesheet" href="css/vendor/bootstrap.rtl.only.min.css" />
    <link rel="stylesheet" href="css/vendor/component-custom-switch.min.css" />
    <link rel="stylesheet" href="css/vendor/perfect-scrollbar.css" />
    <script>
        var n = new Date().getTime();
        document.write('<link href="css/style.css?v='+n+'" rel="stylesheet" />');
    </script>
    <link rel="stylesheet" href="css/main.css" />

<!--[if gte mso 9]><SharePoint:CTFieldRefs runat=server Prefix="mso:" FieldList="FileLeafRef"><xml>
<mso:CustomDocumentProperties>
<mso:_CopySource msdt:dt="string">http://vamos.bancoguayaquil.com/sitios/informaciongerencial/OGAsuite_Produccion/Produccion/FichaDominio.aspx</mso:_CopySource>
<mso:Order msdt:dt="string">222000.000000000</mso:Order>
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
            <img class="logo d-none d-xs-block" src="logos/oga_color.png">
            <img class="logo-mobile d-block d-xs-none" src="logos/OGA_icon.png">
        </a>

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
                                <span>Políticas y Procedimientos</span>
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
                <div class="col-12">
                    <h1 id="nombre-dominio">Ficha de Dominio</h1>
                    <nav class="breadcrumb-container d-none d-sm-block d-lg-inline-block" aria-label="breadcrumb">
                        <ol class="breadcrumb pt-0" id="secciones-dominio">
                            <li class="breadcrumb-item">
                                <a id="a-estructura" href="Dominio_estructura.aspx">Estructura</a>
                            </li>
                            <li class="breadcrumb-item">
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
                </div>
            </div>
            <div class="row d-flex flex-row">
                <div class="col-3 pl-0">
                    <div class="d-flex flex-column">
                        <div class="card progress-banner h-100">
                            <div class="card-body justify-content-between d-flex flex-row align-items-center" style="padding: 10px 15px 10px 15px;">
                                <div>
                                    <i class="simple-icon-graph mr-2 text-white align-text-bottom d-inline-block mb-0"></i>
                                    <div>
                                        <p class="lead text-white" id="oleada">Ola def</p>
                                        <p class="text-small text-white" id="activa-proceso">Activa en proceso</p>
                                    </div>
                                </div>
    
                                <div>
                                    <div role="progressbar" class="progress-bar-circle progress-bar-banner position-relative" data-color="white" data-trail-color="rgba(255,255,255,0.2)" aria-valuenow="1" aria-valuemax="12" data-show-percent="true" style="width:70px; height: 70px;">
                                    <svg viewBox="0 0 100 100" style="display: block; width: 100%;"><path d="M 50,50 m 0,-48 a 48,48 0 1 1 0,96 a 48,48 0 1 1 0,-96" stroke="rgba(255,255,255,0.2)" stroke-width="4" fill-opacity="0"></path>
                                        <path id="porcentaje-ola-actual" d="M 50,50 m 0,-48 a 48,48 0 1 1 0,96 a 48,48 0 1 1 0,-96" stroke="white" stroke-width="4" fill-opacity="0" style="stroke-dasharray: 301.635, 301.635; stroke-dashoffset: 175.954;"></path></svg>
                                    <div class="progressbar-text" style="position: absolute; left: 50%; top: 50%; padding: 0px; margin: 0px; transform: translate(-50%, -50%); color: white; font-size:22px;">
                                        test
                                    </div>
                                    </div>
                                </div> 
                            </div>
                        </div>
                        <div class="card mt-3 dashboard-progress h-100">
                            <div class="card-body" id="avances">
                                <h5 class="card-title mb-3">Avances de Dominio</h5>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-9 pl-0">
                    <div class="col-12 d-flex flex-column">
                        <div class="d-flex flex-row justify-content-center">
                            <div class="card mt-3 ml-3 mr-2 mb-5 w-25 contador">
                                <div class="card-body text-center p-2">
                                    <a id="atributos" href="#">
                                        <i class="simple-icon-list" style="font-size: 25px;"></i>
                                        <p class="card-text mb-0">Atributos</p>
                                        <p class="lead text-center mb-0" id="n-atributos">16</p>
                                    </a>
                                </div>
                            </div>
                            <div class="card mt-3 ml-3 mr-2 mb-5 w-25 contador">
                                <div class="card-body text-center p-2">
                                    <a id="terminos" href="#">
                                        <i class="simple-icon-book-open" style="font-size: 25px;"></i>
                                        <p class="card-text mb-0">Terminos</p>
                                        <p class="lead text-center mb-0" id="n-terminos">22</p>
                                    </a>
                                </div>
                            </div>
                            <div class="card mt-3 ml-3 mr-2 mb-5 w-25 contador">
                                <div class="card-body text-center p-2">
                                    <a id="artefactos" href="#">
                                        <i class="simple-icon-chart" style="font-size: 25px;"></i>
                                        <p class="card-text mb-0">Artefactos</p>
                                        <p class="lead text-center mb-0" id="n-artefactos">22</p>
                                    </a>
                                </div>
                            </div><div class="card mt-3 ml-3 mr-2 mb-5 w-25 contador">
                                <div class="card-body text-center p-2">
                                    <a id="estructura" hre="#">
                                        <i class="simple-icon-people" style="font-size: 25px;"></i>
                                        <p class="card-text mb-0">Estructura</p>
                                        <p class="lead text-center mb-0" id="n-estructura">21</p>
                                    </a>
                                </div>
                            </div>
                            <div class="card mt-3 ml-3 mr-3 mb-5 w-25 contador">
                                <div class="card-body text-center p-2">
                                    <a id="tablas" href="#">
                                        <i class="simple-icon-book-open" style="font-size: 25px;"></i>
                                        <p class="card-text mb-0">Tablas Oficiales</p>
                                        <p class="lead text-center mb-0" id="n-tablas">0</p>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class="card">
                            <div class="card-body">
                                <p class="font-weight-bold">Familia</p>
                                <p id="familia">Lorem Lorem</p>
                                <p class="font-weight-bold">Tipo</p>
                                <p id="tipo">Lorem</p>
                                <p class="font-weight-bold">Concepto</p>
                                <p id="concepto"  style="text-align: justify;">loremloremloremloremloremloremloremloremlorem</p>
                                <p class="font-weight-bold">Codificación</p>
                                <p id="codificacion">Lorem_lo</p>
                                <p class="font-weight-bold">Subdominios</p>
                                <p id="subdominios">Lorem, lorem, lorem</p>
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

    <script src="js/vendor/jquery-3.3.1.min.js"></script>
    <script src="js/vendor/bootstrap.bundle.min.js"></script>
    <script src="js/vendor/perfect-scrollbar.min.js"></script>
    <script src="js/vendor/mousetrap.min.js"></script>
    <script src="js/dore.script.js"></script>
    <script src="js/scripts.single.theme.js"></script>
    <script src="https://d3js.org/d3.v5.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/2.1.1/TweenMax.min.js"></script>
    <script src="js/jquery.SPServices.v2014-02.min.js"></script>
    <script>
        var n = new Date().getTime();
        document.write('<script src="js/suite_test.js?v='+n+'"> <'+'/'+'script>');
    </script>
    <script>
        $(document).ready(fichaDominio());
    </script>
</body>

</html>