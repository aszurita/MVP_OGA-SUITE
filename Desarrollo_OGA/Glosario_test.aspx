<!DOCTYPE html>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<html lang="en" xmlns:mso="urn:schemas-microsoft-com:office:office" xmlns:msdt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882">

<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<head>
    <meta charset="UTF-8">
    <title>Glosario Empresarial de Datos</title>
    <link rel="icon" type="image/png" href="img/OGA_icon.png">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

    <link rel="stylesheet" href="font/iconsmind-s/css/iconsminds.css" />
    <link rel="stylesheet" href="font/simple-line-icons/css/simple-line-icons.css" />

    <link rel="stylesheet" href="css/vendor/bootstrap.min.css" />
    <link rel="stylesheet" href="css/vendor/bootstrap.rtl.only.min.css" />
    <link rel="stylesheet" href="css/vendor/perfect-scrollbar.css" />
    <link rel="stylesheet" href="css/vendor/component-custom-switch.min.css" />
    <script>
        var n = new Date().getTime();
        document.write('<link href="css/style.css?v='+n+'" rel="stylesheet" />');
    </script>
    <link rel="stylesheet" href="css/main.css" />
    <link rel="stylesheet" href="css/pagination.css" />

<!--[if gte mso 9]><SharePoint:CTFieldRefs runat=server Prefix="mso:" FieldList="FileLeafRef"><xml>
<mso:CustomDocumentProperties>
<mso:_CopySource msdt:dt="string">http://vamos.bancoguayaquil.com/sitios/informaciongerencial/OGAsuite_Produccion/Produccion/Glosario.aspx</mso:_CopySource>
<mso:Order msdt:dt="string">216400.000000000</mso:Order>
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
                                <span>Políticas y Procedimientos</span>
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
                            <span>Glosario Empresarial de Datos</span>
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
                    <div class="mb-2">
                        <h1>Glosario Empresarial de Datos</h1>
                    </div>
                    <div class="mb-2">
                        <div class="collapse d-md-block" id="displayOptions">
                            <div class="d-block d-md-inline-block" style="width: 100%;">
                                <div class="btn-group float-md-left mr-1 mb-1">
                                    <button class="btn btn-outline-dark btn-xs dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="dropdown-btn">
                                        Filtrar Por
                                    </button>
                                    <div class="dropdown-menu">
                                        <a class="dropdown-item" onclick="nuevoCriterio('dominio')">Dominio</a>
                                        <a class="dropdown-item" onclick="nuevoCriterio('todos')">Todos</a>
                                    </div>
                                </div>
                                <div class="search-sm float-md-left mr-1 mb-1 align-top" style="width:30.6%; display:flex;">
                                    <input placeholder="Buscar..." id="glosario-search" style="width: 100%;" autocomplete="off">
                                    <i class="iconsminds-magnifi-glass" id="glosario-buscar"> </i>
                                </div>
                                <div class="btn-group float-md-right mr-1 mb-1">
                                    <button class="btn btn-outline-dark btn-xs dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="segmentar-btn">
                                        Segmentar Por
                                    </button>
                                    <div class="dropdown-menu" x-placement="bottom-start" style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(0px, 26px, 0px);">
                                        <a class="dropdown-item" onclick="segmentar('termino')">Termino</a>
                                        <a class="dropdown-item" onclick="segmentar('atributo')">Atributo</a>
                                        <a class="dropdown-item" onclick="segmentar('datos personales')">Datos Personales</a>
                                        <a class="dropdown-item" onclick="segmentar('Golden Record')">Golden Record</a>
                                        <a class="dropdown-item" onclick="segmentar('todos')">Todos</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="separator mb-5"></div>
                </div>
            </div>

            <div class="row">
                <div class="col-12" id="glosario-body">
                    <div class="card">
                        <div class="card-body" id="resultados">
                            <div class="mb-4">
                                <div class="resultado-head">
                                    <a href="#" class="list-item-heading mb-1 color-theme-1">Cliente Activo</a>
                                    <div class="atributos">
                                        <span onclick="console.log('hola')" class="badge badge-pill badge-secondary atributo">HOLD ON</span><span class="badge badge-pill badge-secondary atributo">IF LOVE</span><span class="badge badge-pill badge-secondary atributo">IS THE</span><span class="badge badge-pill badge-secondary atributo">ANSWER YOU</span><span class="badge badge-pill badge-secondary atributo">ARE HOME</span>
                                    </div>
                                </div>
                                <p class="mb-1">19/07/2023</p>
                                <p class="mb-1" style="font-weight: bold;">Dominio</p>
                                <p class="mb-4 text">In et nisi purus. Etiam facilisis molestie vulputate. Maecenas vestibulum congue elit et feugiat. Duis quis nisi ac sem posuere dictum ut non neque. Vestibulum non ipsum porttitor, tristique ligula gravida, molestie turpis. Sed consequat lorem sapien, ut tincidunt sapien condimentum vel. Fusce vel molestie diam. Vestibulum eu est a neque consequat laoreet. Proin porta volutpat dolor ut accumsan. Curabitur ut velit neque. Aenean bibendum quam nunc, volutpat mattis sem aliquet sit amet. Phasellus mattis at ipsum sed aliquet. Aliquam posuere ex a pellentesque euismod.</p>
                                <div class="separator"></div>
                            </div>
                            <div>
                                <div class="resultado-head">
                                    <a href="#" class="list-item-heading mb-1 color-theme-1">Cliente Activo</a>
                                    <div class="atributos">
                                        <span onclick="console.log('hola')" class="badge badge-pill badge-secondary atributo">HOLD ON</span><span class="badge badge-pill badge-secondary atributo">IF LOVE</span><span class="badge badge-pill badge-secondary atributo">IS THE</span><span class="badge badge-pill badge-secondary atributo">ANSWER YOU</span><span class="badge badge-pill badge-secondary atributo">ARE HOME</span>
                                    </div>
                                </div>
                                <p class="mb-1">19/07/2023</p>
                                <p class="mb-1" style="font-weight: bold;">Dominio</p>
                                <p class="mb-4 text">In et nisi purus. Etiam facilisis molestie vulputate. Maecenas vestibulum congue elit et feugiat. Duis quis nisi ac sem posuere dictum ut non neque. Vestibulum non ipsum porttitor, tristique ligula gravida, molestie turpis. Sed consequat lorem sapien, ut tincidunt sapien condimentum vel. Fusce vel molestie diam. Vestibulum eu est a neque consequat laoreet. Proin porta volutpat dolor ut accumsan. Curabitur ut velit neque. Aenean bibendum quam nunc, volutpat mattis sem aliquet sit amet. Phasellus mattis at ipsum sed aliquet. Aliquam posuere ex a pellentesque euismod.</p>
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
    
    <script src="js/vendor/jquery-3.3.1.min.js"></script>
    <script src="js/vendor/bootstrap.bundle.min.js"></script>
    <script src="js/vendor/perfect-scrollbar.min.js"></script>
    <script src="js/dore.script.js"></script>
    <script src="js/scripts.single.theme.js"></script>
    <script src="js/pagination.min.js"></script>
    <script src="js/jquery.SPServices.v2014-02.min.js"></script>
    <script>
        var n = new Date().getTime();
        document.write('<script src="js/suite_test.js?v='+n+'"> <'+'/'+'script>');
    </script>
    <script>
     
           
        glosario();
        
        
        
    </script>
</body>

</html>