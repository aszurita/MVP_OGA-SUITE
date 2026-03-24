<!DOCTYPE html>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<html lang="en" xmlns:mso="urn:schemas-microsoft-com:office:office" xmlns:msdt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882">

<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<head>
    <meta charset="UTF-8">
    <title>Gobierno de Información</title>
    <link rel="icon" type="image/png" href="img/OGA_icon.png">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

    <link rel="stylesheet" href="font/iconsmind-s/css/iconsminds.css" />
    <link rel="stylesheet" href="font/simple-line-icons/css/simple-line-icons.css" />

    <link rel="stylesheet" href="css/vendor/bootstrap.min.css" />
    <link rel="stylesheet" href="css/vendor/bootstrap.rtl.only.min.css" />
    <link rel="stylesheet" href="css/vendor/component-custom-switch.min.css" />
    <link rel="stylesheet" href="css/vendor/perfect-scrollbar.css" />
    <link rel="stylesheet" href="css/vendor/glide.core.min.css">
    <script>
        var n = new Date().getTime();
        document.write('<link href="css/style.css?v='+n+'" rel="stylesheet" />');
    </script>
    <script>
        (function () {
            var hoy = new Date();
            var inicioNavidad = new Date(hoy.getFullYear(), 11, 1); // December is month 11 (0-based)
            window.usarLogoNavidad = hoy >= inicioNavidad;
        })();
    </script>
    <link rel="stylesheet" href="css/main.css" />

<!--[if gte mso 9]><SharePoint:CTFieldRefs runat=server Prefix="mso:" FieldList="FileLeafRef"><xml>
<mso:CustomDocumentProperties>
<mso:_CopySource msdt:dt="string">http://vamos.bancoguayaquil.com/sitios/informaciongerencial/OGAsuite_Produccion/Produccion/OGASuite.aspx</mso:_CopySource>
<mso:Order msdt:dt="string">227600.000000000</mso:Order>
<mso:TemplateUrl msdt:dt="string"></mso:TemplateUrl>
<mso:xd_ProgID msdt:dt="string"></mso:xd_ProgID>
<mso:_SourceUrl msdt:dt="string"></mso:_SourceUrl>
<mso:_SharedFileIndex msdt:dt="string"></mso:_SharedFileIndex>
</mso:CustomDocumentProperties>
</xml></SharePoint:CTFieldRefs><![endif]-->
</head>

