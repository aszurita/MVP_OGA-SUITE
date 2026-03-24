<!DOCTYPE html>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<html lang="en" xmlns:mso="urn:schemas-microsoft-com:office:office" xmlns:msdt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882">

<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<head>
    <meta charset="UTF-8">
    <title>Diagrama Madurez</title>
    <link rel="icon" type="image/png" href="img/OGA_icon.png" data-icon-default="img/OGA_icon.png" data-icon-navidad="img/OGA_icon_navidad.png">
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
    <script>
        (function () {
            var hoy = new Date();
            var inicioNavidad = new Date(hoy.getFullYear(), 11, 1);
            window.usarLogoNavidad = hoy >= inicioNavidad;
        })();
    </script>
</head>

<body id="app-container" class="menu-default show-spinner">
    <nav class="navbar fixed-top">
        <div class="d-flex align-items-center navbar-left">
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
            </div>
        </div>
    </nav>

    <div class="menu">
        <div class="main-menu">
            <div class="scroll">
                <ul class="list-unstyled" id="suite-navbar">
                    
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
                    <h1>Diagrama Madurez</h1>
                    <div class="separator mb-3"></div>
                </div>
            </div>
            <div class="row pl-3">
                <div class="col-12 p-0">
                    <div class="card">
                        <div class="card-body p-2"><!--541.25-->
                            <i data-toggle="modal" data-target="#DiagramaMadurez" class="iconsminds-full-screen-2 float-right" style="font-size: 18px;cursor: pointer;"></i>
                            <iframe class="estrategia" width="100%" height="393" src="DiagramaIndicadoresdeDI.aspx" frameborder="0" allowFullScreen="true"></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
    <!--Ventana Modal-->
    <div class="modal fade pl-1 pr-1" id="DiagramaMadurez" tabindex="-1" role="dialog" aria-labelledby="Madurez" aria-hidden="true">
        <div class="modal-dialog modal-xl h-100" role="document" style="min-width:95%;">
          <div class="modal-content h-100">
            <div class="modal-header pb-2 pt-2 mt-1" style="border-bottom: unset;">
              <button type="button" class="close p-2" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body p-0">
                <object width="100%" height="100%" data="DiagramaIndicadoresdeDI.aspx"></object>
            </div>
          </div>
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
    <script src="https://d3js.org/d3.v5.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/2.1.1/TweenMax.min.js"></script>
    <script src="js/jquery.SPServices.v2014-02.min.js"></script>
    <script>
        var n = new Date().getTime();
        document.write('<script src="js/suite.js?v='+n+'"> <'+'/'+'script>');
    </script>
    <script>
        $(document).ready(diagramaDI());
    </script>
</body>

</html>

