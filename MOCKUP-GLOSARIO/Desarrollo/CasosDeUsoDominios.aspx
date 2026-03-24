<!DOCTYPE html>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls"
  Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
  <html lang="en" xmlns:mso="urn:schemas-microsoft-com:office:office"
    xmlns:msdt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882">

  <%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls"
    Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

    <head>
      <meta charset="UTF-8">
      <title>Dominios | Casos de Uso</title>
      <link rel="icon" type="image/png" href="img/OGA_icon.png" data-icon-default="img/OGA_icon.png"
        data-icon-navidad="img/OGA_icon_navidad.png">
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

      <link rel="stylesheet" href="font/iconsmind-s/css/iconsminds.css" />
      <link rel="stylesheet" href="font/simple-line-icons/css/simple-line-icons.css" />

      <!-- Archivos de Estilo para Select2 -->
      <link rel="stylesheet" href="css/vendor/select2.min.css" />
      <link rel="stylesheet" href="css/vendor/select2-bootstrap.min.css" />

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
      <script src="js/AINGINE.js"></script>



    </head>

    <style>
      /* === Modal Pro / sin scroll lateral de página === */
      .modal.modal-noscroll .modal-dialog {
        max-width: 960px;
        /* ancho cómodo en desktop */
      }

      @media (min-width: 1200px) {
        .modal.modal-noscroll .modal-dialog {
          max-width: 1040px;
        }
      }

      .modal.modal-noscroll .modal-content {
        border: 0;
        border-radius: 14px;
        box-shadow: 0 16px 40px rgba(16, 24, 40, 0.18);
      }

      .modal.modal-noscroll .modal-header {
        border: 0;
        padding: 16px 22px;
      }

      .modal.modal-noscroll .modal-footer {
        border: 0;
        padding: 9px 22px 19px 22px;
      }


      .modal.modal-noscroll .modal-title {
        font-weight: 700;
        letter-spacing: .2px;
      }

      .modal.modal-noscroll .modal-body {
        /* Altura calculada para evitar barra del body.
           Hace scroll SOLO dentro del modal si el contenido crece */
        max-height: calc(100vh - 220px);
        overflow: auto;
        padding: 8px 22px 0px 22px;
      }

      /* === Secciones visuales === */
      .form-section {
        background: #fafbfc;
        border: 1px solid #eef0f3;
        border-radius: 12px;
        padding: 14px 14px 8px;
        margin-bottom: 14px;
      }

      .form-section h6 {
        font-weight: 700;
        margin: 0 0 10px 0;
        display: flex;
        align-items: center;
        gap: 8px;
        color: #0f172a;
      }

      .form-section h6 i {
        opacity: .9;
      }

      /* Sugerencias del buscador de dominios (cuando no hay id_dominio en la URL) */
      .cu-domain-suggestions {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        z-index: 1040;
        max-height: 260px;
        overflow-y: auto;
        border: 1px solid #e5e7eb;
        border-top: 0;
        border-radius: 0 0 10px 10px;
        background: #fff;
        box-shadow: 0 14px 32px rgba(0, 0, 0, 0.08);
        display: none;
      }

      .cu-domain-suggestions .list-group-item {
        border: 0;
        border-bottom: 1px solid #f1f5f9;
        padding: 10px 14px;
      }

      .cu-domain-suggestions .list-group-item:last-child {
        border-bottom: 0;
      }

      /* Ancho auto-ajustable para selects de Fuentes */
      .auto-width-select select {
        width: auto !important;
        display: inline-block;
        min-width: 120px;
      }

      .auto-width-select label {
        display: block;
      }

      /* Ajustar selects con Select2 */
      .auto-width-select .select2-container--bootstrap {
        width: auto !important;
        min-width: 120px;
        display: inline-block;
      }

      .auto-width-select .select2-selection {
        min-width: 120px;
      }

      /* Ancho dinámico por opción seleccionada */
      .select-auto-fit {
        width: auto !important;
        min-width: 120px;
        display: inline-block;
        padding-right: 52px;
        /* espacio extra para la flecha y texto */
      }

      .select-auto-fit.select2-hidden-accessible+.select2-container {
        width: auto !important;
        min-width: 120px;
      }

      /* Evita que la flecha de select2 tape el texto */
      .select2-container--bootstrap .select2-selection--single {
        padding-right: 1.5rem;
      }

      /* Fila compacta para selects de fuentes */
      .fuentes-row {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        align-items: flex-end;
      }

      .fuentes-row .auto-width-select {
        flex: 0 0 auto;
      }

      .fuentes-row .btn-fuente-group {
        flex: 0 0 auto;
        align-self: flex-end;
      }

      .fuentes-row .btn-fuente-group .btn {
        min-width: 140px;
        /* ancho fijo para evitar saltos al abrir/cerrar */
        white-space: nowrap;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding-left: 14px;
        padding-right: 14px;
      }

      .fuentes-row .form-group {
        margin-bottom: 8px;
      }

      .fuente-autocomplete {
        position: relative;
        flex: 1 1 360px;
        min-width: 260px;
      }

      /* === Grilla responsive para inputs === */
      .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 12px;
      }

      @media (max-width: 992px) {
        .form-grid {
          grid-template-columns: 1fr 1fr;
        }
      }

      @media (max-width: 576px) {
        .form-grid {
          grid-template-columns: 1fr;
        }
      }

      /* === Detalles de inputs === */
      .input-group-text {
        background: #f6f7f9;
      }

      .small-help {
        font-size: .8rem;
        color: #6c757d;
      }

      .btn-primary {
        border-radius: 999px;
      }

      .btn-outline-secondary {
        border-radius: 999px;
      }

      /* === Grilla de Casos de Uso (4 cols desktop / 5 cols pantallas grandes) === */
      .casos-grid {
        display: grid;
        grid-template-columns: repeat(1, minmax(0, 1fr));
        gap: 12px;
      }

      /* >=576px: 2 columnas */
      @media (min-width: 576px) {
        .casos-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }


      /* >=768px: 3 columnas */
      @media (min-width: 768px) {
        .casos-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
      }

      /* >=1200px: 4 columnas */
      @media (min-width: 1200px) {
        .casos-grid {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }
      }

      /* >=1600px: 5 columnas */
      @media (min-width: 1600px) {
        .casos-grid {
          grid-template-columns: repeat(5, minmax(0, 1fr));
        }
      }

      /* === Grilla === */
      .casos-grid {
        display: grid;
        grid-template-columns: repeat(1, minmax(0, 1fr));
        gap: 12px;
      }

      @media (min-width:576px) {
        .casos-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      @media (min-width:768px) {
        .casos-grid {
          grid-template-columns: repeat(3, 1fr);
        }
      }

      @media (min-width:1200px) {
        .casos-grid {
          grid-template-columns: repeat(4, 1fr);
        }
      }

      @media (min-width:1600px) {
        .casos-grid {
          grid-template-columns: repeat(5, 1fr);
        }
      }

      /* === Card compacta y angosta === */
      .cu-card {
        display: flex;
        flex-direction: column;
        justify-content: center;
        /* Centra verticalmente */
        align-items: center;
        /* Centra horizontalmente */
        gap: 12px;
        border: 1px solid #eef0f3;
        border-radius: 12px;
        background: #fff;
        padding: 12px;
        box-shadow: 0 4px 10px rgba(16, 24, 40, 0.06);
        transition: transform 0.12s ease, box-shadow 0.12s ease, border-color 0.12s ease;
        max-width: 260px;
        height: 100%;
        text-align: center;
        /* Centra el texto */
      }

      .cu-card:hover {
        transform: translateY(-3px) scale(0.95);
        box-shadow: 0 16px 32px rgba(216, 27, 96, 0.32);
        /* Magenta sombra */
        border-color: #d81b60;
        /* Magenta */

      }

      .cu-card--hover {
        transform: translateY(-1px);
        box-shadow: 0 10px 22px rgba(209, 0, 108, 0.28);
        border-color: #d1006c;
      }

      .cu-card--hover-green {
        transform: translateY(-1px);
        box-shadow: 0 10px 22px rgba(34, 197, 94, 0.3);
        border-color: #16a34a;
      }

      /* Subdominios: tarjetas más grandes */
      .cu-card[data-sub] {
        max-width: 320px;
        width: 100%;
        padding: 16px;
        margin: 10px 10px 16px 10px;
      }

      .cu-card[data-sub]:hover {
        transform: translateY(-3px) scale(0.95);
        box-shadow: 0 16px 32px rgba(209, 0, 108, 0.32);
      }

      .cu-card[data-sub] .cu-icon {
        font-size: 1.9rem;
      }

      .cu-card[data-sub] .cu-title {
        font-size: 1.1rem;
      }

      .cu-card[data-sub] .cu-state {
        font-size: 0.95rem;
        padding: 8px 14px;
      }


      .cu-header {
        display: flex;
        align-items: center;
        gap: 8px;
        /* Espacio entre el ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â­cono y el tÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â­tulo */
        width: 100%;
      }

      /* Icono carpeta */
      .cu-icon {
        font-size: 1.5rem;
        color: #64748b;
        line-height: 1;
        flex-shrink: 0;
        /* Evita que el ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â­cono se reduzca */
      }

      /* Contenido */
      .cu-content {
        flex: 1 1 auto;
        min-width: 0;
      }

      .cu-title {
        font-size: 1rem;
        font-weight: 700;
        color: #0f172a;
        margin: 0;
        line-height: 1.25;
        overflow: hidden;
        text-overflow: ellipsis;

        /* Permitir salto de lÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â­nea */
        white-space: normal;

        /* Limitar a 2 lÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â­neas */
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      /* Estado (candado) + Activo (luz) */
      .cu-status {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 2px;
      }

      /* Candado (estado) */
      .cu-lock {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-weight: 600;
        font-size: .85rem;
        color: #334155;
      }

      .cu-lock i {
        font-size: 1.05rem;
        line-height: 1;
      }

      .cu-lock--cerrado {
        color: #0f766e;
      }

      /* verde */
      .cu-lock--abierto {
        color: #b45309;
      }

      /* naranja */
      /* Estados visuales */
      .cu-state {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-weight: 700;
        font-size: .82rem;
        padding: 6px 12px;
        border-radius: 999px;
        border: 1px solid transparent;
      }

      .cu-state--ingresado {
        background: #f8fafc;
        color: #475569;
        border-color: #e2e8f0;
      }

      .cu-state--proceso {
        background: #fff7ed;
        color: #c2410c;
        border-color: #fdba74;
      }

      .cu-state--cerrado {
        background: #ecfdf3;
        color: #166534;
        border-color: #bbf7d0;
      }

      /* Luz Activo/Inactivo */
      .cu-led {
        position: relative;
        padding: 4px 10px 4px 22px;
        border-radius: 999px;
        font-weight: 700;
        font-size: .78rem;
        line-height: 1;
        border: 1px solid #e2e8f0;
        color: #0f172a;
        background: #f8fafc;
      }

      .cu-led::before {
        content: "";
        position: absolute;
        left: 8px;
        top: 50%;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        transform: translateY(-50%);
        background: #94a3b8;
      }

      /* ON (parpadea) */
      .cu-led--on {
        background: #eff6ff;
        color: #1d4ed8;
        border-color: #93c5fd;
      }

      .cu-led--on::before {
        background: #22c55e;
        animation: cu-blink 1.1s infinite ease-in-out;
      }

      /* OFF (fija y tenue) */
      .cu-led--off {
        background: #f8fafc;
        color: #334155;
        border-color: #e2e8f0;
        opacity: .85;
      }

      .cu-led--off::before {
        background: #94a3b8;
      }

      /* Semaforizaci?n por estado */
      .cu-led--ok {
        background: #ecfdf3;
        color: #166534;
        border-color: #bbf7d0;
      }

      .cu-led--ok::before {
        background: #22c55e;
        animation: cu-blink 1.1s infinite ease-in-out;
      }

      .cu-led--warn {
        background: #fff7ed;
        color: #9a3412;
        border-color: #fed7aa;
      }

      .cu-led--warn::before {
        background: #f97316;
      }

      .cu-led--error {
        background: #fef2f2;
        color: #991b1b;
        border-color: #fecdd3;
      }

      .cu-led--error::before {
        background: #ef4444;
        animation: cu-blink 1.1s infinite ease-in-out;
      }

      .cu-led--neutral {
        background: #f8fafc;
        color: #475569;
        border-color: #e2e8f0;
      }

      .cu-led--neutral::before {
        background: #cbd5e1;
      }


      /* Blink */
      @keyframes cu-blink {

        0%,
        100% {
          opacity: 1;
        }

        50% {
          opacity: .35;
        }
      }

      /* Meta en pilas (tÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â­tulos arriba, valores abajo con ellipsis) */
      .cu-meta {
        font-size: .80rem;
        color: #334155;
        display: grid;
        gap: 6px;
        margin-top: 8px;
      }

      .cu-row {
        display: grid;
        grid-template-columns: 1fr;
        gap: 2px;
      }

      .cu-k {
        color: #64748b;
        font-weight: 600;
        font-size: .75rem;
        display: block;
      }

      .cu-v {
        font-weight: 500;
        color: #0f172a;
        font-size: .86rem;
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* Footer mini */
      .cu-ft {
        margin-top: auto;
        /* Empuja el pie hacia la parte inferior */
        font-size: 0.75rem;
        color: #64748b;
        display: flex;
        justify-content: flex-end;
        /* Alinea el enlace a la derecha */
        width: 100%;
        /* Asegura que ocupe todo el ancho */
      }

      #modalNuevoCaso .modal-dialog {
        max-width: 1040px;
        /* Cambiar el ancho máximo a un valor más estrecho */
      }
    </style>

    <!-- Solución para el z-index del modal anidado -->
    <style>
      #modalAtributo {
        z-index: 1051 !important;
        /* Un valor mayor que el z-index por defecto del primer modal (1050) */
      }
    </style>

    <!-- Estilos para la nueva barra de bÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Âºsqueda de términos -->
    <style>
      .search-box {
        position: relative;
      }

      .search-box .form-control {
        padding-left: 2.375rem;
        border-radius: 999px;
        /* Bordes redondeados */
        border: 1px solid #e0e0e0;
        transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
      }

      .search-box .form-control:focus {
        border-color: #D2006E;
        /* Color de acento */
        box-shadow: 0 0 0 0.2rem rgba(210, 0, 110, 0.25);
      }

      .search-box .search-icon {
        position: absolute;
        top: 50%;
        left: 0.75rem;
        transform: translateY(-50%);
        color: #aaa;
      }
    </style>

    <style>
      /* Asegura que la tarjeta de seguimiento esté por encima de los modales de Bootstrap */
      .seguimiento-card,
      .seguimiento-card.shown {
        z-index: 1051 !important;
        /* Mayor que el z-index por defecto de los modales (1050) */
      }

      /* Asegura que el botón para abrir/cerrar también esté por encima */
      .seguimiento-card-button {
        z-index: 1052 !important;
      }
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
          <img id="logo-navbar" class="logo logo--invert d-none d-xs-block" src="logos/oga_color.png"
            data-logo-default="logos/oga_color.png" data-logo-navidad="logos/oga_navidad.png">
          <img class="logo-mobile d-block d-xs-none" src="logos/OGA_icon.png" data-logo-default="logos/OGA_icon.png"
            data-logo-navidad="logos/OGA_icon_navidad.png">
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
              <div class="d-flex flex-wrap align-items-center justify-content-between mb-3">
                <div>
                  <p class="text-uppercase text-muted mb-1" style="letter-spacing: .12em;">Casos de uso</p>
                  <h1 class="pb-1 mb-0">Dominios</h1>
                  <small class="text-muted">Explora los dominios y abre sus casos de uso en detalle.</small>
                </div>
                <span id="dominios-count" class="badge badge-primary" style="font-size: 0.95rem;">0 dominios</span>
              </div>
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-12">
              <div class="d-flex flex-wrap align-items-center" style="gap: 10px; max-width: 960px;">
                <div class="input-group position-relative" style="max-width: 520px; width: 100%;">
                  <div class="input-group-prepend">
                    <span class="input-group-text"><i class="simple-icon-magnifier"></i></span>
                  </div>
                  <input id="buscarDominio" type="text" class="form-control"
                    placeholder="Buscar por codigo o nombre de dominio...">
                </div>
                <select id="filtroTipoDominio" class="custom-select" style="max-width: 220px;">
                  <option value="">Todos los tipos</option>
                  <option value="1">Dominio Maestro</option>
                  <option value="2">Dominio Transaccional</option>
                  <option value="3">Dominio Derivado</option>
                </select>
                <button id="btnRefrescarDominios" class="btn btn-outline-primary d-flex align-items-center">
                  <i class="simple-icon-refresh mr-1"></i> Refrescar
                </button>
              </div>
            </div>
          </div>

          <div id="dominios-grid" class="casos-grid"></div>
        </div>

        <!-- Componente de seguimiento movido de vuelta a main -->
        <div class="seguimiento-card default-transition" style="display: none;" data-offset="47" data-modal-offset="56">
          <div class="card h-100 ">
            <div class="card-body ">
              <div class="d-flex flex-column justify-content-center align-items-center">
                <div class="seguimiento-card-content">
                  <div class="flex-grow-1 px-2" id="seguimiento-comentarios" style="overflow: auto; max-height:300px;">
                  </div>
                  <div class="seguimiento-input-wrapper d-flex align-items-center" style="gap:6px;position:relative;">
                    <textarea placeholder="Escriba su observación" id="seguimiento-input"
                      class="form-control"></textarea>
                    <ul id="suggestions"></ul>
                    <i class="simple-icon-paper-plane bg-primary h-100" id="btn-enviar-observacion"></i>
                  </div>
                  <div class="d-flex justify-content-between">
                    <div class="d-flex align-items-center">
                      <span class="" style="color: #6c757d;" id="seguimiento-conteo">0 Entradas</span>
                      <div type="file" id="btn-adjuntar-documento"
                        class="d-flex align-items-center justify-content-center" style="cursor: pointer;">
                        <i class="simple-icon-paper-clip ml-2 text-primary" style="cursor: pointer;"></i>
                        <span id="name-adjuntar-documento"></span>
                        <input id="input-adjuntar-documento" style="display: none;" type="file"
                          accept=".xlsx,.xls,.pptx,.ppt,.txt,.csv,.pdf,.docx" />
                      </div>
                    </div>
                    <div class="d-flex align-items-center" style="gap: .25rem;"><i class="iconsminds-close"
                        style="visibility: hidden; cursor:pointer;" id="seguimiento-cancelar-respuesta"></i><span
                        id="seguimiento-comentario-respuesta" style="font-size: 10px;"></span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <a href="#" class="seguimiento-card-button text-primary" data-toggle="tooltip" data-placement="top"
            title="Seguimiento"> <i class="iconsminds-speach-bubble-dialog"></i> </a>
        </div>
      </main>
      <!--Ventana Modal-->

      <style>
        .btn-slot {
          display: inline-flex;
          justify-content: center;
          align-items: center
        }

        /* Botón reveal (reposo: solo ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â­cono, sin borde/fondo) */
        .btn-reveal {
          --accent: #D2006E;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 38px;
          padding: 10px;
          border: 0;
          background: transparent;
          color: var(--accent);
          border-radius: 999px;
          max-width: 42px;
          overflow: hidden;
          white-space: nowrap;
          gap: 0;
          transition: max-width .25s ease, background-color .2s ease, color .2s ease, box-shadow .2s ease, padding .25s ease, gap .25s ease
        }

        .btn-reveal svg {
          width: 18px;
          height: 18px;
          stroke: currentColor;
          fill: none;
          flex: 0 0 auto
        }

        .btn-reveal .label {
          font-weight: 600;
          opacity: 0;
          max-width: 0;
          overflow: hidden;
          transition: opacity .18s ease, max-width .25s ease
        }

        /* Expandido (hover/focus) */
        .btn-reveal:hover,
        .btn-reveal:focus-visible {
          max-width: 180px;
          padding: 8px 12px;
          gap: 10px;
          justify-content: flex-start;
          background: var(--accent);
          color: #fff;
          box-shadow: 0 6px 16px rgba(210, 0, 110, .25)
        }

        .btn-reveal:focus-visible {
          outline: 3px solid rgba(210, 0, 110, .28);
          outline-offset: 2px
        }

        .btn-reveal:hover .label,
        .btn-reveal:focus-visible .label {
          opacity: 1;
          max-width: 160px
        }
      </style>

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
      <script src="js/vendor/bootstrap-notify.min.js"></script>
      <script src="js/dore.script.js"></script>
      <script src="js/vendor/select2.full.js"></script>
      <script src="js/scripts.single.theme.js"></script>
      <script src="https://d3js.org/d3.v5.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/2.1.1/TweenMax.min.js"></script>
      <script src="js/jquery.SPServices.v2014-02.min.js"></script>
      <script>
        var n = new Date().getTime();
        document.write('<script src="js/suite.js?v=' + n + '"> <' + '/' + 'script>');
      </script>

      <script>
        (function () {
          const grid = document.getElementById('dominios-grid');
          const badge = document.getElementById('dominios-count');
          const buscador = document.getElementById('buscarDominio');
          const filtroTipo = document.getElementById('filtroTipoDominio');
          const btnRefrescar = document.getElementById('btnRefrescarDominios');

          if (!grid) return;

          const tipoLabels = { 1: "Dominio Maestro", 2: "Dominio Transaccional", 3: "Dominio Derivado" };
          const tipoBadgeClass = {
            maestro: "badge-primary",
            transaccional: "badge-info",
            derivado: "badge-warning"
          };
          const toNumber = (val) => Number(String(val ?? "").split(";")[0] || NaN);

          let dominiosCache = [];
          const subdominiosCache = new Map();
          const casosCacheBySubKey = new Map();
          const casosInlineByKey = new Map();
          const inlineById = new Map();

          function escapeHtml(str) {
            return String(str || "").replace(/[&<>"']/g, (m) => ({
              "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
            }[m] || m));
          }

          function formatAvance(raw) {
            const num = toNumber(raw);
            if (Number.isNaN(num)) return "N/D";
            const pct = num <= 1 ? num * 100 : num;
            return `${Math.round(pct)}%`;
          }

          function normalize(lista) {
            if (!Array.isArray(lista)) return [];
            return lista.map((d) => {
              const isSpRow = typeof d?.attr === "function";
              const id = isSpRow ? toNumber(d.attr("ows_id_dominio") || d.attr("ows_ID")) : toNumber(d.id_dominio ?? d.id ?? d.ID_DOMINIO);
              const codigo = isSpRow ? d.attr("ows_codigo_Dominio") : (d.codigo_Dominio ?? d.codigo ?? "");
              const nombre = isSpRow ? d.attr("ows_descripcion_dominio") : (d.descripcion_dominio ?? d.descripcion ?? "");
              const idTipo = isSpRow ? toNumber(d.attr("ows_id_tipo_dominio") || 0) : toNumber(d.id_tipo_dominio || 0);
              const tipo = isSpRow ? d.attr("ows_tipo_dominio") : (d.tipo_dominio ?? d.Tipo ?? "");
              const subdominios = toNumber(isSpRow ? d.attr("ows_subdominios") : d.subdominios) || 0;
              const estructura = toNumber(isSpRow ? d.attr("ows_cant_estructura") : d.cant_estructura) || 0;
              const avance = isSpRow ? d.attr("ows_porcentaje_avance_dominio") : d.porcentaje_avance_dominio;

              return {
                id,
                codigo: codigo || "",
                nombre: nombre || "Sin nombre",
                idTipo: idTipo || null,
                tipo: tipo || tipoLabels[idTipo] || "",
                subdominios,
                estructura,
                avance
              };
            }).filter(d => d.id);
          }

          function updateBadge(total) {
            if (badge) {
              badge.textContent = `${total} dominio${total === 1 ? "" : "s"}`;
            }
          }

          function render(lista) {
            if (!lista || lista.length === 0) {
              grid.innerHTML = `
                <div class="text-center p-4" style="grid-column: 1 / -1;">
                  <i class="iconsminds-empty-box" style="font-size: 2.6rem; color: #9ca3af;"></i>
                  <h5 class="mt-3 mb-1">No se encontraron dominios</h5>
                  <p class="text-muted mb-0">Ajusta el filtro o refresca la consulta.</p>
                </div>`;
              updateBadge(0);
              return;
            }

            grid.innerHTML = lista.map(d => {
              const tipoLabel = d.tipo || tipoLabels[d.idTipo] || "Dominio";
              const tipoKey = (tipoLabel || "").toLowerCase();
              const badgeClass =
                tipoKey.includes("maestro") ? tipoBadgeClass.maestro :
                  tipoKey.includes("transaccional") ? tipoBadgeClass.transaccional :
                    tipoKey.includes("derivado") ? tipoBadgeClass.derivado :
                      "badge-secondary";

              return `
                <div class="cu-card cu-card--hover dominio-card" data-id="${d.id}" data-nombre="${escapeHtml(d.nombre)}" tabindex="0" role="button" aria-label="Ver subdominios y casos de uso de ${escapeHtml(d.nombre)}">
                  <div class="cu-header">
                    <div class="cu-icon"><i class="iconsminds-network"></i></div>
                    <div class="cu-content">
                      <p class="cu-title mb-1">${escapeHtml(d.nombre)}</p>
                      <div class="d-flex flex-wrap align-items-center" style="gap:6px;">
                        <span class="badge ${badgeClass}">${escapeHtml(tipoLabel)}</span>
                      </div>
                    </div>
                  </div>
                  <div class="cu-ft">
                    <button class="btn btn-link p-0 font-weight-bold text-primary js-open-casos" data-id="${d.id}" type="button">Ver casos</button>
                  </div>
                </div>`;
            }).join("");

            updateBadge(lista.length);
          }

          function applyFilters() {
            const query = (buscador?.value || "").toLowerCase().trim();
            const tipoFiltro = filtroTipo?.value || "";

            // Si un dominio abierto desaparece, eliminamos su bloque inline
            const visiblesIds = new Set(dominiosCache.map(d => String(d.id)));
            inlineById.forEach((node, key) => {
              if (!visiblesIds.has(String(key))) {
                if (node && node.parentNode) node.parentNode.removeChild(node);
                inlineById.delete(key);
              }
            });
            document.querySelectorAll('.dominio-card--selected').forEach(el => {
              const id = el.getAttribute('data-id');
              if (!visiblesIds.has(String(id))) el.classList.remove('dominio-card--selected');
            });

            const filtrados = dominiosCache.filter(d => {
              const coincideTexto =
                !query ||
                d.nombre.toLowerCase().includes(query) ||
                d.codigo.toLowerCase().includes(query);

              const coincideTipo = !tipoFiltro ||
                String(d.idTipo) === String(tipoFiltro) ||
                (d.tipo || "").toLowerCase().includes(
                  tipoFiltro === "1" ? "maestro" :
                    tipoFiltro === "2" ? "transaccional" :
                      "derivado"
                );

              return coincideTexto && coincideTipo;
            });

            render(filtrados);
          }

          async function fetchDominiosFallback() {
            const body = {
              campos:
                "md.codigo_Dominio, md.descripcion_dominio, md.Conceptos_Clave, md.descripcion, md.COM, md.IMPACT, md.Tipo, md.Familia_de_Dominios, md.lider_sugerido, md.atributos_basicos, md.id_tipo_dominio, md.id_tipo_familia, md.id_dominio, md.sn_activo, " +
                "(SELECT COUNT(*) FROM procesos_bi.dbo.t_subdominios s WHERE s.id_dominio = md.id_dominio) AS subdominios, " +
                "(SELECT COUNT(*) FROM procesos_bi.dbo.t_estructura_gobierno eg WHERE eg.sn_activo = 1 AND eg.id_subdominio IN (SELECT s.id_subdominio FROM procesos_bi.dbo.t_subdominios s WHERE s.id_dominio = md.id_dominio)) AS cant_estructura, " +
                "(SELECT AVG(CAST(d.porcentaje_avance AS decimal(9,4))) FROM procesos_bi.dbo.t_pasos_dominio_desarrollo d WHERE d.sn_aplica = 1 AND d.id_subdominio IN (SELECT s.id_subdominio FROM procesos_bi.dbo.t_subdominios s WHERE s.id_dominio = md.id_dominio) AND d.fecha_carga = (SELECT MAX(d2.fecha_carga) FROM procesos_bi.dbo.t_pasos_dominio_desarrollo d2 WHERE d2.id_subdominio = d.id_subdominio AND d2.id_paso = d.id_paso)) AS porcentaje_avance_dominio",
              origen: "procesos_bi.dbo.t_mapa_dominios md",
              condicion: "md.sn_activo = 1"
            };

            const resp = await fetch("http://gobinfoana01-2:8510/query", {
              method: "POST",
              headers: { accept: "application/json", "Content-Type": "application/json" },
              body: JSON.stringify(body)
            });

            if (!resp.ok) {
              const text = await resp.text().catch(() => "");
              throw new Error(`HTTP ${resp.status}: ${text}`);
            }

            return await resp.json();
          }

          async function loadDominios() {
            try {
              grid.innerHTML = `
                <div class="text-center p-4" style="grid-column: 1 / -1;">
                  <span class="spinner-border text-primary" role="status" aria-hidden="true"></span>
                  <div class="mt-2 text-muted">Cargando dominios...</div>
                </div>`;

              let data = [];
              if (typeof getDominiosAllAPI === "function") {
                const res = await getDominiosAllAPI();
                data = res?.dominios || res || [];
              } else if (typeof getDominiosAll === "function") {
                const res = getDominiosAll();
                data = res?.dominios || res || [];
              } else {
                data = await fetchDominiosFallback();
              }

              dominiosCache = normalize(Array.isArray(data) ? data : []);
              applyFilters();
            } catch (err) {
              console.error("No se pudo cargar los dominios", err);
              grid.innerHTML = `
                <div class="text-center text-danger p-4" style="grid-column: 1 / -1;">
                  <i class="simple-icon-exclamation" style="font-size: 2rem;"></i>
                  <div class="mt-2">Error al cargar los dominios. Intenta nuevamente.</div>
                </div>`;
              updateBadge(0);
            }
          }

          async function renderInlineSubdominios(dominioId, card) {
            if (!grid) return;

            // toggle: si ya está abierto, cerrarlo
            const existing = inlineById.get(String(dominioId));
            if (existing) {
              if (existing.node && existing.node.parentNode) existing.node.parentNode.removeChild(existing.node);
              inlineById.delete(String(dominioId));
              if (existing.card) existing.card.classList.remove('dominio-card--selected');
              return;
            }

            const inline = document.createElement('div');
            inline.className = 'subdom-inline';
            inline.innerHTML = `
              <div class="cu-group__header">
                <div>
                  <div class="cu-group__eyebrow">Dominio seleccionado</div>
                  <h6 class="cu-group__title mb-1">${escapeHtml(card?.getAttribute('data-nombre') || 'Subdominios')}</h6>
                  <small class="text-muted">Haz clic en un subdominio para ver sus casos de uso.</small>
                </div>
                <span class="cu-group__count text-muted"></span>
              </div>
              <div class="cu-group__grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;">
                <div class="text-center p-3" style="grid-column:1 / -1;">
                  <span class="spinner-border spinner-border-sm text-primary" role="status" aria-hidden="true"></span>
                  <small class="text-muted ml-2">Cargando subdominios...</small>
                </div>
              </div>`;

            const nextSibling = card?.nextElementSibling;
            if (nextSibling) {
              grid.insertBefore(inline, nextSibling);
            } else {
              grid.appendChild(inline);
            }
            inlineById.set(String(dominioId), { node: inline, card });
            if (card) card.classList.add('dominio-card--selected');

            const countEl = inline.querySelector('.cu-group__count');
            const gridSubs = inline.querySelector('.cu-group__grid');

            try {
              let lista = subdominiosCache.get(dominioId);
              if (!lista) {
                const data = await ApiService.query({
                  campos: "*",
                  origen: "PROCESOS_BI.DBO.T_CASOS_USO_ANALITICA",
                  condicion: `id_dominio = ${Number(dominioId)}`
                });

                const rawSubs = Array.isArray(data) ? data : (data ? [data] : []);
                const uniques = new Set();
                rawSubs.forEach(row => {
                  const val = (row.SUBDOMINIO || row.subdominio || "").toString().trim();
                  if (!val) {
                    uniques.add("__SIN_SUB__");
                  } else {
                    uniques.add(val);
                  }
                });

                lista = Array.from(uniques).map((nombre, idx) => ({
                  id: `${dominioId}-${idx}`,
                  nombre: nombre === "__SIN_SUB__" ? "Sin subdominio" : nombre,
                  clave: nombre === "__SIN_SUB__" ? "__SIN_SUB__" : nombre
                }));

                subdominiosCache.set(dominioId, lista);
              }

              if (!lista || lista.length === 0) {
                gridSubs.innerHTML = `<div class="text-muted p-3" style="grid-column: 1 / -1;">Sin subdominios registrados.</div>`;
                if (countEl) countEl.textContent = "0 subdominios";
                return;
              }

              gridSubs.innerHTML = lista.map(sub => {
                const enlace = `CasosDeUso.aspx?id_dominio=${dominioId}&subdominio=${encodeURIComponent(sub.nombre)}`;
                return `
                  <div class="cu-card cu-card--hover-green subdom-card" data-sub="1" data-dominio="${dominioId}" data-dominio-nombre="${escapeHtml(card?.getAttribute('data-nombre') || '')}" data-sub-name="${escapeHtml(sub.nombre)}" data-sub-key="${escapeHtml(sub.clave || sub.nombre)}" tabindex="0" role="button" aria-label="Ver casos de ${escapeHtml(sub.nombre)}">
                    <div class="cu-header">
                      <div class="cu-icon"><i class="simple-icon-folder"></i></div>
                      <div class="cu-content">
                        <p class="cu-title mb-1">${escapeHtml(sub.nombre)}</p>
                      </div>
                    </div>
                    <div class="cu-ft">
                      <a class="text-primary font-weight-bold subdom-link" href="${enlace}">Ver casos</a>
                    </div>
                  </div>`;
              }).join("");

              if (countEl) countEl.textContent = `${lista.length} subdominio${lista.length === 1 ? "" : "s"}`;
            } catch (err) {
              console.error("No se pudieron cargar subdominios", err);
              gridSubs.innerHTML = `<div class="text-danger p-3" style="grid-column: 1 / -1;">No se pudieron cargar los subdominios.</div>`;
              if (countEl) countEl.textContent = "";
            }
          }

          function handleCardInteraction(e) {
            const card = e.target.closest(".dominio-card");
            if (!card) return;
            const openBtn = e.target.closest(".js-open-casos");
            if (openBtn) {
              const id = openBtn.getAttribute("data-id");
              if (id) window.location.href = `CasosDeUso.aspx?id_dominio=${id}`;
              e.stopPropagation();
              return;
            }
            if (e.target.closest(".subdom-link")) return; // dejar navegar a subdominio sin colapsar
            const id = card.getAttribute("data-id");
            if (id) renderInlineSubdominios(id, card);
          }

          async function renderInlineCasos(dominioId, subKey, subName, subCard) {
            if (!grid) return;
            const mapKey = `${dominioId}|${subKey || "__SIN_SUB__"}`;

            const existing = casosInlineByKey.get(mapKey);
            if (existing) {
              if (existing.node && existing.node.parentNode) existing.node.parentNode.removeChild(existing.node);
              casosInlineByKey.delete(mapKey);
              if (existing.card) existing.card.classList.remove('dominio-card--selected');
              return;
            }

            const node = document.createElement('div');
            node.className = 'subdom-casos-inline';
            node.innerHTML = `
              <div class="cu-group__header">
                <div>
                  <div class="cu-group__eyebrow">Subdominio</div>
                  <h6 class="cu-group__title mb-1">${escapeHtml(subName)}</h6>
                </div>
                <div class="d-flex align-items-center" style="gap:8px; flex-wrap:wrap;">
                  <span class="cu-chip"><i class="simple-icon-organization"></i>${escapeHtml(subCard?.getAttribute('data-dominio-nombre') || '')}</span>
                  <span class="cu-chip" style="background:#ecfeff;color:#0e7490;"><i class="simple-icon-folder"></i>${escapeHtml(subName)}</span>
                  <span class="cu-group__count text-muted"></span>
                </div>
              </div>
              <div class="cu-group__grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;">
                <div class="text-center p-3" style="grid-column:1 / -1;">
                  <span class="spinner-border spinner-border-sm text-primary" role="status" aria-hidden="true"></span>
                  <small class="text-muted ml-2">Cargando casos...</small>
                </div>
              </div>`;

            const next = subCard?.nextElementSibling;
            if (next) {
              subCard.parentNode.insertBefore(node, next);
            } else {
              subCard.parentNode.appendChild(node);
            }
            casosInlineByKey.set(mapKey, { node, card: subCard });
            if (subCard) subCard.classList.add('dominio-card--selected');

            const countEl = node.querySelector('.cu-group__count');
            const gridCasos = node.querySelector('.cu-group__grid');

            try {
              let casos = casosCacheBySubKey.get(mapKey);
              if (!casos) {
                const condParts = [`id_dominio = ${Number(dominioId)}`];
                if (subKey === "__SIN_SUB__") {
                  condParts.push("(SUBDOMINIO IS NULL OR LTRIM(RTRIM(SUBDOMINIO)) = '')");
                } else {
                  const safe = subKey.replace(/'/g, "''");
                  condParts.push(`SUBDOMINIO = '${safe}'`);
                }
                const data = await ApiService.query({
                  campos: "*",
                  origen: "PROCESOS_BI.DBO.T_CASOS_USO_ANALITICA",
                  condicion: condParts.join(" AND ")
                });
                casos = Array.isArray(data) ? data : (data ? [data] : []);
                casosCacheBySubKey.set(mapKey, casos);
              }

              if (!casos || casos.length === 0) {
                gridCasos.innerHTML = `<div class="text-muted p-3" style="grid-column:1 / -1;">Sin casos de uso para este subdominio.</div>`;
                if (countEl) countEl.textContent = "0 casos";
                return;
              }

              const estadoBadge = (estadoRaw) => {
                const e = (estadoRaw || "").toString().toUpperCase();
                if (e.includes("PROCES")) return "badge-warning";
                if (e.includes("CERR")) return "badge-success";
                return "badge-secondary";
              };

              gridCasos.innerHTML = casos.map(caso => {
                const estado = caso.estado_caso_uso || caso.ESTADO_CASO_USO || "";
                const activo = caso.sn_activo === 1 || caso.sn_activo === true || caso.SN_ACTIVO === true || caso.SN_ACTIVO === 1;
                const id = caso.id_caso_uso || caso.ID_CASO_USO || "";
                const desc = caso.descripcion_caso_uso || caso.DESCRIPCION_CASO_USO || "";
                return `
                  <div class="cu-card cu-card--hover caso-card" data-caso-id="${id}">
                    <div class="cu-header">
                      <div class="cu-icon"><i class="iconsminds-idea"></i></div>
                      <div class="cu-content">
                        <p class="cu-title mb-1">${escapeHtml(desc)}</p>
                        <div class="d-flex align-items-center" style="gap:6px; flex-wrap:wrap;">
                      <span class="badge badge-light text-muted">ID ${escapeHtml(id)}</span>
                          <span class="badge ${estadoBadge(estado)}">${escapeHtml(estado || "SIN ESTADO")}</span>
                        </div>
                      </div>
                    </div>
                    <div class="cu-ft">
                      <span class="cu-led ${activo ? 'cu-led--on' : 'cu-led--off'}">${activo ? 'Activo' : 'Inactivo'}</span>
                    </div>
                  </div>`;
              }).join("");

              if (countEl) countEl.textContent = `${casos.length} caso${casos.length === 1 ? "" : "s"}`;
            } catch (err) {
              console.error("No se pudieron cargar casos de uso", err);
              gridCasos.innerHTML = `<div class="text-danger p-3" style="grid-column:1 / -1;">No se pudieron cargar los casos de uso.</div>`;
              if (countEl) countEl.textContent = "";
            }
          }

          function handleSubdomCardInteraction(e) {
            const subCard = e.target.closest(".cu-card[data-sub]");
            if (!subCard) return;
            if (e.target.closest(".subdom-link")) return;
            const dominioId = subCard.getAttribute("data-dominio");
            const subKey = subCard.getAttribute("data-sub-key") || "__SIN_SUB__";
            const subName = subCard.getAttribute("data-sub-name") || subKey;
            if (dominioId) renderInlineCasos(dominioId, subKey, subName, subCard);
          }

          document.addEventListener("DOMContentLoaded", () => {
            loadDominios();

            if (buscador) buscador.addEventListener("input", applyFilters);
            if (filtroTipo) filtroTipo.addEventListener("change", applyFilters);
            if (btnRefrescar) btnRefrescar.addEventListener("click", loadDominios);

            grid.addEventListener("click", handleCardInteraction);
            grid.addEventListener("click", handleSubdomCardInteraction);
            grid.addEventListener("keydown", (e) => {
              if (e.key === "Enter") handleCardInteraction(e);
            });
          });
        })();
      </script>

      <!-- Modal: Nuevo caso de uso -->
      <div class="modal fade modal-noscroll" id="modalNuevoCaso" tabindex="-1" role="dialog"
        aria-labelledby="modalNuevoCasoLabel" aria-hidden="true" data-backdrop="static">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">

            <div class="modal-header">
              <h5 class="modal-title" id="modalNuevoCasoLabel">Nuevo caso de uso</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Cerrar">
                <span aria-hidden="true">ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â</span>
              </button>
            </div>

            <!-- Barra de pasos -->
            <div class="px-4 pt-2">
              <ul id="wizardSteps" class="nav nav-pills justify-content-between">
                <li class="nav-item"><a class="nav-link active" data-goto="1">1. Información</a></li>
                <li class="nav-item"><a class="nav-link" data-goto="2">2. Responsables</a></li>
                <li class="nav-item"><a class="nav-link" data-goto="3">3. Fuentes</a></li>
                <li class="nav-item"><a class="nav-link" data-goto="4" role="tab">4. Términos</a></li>
              </ul>
            </div>

            <div class="modal-body">
              <form id="formNuevoCaso" novalidate>

                <!-- Sección: Información principal -->
                <div class="form-section" data-step="1">
                  <div class="form-grid">
                    <div class="form-group btn-fuente-group">
                      <label for="nc_descripcion">Descripción</label>
                      <input type="text" id="nc_descripcion" class="form-control"
                        placeholder="Descripción del caso de uso">
                    </div>
                    <div class="form-group">
                      <label for="nc_estado">Estado</label>
                      <select id="nc_estado" class="form-control">
                        <option value="INGRESADO" selected>INGRESADO</option> <!-- ? por defecto -->
                        <option value="EN PROCESO">EN PROCESO</option>
                        <option value="CERRADO">CERRADO</option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label for="nc_sn_activo">Habilitado</label>
                      <select id="nc_sn_activo" class="form-control">
                        <option value="1" selected>SÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â­</option>
                        <!-- ? por defecto -->
                        <option value="0">No</option>
                      </select>
                    </div>
                  </div>

                  <div class="form-row">
                    <div class="form-group col-md-6">
                      <label for="nc_detalle_caso_uso">Detalle del Caso de Uso</label>
                      <textarea id="nc_detalle_caso_uso" class="form-control" rows="3"
                        placeholder="Detalles adicionales..."></textarea>
                    </div>
                    <div class="form-group col-md-6">
                      <label for="nc_entregable_caso_uso">Entregable del Caso de Uso</label>
                      <textarea id="nc_entregable_caso_uso" class="form-control" rows="3"
                        placeholder="Entregables esperados..."></textarea>
                    </div>
                  </div>

                  <div class="form-row">
                    <div class="form-group col-md-6">
                      <label for="nc_dominio">Dominio</label>
                      <select id="nc_dominio" class="form-control" data-width="100%" required>
                        <option value="">Seleccione un dominio...</option>
                      </select>
                      <small id="nc_dominio_help" class="form-text text-muted">Selecciona el dominio del caso de
                        uso.</small>
                    </div>
                    <div class="form-group col-md-6">
                      <label for="nc_subdominio">Subdominio</label>
                      <select id="nc_subdominio" class="form-control" data-width="100%">
                        <option value=""></option>
                      </select>
                    </div>
                  </div>

                </div>


                <div class="form-section d-none" data-step="2">
                  <div class="form-grid">

                    <!-- Especialista -->
                    <div class="form-group">
                      <label for="nc_inp_especialista">Especialista</label>
                      <div class="emp-picker position-relative">
                        <input id="nc_inp_especialista" class="form-control"
                          placeholder="Escribe nombre, usuario o código" autocomplete="off">
                        <div id="sug_nc_inp_especialista" class="emp-suggest d-none"></div>
                      </div>
                      <input type="hidden" id="nc_cod_especialista">
                    </div>

                    <!-- Sponsor -->
                    <div class="form-group">
                      <label for="nc_inp_sponsor">Sponsor</label>
                      <div class="emp-picker position-relative">
                        <input id="nc_inp_sponsor" class="form-control" placeholder="Escribe nombre, usuario o código"
                          autocomplete="off">
                        <div id="sug_nc_inp_sponsor" class="emp-suggest d-none"></div>
                      </div>
                      <input type="hidden" id="nc_cod_sponsor">
                    </div>

                    <!-- Ingeniero -->
                    <div class="form-group">
                      <label for="nc_inp_ingeniero">Ingeniero Responsable</label>
                      <div class="emp-picker position-relative">
                        <input id="nc_inp_ingeniero" class="form-control" placeholder="Escribe nombre, usuario o código"
                          autocomplete="off">
                        <div id="sug_nc_inp_ingeniero" class="emp-suggest d-none"></div>
                      </div>
                      <input type="hidden" id="nc_cod_ingeniero">
                    </div>

                  </div>

                  <!-- Responsables Adicionales -->
                  <hr class="mt-1 mb-3" />
                  <div class="form-row align-items-end">
                    <div class="form-group col-md-5">
                      <h6 class="mb-2"><i class="simple-icon-people mr-2"></i>Estructura de Dominio</h6>
                      <div class="emp-picker position-relative">
                        <input id="nc_inp_responsable_adic" class="form-control" placeholder="Buscar Colaborador..."
                          autocomplete="off">
                        <div id="sug_nc_inp_responsable_adic" class="emp-suggest d-none"></div>
                      </div>
                      <input type="hidden" id="nc_cod_responsable_adic">
                    </div>

                    <div class="form-group col-md-4">

                      <label for="nc_rol_responsable_adic">Rol</label>
                      <select id="nc_rol_responsable_adic" class="form-control">
                        <option value="Custodio">Custodio</option>
                        <option value="Administrador">Administrador</option>
                        <option value="L&iacute;der de Dominio">L&iacute;der de Dominio</option>
                        <option value="Data Translator">Data Translator</option>
                      </select>

                    </div>

                    <div class="form-group col-md-3">
                      <button type="button" id="btnAgregarResponsable" class="btn btn-outline-primary btn-reveal"
                        title="Agregar Colaborador" aria-label="Agregar Colaborador">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                          stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg><span class="label">Agregar</span>
                      </button>
                    </div>
                  </div>
                  <h6 class="mb-1 mt-0" id="titulo-responsables-agregados-nuevo">Colaboradores agregados</h6>
                  <ul id="listaResponsables" class="list-group"></ul>
                </div>

                <!-- Sección: Fuentes de datos oficiales -->
                <div class="form-section d-none" data-step="3">
                  <div class="fuentes-row">
                    <div class="form-group fuente-autocomplete w-100">
                      <label for="nc_fuente_input">Fuente (Servidor.Base.Esquema.Tabla)</label>
                      <input type="text" id="nc_fuente_input" class="form-control"
                        placeholder="Escribe al menos 4 caracteres para buscar" autocomplete="off">
                      <div id="nc_fuente_sugerencias" class="emp-suggest d-none"></div>
                      <small class="form-text text-muted">Selecciona una sugerencia o usa Agregar con el valor
                        escrito.</small>
                    </div>
                    <div class="form-group btn-fuente-group">
                      <button type="button" id="btnAgregarFuente" class="btn btn-outline-primary" title="Agregar Fuente"
                        aria-label="Agregar Fuente">Agregar</button>
                    </div>
                  </div>
                  <div class="fuentes-row mt-2">

                    <div class="form-group auto-width-select">
                      <label for="nc_servidor">Servidor</label>
                      <select id="nc_servidor" class="form-control select-auto-fit" data-width="100%">
                        <option value="">Æ’?"</option>
                      </select>
                    </div>

                    <div class="form-group auto-width-select">
                      <label for="nc_base">Base</label>
                      <select id="nc_base" class="form-control select-auto-fit" data-width="100%" disabled>
                        <option value="">Æ’?"</option>
                      </select>
                    </div>

                    <div class="form-group auto-width-select">
                      <label for="nc_esquema">Esquema</label>
                      <select id="nc_esquema" class="form-control select-auto-fit" data-width="100%" disabled>
                        <option value="">Æ’?"</option>
                      </select>
                    </div>

                    <div class="form-group auto-width-select">
                      <label for="nc_tabla">Tabla</label>
                      <select id="nc_tabla" class="form-control select-auto-fit" disabled>
                        <option value="">Æ’?"</option>
                      </select>
                    </div>

                    <div class="form-group btn-fuente-group">
                      <button type="button" id="btnAgregarFuenteSelect" class="btn btn-outline-primary"
                        title="Agregar Fuente" aria-label="Agregar Fuente">Agregar</button>
                    </div>

                  </div>

                  <div class="form-group" style="grid-column: 1 / -1;">
                    <h6 class="mb-2" id="titulo-fuentes-agregadas-nuevo">Fuentes agregadas</h6>
                    <ul id="listaFuentes" class="list-group"></ul>
                  </div>
                </div>

                <!-- PASO 4: Términos -->
                <div class="form-section d-none" data-step="4">

                  <!-- Asignar Términos Existentes -->
                  <div class="form-group mb-2">
                    <label for="nc_asignar_terminos" class="mb-1">Asignar Términos Existentes</label>
                    <div class="form-row align-items-center">
                      <div class="col-10">
                        <select id="nc_asignar_terminos" class="form-control" multiple="multiple"
                          data-width="100%"></select>
                      </div>
                      <div class="col-1">
                        <button type="button" id="btnAsignarTerminos" class="btn btn-outline-primary btn-reveal"
                          title="Asignar Términos" aria-label="Asignar Términos">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg><span class="label">Asignar</span>
                        </button>
                      </div>
                    </div>
                    <small class="form-text text-magenta">Busca y selecciona uno o más términos del glosario para
                      vincularlos a este caso de uso.</small>
                  </div>

                  <div id="containerSinTerminos" class="terminos-empty text-center">
                    <h5 class="mb-2">Términos del Caso de Uso</h5>
                    <p id="textoSinTerminos" class="mb-3">AÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Âºn no hay Términos
                      asociados. Crea el primero para empezar a documentar tu glosario.</p>
                    <button type="button" class="btn btn-primary btn-create-term" id="btnAbrirModalAtributoPrincipal">
                      <i class="simple-icon-plus"></i>
                      <span>Crear nuevo Término</span>
                    </button>
                  </div>
                  <!-- Contenedor para la lista y b&amp;uacute;squeda de Términos -->
                  <div id="containerTerminosAsociados" class="mt-3">
                    <div class="terminos-toolbar mb-3">
                      <div class="terminos-toolbar__info">
                        <h6 class="mb-1" id="titulo-terminos-asociados-nuevo">Términos Asociados</h6>
                        <small class="d-block text-dark">Gestiona el glosario vinculado a este caso de uso.</small>
                      </div>
                      <div class="terminos-toolbar__actions">
                        <button type="button" id="btnAbrirModalAtributo" class="btn btn-primary btn-create-term"
                          title="Crear Nuevo T&amp;eacute;rmino" aria-label="Crear Nuevo T&amp;eacute;rmino">
                          <i class="simple-icon-plus"></i>
                          <span>Crear nuevo Término</span>
                        </button>
                        <div class="terminos-toolbar__search flex-grow-1">
                          <div class="search-box w-100 mb-0">
                            <i class="simple-icon-magnifier search-icon"></i>
                            <input type="text" id="buscarTermino" class="form-control form-control-sm"
                              placeholder="Buscar en la lista...">
                          </div>
                        </div>
                      </div>
                    </div>
                    <ul id="listaTerminosCasoUso" class="list-group"></ul>
                  </div>

                </div>

              </form>

            </div>



            <div class="modal-footer">

              <button id="btnReporteNuevo" type="button" class="btn btn-outline-secondary mr-auto">Ver reporte</button>

              <button id="btnPrevStep" type="button" class="btn btn-light d-none">Anterior</button>

              <button id="btnNextStep" type="button" class="btn btn-primary">Siguiente</button>

              <button id="btnGuardarCaso" type="button" class="btn btn-success d-none">

                <i class="simple-icon-cloud-upload"></i> Guardar

              </button>

            </div>



          </div>

        </div>

      </div>





      <style>
        /* Subrayado rojo (sin marco completo) para inputs/selects inválidos */

        .input-underline-invalid {

          border-color: transparent !important;

          border-bottom: 2px solid #dc3545 !important;

          border-radius: 0 !important;

          box-shadow: none !important;

        }



        .small-help.text-danger {

          color: #dc3545 !important;

        }



        #wizardSteps .nav-link {

          cursor: pointer;

        }



        #wizardSteps .nav-link.active {

          font-weight: 600;

        }



        /* Scroll interno para la lista de fuentes */

        #listaFuentes {

          max-height: 145px;

          /* ajusta el alto a tu gusto */

          overflow-y: auto;

          /* scroll vertical */

          overscroll-behavior: contain;


          -webkit-overflow-scrolling: touch;

          /* scroll suave en móviles */

          scrollbar-gutter: stable;

          /* evita saltos por barra de scroll (si el navegador lo soporta) */

        }





        .emp-suggest {

          position: absolute;

          top: calc(100% + 4px);

          left: 0;

          right: 0;

          z-index: 1051;

          background: #fff;

          border: 1px solid #e4e6ea;

          border-radius: .5rem;

          box-shadow: 0 8px 24px rgba(0, 0, 0, .08);

          max-height: 240px;

          overflow-y: auto;

        }



        .emp-suggest .item {

          padding: .6rem .8rem;

          cursor: pointer;

        }



        .emp-suggest .item:hover,

        .emp-suggest .item.active {

          background: #f4f6f8;

        }



        /* Modal: Nuevo caso de uso */

        #modalNuevoCaso .input-group>#nc_tabla {

          flex: 1 1 auto;

          /* que crezca dentro del input-group */

          width: 100% !important;

          min-width: 0;

          /* evita que el contenido limite el ancho */

        }



        /* (opcional) estética del botón pegado al select */

        #modalNuevoCaso .input-group-append .btn {

          border-top-left-radius: 0;

          border-bottom-left-radius: 0;

        }
      </style>





      <!-- Modal: Detalles del Caso de Uso -->

      <div class="modal fade modal-noscroll" id="modalDetallesCaso" tabindex="-1" role="dialog"
        aria-labelledby="modalDetallesCasoLabel" aria-hidden="true">

        <div class="modal-dialog modal-dialog-centered" role="document">

          <div class="modal-content">



            <div class="modal-header">

              <h5 class="modal-title" id="modalDetallesCasoLabel">Detalles del Caso de Uso</h5>

              <button type="button" class="close" data-dismiss="modal" aria-label="Cerrar">

                <span aria-hidden="true">&times;</span>

              </button>

            </div>



            <!-- Pasos -->

            <div class="px-4 pt-1 pb-0">

              <ul id="wizardStepsDetalle" class="nav nav-pills justify-content-between steps-pills mb-1">

                <li class="nav-item"><a class="nav-link active" data-goto="1">1. Información</a></li>

                <li class="nav-item"><a class="nav-link" data-goto="2">2. Responsables</a></li>

                <li class="nav-item"><a class="nav-link" data-goto="3">3. Fuentes</a></li>

                <li class="nav-item"><a class="nav-link" data-goto="4">4. Términos</a></li>

              </ul>

            </div>



            <div class="modal-body">

              <!-- ID oculto para updates -->

              <input type="hidden" id="detalle-id">



              <!-- PASO 1 -->

              <div class="detalle-section form-section" data-step="1">

                <div class="form-grid">

                  <div class="form-group btn-fuente-group">

                    <label for="detalle-descripcion">Descripción</label>

                    <input type="text" id="detalle-descripcion" class="form-control"
                      placeholder="Descripción del caso de uso">

                  </div>

                  <div class="form-group">

                    <label for="detalle-estado">Estado</label>

                    <select id="detalle-estado" class="form-control">

                      <option value="INGRESADO">INGRESADO</option>

                      <option value="EN PROCESO">EN PROCESO</option>

                      <option value="CERRADO">CERRADO</option>

                    </select>

                  </div>

                  <div class="form-group">

                    <label for="detalle-activo">Activo</label>

                    <select id="detalle-activo" class="form-control">

                      <option value="1">SÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â­</option>

                      <option value="0">No</option>

                    </select>

                  </div>

                </div>

                <div class="form-row">

                  <div class="form-group col-md-6">

                    <label for="detalle-detalle_caso_uso">Detalle del Caso de Uso</label>

                    <textarea id="detalle-detalle_caso_uso" class="form-control" rows="3"
                      placeholder="Detalles adicionales..."></textarea>

                  </div>

                  <div class="form-group col-md-6">

                    <label for="detalle-entregable_caso_uso">Entregable del Caso de Uso</label>

                    <textarea id="detalle-entregable_caso_uso" class="form-control" rows="3"
                      placeholder="Entregables esperados..."></textarea>

                  </div>

                </div>

                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="detalle-dominio-nombre">Dominio</label>
                    <select id="detalle-dominio-nombre" class="form-control" data-width="100%">
                      <option value="">Seleccione un dominio...</option>
                    </select>
                  </div>
                  <div class="form-group col-md-6">
                    <label for="detalle-subdominio">Subdominio</label>
                    <select id="detalle-subdominio" class="form-control" data-width="100%"
                      data-placeholder="Seleccione un subdominio...">
                      <option value=""></option>
                    </select>
                  </div>
                </div>

              </div>



              <!-- PASO 2: Responsables (con typeahead) -->

              <div class="detalle-section form-section d-none" data-step="2">

                <div class="form-grid">



                  <!-- Especialista -->

                  <div class="form-group" style="position:relative;">

                    <label for="det_inp_especialista">Especialista</label>

                    <input type="text" id="det_inp_especialista" class="form-control"
                      placeholder="Escribe nombre, usuario o código">

                    <div id="sug_det_inp_especialista" class="list-group emp-suggest d-none"></div>

                    <!-- Guarda el código seleccionado -->

                    <input type="hidden" id="detalle-cod-especialista">

                    <!-- Conserva (u oculta) el input original para compatibilidad si lo usabas en otros lados -->

                    <input type="hidden" id="detalle-especialista">

                  </div>



                  <!-- Sponsor -->

                  <div class="form-group" style="position:relative;">

                    <label for="det_inp_sponsor">Sponsor</label>

                    <input type="text" id="det_inp_sponsor" class="form-control"
                      placeholder="Escribe nombre, usuario o código">

                    <div id="sug_det_inp_sponsor" class="list-group emp-suggest d-none"></div>

                    <input type="hidden" id="detalle-cod-sponsor">

                    <input type="hidden" id="detalle-sponsor">

                  </div>



                  <!-- Ingeniero Responsable -->

                  <div class="form-group" style="position:relative;">

                    <label for="det_inp_ingeniero">Ingeniero Responsable</label>

                    <input type="text" id="det_inp_ingeniero" class="form-control"
                      placeholder="Escribe nombre, usuario o código">

                    <div id="sug_det_inp_ingeniero" class="list-group emp-suggest d-none"></div>

                    <input type="hidden" id="detalle-cod-ingeniero">

                    <input type="hidden" id="detalle-ingeniero">

                  </div>



                </div>



                <!-- Responsables Adicionales (Detalles) -->

                <hr class="mt-1 mb-3" />

                <div class="form-row align-items-end">

                  <div class="form-group col-md-5">

                    <h6 class="mb-2"><i class="simple-icon-people mr-2"></i>Estructura de Dominio</h6>

                    <div class="emp-picker position-relative">

                      <input id="det_inp_responsable_adic" class="form-control" placeholder="Buscar Colaborador..."
                        autocomplete="off">

                      <div id="sug_det_inp_responsable_adic" class="emp-suggest d-none"></div>

                    </div>

                    <input type="hidden" id="det_cod_responsable_adic">

                  </div>

                  <div class="form-group col-md-4">

                    <label for="det_rol_responsable_adic">Rol</label>
                    <select id="det_rol_responsable_adic" class="form-control">
                      <option value="L&iacute;der de Dominio">L&iacute;der de Dominio</option>
                      <option value="Custodio">Custodio</option>
                      <option value="Data Translator">Data Translator</option>
                      <option value="Especialista de Calidad">Especialista de Calidad</option>
                      <option value="Administrador">Administrador</option>
                    </select>

                  </div>

                  <div class="form-group col-md-3">

                    <button type="button" id="btnAgregarResponsableDetalle" class="btn btn-outline-primary btn-reveal"
                      title="Agregar Colaborador" aria-label="Agregar Colaborador">

                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">

                        <line x1="12" y1="5" x2="12" y2="19"></line>

                        <line x1="5" y1="12" x2="19" y2="12"></line>

                      </svg><span class="label">Agregar</span>

                    </button>

                  </div>

                </div>

                <h6 class="mb-1 mt-0" id="titulo-responsables-agregados-detalle">Colaboradores agregados</h6>

                <ul id="detalle-lista-responsables" class="list-group"></ul>

              </div>





              <!-- PASO 3 -->

              <div class="detalle-section form-section d-none" data-step="3">



                <div class="fuentes-row">

                  <div class="form-group fuente-autocomplete w-100">

                    <label for="detalle-fuente-input">Fuente (Servidor.Base.Esquema.Tabla)</label>

                    <input type="text" id="detalle-fuente-input" class="form-control"
                      placeholder="Escribe al menos 4 caracteres para buscar" autocomplete="off">

                    <div id="detalle-fuente-sugerencias" class="emp-suggest d-none"></div>
                    <small class="form-text text-muted">Selecciona una sugerencia o usa Agregar con el valor
                      escrito.</small>

                  </div>

                  <div class="form-group btn-fuente-group">

                    <button type="button" id="btnAgregarFuenteDetalle" class="btn btn-outline-primary"
                      title="Agregar Fuente" aria-label="Agregar Fuente">Agregar</button>

                  </div>

                </div>
                <div class="fuentes-row mt-2">

                  <div class="form-group auto-width-select">
                    <label for="detalle-servidor">Servidor</label>
                    <select id="detalle-servidor" class="form-control select-auto-fit" data-width="100%">
                      <option value="">ƒ?"</option>
                    </select>
                  </div>

                  <div class="form-group auto-width-select">
                    <label for="detalle-base">Base</label>
                    <select id="detalle-base" class="form-control select-auto-fit" data-width="100%" disabled>
                      <option value="">ƒ?"</option>
                    </select>
                  </div>

                  <div class="form-group auto-width-select">
                    <label for="detalle-esquema">Esquema</label>
                    <select id="detalle-esquema" class="form-control select-auto-fit" data-width="100%" disabled>
                      <option value="">ƒ?"</option>
                    </select>
                  </div>

                  <div class="form-group auto-width-select">
                    <label for="detalle-tabla">Tabla</label>
                    <select id="detalle-tabla" class="form-control select-auto-fit" disabled>
                      <option value="">ƒ?"</option>
                    </select>
                  </div>

                  <div class="form-group btn-fuente-group">
                    <button type="button" id="btnAgregarFuenteDetalleSelect" class="btn btn-outline-primary"
                      title="Agregar Fuente" aria-label="Agregar Fuente">Agregar</button>
                  </div>

                </div>



                <div class="form-group mb-0">

                  <h6 class="mb-2" id="titulo-fuentes-agregadas-detalle">Fuentes agregadas</h6>

                  <ul id="detalle-lista-fuentes" class="list-group"></ul>

                </div>

              </div>



              <!-- =============================================================== -->

              <!-- INICIO: Nueva sección para "Agregar Atributo" (Paso 4)          -->

              <!-- =============================================================== -->

              <div class="detalle-section form-section d-none" data-step="4">

                <!-- Asignar Términos Existentes (Detalles) -->

                <div class="form-group mb-2">

                  <label for="detalle_asignar_terminos" class="mb-1">Asignar Términos Existentes</label>

                  <div class="form-row align-items-center">

                    <div class="col-10">

                      <select id="detalle_asignar_terminos" class="form-control" multiple="multiple"
                        data-width="100%"></select>

                    </div>

                    <div class="col-1">

                      <button type="button" id="btnAsignarTerminosDetalle" class="btn btn-outline-primary btn-reveal"
                        title="Asignar Términos" aria-label="Asignar Términos">

                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                          stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">

                          <line x1="12" y1="5" x2="12" y2="19"></line>

                          <line x1="5" y1="12" x2="19" y2="12"></line>

                        </svg><span class="label">Asignar</span>

                      </button>

                    </div>

                  </div>

                  <small class="form-text text-magenta">Busca y selecciona uno o más términos del glosario para

                    vincularlos a este caso de uso.</small>

                </div>

                <div id="containerSinTerminosDetalle" class="terminos-empty text-center">
                  <h5 class="mb-2">Términos del Caso de Uso</h5>
                  <p id="textoSinTerminosDetalle" class="mb-3">AÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Âºn no hay
                    Términos asociados. Crea el primero para empezar a documentar tu glosario.</p>
                  <button type="button" class="btn btn-primary btn-create-term"
                    id="btnAbrirModalAtributoDetallePrincipal">
                    <i class="simple-icon-plus"></i>
                    <span>Crear nuevo Término</span>
                  </button>
                </div>
                <!-- Contenedor para la lista y b&amp;uacute;squeda de Términos -->
                <div id="containerTerminosAsociadosDetalle" class="mt-3">
                  <div class="terminos-toolbar mb-3">
                    <div class="terminos-toolbar__info">
                      <div class="d-flex align-items-center">
                        <h6 class="mb-1" id="titulo-terminos-asociados-detalle">Términos Asociados</h6>
                        <button type="button" id="btnDescargarTerminosDetalleExcel"
                          class="btn btn-link btn-sm p-0 ml-2 d-flex align-items-center"
                          title="Descargar términos asociados en Excel"
                          aria-label="Descargar términos asociados en Excel">
                          <i class="simple-icon-cloud-download text-success"
                            style="font-size: 23px;margin-bottom: 3px;"></i>
                        </button>
                      </div>
                      <small class="d-block text-dark">Consulta y administra el glosario asociado a este caso.</small>
                    </div>
                    <div class="terminos-toolbar__actions">
                      <button type="button" id="btnAbrirModalAtributoDetalle" class="btn btn-primary btn-create-term"
                        title="Crear Nuevo T&amp;eacute;rmino" aria-label="Crear Nuevo T&amp;eacute;rmino">
                        <i class="simple-icon-plus"></i>
                        <span>Crear nuevo Término</span>
                      </button>
                      <div class="terminos-toolbar__search flex-grow-1">
                        <div class="search-box w-100 mb-0">
                          <i class="simple-icon-magnifier search-icon"></i>
                          <input type="text" id="buscarTerminoDetalle" class="form-control form-control-sm"
                            placeholder="Buscar en la lista...">
                        </div>
                      </div>
                    </div>
                  </div>
                  <ul id="listaTerminosDetalle" class="list-group"></ul>
                </div>

              </div> <!-- Closing div for detalle-section -->

            </div>



            <div class="modal-footer">

              <button id="btnReporteDetalle" type="button" class="btn btn-outline-secondary mr-auto">Ver
                reporte</button>

              <button id="btnPrevStepDetalle" type="button" class="btn btn-light d-none">Anterior</button>

              <button id="btnNextStepDetalle" type="button" class="btn btn-primary">Siguiente</button>

              <button id="btnActualizarCaso" type="button" class="btn btn-success d-none">

                <i class="simple-icon-cloud-upload"></i> Guardar Cambios

              </button>

            </div>



          </div>

        </div>

      </div>



      <div class="modal fade" id="modalAtributo" role="dialog" aria-hidden="true">

        <div class="modal-dialog" role="document">

          <div class="modal-content">

            <div class="modal-header pb-3 pt-3">

              <h5 class="modal-title" id="exampleModalContentLabel">Agregar Termino</h5>

              <button type="button" class="close" data-dismiss="modal" aria-label="Close">

                <span aria-hidden="true">&times;</span>

              </button>

            </div>

            <div class="modal-body">

              <form class="attr-form">

                <input type="hidden" id="idatributo">

                <div class="attr-grid">

                  <div class="attr-card">
                    <div class="attr-card__header">
                      <span class="dot dot--pink"></span>
                      <strong>Identidad</strong>
                    </div>
                    <div class="form-group">
                      <label for="tipo" class="col-form-label">Tipo</label>
                      <select class="form-control" id="tipo">
                        <option value="TERMINO" selected>Término</option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label for="NOMBREA" class="col-form-label">Nombre del término</label>
                      <textarea class="form-control" id="NOMBREA" rows="2"
                        placeholder="Nombre corto y claro"></textarea>
                    </div>
                    <div class="form-group mb-0">
                      <label for="Descripcion" class="col-form-label">Descripción</label>
                      <textarea class="form-control" id="Descripcion" rows="3"
                        placeholder="Explica el significado funcional"></textarea>
                    </div>
                  </div>

                  <div class="attr-card">
                    <div class="attr-card__header">
                      <span class="dot dot--blue"></span>
                      <strong>Ubicación</strong>
                    </div>
                    <div class="form-group">
                      <label for="nombred" class="col-form-label">Dominio</label>
                      <select data-width="100%" class="form-control" aria-hidden="true" id="nombred">
                        <option label="ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ">
                          ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â </option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label for="nombresub" class="col-form-label">Subdominio</label>
                      <select data-width="100%" class="form-control" aria-hidden="true" id="nombresub">
                        <option label="ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ">
                          ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â </option>
                      </select>
                    </div>
                    <div class="form-group mb-0">
                      <label for="nombresubcategoria1"
                        class="col-form-label">SubcategorÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â­a</label>
                      <input disabled placeholder="EN REVISIÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“N"
                        type="text" class="form-control" id="nombresubcategoria1">
                    </div>
                  </div>

                  <div class="attr-card">
                    <div class="attr-card__header">
                      <span class="dot dot--green"></span>
                      <strong>CaracterÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â­sticas</strong>
                    </div>
                    <div class="form-group">
                      <label for="nombrecaract" class="col-form-label">Tipo de atributo</label>
                      <select data-width="100%" class="form-control select2-multiple select2-hidden-accessible"
                        multiple="multiple" aria-hidden="true" id="nombrecaract">
                        <option label="ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ">
                          ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â </option>
                      </select>
                    </div>
                    <div class="form-row">
                      <div class="form-group col-md-6">
                        <label for="datopersonal" class="col-form-label">Dato Personal</label>
                        <select data-width="100%" class="form-control" aria-hidden="true" id="datopersonal">
                          <option label="ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ">
                            ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â </option>
                          <option value="1">Si</option>
                          <option value="0">No</option>
                        </select>
                      </div>
                      <div class="form-group col-md-6">
                        <label for="goldenrecord" class="col-form-label">Golden Record</label>
                        <select data-width="100%" class="form-control" aria-hidden="true" id="goldenrecord">
                          <option label="ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ">
                            ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â </option>
                          <option value="1">Si</option>
                          <option value="0">No</option>
                        </select>
                      </div>
                    </div>
                    <div class="form-group mb-0">
                      <label for="prioridad_glosario" class="col-form-label">Prioridad glosario</label>
                      <input type="number" min="1" class="form-control" id="prioridad_glosario"
                        placeholder="1, 2, 3...">
                    </div>
                  </div>

                  <div class="attr-card">
                    <div class="attr-card__header">
                      <span class="dot dot--orange"></span>
                      <strong>Catálogos</strong>
                    </div>
                    <div class="form-group mb-0">
                      <label for="catalogos" class="col-form-label">Catálogos Asociados</label>
                      <select data-width="100%" class="form-control select2-multiple select2-hidden-accessible"
                        multiple="multiple" aria-hidden="true" id="catalogos">
                        <option label="ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ">
                          ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â </option>
                      </select>
                    </div>
                  </div>

                </div>

              </form>
























            </div>

            <div class="modal-footer">



              <button type="button" id="btnagregaratributo" class="btn btn-primary ">Guardar</button>

            </div>

          </div>

        </div>

      </div>







      <style>
        /* Altura/ancho idénticos */

        :root {

          --modal-width: 900px;

          --modal-height: 82vh;

          --accent: #d1006c;

        }



        .modal-noscroll .modal-dialog {

          max-width: var(--modal-width);

        }



        .modal-noscroll .modal-content {

          height: var(--modal-height);

          display: flex;

          flex-direction: column;

        }



        .modal-noscroll .modal-header,

        .modal-noscroll .modal-footer {

          flex: 0 0 auto;

        }



        .modal-noscroll .modal-body {

          flex: 1 1 auto;

          overflow-y: auto;

          -webkit-overflow-scrolling: touch;

          overscroll-behavior: contain;

        }



        /* Pasos en pÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â­ldoras (como el de nuevo) */

        .steps-pills .nav-link {

          border-radius: 9999px;

          padding: .5rem 1rem;

          background: #f4f5f7;

          color: #333;

        }



        .steps-pills .nav-link.active {

          background: var(--accent);

          color: #fff;

          box-shadow: 0 4px 12px rgba(209, 0, 108, .25);

          font-weight: 600;

        }



        /* Tarjetas de sección con icono */

        .form-section {

          background: #f7f8fa;

          border: 1px solid #eef0f2;

          border-radius: 16px;

          padding: 18px 20px;

          margin: 0 0 16px;

        }

        /* Menos espacio entre tabs y contenido del wizard */
        #modalDetallesCaso .modal-body {
          padding-top: 4px;
        }



        /* Paso 4 (Fuentes) debe aprovechar todo el alto del modal */

        #modalDetallesCaso .modal-body {

          display: flex;

          flex-direction: column;

        }



        #modalDetallesCaso .modal-body>.detalle-section.form-section {

          flex: 0 0 auto;

        }



        #modalDetallesCaso .modal-body>.detalle-section.form-section[data-step="3"] {

          flex: 1 1 auto;

          display: flex;

          flex-direction: column;

          min-height: 0;

        }



        #modalDetallesCaso .modal-body>.detalle-section.form-section[data-step="3"] .form-row {

          flex: 0 0 auto;

        }



        #modalDetallesCaso .modal-body>.detalle-section.form-section[data-step="3"] .form-group.mb-0 {

          flex: 1 1 auto;

          display: flex;

          flex-direction: column;

          min-height: 0;

        }



        #modalDetallesCaso .modal-content {

          position: relative;

          overflow: visible;

        }



        #detalle-lista-fuentes {

          flex: 1 1 auto;

          overflow: auto;

        }



        .form-section h6 {

          font-weight: 600;

          display: flex;

          align-items: center;

          margin-bottom: 12px;

        }



        .form-section h6 i {

          font-size: 1.05rem;

        }



        /* Grid de campos */

        .form-grid {

          display: grid;

          grid-template-columns: repeat(3, 1fr);

          grid-gap: 16px;

        }



        @media (max-width: 992px) {

          .form-grid {

            grid-template-columns: 1fr 1fr;

          }

        }



        @media (max-width: 576px) {

          .form-grid {

            grid-template-columns: 1fr;

          }

        }



        /* Lista de fuentes */

        #detalle-lista-fuentes {

          max-height: 100%;

          overflow-y: auto;

          overscroll-behavior: contain;

          -webkit-overflow-scrolling: touch;

        }
      </style>



      <style>
        .is-invalid,

        .input-underline-invalid {

          border-color: #D2006E !important;

          /* Color magenta para el borde */

        }



        .is-invalid:focus,

        .input-underline-invalid:focus {

          box-shadow: 0 0 0 0.2rem rgba(210, 0, 110, 0.25) !important;

          /* Sombra de foco magenta */

        }



        .invalid-feedback,

        .text-danger {

          color: #D2006E !important;

          /* Color del texto de error */

        }

        /* RediseÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â±o modal nuevo término */
        .attr-form {
          margin-top: 4px;
        }

        .attr-hero {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(90deg, #fef2f8 0%, #eff6ff 100%);
          border: 1px solid #f3d9ea;
          padding: 14px 16px;
          border-radius: 12px;
          margin-bottom: 14px;
          gap: 12px;
        }

        .attr-id {
          min-width: 220px;
        }

        .attr-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 12px;
        }

        .attr-card {
          background: #fff;
          border: 1px solid #eef0f3;
          border-radius: 12px;
          padding: 14px;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
        }

        .attr-card__header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
          font-weight: 700;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          display: inline-block;
        }

        .dot--pink {
          background: #d1006c;
        }

        .dot--blue {
          background: #2563eb;
        }

        .dot--green {
          background: #0f766e;
        }

        .dot--orange {
          background: #f59e0b;
        }

        .fuente-icons i {
          font-size: 0.95rem;
          opacity: 0.9;
        }

        /* Modal término: altura más compacta */
        #modalAtributo .modal-dialog {
          max-width: 960px;
        }

        #modalAtributo .modal-content {
          max-height: 78vh;
          display: flex;
          flex-direction: column;
        }

        #modalAtributo .modal-body {
          flex: 1 1 auto;
          overflow-y: auto;
        }
      </style>



      <script>

        (function () {

          const baseTitle = 'Detalles del Caso de Uso';

          function setDetalleTitle() {

            const desc = (document.getElementById('detalle-descripcion')?.value || '').trim();

            document.getElementById('modalDetallesCasoLabel').textContent =

              desc ? `${baseTitle} ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ${desc}` : baseTitle;

          }

          $('#modalDetallesCaso').on('shown.bs.modal', setDetalleTitle);

          // Si cambian la descripción dentro del modal, reflejarlo en la cabecera

          $(document).on('input', '#detalle-descripcion', setDetalleTitle);

        })();

      </script>



      <script src="js/Linaje/config/config.js"></script>

      <script src="js/Linaje/modules/api.js"></script>

      <script src="js/CasodeUso/apiService.js"></script>

      <script src="js/CasodeUso/sharepointUtils.js"></script>

      <script src="js/CasodeUso/empleadoUtils.js"></script>

      <script src="js/CasodeUso/fuentesUtils.js"></script>
      <script src="js/CasodeUso/reportTemplate.js"></script>

      <script src="js/CasodeUso/wizardNuevoCaso.js"></script>

      <script src="js/CasodeUso/wizardDetalles.js"></script>

      <script src="js/AMC/seguimientoManager.js"></script>

      <script src="js/CasodeUso/main.js"></script>





      <!-- Estilos para el Modal de Confirmación -->

      <style>
        #confirmDeleteModal .modal-content {

          border-radius: 12px;

          border: none;

          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);

          overflow: hidden;

          /* Para que el borde del header no se salga */

        }



        #confirmDeleteModal .modal-header {

          background-color: #f8f9fa;

          border-bottom: 1px solid #dee2e6;

          padding: 1rem 1.5rem;

          display: flex;

          align-items: center;

        }

        .cu-group {
          margin-bottom: 24px;
        }

        .cu-group__header {
          display: flex;
          align-items: baseline;
          gap: 10px;
          margin-bottom: 10px;
        }

        .cu-group__title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #111827;
        }

        .cu-group__count {
          color: #6b7280;
          font-size: 0.9rem;
        }

        .cu-group__grid {
          gap: 12px;
        }

        /* Subdominios en filas completas */
        .cu-group {
          grid-column: 1 / -1;
          width: 100%;
        }

        /* Marca de selección para dominio activo */
        .dominio-card--selected {
          border-color: #16a34a;
          box-shadow: 0 10px 24px rgba(22, 163, 74, 0.26);
        }

        .subdom-inline {
          grid-column: 1 / -1;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 14px;
          margin-top: 8px;
          box-shadow: 0 8px 22px rgba(15, 23, 42, 0.06);
        }

        .subdom-casos-inline {
          grid-column: 1 / -1;
          background: #f9f8ff;
          border: 1px solid #e4ddff;
          border-radius: 12px;
          padding: 12px;
          margin-top: 6px;
          box-shadow: 0 8px 22px rgba(24, 24, 60, 0.08);
        }

        .subdom-card {
          border-color: #0ea5e9;
          box-shadow: 0 10px 24px rgba(14, 165, 233, 0.18);
        }

        .caso-card {
          border-color: #8b5cf6;
          box-shadow: 0 10px 24px rgba(139, 92, 246, 0.18);
        }

        .cu-group__eyebrow {
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-size: 0.72rem;
          color: #64748b;
        }

        .cu-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          border-radius: 999px;
          background: #eef2ff;
          color: #312e81;
          font-weight: 600;
          font-size: 0.85rem;
        }

        .cu-chip i {
          font-size: 1rem;
        }





        #confirmDeleteModal .modal-title {

          font-weight: 600;

          font-size: 1.1rem;

          color: #343a40;

          display: flex;

          align-items: center;

          gap: 0.75rem;

          /* Espacio entre el ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â­cono y el texto */

        }



        /* Estilo para el ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â­cono de advertencia */

        #confirmDeleteModal .modal-title .simple-icon-shield {

          color: #D2006E;

          /* Color magenta de la suite */

          font-size: 1.5rem;

        }



        #confirmDeleteModal .modal-body {

          padding: 2rem 1.5rem;

          font-size: 1.05rem;

          text-align: center;

          color: #495057;

          line-height: 1.6;

        }



        #confirmDeleteModal .modal-footer {

          background-color: #f8f9fa;

          border-top: 1px solid #dee2e6;

          padding: 0.75rem 1.5rem;

          justify-content: center;

          /* Centrar los botones */

          gap: 0.75rem;

          /* Espacio entre botones */

        }



        #confirmDeleteModal .modal-footer .btn {

          min-width: 100px;

          font-weight: 600;

          border-radius: 8px;

          padding: 0.5rem 1rem;

          transition: all 0.2s ease-in-out;

        }



        #confirmDeleteModal .modal-footer .btn-secondary {

          background-color: #6c757d;

          border-color: #6c757d;

        }



        #confirmDeleteModal .modal-footer .btn-secondary:hover {

          background-color: #5a6268;

          border-color: #545b62;

        }



        #confirmDeleteModal .modal-footer .btn-danger {

          background-color: #D2006E;

          /* Color magenta de la suite */

          border-color: #D2006E;

        }



        #confirmDeleteModal .modal-footer .btn-danger:hover {

          background-color: #b4005c;

          /* Un tono más oscuro para el hover */

          border-color: #a00052;

          transform: translateY(-2px);

          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

        }
      </style>



      <!-- Modal de Confirmación Genérico con DiseÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â±o Mejorado -->

      <div class="modal fade" id="confirmDeleteModal" tabindex="-1" role="dialog"
        aria-labelledby="confirmDeleteModalLabel" aria-hidden="true">

        <div class="modal-dialog modal-dialog-centered" role="document">

          <div class="modal-content">

            <div class="modal-header">

              <h5 class="modal-title" id="confirmDeleteModalLabel">

                <i class="simple-icon-shield"></i>

                Confirmar Acción

              </h5>

              <button type="button" class="close" data-dismiss="modal" aria-label="Close">

                <span aria-hidden="true">&times;</span>

              </button>

            </div>

            <div class="modal-body" id="confirmDeleteModalBody">

              ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¿Estás seguro de que quieres realizar esta acción?

            </div>

            <div class="modal-footer">

              <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>

              <button type="button" class="btn btn-danger" id="btnConfirmDelete">Eliminar</button>

            </div>

          </div>

        </div>

      </div>



    </body>



    <script>

      document.getElementById("btnActualizarCaso").addEventListener("click", async () => {

        try {

          const id = Number(document.getElementById("detalle-id").value);

          if (!id) { alert("El ID del caso de uso es obligatorio."); return; }



          // --- Helpers

          const nowIso = () => new Date().toISOString().split('.')[0]; // "YYYY-MM-DDTHH:mm:ss"

          const uniq = (arr) => Array.from(new Set(arr));

          async function fetchJSON(url, method, bodyObj) {

            const resp = await fetch(url, {

              method,

              headers: { accept: "application/json", "Content-Type": "application/json" },

              body: JSON.stringify(bodyObj)

            });

            if (!resp.ok) {

              const txt = await resp.text().catch(() => "");

              throw new Error(`${method} ${url}: ${resp.status} ${resp.statusText} ${txt}`);

            }

            return resp;

          }



          // --- Usuario actual

          let usuarioCode = null;

          try { usuarioCode = await getEmployeeCodeByUser(window.current_user); } catch (e) { console.warn("getEmployeeCodeByUser falló:", e); }

          usuarioCode = Number(usuarioCode) || null;

          if (!usuarioCode) { alert("No se pudo determinar el usuario actual."); return; }



          // --- Campos del formulario

          const descripcion = (document.getElementById("detalle-descripcion").value || "").trim();

          const estado = (document.getElementById("detalle-estado").value || "").trim() || "ACTIVO";

          const activo = Number(document.getElementById("detalle-activo").value);

          const especialista = Number(document.getElementById("detalle-cod-especialista")?.value ||

            document.getElementById("detalle-especialista")?.value || '') || null;



          const sponsor = Number(document.getElementById("detalle-cod-sponsor")?.value ||

            document.getElementById("detalle-sponsor")?.value || '') || null;



          const ingeniero = Number(document.getElementById("detalle-cod-ingeniero")?.value ||

            document.getElementById("detalle-ingeniero")?.value || '') || null;



          // (opc) Validación de longitud de descripción

          if (descripcion.length > 400) {

            alert("La descripción no puede exceder 400 caracteres.");

            return;

          }



          // --- UPDATE del caso

          const fechaModificacion = nowIso();

          const payloadCaso = {

            tabla: "PROCESOS_BI.DBO.t_casos_uso_analitica",

            datos: {

              DESCRIPCION_CASO_USO: descripcion,

              ESTADO_CASO_USO: estado,

              SN_ACTIVO: activo,

              COD_ESPECIALISTA: especialista,

              COD_SPONSOR: sponsor,

              COD_INGENIERO_RESPONSABLE: ingeniero,

              FEC_MODIFICACION: fechaModificacion,

              USUARIO_MODIFICACION: usuarioCode

            },

            condicion: `ID_CASO_USO = ${id}`

          };

          await fetchJSON("http://gobinfoana01-2:8510/update", "PUT", payloadCaso);



          // --- INSERT de fuentes NUEVAS (UI vs BD)

          const listaUI = Array.isArray(window.__fuentesDetalleEdit) ? window.__fuentesDetalleEdit : [];

          const existentesMap = window.__fuentesDetalleMap || {}; // { clave : id_fuente }



          const clavesUI = uniq(listaUI.map(v => (typeof v === "string" ? v.trim() : "")).filter(Boolean));

          const clavesNuevas = clavesUI.filter(k => !existentesMap[k]);



          // Validar longitud de claves nuevas

          const largas = clavesNuevas.find(k => k.length > 255);

          if (largas) {

            alert(`La clave de fuente supera 255 caracteres:\n${largas.substring(0, 120)}ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¦`);

            return;

          }



          if (clavesNuevas.length) {

            await Promise.all(clavesNuevas.map(async (CLAVE_FUENTE) => {

              const body = {

                tabla: "PROCESOS_BI.DBO.t_casos_uso_fuentes",

                datos: {

                  ID_CASO_USO: id,

                  CLAVE_FUENTE,

                  SN_ACTIVO: 1,

                  USUARIO_CREACION: usuarioCode

                }

              };

              const resp = await fetch("http://gobinfoana01-2:8510/insert", {

                method: "POST",

                headers: { accept: "application/json", "Content-Type": "application/json" },

                body: JSON.stringify(body)

              });

              if (!resp.ok) {

                const errTxt = await resp.text().catch(() => "");

                throw new Error(`Insert fuente "${CLAVE_FUENTE}": ${resp.status} ${resp.statusText} ${errTxt}`);

              }

            }));



            // invalida cache para próxima apertura

            if (window.__fuentesCacheByCaso instanceof Map) window.__fuentesCacheByCaso.delete(id);

          }



          const toDeactivate = Array.from(new Set(

            (window.__fuentesDetalleToDeactivate || []).map(Number).filter(Boolean)

          ));



          if (toDeactivate.length) {

            const fechaMod = nowIso();

            await Promise.all(toDeactivate.map(async (idFuente) => {

              const payload = {

                tabla: "PROCESOS_BI.DBO.t_casos_uso_fuentes",

                datos: {

                  SN_ACTIVO: 0,

                  FEC_MODIFICACION: fechaMod,

                  USUARIO_MODIFICACION: usuarioCode

                },

                condicion: `ID_FUENTE = ${idFuente}`

              };

              const resp = await fetch("http://gobinfoana01-2:8510/update", {

                method: "PUT",

                headers: { accept: "application/json", "Content-Type": "application/json" },

                body: JSON.stringify(payload)

              });

              if (!resp.ok) {

                const txt = await resp.text().catch(() => "");

                throw new Error(`Desactivar fuente ${idFuente}: ${resp.status} ${resp.statusText} ${txt}`);

              }

            }));



            // limpia bucket y cache

            window.__fuentesDetalleToDeactivate = [];

            if (window.__fuentesCacheByCaso instanceof Map) window.__fuentesCacheByCaso.delete(id);

          }


          try { await refrescarCasosUso(); } catch { }



        } catch (error) {

          console.error("Error al actualizar el caso de uso:", error);

          alert("Error al actualizar el caso de uso. " + (error?.message || ""));

        }

      });



      const $modal = $('#modalDetallesCaso');

      $modal.on('show.bs.modal', async () => {

        if (window.DetallesCasoWizard && typeof DetallesCasoWizard.goTo === 'function') {
          DetallesCasoWizard.goTo(1); // Reset wizard
        }

        window.__fuentesDetalleToDeactivate = [];



        try {

          const empleados = await EmpleadoUtils.loadEmpleadosOnce();



          // Conectar buscadores

          EmpleadoUtils.attachEmpleadoTypeahead('det_inp_especialista', 'sug_det_inp_especialista', 'detalle-cod-especialista', 'det_especialista_nombre');

          EmpleadoUtils.attachEmpleadoTypeahead('det_inp_sponsor', 'sug_det_inp_sponsor', 'detalle-cod-sponsor', 'det_sponsor_nombre');

          EmpleadoUtils.attachEmpleadoTypeahead('det_inp_ingeniero', 'sug_det_inp_ingeniero', 'detalle-cod-ingeniero', 'det_ingeniero_nombre');



          // Copiar códigos de inputs originales (compatibilidad) a los nuevos hidden

          $('#detalle-cod-especialista').val($('#detalle-especialista').val() || '');

          $('#detalle-cod-sponsor').val($('#detalle-sponsor').val() || '');

          $('#detalle-cod-ingeniero').val($('#detalle-ingeniero').val() || '');



          // Pre-llenar los inputs visibles con el nombre a partir del código

          prefillByCode($('#detalle-cod-especialista').val(), empleados, 'det_inp_especialista', 'det_especialista_nombre');

          prefillByCode($('#detalle-cod-sponsor').val(), empleados, 'det_inp_sponsor', 'det_sponsor_nombre');

          prefillByCode($('#detalle-cod-ingeniero').val(), empleados, 'det_inp_ingeniero', 'det_ingeniero_nombre');

        } catch (e) {

          console.error("Error al configurar el typeahead de detalles:", e);

        }

      });

    </script>



    <script>



      const $id = (x) => document.getElementById(x);

      const gv = (x) => ($id(x)?.value ?? '').trim();

      const DOMINIO_QS = Number(new URLSearchParams(location.search).get("id_dominio") || 0);

      function toSqlDateTime(val) { if (!val) return null; const p = val.split('T'); return p.length === 2 ? (p[0] + ' ' + p[1] + ':00') : val; }



      // === Dominios Typeahead ===

      let _dominiosCache = null;

      async function cargarDominios() {

        if (_dominiosCache) return _dominiosCache;

        const resp = await fetch("http://gobinfoana01-2:8510/query", {

          method: "POST",

          headers: { "accept": "application/json", "Content-Type": "application/json" },

          body: JSON.stringify({

            campos: "ID_DOMINIO AS id, codigo_dominio AS codigo, descripcion_dominio AS descripcion",

            origen: "PROCESOS_BI.DBO.T_MAPA_DOMINIOS",

            condicion: "1=1"

          })

        });

        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

        const data = await resp.json();

        const arr = Array.isArray(data) ? data : [data];

        _dominiosCache = arr.filter(d => d && d.id != null).map(d => ({

          id: d.id, codigo: (d.codigo ?? "").toString(), descripcion: (d.descripcion ?? "").toString()

        }));

        return _dominiosCache;

      }

      (function hideFilterWhenUrlParam() {
        const wrapper = document.getElementById('cu-filter-wrapper');
        if (!wrapper) return;
        const search = (window.location.search || '').toLowerCase();
        console.log("[cu-filter] location.search:", search);
        const shouldHide = search.startsWith('?id_dominio=') || search.includes('&id_dominio=');
        console.log("[cu-filter] shouldHide?", shouldHide);
        if (shouldHide) {
          // Remueve por completo para evitar estilos o scripts que lo vuelvan a mostrar
          const parent = wrapper.parentNode;
          if (parent) parent.removeChild(wrapper);
          console.log("[cu-filter] filtro eliminado del DOM por id_dominio en query");
        } else {
          wrapper.style.display = '';
          wrapper.classList.remove('d-none');
          wrapper.removeAttribute('aria-hidden');
          console.log("[cu-filter] mostrando filtro (sin id_dominio en query)");
        }
      })();

      // === Tabla y contador ===
      function renderTablaCasosUso(rows) {
        const tbody = $id("tbodyCasosUso");
        if (!tbody) { console.warn('Falta <tbody id="tbodyCasosUso">'); return; }
        tbody.innerHTML = (rows || []).map(r => `
          <tr>
            <td>${r.ID_CASO_USO ?? ""}</td>
            <td>${r.DESCRIPCION_CASO_USO ?? ""}</td>
            <td>${r.ESTADO_CASO_USO ?? ""}</td>
            <td>${(r.SN_ACTIVO == 1 || r.SN_ACTIVO === true) ? "SÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â­" : "No"}</td>
            <td>${r.FEC_CREACION ?? ""}</td>
            <td>${r.USUARIO_CREACION ?? ""}</td>
          </tr>
        `).join("");
      }

      async function cargarTablaCasosUso(dominioId = DOMINIO_QS) {
        if (!dominioId) { renderTablaCasosUso([]); return; }
        const resp = await fetch("http://gobinfoana01-2:8510/query", {
          method: "POST",
          headers: { "accept": "application/json", "Content-Type": "application/json" },
          body: JSON.stringify({
            campos: "ID_CASO_USO, DESCRIPCION_CASO_USO, ID_DOMINIO, COD_ESPECIALISTA, COD_SPONSOR, COD_INGENIERO_RESPONSABLE, ESTADO_CASO_USO, SN_ACTIVO, FEC_CREACION, USUARIO_CREACION",
            origen: "PROCESOS_BI.DBO.T_CASOS_USO_ANALITICA",
            condicion: "ID_DOMINIO = " + Number(dominioId)
          })
        });

        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();
        const rows = Array.isArray(data) ? data : [data];
        renderTablaCasosUso(rows);
      }

      async function actualizarContador(dominioId = DOMINIO_QS) {
        const badge = $id("n-casos");
        if (!badge || !dominioId) return;
        const resp = await fetch("http://gobinfoana01-2:8510/query", {
          method: "POST",
          headers: { "accept": "application/json", "Content-Type": "application/json" },
          body: JSON.stringify({
            campos: "COUNT(*) AS total",
            origen: "PROCESOS_BI.DBO.T_CASOS_USO_ANALITICA",
            condicion: "ID_DOMINIO = " + Number(dominioId)
          })
        });

        if (!resp.ok) return;
        const data = await resp.json();
        const total = (Array.isArray(data) ? data[0]?.total : data?.total) ?? 0;
        badge.textContent = total;
      }

    </script>

    <script>
      function computeCaseScore(row, fuentesCount = 0, schema = window.CASE_SCORE_SCHEMA) {
        let score = 0;
        const breakdown = [];

        for (const sec of schema.sections) {
          if (sec.items) {
            for (const it of sec.items) {
              if (typeof it.test === 'function' && it.test(row)) {
                score += it.weight;
                breakdown.push({ section: sec.label, item: it.label, gained: it.weight });
              } else {
                breakdown.push({ section: sec.label, item: it.label, gained: 0 });
              }
            }
          } else if (sec.key === 'fuentes' && typeof sec.rule === 'function') {
            // La rule retorna porcentaje dentro de la sección
            const gained = Math.min(sec.weight, sec.rule({ count: fuentesCount }));
            score += gained;
            breakdown.push({ section: sec.label, item: 'Cantidad', gained });
          }
        }
        // Normaliza por si tus pesos no suman 100 exacto (opcional)
        return { score: Math.round(score), breakdown };
      }
    </script>

    <script>
      // IIFE para no contaminar el scope global
      (async function () {
        try {
          // 1. Obtener el id_dominio de la URL
          const params = new URLSearchParams(window.location.search);
          const idDominio = params.get("id_dominio");

          // 2. Si no hay id, no hacer nada
          if (!idDominio) return;

          // 3. Obtener la información del dominio para conseguir su nombre
          const dominioActual = await searchDominios("id_dominio", idDominio, "Number");

          // Verificamos que el objeto devuelto exista
          if (!dominioActual) {
            console.warn("No se encontró el dominio en la base de datos.");
            return;
          }
          const nombreDominio = dominioActual.descripcion_dominio || "Sin Dominio";

          // 4. Actualizar los href de los enlaces del breadcrumb
          document.querySelectorAll('#secciones-casos a').forEach(enlace => {
            if (enlace.id !== 'a-casos') { // No modificar el enlace actual
              const urlBase = enlace.getAttribute('href');
              if (urlBase && urlBase !== '#') {
                if (enlace.id === 'a-terminos') {
                  // Para "Términos y Atributos", usamos el parámetro 'dominio' con el nombre
                  enlace.setAttribute('href', `${urlBase}?dominio=${encodeURIComponent(nombreDominio)}`);
                } else {
                  // Para los demás, usamos 'id_dominio'
                  enlace.setAttribute('href', `${urlBase}?id_dominio=${idDominio}`);
                }
              }
            }
          });
        } catch (error) {
          console.error("Error al actualizar los enlaces del breadcrumb:", error);
        }
      })();
    </script>

    <script>
      function updateSeguimientoOffset(context = 'default') {
        const $card = $('.seguimiento-card');
        if (!$card.length) return;
        const el = $card[0];
        const offsetAttr = context === 'modal'
          ? ($card.attr('data-modal-offset') || $card.attr('data-offset'))
          : $card.attr('data-offset');
        const offsetValue = parseInt(offsetAttr, 10);
        if (!Number.isNaN(offsetValue)) {
          el.style.setProperty('--seguimiento-toggle-offset', `${offsetValue}px`);
        } else {
          el.style.removeProperty('--seguimiento-toggle-offset');
        }

        if (context === 'modal') {
          applySeguimientoTransformVar(el, '--seguimiento-modal-open-transform', $card.attr('data-modal-open-position'));
          applySeguimientoTransformVar(el, '--seguimiento-modal-closed-transform', $card.attr('data-modal-closed-position'));
          centerSeguimientoVertically($card);
          ensureSeguimientoResizeObserver($card);
        } else {
          el.style.removeProperty('--seguimiento-modal-open-transform');
          el.style.removeProperty('--seguimiento-modal-closed-transform');
          el.style.removeProperty('--seguimiento-modal-top');
        }
      }

      function centerSeguimientoVertically($card) {
        if (!$card || !$card.length) return;
        const el = $card[0];
        const wasHidden = $card.css('display') === 'none';
        const prevVisibility = $card.css('visibility');
        if (wasHidden) {
          $card.css({ visibility: 'hidden', display: 'block' });
        }
        const height = $card.outerHeight() || 0;
        if (height) {
          el.style.setProperty('--seguimiento-modal-top', `calc(50% - ${height / 2}px)`);
        } else {
          el.style.removeProperty('--seguimiento-modal-top');
        }
        if (wasHidden) {
          $card.css({ display: 'none', visibility: prevVisibility });
        }
      }


      function ensureSeguimientoResizeObserver($card) {
        if (!$card || !$card.length || typeof ResizeObserver !== 'function') return;
        const el = $card[0];
        if (el.__seguimientoResizeObserver) return;
        const observer = new ResizeObserver(() => centerSeguimientoVertically($card));
        observer.observe(el);
        el.__seguimientoResizeObserver = observer;
      }



      function applySeguimientoTransformVar(element, variableName, rawValue) {

        if (!rawValue) {

          element.style.removeProperty(variableName);

          return;

        }

        element.style.setProperty(variableName, normalizeSeguimientoTransform(rawValue));

      }



      function normalizeSeguimientoTransform(value) {

        const trimmed = String(value).trim();

        if (!trimmed) return '';



        const numeric = /^-?\d+(\.\d+)?$/;

        const numericWithUnit = /^-?\d+(\.\d+)?(px|rem|em|%)$/i;



        if (numeric.test(trimmed)) {

          return `translateX(${trimmed}px)`;

        }

        if (numericWithUnit.test(trimmed)) {

          return `translateX(${trimmed})`;

        }

        if (/^translate[xyz]?\(/i.test(trimmed)) {

          return trimmed;

        }

        if (trimmed.startsWith('calc') || trimmed.startsWith('var')) {

          return `translateX(${trimmed})`;

        }

        return `translateX(${trimmed})`;

      }



      $(document).ready(function () {

        AdministracionAtributos();

        window.__autoOpenSeguimiento = window.__autoOpenSeguimiento || false;

        updateSeguimientoOffset();

        $(document).on('mouseleave', '.seguimiento-card-button', function () {

          $(this).tooltip('hide');

        });

      });



      // Script para el ciclo de vida del seguimiento en el modal de NUEVO caso de uso

      $(document).ready(function () {

        // Al cerrar el modal, nos aseguramos de que el panel de seguimiento se oculte

        // y vuelva a su contenedor original para que otros modales puedan usarlo.

        $('#modalNuevoCaso').on('hidden.bs.modal', function () {

          $('.seguimiento-card-button').tooltip('hide');

          const $card = $('.seguimiento-card');

          $card.appendTo('main')

            .removeClass('seguimiento-card--modal shown')

            .fadeOut();

          updateSeguimientoOffset();

        });

      });



      // Script para mostrar/ocultar la tarjeta de seguimiento con el modal de DETALLES de caso de uso

      $(document).ready(function () {

        $('#modalDetallesCaso').on('shown.bs.modal', function () {

          $('.seguimiento-card-button').tooltip('hide');

          const $card = $('.seguimiento-card');

          updateSeguimientoOffset('modal');

          $card.appendTo($(this).find('.modal-content'))

            .addClass('seguimiento-card--modal')

            .fadeIn(() => centerSeguimientoVertically($card));



          const idCasoUso = $('#detalle-id').val();

          const nombreCasoUso = ($('#detalle-descripcion').val() || '').trim();

          const dominioCasoUso = $('#detalle-dominio-nombre').val() || null;



          SeguimientoManager.init({

            parentId: idCasoUso,

            parentField: "id_oga",

            currentUser: window.current_user,
            origen: "CDU",

            empleados: window.empleados || {},

            folderUrl: `${BASE_URL}docs/SeguimientoCasosUso`,

            parentName: nombreCasoUso || null,

            parentDomainId: dominioCasoUso || null

          });



          if (window.__autoOpenSeguimiento) {

            $card.addClass('shown');

            $card.find('.seguimiento-card-button').addClass('text-primary');

            window.__autoOpenSeguimiento = false;

          }

        });



        $('#modalDetallesCaso').on('hidden.bs.modal', function () {

          $('.seguimiento-card-button').tooltip('hide');

          // Al cerrar, devuelve la tarjeta a <main> y la oculta.

          const $card = $('.seguimiento-card');

          $card.appendTo('main')

            .removeClass('seguimiento-card--modal shown')

            .fadeOut();

          updateSeguimientoOffset();

        });

      });





    </script>



  </html>