<body id="app-container" class="menu-default show-spinner" style="z-index: 0;">
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
                <input placeholder="Search...">
                <span class="search-icon">
                    <i class="simple-icon-magnifier"></i>
                </span>
            </div> -->
        </div>


        <a class="navbar-logo" href="#">
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
    <div class="landing-main">
        <!-- <div class="mascara"></div> -->
        <video playsinline="" autoplay="" muted="" loop="" id="video">
            <source class="h-100" src="img/video/data.mp4" type="video/mp4" id="video-source">
        </video>
    </div>
    <main>
        <div class="container-fluid">
            <div class="row">
                <div class="col-12" style="padding:unset;">
                    <div class="glide">
                        <div class="glide__track" data-glide-el="track">
                            <div class="glide__slides">
                                <div class="glide__slide" id="glide__slide-principal">
                                    <div class="landing-txt glass" style="width: -webkit-fill-available;">
                                        <div class="" style="display:flex; margin-right: 5%; margin-left:5%;">
                                            <div class="container">
                                               
                                                    <div class="d-flex justify-content-center">
                                                        <div class="row justify-content-center" style="padding-top: 10%;">
                                                            <div class="col-5 d-flex justify-content-center" style="padding-bottom:38px">
                                                                <img src="logos/oga_color.png" class="mb-2"
                                                                    style="width: 50%;">
                                                            </div>
                                                            <div class="col-12 d-flex justify-content-center" >
                                                                <h1 style="text-align: center;">Bienvenido a OGA Suite
                                                                </h1>
                                                            </div>
                                                            <div class="col-12 d-flex justify-content-center">
                                                                <h2 style="text-align: center;">Propósito</h2>
                                                            </div>
                                                            <div class="col-7 d-flex justify-content-center" >
                                                                <p class="glass-secondary"
                                                                style="text-align: center;font-size:22px;width: 100%;line-height:100%">
                                                                    Viabilizar el
                                                                    correcto gobierno de información e incentivar de
                                                                    manera
                                                                    transversal a toda la organización las capacidades
                                                                    analí­ticas,
                                                                    promoviendo la monetización y la cultura data driven
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                              
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="glide__slide" id="glide__slide-principal">
                                    <div class="landing-txt glass" style="width: -webkit-fill-available;">
                                        <div class="" style="display:flex; margin-right: 5%; margin-left:5%;">
                                            <div class="container">
                                               
                                                    <div class="d-flex justify-content-center">
                                                        <div class="row justify-content-center" style="padding-top: 5%;">
                                                            <div class="col-5 d-flex justify-content-center" style="padding-bottom: 15px;">
                                                                <img src="img/datahub_logo.png" class="mb-2"
                                                                     height="100" width="100">
                                                            </div>
                                                            <div class="col-12 d-flex justify-content-center" >
                                                                <h1 style="text-align: center;">Data Hub
                                                                </h1>
                                                            </div>
                                                            <div class="col-12 d-flex justify-content-center">
                                                                <h2 style="text-align: center;">Propósito</h2>
                                                            </div>
                                                            <div class="col-12 d-flex justify-content-center" >
                                                                <p class="glass-secondary"
                                                                style="text-align: center;font-size:22px;width: 100%;line-height:100%">
                                                                <b>âœ¨ Â¡Descubre el poder de los Modelos y Artefactos de Visualización! âœ¨</b><br>
                                                                Optimiza. Organiza. Impacta.<br>
                                                                DataHub te brinda una herramienta donde podrás: <br>
                                                                ðŸ“‚ Explorar toda la documentación de modelos y visualizaciones. <br>
                                                                ðŸ§© Conectar con los creadores y grupos beneficiados. <br>
                                                                ðŸ“Š Maximizar el uso de reportes y recursos en tus proyectos. <br>
                                                                ðŸŒ Â¡Úsala ahora y lleva tus datos al siguiente nivel!
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                              
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="glide__slide" id="glide__slide-suggestedApps">
                                    
                                </div>

                                
                                <div class="glide__slide">
                                    <div class="landing-txt glass" style="width: -webkit-fill-available;">
                                        <div class="txt-box" style="display:flex; margin-right: 15%; margin-left:15%;">
                                            <div>
                                                <h1>Activos de Información</h1>
                                            </div>
                                            <div class="container">
                                                <div class="col-12">
                                                    <div class="row mt-2 mb-2">
                                                        <div class="col-12  p-0">
                                                            <div class="card mt-2 ml-2 mr-2 mb-2 contador">
                                                                <div
                                                                    class="card-body text-center p-2">
                                                                    <a id="dominios-tarjeta"
                                                                        href="LibroDominios.aspx">
                                                                        <i class="simple-icon-layers"
                                                                            style="font-size: 25px;"></i>
                                                                        <p class="card-text mb-0 w-100">Dominios</p>
                                                                        <p class="lead text-center mb-0 w-100"
                                                                            id="n-dominios">7</p>
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-6  p-0">
                                                            <div class="card mt-2 ml-2 mr-2 mb-2 contador">
                                                                <div
                                                                    class="card-body text-center p-2">
                                                                    <a id="origenes-tarjeta"
                                                                        href="Origenes_datos.aspx">
                                                                        <i class="iconsminds-big-data"
                                                                            style="font-size: 22px;"></i>
                                                                        <p class="card-text mb-0 w-100">Orí­genes de
                                                                            Datos</p>
                                                                        <p class="lead text-center mb-0 w-100"
                                                                            id="n-origenes">12</p>
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-6  p-0">
                                                            <div class="card mt-2 ml-2 mr-2 mb-2 contador">
                                                                <div
                                                                    class="card-body text-center  p-2">
                                                                    <a id="atributos-tarjeta" href="Glosario.aspx">
                                                                        <i class="simple-icon-list"
                                                                            style="font-size: 25px;"></i>
                                                                        <p class="card-text mb-0 w-100">Atributos
                                                                        </p>
                                                                        <p class="lead text-center mb-0 w-100"
                                                                            id="n-atributos">261</p>
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-6  p-0">
                                                            <div class="card mt-2 ml-2 mr-2 mb-2 contador">
                                                                <div
                                                                    class="card-body text-center p-3">
                                                                    <a id="terminos-tarjeta" href="Glosario.aspx">
                                                                        <i class="simple-icon-speech"
                                                                            style="font-size: 25px;"></i>
                                                                        <p class="card-text mb-0 w-100">Términos</p>
                                                                        <p class="lead text-center mb-0 w-100"
                                                                            id="n-terminos">266</p>
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-6  p-0">
                                                            <div class="card mt-2 ml-2 mr-2 mb-2 contador">
                                                                <div
                                                                    class="card-body text-center p-3">
                                                                    <a id="terminos-tarjeta" href="Catalogo_Referencias.aspx">
                                                                        <i class="simple-icon-notebook"
                                                                            style="font-size: 25px;"></i>
                                                                        <p class="card-text mb-0 w-100">Catálogos de Referencia</p>
                                                                        <p class="lead text-center mb-0 w-100"
                                                                            id="n-catalogos">46</p>
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>

                                              
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="glide__slide">
                                    <div class="landing-txt glass" style="width: -webkit-fill-available;">
                                        <div class="txt-box">
                                            <h1>Todo sobre OGA en un solo lugar</h1>
                                            <p class="glass-secondary mb-3 w-100">Te traemos un nuevo look and feel a nuestra herramienta de Gobierno.</p>
                                            <div class="d-flex flex-row">
                                                <div class="card pt-2 pl-3 pr-3 pb-2 mr-3 contador">
                                                    <div class="card-body text-center p-3">
                                                        <a id="terminos-tarjeta" href="PoliticasProcedimientos.aspx">
                                                            <p class="card-text mb-0 w-100">Polí­ticas</p>
    
                                                        </a>
                                                    </div>
                                                </div>
                                                <div class="card pt-2 pl-3 pr-3 pb-2 mr-3 contador">
                                                    <div class="card-body text-center p-3">
                                                        <a id="terminos-tarjeta" href="LibroDominios.aspx">
                                                            <p class="card-text mb-0 w-100">Dominios</p>
    
                                                        </a>
                                                    </div>
                                                </div>
                                                <div class="card pt-2 pl-3 pr-3 pb-2 mr-3 contador">
                                                    <div class="card-body text-center p-3">
                                                        <a id="terminos-tarjeta" href="Glosario.aspx">
                                                            <p class="card-text mb-0 w-100">Diccionario</p>
    
                                                        </a>
                                                    </div>
                                                </div>
                                                <div class="card pt-2 pl-3 pr-3 pb-2 contador">
                                                    <div class="card-body text-center p-3">
                                                        <a id="terminos-tarjeta" href="EstrategiadelDato.aspx">
                                                            <p class="card-text mb-0 w-100">Estrategia</p>
    
                                                        </a>
                                                    </div>
                                                </div>
                                                
                                                   
                                                
                                               
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- <div class="glide__slide">
                                    <div class="landing-txt glass" style="width: -webkit-fill-available;">
                                        <div class="txt-box">
                                            <h1>Â¿Por qué OGA?</h1>
                                            <div class="d-flex flex-row">
                                                <div class="card pt-2 pl-3 pr-3 pb-2 contador">
                                                    <div class="card-body text-center p-3">
                                                        <a id="terminos-tarjeta" href="SobreOGA.aspx">
                                                            <p class="card-text mb-0 w-100">Te lo explicamos aquí­</p>
    
                                                        </a>
                                                    </div>
                                                </div>
                                                
                                            </div>
                                        </div>
                                    </div>
                                </div> -->
                            </div>
                        </div>
                        <div class="glide__arrows" data-glide-el="controls">
                            <button class="glide__arrow glide__arrow--left" data-glide-dir="<" style="background:#fff;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                                    <path
                                        d="M0 12l10.975 11 2.848-2.828-6.176-6.176H24v-3.992H7.646l6.176-6.176L10.975 1 0 12z">
                                    </path>
                                </svg>
                            </button>
                            <button class="glide__arrow glide__arrow--right" data-glide-dir=">"
                                style="background:#fff;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                                    <path
                                        d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z">
                                    </path>
                                </svg>
                            </button>
                        </div>
                        <div class="glide__bullets" data-glide-el="controls[nav]">
                            <button class="glide__bullet" data-glide-dir="=0"></button>
                            <button class="glide__bullet" data-glide-dir="=1"></button>
                            <button class="glide__bullet" data-glide-dir="=2"></button>
                            <button class="glide__bullet" data-glide-dir="=3"></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
    <div class="botones">
        <div class="boton-flotante BuenDato"
            onclick="window.open('https://teams.microsoft.com/l/app/f6405520-7907-4464-8f6e-9889e2fb7d8f?templateInstanceId=2a7c31f4-1932-47e7-8b40-63b22c11f965&environment=02ff268d-2f9a-ea52-a119-be7980914103')"
            title="Conversa con nuestro bot">
            <img class="float-left ogaicon" src="img/ogaicon.png" alt="Logo OGA" />
            <p>Conversa con Buen Dato</p>
        </div>
    </div>
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
    <script src="js/jquery.SPServices.v2014-02.min.js"></script>
    <script src="js/vendor/glide.min.js" style="opacity: 1;"></script>
    <script src="js/vendor/count-to.js" style="opacity: 1;"></script>

    <script src="js/ServiciosApi/ApiHelper.js"></script>
    <script src="js/ServiciosApi/TerminosService.js"></script>
    <script src="js/ServiciosApi/DominiosService.js"></script>
    <script>
        var n = new Date().getTime();
        document.write('<script src="js/suite.js?v=' + n + '"><' + '/' + 'script>');
    </script>
    <script>
        $(document).ready(index());
    </script>
</body>

</html>

