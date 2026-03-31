<!DOCTYPE html>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls"
    Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
    <html lang="en" xmlns:mso="urn:schemas-microsoft-com:office:office"
        xmlns:msdt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882">

    <%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls"
        Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

        <head>
            <meta charset="UTF-8">
            <title>Sobre OGA</title>
            <link rel="icon" type="image/png" href="img/OGA_icon.png" data-icon-default="img/OGA_icon.png"
                data-icon-navidad="img/OGA_icon_navidad.png">
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

            <link rel="stylesheet" href="font/iconsmind-s/css/iconsminds.css" />
            <link rel="stylesheet" href="font/simple-line-icons/css/simple-line-icons.css" />

            <link rel="stylesheet" href="css/vendor/bootstrap.min.css" />
            <link rel="stylesheet" href="css/vendor/bootstrap.rtl.only.min.css" />
            <link rel="stylesheet" href="css/vendor/component-custom-switch.min.css" />
            <link rel="stylesheet" href="css/vendor/perfect-scrollbar.css" />
            <script>
                var n = new Date().getTime();
                document.write('<link href="css/style.css?v=' + n + '" rel="stylesheet" />');
            </script>
            <link rel="stylesheet" href="css/main.css" />
            <script>
                (function () {
                    var hoy = new Date();
                    var inicioNavidad = new Date(hoy.getFullYear(), 11, 1);
                    window.usarLogoNavidad = hoy >= inicioNavidad;
                })();
            </script>

            <!--[if gte mso 9]><SharePoint:CTFieldRefs runat=server Prefix="mso:" FieldList="FileLeafRef"><xml>
<mso:CustomDocumentProperties>
<mso:_CopySource msdt:dt="string">http://vamos.bancoguayaquil.com/sitios/informaciongerencial/OGAsuite_Produccion/Produccion/SobreOGA.aspx</mso:_CopySource>
<mso:Order msdt:dt="string">230700.000000000</mso:Order>
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
                    <img id="logo-navbar" class="logo logo--invert d-none d-xs-block" src="logos/oga_color.png"
                        data-logo-default="logos/oga_color.png" data-logo-navidad="logos/oga_navidad.png">
                    <img class="logo-mobile d-block d-xs-none" src="logos/OGA_icon.png"
                        data-logo-default="logos/OGA_icon.png" data-logo-navidad="logos/OGA_icon_navidad.png">
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
                            <li class="active">
                                <a href="#">
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
                            <ul class="list-unstyled" data-link="estrategia">
                                <li>
                                    <a href="EstrategiadelDato.aspx">
                                        <i class="simple-icon-rocket"></i> <span class="d-inline-block">Mapa Estrategia
                                            del Dato</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="DataIndex.aspx">
                                        <i class="simple-icon-pie-chart"></i> <span class="d-inline-block">Data
                                            Index</span>
                                    </a>
                                </li>
                            </ul>
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
                            <h1>Acerca de Nosotros</h1>
                            <nav class="breadcrumb-container d-none d-sm-block d-lg-inline-block"
                                aria-label="breadcrumb">
                                <ol class="breadcrumb pt-0">
                                    <li class="breadcrumb-item">
                                        <a id="gob" onclick="toggleOGA('general');subrayarOGA(this);playvideo('g')">¿
                                            Qué es Gobierno ?</a>
                                    </li>
                                    <li class="breadcrumb-item">
                                        <a id="ogas" onclick="toggleOGA('oga');subrayarOGA(this);playvideo('o')">OGA
                                            Suite</a>
                                    </li>
                                    <li class="breadcrumb-item">
                                        <a id="data"
                                            onclick="toggleOGA('datahub');subrayarOGA(this);playvideo('d')">DataHub</a>
                                    </li>
                                </ol>

                            </nav>
                            <div class="separator mb-5"></div>
                        </div>
                    </div>
                    <div class="row">
                        <div id="general" class="col-12 card "
                            style="padding:unset;display: flex;justify-content: center;align-items: center;">
                            <video id="g" style="max-width: 60%;max-height: 100%" controls
                                controlsList="nodownload"><!-- playsinline="" autoplay="" muted="" loop="" -->
                                <source class="h-100 videooga" src="img/video/Gobierno de Informacion.mp4"
                                    type="video/mp4">
                            </video>
                        </div>

                        <div id="oga" class="col-12 card "
                            style="padding:unset;display: flex;justify-content: center;align-items: center">
                            <video id="o" style="max-width: 60%;max-height: 100%" controls
                                controlsList="nodownload"><!-- playsinline="" autoplay="" muted="" loop="" -->
                                <source class="h-100 videooga" src="img/video/promo_oga_suite.mp4" type="video/mp4">
                            </video>
                        </div>


                        <div id="datahub" class="col-12 card "
                            style="padding:unset;display: flex;justify-content: center;align-items: center">
                            <video id="d" style="max-width: 60%;max-height: 100%" controls
                                controlsList="nodownload"><!-- playsinline="" autoplay="" muted="" loop="" -->
                                <source class="h-100 videooga" src="img/video/DataHub Promocional.mp4" type="video/mp4">
                            </video>
                        </div>


                    </div>
                </div>
            </main>

            <footer class="page-footer">
                <div class="footer-content">
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col-12 col-sm-6">
                                <p class="mb-0 text-muted">Banco Guayaquil 2026</p>
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
            <script src="js/jquery.SPServices.v2014-02.min.js"></script>
            <script>
                var n = new Date().getTime();
                document.write('<script src="js/suite.js?v=' + n + '"> <' + '/' + 'script>');
            </script>
            <script>
                $(document).ready(function () { sobreOGA() });
            </script>
        </body>

    </html>