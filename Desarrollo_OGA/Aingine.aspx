<!DOCTYPE html>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls"
  Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<html lang="en" xmlns:mso="urn:schemas-microsoft-com:office:office"
  xmlns:msdt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882">

<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls"
  Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

  <head>
    <meta charset="UTF-8">
    <title>Api Aingine</title>
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
      document.write('<link href="css/style.css?v=' + n + '" rel="stylesheet" />');
    </script>
    <script>
      (function () {
        var hoy = new Date();
        var inicioNavidad = new Date(hoy.getFullYear(), 11, 1); // diciembre = 11 (0-based)
        window.usarLogoNavidad = hoy >= inicioNavidad;
      })();
    </script>
    <script src="js/Validador_Modelos/cargas/getUsuarioPorCodigo.js"></script>
    <link rel="stylesheet" href="css/main.css" />
  </head>

  <style>
    /* === Modal Pro / sin scroll lateral de página === */
    .modal.modal-noscroll .modal-dialog { max-width: 960px; }
    @media (min-width: 1200px) { .modal.modal-noscroll .modal-dialog { max-width: 1040px; } }
    .modal.modal-noscroll .modal-content { border: 0; border-radius: 14px; box-shadow: 0 16px 40px rgba(16, 24, 40, 0.18); }
    .modal.modal-noscroll .modal-header, .modal.modal-noscroll .modal-footer { border: 0; padding: 16px 22px; }
    .modal.modal-noscroll .modal-title { font-weight: 700; letter-spacing: .2px; }
    .modal.modal-noscroll .modal-body { max-height: calc(100vh - 220px); overflow: auto; padding: 8px 22px 18px 22px; }

    /* === Secciones visuales === */
    .form-section { background: #fafbfc; border: 1px solid #eef0f3; border-radius: 12px; padding: 14px 14px 8px; margin-bottom: 14px; }
    .form-section h6 { font-weight: 700; margin: 0 0 10px 0; display: flex; align-items: center; gap: 8px; color: #0f172a; }
    .form-section h6 i { opacity: .9; }

    /* === Grilla responsive para inputs === */
    .form-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
    @media (max-width: 992px) { .form-grid { grid-template-columns: 1fr 1fr; } }
    @media (max-width: 576px) { .form-grid { grid-template-columns: 1fr; } }

    /* === Detalles de inputs === */
    .input-group-text { background: #f6f7f9; }
    .small-help { font-size: .8rem; color: #6c757d; }
    .btn-primary, .btn-outline-secondary { border-radius: 999px; }

    /* === Layout del embed + fallback === */
    .docs-wrapper { width: 100%; height: 80vh; position: relative; }
    .docs-iframe { width: 100%; height: 100%; border: none; border-radius: 10px; }
    .fallback-hidden { display: none; }
  </style>


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
          <div id="sub-menu-suite"></div>
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
      <!--
        Contenedor del iframe y Fallback:
        - El iframe muestra la documentación
        - El bloque #tunnel-fallback es SOLO el formulario (sin funcionalidad) que se mostrará cuando el túnel expire
      -->
      <div class="docs-wrapper" id="docs-embed">
        <iframe
          id="docs-iframe"
          class="docs-iframe"
          src="http://gobinfoana01-2:8510/docs"
          title="Docs API">
        </iframe>
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
      document.write('<script src="js/suite.js?v=' + n + '"> <' + '/' + 'script>');
    </script>

    <script>
      // Mantener tu inicialización
      $(document).ready(function (){
        registrar_visita("AINGINE");
        diagramaDI();
      }
      );
    </script>
  </body>
</html>

